import { StorageEvent } from "firebase-functions/v2/storage";
import { bucket } from "../../../clients/firebase/admin";
import * as path from "path";
import { logger } from "firebase-functions/v2";
import { downloadToDisk as downloadToTempDirectory } from "../../../clients/firebase/storage/downloadToDisk";
import { fileNameFromExpectedFileType } from "../fileTypes/expectedFileData";
import { FileType } from "../fileTypes/FileType";
import { convertToMp3 } from "../../../clients/ffmpeg/convertToMp3";
import { parseFilePath } from "../parseFilePath";
import { Collection } from "../../../clients/firebase/firestore/collection";
import { audioDurationMs } from "../../../clients/ffmpeg/audioDurationMs";
import { createBatchDatum, writeBatch } from "../../../clients/firebase/firestore/writeBatch";
import { PipelineTaskModel, PipelineTaskProvider, PipelineTaskResult, PipelineTaskType } from "../../../models/PipelineTask";
import { requestWebhookTrigger } from "../../../clients/beam/requestWebhookTrigger";
import { BeamAppId } from "../../../clients/beam/BeamAppId";
import { beam } from "../../../clients/beam/beam";
import { Environment, getEnvironment } from "../../../clients/firebase/Environment";

async function startPipelineTasks(remoteMp3FilePath: string, organisationId: string, recordingId: string) {
  let diarizationTaskId: string;
  let transcriptionTaskId: string;

  if (getEnvironment() === Environment.PROD) {
    const beamClient = beam("api");
    [diarizationTaskId, transcriptionTaskId] = await Promise.all([
      requestWebhookTrigger(beamClient, BeamAppId.DIARIZATION, remoteMp3FilePath),
      requestWebhookTrigger(beamClient, BeamAppId.TRANSCRIPTION, remoteMp3FilePath),
    ]);
  } else {
    diarizationTaskId = "a6fc61b5-4798-4af5-b2fe-e2e6172787b6";
    transcriptionTaskId = "0219e883-81a1-4c65-bdbf-bf6becec751a";
  }


  const basePipelineTaskData = {
    createdAt: new Date(),
    organisationId,
    recordingId,
    provider: PipelineTaskProvider.BEAM,
    isResolved: false,
    result: PipelineTaskResult.PENDING,
  };

  await writeBatch([
    createBatchDatum(Collection.PipelineTask.doc(), {
      ...basePipelineTaskData,
      model: PipelineTaskModel.PYANNOTE_AUDIO_2_1,
      type: PipelineTaskType.DIARIZATION,
      beam: {
        taskId: diarizationTaskId,
      },
    }),
    createBatchDatum(Collection.PipelineTask.doc(), {
      ...basePipelineTaskData,
      model: PipelineTaskModel.WHISPER_1,
      type: PipelineTaskType.TRANSCRIPTION,
      beam: {
        taskId: transcriptionTaskId,
      },
    }),
  ]);
}

async function updateDatabaseRecordingObject(localMp3FilePath: string, recordingId: string, processedFilePath: string) {
  const durationMs = await audioDurationMs(localMp3FilePath);

  await Collection.Recording.doc(recordingId).update({
    durationMs,
    processedFilePath,
    processedAt: new Date(),
  });
}

export const handleUploadedRecording = async (event: StorageEvent, filePath: string) => {
  logger.info("handling uploaded recording", { filePath });

  const { organisationId, recordingId } = parseFilePath(filePath);

  await Promise.all([
    Collection.Recording.doc(recordingId).create({
      organisationId,
      userId: "abc",
      createdAt: new Date(),
      uploadedFilePath: filePath,
    }),
    downloadToTempDirectory({ filePath }, async (localUploadFilePath: string) => {
      logger.info("converting file to mp3 into temp directory", {
        localUploadFilePath,
      });

      const isUploadedFileMp3 = event.data.contentType === "audio/mpeg";
      const localMp3FilePath = isUploadedFileMp3 ? localUploadFilePath : await convertToMp3(localUploadFilePath);

      const destinationPath = path.join(
        path.dirname(filePath),
        fileNameFromExpectedFileType(FileType.PROCESSED_RECORDING)
      );

      logger.info("converted file, uploading to Cloud Storage", {
        destinationPath,
      });

      await bucket.upload(localMp3FilePath, { destination: destinationPath });

      logger.info("upload successful");

      await Promise.all([
        updateDatabaseRecordingObject(localMp3FilePath, recordingId, destinationPath),
        startPipelineTasks(destinationPath, organisationId, recordingId),
      ]);
    }),
  ]);
};

