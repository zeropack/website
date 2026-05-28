import type { Metadata } from "next";
import { SiteImage } from "@/components/SiteImage";
import { buildMetadata } from "@/lib/metadata";
import { TypeformFormEmbed } from "@/components/TypeformFormEmbed";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { CustomMailerCarousel } from "@/components/CustomMailerCarousel";
import { PackagingPathSteps } from "@/components/PackagingPathSteps";
import { globalHomeFaqs } from "@/content/global/faqs";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";
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

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Mailers | Premium Unboxing for Ecommerce Brands",
  description:
    "Custom compostable mailers for ecommerce brands that want premium unboxing, credible eco positioning, and a made-to-order quote process.",
  path: "/trend-packaging-funnel/",
});

const valueCards = [
  {
    title: "Better unboxing moments",
    body: "Turn every delivery into a premium first impression that feels intentional, branded, and worth sharing.",
  },
  {
    title: "Eco expectations, met",
    body: "Give customers the compostable option they increasingly expect from modern ecommerce brands.",
  },
  {
    title: "Trend-led brand signal",
    body: "Stand out from generic mailers and join the brands customers see as ahead of the market.",
  },
];

const outcomes = [
  "Custom branded compostable mailers designed around your brand style",
  "Sizing guidance so parcels look premium and ship practically",
  "Print and colour direction matched to your customer experience goals",
  "Claim and certification guidance to keep eco messaging credible",
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

export default function TrendPackagingFunnelPage() {
  return (
    <div className="zp-funnel-page relative isolate bg-[#070b12] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_52%,rgba(0,168,243,0.28),transparent_46%),radial-gradient(circle_at_78%_50%,rgba(131,185,37,0.22),transparent_44%),linear-gradient(160deg,#04070d_0%,#08111d_26%,#102a21_58%,#0a1713_100%)]"
        aria-hidden
      />
      <FAQSchema items={globalHomeFaqs} />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h1 className="mt-4 max-w-5xl font-heading text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl">
            The Premium Mailer That Makes Your Brand Feel Viral-Ready
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-200/80 sm:text-xl">
            For brands that want every parcel to feel like a moment: custom branded compostable mailers that elevate
            unboxing, align with eco expectations, and build customer loyalty at first touch.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { metric: "750,000+", label: "Custom bags produced" },
              { metric: "Certified AS5810", label: "The Home Compostable gold standard" },
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

      <section className="relative border-b border-white/10 bg-transparent py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {valueCards.map((card, idx) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-air/50 bg-air/10 font-heading text-sm font-semibold text-air">
                  {idx + 1}
                </div>
                <p className="mt-4 font-heading text-2xl font-semibold text-white">{card.title}</p>
                <p className="mt-2 text-sm text-slate-200/80">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="font-heading text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Join The Brands Customers Notice First
            </h2>
            <p className="mt-5 text-lg text-slate-200/80">
              Customers are choosing brands that look premium and act responsibly. A plastic mailer weakens that story
              before the product is even seen.
            </p>
            <p className="mt-4 text-slate-300/75">
              Custom compostable mailers let you deliver a stronger unboxing experience while signalling your brand is
              part of the next wave, not behind it.
            </p>
          </div>
          <CustomMailerCarousel slides={customMailerCarouselSlides} />
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm">
            <p className="font-heading text-2xl font-semibold text-white">What you get with custom mailers</p>
            <ul className="mt-5 grid gap-3 text-sm text-slate-200/85 sm:grid-cols-2">
              {outcomes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-air" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">Customer Brands</h2>
          <p className="mt-3 max-w-3xl text-slate-300/80">
            World-recognised brands that have trusted Zero Pack with custom compostable mailer solutions.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customerBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex min-h-24 items-center justify-center rounded-2xl border border-white/15 bg-white px-4 py-5 text-center"
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
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-heading text-3xl font-semibold text-white sm:text-4xl">
            Amazing Results From Businesses Like Yours
          </h2>
          <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-white/70" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.name}>
                <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
                  <blockquote className="text-base leading-relaxed text-charcoal/80">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
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
                  <span className="font-heading text-3xl font-semibold text-white">{review.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <PackagingPathSteps variant="dark" />

      <section className="relative border-b border-white/10 bg-transparent py-16 sm:py-24">
        <div id="quoteform" className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-6xl">
            Ready to move to custom compostable mailers?
          </h2>
          <p className="mt-5 text-lg text-white/80">
            Join the brands creating premium unboxing experiences while showing customers they take the environment
            seriously.
          </p>
          <TypeformFormEmbed className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-8" />
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-14 text-slate-100 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 max-w-2xl text-slate-300/80">
            The most common questions from brands switching from generic packaging to custom compostable mailers.
          </p>
          <div className="mt-8">
            <FAQAccordion items={globalHomeFaqs} />
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-transparent py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-white">Looking for other compostable packaging options?</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
              No problem, we provide a wide array of other options for packaging that are all certified compostable.
              Just contact us at{" "}
              <a className="font-semibold text-air underline-offset-4 hover:underline" href="mailto:enquiries@zeropack.co">
                enquiries@zeropack.co
              </a>
              .
            </p>
            <div className="mt-5">
              <a
                href="mailto:enquiries@zeropack.co"
                className="inline-flex items-center justify-center rounded-lg border border-air/35 bg-air/10 px-4 py-2 text-sm font-semibold text-air hover:bg-air/15"
              >
                Email enquiries@zeropack.co
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
