import { NextResponse } from "next/server";

import {
  intakeAuthorized,
  inboundSourceAllowed,
  processInboundKlaviyoIntake,
  type KlaviyoIntakePayload,
} from "@/lib/integrations/klaviyo-monday/acquisition";

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

  try {
    const result = await processInboundKlaviyoIntake({
      payload: {
        profile_id: String(body.profile_id),
        source: body.source,
      },
      flowId,
      mode: "apply",
    });

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[klaviyo-monday acquisition intake]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Acquisition intake failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
