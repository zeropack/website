import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { GlobalHome } from "@/components/page-sections/GlobalHome";

export const metadata: Metadata = buildMetadata({
  title: "Custom compostable packaging, made for your brand | Zero Pack",
  description:
    "Zero Pack works with businesses to develop custom compostable packaging that combines brand presentation, practical performance and a credible move away from conventional plastic.",
  path: "/uk/",
  canonicalUrl: buildMarketCanonical("uk", "/"),
  hreflang: regionHomeHreflang(),
  locale: "en-GB",
});

export default function Page() {
  return <GlobalHome market="uk" />;
}
