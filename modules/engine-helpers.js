// ─── ENGINE HELPERS — Protocol Health Workout Engine (v9, Phase 1) ───────────
//
// STATUS: DORMANT. This module has NO consumer yet. Importing it has zero side
// effects. It is the pure-function math/safety layer the v9 Workout Engine
// (modules/workout-engine.js, not yet built) will compose. The legacy static
// workoutContent() in each plans/*.js remains the only render path until the
// engine ships behind an opt-in BETA toggle (default OFF).
//
// CONTRACT: every export is a PURE function — no DOM, no globals, no I/O, no
// mutation of inputs, deterministic for a given input. The numbers below are
// taken verbatim from WORKOUTS_LIBRARY.md §2.1 (plan eligibility), §2.2
// (universal modulators), §2.3 (blanket restrictions), and the AUTO-PRESCRIPTION
// DATA MODEL (Intensity Modifiers / Progression Rules / Deload). Source citations
// trace to CLAUDE.md §15.
//
// userState shape consumed by these functions:
//   { plan, levels:{[group]:int}, age:int, weight:kg, sex:'male'|'female',
//     experience:'beginner'|'intermediate'|'returning', reentryDaysAgo:int,
//     daysSinceDeload:int,
//     completionHistory:{[exId]:[{date,actualReps,targetReps,formOk}]},
//     safetyBrakesEnabled:bool, injuries:[tokens], medicalClearance:bool }
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── small pure utilities (module-local, not exported) ───────────────────────

function clampInt(n, lo, hi) {
  const v = Math.round(n);
  return Math.max(lo, Math.min(hi, v));
}

// Upper-body regions (per §2.2 female adjustment).
const UPPER_REGIONS = new Set(['chest', 'back', 'shoulders', 'arms']);
// Lower-body regions (per §2.2 female adjustment).
const LOWER_REGIONS = new Set(['legs', 'glutes']);

// Archetypes that count as resistance/skill volume for the fast-day cut (§ engine).
const RESISTANCE_TYPES = new Set(['compound', 'isolation', 'isometric', 'skill']);
const RECOVERY_TYPES = new Set(['conditioning', 'recovery', 'rest', 'mobility']);

// ─── §2.1 — PLAN ELIGIBILITY ─────────────────────────────────────────────────

/**
 * isPlanEligible(plan, user) -> { eligible, reason }
 * Implements WORKOUTS_LIBRARY.md §2.1. lite is always eligible (the universal
 * fallback). For non-lite plans we block on the hard "✗" cells:
 *   - weight >120 → cut/bulk/agro blocked (use LITE first); maintenance modified-but-allowed.
 *   - age >=65 → agro not recommended (blocked).
 * Medical-clearance "⚠" cells are NOT hard blocks here — eligibility stays true
 * but the reason notes the clearance requirement (the caller surfaces it).
 */
export function isPlanEligible(plan, user) {
  const age = user.age;
  const weight = user.weight;

  if (plan === 'lite') {
    return { eligible: true, reason: 'LITE is available to all demographics.' };
  }

  // Weight > 120kg — §2.1 row.
  if (weight > 120) {
    if (plan === 'cut' || plan === 'bulk' || plan === 'agro') {
      return { eligible: false, reason: `Weight ${weight}kg >120: ${plan.toUpperCase()} blocked — use LITE first.` };
    }
    if (plan === 'maintenance') {
      return { eligible: true, reason: `Weight ${weight}kg >120: MAINTENANCE allowed but modified.` };
    }
  }

  // Age >= 65 — §2.1 row.
  if (age >= 65) {
    if (plan === 'agro') {
      return { eligible: false, reason: `Age ${age} >=65: AGRO not recommended.` };
    }
    if (plan === 'cut' || plan === 'bulk') {
      return { eligible: true, reason: `Age ${age} >=65: ${plan.toUpperCase()} requires medical clearance.` };
    }
    if (plan === 'maintenance') {
      return { eligible: true, reason: `Age ${age} >=65: MAINTENANCE modified.` };
    }
  }

  // Age 50-64 — all plans available, agro is reduced-volume/no-plyo (not blocked).
  if (age >= 50 && age < 65) {
    if (plan === 'agro') {
      return { eligible: true, reason: `Age ${age} (50-64): AGRO allowed, reduced volume, no plyometrics.` };
    }
    return { eligible: true, reason: `Age ${age} (50-64): ${plan.toUpperCase()} available, modified volume.` };
  }

  // Weight 100-120kg — all plans available, no plyometrics (not blocked).
  if (weight >= 100 && weight <= 120) {
    return { eligible: true, reason: `Weight ${weight}kg (100-120): ${plan.toUpperCase()} available, no plyometrics.` };
  }

  return { eligible: true, reason: `${plan.toUpperCase()} available for this profile.` };
}

// ─── §2.2 — UNIVERSAL MODULATORS (returned as discrete deltas) ───────────────

/**
 * ageMultiplier(age) -> { setsMult, repsDelta, restAdd }
 * §2.2: 18-49 → 1.0/0/0 ; 50-64 → 0.9/0/+15 ; 65+ → 0.75/0/+30.
 * (The "drop 1 level" for 65+ is a levelDelta handled by the selection stage,
 * not here — here repsDelta stays 0 per the brief.)
 */
export function ageMultiplier(age) {
  if (age >= 65) return { setsMult: 0.75, repsDelta: 0, restAdd: 30 };
  if (age >= 50) return { setsMult: 0.9, repsDelta: 0, restAdd: 15 };
  return { setsMult: 1.0, repsDelta: 0, restAdd: 0 };
}

/**
 * weightModifier(weight) -> { setsMult, repsDelta, restAdd, noPlyo, forceLite }
 * §2.2: <100 → 1.0/0/0 ; 100-120 → 1.0/0/0 + noPlyo ; >120 → 0.7/0/+20 + noPlyo + forceLite.
 */
export function weightModifier(weight) {
  if (weight > 120) {
    return { setsMult: 0.7, repsDelta: 0, restAdd: 20, noPlyo: true, forceLite: true };
  }
  if (weight >= 100 && weight <= 120) {
    return { setsMult: 1.0, repsDelta: 0, restAdd: 0, noPlyo: true, forceLite: false };
  }
  return { setsMult: 1.0, repsDelta: 0, restAdd: 0, noPlyo: false, forceLite: false };
}

/**
 * sexAdjustment(sex, exercise) -> int (reps delta)
 * §2.2: female → upper body -2 reps, lower body +2 reps; male → 0.
 * Regions outside the upper/lower buckets (core, full_body, skill, etc.) → 0.
 */
export function sexAdjustment(sex, exercise) {
  if (sex !== 'female') return 0;
  const region = exercise && exercise.region;
  if (UPPER_REGIONS.has(region)) return -2;
  if (LOWER_REGIONS.has(region)) return 2;
  return 0;
}

/**
 * experienceModifier(experience) -> { setsMult, levelDelta }
 * §2.2: beginner (first 4 weeks) → 0.7/0 ; returning (re-entry >2wk off) → 0.8/-1 ;
 * intermediate → 1.0/0.
 */
export function experienceModifier(experience) {
  if (experience === 'beginner') return { setsMult: 0.7, levelDelta: 0 };
  if (experience === 'returning') return { setsMult: 0.8, levelDelta: -1 };
  return { setsMult: 1.0, levelDelta: 0 };
}

/**
 * reentryModifier(daysAgo) -> { setsMult, levelDelta, restAdd }
 * §2.2 re-entry: >14 days off → 0.8 sets, drop 1 level, plan-default rest, for 2 weeks.
 * Otherwise neutral.
 */
export function reentryModifier(daysAgo) {
  if (typeof daysAgo === 'number' && daysAgo > 14) {
    return { setsMult: 0.8, levelDelta: -1, restAdd: 0 };
  }
  return { setsMult: 1.0, levelDelta: 0, restAdd: 0 };
}

// ─── INJURY + DEMOGRAPHIC SAFETY BRAKES ──────────────────────────────────────

/**
 * evalInjuryBlock(exercise, user) -> boolean
 * true if any active-injury token in user.injuries appears in
 * exercise.contraindications. ALWAYS applies — you never train an active injury,
 * regardless of safetyBrakesEnabled.
 */
export function evalInjuryBlock(exercise, user) {
  const injuries = (user && user.injuries) || [];
  const contra = (exercise && exercise.contraindications) || [];
  if (!injuries.length || !contra.length) return false;
  const contraSet = new Set(contra);
  for (const tok of injuries) {
    if (contraSet.has(tok)) return true;
  }
  return false;
}

/**
 * evalDemographicBrake(exercise, user) -> 'block'|'regress'|'substitute'|null
 * Parses exercise.safetyOverrides rule keys against the user and returns the most
 * severe matching action (block > regress > substitute), or null.
 *
 * Supported rule grammar:
 *   'age>=65', 'age>=50'      — numeric age threshold
 *   'weight>120'              — strict weight threshold
 *   'weight>=100'             — inclusive weight threshold
 *   'weight100-120'           — weight in the inclusive band [100,120]
 *   'first-4-weeks'           — experience === 'beginner'
 *   <contraindication token>  — e.g. 'wrist_injury' — matched against user.injuries
 *
 * NOTE: this function does NOT consult safetyBrakesEnabled — the caller decides
 * whether to honor the returned action.
 */
export function evalDemographicBrake(exercise, user) {
  const overrides = (exercise && exercise.safetyOverrides) || {};
  const severity = { substitute: 1, regress: 2, block: 3 };
  let best = null;
  let bestRank = 0;

  for (const rule in overrides) {
    if (!Object.prototype.hasOwnProperty.call(overrides, rule)) continue;
    const action = overrides[rule];
    if (!(action in severity)) continue; // ignore unknown actions
    if (!ruleMatches(rule, user)) continue;
    const rank = severity[action];
    if (rank > bestRank) {
      bestRank = rank;
      best = action;
    }
  }
  return best;
}

// Decide whether a single safetyOverrides rule key applies to the user.
// Returns true if the rule fires. Unrecognised grammar → false (fail-open to the
// other brakes; injury contraindications are still caught by evalInjuryBlock).
function ruleMatches(rule, user) {
  const age = user && user.age;
  const weight = user && user.weight;
  const experience = user && user.experience;
  const injuries = (user && user.injuries) || [];

  switch (rule) {
    case 'age>=65': return typeof age === 'number' && age >= 65;
    case 'age>=50': return typeof age === 'number' && age >= 50;
    case 'weight>120': return typeof weight === 'number' && weight > 120;
    case 'weight>=100': return typeof weight === 'number' && weight >= 100;
    case 'weight100-120': return typeof weight === 'number' && weight >= 100 && weight <= 120;
    case 'first-4-weeks': return experience === 'beginner';
    default:
      // Treat any unrecognised key as a contraindication token: fire if the user
      // has that active injury. This lets per-exercise rows like
      // safetyOverrides:{ 'wrist_injury':'block' } work directly.
      return injuries.indexOf(rule) !== -1;
  }
}

// ─── PROGRESSION PREREQUISITES ───────────────────────────────────────────────

/**
 * meetsPrereq(exercise, levels) -> boolean
 * Every [group, min] in exercise.progression.prereq must be satisfied by
 * levels[group] >= min. Empty prereq → true. Non-progression (progression:{} or
 * no prereq) → true.
 */
export function meetsPrereq(exercise, levels) {
  const prog = (exercise && exercise.progression) || {};
  const prereq = prog.prereq || {};
  const have = levels || {};
  for (const group in prereq) {
    if (!Object.prototype.hasOwnProperty.call(prereq, group)) continue;
    const min = prereq[group];
    const cur = have[group];
    if (!(typeof cur === 'number' && cur >= min)) return false;
  }
  return true;
}

// ─── APPLY MODULATORS TO A PRESCRIPTION ──────────────────────────────────────

/**
 * applyModulators(prescription, exercise, user) -> newPrescription
 * Returns a NEW prescription object (never mutates the input).
 *   - If !user.safetyBrakesEnabled → return a shallow copy unchanged.
 *   - Else multiply sets by age × weight × experience × reentry setsMults
 *     (round, floor at 1); adjust reps by sex + age + weight reps deltas
 *     (clamp min/max ≥ 1); add age + weight + reentry rest deltas.
 *     unit/tempo/freq/raw carried through. A `_applied` array records each
 *     modifier that actually changed something (audit trail).
 */
export function applyModulators(prescription, exercise, user) {
  const base = prescription || {};
  // shallow copy preserving array references-by-value for reps/rest
  const out = {
    sets: base.sets,
    reps: Array.isArray(base.reps) ? base.reps.slice() : base.reps,
    unit: base.unit,
    tempo: base.tempo,
    rest: Array.isArray(base.rest) ? base.rest.slice() : base.rest,
    freq: base.freq,
    raw: base.raw
  };

  if (!user || !user.safetyBrakesEnabled) {
    return out; // brakes off → unchanged copy
  }

  const applied = [];

  const age = ageMultiplier(user.age);
  const wt = weightModifier(user.weight);
  const exp = experienceModifier(user.experience);
  const re = reentryModifier(user.reentryDaysAgo);

  // ── sets ──
  if (typeof out.sets === 'number') {
    const mult = age.setsMult * wt.setsMult * exp.setsMult * re.setsMult;
    if (mult !== 1) {
      const before = out.sets;
      out.sets = Math.max(1, Math.round(out.sets * mult));
      if (out.sets !== before) {
        if (age.setsMult !== 1) applied.push(`age sets ×${age.setsMult}`);
        if (wt.setsMult !== 1) applied.push(`weight sets ×${wt.setsMult}`);
        if (exp.setsMult !== 1) applied.push(`experience sets ×${exp.setsMult}`);
        if (re.setsMult !== 1) applied.push(`re-entry sets ×${re.setsMult}`);
      }
    }
  }

  // ── reps ──
  const sexDelta = sexAdjustment(user.sex, exercise);
  const repsDelta = sexDelta + age.repsDelta + wt.repsDelta;
  if (repsDelta !== 0 && Array.isArray(out.reps) && out.reps.length === 2) {
    out.reps = [
      clampInt(out.reps[0] + repsDelta, 1, Number.MAX_SAFE_INTEGER),
      clampInt(out.reps[1] + repsDelta, 1, Number.MAX_SAFE_INTEGER)
    ];
    if (sexDelta !== 0) applied.push(`sex reps ${sexDelta > 0 ? '+' : ''}${sexDelta}`);
    if (age.repsDelta !== 0) applied.push(`age reps ${age.repsDelta > 0 ? '+' : ''}${age.repsDelta}`);
    if (wt.repsDelta !== 0) applied.push(`weight reps ${wt.repsDelta > 0 ? '+' : ''}${wt.repsDelta}`);
  }

  // ── rest ──
  const restAdd = age.restAdd + wt.restAdd + re.restAdd;
  if (restAdd !== 0 && Array.isArray(out.rest) && out.rest.length === 2) {
    out.rest = [out.rest[0] + restAdd, out.rest[1] + restAdd];
    if (age.restAdd !== 0) applied.push(`age rest +${age.restAdd}s`);
    if (wt.restAdd !== 0) applied.push(`weight rest +${wt.restAdd}s`);
    if (re.restAdd !== 0) applied.push(`re-entry rest +${re.restAdd}s`);
  }

  out._applied = applied;
  return out;
}

// ─── FAST-DAY VOLUME CUT ─────────────────────────────────────────────────────

/**
 * fastDayModifier(prescription, archetype) -> newPrescription
 * On a water-fast day, resistance/skill work drops 20% of sets (floor 1).
 * Conditioning/recovery/rest/mobility archetypes are returned unchanged.
 * `archetype` is the exercise `type` token (compound/isolation/isometric/skill/
 * conditioning/mobility) or pattern equivalent.
 */
export function fastDayModifier(prescription, archetype) {
  const base = prescription || {};
  const out = {
    sets: base.sets,
    reps: Array.isArray(base.reps) ? base.reps.slice() : base.reps,
    unit: base.unit,
    tempo: base.tempo,
    rest: Array.isArray(base.rest) ? base.rest.slice() : base.rest,
    freq: base.freq,
    raw: base.raw
  };
  if (Array.isArray(base._applied)) out._applied = base._applied.slice();

  if (RECOVERY_TYPES.has(archetype)) {
    return out; // unchanged
  }
  if (RESISTANCE_TYPES.has(archetype)) {
    if (typeof out.sets === 'number') {
      out.sets = Math.max(1, Math.round(out.sets * 0.8));
    }
    out._applied = (out._applied || []).concat('fast-day -20% volume');
    return out;
  }
  // Unknown archetype → leave unchanged (conservative).
  return out;
}

// ─── PUSH:PULL CAP ───────────────────────────────────────────────────────────

/**
 * applyPushPullCap(items) -> items
 * items = [{ exercise, prescription, slot }]. Enforce push set count ≤ pull set
 * count (CLAUDE.md hard rule, never push-dominant). While pushSets > pullSets,
 * remove the push item with the lowest difficulty (exercise.difficulty ?? 3).
 * Returns a NEW filtered array; order of survivors is otherwise stable.
 */
export function applyPushPullCap(items) {
  if (!Array.isArray(items)) return [];
  let working = items.slice();

  const setsOf = (it) => {
    const p = it && it.prescription;
    return (p && typeof p.sets === 'number') ? p.sets : 0;
  };
  const isPush = (it) => it && it.exercise && it.exercise.pattern === 'push';
  const isPull = (it) => it && it.exercise && it.exercise.pattern === 'pull';
  const diffOf = (it) => {
    const d = it && it.exercise && it.exercise.difficulty;
    return (typeof d === 'number') ? d : 3;
  };

  const sumSets = (pred) =>
    working.reduce((acc, it) => acc + (pred(it) ? setsOf(it) : 0), 0);

  // Guard against pathological input (no push items but loop) — bounded by count.
  let guard = working.length + 1;
  while (sumSets(isPush) > sumSets(isPull) && guard-- > 0) {
    // find the lowest-difficulty push item
    let victimIdx = -1;
    let victimDiff = Infinity;
    for (let i = 0; i < working.length; i++) {
      if (!isPush(working[i])) continue;
      const d = diffOf(working[i]);
      if (d < victimDiff) {
        victimDiff = d;
        victimIdx = i;
      }
    }
    if (victimIdx === -1) break; // no push items left to drop
    working = working.slice(0, victimIdx).concat(working.slice(victimIdx + 1));
  }

  return working;
}

// ─── DELOAD ──────────────────────────────────────────────────────────────────

/**
 * evaluateDeload(user, deloadEveryWeeks) -> { due, reason }
 * Due if EITHER:
 *   - scheduled: daysSinceDeload / 7 >= deloadEveryWeeks (default 8 per library), OR
 *   - triggered: the last 2 logged sessions averaged < 60% of targetReps.
 * Pure — derives from user fields only.
 */
export function evaluateDeload(user, deloadEveryWeeks) {
  const everyWeeks = (typeof deloadEveryWeeks === 'number' && deloadEveryWeeks > 0)
    ? deloadEveryWeeks : 8;

  // scheduled
  const days = (user && typeof user.daysSinceDeload === 'number') ? user.daysSinceDeload : 0;
  if (days / 7 >= everyWeeks) {
    return { due: true, reason: `Scheduled: ${Math.floor(days / 7)} weeks since last deload (>= ${everyWeeks}).` };
  }

  // triggered — average completion of last 2 sessions across all exercises.
  // Collect every session record, sort by date desc, take last 2 by date.
  const hist = (user && user.completionHistory) || {};
  const sessions = [];
  for (const exId in hist) {
    if (!Object.prototype.hasOwnProperty.call(hist, exId)) continue;
    const recs = hist[exId] || [];
    for (const r of recs) sessions.push(r);
  }
  if (sessions.length >= 2) {
    sessions.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const last2 = sessions.slice(0, 2);
    let ratioSum = 0, n = 0;
    for (const r of last2) {
      const target = Number(r.targetReps);
      const actual = Number(r.actualReps);
      if (target > 0) { ratioSum += (actual / target); n++; }
    }
    if (n > 0 && (ratioSum / n) < 0.60) {
      return { due: true, reason: `Triggered: last ${n} sessions averaged ${Math.round((ratioSum / n) * 100)}% of target (< 60%).` };
    }
  }

  return { due: false, reason: 'No deload due.' };
}

// ─── PROGRESSION SUGGESTIONS ─────────────────────────────────────────────────

/**
 * evaluateProgressions(user, advanceCleanSessions) -> [{ group, fromLevel, toLevel, reason }]
 * For each group in user.levels, inspect that group's completionHistory keyed by
 * exercise ids that encode the group's current level. If the last
 * `advanceCleanSessions` sessions ALL hit actualReps >= 0.9*targetReps AND
 * formOk === true → suggest toLevel = fromLevel + 1. Suggest-only (the engine
 * never auto-applies). Returns [] if none qualify.
 *
 * Exercise ids encode group+level as '<group>-l<level>-...' (per exercise-db.js
 * id scheme). We match history keys whose id begins with '<group>-l<fromLevel>-'.
 */
export function evaluateProgressions(user, advanceCleanSessions) {
  const need = (typeof advanceCleanSessions === 'number' && advanceCleanSessions > 0)
    ? advanceCleanSessions : 3;
  const levels = (user && user.levels) || {};
  const hist = (user && user.completionHistory) || {};
  const out = [];

  for (const group in levels) {
    if (!Object.prototype.hasOwnProperty.call(levels, group)) continue;
    const fromLevel = levels[group];
    if (typeof fromLevel !== 'number') continue;

    // Gather sessions for any exercise id at this group's current level.
    const prefix = `${group}-l${fromLevel}-`;
    const sessions = [];
    for (const exId in hist) {
      if (!Object.prototype.hasOwnProperty.call(hist, exId)) continue;
      if (exId.indexOf(prefix) !== 0) continue;
      const recs = hist[exId] || [];
      for (const r of recs) sessions.push(r);
    }
    if (sessions.length < need) continue;

    // Most-recent `need` sessions by date.
    sessions.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const recent = sessions.slice(0, need);

    const allClean = recent.every((r) => {
      const target = Number(r.targetReps);
      const actual = Number(r.actualReps);
      const formOk = r.formOk === true;
      return target > 0 && actual >= 0.9 * target && formOk;
    });

    if (allClean) {
      out.push({
        group,
        fromLevel,
        toLevel: fromLevel + 1,
        reason: `Last ${need} sessions all >= 90% target with clean form.`
      });
    }
  }

  return out;
}
