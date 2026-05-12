# Calibration Project — Phase A Plan

> **📜 HISTORICAL — ✅ SHIPPED in v6.2.5.** Calibration project completed at v7.8.1 (all phases A–D + 11–13). Plan retained for audit trail only. Do not follow as if active. See `UPDATE_LOG.md` for the version-by-version record and `PENDING_IMPLEMENTATIONS.md` for the closed-out roadmap.

**Status:** ✅ COMPLETED (shipped v6.2.5)
**Branch:** `claude/add-workout-exercises-KjRRh`
**Version target:** `6.2.5` (patch — silent, scaffolding only)
**CACHE_NAME:** unchanged on feature branch (bumps once at merge to main)

## Goal

Add the data-layer foundation for the TDEE Calibration project (Phases A-D). Purely additive. No user-visible behavior change. Sets the plumbing so Phases B-D can ship cleanly.

## Scope

Three changes only:

1. **Add `SK.fastWindows = 'ph_fw_v1'`** to the SK object in `app.html`. New storage key for fast-window timestamps. Empty by default. Existing `SK.fastDays` stays untouched and is interpreted as a 24-hour fast by all readers (backward-compat fallback handled in Phase C).

2. **Add two events to `DISPATCH_MAP`** in `app.html`:
   - `TDEE_CHANGED: ['projection','durationBar','goalBar','nutritionMacros','radar']` — fired when calibration writes a new TDEE
   - `FAST_WINDOW_CHANGED: ['fastUI','checklist','calendarCell','projection','radar']` — fired when a fast window starts/stops/edits/breaks
   No new dispatch targets needed — every target name above already exists in the `dispatch()` switch.

3. **Add migration v1→v2** to `migrations/registry.js`. No-op data transformation. Bumps the schema version record from 1 to 2 to mark "fastWindows key registered." `requiresBackup: false` because no data is touched.

## What does NOT change in Phase A

- No new files
- No new modules
- No edits to any other file (only `app.html`, `migrations/registry.js`, `UPDATE_LOG.md`)
- No new function bodies, no new HTML, no new CSS
- No `sw.js` change (per CLAUDE.md: feature branches don't bump CACHE_NAME)

## Files touched

| File | Change |
|---|---|
| `app.html` line ~1486 | Add `fastWindows: 'ph_fw_v1'` to `SK` object |
| `app.html` line ~2199 | Add 2 entries to `DISPATCH_MAP` |
| `app.html` line ~1505 | Bump `APP_VERSION` 6.2.4 → 6.2.5 |
| `app.html` line ~1506 | Update `APP_VERSION_MSG` (silent — no popup, but kept current) |
| `migrations/registry.js` | Add migration object `{ from: 1, to: 2, run: identity }` |
| `UPDATE_LOG.md` | Add v6.2.5 entry at top |

## Migration object (final form)

```js
{
  from: 1,
  to: 2,
  description: 'Register fast-window storage key (ph_fw_v1). No data transformation — purely additive.',
  requiresBackup: false,
  run: (data) => {
    // No-op: SK.fastWindows is added in app.html. The new key is empty by
    // default. All readers fall back to existing fastDays entries (interpreted
    // as 24-hour fasts) until Phase C adds the start/stop UX.
    return data;
  },
  verify: () => true,
  reverse: (data) => data
}
```

## Smoke test (Phase A)

Owner runs:
1. Open app on phone. Splash loads. No console error on first load.
2. Settings → Data Management → schema version shows **v2** (was v1).
3. Open MONTHS calendar. Past fast days still purple. No color regression.
4. TODAY tab loads checklist normally. Fast banner unchanged.
5. Backup → Restore (round-trip). New `fastWindows` key included in backup file (will be `{}` or absent — both fine). Restore succeeds.
6. No console errors during any of the above.

If any item fails: rollback via `git reset --hard v6.2.4-working` (assuming that tag exists; otherwise the prior commit `739426a`).

## Risk table

| Risk | Mitigation |
|---|---|
| Migration runner errors on no-op | Tested logic: `m.run(structuredClone(beforeMap))` returns input unchanged; `verify` returns true; `writeAllAppData` writes idempotently. Safe. |
| Existing fastDays stops showing as fast | Migration touches no data. fastDays untouched. Calendar reads unchanged. Verified via inventory: `isFastDay` checks `SK.fastDays` only — Phase C adds the fastWindows fallback. Phase A leaves the read path identical. |
| Backup format breaks | Backup iterates `Object.entries(SK)` (no hardcoded list). Adding new key just makes it appear in future backups. Old backups continue to restore. |
| Dispatch event with unknown target | All 7 target names used (`projection`, `durationBar`, `goalBar`, `nutritionMacros`, `radar`, `fastUI`, `checklist`, `calendarCell`) already exist in `dispatch()` switch. Verified at app.html:2350-2390. |

## Acceptance criteria

- [ ] App loads without console error
- [ ] Schema version reads as `2` post-migration
- [ ] Calendar past days look identical
- [ ] Backup/restore round-trip works
- [ ] APP_VERSION reads `6.2.5`
- [ ] No `sw.js` change committed
- [ ] No commit other than the Phase A commit on the feature branch

## Stop point

Commit Phase A. Stop. Wait for owner smoke test. Tag `v6.2.5-working` and update `WORKING_VERSIONS.md` only after PASS confirmation. Do not proceed to Phase B until owner says "go on Phase B."
