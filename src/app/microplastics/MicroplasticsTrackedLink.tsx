"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { pushDataLayer } from "@/lib/tracking";

export function MicroplasticsTrackedLink({
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      {...props}
      onClick={(event) => {
        pushDataLayer("microplastics_evidence_article_opened");
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
