"use client";

import { CTAButton } from "./CTAButton";

export function StickyDesktopCTA() {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden sm:block">
      <div className="pointer-events-auto rounded-lg shadow-lg">
        <CTAButton href="/quote/" variant="primary" className="px-5 py-3">
          Get a Custom Quote
        </CTAButton>
      </div>
    </div>
  );
}
