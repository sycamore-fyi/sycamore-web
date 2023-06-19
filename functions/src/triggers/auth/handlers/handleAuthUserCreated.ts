import { UserRecord } from "firebase-admin/auth";
import { Collection } from "../../../clients/firebase/firestore/collection";
import { wrapV1AuthFunctionHandler } from "../../wrapFunctionHandler";

export const handleAuthUserCreated = wrapV1AuthFunctionHandler(async (user: UserRecord) => {
  const { uid, email, displayName, photoURL: photoUrl } = user;

  await Promise.all([
    Collection.User.doc(uid).create({
      email,
      createdAt: new Date(),
      name: displayName,
      photoUrl,
    }),
  ]);
});
