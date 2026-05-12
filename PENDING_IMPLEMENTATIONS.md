# Pending Implementations — Calibration & Stability Roadmap

> **📜 HISTORICAL — ✅ PROJECT CLOSED 2026-04-28. DO NOT FOLLOW INSTRUCTIONS BELOW AS IF ACTIVE.**
>
> All 13 phases of the original calibration & stability roadmap shipped and merged at v7.8.1. Closed out with cache bump v26 → v27 on 2026-04-28. Subsequent calibration-related fixes (v7.9.0 TDEE accuracy upgrade, v7.10.0 calibration off-by-one, v7.10.1–v7.10.3 micro-patches, v8.0.0 audit fixes) ship via the normal release process documented in `CLAUDE.md` §§11–12 — **not** through this file.
>
> The "How to use this file" section below describes the rules that governed Claude Code sessions DURING the project. They are kept verbatim for audit trail. **Do not interpret them as live instructions.** For current code-change procedure, see `CLAUDE.md` §25 "Working With This Codebase".

**Status:** ✅ **PROJECT COMPLETED** (2026-04-28). All 13 phases shipped and merged. End state: APP_VERSION 7.8.1, schemaVersion 5, 4 migrations applied. Closed-out cache bump (CACHE_NAME v26 → v27) shipped 2026-04-28 to invalidate stale installed-PWA caches that had been frozen at v7.1.0.

**This file is now historical.** No further phases. CLAUDE.md no longer references this document. Retained for audit trail only.

**Source of truth for all post-v7.1.0 calibration/stability work** (during the project's active period, Mar–Apr 2026). Created 2026-04-28 as the closing snapshot.

---

## How to use this file [HISTORICAL — describes rules during the active project, Mar–Apr 2026]

This document **was** the only task list Claude followed when asked to "continue", "implement", "work", "proceed", "do the next phase", or any equivalent prompt about the calibration/stability project. The project is closed; the rules below no longer apply to current work.

### Rules (non-negotiable) [during the active project — historical]

1. **Read this file before every action.** Find the next phase whose status is `PENDING`. Implement only that phase. Do not skip ahead. Do not bundle phases.
2. **One phase per session, one commit per phase.** No multi-phase commits. No "while we're in here" extra changes.
3. **Each phase ends with a stop point.** After commit + push, report completion to the owner and wait for confirmation that the PR has been manually merged before moving to the next phase.
4. **Mark completed phases at the top of the phase entry** with `✅ COMPLETED — DO NOT MODIFY`, the merge commit hash, the date, and APP_VERSION. **Never edit the body of a completed phase.** Never re-order completed phases.
5. **Specify the next phase clearly** in the post-completion report — include phase number, title, scope summary, and ask permission to begin.
6. **Pull details from this file only.** Do not invent additional scope. If the owner requests a change to a phase, edit this file (in pending phases only) before coding.
7. **Each phase commit message must reference its phase number** (e.g. `Phase 3: Per-plan calorie safety floors`).
8. **Branch convention.** All work continues on `claude/add-workout-exercises-KjRRh`. After the owner merges a phase PR to `main`, sync the branch (`git fetch origin && git merge origin/main`) before starting the next phase.
9. **Service worker.** Only bump `CACHE_NAME` and add new files to the cache list as part of the phase that introduces them; do not batch sw.js changes.
10. **Migrations.** Each phase that requires a schema migration declares so explicitly. Migrations are sequential and append-only; never rename or remove existing migrations.

### Status legend

| Status | Meaning |
|---|---|
| `PENDING` | Not yet started. Open for implementation. |
| `IN PROGRESS` | Currently being worked on (set when implementation starts; cleared on commit). |
| `✅ COMPLETED — DO NOT MODIFY` | Shipped, owner-confirmed merge, frozen. Header pinned with merge hash + date + version. |

---

## Source map (where each phase comes from)

This roadmap descends from the comprehensive insight report delivered 2026-04-28. The four tiers in that report mapped to 16 individual fixes; those 16 are organised into 13 phases here, ordered by **risk-ascending then dependency-driven** so each phase compiles on top of the previous one without rework.

| Tier | Items in tier | Phases that ship them |
|---|---|---|
| Tier 1 — display & UX clarity | 1, 2, 3, 4 | Phase 1, Phase 2 |
| Tier 3 — safety/polish | 10, 11, 12, 13 | Phase 3, Phase 7, Phase 10, Phase 11 |
| Tier 2 — algorithm robustness | 5, 6, 7, 8, 9 | Phase 4, Phase 6, Phase 8, Phase 9 |
| Tier 4 — strategic | 14, 15, 16 | Phase 5, Phase 12, Phase 13 |

Final state after Phase 13: `APP_VERSION ≈ 7.7.x`, `CACHE_NAME ≈ v32-34`, `schemaVersion ≈ 5`. No major version bump required (rollover rule remains intact).

---

## Phase 1 — Reality Check Display Clarity

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `3647302` (PR #119)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.2.0`
**Tier source:** Tier 1, items 1-3
**APP_VERSION target:** `7.2.0` (minor — visible UI improvement, banner shown)
**CACHE_NAME bump:** Yes — must bump on next merge to main even though no new files are added (pure logic update inside an existing file).
**Migration:** None.

### Goal

Make the Reality Check block on the TRACK tab understandable to a human. The math is correct (verified against owner's backup); only the labelling and explanation are confusing.

### Scope

1. **Split the "Avg intake" line** into two distinct values:
   - `Period avg: X cal/day` (current single value across all included days)
   - `Eating-day avg: Y cal/day` (sum of intake on non-fast eating days only ÷ count of those days)
   - `Fast days: N of M` (counter showing how much of the average is being pulled toward 0 by fasts)

2. **Show calibration cadence status** under "Currently using":
   - If `lastCalibrationAt` is within 7 days: `Next check in N days (DD MMM)`
   - If last run rejected by sanity bounds: `Last run rejected — observed value [X cal] outside safe range`
   - If state is GATHERING: `Calibration gathers data — needs N more days`

3. **Add an "ⓘ Explain" link** next to the Reality Check title that opens a popup-overlay modal with plain-English interpretation:
   - What "predicted vs actual" means
   - Why observed TDEE can differ from formula
   - When/why calibration applies vs skips
   - One paragraph per concept, no jargon

### Files touched

- `modules/calibration.js` — extend `getCalibrationStatus()` to also compute `eatingDayAvg`, `fastDayCount`, `nextCalibrationAt`, `lastCalibrationStatus` (`'applied' | 'rejected' | 'within-threshold' | 'gathering'`); rewrite `renderRealityCheck()` to render the split lines + cadence note + Explain link.
- `app.html` — add `<div id="realityExplainModal">` markup using the existing `popup-overlay` class (z-index 9100); register `openRealityExplain()` / `closeRealityExplain()` to `window`. Add CSS for the `.rc-cadence-note`, `.rc-fast-count`, `.rc-explain-btn` classes.

### Smoke test

1. TRACK tab opens, Reality Check block renders.
2. With owner's current data: shows `Eating-day avg: ~1112 cal`, `Period avg: ~812 cal`, `Fast days: 6 of 13`.
3. Cadence note reads `Next check in 5 days` (or whatever maths to from `lastCalibrationAt`).
4. Tapping ⓘ Explain opens modal; Cancel closes it.
5. No console errors; previously-displayed numbers unchanged in value, only re-grouped.

### Acceptance criteria

- [ ] Eating-day avg + period avg + fast-day count all visible
- [ ] Cadence note correct against `lastCalibrationAt`
- [ ] Explain modal opens, scrolls on small screens, closes cleanly
- [ ] No regression in formula/observed/blended numbers
- [ ] Math unchanged (no new estimation behaviour, only display)

### Risk

**Very low.** Pure rendering change inside one module + one new modal. No math change, no storage change, no new dispatch event.

---

## Phase 2 — Quick-Access ADJUST in Settings

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `d34775f` (PR #120)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.2.1`
**Tier source:** Tier 1, item 4
**APP_VERSION target:** `7.2.1` (patch — small UI add)
**CACHE_NAME bump:** No (sw.js untouched on feature branch; bumps with Phase 3 if available, otherwise on next merge to main).
**Migration:** None.

### Goal

Surface the existing `MANAGE SCHEDULE → ADJUST` path from the Settings panel so the owner can adjust an active schedule without leaving Settings.

### Scope

1. Inside the Settings panel goal-calculator section, when a schedule is active, render a compact link/button: `↗ ADJUST CURRENT SCHEDULE`.
2. Tapping it closes Settings and opens the existing Manage Schedule modal directly to ADJUST mode (pre-fills target + calorie inputs from current settings).
3. When no schedule is active, show nothing (no dead button).

### Files touched

- `app.html` — settings panel HTML: insert link near the goal-calculator section. Hook calls `openSettings → openManageSchedule(true)` (the boolean indicates "open ADJUST tab pre-filled"). Update `openManageSchedule` to accept this argument.

### Smoke test

1. Settings panel: when no schedule exists, the ADJUST link is absent.
2. Settings panel: when a schedule exists, link appears.
3. Tapping it closes Settings and opens Manage Schedule on ADJUST tab with target/calorie inputs pre-filled from current settings.
4. ADJUST behaviour unchanged from current behaviour.

### Acceptance criteria

- [ ] Link visible only when schedule active
- [ ] Tap closes Settings, opens Manage Schedule
- [ ] ADJUST inputs pre-filled correctly
- [ ] No regression in existing Manage Schedule flow

### Risk

**Very low.** Single new link + small refactor of an existing function signature.

---

## Phase 3 — Per-Plan Calorie Safety Floors / Bands

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `d809711` (PR #121)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.2.2`
**Tier source:** Tier 3, item 10
**APP_VERSION target:** `7.2.2` (patch — non-blocking validation)
**CACHE_NAME bump:** Yes (next merge to main).
**Migration:** None.

### Goal

Surface non-blocking warnings when the user enters a calorie ceiling outside the safe range for their active plan. The semantics differ by plan direction (cut, bulk, maintenance) — see the table below. Warnings only; never blocks computation.

### Plan direction model

| Plan | `goalMode` | Safety logic |
|---|---|---|
| LITE | `cut` | Hard floor: `1200 cal/day`. Warn if ceiling below floor. |
| AGRO | `cut` | Hard floor: `800 cal/day` (plan ceiling 1000; absolute safety floor 800). Warn if ceiling below floor. |
| CUT | `cut` | Hard floor: `1400 cal/day` (Helms 2014: ≥1.5 × BMR). Warn if ceiling below floor. |
| BULK | `bulk` | Soft floor: `TDEE` (going below = accidental cut on a bulk plan). Warn if ceiling ≤ TDEE. |
| MAINTENANCE | `maintenance` | Band: `TDEE ± 300 cal`. Warn if abs(ceiling − TDEE) > 300. |

### Scope

1. **Add fields to each plan object in `plans/*.js`:**
   - `lite.js`: `minCalories: 1200`, `caloriesMode: 'floor'`
   - `agro.js`: `minCalories: 800`, `caloriesMode: 'floor'`
   - `cut.js`: `minCalories: 1400`, `caloriesMode: 'floor'`
   - `bulk.js`: `minCalories: null` (computed at validation: returns TDEE), `caloriesMode: 'above-tdee'`
   - `maintenance.js`: `minCalories: null` (computed: TDEE − 300), `maxCalories: null` (computed: TDEE + 300), `caloriesMode: 'tdee-band'`
   The `caloriesMode` discriminator lets validators dispatch on plan type without hardcoding plan keys.

2. **Validation helper in `app.html`:** `validateCaloriesAgainstPlan(cals, plan, tdee)` returns `{ ok: bool, severity: 'ok'|'warn'|'critical', message: string }`. Modes:
   - `'floor'`: warn if `cals < plan.minCalories`. Message references the plan's floor + medical-supervision note.
   - `'above-tdee'`: warn if `cals <= tdee`. Message: "On a BULK plan, ceiling should be above TDEE; otherwise you're cutting."
   - `'tdee-band'`: warn if `abs(cals - tdee) > 300`. Message: "MAINTENANCE keeps you within ±300 cal of TDEE."

3. **Wire warnings into:**
   - `calcDuration()` result panel — append warning under existing risk flags. Non-blocking.
   - Settings calorie field — show floor/band hint as live caption: `Floor for ${planName}: 1200 cal` / `Above TDEE (${tdee} cal) for BULK` / `Band: ${tdee-300}–${tdee+300} for MAINTENANCE`.

### Files touched

- `plans/lite.js`, `plans/agro.js`, `plans/cut.js`, `plans/bulk.js`, `plans/maintenance.js` — add `minCalories`/`maxCalories`/`caloriesMode` fields.
- `app.html` — `validateCaloriesAgainstPlan` helper; warning render in `calcDuration`; live hint in `openSettings`; CSS for `.cal-floor-warn`.

### Smoke test

1. AGRO plan: enter 700 cal → soft warning ("below 800 floor"). Enter 1000 → no warning.
2. CUT plan: enter 1200 → warning ("below 1400 floor"). Enter 1500 → no warning.
3. BULK plan with TDEE 3000: enter 2900 → warning ("ceiling at/below TDEE — accidental cut"). Enter 3300 → no warning.
4. MAINTENANCE plan with TDEE 2500: enter 2100 → warning ("outside ±300 band"). Enter 2400 → no warning.
5. Goal calculator never blocks; result still computed and shown.
6. Settings calorie field shows correct hint per plan.

### Acceptance criteria

- [ ] All 5 plans declare appropriate `caloriesMode` + threshold field(s)
- [ ] Validator dispatches correctly on mode (no hardcoded plan keys outside the helper)
- [ ] Warning is non-blocking
- [ ] Warning text plan-specific and clear
- [ ] Settings hint matches plan mode

### Risk

**Low.** Additive plan fields; existing readers ignore unknown fields. Validator only emits messages.

---

## Phase 4 — Spike-Trim Port to Radar + ADJUST

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `ac7b051` (PR #122)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.2.3`
**Tier source:** Tier 2, items 5-6
**APP_VERSION target:** `7.2.3` (patch — math correctness, no new feature)
**CACHE_NAME bump:** Yes.
**Migration:** None.

### Goal

Port the v7.1.0 spike-trim + implausibility damping from `updateProjection()` into:
1. The radar's `WEIGHT TREND` axis (`modules/radar.js`)
2. The schedule ADJUST math (`calcAdjust` in `app.html`)

This completes the spike-protection rollout; currently only the projection has it.

### Scope

1. Extract the spike-trim helper from `updateProjection` into a reusable function (place in `app.html` as `getSpikeTrimmedWeights(weights, windowSize)` or in a new tiny helper module).
2. Replace the inline rate calculation in radar's WEIGHT TREND axis with this helper.
3. Replace `curW = getLatestWeight() || startW` in `calcAdjust` with `getSpikeTrimmedWeights(weights, 7)[0]?.weight ?? startW` so a same-day water spike doesn't poison ADJUST math.
4. Apply implausibility damping to radar weight-trend (drop confidence weight if rate > 2 kg/wk).

### Files touched

- `app.html` — extract `getSpikeTrimmedWeights` helper near other weight utilities. Apply to `calcAdjust`.
- `modules/radar.js` — replace inline weight delta in `computeRadarMetrics` (axis 5) with helper; apply implausibility check.

### Smoke test

1. With current backup (recent water spike Apr 25-26), radar 7D weight trend axis shows positive direction (still moving toward 90 kg goal), not the wrong-direction crash that pre-fix caused.
2. ADJUST modal: opening it on a spike day still uses a stable currentWeight (trimmed) for the trajectory calc, not the spike value.
3. Existing `updateProjection` behaviour identical (helper is a no-op refactor for that caller).

### Acceptance criteria

- [ ] Helper exists, used by 3 callers (projection, radar, calcAdjust)
- [ ] Radar weight-trend axis shows correct direction on spike days
- [ ] ADJUST uses trimmed weight, not raw latest
- [ ] No regression in projection accuracy

### Risk

**Low.** Refactor + port. Logic already proven in v7.1.0.

---

## Phase 5 — Sickness Flag (UI + Storage)

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `28e4977` (PR #123)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.3.0`
**Tier source:** Tier 4, item 16
**APP_VERSION target:** `7.3.0` (minor — new user-facing feature, banner shown)
**CACHE_NAME bump:** Yes.
**Migration:** None (additive field on `dayLogs[date]`; readers default to false when absent).

### Goal

Allow the user to manually flag a day as "sick / disrupted". This flag is read by Phase 6 to exclude affected days from calibration, and by the calendar to display a small icon for retrospective context.

### Scope

1. Add `dayLogs[date].sick: boolean` field. Default false / undefined.
2. **Day modal (modules/calendar.js):** add a small toggle next to the energy selector: `🤒 Mark this day as sick / disrupted`. Tapping flips the field and re-renders the cell.
3. **Calendar cell:** when `log.sick === true`, render a small 🤒 emoji in the cell corner. CSS class `cal-sick`.
4. **TODAY tab:** add the same toggle, visible when today is in progress, so user can mark today sick without going through MONTHS.
5. **Backup:** automatic — `sick` is a field inside `dayLogs[date]`, already serialised in full.

### Files touched

- `modules/calendar.js` — `openDayModal` adds the toggle; `renderCalendar` reads `log.sick` and adds `cal-sick` class.
- `app.html` — TODAY tab adds matching toggle; CSS for `.cal-sick` (small icon overlay); state-mutation handler `toggleSickDay(dateStr)`.
- `components/checklist.js` — render the TODAY-tab toggle.

### Smoke test

1. Open day modal on a past day. Toggle "sick" — calendar cell gets icon.
2. Toggle off — icon disappears.
3. TODAY tab: toggle "sick" today; calendar updates immediately.
4. Backup → restore round-trip: sick flags preserved.
5. Calibration math (Phase 5 ships only the flag) is unchanged for now.

### Acceptance criteria

- [ ] Toggle visible in day modal + TODAY tab
- [ ] Calendar shows icon for flagged days
- [ ] Backup includes flag (verified by export-then-re-import)
- [ ] No regression in any other day modal field

### Risk

**Low.** Pure additive field + display surface. No math consumer yet.

---

## Phase 6 — Sickness-Aware Calibration

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `9835741` (PR #124)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.4.0`
**Tier source:** Tier 2, item 7 (extended by Phase 5)
**APP_VERSION target:** `7.4.0` (minor — math change, banner shown)
**CACHE_NAME bump:** Yes.
**Migration:** None.

### Goal

Calibration math respects the sickness flag from Phase 5, plus an additional automatic low-compliance heuristic. Days flagged sick OR with checklist completion < 30% are excluded from `computeObservedTDEE`.

### Scope

1. In `computeObservedTDEE`: during the day-iteration loop, skip a day from intakeSum and daysLogged if:
   - `dayLogs[ds].sick === true`, OR
   - `getValidCheckCompletion(ds).pct < 30`
2. The `kgLoss / spanDays` term is unchanged (we still attribute weight change to the full span, not just the included days).
3. New diagnostic field returned by `computeObservedTDEE`: `daysExcluded` (count of skipped days), `excludedReasons` (object: `{ sick: N, lowCompliance: M, unlogged: K }`).
4. `renderRealityCheck` shows: `Days excluded: 3 (1 sick, 2 low compliance)` in addition to logged-day count.

### Files touched

- `modules/calibration.js` — `computeObservedTDEE` adds the gate; `renderRealityCheck` displays the breakdown.

### Smoke test

1. With current backup: Apr 24-26 (sick days) — when manually flagged via Phase 5 UI, those days now excluded from the calibration window. Observed TDEE recomputes higher (closer to formula).
2. Without sick flags but checklist < 30% on a day: that day excluded automatically.
3. Reality Check shows the exclusion count and reasons.

### Acceptance criteria

- [ ] Sick-flagged days excluded
- [ ] Low-compliance days excluded
- [ ] Diagnostic counts shown in Reality Check
- [ ] Owner's specific case (sickness Apr 24-26) produces a different (higher, closer to formula) observedTDEE after flagging

### Risk

**Medium.** Math change in calibration. Mitigation: only excludes days; doesn't alter math otherwise. v7.1.0 sanity bounds remain in place.

---

## Phase 7 — Sickness Pattern Auto-Detection

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `87684cd` (PR #125)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.4.1`
**Tier source:** Tier 3, item 13
**APP_VERSION target:** `7.4.1` (patch — defensive, silent)
**CACHE_NAME bump:** Yes.
**Migration:** None.

### Goal

If the user forgets to mark sick days, detect a likely sickness pattern (3+ consecutive low-compliance days in last 14) and defer calibration apply until the pattern resolves. This is the safety net for users who don't use the Phase 5 UI.

### Scope

1. In `weeklyCalibration`: before applying, scan last 14 days. If 3+ consecutive days have either `sick=true` or `checklistPct < 30`, set `lastCalibrationAt` to today and **skip apply** with a new reason `'sickness-pattern-detected'`.
2. Reality Check displays: `Calibration paused — sickness pattern detected (3+ disrupted days). Will retry once pattern clears.`
3. Owner can override by tapping the existing "Freeze TDEE" toggle off→on→off (clears the pattern check).

### Files touched

- `modules/calibration.js` — `weeklyCalibration` adds the heuristic gate; status string surfaces in Reality Check.

### Smoke test

1. With current backup (Apr 24, 25, 26 all low compliance): calibration would defer.
2. After Phase 6 sickness flagging: calibration may apply if no consecutive-3 pattern remains.
3. Reality Check explains the deferral.

### Acceptance criteria

- [ ] Heuristic correctly detects 3+ consecutive disrupted days
- [ ] Calibration defers when triggered
- [ ] User notified via Reality Check
- [ ] No regression when pattern absent

### Risk

**Low.** Additive defensive check; cannot worsen existing behaviour, only stop a bad apply.

---

## Phase 8 — Linked Offset Mode (Plan-Direction-Aware)

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `c7a7214` (PR #126)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.5.0`
**Tier source:** Tier 2, item 8 (extended for bulk/maintenance)
**APP_VERSION target:** `7.5.0` (minor — new behaviour, opt-in, banner shown)
**CACHE_NAME bump:** Yes.
**Migration:** None.

### Goal

Opt-in mode where the calorie ceiling auto-tracks TDEE changes by maintaining a constant offset relative to TDEE. The offset is **directional based on the active plan**:

- **Cut plans (LITE / CUT / AGRO):** offset is a deficit. `ceiling = TDEE − deficit`. Floored at plan's `minCalories`. As TDEE drops with weight loss → ceiling drops too → user keeps the same daily deficit.
- **BULK:** offset is a surplus. `ceiling = TDEE + surplus`. As TDEE rises with weight gain → ceiling rises → same daily surplus maintained.
- **MAINTENANCE:** offset is a signed delta from TDEE (default 0, range typically ±200). `ceiling = TDEE + offset`. Keeps user near maintenance even as their body weight stabilises and TDEE drifts.

### Plan-direction abstraction

Reuse the `caloriesMode` discriminator added in Phase 3. The offset's sign is implicit by mode:

| Plan mode | Offset semantic | Default | Range | Floor enforcement |
|---|---|---|---|---|
| `floor` (LITE/CUT/AGRO) | Deficit (positive number, subtracted) | 1500 | 0 – TDEE | `max(plan.minCalories, TDEE − offset)` |
| `above-tdee` (BULK) | Surplus (positive number, added) | 300 | 100 – 1000 | No floor; `ceiling = TDEE + offset` |
| `tdee-band` (MAINTENANCE) | Signed delta (can be negative) | 0 | −300 – +300 | `clamp(ceiling, TDEE−300, TDEE+300)` |

### Scope

1. **New settings fields:**
   - `s.linkedOffsetMode: boolean` (default false)
   - `s.targetOffset: number | null` (units: cal/day; sign per plan mode)

2. **Settings panel:** new toggle below TDEE field labelled adaptively:
   - On cut plans: `Link calorie ceiling to TDEE (maintain a constant deficit)`
   - On bulk: `Link calorie ceiling to TDEE (maintain a constant surplus)`
   - On maintenance: `Link calorie ceiling to TDEE (track maintenance band)`

3. **Offset input** revealed when toggle is ON, with adaptive label:
   - Cut: `Daily deficit (cal below TDEE)` — input range 0–TDEE
   - Bulk: `Daily surplus (cal above TDEE)` — input range 100–1000
   - Maintenance: `Offset from TDEE (cal, can be negative)` — input range −300 to +300

4. **Calorie field** becomes read-only when toggle ON. Live display shows computed value with formula:
   - Cut: `Auto: ${tdee} − ${offset} = ${ceiling} cal (locked)`
   - Bulk: `Auto: ${tdee} + ${offset} = ${ceiling} cal (locked)`
   - Maintenance: `Auto: ${tdee} ${offset >= 0 ? '+' : '−'} ${abs(offset)} = ${ceiling} cal (locked)`

5. **New helper `syncCalorieCeilingFromOffset()`** in `app.html`:
   ```
   if (!s.linkedOffsetMode) return false;
   const plan = getActivePlan();
   const mode = plan.caloriesMode;
   let ceiling;
   switch (mode) {
     case 'floor':       ceiling = Math.max(plan.minCalories, s.tdee - s.targetOffset); break;
     case 'above-tdee':  ceiling = s.tdee + s.targetOffset; break;
     case 'tdee-band':   ceiling = Math.max(s.tdee - 300, Math.min(s.tdee + 300, s.tdee + s.targetOffset)); break;
   }
   if (s.calories !== ceiling) {
     s.calories = ceiling;
     saveSettings(s);
     dispatch('CALORIES_CHANGED');
     return true;
   }
   ```

6. **Trigger sites:** `recomputeAndApplyTDEE` and `weeklyCalibration` both call `syncCalorieCeilingFromOffset()` after TDEE write. Plan switch (in `confirmPlan`) also recomputes if linkedOffsetMode is on (the formula changes when the plan mode changes).

7. **Plan switch handling:** when user switches plans while linkedOffsetMode is ON, show a `showConfirm`: "Switching from CUT to BULK will reverse offset direction. Reset offset to plan default (300 cal surplus)?" — Yes resets, No turns linked mode off.

### Files touched

- `app.html` — settings UI (adaptive toggle + input labels), `syncCalorieCeilingFromOffset` helper, integration with `recomputeAndApplyTDEE` and `weeklyCalibration`, plan-switch handling in `confirmPlan`, CSS for read-only state.
- `getSettings()` defaults — add the two new fields.

### Smoke test

1. **CUT scenario:** Toggle on, deficit 1500. TDEE 3382. Ceiling shows 1882 (above 1400 floor). Drop weight 5 kg → TDEE drops to ~3300 → ceiling auto-drops to 1800.
2. **BULK scenario:** Switch to BULK. Toggle on, surplus 300. TDEE 2800. Ceiling shows 3100. Weight gain → TDEE rises → ceiling rises proportionally.
3. **MAINTENANCE scenario:** Switch to MAINTENANCE. Toggle on, offset 0. Ceiling = TDEE. Adjust offset to −150 → ceiling = TDEE − 150 (within band).
4. **Plan switch with linked mode on:** prompt appears, user confirms reset → offset becomes plan default.
5. **Floor enforcement (cut):** AGRO plan, deficit 5000 → ceiling clamped at 800 floor.
6. **Toggle off:** field becomes editable, value preserved at last computed.

### Acceptance criteria

- [ ] Toggle + offset input both adapt their labels based on `plan.caloriesMode`
- [ ] All 3 modes (`floor`, `above-tdee`, `tdee-band`) compute ceiling correctly
- [ ] Floor/band/clamping respected per mode
- [ ] TDEE_CHANGED triggers ceiling sync
- [ ] Plan switch handled gracefully
- [ ] Read-only visual state when linked
- [ ] Disabling restores manual editability

### Risk

**Medium.** New auto-write path into settings.calories triggered by TDEE events. Mitigation: opt-in only (default off); plan-switch protection; floor/band enforcement.

### Dependencies

**Requires Phase 3** (`caloriesMode` field on each plan). Cannot ship before Phase 3.

---

## Phase 9 — Adaptive Activity Multiplier

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `e7b8081` (PR #127)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.6.0`
**Tier source:** Tier 2, item 9
**APP_VERSION target:** `7.6.0` (minor — new diagnostic, banner shown)
**CACHE_NAME bump:** Yes.
**Migration:** None.

### Goal

After 28+ days of clean data, infer the user's effective activity multiplier from `observedTDEE / BMR`. Display in Settings as a diagnostic. Optionally apply (gated behind a manual button).

### Scope

1. New helper `inferActivityMultiplier()` in `modules/calibration.js`: returns `{ effective, current, gap, daysOfData }`. Effective = round(observedTDEE / BMR, 3). Only valid if `daysOfData >= 28` AND no sickness pattern.
2. Settings panel: under activity-level dropdown, show `Inferred effective: 1.6 (vs current 1.725) · 32 days data [↻ APPLY]`.
3. APPLY button writes `s.activityLevel = inferred`, dispatches TDEE_CHANGED.
4. Cap at plan default ± 0.2 (prevents wild swings; e.g. AGRO default 1.725 capped to [1.525, 1.925]).

### Files touched

- `modules/calibration.js` — `inferActivityMultiplier` helper.
- `app.html` — settings UI display, APPLY button, handler.

### Smoke test

1. With <28 days clean data: diagnostic hidden.
2. With ≥28 days: diagnostic visible.
3. APPLY writes new multiplier, dispatches TDEE_CHANGED, full UI refresh.
4. Cap enforced.

### Acceptance criteria

- [ ] Inference correct against backup data (verifiable manually)
- [ ] Display only when valid
- [ ] APPLY writes safely with cap
- [ ] Manual-override flag respected (no auto-apply)

### Risk

**Medium.** Behavioural surface area. Mitigation: read-only by default, manual apply only.

---

## Phase 10 — Backup Integrity Checksum

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `cbeb31e` (PR #128)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.6.1`
**Tier source:** Tier 3, item 11
**APP_VERSION target:** `7.6.1` (patch — silent infrastructure)
**CACHE_NAME bump:** Yes.
**Migration:** None (additive metadata field on backup file).

### Goal

Add SHA-256 checksum of the `data` field to backup files. On restore, verify checksum; if mismatched, prompt user with a clear warning before allowing import.

### Scope

1. In `backupData()`: compute `checksum = sha256(JSON.stringify(data))` using `crypto.subtle.digest`. Add to backup JSON: `checksum: 'sha256:HEX'`.
2. In `restoreData()`: if backup has `checksum` field, compute hash of incoming `data` and compare. On mismatch: showConfirm with danger styling, "Backup integrity check failed. The file may be corrupted or tampered. Restore anyway?".
3. Backups WITHOUT checksum (old format): restore normally without check; mention in restore confirmation that the file is older format.

### Files touched

- `app.html` — `backupData`, `restoreData`, new helper `sha256Hex(string)`.

### Smoke test

1. Create backup, verify file has `checksum` field.
2. Restore that backup → no warning.
3. Manually edit backup file (change one number) → restore prompts integrity warning.
4. Restore an older backup (no checksum) → no warning, restores normally.

### Acceptance criteria

- [ ] Checksum present on new backups
- [ ] Verification works (mismatch produces warning)
- [ ] Old backups still restore
- [ ] User can override warning explicitly

### Risk

**Low.** Additive metadata; old backups unaffected.

---

## Phase 11 — Backup History Tracking

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `fe591ea` (PR #129)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.7.0`
**Tier source:** Tier 3, item 12
**APP_VERSION target:** `7.7.0` (minor — new feature with migration)
**CACHE_NAME bump:** Yes.
**Migration:** v2 → v3 adds new SK key `backupHistory`.

### Goal

Track the last 5 backup events with timestamp + filename. Display in Settings → Data Management as a small list so user can see backup cadence.

### Scope

1. Add `SK.backupHistory = 'ph_bh_v1'` storage key.
2. Migration v2→v3: register the new key (no-op data transformation, parallel to v1→v2).
3. In `backupData()`: after successful download, push `{ ts: Date.now(), filename }` to `backupHistory`, keep last 5 entries.
4. Settings → Data Management: render the list with relative-time labels (`Today, 2:14 PM`, `Yesterday, 8:00 AM`, `3 days ago`, etc.).

### Files touched

- `app.html` — SK addition, backupData write, settings render.
- `migrations/registry.js` — migration v2→v3.

### Smoke test

1. Run a backup → entry appears in history.
2. Run 6 backups → only last 5 shown, oldest dropped.
3. Migration runs once on next load post-deploy; schema bumps to 3.
4. Backup→restore preserves history.

### Acceptance criteria

- [ ] New SK key works
- [ ] Migration v2→v3 applied
- [ ] History capped at 5 entries
- [ ] Relative-time display correct

### Risk

**Low.** New SK key (additive); migration is no-op.

---

## Phase 12 — Multi-Day Fast Sessions (Supersedes Original Bootstrap Scope)

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `e0b3a1b` (PR #130)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.8.0`
**Tier source:** Tier 4, item 15 (substantially expanded for multi-day fast support)
**APP_VERSION target:** `7.8.0` (minor — new feature with data restructure, banner shown)
**CACHE_NAME bump:** Yes.
**Migration:** v3 → v4 — introduce `SK.fastSessions`; backfill from existing `SK.fastWindows` AND `SK.fastDays`.

### Why this phase changed

The original Phase 12 scope ("bootstrap fastWindows from fastDays") assumed every fast fits within a single calendar date. That assumption fails for fasts that span multiple days. Real example from owner's protocol:

- **Wednesday fast (single-day):** Tue 6 PM → Thu 9 AM. ~28h centered on Wed. Calendar marks Wed as fast day. Phase C works fine — one window stored under "Wed" with timestamps spanning Tue–Thu. Tail-ends are not marked fast days.
- **Saturday + Sunday fast (multi-day):** Fri 6 PM → Mon 9 AM. ~63h spanning Sat AND Sun, both marked as fast days. Phase C breaks:
  1. Tap START on Sat → window stored under Sat
  2. Sun morning, app forgets Sat's session is still active for Sun (different date key) → if user taps START again, **duplicate window created on Sun**
  3. Mon morning end → endFast writes to whichever date the user happens to be on — Sat's window stays "active" forever
  4. Calibration math reads both Sat's and Sun's windows separately → **double-counts the same fast hours**
  5. Calendar coloring inconsistent — Sat and Sun handled by different windows that may have different broken/end states

### Goal

Introduce a proper **fast session** abstraction: a single object representing one continuous fast, regardless of how many calendar dates it spans. `fastWindows[date]` becomes a derived view (read-only). Sessions are the source of truth.

### Data model

**New SK key:** `SK.fastSessions = 'ph_fs_v1'`

**Shape:** array of session objects:
```js
{
  id: 'fs_<timestamp>_<random>',     // unique identifier
  start: ISO_string,                  // when fast began
  end: ISO_string | null,             // when fast ended (null = active)
  broken: boolean,                    // user marked broken or food logged during
  brokenBy: [foodEntryId, ...],       // which food entry/entries broke it (if applicable)
  dates: [YYYY-MM-DD, ...],           // calendar dates this session covers
  legacy: boolean (optional)          // true if backfilled from pre-Phase-12 data
}
```

**`dates` semantics:** computed from `start` and `end` (or `now()` if active). A date is included if the session was active for ≥ 1 hour on that date. Recomputed when `end` is set.

**`fastWindows` after Phase 12:** kept for backward-compatible reads via a derived helper `getFastWindowsForDate(dateStr)` that scans `fastSessions` and returns matching session(s) for that date. Direct writes to `fastWindows` removed; new writes go through session helpers.

### Scope

**1. New session helpers in `components/fast-window.js` (replacing per-date logic):**

- `getActiveSession()` — returns the most recent session with `end === null && !broken`, regardless of date.
- `getSessionsForDate(dateStr)` — returns all sessions whose `dates[]` includes `dateStr`.
- `startFastSession()` — creates new session in `fastSessions` with `start = now`, `end = null`, `dates = [todayStr()]`. Returns existing active session unchanged if one exists (no duplicate).
- `endFastSession()` — sets `session.end = now`, recomputes `session.dates` based on actual span. Dispatches `FAST_WINDOW_CHANGED`.
- `markSessionBroken(foodEntryId, foodTs)` — marks the active session broken; sets end to food timestamp; recomputes dates.
- `editSession(sessionId, startISO, endISO, broken)` — retroactive edit; recomputes dates.
- `deleteSession(sessionId)` — removes session entirely.

**2. Backward-compat helpers (so Phase C UX still works):**

- `getActiveFastWindow(dateStr)` — alias for `getActiveSession()`, ignores dateStr argument (sessions are date-agnostic).
- `getFastWindows(dateStr)` — derives from `getSessionsForDate(dateStr)`.
- `startFast(dateStr)` / `endFast(dateStr)` / `markFastBroken(dateStr, foodEntryId, foodTs)` — thin wrappers around the session helpers (dateStr ignored where it doesn't apply).

**3. Migration v3→v4 in `migrations/registry.js`:**

`requiresBackup: true` — major data restructure.

```js
run(data) {
  const sessions = [];
  const seenWindows = new Set();
  // Step A: convert each existing fastWindows entry to a session
  const fw = data['ph_fw_v1'] || {};
  for (const date of Object.keys(fw)) {
    for (const win of fw[date]) {
      const sig = `${date}|${win.start}|${win.end}`;
      if (seenWindows.has(sig)) continue;  // dedupe duplicates from Phase C bug
      seenWindows.add(sig);
      sessions.push({
        id: 'fs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        start: win.start || `${date}T00:00:00.000Z`,
        end:   win.end   || `${date}T23:59:59.999Z`,
        broken: !!win.broken,
        brokenBy: win.brokenBy || [],
        dates: [date],
        legacy: false
      });
    }
  }
  // Step B: for each fastDays entry without a covering session, create a 24h legacy session
  const fd = data['ph_fd_v1'] || {};
  const coveredDates = new Set();
  sessions.forEach(s => s.dates.forEach(d => coveredDates.add(d)));
  for (const date of Object.keys(fd)) {
    if (!fd[date]) continue;
    if (coveredDates.has(date)) continue;
    sessions.push({
      id: 'fs_legacy_' + date.replace(/-/g, ''),
      start: `${date}T00:00:00.000Z`,
      end:   `${date}T23:59:59.999Z`,
      broken: false,
      brokenBy: [],
      dates: [date],
      legacy: true
    });
  }
  data['ph_fs_v1'] = sessions;
  return data;
}
```

Verify: every `fastDays` date has at least one session covering it; no session has empty `dates`.

**Note on consecutive fast days:** the migration does NOT auto-merge consecutive fast days into single multi-day sessions. Without timestamp data, we can't know whether the user did Sat and Sun as one continuous fast or as two separate fasts. Each gets its own session; user can manually merge later via the day-modal editor (post-migration UX, future enhancement).

**4. UX changes:**

- **TODAY tab fast banner:** when an active session exists (regardless of which day was active when started), show: `Fasting since Fri 6 PM (28h elapsed)`. The "covers dates" is implicit; user just sees one ongoing fast.
- **Calendar:** day modal on a date that's part of a multi-day session shows: `Part of a multi-day fast: Fri 6 PM → Mon 9 AM (63h)`. Edit opens a session-level editor.
- **Day modal "Edit Fast Times":** opens an editor for the session that covers this date. Editing changes affect ALL dates the session covers. New "Delete this session" button removes it entirely.
- **Adding a fast on a date inside an existing session:** prevented. Shows: `This date is already part of an active fast (started DD MMM at HH:MM). Use the existing session.`

**5. Calibration math (modules/calibration.js):**

- Replace `getFastWindows(date)` reads with `getSessionsForDate(date)`.
- Total fast hours per session counted ONCE across all dates the session covers (not per spanning date).
- For intake attribution on a date inside a session: if session is broken, sum food log entries for that date (same as today's logic). If session is intact, intake = 0 for that date.
- Spike-trim and observation logic unchanged (they read intake, not fast structure).

**6. SW cache + version:**

- `sw.js` CACHE_NAME bumps (already required for any merge).
- Files added to cache list: none new (fast-window.js already in cache from Phase C).

### Files touched

- `app.html` — `SK.fastSessions` added; module-loader exposes new session helpers.
- `migrations/registry.js` — v3→v4 migration object with backfill logic.
- `components/fast-window.js` — heavy refactor: session helpers replace per-date helpers; backward-compat shims preserved for Phase C onclick callers.
- `modules/calendar.js` — day-modal session editor block.
- `modules/calibration.js` — calibration reads via session API.
- `sw.js` — CACHE_NAME bump.

### Smoke test

1. **Migration:** owner's existing 30 `fastDays` + empty `fastWindows` → after migration, 30 legacy sessions in `fastSessions`, each with `dates=[date]`, `legacy: true`. Auto-backup downloaded. No data loss.
2. **Wednesday-style single-day fast (new):** TODAY (Wed) tap START → session created with `start = Wed 6PM`, `dates = ["Wed"]`. Wed evening tap END → `dates` recomputed (still just ["Wed"] if span < 24h before midnight; or extended).
3. **Cross-midnight overnight (Tue 6PM start, Wed 9AM end):** session.dates = ["Tue", "Wed"] (covers both calendar dates). Wed shows as fast day in calendar; Tue too if marked.
4. **Multi-day Sat+Sun:** Fri 6PM tap START → session created with `dates=["Fri"]`. Sat morning open app → banner says `Fasting since Fri 6 PM (XXh elapsed)`. Tapping START on Sat does NOTHING (active session exists). Sun morning same. Mon 9AM tap END → `session.end = now`, `session.dates = ["Fri", "Sat", "Sun", "Mon"]`. Calendar: Sat + Sun colored fast (per existing fastDays); Fri + Mon may show partial via intake.
5. **No duplicates:** verify only one session per fast across all dates.
6. **Calibration:** with the multi-day session, fast duration counted once. Observed TDEE math correctly attributes fast period.
7. **Day modal on Sun (mid-fast):** shows session info, edit opens session editor (not date-specific window editor).
8. **Edit session start:** changing Fri 6PM → Fri 4PM updates the session globally; all spanning dates reflect the change.
9. **Backup→restore round-trip:** sessions preserved.

### Acceptance criteria

- [ ] `SK.fastSessions` populated post-migration for all existing fastDays + fastWindows
- [ ] No data loss; auto-backup downloaded before migration runs
- [ ] Single active-session model: tapping START during active session is a no-op
- [ ] Multi-day spans handled without duplicate windows
- [ ] Calendar coloring correct across all spanning dates
- [ ] Calibration math counts each fast once
- [ ] Day modal shows session-aware information
- [ ] Backward-compat read shims preserved for Phase C onclick callers
- [ ] No regression in single-day fasts (Wednesday-style)

### Risk

**Medium-high.** Major data restructure with read-shim layer. Mitigations:
- `requiresBackup: true` enforces user safety net before migration runs
- Backward-compat shims preserve all Phase C onclick handlers
- Migration is idempotent (safe to re-run)
- Verify function ensures every fastDays has session coverage
- Sessions array is append-only post-migration; no in-place mutations of legacy data

### Dependencies

- **Affects:** Phase 13 (activity history snapshot — should also include sessionId for traceability if tied to a fast).
- **Independent of:** Phases 1–11 (none read fast structure in a way that conflicts).

---

## Phase 13 — Activity History Tracking (Foundation)

**Status:** ✅ COMPLETED — DO NOT MODIFY
**Merge commit:** `735b543` (PR #131)
**Merged:** 2026-04-28
**Pinned APP_VERSION:** `7.8.1`
**Tier source:** Tier 4, item 14
**APP_VERSION target:** `7.8.1` (patch with migration; observation only) — bumped from `7.7.2` due to Phase 12 version expansion
**CACHE_NAME bump:** Yes.
**Migration:** v4 → v5 adds new SK key `activityHistory`.

### Goal

Lay the foundation for future per-day activity inference. Each calibration cycle writes a snapshot of `{ date, observedTDEE, formulaTDEE, ratio, sickFlagged, complianceAvg }` to a rolling history. Not user-facing in this phase — it just accumulates data so a future "smarter calibration" feature has a clean dataset to work from.

### Scope

1. Add `SK.activityHistory = 'ph_ah_v1'` (array of snapshots, capped at 90 entries).
2. Migration v4→v5: register the key.
3. In `weeklyCalibration` (post-apply or post-skip): append a snapshot.
4. No UI for now. Surfaces in a future phase.

### Files touched

- `app.html` — SK addition.
- `migrations/registry.js` — migration v4→v5.
- `modules/calibration.js` — append snapshot in `weeklyCalibration`.

### Smoke test

1. Migration runs cleanly, schema bumps to 5.
2. Manually trigger weeklyCalibration (or wait): snapshot appears in `localStorage.getItem('ph_ah_v1')`.
3. Snapshot capped at 90 entries.
4. Backup contains the new key.

### Acceptance criteria

- [ ] New SK key works
- [ ] Migration v4→v5 applied
- [ ] Snapshot written on each calibration run
- [ ] Capped correctly
- [ ] Included in backup/restore

### Risk

**Low.** Silent observation only.

---

## Final State After Phase 13

| Surface | State |
|---|---|
| `APP_VERSION` | `7.8.1` |
| `CACHE_NAME` | `~v32-34` (one bump per phase that needed it) |
| `schemaVersion` | `5` |
| New SK keys added | `backupHistory` (Phase 11), `fastSessions` (Phase 12), `activityHistory` (Phase 13) |
| New migrations | v2→v3 (backupHistory), v3→v4 (fastSessions backfill), v4→v5 (activityHistory) |
| New files | `components/` may gain a sickness-toggle helper if extracted (Phase 5); no other new module files necessary |
| New dispatch events | None (existing `TDEE_CHANGED`, `FAST_WINDOW_CHANGED`, etc. cover everything; sessions reuse `FAST_WINDOW_CHANGED`) |
| Behavioural changes | All 13 phases land. Calibration is sickness-aware, spike-resistant, plan-floor-respecting, integrity-checksummed, history-tracked. Fasts support multi-day spans with no duplication. |

---

## Per-phase commit & merge checklist

Each phase:

1. **Pre-implementation:** read this file. Confirm next pending phase. Mark `IN PROGRESS`.
2. **Implement:** make code changes per the scope above. Stay strictly inside the phase's scope.
3. **Smoke verification:** run the smoke test list locally (mental walkthrough or manual node checks).
4. **APP_VERSION + UPDATE_LOG:** bump APP_VERSION, update APP_VERSION_MSG, add UPDATE_LOG entry.
5. **CACHE_NAME:** bump in sw.js IF the phase indicates a bump is required (see phase header).
6. **Commit:** `Phase N: <title>` as the subject; body describes scope + files; include trailer link.
7. **Push:** to `claude/add-workout-exercises-KjRRh`.
8. **Report:** tell owner — phase complete, what changed, ask for PR review + merge.
9. **Wait:** for owner confirmation that PR has been merged to `main`.
10. **Mark complete:** Edit this file: change `Status: PENDING` → `Status: ✅ COMPLETED — DO NOT MODIFY` with merge commit hash, date, and APP_VERSION pinned.
11. **Sync branch:** `git fetch origin && git merge origin/main`.
12. **Specify next phase:** post-completion message names Phase N+1 by number, title, and one-line scope; ask permission to begin.

---

## Stop conditions

Halt the entire roadmap and return to the owner if any of these occur:

- A phase's smoke test fails on the owner's device after merge.
- A migration fails (auto-backup downloaded; init halts; user-visible error).
- An APP_VERSION bump conflicts with a parallel change on `main`.
- The owner explicitly says "stop" or "pause".
- A phase introduces a regression discovered post-merge during a later phase.

In any halt scenario: do not start the next phase. Report state and wait for instruction.

---

*This file is the single canonical roadmap. Edits are only permitted in PENDING phases (before implementation) or to add the completion header on a finished phase. Bodies of completed phases are immutable.*
