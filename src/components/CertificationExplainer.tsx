export function CertificationExplainer({
  title = "Certification and material credibility",
  paragraphs,
  bullets,
  variant = "default",
}: {
  title?: string;
  paragraphs: string[];
  bullets?: string[];
  variant?: "default" | "climate";
}) {
  const isClimate = variant === "climate";

  return (
    <section
      className={
        isClimate
          ? "border-y border-slate-200/60 bg-gradient-to-b from-white to-slate-50 py-14 sm:py-20"
          : "bg-white py-14 sm:py-20"
      }
    >
      <div className={`mx-auto px-4 sm:px-6 ${isClimate ? "max-w-4xl" : "max-w-3xl"}`}>
        <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{title}</h2>
        <div className="mt-6 space-y-4 text-charcoal/75">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
        {bullets ? (
          <ul className="mt-6 space-y-2 text-sm text-charcoal/75">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-leaf" aria-hidden>
                  •
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
