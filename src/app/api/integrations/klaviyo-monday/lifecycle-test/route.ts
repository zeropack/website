import { NextResponse } from "next/server";

import { reconcileKlaviyoMonday } from "@/lib/integrations/klaviyo-monday/reconcile";

const COMMISSIONING_CUTOVER_AT = "2026-08-20T08:19:30.000Z";

function safe(result: Awaited<ReturnType<typeof reconcileKlaviyoMonday>>) {
  return {
    ok: result.ok,
    mode: result.mode,
    profilesScanned: result.profilesScanned,
    profilesWithoutEmail: result.profilesWithoutEmail,
    mirrorsWouldChange: result.mirrorsWouldChange,
    mirrorsChanged: result.mirrorsChanged,
    contactSubscriptionsWouldChange: result.contactSubscriptionsWouldChange,
    contactSubscriptionsChanged: result.contactSubscriptionsChanged,
    unmatchedProfiles: result.unmatchedProfiles,
    ambiguousProfiles: result.ambiguousProfiles,
    lifecycleEnabled: result.lifecycleEnabled,
    lifecycleTransitionsSeen: result.lifecycleTransitionsSeen,
    lifecycleTransitionsEligible: result.lifecycleTransitionsEligible,
    lifecycleTransitionsSkippedStale: result.lifecycleTransitionsSkippedStale,
    lifecycleProfilesWouldUpdate: result.lifecycleProfilesWouldUpdate,
    lifecycleProfilesUpdated: result.lifecycleProfilesUpdated,
    lifecycleEventsWouldSubmit: result.lifecycleEventsWouldSubmit,
    lifecycleEventsSubmitted: result.lifecycleEventsSubmitted,
    lifecycleUnmatched: result.lifecycleUnmatched,
    notes: result.notes,
  };
}

export async function GET(req: Request) {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const url = new URL(req.url);
  const phase = url.searchParams.get("phase") === "apply" ? "apply" : "preview";

  try {
    const preview = await reconcileKlaviyoMonday({
      mode: "preview",
      lifecycleLookbackHours: 72,
      lifecycleCutoverAt: COMMISSIONING_CUTOVER_AT,
    });

    if (phase === "preview") {
      return NextResponse.json(
        { cutoverAt: COMMISSIONING_CUTOVER_AT, preview: safe(preview) },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const safeToApply =
      preview.mirrorsWouldChange === 0 &&
      preview.contactSubscriptionsWouldChange === 0 &&
      preview.ambiguousProfiles === 0 &&
      preview.lifecycleUnmatched === 0 &&
      preview.lifecycleProfilesWouldUpdate === 1 &&
      preview.lifecycleEventsWouldSubmit === 1;

    if (!safeToApply) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lifecycle commissioning gate refused apply because preview was not the expected single-transition shape.",
          cutoverAt: COMMISSIONING_CUTOVER_AT,
          preview: safe(preview),
        },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const applied = await reconcileKlaviyoMonday({
      mode: "apply",
      lifecycleLookbackHours: 72,
      lifecycleCutoverAt: COMMISSIONING_CUTOVER_AT,
    });

    return NextResponse.json(
      {
        cutoverAt: COMMISSIONING_CUTOVER_AT,
        preview: safe(preview),
        applied: safe(applied),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[klaviyo-monday lifecycle commissioning]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Lifecycle commissioning failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
