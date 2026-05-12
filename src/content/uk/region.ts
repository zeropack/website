import type { FaqItem, RegionConfig } from "@/lib/types";

const coreFaqs: FaqItem[] = [
  {
    question: "What are custom compostable mailers?",
    answer:
      "Made-to-order mailer bags for ecommerce shipping, with custom print and sizing options. They are positioned as an alternative to conventional plastic mailers where brands want stronger presentation and a more considered materials choice.",
  },
  {
    question: "What is the minimum order quantity?",
    answer:
      "Custom production is typically practical from around 2,000 units, depending on size, print and specification. If you are below that, we can still help with guidance.",
  },
  {
    question: "Are the mailers waterproof?",
    answer:
      "We focus on mailers intended for practical ecommerce use. Waterproof performance is confirmed against your specification during quoting.",
  },
  {
    question: "Are compostable mailers strong enough for ecommerce shipping?",
    answer:
      "When specified for your product weights and fulfilment process, yes. We help you validate sizing, closure and material choices for UK shipping realities.",
  },
  {
    question: "Can we print our logo and brand colours?",
    answer:
      "Yes — custom print is central to the offer. Print complexity affects pricing and lead time, which your quote will break down clearly.",
  },
  {
    question: "Do we need artwork ready?",
    answer:
      "Not necessarily. Tell us what you have today and we will advise on artwork requirements and approval steps.",
  },
  {
    question: "How long does custom production take?",
    answer:
      "Timelines depend on quantity, print, approvals and freight. We confirm expected dates before production begins — we do not overpromise speed.",
  },
  {
    question: "What affects the price?",
    answer:
      "Size, quantity tiers (for example 2k / 5k / 10k / 25k where applicable), print style, material specification and delivery terms.",
  },
  {
    question: "What is the difference between compostable and biodegradable?",
    answer:
      "Compostable should mean something testable against standards and suitable disposal routes. Biodegradable is broader and can be ambiguous — we help brands avoid vague claims.",
  },
  {
    question: "What is the difference between home compostable and industrial compostable?",
    answer:
      "Industrial compostable packaging is intended for commercial composting. Home compostable packaging is designed for managed home composting. In the UK, access to composting routes varies, so credible guidance matters.",
  },
  {
    question: "Can you help us choose the right size?",
    answer:
      "Yes — share typical shipments and product dimensions and we will recommend practical mailer sizes.",
  },
  {
    question: "Do you ship to the UK?",
    answer:
      "Yes. UK delivery details are confirmed in your quote based on your location and order specification.",
  },
  {
    question: "Do you ship to Australia?",
    answer:
      "Yes — Zero Pack supports Australian ecommerce brands through the AU route. Ask on your quote if you need AU delivery context.",
  },
  {
    question: "Will you support US and EU orders?",
    answer:
      "US and EU routes are being prepared. Contact us with your requirement and we will confirm feasibility.",
  },
  {
    question: "Can we order samples?",
    answer:
      "Tell us your specification on the quote form and we will advise whether samples are the right next step.",
  },
  {
    question: "What happens after we submit a quote request?",
    answer:
      "We review your request, confirm missing details where needed, and aim to respond with quote guidance quickly — often within 48 hours where operationally possible.",
  },
];

export const regionConfig: RegionConfig = {
  regionName: "United Kingdom",
  countryCode: "GB",
  locale: "en-GB",
  currency: "GBP",
  defaultCTA: "Get a UK Quote",
  quoteEmail: process.env.NEXT_PUBLIC_QUOTE_EMAIL_UK ?? "quotes@zeropack.com",
  phone: process.env.NEXT_PUBLIC_PHONE_UK,
  certificationNotes: [
    "Where documented for a specification, certification and standards references can be explained in plain English — including how Australian AS5810 home compostability testing is structured as a strict standard.",
    "We explain practical disposal routes and why home compostability can matter where industrial composting access is limited — without overstating outcomes.",
  ],
  shippingNotes: [
    "UK delivery details are confirmed during quoting, including timelines based on print approvals and freight method.",
  ],
  moqNotes:
    "Practical MOQs from around 2,000 units for growing ecommerce brands — confirmed based on size and print.",
  leadTimeNotes:
    "Lead times depend on approvals, print complexity and freight. Confirmed in writing before production begins.",
  legalDisclaimer:
    "Marketing claims on packaging remain the customer’s responsibility. Zero Pack provides specification-led guidance; certification statements must match the exact material and product documentation.",
  testimonials: [
    {
      quote:
        "Placeholder — add a verified UK customer quote when available.",
      attribution: "Placeholder",
      isPlaceholder: true,
    },
  ],
  caseStudies: [
    {
      id: "uk-homewares",
      brandName: "Example UK homewares brand",
      industry: "Homewares",
      packagingType: "Custom compostable mailers",
      quantity: "10,000 units",
      designGoal: "Move off generic plastic mailers without jumping to industrial MOQs.",
      result: "Placeholder case study for layout — replace with a verified story when available.",
      isPlaceholder: true,
    },
  ],
  faqs: coreFaqs,
  seo: {
    home: {
      title: "Zero Pack UK | Custom Compostable Mailers for Ecommerce Brands",
      description:
        "Factory-direct style custom compostable mailers for UK ecommerce brands. Practical MOQs from around 2,000 units, made to order, with clear guidance on certification.",
      canonicalPath: "/uk/",
    },
    mailers: {
      title: "Custom Compostable Mailers UK | Branded Mailers | Zero Pack",
      description:
        "Custom branded compostable mailers for UK ecommerce brands. Made to order, durable, waterproof and designed to help reduce reliance on plastic packaging.",
      canonicalPath: "/uk/custom-compostable-mailers/",
    },
  },
};
