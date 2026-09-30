"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { LaunchedMarket } from "@/lib/requestMarket";
import { trackTool } from "@/lib/tools/analytics";

export type ToolIdentity = { id: string; name: string; market: LaunchedMarket };

export function ToolView({ tool }: { tool: ToolIdentity }) {
  useEffect(() => { trackTool("tool_view", tool.id, tool.name, tool.market, "viewed"); }, [tool]);
  return null;
}

export function ToolCta({ href, children, kind, tool, className }: { href: string; children: React.ReactNode; kind: "quote" | "guide"; tool: ToolIdentity; className: string }) {
  return <Link href={href} className={className} onClick={() => trackTool(kind === "quote" ? "tool_quote_click" : "tool_guide_click", tool.id, tool.name, tool.market, "clicked")}>{children}</Link>;
}
