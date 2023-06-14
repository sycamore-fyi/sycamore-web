import { DocumentData } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { HttpError } from "../../../triggers/http/utils/HttpError";


export async function fetchById<T extends DocumentData>(collectionRef: FirebaseFirestore.CollectionReference<T>, id: string) {
  const doc = await collectionRef.doc(id).get();
  const data = doc.data();

  if (!doc.exists || !data) {
    logger.info("document doesn't exist, throwing error", {
      collectionPath: collectionRef.path,
    });
    throw new HttpError(400, "document doesn't exist");
  }

  return data;
}
