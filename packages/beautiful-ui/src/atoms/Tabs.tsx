"use client";

import { Tabs as Base } from "@base-ui/react/tabs";
import type { ReactNode } from "react";

/* Tabs — underline style. Distinct from SegmentedControl (which switches
 * values); Tabs switch panels of content. */

export const Tabs = Base.Root;

export function TabsList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Base.List className={`flex items-center gap-1 border-b border-line ${className}`}>
      {children}
    </Base.List>
  );
}

export function TabsTab({
  value,
  children,
  className = "",
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Base.Tab
      value={value}
      className={`-mb-px border-b-2 border-transparent px-3 py-2 text-[12.5px] font-medium text-ink-3 outline-none transition-colors hover:text-ink-2 aria-selected:border-accent aria-selected:text-ink ${className}`}
    >
      {children}
    </Base.Tab>
  );
}

export function TabsPanel({
  value,
  children,
  className = "",
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Base.Panel value={value} className={`pt-3 text-[12.5px] text-ink-2 ${className}`}>
      {children}
    </Base.Panel>
  );
}
