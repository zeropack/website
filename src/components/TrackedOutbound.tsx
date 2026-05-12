"use client";

import type { ReactNode } from "react";
import { pushDataLayer } from "@/lib/tracking";

export function TrackedOutbound({
  href,
  event,
  children,
  className,
}: {
  href: string;
  event: "email_click" | "phone_click" | "outbound_email_click";
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => pushDataLayer(event, { href })}
    >
      {children}
    </a>
  );
}
