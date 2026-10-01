import type { Metadata } from "next";
import Link from "next/link";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";
import { ToolView } from "@/components/tools/ToolTracking";

const path = "/tools/";
export async function generateMetadata(): Promise<Metadata> {
  return buildMarketPageMetadata({ market: await getRequestMarket(), title: "Packaging and Shipping Calculators", description: "Free box volume and shipping carton CBM calculators from Zero Pack. Measure rectangular volume and combined carton volume before planning your packaging project.", path });
}

const tools = [
  { title: "Box Volume Calculator", href: "/tools/box-volume-calculator/", text: "Calculate the volume of a rectangular space from its length, width and height. See cubic centimetres, litres and cubic metres." },
  { title: "Shipping Carton / CBM Calculator", href: "/tools/shipping-carton-cbm-calculator/", text: "Calculate the combined external volume of the cartons in cubic metres. Add quantities and different carton sizes." },
];
const planned = [
  { title: "Mailer Size Calculator", text: "Planned. Sizing guidance will be added after the measurement and fit rules are approved." },
  { title: "Layflat Tubing Calculator", text: "Planned. Sizing guidance will be added after the measurement and fit rules are approved." },
  { title: "Packaging Finder", text: "Planned. An assisted route to explore packaging options is being developed." },
];

export default async function Page() {
  const market = await getRequestMarket();
  const identity = { id: "tools_hub", name: "Packaging and shipping calculators", market } as const;
  return <div className="bg-white"><ToolView tool={identity} />
    <section className="bg-charcoal py-16 text-white sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6"><p className="text-sm font-bold uppercase tracking-widest text-aqua">Zero Pack tools</p><h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Packaging and shipping calculators</h1><p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">Make simple volume calculations before discussing packaging or shipping requirements. These tools calculate measurements; they do not select a packaging material or confirm a product will fit.</p></div></section>
    <section className="bg-stone py-14 sm:py-20"><div className="mx-auto max-w-6xl px-4 sm:px-6"><h2 className="font-heading text-3xl font-semibold">Available calculators</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{tools.map((item) => <Link key={item.href} href={item.href} className="group rounded-2xl border border-black/10 bg-white p-7 shadow-sm transition hover:border-compost/40"><h3 className="font-heading text-2xl font-semibold text-compost">{item.title}</h3><p className="mt-4 leading-relaxed text-charcoal/75">{item.text}</p><span className="mt-7 inline-block font-semibold text-compost group-hover:underline">Open calculator →</span></Link>)}</div></div></section>
    <section className="py-14 sm:py-20"><div className="mx-auto max-w-6xl px-4 sm:px-6"><h2 className="font-heading text-3xl font-semibold">More tools in development</h2><p className="mt-4 max-w-3xl text-charcoal/70">These tools are being planned. They do not offer sizing or product recommendations yet.</p><div className="mt-7 grid gap-5 md:grid-cols-3">{planned.map((item) => <div key={item.title} className="rounded-2xl border border-black/10 p-6"><span className="text-xs font-bold uppercase tracking-widest text-compost">Coming later</span><h3 className="mt-3 font-heading text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-charcoal/70">{item.text}</p></div>)}</div>{market === "au" && <div className="mt-8 rounded-2xl bg-mist p-6"><h3 className="font-heading text-xl font-semibold">Australian public information tool</h3><p className="mt-2 text-charcoal/75">Explore the Australian microplastics evidence summary and federal representative lookup.</p><Link href="https://www.zeropack.au/microplastics/" className="mt-4 inline-block font-semibold text-compost underline">Open the AU microplastics tool</Link></div>}</div></section>
    <section className="bg-stone py-12"><div className="mx-auto max-w-6xl px-4 sm:px-6"><h2 className="font-heading text-2xl font-semibold">Planning a custom packaging project?</h2><p className="mt-3 max-w-3xl text-charcoal/70">Dimensions are a useful starting point. Material, fit, protection and production details need to be reviewed for your product and requirements.</p><div className="mt-5 flex flex-wrap gap-5 font-semibold text-compost"><Link href="/custom-compostable-packaging/" className="underline">Explore custom packaging</Link><Link href="/packaging-guide/" className="underline">Read the packaging guide</Link><Link href="/quote/" className="underline">Request a quote</Link></div></div></section>
  </div>;
}
