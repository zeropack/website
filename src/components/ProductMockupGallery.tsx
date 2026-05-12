export function ProductMockupGallery({ tone = "default" }: { tone?: "default" | "climate" }) {
  const isClimate = tone === "climate";

  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className={
          isClimate
            ? "col-span-2 aspect-[16/10] rounded-2xl bg-gradient-to-br from-white via-mist/90 to-[#e3f2fa] p-6 shadow-lg shadow-slate-400/15 ring-1 ring-slate-200/70"
            : "col-span-2 aspect-[16/10] rounded-2xl bg-gradient-to-br from-mist to-white p-6 shadow-sm ring-1 ring-black/5"
        }
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-compost/70">
            <span>Custom mailer</span>
            <span>Made to order</span>
          </div>
          <div className="mx-auto h-36 w-[78%] rounded-lg bg-kraft/40 shadow-inner ring-1 ring-black/10">
            <div className="flex h-full items-center justify-center font-heading text-sm font-semibold text-compost/80">
              Your brand here
            </div>
          </div>
          <p className="text-xs text-charcoal/55">Concept layout for hero imagery.</p>
        </div>
      </div>
      <div
        className={
          isClimate
            ? "aspect-square rounded-xl bg-gradient-to-br from-charcoal to-[#0f2918] p-4 text-white shadow-md shadow-slate-900/30 ring-1 ring-white/10"
            : "aspect-square rounded-xl bg-charcoal p-4 text-white shadow-sm"
        }
      >
        <p className="text-xs font-semibold text-leaf">Texture</p>
        <p className="mt-2 text-sm text-white/80">Show material texture and print quality the way customers see them.</p>
      </div>
      <div
        className={
          isClimate
            ? "aspect-square rounded-xl border border-slate-200/60 bg-white/90 p-4 shadow-sm shadow-slate-300/25 backdrop-blur-sm"
            : "aspect-square rounded-xl bg-mist p-4 shadow-sm ring-1 ring-black/5"
        }
      >
        <p className="text-xs font-semibold text-compost">Fulfilment</p>
        <p className="mt-2 text-sm text-charcoal/75">
          Real packing and dispatch photography helps buyers picture how you operate day to day.
        </p>
      </div>
    </div>
  );
}
