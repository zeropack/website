import type { Metadata } from "next";
import { buildMetadata, mailersHreflang } from "@/lib/metadata";
import { MailersLanding } from "@/components/page-sections/MailersLanding";

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Mailers | Zero Pack",
  description:
    "Custom branded compostable mailers for ecommerce brands. Made to order, durable, waterproof and designed to help reduce reliance on conventional plastic packaging.",
  path: "/custom-compostable-mailers/",
  hreflang: mailersHreflang({
    au: "/au/custom-compostable-mailers/",
    uk: "/uk/custom-compostable-mailers/",
    us: "/us/custom-compostable-mailers/",
    eu: "/eu/custom-compostable-mailers/",
  }),
});

export default function Page() {
  return <MailersLanding variant="global" />;
}
