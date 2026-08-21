import { KLAVIYO_API_REVISION } from "./config";
import { processWebsiteRfqProfile, type RfqIntakeMode } from "./rfq-intake";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function cutoverIso(): string | null {
  const raw = process.env.KLAVIYO_RFQ_SYNC_CUTOVER_AT?.trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("KLAVIYO_RFQ_SYNC_CUTOVER_AT is not a valid ISO-8601 timestamp.");
  }
  return parsed.toISOString();
}

async function recentProfileIds(cutover: string): Promise<string[]> {
  const params = new URLSearchParams({
    filter: `greater-than(updated,${cutover})`,
    "page[size]": "100",
    "fields[profile]": "id,updated",
  });
  let next: string | null = `/api/profiles?${params.toString()}`;
  const ids: string[] = [];

  while (next) {
    const url = next.startsWith("https://") ? next : `https://a.klaviyo.com${next}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
        accept: "application/vnd.api+json",
        revision: KLAVIYO_API_REVISION,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Klaviyo RFQ recovery profile scan failed ${response.status}: ${body.slice(0, 600)}`);
    }
    const payload = (await response.json()) as {
      data: Array<{ id: string }>;
      links?: { next?: string | null };
    };
    ids.push(...payload.data.map((profile) => String(profile.id)));
    next = payload.links?.next || null;
  }
  return [...new Set(ids)];
}

export async function recoverWebsiteRfqProfilesSinceCutover(mode: RfqIntakeMode) {
  const cutover = cutoverIso();
  if (!cutover) {
    return {
      enabled: false,
      reason: "KLAVIYO_RFQ_SYNC_CUTOVER_AT is not configured; RFQ recovery is fail-closed.",
      scanned: 0,
      eligible: 0,
      applied: 0,
      skipped: 0,
      errors: [] as Array<{ profileId: string; error: string }>,
      results: [] as Array<Record<string, unknown>>,
    };
  }

  const ids = await recentProfileIds(cutover);
  const results: Array<Record<string, unknown>> = [];
  const errors: Array<{ profileId: string; error: string }> = [];
  let eligible = 0;
  let skipped = 0;

  for (const profileId of ids) {
    try {
      const result = await processWebsiteRfqProfile(profileId, mode);
      eligible += 1;
      results.push(result as Record<string, unknown>);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown RFQ recovery error.";
      if (message === "Profile is not recognisable as an approved website RFQ submission.") {
        skipped += 1;
        continue;
      }
      errors.push({ profileId, error: message });
    }
  }

  return {
    enabled: true,
    cutover,
    scanned: ids.length,
    eligible,
    applied: mode === "apply" ? results.length : 0,
    skipped,
    errors,
    results,
  };
}
