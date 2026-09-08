import type { Metadata } from "next";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const updated = "8 September 2026";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return {
    ...buildMarketPageMetadata({
      market,
      title: "Terms of Use | Zero Pack",
      description: "Terms governing use of the Zero Pack website and information published on it.",
      path: "/terms/",
    }),
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Terms of use</h1>
        <p className="mt-3 text-sm text-charcoal/60">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">About these terms</h2>
            <p className="mt-3">
              These terms govern your use of Zero Pack websites and the information, tools and content made available through
              them. By using the website, you agree to use it lawfully and in a way that does not interfere with the website,
              our systems or other users.
            </p>
            <p className="mt-3">
              These website terms are separate from the commercial terms that apply to a quotation, order or project. Where you
              purchase packaging or related services from Zero Pack, the applicable written quote, order documentation and any
              agreed commercial terms will govern that transaction.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Website information</h2>
            <p className="mt-3">
              We aim to keep website information useful and accurate, but product availability, specifications, minimum order
              quantities, lead times, pricing, freight, certification scope and other commercial details can change. Website
              information is general and should not be treated as a binding quotation, specification, legal statement or promise
              that a particular packaging format will be suitable for every application.
            </p>
            <p className="mt-3">
              Product suitability, artwork, dimensions, materials, printing, certification coverage, production timing and
              delivery requirements should be confirmed for the specific project before an order is placed.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Quotes, enquiries and orders</h2>
            <p className="mt-3">
              Submitting an enquiry, quote request, sample request, form or other website interaction does not by itself create a
              contract or require Zero Pack to accept an order. A commercial transaction is formed only through the written
              quotation, order or other acceptance process agreed for that project.
            </p>
            <p className="mt-3">
              Any final quotation should identify the commercial details relevant to that order, which may include the product
              specification, quantity, print requirements, production timing, freight or delivery basis, payment requirements and
              other project-specific terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Environmental and certification information</h2>
            <p className="mt-3">
              Compostability, certification, material and environmental information on this website is intended to describe the
              relevant product or specification as accurately as possible. Certification does not mean that every product has the
              same certification scope or that an end-of-life pathway is available in every location.
            </p>
            <p className="mt-3">
              Where a certification, standard or environmental claim is material to your purchasing or compliance decision,
              request the current product-specific documentation and confirm the exact scope before relying on the claim.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Intellectual property</h2>
            <p className="mt-3">
              Unless otherwise stated, the Zero Pack name, website design, written content, graphics, photographs and other
              original website material are owned by or licensed to Zero Pack. You may view and use the website for legitimate
              business and informational purposes, but you must not reproduce, republish, sell or commercially exploit our
              original content without permission unless the law allows it.
            </p>
            <p className="mt-3">
              Customer names, logos, product imagery and other third-party materials remain the property of their respective
              owners and are used only where Zero Pack has an appropriate basis to display them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Third-party services and links</h2>
            <p className="mt-3">
              The website may link to or use third-party services such as forms, analytics, email, hosting, maps, social platforms
              or other external websites. Those services are operated independently and may have their own terms, privacy notices
              and availability. Zero Pack is not responsible for the content or operation of third-party websites merely because
              we link to them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Acceptable use</h2>
            <p className="mt-3">You must not use the website to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>attempt to gain unauthorised access to the website, accounts, systems or data;</li>
              <li>introduce malicious code, interfere with website operation or deliberately overload the service;</li>
              <li>misrepresent your identity or submit information you are not authorised to provide;</li>
              <li>copy or extract website content in a way that infringes intellectual-property rights; or</li>
              <li>use the website for unlawful, fraudulent or abusive activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Availability and liability</h2>
            <p className="mt-3">
              We may update, change, suspend or remove website content or functionality from time to time. We do not guarantee
              that the website will always be available, uninterrupted or free from errors.
            </p>
            <p className="mt-3">
              To the extent permitted by applicable law, Zero Pack is not responsible for loss arising solely from reliance on
              general website information where the relevant project detail should reasonably have been confirmed through a
              quotation, specification, certificate or other project documentation. Nothing in these terms excludes or limits a
              right, remedy or liability that cannot lawfully be excluded or limited.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Commercial terms</h2>
            <p className="mt-3">
              Website terms are not a substitute for the commercial terms that apply to manufacturing and supply. Matters such as
              deposits, artwork approval, specification tolerances, production changes, cancellations, freight, delivery, risk,
              taxes, duties, claims, defects, remedies and governing law should be addressed in the written commercial documents
              applicable to the relevant quote or order.
            </p>
            <p className="mt-3">
              For international orders, responsibilities can also depend on the agreed delivery basis, importer arrangements and
              the laws applying to the destination. These details should be confirmed in the relevant quotation or order rather
              than inferred from this website.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Privacy</h2>
            <p className="mt-3">
              Our handling of personal information is described in our privacy policy. Cookie and tracking choices can also be
              managed through the consent controls available on the website.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Changes to these terms</h2>
            <p className="mt-3">
              We may update these terms when the website, our services or applicable requirements change. The current version and
              last updated date will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Contact</h2>
            <p className="mt-3">
              Questions about these website terms can be sent to{" "}
              <a className="font-medium text-sky-600 underline-offset-2 hover:underline" href="mailto:hello@zeropack.co">
                hello@zeropack.co
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
