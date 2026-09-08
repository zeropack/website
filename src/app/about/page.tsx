import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";
import { FounderStorySection } from "@/components/FounderStorySection";
import { aboutZeroPack } from "@/content/about/about";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/about/";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return buildMarketPageMetadata({
    market,
    title: "About Zero Pack",
    description:
      "Zero Pack is a specialist B2B custom compostable packaging supplier for ecommerce brands, with made-to-order production sold through custom quotes.",
    path,
  });
}

export default async function Page() {
  const market = await getRequestMarket();

  return (
    <>
      <section className="bg-white py-14 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">{aboutZeroPack.pageTitle}</h1>
          {aboutZeroPack.intro.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 0 ? "mt-6 text-lg text-charcoal/75" : "mt-4 text-charcoal/75"}
            >
              {index === 0 ? (
                <>
                  Zero Pack is a specialist B2B supplier focused on made-to-order custom compostable packaging for
                  businesses that ship physical products — especially{" "}
                  <a className="font-semibold text-air hover:underline" href="/custom-compostable-mailers/">
                    custom compostable mailers
                  </a>{" "}
                  for ecommerce brands.
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}
          {market === "uk" ? (
            <p className="mt-4 rounded-xl border border-slate-200/70 bg-stone p-4 text-sm text-charcoal/70">
              UK projects are supported directly by the Zero Pack team in Australia, with made-to-order production and
              delivery planning confirmed as part of the quote process.
            </p>
          ) : null}
          <p className="mt-4 font-heading text-lg font-semibold text-compost">{aboutZeroPack.tagline}</p>
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

      <FounderStorySection />
    </>
  );
}
