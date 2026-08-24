"use client";

import { IconArrowDownRight, IconArrowUpRight } from "./icons";

/* Delta — signed change with arrow, green up / red down. */

export function Delta({
  value,
  suffix = "%",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const up = value >= 0;
  const Icon = up ? IconArrowUpRight : IconArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11.5px] font-medium tabular-nums ${
        up ? "text-green" : "text-red"
      } ${className}`}
    >
      <Icon size={10} />
      {Math.abs(value)}
      {suffix}
    </span>
  );
}
