import Link from "next/link";
import { CTAButton } from "./CTAButton";
import { BrandLogo } from "./BrandLogo";

const nav = [
  { href: "/custom-compostable-mailers/", label: "Mailers" },
  { href: "/custom-compostable-packaging/", label: "Packaging" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/customer-showcase/", label: "Showcase" },
  { href: "/articles/", label: "Articles" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
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
              <Link
                key={item.href}
                className="hover:text-compost"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <CTAButton href="/packaging-guide/" variant="secondary">
            Get the Guide
          </CTAButton>
          <CTAButton href="/quote/" variant="primary">
            Get a Custom Quote
          </CTAButton>
        </div>
        <div className="sm:hidden">
          <CTAButton href="/quote/" variant="primary" className="px-4 py-2 text-xs">
            Quote
          </CTAButton>
        </div>
      </div>
    </header>
  );
}
