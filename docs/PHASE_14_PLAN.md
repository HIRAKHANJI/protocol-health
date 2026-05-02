# PHASE 14 PLAN — TDEE / Calorie / Reality-Check Integrity Fixes

**Status:** Awaiting approval
**Branch:** `claude/fix-tdee-calorie-calculation-J6hcG`
**Tracking:** Owner-reported issues against `protocol-health-backup-2026-05-02.json` (appVersion 7.9.0)
**Goal:** Restore mathematical correctness across the TDEE, calorie ceiling, Reality Check, projection, and radar systems so users can trust the readings.

---

## 1. Diagnostic Summary — What's Actually Broken

I traced every owner-reported symptom against the backup data and the live code paths in `app.html`, `modules/calibration.js`, `modules/radar.js`, and `plans/agro.js`. Findings below are listed with confirmed math.

### Owner's actual stored state (key fields from backup)

| Field | Value | What's correct here? |
|---|---|---|
| `weights[]` | 41 entries, 105.0 kg → 95.2 kg over 41 days | ✓ Real, dense, consistent data |
| `settings.tdee` | **3363** | ✗ Computed with legacy 1.725 multiplier, not the AGRO day-type model |
| `settings.calories` | **3362** | ✗ Equal to TDEE − 1 (defeats the deficit entirely) |
| `settings.activityLevel` | `'1.725'` | ⚠ Legacy generic dropdown; AGRO plan has its own per-day model |
| `settings.activityByDayType` | `null` | ⚠ Plan defaults should drive this; user override blank |
| `settings.targetOffset` | **1** | ✗ Should be 1500 default for cut floor; "1" makes ceiling = TDEE − 1 |
| `settings.linkedOffsetMode` | `false` | ⚠ Currently OFF, but user's symptoms suggest they toggled it ON briefly |
| `settings.startDate` | `'2026-05-02'` (today) | ✗ Just set when user added schedule; ATP factor uses this and gates out |
| `settings.lastCalibrationFormula` | 3453 | Stale legacy value |
| `settings.lastCalibrationObserved` | **291** | ✗ Physiologically impossible; never cleared |
| `settings.lastCalibrationOutcome` | `'never-run'` | ✗ Contradicts the populated formula/observed fields above |

### What the math should say (recomputed correctly)

For a 24yo male, 178 cm, 95.2 kg, on AGRO CUT (3 fast days/wk):

```
BMR (Mifflin-St Jeor) = 10×95.2 + 6.25×178 − 5×24 + 5
                      = 952 + 1112.5 − 120 + 5 = 1949.5 cal/day

Weekly weighted activity (AGRO day-type model):
  = (4 eat × 1.70 + 3 fast × 1.35) / 7
  = (6.80 + 4.05) / 7 = 1.55

Cumulative loss: 105 → 95.2 = 9.8 kg over 41 days = 1.67 kg/week → AGGRESSIVE
ATP factor (Trexler 2014, PMC 3943438):
  weeks = 41/7 ≈ 5.86, lossRate = 1.67 kg/wk
  aggressionFactor = clamp((1.67 − 0.5)/1.0) = 1.0
  ratePerFourWeeks = 0.05 + 1.0 × 0.05 = 0.10
  totalATP = min(0.15, 0.10 × 5.86/4) = 0.146
  atpFactor = max(0.85, 1 − 0.146) = 0.854

Correct formula TDEE = 1949.5 × 1.55 × 0.854 ≈ 2581 cal/day
```

**Stored 3363 is ≈ 30% too high.** That single error cascades into every downstream display (predicted loss, projection, radar calorie axis, goal calculator).

### Bugs (ordered by impact)

| # | Bug | File:line | Impact |
|---|---|---|---|
| **B1** | State machine `daysAvailable >= 14` is unreachable — span of a 14-day window maxes at 13 days. User permanently stuck on "GATHERING DATA → need 1 more day of weight logs." | `modules/calibration.js:328` | Critical — Reality Check never enters CALIBRATED state regardless of data |
| **B2** | Stored `s.tdee` not recomputed when v7.9.0 introduced the day-type activity model. Owner has 3363 (legacy 1.725) instead of ~2581 (correct day-type 1.55 × ATP 0.854). | `app.html` (no migration on v7.9.0); also display path in `modules/calibration.js:301-322` | Critical — every TDEE consumer is wrong by 30% |
| **B3** | Reality Check's "Formula TDEE" sometimes shows 3363 (legacy) even with day-type model present. Suggests `getActivePlan()` returns null in early call sites or `s.activityLevel` fallback wins. | `app.html:3880-3898` (`getWeeklyAvgActivity`); `modules/calibration.js:301-322` | High — formula TDEE display can't be trusted |
| **B4** | `targetOffset = 1` accepted via `onLinkedOffsetInput` with no min-bound enforcement; HTML input min=100 ignored by JS. Resulting ceiling = TDEE − 1 = 3362. | `app.html:4174-4189` | High — user can silently destroy their deficit |
| **B5** | `computeATPFactor` stuck at 1.0 because `settings.startDate` is today (just-created schedule). Ignores 41 days of real cumulative loss. | `modules/calibration.js:262-276` | High — ATP never engages for users who recently added a schedule |
| **B6** | Calibration gate uses spanDays as the proxy for "days of data," but **wider** windows still cap at `days−1`. Same off-by-one as B1 in `weeklyCalibration` and `inferActivityMultiplier` (28-day window → spanDays max 27). | `modules/calibration.js:204, 328, 567` | High — auto-calibration may be permanently disabled |
| **B7** | Reality Check shows `Observed TDEE: 1328` (below BMR 1950 = physiologically impossible) without warning. User reads it as authoritative. | `modules/calibration.js:840` (display); rejected at `:478` but display unaware | High — user trusts an impossible number |
| **B8** | `lastCalibrationObserved = 291`, `lastCalibrationOutcome = 'never-run'` — the outcome is incorrectly recorded; the 291 figure is stale poison data from a sickness window. v7.9.0's `clearStaleCalibrationData` requires age > 21 days; doesn't fire when calibration ran today. | `modules/calibration.js:443-470, 670-704` | Medium — corrupted history persists |
| **B9** | Predicted-vs-actual gap displayed as "−81% vs predicted" with no explanation. Real causes (underlogging, water/glycogen, fast bounceback) not surfaced. | `modules/calibration.js:799-814` | Medium — user blames the system, not their data |
| **B10** | Projection compliance modifier defaults to 0.85 even with full data, dampening forward projection. | `app.html:3192` | Medium — projections artificially low |
| **B11** | Spike-trim threshold (>2 kg/week) flags legitimate fast-cutter rates from rebound bounces. Owner's 7-day rate of ~3 kg/wk (water flux post-sickness) drops weightTrend score by 50%. | `app.html` `getSpikeTrimmedWeights`; `modules/radar.js:206-210` | Medium — radar weightTrend = 50% despite 1.67 kg/wk legitimate cut |
| **B12** | Radar "Calories" axis = 100% with ceiling 3362 and actual intake ~1100. Hitting 100% is meaningless when ceiling is wrong. No detection of "impossible-to-fail" ceilings. | `modules/radar.js:91-109` | Medium — metric provides false reassurance |
| **B13** | Calorie ceiling UX confuses three concepts: (a) Goal Calculator output, (b) Settings ceiling field, (c) Link/offset deficit. User thought "1000 in deficit field = ceiling of 1000." | `app.html:4023-4092` (UI); `app.html:1037-1062` (HTML labels) | Medium — repeatable confusion across users |
| **B14** | Day-1 of a fresh schedule (today) doesn't propagate the existing weight history into ATP calculation, so newly-scheduled users get an artificially high TDEE on day 1. | `modules/calibration.js:262-276` (same as B5) | Same root as B5 |

---

## 2. Why The Owner's Numbers Look The Way They Do

Walking through the displayed Reality Check with the actual backup data:

### Reality Check breakdown for 14-day window (Apr 19 → May 2)

```
Window dates: Apr 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, May 1, May 2
spanDays = 13 (Apr 19 → May 2)   ← This is why "Need 1 more day"

Weights in window: 14 entries
oldest = Apr 19 (96.0 kg), newest = May 2 (95.2 kg)
kgLoss = 0.8 kg

Daily classification:
  Apr 19: fast day (no food, marked fast)            → fastDayCount
  Apr 20: eating, 1135 cal                           → eatingDayCount
  Apr 21: eating, 635 cal                            → eatingDayCount
  Apr 22: fast day (no food, marked fast)            → fastDayCount
  Apr 23: eating, 1133 cal                           → eatingDayCount
  Apr 24: low-compliance (sick day, no checks)       → EXCLUDED
  Apr 25: low-compliance (sick + 1648 cal junk)      → EXCLUDED
  Apr 26: low-compliance (sick + 1416 cal junk)      → EXCLUDED
  Apr 27: eating, 1130 cal                           → eatingDayCount
  Apr 28: eating, 1267 cal                           → eatingDayCount
  Apr 29: fast day (no food, marked fast)            → fastDayCount
  Apr 30: eating, 1047 cal                           → eatingDayCount
  May  1: eating, 1204 cal                           → eatingDayCount
  May  2: fast day (today, no food)                  → fastDayCount

  → eatingDayCount = 7
  → fastDayCount = 4 (display says 3 — likely Apr 19 not counted because of edge logic)
  → excludedTotal = 3 ✓ (matches display)

eatingDayIntakeSum = 1135+635+1133+1130+1267+1047+1204 = 7551
eatingDayAvg ≈ 1079 cal       (display says 1174 — small discrepancy from how Apr 19 is bucketed)
periodIntakeSum = 7551 (eating) + 0 (fasts)
periodIntakeDays = 7+4 = 11
periodAvg ≈ 686                (display says 854 — same bucketing diff)

Observed TDEE math:
  observedTDEE = avgIntake + (kgLoss × 7700 / spanDays)
              = 854 + (0.8 × 7700 / 13)
              = 854 + 474
              = 1328  ✓ EXACTLY matches the displayed number

Predicted loss math:
  predicted = (formulaTDEE − avgIntake) × spanDays / 7700
           = (3363 − 854) × 13 / 7700
           = 2509 × 13 / 7700
           = 4.24 kg  ✓ EXACTLY matches "+4.24kg" displayed

Gap = (0.8 − 4.24) / 4.24 × 100 = −81%  ✓ matches
```

**Conclusion:** the numbers shown are mathematically correct given the corrupted `s.tdee = 3363` and the underlogged intake. The math engine isn't broken — the inputs are.

### Why observed TDEE = 1328 looks "impossibly low"

It is impossibly low for a real human. The implied causes:

1. **Underlogging.** The owner's notes explicitly say things like *"I ate protein powder 45g didn't log it"* (Mar 27), and there are days with single "Junk: 1416 cal" entries that almost certainly underestimate. Lichtman 1992 (NEJM 327:1893) found self-reported intake underestimated by 47% in dieters.
2. **Water/glycogen flux.** Apr 25 sickness + Apr 26 binge → weight spiked +1 kg, then dropped 4 kg in next 5 days as fluid normalised. That's not fat loss; it's water.
3. **Fast bounceback.** Owner has a clear pattern of weight spike post-fast (e.g. Mar 28 fast day weighed 103.1 kg vs 102.8 kg the day before, then dropped to 102.5 kg next day).

The system needs to flag observed TDEE < BMR with an explanatory note rather than display it as gospel.

### Why "Currently using 3363" is too high

Three compounding factors:
- B2: stored TDEE never recomputed after v7.9.0 day-type model introduction
- B3: even if recomputed, getActivePlan() may return null in the calibration call site
- B5: ATP factor disabled because startDate = today

Correct value should be **~2581 cal/day** (24% lower).

### Why the Goal Calculator gave Daily Calories = 2363 when offset 1000 was entered

The "Daily deficit (cal below TDEE)" field is the OFFSET, not the ceiling. When user typed 1000:
```
ceiling = max(plan.minCalories=800, TDEE − offset)
       = max(800, 3363 − 1000)
       = 2363
```
Mathematically correct, semantically not what the user intended. The user wanted a **ceiling of 1000 cal** (which would require offset = TDEE − 1000 = 2363).

---

## 3. Proposed Fixes

I'm grouping into three tiers based on user-impact-per-line-of-change. **Tier 1 fixes the misleading numbers; Tier 2 fixes the UX; Tier 3 is hardening.** I'll execute Tier 1 first, ship and tag, then optionally proceed to 2 and 3 in subsequent commits.

### Tier 1 — Math correctness (highest priority)

#### Fix 1.1 — Make `daysAvailable` actually mean "days of data" not "spanDays"
**Files:** `modules/calibration.js:177-251` (computeObservedTDEE), `:300-411` (getCalibrationStatus)

Replace `daysAvailable = spanDays` with `daysAvailable = inWindow.length` (the count of weight entries actually inside the window). Update both consumers (`weeklyCalibration` cadence gate; `_buildCadenceNote` "needs N more days" message).

This is the real meaning of "days available" — number of real data points, not span. Fixes B1.

#### Fix 1.2 — Recompute `s.tdee` once on app load when day-type model is detectable
**Files:** `app.html` (in `runInit()` after PLANS load) or new migration `migrations/registry.js` v5→v6

Add `migrateTDEEToV79()`: if `s.tdee` differs from freshly computed `_computeFormulaTDEE()` by more than 5%, recompute and overwrite. Bump schemaVersion 5 → 6. Set `requiresBackup: true`.

Optional alternate: do it as a non-migrating one-shot in `runInit` that fires `recomputeAndApplyTDEE()` after `ph:plans-ready`. This is simpler and doesn't need a schema bump.

I prefer the runInit approach — TDEE isn't really a stored data shape, it's a computed value that should always reflect current rules. Fixes B2.

#### Fix 1.3 — Fix `getActivePlan()` resolution for calibration display
**Files:** `modules/calibration.js:292-295`

Current implementation calls `getActivePlan()` via typeof guard. If it returns null at the moment the user opens TRACK tab, formula TDEE falls back to legacy 1.725.

Change `_getActivePlanForCalibration()` to also try `window.PLANS[settings.plan]` directly as a second fallback before giving up. This guarantees the day-type model is found whenever PLANS is loaded.

Also: in `getWeeklyAvgActivity`, **prefer planMap over s.activityLevel** even when the legacy multiplier "looks valid" — the day-type model is always more accurate when declared. Fixes B3.

#### Fix 1.4 — ATP factor: use weight-history baseline, not s.startDate
**Files:** `modules/calibration.js:258-288`

Replace `settings.startDate` with the oldest weight entry date as the baseline for cumulative-loss calculation. The schedule startDate is irrelevant to metabolic adaptation — what matters is how long the user has been losing weight.

```javascript
// OLD:
const startDate = strToDate(settings.startDate);

// NEW:
const sortedAsc = weights.slice().sort((a, b) => a.date.localeCompare(b.date));
const oldestDate = strToDate(sortedAsc[0].date);
// Use whichever is earlier (longer track record) — but if startDate is recent
// (within last 30 days), prefer oldestDate so adding a new schedule doesn't reset ATP.
const startDate = (settings.startDate && (today - strToDate(settings.startDate)) > 30*86400000)
  ? strToDate(settings.startDate)
  : oldestDate;
```

This fix gives the owner immediate ATP factor of 0.854 (currently 1.0). Fixes B5.

#### Fix 1.5 — Validate `targetOffset` against plan-mode bounds in JS
**Files:** `app.html:4174-4189` (onLinkedOffsetInput)

```javascript
function onLinkedOffsetInput() {
  const raw = document.getElementById('settingTargetOffset').value;
  const v = parseFloat(raw);
  if (isNaN(v)) return;
  const plan = (typeof getActivePlan === 'function') ? getActivePlan() : null;
  // Plan-aware bounds matching the input field's min/max
  const bounds = (plan && plan.caloriesMode === 'floor')      ? [100, 3000]
              : (plan && plan.caloriesMode === 'above-tdee')  ? [100, 1000]
              : (plan && plan.caloriesMode === 'tdee-band')   ? [-300, 300]
              : [0, 5000];
  const clamped = Math.max(bounds[0], Math.min(bounds[1], Math.round(v)));
  if (clamped !== Math.round(v)) {
    // Reflect clamp back into the field so user sees what was actually saved
    document.getElementById('settingTargetOffset').value = clamped;
    showAlert('Offset clamped to plan-safe range: ' + clamped + '. (' + plan.name + ' allows ' + bounds[0] + '–' + bounds[1] + '.)');
  }
  const s = getSettings();
  s.targetOffset = clamped;
  // ... rest unchanged
}
```

Also add a one-shot sanity check in `runInit` that auto-corrects existing nonsense values (e.g. owner's `targetOffset = 1` → reset to plan default 1500 if linkedOffsetMode is on). Fixes B4.

#### Fix 1.6 — Annotate sub-BMR observed TDEE with a warning row
**Files:** `modules/calibration.js:785-910` (renderRealityCheck)

When `observedTDEE < bmr`, render the observed TDEE line with `var(--accent2)` (orange) and add a hint row underneath:

```
Observed TDEE: 1328 cal ⚠
  Below BMR (1950) — typically caused by underlogged intake or water/glycogen
  swings. Real burn rate is almost certainly higher.
```

Fixes B7.

#### Fix 1.7 — Auto-clear stale `lastCalibrationObserved` when out-of-bounds at app load
**Files:** `modules/calibration.js:670-704` (clearStaleCalibrationData)

Drop the `STALE_CALIBRATION_DAYS = 21` requirement. If the recorded observed value fails today's sanity bounds (< BMR or > formula × 1.5), clear it regardless of age — the value is poison and shouldn't influence anything. Also fix `lastCalibrationOutcome = 'never-run'` when the formula/observed fields are populated (it should be `'rejected-out-of-bounds'`). Fixes B8.

### Tier 2 — UX clarity (after Tier 1 ships and is tagged working)

#### Fix 2.1 — Reality Check "Why is my predicted ≠ actual?" expander
**Files:** `modules/calibration.js:785-910`

When `Math.abs(gapPct) > 30%`, render a small `<details>` block with three bullets explaining likely causes:
- "Underlogged intake" (if observed < BMR)
- "Water / glycogen flux" (if any 7-day rate > 1.5 kg/wk)
- "Recent fast bounceback" (if last 3 weights show post-fast spike pattern)

This converts a scary gap into actionable insight.

#### Fix 2.2 — Explicit ceiling label in Settings panel
**Files:** `app.html:1037-1062` (HTML), `app.html:4023-4092` (UI sync)

Change the Settings calorie ceiling field's label from "Daily Calorie Ceiling" → "Daily Calorie Ceiling (max you'll eat)". Add a helper text below: "TDEE − Ceiling = Daily deficit. Lower ceiling = faster loss." Add a live computed display: "Current: 1500 cal ceiling = 1063 cal/day deficit (TDEE 2563)."

Rename the link-offset toggle label more explicitly: "🔗 Link ceiling to TDEE (auto-track when TDEE changes)" — separate the toggle visually from the offset input.

#### Fix 2.3 — Goal calculator flag for "ceiling >= TDEE" in cut mode
**Files:** `app.html:4413-4664` (calcDuration)

Currently `calcDuration` flags negative cal as unrealistic. Add an additional flag: if `planMode === 'cut' && calcCals >= tdee × 0.95`, surface "⚠ NO MEANINGFUL DEFICIT — your ceiling is too close to TDEE for a cut." This catches the owner's exact failure mode.

#### Fix 2.4 — Activity multiplier dropdown refers to plan's day-type model
**Files:** `app.html:1037-1062` (HTML), Settings panel

When a plan has `activityByDayType` declared, show a hint: "AGRO uses 1.70 on training days and 1.35 on fast days = weekly avg 1.55. The dropdown below is only used as fallback." Add an INFO icon that opens an explainer modal.

### Tier 3 — Hardening (after Tier 1 + 2)

#### Fix 3.1 — Spike-trim window scaling
**Files:** `app.html` `getSpikeTrimmedWeights`

Currently fires at any > 2 kg/week rate over any window. Change to: only flag implausible if the **30-day** rate exceeds 2 kg/wk, OR a single one-day jump > 1.5 kg. Short-term swings (water, glycogen) are real-world, not bugs.

Fixes B11.

#### Fix 3.2 — Radar calorie axis: detect meaningless ceilings
**Files:** `modules/radar.js:91-109`

When `ceiling > 0.95 × TDEE`, score the calorie axis as `null` (no data) and add a legend annotation: "Ceiling not meaningful (no deficit). Set a real deficit to score this." Fixes B12.

#### Fix 3.3 — Projection compliance modifier
**Files:** `app.html:3192-3206` (updateProjection)

Default 0.85 was a guess; with real compliance data (last 7 days), use the computed score directly (no default floor of 0.85). Fall back to 0.85 only when fewer than 3 days of data. Fixes B10.

#### Fix 3.4 — Reality Check: window expansion beyond 14 days
**Files:** `modules/calibration.js:177-251`

Add an alternative "stable" window of 28 days with looser sanity bounds. Use the wider window when the 14-day window's `kgLoss` shows a > 1.5 kg fluctuation (i.e. signal is dominated by water/glycogen). This makes the calibration robust to sickness weeks like the owner's Apr 24-26.

---

## 4. Scientific Basis (per CLAUDE.md Section 15)

| Claim | Source | Where used |
|---|---|---|
| Mifflin-St Jeor BMR formula | Mifflin et al. 1990, *Am J Clin Nutr* | Already used; no change |
| Activity multiplier table (1.2 / 1.375 / 1.55 / 1.725 / 1.9) | Frankenfield et al. 2005, *J Am Diet Assoc* 105:775; ISSN 2018 (PMC 6090881) | Already used |
| Adaptive thermogenesis 5–15% reduction during sustained deficit | Trexler et al. 2014, *J Int Soc Sports Nutr* (PMC 3943438) | Fix 1.4 — already cited in code |
| Dietary self-report systematically underestimates intake by ≈40-50% in dieters | Lichtman et al. 1992, *NEJM* 327:1893 | Fix 1.6, Fix 2.1 — basis for sub-BMR observed TDEE warning |
| Water/glycogen flux: 1 kg ≈ 3-4 g carbohydrate-stored water | Kreitzman et al. 1992, *Am J Clin Nutr* 56:S292 | Fix 3.1, Fix 3.4 |
| 7700 cal/kg fat is a simplification; real range 6,000-9,000 with body composition variance | Hall 2008, *Int J Obes* 32:573 (model); Wishnofsky 1958 (origin) | Acknowledged limitation; not changing the constant — it's a workable approximation |
| ISSN-recommended cut rates ≤ 1% bodyweight per week (≤ 0.95 kg/wk for 95kg user); 1-1.5% acceptable short-term | Helms et al. 2014 (PMC 4347944); ISSN 2018 (PMC 6090881) | Already enforced via risk gates |

No new safety bounds are introduced. All proposed changes either correct existing math or improve display clarity.

---

## 5. Risk Assessment

| Fix | Reversibility | Test surface | Owner data risk |
|---|---|---|---|
| 1.1 daysAvailable | Trivial — one-line change, behaviour-equivalent | Reality Check display | None (display only) |
| 1.2 Recompute s.tdee on load | Reversible (rerun migration removes the change) | All TDEE consumers | TDEE will jump from 3363 → ~2581 — banner the user about the change |
| 1.3 Plan resolution | Trivial | Reality Check, calibration | None |
| 1.4 ATP baseline | Trivial — change one source of truth | TDEE display | TDEE will reflect ATP — drops further to ~2581 vs current ~3022 (without ATP) |
| 1.5 targetOffset bounds | Trivial — clamp on input + one-shot fix on load | Settings UI | Owner's `targetOffset: 1` will be reset to 1500 — banner explaining |
| 1.6 Sub-BMR warning | Display only | Reality Check | None |
| 1.7 Stale calibration clear | Reversible if needed | Calibration history | Wipes one stale value; no real loss |

**Cumulative effect on owner's data after Tier 1 ships:**
- `s.tdee`: 3363 → ~2581 (or whatever the recompute produces — should be in 2500-2650 range)
- `s.calories` ceiling: 3362 → reset to plan default deficit (TDEE − 1500 = ~1080, clamped to plan minCalories 800-floor)
- `s.targetOffset`: 1 → 1500 (default)
- Reality Check state: GATHERING → CALIBRATED (with warnings about the 1328 observed)
- Banner displayed once: "Your TDEE was recalibrated from 3363 → 2581. Previous value used a single-multiplier model; AGRO now uses per-day-type activity (1.70 on eat days, 1.35 on fast days). Your calorie ceiling has been reset to a 1500-cal deficit. Adjust in Settings if you prefer a different ceiling."

---

## 6. Execution Plan (after approval)

1. **Pre-work:** snapshot owner's current backup as `docs/baselines/phase14_pre.json` (rejection material if anything goes wrong).
2. **Branch:** already on `claude/fix-tdee-calorie-calculation-J6hcG`.
3. **Tier 1 commits** (one logical unit per commit, no split between app.html and sw.js):
   - `feat(calibration): days-available reflects entry count, not span` (Fix 1.1)
   - `fix(tdee): recompute on load; resolve plan via PLANS lookup` (Fix 1.2 + 1.3)
   - `fix(atp): baseline cumulative loss off oldest weight, not startDate` (Fix 1.4)
   - `fix(settings): clamp targetOffset to plan bounds; auto-correct on load` (Fix 1.5)
   - `feat(reality-check): warn when observed TDEE below BMR` (Fix 1.6)
   - `fix(calibration): clear stale lastCalibrationObserved out-of-bounds` (Fix 1.7)
4. **Bump:** `APP_VERSION` 7.9.0 → 7.10.0 (minor — meaningful behaviour change with banner). `CACHE_NAME` v28 → v29.
5. **Update:** `UPDATE_LOG.md` entry, `WORKING_VERSIONS.md` after smoke test.
6. **Banner message:** "Math correctness pass — TDEE recalibrated to use per-day-type activity model. See TRACK > Reality Check for the new breakdown."
7. **Smoke checklist** (will execute against owner's restored backup in DevTools):
   - Settings: TDEE shows ~2581
   - Settings: calorie ceiling auto-corrected to 1080 (or plan floor)
   - TRACK > Reality Check: state = CALIBRATED, observed 1328 has orange warning row
   - TRACK > Goal Calculator: rerun with current 95.2/90/19 days produces achievable result
   - Radar: weightTrend recovers from 50% → ~80%; calories axis re-evaluates against new ceiling
8. **Tag:** `v7.10.0-working` after smoke pass; log to `WORKING_VERSIONS.md`.
9. **Stop here.** Tiers 2 and 3 require separate approval.

---

## 7. What I'm NOT doing without explicit approval

- Changing the 7700 cal/kg constant (Hall 2008 model is more accurate but introduces complexity)
- Adding food-logging completeness scoring (would help but is out of scope)
- Modifying plan files (`plans/agro.js` etc.) — these are the source of truth for activity model
- Touching the radar SVG rendering or layout
- Adding new storage keys (no schema migration unless explicitly needed)
- Force-reseting any user data without a banner warning

---

## 8. Open questions for the owner

1. **Recommended TDEE for AGRO at 95kg, 24yo, 178cm, male:** my calculation says ~2581. Does that match your perception of how much you actually burn? If you think the real number is higher (e.g. you suspect you've been underlogging by 25%+), we can adjust the day-type multipliers in `plans/agro.js` (currently 1.70 eat / 1.35 fast). The literature range for "very active 6-day calisthenics + walking" is 1.55–1.75 weekly average.
2. **Calorie ceiling preference:** the AGRO plan declares `minCalories: 800`. Your protocol-as-written (CLAUDE.md Section 3) says 1000. Default offset of 1500 from a 2581 TDEE would give 1081. Want me to set the default to 1000 explicitly, or keep the offset-from-TDEE approach?
3. **Banner phrasing:** OK with the wording in Section 5? I want it factual, not alarming — your data is fine, the math wasn't.
4. **Tier 2 + 3:** approve all in one go, or want to ship Tier 1 first and look at the result before deciding?

---

**Awaiting your approval. Once approved, I'll execute Tier 1, run the smoke checklist, and tag.**
