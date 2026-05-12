# Phase 1 Plan — Migration Framework

> **📜 HISTORICAL — ✅ SHIPPED in v5.1.0 (2026-04-19/21 refactor).** Pre-execution plan. Retained for audit trail. See `docs/REFACTOR_COMPLETE.md` for the consolidated post-refactor retrospective.

**Phase:** 1 (Data Safety / Migration Framework)
**Target APP_VERSION:** 5.0.1 → **5.1.0**
**Target CACHE_NAME:** `protocol-health-v13` → **`protocol-health-v14`**
**Banner message:** `'Data safety: migration framework installed. Your existing data is untouched.'`
**Branch:** `claude/refactor-v6`
**Baseline rollback tag:** `v5.0.1-working` (local, on pre-refactor main `9565d67`)

---

## 1. Files to create

| Path | Size (est.) | Exports |
|------|-------------|---------|
| `migrations/helpers.js` | ~40 lines | `gsSafe`, `ssSafe`, `downloadJson` |
| `migrations/registry.js` | ~30 lines | `MIGRATIONS` (empty array for v5.1.0) |
| `migrations/runner.js` | ~130 lines | `runMigrations`, `getSchemaVersion`, `getMigrationLog` |

All three are ES modules. Loaded via `<script type="module">` in `app.html`. Their exports are hoisted to `window.*` for access from the main inline `<script>` at L1241+.

## 2. Files to modify

| Path | Change |
|------|--------|
| `app.html` | (a) add `schemaVersion: 'ph_sch_v1'` to `SK`; (b) insert `<script type="module">` module-loader shim in `<body>`; (c) convert `runInit()` to async and rewire IIFE; (d) expand `backupData()` output shape; (e) extend `restoreData()` with future-schema guard; (f) add schema display + `EXPORT MIGRATION LOG` button in Settings → Data Management; (g) populate schema display inside `openSettings()`; (h) define `exportMigrationLog()`; (i) bump `APP_VERSION` and `APP_VERSION_MSG` |
| `sw.js` | Bump `CACHE_NAME` to `v14`; add the three `migrations/*.js` paths to the critical cache list |
| `index.html` | Update `.hero-badge` text from `v5.0.0` to `v5.1.0` (corrects existing drift from v5.0.1 at the same time) |
| `UPDATE_LOG.md` | New v5.1.0 entry at top |
| `CLAUDE.md` | Section 9 appendix "Schema Version & Migrations"; Section 13 Quick Reference entry for `migrations/` |

## 3. Exact line ranges touched in app.html

Numbers verified against the current file (8572 lines total):

| Change | Line(s) in current file | Notes |
|--------|------------------------|-------|
| Insert module-loader shim | Near top of `<body>` (around L560-580) | New `<script type="module">` block; sets `window._PH_MIGRATIONS_READY` and dispatches `ph:migrations-ready` |
| Extend `SK` object | L1358-1372 | Append `schemaVersion: 'ph_sch_v1'` |
| Bump APP_VERSION + MSG | L1380-1381 | `'5.1.0'` + new banner message |
| Extend `backupData()` | L7519-7545 | Add `schemaVersion` + `appVersion` to the emitted object (top of function body) |
| Extend `restoreData()` | L7549-7617 | After existing validation (after L7575), add future-schema guard |
| Convert `runInit()` to async | L8357-8388 | Make function async; wait for `ph:migrations-ready`; call `await idbAutoRestore()`; call `await window.runMigrations(Object.values(SK))`; bail with alert if `!result.ok` |
| Simplify IIFE | L8391-8406 | Replace existing hasData branching with `runInit().catch(console.error);` (the check is now redundant — `idbAutoRestore` already guards internally at L1336-1340) |
| Define `exportMigrationLog()` | Near `backupData()` end (~L7546 or similar) | New top-level function |
| Add schema card in Settings HTML | After L1050 `#storageHealth` div in Data Management section | New inline HTML block |
| Populate schema display | Inside `openSettings()` L6269-6301 | Add one block at the bottom, similar to `renderStorageHealth()` pattern |

## 4. Module interop pattern

```html
<!-- inserted at top of <body>, before the main inline <script> at L1241 -->
<script type="module">
  import { runMigrations, getSchemaVersion, getMigrationLog } from './migrations/runner.js';
  window.runMigrations = runMigrations;
  window.getSchemaVersion = getSchemaVersion;
  window.getMigrationLog = getMigrationLog;
  window._PH_MIGRATIONS_READY = true;
  window.dispatchEvent(new Event('ph:migrations-ready'));
</script>
```

The main inline script remains a classic `<script>` (not a module). `runInit()` awaits the `ph:migrations-ready` event (guarded by the `_PH_MIGRATIONS_READY` flag so no race if the module already resolved).

This same pattern will be used for plan extraction (Phase 3) and module extraction (Phase 4), so the investment here amortizes.

## 5. Init order (critical — data correctness depends on it)

```
1. waitForModuleReady       — no-op if already true
2. idbAutoRestore           — unchanged internal semantics
3. runMigrations            — NEW; halts init on failure with alert
4. migrateOrphanedChecks    — existing
5. (rest of runInit)
```

`idbAutoRestore` MUST run before `runMigrations`. Otherwise a user whose localStorage was wiped would get a schema record written for an empty DB, then the IDB-restored data would arrive under that fresh schema record — potentially re-running migrations on already-migrated data. Order is guarded.

## 6. Backup format (backward-compatible)

Old backup:
```json
{ "version": "ph_v1", "exportedAt": "2026-04-18", "data": { ... } }
```

New backup (additive fields, existing `version` + `data` preserved):
```json
{
  "version": "ph_v1",
  "schemaVersion": 1,
  "appVersion": "5.1.0",
  "exportedAt": "2026-04-19",
  "data": { ... }
}
```

Old backups (without `schemaVersion`) restore cleanly — `restoreData` treats missing `schemaVersion` as `1`. New backups loaded into an older app version that doesn't know about `schemaVersion` simply ignore the extra field.

## 7. Settings UI addition

Inserted after `#storageHealth` div in the Data Management section. Matches the existing look (uses `.reset-btn` class, not `btn-ghost` — the prompt suggested `btn-ghost` but the current file uses `reset-btn` for every Data Management action):

```html
<div style="margin-top:10px;padding:10px 13px;background:var(--surface);border:1px solid var(--border);border-radius:8px;font-family:'DM Mono',monospace">
  <div style="font-size:0.6rem;color:var(--muted);letter-spacing:1px;margin-bottom:4px">SCHEMA</div>
  <div id="schemaVersionDisplay" style="font-size:0.85rem;color:var(--text)">Schema v—</div>
  <button class="reset-btn" onclick="exportMigrationLog()" style="margin-top:10px;width:100%;border-color:#999;color:#999">EXPORT MIGRATION LOG</button>
</div>
```

## 8. Risks and mitigations

| # | Risk | Mitigation |
|---|------|-----------|
| 1 | Module script loads async → `runInit()` races it | Event-gate: `window._PH_MIGRATIONS_READY` flag + `ph:migrations-ready` event. Flag check first (no wait if ready), event-wait otherwise. |
| 2 | `runInit` order-of-operations regression | Explicit ordered sequence documented in Section 5 above. Reviewed against existing IIFE behavior — `idbAutoRestore` stays before migrations. |
| 3 | `structuredClone` browser support | Supported in Chrome 98+, Safari 15.4+, Firefox 94+. Owner uses Android Chrome (latest) on PWA — safe. If future concerns arise, fallback to `JSON.parse(JSON.stringify(x))`. |
| 4 | `runMigrations` failure leaves app in half-migrated state | Runner is atomic per-migration: reads ALL → transforms → verifies → writes ALL → updates record. If any step fails, state is not advanced. Alert shown, `runInit` returns early. |
| 5 | Restoring an old backup overwrites current schema record to an older version | Acceptable for Phase 1 (no migrations registered). **Flagged for future:** when a real migration is registered, `restoreData` should either (a) re-run migrations on the restored data, or (b) preserve the current schema record and reject backups whose schemaVersion is lower than installed migrations can no-op. Decision deferred to the phase that registers the first real migration. |
| 6 | Module paths (`./migrations/*.js`) resolve relative to `app.html` location | `app.html` served from repo root. PWA start_url is `./app.html`. Module paths are relative to the importing file. Checked — will resolve to `/migrations/*.js` correctly. |
| 7 | Hero-badge drift | Current `index.html` already shows `v5.0.0` despite app being on `5.0.1`. Phase 1 updates to `v5.1.0`, closing the drift. |
| 8 | Remote tag push blocked (from Phase 0) | Local tag `v5.1.0-working` will be created on the commit; remote push may 403. Rollback within branch works either way via local tag. |
| 9 | Branch strategy divergence from prompt | Phase prompts say `git push origin main`. Owner's strategy is `claude/refactor-v6` for all refactor work with single final merge. This phase will push to `claude/refactor-v6`. Flagged each phase. |

## 9. Commit sequence

```
[commit 1] feat(migrations): add migration framework (runner, registry, helpers)
            - migrations/helpers.js
            - migrations/registry.js
            - migrations/runner.js

[commit 2] feat(app): integrate migration framework; bump APP_VERSION to 5.1.0 and CACHE_NAME to v14
            - app.html (all 9 changes above)
            - sw.js (CACHE_NAME v14 + migrations in cache list)
            - index.html (hero-badge v5.1.0)

[commit 3] docs: v5.1.0 migration framework notes
            - UPDATE_LOG.md (v5.1.0 entry)
            - CLAUDE.md (Section 9 appendix + Section 13 quick-reference line)

[push]     git push origin claude/refactor-v6
[tag]      git tag v5.1.0-working   (on commit 2, the functional change)
[tag push] git push origin v5.1.0-working   (may 403 per known issue)

[post-smoke] docs: log working version v5.1.0  — separate commit adding entry to WORKING_VERSIONS.md
```

## 10. Smoke test plan (5 minutes, post-deploy)

Owner opens live app on device. Full sequence per `08_SMOKE_TESTS.md`:

1. Banner appears: "Data safety: migration framework installed…". Tap OK / RELOAD.
2. Open devtools console. Expect log: `[migrations] Schema record established: v1 (existing-user)`.
3. Settings → Data Management. Verify `Schema v1` displayed.
4. Tap `EXPORT MIGRATION LOG` → JSON downloads, contents show `schemaVersion: 1`, `migrationsApplied: []`, `establishedFrom: "existing-user"`.
5. Tap `BACKUP TO FILE` → JSON downloads. Open file: verify `"schemaVersion": 1` and `"appVersion": "5.1.0"` fields present alongside original `version`, `exportedAt`, `data`.
6. TODAY tab → checklist renders, current day shows, tick an item, state persists after reload.
7. MONTHS tab → current month renders with colors.
8. WORKOUTS tab → renders.
9. Weight history (TRACK) → present.
10. Food log → present (if owner has food entries).
11. Zero red errors in console during init.

**Fresh-install simulation (optional, owner discretion):** open the app in a Chrome incognito window on desktop. Expect: `establishedFrom: "fresh-install"` in the migration log.

## 11. Rollback steps if smoke test fails

Per prompt Step 6b:

```bash
git reset --hard v5.0.1-working   # local reset (remote tag may not exist due to push block)
# manually edit sw.js: CACHE_NAME → 'protocol-health-v15' (past v14 so v14 caches invalidate)
# manually edit app.html: APP_VERSION → '5.0.2', MSG → 'Reverted — investigating.'
git add sw.js app.html UPDATE_LOG.md
git commit -m "revert: rollback phase 1 (migration framework)"
git push --force-with-lease origin claude/refactor-v6
```

Append REVERT entry to `WORKING_VERSIONS.md`.

---

## 12. What this plan is NOT

- No migrations are registered (`MIGRATIONS = []`). No existing data is touched.
- No `idbSyncAll` / `idbAutoRestore` empty-catch fix — that's Phase 2.
- No `getValidCheckCompletion` bug fix — that's Phase 2.
- No plan extraction — that's Phase 3.
- No module extraction of `generateExport` / `renderCalendar` / etc. — that's Phase 4.
- No change to existing stored data shapes, keys, or UI aesthetics.

---

## 13. Owner approval gate

Per Phase 1 prompt Step 2: **"Stop and wait for owner approval of the plan."**

Also required before execution (Phase 1 prompt Step 1.2):
> "Before I start, please open the live app, go to Settings → Data Management → BACKUP TO FILE. Save the file. Confirm when done."

**Owner actions required to proceed:**

1. Download a manual backup JSON from live v5.0.1 app. Confirm file saved on device.
2. Review this plan. Approve or request changes.

After owner confirms both, execution begins with Step 3a (create `migrations/helpers.js`).
