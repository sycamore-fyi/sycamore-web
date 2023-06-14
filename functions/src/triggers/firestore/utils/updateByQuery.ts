import { DocumentData, DocumentSnapshot, Query } from "firebase-admin/firestore";
import { updateBatchDatum, writeBatch } from "../../../clients/firebase/firestore/writeBatch";

export async function updateByQuery<T extends DocumentData>(
  query: Query<T>,
  update: ((doc: DocumentSnapshot<T>) => Partial<T>) | Partial<T>
) {
  const { docs } = await query.get();

  await writeBatch(
    docs.map((doc) => updateBatchDatum(
      doc.ref,
      typeof update === "function" ? update(doc) : update
    ))
  );
}
