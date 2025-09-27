"use client";

import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  setPersistence
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const FALLBACK_CONFIG: FirebaseOptions = {
  apiKey: "AIzaFakeKeyForLocalDevOnly0000000000",
  authDomain: "localhost",
  projectId: "umkm-mini-studio-demo",
  storageBucket: "umkm-mini-studio-demo.appspot.com",
  appId: "1:000000000000:web:localdevfallback"
};

type GlobalWithFirebaseWarning = typeof globalThis & {
  __umkmFirebaseConfigWarned__?: boolean;
};

function resolveFirebaseConfig(): FirebaseOptions {
  const configEntries = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  } as const;

  const missingKeys = Object.entries(configEntries)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    const globalWithWarning = globalThis as GlobalWithFirebaseWarning;
    if (!globalWithWarning.__umkmFirebaseConfigWarned__) {
      console.warn(
        `Firebase client configuration missing environment variables: ${missingKeys.join(", ")}. Using fallback config for UI-only mode.`
      );
      globalWithWarning.__umkmFirebaseConfigWarned__ = true;
    }
    return FALLBACK_CONFIG;
  }

  return {
    apiKey: configEntries.apiKey!,
    authDomain: configEntries.authDomain!,
    projectId: configEntries.projectId!,
    storageBucket: configEntries.storageBucket!,
    appId: configEntries.appId!
  } satisfies FirebaseOptions;
}

const firebaseConfig = resolveFirebaseConfig();

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (typeof window !== "undefined") {
  void setPersistence(auth, browserLocalPersistence);

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
  }
}

export function onClientAuthStateChanged(callback: Parameters<typeof onAuthStateChanged>[1]) {
  return onAuthStateChanged(auth, callback);
}

export { app };
