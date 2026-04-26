# Calibration Project — Phase B Plan

**Status:** EXECUTING
**Branch:** `claude/add-workout-exercises-KjRRh`
**Version target:** `6.3.0` (minor — new behavior, banner shown)

## Goal

When the user logs a new weight, automatically recompute TDEE from the BMR formula using the new weight. Fire the `TDEE_CHANGED` event so projection / goal bar / duration bar / nutrition macros / radar all refresh.

## Why this matters

Today, your TDEE only updates if you open Settings and tap "Auto-fill TDEE." A user who has lost 8 kg is still working off the TDEE from their starting weight until they remember to refresh it. After Phase B, weight loss → lower TDEE automatically. Weight gain → higher TDEE automatically.

## Scope

1. **Add `recomputeTDEE()`** near `computeAutoTDEE()` at `app.html:3452`. DOM-free version: reads weight from the latest weight log and reads height/age/sex/activity from `settings`. Returns the new TDEE number (or `null` if any input is missing).

2. **Add `recomputeAndApplyTDEE()`** wrapper. Reads `recomputeTDEE()`, compares to current `settings.tdee`, writes if different, fires `TDEE_CHANGED`. Returns true/false. Honors a future `settings.tdeeManualOverride` flag (added in Phase D — for Phase B, the flag is undefined, so recompute always runs).

3. **Wire into `logWeightFromToday()`** at `app.html:3108-3123`. Call `recomputeAndApplyTDEE()` after `saveDayLogField()` and before existing `dispatch('WEIGHT_LOGGED')`.

4. **Wire into `logWeight()`** at `app.html:3125-3140`. Same wiring as above.

5. **Wire into `autoFillTDEE()`** at `app.html:3465-3487`. The function currently writes `s.tdee` but never dispatches — pre-existing bug noted in earlier scan (Section A3). Add `dispatch('TDEE_CHANGED')` after `saveSettings(s)`.

## What does NOT change in Phase B

- No new files
- No new HTML / CSS
- No edits to `migrations/`, `modules/`, `components/`, `plans/`
- No `sw.js` change
- No edits to `confirmPlan()` (it already fires `PLAN_CHANGED` + `CALORIES_CHANGED`, which collectively refresh the same UI surfaces)
- Manual TDEE override toggle (Phase D ships that)

## Files touched

| File | Change |
|---|---|
| `app.html` ~3464 | Insert `recomputeTDEE()` and `recomputeAndApplyTDEE()` helpers |
| `app.html` ~3122 | Add `recomputeAndApplyTDEE()` call to `logWeightFromToday` |
| `app.html` ~3139 | Add `recomputeAndApplyTDEE()` call to `logWeight` |
| `app.html` ~3486 | Add `dispatch('TDEE_CHANGED')` to `autoFillTDEE` after `saveSettings(s)` |
| `app.html` ~1506 | Bump `APP_VERSION` 6.2.5 → 6.3.0 |
| `app.html` ~1507 | Update `APP_VERSION_MSG` (popup shown — minor bump) |
| `UPDATE_LOG.md` | Add v6.3.0 entry |

## `recomputeTDEE()` implementation

```js
// Phase B: DOM-free Mifflin-St Jeor recompute. Reads from settings + latest
// weight log. Mirrors computeAutoTDEE() but does not depend on the Settings
// panel being open. Returns null if any required input is missing.
function recomputeTDEE() {
  const s = getSettings();
  if (s.tdeeManualOverride) return null; // Phase D will surface this toggle
  const weight = getLatestWeight();
  const height = parseFloat(s.height);
  const age    = parseFloat(s.age);
  const sex    = s.sex || 'male';
  const actMult = parseFloat(s.activityLevel) || 1.55;
  if (!weight || !height || !age) return null;
  const bmr = sex === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  return Math.round(bmr * actMult);
}

function recomputeAndApplyTDEE() {
  const newTdee = recomputeTDEE();
  if (newTdee === null) return false;
  const s = getSettings();
  if (s.tdee === newTdee) return false;
  s.tdee = newTdee;
  saveSettings(s);
  dispatch('TDEE_CHANGED');
  return true;
}
```

## Smoke test (Phase B — run after C and D ship)

1. Open app. Log a new weight slightly different from your current (e.g. 0.3 kg lower).
2. Open Settings. TDEE field should show a new number (slightly lower).
3. Open MONTHS / TRACK / etc. — projection numbers should reflect the new TDEE.
4. Console: no errors.
5. Try logging the same weight again — no spurious dispatch (TDEE didn't change).
6. Open Settings → tap "Auto-fill TDEE" — UI should refresh immediately (this is the bug fix).

## Risk table

| Risk | Mitigation |
|---|---|
| Settings missing height/age/sex (new user) | `recomputeTDEE()` returns null; `recomputeAndApplyTDEE()` returns false; no dispatch fired; weight log proceeds normally with existing TDEE. |
| TDEE flickers by ±1 cal on tiny weight changes | Equality check `s.tdee === newTdee` skips dispatch when no change. Tiny rounding deltas may still trigger — ~1-3 cal change is visible in TDEE field but no other UI surface changes meaningfully. Acceptable. |
| Manual TDEE override flag not yet defined | The flag check is `if (s.tdeeManualOverride)` — undefined is falsy, so Phase B treats override as off. Phase D ships the actual UI toggle. |
| `getLatestWeight()` returns 0 on a fresh install | `if (!weight)` short-circuits — no dispatch. |
| Schedule `startWeight` becomes stale | Schedule object never stored TDEE (confirmed in inventory). startWeight is intentionally a snapshot of weight-at-schedule-creation; should not change. |

## Acceptance criteria

- [ ] APP_VERSION reads `6.3.0`
- [ ] `recomputeTDEE` and `recomputeAndApplyTDEE` exist as top-level functions in `app.html`
- [ ] Weight log triggers TDEE recompute when settings have height/age
- [ ] `autoFillTDEE` dispatches `TDEE_CHANGED` after save
- [ ] No console errors on weight log
- [ ] Existing `WEIGHT_LOGGED` dispatch unchanged
