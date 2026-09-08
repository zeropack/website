import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { GlobalHome } from "@/components/page-sections/GlobalHome";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("au").seo.home?.title ?? "Zero Pack Australia",
  description: getRegionConfig("au").seo.home?.description ?? "",
  path: "/au/",
  canonicalUrl: buildMarketCanonical("au", "/"),
  hreflang: regionHomeHreflang(),
  locale: "en-AU",
});

export default function Page() {
  return <GlobalHome market="au" />;
}
