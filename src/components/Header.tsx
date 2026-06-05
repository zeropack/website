"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CTAButton } from "./CTAButton";
import { BrandLogo } from "./BrandLogo";
import { TREND_PACKAGING_FUNNEL_HREF, QUOTE_FORM_HREF } from "@/lib/site";

const nav = [
  { href: TREND_PACKAGING_FUNNEL_HREF, label: "Mailers" },
  { href: "/custom-compostable-packaging/", label: "Packaging" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/customer-showcase/", label: "Showcase" },
  { href: "/articles/", label: "Articles" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

const SCROLL_DELTA = 8;
const TOP_THRESHOLD = 12;

export function Header() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY <= TOP_THRESHOLD) {
          setVisible(true);
        } else if (delta > SCROLL_DELTA) {
          setVisible(false);
          setMenuOpen(false);
        } else if (delta < -SCROLL_DELTA) {
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <header
        inert={visible ? undefined : true}
        className={`fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out ${
          visible ? "translate-y-0" : "motion-safe:-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 lg:gap-8">
            <Link
              href="/"
              className="inline-block shrink-0 py-1 transition-opacity hover:opacity-90 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-compost"
              aria-label="Zero Pack — Home"
            >
              <BrandLogo variant="primary" priority />
            </Link>

            {/* Hamburger button — mobile/tablet only */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-charcoal/70 hover:bg-black/5 hover:text-charcoal lg:hidden"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>

            <nav className="hidden items-center gap-5 text-sm font-medium text-charcoal/80 lg:flex">
              {nav.map((item) => (
                <Link key={item.href} className="hover:text-compost" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <CTAButton href="/packaging-guide/download/" variant="secondary">
              Download the Guide
            </CTAButton>
            <CTAButton href={QUOTE_FORM_HREF} variant="primary">
              Get a Custom Quote
            </CTAButton>
          </div>
          <div className="sm:hidden">
            <CTAButton href={QUOTE_FORM_HREF} variant="primary" className="px-4 py-2 text-xs">
              Quote
            </CTAButton>
          </div>
        </div>

        {/* Mobile menu — slides down below header */}
        {menuOpen && (
          <div className="border-t border-black/5 bg-white lg:hidden">
            <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
              <ul className="space-y-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-charcoal/80 hover:bg-black/5 hover:text-compost"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-4">
                <CTAButton
                  href="/packaging-guide/download/"
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Download the Guide
                </CTAButton>
                <CTAButton
                  href={QUOTE_FORM_HREF}
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Get a Custom Quote
                </CTAButton>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Backdrop — tapping outside closes the menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
