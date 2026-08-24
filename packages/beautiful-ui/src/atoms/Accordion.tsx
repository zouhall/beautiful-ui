"use client";

import { Accordion as Base } from "@base-ui/react/accordion";
import type { ReactNode } from "react";

/* Accordion — ruled rows with a rotating chevron. */

export function Accordion({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Base.Root className={`w-full ${className}`}>{children}</Base.Root>;
}

export function AccordionItem({
  value,
  title,
  children,
}: {
  value: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <Base.Item value={value} className="group border-b border-line">
      <Base.Header>
        <Base.Trigger className="flex w-full items-center justify-between py-3 text-left text-[12.5px] font-medium text-ink-2 outline-none transition-colors hover:text-ink">
          {title}
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
            className="shrink-0 text-ink-3 transition-transform duration-200 group-data-[open]:rotate-180" aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Base.Trigger>
      </Base.Header>
      <Base.Panel className="pb-3 text-[12.5px] leading-relaxed text-ink-3">
        {children}
      </Base.Panel>
    </Base.Item>
  );
}
