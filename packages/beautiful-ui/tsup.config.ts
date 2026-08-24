import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  // Keep React and the UI deps as external so they resolve from the
  // consumer's node_modules instead of being inlined into the bundle.
  external: [
    "react",
    "react-dom",
    "glimm",
    "liveline",
    "iconoir-react",
    "posthog-js",
    "@central-icons-react/round-outlined-radius-2-stroke-2",
  ],
});
