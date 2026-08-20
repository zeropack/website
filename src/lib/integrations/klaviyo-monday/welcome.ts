import { KLAVIYO_API_REVISION } from "./config";

export const KLAVIYO_WELCOME_STATUS_PROPERTY = "Welcome Status";

export type WelcomeStatus = "No" | "In Progress" | "Yes" | "Exempt" | "Exited";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function shouldExitWelcome(status: unknown): boolean {
  return status === "No" || status === "In Progress";
}

export async function markWelcomeExitedIfInProgress(
  profileId: string,
): Promise<boolean> {
  const response = await fetch(`https://a.klaviyo.com/api/profiles/${profileId}`, {
    headers: {
      Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Klaviyo API error ${response.status}: ${body.slice(0, 600)}`);
  }

  const payload = (await response.json()) as {
    data?: {
      attributes?: {
        properties?: Record<string, unknown>;
      };
    };
  };
  const status = payload.data?.attributes?.properties?.[KLAVIYO_WELCOME_STATUS_PROPERTY];
  if (!shouldExitWelcome(status)) return false;

  const update = await fetch(`https://a.klaviyo.com/api/profiles/${profileId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "profile",
        id: profileId,
        attributes: {
          properties: {
            [KLAVIYO_WELCOME_STATUS_PROPERTY]: "Exited",
          },
        },
      },
    }),
    cache: "no-store",
  });

  if (!update.ok) {
    const body = await update.text();
    throw new Error(`Klaviyo API error ${update.status}: ${body.slice(0, 600)}`);
  }

  return true;
}
