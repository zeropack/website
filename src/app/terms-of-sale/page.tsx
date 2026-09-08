import type { Metadata } from "next";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const updated = "8 September 2026";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return {
    ...buildMarketPageMetadata({
      market,
      title: "Terms & Conditions of Sale | Zero Pack",
      description: "General commercial terms applying to Zero Pack quotations and custom packaging orders.",
      path: "/terms-of-sale/",
    }),
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Terms &amp; Conditions of Sale</h1>
        <p className="mt-3 text-sm text-charcoal/60">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">1. How these terms apply</h2>
            <p className="mt-3">These terms apply to quotations and orders for custom packaging supplied by Zero Pack unless different terms are expressly agreed in writing for a particular order. The accepted quotation, order confirmation and approved specification form part of the commercial agreement.</p>
            <p className="mt-3">If a quotation or order confirmation contains a specific term that differs from these general terms, the specific written term for that order takes precedence to the extent of the inconsistency.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">2. Quotations and pricing</h2>
            <p className="mt-3">A quotation is an estimate based on the information available when it is issued and remains valid for the period stated on the quotation. Pricing may be subject to final artwork, product specification, destination, shipment weight and dimensions, exchange rates, freight and other order-specific details where those matters are not yet final.</p>
            <p className="mt-3">No website price, indicative price or earlier quotation overrides a later written quotation for the same project.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">3. Artwork and specification approval</h2>
            <p className="mt-3">Custom packaging is manufactured to the artwork, dimensions, print requirements, material specification and other details approved for the order. Customers are responsible for checking supplied artwork, spelling, colours, dimensions, placement and other customer-controlled details before approval.</p>
            <p className="mt-3">Production may not begin until the required artwork and specification approvals have been received. Changes requested after approval may affect price, timing or production feasibility.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">4. Manufacturing tolerances</h2>
            <p className="mt-3">Custom manufacturing involves normal production variation. Unless a different tolerance is stated on the quotation or approved specification, final production quantity may vary by up to plus or minus 10% from the requested quantity.</p>
            <p className="mt-3">Print appearance can also vary from screen proofs and between print processes or substrates. In particular, white ink printed over a colour may not appear as a pure brilliant white. Samples are available where a customer wants to review representative finished print appearance before ordering.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">5. Product configuration</h2>
            <p className="mt-3">Mailer flap size, adhesive configuration, thickness, dimensions, print and other construction details are determined by the approved quotation and specification. Standard configurations shown in prior correspondence or examples do not override the specification approved for the relevant order.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">6. Compostable packaging storage and shelf life</h2>
            <p className="mt-3">Compostable packaging has a finite shelf life and should be stored in a dry location away from moisture and direct sunlight. Current Zero Pack guidance for the quoted compostable packaging referenced in our standard quotation process is room-temperature storage around 20–25°C, with an expected shelf life of approximately 12–18 months when stored appropriately. Where a product-specific specification gives different storage or shelf-life instructions, that specification takes precedence.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">7. Payment and order commencement</h2>
            <p className="mt-3">Payment requirements, deposits, balances and due dates are those stated on the quotation, invoice or other order documentation. An order is not required to enter production until any required payment and approvals have been received.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">8. Custom-made products and cancellations</h2>
            <p className="mt-3">Custom packaging is manufactured specifically for the customer and is not a stock product. Once production has commenced, cancellation, artwork changes, specification changes or quantity changes may not be possible and may result in costs already incurred being payable.</p>
            <p className="mt-3">Change-of-mind returns do not apply to custom-made packaging. This does not remove any right or remedy that cannot lawfully be excluded and does not prevent a customer from raising a genuine manufacturing defect, shortage or specification issue.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">9. Production and delivery timing</h2>
            <p className="mt-3">Production, freight and delivery timings are estimates unless expressly guaranteed in writing. Timing can be affected by artwork approval, production scheduling, freight availability, customs, weather, port or carrier disruption and other circumstances outside Zero Pack&apos;s reasonable control.</p>
            <p className="mt-3">Customers should tell us about any fixed launch, campaign or delivery deadline before accepting a quotation so feasibility can be assessed for the specific order.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">10. Shipping, duties and delivery charges</h2>
            <p className="mt-3">Shipping is governed by the Shipping Policy and the specific quotation. Freight may be estimated before production and finalised once packed shipment weight, dimensions, destination and service requirements are known. Duties, taxes, customs charges, insurance and delivery services are included only where the quotation expressly says they are included.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">11. Inspection, shortages and defects</h2>
            <p className="mt-3">Customers should inspect delivered goods promptly and notify Zero Pack as soon as reasonably possible if there appears to be a shortage, transit damage, manufacturing defect or material difference from the approved specification. We may ask for photographs, counts, packaging labels, samples or other information reasonably needed to assess the issue.</p>
            <p className="mt-3">Any remedy will depend on the nature of the issue, the agreed specification, available evidence and rights that apply by law.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">12. Customer-supplied artwork and rights</h2>
            <p className="mt-3">By supplying artwork, logos or other content for production, the customer confirms that it is authorised to use that material for the order. The customer remains responsible for third-party intellectual-property rights in customer-supplied content.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">13. Environmental and certification information</h2>
            <p className="mt-3">Environmental, compostability and certification claims apply only to the product or specification supported by the relevant current documentation. Certification does not mean every packaging format has the same scope or that the same end-of-life pathway is available in every location.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">14. Events outside reasonable control</h2>
            <p className="mt-3">Zero Pack is not responsible for delay caused by events outside its reasonable control, including major carrier disruption, port closure, customs delay, industrial action, severe weather, natural disaster, government action or material supply interruption. We will communicate material delays where reasonably practicable.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">15. Contact</h2>
            <p className="mt-3">Questions about these terms can be sent to <a className="font-medium text-sky-600 underline-offset-2 hover:underline" href="mailto:hello@zeropack.co">hello@zeropack.co</a>.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
