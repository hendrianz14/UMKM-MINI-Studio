import { request, type FullConfig } from "@playwright/test";
import { promises as fs } from "node:fs";
import path from "node:path";

const STORAGE_STATE_PATH = path.resolve(__dirname, "../storageState.json");
const EMPTY_STORAGE_STATE = {
  cookies: [],
  origins: []
};

function hasEnv(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

async function writeEmptyStorageState() {
  await fs.writeFile(
    STORAGE_STATE_PATH,
    JSON.stringify(EMPTY_STORAGE_STATE, null, 2),
    "utf-8"
  );
}

export default async function globalSetup(config: FullConfig) {
  const email = process.env.CODEGEN_EMAIL;
  const password = process.env.CODEGEN_PASSWORD;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!hasEnv(email) || !hasEnv(password) || !hasEnv(apiKey)) {
    process.env.PLAYWRIGHT_AUTH_AVAILABLE = "false";
    await writeEmptyStorageState();
    console.warn(
      "[global-setup] Firebase credentials not fully configured. Authenticated tests will be skipped."
    );
    return;
  }

  const baseURLFromConfig = config.projects[0]?.use?.baseURL;
  const appUrl = process.env.APP_URL ?? (typeof baseURLFromConfig === "string" ? baseURLFromConfig : "http://127.0.0.1:3000");

  const requestContext = await request.newContext();

  try {
    const signInResponse = await requestContext.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        data: {
          email,
          password,
          returnSecureToken: true
        }
      }
    );

    if (!signInResponse.ok()) {
      throw new Error(`Failed to sign in: ${signInResponse.status()} ${signInResponse.statusText()}`);
    }

    const signInJson = (await signInResponse.json()) as { idToken?: string };
    const idToken = signInJson.idToken;

    if (!idToken) {
      throw new Error("signInWithPassword response does not contain idToken");
    }

    const appOrigin = new URL(appUrl).origin;
    const sessionResponse = await requestContext.post(`${appOrigin}/api/auth/session-login`, {
      headers: {
        "Content-Type": "application/json"
      },
      data: { idToken }
    });

    if (!sessionResponse.ok()) {
      throw new Error(`Failed to create session cookie: ${sessionResponse.status()} ${sessionResponse.statusText()}`);
    }

    const storageState = await requestContext.storageState();
    await fs.writeFile(STORAGE_STATE_PATH, JSON.stringify(storageState, null, 2), "utf-8");
    process.env.PLAYWRIGHT_AUTH_AVAILABLE = "true";
  } catch (error) {
    process.env.PLAYWRIGHT_AUTH_AVAILABLE = "false";
    await writeEmptyStorageState();
    console.warn("[global-setup] Falling back to unauthenticated state:", error);
  } finally {
    await requestContext.dispose();
  }
}
