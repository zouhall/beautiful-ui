"use client";

import type { ReactNode } from "react";

/* Badge — the small count/tag pill from the studio sidebar. */

export type BadgeTone = "neutral" | "accent" | "green" | "orange" | "red";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-inset text-ink-3",
  accent: "bg-accent-tint text-accent-ink",
  green: "bg-green-tint text-green",
  orange: "bg-orange-tint text-orange",
  red: "bg-red-tint text-red",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-[18px] items-center rounded-full px-1.5 text-[10px] font-medium tabular-nums ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
