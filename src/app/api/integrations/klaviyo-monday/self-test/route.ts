import { NextResponse } from "next/server";

import {
  reconcileKlaviyoMonday,
  type ReconcileResult,
} from "@/lib/integrations/klaviyo-monday/reconcile";

function lifecycleLookbackHours(): number {
  const configured = Number(process.env.MONDAY_LIFECYCLE_LOOKBACK_HOURS || "72");
  return Number.isFinite(configured) && configured > 0 ? configured : 72;
}

function safeResult(result: ReconcileResult) {
  return {
    ok: result.ok,
    mode: result.mode,
    profilesScanned: result.profilesScanned,
    profilesWithoutEmail: result.profilesWithoutEmail,
    mirrorsWouldChange: result.mirrorsWouldChange,
    contactSubscriptionsWouldChange: result.contactSubscriptionsWouldChange,
    unmatchedProfiles: result.unmatchedProfiles,
    ambiguousProfiles: result.ambiguousProfiles,
    lifecycleEnabled: result.lifecycleEnabled,
    lifecycleTransitionsSeen: result.lifecycleTransitionsSeen,
    lifecycleTransitionsEligible: result.lifecycleTransitionsEligible,
    lifecycleTransitionsSkippedStale: result.lifecycleTransitionsSkippedStale,
    lifecycleProfilesWouldUpdate: result.lifecycleProfilesWouldUpdate,
    lifecycleEventsWouldSubmit: result.lifecycleEventsWouldSubmit,
    lifecycleUnmatched: result.lifecycleUnmatched,
    notes: result.notes,
  };
}

// Temporary commissioning-only endpoint. It is unavailable on production deployments
// and always runs the reconciliation engine in preview mode, which performs no writes.
export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const result = await reconcileKlaviyoMonday({
      mode: "preview",
      lifecycleLookbackHours: lifecycleLookbackHours(),
      lifecycleCutoverAt: process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT || null,
    });

    return NextResponse.json(safeResult(result), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[klaviyo-monday self-test]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Self-test failed.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
