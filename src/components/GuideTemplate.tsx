import Link from "next/link";
import { CTAButton } from "./CTAButton";
import { CustomPackagingProofBar } from "./CustomPackagingProofBar";
import { FAQAccordion } from "./FAQAccordion";
import { FAQSchema } from "./FAQSchema";
import { JsonLd } from "./JsonLd";
import { SiteImage } from "./SiteImage";
import { CERTIFICATION_FAQ_ANSWERS } from "@/content/certificationFaqs";
import { brandGuide } from "@/content/guides/brandGuide";
import { getGuidePdfBrowserHref, isGuidePreviewBuild } from "@/lib/guidePdf";
import { buildMarketUrl } from "@/lib/marketRouting";
import type { LaunchedMarket } from "@/lib/requestMarket";
import type { FaqItem } from "@/lib/types";

const downloadPath = "/packaging-guide/download/";

const guideBenefits = [
  {
    number: "01",
    title: "Choose packaging that fits the job",
    description:
      "Compare the practical strengths and trade-offs of mailers, flexible bags, carry bags and more before you commit.",
  },
  {
    number: "02",
    title: "Know what to prepare",
    description:
      "Get clear on size, quantity, artwork, colours, delivery country and timing so your first conversation goes somewhere useful.",
  },
  {
    number: "03",
    title: "Make claims you can stand behind",
    description:
      "Understand certification, disposal guidance and the difference between specific compostability claims and vague green language.",
  },
  {
    number: "04",
    title: "Decide whether the timing is right",
    description:
      "Use the commercial questions and decision checklist to work out whether custom packaging makes sense for your business now.",
  },
] as const;

const included = [
  {
    title: "The complete 14-page guide",
    description:
      "A practical walk-through of custom compostable packaging, from material choices to first-order planning.",
  },
  {
    title: "Decision checklist",
    description:
      "Ten clear questions to help you assess whether your brand is ready to move into custom packaging.",
  },
  {
    title: "Quote-ready planning prompt",
    description:
      "A simple list of the details worth gathering before you ask a supplier to price your project.",
  },
  {
    title: "Artwork brief",
    description:
      "The essentials your designer will need to consider before packaging artwork is prepared for production.",
  },
] as const;

function getGuideFaqs(market: LaunchedMarket): FaqItem[] {
  return [
    {
      question: "What is covered in the custom compostable packaging guide?",
      answer:
        "The guide covers how custom compostable packaging works, how to compare packaging types, when custom packaging makes commercial sense, what certification and disposal claims mean, and what to prepare before requesting a quote. It also includes a decision checklist, quote-ready planning prompt and artwork brief.",
    },
    {
      question: "Who is the guide for?",
      answer:
        "It is written for ecommerce brands, retailers and organisations considering custom compostable packaging. It is especially useful if you are comparing packaging options, planning a first order or trying to work out whether your volumes and brand are ready for a custom solution.",
    },
    {
      question: "Is the guide free?",
      answer:
        "Yes. Complete the download form and Zero Pack will email you the guide. The form also explains the marketing-email consent that applies, and you can unsubscribe at any time.",
    },
    {
      question: "Is Zero Pack compostable packaging certified?",
      answer: CERTIFICATION_FAQ_ANSWERS[market],
    },
    {
      question: "Do I need to know exactly what packaging I want before I read it?",
      answer:
        "No. The guide is designed to help you narrow the options and identify the questions that matter. If you already know your product dimensions, likely order quantity and delivery country, those details will make the planning sections even more useful.",
    },
  ];
}

export function GuideTemplate({ market }: { market: LaunchedMarket }) {
  const pdfUrl = buildMarketUrl(market, `/${brandGuide.pdfFilename}`);
  const previewPdfUrl = getGuidePdfBrowserHref(brandGuide.pdfFilename);
  const isPreview = isGuidePreviewBuild();
  const pageUrl = buildMarketUrl(market, brandGuide.path);
  const guideFaqs = getGuideFaqs(market);

  const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Zero Pack's Guide to Custom Compostable Packaging",
    description:
      "A practical guide to choosing, planning and briefing custom compostable packaging.",
    url: pageUrl,
    mainEntity: {
      "@type": "CreativeWork",
      name: "Zero Pack's Guide to Custom Compostable Packaging",
      author: { "@type": "Organization", name: "Zero Pack" },
      encoding: {
        "@type": "MediaObject",
        contentUrl: pdfUrl,
        encodingFormat: "application/pdf",
      },
    },
  };

  return (
    <main>
      <JsonLd data={guideJsonLd} />
      <FAQSchema items={guideFaqs} />

      <section className="relative overflow-hidden bg-charcoal py-14 text-white sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.18),transparent_72%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(86,166,67,0.18),transparent_72%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
              Free packaging guide
            </p>
            <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Zero Pack&apos;s Guide to Custom Compostable Packaging
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Before you order a single bag, get clear on what will suit your
              products, support your brand and make commercial sense. This is
              the practical guide we wish every packaging project started with.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTAButton href={downloadPath} variant="primary" className="px-6 py-3.5">
                Download the Free Guide
              </CTAButton>
              <Link
                href="/custom-compostable-packaging/"
                className="inline-flex items-center justify-center px-3 py-3 text-sm font-semibold text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                Explore custom packaging
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/55">
              14 pages · Practical checklists · Built for real packaging decisions
            </p>
            {isPreview ? (
              <a
                href={previewPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-air underline decoration-air/40 underline-offset-4 hover:decoration-air"
              >
                Open the review PDF
              </a>
            ) : null}
          </div>

          <div className="relative mx-auto w-full max-w-md px-8 py-5 sm:px-12">
            <div
              className="absolute inset-x-0 bottom-2 top-12 rotate-6 rounded-[2rem] border border-white/10 bg-air/15"
              aria-hidden
            />
            <div className="relative -rotate-2 overflow-hidden rounded-2xl border border-white/15 bg-white p-2 shadow-2xl shadow-black/35 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]">
              <SiteImage
                src="/images/guides/custom-compostable-packaging-guide-cover.webp"
                alt="Cover of Zero Pack's Guide to Custom Compostable Packaging"
                width={910}
                height={1287}
                sizes="(max-width: 1024px) 80vw, 34vw"
                priority
                className="h-auto w-full rounded-xl"
              />
            </div>
            <div className="absolute -bottom-2 right-0 rounded-2xl border border-white/10 bg-compost px-5 py-4 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-air">Inside</p>
              <p className="mt-1 font-heading text-sm font-semibold text-white">
                Checklist + planning tools
              </p>
            </div>
          </div>
        </div>
      </section>

      <CustomPackagingProofBar />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
              Start smarter
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              Less guesswork. Better questions. A smoother first order.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
              Custom packaging brings decisions about material, protection,
              print, quantities, certification and timing. The guide turns
              those moving parts into a clear place to start.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {guideBenefits.map((benefit) => (
              <article
                key={benefit.number}
                className="rounded-2xl border border-slate-200/80 bg-stone p-6 transition hover:-translate-y-1 hover:border-air/40 hover:shadow-lg hover:shadow-slate-200/50"
              >
                <p className="font-heading text-sm font-semibold text-air">{benefit.number}</p>
                <h3 className="mt-3 font-heading text-xl font-semibold text-charcoal">
                  {benefit.title}
                </h3>
                <p className="mt-3 leading-relaxed text-charcoal/70">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--site-header-height)+2rem)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
              One useful download
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
              Everything you need to move from “maybe” to a workable brief
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
              Read it cover to cover or jump straight to the checklist. Either
              way, you will finish with a clearer idea of what your project
              needs—and what to ask next.
            </p>
            <div className="mt-7">
              <CTAButton href={downloadPath} variant="primary">
                Download the Free Guide
              </CTAButton>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {included.map((item, index) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-leaf/15 text-sm font-bold text-compost">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid overflow-hidden rounded-3xl bg-compost text-white lg:grid-cols-2">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
                Useful before you are quote-ready
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
                You do not need all the answers yet
              </h2>
              <p className="mt-5 leading-relaxed text-white/80">
                The guide is for the thinking stage: when you are comparing
                options, checking whether the numbers work or trying to turn a
                rough idea into a useful packaging brief.
              </p>
              <p className="mt-4 leading-relaxed text-white/80">
                When you are ready to talk specifics, Zero Pack can help shape
                the packaging around your product, brand and delivery needs.
              </p>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-1">
              <div className="bg-white/5 p-7 sm:p-9">
                <p className="font-heading text-xl font-semibold">Still exploring?</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Download the guide and use the checklist to find your next question.
                </p>
                <Link
                  href={downloadPath}
                  className="mt-5 inline-flex text-sm font-semibold text-air underline underline-offset-4"
                >
                  Get the guide
                </Link>
              </div>
              <div className="bg-white/5 p-7 sm:p-9">
                <p className="font-heading text-xl font-semibold">Already planning?</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  See the packaging Zero Pack can develop, then request a custom quote.
                </p>
                <Link
                  href="/custom-compostable-packaging/"
                  className="mt-5 inline-flex text-sm font-semibold text-air underline underline-offset-4"
                >
                  Explore custom packaging
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">FAQ</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
            About the guide
          </h2>
          <div className="mt-8">
            <FAQAccordion items={guideFaqs} />
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
            Start with the right questions
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">
            Make your next packaging decision with confidence
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Get the practical guide to choosing, planning and briefing custom
            compostable packaging for your brand.
          </p>
          <div className="mt-8">
            <CTAButton href={downloadPath} variant="primary" className="px-7 py-3.5">
              Download the Free Guide
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
