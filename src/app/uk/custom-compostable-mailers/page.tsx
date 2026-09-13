import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, mailersHreflang } from "@/lib/metadata";
import { PremiumMailerPage } from "@/components/page-sections/PremiumMailerPage";

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Mailers, Made for Your Brand | Zero Pack",
  description:
    "Custom printed compostable mailers made to order with custom sizing, branding and certified compostable material options for ecommerce shipping.",
  path: "/uk/custom-compostable-mailers/",
  canonicalUrl: buildMarketCanonical("uk", "/custom-compostable-mailers"),
  hreflang: mailersHreflang(),
  locale: "en-GB",
});

export default function Page() {
  return <PremiumMailerPage market="uk" />;
}
