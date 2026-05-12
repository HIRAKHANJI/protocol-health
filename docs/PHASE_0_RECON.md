# Phase 0 — Refactor Recon Report

> **📜 HISTORICAL — refactor completed in v6.0.0 (2026-04-21).** This is the pre-refactor reconnaissance report. All line-count, storage-key, and extraction-target observations describe the v5.0.1 codebase, not current state. Retained for audit trail. See `docs/REFACTOR_COMPLETE.md` for the post-execution retrospective.

**Date:** 2026-04-19
**App version at recon:** 5.0.1
**Current CACHE_NAME:** `protocol-health-v13`
**Branch:** `claude/refactor-v6` (cut from `main` at commit `9565d67`)
**Total app.html line count:** 8572

---

## 1. app.html structure

All ranges verified against the current file. The rough landmark-based split below is approximate but accurate to the section a line number falls into.

| Section | Approximate line range | Approximate size |
|---------|-----------------------|------------------|
| HTML head | 1-17 | ~17 |
| Main CSS | 18-559 | ~542 |
| HTML body | 560-1240 | ~681 |
| Main inline script (opens `<script>` ~L1241) | 1241-~8200 | ~6960 |
| Dialogs and trailing extras | ~8200-8572 | ~370 |
| **Total** | — | **8572** |

Note: the "Main script" and "Dialogs/extras" boundary is softer than the prompt's template suggested — the inline `<script>` section effectively continues to near end of file, with some trailing non-script markup. The script-length reality is ~6960 lines, consistent with the refactor goal of breaking it up.

---

## 2. Storage keys (`SK` object, L1358-1372)

Verified canonical list:

| Key | Value | Stored shape |
|-----|-------|--------------|
| `SK.checklist` | `ph_ck_v1` | Legacy — checklist state now lives inside `dayLogs.checks` |
| `SK.weights` | `ph_wt_v1` | Array of `{ date, weight, ts }` — sorted newest-first |
| `SK.dayLogs` | `ph_dl_v1` | Object keyed by `dateStr` → `{ checks, weight, water, energy, notes, ts }` |
| `SK.fastDays` | `ph_fd_v1` | Object keyed by `dateStr` → `true` if water-fast |
| `SK.settings` | `ph_st_v1` | Single object: plan, currentKg, targetKg, calories, tdee, risk, startDate, age, height, sex, activityLevel, name, supplementsEnabled |
| `SK.schedule` | `ph_sc_v1` | Single object: `{ days[], startDate, totalDays, planName, startWeight }` |
| `SK.seenVer` | `ph_sv_v1` | String — last APP_VERSION the user dismissed the update banner for |
| `SK.foodLog` | `ph_fl_v1` | Object keyed by `dateStr` → array of food entries |
| `SK.foodLib` | `ph_fb_v1` | Array of `{ name, lastCalories, useCount }` — sorted by useCount desc |
| `SK.exLevels` | `ph_ex_v1` | Object keyed by `dateStr` → `{ groupId: levelIndex }` |
| `SK.lightDays` | `ph_ld_v1` | Object keyed by `dateStr` → `true` if light-eating day |
| `SK.swDismissedVer` | `ph_sw_v1` | String — last SW cache version the user dismissed the reload banner for |
| `SK.backupTs` | `ph_bts_v1` | Number — timestamp of last backup (for reminder banner) |

**Hard invariant:** None of these keys are renamed or deleted in this refactor. Future schema changes add `_v2` keys side-by-side.

---

## 3. Plan objects (`PLANS` + `EXERCISE_PROGRESSIONS`)

Verified line ranges against the current file:

| Plan key | Display name | Start line | Next-plan start | Approx size |
|----------|--------------|-----------|-----------------|-------------|
| `PLANS = {` (opening) | — | 2238 | — | — |
| `default` (within opening) | LITE PROTOCOL | 2243 | 2513 | ~270 |
| `agro` (within opening object) | AGRO CUT CALISTHENICS | 2513 | 3094 | ~581 |
| `PLANS.cut = {` | DEFAULT CUT | 3099 | 3350 | ~251 |
| `PLANS.bulk = {` | DEFAULT BULK | 3350 | 3626 | ~276 |
| `PLANS.maintenance = {` | DEFAULT MAINTENANCE | 3626 | 3880 | ~254 |
| `EXERCISE_PROGRESSIONS = {` | — | 3880 | — | ~420 (through to ~L4300) |

**Total plan + progression code in app.html:** ~1700 lines — the largest single extraction target for Phase 3.

---

## 4. Large functions (Phase 4 targets)

All verified at the listed line numbers:

| Function | Line | Size (approx) | Extraction target |
|----------|------|---------------|-------------------|
| `getValidCheckCompletion()` | 4333 | ~25 | stays in-file (bug-fix target in Phase 2) |
| `computeRadarMetrics()` | 4967 | ~258 | `modules/radar.js` |
| `renderRadar()` | 5225 | ~140 | `modules/radar.js` |
| `renderCalendar()` | 5546 | ~110 | `modules/calendar.js` |
| `openDayModal()` | 5657 | ~220 | `modules/calendar.js` |
| `downloadScheduleHTML()` | 6939 | ~234 | `modules/schedule-html.js` |
| `backupData()` | 7519 | ~30 | stays in-file |
| `restoreData()` | 7549 | ~70 | stays in-file |
| `generateExport()` | 7656 | ~588 | `modules/export.js` |
| `runInit()` | 8357 | ~50 | stays in-file (bootstrap/orchestrator) |

---

## 5. Confirmed real bug (Phase 2 target)

**`getValidCheckCompletion()` at L4333-4358** — denominator is wrong.

Current code (L4354-4357):
```javascript
const validChecks = Object.entries(checks).filter(([id]) => validIds.has(id));
const done = validChecks.filter(([,v]) => v).length;
const total = validChecks.length;
return { done, total, pct: total > 0 ? Math.round((done/total)*100) : 0 };
```

**Problem:** `validChecks` is filtered from `Object.entries(checks)` — i.e. only check IDs the user has ever interacted with. `total` = that filtered count. This means an untouched checklist has `total = 0`, not the true checklist length.

**Correct denominator:** the full checklist length for the active day's type (fast / light / normal), with `supplementsEnabled` filtering applied, and `_workout` + any valid `subItems` counted.

**Effect:** Calendar cell color accuracy and MONTHS-tab month-stats completion rate are both distorted by this bug. Fully-completed days can display correctly by luck, but partial or untouched days under-report.

Phase 2 fixes this by computing `total` from the filtered checklist definition (all `item.id` + valid `subItems[].id` + `_workout`), not from the filtered entries.

---

## 6. Confirmed false-positive "bugs" to skip

Verified not bugs:

- **"Global scope pollution at L1621-23, 4133, 4164, 4961, 5145, 5160, 5722"** — each variable is `let`-declared earlier in scope. No leak.
- **"XSS surface in innerHTML without esc()"** — user-facing text (food names L~1777, notes L~1861) IS wrapped in `esc()`. Verified.
- **"310 inline styles is a maintenance problem"** — compact idiomatic templating, not a bug.
- **"No event listener cleanup"** — listeners attach to DOM nodes that persist for app lifetime. No practical leak.

---

## 7. Other real issues to address in later phases

1. **`getValidCheckCompletion` denominator** (Phase 2)
2. **Two empty catch blocks** at L1323 (`idbSyncAll` IndexedDB `store.put` / `JSON.parse`) and L1348 (`idbAutoRestore` `localStorage.setItem`) — both swallow errors silently (Phase 2)
3. **~1725 lines of plan definitions** inside app.html (Phase 3)
4. **No schema migration framework** — future data shape changes have no upgrade path (Phase 1)

### Verified: empty catch blocks

- **L1323** — `try { store.put(JSON.parse(raw), storageKey); } catch {}` inside `idbSyncAll()`. Silently drops corrupted JSON or failed IDB writes per-key. Phase 2 should at minimum log these to `console.warn` so mirror-sync failures are visible.
- **L1348** — `try { localStorage.setItem(key, JSON.stringify(idbData[key])); } catch {}` inside `idbAutoRestore()`. Silently drops if localStorage throws (quota, disabled, security). Phase 2 should log and surface restore failures.

---

## 8. Pre-refactor baseline smoke test (v5.0.1)

Baseline is already in production use by the owner. Formal 9-step smoke test per `08_SMOKE_TESTS.md` is owner-verified against the live app. Result: **PASS**. This is the reference state the refactor will restore on rollback.

No auto-backup JSON file was generated for Phase 0 — Phase 0 made documentation-only changes that do not touch `app.html` or any storage-layer code. Auto-backup is required starting Phase 1.

---

## 9. Open questions for owner

1. **Remote tag push blocked.** The sandbox git server returns HTTP 403 on tag pushes. Local tag `v5.0.1-working` was created on commit `9565d67` (tip of main, pre-refactor). If the refactor needs remote tags for rollback from a fresh clone, this is a blocker to resolve before Phase 1 merges to main. If local-only tags are acceptable within this branch for the duration of the refactor, no action needed.
2. **Branch strategy confirmation.** The phase-file prompts reference `git push origin main` throughout, but the agreed strategy is to keep all refactor work on `claude/refactor-v6` and merge once at the end. Every subsequent phase's pushes in this session will target `claude/refactor-v6`, not `main`, unless owner says otherwise.
3. **Step-6 approval gate.** The master plan requires a pause for owner approval before executing each phase's plan. The owner's verbal directive ("execute on the prompts right away") overrides this for the session, but it is flagged here for the record.

---

## 10. Summary

- **Baseline code state:** `9565d67` on `main`, fully in production.
- **Baseline tag:** `v5.0.1-working` (local only on this branch; remote push blocked).
- **Line counts verified:** 8572 total in `app.html`.
- **Plans verified:** 5 plans + `EXERCISE_PROGRESSIONS`, ~1700 lines combined.
- **Real bugs confirmed:** `getValidCheckCompletion` denominator, two empty catch blocks.
- **False positives rejected:** scope pollution, XSS claims, inline styles, listener cleanup.
- **Next phase:** Phase 1 — DB hardening / migration framework (`02_DB_HARDENING.md`).
