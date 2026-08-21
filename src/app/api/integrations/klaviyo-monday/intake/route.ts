import { NextResponse } from "next/server";

import {
  acquisitionFlowAllowed,
  intakeAuthorized,
  inboundSourceAllowed,
  processInboundKlaviyoIntake,
  type KlaviyoIntakePayload,
} from "@/lib/integrations/klaviyo-monday/acquisition-runtime";
import { processWebsiteRfqProfile } from "@/lib/integrations/klaviyo-monday/rfq-intake";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!intakeAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<KlaviyoIntakePayload> | null;
  const flowId = req.headers.get("x-klaviyo-flow-id");

  if (!body?.profile_id || !body?.source || !inboundSourceAllowed(String(body.source))) {
    return NextResponse.json(
      { ok: false, error: "profile_id and an approved source are required." },
      { status: 400 },
    );
  }
  if (!acquisitionFlowAllowed(flowId)) {
    return NextResponse.json({ ok: false, error: "Unapproved Klaviyo acquisition flow." }, { status: 403 });
  }

  try {
    const result =
      body.source === "Typeform"
        ? await processWebsiteRfqProfile(String(body.profile_id), "apply")
        : await processInboundKlaviyoIntake({
            payload: { profile_id: String(body.profile_id), source: body.source },
            flowId,
            mode: "apply",
          });

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Acquisition intake failed.";
    console.error("[klaviyo-monday acquisition intake]", error);
    const status = message.startsWith("Unapproved") ? 403 : 500;
    return NextResponse.json(
      { ok: false, error: message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
