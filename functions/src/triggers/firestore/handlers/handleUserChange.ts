import { Collection } from "../../../clients/firebase/firestore/collection";
import { User } from "@sycamore-fyi/shared";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { updateByQuery } from "../utils/updateByQuery";
import { deleteAll } from "../../../clients/firebase/firestore/writeBatch";
import { auth } from "../../../clients/firebase/admin";

export const handleUserChange = wrapChangeHandler<User>({
  async onUpdate(beforeData, afterData, id) {
    if (beforeData.name === afterData.name && beforeData.photoUrl === afterData.photoUrl) return;

    const { name, photoUrl } = afterData;

    await Promise.all([
      updateByQuery(Collection.Membership.where("userId", "==", id), {
        userName: name,
        userPhotoUrl: photoUrl,
      }),
      auth.setCustomUserClaims(id, {
        displayName: name,
      }),
      auth.updateUser(id, {
        displayName: name,
        photoURL: photoUrl,
      }),
    ]);
  },
  async onDelete(beforeData, id) {
    await Promise.all([
      deleteAll([
        Collection.Membership.where("userId", "==", id),
      ]),
      auth.deleteUser(id),
    ]);
  },
});
