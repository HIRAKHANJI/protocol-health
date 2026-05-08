// ─── CALIBRATION — Phase D ───────────────────────────────────────────────────
// Closes the TDEE feedback loop. Compares the formula TDEE (Mifflin-St Jeor ×
// activity multiplier) to an observed TDEE computed from real intake + real
// weight loss (CICO rearrangement). Adjusts settings.tdee weekly when reality
// disagrees with the formula by more than 7%.
//
// State machine:
//   GATHERING   — < 12 days of weight span OR < 7 days of food logs in window
//                 → display formula TDEE only, do not apply observed
//   CALIBRATED  — span >= 12 days between earliest and latest weight in the
//                 14-day window + >= 7 days of food log
//                 → blend 70% observed + 30% formula, apply on >7% gap
//   v7.10.0: spanDays = (newest - oldest)/86400000 maxes at days-1 for a
//   `days`-day window. v7.10.0 fix changed the gate from 14 (unreachable)
//   to 13.
//   v7.10.2: relaxed further to 12. Reaching 13 requires a weight today
//   AND 14 days ago — every "missed today" log left users stuck in
//   GATHERING despite tons of history. 12 accepts "13 of last 14 days
//   logged, missed today". The cadence gate (>= 7 days since last apply)
//   AND sanity bounds [BMR, formula × 1.5] still gate any actual TDEE
//   write, so the relaxed display threshold doesn't change apply
//   behaviour.
//
// Manual override (settings.tdeeManualOverride === true) freezes calibration
// entirely. The user keeps whatever TDEE they manually entered.
//
// SANITY BOUNDS (v7.1.0): observed TDEE that violates physiological limits
// is rejected. Rejection criteria:
//   - Weekly weight change > 2 kg (sustained loss/gain at this rate is
//     implausible without sickness/water/glycogen confounds)
//   - Observed TDEE < BMR (formula / activityMultiplier) — physiologically
//     impossible to sustain below BMR
//   - Observed TDEE > formula × 1.5 — implausible burn rate

const MAX_KG_CHANGE_PER_WEEK = 2.0;
const TDEE_CEIL_RATIO = 1.5;
const CALIBRATION_CADENCE_DAYS = 7;
const LOW_COMPLIANCE_PCT = 30;

// Phase 6 (v7.4.0): shared exclusion check for calibration math.
// A day is excluded from the intake/observed-TDEE calculation when:
//   1. The user explicitly flagged it sick (dayLogs[ds].sick === true), OR
//   2. Checklist completion fell below LOW_COMPLIANCE_PCT (default 30%) AND
//      the day actually had a checklist rendered (vc.total > 0). Days with
//      nothing rendered fall through to the unlogged branch instead.
// Returns 'sick' | 'low-compliance' | null. The kgLoss / spanDays attribution
// is unchanged — we still attribute weight change to the full window. Only
// intake-side aggregation excludes affected days, so observed TDEE reflects
// what the user's body burns on representative (non-disrupted) days.
function _getDayExclusion(ds, dayLogs) {
  const dayLog = dayLogs[ds] || {};
  if (dayLog.sick === true) return 'sick';
  if (typeof getValidCheckCompletion === 'function') {
    const vc = getValidCheckCompletion(ds);
    if (vc && vc.total > 0 && (vc.pct || 0) < LOW_COMPLIANCE_PCT) {
      return 'low-compliance';
    }
  }
  return null;
}

// Phase 7 (v7.4.1): sickness pattern auto-detection. Safety net for users
// who don't manually flag sick days. Scans the last `days` calendar dates
// for any run of `requiredConsecutive`+ consecutive disrupted days
// (sick OR low-compliance per _getDayExclusion). When such a run exists,
// weeklyCalibration defers applying — even if the gap exceeds 7% and
// observed is within sanity bounds — because the data window is poisoned
// by a likely sickness/travel/disruption period.
//
// Returns { detected, longestRun, runDates }. detected=true when at least
// one qualifying run exists. longestRun is the length (in days) of the
// longest qualifying run found. runDates is the date strings in that run.
const SICKNESS_PATTERN_REQUIRED_CONSECUTIVE = 3;
function _detectSicknessPattern(days, requiredConsecutive) {
  days = days || 14;
  requiredConsecutive = requiredConsecutive || SICKNESS_PATTERN_REQUIRED_CONSECUTIVE;
  const today = new Date(); today.setHours(0,0,0,0);
  const dayLogs = gs(SK.dayLogs) || {};
  let longestRun = [];
  let currentRun = [];
  // Walk oldest → newest across the window
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = dateToStr(d);
    const exclusion = _getDayExclusion(ds, dayLogs);
    if (exclusion) {
      currentRun.push(ds);
      if (currentRun.length > longestRun.length) longestRun = currentRun.slice();
    } else {
      currentRun = [];
    }
  }
  return {
    detected: longestRun.length >= requiredConsecutive,
    longestRun: longestRun.length,
    runDates: longestRun.length >= requiredConsecutive ? longestRun : []
  };
}

// ─── DAY BREAKDOWN (Phase 1 — Reality Check display) ────────────────────────
// Separates "period average" (incl. fast days at 0) from "eating-day average"
// (only days the user actually ate). Same window as computeObservedTDEE.
// Useful for human-readable display so users don't see "Avg 812 cal" without
// understanding that 6 of those days were fasts.
export function getDayBreakdown(days = 14) {
  const today = new Date(); today.setHours(0,0,0,0);
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - days + 1);
  const weights = (gs(SK.weights) || []).slice();
  const foodLog = gs(SK.foodLog) || {};
  const fastDays = gs(SK.fastDays) || {};
  const dayLogs = gs(SK.dayLogs) || {};
  const inWindow = weights.filter(w => {
    const d = strToDate(w.date);
    return d >= windowStart && d <= today;
  });
  if (inWindow.length < 2) {
    return { totalDays: 0, eatingDayCount: 0, eatingDayIntakeSum: 0, eatingDayAvg: 0,
             fastDayCount: 0, brokenFastCount: 0, fastDayIntakeSum: 0,
             unloggedEatingDayCount: 0, periodAvg: 0, spanDays: 0,
             excludedSick: 0, excludedLowCompliance: 0, excludedTotal: 0 };
  }
  inWindow.sort((a, b) => a.date.localeCompare(b.date));
  const oldestDate = strToDate(inWindow[0].date);
  const newestDate = strToDate(inWindow[inWindow.length - 1].date);
  const spanDays = Math.round((newestDate - oldestDate) / 86400000);

  let eatingDayCount = 0, eatingDayIntakeSum = 0;
  let fastDayCount = 0, brokenFastCount = 0, fastDayIntakeSum = 0;
  let unloggedEatingDayCount = 0;
  let totalDays = 0;
  let periodIntakeSum = 0, periodIntakeDays = 0;
  // Phase 6 (v7.4.0): exclusion counters consistent with computeObservedTDEE
  let excludedSick = 0, excludedLowCompliance = 0;

  for (let d = new Date(oldestDate); d <= newestDate; d.setDate(d.getDate() + 1)) {
    const ds = dateToStr(d);
    const fl = foodLog[ds];
    const isFast = !!fastDays[ds];
    const dayCal = (fl && fl.length) ? fl.reduce((sum, e) => sum + (parseInt(e.calories) || 0), 0) : 0;
    totalDays++;
    // Phase 6: exclusion gate runs before day-type classification so eating/
    // fast counts only reflect non-excluded days. Sick days never appear in
    // the breakdown counts; low-compliance days same. They surface in the
    // excludedSick / excludedLowCompliance counters instead.
    const exclusion = _getDayExclusion(ds, dayLogs);
    if (exclusion === 'sick') { excludedSick++; continue; }
    if (exclusion === 'low-compliance') { excludedLowCompliance++; continue; }
    if (isFast) {
      fastDayCount++;
      if (fl && fl.length > 0) {
        brokenFastCount++;
        fastDayIntakeSum += dayCal;
        periodIntakeSum += dayCal;
        periodIntakeDays++;
      } else {
        // Real fast: 0 intake, counted in period avg
        periodIntakeDays++;
      }
    } else if (fl && fl.length > 0) {
      eatingDayCount++;
      eatingDayIntakeSum += dayCal;
      periodIntakeSum += dayCal;
      periodIntakeDays++;
    } else {
      unloggedEatingDayCount++;
    }
  }

  const eatingDayAvg = eatingDayCount > 0 ? Math.round(eatingDayIntakeSum / eatingDayCount) : 0;
  const periodAvg = periodIntakeDays > 0 ? Math.round(periodIntakeSum / periodIntakeDays) : 0;
  const excludedTotal = excludedSick + excludedLowCompliance;

  return { totalDays, spanDays,
           eatingDayCount, eatingDayIntakeSum, eatingDayAvg,
           fastDayCount, brokenFastCount, fastDayIntakeSum,
           unloggedEatingDayCount, periodAvg,
           excludedSick, excludedLowCompliance, excludedTotal };
}

// ─── PURE COMPUTATION ────────────────────────────────────────────────────────

// Returns observed TDEE based on the CICO rearrangement:
//   observedTDEE = avgIntake + (kgLoss × 7700 ÷ spanDays)
//
// Window = last `days` calendar days. Skips unlogged eating days. Counts fast
// days as 0 intake unless the fast was broken (then uses the food log entries).
export function computeObservedTDEE(days = 14) {
  const today = new Date(); today.setHours(0,0,0,0);
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - days + 1);

  const weights = (gs(SK.weights) || []).slice();
  const foodLog = gs(SK.foodLog) || {};
  const fastDays = gs(SK.fastDays) || {};
  const dayLogs = gs(SK.dayLogs) || {};
  // Filter weights to window
  const inWindow = weights.filter(w => {
    const d = strToDate(w.date);
    return d >= windowStart && d <= today;
  });
  // Common empty-result template — keeps return shape consistent across all
  // early-exit branches (Phase 6 added excludedSick/excludedLowCompliance).
  const empty = { tdee: null, daysLogged: 0, daysAvailable: 0, kgLoss: 0, avgIntake: 0, spanDays: 0,
                  excludedSick: 0, excludedLowCompliance: 0, valid: false };
  if (inWindow.length < 2) {
    return Object.assign({}, empty, { reason: 'need-2-weights' });
  }
  // Sort oldest → newest
  inWindow.sort((a, b) => a.date.localeCompare(b.date));
  const oldest = inWindow[0];
  const newest = inWindow[inWindow.length - 1];
  const oldestDate = strToDate(oldest.date);
  const newestDate = strToDate(newest.date);
  const spanDays = Math.round((newestDate - oldestDate) / 86400000);
  if (spanDays < 7) {
    return Object.assign({}, empty, { daysAvailable: spanDays, spanDays, reason: 'span-too-short' });
  }
  const kgLoss = oldest.weight - newest.weight; // positive = loss

  // Iterate days in span. For each, compute included intake.
  let intakeSum = 0;
  let daysLogged = 0;
  // Phase 6 (v7.4.0): exclusion counters
  let excludedSick = 0, excludedLowCompliance = 0;
  for (let d = new Date(oldestDate); d <= newestDate; d.setDate(d.getDate() + 1)) {
    const ds = dateToStr(d);
    const fl = foodLog[ds];
    const isFast = !!fastDays[ds];
    // Phase 6: exclusion gate — sick flag OR sub-30% checklist completion.
    // Excluded days don't contribute to intake or daysLogged.
    const exclusion = _getDayExclusion(ds, dayLogs);
    if (exclusion === 'sick') { excludedSick++; continue; }
    if (exclusion === 'low-compliance') { excludedLowCompliance++; continue; }
    if (fl && fl.length > 0) {
      // Logged eating day OR broken fast (food was logged)
      const dayCal = fl.reduce((sum, e) => sum + (parseInt(e.calories) || 0), 0);
      intakeSum += dayCal;
      daysLogged++;
    } else if (isFast) {
      // Fast day, no food = real fast = 0 intake
      intakeSum += 0;
      daysLogged++;
    } else {
      // Unlogged eating day — exclude from average (existing behaviour)
    }
  }
  if (daysLogged < 7) {
    return Object.assign({}, empty, { daysLogged, daysAvailable: spanDays, kgLoss, spanDays, excludedSick, excludedLowCompliance, reason: 'need-7-logs' });
  }
  // SANITY: weekly weight change > 2 kg is implausible without confounds
  // (sickness, water retention, glycogen swing). Reject — calibration would
  // produce a wildly wrong TDEE if it trusted this signal.
  const weeklyChange = Math.abs(kgLoss) * 7 / spanDays;
  if (weeklyChange > MAX_KG_CHANGE_PER_WEEK) {
    return Object.assign({}, empty, { daysLogged, daysAvailable: spanDays, kgLoss, spanDays, excludedSick, excludedLowCompliance, reason: 'spike-detected' });
  }
  const avgIntake = intakeSum / daysLogged;
  const observedTDEE = Math.round(avgIntake + (kgLoss * 7700 / spanDays));
  return { tdee: observedTDEE, daysLogged, daysAvailable: spanDays, kgLoss, avgIntake: Math.round(avgIntake), spanDays,
           excludedSick, excludedLowCompliance, valid: true, reason: 'ok' };
}

// v7.9.0: Adaptive thermogenesis (ATP) factor. Cumulative deficit reduces
// TDEE beyond what BMR-from-weight-loss alone predicts (Trexler 2014, PMC
// 3943438: 5-10% sustained reduction). Plan-aware: only cut plans accumulate
// ATP. Returns a multiplier in [0.85, 1.0]. 1.0 = no adaptation; 0.85 = max
// observed in literature for sustained aggressive deficits.
export function computeATPFactor(settings, weights, plan) {
  const goalMode = (plan && plan.goalMode) || 'cut';
  if (goalMode !== 'cut') return 1.0;
  if (!Array.isArray(weights) || weights.length < 2) return 1.0;
  if (!settings || !settings.startDate) return 1.0;

  // Cumulative loss = first → latest weight. Use start-of-schedule weight
  // when available so brief sickness/water spikes don't reset the baseline.
  // Weights are stored newest-first in SK.weights.
  const sortedAsc = weights.slice().sort((a, b) => a.date.localeCompare(b.date));
  const startWeight = sortedAsc[0].weight;
  const currentWeight = sortedAsc[sortedAsc.length - 1].weight;
  const cumulativeLoss = startWeight - currentWeight;
  if (cumulativeLoss < 1.0) return 1.0; // No real loss yet → no ATP

  const startDate = strToDate(settings.startDate);
  const today = new Date(); today.setHours(0,0,0,0);
  const days = Math.max(1, Math.round((today.getTime() - startDate.getTime()) / 86400000));
  const weeks = days / 7;
  if (weeks < 2) return 1.0; // ATP needs sustained deficit; ignore first 2 weeks

  // Loss rate (kg/week); used to scale ATP rate
  const lossRate = (cumulativeLoss * 7) / days;

  // ATP curve: ~5% per 4 weeks at moderate (<1 kg/wk), scaling linearly up
  // to ~10% per 4 weeks at aggressive (>=1.5 kg/wk). Capped at 15% lifetime.
  const aggressionFactor = Math.max(0, Math.min(1, (lossRate - 0.5) / 1.0));
  const ratePerFourWeeks = 0.05 + (aggressionFactor * 0.05);
  const totalATP = Math.min(0.15, ratePerFourWeeks * (weeks / 4));
  return Math.max(0.85, 1 - totalATP);
}

// v7.9.0: returns the active plan from window scope, or null. Helper because
// calibration.js runs in module scope and needs plan-aware activity math.
function _getActivePlanForCalibration() {
  if (typeof getActivePlan === 'function') return getActivePlan();
  return null;
}

// Composes formula TDEE + observed TDEE + computed blend. Used by both the
// reality-check display and the weekly calibration apply step.
// v7.9.0: formula TDEE now uses weekly-weighted activity + ATP factor.
// Exposes the breakdown components so Reality Check can display them.
export function getCalibrationStatus() {
  const s = getSettings();
  const plan = _getActivePlanForCalibration();
  // Formula TDEE — v7.9.0 model. Components broken out for the breakdown UI.
  let formulaTDEE = null;
  let bmr = null;
  let weeklyAvgActivity = 1.55;
  let atpFactor = 1.0;
  const weight = getLatestWeight();
  const height = parseFloat(s.height);
  const age = parseFloat(s.age);
  const sex = s.sex || 'male';
  if (weight && height && age) {
    bmr = sex === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;
    weeklyAvgActivity = (typeof getWeeklyAvgActivity === 'function')
      ? getWeeklyAvgActivity(plan, s)
      : (parseFloat(s.activityLevel) || 1.55);
    atpFactor = computeATPFactor(s, gs(SK.weights) || [], plan);
    formulaTDEE = Math.round(bmr * weeklyAvgActivity * atpFactor);
  }
  const obs = computeObservedTDEE(14);
  const observedTDEE = obs.valid ? obs.tdee : null;

  // Determine state — needs ~13 of the last 14 days covered by weight data
  // AND 7+ logged days. v7.10.2 lowered the threshold from 13 to 12: with
  // a 14-day window, spanDays = days-1 = 13 ONLY if the user logged a
  // weight today AND 14 days ago. Any "missed today" log (very common)
  // left users stuck in GATHERING despite tons of history. The cadence
  // gate (>= 7 days since last apply) and sanity bounds (observed must
  // fall within [BMR, formula × 1.5]) still gate any actual TDEE write,
  // so this relaxed threshold doesn't change apply behaviour — only the
  // displayed state name and cadence-note copy.
  let state = 'GATHERING';
  if (obs.valid && obs.daysLogged >= 7 && obs.daysAvailable >= 12) {
    state = 'CALIBRATED';
  }

  // Blended TDEE — 70/30 in favor of observed once calibrated
  let blendedTDEE = formulaTDEE;
  if (state === 'CALIBRATED' && formulaTDEE && observedTDEE) {
    blendedTDEE = Math.round(0.7 * observedTDEE + 0.3 * formulaTDEE);
  }

  const currentTDEE = s.tdee || formulaTDEE || 2600;
  const gapPercent = (formulaTDEE && observedTDEE)
    ? ((observedTDEE - formulaTDEE) / formulaTDEE) * 100
    : 0;

  // Phase 1: cadence + breakdown info for human-readable display
  const breakdown = getDayBreakdown(14);
  const lastAt = s.lastCalibrationAt ? new Date(s.lastCalibrationAt).getTime() : null;
  const nowMs = Date.now();
  const nextCalibrationAt = lastAt ? new Date(lastAt + CALIBRATION_CADENCE_DAYS * 86400000) : null;
  const daysUntilNextCheck = nextCalibrationAt
    ? Math.max(0, Math.ceil((nextCalibrationAt.getTime() - nowMs) / 86400000))
    : 0;
  // v7.9.0 BUG FIX: distinguish 'never-run' (default) from "ran but outcome
  // not recorded" (legacy data pre-Phase-1). Old code used `||` which treats
  // 'never-run' as truthy and never falls through. Now: only fall through
  // when the stored outcome is genuinely missing or the default placeholder.
  const hasRealOutcome = s.lastCalibrationOutcome
    && s.lastCalibrationOutcome !== 'never-run';
  const lastCalibrationOutcome = hasRealOutcome
    ? s.lastCalibrationOutcome
    : (lastAt ? 'unknown' : 'never-run');

  // v7.9.0: TDEE breakdown components for Reality Check display
  const fastDaysPerWeek = (plan && typeof plan.fastDaysPerWeek === 'number') ? plan.fastDaysPerWeek : 0;
  const lightDaysPerWeek = (plan && typeof plan.lightDaysPerWeek === 'number') ? plan.lightDaysPerWeek : 0;
  const eatDaysPerWeek = Math.max(0, 7 - fastDaysPerWeek - lightDaysPerWeek);
  const planActivityMap = (plan && plan.activityByDayType) || null;
  const userActivityMap = s.activityByDayType || null;
  const activeMap = userActivityMap || planActivityMap;
  const tdeeBreakdown = {
    bmr: bmr != null ? Math.round(bmr) : null,
    weeklyAvgActivity: parseFloat((weeklyAvgActivity || 0).toFixed(3)),
    atpFactor: parseFloat((atpFactor || 1.0).toFixed(3)),
    eatDayActivity: activeMap && typeof activeMap.eatDay === 'number' ? activeMap.eatDay : null,
    fastDayActivity: activeMap && typeof activeMap.fastDay === 'number' ? activeMap.fastDay : null,
    lightDayActivity: activeMap && typeof activeMap.lightDay === 'number' ? activeMap.lightDay : null,
    eatDaysPerWeek, fastDaysPerWeek, lightDaysPerWeek,
    usingDayTypeModel: !!activeMap,
    legacyActivityLevel: (!activeMap) ? (parseFloat(s.activityLevel) || 1.55) : null
  };

  return {
    state,
    formulaTDEE,
    observedTDEE,
    blendedTDEE,
    currentTDEE,
    gapPercent,
    daysLogged: obs.daysLogged,
    daysAvailable: obs.daysAvailable,
    kgLoss: obs.kgLoss,
    avgIntake: obs.avgIntake,
    spanDays: obs.spanDays,
    obsReason: obs.reason,
    overrideOn: !!s.tdeeManualOverride,
    // Phase 1 additions
    breakdown,
    lastCalibrationAt: lastAt ? new Date(lastAt) : null,
    nextCalibrationAt,
    daysUntilNextCheck,
    lastCalibrationOutcome,
    lastCalibrationFormula: s.lastCalibrationFormula || null,
    lastCalibrationObserved: s.lastCalibrationObserved || null,
    // Phase 6 additions: sickness + low-compliance exclusion counters
    excludedSick: obs.excludedSick || 0,
    excludedLowCompliance: obs.excludedLowCompliance || 0,
    excludedTotal: (obs.excludedSick || 0) + (obs.excludedLowCompliance || 0),
    // Phase 7 addition: sickness pattern auto-detection
    sicknessPattern: _detectSicknessPattern(14),
    // v7.9.0 addition: TDEE breakdown components for Reality Check display
    tdeeBreakdown
  };
}

// ─── WEEKLY CALIBRATION RUN ──────────────────────────────────────────────────
// Called once per app load. Bumps lastCalibrationAt every 7 days. Applies a
// new TDEE only when the gap exceeds 7% AND the user hasn't frozen calibration.
export function weeklyCalibration() {
  const s = getSettings();
  if (s.tdeeManualOverride) return { applied: false, reason: 'manual-override' };
  // Cadence gate — once per 7 days
  const lastAt = s.lastCalibrationAt ? new Date(s.lastCalibrationAt).getTime() : 0;
  const ageMs = Date.now() - lastAt;
  if (lastAt && ageMs < CALIBRATION_CADENCE_DAYS * 24 * 3600 * 1000) {
    return { applied: false, reason: 'too-soon' };
  }
  const status = getCalibrationStatus();
  // Phase 13 (v7.8.1): build a snapshot template that each exit branch
  // augments with branch-specific fields (oldTdee/newTdee, etc.).
  const _baseSnapshot = () => ({
    date: todayStr(),
    ts: Date.now(),
    formulaTDEE: status.formulaTDEE || null,
    observedTDEE: status.observedTDEE || null,
    ratio: (status.formulaTDEE && status.observedTDEE) ? (status.observedTDEE / status.formulaTDEE) : null,
    daysAvailable: status.daysAvailable || 0,
    daysLogged: status.daysLogged || 0,
    excludedSick: status.excludedSick || 0,
    excludedLowCompliance: status.excludedLowCompliance || 0,
    sicknessPatternDetected: !!(status.sicknessPattern && status.sicknessPattern.detected),
    longestRun: (status.sicknessPattern && status.sicknessPattern.longestRun) || 0,
    oldTdee: null,
    newTdee: null
  });
  if (status.state !== 'CALIBRATED') {
    // Record the gathering outcome so Reality Check can explain it
    s.lastCalibrationAt = new Date().toISOString();
    s.lastCalibrationOutcome = 'gathering';
    saveSettings(s);
    _appendActivitySnapshot(Object.assign(_baseSnapshot(), { outcome: 'gathering' }));
    return { applied: false, reason: 'gathering' };
  }
  // Phase 7 (v7.4.1): sickness pattern auto-detection. Even when the user
  // hasn't manually flagged days, 3+ consecutive disrupted days inside the
  // 14-day window is a strong signal that the calibration data is poisoned
  // by sickness/travel/disruption. Defer this cycle — pattern will clear
  // naturally once the user has 3+ consecutive non-disrupted days.
  if (status.sicknessPattern && status.sicknessPattern.detected) {
    s.lastCalibrationAt = new Date().toISOString();
    s.lastCalibrationOutcome = 'sickness-pattern-detected';
    saveSettings(s);
    _appendActivitySnapshot(Object.assign(_baseSnapshot(), { outcome: 'sickness-pattern-detected' }));
    return { applied: false, reason: 'sickness-pattern-detected',
             longestRun: status.sicknessPattern.longestRun,
             runDates: status.sicknessPattern.runDates };
  }
  if (!status.formulaTDEE || !status.observedTDEE || !status.blendedTDEE) {
    s.lastCalibrationAt = new Date().toISOString();
    s.lastCalibrationOutcome = 'missing-inputs';
    saveSettings(s);
    _appendActivitySnapshot(Object.assign(_baseSnapshot(), { outcome: 'missing-inputs' }));
    return { applied: false, reason: 'missing-inputs' };
  }
  // SANITY: observed TDEE must be >= raw BMR and <= formula × 1.5.
  // Anything outside this range is physiologically suspect and likely
  // caused by water/sickness/logging noise. Skip applying.
  // v7.9.0 fix: floor uses raw Mifflin BMR from breakdown (not formula
  // ÷ multiplier — that division is wrong when the formula already
  // includes ATP factor). Old math could produce floor lower than BMR.
  const bmrFloor = (status.tdeeBreakdown && status.tdeeBreakdown.bmr) || (status.formulaTDEE * 0.55);
  const ceiling = status.formulaTDEE * TDEE_CEIL_RATIO;
  if (status.observedTDEE < bmrFloor || status.observedTDEE > ceiling) {
    s.lastCalibrationAt = new Date().toISOString();
    s.lastCalibrationFormula = status.formulaTDEE;
    s.lastCalibrationObserved = status.observedTDEE;
    s.lastCalibrationOutcome = 'rejected-out-of-bounds';
    saveSettings(s);
    _appendActivitySnapshot(Object.assign(_baseSnapshot(), {
      outcome: 'rejected-out-of-bounds', oldTdee: status.currentTDEE
    }));
    return { applied: false, reason: 'observed-out-of-bounds', oldTdee: status.currentTDEE, observedTDEE: status.observedTDEE, formulaTDEE: status.formulaTDEE };
  }
  const old = status.currentTDEE;
  const newT = status.blendedTDEE;
  const gap = Math.abs(newT - old) / old;
  // Always update lastCalibrationAt so we don't re-run today
  s.lastCalibrationAt = new Date().toISOString();
  s.lastCalibrationFormula = status.formulaTDEE;
  s.lastCalibrationObserved = status.observedTDEE;
  if (gap < 0.07) {
    s.lastCalibrationOutcome = 'within-threshold';
    saveSettings(s);
    _appendActivitySnapshot(Object.assign(_baseSnapshot(), {
      outcome: 'within-threshold', oldTdee: old, newTdee: newT
    }));
    return { applied: false, reason: 'within-threshold', oldTdee: old, newTdee: newT };
  }
  s.tdee = newT;
  s.lastCalibrationOutcome = 'applied';
  saveSettings(s);
  dispatch('TDEE_CHANGED');
  _appendActivitySnapshot(Object.assign(_baseSnapshot(), {
    outcome: 'applied', oldTdee: old, newTdee: newT
  }));
  // Phase 8 (v7.5.0): linked offset mode auto-tracks TDEE — recompute ceiling
  if (typeof syncCalorieCeilingFromOffset === 'function') syncCalorieCeilingFromOffset();
  // Surface the change to the user
  const direction = newT > old ? 'increased' : 'decreased';
  const msg = 'TDEE ' + direction + ' from ' + old + ' to ' + newT + ' cal/day.\n\n'
    + 'Reason: your last 14 days of weight + food data show your real burn rate is '
    + Math.round(status.observedTDEE) + ' cal (formula predicted ' + Math.round(status.formulaTDEE) + ' cal). '
    + 'New value is a 70/30 blend of observed and formula.\n\n'
    + 'Open TRACK tab and tap REALITY CHECK to see the math.';
  if (typeof showAlert === 'function') showAlert(msg);
  return { applied: true, oldTdee: old, newTdee: newT, status };
}

// ─── ADAPTIVE ACTIVITY MULTIPLIER (Phase 9, v7.6.0) ─────────────────────────
// Infers the user's effective activity multiplier from observed TDEE / BMR.
// Only valid after 28+ days of weight data, 14+ logged days, and no active
// sickness pattern. Capped to plan default ± 0.2 to prevent wild swings —
// the inference is informational; user explicitly applies via Settings UI.
const ACTIVITY_INFER_CAP_DELTA = 0.2;
const ACTIVITY_INFER_MIN_DAYS = 28;
const ACTIVITY_INFER_MIN_LOGS = 14;
// Phase 13 (v7.8.1): activity history capped at 90 entries (~21 months
// at the weekly cadence; ~3 months at daily). Foundation for future
// trend-analysis features; no UI in this phase.
const ACTIVITY_HISTORY_CAP = 90;

// Append a calibration snapshot to SK.activityHistory. Capped at
// ACTIVITY_HISTORY_CAP entries (oldest dropped). Called from weeklyCalibration
// at every evaluation branch — even when nothing was applied — so the history
// reflects the full sequence of attempted calibrations.
function _appendActivitySnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return;
  const arr = gs(SK.activityHistory) || [];
  arr.push(snapshot);
  while (arr.length > ACTIVITY_HISTORY_CAP) arr.shift();
  ss(SK.activityHistory, arr);
}

export function inferActivityMultiplier() {
  const s = getSettings();
  const weight = getLatestWeight();
  const height = parseFloat(s.height);
  const age = parseFloat(s.age);
  if (!weight || !height || !age) {
    return { valid: false, reason: 'missing-baseline' };
  }
  // Use a 28-day window for stability (vs the 14-day calibration window).
  // BMR scales linearly with weight; activity inference benefits from a
  // longer span to dampen day-to-day noise and short-term adaptation effects.
  const obs = computeObservedTDEE(ACTIVITY_INFER_MIN_DAYS);
  if (!obs.valid) {
    return { valid: false, reason: obs.reason || 'observation-invalid',
             daysAvailable: obs.daysAvailable || 0, daysLogged: obs.daysLogged || 0 };
  }
  if (obs.daysAvailable < ACTIVITY_INFER_MIN_DAYS) {
    return { valid: false, reason: 'need-28-days', daysAvailable: obs.daysAvailable, daysLogged: obs.daysLogged };
  }
  if (obs.daysLogged < ACTIVITY_INFER_MIN_LOGS) {
    return { valid: false, reason: 'need-14-logs', daysAvailable: obs.daysAvailable, daysLogged: obs.daysLogged };
  }
  // No active sickness pattern — pattern indicates the data window is poisoned
  // by disrupted days, so the inference would be misleading.
  const pattern = _detectSicknessPattern(14);
  if (pattern.detected) {
    return { valid: false, reason: 'sickness-pattern-active',
             daysAvailable: obs.daysAvailable, daysLogged: obs.daysLogged,
             longestRun: pattern.longestRun };
  }
  const sex = s.sex || 'male';
  const bmr = sex === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  if (!bmr || bmr <= 0) {
    return { valid: false, reason: 'bmr-invalid' };
  }
  const observedTDEE = obs.tdee;
  const rawEffective = observedTDEE / bmr;
  // Clamp to plan default ± delta. Cap names mirror Mifflin × multiplier
  // convention so downstream code can reapply to settings.activityLevel.
  // v7.9.0 (Fix D): plans with fast days have a wider cap range (± 0.35)
  // because the weekly weighted multiplier diverges substantially from
  // the legacy single-value default (e.g. AGRO 1.725 → ~1.55 weighted).
  // Plans without fast days keep the tighter ± 0.20 cap.
  const planDefault = (typeof PLAN_ACTIVITY_DEFAULTS !== 'undefined'
    && PLAN_ACTIVITY_DEFAULTS[s.plan] != null)
    ? parseFloat(PLAN_ACTIVITY_DEFAULTS[s.plan])
    : 1.55;
  const planObj = (typeof PLANS !== 'undefined') ? (PLANS[s.plan] || PLANS.default) : null;
  const fastDaysPerWeek = (planObj && typeof planObj.fastDaysPerWeek === 'number') ? planObj.fastDaysPerWeek : 0;
  const capDelta = fastDaysPerWeek > 0 ? 0.35 : ACTIVITY_INFER_CAP_DELTA;
  const lowerCap = planDefault - capDelta;
  const upperCap = planDefault + capDelta;
  const cappedEffective = Math.max(lowerCap, Math.min(upperCap, rawEffective));
  // Round to 3 decimals for stable display + storage equality checks
  const effective = Math.round(cappedEffective * 1000) / 1000;
  const current = parseFloat(s.activityLevel) || 1.55;
  const gap = current > 0 ? ((effective - current) / current) * 100 : 0;
  return {
    valid: true,
    effective,
    rawEffective: Math.round(rawEffective * 1000) / 1000,
    current,
    gap,
    daysOfData: obs.daysAvailable,
    daysLogged: obs.daysLogged,
    planDefault,
    lowerCap, upperCap,
    capped: rawEffective !== cappedEffective,
    bmr: Math.round(bmr),
    observedTDEE
  };
}

// v7.1.0: Detects whether the currently-stored settings.tdee is physiologically
// implausible relative to the formula prediction. Used at app load to auto-recover
// from a corrupted TDEE (e.g. after a sickness/water spike confused calibration).
// Returns { ok, currentTDEE, formulaTDEE, bmrFloor, ceiling } where ok=false
// means the value is out of bounds and should be reverted.
export function checkStoredTdeeSanity() {
  const s = getSettings();
  // Skip if user explicitly froze TDEE — they're in charge of the value.
  if (s.tdeeManualOverride) return { ok: true, reason: 'manual-override' };
  // Compute formula TDEE directly from settings (don't go through window.recomputeTDEE
  // since that respects the override flag and may not be loaded yet).
  const weight = getLatestWeight();
  const height = parseFloat(s.height);
  const age = parseFloat(s.age);
  if (!weight || !height || !age) return { ok: true, reason: 'no-formula-baseline' };
  const sex = s.sex || 'male';
  const bmr = sex === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  // v7.9.0: formula TDEE uses weekly-weighted activity + ATP factor when
  // available; falls back to the legacy single-value uniform multiplier
  // when day-type model isn't declared.
  const plan = _getActivePlanForCalibration();
  const weeklyAct = (typeof getWeeklyAvgActivity === 'function')
    ? getWeeklyAvgActivity(plan, s)
    : (parseFloat(s.activityLevel) || 1.55);
  const atpFactor = computeATPFactor(s, gs(SK.weights) || [], plan);
  const formulaTDEE = Math.round(bmr * weeklyAct * atpFactor);
  const bmrFloor = Math.round(bmr); // observed cannot drop below BMR sustained
  const ceiling = Math.round(formulaTDEE * TDEE_CEIL_RATIO);
  const currentTDEE = s.tdee || 0;
  if (!currentTDEE) return { ok: false, reason: 'no-tdee-set', currentTDEE, formulaTDEE, bmrFloor, ceiling };
  if (currentTDEE < bmrFloor) return { ok: false, reason: 'below-bmr', currentTDEE, formulaTDEE, bmrFloor, ceiling };
  if (currentTDEE > ceiling) return { ok: false, reason: 'above-ceiling', currentTDEE, formulaTDEE, bmrFloor, ceiling };
  return { ok: true, currentTDEE, formulaTDEE, bmrFloor, ceiling };
}

// v7.9.0: stale calibration data auto-clear. Originally only cleared values
// > 21 days old AND failing sanity bounds. v7.10.0: now clears immediately
// whenever the stored lastCalibrationObserved fails today's bounds — the
// 21-day grace period was originally meant to avoid wiping a real one-off
// blip, but a value that's PHYSIOLOGICALLY IMPOSSIBLE (e.g. observed=291
// when BMR=1949) is never recoverable, only confusing. Returns
// { cleared: bool, reason, oldObserved, ageDays }.
const STALE_CALIBRATION_DAYS = 21;
export function clearStaleCalibrationData() {
  const s = getSettings();
  const lastAt = s.lastCalibrationAt ? new Date(s.lastCalibrationAt).getTime() : null;
  const ageDays = lastAt ? (Date.now() - lastAt) / 86400000 : null;
  const lastObs = s.lastCalibrationObserved;
  // Internal-state cleanup: outcome='never-run' but stored values present
  // (caused by autoRevert pre-v7.10.0 setting lastCalibrationAt without
  // clearing observed/formula, or by clearStale running between snapshot
  // writes). Wipe the orphaned numbers AND lastCalibrationAt so the
  // cadence gate doesn't block the next weeklyCalibration cycle — those
  // stored values are not attached to any real calibration run.
  if (s.lastCalibrationOutcome === 'never-run'
      && (s.lastCalibrationObserved != null || s.lastCalibrationFormula != null
          || s.lastCalibrationAt != null)) {
    s.lastCalibrationObserved = null;
    s.lastCalibrationFormula = null;
    s.lastCalibrationAt = null;
    saveSettings(s);
    return { cleared: true, reason: 'orphaned-never-run-snapshot', oldObserved: lastObs };
  }
  if (!lastObs) return { cleared: false, reason: 'no-observed' };
  // Recompute current sanity bounds against today's data
  const weight = getLatestWeight();
  const height = parseFloat(s.height);
  const age = parseFloat(s.age);
  if (!weight || !height || !age) return { cleared: false, reason: 'no-baseline' };
  const sex = s.sex || 'male';
  const bmr = sex === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  const plan = _getActivePlanForCalibration();
  const weeklyAct = (typeof getWeeklyAvgActivity === 'function')
    ? getWeeklyAvgActivity(plan, s)
    : (parseFloat(s.activityLevel) || 1.55);
  const atpFactor = computeATPFactor(s, gs(SK.weights) || [], plan);
  const formulaTDEE = Math.round(bmr * weeklyAct * atpFactor);
  const ceiling = formulaTDEE * TDEE_CEIL_RATIO;
  // Fails today's sanity? Clear it. v7.10.0: removed the 21-day grace
  // period. A physiologically-impossible value (e.g. observed below BMR)
  // is never going to "recover" — keeping it just confuses the user.
  if (lastObs < bmr || lastObs > ceiling) {
    s.lastCalibrationObserved = null;
    s.lastCalibrationFormula = null;
    s.lastCalibrationOutcome = 'never-run';
    s.lastCalibrationAt = null; // also reset cadence so next load can re-run
    saveSettings(s);
    return { cleared: true, oldObserved: lastObs, ageDays, reason: 'out-of-bounds' };
  }
  // Optional info return for the recent-but-in-bounds case
  if (ageDays !== null && ageDays < STALE_CALIBRATION_DAYS) {
    return { cleared: false, reason: 'recent-and-in-bounds', ageDays };
  }
  return { cleared: false, reason: 'in-bounds' };
}

// v7.1.0: If the stored TDEE is implausible, reset it to formula and return
// what was reverted. Caller should show the user a banner explaining why.
// v7.10.0 fix: previously bumped lastCalibrationAt to NOW which silently
// blocked weeklyCalibration's cadence gate for 7 days AND left the stored
// outcome untouched (so Reality Check could keep showing 'never-run' or a
// stale value alongside this revert). Now: clear lastCalibrationAt entirely
// so the next cycle evaluates fresh, AND record 'reverted' as the outcome
// with the pre-revert formula/observed snapshot for transparency.
export function autoRevertImplausibleTdee() {
  const check = checkStoredTdeeSanity();
  if (check.ok) return { reverted: false, ...check };
  if (!check.formulaTDEE) return { reverted: false, ...check };
  const s = getSettings();
  const old = s.tdee;
  s.tdee = check.formulaTDEE;
  s.lastCalibrationAt = null; // unblock cadence — let weeklyCalibration retry
  s.lastCalibrationOutcome = 'reverted';
  s.lastCalibrationFormula = check.formulaTDEE;
  s.lastCalibrationObserved = null; // the pre-revert observed was bad data
  saveSettings(s);
  if (typeof dispatch === 'function') dispatch('TDEE_CHANGED');
  return { reverted: true, oldTDEE: old, newTDEE: check.formulaTDEE, ...check };
}

// ─── REALITY CHECK BLOCK (TRACK tab) — Phase 1 rewrite ──────────────────────

// Builds the cadence-status note shown under "Currently using". Plain English,
// tells the user exactly why the displayed TDEE is/isn't tracking observed.
function _buildCadenceNote(status) {
  if (status.overrideOn) {
    return 'Auto-calibration is OFF (you froze TDEE). Untick "Freeze TDEE" in Settings to re-enable.';
  }
  if (status.state !== 'CALIBRATED') {
    // v7.10.2: matches the relaxed gate in getCalibrationStatus (>= 12).
    // Keeping the cadence-note threshold in lockstep with the actual
    // gating threshold so the displayed shortfall is honest.
    const needWeight = Math.max(0, 12 - (status.daysAvailable || 0));
    const needFood = Math.max(0, 7 - (status.daysLogged || 0));
    if (needWeight > 0 && needFood > 0) {
      return 'Gathering data — needs ' + needWeight + ' more days of weight logs and ' + needFood + ' more food-logged days.';
    } else if (needWeight > 0) {
      return 'Gathering data — needs ' + needWeight + ' more days of weight logs.';
    } else if (needFood > 0) {
      return 'Gathering data — needs ' + needFood + ' more food-logged days in the last 14.';
    }
    return 'Gathering data.';
  }
  // State is CALIBRATED — show next-check info or last-run outcome
  const nextDateStr = status.nextCalibrationAt
    ? status.nextCalibrationAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;
  const inDays = status.daysUntilNextCheck;
  const nextStr = inDays === 0 ? 'on next app load' : ('in ' + inDays + ' day' + (inDays === 1 ? '' : 's') + (nextDateStr ? ' (' + nextDateStr + ')' : ''));
  // Phase 7 (v7.4.1): if a sickness pattern exists right now, flag it
  // proactively — calibration will defer next cycle even if cadence elapses.
  // Fires regardless of whether the LAST run was deferred for the same reason
  // (a fresh pattern can appear between calibration cycles).
  if (status.sicknessPattern && status.sicknessPattern.detected
      && status.lastCalibrationOutcome !== 'sickness-pattern-detected') {
    return 'Calibration will pause — sickness pattern detected ('
      + status.sicknessPattern.longestRun + ' consecutive disrupted days). '
      + 'Will retry once pattern clears. Next check ' + nextStr + '.';
  }
  switch (status.lastCalibrationOutcome) {
    case 'applied':
      return 'Last run: applied. Next check ' + nextStr + '.';
    case 'within-threshold':
      return 'Last run: within ±7%, no change. Next check ' + nextStr + '.';
    case 'rejected-out-of-bounds':
      return 'Last run: rejected — observed ' + (status.lastCalibrationObserved || '?') + ' cal outside safe range. Next check ' + nextStr + '.';
    case 'sickness-pattern-detected':
      // Phase 7: prior cycle deferred. If pattern still active, mention; else note ready to retry.
      if (status.sicknessPattern && status.sicknessPattern.detected) {
        return 'Last run: deferred — sickness pattern detected ('
          + status.sicknessPattern.longestRun + ' consecutive disrupted days). '
          + 'Will retry once pattern clears. Next check ' + nextStr + '.';
      }
      return 'Last run: deferred for sickness pattern. Pattern has cleared — next check ' + nextStr + '.';
    case 'gathering':
      return 'Last run: not enough data. Next check ' + nextStr + '.';
    case 'missing-inputs':
      return 'Last run: missing inputs. Next check ' + nextStr + '.';
    case 'reverted':
      // v7.10.0: TDEE was auto-reverted to formula because the prior stored
      // value was outside physiological bounds. Cadence is unblocked so
      // calibration retries on the next load.
      return 'TDEE was auto-corrected to formula. Calibration will retry on next app load.';
    case 'never-run':
      return 'First calibration on next app load.';
    default:
      return 'Next check ' + nextStr + '.';
  }
}

export function renderRealityCheck() {
  const box = document.getElementById('realityCheckBox');
  if (!box) return;
  const status = getCalibrationStatus();

  // Hidden until at least 7 days of data — otherwise the numbers are noise.
  if (status.daysAvailable < 7) {
    box.innerHTML = '';
    return;
  }

  const fmtCal = n => (n == null) ? '—' : Math.round(n) + ' cal';
  const fmtKg = n => (n == null || isNaN(n)) ? '—' : (n >= 0 ? '+' : '') + n.toFixed(2) + ' kg';

  // Predicted vs actual loss (formula-based)
  let predictedLoss = null;
  let actualLoss = status.kgLoss; // positive = lost
  let gapText = '—';
  let gapColor = 'var(--muted)';
  if (status.formulaTDEE && status.avgIntake && status.spanDays) {
    const dailyDeficit = status.formulaTDEE - status.avgIntake;
    predictedLoss = (dailyDeficit * status.spanDays) / 7700;
    if (predictedLoss !== 0) {
      const gapPct = ((actualLoss - predictedLoss) / Math.abs(predictedLoss)) * 100;
      const sign = gapPct >= 0 ? '+' : '';
      gapText = sign + Math.round(gapPct) + '% vs predicted';
      if (gapPct < -15) gapColor = 'var(--accent2)'; // slower than expected
      else if (gapPct > 15) gapColor = 'var(--accent)'; // faster than expected
    }
  }

  const stateColor = status.state === 'CALIBRATED' ? 'var(--accent)' : 'var(--accent2)';
  const stateLabel = status.state === 'CALIBRATED' ? 'CALIBRATED' : 'GATHERING DATA';

  // Phase 1: structured intake breakdown — period vs eating-day vs fast count
  // Phase 6 addition: excluded-days row (sick / low-compliance) when count > 0
  const bd = status.breakdown || {};
  const excludedRow = (bd.excludedTotal && bd.excludedTotal > 0)
    ? `<div class="rc-row"><span class="rc-label">Days excluded</span><span class="rc-val">${bd.excludedTotal}${
        (bd.excludedSick > 0 || bd.excludedLowCompliance > 0)
          ? ' · ' + [
              bd.excludedSick > 0 ? bd.excludedSick + ' sick' : null,
              bd.excludedLowCompliance > 0 ? bd.excludedLowCompliance + ' low compliance' : null
            ].filter(Boolean).join(', ')
          : ''
      }</span></div>`
    : '';
  const intakeBlock = (bd.totalDays > 0)
    ? `<div class="rc-row"><span class="rc-label">Eating-day avg</span><span class="rc-val">${fmtCal(bd.eatingDayAvg)}</span></div>
       <div class="rc-row"><span class="rc-label">Period avg (incl. fasts)</span><span class="rc-val">${fmtCal(bd.periodAvg)}</span></div>
       <div class="rc-row"><span class="rc-label">Fast days</span><span class="rc-val">${bd.fastDayCount} of ${bd.totalDays}${bd.brokenFastCount > 0 ? ' · ' + bd.brokenFastCount + ' broken' : ''}</span></div>
       ${excludedRow}`
    : '';

  const obsLine = status.observedTDEE
    ? `<div class="rc-row"><span class="rc-label">Observed TDEE</span><span class="rc-val">${fmtCal(status.observedTDEE)}</span></div>`
    : '';
  const formLine = status.formulaTDEE
    ? `<div class="rc-row"><span class="rc-label">Formula TDEE</span><span class="rc-val">${fmtCal(status.formulaTDEE)}</span></div>`
    : '';
  const usingLine = `<div class="rc-row"><span class="rc-label">Currently using</span><span class="rc-val" style="color:${stateColor}">${fmtCal(status.currentTDEE)}</span></div>`;

  // Phase 1: cadence note replaces the generic "gathering" line
  const cadenceNote = `<div class="rc-cadence-note">${_buildCadenceNote(status)}</div>`;

  const lossLines = (predictedLoss != null)
    ? `<div class="rc-row"><span class="rc-label">Predicted loss (${status.spanDays}d)</span><span class="rc-val">${fmtKg(predictedLoss)}</span></div>
       <div class="rc-row"><span class="rc-label">Actual loss (${status.spanDays}d)</span><span class="rc-val">${fmtKg(actualLoss)}</span></div>
       <div class="rc-row"><span class="rc-label">Gap</span><span class="rc-val" style="color:${gapColor}">${gapText}</span></div>`
    : '';

  // v7.9.0: TDEE BREAKDOWN section — shows BMR + activity (per-day-type
  // when plan declares it) + ATP factor + effective formula TDEE. Replaces
  // the opaque "Formula TDEE: 3,382" line with a transparent decomposition.
  const tb = status.tdeeBreakdown || {};
  let breakdownBlock = '';
  if (tb.bmr) {
    const fmtMult = v => (v == null) ? '—' : '×' + (Math.round(v * 100) / 100).toFixed(2);
    const atpPct = tb.atpFactor < 1 ? ' (−' + Math.round((1 - tb.atpFactor) * 100) + '%)' : '';
    const dayTypeRows = [];
    if (tb.usingDayTypeModel) {
      if (tb.eatDayActivity != null && tb.eatDaysPerWeek > 0) {
        dayTypeRows.push(`<div class="rc-row"><span class="rc-label">Eat-day activity</span><span class="rc-val">${fmtMult(tb.eatDayActivity)} <span style="color:var(--muted);font-size:0.85em">(${tb.eatDaysPerWeek}d/wk)</span></span></div>`);
      }
      if (tb.fastDayActivity != null && tb.fastDaysPerWeek > 0) {
        dayTypeRows.push(`<div class="rc-row"><span class="rc-label">Fast-day activity</span><span class="rc-val">${fmtMult(tb.fastDayActivity)} <span style="color:var(--muted);font-size:0.85em">(${tb.fastDaysPerWeek}d/wk)</span></span></div>`);
      }
      if (tb.lightDayActivity != null && tb.lightDaysPerWeek > 0) {
        dayTypeRows.push(`<div class="rc-row"><span class="rc-label">Light-day activity</span><span class="rc-val">${fmtMult(tb.lightDayActivity)} <span style="color:var(--muted);font-size:0.85em">(${tb.lightDaysPerWeek}d/wk)</span></span></div>`);
      }
      dayTypeRows.push(`<div class="rc-row"><span class="rc-label">Weekly avg activity</span><span class="rc-val" style="color:var(--accent)">${fmtMult(tb.weeklyAvgActivity)}</span></div>`);
    } else {
      // Legacy single-multiplier fallback for plans without day-type model
      dayTypeRows.push(`<div class="rc-row"><span class="rc-label">Activity multiplier</span><span class="rc-val">${fmtMult(tb.legacyActivityLevel || tb.weeklyAvgActivity)}</span></div>`);
    }
    const atpRow = tb.atpFactor < 1
      ? `<div class="rc-row"><span class="rc-label">Adaptive thermo</span><span class="rc-val" style="color:var(--accent2)">${fmtMult(tb.atpFactor)}${atpPct}</span></div>`
      : `<div class="rc-row"><span class="rc-label">Adaptive thermo</span><span class="rc-val" style="color:var(--muted)">none yet</span></div>`;
    breakdownBlock = `<div class="rc-section">
      <div class="rc-row"><span class="rc-label" style="color:var(--accent);font-family:'Bebas Neue',sans-serif;letter-spacing:1.2px">TDEE BREAKDOWN</span></div>
      <div class="rc-row"><span class="rc-label">BMR (Mifflin)</span><span class="rc-val">${fmtCal(tb.bmr)}</span></div>
      ${dayTypeRows.join('')}
      ${atpRow}
      <div class="rc-row" style="border-top:1px dashed var(--border);padding-top:6px;margin-top:4px"><span class="rc-label">Effective formula TDEE</span><span class="rc-val" style="color:var(--accent)">${fmtCal(status.formulaTDEE)}</span></div>
    </div>`;
  }

  box.innerHTML = `<div class="reality-check">
    <div class="rc-header">
      <span class="rc-title">REALITY <span>CHECK</span></span>
      <span class="rc-header-actions">
        <span class="rc-state-pill" style="background:${stateColor};color:#000">${stateLabel}</span>
        <button class="rc-explain-btn" type="button" onclick="openRealityExplain()" aria-label="What does this mean?">ⓘ Explain</button>
      </span>
    </div>
    ${lossLines ? '<div class="rc-section">' + lossLines + '</div>' : ''}
    ${intakeBlock ? '<div class="rc-section">' + intakeBlock + '</div>' : ''}
    ${breakdownBlock}
    <div class="rc-section">
      ${formLine}
      ${obsLine}
      ${usingLine}
      ${cadenceNote}
    </div>
  </div>`;
}
