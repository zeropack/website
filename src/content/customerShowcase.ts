import type { StaticImageData } from "next/image";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";

export type CustomerShowcaseBrand = {
  name: string;
  sector: string;
  packagingType: string;
  description: string;
  image?: StaticImageData;
  alt: string;
  featured?: boolean;
};

type ProjectCopy = Pick<CustomerShowcaseBrand, "sector" | "packagingType" | "description" | "featured">;

const showcaseCopy: Record<string, ProjectCopy> = {
  SIBOtest: {
    sector: "Healthcare",
    packagingType: "Custom compostable mailer",
    description: "A clean white mailer with high-contrast blue branding and customer-facing packaging information.",
    featured: true,
  },
  "Fiona Stanley Hospital": {
    sector: "Healthcare",
    packagingType: "Custom compostable mailer",
    description: "A functional mailer design combining institutional branding with clear service information.",
    featured: true,
  },
  OneRoad: {
    sector: "Technology & transport",
    packagingType: "Custom compostable mailer",
    description:
      "A restrained white mailer that uses a centred logo and minimal print treatment for a precise, professional finish.",
    featured: true,
  },
  Primasoy: {
    sector: "Food",
    packagingType: "Custom compostable packaging",
    description: "Bold green and yellow artwork turns the packaging into an unmistakable extension of the Primasoy brand.",
    featured: true,
  },
  "Second Skin": {
    sector: "Healthcare & garments",
    packagingType: "Custom compostable bag",
    description: "A tall custom bag with full-front artwork developed around a specialist garment application.",
  },
  "Snoweys Closet": {
    sector: "Pet retail",
    packagingType: "Custom compostable mailer",
    description: "A vivid pink mailer with oversized paw graphics and a playful, highly recognisable brand treatment.",
  },
  "Infectious Clothing Company": {
    sector: "Workwear",
    packagingType: "Custom compostable mailer",
    description: "A monochrome mailer using repeated typography to create a distinctive all-over brand pattern.",
  },
  "The Love Training Wear": {
    sector: "Activewear",
    packagingType: "Custom compostable mailer",
    description: "Bright colour and front-and-back messaging make the packaging work as a strong brand touchpoint.",
  },
  "THE SKIN LAB": {
    sector: "Beauty & skincare",
    packagingType: "Custom compostable mailer",
    description: "A bold, full-colour mailer that carries the brand's graphic identity across the whole pack.",
    featured: true,
  },
  "Nana Huchy": {
    sector: "Gifts & toys",
    packagingType: "Custom compostable mailer",
    description: "A light, understated mailer with a refined wordmark and carefully placed front-and-back details.",
  },
  "Bye Bambi": {
    sector: "Fashion",
    packagingType: "Custom compostable mailer",
    description: "A tonal pink mailer with repeating graphics that keeps the fashion brand visible from every angle.",
  },
  Dimple: {
    sector: "Health & personal care",
    packagingType: "Custom compostable mailer",
    description: "A saturated blue mailer with a simple oversized wordmark for immediate brand recognition.",
  },
  "Code Black Coffee": {
    sector: "Coffee",
    packagingType: "Custom compostable mailer",
    description:
      "A black mailer with bold white typography that translates the brand's visual language into delivery packaging.",
  },
  "Australian Parliament House": {
    sector: "Government",
    packagingType: "Custom compostable mailer",
    description: "A clear, formal print treatment designed to carry an established institutional identity.",
  },
  Quayclean: {
    sector: "Facilities services",
    packagingType: "Custom compostable mailer",
    description: "A light neutral mailer with a crisp multicolour logo and uncluttered front-facing brand mark.",
  },
  "Escape Tabletop Games": {
    sector: "Games & entertainment",
    packagingType: "Custom compostable mailer",
    description: "A dark mailer with bold edge-to-edge typography that gives the pack a playful, graphic finish.",
  },
  "Dohertys Gym": {
    sector: "Fitness",
    packagingType: "Custom compostable mailer",
    description: "A high-contrast black and magenta mailer built around strong logo visibility.",
  },
  Lahana: {
    sector: "Swimwear",
    packagingType: "Custom compostable mailer",
    description:
      "A warm neutral mailer with an all-over wordmark pattern that complements the brand's fashion positioning.",
  },
  "Provincial Home Living": {
    sector: "Homewares",
    packagingType: "Custom compostable mailer",
    description:
      "A black mailer with a large white wordmark for a premium, immediately recognisable delivery presentation.",
  },
  "St Vincent de Paul Society (WA)": {
    sector: "Charity",
    packagingType: "Custom compostable mailer",
    description: "A branded mailer that combines the organisation's identity with clear customer-facing messaging.",
  },
  "Flipside Distribution": {
    sector: "Wholesale distribution",
    packagingType: "Custom compostable mailer",
    description: "A neutral custom mailer with restrained branding suited to a professional distribution application.",
  },
  "Cartridges Direct": {
    sector: "Office supplies",
    packagingType: "Custom compostable mailer",
    description: "A branded mailer using front-and-back print to carry both identity and customer messaging.",
  },
  Wittner: {
    sector: "Fashion footwear",
    packagingType: "Custom compostable mailer",
    description: "A bright green mailer with oversized white typography designed to stand out in transit and on arrival.",
  },
  "Yakeen Safety": {
    sector: "Workplace safety",
    packagingType: "Custom compostable mailer",
    description:
      "A warm brown mailer with a repeated wordmark that gives practical shipping packaging a distinctive brand finish.",
  },
  "Kingfisher Mobile": {
    sector: "Technology",
    packagingType: "Custom compostable mailer",
    description: "A purple-toned mailer with a clean, minimal layout developed for a modern consumer brand.",
  },
  Foodland: {
    sector: "Food retail",
    packagingType: "Custom compostable carry bag",
    description: "High-visibility handled bags use bold colour, branding and on-pack messaging for a retail application.",
    featured: true,
  },
};

const showcaseOrder = [
  "SIBOtest",
  "Fiona Stanley Hospital",
  "OneRoad",
  "Primasoy",
  "Second Skin",
  "Snoweys Closet",
  "Infectious Clothing Company",
  "The Love Training Wear",
  "THE SKIN LAB",
  "Nana Huchy",
  "Bye Bambi",
  "Dimple",
  "Code Black Coffee",
  "Australian Parliament House",
  "Quayclean",
  "Escape Tabletop Games",
  "Dohertys Gym",
  "Lahana",
  "Provincial Home Living",
  "St Vincent de Paul Society (WA)",
  "Flipside Distribution",
  "Cartridges Direct",
  "Wittner",
  "Yakeen Safety",
  "Kingfisher Mobile",
  "Foodland",
] as const;

function slideForName(name: string) {
  return customMailerCarouselSlides.find((slide) => slide.heading === name);
}

export const customerShowcaseBrands: CustomerShowcaseBrand[] = showcaseOrder.map((name) => {
  const slide = slideForName(name);
  const project = showcaseCopy[name];

  return {
    name,
    ...project,
    image: slide?.image,
    alt: `${name} ${project.packagingType.toLowerCase()} produced by Zero Pack`,
  };
});

export const featuredShowcaseProjects = customerShowcaseBrands.filter((project) => project.featured);
export const portfolioShowcaseProjects = customerShowcaseBrands.filter((project) => !project.featured);

export const customerShowcaseProof = [
  {
    title: "Packaging that looks like your brand",
    body: "Use colour, typography, artwork and on-pack messaging to turn delivery or retail packaging into a recognisable brand touchpoint.",
  },
  {
    title: "Made around the application",
    body: "The right packaging depends on what it needs to hold, how it will be used and the experience you want to create.",
  },
  {
    title: "A specification you can stand behind",
    body: "We help work through size, print, material and certification so the finished packaging fits the project and its claims.",
  },
];

export const customerShowcaseFaqs = [
  {
    question: "Are these real Zero Pack customer projects?",
    answer:
      "Yes. Every image in this showcase is packaging produced by Zero Pack for the organisation named with it. We describe the visible project and do not add customer results or testimonials unless they have been approved and supported.",
  },
  {
    question: "What types of custom compostable packaging are shown?",
    answer:
      "The current portfolio includes custom compostable mailers, flexible bags and handled carry bags across ecommerce, retail, healthcare, food, fashion, government and other applications.",
  },
  {
    question: "Can Zero Pack create packaging similar to an example here?",
    answer:
      "Yes. Use the examples as inspiration, then share your product, required size, expected quantity, artwork and intended use. We will help explore the right packaging and confirm what is practical for your project.",
  },
  {
    question: "Is the compostable packaging shown certified?",
    answer:
      "Zero Pack's compostable packaging is certified compostable. The exact certification depends on the product, material and specification. Certification evidence is available on request after the relevant packaging has been confirmed.",
  },
  {
    question: "Do I need a finished packaging brief before I enquire?",
    answer:
      "No. You can start with an idea, a photo, a sample of your current packaging or the product you need to pack. We can help you work through the packaging type, size, print and next step.",
  },
];
