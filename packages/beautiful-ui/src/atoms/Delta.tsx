"use client";

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
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11.5px] font-medium tabular-nums ${className}`}
      style={{ color: up ? "var(--green)" : "var(--red)" }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={up ? "M7 17 17 7M8 7h9v9" : "M7 7l10 10M17 8v9H8"} />
      </svg>
      {Math.abs(value)}
      {suffix}
    </span>
  );
}
