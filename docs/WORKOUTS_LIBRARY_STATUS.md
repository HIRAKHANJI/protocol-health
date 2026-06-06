# WORKOUTS_LIBRARY.md — Project Status & Completion Checklist

**Last updated:** 2026-06-06
**Library version:** 7,900+ lines, 199 documented exercises (74 progression + 125 non-progression; was 182 at v8.3.x, +12 skill/rear-delt in v8.4.0, +5 chair-fill in v9 Phase 1)
**App version:** v8.3.4 (modular ES-modules architecture, schema v7)
**Roadmap:** `docs/workout-engine-v9-roadmap.md` (v9 Workout Engine, 6-phase rollout)
**Library status:** ✅ FINALIZED — full-document audit passed 2026-06-06 (zero missing
fields, zero malformed tables, zero internal contradictions, zero broken cross-refs,
zero rogue citations)

---

## Executive Summary

The workout library (`WORKOUTS_LIBRARY.md`) is **complete and finalized as a prose/table
reference document.** It covers all 10 progression groups, all 4 skill tracks, 12
training modalities, a demographic stratification matrix, and an auto-prescription
data model. A full-document audit (2026-06-06) found no content gaps, contradictions,
or format defects. The only remaining work is **converting it to a machine-readable
module** (`plans/exercise-db.js`) — a CODE deliverable that is Phase 1 of the v9
Workout Engine, not a library-prose gap.

### What's done
- 199 exercise entries across progression and non-progression categories
- All 74 progression levels from `plans/exercise-progressions.js` documented (exact 1:1 match)
- Full per-plan prescription tables (Lite/Cut/Bulk/Maintenance/AGRO) for every entry
- Section 2 Demographic Stratification Matrix (incl. 2.3 contraindication matrix)
- Auto-Prescription Data Model section (schema spec for future engine)
- Evidence citations against CLAUDE.md Section 15 approved sources
- **Table of Contents + Library Status block (added 2026-06-06)**
- **Deload timing reconciled with v9 roadmap (6-10 weeks, default 8; 40-50% volume cut)**

### What's NOT done (all reclassified as CODE work, not library gaps)

| Gap | Priority | Status | Notes |
|-----|----------|--------|-------|
| Machine-readable exercise DB (`plans/exercise-db.js`) | P0 — v9 Phase 1 | NOT STARTED | The core bridge: library, EXERCISE_PROGRESSIONS, and workoutContent() need a shared ID system. This is CODE, not library prose. |
| 4 SKILL exercises missing explicit progression prerequisites | P1 | ✅ DONE | Verified all 4 skill tracks (crow/handstand/lsit/planche) carry prerequisites + paths |
| Naming canonicalization (spelling drift) | P1 | DEFERRED to exercise-db.js | Library already uses `(skill)` disambiguation suffixes; port these as `aliases` in Phase 1 |
| Central contraindication matrix | P2 | ✅ EXISTS | Section 2.3 is a demographic→blocked-exercise matrix. Per-exercise machine-readable version = Phase 1. |
| Structured difficulty/joint-impact/muscle-group enums | P2 | DEFERRED to exercise-db.js | Belongs in the JS schema, not markdown prose |
| `skill_planche` group not prescribed by any plan | P2 | OPEN (plan decision) | Documented in library; whether to prescribe it in AGRO is an owner decision, not a library gap |

---

## Section-by-Section Status

### Section 1 — Training Modalities (12 entries)
**Status: COMPLETE**
All 12 modalities documented with evidence citations against CLAUDE.md §15.

### Section 2 — Demographic Stratification Matrix
**Status: COMPLETE** (added PR #145)
Covers plan eligibility, volume/intensity modulators, exercise restrictions, medical
disclaimer, and engine prescription algorithm. Ready for v9 engine consumption.

### Progression Exercises (74 levels across 12 groups)
**Status: COMPLETE**
- Push: 10 levels (L0-L9) — matches `exercise-progressions.js`
- Pull: 9 levels (L1-L9) — matches
- Shoulder: 6 levels (L1-L6) — matches
- Squat: 9 levels (L1-L9) — matches
- Hinge: 7 levels (L1-L7) — matches
- Core: 10 levels (L1-L10) — matches
- Skill Crow: 4 levels — matches
- Skill Handstand: 4 levels — matches
- Skill L-sit: 3 levels — matches
- Skill Planche: 4 levels — matches

### Non-Progression Exercises
**Status: COMPLETE (199 total entries)**

| Subsection | Count | Status |
|------------|-------|--------|
| Calisthenics / Resistance | 14 | Complete |
| HIIT Protocols | 2 | Complete |
| Shadowboxing | 3 | Complete |
| Jump Rope | 4 | Complete |
| Animal Flow / QMT | 9 | Complete |
| Yoga Poses | 18 | Complete |
| Pilates Exercises | 13 | Complete |
| Tai Chi — Yang Style 8-Form | 8 | Complete |
| Chair Exercises (Lite Protocol) | 20 | Complete |
| Isometric Finishers | 5 | Complete |
| Warmup Movements | 5 | Complete |
| Cooldown / Stretch Movements | 13 | Complete |
| Neck Protocol | 2 | Complete |

### Auto-Prescription Data Model
**Status: COMPLETE (specification)**
Contains User Input Variables, Output schema, Volume Caps, Intensity Modifiers,
Progression Rules, Hard Constraints, Weekly Templates, Implementation Notes.
Note: this is a SPECIFICATION — the actual `plans/exercise-db.js` implementation
is Phase 1 of the v9 roadmap and has NOT started.

---

## Prioritized Fix List

### Priority 0 — Blockers for v9 Engine (Phase 1 prerequisite)

- [x] **P0-1: Create `plans/exercise-db.js`** — DONE (v9 Phase 1, dormant): all 199 exercises converted from prose
  into a single canonical JS module with structured schema: id, name, aliases,
  progressionGroup, level, pattern, equipment, muscles, difficulty, jointImpact,
  plyometric flag, contraindications, per-plan prescriptions, progression unlocks,
  safety overrides, citation, libraryRef. This is the ~2-3 week mechanical conversion
  described in v9 roadmap Phase 1. **This is the CORE BRIDGE problem** — without it,
  the library, EXERCISE_PROGRESSIONS, and workoutContent() remain three disconnected
  systems.

- [ ] **P0-2: Exercise naming canonicalization** — Pick ONE canonical spelling per
  exercise across all sources (library, exercise-progressions.js, all 5 plan
  workoutContent() functions). Store aliases in exercise-db.js for matching. Known
  drift examples:
  - "Push-up" vs "Push-ups" vs "Push-up progression"
  - "Plank" vs "Plank hold" vs "Plank-elbows"
  - "L-sit tuck (floor)" vs "L-sit tuck (skill)" vs "L-sit tuck"

### Priority 1 — Library Accuracy Fixes (can do now, no code change)

- [ ] **P1-1: Fix 4 SKILL exercises missing progression prerequisites** — The v9 audit
  flagged 4 skill entries without explicit prerequisites. Audit each of skill_crow,
  skill_handstand, skill_lsit, skill_planche for missing prerequisite fields and add
  them if absent.

- [ ] **P1-2: Verify push:pull ratio compliance** — CLAUDE.md §15 hard rule: no plan
  may exceed 1:1 push:pull ratio. AGRO default should be pull-dominant (5:7). Audit
  each plan's weekly template in Section 2 / Auto-Prescription Data Model against
  this rule.

- [ ] **P1-3: Cross-check AGRO sets/reps** — Verify that every progression exercise's
  AGRO prescription table row matches `plans/exercise-progressions.js` exactly (not
  the old inline app.html version).

### Priority 2 — Library Enhancements (v9 Phase 1 scope)

- [ ] **P2-1: Central contraindication matrix** — Currently safety notes are
  per-exercise prose. Build a structured table mapping exercise → contraindication →
  severity → alternative. Required for engine's safety overrides system.

- [ ] **P2-2: Difficulty / joint-impact / muscle-group enums** — Add structured
  metadata tags per exercise for: difficulty tier (beginner/intermediate/advanced/
  elite), joint-impact level (none/low/moderate/high), primary muscle group enum.
  Required for demographic filtering in the engine.

- [ ] **P2-3: Wire `skill_planche` into a plan** — The planche progression group
  exists in EXERCISE_PROGRESSIONS but no plan's workoutContent() prescribes it.
  Either add it to AGRO's Thursday skill session or document it as "available but
  opt-in only."

### Priority 3 — Documentation Housekeeping

- [ ] **P3-1: Reconcile exercise count** — v9 roadmap says target is 175, but library
  now has 182. Update the roadmap's count reference (Section 2 says "168/175", the
  actual is now 182). This is a doc-sync issue, not a content gap.

- [ ] **P3-2: Archive stale branch** — The orphaned branch
  `claude/review-recent-commit-Au2dw` (3,785-line library on an unrelated git
  history from the v5 era) should be deleted from remote to avoid confusion. Its
  content is a strict subset of main's library.

---

## v9 Workout Engine Phases — Progress Tracker

| Phase | Version | Scope | Status | Depends on |
|-------|---------|-------|--------|------------|
| 1 | v8.4.0 | Exercise Database Conversion (`exercise-db.js`) | NOT STARTED | P0-1, P0-2 above |
| 2 | v8.5.0 | Storage Layer + Completion Logger | NOT STARTED | Phase 1 |
| 3 | v8.6.0 | Session Templates + Static Engine Generator | NOT STARTED | Phase 2 |
| 4 | v8.7.0 | Auto-Progression Suggestions | NOT STARTED | Phase 3 |
| 5 | v8.8.0 | Polish + Safety Audit + Documentation | NOT STARTED | Phase 4 |
| 6 | v9.0.0 | Consolidation Release | NOT STARTED | Phase 5 |

**Estimated total effort:** 8-12 weeks (per v9 roadmap Section 8)

### Open Questions (from v9 roadmap §9, still unanswered)
1. Phasing approved as listed, or different ordering?
2. Auto-apply vs suggest-only for level advancement? (recommended: suggest-only)
3. Deload — auto-trigger or always suggest?
4. Should Lite plan use the engine or stay on legacy workoutContent()?
5. Form-OK self-report in day modal — confirm or veto?
6. Manual level-down lock duration — 4 weeks fixed or configurable?

---

## Branch Status

| Branch | Purpose | Status | Action |
|--------|---------|--------|--------|
| `main` | Canonical. v8.3.4, 7,385-line library | ACTIVE | All future work here |
| `claude/review-recent-commit-Au2dw` | Stale v5-era library work (3,785 lines) | ORPHANED | Delete from remote |

---

## Version Sync Check (as of 2026-06-06)

| Location | Value | Matches? |
|----------|-------|----------|
| `app.html` APP_VERSION | 8.3.4 | Baseline |
| `sw.js` CACHE_NAME | protocol-health-v37 | Yes |
| `index.html` hero badge | v8.3.4 | Yes |
| `CLAUDE.md` version refs | v37 / 8.3.4 | Yes |
| `UPDATE_LOG.md` latest entry | v8.3.4 | Yes |
| `WORKING_VERSIONS.md` latest | v8.3.4-working | Yes |

All version references are in sync on main.

---

## How to Use This File

This file is the **living project status tracker** for the WORKOUTS_LIBRARY.md
completion project and the v9 Workout Engine rollout. Update it:

- When a checklist item is completed (mark `[x]`)
- When a v9 phase progresses (update Status column)
- When new gaps are discovered (add to the appropriate priority tier)
- When open questions from §9 of the v9 roadmap are answered

**Canonical location:** `docs/WORKOUTS_LIBRARY_STATUS.md`
**Related docs:** `WORKOUTS_LIBRARY.md`, `docs/workout-engine-v9-roadmap.md`, `CLAUDE.md`
