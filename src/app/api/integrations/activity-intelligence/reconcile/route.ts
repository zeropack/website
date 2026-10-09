import { NextResponse } from "next/server";
import { fetchRecentKlaviyoEvents } from "@/lib/integrations/activity-intelligence/klaviyo-preview";
import { previewKlaviyoActivities } from "@/lib/integrations/activity-intelligence/preview";
import { listMondayContacts, listMondayKlaviyoMirrors } from "@/lib/integrations/klaviyo-monday/clients";
import { writePilotKlaviyoActivity } from "@/lib/integrations/activity-intelligence/monday-writer";

export const maxDuration = 60;

/** Standalone Phase 1 Klaviyo-only run: no Outlook, QBO, CRM column or consent writes. */
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.ZP_KLAVIYO_ACTIVITY_SYNC_ENABLED !== "true") {
    return NextResponse.json({ ok: true, status: "disabled" });
  }
  try {
    const [events, contacts, mirrors] = await Promise.all([
      fetchRecentKlaviyoEvents(48, 5),
      listMondayContacts(),
      listMondayKlaviyoMirrors(),
    ]);
    const known = new Set(contacts.map(x => x.id));
    const links = new Map<string, string[]>();
    for (const mirror of mirrors) {
      if (!mirror.profileId || !mirror.linkedContactId || !known.has(mirror.linkedContactId)) continue;
      const list = links.get(mirror.profileId) || [];
      list.push(mirror.linkedContactId);
      links.set(mirror.profileId, list);
    }
    const eligible = previewKlaviyoActivities(events, links, new Set());
    // Small initial production cap; the next scheduled run will retry unprocessed events.
    const selected = eligible.candidates.slice(0, 15);
    let created = 0;
    let alreadyRecorded = 0;
    for (const candidate of selected) {
      const result = await writePilotKlaviyoActivity(candidate);
      if (result.status === "created") created++;
      else alreadyRecorded++;
    }
    console.info("[Activity intelligence Phase 1]", { scanned: events.length, eligible: eligible.candidates.length, selected: selected.length, created, alreadyRecorded, skipped: eligible.skipped });
    return NextResponse.json({
      ok: true, mode: "klaviyo-only", scanned: events.length,
      eligible: eligible.candidates.length, selected: selected.length,
      created, alreadyRecorded, skipped: eligible.skipped,
      truncated: eligible.candidates.length > selected.length,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Activity intelligence Phase 1 failed]", error);
    return NextResponse.json({ ok: false, error: "Klaviyo-only reconciliation aborted; inspect logs" }, { status: 500 });
  }
}
