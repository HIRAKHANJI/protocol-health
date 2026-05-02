# Protocol Health — Update Log

All version history for the app. Each entry records version number, date, scope, and what changed.

---

## Version 7.3.0 — 2026-04-28

**Scope:** Minor (Phase 5 of calibration roadmap — sickness flag UI + storage)
**Banner:** shown — "You can now mark any day as sick / disrupted with a 🤒 toggle on the TODAY tab and in the calendar day modal. Marked days show a small icon in the corner of their calendar cell. Phase 6 will use this flag to exclude sick days from the calibration math, so a bad week of sickness or travel no longer corrupts your TDEE."

**Goal.** Pure additive UI surface. Lets the user manually flag any day as sick or disrupted. No math consumer ships in this phase — Phase 6 wires it into calibration. Phase 5 is the storage + UX foundation.

**Storage:**

- Field: `dayLogs[date].sick: boolean` (defaults to `false`/absent on read).
- Backup: automatic — already nested inside `dayLogs[date]` which is fully serialised by the existing backup iteration.
- No new SK key, no migration.

**Changes:**

- **`modules/calendar.js`:**
  - `openDayModal` adds a sickness checkbox row right above the Notes field. Hydrated from `log.sick`. Live-saves via `toggleSickDay(dateStr, this.checked)` onchange — no need to tap SAVE DAY.
  - `renderCalendar` reads `log.sick` per cell; when truthy, adds the `cal-sick` class and renders a small `🤒` icon overlay positioned in the top-right corner. Cell base color (compliance / fast / partial) is preserved — the icon is an additional indicator, not a replacement.
- **`app.html`:**
  - **New top-level handler `toggleSickDay(dateStr, checked)`:** writes via `saveDayLogField(dateStr, { sick: !!checked })`, syncs both checkboxes (TODAY + day-modal) if both are present, dispatches `DAY_SAVED` so the calendar refreshes immediately.
  - **TODAY tab** gains its own sickness toggle row (`#tSick`) inserted between the weight-log row and the food-log button. Hydrated by `updateFastUI()` (which already runs on TODAY render and on tab switch).
  - **CSS:** new `.sick-toggle-row` (compact pill-style row, orange accent on checkbox), `.cal-sick` (placeholder class for future styling hooks), `.cal-sick-icon` (absolute-positioned emoji corner overlay). `.cal-cell` already had `position:relative` so no change needed there.

**No new dispatch event** — reuses existing `DAY_SAVED`. **No new SK key.** **No migration.** **No `sw.js` change.**

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 5 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.3 — 2026-04-28

**Scope:** Patch (Phase 4 of calibration roadmap — spike-trim port to radar + ADJUST)
**Banner:** none (patch — math correctness, no new feature)

**Goal.** Finish the v7.1.0 spike-protection rollout. Previously only `updateProjection()` had spike trimming. The radar's WEIGHT TREND axis still used raw newest/oldest weights (so a single +3kg sickness spike could crash the axis to red), and `calcAdjust()` used raw `getLatestWeight()` for `currentWeight` (so opening ADJUST during a water-spike day would feed bad data to the schedule recalculation).

**Changes:**

- **`app.html` — new shared helper `getSpikeTrimmedWeights(weights, opts)`** placed next to `getLatestWeight`. Extracted byte-identical from the original v7.1.0 inline logic in `updateProjection`. Inputs: weights array (newest-first), optional `{ spikeKg = 1.5, maxKgPerWeek = 2.0 }`. Returns `{ rateWindow, trimmedCount, spikeDetected, rawDailyLoss, rawIsImplausible, daySpan, rateLatest, oldest }`.
- **`updateProjection()` refactored** to call the helper instead of carrying its own inline logic. Behaviour bit-identical (same defaults, same trim algorithm).
- **`calcAdjust()`** — `curW` resolution now goes through the spike-trim helper. If a spike is detected, `curW` becomes the trimmed-latest (the most recent stable reading) instead of raw `getLatestWeight()`. Falls back to `getLatestWeight()` then `startW` if helper isn't available or no weights exist. Every other field in `calcAdjust` (`startW`, `elapsed`, `actualRate`, etc.) unchanged.
- **`modules/radar.js` WEIGHT TREND axis** uses `getSpikeTrimmedWeights(windowWeights)` for `dailyChange` calculation. Existing dampener (sparse-data confidence) preserved. New: when spike-trim flags `rawIsImplausible`, the axis confidence drops further (×0.5) — even the trimmed signal can still be water/sickness noise, so the score reflects that uncertainty.
- **Backward-compat fallback** in radar.js: if `getSpikeTrimmedWeights` isn't defined (paranoid defensive), the original raw newest/oldest math runs. No behaviour regression.

**No data shape change.** No new dispatch event. No new SK key. No `sw.js` change.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 4 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.2 — 2026-04-28

**Scope:** Patch (Phase 3 of calibration roadmap — plan-direction-aware calorie safety hints/warnings)
**Banner:** none (patch — silent; advisory UI only)

**Goal.** Surface non-blocking warnings when the calorie ceiling falls outside the safe range for the active plan. Semantics differ by plan direction (cut = floor, bulk = above-TDEE, maintenance = TDEE band). Never blocks the goal calculator; always informs.

**Plan direction model:**

| Plan | `caloriesMode` | Threshold logic |
|---|---|---|
| LITE | `floor` | warn if ceiling < `minCalories: 1200` |
| AGRO | `floor` | warn if ceiling < `minCalories: 800` |
| CUT | `floor` | warn if ceiling < `minCalories: 1400` |
| BULK | `above-tdee` | warn if ceiling ≤ TDEE (computed dynamically) |
| MAINTENANCE | `tdee-band` | warn if abs(ceiling − TDEE) > 300 (band computed dynamically) |

**Changes:**

- **`plans/lite.js`, `plans/agro.js`, `plans/cut.js`, `plans/bulk.js`, `plans/maintenance.js`** — each plan object gains `caloriesMode` + threshold field(s):
  - Static numeric `minCalories` for cut plans
  - `null` for bulk + maintenance (computed from TDEE at validation time)
  - Maintenance also gets `maxCalories: null` for the upper bound
- **`app.html`:**
  - **New helper `validateCaloriesAgainstPlan(cals, plan, tdee)`** dispatches on `plan.caloriesMode`. Returns `{ ok, severity, message }`. No hardcoded plan keys outside the helper.
  - **New `renderCalorieSafetyWarning(cals, plan, tdee)`** writes the warning to the goal-calculator result panel `#calcCalorieSafety`. Hidden when validation passes.
  - **New `renderCaloriesHint()`** writes a live floor/band hint under the Settings calorie field `#caloriesHint`. Reads current plan + current TDEE input value (or settings fallback).
  - **`calcDuration()`** calls `renderCalorieSafetyWarning(calcCals, plan, tdee)` just before showing the result panel.
  - **`openSettings()`** calls `renderCaloriesHint()` after hydrating fields.
  - **`onPlanSelectChange()`** calls `renderCaloriesHint()` to refresh on plan switch.
  - **Settings calorie field oninput** also calls `renderCaloriesHint()` (in addition to `calcDuration`) so hint reflects live edits.
  - **Settings TDEE field oninput** also calls `renderCaloriesHint()` (TDEE changes shift the band/threshold for bulk + maintenance plans).
  - New CSS: `.cal-floor-hint` (small muted text under the field), `.cal-floor-warn` (orange-tinted warning panel in result block).
  - New DOM: `#caloriesHint` div under settings calorie field, `#calcCalorieSafety` div in goal-calculator result panel.

**No data migration.** New plan fields are additive; existing plan readers ignore unknown fields. No `sw.js` change.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 3 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.1 — 2026-04-28

**Scope:** Patch (Phase 2 of calibration roadmap — quick-access ADJUST link in Settings)
**Banner:** none (patch — no popup; small UI add)

**Goal.** Surface the existing `MANAGE SCHEDULE → ADJUST` flow from the Settings panel. Previously, adjusting an active schedule required navigating to MONTHS tab → tapping `⚙ MANAGE SCHEDULE`. Phase 2 adds a one-tap shortcut from Settings.

**Changes:**

- **`app.html` Settings panel HTML:** new button `↗ ADJUST CURRENT SCHEDULE` (`#settingsAdjustLink`) inserted under the goal-calculator section, after the `ADD TO SCHEDULE` button. Styled with the orange `--accent2-warm` palette (`#ff8855`) to match the existing Manage Schedule button on MONTHS tab. `display:none` by default; revealed only when a schedule is active.
- **`openSettings()`** extended to toggle the new link's visibility based on `gs(SK.schedule)` — visible if schedule exists, hidden otherwise.
- **New top-level function `adjustCurrentScheduleFromSettings()`:** closes the Settings overlay then calls `openManageSchedule()`. The existing `openManageSchedule` already pre-fills `msTargetKg` from `s.targetKg` and `msCalories` from `s.calories`, so the user lands directly on a populated ADJUST view ready to edit.
- **No changes** to `openManageSchedule` itself — its existing pre-fill behaviour was already correct. This phase is purely about discoverability: a Settings-panel entry point so the owner doesn't need to remember the MONTHS tab path.

**No new modules.** No new CSS classes (button reuses existing `.reset-btn` styling). No new dispatch events. No data shape change. No `sw.js` change in this commit.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 2 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.0 — 2026-04-28

**Scope:** Minor (Phase 1 of calibration roadmap — Reality Check display clarity)
**Banner:** shown — "Reality Check redesigned for clarity. Eating-day average now shown separately from period average (which includes fast days). Calibration cadence visible: see exactly when the next check happens and why the last one was applied/rejected/skipped. New ⓘ Explain button opens a plain-English guide to what every number means."

**Root motivation.** The Reality Check block was mathematically correct but humanly confusing. Owner's actual data showed `Avg intake (12 logged days): 812 cal` which looked alarmingly low; in fact 6 of those 12 days were fasts counted at 0, dragging the average down. Plus `Currently using 3382 / Observed 2352` left no explanation for why the displayed TDEE didn't match the observed value (cadence gate preventing apply). Phase 1 fixes the labels and surfaces the why.

**Changes:**

- **`modules/calibration.js`** — three additions and one rewrite:
  - **New `getDayBreakdown(days=14)`** helper. Splits intake into `eatingDayAvg` (non-fast days only), `periodAvg` (all included days), `fastDayCount`, `brokenFastCount`, `unloggedEatingDayCount`. Used purely for display; doesn't change TDEE math.
  - **`getCalibrationStatus()`** extended with cadence + breakdown fields: `breakdown` (from above), `lastCalibrationAt` (Date), `nextCalibrationAt` (Date), `daysUntilNextCheck` (number), `lastCalibrationOutcome` (string from new settings field), `lastCalibrationFormula`, `lastCalibrationObserved`.
  - **`weeklyCalibration()`** now writes `s.lastCalibrationOutcome` at every evaluation branch — `'applied' | 'within-threshold' | 'rejected-out-of-bounds' | 'gathering' | 'missing-inputs'`. Cadence gate uses new `CALIBRATION_CADENCE_DAYS = 7` constant.
  - **`renderRealityCheck()`** rewritten with three structured sections (loss / intake / TDEE) and a cadence note that explains in plain English when the next check happens or why the last one didn't apply. New helper `_buildCadenceNote(status)` produces the message based on outcome.

- **`app.html`** — wiring + UI:
  - `getSettings()` defaults gain `lastCalibrationOutcome: 'never-run'`. Backward-compatible via existing `Object.assign({}, defaults, saved)` pattern; existing user data unaffected.
  - Module loader exposes `Calibration.getDayBreakdown` to `window.getDayBreakdown`.
  - New **Reality Check Explain Modal** (`#realityExplainModal`) using the existing `popup-overlay` pattern at z-index 9100. Six sections: What this shows / Predicted vs Actual / Eating-day vs Period avg / Formula vs Observed TDEE / When calibration applies / What you can do.
  - New top-level functions `openRealityExplain()` / `closeRealityExplain()` registered.
  - New CSS classes: `.rc-section` (groups intake/TDEE/loss), `.rc-cadence-note` (italic explanation under TDEE block), `.rc-header-actions` (right-side group for state pill + explain button), `.rc-explain-btn` (small pill-style button), `.rc-explain-section` / `.rc-explain-h` / `.rc-explain-p` / `.rc-explain-p em` for the modal content.

**No data migration.** New `lastCalibrationOutcome` field defaults via getSettings; backups round-trip cleanly.
**No `sw.js` change** in this commit — bumps with merge to main per feature-branch convention.
**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 1 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.1.0 — 2026-04-26

**Scope:** Minor (hot-fix for calibration corrupted by sickness-induced weight spike; multiple UX/math fixes)
**Banner:** shown — "Hot-fix: calibration sanity bounds. Sudden weight spikes from sickness or water retention no longer corrupt your TDEE. App auto-reverts implausible TDEE values on load. New RESET button in Settings if you ever need to manually restore the formula value. ADJUST and projection now handle weight noise correctly."

### Root cause

A user who gained ~3 kg in 3 days from sickness/water retention triggered a calibration cascade where:
1. computeObservedTDEE took the +3 kg as "real" weight gain → computed observedTDEE = avgIntake − 1650 cal/day
2. weeklyCalibration applied the result, writing TDEE = ~1300 cal/day to settings (below physiological BMR floor of ~2000)
3. updateProjection trusted the broken TDEE → predicted weight gain by Sunday
4. ADJUST math used the broken TDEE → would have produced nonsense schedules

### Fixes (6 layered protections)

- **Sanity bounds in `computeObservedTDEE`** (`modules/calibration.js`) — rejects when weekly weight change exceeds 2 kg (physiological limit; sustained loss/gain at this rate without sickness/water/glycogen confounds is implausible). Returns `valid: false, reason: 'spike-detected'`.
- **Sanity bounds in `weeklyCalibration`** — even if observed math passes the spike gate, the resulting TDEE must fall between BMR (formula ÷ activityMultiplier) and formula × 1.5. Anything outside this band is rejected, lastCalibrationAt bumps, no settings.tdee write. Returns `reason: 'observed-out-of-bounds'`.
- **Auto-revert on load** (`autoRevertImplausibleTdee` in `modules/calibration.js`, called from `runInit`) — if the currently-stored settings.tdee is below BMR or above formula × 1.5, automatically reverts to formula TDEE on next load and shows a banner explaining why. This is the auto-recovery path that unbreaks any user already affected by the bug. Honors `settings.tdeeManualOverride` (skipped if user explicitly froze TDEE).
- **Manual RESET button** in Settings panel (`resetTdeeToFormula`) — one-tap recovery. Also displays the formula TDEE alongside the current value: `Formula: 3103 cal/day [↺ RESET]`. Writes the formula value to settings.tdee, sets lastCalibrationAt to now (suppresses next auto-cal for 7 days while data stabilizes), shows confirmation alert.
- **Spike handling in `updateProjection`** — detects consecutive day-to-day weight deltas > 1.5 kg (sickness, water, glycogen) and trims spike-affected entries from the rate window. Implausibility check on the trimmed rate (> 2 kg/wk) drops observedWeight from default 0.7 → 0.1, making formula dominate the projection. Stops the "predicting +0.4 kg gain by Sunday" nonsense.
- **Trajectory-aware ADJUST** (`calcAdjust`) — for a long cut from 99 → 89 kg, BMR drops by ~100 cal as weight drops, so TDEE drops by ~155 cal at activity 1.55. Previously calcAdjust used a single TDEE snapshot which overestimated the deficit. Now uses average of `computeFormulaTDEEAtWeight(currentWeight)` and `computeFormulaTDEEAtWeight(targetWeight)` for the projection. Result is a more accurate end-date estimate.

### Bonus fixes

- **TDEE field commits on blur** — settings.tdee field gains `onchange="commitTdeeManual()"` which writes the value to settings and dispatches `TDEE_CHANGED` immediately, so projection / goal bar / nutrition macros refresh without needing CONFIRM PLAN. Previously a typed TDEE override only updated the goal calculator preview until CONFIRM PLAN was tapped.
- **Formula TDEE display** in Settings — always-visible diagnostic line showing what Mifflin-St Jeor predicts at the user's current weight/age/height/activity. Useful for spotting calibration drift at a glance.

### Files touched

- `modules/calibration.js` — added `MAX_KG_CHANGE_PER_WEEK`, `TDEE_CEIL_RATIO` constants; sanity gate in `computeObservedTDEE`; bounds check in `weeklyCalibration`; new exports `checkStoredTdeeSanity` and `autoRevertImplausibleTdee`.
- `app.html` — module loader exposes 2 new calibration exports; runInit calls `autoRevertImplausibleTdee()` before `weeklyCalibration()`; new functions `commitTdeeManual`, `computeFormulaTDEEAtWeight`, `resetTdeeToFormula`; settings panel gains RESET button + formula display + onchange on TDEE field; openSettings hydrates the formula display; updateProjection adds spike trimming + implausibility weight; calcAdjust uses trajectory-averaged TDEE.
- `UPDATE_LOG.md` — this entry.

### What this means for the user

On next load:
1. App detects current TDEE = 1300 is below BMR (~2000)
2. Auto-reverts to formula TDEE (~3103 for 99 kg / 180 cm / 24 yo / cut)
3. Shows banner explaining what happened
4. Projection refreshes — should show weight-loss trajectory, not water-retention noise
5. Settings panel shows "Formula: 3103 cal/day" with RESET button if any future drift happens
6. ADJUST will now correctly model TDEE drop over the planned 35-day cut from ~99 → 89 kg

---

## Version 7.0.1 — 2026-04-26

**Scope:** Patch (3 bug fixes from post-Phase-D triple bug-hunt; no user-visible feature change)
**Banner:** none (patch)

- **Fixed `components/fast-window.js:340`** — `deleteFastWindowFromModal` was checking the wrong DOM ID (`'dayModal'` instead of `'modalOverlay'`). The day modal failed to re-render after a fast window was deleted from the edit modal, leaving stale UI on screen until the user manually closed and reopened the day modal. Earlier fix attempted with `replace_all=true` only matched one indentation variant; the second occurrence was missed.
- **Fixed `modules/calibration.js:102`** — off-by-one in the state-determination gate. The condition `obs.daysAvailable >= 14 - 1` (i.e. `>= 13`) allowed CALIBRATED state with only 13 days of weight history. Changed to `>= 14` to match the documented "14 days of weight + 7 days of food log" threshold.
- **Refactored `recomputeAndApplyTDEE`** — separated TDEE recompute from `settings.currentKg` sync. Previously, when manual TDEE override was on, the function would silently write `settings.currentKg` without dispatching anything, leaving the goal bar stale. Now `recomputeAndApplyTDEE` only handles TDEE; new `syncCurrentKgFromLatestWeight` helper handles the weight-field sync and is called explicitly from `logWeight` / `logWeightFromToday`. The existing `dispatch('WEIGHT_LOGGED')` in those callers refreshes the goal bar (the only consumer of `settings.currentKg` outside the Settings panel).
- **No `sw.js` change** — module file lists unchanged.

---

## Version 7.0.0 — 2026-04-26

**Scope:** Major (calibration project — Phase D; closes the TDEE feedback loop)
**Banner:** shown — "Adaptive TDEE calibration is now live. The app compares your real intake + weight loss against the formula prediction every week and adjusts your TDEE if reality disagrees by more than 7%. New REALITY CHECK block on the TRACK tab shows predicted vs actual loss live. Manual override toggle in Settings if you want to freeze TDEE."

- **New file `modules/calibration.js`** (~210 lines) — closes the TDEE feedback loop:
  - **`computeObservedTDEE(days=14)`** — pure CICO rearrangement: `observedTDEE = avgIntake + (kgLoss × 7700 ÷ spanDays)`. Excludes unlogged eating days from the intake average. Treats fast days as 0 intake unless broken (then uses food log). Returns full status: `{ tdee, daysLogged, daysAvailable, kgLoss, avgIntake, spanDays, valid, reason }`.
  - **`getCalibrationStatus()`** — composes formula TDEE (Mifflin × activity), observed TDEE, and a 70/30 blend. Returns state: `GATHERING` (< 14 days weight or < 7 days food log) or `CALIBRATED`.
  - **`weeklyCalibration()`** — runs at app load. Cadence-gated to once every 7 days. Skipped if `settings.tdeeManualOverride === true` or if state is `GATHERING`. Otherwise blends 70% observed + 30% formula → if change > 7%, writes `settings.tdee`, dispatches `TDEE_CHANGED` (registered in Phase A), and shows a `showAlert` explanation.
  - **`renderRealityCheck()`** — populates the new `#realityCheckBox` block on the TRACK tab. Shows predicted loss, actual loss, gap %, formula TDEE, observed TDEE, currently-used TDEE, average intake, and days logged. Hidden if `daysAvailable < 7`. Color-codes the gap (orange = slower than predicted, green = faster).
- **New TRACK tab block** — `<div id="realityCheckBox">` inserted between radar and weight log. Always-visible (per the simplified plan), no banner-only treatment. New `.reality-check`, `.rc-row`, `.rc-label`, `.rc-val`, `.rc-state-pill`, `.rc-title` CSS.
- **Settings panel** — new "Freeze TDEE — disable weekly auto-calibration" checkbox under the TDEE field. Wired to `settings.tdeeManualOverride`. `openSettings()` hydrates the checkbox from settings on open.
- **`recomputeAndApplyTDEE` (Phase B)** now also syncs `settings.currentKg` to the latest weight log, fixing the minor UX inconsistency identified in the Phase A/B audit (settings panel display was lagging behind reality after a weight log).
- **`runInit`** runs `weeklyCalibration()` once after `idbAutoRestore` + migrations + plan UI setup. Wrapped in try/catch to avoid blocking init on calibration errors.
- **`switchTab('track')`** now also calls `renderRealityCheck()`.
- **Settings defaults** (in `getSettings`) gain four new fields: `tdeeManualOverride: false`, `lastCalibrationAt: null`, `lastCalibrationFormula: null`, `lastCalibrationObserved: null`. All default-merged via the existing `Object.assign({}, defaults, saved)` pattern — backward compatible with all existing user data.
- **No new SK key, no new migration.** All calibration state lives in `settings`. Phase A's v1→v2 schema bump remains the only schema change in this project.
- **APP_VERSION** 6.4.0 → 7.0.0 (major — closes a multi-phase feature category, rework of how TDEE is computed and applied).
- **Phase plan:** `docs/CALIBRATION_PHASE_D_PLAN.md`.
- **At merge to main, `sw.js` cache list must include the two new module files** (`components/fast-window.js` and `modules/calibration.js`) and `CACHE_NAME` must bump (`v25` → `v26`).

---

## Version 6.4.0 — 2026-04-26

**Scope:** Minor (calibration project — Phase C; fast-window timestamps + broken-fast UX)
**Banner:** shown — "Fast days now have real start/stop timestamps. Tap START FAST when you begin, END FAST when you finish. Edit times retroactively. Logging food during an active fast asks if it breaks the fast. Old fast days remain valid (treated as 24-hour fasts)."

- **New file `components/fast-window.js`** (~290 lines) — all fast-window logic:
  - **Read helpers:** `getFastWindows`, `getActiveFastWindow`, `getMostRecentWindow`, `isFastBroken`, `getFastDurationHours`
  - **Write helpers:** `startFast`, `endFast`, `markFastBroken`, `editFastWindow`, `deleteFastWindow` — each fires `FAST_WINDOW_CHANGED` (registered in Phase A)
  - **Render helpers:** `renderTodayFastUI` (TODAY banner state machine — Ready / Active / Broken / Done), `renderDayModalFastEditor` (calendar day modal block), `openFastEditModal` / `saveFastEditFromModal` / `deleteFastWindowFromModal` / `closeFastEditModal`
  - **Live timer:** `startFastTickInterval` — 30 s setInterval refreshes `#fwTimerVal` text; cheap no-op when not on TODAY tab
- **`SK.fastWindows`** (added in Phase A) is now populated by these helpers. Old `SK.fastDays` remains untouched and is interpreted as a 24-hour fast wherever no window exists. **Backward compatible.**
- **`addFoodEntry`** in `app.html` now checks for an active unbroken fast window after logging food; shows a confirm dialog "Break this fast? — BREAK FAST / Cancel". Cancel keeps the fast intact (water, electrolytes, salt, black coffee, green tea allowed mid-fast).
- **Fast banner** on TODAY tab gains a controls strip: live timer, Start/End buttons, Edit Times link.
- **Fast Edit Modal** added (popup-overlay style, matches existing dialogs). Two date+time pickers, "Mark broken" checkbox, Save/Cancel/Delete actions. Cross-midnight overnight fasts handled — start ISO can be on the previous calendar date.
- **Calendar (`modules/calendar.js`)** — `renderCalendar` now colors broken-fast days **orange** (cal-partial) instead of purple (cal-fast), for both today and past days. Uncomplicated fast days remain purple. `openDayModal` now shows the fast-window editor block on past fast days; tap Edit Times to backfill or correct historical fast windows.
- **Module loader** at `app.html:1325` registers all fast-window exports on `window.*` for inline-script + onclick-handler access (same pattern as workout-card / rule-card / checklist).
- **CSS** — new `.fast-banner-controls`, `.fw-state`, `.fw-timer`, `.fw-meta`, `.fw-broken-pill`, `.fw-btn`, `.fw-btn-start`, `.fw-btn-end`, `.fw-btn-edit`, `.fw-btn-row`, `.fast-window-editor`, `.fw-editor-title` classes added inline in `app.html`.
- **No data migration** — fastWindows[date] is empty by default; readers fall back to existing fastDays. The Phase A migration v1→v2 already registered the schema version bump.
- **Phase plan:** `docs/CALIBRATION_PHASE_C_PLAN.md`.
- **No `sw.js` change** — CACHE_NAME bumps once at merge to main per CLAUDE.md feature-branch convention. **`components/fast-window.js` will need to be added to the sw.js cache list at merge time.**

---

## Version 6.3.0 — 2026-04-26

**Scope:** Minor (calibration project — Phase B; new auto-recompute behavior on weight log)
**Banner:** shown — "TDEE now updates automatically when you log a new weight. Lose weight → TDEE drops; gain weight → TDEE rises. No more manual auto-fill."

- **`recomputeTDEE()`** added near `computeAutoTDEE` in `app.html`. DOM-free Mifflin-St Jeor recompute that reads weight from the latest weight log and reads height/age/sex/activity multiplier from `settings`. Returns `null` if any input is missing or if `settings.tdeeManualOverride` is truthy (override flag ships in Phase D).
- **`recomputeAndApplyTDEE()`** wrapper. Compares the recomputed TDEE to `settings.tdee`, writes if different, fires `TDEE_CHANGED` (added in Phase A). Returns true/false. Skips dispatch when no change.
- **`logWeightFromToday()`** and **`logWeight()`** now call `recomputeAndApplyTDEE()` after `saveDayLogField()` and before the existing `dispatch('WEIGHT_LOGGED')`. Weight loss → lower TDEE; weight gain → higher TDEE. Cascades to projection, goal bar, duration bar, nutrition macros, radar.
- **`autoFillTDEE()`** now fires `dispatch('TDEE_CHANGED')` after `saveSettings(s)`. Pre-existing bug fix: previously the function wrote `s.tdee` silently and dependent UI stayed stale until another event triggered a re-render.
- **Phase plan:** `docs/CALIBRATION_PHASE_B_PLAN.md`.
- **No** `sw.js` change (CACHE_NAME bumps once at merge to main).

---

## Version 6.2.5 — 2026-04-26

**Scope:** Patch (calibration project — Phase A scaffolding; no user-visible behavior change)
**Banner:** none (patch)

- **New storage key `SK.fastWindows = 'ph_fw_v1'`** added to the SK object in `app.html`. Empty by default. Will hold per-day fast-window timestamps `{ start, end, broken, brokenBy }` once Phase C ships. Existing `SK.fastDays` is untouched and continues to work; calendar/checklist/radar readers fall back to the legacy boolean (interpreted as a 24-hour fast).
- **Two new dispatch events** registered in `DISPATCH_MAP`:
  - `TDEE_CHANGED → ['projection','durationBar','goalBar','nutritionMacros','radar']` — fired by Phase B/D when calibration writes a new TDEE.
  - `FAST_WINDOW_CHANGED → ['fastUI','checklist','calendarCell','projection','radar']` — fired by Phase C when a fast window starts, stops, edits, or breaks.
  No new dispatch targets — every target name already existed in the `dispatch()` switch.
- **Schema migration v1 → v2** registered in `migrations/registry.js`. Purely additive — no data is read, transformed, or rewritten. `requiresBackup: false`. The migration only bumps the schema-version record so future migrations can build on this state.
- **No `sw.js` change** (per CLAUDE.md feature-branch convention; CACHE_NAME bumps once at merge to main).
- **Phase plan:** `docs/CALIBRATION_PHASE_A_PLAN.md` documents scope, files touched, smoke test, and acceptance criteria.

---

## Version 6.2.4 — 2026-04-21

**Scope:** Patch (landing page content corrections; app unchanged)
**Banner:** none (patch)

- **Stats corrected** on `index.html`. "60+ UPDATES" and "60+ SHIPPED" were stale (actual version count is 85+). Bumped both stat displays to `85+`. Visitors now see an accurate cadence indicator.
- **Changelog entry for v6.2.3 rewritten** to accurately describe the release. Previously the "current" entry had bullets for the plan-aware calorie work (actually v6.2.0-v6.2.2). Now v6.2.4 entry describes the landing redesign + animated install guide + these content corrections, and a new v6.2.2 entry was added below it to cover the calorie/radar work chronologically.
- **Plan cards qualifier added.** The section description now explicitly notes "Calorie numbers below are typical presets — every plan is user-configurable in Settings." Clarifies that the displayed numbers (LITE 1200, CUT 1500, AGRO 1000, BULK +300, MAINTENANCE TDEE ±200) are editorial typicals rather than hard plan defaults.
- **Version surfaces synced** to `v6.2.4` across title, nav badge, hero badge, install-guide header, stat card, footer, cache-bust query strings (`?v=6.2.4`).
- **`sw.js`:** bumped `CACHE_NAME` to `v25` to force visitors to fetch the updated landing on their next visit.

---

## Version 6.2.3 — 2026-04-21

**Scope:** Patch (landing page redesign + animated install guide; app unchanged)
**Banner:** none (patch — only new visitors see the landing; installed PWA users skip via the standalone redirect)

- **New landing page (`index.html`) shipped** with a full visual redesign: hero, anywhere/globe section, features, power, plans, changelog, science, FAQ, and a new **animated install guide modal** with three tabs (Android/iOS/Desktop). Each tab auto-advances through its platform-specific steps with a live device mockup, tap-ring pulses, timeline progress, and synchronized step list.
- **New `assets/` directory** with 9 files: 5 CSS (`landing.css`, `landing-sections.css`, `landing-demos.css`, `landing-v5.css`, `install-guide.css`), 3 JS (`landing.js`, `landing-v5.js`, `install-guide.js`), 1 JSON (`land-110m.json` — world map topology for the "ANYWHERE" section's interactive globe).
- **PWA standalone redirect preserved** at the very top of `<head>`. Users who have already installed the PWA never see the landing page — their app icon opens `index.html` → inline script fires before paint → `window.location.replace('app.html')`.
- **Logos use existing repo-root assets.** Handoff bundle included `assets/PH_ARROWS_LOGO.png` (duplicate of the existing one at repo root); skipped to avoid duplication. All image refs in the new `index.html` were rewritten to point at the repo-root `PH_ARROWS_LOGO.png` and `PH_LOGO_192.png`. `hero3d.js` in the handoff was also unused (never referenced by `index.html`); skipped.
- **Cache-bust query strings aligned** to `?v=6.2.3` across all 5 CSS and 3 JS asset references for consistent invalidation on returning visitors.
- **Version surface consistency:** title, nav badge, hero badge, changelog entry, footer, all note `v6.2.3`. Historical changelog entries for prior versions left untouched.
- **`sw.js`:** bumped `CACHE_NAME` to `v24` and added the 9 new `assets/*` files to the critical cache list so the landing page + install guide work offline for returning visitors.
- **`app.html`:** bumped `APP_VERSION` to `6.2.3`. No code behavior changed.
- **Cleanup:** the handoff `Temp/` directory was removed from the repo after the migration; only the production assets remain.

---

## Version 6.2.2 — 2026-04-21

**Scope:** Patch (cleanup pass — dead code, docs, repo polish; no behavior change)
**Banner:** none (patch)

- **Dead code removed:** `idbGet(key)` in `app.html` was never called anywhere in the repo (only `idbGetAll` and `idbPut` are used). Deleted.
- **`ARCHITECTURE.md` stale claim fixed:** the "app.html — Single File Application" subgraph label updated to reflect the post-v6.0.0 modular structure; added a top-of-file note explaining the doc covers domain logic and pointing readers to `CLAUDE.md` §23 for the module layout.
- **`README.md` added** at repo root — short visitor-facing intro: what the app does, architecture at a glance, documentation map, editing rules (with pointers to `CLAUDE.md`).
- **`docs/REFACTOR_COMPLETE.md` added** — consolidated retrospective of the 2-day v5.0.1 → v6.0.0 modular refactor: phase ladder, file-level delta, interop pattern rationale, decisions made, post-refactor bugs found and fixed, owner-confirmed smoke results, lessons. Replaces the per-phase summary docs that were never written (owner used batched testing strategy).
- **`CLAUDE.md` §14 (Related Documentation) expanded** to cover `README.md`, `WORKING_VERSIONS.md`, `docs/REFACTOR_COMPLETE.md`, and the `docs/PHASE_N_PLAN.md` files with honest descriptions of each.
- **Comprehensive audit run:** 5 scans across repo structure, dead code, bugs, documentation, and data integrity. Only findings were the items above — code-level invariants (onclick resolution, import resolution, module-to-window assignments, DOM ID references, SK key usage) all scanned clean.
- **`sw.js`:** bumped `CACHE_NAME` to `v23`.

---

## Version 6.2.1 — 2026-04-21

**Scope:** Patch (calendar root-cause fix — calorie info item missing from legacy days)
**Banner:** none (patch)

- **Root cause fix for "all past days showing partial orange".** `migrateOrphanedChecks` previously updated the `f2` calorie info check value ONLY when `f2` was already present in the day's `checks` object. Legacy days where the user never tapped the calorie card had `f2` missing entirely. The completion counter (`getValidCheckCompletion`) counts every plan-checklist item in the denominator and treats missing as not-done — so a day with all 18 other items ticked plus a missing f2 showed as 18/19 = 94.7% → partial.
- **Fix:** removed the `(item.id in checks)` guard in `migrateOrphanedChecks`. Info items (`type: 'info'`, e.g. `f2` across all plans) are now always populated from the food log via `evalCalorieStatus`. On next reload, every past day's `f2` auto-computes:
  - Day with no food log → `f2 = true` (no penalty, no log means nothing to judge).
  - Day with food ≤ ceiling → `f2 = true` (green card).
  - Day with food > ceiling but < 1.5× → `f2 = true` (orange card, still passes).
  - Day with food ≥ 1.5× ceiling → `f2 = false` (red card, day fails).
- **Effect on owner's data:** days 3/23-3/31 that were fully ticked with food 750-1300 cal will flip back to green on next reload. Days that genuinely had calorie overages ≥ 1.5× ceiling stay partial/red.
- **`sw.js`:** bumped `CACHE_NAME` to `v22`.

---

## Version 6.2.0 — 2026-04-21

**Scope:** Minor (Calorie logic rebuilt plan-aware + calendar semantics fix)
**Banner:** "Calorie logic rebuilt per plan: CUT/LITE/MAINTENANCE ≤ceiling=green, ceiling-1.5×=orange, ≥1.5×=red+fails day. BULK ≥target=green, >0.5×=orange, ≤0.5×=red+fails day. Past days will re-evaluate on reload."

- **Plan-aware calorie card logic (new utility `evalCalorieStatus` in `app.html`)** replaces the three duplicated threshold blocks in `components/checklist.js` (render + refresh) and `migrateOrphanedChecks` in `app.html`.
- **CUT / LITE / MAINTENANCE plans (goalMode === 'cut' or 'maintenance'):**
  - `actual ≤ ceiling` → **GREEN** (at or under cap — ideal cut day). Does NOT fail day.
  - `ceiling < actual < ceiling × 1.5` → **ORANGE** on TODAY card only. Does NOT fail day. Calendar stays green/partial based on other items.
  - `actual ≥ ceiling × 1.5` → **RED** on TODAY card. **Fails the day** (calPass=false). Calendar marks partial due to this single item.
- **BULK plan (goalMode === 'bulk'):**
  - `actual ≥ target` → **GREEN** (met or exceeded target).
  - `target × 0.5 < actual < target` → **ORANGE** on TODAY card. Does NOT fail day.
  - `actual ≤ target × 0.5` → **RED**. Fails day (severely under target).
- **Previous v6.1.0 regression fixed.** v6.1.0 mistakenly flipped the red threshold to `> ceiling` (any overshoot fails), which falsely marked everything between `ceiling` and `ceiling × 1.5` as failing. Days with 1113 cal on a 1000 ceiling (11% over — normal cut variation) were incorrectly partial. Restored to the original intent: only ≥50% overshoot fails.
- **Auto re-evaluation on load.** `migrateOrphanedChecks` runs every init and re-computes stored `f2` (calorie info) check values from the food log using the new evaluator. Past days will retroactively correct to the new bands on next reload — no user action needed.
- **`sw.js`:** bumped `CACHE_NAME` to `v21`.

---

## Version 6.1.0 — 2026-04-21

**Scope:** Minor (Post-refactor regression fixes + radar consistency + UX polish)
**Banner:** "Calorie card bands restored (≤1000 green, 1001-1500 orange, >1500 red = fails day). Radar consistency + fasting axes now use the same checklist counter as the calendar."

- **Calorie card color bands restored to pre-refactor behavior.** Thresholds on the TODAY calorie info card and the auto-refresh code:
  - `actual ≤ ceiling × 2/3` (≤1000 when ceiling is 1500) → GREEN
  - `ceiling × 2/3 < actual ≤ ceiling` (1001-1500) → ORANGE — doesn't fail the day
  - `actual > ceiling` (>1500) → RED — fails the day (calPass = false)
  Previously (post-refactor regression): red threshold was at `ceiling × 1.5` (2250), so 1501-2249 cal days were scored as "pass" and flooded calendar with false-green days. Fix brings the threshold back to `ceiling`, matching owner's actual intent. Applied in three places: `components/checklist.js` render, `components/checklist.js` refresh, `app.html` `migrateOrphanedChecks`.
- **Radar CONSISTENCY axis aligned with calendar.** Previously computed `checklistDepth` from `plan.checklistNormal.length` (parent-only counter). Now uses `getValidCheckCompletion(ds)` — same source of truth the calendar uses. Fixes parent-aggregate under-counting for supplement groups (a group with N subs used to count as 1 item; now counts as N).
- **Radar FASTING axis aligned with calendar.** Previously used `Object.values(log.checks).filter(Boolean).length / .length` — unfiltered by valid IDs, could include orphans. Now uses `getValidCheckCompletion(ds)` — same as calendar + CHECKLIST axis.
- **Schema card explanation added.** Settings → Data Management → Schema card now has a one-line description: "Tracks the data-shape version of your stored data. Used internally to safely upgrade your data when the app changes how things are saved. Safe to ignore."
- **Expected user-visible effect:** past days with 1501-2249 cal that previously displayed green will now display partial. This matches the pre-refactor intent (over-ceiling = fails day). Radar CONSISTENCY and FASTING axis values may shift slightly to reflect true checklist completion (usually slightly lower because the denominator is more accurate).
- **`sw.js`:** bumped `CACHE_NAME` to `v20`.

---

## Version 6.0.0 — 2026-04-21

**Scope:** Major (Architecture refactor complete — Phase 6 of 2-day refactor)
**Banner:** "Architecture refactor complete. Zero behavior change; app is now modular under the hood."

- **Refactor milestone.** The 2-day modular refactor that began with v5.1.0 is complete. Zero observable behavior change across the six phases; the app is now a modular ES-module PWA with a ~4,600-line bootstrap (`app.html`), plan definitions under `plans/`, large function groups under `modules/`, shared UI helpers under `components/`, and a schema-migration framework under `migrations/`. See `CLAUDE.md` Section 23 for the full architecture.
- **CLAUDE.md gains four new sections:**
  - Section 23 — Modular Architecture (post-refactor directory map + the bare-name/globalThis interop pattern + startup sequence + change-location guide).
  - Section 24 — Schema Migration Playbook (copy-pasteable migration template + rules).
  - Section 25 — Working With This Codebase (session-start checklist, feature / bugfix / rollback procedures, non-negotiable principles).
  - Section 26 — File Line-Count Governance (soft limits with current actuals).
- **Stale prose fixed:** removed "single-file" / "one HTML file" / "~5000+ lines" claims from Sections 2, 5, 10, and 13.
- **`sw.js`:** `CACHE_NAME` bumped to `v19`.
- **`index.html`:** hero-badge updated to `v6.0.0`.
- **Zero app code changed in Phase 6** — it's pure documentation + version bump.

**Cumulative refactor delta (v5.0.1 → v6.0.0):**
- `app.html` reduced from ~8,572 lines to ~4,600 (-46%).
- New directories: `plans/` (7 files), `modules/` (4 files), `components/` (3 files), `migrations/` (3 files) — 17 module files loading natively via ES-module `<script>` tags.
- New infrastructure: schema version tracking (`ph_sch_v1`), auto-backup before destructive migrations, future-schema-backup guard on restore.
- New discipline: `WORKING_VERSIONS.md` append-only log, per-phase git tags (`vX.Y.Z-working`), version-tagging rule in CLAUDE.md §11.

---

## Version 5.5.0 — 2026-04-21

**Scope:** Minor (Shared components extraction — Phase 5 of 2-day refactor)
**Banner:** "Under the hood: shared UI components extracted. No behavior change."

- **Extracted shared UI helpers from `app.html` into the new `components/` directory:**
  - `components/workout-card.js` — `exRow`, `exRowWithLevel`, `workoutCard`, `stretchRow`, `_resetExRowInstances`, plus module-scoped `_exRowInstanceCount` and `_wexCounter` state (54 lines).
  - `components/rule-card.js` — `ruleCard` (4 lines).
  - `components/checklist.js` — full TODAY-tab checklist lifecycle: `renderTodayChecklist`, `loadChecklist`, `toggleSupExpand`, `toggleSupItem`, `updateSupCount`, `toggle`, `toggleWaterExpand`, `onWaterInput`, `adjustWater`, `updateWaterCardState`, `saveAllChecks`, `syncAutoStatusChecks`, `refreshAutoItems`, `resetToday` (404 lines).
- **`app.html` reduced by another ~456 lines** (from ~5045 to ~4590). All content byte-identical to source, verified via text-diff.
- **Module interop:** a fourth `<script type="module">` shim imports the three component modules and promotes all exports to `window.*`. Plans' `workoutContent`/`rulesContent` templates continue to call `exRow`, `workoutCard`, `ruleCard`, etc. by bare name — resolved via globalThis fallback.
- **`runInit()`** now awaits a fourth readiness event, `ph:components-ready`, after the existing migrations/plans/fnmodules gates.
- **Module-local state:** `_exRowInstanceCount` and `_wexCounter` (used by `exRowWithLevel`, `exRow`, `stretchRow` to generate unique row IDs) live inside `components/workout-card.js`. External callers clear them via the exported `_resetExRowInstances()`.
- **`sw.js`:** bumped `CACHE_NAME` to `v18` and added the three `components/*.js` paths to the critical cache list.
- **`index.html`:** hero-badge updated to `v5.5.0`.
- **Part B (judgment-heavy factoring of in-plan duplication) was NOT done** — prompt recommended skipping; app would gain filing-cabinet value at meaningful risk. Left as a post-refactor backlog item if ever warranted.

---

## Version 5.4.0 — 2026-04-21

**Scope:** Minor (Large function extraction — Phase 4 of 2-day refactor)
**Banner:** "Under the hood: export, calendar, and radar load as separate modules. No behavior change."

- **Extracted four large function groups from `app.html` into the new `modules/` directory:**
  - `modules/schedule-html.js` — `downloadScheduleHTML` (233 lines)
  - `modules/radar.js` — `setRadarWindow`, `computeRadarMetrics`, `renderRadar`, plus the module-scoped `radarWindow` state (411 lines)
  - `modules/calendar.js` — `changeMonth`, `renderCalendar`, `openDayModal`, 6 modal handlers (`toggleModalCheck`, `toggleModalSupItem`, `toggleModalWorkoutChecklist`, `toggleModalWorkoutEx`, `toggleFastDay`, `toggleLightDay`), `saveDayLog`, `closeModal`, plus the module-scoped `calYear`/`calMonth` state and the modalOverlay click-outside listener (583 lines)
  - `modules/export.js` — `openExport`, `generateExport` (with all nested helpers), `renderMarkdownPreview`, `inlineFormat`, `copyExport`, `downloadReport` (716 lines)
- **`app.html` reduced by another ~1943 lines** (from ~6929 to ~4990). All extracted code is byte-identical to its former inline source, verified by text-diff before removal.
- **Module interop:** a new `<script type="module">` shim imports the four modules and promotes each exported function to `window.*`. Runtime callers (classic script + HTML onclick handlers) continue to resolve bare identifiers (`renderCalendar()`, `openDayModal('2026-04-10')`, etc.) via globalThis fallback.
- **Globals exposure:** the classic script explicitly runs `Object.assign(window, { SK, MONTHS_LIST, DAYS_SHORT, AUTO_WORKOUT_IDS, WORKOUT_ITEM_SESSION })` so the extracted modules can reference those `const` bindings by bare name. Function declarations are automatically window-attached; only `const`/`let` needed explicit exposure.
- **New startup gate:** `runInit()` now awaits a third readiness event, `ph:fnmodules-ready`, after the existing migrations-ready and plans-ready gates.
- **Module-local state:** `radarWindow` (default 7-day radar window) lives inside `modules/radar.js`; `calYear`/`calMonth` (current calendar month pointer) lives inside `modules/calendar.js`. Neither is reachable from the classic script — the module exports the functions that read/mutate them.
- **`sw.js`:** bumped `CACHE_NAME` to `v17` and added the four `modules/*.js` paths to the critical cache list.
- **`index.html`:** hero-badge updated to `v5.4.0`.

---

## Version 5.3.0 — 2026-04-20

**Scope:** Minor (Plan extraction — Phase 3 of 2-day refactor)
**Banner:** "Under the hood: plan definitions now load as separate files. No behavior change."

- **Extracted all 5 plan objects and `EXERCISE_PROGRESSIONS` from `app.html` into ES modules** under the new `plans/` directory: `lite.js` (historical `default` key), `agro.js`, `cut.js`, `bulk.js`, `maintenance.js`, `exercise-progressions.js`, plus `index.js` that assembles the `PLANS` object and maps the historical `default` key to LITE PROTOCOL.
- **`app.html` reduced by ~1765 lines** — the inline plan definitions (previously ~L2253-L4027) are now a 10-line pointer comment.
- **Module interop:** new `<script type="module">` loader in `<body>` imports from `plans/index.js` and promotes `PLANS` + `EXERCISE_PROGRESSIONS` to `window.*`. Dispatches a `ph:plans-ready` event; `runInit()` awaits this gate alongside the existing `ph:migrations-ready` gate.
- **Byte-fidelity:** every extracted plan was verified identical to its original source lines via text diff before the source was removed. Zero behavior change.
- **Backward compatibility:** users whose `settings.plan === 'default'` continue to see LITE PROTOCOL — the historical key is explicitly mapped in `plans/index.js`.
- **`sw.js`:** bumped `CACHE_NAME` to `v16` and added the 7 new `plans/*.js` paths to the critical cache list so the whole app works offline.
- **`index.html`:** hero-badge updated to `v5.3.0`.

---

## Version 5.2.0 — 2026-04-20

**Scope:** Minor (Bugfixes — Phase 2 of 2-day refactor)
**Banner:** "Calendar accuracy: compliance now measured against full checklist, not just items you touched. Some past days will shift from green to partial — this is correct."

- **`getValidCheckCompletion` denominator bug fixed.** Total is now computed from the filtered checklist definition (items + day-filtered sub-items + `_workout` when rendered), not from the count of check entries the user had previously touched. Past days that were green from partial compliance now correctly display as partial or missed. Parent items with sub-items are no longer double-counted; the parent is a derived aggregate per `loadChecklist`, only the sub-items themselves count toward the ratio.
- **`idbSyncAll` no longer silently swallows errors.** Replaces the empty `catch {}` with `console.warn` including the storage key and error, so IndexedDB mirror sync failures are visible in devtools.
- **`idbAutoRestore` surfaces partial restore failures to the user.** Tracks failed keys, logs each with `console.error`, and shows a `showAlert` after init if any key couldn't be written back from the IDB mirror to localStorage.
- Bumped `CACHE_NAME` to `v15`, hero-badge to `v5.2.0`.

---

## Version 5.1.0 — 2026-04-20

**Scope:** Minor (Migration framework — Phase 1 of 2-day refactor)
**Banner:** "Data safety: migration framework installed. Your existing data is untouched."

- **Added `migrations/` directory** with three ES modules: `runner.js`, `registry.js`, `helpers.js`. All loaded via `<script type="module">` from `app.html` and promoted to `window.*` for use from the main inline script.
- **New schema version tracking** via `ph_sch_v1` localStorage key. On first run of v5.1.0 the record is established with `schemaVersion: 1` and `establishedFrom: 'existing-user' | 'fresh-install'`. No migrations registered in this release — the framework ships empty.
- **Backup JSON expanded** with two additive fields: `schemaVersion` and `appVersion`. Old backups (without these fields) continue to restore cleanly — missing `schemaVersion` is treated as `1`.
- **Restore guard added:** backups from a future schema version are rejected with a clear message instructing the user to update the app first. Prevents silently loading data the current app can't interpret.
- **Auto-backup mechanism** in the migration runner: any migration with `requiresBackup: true` triggers a JSON download of all `ph_*` keys before running. No migrations use this yet, but the plumbing is in place for Phase 3+.
- **Settings → Data Management:** new SCHEMA card displays the current schema version. EXPORT MIGRATION LOG button downloads the full `ph_sch_v1` record.
- **`runInit()` converted to async** and reordered: wait for migrations module → `idbAutoRestore` → `runMigrations` → rest of init. Halts with alert if migrations fail. Entry-point IIFE simplified since conditional IDB branching moved into `runInit`.
- **`sw.js`:** bumped `CACHE_NAME` to `protocol-health-v14` and added the three `migrations/*.js` paths to the critical cache list. Framework works offline.
- **`index.html`:** hero-badge updated to `v5.1.0` (corrected lingering `v5.0.0` drift from pre-5.0.1).

---

## Version 5.0.1 — 2026-04-08

**Scope:** Patch (Day modal food log macro inputs)

- **Macro inputs added to MONTHS day modal food logger** — The food log input in the day modal (opened by tapping any past day on MONTHS tab) now includes Protein, Carbs, and Fat fields matching the TODAY tab's food logger. Previously only Name and Calories were available, so past-day food entries couldn't include macros.

---

## Version 5.0.0 — 2026-04-07

**Scope:** Major (Lite Protocol + Supplement Toggle)
**Banner:** "Lite Protocol: gentle workouts for all ages. Supplement tracking now optional in Settings."

- **Default Protocol renamed to Lite Protocol** — Complete rewrite of the default plan. New identity: "Gentle. Sustainable. For every body." Plan key (`'default'`) unchanged for backward compatibility with existing localStorage data.
- **New workout content** — Chair Strength A/B/C (Mon/Wed/Fri) with seated exercises, wall push-ups, and isometric holds. Tai Chi Flow (Tue), Gentle Yoga (Thu), Mat Pilates + Balance (Sat). All exercises safe for elderly and limited mobility — no push-ups, burpees, or high-impact movements.
- **New nutrition content** — 30/45/25 macro split (protein/carbs/fat). Gentle deficit guidance (300–500 cal below TDEE, 0.25–0.5 kg/week). Supplement section (D3, Omega-3, Magnesium, Calcium, Multivitamin) with NIH safety notes, conditional on supplement toggle.
- **New rules content** — 13 rules covering eating (6), training (4), discipline (3). Gentle and encouraging language. Includes "Consult your doctor before starting" as Rule 13.
- **New checklists** — Normal day (15 items), fast day (5 items), light day (6 items). Supplement sub-items (D3, Omega-3, Magnesium) as expandable panel.
- **Global supplement toggle** — New `supplementsEnabled` setting (defaults to `true`). Toggle in Settings panel controls whether SUPPLEMENTS group items render in TODAY checklist, day modal, and completion scoring. All plans affected. AGRO users unaffected — `undefined` in saved settings evaluates as `true`.
- **Supplement filtering in completion** — `getValidCheckCompletion()`, `renderTodayChecklist()`, and `openDayModal()` all filter out SUPPLEMENTS items when disabled. Calendar cell colors, progress bars, and radar chart reflect the filtered set.
- **Updated labels** — "LITE PROTOCOL" in header badge, settings dropdown, active plan banner, splash screen, index.html plan switcher. No visible references to "DEFAULT PROTOCOL" remain.
- **PLANS.agro unchanged** — Not one line modified. All AGRO-specific code (resolveSupplementSub, zinc schedule, workout/nutrition/rules content) preserved byte-for-byte.
- **DEFAULT CUT overhauled** — New multi-modal training: Resistance 3x/week (upper/lower/full body) + HIIT 2x/week (circuits + shadowboxing + jump rope) + active recovery yoga + daily walking. 40/35/25 macro split. Supplement sub-items (creatine, D3, omega-3, magnesium). 12 rules (6 eating, 4 training, 2 discipline).
- **DEFAULT BULK overhauled** — Tempo 3-1-2-0 on all primary compounds. Animal Flow mobility sessions. Pilates core work. Isometric finishers (push-up bottom hold, deep squat hold). 30/50/20 macro split. Per-meal protein dosing (0.40–0.55g/kg). Calorie cycling. 14 rules with science citations.
- **DEFAULT MAINTENANCE overhauled** — Multi-modal variety: Bodyweight Resistance A/B + Cardio Rotation (4 options) + Yoga/Pilates (alternate weeks) + Animal Flow + Saturday recreation. 30/45/25 macro split. Monthly weight drift check. Skill-based progression goals. 12 rules.
- **All plans get supplement sub-items** — Cut, Bulk, Maintenance checklists now include SUPPLEMENTS group with expandable sub-items (creatine, D3, omega-3, magnesium), controlled by the global supplement toggle.
- **Nutrition conditional on supplement toggle** — All plans show supplement cards in NUTRITION tab only when supplementsEnabled is true. Otherwise show "Enable in Settings" message.
- **index.html plan descriptions updated** — Cut, Bulk, Maintenance plan switcher descriptions reflect new multi-modal training content.

---

## Version 4.6.0 — 2026-04-05

**Scope:** Minor (Calendar update bug fix + export report overhaul)
**Banner:** "Calendar updates instantly on modal edits. Export report overhauled: date range fixed, compliance labels clarified, non-scheduled section removed, fast day status corrected, pluralization fixed."

- **BUG FIX: Calendar cell color now updates immediately on modal check toggle** — `closeModal()` now calls `renderCalendar()` when the MONTHS tab is active, ensuring calendar cells reflect the latest check state the moment the modal closes. Previously, cell colors could remain stale (e.g. orange instead of green) until a tab switch or app reload.
- **Export report date range fixed** — Default "From" date now uses schedule start date (or settings start date, or first logged date) instead of hardcoded 30 days ago. Report period accurately reflects the actual data window.
- **Non-Scheduled Days section removed** — The confusing "Non-Scheduled Days" segment (showing days before the schedule existed) is replaced with a brief footnote if any logged days exist outside the schedule window.
- **Compliance section overhauled** — Added day-level compliance summary (days at 100%, partial, no data). Category breakdown now uses descriptive labels ("Morning routine items" instead of "MORNING") with an explanatory subtitle. `type:'info'` items (f2 calorie ceiling card) excluded from compliance calculations.
- **Weak spots exclude info items** — The f2 calorie ceiling info card no longer appears in weak spots. Weak spot labels now include day type context (e.g. "(fast days)") and use proper pluralization.
- **Fast Days Completed fixed** — Only counts fast days up to today, not future scheduled ones. Displays as "6 / 6 so far (13 total in plan)" instead of the misleading "6 / 13 scheduled".
- **Broken Fast Days labeled correctly** — "Fast Days (food logged)" renamed to "Broken Fast Days" with explanatory note. Status shows "Fast broken" instead of incorrect "On track" for any food consumed on fast days.
- **Section descriptions added** — Summary, Compliance, Nutrition (eating days), Weight Trend, Notes, and Daily Log sections now include one-line descriptions explaining what they show.
- **Daily Log legend added** — Status column now has a legend: Full = 100%, Good = 70–99%, Partial = 50–69%, Low = below 50%. Threshold for "Good" corrected from 75% to 70% to match.
- **Pluralization fixed** — All day count displays use proper singular/plural ("1 day" not "1 days") throughout the report.

---

## Version 4.5.3 — 2026-04-01

**Scope:** Patch (Migration corrects stale historical workout/water/calorie checks)

- **Stale workout auto-items fixed** — `migrateOrphanedChecks()` now detects days where `workoutSessions` shows completion (≥80% per session) but the checks for m2/m3/e1/e2/e3 are `false`. Corrects them to `true`. Also fixes `_workout` item from global counts.
- **Stale water items fixed** — If `dayLogs[date].water` meets the plan's water target but `checks[waterItemId]` is `false`, corrects it to `true`.
- **Stale calorie info items fixed** — Recomputes f2 pass/fail from actual food log data for each historical day. If calories ≤ ceiling×1.5, f2 = true (pass). Over 150% = false (fail).
- **Root cause:** These items were saved as `false` by versions before v4.4.0 which didn't have auto-workout per-session tracking, water input syncing, or info card logic. The `checks` object retained stale values that `getValidCheckCompletion()` counted as failures.
- **Affected days:** Any eating day where all workouts were done but the pre-v4.4 code wrote m2/m3/e1/e2/e3 as false. March 30 is the primary example.

---

## Version 4.5.2 — 2026-04-01

**Scope:** Patch (Audit warning fixes — loadChecklist guard + backup timestamp migration)

- **loadChecklist() info guard** — Added `item.dataset.type !== 'info'` to the else branch condition. Info items no longer get `.done` class toggled during checklist load, preventing CSS conflict with their dynamic background color.
- **Backup timestamp migrated to SK** — Added `SK.backupTs = 'ph_bts_v1'` to the storage key registry. All 3 raw `localStorage.getItem/setItem('ph_last_backup_ts')` calls replaced with `gs(SK.backupTs)` / `ss(SK.backupTs)`. Backup timestamp is now included in backup exports, restored from backup files, and mirrored to IndexedDB.
- **BUG 1 (updateProgress) was already fixed** in v4.5.1 — info items are counted via `data-cal-pass` attribute, not excluded. Severe overshoot (>50% over ceiling) correctly fails the day per user requirement.

---

## Version 4.5.1 — 2026-04-01

**Scope:** Patch (Calorie card severe overshoot now counts toward day completion)

- **Calorie card counts toward completion** — The info card (f2) is NOT a checkbox but its pass/fail state IS written to checks and counted by `updateProgress()`, `getValidCheckCompletion()`, calendar scoring, and radar CHECKLIST axis. Under ceiling or mildly over (≤50%) = pass. Severely over (>50%) = fail, making the day partial.
- **`updateProgress()` bug fixed** — Was counting all `.check-item` elements uniformly. Now reads `data-cal-pass` attribute for info items to determine pass/fail instead of checking `.done` class.
- **`saveAllChecks()` persists f2** — Info items saved to checks with `calPass` boolean from `data-cal-pass` attribute.
- **`refreshAutoItems()` persists f2** — When food is logged, f2 pass/fail is immediately written to checks so calendar and radar update in real-time.
- **`getValidCheckCompletion()` includes f2** — Reverted the info-item exclusion. f2 is now a valid check ID that participates in completion scoring.
- **`migrateOrphanedChecks()` keeps f2** — No longer deletes f2 from historical checks. Info items are included in the valid ID set.
- **Day modal shows severity** — Past day info cards show ✗ icon on severe overshoot, ✓ on under ceiling.

---

## Version 4.5.0 — 2026-04-01

**Scope:** Minor (Calorie ceiling info card + orphan migration enhancement)
**Banner:** "Calorie ceiling is now an info card (no longer affects checklist completion). Orphaned check IDs cleaned from version transitions."

### Calorie Ceiling → Info Card
- **`f2` items across all 5 plans** changed from `type:'auto-cal'` to `type:'info'`. No longer a checkbox or auto-status item — now a read-only colored info card.
- **Rendering** — shows `actual / ceiling cal` with green background (under), orange (1–50% over), or red (50%+ over). No checkbox circle, not clickable (`cursor:default`).
- **Excluded from completion** — `getValidCheckCompletion()` now skips `type:'info'` items. They don't count toward checklist percentage, calendar day color, or radar CHECKLIST axis.
- **`saveAllChecks()` skips info items** — `data-type="info"` items are not written to `checks` object.
- **`toggle()` skips info items** — early return guard added.
- **`refreshAutoItems()` updated** — calorie section now updates the info card's background color and status text instead of toggling done/fail classes.
- **Day modal** — past days show the info card with correct color based on food log data for that date.

### Migration Enhancement
- **`migrateOrphanedChecks()` now removes `f2`** from all historical `checks` objects. Days that were orange because of `f2=false` will recalculate as green.
- **Whitelists `wex*` IDs** — workout exercise check IDs (`wex0`, `wex1`, etc.) are no longer deleted by the migration.
- **Info-type items excluded from valid ID set** — items with `type:'info'` are never considered valid check IDs.

---

## Version 4.4.0 — 2026-03-31

**Scope:** Minor (Per-session workout tracking — morning and evening items tick independently)
**Banner:** "Workout items now track per-session: morning exercises tick morning items, evening exercises tick evening items. No more all-or-nothing."

- **Per-session workout tracking** — Workout auto-items (m2/m3, e1/e2/e3) now track INDEPENDENTLY. Morning items (m2 mobility, m3 morning workout) tick when morning session exercises are ≥80% done. Evening items (e1/e2 evening session, e3 stretch) tick when evening session exercises are ≥80% done. Previously all items shared ONE global count and ticked/unticked together.
- **`classifyWorkoutCard()`** — classifies workout cards by title: "MORNING"/"ACTIVATION" → morning session, "REST"/"WALK" → rest (skipped), everything else → evening session.
- **`WORKOUT_ITEM_SESSION` map** — `{ m2:'morning', m3:'morning', e1:'evening', e2:'evening', e3:'evening' }`.
- **`workoutSessions` storage field** — `{ morning: { total, done }, evening: { total, done } }` saved alongside `workoutChecks` in dayLogs. Computed by `toggleWorkoutEx()`, `updateWorkoutProgress()`, and `toggleModalWorkoutEx()`.
- **Fallback for single-session plans** — CUT/BULK/MAINTENANCE plans have no "MORNING" cards. Morning items (m2/m3) fall back to the evening session counts so they still work.
- **Day modal workout checklist** — `toggleModalWorkoutEx()` now computes per-session data from `data-session` attribute on each exercise item. Modal exercises tagged with session type during `toggleModalWorkoutChecklist()`.
- **Fast-day injected `_workout` item** — still uses global totals (single consolidated item).

---

## Version 4.3.0 — 2026-03-30

**Scope:** Minor (Workout checklist in MONTHS day modal)
**Banner:** "Workout checklist in day modal: tap any day on MONTHS, hit See Workout Checklist to check off exercises for that day."

- **"See Workout Checklist" button** in day modal — tap any day on the MONTHS calendar, the modal now has a button below the workout summary. Tapping it expands a full interactive checklist of all exercises scheduled for that day's day-of-week.
- **Exercise generation** — uses a hidden temp container to run the plan's `workoutContent()`, filters cards by the target date's day-of-week (via `data-days` attribute matching `DAYS_SHORT`), extracts all `.wex-row` elements with their names, sets, and stretch styling.
- **Interactive checkboxes** — each exercise has a tappable checkbox. Checking/unchecking saves to `dayLogs[date].workoutChecks` via `toggleModalWorkoutEx()`. Also saves `workoutTodayTotal` and `workoutTodayDone` counts.
- **Live summary update** — the summary button text updates in real-time as exercises are checked ("5/8 exercises done").
- **Dispatches** — fires both `DAY_SAVED` (calendar recolors) and `WORKOUT_CHECKED` (TODAY tab auto-workout items refresh, radar updates).
- **Toggle behavior** — button switches between "SEE WORKOUT CHECKLIST" and "HIDE WORKOUT CHECKLIST".
- **Works for any date** — past, present, or future. Can retroactively check off workouts you forgot to track.

---

## Version 4.2.0 — 2026-03-30

**Scope:** Minor (IndexedDB persistence mirror + backup reminder + storage health)
**Banner:** "Data persistence: IndexedDB mirror auto-recovers if localStorage is wiped. Backup reminder after 7 days. Storage health in settings."

### IndexedDB Mirror — Automatic Data Recovery
- **Every `ss()` write** now mirrors data to IndexedDB via `idbPut()`. IndexedDB is stored at a different iOS filesystem path than localStorage — a partial eviction may clear one but not the other.
- **On app init** — if localStorage is empty but IndexedDB has data, `idbAutoRestore()` silently restores all keys before the UI renders. User never sees it happen.
- **Background full sync** — `idbSyncAll()` runs 2 seconds after init to ensure the mirror is complete.
- **Functions added:** `openIDB()`, `idbPut()`, `idbGet()`, `idbGetAll()`, `idbSyncAll()`, `idbAutoRestore()`.
- **Constants:** `IDB_NAME = 'protocol-health-mirror'`, `IDB_STORE = 'kvstore'`, `IDB_VERSION = 1`.

### Backup Reminder Banner
- **`checkBackupReminder()`** — shows a slide-down banner if 7+ days since last backup and user has 3+ days of data.
- **Banner shows:** "Last backup was X days ago" or "You've never backed up" with BACKUP and LATER buttons.
- **BACKUP button** — dismisses banner and triggers `backupData()`.
- **Timestamp tracking** — `ph_last_backup_ts` saved to localStorage on every successful backup.

### Storage Health Display
- **`renderStorageHealth()`** — shows in Data Management section when settings open.
- **Displays:** localStorage usage (KB), IndexedDB mirror status, persistent storage grant status, last backup age, total origin storage quota/usage (via `navigator.storage.estimate()`).

### Init Flow Change
- **`runInit()`** extracted from IIFE — reusable after async IDB restore.
- **Init sequence:** check localStorage → if empty, attempt IDB restore → then `runInit()`.
- **`checkBackupReminder()`** called at end of init.

---

## Version 4.1.1 — 2026-03-30

**Scope:** Patch (Zinc schedule corrected to true alternate days)

- **Zinc schedule changed from Tue/Thu/Sat to Mon/Wed/Fri** — The previous Tue/Thu/Sat schedule left Monday completely uncovered (Saturday's dose covers Sat+Sun, but Tuesday is 3 days away, leaving Monday with no zinc coverage). New Mon/Wed/Fri schedule provides true alternate-day coverage with no gaps:
  - Mon (eating day): zinc → covers Mon + Tue
  - Wed (fast day): zinc → covers Wed + Thu
  - Fri (eating day): zinc → covers Fri + Sat
  - Sun: covered by Friday (2 days, within range)
- **No consecutive dosing** — Mon→Wed = 2 day gap, Wed→Fri = 2 day gap, Fri→Mon = 3 day gap. All safe.
- **Same weekly total** — 3 × 50mg = 150mg/week = 21.4mg/day avg (under 40mg NIH UL).
- **9 code locations updated** — `s1_c` subItems days `[1,5]`, `sf1_b` subItems days `[3]`, `resolveSupplementSub()` arrays, `nutritionContent()` zinc arrays + next-zinc calc + status cards, `rulesContent()` stack cards + schedule card.
- **Fast day zinc on Wednesday** — Previously no zinc on any fast day (Sat removed, Sun removed). Now Wednesday (fast day) is a zinc day, with zinc appearing in the fast day supplement checklist.

---

## Version 4.1.0 — 2026-03-30

**Scope:** Minor (6 bug fixes — checklist state management, workout threshold, radar scoring, day modal)
**Banner:** "Workout items tick at 80% completion (not all-or-nothing). Fixed stale state bugs in checklist saving. Radar light day scoring fixed."

- **BUG 1: Workout auto-items no longer all-or-nothing** — Items m2/m3/e1/e2/e3 and the injected `_workout` item now tick as done at ≥80% exercise completion (was 100%). Doing 7/8 exercises checks off the item. Shows "— good" label at ≥80%, "— complete" at 100%.
- **BUG 2: loadChecklist guards auto-status items** — The generic `else` branch now skips items with `data-water-target` or `data-auto` attributes instead of overwriting their computed state from stale `checks[id]` values.
- **BUG 3: saveAllChecks() helper replaces inline check-saving** — New centralized function properly handles all item types (regular, sub-items, water, auto-status). Used by `toggle()`, `toggleSupItem()`, and `updateWaterCardState()`. Prevents stale auto-status states from being saved.
- **BUG 4: Day modal handles all item types** — Past day checklist now renders water items (shows L vs target), auto-cal items (shows cal vs ceiling with tick/cross), and auto-workout items (shows exercise count) correctly instead of using stale `checks[id]`. Non-toggleable in modal (read-only status).
- **BUG 5: resetToday preserves auto-status** — Reset now only clears manual items and sub-items. Calls `refreshAutoItems()` to recompute cal/workout states, then `saveAllChecks()` to persist correctly. Auto-items no longer show false negatives after reset.
- **BUG 6: Radar light day scoring fixed** — Light days only count toward `fastScheduled` if actually marked in `lightDaysMap`. Previously, untracked scheduled light days counted as failures (0% completion), inconsistent with fast day logic where unmarked days are simply not scored.
- **BUG 7 (no-fix): Food modal stays open** — Confirmed intentional: users log multiple items in sequence, form clears for next entry while entries list updates live.
- **DOC: index.html footer version updated** — Was stuck at v3.7.0, now shows v4.1.0.

---

## Version 4.0.4 — 2026-03-29

**Scope:** Patch (Fix orphaned checklist IDs + restore electrolyte IDs)

- **Migration on init** — `migrateOrphanedChecks()` runs once on app startup. Compares each day's stored check IDs against the current checklist definition. Deletes orphaned IDs (e.g., old `sf3`, `sf3_a`, `sf3_b`) that no longer exist in any checklist array. Idempotent.
- **`getValidCheckCompletion()` helper** — New function that counts only check IDs that exist in the current checklist. Used by calendar day classification and radar CHECKLIST axis to prevent orphaned IDs from dragging down scores.
- **Calendar scoring fixed** — All 5 check-counting blocks in `renderCalendar()` (today, past fast, past light, past normal) now use `getValidCheckCompletion()` instead of raw `Object.values(log.checks)`.
- **Radar CHECKLIST axis fixed** — `computeRadarMetrics()` checklist scoring now uses `getValidCheckCompletion()` for filtered counts.
- **Electrolyte IDs restored** — Pre-training supplement parent changed from `sf3` to `wf2`. Sub-items changed from `sf3_a`/`sf3_b` to `wf2_a`/`wf3`. Matches original electrolyte IDs to preserve existing localStorage check states.

---

## Version 4.0.3 — 2026-03-29

**Scope:** Patch (AGRO fast day supplement checklist restructure)

- **MCT gel split into two items** — Morning stack (`sf1`) now has 1 MCT gel (fat carrier for D3). New pre-training stack (`sf3`) has 1 MCT gel (pre-training energy). Previously both were lumped as "2 gels" in the morning stack.
- **Electrolytes paired by time of day** — Morning electrolyte (`sf1_d`) moved into the morning stack expandable panel. Pre-training electrolyte (`sf3_b`) moved into the new pre-training stack expandable panel. Previously both were standalone items (`wf2`, `wf3`).
- **New pre-training expandable item** — `sf3` with subItems `sf3_a` (MCT gel) and `sf3_b` (electrolyte). Same expand/collapse behavior as morning stack.
- **Old standalone electrolyte items removed** — `wf2` and `wf3` replaced by sub-items inside the morning and pre-training stacks. Existing check states for `wf2`/`wf3` in localStorage are orphaned (no data loss, just no longer displayed).

---

## Version 4.0.2 — 2026-03-29

**Scope:** Patch (Safety fix — zinc consecutive-day dosing)

- **Zinc schedule corrected** — Removed Sunday from zinc days to prevent consecutive Sat→Sun dosing (100mg in 48 hours blocks copper absorption). New schedule: Tue/Thu/Sat only (3 days/week, 150mg/week, 21.4mg/day avg — well under 40mg NIH UL).
- **8 code locations updated** — `checklistNormal` s1 subItems (`days:[2,4,6]`), `checklistFast` sf1 subItems (`days:[6]`), `nutritionContent()` zinc arrays and status cards, `rulesContent()` supplement stack cards and zinc schedule card, `resolveSupplementSub()` zinc day arrays and comment.
- **All zinc references verified** — no remaining "Sun" as a zinc day, all averages updated to 21.4mg/day, all schedules say "Tue/Thu/Sat".

---

## Version 4.0.1 — 2026-03-28

**Scope:** Patch (3 bug fixes for workout auto-items)

- **Exercise count fixed** — `toggleWorkoutEx()` now only saves exercises from today's workout cards (filtered by `data-days`), not all 7 days' worth. Stores `workoutTodayTotal` and `workoutTodayDone` fields. Fixes the "10/112 exercises" display bug.
- **Fast/light day workout section** — When `checklistFast` or `checklistLight` doesn't contain workout items (m2/m3/e1/e2/e3), a WORKOUT group is injected automatically with a single "Today's training session" auto-status indicator. Fixes workout items missing on fast days.
- **Auto-workout items read filtered counts** — Both `renderTodayChecklist()` and `refreshAutoItems()` now read `workoutTodayTotal`/`workoutTodayDone` instead of counting all keys in `workoutChecks`. Fixes exercise count showing wrong numbers.

---

## Version 4.0.0 — 2026-03-28

**Scope:** Major (version rollover from 3.10.0 — auto-status checklist items + radar workout integration)
**Banner:** "Calorie ceiling auto-tracks from food log. Workout items auto-update from WORKOUTS tab. Radar CHECKLIST axis now includes exercise completion."

### Issue 1: Calorie ceiling auto-tracks from food log
- **`f2` items across all 5 plans** tagged with `type:'auto-cal'`. No longer a manual checkbox.
- **Rendered as status indicator** — shows live "850 / 1000 cal — under ceiling" or "1150 / 1000 cal — over ceiling" with tick/cross icon. Non-clickable (`cursor:default`).
- **Bulk-aware** — BULK plan shows "target hit" when eating above ceiling (surplus required). MAINTENANCE shows "on target" within ±200 cal.
- **Auto-refreshes** on `FOOD_LOGGED` dispatch via new `refreshAutoItems()` function.
- **CSS** — `.auto-status`, `.auto-status.done`, `.auto-status.fail` classes with `.auto-val` for the status text.

### Issue 2: Workout items auto-update from WORKOUTS tab
- **Items `m2`, `m3`, `e1`, `e2`, `e3`** (mobility, morning workout, evening session, stretch) detected by `AUTO_WORKOUT_IDS` constant. No longer manual checkboxes.
- **Rendered as status indicator** — shows "5/8 exercises — complete" or "Open WORKOUTS tab to track". Non-clickable.
- **Auto-refreshes** on `WORKOUT_CHECKED` dispatch via `refreshAutoItems()`.
- **All plans covered** — the detection is by item ID, works regardless of plan-specific label text.

### Issue 2b: Radar CHECKLIST axis includes workout exercises
- **`computeRadarMetrics()` CHECKLIST axis** now blends regular `dayLogs[date].checks` with `dayLogs[date].workoutChecks` for a unified completion score.
- **Effect** — checking exercises on the WORKOUTS tab directly improves the radar CHECKLIST score, not just the standalone workout progress bar.

### Infrastructure
- **`syncAutoStatusChecks()`** — persists auto-derived done/fail states into `checks` object so calendar and radar see them.
- **`refreshAutoItems()`** — lightweight re-render of only auto-status items without full checklist rebuild.
- **`autoItems` dispatch target** added to `FOOD_LOGGED` and `WORKOUT_CHECKED` events.
- **`toggle()` guarded** — auto-status items (`data-auto`) skip manual toggle, same as water items.

---

## Version 3.10.0 — 2026-03-26

**Scope:** Minor (Water tracking inline input on TODAY tab)
**Banner:** "Water tracking: tap the water checklist item to log liters with +/− buttons. Auto-ticks when daily target is met."

- **Water input replaces checkbox** — Water checklist items across all 5 plans now have `type:'water'` and `waterTarget` fields. Tapping the water card on the TODAY tab expands an inline panel with a numeric input and ±0.25L buttons instead of toggling done/undone directly.
- **Auto-tick on target met** — When the entered value meets or exceeds the plan's daily water target (e.g., 3.0L for AGRO/DEFAULT normal days, 3.5L for fast days, 2.5L for CUT, 2.0L for MAINTENANCE), the card auto-marks as complete (green). Below target = unchecked.
- **Single source of truth** — Water value saves to `dayLogs[date].water`, which the radar WATER axis and day modal already read. No dual-tracking between checkbox and liter value.
- **All plans covered** — 12 water items across all 5 plans' checklistNormal, checklistFast, and checklistLight arrays tagged with type/target.
- **State persistence** — `loadChecklist()` restores water input values and card done state from storage on tab revisit or app reopen.
- **Functions added** — `toggleWaterExpand()`, `onWaterInput()`, `adjustWater()`, `updateWaterCardState()`. `toggle()` skips items with `data-water-target`.

---

## Version 3.9.1 — 2026-03-25

**Scope:** Patch (TRACK tab notes display fix)

- **Notes fully hidden by default** — Day notes in the TRACK tab are now completely hidden behind a "Show Note" button instead of showing a truncated 80-character preview. Tapping "Show Note" reveals the full text with a "hide" button to collapse it back. Reduces vertical scroll clutter when multiple days have long notes.

---

## Version 3.9.0 — 2026-03-25

**Scope:** Minor (2 new features — workout exercise checklist, supplement sub-items)
**Banner:** "Workout exercise checkboxes on WORKOUTS tab with per-day progress tracking. Supplement checklist items now expandable with individual pill checkboxes."

### ISSUE 1: Workout tab per-exercise completion checklist
- **Exercise checkboxes** — every exercise row (`exRow`, `exRowWithLevel`, `stretchRow`) now has a tappable checkbox on the left. Checking off exercises saves to `dayLogs[date].workoutChecks`.
- **Progress bar** — WORKOUTS tab shows "TODAY'S EXERCISES X/Y" progress bar at top, counting only exercises from today's workout cards (using `data-days` matching).
- **Workout ID system** — counter-based `wex0`, `wex1`, etc. generated per render, reset via `_resetExRowInstances()`. Deterministic and stable across re-renders.
- **Day modal integration** — past days show "Workout Completion: X/Y exercises completed (Z%)" in the day modal.
- **Dispatch event** — added `WORKOUT_CHECKED` event to `DISPATCH_MAP` (refreshes recentNotes).
- **CSS** — `.wex-row`, `.wex-cb`, `.wex-done` classes for checkbox appearance and strikethrough.

### ISSUE 2: Supplement checklist expandable sub-items
- **subItems array** — checklist items can now include a `subItems` array with individual supplements: `{ id, name, dose, when, days? }`. The `days` array (optional) restricts sub-item to specific days of week.
- **AGRO plan updated** — `s1` (eating day morning stack) has 4 sub-items: Osteocare, D3+K2, Zinc (EOD: Sun/Tue/Thu/Sat), MCT gel. `sf1` (fast day morning stack) has 3 sub-items: D3+K2, Zinc (Sun/Sat), MCT gel.
- **Expandable UI** — items with subItems show expand/collapse panel. Tapping the parent expands; tapping individual sub-items toggles their checkbox.
- **Parent state** — auto-derived: empty (0 done), partial (some done), done (all done). Parent checkbox reflects sub-item completion with partial fill state.
- **Count display** — shows "3/4" count on parent item, sub-text updates to "3 of 4 taken" or "All taken".
- **Storage** — sub-item states stored as individual keys in `dayLogs[date].checks` (e.g., `s1_a: true, s1_b: true`). Parent key auto-set based on sub-item completion.
- **Day modal** — past days show expandable sub-items with individual toggles via `toggleModalSupItem()`.
- **CSS** — `.sup-panel`, `.sup-item`, `.sup-cb`, `.has-subitems`, `.partial` classes for expandable UI.

---

## Version 3.8.0 — 2026-03-25

**Scope:** Minor (5 bug fixes — radar scoring, notes display, settings persistence, checklist grouping)
**Banner:** "Radar scoring improved (proportional calories, dampened weight trend, fasting excludes today). Notes collapsible. Age/height persist. Fast day electrolytes in supplements section."

- **BUG 1: AGRO fast day checklist grouping** — Electrolyte items (wf2, wf3) moved from FAST group to SUPPLEMENTS group. Array reordered so all SUPPLEMENTS items (sf1, wf2, wf3, sf2) render as one coherent section. Item IDs unchanged to preserve existing dayLog check states.
- **BUG 2A: Radar calorie scoring — proportional** — Replaced binary pass/fail calorie scoring with proportional: at or under ceiling = 100%, over ceiling = ceiling/actual ratio (e.g. 1150 on 1000 ceiling = 87%, not 0%). Affects all plans.
- **BUG 2B: Radar weight trend — sparse data dampening** — Weight trend score now scales by data confidence: full score at 7+ data points, linearly dampened below that (e.g. 2 points = 29% of raw score). Prevents misleading 100% from early water weight drops.
- **BUG 3: Collapsible notes in TRACK tab** — Notes longer than 80 characters now truncated with "show more" / "show less" toggle. Short notes render unchanged. Reduces vertical scrolling on TRACK tab.
- **BUG 4: Age/height persistence** — autoFillTDEE() now saves age, height, sex, and activityLevel to settings immediately when TDEE is computed. Values no longer lost when settings panel is closed without clicking CONFIRM PLAN.
- **BUG 5: Radar fasting — today excluded, checklist-weighted scoring** — Today excluded from fasting completion scoring (in-progress day can't be scored). Past fast days now scored by combining food absence with checklist completion: full fast + full checklist = 100%, full fast + no checklist = 50%, broken fast scored proportionally. Light day scoring also excludes today.

---

## Version 3.7.0 — 2026-03-24

**Scope:** Minor (Default Bulk plan research-backed enhancement)
**Banner:** "Default Bulk plan enhanced: research-backed nutrition, per-meal protein dosing, calorie cycling, food source grids, supplement tracking."

- **Protein floor raised** — `proteinFloorMultiplier` changed from 1.4 to 1.6g/kg, matching Iraki et al. 2019 (PMC6680710) lower bound of 1.6–2.2g/kg for muscle growth.
- **Checklist (eating day)** — expanded from 11 to 14 items: added pre-training meal, post-training protein, carb target, creatine tracking (SUPPLEMENTS group), updated protein target to show 1.6–2.2g/kg range.
- **Checklist (light day)** — expanded from 7 to 8 items: added creatine tracking, explicit 1.6g/kg protein minimum, updated descriptions.
- **Nutrition tab rewrite** — added per-meal protein dosing card (0.40–0.55g/kg per meal, dynamic calculation from user weight, Iraki 2019), nutrient timing card (ISSN 2018), calorie cycling card (full surplus on training days, maintenance on rest), bulk tracking guidance card (weekly weigh-in, monthly waist, photos). Added collapsible protein/fat/carb source grids (8 items each). Expanded supplement section with creatine monohydrate dosing detail. Added drinks section.
- **Rules tab rewrite** — expanded from 11 to 14 rules: added 2× frequency per muscle group (ISSN 2018), push:pull balance (Cools 2016), calorie cycling, monthly body composition check, travel rule (Kotarsky 2018). All rules now cite research sources.
- **Workout tab** — section note updated to mention 2×/week frequency (ISSN 2018). Push:pull balance note added at bottom (Cools 2016, Prinold 2016).
- **No other plans modified** — all changes scoped exclusively to PLANS.bulk.

---

## Version 3.6.2 — 2026-03-24

**Scope:** Patch (bug fix)
**Banner:** No banner (patch).

- **Exercise level selector collision fix** — when the same exercise group (e.g. `push`, `pull`, `core`) appeared multiple times in a workout session, changing the level on one instance would overwrite all others sharing that groupId. Root cause: `exRowWithLevel` used the raw groupId as the storage key, so all instances of `push` read/wrote the same key. Fix: auto-index instances — first occurrence keeps original key (backward compatible with existing saved data), subsequent occurrences get suffixed keys (`push_2`, `push_3`). Each instance now tracks its own level independently while still showing the same progression options. Day modal exercise history also updated to display instance suffixes correctly.

---

## Version 3.6.1 — 2026-03-23

**Scope:** Patch (additional macro source items)
**Banner:** No banner (patch).

- **5 more fat sources** — avocado, full-fat yogurt, macadamia nuts, olives, trail mix added to fat sources card (now 13 items total).
- **7 more carb sources** — toast+honey, cornflakes+milk, grapes, granola bars, orange juice, crackers, dried apricots added to carb sources card (now 15 items total).

---

## Version 3.6.0 — 2026-03-23

**Scope:** Minor (new nutrition content + collapsible UI)
**Banner:** "Fat + carb source cards added to AGRO nutrition tab. All 3 macro source lists are now collapsible."

- **Fat sources card** — 8 fat-portioned items (~25g fat each) added to AGRO nutrition tab: peanuts, almonds, peanut butter, cheese/paneer, boiled eggs, coconut chunks, mixed seeds, cashews. India-available, zero-prep options.
- **Carb sources card** — 8 carb-portioned items (max ~63g carbs each) added to AGRO nutrition tab: bananas, dates, roti/chapati, muri/puffed rice, apple+banana, roasted chana, sweet potato, oats. India-available, cheap, minimal prep.
- **Collapsible macro source lists** — all three cards (HIGH PROTEIN SOURCES, FAT SOURCES, CARB SOURCES) are now collapsible with tap-to-expand headers using the same inline toggle pattern as the supplement schedule. Collapsed by default to reduce scroll on the nutrition tab.

---

## Version 3.5.1 — 2026-03-23

**Scope:** Patch (bug fixes from codebase scan)
**Banner:** No banner (patch).

- **Compliance score floor** — projection compliance modifier now has a 0.3 minimum. Previously, 3+ days of poor checklist + calorie overages could drive compliance to near 0, making weight projections absurdly pessimistic (150+ weeks for 5kg). Fasting days still create a deficit even at worst compliance — the floor reflects that.
- **syncCustomSelect null guards** — function no longer throws if either the native select or custom dropdown element doesn't exist. Prevents potential crashes during backup restore or when elements are conditionally rendered.
- **index.html footer version sync** — footer was stuck at v3.2.1 while hero badge and app were at v3.5.x. Now in sync.

---

## Version 3.5.0 — 2026-03-23

**Scope:** Minor (consistency metric redesign)
**Banner:** "Consistency now measures engagement depth + streaks, not just attendance."

- **Consistency metric redesign** — the CONSISTENCY axis on the performance radar no longer uses binary "did you show up" scoring. Previously, checking a single box out of 15 gave 100% for that day — same as completing everything. Now measures **engagement depth**: checklist completion depth (50% weight), food logged (20%), weight logged (15%), water/energy/notes (15%). A day where you check 1 item and log nothing else scores ~3%, not 100%.
- **Streak bonus** — consecutive days with quality ≥ 0.3 earn a streak bonus: +1 point per 2 consecutive days, capped at +10. Rewards showing up AND doing the work day after day. Streak resets on days with low engagement (< 0.3 quality score).
- **Streak display in legend** — when streak is 4+ days, the consistency legend shows "Depth + Xd streak" instead of generic "Engagement depth", giving visibility into the streak factor.
- **Day-type-aware scoring** — consistency now uses the correct checklist for each day type (fast/light/normal) when calculating completion depth, so fast days are scored against the fast checklist, not the normal one.

---

## Version 3.4.1 — 2026-03-23

**Scope:** Patch (radar scoring overhaul)
**Banner:** No banner (patch).

- **Radar anchor-based filtering** — all behavioral axes (checklist, calories, fasting, water, consistency) now only score days from the anchor date (earliest of: schedule start, first weight, first checklist) onward. Days before the user started tracking are never counted — prevents false failures on pre-start dates.
- **Consistency minimum-data gate** — requires at least 2 tracked days to produce a score. On day 1, consistency returns null ("—") instead of 100%. One day of data is not enough to measure consistency.
- **Calorie axis honest scoring** — past eating days without food data count as non-compliant (you should have logged but didn't), but only after anchor date. Today is excluded (day isn't over). Requires at least 1 day with actual food data before scoring — avoids showing 0% when food logging hasn't started yet.
- **Checklist includes today** — checklist axis now scores today's in-progress checklist alongside completed past days. Since you're actively checking items, the live score is meaningful.
- **Data span indicator** — legend now shows "DAY X OF TRACKING" with a note that 7D and 30D will diverge after 7 days of data. Explains why the shapes are identical early on.
- **Anchor metadata** — `computeRadarMetrics()` now returns `_anchor` and `_completedDays` alongside the axis array for use by the renderer.

---

## Version 3.4.0 — 2026-03-23

**Scope:** Minor (live calorie tracking, food log history, radar fix, storage persistence)
**Banner:** "Live calorie tracking on Nutrition tab, food log history on Track tab, radar scoring fix."

- **Live calorie intake on NUTRITION tab** — AGRO plan's nutrition tab now shows a "TODAY'S INTAKE" card below the macro grid that reads from the food log in real-time. Shows calories consumed vs ceiling with a progress bar, remaining/over text, and macro progress bars (protein/carbs/fat) when macro data is available. On fast days, shows a fast day notice instead. Updates via `FOOD_LOGGED` dispatch event whenever food is logged.
- **Food log history on TRACK tab** — new "FOOD LOG" section on the TRACK tab showing the last 7 days of food entries with per-day totals, individual items with macros, and color-coded budget status. Updates live via new `trackFoodLog` dispatch target.
- **Radar calorie scoring fix** — eating days without food data are now counted as non-compliant (missed logging = missed target) instead of being silently skipped. Previously, logging food on 1 of 7 eating days and staying under ceiling gave 100% — now gives 14%. Only scores past days (today excluded — day isn't over).
- **Removed duplicate Export Logs button** — the Export Logs button was duplicated in both Settings > Data Management and the MONTHS tab. Removed from settings; kept on MONTHS tab where it's contextually appropriate next to the calendar.
- **Persistent storage request** — app now calls `navigator.storage.persist()` on load, asking Chrome to protect localStorage from automatic eviction under storage pressure. Won't prevent manual "Clear browsing data" wipe, but stops silent data loss. PWAs installed to home screen are more likely to be granted persistence.
- **New dispatch target: `trackFoodLog`** — added to `FOOD_LOGGED` event and `DISPATCH_MAP`. Renders food log history on TRACK tab when active.

---

## Version 3.3.0 — 2026-03-23

**Scope:** Minor (new feature — day-aware supplement display)
**Banner:** "Day-aware supplements — checklist and nutrition tab now show only what you take today, not the full week."

- **Day-aware supplement checklist (TODAY tab)** — AGRO plan supplement items now dynamically resolve sub-text based on today's day of week and day type (fast/eating). Every supplement item shows exact pills, doses, and timing computed from user settings (wake time, eating window start, evening session time). On zinc days (Sun/Tue/Thu/Sat for eating days, Sun/Sat for fast days), zinc appears in the morning stack. On non-zinc days, zinc is omitted entirely — no more mental filtering needed. Applied to both `renderTodayChecklist()` and the day modal for past dates.
- **Dynamic timing on all supplement items** — morning stack shows actual take time (eating window start for eating days, wake time for fast days). MCT pre-training gels show computed pre-session time. Omega-3 shows exact dose breakdown. Magnesium says "take before bed tonight". All times respect user-configured settings and fall back to plan defaults.
- **Day-aware supplement section (NUTRITION tab)** — AGRO plan's NUTRITION tab now shows a "TODAY'S SUPPLEMENTS" section that displays only what applies right now: morning stack with exact pill list and timing, MCT pre-training (fast days), zinc status with next zinc day, omega-3 or skip notice, electrolytes with exact tab timing (fast days only), magnesium. Active supplements shown in green (#82e0aa), skipped items shown in grey (#666) with reason. All times computed from settings.
- **Full schedule reference (collapsible)** — the complete weekly supplement protocol is preserved under a collapsible "SUPPLEMENT FULL SCHEDULE" section below the day-aware cards. Also shows computed times from settings. Tap to expand for reference.
- **Supplement group time label** — TODAY tab's SUPPLEMENTS group header now shows "Eating day stack" or "Fast day stack" instead of generic "Daily stack".
- **Schedule-driven day type** — supplement display is driven by `getDayType()` which reads `SK.fastDays` — when a schedule is set, the auto-marked fast days automatically drive which supplement stack appears on each day. Toggle a fast day manually and the supplements update immediately.
- **New helper: `resolveSupplementSub()`** — centralised function for day-aware supplement sub-text resolution with full timing computation, used by both the TODAY checklist and the day modal. Zinc EOD schedule, dose info, and timing all defined once here. Only applies to AGRO plan — other plans pass through unchanged.

---

## Version 3.2.1 — 2026-03-22

**Scope:** Patch (bug fixes from full codebase scan)
**Banner:** No banner (patch).

- **XSS fix: food name backslash escaping** — food suggestion and delete button inline handlers now escape backslashes before single quotes, preventing JS syntax errors from food names containing backslash characters.
- **Time overflow fix** — `resolveItemTimes` and AGRO nutritionContent now use modulo 24 arithmetic, preventing invalid times when wake time is set very late (e.g. 20:00 producing 24:00+).
- **Schedule download TDEE** — now correctly prefers user-configured TDEE over plan default TDEE. Also fixed "WEIGHT TO LOSE" label to show "WEIGHT TO GAIN" for bulk plans with correct absolute value.
- **removeSchedule preserves today** — changed `>=` to `>` so removing a schedule no longer clears today's fast/light day status mid-day, which could swap the checklist from fast to normal and lose checked items.
- **endScheduleToday clears future days** — ending a schedule now also clears future auto-set fast and light eating days, matching removeSchedule behavior. Previously these orphaned future day markers persisted.
- **Backup status timeout race** — `showBackupStatus` now clears the previous timeout before setting a new one, preventing an earlier timeout from hiding a newer message prematurely.
- **calcAdjust edge cases** — capped maximum remaining days at 730 (2 years) instead of 999 to prevent oversized localStorage arrays. Also returns 0 remaining days when target is already reached instead of incorrectly showing 730/999.
- **Explicit macroSplit on all plans** — DEFAULT and AGRO plans now declare their own `macroSplit` and `proteinFloorMultiplier` fields explicitly instead of relying on hardcoded fallbacks in `computeMacros()`. All 5 plans are now truly self-contained.
- **goalMode field on all plans** — each plan now declares `goalMode: 'cut'|'bulk'|'maintenance'` so the goal calculator reads the plan object instead of hardcoding mode detection by plan key name. Future custom plans will work correctly without code changes.
- **CLAUDE.md version sync** — updated all stale `3.0.2` version references to match current `3.2.1`.

---

## Version 3.2.0 — 2026-03-22

**Scope:** Minor (new feature)
**Banner:** "Customisable daily timing — set wake time, last meal, evening session, and eating window in Settings. All plans adapt automatically."

- **Customisable daily timing** — new "Daily Timing" section in Settings with 4 time fields: wake time, last meal by, evening session, and eating window start. Each plan defines its own defaults; user overrides persist across plan switches.
- **`formatTime()` utility** — converts 24h `"HH:MM"` to display format like `"5:30AM"` or `"6PM"`. Used across checklist, nutrition, and rules rendering.
- **`getPlanTime()` / `getEatingWindow()` helpers** — resolve user override → plan default → null fallback chain for all time lookups.
- **`resolveItemTimes()` function** — dynamically replaces hardcoded time references in checklist item labels at render time. Affects: "Last meal before 6PM" (all plans with the item), "Electrolyte tablet mid-morning (9-10am)" (agro fast days), "Electrolyte tablet pre-evening" (agro fast days).
- **Dynamic group headers** — MORNING and EVENING group headers on TODAY tab now show "From 5:30AM" / "From 5PM" based on configured times. EATING group shows calorie ceiling + eating window.
- **Nutrition/rules content updated** — eating window, last meal time, supplement timing, and fast day protocol in DEFAULT and AGRO plans now use dynamic times from settings instead of hardcoded strings.
- **Day modal updated** — past-day checklist items in the calendar modal also resolve dynamic times.
- **Eating window start visibility** — the "Eating window opens" field is only shown in Settings when the active plan has fasting days (fastDaysPerWeek > 0).
- **Plan defaults**: DEFAULT/AGRO: wake 5:30AM, window 11AM, last meal 6PM, session 5PM. CUT/BULK/MAINTENANCE: wake 7AM, last meal 8PM, session 6PM, no eating window.

---

## Version 3.1.1 — 2026-03-22

**Scope:** Patch (codebase scan fixes)
**Banner:** No banner (patch).

- **Fix: escape user name in schedule download** — `downloadScheduleHTML()` now uses `esc(s.name)` to sanitize the user's name before injecting into generated HTML, preventing potential HTML injection.
- **Fix: restore warns about unknown backup keys** — `restoreData()` now tracks keys present in the backup but missing from the current SK object and appends a note to the success message listing them, so the user knows if data from a newer app version was skipped.
- **Fix: autoSetPlanFastDays/LightDays now dispatch** — Both functions now end with `dispatch('FAST_DAY_TOGGLED')` instead of calling `updateFastUI()` directly, following the architectural rule that all data writes end with a dispatch event.

---

## Version 3.1.0 — 2026-03-22

**Scope:** Minor (new feature)
**Banner:** "Download Schedule — export your full schedule as a printable HTML document with daily tasks, workouts, nutrition, and rules."

- **New: Download Schedule as HTML** — When pressing "Add to Schedule" or "Add Realistic to Schedule" in the goal calculator, a choice popup now appears with two options: "ADD TO APP" (existing behavior) and "DOWNLOAD SCHEDULE". The download generates a standalone HTML document containing:
  - Schedule overview (start/end dates, duration, calorie ceiling, start/target weight, TDEE, user details)
  - Full weekly routine (Monday–Sunday) with day type labels (eating/fast/light), checklist items grouped by category, and morning/evening workout sub-text
  - Complete workout cards with all exercises, sets, and cooldown stretches
  - Nutrition section with macro targets, eating rules, supplement protocol, food sources
  - All plan rules (eating, training, discipline)
  - Dark theme styling matching the app, with print-friendly light theme via `@media print`
- The document can be opened in any browser, printed to PDF, or shared with a doctor/trainer.
- Includes version 3.0.3 bug fix: schedule removal now clears today's fast/light day marker.

---

## Version 3.0.3 — 2026-03-21

**Scope:** Patch (bug fix)
**Banner:** No banner (patch).

- **Fix: schedule removal leaves today highlighted as fast/light day** — `removeSchedule()` used strict greater-than (`d > today`) when clearing auto-set fast and light days, so today's entry was never removed. Changed to `d >= today` so the current day is also cleared. Updated confirmation message to reflect this.

---

## Version 3.0.2 — 2026-03-21

**Scope:** Patch (bug fix from codebase scan)
**Banner:** No banner (patch).

- **Fix: backup restore breaks activity level dropdown** — `restoreData()` referenced element ID `settingActivity` instead of `settingActivityLevel` (lines 5634, 5639). After restoring a backup, the activity level dropdown was not populated and TDEE calculations would use the wrong multiplier.
- **Fix: stale version in CLAUDE.md code example** — The "How to Bump" example showed `APP_VERSION = '2.8.1'` instead of the current version.

---

## Version 3.0.1 — 2026-03-21

**Scope:** Patch (bug fixes from codebase scan)
**Banner:** No banner (patch).

- **Fix: duration bar NaN when totalDays is 0** — `updateDurationBar()` now guards against `sched.totalDays === 0` to prevent NaN/Infinity percentage display.
- **Fix: index.html footer version mismatch** — Footer showed `v2.10.0` while hero badge showed `v3.0.0`. Both now show `v3.0.1`.
- **Fix: CLAUDE.md stale version references** — Quick Reference and Current Version sections still referenced `2.10.0`. Updated to `3.0.1`.
- **Fix: missing theme-color meta tag in index.html** — Added `<meta name="theme-color" content="#0a0a0a">` to match app.html and manifest.json.

---

## Version 3.0.0 — 2026-03-21

**Scope:** Major (version rollover from 2.10.0 — export report restructure with schedule-aware sections)
**Banner:** "Export reports now split by scheduled vs non-scheduled days with day-type breakdowns, per-date macro targets, and full checkbox control over every report section."

- **Schedule-split export reports** — When the "Schedule Split" checkbox is enabled and the selected date range contains both scheduled and non-scheduled days, the report renders two separate segments: "Scheduled Days (PLAN)" and "Non-Scheduled Days". Each segment gets its own day count breakdown (eating/fast/light), compliance stats, nutrition overview, daily log, and food log. If the range only contains one type, no split occurs and the report renders as a single flat section.
- **Day-type nutrition breakdown** — Nutrition sections now break down averages separately for eating days, light eating days, and fast days (if food was logged on them). Each sub-block shows its own actual vs target comparison. Light eating days use the correct ~60% TDEE ceiling instead of the normal calorie ceiling.
- **Per-date macro targets** — Macro targets in the report are now computed by averaging `computeMacros()` across the actual dates in each section, instead of using today's single snapshot. This means targets correctly reflect rest days, pre-fast days, and signal variations across the date range.
- **New export checkboxes** — Added Profile, Protocol, Nutrition, Food Log, and Schedule Split checkboxes alongside the existing Weights, Compliance, Notes, Water, and Energy controls. Each checkbox independently controls whether its section appears in the generated report.
- **Food Log checkbox control** — The food log section (per-day itemized entries with macros) is now gated behind its own "Food Log" checkbox, separate from the "Nutrition" checkbox which controls the aggregated nutrition overview with averages and weekly breakdowns.
- **Day type labels in food log** — Each date in the food log now shows its type suffix: (Fast), (Light), or nothing for normal eating days.

---

## Version 2.10.0 — 2026-03-21

**Scope:** Minor (enhanced nutrition reporting in exports)
**Banner:** "Nutrition reports — weekly macro averages, actual vs target comparison, and calorie compliance breakdown in exports."

- **Enhanced Nutrition Overview in exports** — The Nutrition Overview section in generated reports now includes a full macro comparison table showing actual daily averages vs plan targets for calories, protein, carbs, and fat. Each row shows an "On track" / "Below target" / "Over target" status so doctors and users can immediately see which macros are hitting targets and which aren't.
- **Weekly Macro Averages table** — New sub-section below the daily averages showing week-by-week average calories, protein, carbs, and fat (Mon–Sun buckets). Target macro values shown as a reference line below the table. Only renders when 2+ weeks of food data exist in the selected range.
- **Calorie compliance table** — Days under/over ceiling now shown in a separate compliance table for clarity, rather than mixed into the daily averages table.
- **All three macros tracked** — Previously only protein was shown in the nutrition overview. Now carbs and fat are included with per-macro day counting (only days where that macro was logged contribute to its average, preventing 0-entry days from skewing the numbers).

---

## Version 2.9.1 — 2026-03-21

**Scope:** Patch (critical data loss fix)
**Banner:** No banner (patch).

- **Fix: checklist checks lost when toggling day type** — Tapping a checklist item on the TODAY tab after toggling between normal/fast/light day types would permanently destroy checks from the other day type. The `toggle()` function created a new empty checks object from only DOM-visible items, overwriting all stored checks. Now preserves existing checks from storage (matching the pattern already used correctly in the day modal's `toggleModalCheck()`). Same fix applied to `resetToday()` which also cleared all day types' checks instead of only the visible ones.
- **Fix: radar chart isBulkRadar uses latest weight** — `isBulkRadar` was comparing target against `s.currentKg` (initial settings value). Now uses the latest weight log entry, so the radar correctly detects direction even if the user overshoots their target.

---

## Version 2.9.0 — 2026-03-21

**Scope:** Minor (radar chart bulk support + 4 fixes)
**Banner:** "Radar chart now works for bulk plans — weight trend, goal progress, and NIGHT checklist group gets its own color."

- **Fix: radar chart weight trend broken for bulk plans** — Weight trend axis was hardcoded to score weight loss as good. On bulk plans, gaining weight scored 0-17 (terrible) instead of 75-100 (on track). Now detects plan direction via `isBulkRadar` and inverts the scoring: gaining weight on bulk = good, losing weight on bulk = bad.
- **Fix: radar chart goal progress missing for bulk plans** — Goal progress axis calculated `totalDrop = start - target` which is negative for bulk (target > start), failing the `> 0` guard and leaving the axis as null/missing. Now calculates bidirectionally: `totalChange = target - start` for bulk, `start - target` for cut.
- **Fix: restore doesn't sync all custom dropdowns** — After backup restore, activity level and sex custom dropdowns showed stale values until manually changed. Now syncs `settingSex`/`sexSelectCustom` and `settingActivity`/`activitySelectCustom` alongside plan and risk dropdowns.
- **Fix: NIGHT checklist group missing tag color** — NIGHT group items fell through to generic `tag-rules` (blue) styling. Added `tag-night` CSS class (indigo) and added NIGHT to the tag color ternary chain in both TODAY checklist and day modal renderers.

---

## Version 2.8.2 — 2026-03-21

**Scope:** Patch (bulk plan display fixes + cleanup)
**Banner:** No banner (patch).

- **Fix: calcAdjust() rate sign wrong for bulk plans** — Schedule ADJUST rate display now shows `+X.XXkg/wk` for bulk plans instead of always showing a minus sign. Same fix applied to the observed/formula info line.
- **Fix: projection color logic broken for bulk** — Weight projection "good"/"warn" coloring now correctly detects bulk direction. Previously, losing weight on a bulk plan still showed green (good) because the condition only checked `projSunday <= target`. Now checks `projSunday > latest.weight` for bulk plans.
- **Fix: calcAdjust() aggressive warning threshold not bulk-aware** — Warning now fires at >0.5 kg/week for bulk plans (mostly fat gain territory) instead of the cut-only >2 kg/week threshold. Matches the bulk-specific thresholds already used in `calcDuration()`.
- **Fix: restoreData() date display timezone bug** — Backup restore confirmation now uses `strToDate()` instead of `new Date()` to parse the export date string. `new Date("YYYY-MM-DD")` parses as UTC midnight which could display as the previous day in negative UTC offset timezones — the exact bug the codebase's date rules exist to prevent.
- **Fix: projection band variable naming** — Renamed `bestCase`/`worstCase` to `lowCase`/`highCase` to match the direction-neutral UI labels ("LOW"/"HIGH"). The old names assumed cut-only semantics.
- **CLAUDE.md self-update rule** — Added instruction requiring all version references in CLAUDE.md to be updated whenever APP_VERSION is bumped. Prevents stale version numbers in project documentation.
- **Deleted dead files** — Removed `favicon-16.png` and `favicon-48.png` which were not referenced by any HTML, manifest, or service worker file.

---

## Version 2.8.1 — 2026-03-21

**Scope:** Patch (bug fixes from full codebase scan)
**Banner:** No banner (patch).

- **Fix: generateExport() crash on invalid plan key** — Added `|| PLANS.default` fallback to the PLANS lookup in `generateExport()`. Every other PLANS reference in the codebase had this guard; the export function was the only one missing it, causing a crash if `settings.plan` held a deleted/invalid key.
- **Fix: applySchedule() crash on invalid plan key** — Same `|| PLANS.default` fallback added to `applySchedule()` line that accessed `PLANS[p.planVal].badge` without a guard.
- **Fix: "null" displayed on first launch** — `updateGoalBar()` now guards against `null`/`undefined` weight. New installs with no weight data show "—" and "No data yet" instead of literal "null" text in the header and goal strip.
- **Fix: index.html footer version** — Footer was stuck at v2.5.0 while hero badge was correct. Both now show v2.8.1.
- **Fix: favicon files not cached offline** — Added `favicon.ico` and `favicon-32.png` to the service worker's best-effort cache list. Previously only PNG logos were cached.
- **Fix: calcAdjust() broken for bulk plans** — Schedule ADJUST now detects plan direction (cut vs bulk) and inverts the math accordingly. `remainKg` correctly calculates `target - current` for bulk and `current - target` for cut. Formula rate uses `Math.abs()` for bulk surplus. `openManageSchedule()` status text also updated to show "Gained" instead of "Lost" for bulk plans.
- **Fix: silent data loss on storage full** — `ss()` now catches `QuotaExceededError` specifically and shows a `showAlert()` warning telling the user to back up and clear old data, instead of silently swallowing the error.
- **CLAUDE.md updated** — Version references updated from 2.6.0 to 2.8.1. Settings field list corrected: removed `exerciseBurn` (deleted in v2.2.0), added `age`, `height`, `sex`, `activityLevel`, `name`. `checklistLight` spec clarified as optional for plans with 0 light days.

---

## Version 2.8.0 — 2026-03-21

**Scope:** Minor (new feature — doctor-ready export report + name setting)
**Banner:** "Doctor-ready reports — patient profile, group-level compliance, nutrition overview, weekly weight trends, BMI tracking."

- **Name field in settings** — New `name` field added to `getSettings()` defaults (empty string). Text input added at top of settings panel ("YOUR NAME"). Persists in `SK.settings` until manually changed. Used in exported reports — if blank, the Name line is omitted.
- **Patient Profile section** — Report now opens with a Patient Profile block showing name, age, sex, height, current weight, and computed BMI (weight / (height/100)²). All fields pulled from settings; each omitted if not set. Replaces the old hardcoded name.
- **Active Protocol section** — New section shows the active plan's name, subtitle, TDEE, calorie ceiling, and fasting/light day schedule (including which days of the week). Gives a doctor full context on the user's protocol without needing to explain the app.
- **Group-level compliance** — Replaced the flat "Compliance: X%" with a per-group breakdown table. Each checklist group (MORNING, EATING, EVENING, SUPPLEMENTS, FAST, LIGHT, NIGHT) gets its own completion count and percentage. Overall total shown in bold. Uses the correct day-specific checklist (fast/light/normal) for each logged day.
- **Weak spots** — Below the compliance table, the 3 individual checklist items with the lowest completion rate (minimum 5 data points) are listed with their exact day counts. Shows a doctor specifically which habits are slipping.
- **Nutrition overview** — New section computed from food log data: average daily calorie intake (eating days only, excluding fast/light days), days over/under calorie ceiling, and average protein intake. Only shown if food log data exists in the selected range.
- **Weekly weight averages** — Weight Trend section now leads with a weekly averages table that groups daily weights by calendar week (Mon–Sun) and shows the smoothed average and week-over-week change. Daily weights table moved below as "Daily Weights" sub-section. Only shown if 3+ weight entries and 2+ weeks of data exist.
- **BMI tracking** — Summary table now includes BMI change (start → end) when height is set in settings and start/end weights differ. Patient Profile shows current BMI.
- **Daily log quality indicators** — Daily Log table now includes a "Status" column with text labels: Full (100%), Good (75–99%), Partial (50–74%), Low (<50%). Replaces the old "Daily Compliance" heading.
- **Target weight removed from report** — No longer included in exports, since the target may have been different during the selected date range.

---

## Version 2.7.0 — 2026-03-21

**Scope:** Minor (new feature — export report overhaul)
**Banner:** "Export overhaul — structured markdown reports with summary stats, styled preview, and downloadable HTML reports."

- **Structured markdown export** — `generateExport()` rewritten to output a full markdown document instead of flat text. Includes header with name/plan/period, summary statistics table (start/end weight, total change, avg rate, compliance %, fast day count), weight log table, daily compliance table, food log with per-day breakdowns and macro details, and dated notes with blockquotes.
- **Summary statistics** — New computed summary section calculates start weight, end weight, total change, average weekly rate, compliance percentage, and fast/light day counts from the selected date range. All computed on the fly from existing storage data.
- **Markdown preview** — New `renderMarkdownPreview()` function converts the generated markdown into styled HTML for the in-app preview. Minimal converter (~50 lines) handles only the patterns the export produces: headers, tables, bold, blockquotes, lists, horizontal rules. Dark-themed CSS added to `.export-text` for tables, headings, blockquotes.
- **Two export buttons** — Single "COPY TO CLIPBOARD" replaced with two-button row: "COPY MARKDOWN" (copies raw markdown for pasting into Notion/Obsidian/GitHub) and "DOWNLOAD REPORT" (downloads a styled HTML file).
- **HTML report download** — New `downloadReport()` function generates a self-contained HTML document with inline CSS (light theme, clean tables, print-ready styling) and downloads it as `protocol-health-report-YYYY-MM-DD.html`. Uses the same Blob + anchor download pattern as `backupData()`. No external dependencies. File opens in any browser and prints cleanly as a medical-style progress report.
- **Food log integration** — Export now includes food log data (per-day entries with item names, calories, and macro breakdown) from `SK.foodLog`. Previously food log data was not included in exports.

---

## Version 2.6.0 — 2026-03-21

**Scope:** Minor (7 fixes — dispatcher, storage keys, plan consistency, SW cache, documentation)
**Banner:** "Dispatcher fixes, storage key cleanup, plan consistency, SW cache improvements."

- **DISPATCH_MAP goalBar fix** — Added `goalBar` to `PLAN_CHANGED`, `SCHEDULE_SET`, and `SCHEDULE_ADJUSTED` dispatch targets. Previously the goal bar was not refreshed through the dispatcher on plan change or schedule events — direct `updateGoalBar()` calls were used as a workaround.
- **Redundant direct UI calls removed** — Removed 3 direct `updateGoalBar()` calls in `confirmPlan()`, `applySchedule()`, and `calcAdjust()` that are now handled by the dispatcher. Removed redundant `renderCalendar()` and `renderRadar()` calls in `restoreData()` (already covered by dispatched events).
- **SW_DISMISSED_KEY moved to SK object** — SW reload banner dismissal key (`ph_sw_banner_dismissed_ver` → `ph_sw_v1`) now lives in the `SK` object and uses `gs()`/`ss()` instead of raw `localStorage` calls. Key is now included in backup/restore.
- **Plan consistency fix** — Added explicit `lightDaysPerWeek: 0` and `lightDaysDow: []` to DEFAULT, AGRO, and CUT plans. BULK and MAINTENANCE already had these fields. Prevents future bugs if code assumes all plans define these properties.
- **SW pre-cache fix** — Added `index.html` to service worker critical cache list. Landing page now works offline after first load.
- **CLAUDE.md documentation sync** — Fixed icon filenames (`icon-192.png` → `PH_LOGO_192.png`, `icon-512.png` → `PH_LOGO_512.png`), updated `CACHE_NAME` reference (`v7` → `v11`), updated `APP_VERSION` reference (`2.0.0` → `2.6.0`), added `ph_sw_v1` to storage key quick reference, fixed `index.html` reference to `app.html` for APP_VERSION location.
- **ARCHITECTURE.md sync** — Added missing `ph_ld_v1` (light days) and `ph_sw_v1` (SW dismissed version) to storage diagram. Fixed icon filenames in PWA shell diagram.

---

## Version 2.5.0 — 2026-03-20

**Scope:** Minor (15 bug fixes + favicon)
**Banner:** "15 bug fixes: goal calculator math, bulk goal bar, projection accuracy, light day handling, midnight refresh."

- **Goal calculator target date fix** — Target date now calculates days from the start date (not today), so end date and schedule align correctly when start date ≠ today.
- **Surplus clamping fix (4 locations)** — `Math.max(0, tdee - cal)` silently ignored eating-day surplus when calories exceeded TDEE. Removed clamping in `calcDuration()`, `calcAdjust()`, `isWeightStalling()`, and `updateProjection()`. Deficit/surplus now calculated accurately for users eating above TDEE on eating days while fasting on others.
- **Goal bar bulk fix** — Progress bar and remaining weight now work correctly for bulk plans (gaining weight). Previously showed 0% and 0.0kg remaining because the math assumed weight loss direction.
- **Schedule ADJUST auto-sets fast/light days** — `confirmAdjust()` now calls `autoSetPlanFastDays()` and `autoSetPlanLightDays()` for newly added schedule days. Previously, adjusted schedules had unmarked future days.
- **Radar chart light day fix** — `computeRadarMetrics()` referenced undefined `tdee` variable when calculating light day calorie ceiling. Now uses `s.tdee || 2600`.
- **Calendar month stats today fix** — Today's fast/light day status now counted in month statistics. Previously only past days incremented the fast/light counters.
- **Restore dropdown sync fix** — `restoreData()` now sets native select element values before syncing custom dropdowns, so plan and risk selections display correctly after restore.
- **Midnight crossover fix** — Visibility change handler now refreshes TODAY tab checklist, fast UI, and duration bar when the app returns to foreground. Previously only refreshed calendar and day label.
- **Export checklistLight fix** — Text export now includes `checklistLight` items from all plans. Previously only searched `checklistNormal` and `checklistFast`.
- **getAvgActualCalories light day fix** — Average calorie calculation now skips both fast and light days (previously only skipped fast days), preventing light day intake from skewing eating-day averages.
- **computeMacros light day fix** — Macro calculations now use ~60% of TDEE as calorie ceiling on light eating days instead of the full eating-day ceiling. Adds 'light' signal label.
- **Duration bar overflow fix** — Day counter now capped at total days. Previously showed "DAY 31 / 30" the day after schedule ended.
- **Manage schedule null weight fix** — `openManageSchedule()` and `calcAdjust()` now handle null return from `getLatestWeight()` gracefully instead of producing NaN values.
- **Favicon added** — Browser tab now shows the arrows logo (`favicon.ico` + `favicon-32.png`) on both landing page and app. Previously showed default globe icon.

---

## Version 2.4.0 — 2026-03-20

**Scope:** Minor (workout balance audit + UX improvements)
**Banner:** "All plans now push:pull balanced. CARs explained. Core progression fixed (no equipment needed)."

- **DEFAULT plan push:pull fix** — Was 9:0 (zero pull exercises). Added
  Superman hold to Morning A, inverted row + Y-T-W raises + scapular push-up
  to Evening A, Superman hold to Evening C (replacing Sprawl + Push-up).
  Evening A renamed "UPPER PUSH/PULL". Now 1:1 balanced.
- **BULK plan push:pull fix** — Was ~2.5:1 (2 push days, 1 pull day). Friday
  "Push B" converted to "Push/Pull B" with inverted rows and Y-T-W raises
  added. Saturday full body reordered to pair push+pull. Rule 06 updated.
  Now ≤1:1 across the week.
- **AGRO Evening A minor rebalance** — Removed pseudo-planche lean (moved to
  skill-only work). Added Superman hold. Reordered scapular push-up before
  archer for better superset flow. Push:pull now balanced within the session.
  Rule 08 updated to say "pull-dominant across the week" instead of "5:7".
- **Core level 7 replaced** — "Hanging leg raises" (bar required) replaced
  with "Lying leg raises + hip lift" (floor only). Entire progression chain
  is now zero-equipment.
- **CARs explanations added** — All "Hip CARs" warm-up rows across all 5
  plans now include full descriptions: what CARs stands for (Controlled
  Articular Rotations), how to perform hip CARs, wrist CARs, and cat-cow.
  Checklist sub-text also updated. No more unexplained acronyms.

---

## Version 2.3.0 — 2026-03-20

**Scope:** Minor (AGRO plan content overhaul)
**Banner:** "AGRO plan rebalanced: pull-dominant workouts, full supplement protocol, updated nutrition."

- **Workout rebalance** — Push:pull ratio fixed from 5:2 to 5:7
  (pull-dominant). Every push session now includes antagonist pull
  pairing. Inverted rows, superman holds, prone Y-T-W, towel rows,
  and scapular push-ups integrated throughout the week. Tricep dips
  removed from Evening A (redundant with push-up ladder volume).
  Side plank added to Evening B and C (lateral core was 1x/week,
  now 3x).
- **Updated morningSub/eveningSub/stretchSub** — Day descriptions
  now reflect the rebalanced sessions with pull work noted.
- **Updated checklistNormal** — Supplement items rewritten with
  accurate dosing: Osteocare 2 tabs, D3+K2 1 tab, Zinc EOD,
  MCT 1 gel (eating) / 2 gels (fast), Omega-3 3 caps with meal,
  Magnesium 1 serving nightly.
- **Updated checklistFast** — Two separate electrolyte items
  (mid-morning + pre-training). Fast day intensity reminder added.
  MCT dosing clarified (2 gels). Magnesium 1 serving nightly.
- **Nutrition tab overhaul** — Full supplement protocol section with
  6 detailed cards (morning stack eating/fast, zinc EOD rule, omega-3,
  magnesium, electrolytes). High-protein food sources grid added with
  cal:protein ratios. All existing sections retained.
- **Rules updated** — 15 rules (was 13). New: "Push + Pull in every
  upper session" training rule. "Fast days = 51% of deficit" discipline
  rule. Rules renumbered.
- **CLAUDE.md** — Science reference directive appended with tier-1
  URLs, safety rules, hard-coded supplement limits, push:pull ratio
  rule, and prohibited sources list.
- **CACHE_NAME bumped** to `protocol-health-v10`.

---

## Version 2.2.3 — 2026-03-20

**Scope:** Patch (4 bug fixes)

- **Calendar missed-day fix** — Past days with no log are now only marked
  red (missed) if they were part of an active schedule. Days before any
  schedule was set up show no colour — no expectation, no failure.
- **Radar consistency anchor** — CONSISTENCY metric now anchors to the
  earliest tracked date (schedule start or first logged entry). Pre-setup
  days are excluded from the denominator. Fresh installs show '—' instead
  of 0%. Empty resets and unticked-then-reticked boxes no longer count as
  a logged day — at least one genuinely checked item (or weight/food log)
  is now required.
- **Realistic schedule fast-day fix** — 'ADD REALISTIC TO SCHEDULE' button
  now correctly sets fast and light days across the full realistic window.
  Previously, auto-set fast/light days only covered the shorter theoretical
  window, leaving gap days as unhighlighted plan-day cells.
- **CACHE_NAME bumped** to `protocol-health-v9`.

---

## Version 2.2.2 — 2026-03-20

**Scope:** Patch (bug fix)

- **Schedule start date always defaults to today** — When opening the settings panel, the start date field now always defaults to today's date instead of loading the previously saved start date from settings. This fixes the bug where adding a new schedule would start from a past date (e.g. the 19th instead of the 20th) because `s.startDate` was persisted from a prior schedule creation and reloaded on next settings open.

---

## Version 2.2.1 — 2026-03-20

**Scope:** Patch (bug fixes)

- **Start date off-by-one fix** — Target date field was parsed using `new Date(string)` which interprets `YYYY-MM-DD` as UTC midnight. In positive UTC offset timezones (e.g. India UTC+5:30), this shifted the date back by one day. Now uses `strToDate()` for correct local time parsing.
- **Start date saved on CONFIRM PLAN** — Previously `confirmPlan()` saved all settings except the start date, which was only saved when creating a schedule. Start date is now persisted on every CONFIRM PLAN click.
- **Start date input triggers recalculation** — Added `oninput="calcDuration()"` to the plan start date field so changing it updates the goal calculator in real time (previously required changing another field to trigger recalculation).
- **Settings persistence fix** — `getSettings()` now merges saved values with defaults using `Object.assign()`, so newly added settings keys get their defaults even if the saved object predates them. Removed hardcoded `currentKg:104` default — fields show empty until the user sets them.

---

## Version 2.2.0 — 2026-03-19

**Scope:** Minor (feature removal + new features)
**Banner:** "Removed exercise burn (covered by TDEE), dual schedule modes, enhanced ADJUST with observed/formula/blended rates."

- **Exercise burn field removed** — The exercise burn input and all related calculations have been removed from the goal calculator, manage schedule, weight stalling detection, and projection math. Activity level in the TDEE auto-calculation (Mifflin-St Jeor × multiplier) already accounts for training intensity, making the separate exercise burn field redundant and a source of double-counting.
- **Dual schedule buttons** — When the realistic timeline section is visible (standard/aggressive risk modes), the goal calculator now shows two schedule buttons: "ADD TO SCHEDULE" (uses exact/theoretical days) and "ADD REALISTIC TO SCHEDULE" (uses compliance-adjusted days). Schedule stores which mode was used.
- **Schedule mode tracking** — Schedules now store `scheduleMode` (exact/realistic), `complianceRate`, and `exactDays` in the schedule data object. Manage Schedule status text shows whether the active schedule is EXACT or REALISTIC with compliance percentage.
- **Enhanced Manage Schedule ADJUST** — Three projection modes available via toggle buttons: BLENDED (default — weighted mix of observed rate and formula rate), OBSERVED ONLY (uses pure actual weight loss rate from logged data), and FORMULA ONLY (uses pure deficit math). Shows observed vs formula rate comparison with blend percentages. Warns when observed data is limited (<7 days). Stores last adjust mode used.

---

## Version 2.1.0 — 2026-03-19

**Scope:** Minor (multiple features + bug fix)
**Banner:** "Realistic timelines, auto TDEE, supplement tracker, calendar fixes."

- **Goal calculator: realistic timeline** — Added compliance-adjusted realistic days/weeks/kg-per-week below theoretical output. Standard=0.70, Aggressive=0.82, Unrestricted=1.00 multiplier. Week-by-week collapsible projected weight breakdown added.
- **Exercise burn field note** — Clarified that exercise burn should be 7-day daily average across all days, not per-session burn.
- **Auto TDEE via Mifflin-St Jeor** — Added age, height, sex, and activity level inputs to settings. TDEE field auto-populates using Mifflin-St Jeor equation × activity multiplier. Plan change auto-selects sensible activity default. Manual override always possible.
- **AGRO supplement tracker** — Full supplement protocol (Osteocare, D3+K2, Zinc EOD, Magnesium, MCT, Electrolytes, Omega-3) added to AGRO checklist (eating + fast day versions) and NUTRITION tab. Includes zinc copper-depletion warning (EOD rule).
- **Calendar today-cell fix** — Replaced epoch millisecond equality check with `dateToStr()` string comparison for today detection. Fixes PWA bug where current day incorrectly showed as red (missed) before midnight. Added visibility-change listener to re-render calendar on app foreground.
- **Today-in-progress fix** — Today's cell is now exempted from missed/partial classification while the day is still ongoing. Today only turns green if ALL checklist items are checked; otherwise it shows no compliance color. Full retroactive judgment applies only once today becomes yesterday.
- **CACHE_NAME bumped** to `protocol-health-v8` for clean force-refresh on all devices.

---

## Version 2.0.1 — 2026-03-19

**Scope:** Patch (bug fixes + UX)

- **SET button for current weight** — goal calculator now has a SET button next to the current weight input. Saves the entered weight to settings and updates goal bar and projection without needing to log it as a weight entry.
- **+/- signs on kg/week rate** — cut plans show `-X.XXkg/wk`, bulk plans show `+X.XXkg/wk`, maintenance shows `0.00kg/wk`. Makes the direction of weight change immediately clear.
- **Exercise burn affects bulk calculations** — exercise burn was previously ignored in bulk mode. Now properly accounted for: in deadline mode, required calories increase to offset exercise burn; in calorie mode, net surplus is reduced by exercise burn, extending the timeline. Shows `-Xcal/day surplus` label for bulk plans.

---

## Version 2.0.0 — 2026-03-19

**Scope:** Major (version rollover from 1.10.0 — next minor bump after X.10.Z = X+1.0.0)
**Banner:** "Light eating days for bulk & maintenance. Future days viewable. Schedule deletion simplified."

- **Light eating day system** — new day type alongside water fast days. Stored in `SK.lightDays`. Plans can define `lightDaysPerWeek`, `lightDaysDow`, and `checklistLight` arrays. Mutually exclusive with fast days.
- **Bulk plan updated** — 2 light eating days per week (Sun/Wed) replacing the nonsensical fast days. Dedicated checklist: eat at/below TDEE, protein-focused, no snacking, gut recovery.
- **Maintenance plan updated** — 1 light eating day per week (Sunday). Checklist focuses on eating 300–500 cal below TDEE with simple meals.
- **Future days viewable** — tapping future days in MONTHS tab now opens the day modal showing schedule info and toggle buttons to pre-set fast/light day type.
- **Schedule deletion simplified** — removed the "also clear fast days?" checkbox. Future fast and light days are always cleared automatically when removing a schedule.
- **Calendar** — light days shown with amber/orange styling. Legend and month stats updated.
- **Projection** — light days factored in (~60% of TDEE). Radar chart label switches to "LIGHT DAYS" for bulk/maintenance.
- **Compliance** — light day calorie compliance excluded from normal ceiling penalty.
- **Text export** — includes light eating days section.
- **Goal calculator labels** — dynamically show "surplus/balance/deficit" based on plan mode (fix from earlier in session).
- **Backup/restore** — added `dispatch('FOOD_LOGGED')`, `dispatch('FAST_DAY_TOGGLED')`, `dispatch('EXERCISE_LEVEL_CHANGED')`, `renderCalendar()`, and `renderRadar()` to restore flow, ensuring full UI refresh on data restore.

---

## Version 1.10.0 — 2026-03-19

**Scope:** Minor (feature improvements)
**Banner:** "Goal calculator now supports bulk & maintenance. Radar chart improved. Weight log moved to morning."

- **Goal calculator** — now fully plan-aware. Bulk mode calculates surplus (calories above TDEE). Maintenance mode creates tracking-only schedules. Cut mode unchanged.
- **Radar chart** — visibility improvements. All 7 axes always shown (no-data axes render as 0 with dash).
- **Weight log** — moved to morning section of TODAY tab for easier daily logging.
- **Goal calculator labels** — "weekly deficit" label updates to "weekly surplus" or "weekly balance" based on plan mode.

---

## Version 1.9.0 — 2026-03-18

**Scope:** Major (new plans added)
**Banner:** "New plans: Default Cut, Default Bulk, Default Maintenance."

- **3 new training plans** — Default Cut, Default Bulk, Default Maintenance. Each with full workout content, nutrition rules, macro configurations, and custom checklists.
- **Dynamic TODAY checklist** — replaced hardcoded checklist HTML with `renderTodayChecklist()` that builds from the active plan's checklist arrays. This was required for multi-plan support.
- **Plan-aware macros** — `computeMacros()` now reads `macroSplit` and `proteinFloorMultiplier` from the active plan. Bulk uses 30/50/20 (P/C/F), maintenance uses 35/45/20.
- **CSS** — new badge and description classes for cut, bulk, maintenance plan colors.
- **Plan selector** — 5 plans now available in settings dropdown.
- **`descClass` property** — added to plan objects. Fixed hardcoded `agro-desc` assignment in `onPlanSelectChange()`.

---

## Version 1.8.0 — 2026-03-18

**Scope:** Minor (new feature)
**Banner:** "Smart macro targets + food macro tracking + nutrition shortcut."

- **Smart auto macro engine** — `computeMacros()` function with context-aware signals (base, rest, pre-fast, stall, satiety). Signal chips on NUTRITION tab.
- **Food macro tracking** — food log entries now support protein, carbs, fat fields alongside calories. Food modal updated with macro inputs.
- **Calculator integration** — goal calculator's "APPLY CALORIES" and "VIEW NUTRITION" buttons for seamless workflow.
- **Food library** — autocomplete suggestions from previously logged foods with macro memory.

---

## Version 1.7.2 — 2026-03-18

**Scope:** Patch (bug fix)

- **iOS PWA updates** — fixed app not receiving service worker updates on iOS when resuming from background. Added `visibilitychange` and `pageshow` event listeners.

---

## Version 1.7.1 — 2026-03-18

**Scope:** Patch (bug fix)

- **Radar chart axes** — all 7 axes now always visible. No-data metrics render as 0 with a dash label instead of being hidden.

---

## Version 1.7.0 — 2026-03-18

**Scope:** Minor (new feature)
**Banner:** "Performance radar chart on TRACK tab."

- **Performance radar chart** — 7-axis spider chart on TRACK tab. Axes: checklist completion, calorie adherence, fasting adherence, water intake, weight trend, goal progress, consistency.
- **7D / 30D toggle** — switch between weekly and monthly performance windows.
- **Pure SVG rendering** — no chart library dependency.
- **Landing page** — added product feature showcase page.

---

## Version 1.6.1 — 2026-03-17

**Scope:** Patch (styling)

- **Landing page animations** — staggered content animations inside phone mockups on the landing page.

---

## Version 1.6.0 — 2026-03-17

**Scope:** Minor (new feature)
**Banner:** "New branded splash screen with arrows logo on app launch."

- **Branded splash screen** — custom splash screen with Protocol Health logo on app launch (3 second duration).

---

## Version 1.5.1 — 2026-03-17

**Scope:** Patch (restructure)

- **App moved to `app.html`** — separated landing page (`index.html`) from the app file (`app.html`). PWA still launches `app.html`.

---

## Version 1.5.0 — 2026-03-17

**Scope:** Minor (tab restructure)
**Banner:** "Food logger moved to TODAY tab. Manage & delete day notes. Backup/export moved to Settings."

- **Tab restructure** — food logger modal accessible from TODAY tab. Notes manager for viewing/deleting day notes.
- **Backup/export** — moved to Settings panel (was previously on TRACK tab, keeping it cleaner).

---

## Version 1.4.4 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — fixed banner not fully hiding. Increased `translateY` for bottom-positioned element.

---

## Version 1.4.3 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — removed false-positive `CONTENT_UPDATED` trigger. Version-tied dismiss. Enlarged X touch target.

---

## Version 1.4.2 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — fixed persistence after tap. Added X dismiss button.

---

## Version 1.4.1 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — fixed banner not dismissing after tap.

---

## Version 1.4.0 — 2026-03-17

**Scope:** Minor (new feature)
**Banner:** "App now auto-updates without reinstalling. Your data stays safe."

- **Automatic update system** — service worker detects new versions, downloads in background, shows reload banner. No reinstall needed.

---

## Version 1.3.1 — 2026-03-17

**Scope:** Patch (styling)

- **Scrollbar hidden** — global scrollbar hide on all elements (html, body, children).

---

## Version 1.3.0 — 2026-03-17

**Scope:** Minor (UX improvement)
**Banner:** "Workouts tab now shows only today's sessions expanded. Track and Rules tabs swapped."

- **Workouts tab** — auto-expands only today's workout sessions. Other days collapsed by default.
- **Tab swap** — Track and Rules tabs swapped for better navigation flow.

---

## Version 1.2.0 — 2026-03-17

**Scope:** Minor (bug fixes)
**Banner:** "Bug fixes: exercise levels, calendar plan-day colors, reset confirmation, and data safety improvements."

- **7 bugs fixed** from code review: exercise level persistence, dispatcher gaps, XSS prevention in notes, calendar plan-day color priority, reset confirmation dialog, and data safety improvements.

---

## Version 1.1.0 — 2026-03-16

**Scope:** Minor (new features)
**Banner:** "Food & calorie logger, exercise level selector, and pull work added to AGRO plan."

- **Food & calorie logger** — log food items with calorie counts per day. Daily total tracked.
- **Exercise level selector** — progressive difficulty levels for exercises in AGRO plan. Levels stored per-day.
- **AGRO pull work** — added pull-focused exercises (inverted rows, towel rows) to AGRO plan.

---

## Version 1.0.1 — 2026-03-15

**Scope:** Patch (content fix)

- **AGRO workout schedule** — moved Evening C skill session from Wednesday to Thursday.

---

## Version 1.0.0 — 2026-03-15

**Scope:** Major (initial versioned release)
**Banner:** N/A (first version)

- **Initial versioned release** — APP_VERSION system introduced. Version checking, update banner, `SK.seenVer` storage.
- **Architectural cleanup** — fixed rule violations, removed dead code.
- **Foundation** — 2 plans (DEFAULT PROTOCOL, AGRO CUT CALISTHENICS), 6 tabs, full checklist system, weight tracking, goal calculator, schedule system, calendar, backup/restore.
