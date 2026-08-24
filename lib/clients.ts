export type Strength = "strong" | "weak" | "veryweak" | "none";

export type RecordRow = {
  id: string;
  name: string;
  tags: string[];
  last: string;
  strength: Strength;
  website?: string;
};

export const CLIENT_TAG_COLORS: Record<string, { base: string }> = {
  Client: { base: "oklch(0.72 0.10 221)" },
  Partner: { base: "oklch(0.76 0.13 70)" },
  Delivery: { base: "oklch(0.70 0.13 162)" },
  Ads: { base: "oklch(0.71 0.16 48)" },
  Content: { base: "oklch(0.62 0.18 293)" },
  Live: { base: "oklch(0.77 0.16 122)" },
  Blocked: { base: "oklch(0.64 0.19 27)" },
  Paused: { base: "oklch(0.80 0.15 101)" },
  Drift: { base: "oklch(0.66 0.21 323)" },
  Finance: { base: "oklch(0.67 0.19 3)" },
};

/** Live HQ roster. Money and last-touch from `hq workspace` + board, 24 Aug 2026. */
export const CLIENT_ROWS: RecordRow[] = [
  { id: "calimero", name: "Calimero", tags: ["Client", "Delivery", "Content"], last: "today", strength: "strong", website: "calimero.com" },
  { id: "ohmybag", name: "OhMyBag (Panda&Cie)", tags: ["Client", "Ads", "Delivery"], last: "today", strength: "strong", website: "forge.alioze.com" },
  { id: "circle", name: "Circle Education", tags: ["Client", "Delivery"], last: "1 day ago", strength: "strong", website: "e.circlos.app" },
  { id: "mastercircle", name: "Circlos / MasterCircle", tags: ["Client", "Delivery", "Live"], last: "1 day ago", strength: "strong", website: "app.circlos.app" },
  { id: "valois", name: "Valois Vintage Paris", tags: ["Client", "Delivery"], last: "about 3 weeks ago", strength: "weak", website: "valoisvintage-paris.com" },
  { id: "ofc", name: "Old Fashioned Club", tags: ["Client", "Delivery", "Live"], last: "2 days ago", strength: "weak", website: "oldfashionedclub.com" },
  { id: "edouard", name: "Confluens (Alioze / Edouard)", tags: ["Partner", "Finance", "Ads"], last: "today", strength: "strong", website: "alioze.com" },
  { id: "sharjah", name: "Sharjah Airport", tags: ["Client", "Blocked", "Finance"], last: "about 3 weeks ago", strength: "veryweak" },
  { id: "aossi", name: "Aossi", tags: ["Client", "Live"], last: "over 1 month ago", strength: "veryweak", website: "aossi.scot" },
  { id: "trvder", name: "TRVDER", tags: ["Client", "Paused"], last: "No contact", strength: "none" },
  { id: "bluetunisia", name: "Bluetunisia", tags: ["Client", "Drift"], last: "No contact", strength: "none", website: "bluetunisia.com" },
];
