import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { getRequestMarket } from "@/lib/requestMarket";
import { MicroplasticsTools } from "./MicroplasticsTools";

const canonicalUrl = "https://www.zeropack.au/microplastics/";
const articleUrl = "https://www.zeropack.au/articles/microplastics-food-packaging-australia/";

export const metadata: Metadata = buildMetadata({
  title: "Microplastics in Australia: Evidence & Action | Zero Pack",
  description: "Read evidence on microplastics and food-contact chemical migration, open official representative lookup services and build an editable message.",
  path: "/microplastics/",
  canonicalUrl,
  locale: "en_AU",
});

const evidenceCards = [
  {
    title: "What detection can show",
    body: "Microplastics have been reported in food, drinking water, air and human samples. These findings indicate potential exposure and reported presence in human samples; detection alone does not establish a harmful dose, identify a source or prove a health effect.",
    links: [{ label: "WHO evidence review", href: "https://www.who.int/publications/i/item/9789240054608" }],
  },
  {
    title: "Food contact can involve different pathways",
    body: "Some food-contact materials can release plastic particles during use. Chemicals can also migrate from packaging into food. Particle shedding and chemical migration are different mechanisms and should not be treated as the same thing.",
    links: [
      { label: "EFSA scientific report", href: "https://efsa.onlinelibrary.wiley.com/doi/10.2903/sp.efsa.2025.EN-9733" },
      { label: "FSANZ food-packaging guidance", href: "https://www.foodstandards.gov.au/business/food-safety/food-packaging" },
    ],
  },
  {
    title: "Human-disease causation is not established",
    body: "Current evidence does not establish that everyday microplastic exposure causes a specific human disease. Human observational studies can identify associations, while animal and laboratory studies can identify possible hazards and mechanisms; neither should be presented as proof of ordinary-exposure disease causation in people.",
    links: [
      { label: "WHO evidence review", href: "https://www.who.int/publications/i/item/9789240054608" },
      { label: "Rapid systematic review", href: "https://pubmed.ncbi.nlm.nih.gov/39692326/" },
      { label: "Read the full Australian article", href: articleUrl },
    ],
  },
  {
    title: "What Australian guidance says",
    body: "As at 19 September 2026, FSANZ says the evidence on microplastics exposure and health risk is still evolving. Its current view is that plastic contamination of the food chain is unlikely to result in immediate health risks to consumers. This is not a finding of zero risk or universal safety.",
    links: [{ label: "FSANZ: Microplastics in food", href: "https://www.foodstandards.gov.au/consumer/our-safe-food-supply/microplastics" }],
  },
  {
    title: "Evidence and official guidance can change",
    body: "Measurement methods, source attribution and long-term human-health evidence still have important gaps. This resource shows its review date and links to the cited sources so readers can check the current position.",
    links: [{ label: "Read the full Australian article", href: articleUrl }],
  },
];

const sources = [
  { area: "Australian authority position", label: "Food Standards Australia New Zealand — Microplastics in food", href: "https://www.foodstandards.gov.au/consumer/our-safe-food-supply/microplastics" },
  { area: "Australian food-contact requirements", label: "Food Standards Australia New Zealand — Food packaging", href: "https://www.foodstandards.gov.au/business/food-safety/food-packaging" },
  { area: "International health evidence", label: "World Health Organization — Dietary and inhalation exposure to nano- and microplastic particles", href: "https://www.who.int/publications/i/item/9789240054608" },
  { area: "Food-contact evidence and measurement", label: "European Food Safety Authority — Literature review on micro- and nanoplastic release from food-contact materials", href: "https://efsa.onlinelibrary.wiley.com/doi/10.2903/sp.efsa.2025.EN-9733" },
  { area: "Human, animal and laboratory evidence", label: "Rapid systematic review — Microplastic exposure and digestive, reproductive and respiratory health", href: "https://pubmed.ncbi.nlm.nih.gov/39692326/" },
  { area: "Federal electorate lookup", label: "Australian Electoral Commission — Find my electorate", href: "https://www.aec.gov.au/electorate" },
  { area: "Federal representatives", label: "Parliament of Australia — Senator and member search", href: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results" },
  { area: "Detailed Australian evidence guide", label: "Zero Pack — Microplastics in Food and Packaging: What the Evidence Says in Australia", href: articleUrl },
];

export default async function Page() {
  const requestMarket = await getRequestMarket();
  const isVercelPreview = process.env.VERCEL_ENV === "preview";
  if (requestMarket !== "au" && !isVercelPreview) permanentRedirect(canonicalUrl);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Microplastics in Australia: Evidence & Action",
      description: "An Australian evidence overview, official representative lookup directory and user-controlled message builder.",
      inLanguage: "en-AU",
      dateModified: "2026-09-19",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Australia", item: "https://www.zeropack.au/" },
        { "@type": "ListItem", position: 2, name: "Microplastics", item: canonicalUrl },
      ],
    },
  ];

  return (
    <main className="bg-white">
      <JsonLd data={structuredData} />
      <div className="border-b border-slate-200 bg-white">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 py-4 text-sm text-charcoal/60 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-air">Australia</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-charcoal">Microplastics</li>
          </ol>
        </nav>
      </div>

      <section className="relative overflow-hidden bg-charcoal py-16 text-white sm:py-24">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(0,168,243,0.18),transparent_68%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua sm:text-sm">A Zero Pack + Zero Waste Co public information project</p>
          <h1 className="mt-5 max-w-5xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Microplastics are part of everyday life. Here’s what the evidence says — and how you can make your voice heard.</h1>
          <p className="mt-7 max-w-4xl text-lg leading-relaxed text-white/75 sm:text-xl">Microplastics have been reported in food, water, air and human samples. Some food-contact materials can release particles, and chemicals can migrate into food. These are different mechanisms. Research is continuing, and current evidence does not establish that everyday exposure causes a specific disease in people.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#official-services" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-air px-6 py-3 font-semibold text-white transition hover:bg-[#008fd0]">Open official lookup services</a>
            <a href={articleUrl} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Read the full evidence</a>
          </div>
          <div className="mt-9 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/65 sm:flex-row sm:gap-8">
            <p><strong className="text-white">Evidence last reviewed:</strong> 19 September 2026</p>
            <p>Evidence and official guidance can change. Check the linked sources for the current position.</p>
          </div>
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Evidence overview</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">What the current evidence can — and cannot — tell us</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {evidenceCards.map((card, index) => (
              <article key={card.title} className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-8 ${index === evidenceCards.length - 1 ? "md:col-span-2" : ""}`}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-air/10 text-sm font-bold text-air">{index + 1}</span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-charcoal">{card.title}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/70">{card.body}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-air">
                  {card.links.map((link) => <a key={link.href} href={link.href} className="hover:underline">{link.label} ↗</a>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Detailed evidence guide</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-charcoal">Read the full Australian article</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-charcoal/70">For the source-by-source discussion, limitations and practical context, read the complete evidence article. This hub keeps the overview short so you can move from evidence to official information and your own message.</p>
          </div>
          <a href={articleUrl} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-charcoal px-6 py-3 font-semibold text-white hover:bg-compost">Open the full article</a>
        </div>
      </section>

      <MicroplasticsTools />

      <section className="bg-charcoal py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua">Privacy and agency</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold">How your information is handled</h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-white/75 sm:text-lg">
              <p>Zero Pack does not receive or save the details you enter in these tools. This page does not record your location, identity, message, selections, representative or the specific official link you open.</p>
              <p>We do not use session replay or form-field capture on this page. Zero Pack does not ask for a street address. An official government finder may request one on its own website under its own privacy policy.</p>
              <p>You choose what goes into the draft, can edit every word, and decide whether and where to send it. Zero Pack does not send it on your behalf.</p>
              <Link href="/privacy/" className="inline-block font-semibold text-aqua hover:underline">Read Zero Pack’s privacy policy</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Provenance and freshness</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Sources and further reading</h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">Evidence last reviewed 19 September 2026. Official services and guidance can change; use these links to check the current source.</p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {sources.map((source, index) => (
              <li key={source.href} className="rounded-2xl border border-slate-200 bg-stone p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-air">{String(index + 1).padStart(2, "0")} · {source.area}</p>
                <a href={source.href} className="mt-2 block font-heading text-base font-semibold leading-snug text-charcoal hover:text-air">{source.label} ↗</a>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-2xl border border-slate-200 bg-[#eef7f9] p-5 text-sm leading-relaxed text-charcoal/70">
            <strong className="text-charcoal">Educational information:</strong> This resource is general information, not medical advice. Speak with an appropriately qualified health professional about individual health concerns.
          </div>
        </div>
      </section>
    </main>
  );
}
