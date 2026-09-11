import type { Metadata } from "next";
import { TrackedOutbound } from "@/components/TrackedOutbound";
import { CTAButton } from "@/components/CTAButton";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { KlaviyoEmbed } from "@/components/KlaviyoEmbed";
import { CONTACT_EMAIL, QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/contact/";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const description =
    market === "uk"
      ? "Contact Zero Pack for custom compostable mailers and packaging for UK ecommerce brands, with Australia-based project support and made-to-order production."
      : market === "au"
        ? "Contact Zero Pack for custom compostable mailers and packaging for Australian ecommerce brands."
        : "Contact Zero Pack for custom compostable mailers and packaging — global B2B support for ecommerce brands.";

  return buildMarketPageMetadata({ market, title: "Contact Zero Pack", description, path });
}

export default async function Page() {
  const market = await getRequestMarket();
  const marketNote =
    market === "uk"
      ? "We support UK customers directly from Australia. Share your planned volumes, required delivery timing and packaging goals so we can confirm the production and freight assumptions for your quote."
      : market === "au"
        ? "Australian customers work directly with the Zero Pack team. Share your volumes, timing and packaging goals and we will confirm the right next step for your specification."
        : "We work with ecommerce brands globally. Share your market, volumes and packaging goals — we will confirm what is possible for your specification and freight route.";

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

        <KlaviyoEmbed formId="RkPePW" className="mt-10" />

        <div id="calendly" className="mt-12">
          <h2 className="font-heading text-xl font-semibold text-charcoal">Book a call</h2>
          <p className="mt-2 text-sm text-charcoal/75">
            Pick a time that suits you and we will talk through your packaging requirements.
          </p>
          <CalendlyEmbed className="mt-6" />
        </div>

        <div className="mt-8 rounded-2xl border border-black/5 bg-stone p-6">
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
          <p className="mt-3 text-sm text-charcoal/70">{marketNote}</p>
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
