import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/generate", "/edit", "/gallery", "/settings", "/topup"] as const;

function shouldProtect(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function redirectToSignin(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/signin";
  redirectUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(redirectUrl);
}

export async function middleware(request: NextRequest) {
  if (!shouldProtect(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) {
    return redirectToSignin(request);
  }

  const verifyUrl = new URL("/api/auth/session-verify", request.nextUrl);
  const headers = new Headers();
  headers.set("cookie", `session=${sessionCookie}`);

  try {
    const verifyResponse = await fetch(verifyUrl, {
      headers,
      cache: "no-store"
    });

    if (verifyResponse.ok) {
      return NextResponse.next();
    }
  } catch (error) {
    console.warn("Failed to verify session cookie in middleware", error);
  }

  return redirectToSignin(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generate/:path*",
    "/edit/:path*",
    "/gallery/:path*",
    "/settings/:path*",
    "/topup/:path*"
  ]
};
