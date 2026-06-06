// ─── EXERCISE DATABASE — Protocol Health Workout Engine (v9, Phase 1) ─────────
//
// STATUS: DORMANT. This module has NO consumer yet. It is the machine-readable
// data layer that the v9 Workout Engine (modules/workout-engine.js, not yet built)
// will read. Importing it has zero side effects and cannot affect the live app.
// The legacy static workoutContent() in each plans/*.js remains the default and
// only render path until the engine ships behind an opt-in BETA toggle (default OFF).
//
// PURPOSE: one canonical, queryable record per exercise — merging the prose
// WORKOUTS_LIBRARY.md, EXERCISE_PROGRESSIONS (plans/exercise-progressions.js), and
// the per-plan prescription tables into a single source of truth keyed by stable id.
//
// FOCUS-READY: every entry carries `muscles` (primary/secondary) + `region` so the
// muscle-focus / physique-goal customiser can bias selection without a later retrofit.
//
// ─── SCHEMA (every entry MUST match this shape) ──────────────────────────────
//
//   {
//     id:               string  // STABLE unique key. Progression: '<group>-l<level>-<slug>'
//                               //   e.g. 'push-l2-standard-pushup'. Non-prog: '<bucket>-<slug>'
//                               //   e.g. 'reardelt-reverse-snow-angels'. Lowercase, hyphenated.
//     name:             string  // Canonical display name. MUST match the library #### header
//                               //   (minus any '(skill)' disambiguation suffix) and, for
//                               //   progression entries, EXERCISE_PROGRESSIONS[group].levels[].exercise.
//     aliases:          string[]// Other spellings/labels used across the codebase, for matching.
//     progressionGroup: string|null // One of PROGRESSION_GROUPS, or null for non-progression.
//     level:            number|null  // Integer level within the group, or null.
//     pattern:          string  // One of PATTERNS — the movement pattern (drives push:pull cap).
//     plane:            string|null  // 'horizontal'|'vertical'|'rotational'|'isometric'|null
//     equipment:        string[]// From EQUIPMENT. Bodyweight-first → usually ['none'].
//     muscles: {                // ← focus-customiser metadata. Use MUSCLES enum tokens only.
//       primary:   string[],    //   prime movers (from library "Target muscles (primary)")
//       secondary: string[]     //   assisters/stabilisers (from library "(secondary)")
//     },
//     region:           string  // One of REGIONS — coarse bucket the focus UI groups by.
//     type:             string  // 'compound'|'isolation'|'isometric'|'conditioning'|'mobility'
//     difficulty:       number  // 1 (easiest) … 5 (elite). Ordinal, for demographic gating.
//     jointImpact:      string  // 'none'|'low'|'moderate'|'high' — feeds safety brakes.
//     plyometric:       boolean // true if it involves jumping/impact (weight/age brakes).
//     unilateral:       boolean // true if performed one side at a time.
//     contraindications:string[]// CONTRAINDICATION tokens (match WORKOUTS_LIBRARY.md §2.3).
//     prescriptions: {          // per-plan dose. null if the plan does not use this exercise.
//       lite|cut|bulk|maintenance|agro: null | {
//         sets:  number,
//         reps:  [number,number],   // [min,max]; equal values for a fixed count
//         unit:  'reps'|'sec'|'min'|'attempts'|'ladder'|'each'|'perside',
//         tempo: string,            // e.g. 'normal','3-1-2-0','hold','slow','5-sec eccentric'
//         rest:  [number,number],   // seconds [min,max]; [0,0] for none
//         freq:  number,            // sessions per week
//         raw:   string             // original "Sets × Reps" text from the library (fidelity)
//       }
//     },
//     progression: {            // progression entries only; {} for non-progression
//       prereq: { [group]: minLevel },   // gate, e.g. { core:4, push:5 }; {} if none
//       next:   string|null,             // id of the next level, or null at terminal
//       advanceCriteria: { cleanSessions: number, repTargetPct: number } // auto-progression rule
//     },
//     safetyOverrides:  { [rule]: 'block'|'regress'|'substitute' }, // machine-readable §2.2/§2.3
//     citation:         string, // approved source(s) from CLAUDE.md §15 (author-year / PMC id)
//     libraryRef:       string  // 'WORKOUTS_LIBRARY.md#<slug>' back-pointer
//   }
//
// ─── CONTROLLED VOCABULARIES ─────────────────────────────────────────────────

export const PROGRESSION_GROUPS = [
  'push','pull','shoulder','squat','hinge','core',
  'skill_crow','skill_handstand','skill_lsit','skill_planche','skill_press','skill_bridge',
  // chair progressions (Lite plan in-engine) — provisional, pending exercise-science sign-off:
  'chair_push','chair_pull','chair_legs','chair_core'
];

export const PATTERNS = [
  'push','pull','squat','hinge','core','rotation','carry',
  'skill','conditioning','mobility','plyometric','isometric'
];

export const REGIONS = [
  'chest','back','shoulders','arms','legs','glutes','core',
  'full_body','skill','conditioning','mobility','neck'
];

export const EQUIPMENT = ['none','wall','chair','bed','table','towel','floor','step'];

// Muscle tokens (snake_case). Map library prose → these exact tokens. Extend only if a
// library muscle has no token here; keep tokens canonical so the focus engine can match.
export const MUSCLES = [
  // chest / arms
  'pectoralis_major','pectoralis_clavicular','triceps','biceps','forearms',
  // shoulders
  'anterior_deltoid','lateral_deltoid','posterior_deltoid','rotator_cuff','serratus_anterior',
  // back
  'latissimus_dorsi','rhomboids','trapezius_upper','trapezius_mid','trapezius_lower','erector_spinae',
  // core
  'rectus_abdominis','obliques','transverse_abdominis','hip_flexors',
  // legs / hips
  'quadriceps','hamstrings','gluteus_maximus','gluteus_medius','adductors','abductors','calves',
  // hands / neck / other
  'wrist_flexors','finger_flexors','cervical_flexors','sternocleidomastoid','scalenes',
  'thoracic_extensors','splenius'
];

export const CONTRAINDICATIONS = [
  'wrist_injury','wrist_tendinopathy','shoulder_injury','lower_back_injury','knee_injury',
  'neck_injury','cardiovascular','pregnancy','recent_surgery','elbow_injury'
];

// ─── VALIDATION (run by the integration harness, not at runtime) ─────────────
// Returns an array of problem strings; empty array === valid.
export function validateEntry(e) {
  const probs = [];
  const req = ['id','name','aliases','progressionGroup','level','pattern','equipment',
               'muscles','region','type','difficulty','jointImpact','plyometric','unilateral',
               'contraindications','prescriptions','progression','safetyOverrides','citation','libraryRef'];
  for (const k of req) if (!(k in e)) probs.push(`${e.id||'?'}: missing field '${k}'`);
  if (e.muscles && (!Array.isArray(e.muscles.primary) || !Array.isArray(e.muscles.secondary)))
    probs.push(`${e.id}: muscles.primary/secondary must be arrays`);
  if (e.pattern && !PATTERNS.includes(e.pattern)) probs.push(`${e.id}: bad pattern '${e.pattern}'`);
  if (e.region && !REGIONS.includes(e.region)) probs.push(`${e.id}: bad region '${e.region}'`);
  if (e.progressionGroup && !PROGRESSION_GROUPS.includes(e.progressionGroup))
    probs.push(`${e.id}: bad progressionGroup '${e.progressionGroup}'`);
  for (const m of [...(e.muscles?.primary||[]), ...(e.muscles?.secondary||[])])
    if (!MUSCLES.includes(m)) probs.push(`${e.id}: unknown muscle token '${m}'`);
  const plans = ['lite','cut','bulk','maintenance','agro'];
  if (e.prescriptions) for (const p of plans)
    if (!(p in e.prescriptions)) probs.push(`${e.id}: prescriptions missing plan '${p}'`);
  return probs;
}

// ─── THE DATABASE ────────────────────────────────────────────────────────────
// GOLD-STANDARD EXAMPLES (authored by hand). Every agent-converted group is appended
// below following these three exactly: one compound progression, one skill, one
// non-progression conditioning move.

export const EXERCISE_DB = [

  // ─── example: progression / compound ──────────────────────────────────────
  {
    id: 'push-l2-standard-pushup',
    name: 'Standard push-up',
    aliases: ['Push-up','Push-ups','Full push-up'],
    progressionGroup: 'push',
    level: 2,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none'],
    muscles: {
      primary: ['pectoralis_major','triceps','anterior_deltoid'],
      secondary: ['rectus_abdominis','serratus_anterior']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12-15' },
      bulk:        { sets:4, reps:[12,15], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×12-15' },
      maintenance: { sets:3, reps:[12,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12-15' },
      agro:        { sets:3, reps:[12,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×12-15' }
    },
    progression: {
      prereq: { push: 1 },
      next: 'push-l3-wide-pushup',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'weight>120': 'regress' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#standard-push-up'
  },

  // ─── example: skill / isometric balance ───────────────────────────────────
  {
    id: 'skillcrow-l1-tuck-hold-feet-on-floor',
    name: 'Tuck hold (feet on floor)',
    aliases: ['Crow tuck hold','Frog stand tuck'],
    progressionGroup: 'skill_crow',
    level: 1,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['wrist_flexors','anterior_deltoid','rectus_abdominis'],
      secondary: ['triceps','finger_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 3,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×15 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: 'skillcrow-l2-tuck-hold-feet-lifted',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#tuck-hold-feet-on-floor'
  },

  // ─── example: non-progression / conditioning ──────────────────────────────
  {
    id: 'cond-mountain-climbers',
    name: 'Mountain climbers',
    aliases: ['Mountain climber'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'horizontal',
    equipment: ['none'],
    muscles: {
      primary: ['hip_flexors','rectus_abdominis','obliques'],
      secondary: ['anterior_deltoid','pectoralis_major','quadriceps']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,15], freq:2, raw:'30s intervals' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,15], freq:1, raw:'30s intervals' },
      agro:        { sets:4, reps:[30,30], unit:'sec', tempo:'fast', rest:[30,30], freq:2, raw:'30s × 3-4 rounds' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ACE 2024; Schoenfeld 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#mountain-climbers'
  }

  // ── agent-converted groups are appended here during integration ──
];
