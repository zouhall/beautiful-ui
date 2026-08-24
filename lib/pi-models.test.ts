import { test } from "node:test";
import assert from "node:assert/strict";
import { parseListModels, splitModelKey, toPickerModels } from "./pi-models.ts";

const SAMPLE = `provider      model                        context  max-out  thinking  images
cursor        claude-4-sonnet              200K     64K      yes       no
openai-codex  gpt-5.6-sol                  272K     128K     yes       yes
openai-codex  gpt-5.6-luna                 272K     128K     yes       yes
xai           grok-4.6                     500K     500K     yes       yes
kimi-coding   k3                           1.0M     131.1K   yes       yes
ox            stealth/ox-alpha             128K     8K       no        no
`;

test("parseListModels reads provider and id, including slashes in id", () => {
  const rows = parseListModels(SAMPLE);
  assert.deepEqual(
    rows.map((r) => `${r.provider}/${r.id}`),
    [
      "cursor/claude-4-sonnet",
      "openai-codex/gpt-5.6-sol",
      "openai-codex/gpt-5.6-luna",
      "xai/grok-4.6",
      "kimi-coding/k3",
      "ox/stealth/ox-alpha",
    ],
  );
});

test("toPickerModels keeps allowlisted providers and builds keys", () => {
  const models = toPickerModels(parseListModels(SAMPLE), ["openai-codex", "xai", "kimi-coding"]);
  assert.equal(models.some((m) => m.key === "cursor/claude-4-sonnet"), false);
  const sol = models.find((m) => m.key === "openai-codex/gpt-5.6-sol");
  assert.ok(sol);
  assert.equal(sol?.name, "gpt-5.6-sol");
  assert.equal(sol?.tag, "Codex");
  assert.equal(sol?.provider, "openai-codex");
  assert.equal(sol?.id, "gpt-5.6-sol");
});

test("splitModelKey splits only on the first slash", () => {
  assert.deepEqual(splitModelKey("ox/stealth/ox-alpha"), { provider: "ox", id: "stealth/ox-alpha" });
  assert.deepEqual(splitModelKey("k3"), { provider: "", id: "k3" });
});
