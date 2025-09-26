import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const fallbackFirebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "localhost",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  appId: "demo-app-id"
} satisfies FirebaseOptions;

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? fallbackFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? fallbackFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? fallbackFirebaseConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? fallbackFirebaseConfig.storageBucket,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? fallbackFirebaseConfig.appId
};

if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn("Using fallback Firebase configuration. Provide NEXT_PUBLIC_FIREBASE_* env vars for full functionality.");
}

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
