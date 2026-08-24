import fs from "node:fs";
import path from "node:path";

const FILE = process.env.SECRETS_FILE || path.join(process.env.HOME || "/home/ubuntu", ".secrets/369.env");

export function loadEnvFile(file = FILE): Record<string, string> {
  if (!file || !fs.existsSync(file)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

export function withSecrets(env: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  return { ...env, ...loadEnvFile() };
}
