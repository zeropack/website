import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getRegionConfig } from "@/lib/regions";
import { TrackedOutbound } from "@/components/TrackedOutbound";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = buildMetadata({
  title: "Contact Zero Pack",
  description: "Contact Zero Pack for custom compostable mailers and packaging — B2B support for AU and UK.",
  path: "/contact/",
});

export default function Page() {
  const au = getRegionConfig("au");
  const uk = getRegionConfig("uk");

  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Contact</h1>
        <p className="mt-4 text-charcoal/75">
          For the fastest response on pricing and specifications, use the{" "}
          <a className="font-semibold text-air hover:underline" href="/quote/">
            quote form
          </a>
          . Use this page for direct routing questions or partnerships.
        </p>

        <div className="mt-10 space-y-8">
          <div className="rounded-2xl border border-black/5 bg-stone p-6">
            <h2 className="font-heading text-lg font-semibold text-compost">Australia</h2>
            <p className="mt-2 text-sm text-charcoal/75">
              Email:{" "}
              <TrackedOutbound
                className="font-semibold text-air hover:underline"
                href={`mailto:${au.quoteEmail}`}
                event="outbound_email_click"
              >
                {au.quoteEmail}
              </TrackedOutbound>
            </p>
            {au.phone ? (
              <p className="mt-2 text-sm text-charcoal/75">
                Phone:{" "}
                <TrackedOutbound className="font-semibold text-air hover:underline" href={`tel:${au.phone}`} event="phone_click">
                  {au.phone}
                </TrackedOutbound>
              </p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-black/5 bg-stone p-6">
            <h2 className="font-heading text-lg font-semibold text-compost">United Kingdom</h2>
            <p className="mt-2 text-sm text-charcoal/75">
              Email:{" "}
              <TrackedOutbound
                className="font-semibold text-air hover:underline"
                href={`mailto:${uk.quoteEmail}`}
                event="outbound_email_click"
              >
                {uk.quoteEmail}
              </TrackedOutbound>
            </p>
            {uk.phone ? (
              <p className="mt-2 text-sm text-charcoal/75">
                Phone:{" "}
                <TrackedOutbound className="font-semibold text-air hover:underline" href={`tel:${uk.phone}`} event="phone_click">
                  {uk.phone}
                </TrackedOutbound>
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/quote/" variant="primary">
            Get a Custom Quote
          </CTAButton>
          <CTAButton href="/packaging-guide/" variant="secondary">
            Get the Guide
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
