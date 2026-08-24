"use client";

import type { CSSProperties, ReactNode } from "react";

/* The handful of UI glyphs the atoms share — one stroke style, sized to
 * the 11–12px the system uses. Component-specific icons stay inline in
 * their components; these are the ones that recur. */

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

function Base({ size = 12, strokeWidth = 2.4, className, style, children }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
}

export const IconChevronDown = (p: IconProps) => (
  <Base {...p}><path d="m6 9 6 6 6-6" /></Base>
);
export const IconChevronRight = (p: IconProps) => (
  <Base {...p}><path d="m9 6 6 6-6 6" /></Base>
);
export const IconChevronLeft = (p: IconProps) => (
  <Base {...p}><path d="m15 6-6 6 6 6" /></Base>
);
export const IconCheck = (p: IconProps) => (
  <Base strokeWidth={2.8} {...p}><path d="m4 12 5 5L20 6" /></Base>
);
export const IconX = (p: IconProps) => (
  <Base strokeWidth={2.8} {...p}><path d="M18 6 6 18M6 6l12 12" /></Base>
);
export const IconPlus = (p: IconProps) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
);
export const IconArrowUpRight = (p: IconProps) => (
  <Base strokeWidth={2.8} {...p}><path d="M7 17 17 7M8 7h9v9" /></Base>
);
export const IconArrowDownRight = (p: IconProps) => (
  <Base strokeWidth={2.8} {...p}><path d="M7 7l10 10M17 8v9H8" /></Base>
);
