"use client";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushDataLayer(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/** Hooks for Ads / Meta / LinkedIn — fire alongside dataLayer when IDs exist */
export function fireOptionalPixels(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  const w = window as unknown as Record<string, unknown>;
  if (process.env.NEXT_PUBLIC_GADS_SEND_TO && eventName === "quote_form_submit") {
    // gtag conversion example — only if gtag loaded by site owner
    const gtag = w.gtag as ((...args: unknown[]) => void) | undefined;
    if (typeof gtag === "function") {
      gtag("event", "conversion", {
        send_to: process.env.NEXT_PUBLIC_GADS_SEND_TO,
        ...params,
      });
    }
  }
  const fbq = w.fbq as ((...args: unknown[]) => void) | undefined;
  if (typeof fbq === "function" && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
    fbq("track", "Lead", params);
  }
  const lintrk = w._linkedin_data_partner_ids as unknown;
  if (lintrk && process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID) {
    // Partner typically loads insight.min.js separately
    void lintrk;
  }
}
