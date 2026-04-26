# Calibration Project — Phase D Plan

**Status:** EXECUTING
**Branch:** `claude/add-workout-exercises-KjRRh`
**Version target:** `7.0.0` (major — completes the calibration project; new system rework)

## Goal

Close the calibration loop. The app compares formula TDEE (Mifflin × activity) to observed TDEE (CICO rearrangement: avgIntake + kgLoss × 7700 / N) over a 14-day rolling window. If they differ by more than 7%, settings.tdee is updated to a 70/30 blend. The user sees a banner explaining the change. The TRACK tab gains a "Reality Check" block showing predicted vs actual loss live.

## Scope

### New file: `modules/calibration.js` (~200 lines)

Functions:
- **`computeObservedTDEE(days=14)`** — pure calc. Reads weights + foodLog + fastDays + fastWindows. Returns `{ tdee, daysLogged, daysAvailable, kgLoss, avgIntake, valid, reason }`. Excludes unlogged eating days from intake average. Counts fast days as 0 intake (or food log sum if broken).
- **`getCalibrationStatus()`** — composes formula vs observed; returns `{ state: 'GATHERING' | 'CALIBRATED', formulaTDEE, observedTDEE, gapPercent, displayedTDEE }`.
- **`weeklyCalibration()`** — runs at init. Skips if `settings.tdeeManualOverride === true`. Skips if `settings.lastCalibrationAt` is < 7 days ago. Skips if state is `GATHERING`. Otherwise: blends 70% observed + 30% formula → if change > 7%, writes settings.tdee, updates settings.lastCalibration*, dispatches `TDEE_CHANGED`, shows banner via `showAlert`.
- **`renderRealityCheck()`** — builds HTML for the TRACK tab block. Shows: predicted loss, actual loss, gap %, formula TDEE, observed TDEE, days logged, current state. Hidden if `daysAvailable < 7`.
- **`formatBannerMessage(oldTdee, newTdee, formula, observed, gapPct)`** — text for `showAlert`.

### Edits to `app.html`

1. **Module loader** (~line 1325) — import calibration.js, expose to window.*
2. **TRACK tab HTML** (~line 766) — insert `<div id="realityCheckBox"></div>` between radar and weight log
3. **`switchTab` for 'track'** — call `renderRealityCheck()`
4. **`runInit`** — call `weeklyCalibration()` after migrations + settings load
5. **Settings defaults** (line 1554) — add `tdeeManualOverride: false`, `lastCalibrationAt: null`, `lastCalibrationFormula: null`, `lastCalibrationObserved: null`
6. **Settings panel UI** — add a small "Auto-calibrate TDEE" toggle in the data/management area
7. **`recomputeAndApplyTDEE`** (Phase B) — also sync `settings.currentKg` to latest weight (fixes the minor UX inconsistency from the audit)
8. **CSS** — `.reality-check`, `.rc-row`, `.rc-label`, `.rc-val`, `.rc-state-pill` styles
9. **Bump** APP_VERSION 6.4.0 → 7.0.0; update APP_VERSION_MSG

### Edit to `UPDATE_LOG.md`

- Add v7.0.0 entry at top

## Calibration math

```
Window: last 14 days from today.

For each day d in window:
  if foodLog[d] exists:
    intakeDay[d] = sum(calories in foodLog[d])
  else if isFastDay(d) and not broken:
    intakeDay[d] = 0
  else if isFastDay(d) and broken:
    intakeDay[d] = sum(calories) (already covered by foodLog branch)
  else:
    skip (unlogged eating day)

avgIntake = mean(intakeDay) over included days
kgLoss = oldestWeight - newestWeight in window (positive = loss)
spanDays = (newest weight date - oldest weight date) in days
observedTDEE = round(avgIntake + (kgLoss × 7700 / spanDays))

Validity gate:
  - daysLogged >= 7 (in last 14)
  - At least 2 weight logs in window
  - spanDays >= 7
```

## Calibration apply rules

```
If state === 'GATHERING' → display formula only, no apply
If settings.tdeeManualOverride → never apply, display observed for info only
If lastCalibrationAt < 7 days ago → skip (not yet time for next cycle)

Otherwise:
  blendedTDEE = round(0.7 × observed + 0.3 × formula)
  gap = |blendedTDEE - currentTDEE| / currentTDEE
  if gap >= 0.07:
    settings.tdee = blendedTDEE
    settings.lastCalibrationAt = today
    settings.lastCalibrationFormula = formula
    settings.lastCalibrationObserved = observed
    saveSettings(s)
    dispatch('TDEE_CHANGED')
    showAlert(message)
  else:
    settings.lastCalibrationAt = today (still bumped to defer next check)
    saveSettings(s)
```

## Reality Check display (always-visible on TRACK)

```
┌─ REALITY CHECK ───────────────────────┐
│  State: CALIBRATED                    │
│  Window: last 14 days                 │
│                                       │
│  Predicted loss:    1.42 kg           │
│  Actual loss:       0.68 kg           │
│  Gap:               -52% slower       │
│                                       │
│  Formula TDEE:      3412 cal          │
│  Observed TDEE:     3050 cal          │
│  Currently using:   3162 cal (blend)  │
│                                       │
│  Days logged:       10 of 14          │
└───────────────────────────────────────┘
```

If GATHERING: shows "Need N more days of weight + food logs to calibrate."

## Backward compatibility

- No new SK key. All state lives in `settings` (auto-merged with defaults via getSettings).
- No new migration needed (Phase A's v1→v2 sufficed).
- All readers of settings.tdee continue to work (already read live; verified in audit).
- Manual TDEE override toggle preserves existing behavior — user can opt out of auto-calibration entirely.

## Files touched

| File | Change |
|---|---|
| `modules/calibration.js` (NEW) | All calibration math + reality-check render |
| `app.html` ~1325 | Module loader exposes calibration exports |
| `app.html` ~1554 | Settings defaults gain 4 new fields |
| `app.html` ~766 | TRACK tab gains `#realityCheckBox` |
| `app.html` switchTab | Call `renderRealityCheck()` on track switch |
| `app.html` runInit | Call `weeklyCalibration()` after settings load |
| `app.html` ~3490 | `recomputeAndApplyTDEE` also syncs `settings.currentKg` |
| `app.html` Settings panel | Manual override toggle UI |
| `app.html` CSS | New reality-check styles |
| `app.html` ~1506 | APP_VERSION 6.4.0 → 7.0.0 |
| `UPDATE_LOG.md` | v7.0.0 entry |

## Acceptance criteria

- [ ] APP_VERSION reads `7.0.0`
- [ ] TRACK tab shows reality-check block
- [ ] Block shows correct numbers (predicted, actual, formula, observed)
- [ ] First load after deploy runs calibration (if 14+ days data)
- [ ] If calibration changes TDEE, banner shows
- [ ] settings.tdeeManualOverride toggle exists in Settings
- [ ] Toggling override OFF resumes calibration on next load
- [ ] No console errors
