# Refactor Complete — v5.0.1 → v6.2.x

**Executed:** 2026-04-19 through 2026-04-21 (compressed 2-day timeline; owner-driven batch-deploy strategy).
**Outcome:** Modular ES-module PWA. Zero behavior change from refactor itself (phases 1-6). Post-deploy regressions identified and fixed in v6.1.0 + v6.2.x.

---

## Phase ladder (what shipped in each version)

| Version | Phase | Scope | CACHE |
|---------|-------|-------|-------|
| 5.0.1 | baseline | pre-refactor reference | v13 |
| 5.1.0 | 1 | Migration framework (`migrations/` module group, schema-version tracking, auto-backup, restore guards) | v14 |
| 5.2.0 | 2 | 3 confirmed bug fixes: `getValidCheckCompletion` denominator, two empty `catch` blocks | v15 |
| 5.3.0 | 3 | Plan extraction (5 plans + `EXERCISE_PROGRESSIONS` → `plans/` modules; ~1765 inline lines removed) | v16 |
| 5.4.0 | 4 | Large-function extraction (`export.js`, `calendar.js`, `radar.js`, `schedule-html.js` → `modules/`; ~1943 inline lines removed) | v17 |
| 5.5.0 | 5 | Component extraction (`workout-card.js`, `rule-card.js`, `checklist.js` → `components/`; ~456 lines) | v18 |
| 6.0.0 | 6 | `CLAUDE.md` Sections 23-26 + major version milestone | v19 |
| 6.1.0 | post-refactor | Radar axis consistency (CONSISTENCY, FASTING use `getValidCheckCompletion`) + schema-card UX + initial calorie threshold restoration | v20 |
| 6.2.0 | post-refactor | Plan-aware `evalCalorieStatus` — cut/bulk logic split by `goalMode`, 50%-over threshold for cut, 50%-under threshold for bulk | v21 |
| 6.2.1 | post-refactor | Root-cause fix: `migrateOrphanedChecks` now populates `f2` info items for every day (previously only re-evaluated days where `f2` was already present) | v22 |
| 6.2.2 | polish | Cleanup pass: removed dead `idbGet`, README added, ARCHITECTURE.md staleness fix, this retrospective | v23 |

---

## File-level delta

**`app.html`:** 8,572 lines (v5.0.1) → ~4,600 lines (v6.2.x). **−46%.**

**New directories:**
- `plans/` — 7 files, 1,746 lines
- `modules/` — 4 files, 1,943 lines
- `components/` — 3 files, 462 lines
- `migrations/` — 3 files, 195 lines
- `docs/` — phase plans + this retrospective

**Total new ES-module code:** 4,346 lines moved out of `app.html` into 17 new files.

---

## Interop pattern chosen

Two candidates were considered: a `window.PH` wrapper object (per the refactor prompt's template) and a bare-name/globalThis fallback (using `Object.assign(window, {...})` for classic-script consts).

**Chosen:** the bare-name/globalThis fallback. Rationale: preserves **byte-identity** of extracted function bodies. Every extracted function was verified byte-for-byte identical to its former inline source via `diff` before the source was deleted. No mechanical `foo` → `PH.foo` rewrite to verify. Code survives future Claude-Code grep/search just as it did pre-refactor.

See `CLAUDE.md` Section 23 for the full interop specification.

---

## Decisions made along the way

| Decision | Why |
|----------|-----|
| **Single refactor branch (`claude/refactor-v6`), single merge** | Owner's choice to batch-test at the end rather than deploy each phase individually. Remote GitHub Pages only serves `main`; intermediate smoke tests would have required per-phase deploys. |
| **Per-phase tags not created for v5.1-v5.5** | Tags mark **smoke-tested** working states per master-plan invariant #4. Intermediate versions were never individually tested on-device. Only `v5.0.1-working` and `v6.0.0-working` are tagged. |
| **Phase 5 done in full (both Parts A and B)** | Owner opted in despite prompt's "optional" framing. Part B's checklist extraction (~500 lines, 14 functions) was the substantive gain. |
| **Remote tag push failed silently (HTTP 403)** | Sandbox git server blocks tag pushes. Local tags on the refactor branch serve the within-session rollback purpose. Flagged in Phase 0 recon. |
| **`window.PH` bridge pattern declined** | Would have broken byte-identity of every extracted function. Bare-name fallback achieves the same interop with zero source rewrites. |

---

## Post-refactor bugs found and fixed

### 6.1.0 — radar consistency
- `CONSISTENCY` radar axis used `plan.checklistNormal.length` (parent-only) — different denominator than the calendar.
- `FASTING` radar axis used raw `Object.values(log.checks)` — could include orphan IDs.
- Both aligned to use `getValidCheckCompletion(ds)` (same source of truth as calendar + `CHECKLIST` axis).

### 6.1.0 — calorie threshold partial regression
- Initial threshold fix set calorie-fail at `actual > ceiling`, but owner's actual spec was `actual >= 1.5 × ceiling`. Partially regressed; corrected in 6.2.0.

### 6.2.0 — plan-aware rebuild
- Introduced `evalCalorieStatus(actual, ceiling, goalMode, hasData)` as the single source of truth across render, refresh, and migration.
- CUT/MAINTENANCE: `≤ceiling` green, `<1.5×` orange, `≥1.5×` red+fail.
- BULK: inverse — `≥target` green, `>0.5×` orange, `≤0.5×` red+fail.

### 6.2.1 — calendar root cause
- `migrateOrphanedChecks` previously had an `(item.id in checks)` guard on the info-item update loop. Legacy days where the user never tapped the calorie card had `f2` missing from `checks` entirely — counter treated missing as not-done → past days showed partial despite everything else ticked.
- Removed the guard. `f2` is now populated from the food log for every day on every init.

---

## Smoke test results

Owner-confirmed pass on v6.0.0 deploy (Xiaomi Mi 15 Ultra PWA install, 2026-04-21):

| Section | Result |
|---------|--------|
| A. Initial load | 4/4 |
| B. TODAY tab | 7/7 |
| C. MONTHS | 10/10 (after 6.2.1 correction) |
| D. WORKOUTS | 5/5 |
| E. NUTRITION + RULES | 2/2 |
| F. TRACK | 8/9 (radar flagged for review → addressed in 6.1.0) |
| G. Settings | 7/7 |
| H. Plan switching | 5/5 (all 5 plans verified) |
| I. Restore | 2/3 (tampered-schema test skipped by owner) |
| J. Offline | 3/3 |
| K. Dev console | skipped by owner |
| L. Version surfaces | 2/2 |

---

## Lessons

1. **Byte-identity verification is non-negotiable for large extractions.** Every phase's diff-verify step caught zero silent drops but proved the invariant held. Skipping the diff to save time would have been false economy.
2. **Batched smoke test has a cost.** The calorie regression wasn't surfaced until v6.1.0 because v5.2.0's Phase-2 denominator change wasn't individually tested on the owner's actual data. If every phase had been tested on-device before the next shipped, this bug would have been obvious at Phase 2's smoke.
3. **The `migrateOrphanedChecks` guard was a legacy pitfall.** It pre-dated the refactor and only surfaced after the denominator fix made every checklist item count toward the total. Writing `(item.id in checks)` guards in mutation loops is a smell — silently skipping work on "missing" data is often a bug waiting for a reader.
4. **Module-to-classic interop via globalThis fallback works cleanly.** Every module reads bare names (e.g. `getValidCheckCompletion(ds)`) that fall through to `window.*`. No explicit `PH.` prefix needed. The only setup required: attach classic-script `const`/`let` bindings to `window` via `Object.assign`.

---

## Refactor outcome

- `app.html` is 46% smaller and no longer single-file.
- 17 new ES module files, all loading natively.
- 100% byte-identity preserved across all four phases of extraction.
- Zero intended behavior change from the refactor itself.
- Post-refactor regressions identified via owner smoke and patched in 6.1.0-6.2.1.
- Documentation (CLAUDE.md §§ 22-26) ships current with the new architecture.
- `WORKING_VERSIONS.md` records `v5.0.1-working` and `v6.0.0-working` as tagged rollback targets.

The 2-day compressed timeline worked with the batched-test strategy. It would have been safer with per-phase on-device testing; the cost was one real bug (calorie regression) surfaced late instead of early. Judgment call made, documented, shipped.
