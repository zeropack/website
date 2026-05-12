import type { Metadata } from "next";
import { buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { RegionalHome } from "@/components/page-sections/RegionalHome";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("us").seo.home?.title ?? "Zero Pack US",
  description: getRegionConfig("us").seo.home?.description ?? "",
  path: "/us/",
  hreflang: regionHomeHreflang(),
});

export default function Page() {
  return <RegionalHome region="us" />;
}
