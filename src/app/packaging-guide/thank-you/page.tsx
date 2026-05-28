import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { QUOTE_FORM_HREF } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Thank You | Compostable Packaging Guide",
  description: "Your guide request was received. Next steps for pricing and specification.",
  path: "/packaging-guide/thank-you/",
});

export default function Page() {
  return (
    <section className="bg-stone py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal">Thank you — your guide is on the way</h1>
        <p className="mt-4 text-charcoal/75">
          Check your inbox for the download link. If it does not arrive within a few minutes, check spam or contact us
          and we will resend it.
        </p>
        <p className="mt-6 text-charcoal/75">
          Ready to price your packaging?{" "}
          <span className="font-semibold text-charcoal">Request a custom quote</span> when you have enough detail — or
          when you want help deciding what detail you need.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
