import { MONDAY_API_VERSION } from "@/lib/integrations/klaviyo-monday/config";
import { ACTIVITY_TYPES } from "./activity-types";
import { claimKlaviyoEvent } from "./event-claim";
import { reconciliationKeysFromTimeline } from "./monday-replay";
import type { ActivityCandidate } from "./model";

type MondayPayload<T> = { data?: T; errors?: Array<{ message: string }> };

async function monday<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const key = process.env.MONDAY_API_TOKEN;
  if (!key) throw new Error("Missing Monday API token");
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST", headers: { Authorization: key, "Content-Type": "application/json", "API-Version": MONDAY_API_VERSION },
    body: JSON.stringify({ query, variables }), cache: "no-store",
  });
  const payload = await response.json() as MondayPayload<T>;
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(`Monday API failure: ${response.status} ${payload.errors?.map(x => x.message).join("; ") || ""}`);
  }
  return payload.data;
}

type TimelineResult = { timeline?: { timeline_items_page?: { cursor?: string | null; timeline_items?: Array<{ id: string; content?: string | null; custom_activity_id?: string | null }> } } };
const timelineQuery = `query($id: ID!) { timeline(id: $id) { timeline_items_page { cursor timeline_items { id content custom_activity_id } } } }`;

/** Fail closed if Monday returns any continuation cursor; never decide absence from a partial timeline. */
export async function readCompleteMondayKeys(contactId: string): Promise<ReadonlySet<string>> {
  const result = await monday<TimelineResult>(timelineQuery, { id: contactId });
  const page = result.timeline?.timeline_items_page;
  if (!page || !Array.isArray(page.timeline_items)) throw new Error("Monday timeline unavailable");
  return reconciliationKeysFromTimeline(page.timeline_items.map(x => ({ ...x, type: "custom" })), page.cursor == null);
}

/**
 * Narrowly scoped controlled writer; not exposed as cron or bulk migration.
 * No lifecycle, consent, subscription or other columns are ever updated here.
 */
export async function writePilotKlaviyoActivity(candidate: ActivityCandidate): Promise<{ status: "created" | "already_recorded"; id?: string }> {
  if (candidate.source !== "klaviyo" || !candidate.fingerprint.startsWith("klaviyo:")) throw new Error("Klaviyo only");
  if (!/^\d+$/.test(candidate.contactId) || !candidate.sourceEventId) throw new Error("Invalid candidate identity");
  const existing = await readCompleteMondayKeys(candidate.contactId);
  if (existing.has(candidate.fingerprint)) return { status: "already_recorded" };
  // A durable, create-only claim prevents two independent invocations from writing the same event.
  if (!await claimKlaviyoEvent(candidate.sourceEventId)) return { status: "already_recorded" };
  const content = [
    "Source: Klaviyo",
    `Metric: ${candidate.kind}`,
    `Source Event ID: ${candidate.sourceEventId}`,
    `Reconciliation key: ${candidate.fingerprint}`,
    `Classification: ${candidate.class} / ${candidate.confidence}`,
    "Basic engagement only; no change to marketing consent or commercial lifecycle.",
  ].join("\n");
  const mutation = `mutation($itemId: ID!, $activityId: String!, $title: String!, $summary: String!, $content: String!, $timestamp: ISO8601DateTime!) {
    create_timeline_item(item_id: $itemId, custom_activity_id: $activityId, title: $title, summary: $summary, content: $content, timestamp: $timestamp) { id }
  }`;
  const title = candidate.kind === "klaviyo_email_opened" ? "Klaviyo — Email opened" :
    candidate.kind === "klaviyo_email_clicked" ? "Klaviyo — Email clicked" : "Klaviyo — Activity";
  const result = await monday<{ create_timeline_item?: { id: string } }>(mutation, {
    itemId: candidate.contactId,
    activityId: ACTIVITY_TYPES.klaviyo.id,
    title,
    summary: candidate.summary.slice(0, 240),
    content,
    timestamp: candidate.occurredAt,
  });
  const id = result.create_timeline_item?.id;
  if (!id) throw new Error("Monday did not return a created timeline ID");
  const after = await readCompleteMondayKeys(candidate.contactId);
  if (!after.has(candidate.fingerprint)) throw new Error("Created timeline activity was not visible on read-back");
  return { status: "created", id };
}
