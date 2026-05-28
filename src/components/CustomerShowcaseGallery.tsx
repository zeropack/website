import { SiteImage } from "@/components/SiteImage";
import type { CustomerShowcaseBrand } from "@/content/customerShowcase";

export function CustomerShowcaseGallery({ brands }: { brands: CustomerShowcaseBrand[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <article
          key={brand.name}
          className="group zp-hover-lift overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-300/20"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8]">
            {brand.image ? (
              <SiteImage
                src={brand.image}
                alt={brand.alt}
                width={brand.image.width}
                height={brand.image.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                <span className="rounded-full border border-dashed border-slate-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                  Image coming soon
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 border-t border-slate-200/40 bg-white/50 p-4 text-center backdrop-blur-sm sm:p-5">
              <h3 className="font-heading text-lg font-semibold text-charcoal sm:text-xl">{brand.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{brand.description}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
