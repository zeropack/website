"use client";

const FT = "zp_ft_attribution";
const LT = "zp_lt_attribution";

export type AttributionPayload = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function captureUtmFromUrl(): AttributionPayload {
  if (typeof window === "undefined") return {};
  const u = new URL(window.location.href);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
  const out: AttributionPayload = {};
  for (const k of keys) {
    const v = u.searchParams.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function persistAttribution(current: AttributionPayload) {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(current);
  try {
    if (!window.localStorage.getItem(FT) && Object.keys(current).length > 0) {
      window.localStorage.setItem(FT, json);
    }
    if (Object.keys(current).length > 0) {
      window.localStorage.setItem(LT, json);
    }
  } catch {
    /* ignore quota */
  }
}

export function readStoredAttribution(): { first?: string; last?: string } {
  if (typeof window === "undefined") return {};
  try {
    return {
      first: window.localStorage.getItem(FT) ?? undefined,
      last: window.localStorage.getItem(LT) ?? undefined,
    };
  } catch {
    return {};
  }
}
