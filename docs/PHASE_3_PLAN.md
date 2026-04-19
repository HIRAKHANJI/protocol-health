# Phase 3 Plan — Plan Extraction to ES Modules

**APP_VERSION:** 5.2.0 → **5.3.0**
**CACHE_NAME:** v15 → **v16**
**Banner:** `'Under the hood: plan definitions now load as separate files. No behavior change.'`
**Branch:** `claude/refactor-v6`

## Verified line ranges in current app.html

| Block | Start | End | Size |
|-------|-------|-----|------|
| `const PLANS = {` (opening) | L2278 | — | — |
| `default: {` (lite content) | L2283 | L2548 (`},`) | 266 lines |
| `agro: {` | L2553 | L3132 (`}`) | 580 lines |
| `};` (closes PLANS) | L3134 | — | — |
| `PLANS.cut = {` | L3139 | L3385 (`};`) | 247 lines |
| `PLANS.bulk = {` | L3390 | L3661 (`};`) | 272 lines |
| `PLANS.maintenance = {` | L3666 | L3916 (`};`) | 251 lines |
| `const EXERCISE_PROGRESSIONS = {` | L3920 | L4027 (`};`) | 108 lines |

**Total lines to extract:** ~1724 lines.

## Target files

```
plans/
├── index.js                   (assembler; maps default→lite)
├── lite.js                    (content from default: block)
├── agro.js                    (content from agro: block)
├── cut.js                     (content from PLANS.cut = {} body)
├── bulk.js                    (content from PLANS.bulk = {} body)
├── maintenance.js             (content from PLANS.maintenance = {} body)
└── exercise-progressions.js   (content from EXERCISE_PROGRESSIONS)
```

**Historical key:** `plan: 'default'` in saved settings still resolves to LITE PROTOCOL via `PLANS.default = lite` in `index.js`. Backward-compatible.

## Extraction strategy (byte-fidelity)

For each plan, extract source lines verbatim (preserving existing indentation — cosmetic 4-space inside `export const X = { ... }` is acceptable; semantic identity is what matters). Wrap with `export const <name> = {` + raw content lines + `};`.

**Verification method (runtime-equivalent to devtools serialize-diff):**

After extraction, load each module in Node and check deep-equal vs the original app.html's parsed PLANS. For this to work I need to evaluate both. Simpler: do a structural text-diff — extract source lines from app.html and the content block from each new plan file (excluding the export-wrapper lines), diff them. If the diff is empty, the plan is byte-identical.

I'll perform this verification after each extraction. Plan extraction fails if diff is non-empty.

**Baseline step deferred:** the prompt's Step 3 devtools snapshots require running commands in the live app, which I can't do. Owner runs them post-deploy. I compensate via per-plan text-diff against the source.

## Interop pattern

New `<script type="module">` loader (after the existing migrations loader), sets `window.PLANS`, `window.EXERCISE_PROGRESSIONS`, dispatches `ph:plans-ready`. `runInit()` gains a new await gate for plans-ready (after migrations-ready, before idbAutoRestore).

## sw.js

Cache bump → v16. Append the 7 new `plans/*.js` paths to the critical cache list.

## Risks

1. **Copy-paste fidelity** — mitigated by per-plan text-diff before deleting source lines
2. **Method shorthand** — `workoutContent() { ... }` is extracted verbatim; no conversion
3. **Template literals** — backticks and `${}` preserved byte-for-byte
4. **Escaped unicode (≥, •, —)** — preserved byte-for-byte
5. **`default` key** — mapped explicitly in `index.js` as `default: lite`
6. **Module async** — runInit awaits plans-ready

## Commit sequence

```
[commit 1] refactor(plans): extract 5 plans + EXERCISE_PROGRESSIONS to plans/ modules
           plans/{lite,agro,cut,bulk,maintenance,exercise-progressions,index}.js

[commit 2] refactor(plans): wire plans/ bootstrap; remove inline PLANS; bump to 5.3.0 and CACHE v16
           app.html (module loader + await gate + deleted ~1724 inline lines + APP_VERSION bump)
           sw.js (CACHE_NAME v16 + 7 new paths)
           index.html (hero-badge v5.3.0)

[commit 3] docs: v5.3.0 plan extraction notes
           UPDATE_LOG.md + CLAUDE.md
```
