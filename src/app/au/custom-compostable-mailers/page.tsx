import type { Metadata } from "next";
import { buildMetadata, mailersHreflang } from "@/lib/metadata";
import { MailersLanding } from "@/components/page-sections/MailersLanding";
import { getRegionConfig } from "@/lib/regions";

export const metadata: Metadata = buildMetadata({
  title: getRegionConfig("au").seo.mailers?.title ?? "Custom Compostable Mailers Australia | Zero Pack",
  description:
    getRegionConfig("au").seo.mailers?.description ??
    "Create custom branded compostable mailers for your business.",
  path: "/au/custom-compostable-mailers/",
  hreflang: mailersHreflang({
    au: "/au/custom-compostable-mailers/",
    uk: "/uk/custom-compostable-mailers/",
    us: "/us/custom-compostable-mailers/",
    eu: "/eu/custom-compostable-mailers/",
  }),
});

export default function Page() {
  return <MailersLanding variant="au" />;
}
