import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { SiteImage } from "@/components/SiteImage";
import { TypeformFormEmbed } from "@/components/TypeformFormEmbed";
import campaignBag from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (2).png";
import bubbleWrap from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (3).png";
import rigidFoodPackaging from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (5).png";
import garmentBag from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (17).png";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";
import type { FaqItem } from "@/lib/types";

const path = "/how-it-works/";
const QUOTE_HREF = "#quoteform";
const CONSULTATION_URL = "https://calendly.com/zeropackco/30min";

function QuoteButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={QUOTE_HREF}
      className={`inline-flex min-h-12 items-center justify-center rounded-lg bg-air px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0096d6] ${className}`}
    >
      Get a Custom Quote
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
        ? "inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-air/50 hover:bg-white/10"
        : "inline-flex min-h-12 items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3.5 text-sm font-semibold text-compost transition hover:border-compost hover:bg-mist"}
    >
      Book a Packaging Consultation
    </a>
  );
}

function PackagingImage({
  image,
  alt,
  className,
  priority = false,
  unoptimized = false,
  sizes,
}: {
  image: StaticImageData;
  alt: string;
  className: string;
  priority?: boolean;
  unoptimized?: boolean;
  sizes: string;
}) {
  return (
    <SiteImage
      src={image}
      alt={alt}
      width={image.width}
      height={image.height}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
      sizes={sizes}
    />
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

function ArtworkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z" />
      <path d="m13.8 7.2 3 3M4 20l1-4 3 3" />
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

const startingPoints = [
  "the packaging you use now",
  "your product",
  "a photo or sample",
  "approximate dimensions",
  "an expected quantity",
  "artwork or brand files",
  "an existing plastic package you want to replace",
  "or simply an idea",
] as const;

const processSteps = [
  {
    title: "Tell us what you need",
    paragraphs: [
      "Show us what you use now, tell us about the product or share the idea you are working on.",
      "If you already know the size, quantity or branding you need, include it. If you don’t, that is fine too.",
      "The important part is giving us a clear picture of what you need the packaging to do.",
    ],
    cta: true,
  },
  {
    title: "We explore the right solution",
    paragraphs: [
      "We help you work through the type of packaging that suits your product and how it will be used.",
      "That can include the material, size, branding, print, protection requirements, compostability and certification.",
      "You don’t need to make those decisions on your own. We’ll help you shape the packaging around your product and your business.",
    ],
  },
  {
    title: "Approve the details",
    paragraphs: [
      "Before production begins, you review and approve the final project details.",
      "Depending on the packaging, this can include artwork, sizing, quantity, packaging specification and the quoted commercial details.",
      "Nothing moves into production until the agreed details are approved.",
    ],
  },
  {
    title: "We produce and deliver",
    paragraphs: [
      "Once everything is approved, your packaging is made to the agreed project requirements.",
      "Production and delivery timing are confirmed as part of the quote and project process, so you know what to expect before manufacturing begins.",
      "The result is custom certified compostable packaging ready for your business to use.",
    ],
  },
] as const;

const supportItems = [
  {
    title: "Choosing the right packaging",
    icon: PackageIcon,
    paragraphs: [
      "We’ll help you explore the type of packaging that suits your product, how it will be used and the level of protection it needs.",
      "We can also help work through sizing, material and other packaging requirements as the solution develops.",
      "Zero Pack works across custom compostable mailers, shopping and carry bags, garment packaging, flexible bags and pouches, protective packaging, food packaging, rigid packaging, layflat tubing and bespoke packaging projects.",
    ],
  },
  {
    title: "Branding & artwork",
    icon: ArtworkIcon,
    paragraphs: [
      "Bring us your logo, brand files or existing artwork.",
      "We can help prepare the packaging artwork for production and make sure the finished packaging matches your brand.",
    ],
  },
  {
    title: "Compostability & certification",
    icon: DocumentIcon,
    paragraphs: [
      "Zero Pack supplies certified compostable packaging.",
      "We’ll confirm the certification that applies to your packaging as part of developing the right solution.",
    ],
  },
  {
    title: "Preparing for production",
    icon: CheckIcon,
    paragraphs: [
      "Once the packaging, artwork and commercial details are agreed, we bring everything together so the project is ready to manufacture.",
    ],
  },
] as const;

const faqItems: FaqItem[] = [
  {
    question: "What do I need before requesting a quote?",
    answer: "You can start with as much or as little as you have.\n\nThe product, your current packaging, a photo, sample, rough dimensions, expected quantity or an early idea can all be enough to start the conversation.\n\nYou do not need a finished technical brief.",
  },
  {
    question: "What if I don’t know which type of packaging I need?",
    answer: "That is completely fine.\n\nTell us what you need to package, how the packaging will be used and what you want it to achieve.\n\nWe’ll help you explore the right type of packaging and work through the next steps with you.",
  },
  {
    question: "Can you help replace packaging we currently buy in plastic?",
    answer: "Absolutely.\n\nShow us what you use now or tell us what the packaging needs to do, and we’ll explore the compostable options with you.",
    ctaLabel: "Book a Packaging Consultation",
    ctaHref: CONSULTATION_URL,
    ctaExternal: true,
  },
  {
    question: "Can you help with sizing and artwork?",
    answer: "Yes.\n\nYou can send us existing packaging dimensions, product measurements, brand files or artwork if you have them.\n\nWe can help work through sizing and prepare your artwork for production as part of developing the packaging.",
  },
  {
    question: "When do we approve the final packaging?",
    answer: "You approve the agreed project details before production begins.\n\nDepending on the project, that can include artwork, sizing, quantity, packaging specification and commercial details.",
  },
  {
    question: "Is all Zero Pack compostable packaging certified?",
    answer: "Yes. All Zero Pack compostable packaging is certified.\n\nThe exact certification depends on the material and type of packaging being produced, and we’ll confirm the relevant certification for your project.",
  },
  {
    question: "How long does custom production take?",
    answer: "Timing depends on the type of packaging, specification, quantity, production requirements and delivery destination.\n\nWe confirm expected production and delivery timing during the quote and approval process rather than using one lead time for every project.",
  },
  {
    question: "Do I need finished artwork before I contact you?",
    answer: "No.\n\nIf you already have artwork or brand files, send them through. If not, you can still start the conversation before the production artwork is complete.",
  },
  {
    question: "Can you make changes on a future order?",
    answer: "Yes.\n\nIf your packaging requirements change, we can work with you on updates such as sizing, branding, quantity or other project details before the next production run.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return buildMarketPageMetadata({
    market,
    title: "How Custom Compostable Packaging Works | Zero Pack",
    description:
      "See how Zero Pack turns your product, existing packaging or idea into custom certified compostable packaging, from initial requirements through to production.",
    path,
  });
}

export default function Page() {
  return (
    <div className="bg-white text-charcoal sm:-mb-6">
      <FAQSchema items={faqItems} />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#07150f] py-14 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_45%,rgba(131,185,37,0.22),transparent_42%),radial-gradient(circle_at_82%_50%,rgba(0,168,243,0.24),transparent_46%),linear-gradient(155deg,#07150f_0%,#103224_48%,#071522_100%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79d6a7] sm:text-sm">Custom compostable packaging · Made to order · B2B</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.03] text-white sm:text-5xl lg:text-6xl">Custom compostable packaging, from idea to production</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-100">Tell us what you need to package and we’ll help you work through the right solution.</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/80 sm:text-lg">You can come to us with a finished brief, the packaging you use now, a product sample, a photo or simply an idea. We’ll help turn what you have into custom certified compostable packaging made for your product and brand.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><QuoteButton /><ConsultationButton dark /></div>
          </div>
          <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2 overflow-hidden rounded-3xl border border-white/15 bg-white p-5 shadow-2xl shadow-black/25 sm:p-7">
              <PackagingImage image={rigidFoodPackaging} alt="Custom rigid compostable food packaging" className="aspect-[16/9] h-auto w-full object-contain" sizes="(max-width: 1024px) 90vw, 45vw" priority unoptimized />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white p-3 shadow-xl shadow-black/20 sm:p-4">
              <PackagingImage image={bubbleWrap} alt="Compostable bubble-wrap-style protective packaging" className="aspect-square h-auto w-full object-contain" sizes="(max-width: 1024px) 45vw, 22vw" priority />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white p-3 shadow-xl shadow-black/20 sm:p-4">
              <PackagingImage image={campaignBag} alt="Custom branded compostable carry bag" className="aspect-square h-auto w-full object-contain" sizes="(max-width: 1024px) 45vw, 22vw" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#edf7f0] via-white to-[#e9f5fb] py-14 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">Start with whatever you have</p>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl font-semibold text-charcoal sm:text-4xl">You don’t need to have everything worked out</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal/75">You do not need to know the right material, type of packaging or final specification before you contact us.</p>
            <p className="mt-4 text-base font-semibold text-charcoal/80">A useful starting point could be:</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {startingPoints.map((item) => (
              <li key={item} className="flex min-h-20 items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 text-sm font-semibold leading-snug text-charcoal shadow-sm sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf/20 text-compost" aria-hidden>✓</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto mt-8 max-w-7xl px-4 text-lg leading-relaxed text-charcoal/75 sm:px-6 lg:px-8">Bring us what you have and we’ll work through the next step with you.</p>
      </section>

      <section className="border-y border-slate-200/60 bg-stone py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">How it works</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Four steps from idea to finished packaging</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {processSteps.map((step, index) => (
              <article key={step.title} className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-air/10 font-heading text-xl font-semibold text-air">{index + 1}</span>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-charcoal">{step.title}</h3>
                    <div className="mt-4 space-y-3 text-base leading-relaxed text-charcoal/70">{step.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                    {"cta" in step && step.cta ? <QuoteButton className="mt-6" /> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">What we help you with</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Support where you need it</h2>
            <div className="mt-5 space-y-3 text-lg leading-relaxed text-charcoal/75"><p>Every project starts from a different point.</p><p>Some customers already know exactly what they want. Others know only what they need the packaging to achieve.</p></div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {supportItems.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200/70 bg-stone/55 p-6 sm:p-8">
                <div className="inline-flex rounded-full bg-air/10 p-3 text-air"><item.icon className="h-7 w-7" /></div>
                <h3 className="mt-5 font-heading text-2xl font-semibold text-charcoal">{item.title}</h3>
                <div className="mt-4 space-y-3 text-base leading-relaxed text-charcoal/70">{item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-14 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_38%,rgba(0,168,243,0.18),transparent_42%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-air/15 text-air"><DocumentIcon className="h-10 w-10" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#79d6a7]">Certified compostable packaging</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Compostability you can stand behind</h2>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-200">You do not need to understand compostability standards or certification before you contact us.</p>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-slate-200">All Zero Pack compostable packaging is certified, and we’ll confirm the certification that applies to your packaging as part of developing the right solution.</p>
          </div>
        </div>
      </section>

      <section className="bg-mist/60 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-300/20">
            <PackagingImage image={garmentBag} alt="Custom compostable packaging ready for repeat production" className="aspect-square h-auto w-full object-contain" sizes="(max-width: 1024px) 90vw, 42vw" unoptimized />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">After your first order</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Need more packaging later?</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-charcoal/75"><p>When you are ready for another production run, we can work from the packaging and project details already established.</p><p>If your packaging needs change, we can also work with you on updates to sizing, branding, quantity or the type of packaging for the next project.</p><p>The aim is simple: make it easier to keep your packaging working for your business as your needs change.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-air">How it works FAQ</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Questions before you start</h2>
          <div className="mt-8"><FAQAccordion items={faqItems} /></div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07150f] py-14 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(0,168,243,0.18),transparent_38%),radial-gradient(circle_at_84%_70%,rgba(131,185,37,0.16),transparent_42%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl">Tell us what you need to package</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-200">Show us what you use now, tell us about the product or share the idea you are working on.</p>
            <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">You don’t need to know the final type of packaging, material or specification before you start.</p>
            <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">Bring us what you have and we’ll help you work through the right compostable solution.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><QuoteButton /><ConsultationButton dark /></div>
          </div>
          <div id="quoteform" className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-3 text-charcoal shadow-xl sm:p-5"><TypeformFormEmbed className="min-h-[620px] w-full" /></div>
        </div>
      </section>
    </div>
  );
}
