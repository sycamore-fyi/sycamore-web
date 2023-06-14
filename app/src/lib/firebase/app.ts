import { initializeApp } from "firebase/app";
import { config } from "../config";
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { getEnvironment } from "../getEnvironment";
import { CollectionName, Environment } from "@sycamore-fyi/shared";

const app = initializeApp(config().FIREBASE_CONFIG);

const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)

console.log(CollectionName)

if (getEnvironment() === Environment.LOCAL) {
  connectAuthEmulator(auth, "http://localhost:9099")
  connectStorageEmulator(storage, "localhost", 9199)
  connectFirestoreEmulator(db, "localhost", 8080)
}

export { auth, storage, db }