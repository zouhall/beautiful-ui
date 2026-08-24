"use client";

import { Tooltip as Base } from "@base-ui/react/tooltip";
import type { ReactNode } from "react";

/* Tooltip — inverted hint on the shared chart-tooltip tokens
 * (--tooltip-bg/-fg/-border), so hints and chart tooltips read as one system. */

export const Tooltip = Base.Root;
export const TooltipTrigger = Base.Trigger;
export const TooltipProvider = Base.Provider;

export function TooltipContent({
  children,
  side = "top",
  sideOffset = 6,
  className = "",
}: {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
}) {
  return (
    <Base.Portal>
      <Base.Positioner side={side} sideOffset={sideOffset}>
        <Base.Popup
          className={`bui-overlay rounded-chip px-2 py-1 text-[11.5px] font-medium ${className}`}
          style={{
            background: "var(--tooltip-bg)",
            color: "var(--tooltip-fg)",
            border: "1px solid var(--tooltip-border)",
            animation: "pop-in 140ms var(--ease-out-strong) both",
          }}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}
