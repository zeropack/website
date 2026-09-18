import type { Article } from "../types";

export const whatMoqMeansInCustomPackaging: Article = {
  slug: "what-moq-means-in-custom-packaging",
  title: "MOQ in Custom Packaging: Meaning and Order Planning",
  category: "Custom packaging & design",
  description: "What minimum order quantity means in custom packaging, why it varies, and how to plan a practical first order without relying on unsupported price or timing assumptions.",
  publishedAt: "2026-01-14",
  dateModified: "2026-09-18",
  market: "GLOBAL",
  jurisdiction: ["Global"],
  topics: ["minimum order quantity", "custom packaging", "packaging procurement"],
  primaryKeyword: "MOQ in custom packaging",
  secondaryKeywords: ["what does MOQ mean in packaging", "minimum order quantity", "custom mailer MOQ"],
  relatedSlugs: ["how-custom-compostable-mailers-work", "custom-compostable-mailers-guide", "what-to-ask-before-ordering-custom-packaging"],
  pillarPath: "/packaging-guide/",
  isSpokeGuide: true,
  answerBox: "MOQ means minimum order quantity: the smallest quantity available for a particular custom production specification. It is not one universal number. Size, material, print, construction and manufacturing requirements can all affect the final MOQ.",
  keyTakeaways: [
    "MOQ is attached to a specification, not to custom packaging as a whole.",
    "Zero Pack custom compostable mailers are available from 2,000 units; final MOQ depends on size, print, material and specification.",
    "Plan quantity by realistic usage, storage, cash flow and specification-change risk.",
    "Confirm whether the MOQ applies per size, design, colour or production variant.",
    "Compare complete delivered scope rather than an isolated unit price.",
  ],
  cta: { title: "Checking whether a custom run fits your volume?", text: "Share the proposed size, print, material, quantity and delivery requirements so the applicable MOQ can be confirmed for the real specification.", links: [
    { label: "Explore custom mailers", href: "/custom-compostable-mailers/", variant: "primary" },
    { label: "Download the Packaging Guide", href: "/packaging-guide/download/", variant: "secondary" },
    { label: "Request a quote", href: "/custom-compostable-mailers/#quoteform", variant: "ghost" },
  ] },
  sections: [
    { id: "definition", heading: "What does MOQ mean in custom packaging?", paragraphs: [
      "MOQ stands for minimum order quantity. It is the smallest production quantity offered for a defined custom specification.",
      "Custom packaging requires production setup and coordination that do not apply in the same way to finished stock packaging. The viable quantity can change with dimensions, construction, material, print coverage, number of designs and the manufacturing route.",
      "Treat any starting quantity as an initial guide until the supplier confirms the final specification and quote.",
    ] },
    { id: "variables", heading: "What can change the final MOQ?", table: { headers: ["Variable", "Question to ask", "Planning effect"], rows: [
      ["Size", "Does MOQ apply separately to each mailer size?", "Multiple sizes may create separate quantities."],
      ["Print", "Does colour count, coverage or design variation affect the run?", "Artwork choices can change production setup."],
      ["Material", "Which exact material and certification are quoted?", "Availability and manufacturing route may differ."],
      ["Construction", "Is the closure single or double adhesive?", "Returns features must be included in the specification."],
      ["Variants", "Can sizes or designs be combined in one run?", "Do not assume quantities can be pooled."],
      ["Delivery", "Is the order shipped together or under an agreed plan?", "Delivery scope affects storage and total cost planning."],
    ] } },
    { id: "zero-pack", heading: "What is Zero Pack's starting MOQ for custom compostable mailers?", paragraphs: [
      "Zero Pack's custom compostable mailers are available from 2,000 units*. Final MOQ depends on size, print, material and specification.",
      "The qualification matters: a quantity discussed for one mailer should not be assumed to apply to a different size, artwork, material or construction. Obtain the final quantity in the written quote.",
    ] },
    { id: "quantity-planning", heading: "How should a business choose an order quantity?", paragraphs: [
      "The lowest available quantity is not automatically the right order. Compare the available quantity tiers with realistic packaging usage, available storage, working capital and the likelihood that the product range or artwork will change.",
      "Forecast by packaging size rather than total orders. A business may dispatch enough orders overall while using one proposed mailer size too slowly for a practical custom run.",
    ], bullets: [
      "Use recent order data and count how many shipments would use each size.",
      "Allow for seasonal variation without treating an exceptional month as the baseline.",
      "Check available clean, suitable storage and stock-rotation guidance.",
      "Keep reorder and delivery timing as quoted variables rather than fixed assumptions.",
      "Avoid ordering against growth that is not supported by a documented operating forecast.",
    ] },
    { id: "comparison", heading: "How should MOQ quotes be compared?", paragraphs: [
      "Compare quotes only after aligning size, material, certification, construction, print, quantity, quality checks, freight scope, delivery destination and taxes or duties where relevant. A lower unit price may cover a different product or exclude material parts of the delivered requirement.",
      "Ask what happens if the final specification changes, how long the quote is valid and which assumptions remain subject to confirmation. Use the [buyer checklist](/articles/what-to-ask-before-ordering-custom-packaging/) before approving a custom order.",
    ] },
    { id: "below-moq", heading: "What if the required quantity is below MOQ?", paragraphs: [
      "If the custom run would create impractical stock, use an interim format that suits current volume and revisit the project when the forecast supports it. Do not make a certification or performance claim for interim packaging unless evidence covers that exact item.",
      "An early enquiry can still clarify the likely specification, starting quantity and preparation work. It should not be treated as a promise that a below-MOQ run is available.",
    ] },
    { id: "sources", heading: "Sources and further reading", paragraphs: [
      "[Australian Competition and Consumer Commission — Environmental and sustainability claims](https://www.accc.gov.au/business/advertising-and-promotions/environmental-and-sustainability-claims)",
      "[UK Competition and Markets Authority — Green Claims Code](https://greenclaims.campaign.gov.uk/)",
      "[Australasian Bioplastics Association — Certification](https://bioplastics.org.au/certification/)",
    ] },
  ],
  faqs: [
    { question: "What does MOQ stand for?", answer: "MOQ stands for minimum order quantity: the smallest quantity offered for a defined production specification." },
    { question: "Is MOQ the same for every custom mailer?", answer: "No. Final MOQ can depend on size, print, material, construction and other specification details." },
    { question: "What is Zero Pack's custom compostable mailer MOQ?", answer: "Custom compostable mailers are available from 2,000 units. Final MOQ depends on size, print, material and specification." },
    { question: "Does MOQ apply per size?", answer: "It may. Confirm whether each size, design, colour or material variant has its own MOQ and whether any quantities can be combined." },
    { question: "Should we order more than the MOQ for a lower unit price?", answer: "Only when the complete quote, realistic usage, storage, cash flow and specification-change risk support the larger run. A lower unit price does not by itself make excess stock a good decision." },
  ],
};
