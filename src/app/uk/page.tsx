import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { RegionalHome } from "@/components/page-sections/RegionalHome";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("uk").seo.home?.title ?? "Zero Pack UK",
  description: getRegionConfig("uk").seo.home?.description ?? "",
  path: "/uk/",
  canonicalUrl: buildMarketCanonical("uk", "/"),
  hreflang: regionHomeHreflang(),
  locale: "en-GB",
});

export default function Page() {
  return <RegionalHome region="uk" />;
}
