import { NextResponse } from "next/server";

import { KLAVIYO_API_REVISION } from "@/lib/integrations/klaviyo-monday/config";

const TARGET_FORM_IDS = ["R8WtWh", "Rw5KwJ", "RkPePW"];

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function klaviyo<T>(path: string): Promise<T> {
  const response = await fetch(`https://a.klaviyo.com${path}`, {
    headers: {
      Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Klaviyo forms API ${response.status}: ${(await response.text()).slice(0, 800)}`);
  }
  return (await response.json()) as T;
}

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const list = await klaviyo<{ data: any[] }>(
      "/api/forms?page[size]=100&fields[form]=id,name,status,updated_at",
    );
    const targets = [];
    for (const id of TARGET_FORM_IDS) {
      const detail = await klaviyo<{ data: any }>(
        `/api/forms/${id}?fields[form]=id,name,status,updated_at,definition`,
      );
      targets.push(detail.data);
    }
    return NextResponse.json(
      {
        ok: true,
        list: list.data.map((item) => ({
          id: item.id,
          name: item.attributes?.name,
          status: item.attributes?.status,
          updatedAt: item.attributes?.updated_at,
        })),
        targets,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Diagnostic failed." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
