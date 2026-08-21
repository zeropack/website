import { NextResponse } from "next/server";

import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
} from "@/lib/integrations/klaviyo-monday/reconcile";
import { reconcileKlaviyoMondayWithAcquisition } from "@/lib/integrations/klaviyo-monday/reconcile-with-acquisition";

const PRODUCTION_LIFECYCLE_CUTOVER_AT = "2026-08-20T08:35:00.000Z";

function lifecycleLookbackHours(): number {
  const configured = Number(process.env.MONDAY_LIFECYCLE_LOOKBACK_HOURS || "72");
  return Number.isFinite(configured) && configured > 0 ? configured : 72;
}

function lifecycleCutoverAt(): string | null {
  if (process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT) {
    return process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT;
  }

  return process.env.VERCEL_ENV === "production"
    ? PRODUCTION_LIFECYCLE_CUTOVER_AT
    : null;
}

function acquisitionRuntimeEnabled(): boolean {
  return process.env.KLAVIYO_ACQUISITION_RUNTIME_ENABLED === "true";
}

function profileSyncCutoverAt(): string | null {
  const configured = process.env.MONDAY_PROFILE_SYNC_CUTOVER_AT?.trim();
  return configured || null;
}

async function run(mode: ReconcileMode, includeAcquisition = false) {
  const common = {
    mode,
    lifecycleLookbackHours: lifecycleLookbackHours(),
    lifecycleCutoverAt: lifecycleCutoverAt(),
  };

  if (!acquisitionRuntimeEnabled() && !includeAcquisition) {
    // Preserve the already commissioned production reconciler exactly until the
    // acquisition runtime has completed its separate acceptance test.
    return reconcileKlaviyoMonday(common);
  }

  // Inbound acquisition recovery is independent of outbound CRM profile sync.
  // MONDAY_PROFILE_SYNC_CUTOVER_AT gates only the outbound Monday -> Klaviyo
  // recovery scan; it is not required for Typeform/Klaviyo inbound processing.
  return reconcileKlaviyoMondayWithAcquisition({
    ...common,
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

// Production-only scheduled entry point.
export async function GET(req: Request) {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  if (!cronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await run("apply");
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[klaviyo-monday reconcile cron]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Reconciliation failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

type ReconcileRequest = {
  mode?: ReconcileMode;
  includeAcquisition?: boolean;
};

// Controlled manual execution. Preview is the default and never writes. During
// commissioning, includeAcquisition=true allows the acquisition path to be
// previewed before the production feature gate is enabled.
export async function POST(req: Request) {
  if (!internalAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as ReconcileRequest | null;
  const mode: ReconcileMode = body?.mode === "apply" ? "apply" : "preview";

  try {
    const result = await run(mode, body?.includeAcquisition === true);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[klaviyo-monday reconcile manual]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Reconciliation failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
