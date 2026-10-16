import { after, NextResponse } from "next/server";
import { fromWebhook, validSignature } from "@/lib/integrations/mailerlite/model";
import { configured, rules } from "@/lib/integrations/mailerlite/reconcile";
import { blobStore, enqueue } from "@/lib/integrations/mailerlite/storage";
import { mondayCrm } from "@/lib/integrations/mailerlite/clients";
import { processEvent } from "@/lib/integrations/mailerlite/worker";

export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!configured() || !process.env.MAILERLITE_WEBHOOK_SECRET) return NextResponse.json({ ok: false }, { status: 503, headers });
  const length = Number(req.headers.get("content-length") || "0");
  if (length > 65_536) return NextResponse.json({ ok: false }, { status: 413, headers });
  const raw = await req.text();
  if (Buffer.byteLength(raw) > 65_536) return NextResponse.json({ ok: false }, { status: 413, headers });
  if (!validSignature(raw, req.headers.get("signature"), process.env.MAILERLITE_WEBHOOK_SECRET)) return NextResponse.json({ ok: false }, { status: 401, headers });
  let event;
  try { event = fromWebhook(JSON.parse(raw), rules()); }
  catch { return NextResponse.json({ ok: false }, { status: 400, headers }); }
  if (!event) return NextResponse.json({ ok: true, ignored: true }, { headers });
  try {
    // Acknowledge only after durable, encrypted storage. No recipient data is
    // returned or logged. Retryable processing continues after the response.
    await enqueue(event);
    after(async () => {
      try { await processEvent(event.id, blobStore, mondayCrm); }
      catch { console.error("[mailerlite webhook] processing deferred to reconciliation"); }
    });
    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers });
  }
}
