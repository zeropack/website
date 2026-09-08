import type { Metadata } from "next";
import { buildMarketCanonical, buildMetadata, mailersHreflang } from "@/lib/metadata";
import { MailersLanding } from "@/components/page-sections/MailersLanding";

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Mailers | Zero Pack",
  description:
    "Custom branded compostable mailers for ecommerce brands. Made to order, durable, waterproof and designed to help reduce reliance on conventional plastic packaging.",
  path: "/custom-compostable-mailers/",
  canonicalUrl: buildMarketCanonical("global", "/custom-compostable-mailers"),
  hreflang: mailersHreflang(),
  locale: "en",
});

export default function Page() {
  return <MailersLanding variant="global" />;
}
