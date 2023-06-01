import { UserRecord } from "firebase-admin/auth";
import { Collection } from "../../../clients/firebase/firestore/collection";
import { deleteAll } from "../../../clients/firebase/firestore/writeBatch";
import { wrapV1AuthFunctionHandler } from "../../wrapFunctionHandler";

export const handleAuthUserDeleted = wrapV1AuthFunctionHandler(async (user: UserRecord) => {
  const { uid } = user;

  await Promise.all([
    deleteAll([
      Collection.Membership.where("userId", "==", uid),
      Collection.Invite.where("invitingUserId", "==", uid),
    ]),
    Collection.User.doc(uid).delete(),
  ]);
});
