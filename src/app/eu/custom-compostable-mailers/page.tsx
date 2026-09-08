import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, mailersHreflang } from "@/lib/metadata";
import { MailersLanding } from "@/components/page-sections/MailersLanding";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("eu").seo.mailers?.title ?? "Custom Compostable Mailers EU | Zero Pack",
  description: getRegionConfig("eu").seo.mailers?.description ?? "",
  path: "/eu/custom-compostable-mailers/",
  canonicalUrl: buildMarketCanonical("eu", "/custom-compostable-mailers"),
  hreflang: mailersHreflang(),
  locale: "en",
});

export default function Page() {
  return <MailersLanding variant="eu" />;
}
