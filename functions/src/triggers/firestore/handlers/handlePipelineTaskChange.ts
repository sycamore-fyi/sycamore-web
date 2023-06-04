import { PipelineTask, PipelineTaskResult, PipelineTaskType } from "@sycamore-fyi/shared";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { logger } from "firebase-functions/v2";
import { beam } from "../../../clients/beam/beam";
import { retrieveTaskStatus } from "../../../clients/beam/retrieveTaskOutput";
import * as path from "path";
import axios from "axios";
import { buffersFromZipContents } from "../../../zipFiles/buffersFromZipContents";
import { bucket } from "../../../clients/firebase/admin";
import { Collection } from "../../../clients/firebase/firestore/collection";

function getOutputName(pipelineTaskType: PipelineTaskType): string {
  switch (pipelineTaskType) {
    case PipelineTaskType.DIARIZATION: return "speakerSegments";
    case PipelineTaskType.TRANSCRIPTION: return "transcriptionResponse";
  }
}

export const handlePipelineTaskChange = wrapChangeHandler<PipelineTask>({
  async onUpdate(beforeData, afterData, id) {
    logger.info("pipeline task changed", beforeData);
    const becameResolved = !beforeData.isResolved && afterData.isResolved;

    if (!becameResolved) {
      logger.info("task didn't become resolved, nothing to do, returning");
      return;
    }

    const { taskId } = beforeData.beam;

    const taskResponseData = await retrieveTaskStatus(
      beam("api"),
      taskId,
      getOutputName(beforeData.type)
    );

    logger.info("retrieved task status from beam", taskResponseData);

    const pipelineTaskData = afterData;
    const { endedAt, outputs } = taskResponseData;
    const isSuccessful = !!endedAt && !!outputs;
    const pipelineTaskResult = isSuccessful ? PipelineTaskResult.SUCCESS : PipelineTaskResult.FAILURE;

    logger.info("updating task result", { pipelineTaskResult });

    await Collection.PipelineTask.doc(id).update({ result: pipelineTaskResult });

    if (!endedAt || !outputs) {
      logger.info("task isn't finished, returning");
      return;
    }

    logger.info("task is finished and has outputs");

    const {
      url: outputUrl,
      path: outputFileName,
      name: outputName,
    } = outputs[getOutputName(beforeData.type)];

    logger.info("got pipeline task and task output url, calling url", {
      outputUrl,
      outputFileName,
      outputName,
    });

    const zippedPath = path.join(outputName, outputFileName);

    const { data: zipArrayBuffer } = await axios.get<ArrayBuffer>(outputUrl, { responseType: "arraybuffer" });
    const fileBuffers = await buffersFromZipContents(Buffer.from(zipArrayBuffer));
    const outputBuffer: Buffer | undefined = fileBuffers[zippedPath];

    if (!outputBuffer) {
      logger.info("transcript response not found in zip, returing");
      return;
    }

    logger.info("retrieved output file successfully");

    const outputString = outputBuffer.toString("utf-8");

    const { organisationId, recordingId } = pipelineTaskData;
    const remoteFilePath = path.join(organisationId, recordingId, outputFileName);

    logger.info("saving output file to cloud storage", { remoteFilePath });

    await bucket.file(remoteFilePath).save(outputString);

    logger.info("save successful");
  },
});
