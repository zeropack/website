import type { Metadata } from "next";
import { buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { RegionalHome } from "@/components/page-sections/RegionalHome";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("au").seo.home?.title ?? "Zero Pack Australia",
  description: getRegionConfig("au").seo.home?.description ?? "",
  path: "/au/",
  hreflang: regionHomeHreflang(),
});

export default function Page() {
  return <RegionalHome region="au" />;
}
