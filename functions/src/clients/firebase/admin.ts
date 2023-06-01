import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

initializeApp();

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const auth = getAuth();
const storage = getStorage();
const bucket = storage.bucket();

export { storage, bucket, auth, db };
