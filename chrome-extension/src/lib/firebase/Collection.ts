import {
  collection, CollectionReference, QueryDocumentSnapshot, DocumentData,
  WithFieldValue, FirestoreDataConverter, SnapshotOptions, Timestamp
} from "firebase/firestore"
import { CollectionName, Membership, User } from "@sycamore-fyi/shared"
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
  [CollectionName.USER]: ref<User>(CollectionName.USER),
  [CollectionName.MEMBERSHIP]: ref<Membership>(CollectionName.MEMBERSHIP),
}
