import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, mailersHreflang } from "@/lib/metadata";
import { PremiumMailerPage } from "@/components/page-sections/PremiumMailerPage";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("au").seo.mailers?.title ?? "Custom Compostable Mailers Australia | Zero Pack",
  description:
    getRegionConfig("au").seo.mailers?.description ??
    "Create custom branded compostable mailers for your business.",
  path: "/au/custom-compostable-mailers/",
  canonicalUrl: buildMarketCanonical("au", "/custom-compostable-mailers"),
  hreflang: mailersHreflang(),
  locale: "en-AU",
});

export default function Page() {
  return <PremiumMailerPage market="au" />;
}
