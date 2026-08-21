import { NextResponse } from "next/server";

import {
  recoverStandardInboundProfilesV2,
  STANDARD_INBOUND_PRODUCTION_CUTOVER_AT,
} from "@/lib/integrations/klaviyo-monday/standard-inbound-recovery";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const result = await recoverStandardInboundProfilesV2("preview", {
      cutoverAt: STANDARD_INBOUND_PRODUCTION_CUTOVER_AT,
    });
    return NextResponse.json({ ok: true, result }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Diagnostic failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
