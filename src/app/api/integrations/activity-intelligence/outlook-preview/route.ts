import { NextResponse } from "next/server";
import { previewOutlookGraph } from "@/lib/integrations/activity-intelligence/outlook-graph";

export async function POST(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers.get("x-zp-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({})) as { lookbackHours?: number; maxPages?: number };
  try {
    const result = await previewOutlookGraph(body.lookbackHours ?? 24, body.maxPages ?? 2);
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Outlook recovery dry-run]", error);
    return NextResponse.json({ ok: false, error: "Outlook preview failed; inspect server logs" },
      { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
