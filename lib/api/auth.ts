import { headers } from "next/headers";
import { unauthorized } from "./errors";
import { verifyIdToken } from "@/lib/auth/verify-id-token";

export async function requireUser() {
  const authHeader = headers().get("authorization") || headers().get("Authorization");
  if (!authHeader) {
    unauthorized();
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    unauthorized();
  }

  const decoded = await verifyIdToken(token);
  return decoded;
}
