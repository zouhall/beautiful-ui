"use client";

import { Liveline, type LivelinePoint, type LivelineSeries } from "liveline";
import { useEffect, useMemo, useState } from "react";
import { SegmentedControl } from "../atoms/SegmentedControl";
import { Delta } from "../atoms/Delta";

/* ─────────────────────────────────────────────────────────
 * InsightChartCard — Liveline-powered precision analytics card
 * directly matching Beautiful UI's InsightCards aesthetic:
 *  - Real-time Catmull-Rom interpolation
 *  - Multi-series support with colored badge pills
 *  - Floating black cursor pill with exact values and glowing color dots
 *  - Dotted threshold guide lines
 *  - Full token alignment with light/dark synchronization
 * ───────────────────────────────────────────────────────── */

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

function chartIndexFromPointer(event: React.PointerEvent<HTMLDivElement>, pointCount: number) {
  const rect = event.currentTarget.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  return Math.round(progress * (pointCount - 1));
}

function smooth(values: number[], perSegment = 8): number[] {
  if (values.length < 3) return values.slice();
  const out: number[] = [];
  const n = values.length;
  for (let i = 0; i < n - 1; i += 1) {
    const p0 = values[Math.max(0, i - 1)];
    const p1 = values[i];
    const p2 = values[i + 1];
    const p3 = values[Math.min(n - 1, i + 2)];
    for (let s = 0; s < perSegment; s += 1) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push(
        0.5 *
          (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      );
    }
  }
  out.push(values[n - 1]);
  return out;
}

function makePoints(values: number[], gap = 6): LivelinePoint[] {
  const end = Math.floor(Date.now() / 1000);
  return values.map((value, index) => ({
    time: end - (values.length - 1 - index) * gap,
    value,
  }));
}

export type SeriesDef = {
  id: string;
  name: string;
  color: string;
  data: number[];
  formatValue?: (v: number) => string;
};

export function InsightChartCard({
  title,
  seriesList,
  periods = ["6M", "YTD", "1Y"],
  badgeLabel = "Live stream",
  className = "",
}: {
  title: string;
  seriesList: SeriesDef[];
  periods?: string[];
  badgeLabel?: string;
  className?: string;
}) {
  const dark = useDarkMode();
  const [period, setPeriod] = useState(periods[0]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Smooth points for each series
  const denseData = useMemo(() => {
    return seriesList.map((s) => {
      const smoothed = smooth(s.data, 7);
      return {
        ...s,
        points: makePoints(smoothed, 42 / Math.max(smoothed.length - 1, 1)),
      };
    });
  }, [seriesList]);

  const pointCount = denseData[0]?.points.length ?? 0;

  const livelineSeries: LivelineSeries[] = useMemo(() => {
    return denseData.map((s) => ({
      id: s.id,
      label: "",
      data: s.points,
      value: s.points.at(-1)?.value ?? 0,
      color: s.color,
    }));
  }, [denseData]);

  return (
    <div className={`flex flex-col justify-between rounded-card border border-line bg-surface p-4 shadow-card ${className}`}>
      {/* Header: Title + Series Legend + Period Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[12.5px] font-medium text-ink-2">{title}</span>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {denseData.map((s) => {
              const activeVal =
                hoverIndex !== null
                  ? s.points[hoverIndex]?.value ?? s.data.at(-1)!
                  : s.data.at(-1)!;
              const formatted = s.formatValue
                ? s.formatValue(activeVal)
                : `$${Math.round(activeVal).toLocaleString("en-US")}`;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[11.5px] text-ink-3">{s.name}</span>
                  <span className="text-[17px] font-semibold tracking-[-0.02em] tabular-nums text-ink">
                    {formatted}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {badgeLabel && (
            <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10.5px] font-medium text-accent-ink">
              {badgeLabel}
            </span>
          )}
          {periods.length > 0 && (
            <SegmentedControl
              options={periods}
              value={period}
              onChange={setPeriod}
              className="[&>span]:px-2.5 [&>span]:text-[10.5px]"
            />
          )}
        </div>
      </div>

      {/* Chart Canvas Stage */}
      <div className="mt-3 overflow-hidden rounded-control bg-inset border border-line/60">
        <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
          <span className="text-[11px] font-medium text-ink-3 tabular-nums">
            {hoverIndex !== null ? "Inspecting point" : "Trend trajectory"}
          </span>
          <span className="text-[10.5px] font-mono text-ink-3 tabular-nums">
            Catmull-Rom
          </span>
        </div>

        <div
          className="insight-chart-stage relative h-[180px] w-full cursor-crosshair select-none touch-none"
          onPointerDown={(e) => setHoverIndex(chartIndexFromPointer(e, pointCount))}
          onPointerMove={(e) => setHoverIndex(chartIndexFromPointer(e, pointCount))}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerCancel={() => setHoverIndex(null)}
          onPointerUp={() => setHoverIndex(null)}
        >
          <Liveline
            data={[]}
            value={0}
            series={livelineSeries}
            theme={dark ? "dark" : "light"}
            grid={false}
            pulse={false}
            window={42}
            paused
            scrub={false}
            cursor="default"
            lineWidth={2.25}
            padding={{ top: 38, right: 12, bottom: 24, left: 12 }}
          />

          {hoverIndex !== null && pointCount > 0 && (
            <>
              <span
                className="insight-chart-cursor"
                style={{ left: `${(hoverIndex / (pointCount - 1)) * 100}%` }}
              />
              <span
                className="insight-chart-tooltip-anchor"
                style={{
                  left: `${Math.min(Math.max((hoverIndex / (pointCount - 1)) * 100, 22), 78)}%`,
                }}
              >
                <div className="insight-chart-tooltip">
                  {denseData.map((s) => {
                    const pVal = s.points[hoverIndex]?.value ?? 0;
                    const formatted = s.formatValue
                      ? s.formatValue(pVal)
                      : `$${Math.round(pVal).toLocaleString("en-US")}`;
                    return (
                      <span key={s.id} className="insight-chart-tooltip-item">
                        <span
                          className="insight-chart-tooltip-dot"
                          style={{ background: s.color }}
                        />
                        {formatted}
                      </span>
                    );
                  })}
                </div>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
