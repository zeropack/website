import type { Metadata } from "next";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { CTAButton } from "@/components/CTAButton";
import { KlaviyoEmbed } from "@/components/KlaviyoEmbed";
import { TrackedOutbound } from "@/components/TrackedOutbound";
import { CONTACT_EMAIL, QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/contact/";
export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const description =
    market === "uk"
      ? "Contact Zero Pack for a custom compostable packaging quote, a packaging consultation or a general UK enquiry."
      : market === "au"
        ? "Contact Zero Pack for a custom compostable packaging quote, a packaging consultation or a general Australian enquiry."
        : "Contact Zero Pack for a custom compostable packaging quote, a packaging consultation or a general enquiry.";

  return buildMarketPageMetadata({
    market,
    title: "Contact Zero Pack | Quotes, Consultations & Enquiries",
    description,
    path,
  });
}

export default async function Page() {
  const market = await getRequestMarket();
  const marketNote =
    market === "uk"
      ? "UK enquiries are handled directly by the Zero Pack team in Australia. Tell us where your packaging needs to go and we will make sure the right delivery details are considered."
      : market === "au"
        ? "Australian enquiries are handled directly by the Zero Pack team."
        : "We work with businesses around the world. Tell us where you are based so we can guide the right next step.";

  return (
    <>
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Contact Zero Pack</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
              Tell us what you need help with
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal/70 sm:text-xl">
              Ready for pricing, want to talk through a packaging idea or have a general question? Choose the option
              that best matches what you need and we will take it from there.
            </p>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-charcoal/60">{marketNote}</p>
          </div>
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Choose the right next step</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              What would you like to do?
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <article className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_14px_40px_rgba(17,24,39,0.05)] sm:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-air/10 text-sm font-bold text-air">
                01
              </span>
              <h3 className="mt-6 font-heading text-2xl font-semibold text-charcoal">Get a custom quote</h3>
              <p className="mt-4 flex-1 leading-relaxed text-charcoal/70">
                The quickest route for pricing. Share what you are packing, roughly how many you need and any size,
                artwork or delivery details you already know.
              </p>
              <div className="mt-7">
                <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                  Get a Custom Quote
                </CTAButton>
              </div>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_14px_40px_rgba(17,24,39,0.05)] sm:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-air/10 text-sm font-bold text-air">
                02
              </span>
              <h3 className="mt-6 font-heading text-2xl font-semibold text-charcoal">Book a packaging consultation</h3>
              <p className="mt-4 flex-1 leading-relaxed text-charcoal/70">
                Book a 30-minute call if you would rather talk through your product, existing packaging or early idea
                with us first.
              </p>
              <div className="mt-7">
                <CTAButton href="#consultation" variant="secondary">
                  Book a Consultation
                </CTAButton>
              </div>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_14px_40px_rgba(17,24,39,0.05)] sm:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-air/10 text-sm font-bold text-air">
                03
              </span>
              <h3 className="mt-6 font-heading text-2xl font-semibold text-charcoal">Send a general enquiry</h3>
              <p className="mt-4 flex-1 leading-relaxed text-charcoal/70">
                Use the general enquiry form for partnerships, media, supplier enquiries or questions that are not
                part of a packaging quote.
              </p>
              <div className="mt-7">
                <CTAButton href="#general-enquiry" variant="secondary">
                  Send a Message
                </CTAButton>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="consultation" className="scroll-mt-24 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Packaging consultation</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              Book a time that suits you
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
              Choose a 30-minute time below and we can talk through your product, current packaging or early idea.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(17,24,39,0.08)]">
            <CalendlyEmbed height={780} />
          </div>
        </div>
      </section>

      <section id="general-enquiry" className="scroll-mt-24 bg-stone py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">General enquiries</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              Send us a message
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
              Complete the form below and tell us how we can help. If your enquiry is about pricing, please use the
              custom quote form so we receive the details needed to respond properly.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-stone p-6">
              <p className="text-sm font-semibold text-charcoal">Prefer email?</p>
              <TrackedOutbound
                className="mt-2 inline-flex font-semibold text-air hover:underline"
                href={`mailto:${CONTACT_EMAIL}`}
                event="outbound_email_click"
              >
                {CONTACT_EMAIL}
              </TrackedOutbound>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_55px_rgba(17,24,39,0.08)] sm:p-8">
            <KlaviyoEmbed formId="RkPePW" className="min-h-[360px]" />
          </div>
        </div>
      </section>
    </>
  );
}
