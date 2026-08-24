"use client";

import { useId, useState } from "react";
import { SegmentedControl } from "../atoms/SegmentedControl";
import { Delta } from "../atoms/Delta";

/* ChartCard — the dashboard chart unit. Bars are divs; the area chart is
 * one SVG path with a token-driven gradient. `series="ink"` is the BoardUI
 * contrast move: the data reads near-black (or near-white in dark), and
 * the accent stays reserved for interaction. */

export function ChartCard({
  title,
  value,
  delta,
  data,
  variant = "bar",
  series = "ink",
  periods = ["Week", "Month", "Year"],
  className = "",
}: {
  title: string;
  value: string;
  delta?: number;
  data: number[];
  variant?: "bar" | "area";
  series?: "ink" | "accent";
  periods?: string[];
  className?: string;
}) {
  const [period, setPeriod] = useState(periods[0]);
  const gid = useId();
  const max = Math.max(...data, 1);
  const color = series === "ink" ? "var(--ink)" : "var(--accent)";

  const W = 100;
  const H = 36;
  const pts = data.map((d, i) => [
    (i / Math.max(1, data.length - 1)) * W,
    H - (d / max) * (H - 4),
  ]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;

  return (
    <div className={`rounded-card border border-line bg-surface p-4 shadow-hairline ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12.5px] font-medium text-ink-2">{title}</p>
        <SegmentedControl
          options={periods}
          value={period}
          onChange={setPeriod}
          className="[&>span]:px-2 [&>span]:text-[11px]"
        />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[26px] font-semibold tracking-[-0.02em] tabular-nums text-ink">
          {value}
        </span>
        {delta != null && <Delta value={delta} />}
      </div>

      {variant === "bar" ? (
        <div className="mt-3 flex h-24 items-stretch gap-1">
          {data.map((d, i) => (
            <div key={i} className="relative h-full flex-1 overflow-hidden rounded-[3px] bg-inset">
              <div
                className="absolute bottom-0 w-full rounded-[3px] transition-all duration-300"
                style={{
                  height: `${(d / max) * 100}%`,
                  background: color,
                  opacity: series === "accent" ? 0.3 + 0.7 * (d / max) : 1,
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="mt-3 h-24 w-full"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
          <path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  );
}
