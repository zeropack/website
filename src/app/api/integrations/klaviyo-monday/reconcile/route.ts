import { NextResponse } from "next/server";

import {
  reconcileKlaviyoMondayWithAcquisition,
  type ReconcileMode,
} from "@/lib/integrations/klaviyo-monday/reconcile-with-acquisition";

const PRODUCTION_LIFECYCLE_CUTOVER_AT = "2026-08-20T08:35:00.000Z";
// New CRM/profile creation before this cutover remains historical and is not pushed into
// Klaviyo by the automatic outbound recovery path.
const PRODUCTION_PROFILE_SYNC_CUTOVER_AT = "2026-08-21T00:00:00.000Z";

function lifecycleLookbackHours(): number {
  const configured = Number(process.env.MONDAY_LIFECYCLE_LOOKBACK_HOURS || "72");
  return Number.isFinite(configured) && configured > 0 ? configured : 72;
}

function lifecycleCutoverAt(): string | null {
  if (process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT) {
    return process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT;
  }
  return process.env.VERCEL_ENV === "production" ? PRODUCTION_LIFECYCLE_CUTOVER_AT : null;
}

function profileSyncCutoverAt(): string | null {
  if (process.env.MONDAY_PROFILE_SYNC_CUTOVER_AT) {
    return process.env.MONDAY_PROFILE_SYNC_CUTOVER_AT;
  }
  return process.env.VERCEL_ENV === "production" ? PRODUCTION_PROFILE_SYNC_CUTOVER_AT : null;
}

async function run(mode: ReconcileMode) {
  return reconcileKlaviyoMondayWithAcquisition({
    mode,
    lifecycleLookbackHours: lifecycleLookbackHours(),
    lifecycleCutoverAt: lifecycleCutoverAt(),
    profileSyncCutoverAt: profileSyncCutoverAt(),
  });
}

function internalAuthorized(req: Request): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  return Boolean(secret && req.headers.get("x-zp-secret") === secret);
}

function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && req.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET(req: Request) {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  if (!cronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await run("apply");
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[klaviyo-monday reconcile cron]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Reconciliation failed." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

type ReconcileRequest = { mode?: ReconcileMode };

export async function POST(req: Request) {
  if (!internalAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as ReconcileRequest | null;
  const mode: ReconcileMode = body?.mode === "apply" ? "apply" : "preview";
  try {
    const result = await run(mode);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[klaviyo-monday reconcile manual]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Reconciliation failed." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
