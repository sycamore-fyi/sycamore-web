import { CollectionReference, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { db } from "../admin";
import { User, Organisation, Membership, Invite, Call, PipelineTask, CollectionName, DiarizedTranscriptSegment, OauthConnection, DataExtraction, SyncedData, OauthState, InstantMessage, InstantMessageChannel, InstantMessageChannelMembership } from "@sycamore-fyi/shared";

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

export const Collection = {
  [CollectionName.USER]: ref<User>(CollectionName.USER),
  [CollectionName.DIARIZED_TRANSCRIPT_SEGMENT]: ref<DiarizedTranscriptSegment>(CollectionName.DIARIZED_TRANSCRIPT_SEGMENT),
  [CollectionName.ORGANISATION]: ref<Organisation>(CollectionName.ORGANISATION),
  [CollectionName.MEMBERSHIP]: ref<Membership>(CollectionName.MEMBERSHIP),
  [CollectionName.INVITE]: ref<Invite>(CollectionName.INVITE),
  [CollectionName.CALL]: ref<Call>(CollectionName.CALL),
  [CollectionName.PIPELINE_TASK]: ref<PipelineTask>(CollectionName.PIPELINE_TASK),
  [CollectionName.OAUTH_CONNECTION]: ref<OauthConnection>(CollectionName.OAUTH_CONNECTION),
  [CollectionName.DATA_EXTRACTION]: ref<DataExtraction>(CollectionName.DATA_EXTRACTION),
  [CollectionName.SYNCED_DATA]: ref<SyncedData>(CollectionName.SYNCED_DATA),
  [CollectionName.INSTANT_MESSAGE]: ref<InstantMessage>(CollectionName.INSTANT_MESSAGE),
  [CollectionName.INSTANT_MESSAGE_CHANNEL]: ref<InstantMessageChannel>(CollectionName.INSTANT_MESSAGE_CHANNEL),
  [CollectionName.INSTANT_MESSAGE_CHANNEL_MEMBERSHIP]: ref<InstantMessageChannelMembership>(CollectionName.INSTANT_MESSAGE_CHANNEL_MEMBERSHIP),
  [CollectionName.OAUTH_STATE]: ref<OauthState>(CollectionName.OAUTH_STATE),
};
