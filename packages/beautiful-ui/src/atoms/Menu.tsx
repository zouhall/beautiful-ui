"use client";

import { Menu as Base } from "@base-ui/react/menu";
import type { ReactNode } from "react";

/* Menu — dropdown on Base UI. Keyboard navigation and typeahead come from
 * the primitive; the skin mirrors the records-table filter menus. */

export const Menu = Base.Root;
export const MenuTrigger = Base.Trigger;

export function MenuContent({
  children,
  side = "bottom",
  align = "start",
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
          className={`bui-overlay min-w-44 rounded-card border border-line-strong bg-surface p-1.5 shadow-overlay ${className}`}
          style={{ animation: "pop-in 160ms var(--ease-out-strong) both" }}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

export function MenuItem({
  children,
  destructive = false,
  className = "",
  onClick,
}: {
  children: ReactNode;
  destructive?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Base.Item
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-2 rounded-chip px-2.5 py-1.5 text-left text-[12.5px] outline-none transition-colors data-[highlighted]:bg-hover ${
        destructive ? "text-red" : "text-ink-2 data-[highlighted]:text-ink"
      } ${className}`}
    >
      {children}
    </Base.Item>
  );
}

export function MenuSeparator() {
  return <Base.Separator className="my-1 h-px bg-line" />;
}
