"use client";

import { Popover as Base } from "@base-ui/react/popover";
import type { ReactNode } from "react";

/* Popover — Base UI supplies the behavior (anchoring, focus trap, Esc,
 * outside-click dismissal); these wrappers supply the Beautiful UI skin.
 * The `bui-overlay` class lets the studio theme reach portaled content. */

export const Popover = Base.Root;
export const PopoverTrigger = Base.Trigger;
export const PopoverClose = Base.Close;

export function PopoverContent({
  children,
  side = "bottom",
  align = "center",
  sideOffset = 6,
  className = "",
}: {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}) {
  return (
    <Base.Portal>
      <Base.Positioner side={side} align={align} sideOffset={sideOffset}>
        <Base.Popup
          className={`bui-overlay rounded-card border border-line bg-surface text-ink shadow-overlay ${className}`}
          style={{ animation: "pop-in 160ms var(--ease-out-strong) both" }}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}
