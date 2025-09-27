import { chromium, type FullConfig } from "@playwright/test";

function ensureEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export default async function globalSetup(config: FullConfig) {
  const email = ensureEnv("CODEGEN_EMAIL", process.env.CODEGEN_EMAIL);
  const password = ensureEnv("CODEGEN_PASSWORD", process.env.CODEGEN_PASSWORD);
  const apiKey = ensureEnv("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const appUrl = process.env.APP_URL ?? (config.projects[0]?.use?.baseURL as string | undefined) ?? "http://localhost:3000";

  const signInResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    }
  );

  if (!signInResponse.ok) {
    throw new Error(`Failed to sign in: ${signInResponse.status} ${signInResponse.statusText}`);
  }

  const signInJson = (await signInResponse.json()) as { idToken?: string };
  const idToken = signInJson.idToken;
  if (!idToken) {
    throw new Error("signInWithPassword response does not contain idToken");
  }

  const sessionResponse = await fetch(`${appUrl}/api/auth/session-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idToken })
  });

  if (!sessionResponse.ok) {
    throw new Error(`Failed to create session cookie: ${sessionResponse.status} ${sessionResponse.statusText}`);
  }

  const rawSetCookie = sessionResponse.headers.get("set-cookie");
  if (!rawSetCookie) {
    throw new Error("Session login response missing Set-Cookie header");
  }

  const [cookieDefinition] = rawSetCookie.split(",");
  const [nameValue] = cookieDefinition.split(";");
  const separatorIndex = nameValue.indexOf("=");
  const cookieName = nameValue.slice(0, separatorIndex);
  const cookieValue = nameValue.slice(separatorIndex + 1);

  const url = new URL(appUrl);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: appUrl
  });

  await context.addCookies([
    {
      name: cookieName,
      value: cookieValue,
      domain: url.hostname,
      path: "/",
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "Lax"
    }
  ]);

  const page = await context.newPage();
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  await context.storageState({ path: "storageState.json" });
  await browser.close();
}
