/**
 * Bundles the card into a single file: build/ambient-thermostat-card.js
 * Run via `bun run build`, which sets NODE_ENV=production; otherwise Bun
 * resolves Lit's `development` export condition and ships Lit's dev mode.
 */
import pkg from "./package.json";

if (process.env.NODE_ENV !== "production") {
  console.error("Run `bun run build` (needs NODE_ENV=production).");
  process.exit(1);
}

const result = await Bun.build({
  entrypoints: ["src/ambient-thermostat-card.ts"],
  outdir: "build",
  target: "browser",
  format: "esm",
  minify: true,
  sourcemap: "none",
  define: { __VERSION__: JSON.stringify(pkg.version) },
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
for (const output of result.outputs) {
  console.log(`${output.path}  ${(output.size / 1024).toFixed(1)} KB`);
}
