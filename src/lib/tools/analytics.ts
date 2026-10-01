"use client";

import { pushDataLayer } from "@/lib/tracking";
import type { LaunchedMarket } from "@/lib/requestMarket";

export type ToolEvent = "tool_view" | "tool_start" | "tool_complete" | "tool_quote_click" | "tool_guide_click" | "tool_result_email_submit" | "tool_marketing_opt_in";

/** Only a fixed event and non-identifying labels enter the existing site dataLayer. */
export function trackTool(event: ToolEvent, toolId: string, toolName: string, market: LaunchedMarket, completionState: "started" | "completed" | "viewed" | "clicked") {
  pushDataLayer(event, { tool_id: toolId, tool_name: toolName, market, completion_state: completionState });
}
