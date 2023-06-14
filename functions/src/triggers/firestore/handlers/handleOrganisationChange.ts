import { Collection } from "../../../clients/firebase/firestore/collection";
import { deleteAll } from "../../../clients/firebase/firestore/writeBatch";
import { Organisation } from "@sycamore-fyi/shared";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { updateByQuery } from "../utils/updateByQuery";

export const handleOrganisationChange = wrapChangeHandler<Organisation>({
  async onUpdate(beforeData, afterData, id) {
    if (beforeData.name === afterData.name) return;

    await updateByQuery(Collection.Membership.where("organisationId", "==", id), {
      organisationName: afterData.name,
    });
  },
  async onDelete(_, id) {
    const queries = [
      Collection.Invite,
      Collection.DiarizedTranscriptSegment,
      Collection.Membership,
      Collection.PipelineTask,
      Collection.Recording,
    ].map((c) => c.where("organisationId", "==", id));

    await deleteAll(queries);
  },
});
