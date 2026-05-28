"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  external,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A8F3]";
  const styles: Record<Variant, string> = {
    primary: "bg-air text-white hover:bg-[#0096d6]",
    secondary:
      "border border-compost/30 bg-white text-compost hover:border-compost hover:bg-mist",
    ghost: "text-compost hover:bg-mist underline-offset-4 hover:underline",
  };

  const cls = `${base} ${styles[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
