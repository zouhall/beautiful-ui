"use client";

import { useId, useMemo, useState } from "react";
import { SegmentedControl } from "../atoms/SegmentedControl";
import { Delta } from "../atoms/Delta";

/* ─────────────────────────────────────────────────────────
 * ChartCard — Interactive, responsive chart primitives with
 * Liveline precision & beautiful-pi aesthetic.
 *
 * Variants:
 *  - area: smoothly interpolated gradient curve with live scrub cursor
 *  - bar: crisp rounded track bars with hover tooltips
 *  - sparkline: compact inline trend
 * ───────────────────────────────────────────────────────── */

export type ChartDataPoint = {
  label: string;
  value: number;
  secondary?: number;
};

export function ChartCard({
  title,
  value,
  delta,
  hint = "vs last period",
  data,
  variant = "area",
  series = "ink",
  periods = ["Day", "Week", "Month", "Year"],
  className = "",
}: {
  title: string;
  value: string;
  delta?: number;
  hint?: string;
  data: number[] | ChartDataPoint[];
  variant?: "area" | "bar";
  series?: "ink" | "accent" | "green";
  periods?: string[];
  className?: string;
}) {
  const [period, setPeriod] = useState(periods[0] ?? "Week");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gid = useId();

  // Normalize data points
  const points: { label: string; value: number }[] = useMemo(() => {
    return data.map((d, i) => {
      if (typeof d === "number") {
        return { label: `P${i + 1}`, value: d };
      }
      return { label: d.label, value: d.value };
    });
  }, [data]);

  const rawValues = useMemo(() => points.map((p) => p.value), [points]);
  const max = Math.max(...rawValues, 1);
  const min = Math.min(...rawValues, 0);

  const activeIndex = hoverIndex !== null ? hoverIndex : points.length - 1;
  const activePoint = points[activeIndex];

  const color =
    series === "accent"
      ? "var(--accent)"
      : series === "green"
        ? "var(--green)"
        : "var(--ink)";

  const W = 360;
  const H = 110;
  const padTop = 14;
  const padBottom = 16;
  const chartH = H - padTop - padBottom;

  // Catmull-Rom or cubic spline points
  const pts: [number, number][] = useMemo(() => {
    if (points.length <= 1) return [[0, H / 2], [W, H / 2]];
    const n = points.length;
    return points.map((p, i) => {
      const x = (i / (n - 1)) * W;
      const normalized = (p.value - min) / Math.max(max - min, 1);
      const y = padTop + (1 - normalized) * chartH;
      return [x, y];
    });
  }, [points, min, max, W, H, padTop, chartH]);

  // SVG Smooth Path generator
  const linePath = useMemo(() => {
    if (pts.length <= 1) return "";
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];

      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }, [pts]);

  const areaPath = useMemo(() => {
    if (!linePath) return "";
    return `${linePath} L ${W},${H} L 0,${H} Z`;
  }, [linePath, W, H]);

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const idx = Math.round((x / rect.width) * (points.length - 1));
    setHoverIndex(idx);
  };

  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-card border border-line bg-surface p-4 shadow-card transition-all ${className}`}>
      {/* Top row: Title + Period selector */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12.5px] font-medium text-ink-2">{title}</span>
        {periods.length > 0 && (
          <SegmentedControl
            options={periods}
            value={period}
            onChange={setPeriod}
            className="[&>span]:px-2 [&>span]:text-[10.5px]"
          />
        )}
      </div>

      {/* Hero value + delta */}
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-[26px] font-semibold tracking-[-0.03em] tabular-nums text-ink">
          {hoverIndex !== null
            ? typeof activePoint.value === "number" && activePoint.value > 1000
              ? `$${activePoint.value.toLocaleString("en-US")}`
              : activePoint.value
            : value}
        </span>
        {delta != null && <Delta value={delta} />}
        {hint && hoverIndex === null && (
          <span className="text-[11px] text-ink-3 tabular-nums">{hint}</span>
        )}
        {hoverIndex !== null && (
          <span className="text-[11px] font-medium text-ink-3 tabular-nums">
            {activePoint.label}
          </span>
        )}
      </div>

      {/* Interactive stage */}
      <div
        className="relative mt-3 h-[116px] w-full cursor-crosshair select-none touch-none"
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {variant === "area" ? (
          <>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="size-full overflow-visible"
            >
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={series === "ink" ? 0.16 : 0.22} />
                  <stop offset="90%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Gradient Area Fill */}
              <path d={areaPath} fill={`url(#${gid})`} />

              {/* Stroke line */}
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Hover dot */}
              {hoverIndex !== null && pts[hoverIndex] && (
                <circle
                  cx={pts[hoverIndex][0]}
                  cy={pts[hoverIndex][1]}
                  r="4"
                  fill="var(--surface)"
                  stroke={color}
                  strokeWidth="2"
                  className="transition-all duration-75"
                />
              )}
            </svg>

            {/* Subtle vertical scrub indicator */}
            {hoverIndex !== null && (
              <div
                className="pointer-events-none absolute inset-y-0 w-px bg-line-strong transition-all duration-75"
                style={{ left: `${(hoverIndex / (points.length - 1)) * 100}%` }}
              />
            )}
          </>
        ) : (
          /* Bar chart variant with hover state & rounded track */
          <div className="flex h-full items-end gap-1.5 pt-2">
            {points.map((p, i) => {
              const isHovered = hoverIndex === i;
              const heightPct = Math.max(6, (p.value / max) * 100);
              return (
                <div
                  key={i}
                  className="group relative flex h-full flex-1 flex-col justify-end"
                >
                  {/* Track container */}
                  <div className="relative h-full w-full overflow-hidden rounded-[4px] bg-inset">
                    <div
                      className="absolute bottom-0 w-full rounded-[4px] transition-all duration-300"
                      style={{
                        height: `${heightPct}%`,
                        background: color,
                        opacity:
                          hoverIndex !== null
                            ? isHovered
                              ? 1
                              : 0.35
                            : series === "accent"
                              ? 0.4 + 0.6 * (p.value / max)
                              : 0.9,
                      }}
                    />
                  </div>
                  {/* Micro label */}
                  <span className="mt-1 truncate text-center text-[9.5px] font-medium text-ink-3 tabular-nums">
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
