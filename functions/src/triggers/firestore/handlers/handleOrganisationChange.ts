import { Collection } from "../../../clients/firebase/firestore/collection";
import { deleteAll } from "../../../clients/firebase/firestore/writeBatch";
import { Organisation } from "../../../models/Organisation";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";

export const handleOrganisationChange = wrapChangeHandler<Organisation>({
  async onDelete(_, id) {
    await deleteAll([
      Collection.Invite.where("organisationId", "==", id),
      Collection.Membership.where("organisationId", "==", id),
    ]);
  },
});
