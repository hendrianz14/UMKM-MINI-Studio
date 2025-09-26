import { getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export function getClientApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getApps()[0]!;
}

export function getClientAuth() {
  const app = getClientApp();
  const auth = getAuth(app);
  void setPersistence(auth, browserLocalPersistence);
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  }
  return auth;
}

export function getClientFirestore() {
  const db = getFirestore(getClientApp());
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
    connectFirestoreEmulator(db, "localhost", 8080);
  }
  return db;
}

export function getClientStorage() {
  const storage = getStorage(getClientApp());
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
    connectStorageEmulator(storage, "localhost", 9199);
  }
  return storage;
}
