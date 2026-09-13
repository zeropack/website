import type { StaticImageData } from "next/image";
import Link from "next/link";
import { SiteImage } from "@/components/SiteImage";
import { FAQSchema } from "@/components/FAQSchema";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { CustomMailerCarousel } from "@/components/CustomMailerCarousel";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketCanonical } from "@/lib/metadata";
import oneRoad from "@/content/images/custom/Zero_Pack_-_Custom_Compostable_Packaging_-_OneRoad_-_800_x_800.webp";
import primasoy from "@/content/images/custom/Zero_Pack_-_Custom_Compostable_Packaging_-_Primasoy.webp";
import secondSkin from "@/content/images/custom/Zero_Pack_-_Custom_Compostable_Packaging_-_Second_Skin_4cf140a2-e9ad-4e68-9ede-b0a815b58c8a.webp";
import siboTest from "@/content/images/custom/Zero Pack custom compostable packaging eco-friendly shipping bags and mailers Sibo Test.png";
import dimpleOrange from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_dimple_orange.webp";
import primasoyCloseupBack from "@/content/images/custom/primasoy closup back - 1024 x 1024.png";
import shoppingBags from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (15).png";
import garmentBags from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (17).png";
import protectivePackaging from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (3).png";
import tubingPackaging from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (16).png";
import rigidPackaging from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (8).png";

type PublicMarket = "global" | "au" | "uk";

type CategoryCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image?: StaticImageData;
  featured?: boolean;
};

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="8" r="5" />
      <path d="m9 13 1.5 8L12 19l1.5 2L15 13" />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M12 21V12M3 7.5 12 12m9-4.5L12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5M10 12h5M10 16h5" />
    </svg>
  );
}

const proofItems = [
  { value: "750,000+", label: "Custom bags produced", icon: PackageIcon },
  { value: "Made to order", label: "Custom formats, sizing and print", icon: CheckIcon },
  { value: "Practical custom production", label: "Quantities built around commercial projects", icon: AwardIcon },
  { value: "Specification & certification support", label: "Clear guidance for the packaging being produced", icon: DocumentIcon },
];

const categories: CategoryCard[] = [
  {
    title: "Custom compostable mailers",
    description: "Our most established ecommerce format. Custom printed and made to order for shipping and fulfilment.",
    cta: "Explore Custom Mailers",
    href: "/custom-compostable-mailers/",
    image: dimpleOrange,
    featured: true,
  },
  {
    title: "Shopping & carry bags",
    description: "Custom branded carry bags for retail, events, activations, customer orders and other branded applications.",
    cta: "Explore Shopping & Carry Bags",
    href: "/custom-compostable-packaging/",
    image: shoppingBags,
  },
  {
    title: "Garment & flexible packaging",
    description: "Custom packaging for apparel, product protection, presentation and fulfilment where flexible formats make sense.",
    cta: "Explore Garment & Flexible Packaging",
    href: "/custom-compostable-packaging/",
    image: garmentBags,
  },
  {
    title: "Food packaging",
    description: "Custom compostable packaging developed around the product, intended use and food-packaging requirements of the project.",
    cta: "Explore Food Packaging",
    href: QUOTE_FORM_HREF,
    image: primasoyCloseupBack,
  },
  {
    title: "Protective packaging",
    description: "Padded, cushioning and bubble-wrap-style compostable formats for products that need more protection than a standard flexible bag can provide.",
    cta: "Explore Protective Packaging",
    href: QUOTE_FORM_HREF,
    image: protectivePackaging,
  },
  {
    title: "Tubing & made-to-order flexible formats",
    description: "Including layflat tubing and other flexible packaging developed around the required dimensions, sealing method and application.",
    cta: "Explore Flexible Packaging",
    href: QUOTE_FORM_HREF,
    image: tubingPackaging,
  },
  {
    title: "Rigid & bespoke packaging",
    description: "For projects that need more structure, a different form factor or a packaging solution outside the standard formats shown above.",
    cta: "Discuss a Bespoke Project",
    href: QUOTE_FORM_HREF,
    image: rigidPackaging,
  },
];

const reasons = [
  {
    title: "Compostable packaging expertise",
    body: "We focus on custom compostable packaging rather than treating it as one option in a broad catalogue of conventional packaging.",
  },
  {
    title: "Made-to-order production",
    body: "Packaging is developed around your required format, dimensions, artwork, quantity and application rather than selected from generic stock.",
  },
  {
    title: "Brand & artwork support",
    body: "We help turn your brand assets into production-ready packaging and work through the details that affect the finished result.",
  },
  {
    title: "Practical specification guidance",
    body: "Material, construction, performance, quantity and application all matter. We help work through those decisions before production begins.",
  },
  {
    title: "Certification & claims guidance",
    body: "Where compostability certification applies, we can provide the relevant evidence and help keep product and customer-facing claims tied to the packaging being supplied.",
  },
  {
    title: "Experience developing custom packaging",
    body: "With more than 750,000 custom bags produced, Zero Pack brings practical production experience to both established formats and new packaging projects.",
  },
];

const processSteps = [
  {
    title: "Tell us what you need",
    body: "Share the product, existing packaging or idea you are working with, along with approximate quantities, dimensions, artwork and delivery requirements. You do not need a finished brief to start.",
  },
  {
    title: "We explore the right solution",
    body: "We work through the format, material, specification, branding and practical production requirements, then prepare the relevant quote.",
  },
  {
    title: "Approve the details",
    body: "You review the artwork and agreed production specification before manufacturing begins.",
  },
  {
    title: "We produce and deliver",
    body: "Your packaging is made to order, with production and delivery timing confirmed as part of the quote and approval process.",
  },
];

const projectImages = [
  { name: "OneRoad", image: oneRoad },
  { name: "SIBOtest", image: siboTest },
  { name: "Primasoy", image: primasoy },
  { name: "Second Skin", image: secondSkin },
];

const baseFaqs = [
  {
    question: "What types of custom compostable packaging can Zero Pack make?",
    answer:
      "Zero Pack works across a broad range of custom compostable packaging applications. These can include custom mailers, shopping and carry bags, garment packaging, food-packaging formats, protective and padded packaging, flexible packaging, layflat tubing, campaign packaging and bespoke formats developed for a particular product or application. The best starting point is usually to tell us what you need the packaging to do rather than choosing from a fixed catalogue.",
  },
  {
    question: "Can you help replace packaging we currently buy in plastic?",
    answer:
      "Absolutely. If you’re currently using conventional plastic packaging, show us what you use now or tell us what the packaging needs to do. We’ll work with you to understand the product, application and performance requirements, then explore the best compostable solution for your business. If it’s easier to talk it through, book a 30-minute packaging consultation and we can work through the opportunity together.",
    consultation: true,
  },
  {
    question: "What information do you need to get started?",
    answer:
      "You can start with as much or as little as you have. Tell us what you’re packaging, show us what you use now, send us a photo or sample, or simply share the idea you’re working on. Rough dimensions, quantities and artwork are helpful if you have them, but you don’t need a finished brief before getting in touch. Even if you only have an idea, we’re here to work through it with you and help find the right solution. Prefer to talk it through? Book a 30-minute packaging consultation.",
    consultation: true,
  },
  {
    question: "What quantities do custom packaging projects usually require?",
    answer:
      "Custom production quantities depend on the packaging format, material, dimensions, print and specification. For custom mailers, around 2,000 units is a common practical starting point. Other packaging formats can have different production requirements, which we confirm during quoting.",
  },
  {
    question: "Can you help with artwork and design?",
    answer:
      "Yes. We can help prepare or adapt artwork for production and work through print placement, sizing and other practical requirements as part of the development and approval process. You do not need finished production artwork before contacting us.",
  },
  {
    question: "Can you provide certification evidence?",
    answer:
      "Yes. Certification evidence is available on request once the relevant product and material specification are confirmed. We match certification evidence to the packaging being supplied rather than making blanket certification claims across every format.",
  },
  {
    question: "How long does custom packaging take?",
    answer:
      "Timing depends on the packaging format, specification, print requirements, production schedule, freight method and destination. We confirm the expected production and delivery timing as part of the quote rather than presenting one universal lead time.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "Zero Pack works with businesses all over the world. Freight, delivery method and timing are confirmed for each project based on the packaging specification and destination.",
  },
];

const ukDeliveryFaq = {
  question: "Do you deliver to the UK?",
  answer:
    "Yes. Zero Pack supplies custom packaging to UK customers. Freight, shipping method and expected delivery timing are confirmed during quoting based on the packaging specification and destination.",
};

export function GlobalHome({ market = "global" }: { market?: PublicMarket }) {
  const faqItems = market === "uk" ? [...baseFaqs.slice(0, -1), ukDeliveryFaq] : baseFaqs;
  const providerUrl = buildMarketCanonical(market, "/");
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom compostable packaging",
    serviceType: "Made-to-order custom compostable packaging",
    areaServed: market === "uk" ? "United Kingdom" : market === "au" ? "Australia" : "Worldwide",
    url: providerUrl,
    provider: { "@type": "Organization", name: "Zero Pack", url: providerUrl },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <FAQSchema items={faqItems.map(({ question, answer }) => ({ question, answer }))} />
      <div className="bg-white sm:-mb-6">
        <section className="relative overflow-hidden border-b border-slate-200/50 bg-[linear-gradient(135deg,#f7fbfc_0%,#ffffff_55%,#eef8f3_100%)] py-14 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,168,243,0.12),transparent_68%)]" aria-hidden />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost sm:text-sm">Custom printed · Made to order · B2B</p>
              <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.02] text-charcoal sm:text-5xl lg:text-6xl">
                Custom compostable packaging, made for your brand
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
                Zero Pack works with businesses to develop custom compostable packaging that combines brand presentation, practical performance and a credible move away from conventional plastic.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/70 sm:text-lg">
                From our established custom compostable mailers to retail bags, protective packaging, garment packaging and bespoke formats, we help turn packaging requirements into made-to-order solutions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="inline-flex items-center justify-center rounded-lg bg-air px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0096d6]" href={QUOTE_FORM_HREF}>
                  Get a Custom Quote
                </Link>
                <Link className="inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3.5 text-sm font-semibold text-compost transition hover:bg-mist" href="#packaging-options">
                  Explore Packaging Options
                </Link>
              </div>
              <p className="mt-5 text-sm text-charcoal/65">
                Still researching?{" "}
                <Link className="font-semibold text-air hover:underline" href="/packaging-guide/">
                  Read the Packaging Guide.
                </Link>
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-2xl">
              <CustomMailerCarousel slides={customMailerCarouselSlides} variant="climate" priorityFirstSlide />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800/80 bg-charcoal py-8 text-white sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {proofItems.map((item) => (
                <div key={item.value} className="zp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-air/30 hover:bg-white/10">
                  <div className="mx-auto inline-flex rounded-full bg-air/15 p-3 text-air">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 font-heading text-sm font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/75">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Reveal>
          <section id="packaging-options" className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">What can we make?</p>
              <div className="mt-3 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Custom compostable packaging for more than one kind of job</h2>
                <div className="space-y-3 text-base leading-relaxed text-charcoal/70 sm:text-lg">
                  <p>Some customers come to Zero Pack knowing exactly what they need. Others come with a product, an existing plastic pack or a packaging problem they want to solve.</p>
                  <p>Either way, we start with the application and work from there.</p>
                </div>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((item) => (
                  <article key={item.title} className={`group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${item.featured ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}>
                    {item.image ? (
                      <div className={`overflow-hidden bg-mist ${item.featured ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
                        <SiteImage src={item.image} alt={item.title} width={item.image.width} height={item.image.height} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-end bg-[linear-gradient(145deg,#eef7f2,#eaf6fb)] p-5">
                        <span className="font-heading text-5xl font-semibold text-compost/15" aria-hidden>{String(categories.indexOf(item) + 1).padStart(2, "0")}</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-semibold text-charcoal">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{item.description}</p>
                      <Link className="mt-5 inline-flex font-semibold text-air hover:underline" href={item.href}>{item.cta} →</Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="border-y border-slate-200/50 bg-[linear-gradient(135deg,#0f2d24,#153d31)] py-16 text-white sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:items-center lg:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79d6a7]">Don’t see exactly what you need?</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Bring us the packaging problem</h2>
                <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-white/75 sm:text-lg">
                  <p>If you are currently using conventional plastic packaging, developing something new or trying to improve an existing format, tell us what the packaging needs to do.</p>
                  <p>We will work with you to understand the product, application, volumes, presentation and performance requirements, then explore whether a suitable compostable solution can be developed.</p>
                  <p>You do not need to know the material, construction or finished specification before you contact us.</p>
                </div>
              </div>
              <div className="lg:text-right">
                <Link className="inline-flex items-center justify-center rounded-lg bg-air px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0096d6]" href={QUOTE_FORM_HREF}>
                  Tell Us What You Need to Package
                </Link>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="bg-slate-50/80 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost">Why Zero Pack?</p>
              <h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Specialist packaging support from idea to production</h2>
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {reasons.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <h3 className="font-heading text-lg font-semibold text-charcoal">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">How it works</p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">A clear path from requirement to production</h2>
                  <Link className="mt-6 inline-flex font-semibold text-air hover:underline" href="/how-it-works/">See How It Works →</Link>
                </div>
                <ol className="grid gap-5 sm:grid-cols-2">
                  {processSteps.map((step, index) => (
                    <li key={step.title} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-compost">{String(index + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 font-heading text-xl font-semibold text-charcoal">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{step.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="border-y border-slate-200/50 bg-charcoal py-16 text-white sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79d6a7]">Custom packaging in the real world</p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">See what other brands have created</h2>
                  <p className="mt-4 max-w-2xl text-white/70">The best way to understand custom packaging is to see it.</p>
                </div>
                <Link className="font-semibold text-[#79d6ff] hover:underline" href="/customer-showcase/">View Customer Work →</Link>
              </div>
              <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {projectImages.map((project) => (
                  <figure key={project.name} className="overflow-hidden rounded-2xl bg-white/5">
                    <SiteImage src={project.image} alt={`${project.name} custom packaging project`} width={project.image.width} height={project.image.height} className="aspect-square h-auto w-full object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                    <figcaption className="px-4 py-3 text-sm font-semibold text-white/80">{project.name}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-6 text-sm text-white/55">Real packaging. Real specifications. Different products, brands and applications.</p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="bg-[linear-gradient(135deg,#f2f8fb,#f7fbf8)] py-16 sm:py-20">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Still working out your options?</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Start with the Packaging Guide</h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-charcoal/70 sm:text-lg">If you are comparing materials, formats or suppliers, the Zero Pack Packaging Guide will help you understand the decisions that matter before production.</p>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-charcoal/70">It covers packaging formats, custom production, product fit, compostability claims, certification and the information worth preparing before you request a quote.</p>
              </div>
              <Link className="inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-6 py-3.5 text-sm font-semibold text-compost transition hover:bg-mist" href="/packaging-guide/">Read the Packaging Guide</Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-compost">FAQ</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Common questions before you start</h2>
              <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200/80 bg-white">
                {faqItems.map((item, index) => (
                  <details key={item.question} className="group px-5 sm:px-7" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-heading text-lg font-semibold text-charcoal marker:content-none">
                      {item.question}
                      <span className="text-air transition group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <div className="pb-6 pr-8 text-sm leading-relaxed text-charcoal/70 sm:text-base">
                      <p>{item.answer}</p>
                      {"consultation" in item && item.consultation ? (
                        <Link className="mt-4 inline-flex font-semibold text-air hover:underline" href="https://calendly.com/zeropackco/30min">
                          Book a Packaging Consultation →
                        </Link>
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="bg-[linear-gradient(135deg,#0e2a22,#153b30)] py-16 text-white sm:py-20">
            <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
              <h2 className="font-heading text-3xl font-semibold sm:text-4xl">What do you need to package?</h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">Whether you already know the format or simply know what the packaging needs to achieve, start there.</p>
              <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-white/75">Tell us about the product, the packaging you use now and what you would like to improve. We will work with you to explore the custom compostable packaging options and the most practical next step.</p>
              <Link className="mt-8 inline-flex items-center justify-center rounded-lg bg-air px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0096d6]" href={QUOTE_FORM_HREF}>Get a Custom Quote</Link>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
