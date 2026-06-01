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
        } else if (delta < -SCROLL_DELTA) {
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      inert={visible ? undefined : true}
      className={`fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out ${
        visible ? "translate-y-0" : "motion-safe:-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="inline-block shrink-0 py-1 transition-opacity hover:opacity-90 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-compost"
            aria-label="Zero Pack — Home"
          >
            <BrandLogo variant="primary" priority />
          </Link>
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
    </header>
  );
}
