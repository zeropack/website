function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M12 21V12M3 7.5 12 12m9-4.5L12 12" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5M10 12h5M10 16h5" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
    </svg>
  );
}

const proofItems = [
  { value: "750,000+", label: "Custom bags produced", icon: PackageIcon },
  {
    value: "Certification",
    label: "Certified compostable packaging",
    icon: DocumentIcon,
  },
  {
    value: "Made to order",
    label: "Packaging developed around your product and brand",
    icon: CheckIcon,
  },
  {
    value: "Worldwide delivery",
    label: "Working with businesses all over the world",
    icon: GlobeIcon,
  },
] as const;

export function CustomPackagingProofBar() {
  return (
    <section className="border-y border-slate-800/80 bg-charcoal py-8 text-white sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {proofItems.map((item) => (
            <div
              key={item.value}
              className="zp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-air/30 hover:bg-white/10"
            >
              <div className="mx-auto inline-flex rounded-full bg-air/15 p-3 text-air">
                <item.icon className="h-6 w-6" />
              </div>
              <p className="mt-3 font-heading text-sm font-semibold text-white">
                {item.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
