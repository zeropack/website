const API_BASE = "https://a.klaviyo.com/api";
const REVISION = "2026-07-15";
const EXPECTED_PUBLIC_KEY = "RAUuib";

const privateKey = process.env.KLAVIYO_PRIVATE_API_KEY;

if (!process.env.VERCEL) {
  console.log("KLAVIYO_COMMISSIONING skipped outside Vercel");
  process.exit(0);
}

if (!privateKey) {
  throw new Error("KLAVIYO_PRIVATE_API_KEY is not configured in this Vercel environment");
}

async function klaviyoGet(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Klaviyo-API-Key ${privateKey}`,
      accept: "application/vnd.api+json",
      revision: REVISION,
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

  return body;
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

console.log(
  "KLAVIYO_COMMISSIONING_RESULT",
  JSON.stringify({
    status: "authenticated-read-passed",
    revision: REVISION,
    accountId: account.id,
    accountName: attributes.contact_information?.organization_name || attributes.organization_name || null,
    timezone: attributes.timezone || null,
    currency: attributes.preferred_currency || attributes.currency || null,
    publicApiKey: returnedPublicKey,
    expectedPublicApiKey: EXPECTED_PUBLIC_KEY,
    profileReadPassed: Array.isArray(profiles?.data),
    returnedProfileCount: Array.isArray(profiles?.data) ? profiles.data.length : null,
  }),
);
