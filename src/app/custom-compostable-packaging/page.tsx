import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { CustomMailerCarousel } from "@/components/CustomMailerCarousel";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { SiteImage } from "@/components/SiteImage";
import { TypeformFormEmbed } from "@/components/TypeformFormEmbed";
import type { FaqItem } from "@/lib/types";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";
import carryYellow from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (10).png";
import standupPouch from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (12).png";
import tubingRoll from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (14).png";
import garmentBag from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (17).png";
import campaignBag from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (2).png";
import bubbleWrap from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (3).png";
import protectiveWrap from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (4).png";
import rigidFoodPackaging from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (5).png";
import sliderBag from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (8).png";
import primasoyPackaging from "@/content/images/custom/Zero_Pack_-_Custom_Compostable_Packaging_-_Primasoy.webp";
import mailerPackaging from "@/content/images/custom/Custom Compostable Packaging - Cartridges Direct 1.png";

const path = "/custom-compostable-packaging/";
const QUOTE_HREF = "#quoteform";
const CONSULTATION_URL = "https://calendly.com/zeropackco/30min";

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M12 21V12M3 7.5 12 12m9-4.5L12 12" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
    </svg>
  );
}

const proofItems = [
  { value: "750,000+", label: "Custom bags produced", icon: PackageIcon },
  { value: "Certification", label: "Certified compostable packaging", icon: DocumentIcon },
  { value: "Made to order", label: "Packaging developed around your product and brand", icon: CheckIcon },
  { value: "Worldwide delivery", label: "Working with businesses all over the world", icon: GlobeIcon },
] as const;

type Category = {
  title: string;
  body: string;
  cta: string;
  image: StaticImageData;
  alt: string;
  href?: string;
  secondImage?: StaticImageData;
  secondAlt?: string;
  featured?: boolean;
};

const categories: Category[] = [
  {
    title: "Shopping & carry bags",
    body: "Custom branded bags for retail stores, events, markets, activations and customer carry.\n\nCreated around your required size, branding and use.",
    cta: "Discuss Shopping & Carry Bags",
    image: carryYellow,
    alt: "Custom printed compostable shopping and carry bag",
  },
  {
    title: "Garment bags",
    body: "Flexible packaging for apparel protection, presentation and fulfilment.\n\nCustom sizing and branding help create packaging that protects the product and stays consistent with your brand.",
    cta: "Discuss Garment Packaging",
    image: garmentBag,
    alt: "Custom compostable garment bag",
  },
  {
    title: "Flexible bags, pouches & tubing",
    body: "Custom flexible packaging including layflat tubing, resealable or ziplock bags, pouches and other made-to-order packaging for products that need a specific shape, size or closure.",
    cta: "Discuss Flexible Packaging",
    image: standupPouch,
    secondImage: tubingRoll,
    alt: "Custom compostable stand-up pouch",
    secondAlt: "Custom compostable layflat tubing on a roll",
    featured: true,
  },
  {
    title: "Protective packaging",
    body: "Custom protective packaging including padded, cushioning and bubble-wrap-style solutions for products that need extra protection in storage, handling or delivery.\n\nTell us what needs protecting and we’ll help you explore the right solution.",
    cta: "Discuss Protective Packaging",
    image: bubbleWrap,
    secondImage: protectiveWrap,
    alt: "Compostable bubble-wrap-style protective packaging",
    secondAlt: "Custom protective compostable packaging",
    featured: true,
  },
  {
    title: "Food packaging",
    body: "Custom compostable packaging for food applications, including flexible and rigid packaging depending on the product and how it needs to be packed, protected, stored or presented.\n\nTell us about the food product and what the packaging needs to do, and we’ll develop the project around those requirements.",
    cta: "Discuss Food Packaging",
    image: primasoyPackaging,
    secondImage: rigidFoodPackaging,
    alt: "Branded custom compostable food packaging",
    secondAlt: "Rigid custom compostable food packaging",
    featured: true,
  },
  {
    title: "Rigid & bespoke packaging",
    body: "Custom rigid packaging, boxes and other made-to-order packaging for products that need more structure, protection or a different type of presentation.\n\nIf what you need is not shown on the page, tell us about the product or show us the packaging you use now and we’ll explore the options with you.",
    cta: "Discuss a Bespoke Project",
    image: rigidFoodPackaging,
    alt: "Rigid custom compostable packaging and boxes",
    featured: true,
  },
  {
    title: "Campaign & event packaging",
    body: "Custom packaging for campaigns, events, launches, activations and branded distribution.\n\nTell us how the packaging will be used and what you want it to achieve, and we can develop the project around those needs.",
    cta: "Discuss Campaign Packaging",
    image: campaignBag,
    alt: "Custom branded compostable campaign and event bag",
  },
  {
    title: "Custom compostable mailers",
    body: "Custom printed flexible mailers for ecommerce shipping and fulfilment.\n\nMailers have their own dedicated product page covering sizing, performance, branding, certification and ordering.",
    cta: "Explore Custom Mailers",
    href: "/custom-compostable-mailers/",
    image: mailerPackaging,
    alt: "Custom printed compostable ecommerce mailer",
  },
];

const processSteps = [
  {
    title: "Tell us what you need",
    body: "Show us what you use now, tell us what you need to package or share the idea you are working on.\n\nPhotos, samples, rough dimensions and early concepts are all useful starting points.",
  },
  {
    title: "We develop the packaging with you",
    body: "We work with you to shape the packaging around your product, including the material, size, branding and production requirements.",
  },
  {
    title: "Approve the details",
    body: "You confirm the quote, artwork and final packaging details before production begins.",
  },
  {
    title: "We produce and deliver",
    body: "Your packaging is made to order and delivery timing is confirmed for the project.",
  },
] as const;

const quoteInputs = [
  "the packaging you use now",
  "a photo or physical sample",
  "the product you need to package",
  "approximate dimensions",
  "an expected quantity",
  "your logo or brand files",
  "an early concept",
  "or simply an idea",
] as const;

const packagingCarouselSlides = [
  { image: rigidFoodPackaging, heading: "Food packaging", subheading: "Flexible and rigid packaging developed around the product and application.", alt: "Rigid custom compostable food packaging" },
  { image: bubbleWrap, heading: "Protective packaging", subheading: "Cushioning and bubble-wrap-style solutions for products needing extra protection.", alt: "Compostable bubble-wrap-style protective packaging" },
  { image: carryYellow, heading: "Shopping & carry bags", subheading: "Custom branded bags made around the required size, use and presentation.", alt: "Custom printed compostable shopping and carry bag" },
  { image: garmentBag, heading: "Garment bags", subheading: "Flexible packaging for apparel protection, presentation and fulfilment.", alt: "Custom compostable garment bag" },
  { image: standupPouch, heading: "Flexible packaging", subheading: "Custom bags, pouches and other made-to-order flexible packaging.", alt: "Custom compostable stand-up pouch" },
  { image: tubingRoll, heading: "Layflat tubing", subheading: "Made-to-order tubing developed around the required dimensions and application.", alt: "Custom compostable layflat tubing on a roll" },
  { image: campaignBag, heading: "Campaign & event packaging", subheading: "Custom packaging for launches, activations and branded distribution.", alt: "Custom branded compostable campaign and event bag" },
  { image: sliderBag, heading: "Resealable packaging", subheading: "Custom flexible packaging for products needing a specific closure or packaging style.", alt: "Custom compostable resealable slider bag" },
];

const customerImages = [
  { image: rigidFoodPackaging, alt: "Branded rigid compostable packaging" },
  { image: bubbleWrap, alt: "Bubble-wrap-style compostable protection" },
  { image: carryYellow, alt: "Custom printed compostable carry bag" },
  { image: garmentBag, alt: "Custom compostable garment packaging" },
  { image: sliderBag, alt: "Custom compostable resealable slider bag" },
  { image: mailerPackaging, alt: "Custom printed compostable mailer" },
] as const;

const masterFaqs: FaqItem[] = [
  {
    question: "What types of custom compostable packaging can Zero Pack make?",
    answer: "Zero Pack works across a broad range of packaging, including shopping and carry bags, garment bags, flexible bags and pouches, ziplock or resealable packaging, layflat tubing, protective and bubble-wrap-style packaging, food packaging, rigid packaging, boxes, custom mailers, campaign packaging and bespoke projects.\n\nIf what you need isn’t listed here, tell us what you are packaging and what the packaging needs to do, and we’ll help you explore the right solution.",
  },
  {
    question: "Can you help replace packaging we currently buy in plastic?",
    answer: "Absolutely.\n\nShow us what you use now or tell us what the packaging needs to do.\n\nWe’ll look at the product, how the packaging is used, the protection it needs and your branding requirements, then explore the compostable options with you.\n\nPrefer to talk it through?",
    ctaLabel: "Book a Packaging Consultation",
    ctaHref: CONSULTATION_URL,
    ctaExternal: true,
  },
  {
    question: "What do I need to get started?",
    answer: "You can start with as much or as little as you have.\n\nSend us your current packaging, a photo, a sample, your product dimensions, brand assets or simply the idea you are working on.\n\nRough information is fine. You do not need a finished brief before getting in touch.\n\nEven if you only have an idea, we’re here to work through it with you and help find the right solution.",
    ctaLabel: "Book a Packaging Consultation",
    ctaHref: CONSULTATION_URL,
    ctaExternal: true,
  },
  {
    question: "Can you customise the size and branding?",
    answer: "Yes.\n\nCustom packaging can be developed around your required dimensions, branding, colours, artwork and print.\n\nThe options vary by packaging type, and we’ll help you choose the size, branding and print that work for your project.",
  },
  {
    question: "What are the minimum order quantities?",
    answer: "Minimum quantities vary depending on the type of packaging, size, material, print and production requirements.\n\nOnce we understand what you need, we can confirm the starting quantity for your project.",
  },
  {
    question: "Can you provide certification information?",
    answer: "Yes. All Zero Pack compostable packaging is certified.\n\nThe exact certification depends on the material and type of packaging being produced, and we’ll confirm the relevant certification for your project.",
  },
  {
    question: "Can you develop food packaging?",
    answer: "Yes. Zero Pack can develop custom compostable packaging for food applications, including flexible and rigid packaging depending on what the product requires.\n\nTell us about the food product, how the packaging will be used and what it needs to do, and we’ll develop the packaging around those requirements.\n\nIf food-safe packaging is required, we’ll make sure those requirements are addressed as part of the project.",
  },
  {
    question: "Can you help with artwork?",
    answer: "Yes.\n\nIf you already have brand assets or artwork, send us what you have. We can help prepare the packaging artwork for production once the packaging and print requirements are clear.\n\nYou do not need finished production artwork before you enquire.",
  },
  {
    question: "How long does custom production take?",
    answer: "Production and delivery timing depends on the type of packaging, quantity, print, production requirements, freight method and destination.\n\nWe confirm timing during the quote and approval process for your project.",
  },
  {
    question: "Where do you deliver?",
    answer: "Zero Pack works with businesses all over the world.\n\nFreight, delivery method and timing are confirmed for each project based on the packaging and destination.",
  },
];

const ukDeliveryFaq: FaqItem = {
  question: "Do you deliver to the UK?",
  answer: "Yes. Zero Pack supplies custom compostable packaging to UK customers.\n\nFreight, shipping method and expected delivery timing are confirmed during quoting based on the packaging and destination.",
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
      target="_blank"
      rel="noopener noreferrer"
      className={dark
        ? "inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-air/50 hover:bg-white/10"
        : "inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3.5 text-sm font-semibold text-compost transition hover:bg-mist"}
    >
      Book a Packaging Consultation
    </a>
  );
}

function PackagingImage({
  image,
  alt,
  className = "h-full w-full object-contain",
  priority = false,
}: {
  image: StaticImageData;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <SiteImage
      src={image}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={className}
      priority={priority}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return buildMarketPageMetadata({
    market,
    title: "Custom Compostable Packaging | Zero Pack",
    description: "Zero Pack helps businesses develop custom compostable packaging that works for their product, brand and application.",
    path,
  });
}

export default async function Page() {
  const market = await getRequestMarket();
  const faqItems = market === "uk"
    ? masterFaqs.map((item) => (item.question === "Where do you deliver?" ? ukDeliveryFaq : item))
    : masterFaqs;

  return (
    <div className="bg-white text-charcoal sm:-mb-6">
      <FAQSchema items={faqItems} />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#070b12] py-14 text-slate-100 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_52%,rgba(131,185,37,0.26),transparent_46%),radial-gradient(circle_at_78%_50%,rgba(0,168,243,0.3),transparent_44%),linear-gradient(160deg,#0a1713_0%,#102a21_42%,#08111d_74%,#04070d_100%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79d6a7] sm:text-sm">Custom printed · Made to order · B2B</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-6xl">Custom compostable packaging, made for your business</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200/90">Zero Pack helps businesses develop certified compostable packaging that works for their product, brand and application.</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/75 sm:text-lg">Whether you are replacing conventional plastic packaging, developing something new or starting with an idea, we can help turn what you need into custom packaging made for your business.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><QuoteButton /><ConsultationButton dark /></div>
          </div>
          <div className="mx-auto w-full max-w-2xl">
            <CustomMailerCarousel slides={packagingCarouselSlides} priorityFirstSlide permanentCaption />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/50 bg-stone py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">How custom packaging works</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold text-charcoal sm:text-4xl">From an idea to finished packaging</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <article key={step.title} className="relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"><span className="font-heading text-4xl font-semibold text-air/30">0{index + 1}</span><h3 className="mt-4 font-heading text-xl font-semibold text-charcoal">{step.title}</h3><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-charcoal/70">{step.body}</p></article>
            ))}
          </div>
          <div className="mt-8"><QuoteButton /></div>
        </div>
      </section>

      <section className="border-y border-slate-800/80 bg-charcoal py-8 text-white sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {proofItems.map((item) => (
              <div key={item.value} className="zp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-air/30 hover:bg-white/10">
                <div className="mx-auto inline-flex rounded-full bg-air/15 p-3 text-air">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 font-heading text-sm font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist/60 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-300/20"><PackagingImage image={rigidFoodPackaging} alt="Branded custom compostable packaging made around the product" className="h-auto w-full rounded-2xl object-contain" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">Packaging made for your product and your brand</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Custom means more than adding a logo</h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">Your packaging is created to suit your product, brand and requirements.</p>
            <p className="mt-4 text-charcoal/70">Depending on the project, that can include:</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {["type of packaging", "size and dimensions", "branding and colours", "artwork and print", "finish", "closures and other product features"].map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl border border-compost/10 bg-white px-4 py-3 text-sm font-semibold text-charcoal/80"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/20 text-compost" aria-hidden>✓</span>{item}</li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-charcoal/75">You do not need finished artwork or a complete packaging specification before you enquire.</p>
            <p className="mt-3 leading-relaxed text-charcoal/75">If you already have packaging you want to replace, we can start there. If you are building something new, an idea is enough to begin the conversation.</p>
            <div className="mt-8"><QuoteButton>Tell Us What You Need</QuoteButton></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">What can we make?</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Packaging made to suit your needs</h2>
            <p className="mt-5 text-lg text-charcoal/75">Different products need different packaging.</p>
            <p className="mt-3 text-lg leading-relaxed text-charcoal/75">Tell us what you need to package and we’ll help you explore the right type of packaging, material, size and branding for the job.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article key={category.title} className={`group flex overflow-hidden rounded-3xl border border-slate-200/70 bg-stone/50 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/20 ${category.featured ? "lg:col-span-2" : "lg:col-span-1"}`}>
                <div className="flex w-full flex-col">
                  <div className={`grid overflow-hidden bg-white ${category.secondImage ? "grid-cols-2" : "grid-cols-1"}`}>
                    <div className="aspect-[4/3] overflow-hidden"><PackagingImage image={category.image} alt={category.alt} className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.02]" /></div>
                    {category.secondImage && category.secondAlt ? (
                      <div className="aspect-[4/3] overflow-hidden border-l border-slate-100"><PackagingImage image={category.secondImage} alt={category.secondAlt} className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.02]" /></div>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-xl font-semibold text-charcoal">{category.title}</h3>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-charcoal/70 sm:text-base">{category.body}</p>
                    <a href={category.href ?? QUOTE_HREF} className="mt-6 inline-flex min-h-11 items-center font-semibold text-compost underline decoration-air/40 decoration-2 underline-offset-4 transition hover:text-air">{category.cta} →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#07150f] via-[#103224] to-[#0a1b18] py-14 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(0,168,243,0.18),transparent_38%)]" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">Bring us the packaging problem</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl">Start with what you need the packaging to do</h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-slate-200 sm:text-lg">
            <p>You do not need to know the final type of packaging before you contact us.</p>
            <p>Show us the packaging you use now, send us a photo or sample, tell us what you are packaging or simply share the idea you are working on.</p>
            <p>We can help you develop the packaging around the product, how it will be used, the protection it needs and how you want your brand to look.</p>
            <p>If you are currently buying that packaging in conventional plastic, talk to us. There is a good chance a compostable alternative is worth exploring.</p>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><QuoteButton /><ConsultationButton dark /></div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg shadow-slate-300/15 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="max-h-[360px] overflow-hidden bg-mist p-5 lg:max-h-[420px]"><PackagingImage image={mailerPackaging} alt="Custom printed compostable mailer" className="h-full w-full object-contain" /></div>
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">Custom compostable mailers</p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-charcoal/75">Custom printed mailers remain one of Zero Pack’s most established packaging products, with a dedicated page covering sizing, performance, branding, certification and ordering.</p>
              <div className="mt-7"><CTAButton href="/custom-compostable-mailers/" variant="secondary">Explore Custom Mailers</CTAButton></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-air">Real customer packaging</p><h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Custom packaging in the real world</h2><p className="mt-4 text-lg text-charcoal/75">Explore packaging created for different brands, products and applications.</p></div><CTAButton href="/customer-showcase/" variant="secondary">View Customer Work</CTAButton></div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {customerImages.map((item, index) => (
              <div key={item.alt} className={`overflow-hidden rounded-2xl border border-slate-200/70 bg-stone ${index === 0 || index === 5 ? "lg:col-span-2" : ""}`}><PackagingImage image={item.image} alt={item.alt} className="aspect-square h-full w-full object-contain p-3" /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#edf7f0] via-white to-[#e9f5fb] py-14 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-air">Start with whatever you have</p><h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">You do not need a finished brief</h2><p className="mt-5 text-lg leading-relaxed text-charcoal/75">You can come to us with:</p><p className="mt-4 text-lg leading-relaxed text-charcoal/75">You don’t need to know which type of packaging you need. Bring us what you have and we’ll work through the next step with you.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><QuoteButton /><ConsultationButton /></div></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quoteInputs.map((item, index) => (
              <div key={item} className={`flex min-h-28 items-center rounded-2xl border border-white bg-white/90 p-4 text-sm font-semibold leading-snug text-charcoal shadow-sm ${index === 7 ? "sm:col-span-2" : ""}`}><span><span className="mb-2 block text-air" aria-hidden>0{index + 1}</span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6"><h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Custom compostable packaging FAQ</h2><div className="mt-8"><FAQAccordion items={faqItems} /></div></div>
      </section>

      <section className="border-y border-slate-200/50 bg-stone py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-air">Still researching your options?</p><h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal">Start with the Packaging Guide</h2><p className="mt-4 max-w-3xl text-lg leading-relaxed text-charcoal/75">If you are still comparing materials, packaging types or suppliers, the Zero Pack Packaging Guide will help you understand the decisions that matter before production.</p><p className="mt-3 max-w-3xl leading-relaxed text-charcoal/70">It covers custom packaging, compostability, certification, materials, quantities and what to think about before requesting a quote.</p></div><CTAButton href="/packaging-guide/" variant="secondary">Read the Packaging Guide</CTAButton></div>
      </section>

      <section className="relative overflow-hidden bg-[#07150f] py-14 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,168,243,0.18),transparent_38%),radial-gradient(circle_at_85%_70%,rgba(131,185,37,0.15),transparent_40%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6"><div className="mx-auto max-w-3xl text-center"><h2 className="font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl">What do you need to package?</h2><p className="mt-5 text-lg leading-relaxed text-slate-200">Show us what you use now, tell us about the product or share the idea you are working on.</p><p className="mt-3 leading-relaxed text-slate-300">You do not need to know the final type of packaging, material or specification before you get in touch.</p><p className="mt-3 leading-relaxed text-slate-300">We’ll help you turn the requirement into custom compostable packaging made for your product and your brand.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><QuoteButton /><ConsultationButton dark /></div></div><div id="quoteform" className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-3 text-charcoal shadow-xl sm:p-5"><TypeformFormEmbed className="min-h-[620px] w-full" /></div></div>
      </section>
    </div>
  );
}
