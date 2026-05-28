export const SITE_NAME = "Zero Pack";

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "enquiries@zeropack.co";

/** Trend packaging funnel landing page. */
export const TREND_PACKAGING_FUNNEL_HREF = "/trend-packaging-funnel/";

/** Primary quote CTA — Typeform on the trend packaging funnel landing page. */
export const QUOTE_FORM_HREF = "/trend-packaging-funnel#quoteform";

export function getSiteUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return base && base.length > 0 ? base : "https://zeropack.co";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}
