import { db } from "../admin";
import { DocumentReference, Query } from "firebase-admin/firestore";
import { chunkArray } from "../../../utils/chunkArray";

export enum BatchOperation {
  create = "create",
  update = "update",
  delete = "delete",
  set = "set",
}

export function createBatchDatum<T>(
  ref: DocumentReference<T>,
  data: T
) {
  return { operation: BatchOperation.create, ref, data };
}

export function updateBatchDatum<T>(
  ref: DocumentReference<T>,
  data: Partial<T>
) {
  return { operation: BatchOperation.update, ref, data };
}

export function deleteBatchDatum(ref: DocumentReference) {
  return { operation: BatchOperation.delete, ref };
}

export async function writeBatch(batchData: {
  operation: BatchOperation,
  ref: DocumentReference,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}[]) {
  if (batchData.length === 0) return;

  const chunks = chunkArray(batchData, 500);

  await Promise.all(chunks.map(async (chunk) => {
    const batch = db.batch();

    chunk.forEach((datum) => {
      const { operation, ref, data } = datum;

      // eslint-disable-next-line default-case
      switch (operation) {
        case BatchOperation.create:
          batch.create(ref, data);
          break;
        case BatchOperation.update:
          batch.update(ref, data);
          break;
        case BatchOperation.delete:
          batch.delete(ref);
          break;
        case BatchOperation.set:
          batch.set(ref, data);
          break;
      }
    });

    await batch.commit();
  }));
}

export async function deleteAll(queries: Query[]) {
  const snaps = await Promise.all(queries.map((q) => q.get()));
  await writeBatch(snaps.flatMap((s) => s.docs.map((d) => deleteBatchDatum(d.ref))));
}
