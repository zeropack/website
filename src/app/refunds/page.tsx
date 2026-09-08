import type { Metadata } from "next";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const updated = "8 September 2026";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return {
    ...buildMarketPageMetadata({
      market,
      title: "Refund & Returns Policy | Zero Pack",
      description: "Refund, return and issue-resolution policy for Zero Pack custom packaging orders.",
      path: "/refunds/",
    }),
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Refund &amp; returns policy</h1>
        <p className="mt-3 text-sm text-charcoal/60">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Custom-made packaging</h2>
            <p className="mt-3">Zero Pack packaging is generally made specifically to the customer&apos;s approved artwork, size, print and specification. For that reason, custom-made packaging cannot generally be returned or refunded because of a change of mind after production has commenced.</p>
            <p className="mt-3">This policy does not remove any right or remedy that cannot lawfully be excluded and does not prevent a customer from raising a genuine manufacturing defect, shortage, transit-damage or specification issue.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Before production starts</h2>
            <p className="mt-3">If you need to cancel or change an order, contact us as soon as possible. Whether a cancellation or change can be accepted depends on the stage of artwork, material preparation and production, and on costs already committed for the order.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">After production starts</h2>
            <p className="mt-3">Once custom production has begun, cancellation or substantial changes may no longer be possible. Costs already incurred for custom materials, tooling, printing, production, freight bookings or other order-specific work may remain payable.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Manufacturing tolerances are not automatically defects</h2>
            <p className="mt-3">Custom manufacturing can involve approved or normal production tolerances. Unless a different tolerance is stated for the order, final production quantity may vary by up to plus or minus 10% from the requested quantity. Print appearance can also vary from screen proofs and between substrates or print processes.</p>
            <p className="mt-3">A variation within an agreed specification or disclosed manufacturing tolerance is not treated in the same way as a product that materially fails to meet the approved specification.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">If there is a problem with your order</h2>
            <p className="mt-3">Please inspect delivered goods promptly and contact us as soon as reasonably possible if you believe there is a manufacturing defect, material shortage, transit damage or material difference from the approved specification.</p>
            <p className="mt-3">To assess the issue we may ask for photographs, carton labels, counts, samples, the approved artwork or specification, and other information reasonably relevant to the claim.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">How issues are resolved</h2>
            <p className="mt-3">The appropriate resolution depends on the nature and extent of the issue, the agreed specification, the evidence available and any rights that apply by law. Where a claim is substantiated, possible outcomes may include correction, replacement, credit or another reasonable remedy agreed for the circumstances.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Contact</h2>
            <p className="mt-3">To raise an order issue, email <a className="font-medium text-sky-600 underline-offset-2 hover:underline" href="mailto:hello@zeropack.co">hello@zeropack.co</a> with your quote or invoice number and a description of the issue.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
