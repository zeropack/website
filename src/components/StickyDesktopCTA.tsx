"use client";

import { CTAButton } from "./CTAButton";
import { QUOTE_FORM_HREF } from "@/lib/site";

export function StickyDesktopCTA() {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden sm:block">
      <div className="pointer-events-auto rounded-lg shadow-lg">
        <CTAButton href={QUOTE_FORM_HREF} variant="primary" className="px-5 py-3">
          Get a Custom Quote
        </CTAButton>
      </div>
    </div>
  );
}
