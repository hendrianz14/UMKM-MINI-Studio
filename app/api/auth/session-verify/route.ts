import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { getAdminAuth } from "@/lib/firebaseAdmin";

function extractSessionCookie(header: string | null | undefined) {
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith("session=")) {
      return trimmed.slice("session=".length);
    }
  }
  return null;
}

export const GET = handleApi(async (request) => {
  const cookieHeader = request.headers.get("cookie") ?? request.headers.get("Cookie");
  const sessionCookie = extractSessionCookie(cookieHeader);

  if (!sessionCookie) {
    return NextResponse.json({ error: "Missing session cookie" }, { status: 401 });
  }

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (error) {
    console.warn("Session verification failed", error);
    return NextResponse.json({ error: "Invalid session cookie" }, { status: 401 });
  }
});
