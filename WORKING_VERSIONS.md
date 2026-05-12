# Working Versions Log

This log records every git-tagged working version of Protocol Health during the 2-day refactor and beyond. Most recent entry is at the top.

**How to use this file:**

- Every phase that successfully passes its smoke test adds an entry here BEFORE the next phase begins.
- If anything breaks in a future phase, run: `git reset --hard <most-recent-working-tag>` and force-push to restore.
- Entries are append-only. Never edit or remove past entries.

**How Claude Code uses this file:**

- Before starting any phase, read this file to know the last-known-good state.
- If owner says "rollback," find the most recent entry, run `git reset --hard <tag>`, bump CACHE_NAME, bump APP_VERSION as patch, push.
- After a phase succeeds, add a new entry at the TOP with the exact format below.

**Entry format:**

```
## v{APP_VERSION}-working — YYYY-MM-DD HH:MM
- **Phase:** N ({phase name})
- **Git tag:** `v{APP_VERSION}-working`
- **Commit hash:** `{short-sha}`
- **CACHE_NAME:** `protocol-health-v{N}`
- **Smoke test:** PASS ({list of items verified})
- **Owner-confirmed:** yes/no
- **Auto-backup on owner device:** `{filename.json}` / `no backup (pre-code-change phase)`
- **Notes:** {any observation, or '—'}
```

---

> **⚠️ TAGGING GAP DISCLOSURE (2026-05-09):** Between `v6.0.0-working` and `v8.0.0-working`, releases v6.2.0 through v7.10.3 (≈ 30 minor / patch versions shipped via the Phase A–D calibration roadmap + Phases 11–13 + the v7.10.x audit cycle) were **not** individually tagged or logged here at the time of release. Each version was smoke-tested by the owner on-device before merge to main and is fully documented in `UPDATE_LOG.md` with date, scope, banner copy, and file-level deltas. This log records only the tags that were created in git. Going forward the per-release tagging rule in `CLAUDE.md` §11 will be followed strictly. Use `UPDATE_LOG.md` (which is canonical for all version history) for any rollback target between v6.0.0 and v8.0.0 — the corresponding commit SHA lives in the commit log (`git log --oneline | grep "vN.N.N"`).

---

## v8.0.0-working — 2026-05-09 (audit-driven major; 14 bug fixes + schema v5→v6)
- **Phase:** docs-defined release (post-audit fix bundle from `docs/v8.0.0-bug-audit.md`)
- **Git tag:** `v8.0.0-working` (to be pushed after this commit lands on main)
- **Commit hash:** `f0ae152` (feature branch tip before this docs-cleanup commit)
- **CACHE_NAME:** `protocol-health-v30`
- **Smoke test:** PASS — owner ran a smoke pass on Xiaomi Mi 15 Ultra PWA install before merging to main. Verified: plan-switch check cleanup, multi-day fast → fastDays sync, Reality Check CALIBRATED state, Settings TDEE field auto-refresh, schedule fast/light manual-unset persistence, backup type validation surfacing, day-modal past-day _workout auto-derive, exercise level dateStr threading.
- **Owner-confirmed:** yes (merged to main 2026-05-09)
- **Auto-backup on owner device:** owner's most recent manual backup JSON before merge
- **Notes:** Major release — schema migration v5 → v6 (additive: registers `ph_fdu_v1` + `ph_ldu_v1`, no data transform). Version rollover v7.10.x → v8.0.0 per CLAUDE.md §12 (v7.10 is the last allowed minor before major rollover). 14 bug fixes (3 critical / 5 high / 7 medium / 3 low) confirmed and applied; 4 audit findings deferred (L1 ss() return signal, L2 historical fast-day plan attribution, L6 workoutChecks orphan by design, M6 idbSyncAll race). Closes the v7.10.x audit cycle. Next planned addition: 175-workout library.

---

## v6.0.0-working — 2026-04-21 (refactor complete, smoke passed)
- **Phase:** 1-6 merged as a single deploy (Phases 1-5 code shipped; Phase 6 is CLAUDE.md finalize + version bump)
- **Git tag:** `v6.0.0-working` (local only — remote tag push blocked by sandbox 403)
- **Commit hash:** `3b74187` (merge commit on `main` from `claude/refactor-v6`)
- **CACHE_NAME:** `protocol-health-v19`
- **Smoke test:** PASS — sections A/B/D/E/F/G/H/I/J/L all PASS on owner's device (Xiaomi Mi 15 Ultra PWA install). Dev console (K) skipped by owner choice.
- **Owner-confirmed:** yes
- **Auto-backup on owner device:** full backup taken during test section I
- **Notes:** 2-day refactor complete. 6 phases deployed as a single merge to `main`. ~1,765 inline-plan lines + ~1,943 inline-function lines + ~456 inline-helper lines extracted from `app.html` (8,572 → 4,637, −46%). New `plans/`, `modules/`, `components/`, `migrations/` directories with 17 ES module files. Intermediate versions v5.1.0-v5.5.0 were pushed to the refactor branch but never individually smoke-tested — owner chose batch-test-at-end strategy. Flagged follow-up items (non-blocking): calendar "partial" day investigation, radar accuracy reassurance, recent-notes food log day cap, schema card explanation UX, and a new calorie-threshold indicator feature request.

---

## v5.0.1-working — 2026-04-19 (baseline)
- **Phase:** 0 (baseline before refactor begins)
- **Git tag:** `v5.0.1-working`
- **Commit hash:** `9565d67` (pre-refactor tip of `main`)
- **CACHE_NAME:** `protocol-health-v13`
- **Smoke test:** PASS (baseline — app already in production use)
- **Owner-confirmed:** yes
- **Auto-backup on owner device:** owner's most recent manual backup JSON
- **Notes:** Starting point for 2-day refactor. All phases below this entry represent the refactor work. Refactor is executing on branch `claude/refactor-v6` (not `main`) and will be merged to `main` as a single action at the end. Phase-level tags are created on the refactor branch; rollback within the refactor uses these tags.
