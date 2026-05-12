# Phase 2 Plan — Bugfixes

> **📜 HISTORICAL — ✅ SHIPPED in v5.2.0 (2026-04-19/21 refactor).** Pre-execution plan. Retained for audit trail. See `docs/REFACTOR_COMPLETE.md` for the consolidated post-refactor retrospective.

**Phase:** 2 (Real bugs only, no refactor)
**Target APP_VERSION:** 5.1.0 → **5.2.0**
**Target CACHE_NAME:** `protocol-health-v14` → **`protocol-health-v15`**
**Banner message:** `'Calendar accuracy: compliance now measured against full checklist, not just items you touched. Some past days will shift from green to partial — this is correct.'`
**Branch:** `claude/refactor-v6`

---

## 1. Bugs being fixed

### Bug 1 (HIGH) — `getValidCheckCompletion` denominator wrong

**Location:** `app.html` L4333-4358.

**Current behavior:** `total = validChecks.length` — where `validChecks` is `Object.entries(checks).filter(...)`. This counts only entries the user has interacted with. A user who ticks 3 items and never touches 10 others gets `done=3 total=3 → 100% green`.

**Corrected behavior:** `total` is computed from the filtered checklist definition:
- Each regular item (no `subItems`) counts as 1.
- Items with `subItems`: parent is NOT counted (it's a derived aggregate per `loadChecklist` L4478-4482). Each sub whose `days` filter allows the current day-of-week counts as 1.
- `_workout` counts as 1 **only when** the checklist has no `AUTO_WORKOUT_IDS` items (i.e. when the fallback `_workout` card is actually rendered on fast/light days). On normal days with `m2/m3/e1/e2/e3` present, those count individually and `_workout` is not rendered.

**`done` recalculated symmetrically** — so ratio stays correct. Keeps parent-not-counted rule. Counts subs filtered by `days`. Counts `_workout` only when rendered. This corrects a subtle over-count in the prompt's proposed fix where a fully-ticked parent+subs combo could produce `done > total`.

**User-visible effect:** past days that were "green" from partial compliance will shift to partial/missed. Banner explains this.

### Bug 2 (MEDIUM) — silent catch in `idbSyncAll`

**Location:** `app.html` L1323. Current `try { ... } catch {}` swallows JSON parse and IDB write errors silently. Fix: log via `console.warn` with the storage key and the error.

### Bug 3 (MEDIUM) — silent catch in `idbAutoRestore`

**Location:** `app.html` L1348. Current `try { localStorage.setItem(...) } catch {}` swallows write errors (e.g. quota exceeded on restore). Fix: track failures, `console.error` each one, and show a user alert after init completes if any keys failed to restore.

---

## 2. Files modified

| File | Change |
|------|--------|
| `app.html` | `getValidCheckCompletion` rewritten (L4333-4358); `idbSyncAll` catch logs (L1323); `idbAutoRestore` catch logs + post-init alert (L1346-1349); APP_VERSION + MSG bump (L1380-1382); `window.APP_VERSION` export line shifts |
| `sw.js` | `CACHE_NAME` v14 → v15 |
| `index.html` | hero-badge v5.1.0 → v5.2.0 |
| `UPDATE_LOG.md` | New v5.2.0 entry |
| `CLAUDE.md` | Quick Reference: `CACHE_NAME v15`, `APP_VERSION 5.2.0`. Current version markers in Section 11 + 12. Also update the example constant at L567. |

## 3. Explicitly NOT fixing (Phase 0 recon false positives)

- "Global scope pollution" — variables are `let`-declared in enclosing scope. No leak.
- "XSS surface" — user-facing text is wrapped in `esc()`. Verified.
- "No event listener cleanup" — listeners live with the DOM for app lifetime. No practical leak.
- "310 inline styles" — compact idiomatic templating. Not a bug.

Also NOT touching `computeRadarMetrics` counting logic (L5207) or the day-modal `doneCount/items.length` display (L5733). Those are independent counters with their own semantics; out of Phase 2 scope.

## 4. Commit sequence

```
[commit 1] fix(calendar): getValidCheckCompletion denominator = full checklist not just touched items
[commit 2] fix(idb): log sync errors to console instead of swallowing
[commit 3] fix(idb): surface auto-restore failures to user
[commit 4] chore: bump to 5.2.0; CACHE v15
[push]     git push origin claude/refactor-v6
[tag]      DEFERRED — owner batches smoke-test at end of refactor
```

## 5. Smoke test (deferred per owner directive)

Will be run by owner when the full refactor is deployed. Expected:
- Banner shows calendar-shift explanation on first load after v5.2.0
- MONTHS tab: days that were green by partial compliance now show partial/missed
- TODAY tab: tick 3/~15 items → today shows partial, not green
- Fast day: 5/5 fast items → purple
- Console: only `[idb]` informational warnings allowed, no red errors
- Goal calculator, projection, radar: unchanged output for same input (radar's checklist-depth axis may read slightly differently because it uses its own parent-only counter; that's pre-existing behavior, not a regression)
