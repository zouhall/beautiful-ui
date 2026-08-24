import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Playground } from "@/components/site/Playground";

export const metadata: Metadata = {
  title: "Studio — Beautiful UI playground",
  description:
    "A live component studio — browse every primitive, tweak props, and re-theme the accent, semantic colors and radius in real time.",
};

/* Component sources are read at build time so the props panel can offer a
 * copy-paste-able file, same as the gallery. Keyed by filename stem. */
function readSources(): Record<string, string> {
  const dir = path.join(process.cwd(), "packages", "beautiful-ui", "src");
  const map: Record<string, string> = {};
  for (const sub of ["primitives", "atoms"]) {
    const subDir = path.join(dir, sub);
    let files: string[] = [];
    try {
      files = fs.readdirSync(subDir).filter((f) => f.endsWith(".tsx"));
    } catch {}
    for (const f of files) {
      map[path.basename(f, ".tsx")] = fs.readFileSync(path.join(subDir, f), "utf8");
    }
  }
  return map;
}

export default function PlaygroundPage() {
  const sources = readSources();
  return <Playground sources={sources} />;
}
