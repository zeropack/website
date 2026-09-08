import type { Metadata } from "next";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const updated = "8 September 2026";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return {
    ...buildMarketPageMetadata({
      market,
      title: "Shipping Policy | Zero Pack",
      description: "General shipping, freight and delivery policy for Zero Pack custom packaging orders.",
      path: "/shipping/",
    }),
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Shipping policy</h1>
        <p className="mt-3 text-sm text-charcoal/60">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Order-specific shipping comes first</h2>
            <p className="mt-3">Shipping arrangements vary by product, production location, destination, shipment size and service level. The shipping terms stated in the accepted quotation or order confirmation take precedence over this general policy where they are more specific.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Freight estimates and final charges</h2>
            <p className="mt-3">Where final packed weights and dimensions are not available at quotation stage, freight may be estimated and confirmed or adjusted when the goods are ready for shipment. Final freight can depend on carton count, packed dimensions, weight, destination, carrier availability and the delivery service required.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Duties, taxes, customs and insurance</h2>
            <p className="mt-3">Duties, taxes, customs charges, insurance and other import or delivery costs are included only where the quotation expressly states that they are included. For international orders, importer responsibilities and the delivery basis should be confirmed in the relevant quotation or order documentation.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Delivery timing</h2>
            <p className="mt-3">Production and transit dates are estimates unless expressly guaranteed in writing. Freight schedules can be affected by carrier availability, customs processing, ports, weather and other events outside Zero Pack&apos;s reasonable control. We will provide shipment updates where reasonably available.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Delivery access</h2>
            <p className="mt-3">Large commercial deliveries may require suitable unloading access or equipment. If a forklift, tail-lift, hand unload, redelivery, limited-access service or other special handling is required and was not included in the quotation, an additional carrier surcharge may apply.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Delivery details</h2>
            <p className="mt-3">Customers are responsible for providing an accurate delivery address, contact details and any known access restrictions before shipment is booked. Additional carrier costs caused by incorrect or incomplete delivery information may be charged where applicable.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Transit damage or missing goods</h2>
            <p className="mt-3">Please inspect deliveries promptly and contact us as soon as reasonably possible if cartons are visibly damaged, missing or materially short. Photographs, carrier labels, delivery records or carton counts may be required so the issue can be investigated.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Contact</h2>
            <p className="mt-3">Questions about shipping for a current quotation or order can be sent to <a className="font-medium text-sky-600 underline-offset-2 hover:underline" href="mailto:hello@zeropack.co">hello@zeropack.co</a>.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
