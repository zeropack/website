import { KLAVIYO_API_REVISION } from "./config";

const RESPONSE_PROPERTY = "Last Typeform RFQ Response ID";
const LEAD_PROPERTY = "Last Typeform RFQ Lead ID";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function klaviyo<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://a.klaviyo.com${path}`, {
    ...init,
    headers: {
      Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
      "Content-Type": "application/vnd.api+json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Klaviyo RFQ idempotency error ${response.status}: ${body.slice(0, 600)}`);
  }
  if (response.status === 202 || response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function processingState(profile: {
  id: string;
  attributes?: { properties?: Record<string, unknown> };
}) {
  const properties = profile.attributes?.properties || {};
  return {
    profileId: String(profile.id),
    responseId:
      typeof properties[RESPONSE_PROPERTY] === "string"
        ? String(properties[RESPONSE_PROPERTY])
        : null,
    leadId:
      typeof properties[LEAD_PROPERTY] === "string"
        ? String(properties[LEAD_PROPERTY])
        : null,
  };
}

export async function findProcessedTypeformRfqByEmail(email: string) {
  const params = new URLSearchParams({
    filter: `equals(email,"${email.replaceAll('"', '\\"')}")`,
  });
  const payload = await klaviyo<{
    data: Array<{ id: string; attributes?: { properties?: Record<string, unknown> } }>;
  }>(`/api/profiles?${params.toString()}`);
  if (payload.data.length === 0) return null;
  if (payload.data.length > 1) {
    throw new Error(`Multiple Klaviyo profiles found for ${email}; refusing RFQ idempotency check.`);
  }
  return processingState(payload.data[0]);
}

export async function readProcessedTypeformRfq(profileId: string) {
  const payload = await klaviyo<{
    data: { id: string; attributes?: { properties?: Record<string, unknown> } };
  }>(`/api/profiles/${encodeURIComponent(profileId)}`);
  return processingState(payload.data);
}

export async function stampProcessedTypeformRfq(params: {
  profileId: string;
  responseId: string;
  leadId?: string | null;
}) {
  const properties: Record<string, string> = {
    [RESPONSE_PROPERTY]: params.responseId,
  };
  if (params.leadId) properties[LEAD_PROPERTY] = params.leadId;

  await klaviyo(`/api/profiles/${encodeURIComponent(params.profileId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "profile",
        id: params.profileId,
        attributes: { properties },
      },
    }),
  });
}
