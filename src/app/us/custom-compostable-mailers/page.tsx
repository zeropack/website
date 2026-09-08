import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, mailersHreflang } from "@/lib/metadata";
import { MailersLanding } from "@/components/page-sections/MailersLanding";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("us").seo.mailers?.title ?? "Custom Compostable Mailers US | Zero Pack",
  description: getRegionConfig("us").seo.mailers?.description ?? "",
  path: "/us/custom-compostable-mailers/",
  canonicalUrl: buildMarketCanonical("us", "/custom-compostable-mailers"),
  hreflang: mailersHreflang(),
  locale: "en-US",
});

export default function Page() {
  return <MailersLanding variant="us" />;
}
