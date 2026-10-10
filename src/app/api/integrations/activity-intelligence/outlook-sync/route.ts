import { NextResponse } from "next/server";
import { syncOutlookRecovery } from "@/lib/integrations/activity-intelligence/outlook-sync";

export async function POST(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers.get("x-zp-secret") !== secret)
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return NextResponse.json({ ok: false, error: "Invalid options" }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (input.mode !== "incremental" && input.mode !== "manual")
    return NextResponse.json({ ok: false, error: "Mode must be incremental or manual" }, { status: 400 });
  if (typeof input.write !== "boolean" || typeof input.maxPages !== "number"
    || !Number.isInteger(input.maxPages) || input.maxPages < 1 || input.maxPages > 5)
    return NextResponse.json({ ok: false, error: "Explicit write flag and maxPages (1-5) required" }, { status: 400 });
  if (input.mode === "manual" && (typeof input.email !== "string"
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
    || typeof input.lookbackHours !== "number" || !Number.isInteger(input.lookbackHours)
    || input.lookbackHours < 1 || input.lookbackHours > 168))
    return NextResponse.json({ ok: false, error: "Manual sync requires exact email and lookbackHours (1-168)" }, { status: 400 });
  try {
    const report = await syncOutlookRecovery({
      mode: input.mode, write: input.write, maxPages: input.maxPages,
      email: input.mode === "manual" ? String(input.email).toLowerCase() : undefined,
      lookbackHours: input.mode === "manual" ? Number(input.lookbackHours) : undefined,
    });
    return NextResponse.json({ ok: true, ...report }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Outlook recovery run]", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ ok: false, error: "Recovery did not complete; no checkpoint advanced" },
      { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
