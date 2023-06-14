import { UserRecord } from "firebase-admin/auth";
import { Collection } from "../../../clients/firebase/firestore/collection";
import { wrapV1AuthFunctionHandler } from "../../wrapFunctionHandler";
import { auth } from "../../../clients/firebase/admin";

export const handleAuthUserCreated = wrapV1AuthFunctionHandler(async (user: UserRecord) => {
  const { uid, email, displayName, photoURL: photoUrl } = user;

  await Promise.all([
    auth.setCustomUserClaims(uid, {
      displayName,
    }),
    Collection.User.doc(uid).create({
      email,
      createdAt: new Date(),
      name: displayName,
      photoUrl,
    }),
  ]);
});
