import { CTAButton } from "./CTAButton";
import { QUOTE_FORM_HREF } from "@/lib/site";

export function LeadMagnetBlock({
  quoteHref = QUOTE_FORM_HREF,
  variant = "default",
}: {
  quoteHref?: string;
  variant?: "default" | "climate";
}) {
  const isClimate = variant === "climate";

  return (
    <section
      className={
        isClimate
          ? "relative overflow-hidden bg-gradient-to-br from-[#eef6f3] via-mist to-[#e8f2fc] py-14 sm:py-20"
          : "bg-mist py-14 sm:py-20"
      }
    >
      <div
        className={
          isClimate
            ? "mx-auto max-w-6xl rounded-2xl border border-slate-200/60 bg-white/95 px-6 py-10 shadow-lg shadow-slate-300/20 backdrop-blur-sm sm:px-10"
            : "mx-auto max-w-6xl rounded-2xl border border-black/5 bg-white px-6 py-10 sm:px-10"
        }
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
              Still Researching Compostable Packaging?
            </h2>
            <p className="mt-4 text-charcoal/75">
              Switching packaging is a big decision. If you are comparing plastic, recycled plastic, paper and
              compostable mailers, start with the guide. It explains what to check, which claims to question and
              how to decide whether custom compostable mailers are right for your brand.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTAButton href={quoteHref} variant="primary">
                Get a Custom Quote
              </CTAButton>
              <CTAButton href="/packaging-guide/" variant="secondary">
                Download the packaging guide
              </CTAButton>
            </div>
          </div>
          <div
            className={
              isClimate
                ? "zp-hover-lift rounded-2xl border border-slate-200/50 bg-gradient-to-br from-stone/80 to-white p-6 shadow-sm hover:shadow-md"
                : "zp-hover-lift rounded-2xl bg-stone p-6 ring-1 ring-black/5 hover:shadow-md"
            }
          >
            <p className="text-sm font-semibold text-compost">What’s inside</p>
            <p className="mt-2 font-heading text-xl font-semibold text-charcoal">
              The Brand’s Guide to Custom Compostable Packaging
            </p>
            <p className="mt-2 text-sm text-charcoal/70">
              Includes mailer-specific checklists for ecommerce brands.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
              <li>What to verify before you change materials</li>
              <li>How to avoid vague “biodegradable” messaging</li>
              <li>What to prepare before requesting a quote</li>
              <li>And much, much more</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
