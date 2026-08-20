import { NextResponse } from "next/server";

import {
  contactSubscriptionForProfile,
  getKlaviyoProfileByEmail,
  getMondayContactByEmail,
  listMondayKlaviyoMirrors,
  marketingMirrorStatus,
  setKlaviyoLifecycleStage,
  updateMondayContactSubscription,
} from "@/lib/integrations/klaviyo-monday/clients";
import {
  isCommercialLifecycleStatus,
  KLAVIYO_LIFECYCLE_PROPERTY,
} from "@/lib/integrations/klaviyo-monday/config";
import { upsertMondayKlaviyoMirrorSafe } from "@/lib/integrations/klaviyo-monday/mirror";

type CommissionRequest = {
  email?: string;
  mode?: "preview" | "apply";
};

function authorized(req: Request): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  return Boolean(secret && req.headers.get("x-zp-secret") === secret);
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
          "No Klaviyo profile exists. This endpoint will not create or subscribe one from CRM state.",
        ],
      });
    }

    const mirrors = (await listMondayKlaviyoMirrors()).filter(
      (mirror) => mirror.profileId === profile.id,
    );
    if (mirrors.length > 1) {
      throw new Error(`Duplicate Klaviyo Profiles mirrors found for ${profile.id}.`);
    }
    const existingMirror = mirrors[0] || null;

    const actions: string[] = [];
    const lifecycle = contact.lifecycleStatus;
    const lifecycleNeedsSync =
      isCommercialLifecycleStatus(lifecycle) && profile.lifecycleStage !== lifecycle;
    if (lifecycleNeedsSync) {
      actions.push(
        `Reconcile Klaviyo ${KLAVIYO_LIFECYCLE_PROPERTY} from ${profile.lifecycleStage || "unset"} to ${lifecycle} without emitting a synthetic lifecycle event.`,
      );
    }

    const contactSubscriptionTarget = contactSubscriptionForProfile(profile);
    if (contact.subscription !== contactSubscriptionTarget) {
      actions.push(
        `Mirror Klaviyo marketing eligibility to Monday Contact Subscription: ${contactSubscriptionTarget}.`,
      );
    }
    actions.push("Reconcile the Klaviyo Profiles operational mirror using preserved consent provenance.");

    if (mode === "apply") {
      if (lifecycleNeedsSync) {
        await setKlaviyoLifecycleStage(
          profile.id,
          lifecycle,
          contact.id,
          profile.acquisitionSource,
        );
        profile.lifecycleStage = lifecycle;
        profile.mondayContactId = contact.id;
      }

      if (contact.subscription !== contactSubscriptionTarget) {
        await updateMondayContactSubscription(contact.id, contactSubscriptionTarget);
        contact.subscription = contactSubscriptionTarget;
      }

      const mirror = await upsertMondayKlaviyoMirrorSafe({
        contact,
        profile,
        existing: existingMirror,
      });

      return NextResponse.json({
        ok: true,
        mode,
        contactId: contact.id,
        klaviyoProfileId: profile.id,
        mirrorItemId: mirror.itemId,
        mirrorChanged: mirror.changed,
        lifecycleStage: profile.lifecycleStage,
        marketingStatus: marketingMirrorStatus(profile),
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
        mondaySubscriptionTarget: contactSubscriptionTarget,
        klaviyoMarketingStatus: marketingMirrorStatus(profile),
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
