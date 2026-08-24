"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CATEGORY_ORDER, PLAYGROUND, type Playable } from "@/lib/playground";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { Switch } from "@/components/atoms/Switch";

/* ─────────────────────────────────────────────────────────
 * THEME STUDIO
 * Live-rewrites the design tokens on the wrapper so every
 * component underneath re-themes in place.
 * ───────────────────────────────────────────────────────── */

type ThemeState = {
  accent: string;
  green: string;
  orange: string;
  red: string;
  radius: number;
};

const DEFAULT_THEME: ThemeState = {
  accent: "#3b82f6",
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
  radius: 6,
};

const PRESETS: { name: string; accent: string }[] = [
  { name: "Indigo", accent: "#6366f1" },
  { name: "Blue", accent: "#3b82f6" },
  { name: "Violet", accent: "#8b5cf6" },
  { name: "Emerald", accent: "#059669" },
  { name: "Teal", accent: "#0d9488" },
  { name: "Rose", accent: "#e11d48" },
  { name: "Amber", accent: "#d97706" },
  { name: "Slate", accent: "#64748b" },
];

const mix = (c: string, pct: string, to: string) => `color-mix(in oklch, ${c} ${pct}, ${to})`;

function themeVars(t: ThemeState): CSSProperties {
  return {
    "--accent": t.accent,
    "--accent-ink": mix(t.accent, "72%", "var(--ink)"),
    "--accent-tint": mix(t.accent, "12%", "transparent"),
    "--green": t.green,
    "--green-tint": mix(t.green, "14%", "transparent"),
    "--orange": t.orange,
    "--orange-tint": mix(t.orange, "14%", "transparent"),
    "--red": t.red,
    "--red-tint": mix(t.red, "14%", "transparent"),
    "--radius-chip": `${t.radius}px`,
    "--radius-control": `${Math.round(t.radius * 1.35)}px`,
    "--radius-card": `${Math.round(t.radius * 1.75)}px`,
    "--radius-window": `${Math.round(t.radius * 2.4)}px`,
  } as CSSProperties;
}

/* ── props controls ───────────────────────────────────── */

function ControlRow({
  control,
  value,
  set,
}: {
  control: NonNullable<Playable["controls"]>[number];
  value: any;
  set: (v: any) => void;
}) {
  if (control.type === "select") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ink-3">
          {control.label}
        </span>
        <SegmentedControl
          options={control.options.map((o) => o.value)}
          value={value}
          onChange={(v) => set(v)}
          className="w-full [&>span]:text-[11.5px]"
        />
      </label>
    );
  }
  if (control.type === "switch") {
    return (
      <label className="flex items-center justify-between">
        <span className="text-[12.5px] text-ink-2">{control.label}</span>
        <Switch checked={!!value} onChange={set} label={control.label} />
      </label>
    );
  }
  if (control.type === "slider") {
    return (
      <label className="block">
        <span className="mb-1.5 flex items-center justify-between">
          <span className="text-[12.5px] text-ink-2">{control.label}</span>
          <span className="font-mono text-[11.5px] tabular-nums text-ink-3">
            {value}
            {control.suffix ?? ""}
          </span>
        </span>
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
          className="pg-range w-full"
        />
      </label>
    );
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ink-3">
        {control.label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-control border border-line bg-field px-2.5 py-1.5 text-[12.5px] text-ink outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

function PropsPanel({
  playable,
  values,
  setValue,
  codeOpen,
  source,
  setCodeOpen,
}: {
  playable: Playable;
  values: Record<string, any>;
  setValue: (k: string, v: any) => void;
  codeOpen: boolean;
  source: string;
  setCodeOpen: (v: boolean) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ink-3">Props</h3>
        <button
          onClick={() => setCodeOpen(!codeOpen)}
          className={`rounded-[6px] px-2 py-1 text-[11.5px] transition-colors ${
            codeOpen ? "bg-accent-tint text-accent-ink" : "text-ink-3 hover:bg-hover hover:text-ink-2"
          }`}
        >
          {codeOpen ? "Hide code" : "View code"}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {playable.controls?.length ? (
          <div className="flex flex-col gap-4">
            {playable.controls.map((c) => (
              <ControlRow
                key={c.key}
                control={c}
                value={values[c.key]}
                set={(v) => setValue(c.key, v)}
              />
            ))}
          </div>
        ) : (
          <p className="text-[12.5px] leading-relaxed text-ink-3">
            {playable.note ??
              "This component is self-contained. Tweak the theme in the Studio to re-skin it, or hit View code to grab the source."}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── code overlay ─────────────────────────────────────── */

function CodeView({ source, onClose }: { source: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-window bg-surface shadow-overlay">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="font-mono text-[12px] text-ink-2">component.tsx</span>
          <button
            onClick={onClose}
            className="rounded-[6px] px-2 py-1 text-[12px] text-ink-3 transition-colors hover:bg-hover hover:text-ink-2"
          >
            Esc
          </button>
        </div>
        <pre className="flex-1 overflow-auto bg-inset p-4 font-mono text-[12px] leading-relaxed text-ink-2">
          {source || "// source not found — check the package path"}
        </pre>
      </div>
    </div>
  );
}

/* ── studio drawer ────────────────────────────────────── */

function Studio({
  open,
  theme,
  setTheme,
  onClose,
}: {
  open: boolean;
  theme: ThemeState;
  setTheme: (t: ThemeState) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const ColorField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <label className="flex items-center gap-2.5">
      <span
        className="relative size-6 shrink-0 cursor-pointer overflow-hidden rounded-[7px] ring-1 ring-line"
        style={{ background: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </span>
      <span className="flex-1 text-[12.5px] text-ink-2">{label}</span>
      <span className="font-mono text-[11px] uppercase text-ink-3">{value}</span>
    </label>
  );
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col border-l border-line bg-surface shadow-overlay">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <span className="flex size-5 items-center justify-center rounded-[5px] bg-accent text-[11px] font-bold text-white">T</span>
            Theme studio
          </h2>
          <button
            onClick={onClose}
            className="rounded-[6px] px-2 py-1 text-[12px] text-ink-3 transition-colors hover:bg-hover hover:text-ink-2"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* presets */}
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-3">Accent presets</h3>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setTheme({ ...theme, accent: p.accent })}
                  title={p.name}
                  className={`flex h-7 items-center gap-1.5 rounded-full px-2 text-[11px] transition-all ${
                    theme.accent === p.accent
                      ? "bg-ink text-surface"
                      : "bg-hover text-ink-2 hover:bg-hover-2"
                  }`}
                >
                  <span className="size-3 rounded-full ring-1 ring-black/10" style={{ background: p.accent }} />
                  {p.name}
                </button>
              ))}
            </div>
          </section>

          {/* colors */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ink-3">Semantic colors</h3>
            <ColorField label="Accent" value={theme.accent} onChange={(v) => setTheme({ ...theme, accent: v })} />
            <ColorField label="Success" value={theme.green} onChange={(v) => setTheme({ ...theme, green: v })} />
            <ColorField label="Warning" value={theme.orange} onChange={(v) => setTheme({ ...theme, orange: v })} />
            <ColorField label="Danger" value={theme.red} onChange={(v) => setTheme({ ...theme, red: v })} />
          </section>

          {/* radius */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ink-3">Radius</h3>
              <span className="font-mono text-[11px] tabular-nums text-ink-3">{theme.radius}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={24}
              step={1}
              value={theme.radius}
              onChange={(e) => setTheme({ ...theme, radius: Number(e.target.value) })}
              className="pg-range w-full"
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-3">
              <span>Sharp</span>
              <span>Rounded</span>
            </div>
          </section>

          <button
            onClick={() => setTheme(DEFAULT_THEME)}
            className="w-full rounded-control border border-line py-2 text-[12.5px] font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink"
          >
            Reset tokens
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── main playground ──────────────────────────────────── */

function DemoSurface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function Playground({ sources }: { sources: Record<string, string> }) {
  const [mode, setMode] = useState<"grid" | "focus">("focus");
  const [selected, setSelected] = useState<string>(PLAYGROUND[0].id);
  const [theme, setTheme] = useState<ThemeState>(DEFAULT_THEME);
  const [studioOpen, setStudioOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [values, setValues] = useState<Record<string, Record<string, any>>>({});

  const playable = useMemo(
    () => PLAYGROUND.find((p) => p.id === selected) ?? PLAYGROUND[0],
    [selected],
  );

  const setValue = (k: string, v: any) =>
    setValues((prev) => ({ ...prev, [selected]: { ...(prev[selected] ?? {}), [k]: v } }));

  const current = {
    ...(playable.defaults ?? {}),
    ...(values[selected] ?? {}),
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PLAYGROUND;
    return PLAYGROUND.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.caption?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [query]);

  const cssVars = useMemo(() => themeVars(theme), [theme]);

  const focusItem = (id: string) => {
    setSelected(id);
    setMode("focus");
    setCodeOpen(false);
  };

  const sourceOf = (p: Playable) =>
    sources[p.file ?? p.title.replace(" ", "")] ?? "";

  return (
    <div className="min-h-screen bg-canvas text-ink" style={cssVars as CSSProperties}>
      <style>{`
        .pg-range{-webkit-appearance:none;appearance:none;height:4px;border-radius:999px;
          background:var(--line);outline:none;cursor:pointer}
        .pg-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;
          border-radius:999px;background:var(--accent);border:2px solid var(--surface);
          box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .15s ease}
        .pg-range::-webkit-slider-thumb:hover{transform:scale(1.15)}
        .pg-range::-moz-range-thumb{width:14px;height:14px;border-radius:999px;background:var(--accent);
          border:2px solid var(--surface);box-shadow:0 1px 3px rgba(0,0,0,.25)}
      `}</style>

      {/* header */}
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <a href="/" className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-[7px] bg-ink text-[11px] font-bold text-surface">
              B
            </span>
            <span className="text-[13px] font-semibold tracking-tight">Studio</span>
          </a>

          <div className="ml-2 hidden sm:block">
            <SegmentedControl
              options={["Focus", "Grid"]}
              value={mode === "grid" ? "Grid" : "Focus"}
              onChange={(v) => setMode(v === "Grid" ? "grid" : "focus")}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden font-mono text-[11px] text-ink-3 md:block">{playable.title}</span>
            <button
              onClick={() => setStudioOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-medium text-white shadow-btn transition-transform active:scale-[0.97]"
            >
              <span className="size-3 rounded-full bg-white/40" style={{ background: "transparent" }} />
              <span className="size-3 rounded-full ring-1 ring-white/60" style={{ background: theme.accent }} />
              Theme
            </button>
          </div>
        </div>
        {/* mobile mode toggle */}
        <div className="flex justify-center pb-2 sm:hidden">
          <SegmentedControl
            options={["Focus", "Grid"]}
            value={mode === "grid" ? "Grid" : "Focus"}
            onChange={(v) => setMode(v === "Grid" ? "grid" : "focus")}
          />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-line lg:block">
          <div className="p-3">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search components…"
                className="w-full rounded-control border border-line bg-field py-1.5 pl-8 pr-3 text-[12.5px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
              />
            </div>
          </div>
          <nav className="px-2 pb-6">
            {CATEGORY_ORDER.map((cat) => {
              const items = filtered.filter((p) => p.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="mb-4">
                  <p className="mb-1 px-2 text-[10.5px] font-semibold uppercase tracking-widest text-ink-3">
                    {cat}
                  </p>
                  {items.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => focusItem(p.id)}
                      className={`flex w-full items-center justify-between rounded-[7px] px-2 py-[5px] text-left text-[12.5px] transition-colors ${
                        selected === p.id
                          ? "bg-accent-tint font-medium text-accent-ink"
                          : "text-ink-2 hover:bg-hover hover:text-ink"
                      }`}
                    >
                      <span className="truncate">{p.title}</span>
                      {p.controls?.length ? (
                        <span className="ml-2 shrink-0 rounded-full bg-inset px-1.5 text-[10px] font-medium text-ink-3">
                          {p.controls.length}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              );
            })}
            {!filtered.length && (
              <p className="px-2 py-6 text-center text-[12px] text-ink-3">No matches</p>
            )}
          </nav>
        </aside>

        {/* main */}
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {mode === "grid" ? (
            <GridMode items={filtered} onFocus={focusItem} />
          ) : (
            <FocusMode
              playable={playable}
              current={current}
              setValue={setValue}
              codeOpen={codeOpen}
              setCodeOpen={setCodeOpen}
              source={sourceOf(playable)}
            />
          )}
        </main>
      </div>

      {/* mobile sidebar */}
      {mode === "focus" && (
        <div className="lg:hidden">
          <div className="mx-4 mb-2 flex gap-1.5 overflow-x-auto pb-1">
            {PLAYGROUND.map((p) => (
              <button
                key={p.id}
                onClick={() => focusItem(p.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-[12px] transition-colors ${
                  selected === p.id
                    ? "bg-ink font-medium text-surface"
                    : "bg-hover text-ink-2 hover:text-ink"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <Studio open={studioOpen} theme={theme} setTheme={setTheme} onClose={() => setStudioOpen(false)} />
      {codeOpen && <CodeView source={sourceOf(playable)} onClose={() => setCodeOpen(false)} />}
    </div>
  );
}

/* ── grid: everything at once ─────────────────────────── */

function GridMode({ items, onFocus }: { items: Playable[]; onFocus: (id: string) => void }) {
  return (
    <div className="space-y-8">
      {CATEGORY_ORDER.map((cat) => {
        const group = items.filter((p) => p.category === cat);
        if (!group.length) return null;
        return (
          <section key={cat}>
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-ink-3">
              {cat}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-hairline transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <DemoSurface className="min-h-[180px] border-b border-line bg-canvas p-6">
                    {p.demo({ ...(p.defaults ?? {}) }, () => {})}
                  </DemoSurface>
                  <button
                    onClick={() => onFocus(p.id)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-left"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-ink">{p.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-[11.5px] text-ink-3">{p.caption}</p>
                    </div>
                    <span className="text-[12px] text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-ink">
                      →
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ── focus: one component + props ─────────────────────── */

function FocusMode({
  playable,
  current,
  setValue,
  codeOpen,
  setCodeOpen,
  source,
}: {
  playable: Playable;
  current: Record<string, any>;
  setValue: (k: string, v: any) => void;
  codeOpen: boolean;
  setCodeOpen: (v: boolean) => void;
  source: string;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
      {/* canvas */}
      <div className="flex min-w-0 flex-col overflow-hidden rounded-card border border-line bg-surface shadow-hairline">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">{playable.title}</h2>
            {playable.caption && (
              <p className="mt-0.5 text-[12px] text-ink-3">{playable.caption}</p>
            )}
          </div>
        </div>
        <DemoSurface className="min-h-[420px] flex-1 bg-canvas p-8 sm:p-12">
          {playable.demo(current, setValue)}
        </DemoSurface>
      </div>

      {/* props */}
      <div className="h-fit overflow-hidden rounded-card border border-line bg-surface shadow-hairline xl:sticky xl:top-[68px] xl:h-[calc(100vh-96px)]">
        <PropsPanel
          playable={playable}
          values={current}
          setValue={setValue}
          codeOpen={codeOpen}
          source={source}
          setCodeOpen={setCodeOpen}
        />
      </div>
    </div>
  );
}
