"use client";

import { useState } from "react";
import { SegmentedControl } from "../atoms/SegmentedControl";
import { Delta } from "../atoms/Delta";

/* ChartCard — rounded bars over a track, period switcher, count headline.
 * Bars are divs, not SVG: they theme through the tokens for free. */

export function ChartCard({
  title,
  value,
  delta,
  data,
  periods = ["Week", "Month", "Year"],
  className = "",
}: {
  title: string;
  value: string;
  delta?: number;
  data: number[];
  periods?: string[];
  className?: string;
}) {
  const [period, setPeriod] = useState(periods[0]);
  const max = Math.max(...data, 1);

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
        <span className="text-[24px] font-semibold tracking-tight tabular-nums text-ink">
          {value}
        </span>
        {delta != null && <Delta value={delta} />}
      </div>
      <div className="mt-3 flex h-24 items-stretch gap-1">
        {data.map((d, i) => (
          <div key={i} className="relative h-full flex-1 overflow-hidden rounded-[3px] bg-inset">
            <div
              className="absolute bottom-0 w-full rounded-[3px] bg-accent transition-all duration-300"
              style={{ height: `${(d / max) * 100}%`, opacity: 0.3 + 0.7 * (d / max) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
