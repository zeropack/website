import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { QUOTE_FORM_HREF } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Zero Pack",
  description:
    "Zero Pack is a specialist B2B custom compostable packaging supplier for ecommerce brands, with made-to-order production sold through custom quotes.",
  path: "/about/",
});

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">About Zero Pack</h1>
        <p className="mt-6 text-lg text-charcoal/75">
          Zero Pack is a specialist B2B supplier focused on made-to-order custom compostable packaging for businesses
          that ship physical products — especially{" "}
          <a className="font-semibold text-air hover:underline" href="/custom-compostable-mailers/">
            custom compostable mailers
          </a>{" "}
          for ecommerce brands.
        </p>
        <p className="mt-4 text-charcoal/75">
          Zero Pack is intentionally premium, commercial and focused: made-to-order packaging sold through custom
          quotes, not retail checkout.
        </p>
        <p className="mt-4 text-charcoal/75">
          Operations and sales support ecommerce brands globally, with production made to order through manufacturing
          partners and freight confirmed during quoting.
        </p>
        <p className="mt-4 font-heading text-lg font-semibold text-compost">
          Custom compostable packaging, made for brands that care what they send out.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CTAButton href={QUOTE_FORM_HREF} variant="primary">
            Get a Custom Quote
          </CTAButton>
          <CTAButton href="/how-it-works/" variant="secondary">
            How it works
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
