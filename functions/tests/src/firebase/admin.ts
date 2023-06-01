import { initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import * as admin from "firebase-admin"
import * as path from "path"

const serviceAccountPath = path.join(__dirname, "firebase_service_account_staging.json")

process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199"
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"

const app = initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: "sycamore-staging",
  storageBucket: "sycamore-staging.appspot.com",
})

const db = getFirestore(app)
db.settings({ ignoreUndefinedProperties: true })

const auth = getAuth(app)
const storage = getStorage(app)
const bucket = storage.bucket()

export { storage, bucket, auth, db }
