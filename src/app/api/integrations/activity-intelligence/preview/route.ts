import { NextResponse } from "next/server";
import { previewRecentActivity } from "@/lib/integrations/activity-intelligence/klaviyo-preview";

/**
 * Authenticated manual preview only: never writes and never runs as a cron.
 * Reuses the established integration secret pattern.
 */
export async function POST(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers.get("x-zp-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({})) as { lookbackHours?: number; maxPages?: number };
  try {
    const lookback = body.lookbackHours ?? 24;
    const pages = body.maxPages ?? 3;
    const result = await previewRecentActivity(lookback, pages);
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[activity intelligence preview]", error);
    return NextResponse.json({
      ok: false, error: "Activity preview failed; inspect server logs",
    }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
