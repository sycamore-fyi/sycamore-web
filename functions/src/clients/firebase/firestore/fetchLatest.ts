import { Query } from "firebase-admin/firestore";
import { fetchOne } from "./fetchOne";

export async function fetchLatest<T>(query: Query<T>) {
  return fetchOne(query.orderBy("createdAt", "desc"));
}
