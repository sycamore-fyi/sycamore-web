import { CollectionReference, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { db } from "../admin";
import { User } from "../../../models/User";
import { Organisation } from "../../../models/Organisation";
import { Membership } from "../../../models/Membership";
import { Invite } from "../../../models/Invite";
import { Recording } from "../../../models/Recording";
import { PipelineTask } from "../../../models/PipelineTask";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const converter = <T extends { [key: string]: any }>(): FirestoreDataConverter<T> => ({
  toFirestore(data: T): DocumentData {
    return data;
  },

  fromFirestore(snapshot: QueryDocumentSnapshot<T>) {
    const data = snapshot.data();

    return Object.entries(data).reduce<Partial<T>>((d, [key, value]) => ({
      ...d,
      [key]: value instanceof Timestamp ? value.toDate() : value,
    }), {}) as T;
  },
});

function ref<T>(collectionName: CollectionName) {
  return db.collection(collectionName).withConverter(converter()) as CollectionReference<T>;
}

export enum CollectionName {
  USER = "User",
  ORGANISATION = "Organisation",
  MEMBERSHIP = "Membership",
  INVITE = "Invite",
  RECORDING = "Recording",
  PIPELINE_TASK = "PipelineTask"
}

export const Collection = {
  [CollectionName.USER]: ref<User>(CollectionName.USER),
  [CollectionName.ORGANISATION]: ref<Organisation>(CollectionName.ORGANISATION),
  [CollectionName.MEMBERSHIP]: ref<Membership>(CollectionName.MEMBERSHIP),
  [CollectionName.INVITE]: ref<Invite>(CollectionName.INVITE),
  [CollectionName.RECORDING]: ref<Recording>(CollectionName.RECORDING),
  [CollectionName.PIPELINE_TASK]: ref<PipelineTask>(CollectionName.PIPELINE_TASK),
};
