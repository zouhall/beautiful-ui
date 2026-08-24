/* ─────────────────────────────────────────────────────────
 * STUDIO THEME ENGINE
 * The design system is monochrome-first: the whole neutral
 * ramp is oklch triplets with fixed lightness steps, one hue
 * and tiny chromas. So a full theme — light AND dark — can be
 * regenerated from a handful of parameters:
 *
 *   hue      the neutral tint (blue-gray → warm → green-gray)
 *   tint     chroma multiplier (0 = pure graphite)
 *   accent + semantic colors
 *   radius   chip radius; control/card/window derive from it
 *   borders  hairline strength, flips direction per mode
 *   flat     ring-only shadows
 *
 * buildThemeCSS() emits a scoped override block the studio
 * injects as a <style> tag (inline styles can't switch with
 * .dark — generated CSS can). buildTokensExport() emits the
 * same theme as a paste-able :root/.dark block.
 * ───────────────────────────────────────────────────────── */

export type StudioTheme = {
  /** neutral hue, degrees 0–360 */
  hue: number;
  /** neutral chroma multiplier, 0–2 (1 = the shipped ramp) */
  tint: number;
  accent: string;
  green: string;
  orange: string;
  red: string;
  /** chip radius in px; control/card/window scale from it */
  radius: number;
  /** hairline strength, -1 (softer) … 1 (stronger) */
  borders: number;
  /** ring-only shadows */
  flat: boolean;
};

export const DEFAULT_STUDIO_THEME: StudioTheme = {
  hue: 258,
  tint: 1,
  accent: "#3b82f6",
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
  radius: 6,
  borders: 0,
  flat: false,
};

export const STUDIO_PRESETS: { name: string; theme: StudioTheme }[] = [
  { name: "Slate", theme: DEFAULT_STUDIO_THEME },
  {
    name: "Graphite",
    theme: { ...DEFAULT_STUDIO_THEME, tint: 0, accent: "#64748b" },
  },
  {
    name: "Warm",
    theme: { ...DEFAULT_STUDIO_THEME, hue: 55, accent: "#d97706" },
  },
  {
    name: "Forest",
    theme: { ...DEFAULT_STUDIO_THEME, hue: 155, accent: "#059669" },
  },
  {
    name: "Rose",
    theme: { ...DEFAULT_STUDIO_THEME, hue: 350, accent: "#e11d48" },
  },
  {
    name: "Ocean",
    theme: { ...DEFAULT_STUDIO_THEME, hue: 220, tint: 1.3, accent: "#0ea5e9" },
  },
];

/* Every neutral token, as [name, lightL, lightC, darkL, darkC].
 * Lightness steps are the design; hue and chroma are the theme. */
const NEUTRALS: [string, number, number, number, number][] = [
  ["--page", 0.985, 0.001, 0.209, 0.004],
  ["--canvas", 0.961, 0.002, 0.231, 0.004],
  ["--surface", 1, 0, 0.26, 0.006],
  ["--inset", 0.979, 0.002, 0.243, 0.004],
  ["--hover", 0.97, 0.002, 0.289, 0.006],
  ["--hover-2", 0.933, 0.003, 0.318, 0.007],
  ["--ink", 0.247, 0.006, 0.964, 0.002],
  ["--ink-2", 0.506, 0.01, 0.731, 0.008],
  ["--ink-3", 0.695, 0.009, 0.541, 0.01],
  ["--line", 0.946, 0.003, 0.308, 0.006],
  ["--line-strong", 0.912, 0.005, 0.356, 0.007],
  ["--field", 0.961, 0.001, 0.293, 0.006],
  ["--stripe-bg", 0.97, 0, 0.226, 0.004],
  ["--tooltip-bg", 0.272, 0.008, 0.182, 0.004],
  ["--tooltip-fg", 0.976, 0.002, 0.964, 0.002],
  ["--tooltip-muted", 0.731, 0.008, 0.731, 0.008],
  ["--tooltip-border", 0.356, 0.007, 0.308, 0.006],
];

const BORDER_VARS = new Set(["--line", "--line-strong", "--tooltip-border"]);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const l3 = (n: number) => Math.round(n * 1000) / 1000;
const c4 = (n: number) => Math.round(n * 10000) / 10000;

function neutralVars(t: StudioTheme, dark: boolean): string[] {
  return NEUTRALS.map(([name, lL, lC, dL, dC]) => {
    let l = dark ? dL : lL;
    const c = (dark ? dC : lC) * t.tint;
    if (BORDER_VARS.has(name)) {
      /* stronger borders = darker lines in light, lighter lines in dark */
      l = clamp01(l + (dark ? 1 : -1) * t.borders * 0.04);
    }
    return `  ${name}: oklch(${l3(l)} ${c4(c)} ${Math.round(t.hue)});`;
  });
}

function colorVars(t: StudioTheme, dark: boolean): string[] {
  /* tints: solid pastel mixes in light, alpha washes in dark */
  const tintPct = dark ? "16%" : "12%";
  const semPct = dark ? "16%" : "14%";
  const inkPct = dark ? "55%" : "72%";
  return [
    `  --accent: ${t.accent};`,
    `  --accent-ink: color-mix(in oklch, ${t.accent} ${inkPct}, var(--ink));`,
    `  --accent-tint: color-mix(in oklch, ${t.accent} ${tintPct}, transparent);`,
    `  --green: ${t.green};`,
    `  --green-tint: color-mix(in oklch, ${t.green} ${semPct}, transparent);`,
    `  --orange: ${t.orange};`,
    `  --orange-tint: color-mix(in oklch, ${t.orange} ${semPct}, transparent);`,
    `  --red: ${t.red};`,
    `  --red-tint: color-mix(in oklch, ${t.red} ${semPct}, transparent);`,
  ];
}

function radiusVars(t: StudioTheme): string[] {
  return [
    `  --radius-chip: ${t.radius}px;`,
    `  --radius-control: ${Math.round(t.radius * 1.35)}px;`,
    `  --radius-card: ${Math.round(t.radius * 1.75)}px;`,
    `  --radius-window: ${Math.round(t.radius * 2.4)}px;`,
  ];
}

const FLAT_SHADOWS = [
  "  --shadow-btn: 0 0 0 1px var(--line-strong);",
  "  --shadow-card: 0 0 0 1px var(--line);",
  "  --shadow-raised: 0 0 0 1px var(--line);",
  "  --shadow-overlay: 0 0 0 1px var(--line);",
];

function block(t: StudioTheme, dark: boolean): string {
  const lines = [...neutralVars(t, dark), ...colorVars(t, dark)];
  if (!dark) lines.push(...radiusVars(t));
  if (t.flat) lines.push(...FLAT_SHADOWS);
  return lines.join("\n");
}

/** Scoped override CSS for the studio wrapper — light and dark from one state.
 * `.bui-overlay` covers Base UI popups, which portal to document.body and
 * would otherwise escape the themed wrapper. */
export function buildThemeCSS(t: StudioTheme): string {
  return `.studio-theme, .bui-overlay {\n${block(t, false)}\n}\n.dark .studio-theme, .dark .bui-overlay {\n${block(t, true)}\n}`;
}

/** The same theme as a paste-able replacement for the token blocks in styles.css. */
export function buildTokensExport(t: StudioTheme): string {
  return `/* Beautiful UI theme — paste over the :root and .dark token blocks in styles.css */\n:root {\n${block(t, false)}\n}\n\n.dark {\n${block(t, true)}\n}`;
}
