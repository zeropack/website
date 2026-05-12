import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Zero Pack",
  description: "Privacy policy placeholder for Zero Pack — replace with legal review before launch.",
  path: "/privacy/",
});

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal">Privacy policy (placeholder)</h1>
        <p className="mt-4 text-charcoal/75">
          This is placeholder legal copy. Replace with a jurisdiction-appropriate privacy policy covering lead forms,
          analytics, marketing email consent and data retention.
        </p>
      </div>
    </section>
  );
}
