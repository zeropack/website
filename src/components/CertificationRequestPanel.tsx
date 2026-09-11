type PublicMarket = "global" | "au" | "uk";

const CERTIFICATE_REQUEST_HREF =
  "mailto:hello@zeropack.co?subject=Certificate%20request";

const certificatesByMarket: Record<PublicMarket, string[]> = {
  global: ["AS 5810 home compostability"],
  au: ["AS 5810 home compostability"],
  uk: ["TÜV OK compost HOME", "AS 5810 home compostability"],
};

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-14 w-12"
      aria-hidden
    >
      <path d="M10 2h18l10 10v42H10z" />
      <path d="M28 2v12h10" />
      <path d="M16 26h16M16 34h16M16 42h11" />
    </svg>
  );
}

export function CertificationRequestPanel({ market }: { market: PublicMarket }) {
  const certificates = certificatesByMarket[market];

  return (
    <section className="border-t border-slate-200/60 bg-[#f4f8fb] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-air">Certification evidence</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            Certificate documentation available on request
          </h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/70">
            We provide the relevant certification documentation on request once we have confirmed the product and specification you are reviewing.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {certificates.map((certificate) => (
            <a
              key={certificate}
              href={CERTIFICATE_REQUEST_HREF}
              className="group flex items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-air/50 hover:shadow-md"
              aria-label={`Request ${certificate} certificate documentation by email`}
            >
              <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-charcoal/65 transition group-hover:text-air">
                <DocumentIcon />
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-charcoal">{certificate}</p>
                <p className="mt-1 text-sm text-charcoal/65">Request certificate documentation →</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
