import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";

export const POST = handleApi(async () => {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: "session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
});
