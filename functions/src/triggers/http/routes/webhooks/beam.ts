import { logger } from "firebase-functions/v2";
import { clientError, ok } from "../../utils/httpResponses";
import { wrapEndpoint } from "../../utils/wrapEndpoint";
import { fetchOne } from "../../../../clients/firebase/firestore/fetchOne";
import { Collection } from "../../../../clients/firebase/firestore/collection";

export const post = wrapEndpoint({}, false)(async (req, res) => {
  const beamTaskId = req.headers["beam-task-id"];

  if (!beamTaskId || Array.isArray(beamTaskId)) {
    logger.info("no beam task id present in headers, or is of array format", { beamTaskId });
    return clientError(res);
  }

  const pipelineTask = await fetchOne(Collection.PipelineTask.where("beam.taskId", "==", beamTaskId));

  if (!pipelineTask.exists) {
    logger.error("pipeline task doesn't exist for beam task id", { beamTaskId });
    return ok(res);
  }

  logger.info("marking pipeline task as resolved", {
    beamTaskId,
    pipelineTaskId: pipelineTask.id,
  });

  await pipelineTask.ref.update({ isResolved: true, resolvedAt: new Date() });

  logger.info("updated pipeline task as resolved");

  return ok(res);
});
