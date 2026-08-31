import type { Metadata } from "next";

import { TrackingLookup } from "@/components/TrackingLookup";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Track your Zero Pack shipment and view the latest carrier delivery updates.",
  robots: { index: false, follow: true },
};

export default function TrackPage() {
  return <TrackingLookup />;
}
