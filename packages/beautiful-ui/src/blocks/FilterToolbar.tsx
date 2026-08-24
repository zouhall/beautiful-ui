"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../atoms/Popover";
import { Badge } from "../atoms/Badge";

/* ─────────────────────────────────────────────────────────
 * FilterToolbar — faceted filtering: one Filter button opens a
 * two-step popover (facet → its options), chosen filters become
 * removable chips. The devl.dev pattern on Beautiful UI tokens.
 * ───────────────────────────────────────────────────────── */

export type Facet = {
  key: string;
  label: string;
  options: string[];
};

export type ActiveFilter = {
  facet: string;
  facetLabel: string;
  value: string;
};

const DEFAULT_FACETS: Facet[] = [
  { key: "status", label: "Status", options: ["Done", "In progress", "Todo"] },
  { key: "owner", label: "Owner", options: ["Skander", "Turbo", "Ana"] },
  { key: "priority", label: "Priority", options: ["High", "Medium", "Low"] },
];

export function FilterToolbar({
  facets = DEFAULT_FACETS,
  filters,
  onChange,
  className = "",
}: {
  facets?: Facet[];
  filters?: ActiveFilter[];
  onChange?: (filters: ActiveFilter[]) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState<ActiveFilter[]>([]);
  const [facetView, setFacetView] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const active = filters ?? internal;

  const commit = (next: ActiveFilter[]) => {
    setInternal(next);
    onChange?.(next);
  };

  const choose = (facet: Facet, value: string) => {
    /* one value per facet — choosing replaces and dismisses */
    commit([...active.filter((f) => f.facet !== facet.key), { facet: facet.key, facetLabel: facet.label, value }]);
    setFacetView(null);
    setOpen(false);
  };

  const remove = (facetKey: string) => commit(active.filter((f) => f.facet !== facetKey));

  const view = facets.find((f) => f.key === facetView) ?? null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Popover
        open={open}
        onOpenChange={(o: boolean) => {
          setOpen(o);
          if (!o) setFacetView(null);
        }}
      >
        <PopoverTrigger className="flex h-8 items-center gap-1.5 rounded-control border border-dashed border-line-strong px-2.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:bg-hover hover:text-ink">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Filter
          {active.length > 0 && <Badge tone="accent">{active.length}</Badge>}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-52 p-1.5">
          {view === null ? (
            <>
              <p className="px-2 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.04em] text-ink-3">
                Filter by
              </p>
              {facets.map((f) => {
                const current = active.find((a) => a.facet === f.key);
                return (
                  <button
                    key={f.key}
                    onClick={() => setFacetView(f.key)}
                    className="flex w-full items-center justify-between rounded-chip px-2 py-1.5 text-left text-[12.5px] text-ink-2 transition-colors hover:bg-hover hover:text-ink"
                  >
                    <span>{f.label}</span>
                    <span className="flex items-center gap-1 text-ink-3">
                      {current && <span className="max-w-20 truncate text-[11.5px]">{current.value}</span>}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <button
                onClick={() => setFacetView(null)}
                className="flex w-full items-center gap-1.5 rounded-chip px-2 py-1.5 text-left text-[11.5px] font-medium text-ink-3 transition-colors hover:bg-hover hover:text-ink"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                  <path d="m15 6-6 6 6 6" />
                </svg>
                {view.label}
              </button>
              <div className="my-1 h-px bg-line" />
              {view.options.map((opt) => {
                const selected = active.some((a) => a.facet === view.key && a.value === opt);
                return (
                  <button
                    key={opt}
                    onClick={() => choose(view, opt)}
                    className={`flex w-full items-center justify-between rounded-chip px-2 py-1.5 text-left text-[12.5px] transition-colors hover:bg-hover hover:text-ink ${
                      selected ? "font-medium text-ink" : "text-ink-2"
                    }`}
                  >
                    {opt}
                    {selected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent-ink" aria-hidden>
                        <path d="m4 12 5 5L20 6" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </PopoverContent>
      </Popover>

      {active.map((f) => (
        <span
          key={f.facet}
          className="flex h-8 items-center gap-1.5 rounded-control border border-line bg-surface px-2 text-[12.5px] text-ink-2 shadow-hairline"
        >
          <span className="text-ink-3">{f.facetLabel}:</span>
          <span className="font-medium text-ink">{f.value}</span>
          <button
            onClick={() => remove(f.facet)}
            aria-label={`Remove ${f.facetLabel} filter`}
            className="ml-0.5 flex size-4 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-hover-2 hover:text-ink"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}

      {active.length > 1 && (
        <button
          onClick={() => commit([])}
          className="text-[12px] text-ink-3 transition-colors hover:text-ink"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
