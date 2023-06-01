import { DocumentData, DocumentSnapshot as AdminDocumentSnapshot } from "firebase-admin/firestore";
import { ParamsOf } from "firebase-functions/v2";
import { Change, DocumentSnapshot, FirestoreEvent } from "firebase-functions/v2/firestore";
import { wrapFunctionHandler } from "../../wrapFunctionHandler";

interface Callbacks<T> {
  onCreate?(afterData: T, id: string): void | Promise<void>,
  onUpdate?(beforeData: T, afterData: T, id: string): void | Promise<void>,
  onDelete?(beforeData: T, id: string): void | Promise<void>,
}

export enum WriteType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export const wrapChangeHandler = <T extends DocumentData, Document extends string = string>(callbacks: Callbacks<T>) => wrapFunctionHandler(async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, ParamsOf<Document>>) => {
  const change = event.data as Change<AdminDocumentSnapshot<T>>;
  if (!change) return;

  const { before, after } = change;
  const beforeData = before.data();
  const afterData = after.data();

  const beforePresent = before.exists && !!beforeData;
  const afterPresent = after.exists && !!afterData;
  const id = before.id ?? after.id;

  if (!beforePresent && afterPresent) return callbacks.onCreate?.(afterData, id);
  if (beforePresent && afterPresent) return callbacks.onUpdate?.(beforeData, afterData, id);
  if (beforePresent && !afterPresent) return callbacks.onDelete?.(beforeData, id);

  return;
});
