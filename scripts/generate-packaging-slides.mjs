import fs from "fs";
import path from "path";

const dir = "src/content/images/custom/packaging";
const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(png|webp|jpe?g)$/i.test(f))
  .sort((a, b) => a.localeCompare(b));

function toAlias(file, index) {
  const cleaned = file
    .replace(/\.(png|webp|jpe?g)$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 48);
  return `packaging${index}_${cleaned || "image"}`;
}

function toSubtitle(file, index) {
  const match = file.match(/\((\d+)\)/);
  if (/zero_pack_custom_compostable_packaging/i.test(file)) {
    const label = match ? `example ${match[1]}` : "example";
    return `Edit subtitle — custom compostable packaging ${label}`;
  }
  return file
    .replace(/\.(png|webp|jpe?g)$/i, "")
    .replace(/ - 1024 x 1024$/i, "")
    .replace(/ tpt$/i, "")
    .trim();
}

function toAlt(file, index) {
  const match = file.match(/\((\d+)\)/);
  if (/zero_pack_custom_compostable_packaging/i.test(file)) {
    return match
      ? `Custom compostable packaging example ${match[1]}`
      : "Custom compostable packaging example";
  }
  return toSubtitle(file, index);
}

let out = `import type { StaticImageData } from "next/image";\n\n`;

files.forEach((file, index) => {
  const alias = toAlias(file, index);
  out += `import ${alias} from "@/content/images/custom/packaging/${file.replace(/"/g, '\\"')}";\n`;
});

out += `
export type PackagingCarouselSlide = {
  image: StaticImageData;
  /** Edit this subtitle — shown permanently on the carousel overlay. */
  subtitle: string;
  alt: string;
};

export const packagingCarouselSlides: PackagingCarouselSlide[] = [
`;

files.forEach((file, index) => {
  const alias = toAlias(file, index);
  const subtitle = toSubtitle(file, index);
  const alt = toAlt(file, index);
  out += `  {
    image: ${alias},
    subtitle: ${JSON.stringify(subtitle)},
    alt: ${JSON.stringify(alt)},
  },
`;
});

out += `];

/** Maps packaging slides to the shared carousel component shape. */
export function packagingSlidesForCarousel(slides: PackagingCarouselSlide[] = packagingCarouselSlides) {
  return slides.map((slide) => ({
    image: slide.image,
    subheading: slide.subtitle,
    alt: slide.alt,
  }));
}
`;

fs.writeFileSync("src/content/packagingCarouselSlides.ts", out);
console.log(`Wrote ${files.length} slides`);
