import { SiteImage } from "./SiteImage";
import type { StaticImageData } from "next/image";
import logoPrimary from "@/content/images/logo/zero-pack-logo-deep_compost_green-transparent.png";
import logoWhite from "@/content/images/logo/zero-pack-logo-white-transparent.png";
import logoCharcoal from "@/content/images/logo/zero-pack-logo-charcoal-transparent.png";
import logoLeaf from "@/content/images/logo/zero-pack-logo-fresh_leaf-transparent.png";

export type BrandLogoVariant = "primary" | "white" | "charcoal" | "leaf";

const byVariant: Record<BrandLogoVariant, StaticImageData> = {
  primary: logoPrimary,
  white: logoWhite,
  charcoal: logoCharcoal,
  leaf: logoLeaf,
};

/** Wordmark assets in `src/content/images/logo/`. Primary = deep compost green (#214E34) for light UI. */
export function BrandLogo({
  variant = "primary",
  /** Applied to `Image`: use `h-* w-auto` so aspect ratio is preserved (avoid `fill` + `w-full` in flex — collapses). */
  imageClassName = "h-14 w-auto max-w-[min(336px,90vw)] sm:h-[4.5rem]",
  className = "",
  priority = false,
}: {
  variant?: BrandLogoVariant;
  imageClassName?: string;
  className?: string;
  priority?: boolean;
}) {
  const src = byVariant[variant];
  return (
    <span className={`inline-block max-w-full ${className}`}>
      <SiteImage
        src={src}
        alt="Zero Pack"
        width={src.width}
        height={src.height}
        priority={priority}
        sizes="(max-width: 640px) min(336px, 90vw), 360px"
        className={`object-contain object-left ${imageClassName}`}
      />
    </span>
  );
}
