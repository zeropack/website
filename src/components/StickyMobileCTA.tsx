"use client";

import { CTAButton } from "./CTAButton";
import { QUOTE_FORM_HREF } from "@/lib/site";

export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 p-3 backdrop-blur-sm sm:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <CTAButton href={QUOTE_FORM_HREF} variant="primary" className="flex-1 py-3 text-sm">
          Get Quote
        </CTAButton>
        <CTAButton href="/packaging-guide/download/" variant="secondary" className="flex-1 py-3 text-sm">
          Download the Guide
        </CTAButton>
      </div>
    </div>
  );
}
