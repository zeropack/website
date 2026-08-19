const API_BASE = "https://a.klaviyo.com/api";
const REVISION = "2026-07-15";
const EXPECTED_PUBLIC_KEY = "RAUuib";
const TEST_EXTERNAL_ID = "zeropack-klaviyo-commissioning-v1";

const privateKey = process.env.KLAVIYO_PRIVATE_API_KEY;

if (!process.env.VERCEL) {
  console.log("KLAVIYO_COMMISSIONING skipped outside Vercel");
  process.exit(0);
}

if (!privateKey) {
  throw new Error("KLAVIYO_PRIVATE_API_KEY is not configured in this Vercel environment");
}

async function klaviyoRequest(path, init = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Klaviyo-API-Key ${privateKey}`,
      accept: "application/vnd.api+json",
      revision: REVISION,
      ...(init.body ? { "content-type": "application/vnd.api+json" } : {}),
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail = body?.errors?.map((error) => error?.detail || error?.title).filter(Boolean).join("; ");
    throw new Error(`Klaviyo ${path} failed (${response.status})${detail ? `: ${detail}` : ""}`);
  }

  return { status: response.status, body };
}

async function klaviyoGet(path) {
  return (await klaviyoRequest(path)).body;
}

const accounts = await klaviyoGet("/accounts");
const account = accounts?.data?.[0];
if (!account?.id) {
  throw new Error("Klaviyo account lookup returned no account");
}

const attributes = account.attributes || {};
const returnedPublicKey =
  attributes.public_api_key ||
  attributes.public_api_key_id ||
  attributes.public_key ||
  attributes.site_id ||
  null;

if (returnedPublicKey && returnedPublicKey !== EXPECTED_PUBLIC_KEY) {
  throw new Error(`Klaviyo Site ID mismatch: expected ${EXPECTED_PUBLIC_KEY}, received ${returnedPublicKey}`);
}

const profiles = await klaviyoGet("/profiles?page[size]=1&additional-fields[profile]=subscriptions");

const testProfilePayload = JSON.stringify({
  data: {
    type: "profile",
    attributes: {
      external_id: TEST_EXTERNAL_ID,
      properties: {
        zero_pack_integration_test: true,
        zero_pack_integration_source: "vercel-commissioning",
      },
    },
  },
});

const firstUpsert = await klaviyoRequest("/profile-import", {
  method: "POST",
  body: testProfilePayload,
});
const firstProfile = firstUpsert.body?.data;
if (!firstProfile?.id) {
  throw new Error("Klaviyo test profile first upsert returned no profile ID");
}

const secondUpsert = await klaviyoRequest("/profile-import", {
  method: "POST",
  body: testProfilePayload,
});
const secondProfile = secondUpsert.body?.data;
if (!secondProfile?.id) {
  throw new Error("Klaviyo test profile second upsert returned no profile ID");
}

if (firstProfile.id !== secondProfile.id) {
  throw new Error(`Klaviyo profile idempotency failed: ${firstProfile.id} != ${secondProfile.id}`);
}

if (secondProfile.attributes?.email || secondProfile.attributes?.phone_number) {
  throw new Error("Commissioning test profile unexpectedly became contactable");
}

console.log(
  "KLAVIYO_COMMISSIONING_RESULT",
  JSON.stringify({
    status: "authenticated-read-and-idempotent-profile-upsert-passed",
    revision: REVISION,
    accountId: account.id,
    accountName: attributes.contact_information?.organization_name || attributes.organization_name || null,
    timezone: attributes.timezone || null,
    currency: attributes.preferred_currency || attributes.currency || null,
    publicApiKey: returnedPublicKey,
    expectedPublicApiKey: EXPECTED_PUBLIC_KEY,
    profileReadPassed: Array.isArray(profiles?.data),
    returnedProfileCount: Array.isArray(profiles?.data) ? profiles.data.length : null,
    testExternalId: TEST_EXTERNAL_ID,
    testProfileId: firstProfile.id,
    firstUpsertStatus: firstUpsert.status,
    secondUpsertStatus: secondUpsert.status,
    idempotent: true,
    contactable: false,
  }),
);
