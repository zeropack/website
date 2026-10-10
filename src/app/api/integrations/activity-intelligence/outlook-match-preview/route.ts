import { NextResponse } from "next/server";
import { previewOutlookContactMatching } from "@/lib/integrations/activity-intelligence/outlook-contact-preview";

export async function POST(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers.get("x-zp-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "Invalid JSON body; no scan run" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Expected JSON object" }, { status: 400 });
  }
  const options = body as Record<string, unknown>;
  const lookbackHours = options.lookbackHours;
  const maxPages = options.maxPages;
  if (typeof lookbackHours !== "number" || !Number.isInteger(lookbackHours) || lookbackHours < 1 || lookbackHours > 168
    || typeof maxPages !== "number" || !Number.isInteger(maxPages) || maxPages < 1 || maxPages > 5) {
    return NextResponse.json({ ok: false, error: "Explicit lookbackHours (1-168) and maxPages (1-5) required" }, { status: 400 });
  }
  try {
    const result = await previewOutlookContactMatching(lookbackHours, maxPages);
    return NextResponse.json({ ok: true, requestedLookbackHours: lookbackHours, requestedMaxPages: maxPages, ...result },
      { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Outlook contact match preview]", error);
    return NextResponse.json({ ok: false, error: "Outlook match preview failed; inspect server logs" },
      { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
