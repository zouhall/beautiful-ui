"use client";

import type { InputHTMLAttributes } from "react";

/* Input — the field skin used across the studio and records toolbar. */

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-control border border-line bg-field px-2.5 py-1.5 text-[12.5px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent ${className}`}
    />
  );
}
