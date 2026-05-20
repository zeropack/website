import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { CustomMailerCarousel } from "@/components/CustomMailerCarousel";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";
import type { FaqItem } from "@/lib/types";
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

const landingFaqs: FaqItem[] = [
  {
    question: "What is the minimum order quantity for custom compostable mailers?",
    answer:
      "Our custom mailers are made to order, so the best starting point is usually around 2,000 units, depending on size, print, and specification.",
  },
  {
    question: "Are compostable mailers strong enough for ecommerce shipping?",
    answer:
      "Yes, when correctly specified. Our mailers are designed to be durable, waterproof, and finished with strong adhesive for ecommerce dispatch.",
  },
  {
    question: "What is the difference between compostable and biodegradable packaging?",
    answer:
      "Compostable packaging is designed to break down under defined composting conditions and must be backed by certification. Biodegradable is a broader term and can be vague unless backed by clear standards and evidence.",
  },
  {
    question: "Can I add my logo and brand colours?",
    answer:
      "Yes. Custom mailers can be printed with your logo, colours, artwork, message, or campaign design.",
  },
  {
    question: "How long does production take?",
    answer:
      "Custom packaging is made to order, so lead times depend on artwork, quantity, production schedule, and shipping method.",
  },
  {
    question: "Is custom packaging worth it for a small business?",
    answer:
      "If you are still testing demand, plain packaging with branded stickers may be enough. If you are shipping consistent volume, custom mailers can improve presentation and make your brand feel more professional.",
  },
  {
    question: "Can compostable mailers go in recycling?",
    answer:
      "Usually, compostable packaging should not be placed in recycling unless local guidance specifically allows it. Clear disposal instructions are important.",
  },
  {
    question: "How do I know the compostable claim is credible?",
    answer:
      "Ask for certification, material information, and clear details about whether the product is home compostable or industrial compostable.",
  },
  {
    question: "What products are compostable mailers best suited for?",
    answer:
      "They are well suited to apparel, accessories, beauty, wellness, books, gifts, and other non-fragile ecommerce products.",
  },
  {
    question: "What details do you need for a quote?",
    answer:
      "We usually need your preferred size, quantity, delivery country, artwork, print requirements, and what product you are shipping.",
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
function StepIcon({ kind }: { kind: string }) {
  const cls = "h-7 w-7";
  switch (kind) {
    case "quote":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case "accept":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="m8.5 12.5 2.3 2.3 4.7-5.1" />
        </svg>
      );
    case "design":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M4 16l8-8 4 4-8 8H4z" />
          <path d="M13 7l2-2 4 4-2 2" />
        </svg>
      );
    case "production":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M4 12h16M7 12V8h10v4M7 12v4h10v-4" />
        </svg>
      );
    case "confirm":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M12 3 4 7v6c0 4 3 6.8 8 8 5-1.2 8-4 8-8V7z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "ship":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="18" cy="17" r="1.5" />
        </svg>
      );
    case "receive":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M12 3v10M8.5 9.5 12 13l3.5-3.5" />
          <path d="M4 16h16v5H4z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M3 12h18M12 3l9 9-9 9" />
        </svg>
      );
  }
}

export default function TrendPackagingFunnelPage() {
  return (
    <div className="zp-funnel-page relative isolate bg-[#070b12] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_52%,rgba(0,168,243,0.28),transparent_46%),radial-gradient(circle_at_78%_50%,rgba(131,185,37,0.22),transparent_44%),linear-gradient(160deg,#04070d_0%,#08111d_26%,#102a21_58%,#0a1713_100%)]"
        aria-hidden
      />
      <FAQSchema items={landingFaqs} />
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
          <div className="mt-8 flex justify-center">
            <Link
              href="/quote/?src=trend-packaging-funnel-hero"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-air to-aqua px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#04121b] shadow-[0_12px_30px_rgba(0,168,243,0.35)] transition hover:scale-[1.02]"
            >
              Get Your Custom Mailer Quote
            </Link>
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
            <div className="mt-8 flex justify-center">
              <Link
                href="/quote/?src=trend-packaging-funnel-mid"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-air to-aqua px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#04121b] shadow-[0_12px_30px_rgba(0,168,243,0.35)] transition hover:scale-[1.02]"
              >
                Get Your Custom Mailer Quote
              </Link>
            </div>
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
            <div className="mt-6 flex justify-center">
              <Link
                href="/quote/?src=trend-packaging-funnel-stack"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-air to-aqua px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#04121b] transition hover:opacity-90"
              >
                Get Your Custom Mailer Quote
              </Link>
            </div>
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
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
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
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    className="h-14 w-14 rounded-full border-2 border-white object-cover"
                  />
                  <span className="font-heading text-3xl font-semibold text-white">{review.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="max-w-4xl font-heading text-3xl font-semibold text-white sm:text-5xl">
            A clear path to your new branded packaging
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Get Your Quote", icon: "quote" },
              { title: "Quote is accepted", icon: "accept" },
              { title: "Dimensions and Design confirmed", icon: "design" },
              { title: "Production begins", icon: "production" },
              { title: "Final product confirmed", icon: "confirm" },
              { title: "Product Shipped", icon: "ship" },
              { title: "You receive your order", icon: "receive" },
              { title: "You start shipping!", icon: "go" },
            ].map((step, idx, arr) => (
              <div key={step.title} className="relative rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-air/50 bg-air/15 text-air">
                    <StepIcon kind={step.icon} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-air/80">Step {idx + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-white/95">{step.title}</p>
                  </div>
                </div>
                {idx < arr.length - 1 ? (
                  <span
                    className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-air/70 lg:block"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-6xl">
            Ready to move to custom compostable mailers?
          </h2>
          <p className="mt-5 text-lg text-white/80">
            Join the brands creating premium unboxing experiences while showing customers they take the environment
            seriously.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/quote/?src=trend-packaging-funnel-final"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-air to-aqua px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#04121b] shadow-[0_12px_30px_rgba(0,168,243,0.35)] transition hover:scale-[1.02]"
            >
              Get Your Custom Mailer Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-transparent py-14 text-slate-100 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 max-w-2xl text-slate-300/80">
            The most common questions from brands switching from generic packaging to custom compostable mailers.
          </p>
          <div className="mt-8 max-w-4xl">
            <FAQAccordion items={landingFaqs} />
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
