import { NextResponse } from "next/server";
import { syncOutlookRecovery } from "@/lib/integrations/activity-intelligence/outlook-sync";
import { readRecoveryCheckpoint, saveRecoveryCheckpoint } from "@/lib/integrations/activity-intelligence/outlook-checkpoint";

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
  if (input.mode !== "incremental" && input.mode !== "manual" && input.mode !== "initialize")
    return NextResponse.json({ ok: false, error: "Mode must be incremental, manual or initialize" }, { status: 400 });
  if (typeof input.write !== "boolean" || typeof input.maxPages !== "number"
    || !Number.isInteger(input.maxPages) || input.maxPages < 1 || input.maxPages > 5)
    return NextResponse.json({ ok: false, error: "Explicit write flag and maxPages (1-5) required" }, { status: 400 });
  const historicalWindow = typeof input.startAt === "string" && typeof input.endAt === "string";
  if (input.mode === "manual" && (typeof input.email !== "string"
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
    || (!historicalWindow && (typeof input.lookbackHours !== "number" || !Number.isInteger(input.lookbackHours)
    || input.lookbackHours < 1 || input.lookbackHours > 168))))
    return NextResponse.json({ ok: false, error: "Manual sync requires exact email and lookbackHours (1-168)" }, { status: 400 });
  try {
    if (input.mode === "initialize") {
      if (input.write !== true || process.env.OUTLOOK_RECOVERY_WRITE_ENABLED !== "true")
        return NextResponse.json({ ok: false, error: "Checkpoint initialization requires write authorization" }, { status: 403 });
      if (await readRecoveryCheckpoint())
        return NextResponse.json({ ok: false, error: "Checkpoint already exists; initialization refused" }, { status: 409 });
      const at = new Date().toISOString();
      await saveRecoveryCheckpoint({ lastSuccessfulAt: at, updatedAt: at });
      return NextResponse.json({ ok: true, mode: "initialize", checkpoint: at, imported: 0 });
    }
    const report = await syncOutlookRecovery({
      mode: input.mode, write: input.write, maxPages: input.maxPages,
      email: input.mode === "manual" ? String(input.email).toLowerCase() : undefined,
      lookbackHours: input.mode === "manual" && !historicalWindow ? Number(input.lookbackHours) : undefined,
      startAt: input.mode === "manual" && historicalWindow ? String(input.startAt) : undefined,
      endAt: input.mode === "manual" && historicalWindow ? String(input.endAt) : undefined,
    });
    return NextResponse.json({ ok: true, ...report }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Outlook recovery run]", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ ok: false, error: "Recovery did not complete; no checkpoint advanced" },
      { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
