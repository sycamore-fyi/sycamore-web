import { Collection } from "../../../clients/firebase/firestore/collection";
import { Membership } from "../../../models/Membership";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";

export const handleMembershipChange = wrapChangeHandler<Membership>({
  async onDelete(membershipData) {
    const { organisationId } = membershipData;
    const membershipSnap = await Collection.Membership.where("organisationId", "==", organisationId).get();

    if (membershipSnap.docs.length === 0) {
      await Collection.Organisation.doc(organisationId).delete();
    }
  },
});
