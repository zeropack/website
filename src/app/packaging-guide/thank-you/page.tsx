import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { brandGuide } from "@/content/guides/brandGuide";
import { QUOTE_FORM_HREF } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Thank You | Packaging Guide Download",
    description: "Your guide request was received. Download the PDF or continue reading online.",
    path: "/packaging-guide/thank-you/",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  const pdfUrl = `/${brandGuide.pdfFilename}`;

  return (
    <section className="bg-stone py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal">
          Your guide and toolkit are on the way
        </h1>
        <p className="mt-4 text-charcoal/75">
          Check your inbox for the download link. Your package includes:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
            <span>The full 2026 Branded &amp; Eco Friendly Packaging Guide (PDF)</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
            <span>Print-ready decision checklist — are you ready for custom compostable packaging?</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
            <span>Quote-ready planning prompt — everything you need to gather before requesting a quote</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
            <span>Artwork brief template — what to share with your designer before artwork is created</span>
          </li>
        </ul>
        <p className="mt-4 text-sm text-charcoal/60">
          You are also on the list for the next annual edition — we publish an updated guide every
          year and notify subscribers first.
        </p>

        <p className="mt-8">
          <a
            className="inline-flex rounded-full bg-compost px-5 py-2.5 text-sm font-semibold text-white hover:bg-compost/90"
            href={pdfUrl}
            download
          >
            Download now (PDF)
          </a>
        </p>


        <p className="mt-8 text-charcoal/75">
          Ready to price your packaging? Request a custom quote when you have enough detail — or
          when you want help deciding what detail you need.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <CTAButton href={QUOTE_FORM_HREF} variant="primary">
            Request a custom quote
          </CTAButton>
          <Link className="text-sm font-semibold text-air hover:underline" href="/articles/">
            Keep reading in Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
