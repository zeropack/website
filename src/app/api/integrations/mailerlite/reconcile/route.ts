import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { reconcileMailerLite } from "@/lib/integrations/mailerlite/reconcile";

export const runtime = "nodejs";
export const maxDuration = 300;
function matches(value: string | null, secret: string | undefined): boolean {
  if (!value || !secret) return false;
  const a = Buffer.from(value), b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
async function run() {
  try { return NextResponse.json(await reconcileMailerLite(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ ok: false, error: "MailerLite reconciliation failed" }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
export async function GET(req: Request) {
  if (process.env.VERCEL_ENV !== "production" || !matches(req.headers.get("authorization"), process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : undefined)) return NextResponse.json({ ok: false }, { status: 401 });
  return run();
}
export async function POST(req: Request) {
  if (!matches(req.headers.get("x-zp-secret"), process.env.INTERNAL_API_SECRET)) return NextResponse.json({ ok: false }, { status: 401 });
  return run();
}
