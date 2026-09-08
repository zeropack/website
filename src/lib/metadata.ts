import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl } from "./site";
import { buildMarketUrl, marketAlternates } from "./marketRouting";
import type { MarketCode } from "./marketRouting";
import type { RegionCode } from "./types";

const DEFAULT_OG_IMAGE = "/og/default.png";

export type HreflangSpec = Partial<Record<string, string>>;

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  canonicalUrl?: string;
  hreflang?: HreflangSpec;
  ogImagePath?: string;
  openGraphType?: "website" | "article";
  locale?: string;
}): Metadata {
  const url = opts.canonicalUrl ?? absoluteUrl(opts.path);
  const metadataOrigin = new URL(url).origin;
  const ogPath = opts.ogImagePath ?? DEFAULT_OG_IMAGE;
  const og = /^https?:\/\//i.test(ogPath) ? ogPath : `${metadataOrigin}${ogPath.startsWith("/") ? ogPath : `/${ogPath}`}`;

  return {
    title: opts.title,
    description: opts.description,
    metadataBase: new URL(metadataOrigin),
    alternates: {
      canonical: url,
      languages: opts.hreflang,
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "Zero Pack",
      locale: opts.locale ?? "en",
      type: opts.openGraphType ?? "website",
      images: [{ url: og }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [og],
    },
  };
}

export function buildMarketCanonical(market: MarketCode, path = "/"): string {
  return buildMarketUrl(market, path);
}

/** Hreflang for regional home routes across canonical market origins. */
export function regionHomeHreflang(): HreflangSpec {
  return marketAlternates("/");
}

/** Common hreflang for mailers landing family across canonical market origins. */
export function mailersHreflang(_pathByRegion?: Record<RegionCode, string>): HreflangSpec {
  return marketAlternates("/custom-compostable-mailers");
}
