import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { KlaviyoEmbed } from "@/components/KlaviyoEmbed";
import { SiteImage } from "@/components/SiteImage";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/packaging-guide/download/";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const metadata = buildMarketPageMetadata({
    market,
    title: "Download the Custom Compostable Packaging Guide",
    description:
      "Get Zero Pack's practical guide to choosing, planning and briefing custom compostable packaging.",
    path,
  });

  return { ...metadata, robots: { index: false, follow: true } };
}

const included = [
  "How to compare custom compostable packaging options",
  "The commercial and operational questions worth asking",
  "Certification, disposal guidance and clearer claims",
  "A decision checklist, planning prompt and artwork brief",
] as const;

export default function Page() {
  return (
    <main className="bg-stone py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/packaging-guide/"
          className="text-sm font-semibold text-compost underline decoration-compost/25 underline-offset-4 hover:decoration-compost"
        >
          ← Back to guide overview
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(24rem,1.18fr)] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--site-header-height)+2rem)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
              Free download
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
              Get The Brand&apos;s Guide to Custom Compostable Packaging
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              Tell us a little about your packaging plans and we will email you
              the complete guide.
            </p>

            <div className="mt-8 grid grid-cols-[7rem_minmax(0,1fr)] gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <SiteImage
                src="/images/guides/custom-compostable-packaging-guide-cover.webp"
                alt="Cover of The Brand's Guide to Custom Compostable Packaging"
                width={910}
                height={1287}
                sizes="144px"
                className="h-auto w-full rounded-lg border border-slate-200 shadow-md"
              />
              <div>
                <p className="font-heading text-lg font-semibold text-charcoal">Inside the guide</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-charcoal/70">
                  {included.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-charcoal/55">
              The checklist and planning tools are included in the 28-page PDF,
              so there is only one file to keep and share with your team.
            </p>
          </div>

          <section
            id="guideform"
            aria-labelledby="guide-form-heading"
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
              Send me the guide
            </p>
            <h2
              id="guide-form-heading"
              className="mt-3 font-heading text-2xl font-semibold text-charcoal sm:text-3xl"
            >
              Where should we send it?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
              Complete the form below. We will use your answers to send the guide
              and understand which packaging information may be most relevant to you.
            </p>
            <KlaviyoEmbed formId="R8WtWh" className="mt-6" />
          </section>
        </div>

        <section className="mt-12 rounded-2xl bg-compost p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-9">
          <div>
            <p className="font-heading text-xl font-semibold sm:text-2xl">
              Already have a clear packaging project?
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
              Tell us what you need and we will help you work through the right
              packaging, size, print and production details.
            </p>
          </div>
          <div className="mt-6 shrink-0 sm:mt-0">
            <CTAButton href={QUOTE_FORM_HREF} variant="primary">
              Get a Custom Quote
            </CTAButton>
          </div>
        </section>
      </div>
    </main>
  );
}
