"use client";

import { useEffect } from "react";
import { captureUtmFromUrl, persistAttribution } from "@/lib/attribution";

/** Initialise dataLayer + capture first/last-touch UTMs */
export function MarketingClient() {
  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];
    const utm = captureUtmFromUrl();
    persistAttribution(utm);
  }, []);
  return null;
}
