import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getRegionConfig } from "@/lib/regions";
import { CustomerShowcaseGrid } from "@/components/CustomerShowcaseGrid";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = buildMetadata({
  title: "Customer Showcase | Zero Pack",
  description:
    "Examples of custom compostable mailers and packaging for ecommerce-led brands.",
  path: "/customer-showcase/",
});

export default function Page() {
  const studies = [...getRegionConfig("au").caseStudies, ...getRegionConfig("uk").caseStudies];

  return (
    <section className="bg-stone py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Customer showcase</h1>
        <p className="mt-4 max-w-3xl text-lg text-charcoal/75">
          Representative examples of how brands brief custom mailers and related packaging across categories.
        </p>
        <div className="mt-10">
          <CustomerShowcaseGrid studies={studies} />
        </div>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/quote/" variant="primary">
            Request Similar Packaging
          </CTAButton>
          <CTAButton href="/custom-compostable-mailers/" variant="secondary">
            Explore custom mailers
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
