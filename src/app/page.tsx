import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { GlobalHome } from "@/components/page-sections/GlobalHome";

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Mailers for Ecommerce Brands",
  description:
    "Zero Pack (zeropack.co) supplies made-to-order custom compostable mailers for ecommerce brands worldwide, with clear certification guidance, practical MOQs and quote-based pricing.",
  path: "/",
  canonicalUrl: buildMarketCanonical("global", "/"),
  hreflang: regionHomeHreflang(),
  locale: "en",
});

export default function Page() {
  return <GlobalHome />;
}
