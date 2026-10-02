import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "zp_reintro_token";
const MAX_AGE_SECONDS = 60 * 30;

function validTokenShape(token: string): boolean {
  return /^[A-Za-z0-9_-]{30,180}$/.test(token);
}

function allowedUtm(value: string | null): string | null {
  if (!value) return null;
  return /^[A-Za-z0-9_.-]{1,120}$/.test(value) ? value : null;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t") || "";
  const destination = new URL("/keep-in-touch/", request.url);

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const value = allowedUtm(request.nextUrl.searchParams.get(key));
    if (value) destination.searchParams.set(key, value);
  }

  if (!validTokenShape(token)) {
    destination.searchParams.set("invalid", "1");
    return NextResponse.redirect(destination, 303);
  }

  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return response;
}
