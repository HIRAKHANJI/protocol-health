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
