import { NextResponse } from "next/server";

/** Server-side quote intake — wire to CRM/email via env */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const webhook = process.env.QUOTE_WEBHOOK_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-zp-secret": secret } : {}),
      },
      body: JSON.stringify(body),
    }).catch(() => null);
  } else if (process.env.NODE_ENV === "development") {
    console.info("[quote intake]", JSON.stringify(body, null, 2));
  }

  return NextResponse.json({ ok: true });
}
