// ─── WORKOUT ENGINE — Protocol Health (v9) ───────────────────────────────────
//
// STATUS: DORMANT. No consumer yet. Importing this module has zero side effects and
// cannot affect the live app. The legacy static workoutContent() in each plans/*.js
// remains the default and ONLY render path until the engine is wired behind an
// opt-in BETA toggle (default OFF) in a later stage, and the owner flips it on after
// an on-device smoke test.
//
// WHAT IT DOES: given a plan + a user state, generateWeek() assembles a personalised
// 7-day training week by reading the exercise database (plans/exercise-db.js) through
// the session templates (plans/session-templates.js), applying:
//   • progression levels (user's current level per group, prerequisites)
//   • safety: injury blocks (ALWAYS) + demographic brakes (only if user opts in;
//     AGRO defaults brakes OFF, other plans ON, per-plan toggle)
//   • per-plan prescription (sets/reps/tempo/rest) + universal modulators
//   • the muscle-focus / physique-goal customiser (engine-focus.js)
//   • push:pull ≤ 1:1 cap, fast-day volume reduction, deload week, volume caps
// Auto-progression is SUGGEST-ONLY — the engine never changes a user's level itself.
//
// Pure orchestration: no DOM, no globals. Everything comes in via the `user` argument.

import { EXERCISE_DB, PROGRESSION_GROUPS } from '../plans/exercise-db.js';
import { SESSION_TEMPLATES, ARCHETYPE_SLOTS, VOLUME_CAPS } from '../plans/session-templates.js';
import * as H from './engine-helpers.js';
import * as F from './engine-focus.js';

// ─── user state contract (documented for callers) ────────────────────────────
// {
//   plan, levels:{[group]:int}, age:int, weight:kg, sex:'male'|'female',
//   experience:'beginner'|'intermediate'|'returning', reentryDaysAgo:int,
//   daysSinceDeload:int, completionHistory:{[exId]:[{date,actualReps,targetReps,formOk}]},
//   focus:{muscles:[],regions:[],goalPreset:null}, safetyBrakesEnabled:bool,
//   injuries:[tokens], medicalClearance:bool
// }
// Missing fields are defaulted by normaliseUser() so partial states are safe.

function normaliseUser(user = {}) {
  return {
    plan: user.plan || 'cut',
    levels: user.levels || {},
    age: Number.isFinite(user.age) ? user.age : 30,
    weight: Number.isFinite(user.weight) ? user.weight : 80,
    sex: user.sex === 'female' ? 'female' : 'male',
    experience: user.experience || 'intermediate',
    reentryDaysAgo: user.reentryDaysAgo || 0,
    daysSinceDeload: user.daysSinceDeload || 0,
    completionHistory: user.completionHistory || {},
    focus: user.focus || { muscles: [], regions: [], goalPreset: null },
    // AGRO defaults brakes OFF; other plans ON; explicit value always wins.
    safetyBrakesEnabled: (typeof user.safetyBrakesEnabled === 'boolean')
      ? user.safetyBrakesEnabled
      : (user.plan !== 'agro'),
    injuries: user.injuries || [],
    medicalClearance: user.medicalClearance !== false
  };
}

const isGroupSlot = s => PROGRESSION_GROUPS.includes(s);
const lowestLevel = list => list.reduce((m, e) => (m === null || e.level < m ? e.level : m), null);

// Resolve the user's working level for a progression group. If unset, default to the
// lowest level that the plan actually prescribes (the entry point for that plan).
function userLevel(group, user) {
  if (Number.isFinite(user.levels[group])) return user.levels[group];
  const pool = EXERCISE_DB.filter(e => e.progressionGroup === group && e.prescriptions[user.plan]);
  const lo = lowestLevel(pool);
  return lo === null ? 0 : lo;
}

// Candidate pool for one slot, after eligibility/safety/prereq filtering.
function candidatesForSlot(slot, user, resolvedFocus) {
  let pool;
  if (isGroupSlot(slot)) {
    const lvl = userLevel(slot, user);
    pool = EXERCISE_DB.filter(e =>
      e.progressionGroup === slot &&
      e.prescriptions[user.plan] &&
      e.level <= lvl &&
      H.meetsPrereq(e, user.levels));
  } else if (slot === 'skill') {
    pool = EXERCISE_DB.filter(e =>
      e.progressionGroup && e.progressionGroup.startsWith('skill_') &&
      e.prescriptions[user.plan] &&
      e.level <= userLevel(e.progressionGroup, user) &&
      H.meetsPrereq(e, user.levels));
  } else if (slot.startsWith('pattern:')) {
    const patt = slot.slice('pattern:'.length);
    pool = EXERCISE_DB.filter(e => e.pattern === patt && e.prescriptions[user.plan]);
  } else if (slot.startsWith('accessory:')) {
    const region = slot.slice('accessory:'.length);
    pool = EXERCISE_DB.filter(e => e.region === region && !e.progressionGroup && e.prescriptions[user.plan]);
  } else {
    pool = [];
  }
  // ALWAYS exclude active-injury contraindications.
  pool = pool.filter(e => !H.evalInjuryBlock(e, user));
  // Demographic brakes only when the user has them enabled.
  if (user.safetyBrakesEnabled) {
    pool = pool.filter(e => H.evalDemographicBrake(e, user) !== 'block');
  }
  return F.applyFocus(pool, user.focus); // attaches focusScore, sorts by it (stable)
}

// Pick the best exercise for a progression-group slot: prefer the highest level the
// user has earned; break ties by focus score. For pattern/accessory slots, the
// focus-ranked top item wins.
function pickForSlot(slot, user, used) {
  const cands = candidatesForSlot(slot, user).filter(e => !used.has(e.id));
  if (!cands.length) return null;
  if (isGroupSlot(slot)) {
    const maxLvl = cands.reduce((m, e) => Math.max(m, e.level), -Infinity);
    const top = cands.filter(e => e.level === maxLvl);
    return top.sort((a, b) => (b.focusScore || 0) - (a.focusScore || 0))[0];
  }
  return cands[0]; // already focus-sorted
}

function buildPrescription(exercise, user, fasted, deloadActive, resolvedFocus) {
  let px = { ...exercise.prescriptions[user.plan] };
  px._applied = [];
  px = H.applyModulators(px, exercise, user);
  if (fasted) px = H.fastDayModifier(px, 'resistance');
  if (resolvedFocus && (resolvedFocus.muscles.size || resolvedFocus.regions.size))
    px = F.focusRepBiasAdjust(px, resolvedFocus);
  if (deloadActive) {
    px = { ...px, sets: Math.max(1, Math.round((px.sets || 1) * 0.5)) };
    px._applied = [...(px._applied || []), 'deload -50% volume'];
  }
  return px;
}

export function generateSession(plan, dow, user, opts = {}) {
  user = normaliseUser({ ...user, plan });
  const tmpl = SESSION_TEMPLATES[plan];
  if (!tmpl) return { plan, dow, error: 'no template for plan' };
  const day = tmpl.weekly.find(d => d.dow === dow) || tmpl.weekly[dow];
  const caps = VOLUME_CAPS[plan] || { maxExercisesPerSession: 12 };
  const base = { plan, dow, name: day.name, archetype: day.archetype, fasted: !!day.fasted,
                 isDeload: !!opts.deloadActive, exercises: [], notes: [] };
  if (day.archetype === 'rest') { base.notes.push('Rest day — optional walk + mobility.'); return base; }

  const resolvedFocus = F.resolveFocus(user.focus);
  const slots = ARCHETYPE_SLOTS[day.archetype] || [];
  const used = new Set();
  let items = [];

  for (const { slot, count } of slots) {
    for (let i = 0; i < (count || 1); i++) {
      const ex = pickForSlot(slot, user, used);
      if (!ex) continue;
      used.add(ex.id);
      const px = buildPrescription(ex, user, base.fasted, base.isDeload, resolvedFocus);
      items.push({ exercise: ex, prescription: px, slot });
    }
  }

  // optional focus accessory (volumeBias > 1 and room under the cap)
  if (resolvedFocus.volumeBias > 1 && items.length < caps.maxExercisesPerSession) {
    const acc = candidatesForSlot('pattern:mobility', user)
      .concat(EXERCISE_DB.filter(e => resolvedFocus.regions.has(e.region) && !e.progressionGroup && e.prescriptions[plan]))
      .filter(e => !used.has(e.id) && (e.focusScore || F.focusScore(e, resolvedFocus) > 0));
    if (acc.length) {
      const a = acc.sort((x, y) => F.focusScore(y, resolvedFocus) - F.focusScore(x, resolvedFocus))[0];
      used.add(a.id);
      items.push({ exercise: a, prescription: buildPrescription(a, user, base.fasted, base.isDeload, resolvedFocus), slot: 'focus-accessory' });
      base.notes.push('Added a focus accessory for ' + [...resolvedFocus.regions, ...resolvedFocus.muscles].slice(0, 3).join(', ') + '.');
    }
  }

  // push:pull ≤ 1:1 cap
  const before = items.length;
  items = H.applyPushPullCap(items);
  if (items.length < before) base.notes.push('Trimmed a push exercise to keep push:pull ≤ 1:1.');

  // volume cap on exercise count
  if (items.length > caps.maxExercisesPerSession) {
    items = items.slice(0, caps.maxExercisesPerSession);
    base.notes.push('Capped at ' + caps.maxExercisesPerSession + ' exercises for ' + plan + '.');
  }

  base.exercises = items.map(({ exercise, prescription, slot }) => ({
    id: exercise.id,
    name: exercise.name,
    group: exercise.progressionGroup,
    level: exercise.level,
    region: exercise.region,
    sets: prescription.sets,
    reps: prescription.reps,
    unit: prescription.unit,
    tempo: prescription.tempo,
    rest: prescription.rest,
    raw: prescription.raw,
    slot,
    focusScore: exercise.focusScore || 0,
    rationale: prescription._applied || []
  }));
  if (base.isDeload) base.notes.push('Deload week — volume reduced ~50%, frequency held.');
  if (base.fasted) base.notes.push('Fasted session — keep intensity ~70-80%.');
  return base;
}

export function generateWeek(plan, user) {
  user = normaliseUser({ ...user, plan });
  if (!user.medicalClearance)
    return { plan, eligible: false, reason: 'Medical disclaimer not accepted.', days: [] };
  const elig = H.isPlanEligible(plan, user);
  if (!elig.eligible)
    return { plan, eligible: false, reason: elig.reason, days: [] };
  const caps = VOLUME_CAPS[plan] || {};
  const deload = H.evaluateDeload(user, caps.deloadEveryWeeks || 8);
  const days = [0, 1, 2, 3, 4, 5, 6].map(dow => generateSession(plan, dow, user, { deloadActive: deload.due }));
  const suggestions = H.evaluateProgressions(user, caps.advanceCleanSessions || 3);
  return { plan, eligible: true, deload, suggestions, days };
}

// Human-readable audit of a session (for the BETA UI + debugging).
export function explainSession(session) {
  if (!session || session.error) return '(no session)';
  const lines = [`${session.name} [${session.archetype}]${session.fasted ? ' · fasted' : ''}${session.isDeload ? ' · DELOAD' : ''}`];
  for (const e of session.exercises) {
    const reps = Array.isArray(e.reps) ? (e.reps[0] === e.reps[1] ? e.reps[0] : e.reps.join('-')) : e.reps;
    lines.push(`  • ${e.name} — ${e.sets}×${reps} ${e.unit}${e.rationale.length ? '  [' + e.rationale.join('; ') + ']' : ''}`);
  }
  for (const n of session.notes) lines.push(`  ↳ ${n}`);
  return lines.join('\n');
}
