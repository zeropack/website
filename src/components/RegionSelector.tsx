"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { pushDataLayer } from "@/lib/tracking";
import type { RegionCode } from "@/lib/types";

function isLaunchedRegion(code: RegionCode): boolean {
  return code === "au" || code === "uk";
}

const cards: { code: RegionCode; label: string; blurb: string; href: string }[] = [
  {
    code: "au",
    label: "Australia",
    blurb: "Australian ecommerce brands — quotes, certification guidance and local delivery language.",
    href: "/au/",
  },
  {
    code: "uk",
    label: "United Kingdom",
    blurb: "UK ecommerce brands — practical MOQs and made-to-order custom print.",
    href: "/uk/",
  },
  {
    code: "us",
    label: "United States",
    blurb: "Enquire for US shipping, timelines and feasibility.",
    href: "/us/",
  },
  {
    code: "eu",
    label: "European Union",
    blurb: "Enquire for EU shipping countries, timelines and feasibility.",
    href: "/eu/",
  },
];

export function RegionSelector({
  title = "Choose your region",
  description = "Choose the region you mainly ship from so quotes, delivery wording and compliance notes match your market.",
  sectionClassName,
}: {
  title?: string;
  description?: string;
  /** Replaces default section background when set (keep padding utilities if needed). */
  sectionClassName?: string;
}) {
  const router = useRouter();

  return (
    <section className={sectionClassName ?? "bg-stone py-14 sm:py-20"}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{title}</h2>
          <p className="mt-3 text-charcoal/75">{description}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.code}
              href={c.href}
              onClick={() => {
                pushDataLayer("region_selected", { region: c.code });
              }}
              className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-heading text-lg font-semibold text-compost group-hover:text-forest">
                {c.label}
              </p>
              <p className="mt-2 text-sm text-charcoal/70">{c.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-leaf">
                {isLaunchedRegion(c.code) ? "Enter region" : "View status"}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="text-charcoal/60">Prefer automatic routing later?</span>
          <button
            type="button"
            className="font-medium text-air underline-offset-4 hover:underline"
            onClick={() => {
              if (typeof window === "undefined") return;
              const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
              const guess =
                tz.includes("London") || tz.includes("Europe/London")
                  ? "/uk/"
                  : tz.includes("Australia") || tz.includes("Sydney") || tz.includes("Melbourne")
                    ? "/au/"
                    : "/contact/";
              pushDataLayer("region_selected", { region: "auto_guess", tz });
              router.push(guess);
            }}
          >
            Suggest a region for me
          </button>
        </div>
      </div>
    </section>
  );
}
