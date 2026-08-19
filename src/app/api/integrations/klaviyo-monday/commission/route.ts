import { NextResponse } from "next/server";

import {
  createLifecycleEvent,
  getKlaviyoProfileByEmail,
  getMondayContactByEmail,
  marketingMirrorStatus,
  setKlaviyoLifecycleStage,
  upsertMondayKlaviyoMirror,
} from "@/lib/integrations/klaviyo-monday/clients";
import {
  isCommercialLifecycleStatus,
  KLAVIYO_LIFECYCLE_PROPERTY,
} from "@/lib/integrations/klaviyo-monday/config";

type CommissionRequest = {
  email?: string;
  mode?: "preview" | "apply";
};

function authorized(req: Request): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return false;
  return req.headers.get("x-zp-secret") === secret;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as CommissionRequest | null;
  const email = body?.email?.trim().toLowerCase();
  const mode = body?.mode === "apply" ? "apply" : "preview";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "A single valid commissioning email is required." },
      { status: 400 },
    );
  }

  try {
    const contact = await getMondayContactByEmail(email);
    if (!contact) {
      return NextResponse.json(
        { ok: false, error: "No canonical Monday Contact found for this email." },
        { status: 404 },
      );
    }

    const profile = await getKlaviyoProfileByEmail(email);
    if (!profile) {
      return NextResponse.json({
        ok: true,
        mode,
        contact,
        profile: null,
        actions: [
          "No Klaviyo profile exists yet. The subscription intake path must create/subscribe it before reconciliation can continue.",
        ],
      });
    }

    const actions: string[] = [];
    const lifecycle = contact.lifecycleStatus;
    const lifecycleNeedsSync =
      isCommercialLifecycleStatus(lifecycle) && profile.lifecycleStage !== lifecycle;

    if (lifecycleNeedsSync) {
      actions.push(
        `Set Klaviyo ${KLAVIYO_LIFECYCLE_PROPERTY} from ${profile.lifecycleStage || "unset"} to ${lifecycle}.`,
        `Emit idempotent Klaviyo lifecycle event: ${lifecycle}.`,
      );
    }

    const mirrorStatus = marketingMirrorStatus(profile);
    const contactMirror =
      mirrorStatus === "Subscribed"
        ? "Subscribed"
        : mirrorStatus === "Pending"
          ? "Pending"
          : "Unsubscribed";

    if (contact.subscription !== contactMirror) {
      actions.push(
        `Mirror Klaviyo marketing eligibility to Monday Contact Subscription: ${contactMirror}.`,
      );
    }
    actions.push("Upsert the Klaviyo Profiles operational mirror and link it to the canonical Contact.");

    if (mode === "apply") {
      if (lifecycleNeedsSync) {
        await setKlaviyoLifecycleStage(profile.id, lifecycle);
        await createLifecycleEvent({
          profileId: profile.id,
          stage: lifecycle,
          mondayContactId: contact.id,
        });
      }

      const refreshedProfile = lifecycleNeedsSync
        ? await getKlaviyoProfileByEmail(email)
        : profile;

      if (!refreshedProfile) {
        throw new Error("Klaviyo profile disappeared during reconciliation.");
      }

      const mirrorItemId = await upsertMondayKlaviyoMirror({
        contact,
        profile: refreshedProfile,
      });

      return NextResponse.json({
        ok: true,
        mode,
        contactId: contact.id,
        klaviyoProfileId: refreshedProfile.id,
        mirrorItemId,
        lifecycleStage: refreshedProfile.lifecycleStage,
        marketingStatus: marketingMirrorStatus(refreshedProfile),
        actions,
      });
    }

    return NextResponse.json({
      ok: true,
      mode,
      contact,
      profile,
      calculated: {
        lifecycleNeedsSync,
        lifecycleTarget: isCommercialLifecycleStatus(lifecycle) ? lifecycle : null,
        mondaySubscriptionTarget: contactMirror,
        klaviyoMarketingStatus: mirrorStatus,
      },
      actions,
    });
  } catch (error) {
    console.error("[klaviyo-monday commission]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Commissioning sync failed.",
      },
      { status: 500 },
    );
  }
}
