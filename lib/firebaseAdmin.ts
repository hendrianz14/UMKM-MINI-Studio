import "server-only";

import { App, AppOptions, applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let adminApp: App | undefined;

function buildAppOptions(): AppOptions {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  const options: AppOptions = {
    projectId,
    storageBucket
  };

  if (process.env.FIREBASE_ADMIN_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON) as {
      project_id?: string;
      client_email: string;
      private_key: string;
    };

    options.credential = cert({
      projectId: serviceAccount.project_id ?? projectId,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    });

    if (!options.projectId && serviceAccount.project_id) {
      options.projectId = serviceAccount.project_id;
    }
  } else {
    options.credential = applicationDefault();
  }

  return options;
}

export function getAdminApp(): App {
  if (adminApp) return adminApp;

  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  adminApp = initializeApp(buildAppOptions());
  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
