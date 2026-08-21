import { NextResponse } from "next/server";
import { reconcileKlaviyoMonday } from "@/lib/integrations/klaviyo-monday/reconcile";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const result = await reconcileKlaviyoMonday({
    mode: "apply",
    lifecycleLookbackHours: 72,
    lifecycleCutoverAt: "2026-08-20T08:35:00.000Z",
  });

  return NextResponse.json({ ok: true, commissioning: true, result }, {
    headers: { "Cache-Control": "no-store" },
  });
}
