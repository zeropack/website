import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl } from "./site";
import type { RegionCode } from "./types";

const DEFAULT_OG_IMAGE = "/og/default.png";

export type HreflangSpec = Partial<Record<string, string>>;

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  hreflang?: HreflangSpec;
  ogImagePath?: string;
  openGraphType?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(opts.path);
  const ogPath = opts.ogImagePath ?? DEFAULT_OG_IMAGE;
  const og = absoluteUrl(ogPath);
  return {
    title: opts.title,
    description: opts.description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: url,
      languages: opts.hreflang,
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "Zero Pack",
      locale: "en",
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

/** Hreflang for regional home routes */
export function regionHomeHreflang(): HreflangSpec {
  return {
    "en-AU": absoluteUrl("/au/"),
    "en-GB": absoluteUrl("/uk/"),
    "en-US": absoluteUrl("/us/"),
    "en": absoluteUrl("/eu/"),
    "x-default": absoluteUrl("/"),
  };
}

/** Common hreflang for mailers landing family */
export function mailersHreflang(pathByRegion: Record<RegionCode, string>): HreflangSpec {
  return {
    "en-AU": absoluteUrl(pathByRegion.au),
    "en-GB": absoluteUrl(pathByRegion.uk),
    "en-US": absoluteUrl(pathByRegion.us),
    "en": absoluteUrl(pathByRegion.eu),
    "x-default": absoluteUrl("/custom-compostable-mailers/"),
  };
}
