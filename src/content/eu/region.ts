import type { FaqItem, RegionConfig } from "@/lib/types";

const coreFaqs: FaqItem[] = [
  {
    question: "What are custom compostable mailers?",
    answer:
      "They are made-to-order mailer bags designed for ecommerce shipping, with options for custom print and sizing. They are intended as an alternative to conventional plastic mailers for brands that want a more considered packaging choice.",
  },
  {
    question: "What is the minimum order quantity?",
    answer:
      "Custom production usually becomes practical from around 2,000 units, depending on size, print and specification. If you are below that range, we can still help with guidance and next steps.",
  },
  {
    question: "Are the mailers waterproof?",
    answer:
      "We specify mailers designed for practical ecommerce use. Waterproof performance depends on material and construction — we confirm details on your quote so expectations match the specification.",
  },
  {
    question: "Are compostable mailers strong enough for ecommerce shipping?",
    answer:
      "Yes, when specified correctly for your product weight, fulfilment process and delivery method. We help you choose sizing and material options aligned to how you ship.",
  },
  {
    question: "Can we print our logo and brand colours?",
    answer:
      "Custom print is a core part of the offer, from logo-only through to fuller artwork. We confirm print options and artwork requirements during quoting.",
  },
  {
    question: "Do we need artwork ready?",
    answer:
      "Not always. If you are still preparing brand assets, choose the option that matches your situation and we can advise on artwork requirements and timelines.",
  },
  {
    question: "How long does custom production take?",
    answer:
      "Production and delivery timelines depend on region, order quantity, print specification and freight method. Zero Pack confirms expected timing before production begins.",
  },
  {
    question: "What affects the price?",
    answer:
      "Typically size, quantity, print complexity, material specification and freight. Your quote summarises the drivers for your specific job.",
  },
  {
    question: "What is the difference between compostable and biodegradable?",
    answer:
      "Compostable packaging is designed to break down under defined composting conditions and is supported by standards and certification where applicable. Biodegradable is a broader term and can be misused — we help brands ask the right questions.",
  },
  {
    question: "What is the difference between home compostable and industrial compostable?",
    answer:
      "Industrial compostable products are intended for commercial composting facilities. Home compostable products are designed to break down in a managed home compost environment. Availability of composting routes varies by region, so we align guidance to your market.",
  },
  {
    question: "Can you help us choose the right size?",
    answer:
      "Yes. Share what you ship (dimensions, typical order contents, average weight) and we will recommend practical sizing options.",
  },
  {
    question: "Do you ship to Europe?",
    answer:
      "Yes. EU delivery details are confirmed during quoting based on your country and order specification.",
  },
  {
    question: "Can we order samples?",
    answer:
      "Sample options depend on specification and production setup. Tell us what you need on the quote form and we will advise the best next step.",
  },
  {
    question: "What happens after we submit a quote request?",
    answer:
      "We review your details, confirm anything missing, then provide quote guidance and recommended next steps. If you are not ready for production yet, we can still help you plan.",
  },
];

export const regionConfig: RegionConfig = {
  regionName: "European Union",
  countryCode: "EU",
  locale: "en-EU",
  currency: "EUR",
  defaultCTA: "Get a Custom Quote",
  quoteEmail: process.env.NEXT_PUBLIC_QUOTE_EMAIL_EU ?? "quotes@zeropack.com",
  certificationNotes: [
    "Certification claims are used only where supported by documentation for your chosen specification.",
    "We help teams understand compostable vs biodegradable labelling and what customers reasonably expect.",
  ],
  shippingNotes: [
    "Delivery timelines are confirmed during quoting for EU ecommerce fulfilment needs.",
  ],
  moqNotes:
    "Custom orders generally start from around 2,000 units depending on size, print and specification.",
  leadTimeNotes:
    "Lead times depend on specification, print approval and freight method — confirmed before production begins.",
  legalDisclaimer:
    "Certification, compostability routes and disposal guidance depend on local facilities and the exact product specification. Zero Pack provides commercial guidance; customers remain responsible for marketing claims on their own packaging.",
  testimonials: [],
  caseStudies: [],
  faqs: coreFaqs,
  seo: {
    home: {
      title: "Zero Pack EU | Custom Compostable Mailers for Ecommerce Brands",
      description:
        "Custom compostable packaging for ecommerce brands shipping across Europe. Quote-based, made to order, designed for brand presentation and practical shipping.",
      canonicalPath: "/eu/",
    },
    mailers: {
      title: "Custom Compostable Mailers Europe | Zero Pack",
      description:
        "Create custom branded compostable mailers for your business. Durable, waterproof, made to order and designed for ecommerce brands shipping across Europe.",
      canonicalPath: "/eu/custom-compostable-mailers/",
    },
  },
};
