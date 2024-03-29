import {
  collection, CollectionReference, QueryDocumentSnapshot, DocumentData,
  WithFieldValue, FirestoreDataConverter, SnapshotOptions, Timestamp
} from "firebase/firestore"
import {
  CollectionName, DiarizedTranscriptSegment, Invite, Membership, Organisation, Call, SpeakerAlias, User, OauthConnection, ParaphrasedSpeakerTurn, CallSummary
} from "@sycamore-fyi/shared"
import { db } from "./app"

const converter = <T extends { [key: string]: any }>(): FirestoreDataConverter<T> => ({
  toFirestore(data: WithFieldValue<T>): DocumentData {
    return data
  },

  fromFirestore(snapshot: QueryDocumentSnapshot<T>, options: SnapshotOptions) {
    const data = snapshot.data(options)

    return Object.entries(data).reduce<Partial<T>>((d, [key, value]) => ({
      ...d,
      [key]: value instanceof Timestamp ? value.toDate() : value
    }), {}) as T
  }
})

function ref<T>(collectionName: CollectionName) {
  return collection(db, collectionName).withConverter(converter()) as CollectionReference<T>
}

export const Collection = {
  [CollectionName.DIARIZED_TRANSCRIPT_SEGMENT]: ref<DiarizedTranscriptSegment>(CollectionName.DIARIZED_TRANSCRIPT_SEGMENT),
  [CollectionName.USER]: ref<User>(CollectionName.USER),
  [CollectionName.ORGANISATION]: ref<Organisation>(CollectionName.ORGANISATION),
  [CollectionName.MEMBERSHIP]: ref<Membership>(CollectionName.MEMBERSHIP),
  [CollectionName.INVITE]: ref<Invite>(CollectionName.INVITE),
  [CollectionName.CALL]: ref<Call>(CollectionName.CALL),
  [CollectionName.CALL_SUMMARY]: ref<CallSummary>(CollectionName.CALL_SUMMARY),
  [CollectionName.PARAPHRASED_SPEAKER_TURN]: ref<ParaphrasedSpeakerTurn>(CollectionName.PARAPHRASED_SPEAKER_TURN),
  [CollectionName.SPEAKER_ALIAS]: ref<SpeakerAlias>(CollectionName.SPEAKER_ALIAS),
  [CollectionName.OAUTH_CONNECTION]: ref<OauthConnection>(CollectionName.OAUTH_CONNECTION)
}
