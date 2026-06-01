import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { CustomMailerCarousel } from "@/components/CustomMailerCarousel";
import { SiteImage } from "@/components/SiteImage";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { PackagingPathSteps } from "@/components/PackagingPathSteps";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { globalHomeFaqs } from "@/content/global/faqs";
import { packagingSlidesForCarousel } from "@/content/packagingCarouselSlides";
import imgShoppingBags from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (15).png";
import imgGroceryBags from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (13).png";
import imgGarmentBags from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (17).png";
import imgStandupPouches from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (12).png";

const morePackagingOptions = [
  {
    t: "Shopping bags",
    d: "Retail-facing formats for brands that want consistency with their shipping packaging story.",
    image: imgShoppingBags,
  },
  {
    t: "Garment bags",
    d: "Apparel workflows often need both mailers and internal garment protection — specified together.",
    image: imgGarmentBags,
  },
  {
    t: "Grocery bags",
    d: "Perfect for grocery stores and supermarkets. Tougher and more durable than paper bags.",
    image: imgGroceryBags,
  },
  {
    t: "Stand up pouches",
    d: "Perfect for food and coffee products. Resealable, they are a great alternative to plastic pouches.",
    image: imgStandupPouches,
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Packaging | Zero Pack",
  description:
    "Broader custom compostable packaging beyond mailers: shopping bags, garment bags and campaign packaging — always quoted to order.",
  path: "/custom-compostable-packaging/",
});

export default function Page() {
  return (
    <>
      <FAQSchema items={globalHomeFaqs} />
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-compost">Custom compostable packaging</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
              Need more than custom compostable mailers?
            </h1>
            <p className="mt-5 text-lg text-charcoal/75">
              Whilst{" "}
              <a className="font-semibold text-air hover:underline" href="/trend-packaging-funnel/">
                custom mailers
              </a>{" "}
              are the primary product for ecommerce shipping, we offer a wider range of custom compostable packaging to
              meet your needs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                Get a Custom Quote
              </CTAButton>
              <CTAButton href="/customer-showcase/" variant="secondary">
                View Customer Showcase
              </CTAButton>
            </div>
          </div>
          <CustomMailerCarousel
            slides={packagingSlidesForCarousel()}
            variant="climate"
            permanentCaption
          />
        </div>
      </section>
      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">More Custom Compostable Options</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {morePackagingOptions.map((x) => (
              <div key={x.t} className="rounded-2xl border border-black/5 bg-white p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-slate-200/70 bg-mist shadow-sm">
                    <SiteImage
                      src={x.image}
                      alt={x.t}
                      width={x.image.width}
                      height={x.image.height}
                      sizes="112px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-compost">{x.t}</h3>
                    <p className="mt-2 text-sm text-charcoal/75">{x.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PackagingPathSteps variant="dark" standalone />

      <LeadMagnetBlock />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal">FAQ</h2>
          <div className="mt-6">
            <FAQAccordion items={globalHomeFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}
