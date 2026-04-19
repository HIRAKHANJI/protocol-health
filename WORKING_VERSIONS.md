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

## v5.0.1-working — 2026-04-19 (baseline)
- **Phase:** 0 (baseline before refactor begins)
- **Git tag:** `v5.0.1-working`
- **Commit hash:** `9565d67` (pre-refactor tip of `main`)
- **CACHE_NAME:** `protocol-health-v13`
- **Smoke test:** PASS (baseline — app already in production use)
- **Owner-confirmed:** yes
- **Auto-backup on owner device:** owner's most recent manual backup JSON
- **Notes:** Starting point for 2-day refactor. All phases below this entry represent the refactor work. Refactor is executing on branch `claude/refactor-v6` (not `main`) and will be merged to `main` as a single action at the end. Phase-level tags are created on the refactor branch; rollback within the refactor uses these tags.
