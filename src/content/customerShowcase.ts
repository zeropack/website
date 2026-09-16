import type { StaticImageData } from "next/image";
import {
  CERTIFICATION_FAQ_ANSWERS,
  type CertificationFaqMarket,
} from "@/content/certificationFaqs";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";

export type CustomerShowcaseBrand = {
  name: string;
  description: string;
  image?: StaticImageData;
  alt: string;
  featured?: boolean;
};

const showcaseCopy: Record<string, string> = {
  OneRoad:
    "OneRoad is an advanced telematics solutions provider enhancing safety, compliance, and efficiency for heavy vehicles.",
  Primasoy:
    "Primasoy is a family owned company producing organic tempeh since 2005. Our tempeh is made in Melbourne and distributed throughout Australia.",
  "Second Skin":
    "Our Second Skin team consults with families, therapists and medical practitioners to prescribe, manufacture and supply custom made compression garments and dynamic splints.",
  "Snoweys Closet":
    "We believe that every pet deserves to feel comfortable, stylish, and, above all, loved.",
  "Infectious Clothing Company":
    "When you work hard to help people feel good or look good, what you wear matters.",
  "The Love Training Wear":
    "Creating a brand that supports girls of all ages and fitness levels. Our collection is all about comfort, style and quality.",
  "THE SKIN LAB":
    "Established by specialist doctors, dermatologists and pharmacists.",
  "Nana Huchy": "Purveyors of sweet memories and unconditional love.",
  "Bye Bambi":
    "We strive to become a global leader in championing freedom and fashion for the youth of tomorrow.",
  Dimple: "Affordable, high-quality daily contacts, delivered to you.",
  "Code Black Coffee": "Good coffee for everyone.",
  "Australian Parliament House":
    "Custom compostable mailers that carry your brand with authority and clarity.",
  Quayclean:
    "Since 2002, we have been committed to providing exceptional cleaning and waste management services to our clients.",
  "Escape Tabletop Games": "A challenge for all types.",
  "Dohertys Gym": "A home away from home.",
  Lahana:
    "Lahana is the synergetic force of sisters, of womanly energy cultivated into a brand that breaks hearts and turns heads. Unapologetically bold, with values that are reinforced with both word and action.",
  "Provincial Home Living":
    "At Provincial Home Living, we have crafted an inspiring collection of homewares and furniture to transform your home into an escape from the everyday hustle and bustle.",
  "St Vincent de Paul Society (WA)":
    "The Society is made up of dedicated men and women of all backgrounds and ages who have made a commitment to the mission of the Society.",
  "Flipside Distribution":
    "The company's line of business includes the wholesale distribution of women's, children's, and infants' clothing and accessories.",
  "Cartridges Direct": "100% Australian owned.",
  Wittner:
    "Established 1912. Australia's most beloved fashion footwear brand, Wittner has been creating women's shoes for over 100 years.",
  "Yakeen Safety":
    "Custom compostable mailers designed around strong, practical brand presentation.",
  "Kingfisher Mobile":
    "Custom compostable mailers created to reflect a modern, premium brand identity.",
  Foodland: "The mighty South Aussie.",
  SIBOtest:
    "SIBOtest specialises in diagnostic testing for functional digestive disorders. We are Australia's leader in SIBO breath testing.",
  "Fiona Stanley Hospital":
    "Transfusion Medicine Unit, providing critical pathology services for blood typing, pre-transfusion testing, and patient blood management.",
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

const featuredNames = new Set([
  "SIBOtest",
  "Fiona Stanley Hospital",
  "OneRoad",
  "Primasoy",
  "THE SKIN LAB",
  "Foodland",
]);

function slideForName(name: string) {
  return customMailerCarouselSlides.find((slide) => slide.heading === name);
}

export const customerShowcaseBrands: CustomerShowcaseBrand[] =
  showcaseOrder.map((name) => ({
    name,
    description: showcaseCopy[name],
    image: slideForName(name)?.image,
    alt: `${name} custom compostable packaging produced by Zero Pack`,
    featured: featuredNames.has(name),
  }));

export const featuredShowcaseProjects = customerShowcaseBrands.filter(
  (project) => project.featured,
);
export const portfolioShowcaseProjects = customerShowcaseBrands.filter(
  (project) => !project.featured,
);

export function getCustomerShowcaseFaqs(market: CertificationFaqMarket) {
  return [
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
      question: "Is all Zero Pack compostable packaging certified?",
      answer: CERTIFICATION_FAQ_ANSWERS[market],
    },
    {
      question: "What should I send you for a quote?",
      answer:
        "Tell us what you need to package, the approximate size and quantity, where it needs to be delivered and any branding or performance requirements you already know. If you do not have every detail yet, that is fine — start with what you have and we will help with the next step.",
    },
  ];
}
