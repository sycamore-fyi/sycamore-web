import {
  Query, FieldPath, DocumentSnapshot,
} from "firebase-admin/firestore";
import { chunkArray } from "../../../utils/chunkArray";

export async function fetchByArray<T>(
  query: Query<T>,
  fieldPath: string | FieldPath,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any[],
  isPositive = true
): Promise<DocumentSnapshot<T>[]> {
  const op = isPositive ? "in" : "not-in";
  const chunks = chunkArray(values, 10);
  const promises = chunks.map((chunk) => query.where(fieldPath, op, chunk).get());
  const snapshots = await Promise.all(promises);

  return snapshots.map((s) => s.docs).flat();
}
