import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { TREND_PACKAGING_FUNNEL_HREF } from "@/lib/site";

const groups = [
  {
    title: "Products",
    links: [
      { href: TREND_PACKAGING_FUNNEL_HREF, label: "Custom compostable mailers" },
      { href: "/custom-compostable-packaging/", label: "Custom compostable packaging" },
      { href: "/packaging-guide/", label: "Branded packaging guide" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about/", label: "About" },
      { href: "/how-it-works/", label: "How it works" },
      { href: "/articles/", label: "Articles & guides" },
      { href: "/customer-showcase/", label: "Customer showcase" },
      { href: "/contact/", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[#214E34] text-white">
      <div className="mx-auto grid min-w-0 max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="min-w-0">
          <Link href="/" className="inline-block max-w-full py-1" aria-label="Zero Pack — Home">
            <BrandLogo variant="white" imageClassName="h-[4.5rem] w-auto max-w-full sm:h-20" />
          </Link>
          <p className="mt-3 text-sm text-white/80">
            Custom compostable packaging, made for brands that care what they send out.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-sm font-semibold text-leaf">{g.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link className="hover:text-white" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-sm font-semibold text-leaf">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <Link className="hover:text-white" href="/privacy/">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/terms/">
                Terms
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs text-white/60">
            B2B custom compostable packaging for ecommerce brands — made to order and sold through custom quotes.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Zero Pack. All rights reserved.
      </div>
    </footer>
  );
}
