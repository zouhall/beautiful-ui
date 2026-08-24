"use client";

import { Select as Base } from "@base-ui/react/select";
import type { ReactNode } from "react";

/* Select — Base UI listbox with the menu skin. */

export const Select = Base.Root;

export function SelectTrigger({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Base.Trigger
      className={`flex h-8 min-w-40 items-center justify-between gap-2 rounded-control border border-line bg-surface px-2.5 text-[12.5px] font-medium text-ink shadow-hairline outline-none transition-colors hover:border-line-strong data-[placeholder]:text-ink-3 ${className}`}
    >
      {children ?? <Base.Value />}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="shrink-0 text-ink-3" aria-hidden>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </Base.Trigger>
  );
}

export function SelectContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Base.Portal>
      <Base.Positioner side="bottom" align="start" sideOffset={6}>
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

export function SelectItem({
  value,
  children,
  className = "",
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Base.Item
      value={value}
      className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-chip px-2.5 py-1.5 text-left text-[12.5px] text-ink-2 outline-none transition-colors data-[highlighted]:bg-hover data-[highlighted]:text-ink ${className}`}
    >
      <Base.ItemText>{children}</Base.ItemText>
      <Base.ItemIndicator>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent-ink" aria-hidden>
          <path d="m4 12 5 5L20 6" />
        </svg>
      </Base.ItemIndicator>
    </Base.Item>
  );
}
