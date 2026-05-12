import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = buildMetadata({
  title: "How It Works | Zero Pack",
  description:
    "Tell us what you need, get a custom quote, confirm artwork and specification, approve production, then receive your made-to-order packaging.",
  path: "/how-it-works/",
});

export default function Page() {
  return (
    <div className="bg-white pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">How it works</h1>
        <p className="mt-4 max-w-3xl text-lg text-charcoal/75">
          Production and delivery timelines depend on region, order quantity, print specification and freight method.
          Zero Pack confirms expected timing before production begins.
        </p>
      </div>
      <ProcessSteps
        title="Seven clear steps"
        steps={[
          { title: "Tell us what you need", body: "Volumes, sizes, print intent, timeline — estimates are fine." },
          { title: "Get a custom quote", body: "We clarify missing details and explain pricing drivers." },
          { title: "Confirm size, print and artwork", body: "Specification is aligned to production requirements." },
          { title: "Approve production details", body: "Written confirmation before anything starts." },
          { title: "Production begins", body: "Manufacturing partners produce to the agreed specification." },
          { title: "Your packaging is shipped", body: "Freight method and region affect delivery dates." },
          { title: "Reorder when ready", body: "Most brands run on a rhythm — we support repeat planning." },
        ]}
        footerNote="We do not overpromise speed. Dates are confirmed for your specific job once specification and freight are known."
      />
      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/quote/" variant="primary">
            Get a Custom Quote
          </CTAButton>
          <CTAButton href="/packaging-guide/" variant="secondary">
            Get the Compostable Packaging Guide
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
