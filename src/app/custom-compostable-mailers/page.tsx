import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, mailersHreflang } from "@/lib/metadata";
import { PremiumMailerPage } from "@/components/page-sections/PremiumMailerPage";
import { CertificationRequestPanel } from "@/components/CertificationRequestPanel";

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Mailers | Premium Unboxing for Ecommerce Brands",
  description:
    "Custom compostable mailers for ecommerce brands that want premium unboxing, credible certification and a made-to-order quote process.",
  path: "/custom-compostable-mailers/",
  canonicalUrl: buildMarketCanonical("global", "/custom-compostable-mailers"),
  hreflang: mailersHreflang(),
  locale: "en",
});

export default function Page() {
  return (
    <>
      <PremiumMailerPage market="global" />
      <CertificationRequestPanel market="global" />
    </>
  );
}
