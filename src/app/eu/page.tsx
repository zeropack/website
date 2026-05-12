import type { Metadata } from "next";
import { buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { RegionalHome } from "@/components/page-sections/RegionalHome";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("eu").seo.home?.title ?? "Zero Pack EU",
  description: getRegionConfig("eu").seo.home?.description ?? "",
  path: "/eu/",
  hreflang: regionHomeHreflang(),
});

export default function Page() {
  return <RegionalHome region="eu" />;
}
