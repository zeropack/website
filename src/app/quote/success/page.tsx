import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { QuoteSuccessContent } from "@/components/QuoteSuccessContent";

export const metadata: Metadata = buildMetadata({
  title: "Quote Received | Zero Pack",
  description: "Thank you — we received your custom packaging request.",
  path: "/quote/success/",
});

export default function Page() {
  return <QuoteSuccessContent />;
}
