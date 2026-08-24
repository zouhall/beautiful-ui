export type ListedModel = {
  provider: string;
  id: string;
};

export type PickerModel = {
  key: string;
  name: string;
  tag: string;
  provider: string;
  id: string;
};

export function splitModelKey(key: string): { provider: string; id: string } {
  const i = String(key || "").indexOf("/");
  if (i < 0) return { provider: "", id: String(key || "") };
  return { provider: key.slice(0, i), id: key.slice(i + 1) };
}

export function parseListModels(text: string): ListedModel[] {
  const rows: ListedModel[] = [];
  for (const line of String(text || "").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("provider")) continue;
    const parts = t.split(/\s+/);
    if (parts.length < 2) continue;
    const provider = parts[0];
    const id = parts[1];
    if (!provider || !id) continue;
    rows.push({ provider, id });
  }
  return rows;
}

export function providerLabel(provider: string): string {
  if (provider === "openai-codex") return "Codex";
  if (provider === "xai") return "xAI";
  if (provider === "kimi-coding") return "Kimi";
  return provider;
}

export function toPickerModels(rows: ListedModel[], allow: string[]): PickerModel[] {
  const ok = new Set(allow);
  return rows
    .filter((r) => ok.has(r.provider))
    .map((r) => ({
      key: `${r.provider}/${r.id}`,
      name: r.id,
      tag: providerLabel(r.provider),
      provider: r.provider,
      id: r.id,
    }));
}

export const DEFAULT_MODEL_KEY = "openai-codex/gpt-5.6-sol";
export const DEFAULT_PROVIDERS = ["openai-codex", "xai", "kimi-coding"];
