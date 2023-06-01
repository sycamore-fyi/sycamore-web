import { Query } from "firebase-admin/firestore";

export async function fetchOne<T>(query: Query<T>) {
  const snapshot = await query.get();
  return snapshot.docs?.[0];
}
