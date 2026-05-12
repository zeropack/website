import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { StickyDesktopCTA } from "./StickyDesktopCTA";
import { MarketingClient } from "./MarketingClient";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingClient />
      <Header />
      <main className="flex-1 pb-24 sm:pb-6">{children}</main>
      <Footer />
      <StickyMobileCTA />
      <StickyDesktopCTA />
    </>
  );
}
