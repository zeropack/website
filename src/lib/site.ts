export const SITE_NAME = "Zero Pack";

/** Google Analytics 4 measurement ID (gtag.js). */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-KTC9QG7ZD5";

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "enquiries@zeropack.co";

/** Canonical custom compostable mailers landing page. */
export const TREND_PACKAGING_FUNNEL_HREF = "/custom-compostable-mailers/";

/** Primary quote CTA — Typeform on the canonical custom mailers page. */
export const QUOTE_FORM_HREF = "/custom-compostable-mailers/#quoteform";

export function getSiteUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return base && base.length > 0 ? base : "https://zeropack.co";
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSiteUrl();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}
