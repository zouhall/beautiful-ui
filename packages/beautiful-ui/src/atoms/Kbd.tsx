"use client";

import type { ReactNode } from "react";

/* Kbd — keyboard key cap. */

export function Kbd({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-chip border border-line bg-inset px-1 font-mono text-[10.5px] font-medium text-ink-2 shadow-hairline ${className}`}
    >
      {children}
    </kbd>
  );
}
