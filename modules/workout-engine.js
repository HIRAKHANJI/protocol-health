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

const isGroupSlot = s => typeof s === 'string' && PROGRESSION_GROUPS.includes(s);
const lowestLevel = list => list.reduce((m, e) => (m === null || e.level < m ? e.level : m), null);
const hasRx = (e, plan) => e.prescriptions && e.prescriptions[plan];

// Resolve the user's working level for a progression group. If unset, default to the
// lowest level that the plan actually prescribes (the entry point for that plan).
function userLevel(group, user) {
  if (Number.isFinite(user.levels[group])) return user.levels[group];
  const pool = EXERCISE_DB.filter(e => e.progressionGroup === group && hasRx(e, user.plan));
  const lo = lowestLevel(pool);
  return lo === null ? 0 : lo;
}

// Which session block a slot belongs to. Drives ordering, the working-exercise cap
// (warmup/cooldown are exempt), and the renderer's block grouping.
function slotKind(slot) {
  if (slot === 'warmup') return 'warmup';
  if (slot === 'cooldown') return 'cooldown';
  if (slot === 'conditioning') return 'conditioning';
  if (slot === 'recovery-main') return 'recovery';
  if (slot === 'skill') return 'skill';
  if (slot === 'core' || slot === 'chair_core') return 'core';
  if (typeof slot === 'string' && slot.startsWith('skill_')) return 'skill';
  if (typeof slot === 'string' && (slot.startsWith('accessory:') || slot.startsWith('pattern:') ||
      slot === 'emphasis' || slot === 'all-round-fill' || slot === 'focus-accessory')) return 'accessory';
  return 'main';
}
const isWorking = it => { const k = it.kind || slotKind(it.slot); return k !== 'warmup' && k !== 'cooldown'; };

// Does exercise `e` qualify for an accessory:<region> slot? Regions extend beyond the
// REGIONS enum to a few practical buckets the real plans use (balance, wrist, pull, etc.).
function matchesAccessory(e, region) {
  const mus = e.muscles ? [...(e.muscles.primary || []), ...(e.muscles.secondary || [])] : [];
  switch (region) {
    case 'balance':     return /balance|single-leg-stand|heel-to-toe|weight-shift|\btree\b/.test(e.id);
    case 'wrist':       return /wrist/.test(e.id);
    case 'pull':        return e.pattern === 'pull';
    case 'calves':      return mus.includes('calves') || /calf|heel-rais/.test(e.id);
    case 'hamstrings':  return mus.includes('hamstrings');
    case 'arms':        return e.region === 'arms' || mus.some(m => m === 'biceps' || m === 'triceps');
    case 'shoulders':   return e.region === 'shoulders' || mus.some(m => m === 'posterior_deltoid' || m === 'lateral_deltoid' || m === 'anterior_deltoid');
    case 'mobility':    return e.pattern === 'mobility';
    default:            return e.region === region;
  }
}

// Candidate pool for one slot, after eligibility/safety/prereq filtering, focus-ranked.
function candidatesForSlot(slot, user) {
  const plan = user.plan;
  let pool = [];
  if (slot === 'warmup') {
    pool = EXERCISE_DB.filter(e => e.id.startsWith('warmup-'));
    if (!pool.length) pool = EXERCISE_DB.filter(e => e.pattern === 'mobility' && !e.id.startsWith('cooldown-'));
  } else if (slot === 'cooldown') {
    pool = EXERCISE_DB.filter(e => e.id.startsWith('cooldown-'));
    if (!pool.length) pool = EXERCISE_DB.filter(e => e.pattern === 'mobility' && !e.id.startsWith('warmup-'));
  } else if (slot === 'recovery-main') {
    pool = EXERCISE_DB.filter(e => e.pattern === 'mobility' && !e.id.startsWith('warmup-') && !e.id.startsWith('cooldown-') && hasRx(e, plan));
    if (!pool.length) pool = EXERCISE_DB.filter(e => e.pattern === 'mobility' && !e.id.startsWith('warmup-') && !e.id.startsWith('cooldown-'));
  } else if (slot === 'conditioning') {
    pool = EXERCISE_DB.filter(e => e.pattern === 'conditioning' && hasRx(e, plan));
    if (!pool.length) pool = EXERCISE_DB.filter(e => e.pattern === 'conditioning');
  } else if (slot === 'skill') {
    pool = EXERCISE_DB.filter(e => e.progressionGroup && e.progressionGroup.startsWith('skill_') &&
      hasRx(e, plan) && e.level <= userLevel(e.progressionGroup, user) && H.meetsPrereq(e, user.levels));
  } else if (isGroupSlot(slot)) {
    const lvl = userLevel(slot, user);
    pool = EXERCISE_DB.filter(e => e.progressionGroup === slot && hasRx(e, plan) && e.level <= lvl && H.meetsPrereq(e, user.levels));
  } else if (typeof slot === 'string' && slot.startsWith('accessory:')) {
    const region = slot.slice('accessory:'.length);
    pool = EXERCISE_DB.filter(e => hasRx(e, plan) && matchesAccessory(e, region));
    const nonProg = pool.filter(e => !e.progressionGroup);
    if (nonProg.length) pool = nonProg; // prefer true accessories over progression moves
  } else if (typeof slot === 'string' && slot.startsWith('pattern:')) {
    const patt = slot.slice('pattern:'.length);
    pool = EXERCISE_DB.filter(e => e.pattern === patt && hasRx(e, plan));
  }
  pool = pool.filter(e => !H.evalInjuryBlock(e, user)); // active-injury blocks ALWAYS apply
  if (user.safetyBrakesEnabled) pool = pool.filter(e => H.evalDemographicBrake(e, user) !== 'block');
  return F.applyFocus(pool, user.focus); // attaches focusScore, stable-sorts by it
}

// Pick up to `n` distinct exercises for a slot (skipping ids already used this session).
// For progression mains, prefer the user's highest level first, then the next levels down
// (so a `push×2` slot yields two different push variants — like the real plans), focus
// breaking ties. For everything else, take the focus-ranked order.
function pickN(slot, user, used, n) {
  let cands = candidatesForSlot(slot, user).filter(e => !used.has(e.id));
  if (isGroupSlot(slot) && !slot.startsWith('skill_')) {
    cands = cands.slice().sort((a, b) => (b.level - a.level) || ((b.focusScore || 0) - (a.focusScore || 0)));
  }
  return cands.slice(0, Math.max(1, n || 1));
}

// A light default dose for warmup/cooldown (and a fallback for any exercise lacking a
// per-plan prescription, e.g. universal mobility moves).
function basePrescription(exercise, plan, kind) {
  if (kind === 'warmup' || kind === 'cooldown') {
    return { sets: 1, reps: [1, 1], unit: 'round', tempo: 'easy', rest: [0, 0], raw: '', _applied: [] };
  }
  let src = exercise.prescriptions && exercise.prescriptions[plan];
  if (!src) for (const p of ['cut', 'bulk', 'maintenance', 'agro', 'lite']) { if (exercise.prescriptions && exercise.prescriptions[p]) { src = exercise.prescriptions[p]; break; } }
  if (!src) src = { sets: 2, reps: [8, 12], unit: 'reps', tempo: 'normal', rest: [45, 60], raw: '' };
  return { ...src, _applied: [] };
}

function buildPrescription(exercise, user, fasted, deloadActive, resolvedFocus, kind) {
  let px = basePrescription(exercise, user.plan, kind);
  if (kind !== 'warmup' && kind !== 'cooldown') {
    px = H.applyModulators(px, exercise, user);
    // v8.10.5 audit fix: pass the exercise's actual type — the literal
    // 'resistance' matched neither RESISTANCE_TYPES nor RECOVERY_TYPES in
    // fastDayModifier, so the -20% fast-day volume cut was a silent no-op.
    if (fasted) px = H.fastDayModifier(px, exercise.type);
    // repBias applies to resistance work only (mains + accessories), and now fires whenever
    // a bias is set — fixing the 'strength' goal whose bias was silently dropped before.
    if (resolvedFocus && resolvedFocus.repBias != null && (kind === 'main' || kind === 'accessory'))
      px = F.focusRepBiasAdjust(px, resolvedFocus);
    if (deloadActive) {
      px = { ...px, sets: Math.max(1, Math.round((px.sets || 1) * 0.5)) };
      px._applied = [...(px._applied || []), 'deload -50% volume'];
    }
  }
  return px;
}

// Shared formatter so every code path emits identical exercise entries.
// `kind` drives block grouping in the renderer + the working-exercise cap.
function formatEntry(exercise, prescription, slot, kind, block) {
  return {
    id: exercise.id,
    name: exercise.name,
    group: exercise.progressionGroup,
    level: exercise.level,
    region: exercise.region,
    pattern: exercise.pattern,
    kind: kind || slotKind(slot),
    block: block || null,
    sets: prescription.sets,
    reps: prescription.reps,
    unit: prescription.unit,
    tempo: prescription.tempo,
    rest: prescription.rest,
    raw: prescription.raw,
    slot,
    focusScore: exercise.focusScore || 0,
    rationale: prescription._applied || []
  };
}

// Pick the user's best exercise for a progression group (highest unlocked level).
function pickGroupExercise(group, user) {
  const cands = candidatesForSlot(group, user);
  if (!cands.length) return null;
  const maxLvl = cands.reduce((m, e) => Math.max(m, e.level), -Infinity);
  return cands.filter(e => e.level === maxLvl)[0];
}

const workingCount = ex => (ex || []).filter(isWorking).length;

// ─── generateSession — build ONE complete session ────────────────────────────
// Fills the archetype's full 7-block recipe (warmup → mains → accessory → skill →
// core → conditioning → cooldown), then trims ACCESSORY first if the plan's
// working-exercise cap is exceeded — warmup/cooldown/mains/core/skill/conditioning
// are never trimmed. This is what makes sessions full (8-15 ex) instead of 3.
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
  const slots = (Array.isArray(day.slots) && day.slots.length) ? day.slots : (ARCHETYPE_SLOTS[day.archetype] || []);
  const used = new Set();
  let items = [];

  for (const { slot, count, block } of slots) {
    const kind = slotKind(slot);
    for (const ex of pickN(slot, user, used, count || 1)) {
      used.add(ex.id);
      const px = buildPrescription(ex, user, base.fasted, base.isDeload, resolvedFocus, kind);
      items.push({ exercise: ex, prescription: px, slot, kind, block });
    }
  }

  // Working-exercise cap: trim ACCESSORY (lowest focusScore) first; never touch
  // warmup/cooldown/mains/core/skill/conditioning/recovery.
  let work = items.filter(isWorking).length;
  if (work > caps.maxExercisesPerSession) {
    const removable = items.filter(it => it.kind === 'accessory').sort((a, b) => (a.exercise.focusScore || 0) - (b.exercise.focusScore || 0));
    for (const it of removable) {
      if (work <= caps.maxExercisesPerSession) break;
      items = items.filter(x => x !== it); work--;
    }
    base.notes.push('Trimmed accessories to the ' + plan + ' working-exercise cap (' + caps.maxExercisesPerSession + ').');
  }

  base.exercises = items.map(({ exercise, prescription, slot, kind, block }) => formatEntry(exercise, prescription, slot, kind, block));
  if (base.isDeload) base.notes.push('Deload week — volume reduced ~50%, frequency held.');
  if (base.fasted) base.notes.push('Fasted session — keep intensity ~70-80%.');
  return base;
}

// ─── balanceWeek (All-Round Strength coverage guarantee) ─────────────────────
// With the rich archetype recipes, every pattern is usually already trained on
// multiple days — but this guarantees it: if a major pattern is on < 2 days, add
// the user's-level move to an under-filled training day. Additive only; never
// removes a base exercise. Pull is topped up before push-side adds (weekly §15).
function balanceWeek(days, plan, user, resolved, caps) {
  const maxWork = (caps && caps.maxExercisesPerSession) || 12;
  const isStrengthDay = d => d && d.archetype && !['rest', 'recovery', 'conditioning', 'mobility'].includes(d.archetype) && Array.isArray(d.exercises);
  const daysWith = g => days.filter(d => (d.exercises || []).some(e => e.group === g)).length;
  const weekSets = patt => days.reduce((s, d) => s + (d.exercises || []).filter(e => e.pattern === patt).reduce((t, e) => t + (e.sets || 0), 0), 0);

  function addGroup(g, ex) {
    const cand = days
      .filter(isStrengthDay)
      .filter(d => !d.exercises.some(e => e.group === g) && workingCount(d.exercises) < maxWork)
      .sort((a, b) => a.exercises.length - b.exercises.length)[0];
    if (!cand) return false;
    const px = buildPrescription(ex, user, cand.fasted, cand.isDeload, resolved, slotKind(g));
    cand.exercises.push(formatEntry(ex, px, 'all-round-fill', slotKind(g), 'PM'));
    cand.notes.push('All-Round: added ' + ex.name + ' so ' + g + ' is trained this week.');
    return true;
  }

  for (const g of ['squat', 'hinge', 'core']) {
    const ex = pickGroupExercise(g, user); if (!ex) continue;
    let have = daysWith(g); while (have < 2 && addGroup(g, ex)) have++;
  }
  for (const g of ['push', 'shoulder']) {
    const ex = pickGroupExercise(g, user); if (!ex) continue;
    let have = daysWith(g);
    while (have < 2) {
      const addSets = (ex.prescriptions[plan] && ex.prescriptions[plan].sets) || 3;
      if (weekSets('push') + addSets > weekSets('pull')) {
        const pullEx = pickGroupExercise('pull', user);
        if (!pullEx || !addGroup('pull', pullEx)) break;
      }
      if (!addGroup(g, ex)) break;
      have++;
    }
  }
  { const ex = pickGroupExercise('pull', user); if (ex) { let have = daysWith('pull'); while (have < 2 && addGroup('pull', ex)) have++; } }
  return days;
}

// ─── addEmphasis — the goal post-pass (PURELY ADDITIVE) ──────────────────────
// For region/aesthetic goals, append extra accessory volume to the focus regions on
// training days that have room — rotating through the goal's regions, deduped across
// the week, capped by the plan. Never removes a base movement (the structural fix for
// "a goal dropped my other body parts"). Balanced + functional skip this (functional
// uses balanceWeek + functionalBias scoring; strength uses repBias on mains only).
function addEmphasis(days, plan, user, resolved, caps) {
  if (!resolved || resolved.functionalBias) return days;
  const regions = [...resolved.regions];
  if (!regions.length) return days; // balanced / strength (no region emphasis)
  const maxWork = caps.maxExercisesPerSession || 12;
  const extra = Math.max(1, Math.round((resolved.volumeBias - 1) / 0.1)); // 1.15→2, 1.2→2, 1.25→3
  const usedIds = new Set();
  for (const d of days) for (const e of (d.exercises || [])) usedIds.add(e.id);
  const trainingDays = days.filter(d => d.archetype && !['rest', 'recovery', 'conditioning', 'mobility'].includes(d.archetype) && Array.isArray(d.exercises));
  if (!trainingDays.length) return days;
  let added = 0, ri = 0, guard = 0;
  while (added < extra && guard++ < 40) {
    const region = regions[ri % regions.length]; ri++;
    const d = trainingDays.filter(x => workingCount(x.exercises) < maxWork).sort((a, b) => a.exercises.length - b.exercises.length)[0];
    if (!d) break;
    const cands = candidatesForSlot('accessory:' + region, user).filter(e => !usedIds.has(e.id));
    if (!cands.length) { if (guard >= regions.length && added === 0) break; continue; }
    const ex = cands[0]; usedIds.add(ex.id);
    const px = buildPrescription(ex, user, d.fasted, d.isDeload, resolved, 'accessory');
    d.exercises.push(formatEntry(ex, px, 'emphasis', 'accessory', 'PM'));
    d.notes.push('Goal emphasis: added ' + ex.name + ' (' + region + ').');
    added++;
  }
  return days;
}

// ─── enforceWeeklyPushPull — weekly push:pull ≤ 1:1 (CLAUDE.md §15 hard rule) ─
// Trims only push-pattern ACCESSORIES (lowest focusScore first), never mains — so
// full-body coverage is preserved while the weekly ratio stays pull-dominant/balanced.
function enforceWeeklyPushPull(days) {
  const weekSets = patt => days.reduce((s, d) => s + (d.exercises || []).filter(e => e.pattern === patt).reduce((t, e) => t + (e.sets || 0), 0), 0);
  let push = weekSets('push'), pull = weekSets('pull');
  if (push <= pull) return days;
  const pushAcc = [];
  for (const d of days) for (const e of (d.exercises || [])) if (e.pattern === 'push' && e.kind === 'accessory') pushAcc.push({ d, e });
  pushAcc.sort((a, b) => (a.e.focusScore || 0) - (b.e.focusScore || 0));
  for (const { d, e } of pushAcc) {
    if (push <= pull) break;
    d.exercises = d.exercises.filter(x => x !== e); push -= (e.sets || 0);
    d.notes.push('Trimmed ' + e.name + ' to keep weekly push:pull ≤ 1:1.');
  }
  return days;
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
  const resolved = F.resolveFocus(user.focus);
  let days = [0, 1, 2, 3, 4, 5, 6].map(dow => generateSession(plan, dow, user, { deloadActive: deload.due }));
  if (resolved.functionalBias) days = balanceWeek(days, plan, user, resolved, caps); // All-Round coverage
  days = addEmphasis(days, plan, user, resolved, caps);                              // goal emphasis (additive)
  days = enforceWeeklyPushPull(days);                                                // §15 weekly guard
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
