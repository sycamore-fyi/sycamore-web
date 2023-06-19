import { Query } from "firebase-admin/firestore";

export async function fetchOne<T>(query: Query<T>) {
  const snapshot = await query.limit(0).get();
  return snapshot.docs?.[0];
}
