import type { StaticImageData } from "next/image";
import bagGrey from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_grey.webp";
import bagYellow from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_skin_labs_yellow.webp";
import bagBlue from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_parliament_house_blue.webp";
import bagGreen from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_wittner_kelly_green_cc102790-2774-48b3-a1e8-40604f85c3c2.webp";
import bagOrange from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_dimple_orange.webp";
import bagRed from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_provincial_red.webp";
import bagInfectious from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_infectious_grey.webp";
import bagQuayclean from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_quayclean_light_grey.webp";
import bagCodeBlack from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_code_black_pink_780x200_d0776423-3c5c-4f18-86f3-0672d3b08b8e.webp";
import bagEscape from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_escape_rooms_yellow_450x200_2105477f-3a8c-4bc1-a875-56301fbc82be.webp";
import bagLove from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_the_love_green_600x300_c5e26d41-eae8-4c2b-9044-9a1eb2c432e7.webp";
import bagNana from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_nana_huchy_grey.webp";
import bagSnowys from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_snowys_grey_-_Copy.webp";
import bagSecondSkin from "@/content/images/custom/Zero_Pack_-_Custom_Compostable_Packaging_-_Second_Skin_4cf140a2-e9ad-4e68-9ede-b0a815b58c8a.webp";
import bagLahana from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_lahana_pale_blue_20cd995e-2861-4d4d-a2e8-fe431b710abc.webp";
import bagVinnies from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_vinnies_lime_efa69a99-61aa-4654-9bad-61365a0827bf.webp";
import bagPrimasoy from "@/content/images/custom/Zero_Pack_-_Custom_Compostable_Packaging_-_Primasoy.webp";
import bagByeBambi from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_bye_bambi_green_243d3ed5-c9ac-46fa-930a-1071462982c8.webp";
import bagDohertys from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_dohertys_magenta_550x200_0680d46e-df85-4eee-912b-14df8671c4b8.webp";
import bagOneRoad from "@/content/images/custom/Zero_Pack_-_Custom_Compostable_Packaging_-_OneRoad_-_800_x_800.webp";
import bagCartridges from "@/content/images/custom/Zero_Pack_custom_compostable_packaging_eco-friendly_shipping_bags_and_mailers_cartridges_direct_grey.webp";
import bagYakeen from "@/content/images/custom/Zero Pack custom compostable packaging eco-friendly shipping bags and mailers yakeen safety brown.webp";
import bagKingfisher from "@/content/images/custom/Zero Pack custom compostable packaging eco-friendly shipping bags and mailers kingfisher purple.png";
import bagFoodland from "@/content/images/custom/Zero Pack - Custom Compostable Packaging - Foodland-800x800.png";
import bagSiboTest from "@/content/images/custom/Zero Pack custom compostable packaging eco-friendly shipping bags and mailers Sibo Test.png";
import bagTransfusionMedicine from "@/content/images/custom/Zero Pack custom compostable packaging eco-friendly shipping bags and mailers Transfusion Medicine.png";

export type CustomMailerCarouselSlide = {
  image: StaticImageData;
  heading: string;
  subheading: string;
  alt: string;
};

export const customMailerCarouselSlides: CustomMailerCarouselSlide[] = [
  {
    image: bagOneRoad,
    heading: "OneRoad",
    subheading:
      "Advanced telematics solutions to enhance safety, compliance, and efficiency for heavy vehicles.",
    alt: "OneRoad custom compostable mailer",
  },
  {
    image: bagPrimasoy,
    heading: "Primasoy",
    subheading: "Family-owned company producing organic tempeh in Melbourne since 2005.",
    alt: "Primasoy custom compostable mailer",
  },
  {
    image: bagSecondSkin,
    heading: "Second Skin",
    subheading:
      "Custom made compression garments and dynamic splints prescribed with therapists and medical practitioners.",
    alt: "Second Skin custom compostable mailer",
  },
  {
    image: bagSnowys,
    heading: "Snoweys Closet",
    subheading: "Every pet deserves to feel comfortable, stylish, and loved.",
    alt: "Snoweys Closet custom compostable mailer",
  },
  {
    image: bagInfectious,
    heading: "Infectious Clothing Company",
    subheading: "When you work hard to help people feel good or look good, what you wear matters.",
    alt: "Infectious Clothing Company custom compostable mailer",
  },
  {
    image: bagLove,
    heading: "The Love Training Wear",
    subheading: "Comfort, style and quality for girls of all ages and fitness levels.",
    alt: "The Love Training Wear custom compostable mailer",
  },
  {
    image: bagBlue,
    heading: "Australian Parliament House",
    subheading: "Custom compostable mailers that carry your brand with authority and clarity.",
    alt: "Australian Parliament House custom compostable mailer",
  },
  {
    image: bagYellow,
    heading: "THE SKIN LAB",
    subheading: "Established by specialist doctors, dermatologists and pharmacists.",
    alt: "THE SKIN LAB custom compostable mailer",
  },
  {
    image: bagNana,
    heading: "Nana Huchy",
    subheading: "Purveyors of sweet memories and unconditional love.",
    alt: "Nana Huchy custom compostable mailer",
  },
  {
    image: bagByeBambi,
    heading: "Bye Bambi",
    subheading: "Fashion-forward brand championing freedom and style for the youth of tomorrow.",
    alt: "Bye Bambi custom compostable mailer",
  },
  {
    image: bagGreen,
    heading: "Wittner",
    subheading:
      "Established 1912. Australia's most beloved fashion footwear brand, creating women's shoes for over 100 years.",
    alt: "Wittner custom compostable mailer",
  },
  {
    image: bagOrange,
    heading: "Dimple",
    subheading: "Affordable, high-quality daily contacts, delivered to you.",
    alt: "Dimple custom compostable mailer",
  },
  {
    image: bagCodeBlack,
    heading: "Code Black Coffee",
    subheading: "Good coffee for everyone.",
    alt: "Code Black Coffee custom compostable mailer",
  },
  {
    image: bagQuayclean,
    heading: "Quayclean",
    subheading: "Exceptional cleaning and waste management services since 2002.",
    alt: "Quayclean custom compostable mailer",
  },
  {
    image: bagEscape,
    heading: "Escape Tabletop Games",
    subheading: "A challenge for all types.",
    alt: "Escape Tabletop Games custom compostable mailer",
  },
  {
    image: bagDohertys,
    heading: "Dohertys Gym",
    subheading: "A home away from home.",
    alt: "Dohertys Gym custom compostable mailer",
  },
  {
    image: bagLahana,
    heading: "Lahana",
    subheading: "Unapologetically bold swimwear with values reinforced in both word and action.",
    alt: "Lahana custom compostable mailer",
  },
  {
    image: bagRed,
    heading: "Provincial Home Living",
    subheading:
      "An inspiring collection of homewares and furniture designed to transform your home into an escape.",
    alt: "Provincial Home Living custom compostable mailer",
  },
  {
    image: bagVinnies,
    heading: "St Vincent de Paul Society (WA)",
    subheading: "Dedicated people of all backgrounds committed to the Society's mission.",
    alt: "St Vincent de Paul Society custom compostable mailer",
  },
  {
    image: bagGrey,
    heading: "Flipside Distribution",
    subheading: "Wholesale distribution with packaging that reflects a professional brand standard.",
    alt: "Flipside Distribution custom compostable mailer",
  },
  {
    image: bagCartridges,
    heading: "Cartridges Direct",
    subheading: "100% Australian owned.",
    alt: "Cartridges Direct custom compostable mailer",
  },
  {
    image: bagYakeen,
    heading: "Yakeen Safety",
    subheading: "Custom compostable mailers designed around strong, practical brand presentation.",
    alt: "Yakeen Safety custom compostable mailer",
  },
  {
    image: bagKingfisher,
    heading: "Kingfisher Mobile",
    subheading: "Custom compostable mailers created to reflect a modern, premium brand identity.",
    alt: "Kingfisher Mobile custom compostable mailer",
  },
  {
    image: bagFoodland,
    heading: "Foodland",
    subheading: "The mighty South Aussie.",
    alt: "Foodland custom compostable mailer",
  },
  {
    image: bagSiboTest,
    heading: "SIBOtest",
    subheading:
      "SIBOtest specialises in diagnostic testing for functional digestive disorders. We are Australia's leader in SIBO breath testing.",
    alt: "SIBOtest custom compostable mailer",
  },
  {
    image: bagTransfusionMedicine,
    heading: "Fiona Stanley Hospital",
    subheading:
      "Transfusion Medicine Unit, providing critical pathology services for blood typing, pre-transfusion testing, and patient blood management.",
    alt: "Fiona Stanley Hospital Transfusion Medicine Unit custom compostable mailer",
  },
];
