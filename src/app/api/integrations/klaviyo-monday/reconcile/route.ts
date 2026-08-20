import { NextResponse } from "next/server";

import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
} from "@/lib/integrations/klaviyo-monday/reconcile";

function lifecycleLookbackHours(): number {
  const configured = Number(process.env.MONDAY_LIFECYCLE_LOOKBACK_HOURS || "72");
  return Number.isFinite(configured) && configured > 0 ? configured : 72;
}

async function run(mode: ReconcileMode) {
  return reconcileKlaviyoMonday({
    mode,
    lifecycleLookbackHours: lifecycleLookbackHours(),
    lifecycleCutoverAt: process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT || null,
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

// Vercel Cron can call this endpoint once a schedule is explicitly approved and added.
// There is intentionally no vercel.json cron schedule during commissioning.
export async function GET(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await run("apply");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[klaviyo-monday reconcile cron]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Reconciliation failed.",
      },
      { status: 500 },
    );
  }
}

type ReconcileRequest = {
  mode?: ReconcileMode;
};

// Controlled commissioning/manual execution. Preview is the default and never writes.
export async function POST(req: Request) {
  if (!internalAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as ReconcileRequest | null;
  const mode: ReconcileMode = body?.mode === "apply" ? "apply" : "preview";

  try {
    const result = await run(mode);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[klaviyo-monday reconcile manual]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Reconciliation failed.",
      },
      { status: 500 },
    );
  }
}
