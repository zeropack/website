import type { StaticImageData } from "next/image";

import packaging0_zero_pack_custom_compostable_packaging_10 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (10).png";
import packaging1_zero_pack_custom_compostable_packaging_11 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (11).png";
import packaging2_zero_pack_custom_compostable_packaging_12 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (12).png";
import packaging3_zero_pack_custom_compostable_packaging_13 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (13).png";
import packaging4_zero_pack_custom_compostable_packaging_14 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (14).png";
import packaging5_zero_pack_custom_compostable_packaging_15 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (15).png";
import packaging6_zero_pack_custom_compostable_packaging_16 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (16).png";
import packaging7_zero_pack_custom_compostable_packaging_17 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (17).png";
import packaging8_zero_pack_custom_compostable_packaging_2 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (2).png";
import packaging9_zero_pack_custom_compostable_packaging_3 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (3).png";
import packaging10_zero_pack_custom_compostable_packaging_4 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (4).png";
import packaging11_zero_pack_custom_compostable_packaging_5 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (5).png";
import packaging12_zero_pack_custom_compostable_packaging_6 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (6).png";
import packaging13_zero_pack_custom_compostable_packaging_7 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (7).png";
import packaging14_zero_pack_custom_compostable_packaging_8 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (8).png";
import packaging15_zero_pack_custom_compostable_packaging_9 from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging (9).png";
import packaging16_zero_pack_custom_compostable_packaging from "@/content/images/custom/packaging/zero_pack_custom_compostable_packaging.png";

export type PackagingCarouselSlide = {
  image: StaticImageData;
  /** Edit this subtitle — shown permanently on the carousel overlay. */
  subtitle: string;
  alt: string;
};

export const packagingCarouselSlides: PackagingCarouselSlide[] = [
  {
    image: packaging0_zero_pack_custom_compostable_packaging_10,
    subtitle: "Shopping Bags",
    alt: "Custom compostable packaging example 10",
  },
  {
    image: packaging1_zero_pack_custom_compostable_packaging_11,
    subtitle: "Shopping Bags",
    alt: "Custom compostable packaging example 11",
  },
  {
    image: packaging2_zero_pack_custom_compostable_packaging_12,
    subtitle: "Stand up Pouches",
    alt: "Custom compostable packaging example 12",
  },
  {
    image: packaging3_zero_pack_custom_compostable_packaging_13,
    subtitle: "Grocery Bags",
    alt: "Custom compostable packaging example 13",
  },
  {
    image: packaging4_zero_pack_custom_compostable_packaging_14,
    subtitle: "Grocery Bags by the roll",
    alt: "Custom compostable packaging example 14",
  },
  {
    image: packaging5_zero_pack_custom_compostable_packaging_15,
    subtitle: "Shopping Bags",
    alt: "Custom compostable packaging example 15",
  },
  {
    image: packaging6_zero_pack_custom_compostable_packaging_16,
    subtitle: "LayFlat Tubing on Rolls",
    alt: "Custom compostable packaging example 16",
  },
  {
    image: packaging7_zero_pack_custom_compostable_packaging_17,
    subtitle: "Garment Bags",
    alt: "Custom compostable packaging example 17",
  },
  {
    image: packaging8_zero_pack_custom_compostable_packaging_2,
    subtitle: "Retail Bags",
    alt: "Custom compostable packaging example 2",
  },
  {
    image: packaging9_zero_pack_custom_compostable_packaging_3,
    subtitle: "Bubble Wrap",
    alt: "Custom compostable packaging example 3",
  },
  {
    image: packaging10_zero_pack_custom_compostable_packaging_4,
    subtitle: "Product Protection Packaging",
    alt: "Custom compostable packaging example 4",
  },
  {
    image: packaging11_zero_pack_custom_compostable_packaging_5,
    subtitle: "Food Packaging",
    alt: "Custom compostable packaging example 5",
  },
  {
    image: packaging12_zero_pack_custom_compostable_packaging_6,
    subtitle: "Retail Bags",
    alt: "Custom compostable packaging example 6",
  },
  {
    image: packaging13_zero_pack_custom_compostable_packaging_7,
    subtitle: "Show Bags",
    alt: "Custom compostable packaging example 7",
  },
  {
    image: packaging14_zero_pack_custom_compostable_packaging_8,
    subtitle: "Zip Lock Bags with a Slider",
    alt: "Custom compostable packaging example 8",
  },
  {
    image: packaging15_zero_pack_custom_compostable_packaging_9,
    subtitle: "Garment Bags",
    alt: "Custom compostable packaging example 9",
  },
  {
    image: packaging16_zero_pack_custom_compostable_packaging,
    subtitle: "Shopping Bags",
    alt: "Custom compostable packaging example",
  },
];

/** Maps packaging slides to the shared carousel component shape. */
export function packagingSlidesForCarousel(slides: PackagingCarouselSlide[] = packagingCarouselSlides) {
  return slides.map((slide) => ({
    image: slide.image,
    subheading: slide.subtitle,
    alt: slide.alt,
  }));
}
