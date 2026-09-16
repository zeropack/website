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

type ProjectCopy = Pick<
  CustomerShowcaseBrand,
  "sector" | "packagingType" | "description" | "featured"
>;

const showcaseCopy: Record<string, ProjectCopy> = {
  SIBOtest: {
    sector: "Healthcare",
    packagingType: "Custom compostable mailer",
    description:
      "Crisp white packaging, confident blue branding and clear on-pack information give this healthcare mailer a clean, reassuring presence.",
    featured: true,
  },
  "Fiona Stanley Hospital": {
    sector: "Healthcare",
    packagingType: "Custom compostable mailer",
    description:
      "Purposeful and easy to recognise, with institutional branding and service information kept clear and easy to find.",
    featured: true,
  },
  OneRoad: {
    sector: "Technology & transport",
    packagingType: "Custom compostable mailer",
    description:
      "Minimal print, generous white space and a centred mark create a sharp, modern finish that feels true to the OneRoad brand.",
    featured: true,
  },
  Primasoy: {
    sector: "Food",
    packagingType: "Custom compostable packaging",
    description:
      "Bright green and yellow artwork makes the pack instantly recognisable — and turns every handover into another brand moment.",
    featured: true,
  },
  "Second Skin": {
    sector: "Healthcare & garments",
    packagingType: "Custom compostable bag",
    description:
      "A tall custom bag with full-front artwork developed around a specialist garment application.",
  },
  "Snoweys Closet": {
    sector: "Pet retail",
    packagingType: "Custom compostable mailer",
    description:
      "A vivid pink mailer with oversized paw graphics and a playful, highly recognisable brand treatment.",
  },
  "Infectious Clothing Company": {
    sector: "Workwear",
    packagingType: "Custom compostable mailer",
    description:
      "A monochrome mailer using repeated typography to create a distinctive all-over brand pattern.",
  },
  "The Love Training Wear": {
    sector: "Activewear",
    packagingType: "Custom compostable mailer",
    description:
      "Bright colour and front-and-back messaging make the packaging work as a strong brand touchpoint.",
  },
  "THE SKIN LAB": {
    sector: "Beauty & skincare",
    packagingType: "Custom compostable mailer",
    description:
      "Full-colour artwork carries THE SKIN LAB experience right through to delivery, with a look that is bold from every angle.",
    featured: true,
  },
  "Nana Huchy": {
    sector: "Gifts & toys",
    packagingType: "Custom compostable mailer",
    description:
      "A light, understated mailer with a refined wordmark and carefully placed front-and-back details.",
  },
  "Bye Bambi": {
    sector: "Fashion",
    packagingType: "Custom compostable mailer",
    description:
      "A tonal pink mailer with repeating graphics that keeps the fashion brand visible from every angle.",
  },
  Dimple: {
    sector: "Health & personal care",
    packagingType: "Custom compostable mailer",
    description:
      "A saturated blue mailer with a simple oversized wordmark for immediate brand recognition.",
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
    description:
      "A clear, formal print treatment designed to carry an established institutional identity.",
  },
  Quayclean: {
    sector: "Facilities services",
    packagingType: "Custom compostable mailer",
    description:
      "A light neutral mailer with a crisp multicolour logo and uncluttered front-facing brand mark.",
  },
  "Escape Tabletop Games": {
    sector: "Games & entertainment",
    packagingType: "Custom compostable mailer",
    description:
      "A dark mailer with bold edge-to-edge typography that gives the pack a playful, graphic finish.",
  },
  "Dohertys Gym": {
    sector: "Fitness",
    packagingType: "Custom compostable mailer",
    description:
      "A high-contrast black and magenta mailer built around strong logo visibility.",
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
    description:
      "A branded mailer that combines the organisation's identity with clear customer-facing messaging.",
  },
  "Flipside Distribution": {
    sector: "Wholesale distribution",
    packagingType: "Custom compostable mailer",
    description:
      "A neutral custom mailer with restrained branding suited to a professional distribution application.",
  },
  "Cartridges Direct": {
    sector: "Office supplies",
    packagingType: "Custom compostable mailer",
    description:
      "A branded mailer using front-and-back print to carry both identity and customer messaging.",
  },
  Wittner: {
    sector: "Fashion footwear",
    packagingType: "Custom compostable mailer",
    description:
      "A bright green mailer with oversized white typography designed to stand out in transit and on arrival.",
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
    description:
      "A purple-toned mailer with a clean, minimal layout developed for a modern consumer brand.",
  },
  Foodland: {
    sector: "Food retail",
    packagingType: "Custom compostable carry bag",
    description:
      "Bright handled bags bring Foodland's colour and messaging into a practical retail pack designed to be seen out in the world.",
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

export const customerShowcaseBrands: CustomerShowcaseBrand[] =
  showcaseOrder.map((name) => {
    const slide = slideForName(name);
    const project = showcaseCopy[name];

    return {
      name,
      ...project,
      image: slide?.image,
      alt: `${name} ${project.packagingType.toLowerCase()} produced by Zero Pack`,
    };
  });

export const featuredShowcaseProjects = customerShowcaseBrands.filter(
  (project) => project.featured,
);
export const portfolioShowcaseProjects = customerShowcaseBrands.filter(
  (project) => !project.featured,
);

export const customerShowcaseFaqs = [
  {
    question: "Can you create packaging inspired by one of these projects?",
    answer:
      "Absolutely. Tell us which project caught your eye, what you need to package and what matters most to your brand. We will use that as a starting point and help you create packaging that feels unmistakably yours — not a copy of someone else's.",
  },
  {
    question: "How much can I customise?",
    answer:
      "Your packaging can be developed around the product, size, branding, artwork, colours, print and the way it will be used. Depending on the project, we can also work through finishes, closures and other product features with you.",
  },
  {
    question: "Do I need finished artwork before I get in touch?",
    answer:
      "No. Start with whatever you have — a logo, brand colours, an idea, a photo or a sample of your current packaging. We can help prepare the artwork for production once the packaging and print requirements are clear.",
  },
  {
    question: "Is Zero Pack's compostable packaging certified?",
    answer:
      "Yes. Zero Pack's compostable packaging is certified compostable. The exact certification depends on the product and material selected for your project. We can provide the relevant certification evidence once the packaging has been confirmed.",
  },
  {
    question: "What should I send you for a quote?",
    answer:
      "Tell us what you need to package, the approximate size and quantity, where it needs to be delivered and any branding or performance requirements you already know. If you do not have every detail yet, that is fine — start with what you have and we will help with the next step.",
  },
];
