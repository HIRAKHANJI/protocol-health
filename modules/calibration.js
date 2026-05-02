// ─── CALIBRATION — Phase D ───────────────────────────────────────────────────
// Closes the TDEE feedback loop. Compares the formula TDEE (Mifflin-St Jeor ×
// activity multiplier) to an observed TDEE computed from real intake + real
// weight loss (CICO rearrangement). Adjusts settings.tdee weekly when reality
// disagrees with the formula by more than 7%.
//
// State machine:
//   GATHERING   — < 14 days of weight logs OR < 7 days of food logs in window
//                 → display formula TDEE only, do not apply observed
//   CALIBRATED  — >= 14 days of weight + >= 7 days of food log
//                 → blend 70% observed + 30% formula, apply on >7% gap
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
  const inWindow = weights.filter(w => {
    const d = strToDate(w.date);
    return d >= windowStart && d <= today;
  });
  if (inWindow.length < 2) {
    return { totalDays: 0, eatingDayCount: 0, eatingDayIntakeSum: 0, eatingDayAvg: 0,
             fastDayCount: 0, brokenFastCount: 0, fastDayIntakeSum: 0,
             unloggedEatingDayCount: 0, periodAvg: 0, spanDays: 0 };
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

  for (let d = new Date(oldestDate); d <= newestDate; d.setDate(d.getDate() + 1)) {
    const ds = dateToStr(d);
    const fl = foodLog[ds];
    const isFast = !!fastDays[ds];
    const dayCal = (fl && fl.length) ? fl.reduce((sum, e) => sum + (parseInt(e.calories) || 0), 0) : 0;
    totalDays++;
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

  return { totalDays, spanDays,
           eatingDayCount, eatingDayIntakeSum, eatingDayAvg,
           fastDayCount, brokenFastCount, fastDayIntakeSum,
           unloggedEatingDayCount, periodAvg };
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
  // Filter weights to window
  const inWindow = weights.filter(w => {
    const d = strToDate(w.date);
    return d >= windowStart && d <= today;
  });
  if (inWindow.length < 2) {
    return { tdee: null, daysLogged: 0, daysAvailable: 0, kgLoss: 0, avgIntake: 0, spanDays: 0, valid: false, reason: 'need-2-weights' };
  }
  // Sort oldest → newest
  inWindow.sort((a, b) => a.date.localeCompare(b.date));
  const oldest = inWindow[0];
  const newest = inWindow[inWindow.length - 1];
  const oldestDate = strToDate(oldest.date);
  const newestDate = strToDate(newest.date);
  const spanDays = Math.round((newestDate - oldestDate) / 86400000);
  if (spanDays < 7) {
    return { tdee: null, daysLogged: 0, daysAvailable: spanDays, kgLoss: 0, avgIntake: 0, spanDays, valid: false, reason: 'span-too-short' };
  }
  const kgLoss = oldest.weight - newest.weight; // positive = loss

  // Iterate days in span. For each, compute included intake.
  let intakeSum = 0;
  let daysLogged = 0;
  for (let d = new Date(oldestDate); d <= newestDate; d.setDate(d.getDate() + 1)) {
    const ds = dateToStr(d);
    const fl = foodLog[ds];
    const isFast = !!fastDays[ds];
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
      // Unlogged eating day — exclude from average
    }
  }
  if (daysLogged < 7) {
    return { tdee: null, daysLogged, daysAvailable: spanDays, kgLoss, avgIntake: 0, spanDays, valid: false, reason: 'need-7-logs' };
  }
  // SANITY: weekly weight change > 2 kg is implausible without confounds
  // (sickness, water retention, glycogen swing). Reject — calibration would
  // produce a wildly wrong TDEE if it trusted this signal.
  const weeklyChange = Math.abs(kgLoss) * 7 / spanDays;
  if (weeklyChange > MAX_KG_CHANGE_PER_WEEK) {
    return { tdee: null, daysLogged, daysAvailable: spanDays, kgLoss, avgIntake: 0, spanDays, valid: false, reason: 'spike-detected' };
  }
  const avgIntake = intakeSum / daysLogged;
  const observedTDEE = Math.round(avgIntake + (kgLoss * 7700 / spanDays));
  return { tdee: observedTDEE, daysLogged, daysAvailable: spanDays, kgLoss, avgIntake: Math.round(avgIntake), spanDays, valid: true, reason: 'ok' };
}

// Composes formula TDEE + observed TDEE + computed blend. Used by both the
// reality-check display and the weekly calibration apply step.
export function getCalibrationStatus() {
  const s = getSettings();
  // Formula TDEE — same Mifflin-St Jeor logic as recomputeTDEE() in app.html,
  // duplicated here so this module can run before that helper is loaded.
  let formulaTDEE = null;
  const weight = getLatestWeight();
  const height = parseFloat(s.height);
  const age = parseFloat(s.age);
  const sex = s.sex || 'male';
  const actMult = parseFloat(s.activityLevel) || 1.55;
  if (weight && height && age) {
    const bmr = sex === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;
    formulaTDEE = Math.round(bmr * actMult);
  }
  const obs = computeObservedTDEE(14);
  const observedTDEE = obs.valid ? obs.tdee : null;

  // Determine state — needs 14+ days of weight data AND 7+ logged days in window
  let state = 'GATHERING';
  if (obs.valid && obs.daysLogged >= 7 && obs.daysAvailable >= 14) {
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
  const lastCalibrationOutcome = s.lastCalibrationOutcome || (lastAt ? 'unknown' : 'never-run');

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
    lastCalibrationObserved: s.lastCalibrationObserved || null
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
  if (status.state !== 'CALIBRATED') {
    // Record the gathering outcome so Reality Check can explain it
    s.lastCalibrationAt = new Date().toISOString();
    s.lastCalibrationOutcome = 'gathering';
    saveSettings(s);
    return { applied: false, reason: 'gathering' };
  }
  if (!status.formulaTDEE || !status.observedTDEE || !status.blendedTDEE) {
    s.lastCalibrationAt = new Date().toISOString();
    s.lastCalibrationOutcome = 'missing-inputs';
    saveSettings(s);
    return { applied: false, reason: 'missing-inputs' };
  }
  // SANITY: observed TDEE must be >= BMR (formula / activityMultiplier) and
  // <= formula × 1.5. Anything outside this range is physiologically suspect
  // and likely caused by water/sickness/logging noise. Skip applying.
  const actMult = parseFloat(s.activityLevel) || 1.55;
  const bmrFloor = status.formulaTDEE / actMult;
  const ceiling = status.formulaTDEE * TDEE_CEIL_RATIO;
  if (status.observedTDEE < bmrFloor || status.observedTDEE > ceiling) {
    s.lastCalibrationAt = new Date().toISOString();
    s.lastCalibrationFormula = status.formulaTDEE;
    s.lastCalibrationObserved = status.observedTDEE;
    s.lastCalibrationOutcome = 'rejected-out-of-bounds';
    saveSettings(s);
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
    return { applied: false, reason: 'within-threshold', oldTdee: old, newTdee: newT };
  }
  s.tdee = newT;
  s.lastCalibrationOutcome = 'applied';
  saveSettings(s);
  dispatch('TDEE_CHANGED');
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
  const actMult = parseFloat(s.activityLevel) || 1.55;
  const bmr = sex === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  const formulaTDEE = Math.round(bmr * actMult);
  const bmrFloor = Math.round(bmr); // observed cannot drop below BMR sustained
  const ceiling = Math.round(formulaTDEE * TDEE_CEIL_RATIO);
  const currentTDEE = s.tdee || 0;
  if (!currentTDEE) return { ok: false, reason: 'no-tdee-set', currentTDEE, formulaTDEE, bmrFloor, ceiling };
  if (currentTDEE < bmrFloor) return { ok: false, reason: 'below-bmr', currentTDEE, formulaTDEE, bmrFloor, ceiling };
  if (currentTDEE > ceiling) return { ok: false, reason: 'above-ceiling', currentTDEE, formulaTDEE, bmrFloor, ceiling };
  return { ok: true, currentTDEE, formulaTDEE, bmrFloor, ceiling };
}

// v7.1.0: If the stored TDEE is implausible, reset it to formula and return
// what was reverted. Caller should show the user a banner explaining why.
export function autoRevertImplausibleTdee() {
  const check = checkStoredTdeeSanity();
  if (check.ok) return { reverted: false, ...check };
  if (!check.formulaTDEE) return { reverted: false, ...check };
  const s = getSettings();
  const old = s.tdee;
  s.tdee = check.formulaTDEE;
  // Reset lastCalibrationAt so the next calibration cycle gets a fresh
  // chance once the user's data stabilizes (~14 days from now).
  s.lastCalibrationAt = new Date().toISOString();
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
    const needWeight = Math.max(0, 14 - (status.daysAvailable || 0));
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
  switch (status.lastCalibrationOutcome) {
    case 'applied':
      return 'Last run: applied. Next check ' + nextStr + '.';
    case 'within-threshold':
      return 'Last run: within ±7%, no change. Next check ' + nextStr + '.';
    case 'rejected-out-of-bounds':
      return 'Last run: rejected — observed ' + (status.lastCalibrationObserved || '?') + ' cal outside safe range. Next check ' + nextStr + '.';
    case 'gathering':
      return 'Last run: not enough data. Next check ' + nextStr + '.';
    case 'missing-inputs':
      return 'Last run: missing inputs. Next check ' + nextStr + '.';
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
  const bd = status.breakdown || {};
  const intakeBlock = (bd.totalDays > 0)
    ? `<div class="rc-row"><span class="rc-label">Eating-day avg</span><span class="rc-val">${fmtCal(bd.eatingDayAvg)}</span></div>
       <div class="rc-row"><span class="rc-label">Period avg (incl. fasts)</span><span class="rc-val">${fmtCal(bd.periodAvg)}</span></div>
       <div class="rc-row"><span class="rc-label">Fast days</span><span class="rc-val">${bd.fastDayCount} of ${bd.totalDays}${bd.brokenFastCount > 0 ? ' · ' + bd.brokenFastCount + ' broken' : ''}</span></div>`
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
    <div class="rc-section">
      ${formLine}
      ${obsLine}
      ${usingLine}
      ${cadenceNote}
    </div>
  </div>`;
}
