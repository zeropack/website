import { NextResponse } from "next/server";

import {
  type ReconcileMode,
} from "@/lib/integrations/klaviyo-monday/reconcile";
import { reconcileKlaviyoMondayWithAcquisition } from "@/lib/integrations/klaviyo-monday/reconcile-with-acquisition";

const PRODUCTION_LIFECYCLE_CUTOVER_AT = "2026-08-20T08:35:00.000Z";
const PRODUCTION_PROFILE_SYNC_CUTOVER_AT = "2026-08-21T08:26:00.000Z";

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
  if (configured) return configured;

  // Outbound Monday -> Klaviyo profile sync completed its separate production
  // commissioning on 21 August 2026. The hard production cutover prevents the
  // historical Contacts board from being imported while allowing all newly
  // created Contacts and Contacts attached to fresh AI-Agent Leads to converge.
  return process.env.VERCEL_ENV === "production"
    ? PRODUCTION_PROFILE_SYNC_CUTOVER_AT
    : null;
}

async function run(mode: ReconcileMode, includeAcquisition = false) {
  const common = {
    mode,
    lifecycleLookbackHours: lifecycleLookbackHours(),
    lifecycleCutoverAt: lifecycleCutoverAt(),
  };

  const standardInboundEnabled =
    acquisitionRuntimeEnabled() || includeAcquisition;

  // Typeform RFQ and governed outbound CRM profile recovery have completed
  // independent commissioning and run on every production reconciliation.
  // The broader profile-based inbound acquisition path remains separately gated.
  return reconcileKlaviyoMondayWithAcquisition({
    ...common,
    standardInboundEnabled,
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

// Controlled manual execution. Preview is the default and never writes.
// includeAcquisition=true additionally enables only the still-gated standard
// inbound profile path; Typeform RFQ and outbound CRM profile recovery use their
// independent commissioned cutovers.
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
