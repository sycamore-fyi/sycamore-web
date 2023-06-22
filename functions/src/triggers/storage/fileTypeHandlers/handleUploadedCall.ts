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
import { PipelineTaskModel, PipelineTaskProvider, PipelineTaskResult, PipelineTaskType, Environment, calculateCurrentMonthStartDate, Call, STANDARD_PLAN_TRANSCRIPTION_HOUR_LIMIT } from "@sycamore-fyi/shared";
import { requestWebhookTrigger } from "../../../clients/beam/requestWebhookTrigger";
import { BeamAppId } from "../../../clients/beam/BeamAppId";
import { beam } from "../../../clients/beam/beam";
import { getEnvironment } from "../../../clients/firebase/Environment";
import axios from "axios";
import { config } from "../../../config";

function calculateCallHours(organisationCreatedAt: Date, userId: string, calls: Call[]) {
  const startOfMonth = calculateCurrentMonthStartDate(organisationCreatedAt);
  const userCallsInMonth = calls.filter((call) => call.userId === userId && call.createdAt > startOfMonth);
  return userCallsInMonth.reduce((count, call) => count + (call.durationMs ?? 0) / (1000 * 60 * 60), 0);
}

async function startPipelineTasks(remoteMp3FilePath: string, organisationId: string, callId: string) {
  logger.info("starting pipeline tasks", {
    callId,
    organisationId,
  });

  let diarizationTaskId: string;
  let transcriptionTaskId: string;

  const isProd = getEnvironment() === Environment.PROD;

  if (isProd) {
    logger.info("environment is prod, requesting beam webhooks");
    const beamClient = beam("apps");
    [diarizationTaskId, transcriptionTaskId] = await Promise.all([
      requestWebhookTrigger(beamClient, BeamAppId.DIARIZATION, remoteMp3FilePath),
      requestWebhookTrigger(beamClient, BeamAppId.TRANSCRIPTION, remoteMp3FilePath),
    ]);

    logger.info("webhooks sent");
  } else {
    diarizationTaskId = "a6fc61b5-4798-4af5-b2fe-e2e6172787b6";
    transcriptionTaskId = "0219e883-81a1-4c65-bdbf-bf6becec751a";
  }

  logger.info("creating pipeline tasks", {
    diarizationTaskId,
    transcriptionTaskId,
  });

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

  logger.info("pipeline tasks created");

  if (!isProd) {
    logger.info("environment is not prod, calling beam webhook manually");
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

export const handleUploadedCall = async (event: StorageEvent, filePath: string) => {
  logger.info("handling uploaded call", { filePath });

  const userId = event.data.metadata?.userId;

  if (!userId) throw new Error("userId not contained in upload metadata");

  const { organisationId, callId } = parseFilePath(filePath);

  // if user is past their transcription hours, delete the object and abort
  const [
    organisation,
    { docs: calls },
  ] = await Promise.all([
    Collection.Organisation.doc(organisationId).get(),
    Collection.Call.where("organisationId", "==", organisationId).where("userId", "==", userId).get(),
    Collection.Call.doc(callId).create({
      organisationId,
      userId,
      isDiarized: false,
      isProcessed: false,
      isRejected: false,
      isSummarised: false,
      isTranscribed: false,
      wereDiarizedSegmentsCreated: false,
      createdAt: new Date(),
    }),
  ]);

  async function rejectRecording(rejectionReason: string) {
    await Promise.all([
      bucket.file(filePath).delete(),
      Collection.Call.doc(callId).update({
        rejectionReason,
        isRejected: true,
      }),
    ]);
  }

  const organisationData = organisation.data();
  if (!organisationData) {
    await rejectRecording("Invalid organisation");
    return;
  }

  const startOfMonth = calculateCurrentMonthStartDate(organisationData.createdAt);
  const callsInMonth = calls.map((call) => call.data()).filter((call) => call?.createdAt > startOfMonth);
  const callHours = calculateCallHours(startOfMonth, userId, callsInMonth);

  if (callHours > STANDARD_PLAN_TRANSCRIPTION_HOUR_LIMIT) {
    logger.info("user above call limit, returing", {
      userId,
      organisationId,
      callHours,
      startOfMonth,
    });

    await rejectRecording("You've used up your recording hours.");
    return;
  }

  await downloadToTempDirectory({ filePath }, async (localUploadFilePath: string) => {
    logger.info("converting file to mp3 into temp directory", {
      localUploadFilePath,
    });

    const isUploadedFileMp3 = event.data.contentType === "audio/mpeg";
    const localMp3FilePath = isUploadedFileMp3 ? localUploadFilePath : await convertToMp3(localUploadFilePath);
    const durationMs = await audioDurationMs(localMp3FilePath);
    const durationHours = durationMs / (1000 * 60 * 60);

    if ((callHours + durationHours) > STANDARD_PLAN_TRANSCRIPTION_HOUR_LIMIT) {
      logger.info("user above call limit, returing", {
        userId,
        organisationId,
        callHours,
        startOfMonth,
      });

      await rejectRecording("You've used up your recording hours");
      return;
    }

    const destinationPath = path.join(
      path.dirname(filePath),
      fileNameFromExpectedFileType(FileType.PROCESSED_CALL)
    );

    logger.info("converted file, uploading to Cloud Storage", {
      destinationPath,
    });

    await Promise.all([
      bucket.upload(
        localMp3FilePath,
        {
          destination: destinationPath,
          metadata: {
            cacheControl: "public,max-age=3600000",
          },
        }
      ),
      Collection.Call.doc(callId).update({
        isProcessed: true,
        filePath: destinationPath,
        durationMs,
      }),
    ]);

    logger.info("upload successful");

    await Promise.all([
      startPipelineTasks(destinationPath, organisationId, callId),
      bucket.file(filePath).delete(),
    ]);

    logger.info("updated db, started pipeline tasks, deleted uploaded file");
  });
};

