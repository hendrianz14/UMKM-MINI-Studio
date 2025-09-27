import { unauthorized } from "./errors";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import type { DecodedIdToken } from "firebase-admin/auth";

const SESSION_COOKIE_NAME = "session";

type AuthMethod = "cookie" | "bearer";

export interface VerifiedRequestAuth {
  uid: string;
  method: AuthMethod;
  decoded: DecodedIdToken;
}

function extractCookie(header: string | null | undefined, name: string) {
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith(`${name}=`)) {
      const value = trimmed.slice(name.length + 1);
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return null;
}

export async function verifyRequestAuth(request: Request): Promise<VerifiedRequestAuth> {
  const auth = getAdminAuth();
  const cookieHeader = request.headers.get("cookie") ?? request.headers.get("Cookie");
  const sessionCookie = extractCookie(cookieHeader, SESSION_COOKIE_NAME);

  if (sessionCookie) {
    try {
      const decoded = await auth.verifySessionCookie(sessionCookie, true);
      return { uid: decoded.uid, method: "cookie", decoded };
    } catch (error) {
      console.warn("Failed to verify session cookie", error);
    }
  }

  const authHeader = request.headers.get("Authorization") ?? request.headers.get("authorization");
  if (authHeader) {
    const [scheme, token] = authHeader.split(" ");
    if (scheme?.toLowerCase() === "bearer" && token) {
      try {
        const decoded = await auth.verifyIdToken(token, true);
        return { uid: decoded.uid, method: "bearer", decoded };
      } catch (error) {
        console.warn("Failed to verify bearer token", error);
      }
    }
  }

  unauthorized();
}

export async function requireUser(request: Request) {
  const { decoded } = await verifyRequestAuth(request);
  return decoded;
}
