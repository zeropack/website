import { NextResponse } from "next/server";

// Deliberate retirement tombstone: never read input, credentials, queues or providers.
function retired() {
  return NextResponse.json({ ok: false, retired: true }, {
    status: 410, headers: { "Cache-Control": "no-store" },
  });
}
export const GET = retired;
export const POST = retired;
