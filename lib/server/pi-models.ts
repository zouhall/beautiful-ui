import { execFileSync } from "node:child_process";
import { DEFAULT_PROVIDERS, parseListModels, toPickerModels, type PickerModel } from "../pi-models";

const PI_BIN = process.env.PI_BIN || "/home/ubuntu/.local/bin/pi";

export function listPickerModels(): PickerModel[] {
  const allow = String(process.env.PI_MODEL_PROVIDERS || DEFAULT_PROVIDERS.join(","))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let text = "";
  try {
    text = execFileSync(PI_BIN, ["--list-models"], {
      encoding: "utf8",
      timeout: 8000,
      env: { ...process.env, PI_OFFLINE: "1" },
    });
  } catch (e) {
    const err = e as { stdout?: string };
    text = String(err.stdout || "");
  }
  return toPickerModels(parseListModels(text), allow);
}
