import Link from "next/link";
import type { Metadata } from "next";
import { LegalMarketNotice } from "@/components/LegalMarketNotice";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return {
    ...buildMarketPageMetadata({
      market,
      title: "Legal & Commercial Terms | Zero Pack",
      description: "Zero Pack website, sales, shipping, refund and privacy policies.",
      path: "/terms/",
    }),
    robots: { index: false, follow: true },
  };
}

const policies = [
  {
    href: "/terms-of-sale/",
    title: "Terms & Conditions of Sale",
    description: "General commercial terms for Zero Pack quotations and custom packaging orders, including artwork approval, manufacturing tolerances, custom production and order-specific terms.",
  },
  {
    href: "/shipping/",
    title: "Shipping Policy",
    description: "How freight estimates, final shipping charges, duties, delivery access and shipment issues are handled alongside the specific quotation.",
  },
  {
    href: "/refunds/",
    title: "Refund & Returns Policy",
    description: "How custom-made products, cancellations, manufacturing issues, shortages and genuine defects are handled.",
  },
  {
    href: "/terms-of-use/",
    title: "Website Terms of Use",
    description: "Terms governing use of the Zero Pack website, its information, tools, content and third-party services.",
  },
  {
    href: "/privacy/",
    title: "Privacy Policy",
    description: "How Zero Pack collects, uses, stores and protects personal information across its websites and services.",
  },
];

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-compost">Legal &amp; commercial</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Zero Pack terms and policies</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/75">These policies explain how the website is used and the general terms that support Zero Pack quotations, custom packaging orders, shipping and issue resolution.</p>
          <p className="mt-3 text-charcoal/70">For a specific order, the accepted quotation, order confirmation and approved specification take precedence where they contain a more specific written term.</p>
        </div>

        <LegalMarketNotice path="/terms/" noun="terms and policies" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {policies.map((policy) => (
            <Link key={policy.href} href={policy.href} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-charcoal">{policy.title}</h2>
              <p className="mt-3 text-sm leading-6 text-charcoal/70">{policy.description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-sky-700">Read policy →</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-charcoal/70">
          <p><strong className="text-charcoal">Order hierarchy:</strong> accepted quotation / order confirmation → approved specification → Terms &amp; Conditions of Sale → Shipping and Refund &amp; Returns policies → general website information.</p>
        </div>
      </div>
    </section>
  );
}
