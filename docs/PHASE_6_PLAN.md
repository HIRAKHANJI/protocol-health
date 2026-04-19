# Phase 6 Plan — Finalize CLAUDE.md Architecture Docs

**APP_VERSION:** 5.5.0 → **6.0.0** (major bump — architecture refactor complete)
**CACHE_NAME:** v18 → **v19**
**Banner:** `'Architecture refactor complete. Zero behavior change; app is now modular under the hood.'`
**Branch:** `claude/refactor-v6`
**Changes:** Documentation only. No app code touched.

---

## 1. Stale sentences in CLAUDE.md to fix

Scan found these claims that are no longer true post-refactor:

| Line | Current text | Problem | Surgical fix |
|------|--------------|---------|--------------|
| 26 | `"single-file Progressive Web App (PWA) — the entire application lives in one HTML file (\`index.html\`)"` | Wrong file (`index.html` is the landing page, not the app) AND no longer single-file | Rewrite to describe modular-ES-module PWA with app.html bootstrap |
| 236 | `"The entire app — HTML, CSS, and all JavaScript in one file. ~5000+ lines. No build process..."` | Logic now spread across `plans/`, `modules/`, `components/`, `migrations/`. Line count 4637 | Update to describe bootstrap + orchestration role; link to Section 23 |
| 396 | `"The single-file architecture makes this straightforward"` | Architecture is now modular | Rephrase: "zero-build, zero-dependency architecture" |
| 433 | `"The single-file architecture is a feature, not a limitation"` | Shift the principle from file-count to no-build/no-deps | Rephrase to emphasize zero build, modular ES-modules loaded natively |
| 592 | `"App file: app.html (single file, ~5000+ lines)"` | Inaccurate line count + "single file" | Update line count + note modular architecture |

## 2. New sections to append

Appending after the existing Section 22 (added Phase 0).

- **Section 23** — Modular Architecture (Post-Refactor). Directory structure + interop pattern as-actually-implemented + startup sequence + change-location guide.
- **Section 24** — Schema Migration Playbook (concrete, copy-pasteable migration template).
- **Section 25** — Working With This Codebase (Claude Code onboarding procedure).
- **Section 26** — File Line-Count Governance (soft limits).

## 3. Deviations from prompt template

The prompt's Section 23 template describes a `window.PH` bridge object. **That's NOT what was implemented.** Actual pattern: `Object.assign(window, { SK, MONTHS_LIST, DAYS_SHORT, AUTO_WORKOUT_IDS, WORKOUT_ITEM_SESSION })` early in the classic script, plus functions auto-attached to `window` via `function` declarations in classic, plus `window.*` assignments for module-exported functions in each loader shim. Modules resolve classic-side identifiers via JavaScript's globalThis fallback for bare names.

**Section 23 will document the real pattern, not the template's.** This is a correctness trade-off (stale doc is worse than schema deviation).

## 4. Files modified

- `CLAUDE.md` — stale-prose surgical fixes (5) + 4 new sections appended
- `app.html` — APP_VERSION bump, APP_VERSION_MSG update, expose `window.APP_VERSION` assignment stays as-is
- `sw.js` — CACHE_NAME bump to v19
- `index.html` — hero-badge v6.0.0
- `UPDATE_LOG.md` — v6.0.0 entry

## 5. Commit sequence

```
[1] docs(claude): fix stale single-file references for post-refactor reality
[2] docs(claude): architecture sections 23-26 post-refactor
[3] chore: bump to 6.0.0; CACHE v19 — refactor complete
[4] docs: v6.0.0 release notes
[push]
```

## 6. Post-commit (deferred per owner directive)

- `v6.0.0-working` tag — on smoke pass
- `WORKING_VERSIONS.md` v6.0.0 entry — on smoke pass
- `docs/REFACTOR_COMPLETE.md` retrospective — optional
