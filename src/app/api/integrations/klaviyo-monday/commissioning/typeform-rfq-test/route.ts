import { NextResponse } from "next/server";

import {
  recoverTypeformRfqEventsV2,
} from "@/lib/integrations/klaviyo-monday/typeform-event-rfq";

const TEST_EVENT_ID = "7nRqWH8mfpU";
const TEST_CUTOVER = "2026-08-21T06:47:49.000Z";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const url = new URL(req.url);
  const requestedMode = url.searchParams.get("mode") === "apply" ? "apply" : "preview";

  const preview = await recoverTypeformRfqEventsV2("preview", {
    lookbackHours: 24,
    cutoverAt: TEST_CUTOVER,
  });

  const matching = preview.results.filter(
    (result) => result.eventId === TEST_EVENT_ID,
  );
  if (preview.scanned !== 1 || matching.length !== 1) {
    return NextResponse.json(
      {
        ok: false,
        error: "Commissioning scope changed; refusing write.",
        expectedEventId: TEST_EVENT_ID,
        preview,
      },
      { status: 409, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (requestedMode === "preview") {
    return NextResponse.json(
      { ok: true, commissioning: true, preview },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const applied = await recoverTypeformRfqEventsV2("apply", {
    lookbackHours: 24,
    cutoverAt: TEST_CUTOVER,
  });
  return NextResponse.json(
    { ok: true, commissioning: true, applied },
    { headers: { "Cache-Control": "no-store" } },
  );
}
