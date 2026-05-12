import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use | Zero Pack",
  description: "Terms placeholder for Zero Pack — replace with legal review before launch.",
  path: "/terms/",
});

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal">Terms (placeholder)</h1>
        <p className="mt-4 text-charcoal/75">
          Placeholder terms. Replace with commercial terms covering quotes, specifications, approvals, cancellations and
          limitation of liability as advised by counsel.
        </p>
      </div>
    </section>
  );
}
