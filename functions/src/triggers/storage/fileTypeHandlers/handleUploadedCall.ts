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
import { PipelineTaskModel, PipelineTaskProvider, PipelineTaskResult, PipelineTaskType, Environment } from "@sycamore-fyi/shared";
import { requestWebhookTrigger } from "../../../clients/beam/requestWebhookTrigger";
import { BeamAppId } from "../../../clients/beam/BeamAppId";
import { beam } from "../../../clients/beam/beam";
import { getEnvironment } from "../../../clients/firebase/Environment";
import axios from "axios";
import { config } from "../../../config";

async function startPipelineTasks(remoteMp3FilePath: string, organisationId: string, callId: string) {
  let diarizationTaskId: string;
  let transcriptionTaskId: string;

  const isProd = getEnvironment() === Environment.PROD;

  if (isProd) {
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
    callId,
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

  if (!isProd) {
    const callWebhook = async (taskId: string) => axios.post(`${config().SERVER_URL}/webhooks/beam`, {}, {
      headers: {
        "beam-task-id": taskId,
      },
    });

    await Promise.all([
      callWebhook(diarizationTaskId),
      callWebhook(transcriptionTaskId),
    ]);
  }
}

async function updateDatabaseCallObject(localMp3FilePath: string, callId: string, processedFilePath: string) {
  const durationMs = await audioDurationMs(localMp3FilePath);

  await Collection.Call.doc(callId).update({
    durationMs,
    processedFilePath,
    processedAt: new Date(),
  });
}

export const handleUploadedCall = async (event: StorageEvent, filePath: string) => {
  logger.info("handling uploaded call", { filePath });

  const userId = event.data.metadata?.userId;

  if (!userId) {
    throw new Error("userId not contained in upload metadata");
  }

  const { organisationId, callId } = parseFilePath(filePath);

  await Promise.all([
    Collection.Call.doc(callId).create({
      organisationId,
      userId,
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
        fileNameFromExpectedFileType(FileType.PROCESSED_CALL)
      );

      logger.info("converted file, uploading to Cloud Storage", {
        destinationPath,
      });

      await bucket.upload(localMp3FilePath, { destination: destinationPath });

      logger.info("upload successful");

      await Promise.all([
        updateDatabaseCallObject(localMp3FilePath, callId, destinationPath),
        startPipelineTasks(destinationPath, organisationId, callId),
        bucket.file(filePath).delete(),
      ]);
    }),
  ]);
};

