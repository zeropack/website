import type { Metadata } from "next";
import { absoluteUrl } from "./site";
import { buildMarketUrl, launchedMarketAlternates } from "./marketRouting";
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
  // The root layout appends "| Zero Pack" to normal titles. If the supplied title already
  // names Zero Pack, make it absolute so we do not render "| Zero Pack | Zero Pack".
  const title = /zero pack/i.test(opts.title) ? { absolute: opts.title } : opts.title;

  return {
    title,
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

/** Hreflang for launched regional home routes across canonical market origins. */
export function regionHomeHreflang(): HreflangSpec {
  return launchedMarketAlternates("/");
}

/** Common hreflang for the launched mailers landing family. */
export function mailersHreflang(_pathByRegion?: Record<RegionCode, string>): HreflangSpec {
  return launchedMarketAlternates("/custom-compostable-mailers");
}
