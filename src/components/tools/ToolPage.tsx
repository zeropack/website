import Link from "next/link";
import type { ReactNode } from "react";
import { FAQAccordion } from "@/components/FAQAccordion";
import type { FaqItem } from "@/lib/types";
import { ToolCta, ToolView, type ToolIdentity } from "./ToolTracking";

const button = "inline-flex min-h-12 items-center justify-center rounded-xl bg-compost px-6 py-3 font-semibold text-white transition hover:bg-forest";
const outline = "inline-flex min-h-12 items-center justify-center rounded-xl border border-compost/30 px-6 py-3 font-semibold text-compost transition hover:bg-mist";

export function ToolPage({ title, intro, tool, children, explanation, limitations, faqs, related }: {
  title: string; intro: string; tool: ToolIdentity; children: ReactNode; explanation: ReactNode;
  limitations: ReactNode; faqs: FaqItem[]; related: { href: string; title: string; description: string }[];
}) {
  return <div className="bg-white">
    <ToolView tool={tool} />
    <section className="bg-charcoal py-14 text-white sm:py-20"><div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Link href="/tools/" className="text-sm font-semibold text-aqua hover:underline">← All tools</Link>
      <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/75">{intro}</p>
    </div></section>
    <section className="bg-stone py-12 sm:py-16"><div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div></section>
    <section className="py-12 sm:py-16"><div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
      <div><h2 className="font-heading text-2xl font-semibold">How the calculation works</h2><div className="mt-4 space-y-4 leading-relaxed text-charcoal/75">{explanation}</div></div>
      <div className="rounded-2xl bg-mist p-6"><h2 className="font-heading text-2xl font-semibold">What the result does not tell you</h2><div className="mt-4 space-y-4 leading-relaxed text-charcoal/75">{limitations}</div></div>
    </div></section>
    <section className="bg-stone py-12 sm:py-16"><div className="mx-auto max-w-4xl px-4 sm:px-6"><h2 className="font-heading text-3xl font-semibold">Frequently asked questions</h2><div className="mt-6"><FAQAccordion items={faqs} /></div></div></section>
    <section className="py-12 sm:py-16"><div className="mx-auto max-w-6xl px-4 sm:px-6"><h2 className="font-heading text-3xl font-semibold">Explore next steps</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{related.map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-black/10 p-6 transition hover:border-compost/50"><h3 className="font-heading text-xl font-semibold text-compost">{item.title} →</h3><p className="mt-2 text-charcoal/70">{item.description}</p></Link>)}</div>
      <div className="mt-8 flex flex-wrap gap-3"><ToolCta href="/quote/" kind="quote" tool={tool} className={button}>Ask for a custom quote</ToolCta><ToolCta href="/packaging-guide/" kind="guide" tool={tool} className={outline}>Explore the packaging guide</ToolCta></div>
    </div></section>
  </div>;
}
