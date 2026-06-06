// ─── ENGINE FOCUS — Muscle-focus / physique-goal customiser (v9, Phase 1) ────
//
// STATUS: DORMANT. This module has NO consumer yet. Importing it has zero side
// effects and cannot touch the live app. It is a layer for the v9 Workout Engine
// (modules/workout-engine.js, not yet built) to bias exercise selection toward a
// user's chosen muscle groups or a physique-goal preset WITHIN their active plan.
//
// PURE: every export is a pure function — no DOM, no globals, no localStorage, no
// mutation of its inputs. It operates on exercise objects shaped by plans/exercise-db.js
// (`muscles:{primary:[tokens],secondary:[tokens]}` + `region`, using the MUSCLES/REGIONS
// vocab defined there).
//
// HOW IT FITS THE MISSION (CLAUDE.md §1): the foundation is combat-sports capability +
// functional strength + bodyweight-first. The presets below reflect that — an
// "Athletic / Combat" preset biasing core/legs/shoulders (striking + conditioning),
// a "V-Taper" aesthetic preset, plus neutral strength/balanced options.
//
// focusConfig shape (from user settings):
//   { muscles: string[] (MUSCLES tokens), regions: string[] (REGIONS), goalPreset: string|null }
//
// ─────────────────────────────────────────────────────────────────────────────

// Physique-goal presets. Keys + shape are stable; preset contents use the
// REGIONS/MUSCLES vocabulary from plans/exercise-db.js.
export const GOAL_PRESETS = {
  balanced:   { label: 'Balanced',           regions: [],                                       muscles: [],                                                                  volumeBias: 1.0,  repBias: null,  functionalBias: false },
  functional: { label: 'All-Round Strength', regions: ['chest', 'back', 'shoulders', 'legs', 'glutes', 'core'], muscles: [],                                              volumeBias: 1.0,  repBias: null,  functionalBias: true  },
  vtaper:    { label: 'V-Taper',           regions: ['shoulders', 'back'],                    muscles: ['latissimus_dorsi', 'posterior_deltoid', 'lateral_deltoid'],        volumeBias: 1.25, repBias: 'mid' },
  athletic:  { label: 'Athletic / Combat', regions: ['core', 'legs', 'shoulders'],            muscles: ['rectus_abdominis', 'gluteus_maximus', 'anterior_deltoid'],         volumeBias: 1.15, repBias: 'mid' },
  strength:  { label: 'Strength bias',      regions: [],                                       muscles: [],                                                                  volumeBias: 1.0,  repBias: 'low' },
  upperbody: { label: 'Upper-body focus',   regions: ['chest', 'back', 'shoulders', 'arms'],   muscles: [],                                                                  volumeBias: 1.2,  repBias: 'mid' },
  lowerbody: { label: 'Lower-body focus',   regions: ['legs', 'glutes'],                       muscles: [],                                                                  volumeBias: 1.2,  repBias: 'mid' },
  core:      { label: 'Core / midsection',  regions: ['core'],                                 muscles: ['rectus_abdominis', 'obliques', 'transverse_abdominis'],            volumeBias: 1.2,  repBias: 'mid' }
};

// ─── PLAN_PRESETS — which goal presets each plan exposes ──────────────────────
// Plan-aware: a plan only offers presets that suit its purpose. LITE is catered
// (chair-based, elderly/limited-mobility) so it gets only the neutral 'balanced'.
// MAINTENANCE is moderate/catered so it gets a restrained subset. CUT/BULK/AGRO are
// the functional-strength plans and get the full range, led by 'functional'
// (All-Round Strength) — the recommended default for whole-body development.
// 'functional' is listed first (after balanced) so it surfaces prominently.
export const PLAN_PRESETS = {
  lite:        ['balanced'],
  maintenance: ['balanced', 'functional', 'core'],
  cut:         ['balanced', 'functional', 'athletic', 'upperbody', 'lowerbody', 'core', 'strength', 'vtaper'],
  bulk:        ['balanced', 'functional', 'athletic', 'upperbody', 'lowerbody', 'core', 'strength', 'vtaper'],
  agro:        ['balanced', 'functional', 'athletic', 'upperbody', 'lowerbody', 'core', 'strength', 'vtaper']
};
// Returns the ordered list of preset keys available for a plan ('default' aliases lite).
export function presetsForPlan(plan) {
  const key = (plan === 'default' || !plan) ? 'lite' : plan;
  return PLAN_PRESETS[key] || PLAN_PRESETS.cut;
}
// True if a preset key is valid for a plan (used to sanitise stored focus).
export function isPresetAllowed(plan, presetKey) {
  if (!presetKey || presetKey === 'balanced') return true;
  return presetsForPlan(plan).includes(presetKey);
}

// ─── resolveFocus ────────────────────────────────────────────────────────────
// Merge the goalPreset (if any) with the user's explicit muscles[]/regions[] (union).
// volumeBias comes from the preset (default 1.0). repBias from the preset (default null).
// null/empty focusConfig → neutral: empty sets, volumeBias 1.0, repBias null.
export function resolveFocus(focusConfig) {
  const muscles = new Set();
  const regions = new Set();
  let volumeBias = 1.0;
  let repBias = null;
  let functionalBias = false;

  if (!focusConfig || typeof focusConfig !== 'object') {
    return { muscles, regions, volumeBias, repBias, functionalBias };
  }

  const preset = focusConfig.goalPreset ? GOAL_PRESETS[focusConfig.goalPreset] : null;
  if (preset) {
    for (const m of (preset.muscles || [])) muscles.add(m);
    for (const r of (preset.regions || [])) regions.add(r);
    if (typeof preset.volumeBias === 'number') volumeBias = preset.volumeBias;
    repBias = preset.repBias != null ? preset.repBias : null;
    functionalBias = !!preset.functionalBias;
  }

  if (Array.isArray(focusConfig.muscles)) for (const m of focusConfig.muscles) if (m) muscles.add(m);
  if (Array.isArray(focusConfig.regions)) for (const r of focusConfig.regions) if (r) regions.add(r);

  return { muscles, regions, volumeBias, repBias, functionalBias };
}

// ─── focusScore ──────────────────────────────────────────────────────────────
// 0 if there is no active focus. Otherwise:
//   (primary muscles in focus)*2 + (secondary muscles in focus)*1 + (region match ? 3 : 0)
// Higher = better match for the user's goal.
export function focusScore(exercise, resolved) {
  if (!exercise || !resolved) return 0;
  if (resolved.muscles.size === 0 && resolved.regions.size === 0 && !resolved.functionalBias) return 0;

  const muscles = exercise.muscles || {};
  const primary = Array.isArray(muscles.primary) ? muscles.primary : [];
  const secondary = Array.isArray(muscles.secondary) ? muscles.secondary : [];

  let score = 0;
  for (const m of primary) if (resolved.muscles.has(m)) score += 2;
  for (const m of secondary) if (resolved.muscles.has(m)) score += 1;
  if (exercise.region && resolved.regions.has(exercise.region)) score += 3;

  // All-Round Strength: bias toward functional compound work + calisthenics
  // progression movements (across whatever regions the slot offers), so the week
  // builds the whole body through strength-driving exercises rather than isolation.
  if (resolved.functionalBias) {
    if (exercise.type === 'compound') score += 2;
    if (exercise.progressionGroup) score += 2;
  }

  return score;
}

// ─── applyFocus ──────────────────────────────────────────────────────────────
// Rank candidate exercises by focusScore (descending), stable for ties (original
// order preserved). Returns a NEW array of shallow-cloned exercises, each with a
// `focusScore` number attached. With no active focus, order is unchanged and every
// element carries focusScore 0.
export function applyFocus(candidates, focusConfig) {
  if (!Array.isArray(candidates)) return [];
  const resolved = resolveFocus(focusConfig);

  const scored = candidates.map((ex, i) => ({
    ex: { ...ex, focusScore: focusScore(ex, resolved) },
    i
  }));

  scored.sort((a, b) => (b.ex.focusScore - a.ex.focusScore) || (a.i - b.i));

  return scored.map(s => s.ex);
}

// ─── focusRepBiasAdjust ──────────────────────────────────────────────────────
// Optional rep-range nudge driven by resolved.repBias:
//   'low'  → shift reps toward the min (strength emphasis)
//   'high' → shift reps toward the max (endurance emphasis)
//   'mid'/null → unchanged
// Returns a NEW prescription. Reps never go below 1 or above the original max + 2.
// If anything changed, appends a note to a (cloned) _applied array.
export function focusRepBiasAdjust(prescription, resolved) {
  if (!prescription || typeof prescription !== 'object') return prescription;
  if (!resolved || resolved.repBias == null || resolved.repBias === 'mid') {
    return { ...prescription };
  }

  const reps = prescription.reps;
  if (!Array.isArray(reps) || reps.length < 2) {
    return { ...prescription };
  }

  const origMin = reps[0];
  const origMax = reps[1];
  const ceiling = origMax + 2;
  let newMin = origMin;
  let newMax = origMax;

  if (resolved.repBias === 'low') {
    // Shift toward the min: pull the top of the range down to the min (heavier/strength).
    newMax = origMin;
  } else if (resolved.repBias === 'high') {
    // Shift toward the max: push the bottom of the range up to the max (endurance),
    // and extend the ceiling by up to 2 reps.
    newMin = origMax;
    newMax = origMax + 2;
  }

  // Clamp: never below 1, never above original max + 2.
  newMin = Math.max(1, Math.min(newMin, ceiling));
  newMax = Math.max(1, Math.min(newMax, ceiling));
  if (newMax < newMin) newMax = newMin;

  const changed = newMin !== origMin || newMax !== origMax;
  if (!changed) return { ...prescription };

  const applied = Array.isArray(prescription._applied) ? prescription._applied.slice() : [];
  applied.push(`_focus: repBias '${resolved.repBias}' [${origMin},${origMax}]→[${newMin},${newMax}]`);

  return { ...prescription, reps: [newMin, newMax], _applied: applied };
}
