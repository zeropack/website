import type { StaticImageData } from "next/image";
import { customMailerCarouselSlides } from "@/content/customMailerCarouselSlides";

export type CustomerShowcaseBrand = {
  name: string;
  description: string;
  image?: StaticImageData;
  alt: string;
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

function slideForName(name: string) {
  return customMailerCarouselSlides.find((slide) => slide.heading === name);
}

export const customerShowcaseBrands: CustomerShowcaseBrand[] = showcaseOrder.map((name) => {
  const slide = slideForName(name);
  return {
    name,
    description: showcaseCopy[name] ?? slide?.subheading ?? "",
    image: slide?.image,
    alt: slide?.alt ?? `${name} custom compostable packaging`,
  };
});

export const customerShowcaseWhy = {
  heading: "Why custom compostable packaging?",
  intro:
    "Did you know that 83% of consumers have considered sustainability when making a purchase? As a business owner, it is essential to recognise this trend and adapt accordingly.",
  benefits: [
    {
      title: "Environmental responsibility",
      body: "By using compostable materials, businesses demonstrate their commitment to sustainability and environmental stewardship.",
    },
    {
      title: "Consumer appeal",
      body: "Compostable packaging can appeal to environmentally conscious consumers, potentially increasing brand loyalty and sales.",
    },
    {
      title: "Innovative marketing opportunity",
      body: "Utilising compostable packaging and mailers provides a unique marketing angle that can set a business apart in a crowded marketplace.",
    },
  ],
};
