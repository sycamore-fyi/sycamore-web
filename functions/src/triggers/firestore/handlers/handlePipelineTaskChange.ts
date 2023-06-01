import { PipelineTask } from "../../../models/PipelineTask";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { logger } from "firebase-functions/v2";
import { beam } from "../../../clients/beam/beam";
import { retrieveTaskStatus } from "../../../clients/beam/retrieveTaskOutput";
import * as path from "path";
import axios from "axios";
import { buffersFromZipContents } from "../../../zipFiles/buffersFromZipContents";
import { bucket } from "../../../clients/firebase/admin";

export const handlePipelineTaskChange = wrapChangeHandler<PipelineTask>({
  async onUpdate(beforeData, afterData) {
    const becameResolved = !beforeData.isResolved && afterData.isResolved;
    if (!becameResolved) return;

    const { taskId } = beforeData.beam;

    const taskResponseData = await retrieveTaskStatus(
      beam("api"),
      taskId,
      "transcriptionResponse"
    );

    const pipelineTaskData = afterData;
    const { endedAt, outputs } = taskResponseData;

    if (!endedAt || !outputs) {
      logger.info("task isn't finished, returning");
      return;
    }

    const {
      url: outputUrl,
      path: outputFileName,
      name: outputName,
    } = outputs.transcriptionResponse;

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

    logger.info("saving output file to cloud storage", {
      remoteFilePath,
    });

    await bucket.file(remoteFilePath).save(outputString);

    logger.info("save successful");
  },
});
