import type { Metadata } from "next";

import { CustomerReintroSubscribe } from "@/components/CustomerReintroSubscribe";

export const metadata: Metadata = {
  title: "Keep in touch with Zero Pack",
  description: "Confirm your Zero Pack email subscription.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="bg-stone py-14 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-compost">Zero Pack updates</p>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
            Keep in touch with Zero Pack
          </h1>
          <p className="mt-5 leading-relaxed text-charcoal/75">
            Subscribe for useful packaging updates, new resources, product news and practical tools from Zero Pack.
          </p>
          <CustomerReintroSubscribe />
        </div>
      </div>
    </section>
  );
}
