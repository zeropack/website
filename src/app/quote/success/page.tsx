import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { QuoteSuccessContent } from "@/components/QuoteSuccessContent";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Quote Received",
    description: "Thank you — we received your custom packaging request.",
    path: "/quote/success/",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <QuoteSuccessContent />;
}
