import Link from "next/link";
import { SiteImage } from "@/components/SiteImage";
import { TypeformFormEmbed } from "@/components/TypeformFormEmbed";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { CustomMailerCarousel } from "@/components/CustomMailerCarousel";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";
import dimpleOrange from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_dimple_orange.webp";
import cartridgesDirect from "@/content/images/custom/Custom Compostable Packaging - Cartridges Direct 1.png";
import infectiousGrey from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_infectious_grey.webp";
import lahanaBlue from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_lahana_pale_blue_20cd995e-2861-4d4d-a2e8-fe431b710abc.webp";
import provincialRed from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_provincial_red.webp";
import vinniesLime from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_vinnies_lime_efa69a99-61aa-4654-9bad-61365a0827bf.webp";
import { zeroPackCollageDataUrl } from "@/content/images/custom/Zero-Pack-Collage-512.b64";

type PublicMarket = "global" | "au" | "uk";

const CONSULTATION_URL = "https://calendly.com/zeropackco/30min";
const QUOTE_HREF = "#quoteform";

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="8" r="5" />
      <path d="m9 13 1.5 8L12 19l1.5 2L15 13" />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M12 21V12M3 7.5 12 12m9-4.5L12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5M10 12h5M10 16h5" />
    </svg>
  );
}

function getProofItems(market: PublicMarket) {
  const certification =
    market === "au"
      ? ["AS 4736", "AS 5810"]
      : market === "uk"
        ? ["OK compost INDUSTRIAL", "OK compost HOME"]
        : ["Available on request"];

  return [
    { value: "750,000+", label: ["Custom bags produced"], icon: PackageIcon },
    { value: "Built for growing brands", label: ["Custom production from 2,000 units*"], icon: AwardIcon },
    { value: "Strong, durable & waterproof", label: ["Made for everyday ecommerce shipping"], icon: ShieldIcon },
    { value: "Custom made", label: ["Your sizing, print and branding"], icon: CheckIcon },
    { value: market === "global" ? "Certification evidence" : "Certification", label: certification, icon: DocumentIcon },
  ] as const;
}

const performanceItems = [
  {
    title: "Strong and durable",
    body: "Zero Pack custom compostable mailers are made for everyday ecommerce fulfilment and shipping, with durable flexible construction that helps protect the products inside.",
  },
  {
    title: "Waterproof",
    body: "Custom compostable mailers provide waterproof performance, helping protect products through packing, handling and delivery.",
  },
  {
    title: "Secure closure",
    body: "Strong adhesive closure helps keep orders secure in transit. Single- and double-adhesive mailers are available, giving you options to suit your fulfilment needs.",
  },
  {
    title: "Made to size",
    body: "Custom sizing gives you more control over fit and presentation than relying on oversized or mismatched mailers. We can help you work through the right dimensions based on the products you ship.",
  },
] as const;

const productFit = [
  "apparel and soft goods",
  "accessories",
  "books and stationery",
  "textiles",
  "gifts",
  "beauty and wellness products",
  "other lightweight, non-fragile goods",
] as const;

const processSteps = [
  {
    title: "Tell us what you need",
    body: "Share what you are shipping, approximate dimensions, quantity, artwork direction and delivery destination. You do not need a finished brief to get started.",
  },
  {
    title: "We create your mailer specification and quote",
    body: "We work through the size, print, material, adhesive option, quantity and delivery requirements, then prepare your quote.",
  },
  {
    title: "Approve your artwork and mailer",
    body: "You review the artwork and production details before manufacturing begins.",
  },
  {
    title: "We produce and deliver",
    body: "Your custom mailers are produced and delivered, with expected timing confirmed during the quote and approval process.",
  },
] as const;

const quoteInputs = [
  "what you are shipping",
  "your current mailer or approximate required size",
  "product dimensions",
  "approximate order quantity",
  "your logo, artwork or print idea",
  "delivery destination",
  "preferred timing",
] as const;

const masterFaqs = [
  {
    question: "What are custom compostable mailers?",
    answer: "Custom compostable mailers are made-to-order flexible bags designed for shipping ecommerce products. Zero Pack mailers can be customised with your branding, artwork and sizing, giving your business a compostable alternative to conventional plastic mailers with the strong, durable and waterproof performance needed for ecommerce shipping.",
  },
  {
    question: "Are compostable mailers strong and durable?",
    answer: "Yes. Zero Pack custom compostable mailers are strong and durable and made for everyday ecommerce fulfilment and shipping.",
  },
  {
    question: "Are the mailers waterproof?",
    answer: "Yes. Zero Pack custom compostable mailers provide waterproof performance for ecommerce shipping.",
  },
  {
    question: "What products are compostable mailers good for?",
    answer: "They work well for a wide range of lightweight and non-fragile products, including apparel, accessories, books, stationery, textiles, gifts and beauty and wellness products. If your product needs more protection or a different packaging format, talk to us and we can help you explore the right solution.",
  },
  {
    question: "What is the minimum order quantity?",
    answer: "Custom compostable mailer production starts from 2,000 units*. *Final MOQ depends on size, print, material and specification.",
  },
  {
    question: "Can we print our logo and brand colours?",
    answer: "Yes. Your mailers can be custom printed with your branding, colours and artwork. We can work with you on the print layout so the finished packaging matches your brand.",
  },
  {
    question: "Do we need finished artwork before requesting a quote?",
    answer: "No. Send us whatever you already have — a logo, existing artwork, brand files or even an early idea. We can help prepare everything for production once your mailer details are confirmed.",
  },
  {
    question: "Can you help us choose the right mailer size?",
    answer: "Yes. Share the products you need to pack and their approximate dimensions, and we can help you choose a mailer size that gives you a better fit.",
  },
  {
    question: "What adhesive options are available?",
    answer: "Single- and double-adhesive mailers are available. We can help you choose the option that best suits how you pack and fulfil your orders.",
  },
  {
    question: "Are the mailers certified compostable?",
    answer: "Certified compostable material options are available for Zero Pack custom mailers. For certified home-compostable mailer material, AS 5810 certification is available.",
  },
  {
    question: "Are the mailers PFAS-free and BPA-free?",
    answer: "PFAS-free and BPA-free compostable mailer material is available.",
  },
  {
    question: "Can the mailers be made food-safe?",
    answer: "Yes. Food-safe options can be produced for applications that require them. Tell us what you are packaging and we can help you work through the right option.",
  },
  {
    question: "How long does custom production take?",
    answer: "Production and delivery timing depends on your quantity, print, specification, approvals, freight method and destination. We confirm the expected timing as part of your quote before production begins.",
  },
  {
    question: "Can we order samples?",
    answer: "Ask us about samples when you request a quote. We can advise on the best sample option based on the type of mailer you are considering.",
  },
  {
    question: "Where do you deliver?",
    answer: "Zero Pack works with businesses all over the world. Freight, delivery method and timing are confirmed for each order based on the mailer and destination.",
  },
  {
    question: "What happens after we request a quote?",
    answer: "We review what you are shipping and the information you have provided, then work with you to confirm the mailer, sizing, print and other details needed for pricing. From there, we move through artwork approval and production with you.",
  },
];

const ukCertificationFaq = {
  question: "Are the mailers certified compostable?",
  answer: "Certified compostable material options are available for Zero Pack custom mailers. For certified home-compostable mailer material, OK compost HOME certification is available.",
};

const ukDeliveryFaq = {
  question: "Do you deliver to the UK?",
  answer: "Yes. Zero Pack supplies custom compostable mailers to UK customers. Freight, shipping method and expected delivery timing are confirmed during quoting based on the order and destination.",
};

function QuoteButton({ children = "Get a Custom Quote" }: { children?: string }) {
  return (
    <a href={QUOTE_HREF} className="inline-flex items-center justify-center rounded-lg bg-air px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0096d6]">
      {children}
    </a>
  );
}

function ConsultationButton({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href={CONSULTATION_URL}
      className={
        dark
          ? "inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-air/50 hover:bg-white/10"
          : "inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3.5 text-sm font-semibold text-compost transition hover:bg-mist"
      }
    >
      Book a Packaging Consultation
    </a>
  );
}

export function PremiumMailerPage({ market = "global" }: { market?: PublicMarket }) {
  const faqItems = market === "uk"
    ? masterFaqs.map((item) => {
        if (item.question === "Are the mailers certified compostable?") return ukCertificationFaq;
        if (item.question === "Where do you deliver?") return ukDeliveryFaq;
        return item;
      })
    : masterFaqs;
  const proofItems = getProofItems(market);

  return (
    <div className="bg-white text-charcoal sm:-mb-6">
      <FAQSchema items={faqItems} />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#070b12] py-14 text-slate-100 sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_52%,rgba(0,168,243,0.28),transparent_46%),radial-gradient(circle_at_78%_50%,rgba(131,185,37,0.22),transparent_44%),linear-gradient(160deg,#04070d_0%,#08111d_26%,#102a21_58%,#0a1713_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air sm:text-sm">Custom printed · Made to order · B2B</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-6xl">Custom compostable mailers, made for your brand</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200/90">Custom printed mailers designed around your products and your brand.</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/75 sm:text-lg">Strong, durable and waterproof, with custom sizing, standout branding and certified compostable material options, they give ecommerce brands a practical alternative to conventional plastic mailers.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <QuoteButton />
              <ConsultationButton dark />
            </div>
          </div>
          <div className="mx-auto w-full max-w-2xl">
            <CustomMailerCarousel slides={customMailerCarouselSlides} priorityFirstSlide />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/60 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost">Performance</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Made to look good. Made to do the job.</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-charcoal/70 sm:text-lg">Packaging still needs to perform once it leaves your hands.</p>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {performanceItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                <h3 className="font-heading text-xl font-semibold text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Made for ecommerce</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">A better mailer starts with what you’re shipping</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal/70 sm:text-lg">
              <p>Custom compostable mailers are made-to-order flexible shipping bags for businesses that want their packaging to stand out, perform reliably and help reduce reliance on conventional plastic.</p>
              <p>They are a great fit for many ecommerce products, including apparel, accessories, books, stationery, textiles, gifts and many non-fragile beauty and wellness products.</p>
              <p>Rather than choosing from generic stock sizes and designs, we work with you to create a mailer that suits your products and matches your brand.</p>
            </div>
            <div className="mt-7"><QuoteButton /></div>
          </div>
          <SiteImage src={dimpleOrange} alt="Custom printed compostable mailer" width={dimpleOrange.width} height={dimpleOrange.height} className="w-full rounded-3xl object-cover shadow-sm" sizes="(max-width: 1024px) 100vw, 55vw" />
        </div>
      </section>

      <section className="border-y border-slate-800/80 bg-charcoal py-8 text-white sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {proofItems.map((item) => (
              <div key={item.value} className="zp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-air/30 hover:bg-white/10">
                <div className="mx-auto inline-flex rounded-full bg-air/15 p-3 text-air">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 font-heading text-sm font-semibold text-white">{item.value}</p>
                <div className="mt-1 space-y-0.5 text-xs leading-relaxed text-white/75">
                  {item.label.map((line) => <p key={line}>{line}</p>)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-white/60">*Final MOQ depends on size, print, material and specification.</p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Make the mailer yours</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Packaging that matches your brand</h2>
              <p className="mt-5 text-base leading-relaxed text-charcoal/70 sm:text-lg">Your mailer should feel like part of your brand, not a generic shipping bag with a logo added as an afterthought.</p>
              <p className="mt-5 font-semibold text-charcoal">You can customise:</p>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-charcoal/70 sm:grid-cols-2 sm:text-base">
                {["print and branding", "brand colours", "logo and artwork placement", "mailer dimensions", "print layout", "single- or double-adhesive mailers"].map((item) => <li key={item}>• {item}</li>)}
              </ul>
              <p className="mt-5 text-base leading-relaxed text-charcoal/70">You do not need production-ready artwork before you enquire.</p>
              <p className="mt-3 text-base leading-relaxed text-charcoal/70">If you already have brand assets, send us what you have. We can help turn them into production-ready packaging and make sure the finished mailer looks polished, consistent and on-brand.</p>
              <div className="mt-7"><QuoteButton /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[cartridgesDirect, infectiousGrey, lahanaBlue, provincialRed].map((image, index) => (
                <SiteImage key={image.src} src={image} alt={["Cartridges Direct custom mailer", "Infectious Clothing custom mailer", "Lahana custom mailer", "Provincial Home Living custom mailer"][index]} width={image.width} height={image.height} className="aspect-square w-full rounded-2xl object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0f2d24,#153d31)] py-14 text-white sm:py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79d6a7]">Built for growing brands</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Custom production from 2,000 units*</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">Custom compostable mailer production starts from <strong className="text-white">2,000 units</strong>*, making custom branded packaging accessible to established and growing brands.</p>
          <p className="mt-4 text-xs text-white/60">*Final MOQ depends on size, print, material and specification.</p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Made for the products ecommerce brands ship every day</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">A practical fit for a wide range of products</h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal/70 sm:text-lg">Custom compostable mailers work particularly well for products that do not need the weight or rigidity of a box.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {productFit.map((item) => <div key={item} className="rounded-xl bg-mist px-4 py-3 text-sm font-medium text-charcoal">{item}</div>)}
            </div>
            <p className="mt-6 text-base leading-relaxed text-charcoal/70">Their flexible format keeps packing simple while giving you the freedom to create packaging that fits your products and represents your brand.</p>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">If your product needs extra cushioning, rigid protection, temperature control or a different type of packaging, talk to us. Zero Pack works across a broader range of custom compostable packaging and can help you explore the right solution.</p>
            <div className="mt-7"><ConsultationButton /></div>
          </div>
          <SiteImage src={vinniesLime} alt="Custom compostable mailer in a branded ecommerce application" width={vinniesLime.width} height={vinniesLime.height} className="w-full rounded-3xl object-cover shadow-sm" sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
      </section>

      <section className="border-y border-slate-200/60 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost">Certified compostable mailers</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Compostability backed by certification</h2>
          <div className="mt-5 max-w-4xl space-y-4 text-base leading-relaxed text-charcoal/70 sm:text-lg">
            <p>Zero Pack custom compostable mailers are available with certified compostable material options, giving your business clear evidence behind the compostability claims you make about your packaging.</p>
            <p>For certified home-compostable mailer material, <strong className="text-charcoal">{market === "uk" ? "OK compost HOME certification" : "AS 5810 certification"}</strong> is available.</p>
            <p>This gives brands clear certification behind the compostability claims they make about their mailers.</p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-xl font-semibold text-charcoal">PFAS-free and BPA-free</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">The compostable mailer material used for these products is available PFAS-free and BPA-free.</p>
            </article>
            <article className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-xl font-semibold text-charcoal">Food-safe options</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">Food-safe mailer options can also be produced for applications that require them.</p>
            </article>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-relaxed text-charcoal/70">Tell us what you need to package and we can help you choose the right material and mailer specification for your business.</p>
          <p className="mt-4 text-sm text-charcoal/60">Certification evidence is available on request once the relevant product and material specification are confirmed.</p>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79d6a7]">See the finished result</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Custom mailers in the real world</h2>
              <p className="mt-4 max-w-2xl text-white/70">The best way to see what custom packaging can do for your brand is to see the finished product.</p>
              <p className="mt-2 max-w-2xl text-white/70">Explore Zero Pack mailers created across different brands, sizes, colours and print styles.</p>
            </div>
            <Link className="font-semibold text-[#79d6ff] hover:underline" href="/customer-showcase/">View Customer Work →</Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              [dimpleOrange, "Dimple"],
              [cartridgesDirect, "Cartridges Direct"],
              [lahanaBlue, "Lahana"],
              [provincialRed, "Provincial Home Living"],
            ].map(([image, name]) => {
              const source = image as typeof dimpleOrange;
              return <figure key={name as string} className="overflow-hidden rounded-2xl bg-white/5"><SiteImage src={source} alt={`${name} custom mailer`} width={source.width} height={source.height} className="aspect-square w-full object-cover" sizes="(max-width: 1024px) 50vw, 25vw" /><figcaption className="px-4 py-3 text-sm font-semibold text-white/80">{name as string}</figcaption></figure>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">From idea to finished mailers</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">A simple path to custom production</h2>
          <ol className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-compost">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-heading text-xl font-semibold text-charcoal">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8"><QuoteButton /></div>
        </div>
      </section>

      <section className="border-y border-slate-200/60 bg-[linear-gradient(135deg,#f2f8fb,#f7fbf8)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost">What do we need for a quote?</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Start with whatever you have</h2>
              <p className="mt-5 text-base leading-relaxed text-charcoal/70 sm:text-lg">You do not need every detail worked out before getting in touch.</p>
              <p className="mt-4 font-semibold text-charcoal">Useful information can include:</p>
              <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-charcoal/70 sm:grid-cols-2 sm:text-base">
                {quoteInputs.map((item) => <li key={item}>• {item}</li>)}
              </ul>
              <p className="mt-5 text-base leading-relaxed text-charcoal/70">You can also send us a photo or sample of the packaging you use now.</p>
              <p className="mt-3 text-base leading-relaxed text-charcoal/70">Even if you only have an idea, we can work through it with you.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row"><QuoteButton /><ConsultationButton /></div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
              <SiteImage src={zeroPackCollageDataUrl} alt="Collage of Zero Pack custom compostable packaging examples" width={512} height={512} className="aspect-square w-full object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              <div className="p-6 sm:p-8">
                <h3 className="font-heading text-2xl font-semibold text-charcoal">Want to see the material first?</h3>
                <p className="mt-4 text-base leading-relaxed text-charcoal/70">Ask us about samples when you enquire and we can advise on the best option for the mailer you are considering.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost">Custom compostable mailer FAQ</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Common questions before you order</h2>
          <div className="mt-8"><FAQAccordion items={faqItems} /></div>
        </div>
      </section>

      <section className="border-y border-slate-200/60 bg-[linear-gradient(135deg,#f2f8fb,#f7fbf8)] py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Still researching your packaging options?</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal">Start with the Packaging Guide</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-charcoal/70">If you are still comparing compostable mailers with other materials or packaging formats, the Zero Pack Packaging Guide will help you understand the questions worth asking before you order.</p>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-charcoal/70">It covers materials, packaging formats, custom production, compostability, certification and the information worth preparing before requesting a quote.</p>
          </div>
          <Link className="inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3.5 text-sm font-semibold text-compost transition hover:bg-mist" href="/packaging-guide/">Read the Packaging Guide</Link>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost">Looking for something other than a mailer?</p>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70 sm:text-lg">Zero Pack specialises in custom compostable packaging across a broad range of applications.</p>
            <p className="mt-3 text-base leading-relaxed text-charcoal/70">If your product needs a shopping bag, garment bag, protective packaging, food packaging, flexible or rigid packaging — or something more bespoke — tell us what the packaging needs to do and we’ll work with you to explore the right compostable solution.</p>
            <Link className="mt-6 inline-flex font-semibold text-air hover:underline" href="/custom-compostable-packaging/">Explore Custom Packaging →</Link>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0e2a22,#153b30)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Ready to create your custom mailers?</h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">Tell us what you are shipping, roughly how many you need and what you want your packaging to look like.</p>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-white/75">If you already know your dimensions and artwork, great. If you are starting with an existing plastic mailer, a product sample or simply an idea, that is enough to begin.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <QuoteButton />
              <a href={CONSULTATION_URL} className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white px-6 py-3.5 text-sm font-semibold text-compost transition hover:bg-mist">Book a Packaging Consultation</a>
            </div>
          </div>
          <div id="quoteform" className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-3 text-charcoal shadow-xl sm:p-5">
            <TypeformFormEmbed className="min-h-[620px] w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
