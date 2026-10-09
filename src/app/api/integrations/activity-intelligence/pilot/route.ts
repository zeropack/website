import { NextResponse } from "next/server";
import { fetchRecentKlaviyoEvents } from "@/lib/integrations/activity-intelligence/klaviyo-preview";
import { previewKlaviyoActivities } from "@/lib/integrations/activity-intelligence/preview";
import { listMondayContacts, listMondayKlaviyoMirrors } from "@/lib/integrations/klaviyo-monday/clients";
import { writePilotKlaviyoActivity } from "@/lib/integrations/activity-intelligence/monday-writer";

/**
 * Phase 1 single-Contact pilot only. No schedule, no Outlook, no QBO.
 * Requires both an authenticated internal call and an explicit pilot-enable switch.
 */
export async function POST(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers.get("x-zp-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.ZP_KLAVIYO_ACTIVITY_PILOT_ENABLED !== "true") {
    return NextResponse.json({ ok: false, error: "Pilot writes disabled" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({})) as { eventId?: string; contactId?: string };
  if (!body.eventId || !body.contactId || !/^\d+$/.test(body.contactId)) {
    return NextResponse.json({ ok: false, error: "Explicit eventId and contactId required" }, { status: 400 });
  }
  try {
    const [events, contacts, mirrors] = await Promise.all([
      fetchRecentKlaviyoEvents(24, 5), listMondayContacts(), listMondayKlaviyoMirrors(),
    ]);
    const selected = events.filter(x => x.id === body.eventId);
    if (selected.length !== 1 || !selected[0].profileId) {
      return NextResponse.json({ ok: false, error: "Event missing or ambiguous" }, { status: 409 });
    }
    const contact = contacts.find(x => x.id === body.contactId);
    const profileMatches = mirrors.filter(x => x.profileId === selected[0].profileId);
    if (!contact || profileMatches.length !== 1 || profileMatches[0].linkedContactId !== contact.id) {
      return NextResponse.json({ ok: false, error: "Contact/profile mismatch" }, { status: 409 });
    }
    const accepted = previewKlaviyoActivities(selected, new Map([[selected[0].profileId, [contact.id]]]), new Set());
    if (accepted.candidates.length !== 1) {
      return NextResponse.json({ ok: false, error: "Unsupported event" }, { status: 409 });
    }
    const result = await writePilotKlaviyoActivity(accepted.candidates[0]);
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Klaviyo activity pilot]", error);
    return NextResponse.json({ ok: false, error: "Pilot failed; inspect logs" }, { status: 500 });
  }
}
