import { Collection } from "../../../clients/firebase/firestore/collection";
import { User } from "@sycamore-fyi/shared";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { updateByQuery } from "../utils/updateByQuery";
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
      auth.updateUser(id, {
        displayName: name,
        photoURL: photoUrl,
      }),
    ]);
  },
});
