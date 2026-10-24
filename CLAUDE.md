# CLAUDE.md

Home Assistant Lovelace card for Better Thermostat. See README.md for usage, BT mapping and layout.

## Rules

- **No AI attribution anywhere.** No `Co-Authored-By: Claude`, no "Generated with Claude Code", in commits, PRs, issues, or release notes.
- **Bun only** (`bun install`, `bun run …`, `bun test`). No npm/pnpm/yarn, no package-lock.json.
- Keep it minimal: runtime deps are `lit` only. Don't add build tools (Vite etc.); `build.ts` uses `Bun.build`.

## Workflow

- `bun run check` (typecheck + tests + build) must pass before committing.
- Entity → UI and UI → service-call logic lives in `src/model.ts`, pure and covered by `test/model.test.ts`. Put behaviour there, not in the element.
- Verify Better Thermostat behaviour against its source (github.com/KartoffelToby/better_thermostat, `climate.py`) rather than guessing.
- Visual checks: `bun run dev` serves `dev/index.html` (mock hass with all design states + a simulated BT).

## Build & release

- Local builds go to `build/` (gitignored). `bun run build` sets `NODE_ENV=production`; without it Bun bundles Lit's dev mode.
- `dist/ambient-thermostat-card.js` is written **only** by the Release workflow (Actions → Release → version input). Never commit `dist/` by hand.
- Releases have **no attached assets** on purpose: HACS ≤ 2.0.5 can't download release assets (hacs/integration#5643), so HACS installs from `dist/` in the tagged commit. Revisit once HACS ships a fix.
