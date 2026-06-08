# Protocol Health

Personal fitness tracking Progressive Web App. Zero build step. Zero dependencies. Native ES modules served by GitHub Pages.

**Live:** https://hirakhanji.github.io/protocol-health/
**Install:** open the live URL on Android Chrome → "Add to Home Screen" → runs fullscreen as a PWA.

---

## What it does

Tracks three things:

1. **Daily compliance** — a structured checklist (per active plan), ticked off each day. Supplements, morning/evening sessions, workouts, water, calories.
2. **Weight over time** — daily logging, goal-bar progress, forward-looking projection to Sunday.
3. **Calorie/deficit planning** — goal calculator modeling fasting days, eating windows, exercise burn, and compliance rate, flagging plans as realistic / aggressive / unrealistic.

5 training plans: **LITE PROTOCOL** (gentle, all-ages), **AGRO CUT CALISTHENICS**, **DEFAULT CUT**, **DEFAULT BULK**, **DEFAULT MAINTENANCE**. Switched via Settings.

All data stored in the browser's `localStorage` (and mirrored to `IndexedDB` as a recovery backup). Nothing ever leaves the device.

---

## Architecture at a glance

```
app.html                  # Bootstrap: HTML + CSS + inline orchestration (~6,692 lines as of v8.8.1)
index.html, manifest.json, sw.js
plans/                    # 5 plan modules + exercise progressions + index assembler
modules/                  # export.js, calendar.js, radar.js, schedule-html.js, calibration.js
components/               # workout-card.js, rule-card.js, checklist.js, fast-window.js
migrations/               # runner, registry, helpers (schema versioning)
docs/                     # Phase plans, recon report, refactor retrospective, audit reports
```

No npm. No bundler. No TypeScript. No framework. All modules load natively via `<script type="module">`.

---

## Documentation map

| File | Purpose |
|------|---------|
| `CLAUDE.md` | **Start here for any code change.** Project brief, non-negotiable rules, version discipline, migration playbook, onboarding procedure (§§ 22-26 cover the modular architecture). |
| `UPDATE_LOG.md` | Every version from 1.0.0 onward with date, scope, banner, and what changed. |
| `WORKING_VERSIONS.md` | Git-tagged "working" versions for rollback. Append-only. |
| `WORKOUTS_LIBRARY.md` | Exercise encyclopedia: every movement, per-plan prescription, evidence citations. |
| `ARCHITECTURE.md` | Domain-logic diagrams (data flow, algorithms, subsystem behavior). Module layout is in `CLAUDE.md` §23. |
| `PLAN.md` | Historical — implementation plan for the original cut/bulk/maintenance addition (v1.9.0). Shipped. |
| `docs/REFACTOR_COMPLETE.md` | Retrospective of the 2-day v5 → v6 modular refactor. |
| `docs/PHASE_N_PLAN.md` | Pre-execution plans saved during the refactor. Historical. |

---

## Editing

For any code change, read `CLAUDE.md` §25 first. The short version:

1. `git pull origin main`
2. Read `CLAUDE.md` and `WORKING_VERSIONS.md` top entry.
3. Produce a plan under `docs/` before touching code (for any non-trivial change).
4. Implement surgically.
5. Bump `APP_VERSION` in `app.html` + `CACHE_NAME` in `sw.js` + **every version surface in `index.html` and `README.md`** + `UPDATE_LOG.md` entry — see `CLAUDE.md` §12 "Version-bump checklist (mandatory)" for the full list of places to update on every bump.
6. Test on-device.
7. Tag `vX.Y.Z-working` + log in `WORKING_VERSIONS.md`.

Non-negotiables:

- **Zero dependencies.** No npm, no build step.
- **No renamed storage keys.** Shape changes happen via `migrations/registry.js` — see `CLAUDE.md` §24.
- **Offline-first.** Every new file goes into the `sw.js` cache list.
- **Mobile-first.** Tested at 375px width.
- **Byte-identity in refactors.** When moving code between files, verify the extracted content is byte-identical to the source.

---

## License

No license specified. Personal use.
