# Workout Engine — v9.0.0 Roadmap

**Project name:** Workout Engine
**Target end-state version:** v9.0.0 (major — fundamentally changes how plans are delivered)
**Phasing:** 5 minor releases (v8.4.0 → v8.8.0) leading into the v9.0.0 consolidation
**Status:** Pre-plan, awaiting owner approval before any code work begins
**Last updated:** 2026-05-14

---

## 1. Context

Owner asked to take the existing `WORKOUTS_LIBRARY.md` and `EXERCISE_PROGRESSIONS` data and use it to drive an in-app **Workout Engine** that:

1. **Generates custom catered weekly workout plans** based on user's plan, current level per movement, equipment access, and protocol history.
2. **Auto-progresses level upward** when criteria are met (3 consecutive weeks at 90%+ target reps with clean form).
3. **Respects manual level-down** when the user signals they're not ready — but **only for that specific exercise**, not the whole engine. Other progressions continue advancing.
4. **Sources all programming rules from proper science** — ISSN consensus, PubMed/PMC peer-reviewed studies, NIH ODS fact sheets, WHO guidelines, NSCA standards. **Zero influencer / YouTube / commercial-program inputs.**
5. **Safety-first** — age, weight, sex, and injury filters per CLAUDE.md §15 Hard-Coded Safety Limits.

---

## 2. Audit findings (from 2026-05-14 four-agent audit)

> **UPDATE (2026-06-06):** The library has since been finalized. Current state:
> **182 documented exercises** (66 progression + 116 non-progression), 7,400+ lines.
> The dated gaps below have been **closed**: the 7 missing exercises were added
> (total now exceeds the old 175 target), all 4 skill tracks carry explicit
> progression prerequisites, and Section 2.3 provides a demographic→exercise
> contraindication matrix. The remaining items (machine-readable schema, per-exercise
> quantitative enums) are intentionally deferred to Phase 1 (`plans/exercise-db.js`) —
> they are CODE deliverables, not library-prose gaps. The snapshot below is preserved
> as the historical baseline; do not edit it.

### `WORKOUTS_LIBRARY.md` — 96% complete (snapshot 2026-05-14)

- **6,916 lines, 168/175 documented exercises** across 12 modalities
- All 10 progression groups (push, pull, shoulder, squat, hinge, core, skill_crow/handstand/lsit/planche) fully documented with per-plan prescription tables (LITE / CUT / BULK / MAINTENANCE / AGRO)
- All 12 modalities (Bodyweight Calisthenics, HIIT, Steady-State Cardio, Shadowboxing, Animal Flow, Yoga, Pilates, Isometric, Tempo, Jump Rope, Tai Chi, Chair) evidence-cited
- **Science citations are clean** — PubMed PMC IDs, ODS fact sheets, peer-reviewed journals (J Strength Cond Res, Front Sports Act Living, Front Public Health). Zero YouTube / influencer / commercial sources.

**Library gaps:**
- 7 exercises short of the 175 target (likely isometric variants, jump rope variations, shadowboxing modules)
- 4 SKILL exercises missing explicit progression prerequisites
- No structured machine-readable schema (it's prose + tables, not JSON)
- No central contraindication matrix (safety notes are per-exercise prose)
- No quantitative difficulty / joint-impact / muscle-group enums

### `plans/exercise-progressions.js` — fully wired for manual selection

- 10 groups, 66 distinct levels, all referenced from per-plan `workoutContent()` via `exRowWithLevel`
- Storage path works: user picks level → `SK.exLevels[dateStr][groupId]` → displayed on next render
- **What's missing for auto-progression:** completion logger (did user hit target reps?), historical aggregator, advancement rules engine, week planner

### `plans/{lite,agro,cut,bulk,maintenance}.js workoutContent()` — 115 unique exercises encoded as HTML strings

- Each plan has explicit MON–SUN session mapping in HTML
- **~45 prescribed exercises lack progression chains** — Animal Flow, Tai Chi, Yoga, Pilates, chair variations, neck protocol, running, shadowboxing, jump rope
- Naming drift: "Push-up" vs "Push-ups" vs "Push-up progression", "Plank" vs "Plank hold" vs "Plank-elbows"
- `skill_planche` group exists in progressions but **isn't prescribed by any plan**
- Tempo, rest, and progression criteria embedded in prose, not structured metadata

### Schema bridge gap (the core problem)

The library and the in-app prescriptions are **two parallel universes** that don't share an ID system:

- `WORKOUTS_LIBRARY.md` says "Wall push-up" with full per-plan prescription tables.
- `plans/agro.js workoutContent()` says "Push-ups Level 3×10-15" with a level selector pointing to `EXERCISE_PROGRESSIONS.push`.
- `EXERCISE_PROGRESSIONS.push.levels[2]` says `{ exercise: 'Standard push-up', sets: '3 × 12–15', notes: '...' }`.

There's **no canonical exercise ID** that connects these three sources. An engine that wants to know "what's the prescribed tempo for push level 2 on a BULK plan?" has to:

1. Read `EXERCISE_PROGRESSIONS.push.levels[2].exercise` → "Standard push-up"
2. String-match that against the library's per-plan prescription table
3. Hope the names line up (they don't always — see naming drift above)

**The first phase of the engine project has to fix this bridge before anything else.**

---

## 3. Scientific basis — sources only from approved tiers

Every programming rule in the engine cites a specific paper or consensus document from CLAUDE.md §15 Tier 1 URLs. No exceptions, no influencer inputs.

| Engine rule | Citation | Source URL |
|---|---|---|
| Hypertrophy: 10+ hard sets per muscle per week minimum | Schoenfeld 2017 dose-response meta-analysis | PMC 5371639 (referenced via ISSN 2018) |
| Hypertrophy: 5–30 rep ranges all build muscle when near failure | Schoenfeld 2021 repetition continuum | PMC 7927075 (CLAUDE.md §15 line 685) |
| Strength: 3–6 sets at 80–100% 1RM | NSCA position stand | (ISSN 2018 master review — PMC 6090881) |
| Frequency: 2–3× per muscle per week optimal for hypertrophy | Schoenfeld 2016 meta-analysis | PubMed 27102172 (referenced via ISSN 2018) |
| Eccentric tempo: 5+ sec for hypertrophy | Schoenfeld 2015 tempo review | PubMed 25601394 (CLAUDE.md §15 line 718) |
| Rest periods: 60–90s hypertrophy / 2–3min strength / 30–45s endurance | Henselmans & Schoenfeld 2014 | (ISSN 2018) |
| Bodyweight progression: rep & load both drive hypertrophy | Plotkin 2022 | PMC 9528903 (CLAUDE.md §15 line 686) |
| Push-up = bench press for hypertrophy ≤ 10RM | Kotarsky 2018 | PubMed 29466268 (CLAUDE.md §15 line 685) |
| Push:pull ratio ≤ 1:1 | Cools 2016 scapular stabilizers + Prinold 2016 pull-up kinematics | PMC 4886800 + PMC 4916995 (CLAUDE.md §15 lines 690-691) |
| HIIT vs MICT fat-loss equivalence | Schoenfeld 2021 (54-study meta) | PMC 7927075 (CLAUDE.md §15 line 695) |
| HIIT calorie burn ~30% higher per minute | ACE 2024 | acefitness.org (CLAUDE.md §15 line 696) |
| Walking 7K–10K steps/day all-cause mortality reduction | JAMA Network Open 2021 | doi.org/10.1001/jamanetworkopen.2021.24516 (CLAUDE.md §15 line 736) |
| Elderly: multicomponent exercise 2+ days/week resistance | ICFSR 2021 / 2025 | doi.org/10.14283/jfa.2021.2 + PubMed 39743381 |
| Elderly protein: 1.0–1.2 g/kg minimum | Deutz et al. 2014 | doi.org/10.1016/j.clnu.2013.11.020 |
| Bulk protein: 1.6–2.2 g/kg, per-meal 0.40–0.55 g/kg | Iraki et al. 2019 | PMC 6680710 |
| Creatine: 3–5 g/day no loading | ISSN 2018 master review | PMC 6090881 |
| Deload week: drop volume 40–50% every 6–10 weeks | NSCA periodization standards | (cross-ref ISSN 2018) |
| Yoga + Pilates: functional autonomy, balance, flexibility | PMC 8038747, PMC 11447755 | (CLAUDE.md §15 lines 712–714) |
| Tai Chi: 24% fall-risk reduction (24-RCT meta) | Chen 2023 | doi.org/10.3389/fpubh.2023.1112250 |
| Animal Flow / QMT: 8-week RCT improved FMS, ROM, balance | Buxton 2022 | PubMed 33136774 |
| Jump rope: 8-week RCT improved body composition + BP | PMC 8467906 |
| Shadowboxing: 3-week aerobic + body comp + bone mass gains | Croom 2023 | doi.org/10.34256/ijpefs2322 |

**Banned sources** (explicit per CLAUDE.md §15 line 776): supplement brand sites, influencer stacks, commercial programs, single case reports, news-about-research articles.

---

## 4. Architecture — data layer

The engine sits on top of three new structured-data modules and one new SK key.

### `plans/exercise-db.js` (new — replaces ad-hoc text references)

A single canonical exercise database. Every exercise prescribed by any plan, plus every modality move, gets an entry.

```js
export const EXERCISE_DB = {
  'push-l0-wall-pushup': {
    id: 'push-l0-wall-pushup',
    name: 'Wall push-up',
    canonicalName: 'Wall Push-up',
    aliases: ['wall pushup', 'wall push up'],
    progressionGroup: 'push',
    level: 0,
    pattern: 'push',           // push | pull | squat | hinge | core | skill | mobility | conditioning
    equipment: [],              // empty array = bodyweight; or ['chair', 'band', 'towel', 'wall']
    primaryMuscles: ['anterior_deltoid', 'triceps', 'pectoralis_major'],
    secondaryMuscles: ['serratus_anterior'],
    difficultyScore: 1,         // 1–10 normalized across all exercises
    jointImpact: 'low',         // low | medium | high
    plyometric: false,
    contraindications: [],      // [] or ['wrist_pain', 'shoulder_impingement', 'low_back_pain', ...]
    prescriptions: {
      lite:        null,                            // null = not used by this plan
      cut:         { sets: 3, reps: [10, 15], tempo: 'normal', rest: 60 },
      bulk:        { sets: 4, reps: [12, 15], tempo: '3-1-2-0', rest: 90 },
      maintenance: { sets: 3, reps: [10, 15], tempo: 'normal', rest: 60 },
      agro:        { sets: 3, reps: [10, 15], tempo: 'normal', rest: 45 }
    },
    progression: {
      unlocks: 'push-l1-knee-pushup',               // next level
      criteria: 'level-rule-default'                // see §6 below
    },
    safetyOverrides: {
      'age>65':    'lock',                          // never auto-prescribe
      'weight>120':'lock',
      'weight>100':'allow',                          // ok (it's a wall push-up)
      'female':    null                              // no rep adjustment for L0
    },
    citation: 'PMC 7927075 (Schoenfeld 2021 repetition continuum)',
    libraryRef: 'WORKOUTS_LIBRARY.md:#push-l0-wall-pushup'
  },
  // ... 182 total entries
};
```

**Why this is necessary:** the current state has the same exercise described in three places (library, progressions, plan workoutContent) with three different spellings and no shared ID. An engine can't generate a plan without a single source of truth.

### `plans/session-templates.js` (new)

Each plan's weekly skeleton encoded as queryable structure (replaces the per-plan HTML-string `workoutContent()`).

```js
export const SESSION_TEMPLATES = {
  cut: {
    weekly: [
      { day: 1, name: 'Upper Body Resistance',  archetype: 'resistance-upper', duration: 35 },
      { day: 2, name: 'HIIT or Shadowboxing',   archetype: 'conditioning',     duration: 22 },
      { day: 3, name: 'Active Recovery',         archetype: 'recovery',         duration: 35 },
      { day: 4, name: 'Lower Body Resistance',   archetype: 'resistance-lower', duration: 35 },
      { day: 5, name: 'HIIT Circuit B',          archetype: 'conditioning',     duration: 22 },
      { day: 6, name: 'Full Body + Core',        archetype: 'resistance-fullbody', duration: 35 },
      { day: 7, name: 'Rest',                    archetype: 'rest',             duration: 0 }
    ]
  },
  // ... agro, bulk, maintenance, lite
};
```

Each `archetype` maps to an exercise-selection rule (e.g., `resistance-upper` = 1 push + 1 pull + 1 shoulder + 1 isolation pair + 1 core). The engine reads the archetype, picks exercises from `EXERCISE_DB` at the user's current level for each progression group.

### `modules/workout-engine.js` (new)

The brain.

```js
// Generate this week's session plan for a user
export function generateWeek(plan, userState) { ... }

// After a session, log completion and run progression rules
export function logSessionCompletion(dateStr, sessionId, exerciseResults) { ... }

// Decide if any progression group should advance / regress based on history
export function evaluateProgressions(userState) { ... }

// Manual level-down — scoped to a single group, doesn't reset others
export function lockExerciseLevel(groupId, level, reason) { ... }
```

### New SK keys

| Key | Storage | Purpose |
|---|---|---|
| `ph_xc_v1` | `SK.exerciseCompletion` | Per-session completion log: `{ "YYYY-MM-DD": { sessionId, exerciseResults: [{ exId, targetReps, actualReps, formOk }] } }` |
| `ph_lk_v1` | `SK.exerciseLevelLocks` | Manual locks: `{ groupId: { level, lockedAt, reason } }` — prevents auto-advance until cleared |
| `ph_pe_v1` | `SK.progressionEvents` | Audit log: `[{ groupId, fromLevel, toLevel, ts, trigger: 'auto-up' | 'auto-deload' | 'manual-down' | 'manual-up' }]` (capped at 200) |

All additive, no migration of existing keys. Migration v7 → v8 registers the three new keys (no-op data transform).

---

## 5. Architecture — UI layer

### Existing UI surface (kept)

- **WORKOUTS tab** — replaced with engine-generated week view (see below)
- **Day modal `Exercise level` selector** — kept, but now also surfaces the engine's "suggested next level" inline
- **TODAY tab checklist** — unchanged; engine writes its session items into the same checklist

### New UI surfaces

**WORKOUTS tab — week view (replaces current static workoutContent HTML)**

- Top row: 7 day chips (Mon–Sun) with today highlighted
- Day card: each session's exercises rendered from `EXERCISE_DB` lookups
- Per-exercise row: name · level chip · sets × reps · tempo · rest · ✓ done toggle · "Drop a level" button
- Footer: "WEEKLY PROGRESS — push: 3/3 sessions, target reps 92%" etc.

**Settings → WORKOUT ENGINE section (new)**

- ENGINE ON / OFF toggle (off = legacy static workoutContent fallback)
- Auto-progression toggle (default: suggest, don't auto-apply)
- "Show me what's pending advancement" panel — lists groups meeting criteria, owner taps APPLY per group
- Reset locks button — clears all `exerciseLevelLocks`

**Day modal — exercise feedback row (extended)**

When the user opens a past day's modal:
- Existing "level" selector kept
- New "form was rough today" toggle — sets `formOk: false` on that day's completions, which counts against auto-advance criteria
- New "I want to drop a level on X" inline button — calls `lockExerciseLevel(...)` directly from day modal

---

## 6. Progression rules engine

### Auto level-up criteria (default)

A progression group becomes eligible for auto-advancement when **all** of these are true:

1. The user has completed **≥ 3 consecutive weeks** where that group was prescribed.
2. In those weeks, **≥ 90% of prescribed sets hit the target rep range** (top of range counts as success).
3. **Form-OK flag is true on ≥ 85% of sessions** in the window (user didn't mark "form was rough").
4. **No deload week** is currently scheduled (deload weeks freeze advancement).
5. **No lock is active** on that group via `SK.exerciseLevelLocks`.

If all true → engine surfaces a banner "PUSH is ready to advance to Level 4 (Decline push-up). [APPLY] or [HOLD HERE]." Auto-apply is off by default — owner approves explicitly.

Source: ISSN 2018 (PMC 6090881) consensus on progressive overload + Plotkin 2022 (PMC 9528903) showing rep-progression equivalent to load-progression for hypertrophy.

### Manual level-down (scoped, owner-driven)

Owner taps "Drop a level on PUSH" from any of three surfaces (WORKOUTS tab, day modal, settings):

1. `lockExerciseLevel('push', currentLevel - 1, 'manual-down')` is called.
2. `SK.exerciseLevelLocks.push = { level: 3, lockedAt: now, reason: 'manual-down' }`.
3. Engine immediately prescribes the lower level for the next session in that group.
4. **All other groups continue advancing normally** — lock is scoped to one `groupId`.
5. Lock auto-clears after **4 weeks** OR when owner taps "remove lock" in Settings.

Source: NSCA periodization standards — backing off a movement temporarily while progressing others is well-established. Cited via ISSN 2018.

### Auto deload (every 6–10 weeks OR triggered)

A deload week drops volume by 40–50% across all groups. Triggered by either:

1. **Scheduled:** every 6–10 weeks of consecutive training (configurable, default 8).
2. **Triggered:** 2 consecutive sessions in a group where actual reps < 50% of target → that group gets an immediate 1-level deload + 1-week reduced volume.

Source: NSCA periodization + Helms 2014 (referenced in CLAUDE.md §15 line 743).

### Safety overrides (always win)

These run before progression logic and can never be overridden by criteria meeting:

- **Age > 65** → all exercises locked to LITE Protocol (chair-based + tai chi + yoga). No HIIT, no plyometrics, no advanced skills.
- **Age > 50** → high-jointimpact exercises default to lower-difficulty variants (e.g., jump squat → fast bodyweight squat).
- **Weight > 120 kg** → locked to LITE Protocol.
- **Weight > 100 kg** → plyometrics blocked; substitute non-jumping variants from `EXERCISE_DB`.
- **Female sex** → upper-body rep targets reduced by 2, lower-body increased by 2 (per CLAUDE.md §15 generalization).
- **Push:pull ratio** — engine never generates a week where push sets > pull sets. Hard cap.
- **Injury flags** (future `SK.injuries`) — block exercises whose `contraindications` array matches.

Sources for the limits are documented in CLAUDE.md §15 lines 752–770. Engine refuses to ship a session that violates any.

---

## 7. Phased rollout

Each phase is a minor release with smoke + tag + log per CLAUDE.md §11. Final phase consolidates to v9.0.0.

### Phase 1 — `v8.4.0` — Exercise Database Conversion

**Scope:** Convert `WORKOUTS_LIBRARY.md` + `EXERCISE_PROGRESSIONS` + `workoutContent()` prescriptions into the single canonical `plans/exercise-db.js` module. **No UI changes, no engine logic, no behaviour change.**

- Create `plans/exercise-db.js` with full schema for all 182 exercises (library now finalized — the 7 previously-missing exercises were added 2026-06-06)
- Each exercise has: id, name, aliases, progressionGroup, level, pattern, equipment, muscles, difficulty, jointImpact, plyometric flag, contraindications, per-plan prescriptions, progression unlocks, safety overrides, citation, libraryRef
- ~~Migrate the 7 missing exercises~~ — DONE (library at 182, exceeds old 175 target)
- ~~Add explicit progression prerequisites to the 4 SKILL exercises~~ — DONE (all 4 skill tracks carry prerequisites + paths)
- Naming canonicalisation: pick one spelling per exercise, store aliases for matching (library already uses `(skill)` disambiguation suffixes — port these as aliases)
- Build the machine-readable per-exercise contraindication matrix (Section 2.3's demographic matrix is the prose source)
- Add machine-readable safety overrides per exercise

**Verification:** unit-test-style assertions in a one-off script that confirms every exercise prescribed in current `workoutContent()` HTML maps cleanly to an `EXERCISE_DB` entry via name or alias.

**Risk:** Low. Pure data structure, no consumer yet. Existing UI still uses the HTML prescriptions verbatim.

**Estimated effort:** 2–3 weeks of structured data entry. Most of this is mechanical conversion from the existing prose library.

### Phase 2 — `v8.5.0` — Storage Layer + Completion Logger

**Scope:** Add the three new SK keys + completion logger backend. UI surfaces a "log completion" toggle per exercise in the day modal but doesn't drive any progression yet.

- Migration v7 → v8: register `SK.exerciseCompletion`, `SK.exerciseLevelLocks`, `SK.progressionEvents` (no-op data transform — additive)
- Day modal gets a per-exercise "actual reps" input next to "target reps" + a "form ok" toggle
- TODAY tab inherits the same input for live logging
- Helper functions: `logExerciseResult(dateStr, exId, actualReps, formOk)`, `getCompletionHistory(groupId, weeks)`, `lockExerciseLevel(groupId, level, reason)`, `clearLock(groupId)`
- Settings → WORKOUT ENGINE section appears with the per-group "manual lock" controls

**Verification:** owner logs 3 sessions across a week, opens TRACK tab → new "WORKOUT HISTORY" card shows the data. Locks visible in Settings.

**Risk:** Low. Pure additive storage.

**Estimated effort:** 1 week.

### Phase 3 — `v8.6.0` — Session Templates + Static Engine Generator

**Scope:** Build `plans/session-templates.js` + a static (rule-based, no auto-progression) `generateWeek()` in `modules/workout-engine.js`. Hook it into the WORKOUTS tab behind a feature flag.

- `session-templates.js` codifies each plan's weekly skeleton as queryable structure
- `generateWeek(plan, userLevels)` reads templates + EXERCISE_DB + current levels → returns the week's session list
- WORKOUTS tab gets a "USE ENGINE" toggle (default off). When on, renders engine output instead of static HTML. When off, legacy `workoutContent()` still runs.
- Engine output rendered via a new `components/engine-session.js` component
- Safety overrides applied here — age/weight/sex/contraindications filter the exercise selection

**Verification:** owner toggles engine on, sees this week's plan rendered from EXERCISE_DB. Disables toggle, sees legacy HTML. No data corruption.

**Risk:** Medium. New UI path. Mitigation: feature flag + legacy path preserved.

**Estimated effort:** 2 weeks.

### Phase 4 — `v8.7.0` — Auto-Progression Suggestions

**Scope:** `evaluateProgressions(userState)` runs at app init, checks completion history against advancement criteria, and surfaces suggestions. Auto-apply is **off** — suggestions only, owner taps APPLY.

- Banner on TODAY tab when any group is eligible: "PUSH ready to advance to Level 4 — APPLY or HOLD"
- WORKOUTS tab footer shows weekly progress per group with % of target reps hit
- Deload detection runs but only suggests, doesn't auto-trigger
- Manual level-down via Drop button works end-to-end; engine re-prescribes the lower level on next render

**Verification:** owner runs through 3 weeks of logging. After week 3 the engine surfaces a "ready to advance" banner. Owner approves; level advances; next week's session uses the new level.

**Risk:** Medium. Behavioural surface. Mitigation: suggest-not-auto-apply.

**Estimated effort:** 1.5 weeks.

### Phase 5 — `v8.8.0` — Polish + Safety Audit + Documentation

**Scope:** Final QoL pass, comprehensive safety audit, science-citation cross-check, full WORKOUTS_LIBRARY.md update with the new schema.

- Cross-check every advancement / regression rule against the cited paper — agent audit
- Cross-check every exercise's contraindications matrix against safety literature
- Update `WORKOUTS_LIBRARY.md` to use canonical IDs + structured per-exercise tables
- Update `CLAUDE.md` §16 with the new engine architecture + a §27 "Workout Engine Reference"
- UPDATE_LOG entry consolidating the full project
- Owner does an end-to-end smoke pass: 4-week dummy run with deliberate level-up and level-down events

**Verification:** owner-confirmed smoke pass. All audit findings cleared.

**Risk:** Low. Polish + docs.

**Estimated effort:** 1 week.

### Phase 6 — `v9.0.0` — Consolidation Release

**Scope:** Feature-flag removed, engine is the default, legacy `workoutContent()` paths removed from active plans. Banner announces v9.0.0. WORKING_VERSIONS entry.

- Remove the "USE ENGINE" toggle (engine is always on)
- Remove the legacy `workoutContent()` exports from `plans/*.js` (engine fully replaces them — though library prose is kept in `WORKOUTS_LIBRARY.md`)
- Final smoke + tag `v9.0.0-working`
- UPDATE_LOG consolidation, full session retrospective

**Risk:** Medium — feature flag removal. Mitigation: by this point Phases 1–5 have been in production for weeks; engine is proven.

**Estimated effort:** 0.5 weeks.

---

## 8. Total scope estimate

| Phase | Version | Effort | Cumulative |
|---|---|---|---|
| Phase 1 — Exercise DB | v8.4.0 | 2–3 weeks | 2–3 weeks |
| Phase 2 — Storage + completion logger | v8.5.0 | 1 week | 3–4 weeks |
| Phase 3 — Engine generator + WORKOUTS tab | v8.6.0 | 2 weeks | 5–6 weeks |
| Phase 4 — Auto-progression suggestions | v8.7.0 | 1.5 weeks | 6.5–7.5 weeks |
| Phase 5 — Polish + audit | v8.8.0 | 1 week | 7.5–8.5 weeks |
| Phase 6 — Consolidation | v9.0.0 | 0.5 weeks | **~8 weeks total** |

This is a substantial project. The biggest single time sink is Phase 1 — the data entry to convert 182 exercises into structured form with all the metadata each one needs. That phase has the highest scope risk because every gap discovered downstream forces a return to Phase 1 to fill it in.

---

## 9. Open questions for owner before any code work begins

1. **Phasing approved as listed, or different ordering preferred?** (Some Phase 2 work could move earlier if you want completion logging without the full DB.)
2. **Auto-apply vs suggest-only for level advancement** — recommended default is suggest-only with explicit APPLY tap. Confirm.
3. **Deload — auto-trigger or always suggest?** Recommended: auto-trigger after 2 consecutive failed sessions (immediate safety), scheduled deloads suggest-only.
4. **Should `lite` plan use the engine?** It currently uses chair exercises that don't map cleanly to the push/pull/squat/hinge/core progression groups. Options: (a) build chair-specific progressions and engine handles it, (b) Lite stays on legacy `workoutContent()` and engine only drives the 4 progression-heavy plans.
5. **Form-OK self-report** — recommended addition to day modal. Confirm or veto.
6. **Manual level-down lock duration** — recommended 4 weeks. Configurable in Settings? Or fixed?
7. **`PENDING_IMPLEMENTATIONS.md` style roadmap file for this project** — deleted that one because the project was complete. This roadmap will live at `docs/workout-engine-v9-roadmap.md` as the canonical reference until v9.0.0 ships.

---

## 10. What this plan deliberately does NOT do

- Does not add a single new exercise modality not already in `WORKOUTS_LIBRARY.md` — the 12 modalities are complete.
- Does not change `WORKOUTS_LIBRARY.md` prose content during Phase 1 — only adds canonical IDs and per-exercise structured-data front-matter. Library prose stays human-readable.
- Does not introduce any source not in CLAUDE.md §15 Tier 1 URLs. Every new rule cites an approved paper.
- Does not change calorie targets, calibration math, TDEE, schedule, day logs, weight logs, food log, fast/light sessions, or any other non-workout system.
- Does not touch the existing plans' nutrition or rules content — `nutritionContent()` and `rulesContent()` are unaffected.
- Does not auto-apply level advancements without explicit owner approval (Phase 4 setting can change this, but default is suggest-only).
- Does not enable the engine without an opt-in toggle until Phase 6 (v9.0.0).

---

## 11. Rollback contract

Each phase has its own `vX.Y.Z-working` tag per CLAUDE.md §11. If any phase introduces regressions:

- **Phase 1:** rollback removes `plans/exercise-db.js`; no other consumers yet; safe.
- **Phase 2:** rollback removes new SK keys; existing dayLogs unaffected; migration v7→v8 has explicit reverse() function.
- **Phase 3:** rollback removes engine toggle + session-templates; legacy `workoutContent()` already working; safe.
- **Phase 4:** rollback removes progression suggestions; user's manual level controls still work; safe.
- **Phase 5/6:** rollback to Phase 4 working tag — engine remains opt-in but suggestions/auto-progression disabled.

All phases preserve existing data — engine never writes to `dayLogs`, `weights`, `foodLog`, `fastSessions`, etc. Only the three new keys.

---

*End of roadmap. Awaiting owner approval before any code work begins.*
