import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { TrackedOutbound } from "@/components/TrackedOutbound";
import { CTAButton } from "@/components/CTAButton";
import { MondayFormEmbed } from "@/components/MondayFormEmbed";
import { CONTACT_EMAIL, QUOTE_FORM_HREF } from "@/lib/site";

const MONDAY_FORM_SRC = "https://forms.monday.com/forms/embed/f1e66b3e59654992606729b712abfb30?r=apse2&utm_source=&utm_medium=&utm_campaign=&utm_content=";

export const metadata: Metadata = buildMetadata({
  title: "Contact Zero Pack",
  description: "Contact Zero Pack for custom compostable mailers and packaging — global B2B support for ecommerce brands.",
  path: "/contact/",
});

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Contact</h1>
        <p className="mt-4 text-charcoal/75">
          For the fastest response on pricing and specifications, use the{" "}
          <a className="font-semibold text-air hover:underline" href={QUOTE_FORM_HREF}>
            quote form
          </a>
          . Use this page for direct questions or partnerships.
        </p>

        <MondayFormEmbed src={MONDAY_FORM_SRC} className="mt-10" />

        <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-compost">Get in touch</h2>
          <p className="mt-2 text-sm text-charcoal/75">
            Email:{" "}
            <TrackedOutbound
              className="font-semibold text-air hover:underline"
              href={`mailto:${CONTACT_EMAIL}`}
              event="outbound_email_click"
            >
              {CONTACT_EMAIL}
            </TrackedOutbound>
          </p>
          <p className="mt-3 text-sm text-charcoal/70">
            We work with ecommerce brands globally. Share your market, volumes and packaging goals — we will confirm
            what is possible for your specification and freight route.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CTAButton href={QUOTE_FORM_HREF} variant="primary">
            Get a Custom Quote
          </CTAButton>
          <CTAButton href="/packaging-guide/download/" variant="secondary">
            Download the Guide
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
