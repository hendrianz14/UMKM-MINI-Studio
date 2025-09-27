import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { getAdminAuth } from "@/lib/firebaseAdmin";

const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;

export const POST = handleApi(async (request) => {
  const body = await request.json().catch(() => null) as { idToken?: string } | null;
  const idToken = body?.idToken;

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  const auth = getAdminAuth();

  try {
    const decoded = await auth.verifyIdToken(idToken, true);
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_IN_MS
    });

    const response = NextResponse.json({ ok: true, uid: decoded.uid });

    response.cookies.set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(FIVE_DAYS_IN_MS / 1000)
    });

    return response;
  } catch (error) {
    console.error("Failed to create session cookie", error);
    return NextResponse.json({ error: "Invalid or expired ID token" }, { status: 401 });
  }
});
