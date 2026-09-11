import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const rawCountry = request.headers.get("x-vercel-ip-country")?.trim().toUpperCase() ?? "";
  const country = /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : null;

  return NextResponse.json(
    { country },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}
