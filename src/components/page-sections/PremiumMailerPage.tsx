import { SiteImage } from "@/components/SiteImage";
import { TypeformFormEmbed } from "@/components/TypeformFormEmbed";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { CustomMailerCarousel } from "@/components/CustomMailerCarousel";
import { PackagingPathSteps } from "@/components/PackagingPathSteps";
import { globalHomeFaqs } from "@/content/global/faqs";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";
import { getRegionConfig } from "@/lib/regions";
import brandDimple from "@/content/images/brands/dimple_logo.png";
import brandLahana from "@/content/images/brands/lahana.png";
import brandInfectious from "@/content/images/brands/infectious_clothing.webp";
import brandProvincial from "@/content/images/brands/provincial_home_living.avif";
import brandVinnies from "@/content/images/brands/st_vincent_dpaul_wa.png";
import brandWittner from "@/content/images/brands/wittner_5a84e8cc-515c-4ccf-aea9-53a8c344476b.avif";
import brandCartridges from "@/content/images/brands/cartridgesdirect.webp";
import brandYakeen from "@/content/images/brands/yakeen-logo.avif";
import jennyMartin from "@/content/images/icons/jenny_martin.png";
import stephenJones from "@/content/images/icons/stephen_jones.png";
import adamLander from "@/content/images/icons/adam_lander.png";

type PublicMarket = "global" | "au" | "uk";

const valueCards = [
  {
    title: "Better unboxing moments",
    body: "Turn every delivery into a premium first impression that feels intentional, branded, and worth sharing.",
  },
  {
    title: "Eco expectations, met",
    body: "Give customers a compostable packaging option backed by recognised certification for the relevant specification.",
  },
  {
    title: "Trend-led brand signal",
    body: "Stand out from generic mailers with packaging designed around your brand rather than pulled from stock.",
  },
];

const outcomes = [
  "Custom branded compostable mailers designed around your brand style",
  "Sizing guidance so parcels look premium and ship practically",
  "Print and colour direction matched to your customer experience goals",
  "Claim and certification guidance to keep environmental messaging credible",
  "Clear quote pathway across quantity, print, lead time, and freight",
  "Support for repeat production as you scale",
];

const reviews = [
  {
    quote:
      "I absolutely love the custom compostable packaging we ordered for our products! Not only does it perfectly showcase our brand identity, but it also aligns with our commitment to sustainability. It's a win-win for both our business and the environment.",
    name: "Jenny Martin",
    avatar: jennyMartin,
  },
  {
    quote:
      "The custom compostable packaging exceeded my expectations! The quality is top-notch, and the design looks fantastic. I appreciate that we can promote our brand while also minimizing our environmental impact. Will definitely reorder!",
    name: "Stephen Jones",
    avatar: stephenJones,
  },
  {
    quote:
      "I'm thoroughly impressed with the custom compostable packaging we received. It's durable, versatile, and the fact that it's compostable is the icing on the cake. It's rare to find packaging solutions that are both environmentally friendly and visually appealing.",
    name: "Adam Lander",
    avatar: adamLander,
  },
];

const customerBrands = [
  { name: "Dimple", logo: brandDimple },
  { name: "Lahana", logo: brandLahana },
  { name: "Infectious Clothing", logo: brandInfectious },
  { name: "Provincial Home Living", logo: brandProvincial },
  { name: "St Vincent de Paul (WA)", logo: brandVinnies },
  { name: "Wittner", logo: brandWittner },
  { name: "Cartridges Direct", logo: brandCartridges },
  { name: "Yakeen Safety", logo: brandYakeen },
];

const marketCopy: Record<
  PublicMarket,
  {
    heroTitle: string;
    heroSub: string;
    certificationMetric: string;
    certificationLabel: string;
    primaryCta: string;
    quoteHeading: string;
    quoteSub: string;
  }
> = {
  global: {
    heroTitle: "The Premium Mailer That Makes Your Brand Feel Viral-Ready",
    heroSub:
      "For brands that want every parcel to feel like a moment: custom branded compostable mailers that elevate unboxing, align with customer expectations, and build loyalty at first touch.",
    certificationMetric: "Certified AS5810",
    certificationLabel: "Independent home-compostability certification",
    primaryCta: "Request Custom Mailer Pricing",
    quoteHeading: "Ready to move to custom compostable mailers?",
    quoteSub:
      "Join the brands creating premium unboxing experiences while reducing reliance on conventional plastic packaging.",
  },
  au: {
    heroTitle: "The Premium Compostable Mailer Made for Australian Ecommerce Brands",
    heroSub:
      "Custom branded mailers designed around your artwork, sizing and fulfilment needs — with AS5810 home-compostability certification and Australian-based project support.",
    certificationMetric: "Certified AS5810",
    certificationLabel: "Independent home-compostability certification",
    primaryCta: "Request Custom Mailer Pricing",
    quoteHeading: "Ready to move to custom compostable mailers?",
    quoteSub:
      "Create a premium unboxing experience while moving away from conventional plastic mailers with a specification built around your brand.",
  },
  uk: {
    heroTitle: "The Premium Compostable Mailer Made for UK Ecommerce Brands",
    heroSub:
      "Custom branded mailers made to order for planned ecommerce fulfilment — backed by TÜV OK compost HOME and ABA AS 5810 home-compostability certification, with practical custom-production quantities and design support throughout the process.",
    certificationMetric: "TÜV + AS 5810",
    certificationLabel: "Multi-standard home-compostability proof",
    primaryCta: "Request Custom Mailer Pricing",
    quoteHeading: "Planning your next mailer order?",
    quoteSub:
      "Tell us what you ship, your quantity and your preferred timing. We’ll confirm the specification, production plan and delivery assumptions before anything starts.",
  },
};

export function PremiumMailerPage({ market = "global" }: { market?: PublicMarket }) {
  const copy = marketCopy[market];
  const faqItems = market === "global" ? globalHomeFaqs : getRegionConfig(market).faqs;
  const showRegionalTestimonials = market !== "uk";

  return (
    <div className="bg-white text-charcoal">
      <FAQSchema items={faqItems} />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#070b12] text-slate-100">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_52%,rgba(0,168,243,0.28),transparent_46%),radial-gradient(circle_at_78%_50%,rgba(131,185,37,0.22),transparent_44%),linear-gradient(160deg,#04070d_0%,#08111d_26%,#102a21_58%,#0a1713_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-air">Custom compostable mailers</p>
          <h1 className="mt-4 max-w-5xl font-heading text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-200/80 sm:text-xl">{copy.heroSub}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { metric: "750,000+", label: "Custom bags produced" },
              { metric: copy.certificationMetric, label: copy.certificationLabel },
              { metric: "Designed Your Way", label: "Free design help with your order" },
            ].map((item) => (
              <div key={item.metric} className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-heading text-2xl font-semibold text-white">{item.metric}</p>
                <p className="mt-1 text-sm text-slate-200/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/50 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {valueCards.map((card, idx) => (
              <div key={card.title} className="zp-hover-lift rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/20">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-air/35 bg-air/10 font-heading text-sm font-semibold text-air">
                  {idx + 1}
                </div>
                <p className="mt-4 font-heading text-2xl font-semibold text-charcoal">{card.title}</p>
                <p className="mt-2 text-sm text-charcoal/70">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-charcoal py-14 text-slate-100 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(0,168,243,0.12),transparent_38%),radial-gradient(circle_at_20%_65%,rgba(131,185,37,0.12),transparent_40%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-air">Brand presentation</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Join The Brands Customers Notice First
            </h2>
            <p className="mt-5 text-lg text-slate-200/80">
              Packaging is part of the product experience. Generic plastic can weaken a premium brand story before the product is even seen.
            </p>
            <p className="mt-4 text-slate-300/75">
              Custom compostable mailers give you control over artwork, sizing and presentation while providing a documented alternative to conventional plastic packaging.
            </p>
            <div className="mt-8">
              <a
                href="#quoteform"
                className="inline-flex items-center justify-center rounded-lg bg-air px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-air/90"
              >
                Create Packaging Like This
              </a>
            </div>
          </div>
          <CustomMailerCarousel slides={customMailerCarouselSlides} />
        </div>
      </section>

      <section className="border-b border-slate-200/50 bg-[#f4f8fb] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-7 shadow-sm shadow-slate-300/20 sm:p-9">
            <p className="font-heading text-2xl font-semibold text-charcoal">What you get with custom mailers</p>
            <ul className="mt-6 grid gap-4 text-sm text-charcoal/75 sm:grid-cols-2">
              {outcomes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-air" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {market === "uk" ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/20">
                <p className="text-sm font-semibold text-compost">Familiar UK proof</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-charcoal">TÜV OK compost HOME</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  A recognised third-party home-compostability certification mark familiar across Europe and useful for UK procurement and sustainability teams reviewing product claims.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/20">
                <p className="text-sm font-semibold text-compost">Additional technical proof</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-charcoal">ABA AS 5810 verification</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  AS 5810 adds a demanding home-compostability reference to the certification stack, including additional requirements such as worm-toxicity testing. Exact claims remain tied to the certified product specification.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-b border-slate-200/50 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Customer Brands</h2>
          <p className="mt-3 max-w-3xl text-charcoal/70">
            Brands that have trusted Zero Pack with custom compostable mailer solutions.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customerBrands.map((brand) => (
              <div
                key={brand.name}
                className="zp-hover-lift flex min-h-24 items-center justify-center rounded-2xl border border-slate-200/70 bg-white px-4 py-5 text-center shadow-sm shadow-slate-300/15"
              >
                <SiteImage
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={brand.logo.width}
                  height={brand.logo.height}
                  sizes="160px"
                  className="h-9 w-auto object-contain sm:h-10"
                />
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#quoteform"
              className="inline-flex items-center justify-center rounded-lg bg-air px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-air/90"
            >
              {copy.primaryCta}
            </a>
            <a
              href="/packaging-guide/download/"
              className="inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3 text-sm font-semibold text-compost hover:bg-mist"
            >
              Download the Packaging Guide
            </a>
          </div>
        </div>
      </section>

      {showRegionalTestimonials ? (
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-charcoal py-14 text-slate-100 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_50%,rgba(0,168,243,0.10),transparent_40%),radial-gradient(circle_at_82%_60%,rgba(131,185,37,0.10),transparent_38%)]" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center font-heading text-3xl font-semibold text-white sm:text-4xl">
              Amazing Results From Businesses Like Yours
            </h2>
            <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-air/80" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {reviews.map((review) => (
                <figure key={review.name}>
                  <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
                    <blockquote className="text-base leading-relaxed text-charcoal/80">&ldquo;{review.quote}&rdquo;</blockquote>
                    <p className="mt-5 text-lg tracking-[0.18em] text-[#f4c430]">★★★★★</p>
                  </div>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <SiteImage
                      src={review.avatar}
                      alt={review.name}
                      width={review.avatar.width}
                      height={review.avatar.height}
                      sizes="56px"
                      className="h-14 w-14 rounded-full border-2 border-white object-cover"
                    />
                    <span className="font-heading text-2xl font-semibold text-white">{review.name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <PackagingPathSteps variant="climate" />

      <section className="border-b border-slate-200/50 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200/70 bg-stone p-7 shadow-sm shadow-slate-300/15 sm:p-9">
            <p className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">Before you request a quote</p>
            <p className="mt-3 text-sm text-charcoal/70">
              To prepare accurate pricing, we will ask for a few details about your packaging, including:
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-charcoal/75 sm:grid-cols-2">
              {[
                "Packaging type",
                "Approximate size",
                "Quantity",
                "Print requirements",
                "Delivery country",
                "Artwork status",
                "Preferred timeline",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-air" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-charcoal/60">
              Do not worry if you do not have everything ready. Send us what you know and we&apos;ll help you work through the rest.
            </p>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#070b12] py-16 text-slate-100 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,168,243,0.16),transparent_42%),linear-gradient(155deg,#070b12_0%,#102a21_100%)]" aria-hidden />
        <div id="quoteform" className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-6xl">{copy.quoteHeading}</h2>
          <p className="mt-5 text-lg text-white/80">{copy.quoteSub}</p>
          <TypeformFormEmbed className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-8" />
        </div>
      </section>

      <section className="border-b border-slate-200/50 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 max-w-2xl text-charcoal/70">
            The most common questions from brands switching from generic packaging to custom compostable mailers.
          </p>
          <div className="mt-8">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/50 bg-[#f4f8fb] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm shadow-slate-300/20 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                  Still Researching Compostable Packaging?
                </h2>
                <p className="mt-4 text-charcoal/70">
                  Switching packaging is a big decision. If you are comparing plastic, recycled plastic, paper and compostable mailers, start with the guide. It explains what to check, which claims to question and how to decide whether custom compostable mailers are right for your brand.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#quoteform"
                    className="inline-flex items-center justify-center rounded-lg bg-air px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-air/90"
                  >
                    {copy.primaryCta}
                  </a>
                  <a
                    href="/packaging-guide/download/"
                    className="inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3 text-sm font-semibold text-compost hover:bg-mist"
                  >
                    Download the Guide
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-stone p-6">
                <p className="text-sm font-semibold text-air">What&apos;s inside</p>
                <p className="mt-2 font-heading text-xl font-semibold text-charcoal">The 2026 Branded &amp; Eco Friendly Packaging Guide</p>
                <p className="mt-2 text-sm text-charcoal/65">
                  Branded packaging, eco friendly options, and custom compostable mailers — with checklists for ecommerce brands.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-air" aria-hidden />What to verify before you change materials</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-air" aria-hidden />How to avoid vague &ldquo;biodegradable&rdquo; messaging</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-air" aria-hidden />What to prepare before requesting a quote</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-air" aria-hidden />And much, much more</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/15 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-charcoal">Looking for other compostable packaging options?</h2>
            <p className="mt-2 max-w-2xl text-sm text-charcoal/70">
              We can also help with a wider range of custom compostable packaging formats, subject to the specification and certification required for your project. Contact us at{" "}
              <a className="font-semibold text-air underline-offset-4 hover:underline" href="mailto:enquiries@zeropack.co">
                enquiries@zeropack.co
              </a>
              .
            </p>
            <div className="mt-5">
              <a
                href="/custom-compostable-packaging/"
                className="inline-flex items-center justify-center rounded-lg border border-air/35 bg-air/10 px-4 py-2 text-sm font-semibold text-air hover:bg-air/15"
              >
                Explore compostable packaging options
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
