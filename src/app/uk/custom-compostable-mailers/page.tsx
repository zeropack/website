import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, mailersHreflang } from "@/lib/metadata";
import { MailersLanding } from "@/components/page-sections/MailersLanding";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("uk").seo.mailers?.title ?? "Custom Compostable Mailers UK | Zero Pack",
  description:
    getRegionConfig("uk").seo.mailers?.description ??
    "Custom branded compostable mailers for UK ecommerce brands.",
  path: "/uk/custom-compostable-mailers/",
  canonicalUrl: buildMarketCanonical("uk", "/custom-compostable-mailers"),
  hreflang: mailersHreflang(),
  locale: "en-GB",
});

export default function Page() {
  return <MailersLanding variant="uk" />;
}
