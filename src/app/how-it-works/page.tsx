import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { PackagingPathFlowchart } from "@/components/PackagingPathFlowchart";

export const metadata: Metadata = buildMetadata({
  title: "How It Works | Zero Pack",
  description:
    "Eight clear steps from your first custom packaging quote to shipping branded compostable mailers with every order.",
  path: "/how-it-works/",
});

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/40 bg-gradient-to-br from-[#f4f7fb] via-white to-[#eef6f3] pb-12 pt-14 sm:pb-16 sm:pt-20">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.12),transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(131,185,37,0.1),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-compost">How it works</p>
          <h1 className="mt-2 max-w-4xl font-heading text-3xl font-semibold text-charcoal sm:text-5xl">
            From first quote to shipping with your brand on every parcel
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-charcoal/75">
            Every custom compostable packaging order follows the same eight-stage path — with written confirmation at
            each milestone. Sizes, packaging and design are confirmed before your final quote is issued; nothing goes to
            production until that quote is accepted.
          </p>
        </div>
      </section>

      <PackagingPathFlowchart />

      <LeadMagnetBlock />
    </>
  );
}
