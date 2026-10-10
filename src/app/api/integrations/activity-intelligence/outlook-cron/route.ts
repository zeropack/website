import { NextResponse } from "next/server";
import { syncOutlookRecovery } from "@/lib/integrations/activity-intelligence/outlook-sync";

/** Vercel cron route. Remains inert until explicitly enabled in Production. */
export async function GET(req: Request) {
  if (process.env.OUTLOOK_RECOVERY_WRITE_ENABLED !== "true")
    return NextResponse.json({ ok: true, status: "disabled" }, { headers: { "Cache-Control": "no-store" } });
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const report = await syncOutlookRecovery({ mode: "incremental", maxPages: 5, write: true });
    return NextResponse.json({ ok: report.failed === 0, ...report }, {
      status: report.failed === 0 ? 200 : 503, headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[Outlook recovery cron]", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ ok: false, error: "Sync failed; checkpoint unchanged" }, { status: 500 });
  }
}
