export function TrustStrip({ items, variant = "default" }: { items: string[]; variant?: "default" | "climate" }) {
  const isClimate = variant === "climate";

  return (
    <div
      className={
        isClimate
          ? "border-y border-slate-800/80 bg-gradient-to-r from-charcoal via-[#152a1f] to-charcoal"
          : "border-y border-black/5 bg-mist/60"
      }
    >
      <div
        className={
          isClimate
            ? "mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 px-4 py-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:px-6 sm:text-xs"
            : "mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-compost sm:px-6 sm:text-sm"
        }
      >
        {items.map((t) => (
          <span key={t} className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isClimate ? "bg-air" : "bg-leaf"}`} aria-hidden />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
