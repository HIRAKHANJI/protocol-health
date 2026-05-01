# Pending Implementations — Calibration & Stability Roadmap

**Source of truth for all post-v7.1.0 calibration/stability work.** Created 2026-04-28.

---

## How to use this file

This document is the **only** task list Claude follows when asked to "continue", "implement", "work", "proceed", "do the next phase", or any equivalent prompt about the calibration/stability project.

### Rules (non-negotiable)

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

**Status:** PENDING
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

**Status:** PENDING
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

## Phase 3 — Per-Plan Calorie Safety Floors

**Status:** PENDING
**Tier source:** Tier 3, item 10
**APP_VERSION target:** `7.2.2` (patch — non-blocking validation)
**CACHE_NAME bump:** Yes (next merge to main).
**Migration:** None.

### Goal

Surface non-blocking warnings when the user enters a calorie ceiling below their plan's safe floor (per Section 15 of CLAUDE.md). Never block; always inform.

### Scope

1. Add a `minCalories` field to each plan object in `plans/*.js`:
   - `lite.js`: 1200
   - `agro.js`: 800 (hard floor; plan ceiling is 1000)
   - `cut.js`: 1400
   - `bulk.js`: TDEE-200 (computed at validation time, not static)
   - `maintenance.js`: TDEE-300 (computed)
2. In `calcDuration()`: after the existing risk gates, add a soft warning check. If `calcCals < activePlan.minCalories` (or computed equivalent), append a non-blocking note in the result panel:
   - Text: `⚠ ${calcCals} cal/day is below this plan's recommended floor (${minCalories} cal). Sustain only with medical supervision.`
3. Settings calorie field also shows the floor as a hint: `Floor for ${planName}: ${minCalories} cal`.

### Files touched

- `plans/lite.js`, `plans/agro.js`, `plans/cut.js`, `plans/bulk.js`, `plans/maintenance.js` — add `minCalories` field (number for cut/agro/lite, function for bulk/maintenance)
- `app.html` — `calcDuration()` warning logic; settings-panel hint render in `openSettings()`; CSS for `.cal-floor-warn`

### Smoke test

1. AGRO plan: enter calorie ceiling 700 → soft warning shown.
2. AGRO plan: enter 1000 → no warning.
3. CUT plan: enter 1200 → warning shown.
4. BULK plan: warning fires only if ceiling < TDEE-200.
5. Goal calculator never blocks computation; result still shown.
6. Settings calorie field shows floor hint.

### Acceptance criteria

- [ ] Warning is non-blocking (computation continues)
- [ ] All 5 plans have `minCalories` defined (static or function)
- [ ] Warning text is clear and references the plan
- [ ] Floor hint visible in settings

### Risk

**Low.** New plan field is additive; existing readers ignore unknown fields. Warning is read-only display.

---

## Phase 4 — Spike-Trim Port to Radar + ADJUST

**Status:** PENDING
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

**Status:** PENDING
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

**Status:** PENDING
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

**Status:** PENDING
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

## Phase 8 — Linked-Deficit Mode

**Status:** PENDING
**Tier source:** Tier 2, item 8
**APP_VERSION target:** `7.5.0` (minor — new behaviour, opt-in, banner shown)
**CACHE_NAME bump:** Yes.
**Migration:** None.

### Goal

Opt-in mode where calorie ceiling auto-tracks TDEE changes, maintaining a constant absolute deficit (cal). When user picks `targetDeficit = 1500 cal/day`, calorie ceiling = max(planMinCalories, TDEE - 1500). When TDEE drops, ceiling drops proportionally.

### Scope

1. New settings fields: `s.linkedDeficitMode: boolean` (default false), `s.targetDeficit: number | null`.
2. Settings panel: new toggle below TDEE field — `Link calorie ceiling to TDEE (auto-adjust on TDEE change)`. Reveals an input for `Target deficit (cal/day)` when on.
3. When toggle is ON: calorie field becomes read-only and shows the computed value. Display text: `Auto: TDEE − deficit = X cal (locked to deficit)`.
4. `recomputeAndApplyTDEE()` (or new `syncCalorieCeilingFromDeficit()`): when TDEE changes AND `linkedDeficitMode === true`, compute new ceiling and write `s.calories`. Floor at plan's `minCalories`.
5. `weeklyCalibration` triggers the same recompute path.

### Files touched

- `app.html` — settings UI, toggle handler, `syncCalorieCeilingFromDeficit` helper, integration with `recomputeAndApplyTDEE` and weeklyCalibration call site, CSS for read-only state.

### Smoke test

1. Toggle on, deficit = 1500. Current TDEE 3382. Calorie field displays 1882 (cut floor: 1400).
2. Drop weight by 5kg → TDEE recomputes lower → calorie field auto-drops, floored at 1400 if needed.
3. Toggle off → field becomes editable, value preserved at last computed.
4. Plan-floor enforcement works (won't go below `minCalories`).

### Acceptance criteria

- [ ] Toggle exists and persists in settings
- [ ] Linked mode auto-updates calorie field on TDEE change
- [ ] Floor enforcement against plan minCalories
- [ ] Read-only visual state when linked
- [ ] Disabling restores manual editability

### Risk

**Medium.** New write path into settings.calories triggered by an existing event. Mitigation: gate behind explicit user opt-in; default off.

---

## Phase 9 — Adaptive Activity Multiplier

**Status:** PENDING
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

**Status:** PENDING
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

**Status:** PENDING
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

## Phase 12 — Bootstrap fastWindows from fastDays

**Status:** PENDING
**Tier source:** Tier 4, item 15
**APP_VERSION target:** `7.7.1` (patch with migration)
**CACHE_NAME bump:** Yes.
**Migration:** v3 → v4 — for each existing `fastDays[date]` entry without a corresponding `fastWindows[date]` entry, create a default 24-hour window.

### Goal

Backfill the `fastWindows` storage so the calibration math has timestamp data even for fast days the user never explicitly started/stopped. The legacy fallback path remains intact; this just promotes legacy entries into the new structure once.

### Scope

1. Migration v3→v4 in `migrations/registry.js`:
   - For each date in `fastDays` where `fastWindows[date]` is empty/absent:
     - Create entry: `[{ start: '${date}T00:00:00.000Z', end: '${date}T23:59:59.999Z', broken: false, brokenBy: [], legacy: true }]`
   - Set `requiresBackup: true` (data shape change).
2. Verify function: confirms post-state has fastWindows entry for every fastDays entry.
3. Reverse function: clears windows where `legacy: true`.

### Files touched

- `migrations/registry.js` — migration object.

### Smoke test

1. Owner's current backup: 30 fastDays entries. After migration, 30 fastWindows entries (all marked `legacy: true`).
2. Calendar still colours past fast days correctly.
3. Day modal on a past fast day shows "Legacy fast day — start/end backfilled to 00:00–23:59".
4. Calibration math now uses these windows for span/duration calculations.

### Acceptance criteria

- [ ] All fastDays have matching fastWindows post-migration
- [ ] `legacy: true` flag preserved for distinction
- [ ] Auto-backup downloaded before migration runs (`requiresBackup: true`)
- [ ] No visual regression on calendar
- [ ] Day modal labels legacy windows clearly

### Risk

**Low.** Bulk write but well-bounded. `requiresBackup: true` enforces user safety net.

---

## Phase 13 — Activity History Tracking (Foundation)

**Status:** PENDING
**Tier source:** Tier 4, item 14
**APP_VERSION target:** `7.7.2` (patch with migration; observation only)
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
| `APP_VERSION` | `7.7.2` |
| `CACHE_NAME` | `~v32-34` (one bump per phase that needed it) |
| `schemaVersion` | `5` |
| New SK keys added | `backupHistory`, `activityHistory` |
| New migrations | v2→v3, v3→v4, v4→v5 |
| New files | `components/` may gain a sickness-toggle helper if extracted (Phase 5); no other new module files necessary |
| New dispatch events | None (existing `TDEE_CHANGED`, `FAST_WINDOW_CHANGED`, etc. cover everything) |
| Behavioural changes | All 13 phases land. Calibration is sickness-aware, spike-resistant, plan-floor-respecting, integrity-checksummed, history-tracked. |

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
