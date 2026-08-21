import { NextResponse } from "next/server";

import {
  internalAuthorized,
  outboundSourceAllowed,
  syncMondayContactsToKlaviyo,
  type ProfileSyncRequest,
} from "@/lib/integrations/klaviyo-monday/acquisition";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!internalAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<ProfileSyncRequest> | null;
  if (!Array.isArray(body?.contactIds) || !body?.source || !outboundSourceAllowed(String(body.source))) {
    return NextResponse.json(
      { ok: false, error: "contactIds and an approved source are required." },
      { status: 400 },
    );
  }

  try {
    const result = await syncMondayContactsToKlaviyo({
      contactIds: body.contactIds.map(String),
      source: body.source,
      mode: body.mode === "apply" ? "apply" : "preview",
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[klaviyo-monday profile sync]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Profile sync failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
