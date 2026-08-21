import { NextResponse } from "next/server";

import {
  parseTypeformSignal,
  processTypeformRfqIntake,
  verifyTypeformSignature,
} from "@/lib/integrations/klaviyo-monday/rfq-intake";
import {
  findProcessedTypeformRfqByEmail,
  readProcessedTypeformRfq,
  stampProcessedTypeformRfq,
} from "@/lib/integrations/klaviyo-monday/typeform-rfq-idempotency";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("typeform-signature");

  let authorized = false;
  try {
    authorized = verifyTypeformSignature(rawBody, signature);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook authorization configuration failed.";
    console.error("[typeform-rfq authorization]", error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody || "null") as unknown;
  try {
    const signal = parseTypeformSignal(body);

    if (signal.responseId && signal.email) {
      const previous = await findProcessedTypeformRfqByEmail(signal.email);
      if (previous?.responseId === signal.responseId) {
        return NextResponse.json(
          {
            ok: true,
            mode: "apply",
            action: "already-processed-response",
            profileId: previous.profileId,
            leadId: previous.leadId,
            email: signal.email,
            responseId: signal.responseId,
          },
          { status: 200, headers: { "Cache-Control": "no-store" } },
        );
      }
    }

    const result = await processTypeformRfqIntake(body, "apply");

    if (signal.responseId && result.profileId) {
      const processed = await readProcessedTypeformRfq(result.profileId);
      if (processed.responseId !== signal.responseId) {
        await stampProcessedTypeformRfq({
          profileId: result.profileId,
          responseId: signal.responseId,
          leadId: result.leadId || processed.leadId,
        });
      }
    }

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Typeform RFQ intake failed.";
    console.error("[typeform-rfq intake]", error);
    const retryable =
      message.includes("not available yet") ||
      message.includes("not currently marketable");
    return NextResponse.json(
      { ok: false, error: message, retryable },
      { status: retryable ? 503 : 422, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function GET(req: Request) {
  const secret = req.headers.get("x-zp-secret");
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    route: "typeform-rfq",
    formId: "m0adYoQw",
    mode: "signed-webhook",
    lifecycle: "RFQ Requested derived from route; rfq_requested variable not used",
    idempotency: "Typeform response token + conservative duplicate fallback",
  });
}
