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
      next: 'push-l3-wide-push-up',
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

,

  // ── from animal_taichi ──
  // ═══ ANIMAL FLOW / QMT (9) ═══════════════════════════════════════════════

  {
    id: 'animal-wrist-mobilizations',
    name: 'Wrist mobilizations',
    aliases: ['Wrist mobility','Wrist prep'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['wrist_flexors','forearms'],
      secondary: ['finger_flexors']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[3,3], unit:'min', tempo:'slow', rest:[0,0], freq:1, raw:'3 min continuous' },
      maintenance: { sets:1, reps:[3,3], unit:'min', tempo:'slow', rest:[0,0], freq:1, raw:'3 min continuous' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#wrist-mobilizations'
  },

  {
    id: 'animal-beast-hold',
    name: 'Beast hold',
    aliases: ['Beast position','Bear hold'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','quadriceps'],
      secondary: ['rectus_abdominis','obliques','hip_flexors','wrist_flexors']
    },
    region: 'full_body',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:3, reps:[15,15], unit:'sec', tempo:'hold', rest:[30,45], freq:1, raw:'3×15 sec' },
      maintenance: { sets:3, reps:[15,15], unit:'sec', tempo:'hold', rest:[30,45], freq:1, raw:'3×15 sec' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#beast-hold'
  },

  {
    id: 'animal-beast-to-crab-transition',
    name: 'Beast to crab transition',
    aliases: ['Beast crab','Beast to crab'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','obliques'],
      secondary: ['rectus_abdominis','quadriceps','wrist_flexors','rotator_cuff']
    },
    region: 'full_body',
    type: 'mobility',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[5,5], unit:'reps', tempo:'normal', rest:[30,30], freq:1, raw:'5 reps' },
      maintenance: { sets:1, reps:[5,5], unit:'reps', tempo:'normal', rest:[30,30], freq:1, raw:'5 reps' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#beast-to-crab-transition'
  },

  {
    id: 'animal-crab-reach',
    name: 'Crab reach',
    aliases: ['Crab reach-through'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['thoracic_extensors','gluteus_maximus'],
      secondary: ['anterior_deltoid','hip_flexors','obliques']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[5,5], unit:'perside', tempo:'slow', rest:[20,30], freq:1, raw:'5/side' },
      maintenance: { sets:1, reps:[5,5], unit:'perside', tempo:'slow', rest:[20,30], freq:1, raw:'5/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#crab-reach'
  },

  {
    id: 'animal-lateral-ape',
    name: 'Lateral ape',
    aliases: ['Ape walk','Side ape'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['adductors','abductors','quadriceps'],
      secondary: ['rectus_abdominis','anterior_deltoid','calves']
    },
    region: 'full_body',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','knee_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[5,5], unit:'perside', tempo:'normal', rest:[20,30], freq:1, raw:'5/direction' },
      maintenance: { sets:1, reps:[5,5], unit:'perside', tempo:'normal', rest:[20,30], freq:1, raw:'5/direction' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#lateral-ape'
  },

  {
    id: 'animal-front-step-through',
    name: 'Front step-through',
    aliases: ['Step-through','Beast step-through'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['obliques','hip_flexors'],
      secondary: ['anterior_deltoid','rectus_abdominis','adductors']
    },
    region: 'full_body',
    type: 'mobility',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[5,5], unit:'perside', tempo:'normal', rest:[30,30], freq:1, raw:'5/side' },
      maintenance: { sets:1, reps:[5,5], unit:'perside', tempo:'normal', rest:[30,30], freq:1, raw:'5/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#front-step-through'
  },

  {
    id: 'animal-scorpion-reach',
    name: 'Scorpion reach',
    aliases: ['Scorpion stretch','Scorpion twist'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['thoracic_extensors','hip_flexors'],
      secondary: ['gluteus_maximus','obliques','latissimus_dorsi']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[4,4], unit:'perside', tempo:'slow', rest:[20,30], freq:1, raw:'4/side' },
      maintenance: { sets:1, reps:[4,4], unit:'perside', tempo:'slow', rest:[20,30], freq:1, raw:'4/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#scorpion-reach'
  },

  {
    id: 'animal-loaded-beast-to-underswitch',
    name: 'Loaded beast to underswitch',
    aliases: ['Underswitch','Beast underswitch'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','quadriceps','obliques'],
      secondary: ['wrist_flexors','forearms','gluteus_maximus','rectus_abdominis']
    },
    region: 'full_body',
    type: 'conditioning',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[5,5], unit:'reps', tempo:'explosive', rest:[45,60], freq:1, raw:'5 reps' },
      maintenance: { sets:1, reps:[5,5], unit:'reps', tempo:'explosive', rest:[45,60], freq:1, raw:'5 reps' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute', 'shoulder_injury': 'block' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#loaded-beast-to-underswitch'
  },

  {
    id: 'animal-free-flow',
    name: 'Free flow',
    aliases: ['Animal flow free flow','Flow practice'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','quadriceps','obliques'],
      secondary: ['rectus_abdominis','gluteus_maximus','wrist_flexors']
    },
    region: 'full_body',
    type: 'conditioning',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[2,3], unit:'min', tempo:'normal', rest:[0,0], freq:1, raw:'2-3 min continuous' },
      maintenance: { sets:1, reps:[2,3], unit:'min', tempo:'normal', rest:[0,0], freq:1, raw:'2-3 min continuous' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'Buxton 2022; Matthews 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#free-flow'
  },

  // ═══ TAI CHI — YANG STYLE 8-FORM (8) ═════════════════════════════════════

  {
    id: 'taichi-wu-ji-stance',
    name: 'Wu Ji stance',
    aliases: ['Wuji stance','Standing meditation'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none','chair'],
    muscles: {
      primary: ['erector_spinae','transverse_abdominis'],
      secondary: ['calves']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[2,2], unit:'min', tempo:'slow', rest:[0,0], freq:1, raw:'2 min' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#wu-ji-stance'
  },

  {
    id: 'taichi-part-the-wild-horses-mane',
    name: "Part the wild horse's mane",
    aliases: ["Parting the wild horse's mane","Wild horse mane"],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','wall','chair'],
    muscles: {
      primary: ['gluteus_maximus','quadriceps'],
      secondary: ['anterior_deltoid','obliques','gluteus_medius']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[4,4], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'4 reps/side' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#part-the-wild-horses-mane'
  },

  {
    id: 'taichi-white-crane-spreads-wings',
    name: 'White crane spreads wings',
    aliases: ['White crane','Crane spreads wings'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','wall'],
    muscles: {
      primary: ['gluteus_medius','anterior_deltoid'],
      secondary: ['quadriceps','obliques']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[4,4], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'4 reps' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#white-crane-spreads-wings'
  },

  {
    id: 'taichi-brush-knee-and-push',
    name: 'Brush knee and push',
    aliases: ['Brush knee','Brush knee push'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','rectus_abdominis'],
      secondary: ['anterior_deltoid','obliques']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[4,4], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'4 reps/side' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#brush-knee-and-push'
  },

  {
    id: 'taichi-playing-the-lute',
    name: 'Playing the lute',
    aliases: ['Play the lute','Strum the lute'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','forearms'],
      secondary: ['anterior_deltoid','rectus_abdominis','calves']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[4,4], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'4 reps/side' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#playing-the-lute'
  },

  {
    id: 'taichi-reverse-reeling-forearm',
    name: 'Reverse reeling forearm',
    aliases: ['Reeling forearm','Step back reeling'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','wall','chair'],
    muscles: {
      primary: ['quadriceps','rectus_abdominis'],
      secondary: ['anterior_deltoid','calves']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[4,4], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'4 reps/side' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#reverse-reeling-forearm'
  },

  {
    id: 'taichi-wave-hands-like-clouds',
    name: 'Wave hands like clouds',
    aliases: ['Cloud hands','Waving hands like clouds'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none'],
    muscles: {
      primary: ['thoracic_extensors','adductors','abductors'],
      secondary: ['anterior_deltoid','obliques','calves']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[6,6], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'6 reps' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#wave-hands-like-clouds'
  },

  {
    id: 'taichi-closing-form',
    name: 'Closing form',
    aliases: ['Close','Closing sequence'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['transverse_abdominis','erector_spinae'],
      secondary: []
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[1,1], unit:'min', tempo:'slow', rest:[0,0], freq:1, raw:'1 min' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Chen 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#closing-form'
  },

  // ── from cal_box_rope ──
  // ─── Calisthenics / Resistance ─────────────────────────────────────────────

  {
    id: 'cal-reverse-lunge',
    name: 'Reverse lunge',
    aliases: ['Reverse lunge','Backward lunge','Step-back lunge'],
    progressionGroup: null,
    level: null,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['hamstrings','rectus_abdominis','adductors']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,12], unit:'perside', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×12/side' },
      bulk:        { sets:4, reps:[12,12], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×12/side' },
      maintenance: { sets:3, reps:[10,10], unit:'perside', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×10/side' },
      agro:        { sets:3, reps:[12,12], unit:'perside', tempo:'normal',  rest:[60,60],  freq:2, raw:'3×12/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Plotkin 2022; Schoenfeld 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#reverse-lunge'
  },

  {
    id: 'cal-jumping-jacks',
    name: 'Jumping jacks',
    aliases: ['Jumping jack','Star jumps','Marching jacks (regression)'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['lateral_deltoid','calves','quadriceps'],
      secondary: ['rectus_abdominis','adductors','abductors']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 1,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,15], freq:2, raw:'30s intervals' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,15], freq:1, raw:'30s intervals' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'weight>=100': 'block', 'age>=65': 'block' },
    citation: 'ACE 2024',
    libraryRef: 'WORKOUTS_LIBRARY.md#jumping-jacks'
  },

  {
    id: 'cal-high-knees',
    name: 'High knees',
    aliases: ['High knee run','Stationary high knees'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['hip_flexors','quadriceps'],
      secondary: ['rectus_abdominis','calves','gluteus_maximus']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,15], freq:2, raw:'30s intervals' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,15], freq:1, raw:'30s intervals' },
      agro:        { sets:1, reps:[30,30], unit:'sec', tempo:'fast', rest:[0,0],   freq:3, raw:'30s warmup' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ACE 2024',
    libraryRef: 'WORKOUTS_LIBRARY.md#high-knees'
  },

  {
    id: 'cal-speed-skaters',
    name: 'Speed skaters',
    aliases: ['Speed skater','Skater jumps','Lateral bounds'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'rotational',
    equipment: ['none'],
    muscles: {
      primary: ['gluteus_medius','quadriceps'],
      secondary: ['calves','obliques','hamstrings']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: true,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[40,40], unit:'sec', tempo:'fast', rest:[20,20], freq:1, raw:'40s intervals' },
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: { 'weight>=100': 'block', 'age>=65': 'block' },
    citation: 'ACE 2024; Schoenfeld 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#speed-skaters'
  },

  {
    id: 'cal-burpee-squat-thrust',
    name: 'Burpee / Squat thrust',
    aliases: ['Burpee','Squat thrust','Burpees'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['pectoralis_major','quadriceps','anterior_deltoid','rectus_abdominis'],
      secondary: ['triceps','hip_flexors','calves','gluteus_maximus']
    },
    region: 'full_body',
    type: 'conditioning',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['wrist_injury','knee_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[40,40], unit:'sec',  tempo:'moderate', rest:[20,20], freq:1, raw:'40s intervals' },
      bulk: null,
      maintenance: null,
      agro:        { sets:3, reps:[10,10], unit:'reps', tempo:'fast',     rest:[60,60], freq:1, raw:'3×10' }
    },
    progression: {},
    safetyOverrides: { 'weight>=100': 'block', 'age>=65': 'block' },
    citation: 'ACE 2024; Schoenfeld 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#burpee-squat-thrust'
  },

  {
    id: 'cal-flutter-kicks',
    name: 'Flutter kicks',
    aliases: ['Flutter kick','Scissor kicks'],
    progressionGroup: null,
    level: null,
    pattern: 'core',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','hip_flexors'],
      secondary: ['quadriceps','obliques']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[40,40], unit:'sec', tempo:'fast', rest:[20,20], freq:1, raw:'40s intervals' },
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Schoenfeld 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#flutter-kicks'
  },

  {
    id: 'cal-plank-to-downdog',
    name: 'Plank to downdog',
    aliases: ['Plank to down dog','Plank to downward dog'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'vertical',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','hamstrings','calves'],
      secondary: ['rectus_abdominis','serratus_anterior','latissimus_dorsi']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[6,6],   unit:'reps', tempo:'slow',       rest:[45,45], freq:2, raw:'2×6' },
      cut:         { sets:1, reps:[30,30], unit:'sec',  tempo:'controlled', rest:[15,15], freq:1, raw:'30s intervals' },
      bulk:        { sets:3, reps:[8,8],   unit:'reps', tempo:'2-1-2-0',    rest:[60,60], freq:1, raw:'3×8' },
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Buxton 2022; Schoenfeld 2015',
    libraryRef: 'WORKOUTS_LIBRARY.md#plank-to-downdog'
  },

  {
    id: 'cal-calf-raises-standing',
    name: 'Calf raises standing',
    aliases: ['Standing calf raise','Calf raise','Standing calf raises'],
    progressionGroup: null,
    level: null,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none','step'],
    muscles: {
      primary: ['calves'],
      secondary: []
    },
    region: 'legs',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:2, reps:[12,12], unit:'reps', tempo:'slow',    rest:[45,45], freq:2, raw:'2×12' },
      cut:         { sets:3, reps:[15,15], unit:'reps', tempo:'normal',  rest:[45,60], freq:1, raw:'3×15' },
      bulk:        { sets:4, reps:[15,15], unit:'reps', tempo:'2-0-2-0', rest:[60,90], freq:2, raw:'4×15' },
      maintenance: { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[45,60], freq:1, raw:'3×12' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Plotkin 2022; Schoenfeld 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#calf-raises-standing'
  },

  {
    id: 'cal-side-lying-hip-abduction',
    name: 'Side-lying hip abduction',
    aliases: ['Side lying hip abduction','Side-lying leg raise','Lateral leg raise'],
    progressionGroup: null,
    level: null,
    pattern: 'hinge',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_medius','abductors'],
      secondary: ['obliques']
    },
    region: 'legs',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:2, reps:[10,10], unit:'perside', tempo:'slow',    rest:[30,30], freq:2, raw:'2×10/side' },
      cut:         { sets:3, reps:[15,15], unit:'perside', tempo:'normal',  rest:[45,45], freq:1, raw:'3×15/side' },
      bulk:        { sets:3, reps:[15,15], unit:'perside', tempo:'2-1-2-0', rest:[60,60], freq:2, raw:'3×15/side' },
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Cools 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#side-lying-hip-abduction'
  },

  {
    id: 'cal-wall-sit',
    name: 'Wall sit',
    aliases: ['Wall squat','Wall sit hold'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none','wall'],
    muscles: {
      primary: ['quadriceps'],
      secondary: ['gluteus_maximus','calves','rectus_abdominis']
    },
    region: 'legs',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[20,20], unit:'sec', tempo:'hold', rest:[45,45], freq:1, raw:'2×20s' },
      cut:         { sets:3, reps:[30,45], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'3×30-45s' },
      bulk:        { sets:3, reps:[45,45], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'3×45s' },
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Oranchuk 2019; Lum & Barbosa 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-sit'
  },

  {
    id: 'cal-single-leg-rdl-bodyweight',
    name: 'Single-leg RDL bodyweight',
    aliases: ['Single leg RDL','Single-leg Romanian deadlift','SLRDL'],
    progressionGroup: null,
    level: null,
    pattern: 'hinge',
    plane: 'vertical',
    equipment: ['none','wall'],
    muscles: {
      primary: ['hamstrings','gluteus_maximus'],
      secondary: ['rectus_abdominis','erector_spinae','calves']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,10], unit:'perside', tempo:'normal',  rest:[60,60], freq:1, raw:'3×10/side' },
      bulk:        { sets:4, reps:[10,10], unit:'perside', tempo:'3-1-2-0', rest:[90,90], freq:2, raw:'4×10/side' },
      maintenance: { sets:3, reps:[8,8],   unit:'perside', tempo:'normal',  rest:[60,60], freq:1, raw:'3×8/side' },
      agro:        { sets:3, reps:[10,10], unit:'perside', tempo:'normal',  rest:[60,60], freq:1, raw:'3×10/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Plotkin 2022; Schoenfeld 2015',
    libraryRef: 'WORKOUTS_LIBRARY.md#single-leg-rdl-bodyweight'
  },

  {
    id: 'cal-tricep-dips-chair-edge',
    name: 'Tricep dips chair edge',
    aliases: ['Tricep dips','Chair dips','Bench dips'],
    progressionGroup: null,
    level: null,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['triceps'],
      secondary: ['anterior_deltoid','pectoralis_major']
    },
    region: 'arms',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:3, reps:[12,12], unit:'reps', tempo:'2-1-2-0', rest:[60,90], freq:1, raw:'3×12' },
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Plotkin 2022; Schoenfeld 2015',
    libraryRef: 'WORKOUTS_LIBRARY.md#tricep-dips-chair-edge'
  },

  {
    id: 'cal-push-up-ladder-10-down-to-1',
    name: 'Push-up ladder 10 down to 1',
    aliases: ['Push-up ladder','Descending push-up ladder','10-to-1 push-up ladder'],
    progressionGroup: null,
    level: null,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['pectoralis_major','triceps','anterior_deltoid'],
      secondary: ['rectus_abdominis','serratus_anterior']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:1, reps:[55,55], unit:'ladder', tempo:'normal', rest:[10,10], freq:1, raw:'1 ladder (55 reps)' },
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022; Schoenfeld 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#push-up-ladder-10-down-to-1'
  },

  // ─── Rear Deltoid / Posterior Shoulder ─────────────────────────────────────

  {
    id: 'reardelt-reverse-snow-angels',
    name: 'Reverse snow angels',
    aliases: ['Reverse snow angel','Prone snow angels','Floor snow angels'],
    progressionGroup: null,
    level: null,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['posterior_deltoid','trapezius_mid','trapezius_lower'],
      secondary: ['rhomboids','erector_spinae','rotator_cuff']
    },
    region: 'shoulders',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:2, reps:[15,15], unit:'reps', tempo:'slow', rest:[45,60], freq:2, raw:'2×15' },
      bulk:        { sets:3, reps:[15,15], unit:'reps', tempo:'slow', rest:[60,90], freq:2, raw:'3×15' },
      maintenance: { sets:2, reps:[15,15], unit:'reps', tempo:'slow', rest:[45,60], freq:1, raw:'2×15' },
      agro:        { sets:3, reps:[15,15], unit:'reps', tempo:'slow', rest:[60,60], freq:2, raw:'3×15' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Cools 2016; Prinold 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#reverse-snow-angels'
  },

  {
    id: 'reardelt-prone-reverse-fly',
    name: 'Prone reverse fly',
    aliases: ['Prone reverse fly','Floor reverse fly','Prone T raise'],
    progressionGroup: null,
    level: null,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['posterior_deltoid'],
      secondary: ['trapezius_mid','rhomboids','rotator_cuff']
    },
    region: 'shoulders',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[45,60], freq:2, raw:'3×12' },
      bulk:        { sets:3, reps:[12,15], unit:'reps', tempo:'3-1-2-0', rest:[60,90], freq:2, raw:'3×12-15' },
      maintenance: { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[45,60], freq:1, raw:'3×12' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Cools 2016; Prinold 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#prone-reverse-fly'
  },

  {
    id: 'reardelt-prone-w-pull-bodyweight-face-pull',
    name: 'Prone W pull (bodyweight face pull)',
    aliases: ['Prone W pull','Bodyweight face pull','Prone face pull','W pull'],
    progressionGroup: null,
    level: null,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['posterior_deltoid','rotator_cuff'],
      secondary: ['trapezius_mid','trapezius_lower','rhomboids']
    },
    region: 'shoulders',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,12], unit:'reps', tempo:'slow', rest:[45,60], freq:1, raw:'3×12' },
      bulk:        { sets:3, reps:[12,12], unit:'reps', tempo:'slow', rest:[60,90], freq:1, raw:'3×12' },
      maintenance: { sets:3, reps:[12,12], unit:'reps', tempo:'slow', rest:[45,60], freq:1, raw:'3×12' },
      agro:        { sets:3, reps:[12,12], unit:'reps', tempo:'slow', rest:[60,60], freq:1, raw:'3×12' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Cools 2016; Prinold 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#prone-w-pull-bodyweight-face-pull'
  },

  {
    id: 'reardelt-prone-reverse-fly-hold',
    name: 'Prone reverse fly hold',
    aliases: ['Prone reverse fly hold','Prone T hold','Reverse fly isometric'],
    progressionGroup: null,
    level: null,
    pattern: 'pull',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['posterior_deltoid','trapezius_mid'],
      secondary: ['rhomboids','trapezius_lower','rotator_cuff']
    },
    region: 'shoulders',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[45,60], freq:1, raw:'3×20-30 sec' },
      bulk:        { sets:3, reps:[30,30], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×30 sec' },
      maintenance: { sets:2, reps:[20,30], unit:'sec', tempo:'hold', rest:[45,60], freq:1, raw:'2×20-30 sec' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Cools 2016; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#prone-reverse-fly-hold'
  },

  // ─── HIIT Protocols ────────────────────────────────────────────────────────

  {
    id: 'hiit-hiit-circuit-a',
    name: 'HIIT Circuit A',
    aliases: ['HIIT Circuit A','Circuit A','Full-body HIIT A'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['gluteus_maximus','quadriceps','hamstrings','hip_flexors','rectus_abdominis'],
      secondary: ['lateral_deltoid','calves','pectoralis_major']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['cardiovascular','knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:4, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,120], freq:1, raw:'4 rounds of 6×30s' },
      bulk: null,
      maintenance: { sets:4, reps:[30,30], unit:'sec', tempo:'fast', rest:[15,120], freq:1, raw:'4 rounds of 6×30s' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'regress' },
    citation: 'ACE 2024; Schoenfeld 2021; Boutcher 2011',
    libraryRef: 'WORKOUTS_LIBRARY.md#hiit-circuit-a'
  },

  {
    id: 'hiit-hiit-circuit-b',
    name: 'HIIT Circuit B',
    aliases: ['HIIT Circuit B','Circuit B','Full-body HIIT B'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus','pectoralis_major','triceps','rectus_abdominis'],
      secondary: ['lateral_deltoid','hamstrings','hip_flexors','calves','obliques']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['cardiovascular','knee_injury','wrist_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[40,40], unit:'sec', tempo:'fast', rest:[20,90], freq:1, raw:'3 rounds of 6×40s' },
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'regress', 'weight>=100': 'regress' },
    citation: 'ACE 2024; Schoenfeld 2021; Boutcher 2011',
    libraryRef: 'WORKOUTS_LIBRARY.md#hiit-circuit-b'
  },

  // ─── Shadowboxing ──────────────────────────────────────────────────────────

  {
    id: 'shadowbox-shadowboxing-cardio',
    name: 'Shadowboxing cardio',
    aliases: ['Shadowboxing','Shadow boxing cardio','Shadowbox cardio'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'rotational',
    equipment: ['none'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','posterior_deltoid','obliques','transverse_abdominis'],
      secondary: ['hip_flexors','calves','forearms','gluteus_maximus','rhomboids']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['cardiovascular','shoulder_injury','wrist_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:5, reps:[3,3], unit:'min', tempo:'varies', rest:[60,60], freq:1, raw:'5 × 3-min rounds' },
      bulk: null,
      maintenance: { sets:5, reps:[3,3], unit:'min', tempo:'varies', rest:[60,60], freq:1, raw:'5 × 3-min rounds' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'regress' },
    citation: 'Croom 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#shadowboxing-cardio'
  },

  {
    id: 'shadowbox-shadowboxing--beginner-mode-3--2-min-rounds',
    name: 'Shadowboxing — beginner mode (3 × 2-min rounds)',
    aliases: ['Shadowboxing beginner mode','Beginner shadowboxing','Shadowbox beginner'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'rotational',
    equipment: ['none'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','obliques'],
      secondary: ['hip_flexors','calves','forearms']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['cardiovascular','shoulder_injury','wrist_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[2,2], unit:'min', tempo:'mixed', rest:[90,90], freq:1, raw:'3 × 2-min rounds' },
      bulk: null,
      maintenance: { sets:3, reps:[2,2], unit:'min', tempo:'mixed', rest:[90,90], freq:1, raw:'3 × 2-min rounds' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'block' },
    citation: 'Croom 2023',
    libraryRef: 'WORKOUTS_LIBRARY.md#shadowboxing--beginner-mode-3--2-min-rounds'
  },

  {
    id: 'shadowbox-shadowboxing--footwork-drill-10-min',
    name: 'Shadowboxing — footwork drill (10 min)',
    aliases: ['Shadowboxing footwork drill','Footwork drill','Shadowbox footwork'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['calves','quadriceps','hip_flexors','rectus_abdominis'],
      secondary: ['obliques','gluteus_medius']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['cardiovascular'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[10,10], unit:'min', tempo:'moderate', rest:[0,0], freq:1, raw:'10 min continuous' },
      bulk: null,
      maintenance: { sets:1, reps:[10,10], unit:'min', tempo:'moderate', rest:[0,0], freq:1, raw:'10 min continuous' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'block' },
    citation: 'Croom 2023; Buxton 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#shadowboxing--footwork-drill-10-min'
  },

  // ─── Jump Rope ─────────────────────────────────────────────────────────────

  {
    id: 'rope-jump-rope-hiit',
    name: 'Jump rope HIIT',
    aliases: ['Jump rope HIIT','Skipping HIIT','Rope HIIT'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['calves'],
      secondary: ['lateral_deltoid','rectus_abdominis','forearms','quadriceps']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['cardiovascular','knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:8, reps:[30,30], unit:'sec', tempo:'fast', rest:[20,30], freq:1, raw:'8×30s + 3×60s' },
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: { 'weight>=100': 'block', 'age>=65': 'block' },
    citation: 'PMC 8467906; PMC 12473967',
    libraryRef: 'WORKOUTS_LIBRARY.md#jump-rope-hiit'
  },

  {
    id: 'rope-jump-rope-steady-state',
    name: 'Jump rope steady-state',
    aliases: ['Jump rope steady-state','Steady-state skipping','Continuous jump rope'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['calves'],
      secondary: ['lateral_deltoid','rectus_abdominis','forearms']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 2,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['cardiovascular','knee_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk: null,
      maintenance: { sets:4, reps:[3,3], unit:'min', tempo:'moderate', rest:[60,60], freq:1, raw:'4 × 3 min continuous' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'weight>=100': 'block', 'age>=65': 'block' },
    citation: 'PMC 8467906',
    libraryRef: 'WORKOUTS_LIBRARY.md#jump-rope-steady-state'
  },

  {
    id: 'rope-jump-rope--boxer-skip-alternating-feet',
    name: 'Jump rope — boxer skip (alternating feet)',
    aliases: ['Boxer skip','Jump rope boxer skip','Alternating feet skip'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['calves'],
      secondary: ['hip_flexors','lateral_deltoid','rectus_abdominis']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 2,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['cardiovascular','knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:4, reps:[90,90], unit:'sec', tempo:'moderate', rest:[30,30], freq:1, raw:'4 × 90 sec' },
      bulk: null,
      maintenance: { sets:4, reps:[2,2],   unit:'min', tempo:'moderate', rest:[60,60], freq:1, raw:'4 × 2 min' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'weight>=100': 'block', 'age>=65': 'block' },
    citation: 'PMC 8467906; PMC 12473967',
    libraryRef: 'WORKOUTS_LIBRARY.md#jump-rope--boxer-skip-alternating-feet'
  },

  {
    id: 'rope-jump-rope--double-under-intervals-advanced',
    name: 'Jump rope — double-under intervals (advanced)',
    aliases: ['Double-unders','Jump rope double-unders','Double-under intervals'],
    progressionGroup: null,
    level: null,
    pattern: 'conditioning',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['calves','rectus_abdominis'],
      secondary: ['lateral_deltoid','forearms','quadriceps']
    },
    region: 'conditioning',
    type: 'conditioning',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['cardiovascular','knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:6, reps:[30,30], unit:'sec', tempo:'explosive', rest:[30,60], freq:1, raw:'6 × 30s + 3 × max-30s' },
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: { 'weight>=100': 'block', 'age>=65': 'block' },
    citation: 'PMC 8467906; PMC 12473967; ACE 2024',
    libraryRef: 'WORKOUTS_LIBRARY.md#jump-rope--double-under-intervals-advanced'
  },

  // ── from chair ──
  // ─── chair_push ladder ──────────────────────────────────────────────────────

  {
    id: 'chairpush-l1-seated-chest-press',
    name: 'Seated chest press',
    aliases: ['Seated palm press','Isometric chest press (seated)'],
    progressionGroup: 'chair_push',
    level: 1,
    pattern: 'push',
    plane: 'isometric',
    equipment: ['chair'],
    muscles: {
      primary: ['pectoralis_major','triceps'],
      secondary: ['anterior_deltoid']
    },
    region: 'chest',
    type: 'isometric',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[10,10], unit:'reps', tempo:'3s squeeze', rest:[20,30], freq:1, raw:'2×10' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: {},
      next: 'chairpush-l2-seated-arm-raises',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-chest-press'
  },

  {
    id: 'chairpush-l2-seated-arm-raises',
    name: 'Seated arm raises',
    aliases: ['Seated overhead arm raise','Seated lateral-to-overhead raise'],
    progressionGroup: 'chair_push',
    level: 2,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','posterior_deltoid'],
      secondary: ['trapezius_upper','serratus_anterior']
    },
    region: 'shoulders',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite: { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'2×10' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_push: 1 },
      next: 'chairpush-l3-seated-shoulder-press',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'regress' },
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-arm-raises'
  },

  {
    id: 'chairpush-l3-seated-shoulder-press',
    name: 'Seated shoulder press',
    aliases: ['Seated overhead press','Seated military press (bodyweight)'],
    progressionGroup: 'chair_push',
    level: 3,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','triceps'],
      secondary: ['trapezius_upper','serratus_anterior']
    },
    region: 'shoulders',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','lower_back_injury'],
    prescriptions: {
      lite: { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,45], freq:1, raw:'2×10' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_push: 2 },
      next: 'chairpush-l4-seated-chest-press-hold',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'regress' },
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-shoulder-press'
  },

  {
    id: 'chairpush-l4-seated-chest-press-hold',
    name: 'Seated chest press hold (isometric)',
    aliases: ['Seated isometric chest press hold','10-sec palm press hold'],
    progressionGroup: 'chair_push',
    level: 4,
    pattern: 'push',
    plane: 'isometric',
    equipment: ['chair'],
    muscles: {
      primary: ['pectoralis_major','anterior_deltoid'],
      secondary: ['triceps','serratus_anterior']
    },
    region: 'chest',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:3, reps:[10,10], unit:'sec', tempo:'hold', rest:[30,45], freq:1, raw:'3×10 sec' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_push: 3 },
      next: null,
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'ICFSR 2021; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-chest-press-hold-isometric'
  },

  // ─── chair_pull ladder ──────────────────────────────────────────────────────

  {
    id: 'chairpull-l1-seated-bicep-curls',
    name: 'Seated bicep curls (no weight)',
    aliases: ['Seated bicep curls','Bodyweight seated curl'],
    progressionGroup: 'chair_pull',
    level: 1,
    pattern: 'pull',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['biceps'],
      secondary: ['forearms']
    },
    region: 'arms',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['elbow_injury'],
    prescriptions: {
      lite: { sets:2, reps:[12,12], unit:'reps', tempo:'slow, 1s squeeze', rest:[30,30], freq:1, raw:'2×12' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: {},
      next: 'chairpull-l2-seated-row',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-bicep-curls-no-weight'
  },

  {
    id: 'chairpull-l2-seated-row',
    name: 'Seated row',
    aliases: ['Seated bodyweight row','Seated scapular row'],
    progressionGroup: 'chair_pull',
    level: 2,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['chair'],
    muscles: {
      primary: ['rhomboids','trapezius_mid'],
      secondary: ['posterior_deltoid','biceps']
    },
    region: 'back',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[10,10], unit:'reps', tempo:'slow, 1s squeeze', rest:[30,30], freq:1, raw:'2×10' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_pull: 1 },
      next: null,
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-row'
  },

  // ─── chair_legs ladder ──────────────────────────────────────────────────────

  {
    id: 'chairlegs-l1-seated-leg-extensions',
    name: 'Seated leg extensions',
    aliases: ['Seated knee extension','Seated leg extension'],
    progressionGroup: 'chair_legs',
    level: 1,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['quadriceps'],
      secondary: ['hip_flexors']
    },
    region: 'legs',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: { sets:2, reps:[10,10], unit:'each', tempo:'slow, 2s hold', rest:[30,30], freq:1, raw:'2×10/leg' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: {},
      next: 'chairlegs-l2-seated-knee-lifts',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'regress' },
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-leg-extensions'
  },

  {
    id: 'chairlegs-l2-seated-knee-lifts',
    name: 'Seated knee lifts',
    aliases: ['Seated knee raise','Seated marching knee lift'],
    progressionGroup: 'chair_legs',
    level: 2,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['hip_flexors','rectus_abdominis'],
      secondary: ['quadriceps']
    },
    region: 'legs',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[10,10], unit:'each', tempo:'slow', rest:[30,30], freq:1, raw:'2×10/leg' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_legs: 1 },
      next: 'chairlegs-l3-seated-leg-extension-hold',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-knee-lifts'
  },

  {
    id: 'chairlegs-l3-seated-leg-extension-hold',
    name: 'Seated leg extension hold (isometric)',
    aliases: ['Seated isometric leg extension','Seated quad hold'],
    progressionGroup: 'chair_legs',
    level: 3,
    pattern: 'squat',
    plane: 'isometric',
    equipment: ['chair'],
    muscles: {
      primary: ['quadriceps'],
      secondary: ['hip_flexors']
    },
    region: 'legs',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: { sets:3, reps:[10,10], unit:'sec', tempo:'hold', rest:[30,45], freq:1, raw:'3×10 sec/leg' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_legs: 2 },
      next: 'chairlegs-l4-standing-heel-raises',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'regress' },
    citation: 'ICFSR 2021; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-leg-extension-hold-isometric'
  },

  {
    id: 'chairlegs-l4-standing-heel-raises',
    name: 'Standing heel raises (chair)',
    aliases: ['Standing calf raise (chair-supported)','Chair-supported heel raise'],
    progressionGroup: 'chair_legs',
    level: 4,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['calves'],
      secondary: []
    },
    region: 'legs',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[12,12], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'2×12' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_legs: 3 },
      next: 'chairlegs-l5-sit-to-stand',
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#standing-heel-raises-chair'
  },

  {
    id: 'chairlegs-l5-sit-to-stand',
    name: 'Sit-to-stand',
    aliases: ['Chair stand','Sit to stand','STS'],
    progressionGroup: 'chair_legs',
    level: 5,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['chair','wall'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['hamstrings','calves','rectus_abdominis']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: { sets:2, reps:[8,8], unit:'reps', tempo:'slow descent', rest:[45,60], freq:1, raw:'2×8' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: { chair_legs: 4 },
      next: null,
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'regress' },
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#sit-to-stand'
  },

  // ─── chair_core ladder ──────────────────────────────────────────────────────

  {
    id: 'chaircore-l1-seated-torso-rotation',
    name: 'Seated torso rotation',
    aliases: ['Seated trunk rotation','Seated oblique twist'],
    progressionGroup: 'chair_core',
    level: 1,
    pattern: 'core',
    plane: 'rotational',
    equipment: ['chair'],
    muscles: {
      primary: ['obliques','thoracic_extensors'],
      secondary: ['latissimus_dorsi','transverse_abdominis']
    },
    region: 'core',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: { sets:2, reps:[8,8], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'2×8/side' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {
      prereq: {},
      next: null,
      advanceCriteria: { cleanSessions: 5, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'lower_back_injury': 'regress' },
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-torso-rotation'
  },

  // ─── non-progression: mobility / balance / circulation / breath / standalone ──

  {
    id: 'chair-seated-marching',
    name: 'Seated marching',
    aliases: ['Seated march','Chair marching'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['chair'],
    muscles: {
      primary: ['hip_flexors','quadriceps'],
      secondary: ['rectus_abdominis','calves']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[20,20], unit:'reps', tempo:'moderate', rest:[30,30], freq:1, raw:'2×20 (10/leg)' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-marching'
  },

  {
    id: 'chair-wrist-circles',
    name: 'Wrist circles',
    aliases: ['Wrist rotations','Seated wrist circles'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['chair'],
    muscles: {
      primary: ['wrist_flexors','forearms'],
      secondary: []
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:1, reps:[10,10], unit:'each', tempo:'very slow', rest:[10,10], freq:1, raw:'10 each way' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#wrist-circles'
  },

  {
    id: 'chair-seated-ankle-circles',
    name: 'Seated ankle circles',
    aliases: ['Ankle rotations','Seated ankle circles'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['chair'],
    muscles: {
      primary: ['calves'],
      secondary: []
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite: { sets:1, reps:[10,10], unit:'each', tempo:'very slow', rest:[10,10], freq:1, raw:'10 each way/foot' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-ankle-circles'
  },

  {
    id: 'chair-seated-calf-pumps',
    name: 'Seated calf pumps',
    aliases: ['Ankle pumps','Seated calf pumps','Soleal venous pump'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['chair'],
    muscles: {
      primary: ['calves'],
      secondary: []
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[15,15], unit:'reps', tempo:'moderate', rest:[15,15], freq:1, raw:'2×15' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-calf-pumps'
  },

  {
    id: 'chair-standing-hip-abduction',
    name: 'Standing hip abduction (chair)',
    aliases: ['Standing side leg raise','Chair-supported hip abduction'],
    progressionGroup: null,
    level: null,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['chair'],
    muscles: {
      primary: ['gluteus_medius'],
      secondary: ['abductors']
    },
    region: 'legs',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[8,8], unit:'each', tempo:'slow', rest:[30,30], freq:1, raw:'2×8/leg' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#standing-hip-abduction-chair'
  },

  {
    id: 'chair-wall-sit-hold-45',
    name: 'Wall sit hold 45°',
    aliases: ['Wall sit 45 degrees','Lite wall sit'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['wall'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['calves','rectus_abdominis']
    },
    region: 'legs',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: { sets:2, reps:[10,15], unit:'sec', tempo:'hold at 45°', rest:[45,45], freq:1, raw:'2×10-15 sec' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: { 'knee_injury': 'block' },
    citation: 'ICFSR 2021; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-sit-hold-45'
  },

  {
    id: 'chair-standing-balance-hold',
    name: 'Standing balance hold (chair)',
    aliases: ['Single-leg balance (chair)','Fall-prevention balance hold'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['chair'],
    muscles: {
      primary: ['gluteus_medius','calves'],
      secondary: ['obliques','transverse_abdominis']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite: { sets:2, reps:[10,10], unit:'sec', tempo:'hold', rest:[30,30], freq:1, raw:'2×3/leg, 10s each' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#standing-balance-hold-chair'
  },

  {
    id: 'chair-seated-deep-breathing',
    name: 'Seated deep breathing',
    aliases: ['Diaphragmatic breathing','4-4-6 breathing'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['chair'],
    muscles: {
      primary: ['transverse_abdominis'],
      secondary: []
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: { sets:1, reps:[5,5], unit:'reps', tempo:'4/4/6 breath', rest:[0,0], freq:1, raw:'5 breath cycles' },
      cut: null, bulk: null, maintenance: null, agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'ICFSR 2021',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-deep-breathing'
  },

  // ── from hingecore ──
  // ─── HINGE PROGRESSION (7 levels) ───────────────────────────────────────────

  {
    id: 'hinge-l1-glute-bridge',
    name: 'Glute bridge',
    aliases: ['Glute bridge','Hip bridge','Two-foot glute bridge'],
    progressionGroup: 'hinge',
    level: 1,
    pattern: 'hinge',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','hamstrings'],
      secondary: ['rectus_abdominis','erector_spinae']
    },
    region: 'glutes',
    type: 'compound',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[10,10],  unit:'reps', tempo:'normal',  rest:[0,0],    freq:1, raw:'2×10' },
      cut:         { sets:3, reps:[12,15],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12-15' },
      bulk:        { sets:3, reps:[15,15],  unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×15' },
      maintenance: { sets:3, reps:[12,12],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×12' },
      agro:        { sets:3, reps:[15,15],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×15' }
    },
    progression: {
      prereq: {},
      next: 'hinge-l2-glute-bridge-single-leg',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#glute-bridge'
  },

  {
    id: 'hinge-l2-glute-bridge-single-leg',
    name: 'Glute bridge (single leg)',
    aliases: ['Single leg glute bridge','Single-leg glute bridge','Unilateral glute bridge'],
    progressionGroup: 'hinge',
    level: 2,
    pattern: 'hinge',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','hamstrings'],
      secondary: ['rectus_abdominis','erector_spinae']
    },
    region: 'glutes',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,12],  unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12/leg' },
      bulk:        { sets:3, reps:[12,12],  unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×12/leg' },
      maintenance: { sets:3, reps:[12,12],  unit:'perside', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×12/leg' },
      agro:        { sets:3, reps:[12,12],  unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×12/leg' }
    },
    progression: {
      prereq: { hinge: 1 },
      next: 'hinge-l3-good-morning-bodyweight',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#glute-bridge-single-leg'
  },

  {
    id: 'hinge-l3-good-morning-bodyweight',
    name: 'Good morning (bodyweight)',
    aliases: ['Good morning','Bodyweight good morning','Hip hinge'],
    progressionGroup: 'hinge',
    level: 3,
    pattern: 'hinge',
    plane: 'horizontal',
    equipment: ['none'],
    muscles: {
      primary: ['hamstrings','erector_spinae'],
      secondary: ['gluteus_maximus','rectus_abdominis']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,12],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12' },
      bulk:        { sets:3, reps:[12,12],  unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×12' },
      maintenance: { sets:3, reps:[12,12],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×12' },
      agro:        { sets:3, reps:[12,12],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×12' }
    },
    progression: {
      prereq: { hinge: 2 },
      next: 'hinge-l4-bodyweight-rdl',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'lower_back_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#good-morning-bodyweight'
  },

  {
    id: 'hinge-l4-bodyweight-rdl',
    name: 'Bodyweight RDL',
    aliases: ['Bodyweight RDL','Single-leg RDL','Single leg Romanian deadlift'],
    progressionGroup: 'hinge',
    level: 4,
    pattern: 'hinge',
    plane: 'horizontal',
    equipment: ['none'],
    muscles: {
      primary: ['hamstrings','gluteus_maximus'],
      secondary: ['rectus_abdominis','erector_spinae','calves']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,12],  unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×10-12/leg' },
      bulk:        { sets:3, reps:[10,12],  unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×10-12/leg' },
      maintenance: { sets:3, reps:[10,12],  unit:'perside', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×10-12/leg' },
      agro:        { sets:3, reps:[10,12],  unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×10-12/leg' }
    },
    progression: {
      prereq: { hinge: 3 },
      next: 'hinge-l5-glute-bridge-march',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#bodyweight-rdl'
  },

  {
    id: 'hinge-l5-glute-bridge-march',
    name: 'Glute bridge march',
    aliases: ['Glute bridge march','Marching glute bridge','Bridge march'],
    progressionGroup: 'hinge',
    level: 5,
    pattern: 'hinge',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','rectus_abdominis'],
      secondary: ['hamstrings','hip_flexors']
    },
    region: 'glutes',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[15,15],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×15' },
      bulk:        { sets:3, reps:[15,15],  unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×15' },
      maintenance: { sets:3, reps:[12,12],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×12' },
      agro:        { sets:3, reps:[15,15],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×15' }
    },
    progression: {
      prereq: { hinge: 4 },
      next: 'hinge-l6-nordic-hamstring-curl',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#glute-bridge-march'
  },

  {
    id: 'hinge-l6-nordic-hamstring-curl',
    name: 'Nordic hamstring curl',
    aliases: ['Nordic hamstring curl','Nordic curl','Russian leg curl'],
    progressionGroup: 'hinge',
    level: 6,
    pattern: 'hinge',
    plane: 'horizontal',
    equipment: ['none','bed'],
    muscles: {
      primary: ['hamstrings'],
      secondary: ['calves','gluteus_maximus','rectus_abdominis']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[3,5],  unit:'reps', tempo:'slow',      rest:[60,90],  freq:1, raw:'3×3-5' },
      bulk:        { sets:3, reps:[3,5],  unit:'reps', tempo:'5-0-X-0',   rest:[90,120], freq:1, raw:'3×3-5' },
      maintenance: { sets:3, reps:[3,5],  unit:'reps', tempo:'slow',      rest:[60,90],  freq:1, raw:'3×3-5' },
      agro:        { sets:3, reps:[3,5],  unit:'reps', tempo:'slow',      rest:[60,90],  freq:3, raw:'3×3-5' }
    },
    progression: {
      prereq: { hinge: 5 },
      next: 'hinge-l7-nordic-hamstring-curl-full',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'lower_back_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Schoenfeld 2015',
    libraryRef: 'WORKOUTS_LIBRARY.md#nordic-hamstring-curl'
  },

  {
    id: 'hinge-l7-nordic-hamstring-curl-full',
    name: 'Nordic hamstring curl (full)',
    aliases: ['Nordic hamstring curl (full)','Full Nordic curl','Concentric Nordic curl'],
    progressionGroup: 'hinge',
    level: 7,
    pattern: 'hinge',
    plane: 'horizontal',
    equipment: ['none','bed'],
    muscles: {
      primary: ['hamstrings'],
      secondary: ['calves','gluteus_maximus','rectus_abdominis']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[5,8],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×5-8' },
      bulk:        { sets:3, reps:[5,8],  unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:1, raw:'3×5-8' },
      maintenance: { sets:3, reps:[5,8],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×5-8' },
      agro:        { sets:3, reps:[5,8],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×5-8' }
    },
    progression: {
      prereq: { hinge: 6 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'lower_back_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#nordic-hamstring-curl-full'
  },

  // ─── CORE PROGRESSION (10 levels) ───────────────────────────────────────────

  {
    id: 'core-l1-dead-bug',
    name: 'Dead bug',
    aliases: ['Dead bug','Deadbug'],
    progressionGroup: 'core',
    level: 1,
    pattern: 'core',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['transverse_abdominis','rectus_abdominis'],
      secondary: ['hip_flexors','obliques']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[6,6],   unit:'perside', tempo:'normal',  rest:[0,0],  freq:1, raw:'2×6/side' },
      cut:         { sets:3, reps:[8,8],   unit:'perside', tempo:'normal',  rest:[60,60], freq:3, raw:'3×8/side' },
      bulk:        { sets:2, reps:[8,8],   unit:'perside', tempo:'3-1-2-0', rest:[60,60], freq:5, raw:'2×8/side' },
      maintenance: { sets:3, reps:[8,8],   unit:'perside', tempo:'normal',  rest:[60,60], freq:2, raw:'3×8/side' },
      agro:        { sets:3, reps:[8,8],   unit:'perside', tempo:'normal',  rest:[60,60], freq:6, raw:'3×8/side' }
    },
    progression: {
      prereq: {},
      next: 'core-l2-plank',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#dead-bug'
  },

  {
    id: 'core-l2-plank',
    name: 'Plank',
    aliases: ['Plank','Front plank','Forearm plank'],
    progressionGroup: 'core',
    level: 2,
    pattern: 'core',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','transverse_abdominis'],
      secondary: ['anterior_deltoid','gluteus_maximus','quadriceps']
    },
    region: 'core',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[30,45], unit:'sec', tempo:'hold', rest:[60,60], freq:3, raw:'3×30-45 sec' },
      bulk:        { sets:2, reps:[30,45], unit:'sec', tempo:'hold', rest:[60,60], freq:5, raw:'2×30-45 sec' },
      maintenance: { sets:3, reps:[30,30], unit:'sec', tempo:'hold', rest:[60,60], freq:2, raw:'3×30 sec' },
      agro:        { sets:3, reps:[30,45], unit:'sec', tempo:'hold', rest:[60,60], freq:6, raw:'3×30-45 sec' }
    },
    progression: {
      prereq: { core: 1 },
      next: 'core-l3-bicycle-crunch',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#plank'
  },

  {
    id: 'core-l3-bicycle-crunch',
    name: 'Bicycle crunch',
    aliases: ['Bicycle crunch','Bicycle crunches','Cycling crunch'],
    progressionGroup: 'core',
    level: 3,
    pattern: 'core',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['obliques','rectus_abdominis'],
      secondary: ['hip_flexors']
    },
    region: 'core',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[15,20], unit:'perside', tempo:'slow',     rest:[60,60], freq:3, raw:'3×15-20/side' },
      bulk:        { sets:2, reps:[15,20], unit:'perside', tempo:'3-1-2-0',  rest:[60,60], freq:5, raw:'2×15-20/side' },
      maintenance: { sets:3, reps:[15,15], unit:'perside', tempo:'slow',     rest:[60,60], freq:2, raw:'3×15/side' },
      agro:        { sets:3, reps:[15,20], unit:'perside', tempo:'slow',     rest:[60,60], freq:6, raw:'3×15-20/side' }
    },
    progression: {
      prereq: { core: 2 },
      next: 'core-l4-hollow-body-hold',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#bicycle-crunch'
  },

  {
    id: 'core-l4-hollow-body-hold',
    name: 'Hollow body hold',
    aliases: ['Hollow body hold','Hollow hold','Hollow body'],
    progressionGroup: 'core',
    level: 4,
    pattern: 'core',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','transverse_abdominis'],
      secondary: ['hip_flexors','quadriceps','serratus_anterior']
    },
    region: 'core',
    type: 'isometric',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,60], freq:3, raw:'3×20-30 sec' },
      bulk:        { sets:2, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,60], freq:5, raw:'2×20-30 sec' },
      maintenance: { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,60], freq:2, raw:'3×20-30 sec' },
      agro:        { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,60], freq:6, raw:'3×20-30 sec' }
    },
    progression: {
      prereq: { core: 3 },
      next: 'core-l5-hollow-body-rock',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#hollow-body-hold'
  },

  {
    id: 'core-l5-hollow-body-rock',
    name: 'Hollow body rock',
    aliases: ['Hollow body rock','Hollow rock','Hollow body rocks'],
    progressionGroup: 'core',
    level: 5,
    pattern: 'core',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis'],
      secondary: ['hip_flexors','serratus_anterior','transverse_abdominis']
    },
    region: 'core',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,10], unit:'reps', tempo:'controlled', rest:[60,60], freq:3, raw:'3×10' },
      bulk:        { sets:2, reps:[10,10], unit:'reps', tempo:'3-1-2-0',    rest:[60,60], freq:5, raw:'2×10' },
      maintenance: { sets:3, reps:[10,10], unit:'reps', tempo:'controlled', rest:[60,60], freq:2, raw:'3×10' },
      agro:        { sets:3, reps:[10,10], unit:'reps', tempo:'controlled', rest:[60,60], freq:6, raw:'3×10' }
    },
    progression: {
      prereq: { core: 4 },
      next: 'core-l6-leg-raises-lying',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'lower_back_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#hollow-body-rock'
  },

  {
    id: 'core-l6-leg-raises-lying',
    name: 'Leg raises (lying)',
    aliases: ['Leg raises (lying)','Lying leg raises','Lying leg raise'],
    progressionGroup: 'core',
    level: 6,
    pattern: 'core',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','hip_flexors'],
      secondary: ['transverse_abdominis']
    },
    region: 'core',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,12], unit:'reps', tempo:'controlled', rest:[60,60], freq:3, raw:'3×10-12' },
      bulk:        { sets:2, reps:[10,12], unit:'reps', tempo:'3-1-2-0',    rest:[60,60], freq:5, raw:'2×10-12' },
      maintenance: { sets:3, reps:[10,10], unit:'reps', tempo:'controlled', rest:[60,60], freq:2, raw:'3×10' },
      agro:        { sets:3, reps:[10,12], unit:'reps', tempo:'controlled', rest:[60,60], freq:6, raw:'3×10-12' }
    },
    progression: {
      prereq: { core: 5 },
      next: 'core-l7-lying-leg-raises-hip-lift',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#leg-raises-lying'
  },

  {
    id: 'core-l7-lying-leg-raises-hip-lift',
    name: 'Lying leg raises + hip lift',
    aliases: ['Lying leg raises + hip lift','Leg raise with hip lift','Reverse crunch'],
    progressionGroup: 'core',
    level: 7,
    pattern: 'core',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','hip_flexors'],
      secondary: ['obliques','transverse_abdominis']
    },
    region: 'core',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,12], unit:'reps', tempo:'controlled', rest:[60,60], freq:3, raw:'3×10-12' },
      bulk:        { sets:2, reps:[10,12], unit:'reps', tempo:'3-1-2-0',    rest:[60,60], freq:5, raw:'2×10-12' },
      maintenance: { sets:3, reps:[10,10], unit:'reps', tempo:'controlled', rest:[60,60], freq:2, raw:'3×10' },
      agro:        { sets:3, reps:[10,12], unit:'reps', tempo:'controlled', rest:[60,60], freq:6, raw:'3×10-12' }
    },
    progression: {
      prereq: { core: 6 },
      next: 'core-l8-l-sit-tuck-floor',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#lying-leg-raises-hip-lift'
  },

  {
    id: 'core-l8-l-sit-tuck-floor',
    name: 'L-sit tuck (floor)',
    aliases: ['L-sit tuck (floor)','L-sit tuck','Tuck L-sit'],
    progressionGroup: 'core',
    level: 8,
    pattern: 'core',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors','triceps','rectus_abdominis'],
      secondary: ['anterior_deltoid','wrist_flexors','serratus_anterior']
    },
    region: 'core',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,60], freq:3, raw:'3×15 sec' },
      bulk:        { sets:2, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,60], freq:5, raw:'2×15 sec' },
      maintenance: { sets:3, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,60], freq:2, raw:'3×15 sec' },
      agro:        { sets:3, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,60], freq:6, raw:'3×15 sec' }
    },
    progression: {
      prereq: { core: 7 },
      next: 'core-l9-dragon-flag-negative',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#l-sit-tuck-floor'
  },

  {
    id: 'core-l9-dragon-flag-negative',
    name: 'Dragon flag negative',
    aliases: ['Dragon flag negative','Dragon flag eccentric','Negative dragon flag'],
    progressionGroup: 'core',
    level: 9,
    pattern: 'core',
    plane: 'horizontal',
    equipment: ['none','bed'],
    muscles: {
      primary: ['rectus_abdominis','obliques','hip_flexors'],
      secondary: ['latissimus_dorsi','serratus_anterior','gluteus_maximus']
    },
    region: 'core',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[3,5], unit:'reps', tempo:'slow',    rest:[60,60], freq:3, raw:'3×3-5' },
      bulk:        { sets:2, reps:[3,5], unit:'reps', tempo:'5-0-X-0', rest:[60,60], freq:5, raw:'2×3-5' },
      maintenance: { sets:3, reps:[3,5], unit:'reps', tempo:'slow',    rest:[60,60], freq:2, raw:'3×3-5' },
      agro:        { sets:3, reps:[3,5], unit:'reps', tempo:'slow',    rest:[60,60], freq:6, raw:'3×3-5' }
    },
    progression: {
      prereq: { core: 8 },
      next: 'core-l10-full-l-sit',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block', 'lower_back_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Schoenfeld 2015',
    libraryRef: 'WORKOUTS_LIBRARY.md#dragon-flag-negative'
  },

  {
    id: 'core-l10-full-l-sit',
    name: 'Full L-sit',
    aliases: ['Full L-sit','L-sit','Full L sit'],
    progressionGroup: 'core',
    level: 10,
    pattern: 'core',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors','rectus_abdominis','triceps'],
      secondary: ['quadriceps','anterior_deltoid','serratus_anterior','wrist_flexors']
    },
    region: 'core',
    type: 'isometric',
    difficulty: 5,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury','elbow_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,15], unit:'sec', tempo:'hold', rest:[60,60], freq:3, raw:'3×10-15 sec' },
      bulk:        { sets:2, reps:[10,15], unit:'sec', tempo:'hold', rest:[60,60], freq:5, raw:'2×10-15 sec' },
      maintenance: { sets:3, reps:[10,10], unit:'sec', tempo:'hold', rest:[60,60], freq:2, raw:'3×10 sec' },
      agro:        { sets:3, reps:[10,15], unit:'sec', tempo:'hold', rest:[60,60], freq:6, raw:'3×10-15 sec' }
    },
    progression: {
      prereq: { core: 9 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#full-l-sit'
  },

  // ── from pushpull ──
  // ─── PUSH PROGRESSION ──────────────────────────────────────────────────────
  {
    id: 'push-l0-wall-push-up',
    name: 'Wall push-up',
    aliases: ['Wall pushup','Standing wall push-up'],
    progressionGroup: 'push',
    level: 0,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none','wall'],
    muscles: {
      primary: ['anterior_deltoid','triceps'],
      secondary: ['pectoralis_major','serratus_anterior']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[15,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×15' },
      bulk:        { sets:4, reps:[15,15], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×15' },
      maintenance: { sets:3, reps:[15,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×15' },
      agro:        { sets:3, reps:[15,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×15' }
    },
    progression: {
      prereq: {},
      next: 'push-l1-knee-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-push-up'
  },

  {
    id: 'push-l1-knee-push-up',
    name: 'Knee push-up',
    aliases: ['Knee pushup','Modified push-up'],
    progressionGroup: 'push',
    level: 1,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['pectoralis_major','triceps'],
      secondary: ['anterior_deltoid','rectus_abdominis']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12' },
      bulk:        { sets:4, reps:[12,12], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×12' },
      maintenance: { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12' },
      agro:        { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×12' }
    },
    progression: {
      prereq: { push: 0 },
      next: 'push-l2-standard-pushup',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#knee-push-up'
  },

  {
    id: 'push-l3-wide-push-up',
    name: 'Wide push-up',
    aliases: ['Wide pushup','Wide-grip push-up'],
    progressionGroup: 'push',
    level: 3,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none'],
    muscles: {
      primary: ['pectoralis_major'],
      secondary: ['triceps','anterior_deltoid']
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
      cut:         { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12' },
      bulk:        { sets:4, reps:[12,12], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×12' },
      maintenance: { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12' },
      agro:        { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×12' }
    },
    progression: {
      prereq: { push: 2 },
      next: 'push-l4-decline-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#wide-push-up'
  },

  {
    id: 'push-l4-decline-push-up',
    name: 'Decline push-up',
    aliases: ['Decline pushup','Feet-elevated push-up'],
    progressionGroup: 'push',
    level: 4,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none','chair','bed','step'],
    muscles: {
      primary: ['pectoralis_clavicular','anterior_deltoid'],
      secondary: ['triceps','rectus_abdominis']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×10-12' },
      bulk:        { sets:4, reps:[10,12], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×10-12' },
      maintenance: { sets:3, reps:[10,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×10-12' },
      agro:        { sets:3, reps:[10,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×10-12' }
    },
    progression: {
      prereq: { push: 3 },
      next: 'push-l5-diamond-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'weight>120': 'block', 'weight100-120': 'substitute' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#decline-push-up'
  },

  {
    id: 'push-l5-diamond-push-up',
    name: 'Diamond push-up',
    aliases: ['Diamond pushup','Triangle push-up','Close-grip push-up'],
    progressionGroup: 'push',
    level: 5,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none'],
    muscles: {
      primary: ['triceps'],
      secondary: ['pectoralis_major','anterior_deltoid']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      bulk:        { sets:4, reps:[8,10], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×8-10' },
      maintenance: { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      agro:        { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×8-10' }
    },
    progression: {
      prereq: { push: 4 },
      next: 'push-l6-archer-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'wrist_injury': 'block', 'wrist_tendinopathy': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#diamond-push-up'
  },

  {
    id: 'push-l6-archer-push-up',
    name: 'Archer push-up',
    aliases: ['Archer pushup'],
    progressionGroup: 'push',
    level: 6,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none'],
    muscles: {
      primary: ['pectoralis_major'],
      secondary: ['triceps','rectus_abdominis','obliques']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8/side' },
      bulk:        { sets:4, reps:[6,8], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×6-8/side' },
      maintenance: { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8/side' },
      agro:        { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×6-8/side' }
    },
    progression: {
      prereq: { push: 5 },
      next: 'push-l7-pike-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'first-4-weeks': 'block', 'shoulder_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#archer-push-up'
  },

  {
    id: 'push-l7-pike-push-up',
    name: 'Pike push-up',
    aliases: ['Pike pushup','Downward-dog push-up'],
    progressionGroup: 'push',
    level: 7,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid'],
      secondary: ['triceps','pectoralis_clavicular']
    },
    region: 'shoulders',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      bulk:        { sets:4, reps:[8,10], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×8-10' },
      maintenance: { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      agro:        { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×8-10' }
    },
    progression: {
      prereq: { push: 6 },
      next: 'push-l8-pseudo-planche-lean',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#pike-push-up'
  },

  {
    id: 'push-l8-pseudo-planche-lean',
    name: 'Pseudo-planche lean',
    aliases: ['Pseudo planche lean','Planche lean'],
    progressionGroup: 'push',
    level: 8,
    pattern: 'push',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','pectoralis_major','biceps'],
      secondary: ['rectus_abdominis','wrist_flexors','serratus_anterior']
    },
    region: 'shoulders',
    type: 'isometric',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[15,20], unit:'sec', tempo:'hold', rest:[60,90],  freq:2, raw:'3×15-20 sec' },
      bulk:        { sets:4, reps:[20,20], unit:'sec', tempo:'hold', rest:[90,120], freq:3, raw:'4×20 sec' },
      maintenance: { sets:3, reps:[15,20], unit:'sec', tempo:'hold', rest:[60,90],  freq:2, raw:'3×15-20 sec' },
      agro:        { sets:4, reps:[20,20], unit:'sec', tempo:'hold', rest:[60,90],  freq:3, raw:'4×20 sec' }
    },
    progression: {
      prereq: { push: 7 },
      next: 'push-l9-one-arm-push-up-assisted',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'wrist_injury': 'block', 'wrist_tendinopathy': 'block', 'first-4-weeks': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#pseudo-planche-lean'
  },

  {
    id: 'push-l9-one-arm-push-up-assisted',
    name: 'One-arm push-up (assisted)',
    aliases: ['One-arm pushup assisted','Assisted one-arm push-up','One arm push-up'],
    progressionGroup: 'push',
    level: 9,
    pattern: 'push',
    plane: 'horizontal',
    equipment: ['none','step'],
    muscles: {
      primary: ['pectoralis_major','triceps'],
      secondary: ['rectus_abdominis','obliques','anterior_deltoid']
    },
    region: 'chest',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','shoulder_injury','elbow_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×3-5/side' },
      bulk:        { sets:4, reps:[3,5], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×3-5/side' },
      maintenance: { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×3-5/side' },
      agro:        { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×3-5/side' }
    },
    progression: {
      prereq: { push: 8 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'first-4-weeks': 'block', 'shoulder_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#one-arm-push-up-assisted'
  },

  // ─── PULL PROGRESSION ──────────────────────────────────────────────────────
  {
    id: 'pull-l1-superman-hold',
    name: 'Superman hold',
    aliases: ['Superman','Prone back extension hold'],
    progressionGroup: 'pull',
    level: 1,
    pattern: 'pull',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['erector_spinae','posterior_deltoid'],
      secondary: ['gluteus_maximus','rhomboids','hamstrings']
    },
    region: 'back',
    type: 'isometric',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90],  freq:2, raw:'3×20-30 sec' },
      bulk:        { sets:4, reps:[30,30], unit:'sec', tempo:'hold', rest:[90,120], freq:3, raw:'4×30 sec' },
      maintenance: { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90],  freq:2, raw:'3×20-30 sec' },
      agro:        { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90],  freq:3, raw:'3×20-30 sec' }
    },
    progression: {
      prereq: {},
      next: 'pull-l2-prone-y-t-w-raises',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#superman-hold'
  },

  {
    id: 'pull-l2-prone-y-t-w-raises',
    name: 'Prone Y-T-W raises',
    aliases: ['Y-T-W raises','YTW raises','Prone YTW'],
    progressionGroup: 'pull',
    level: 2,
    pattern: 'pull',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['posterior_deltoid','trapezius_mid','trapezius_lower'],
      secondary: ['rhomboids','rotator_cuff']
    },
    region: 'back',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,10], unit:'each', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×10 each' },
      bulk:        { sets:4, reps:[10,10], unit:'each', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×10 each' },
      maintenance: { sets:3, reps:[10,10], unit:'each', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×10 each' },
      agro:        { sets:3, reps:[10,10], unit:'each', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×10 each' }
    },
    progression: {
      prereq: { pull: 1 },
      next: 'pull-l3-inverted-row-knees-bent',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Cools 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#prone-y-t-w-raises'
  },

  {
    id: 'pull-l3-inverted-row-knees-bent',
    name: 'Inverted row (knees bent)',
    aliases: ['Inverted row knees bent','Bent-knee inverted row','Table row (knees bent)'],
    progressionGroup: 'pull',
    level: 3,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['none','table'],
    muscles: {
      primary: ['latissimus_dorsi','rhomboids','biceps'],
      secondary: ['posterior_deltoid','forearms']
    },
    region: 'back',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','elbow_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      bulk:        { sets:4, reps:[8,10], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×8-10' },
      maintenance: { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      agro:        { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×8-10' }
    },
    progression: {
      prereq: { pull: 2 },
      next: 'pull-l4-inverted-row-legs-straight',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#inverted-row-knees-bent'
  },

  {
    id: 'pull-l4-inverted-row-legs-straight',
    name: 'Inverted row (legs straight)',
    aliases: ['Inverted row legs straight','Straight-leg inverted row','Table row (legs straight)'],
    progressionGroup: 'pull',
    level: 4,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['none','table'],
    muscles: {
      primary: ['latissimus_dorsi','rhomboids','biceps'],
      secondary: ['rectus_abdominis','posterior_deltoid']
    },
    region: 'back',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','elbow_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      bulk:        { sets:4, reps:[8,10], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×8-10' },
      maintenance: { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      agro:        { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×8-10' }
    },
    progression: {
      prereq: { pull: 3 },
      next: 'pull-l5-inverted-row-feet-elevated',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#inverted-row-legs-straight'
  },

  {
    id: 'pull-l5-inverted-row-feet-elevated',
    name: 'Inverted row (feet elevated)',
    aliases: ['Inverted row feet elevated','Feet-elevated inverted row'],
    progressionGroup: 'pull',
    level: 5,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['none','table','chair'],
    muscles: {
      primary: ['latissimus_dorsi','rhomboids','biceps'],
      secondary: ['rectus_abdominis','posterior_deltoid']
    },
    region: 'back',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','elbow_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[6,8], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8' },
      bulk:        { sets:4, reps:[6,8], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×6-8' },
      maintenance: { sets:3, reps:[6,8], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8' },
      agro:        { sets:3, reps:[6,8], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×6-8' }
    },
    progression: {
      prereq: { pull: 4 },
      next: 'pull-l6-scapular-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#inverted-row-feet-elevated'
  },

  {
    id: 'pull-l6-scapular-push-up',
    name: 'Scapular push-up',
    aliases: ['Scapular pushup','Scap push-up','Scapula push-up'],
    progressionGroup: 'pull',
    level: 6,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['none','floor'],
    muscles: {
      primary: ['serratus_anterior'],
      secondary: ['pectoralis_major','triceps','rhomboids']
    },
    region: 'back',
    type: 'isolation',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12' },
      bulk:        { sets:4, reps:[12,12], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×12' },
      maintenance: { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12' },
      agro:        { sets:3, reps:[12,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×12' }
    },
    progression: {
      prereq: { push: 2 },
      next: 'pull-l7-thread-the-needle',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Cools 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#scapular-push-up'
  },

  {
    id: 'pull-l7-thread-the-needle',
    name: 'Thread the needle',
    aliases: ['Thread-the-needle','Quadruped thread the needle'],
    progressionGroup: 'pull',
    level: 7,
    pattern: 'pull',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['thoracic_extensors','obliques'],
      secondary: ['posterior_deltoid','rhomboids','serratus_anterior']
    },
    region: 'back',
    type: 'mobility',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['shoulder_injury','neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8/side' },
      bulk:        { sets:4, reps:[8,8], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×8/side' },
      maintenance: { sets:3, reps:[8,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8/side' },
      agro:        { sets:3, reps:[8,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×8/side' }
    },
    progression: {
      prereq: { pull: 6 },
      next: 'pull-l8-towel-row',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#thread-the-needle'
  },

  {
    id: 'pull-l8-towel-row',
    name: 'Towel row',
    aliases: ['Door towel row','Towel door row'],
    progressionGroup: 'pull',
    level: 8,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['towel'],
    muscles: {
      primary: ['latissimus_dorsi','biceps','rhomboids'],
      secondary: ['forearms','posterior_deltoid']
    },
    region: 'back',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','elbow_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      bulk:        { sets:4, reps:[8,10], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×8-10' },
      maintenance: { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10' },
      agro:        { sets:3, reps:[8,10], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×8-10' }
    },
    progression: {
      prereq: { pull: 7 },
      next: 'pull-l9-archer-row-towel',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: {},
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#towel-row'
  },

  {
    id: 'pull-l9-archer-row-towel',
    name: 'Archer row (towel)',
    aliases: ['Archer row towel','Towel archer row','Unilateral towel row'],
    progressionGroup: 'pull',
    level: 9,
    pattern: 'pull',
    plane: 'horizontal',
    equipment: ['towel'],
    muscles: {
      primary: ['latissimus_dorsi','rhomboids'],
      secondary: ['biceps','forearms','rectus_abdominis','obliques']
    },
    region: 'back',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: true,
    contraindications: ['shoulder_injury','elbow_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8/side' },
      bulk:        { sets:4, reps:[6,8], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:3, raw:'4×6-8/side' },
      maintenance: { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8/side' },
      agro:        { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×6-8/side' }
    },
    progression: {
      prereq: { pull: 8 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'first-4-weeks': 'block', 'shoulder_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#archer-row-towel'
  },

  // ── from shouldersquat ──
  // ─── SHOULDER PROGRESSION (6 levels) ──────────────────────────────────────

  {
    id: 'shoulder-l1-pike-push-up-bent-knee',
    name: 'Pike push-up (bent knee)',
    aliases: ['Pike push-up bent knee','Bent-knee pike push-up'],
    progressionGroup: 'shoulder',
    level: 1,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid'],
      secondary: ['triceps','pectoralis_clavicular']
    },
    region: 'shoulders',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','wrist_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,8],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×8' },
      bulk:        { sets:3, reps:[8,8],  unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×8' },
      maintenance: { sets:3, reps:[8,8],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×8' },
      agro:        { sets:3, reps:[8,8],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×8' }
    },
    progression: {
      prereq: { push: 2 },
      next: 'shoulder-l2-pike-push-up-full',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block', 'wrist_injury': 'substitute' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#pike-push-up-bent-knee'
  },

  {
    id: 'shoulder-l2-pike-push-up-full',
    name: 'Pike push-up (full)',
    aliases: ['Pike push-up','Full pike push-up'],
    progressionGroup: 'shoulder',
    level: 2,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid'],
      secondary: ['triceps','pectoralis_clavicular','rectus_abdominis']
    },
    region: 'shoulders',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','wrist_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,10],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×8-10' },
      bulk:        { sets:3, reps:[10,10], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×10' },
      maintenance: { sets:3, reps:[8,10],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×8-10' },
      agro:        { sets:3, reps:[8,10],  unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×8-10' }
    },
    progression: {
      prereq: { shoulder: 1 },
      next: 'shoulder-l3-decline-pike-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block', 'wrist_injury': 'substitute' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#pike-push-up-full'
  },

  {
    id: 'shoulder-l3-decline-pike-push-up',
    name: 'Decline pike push-up',
    aliases: ['Feet-elevated pike push-up','Elevated pike push-up'],
    progressionGroup: 'shoulder',
    level: 3,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['none','chair','bed','floor'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid'],
      secondary: ['triceps','pectoralis_clavicular','rectus_abdominis']
    },
    region: 'shoulders',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','wrist_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[6,8], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×6-8' },
      bulk:        { sets:3, reps:[8,8], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×8' },
      maintenance: { sets:3, reps:[6,8], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×6-8' },
      agro:        { sets:3, reps:[6,8], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×6-8' }
    },
    progression: {
      prereq: { shoulder: 2 },
      next: 'shoulder-l4-wall-handstand-hold',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block', 'wrist_injury': 'substitute', 'weight>120': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#decline-pike-push-up'
  },

  {
    id: 'shoulder-l4-wall-handstand-hold',
    name: 'Wall handstand hold',
    aliases: ['Wall handstand','Handstand hold (wall)'],
    progressionGroup: 'shoulder',
    level: 4,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['none','wall','floor'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','triceps'],
      secondary: ['rectus_abdominis','trapezius_upper','forearms']
    },
    region: 'shoulders',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90],  freq:1, raw:'3×20-30 sec' },
      bulk:        { sets:3, reps:[30,30], unit:'sec', tempo:'hold', rest:[90,120], freq:2, raw:'3×30 sec' },
      maintenance: { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90],  freq:1, raw:'3×20-30 sec' },
      agro:        { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90],  freq:1, raw:'3×20-30 sec' }
    },
    progression: {
      prereq: { shoulder: 3 },
      next: 'shoulder-l5-wall-handstand-push-up-partial',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block', 'wrist_injury': 'block', 'wrist_tendinopathy': 'block', 'weight>120': 'block', 'age>=65': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-handstand-hold'
  },

  {
    id: 'shoulder-l5-wall-handstand-push-up-partial',
    name: 'Wall handstand push-up (partial)',
    aliases: ['Partial wall HSPU','Wall HSPU (partial)'],
    progressionGroup: 'shoulder',
    level: 5,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['none','wall','floor','towel'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','triceps'],
      secondary: ['trapezius_upper','rectus_abdominis']
    },
    region: 'shoulders',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','wrist_injury','wrist_tendinopathy','neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[3,5], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×3-5' },
      bulk:        { sets:3, reps:[5,5], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×5' },
      maintenance: { sets:3, reps:[3,5], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×3-5' },
      agro:        { sets:3, reps:[3,5], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×3-5' }
    },
    progression: {
      prereq: { shoulder: 4 },
      next: 'shoulder-l6-full-handstand-push-up',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block', 'wrist_injury': 'block', 'wrist_tendinopathy': 'block', 'weight>120': 'block', 'age>=65': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-handstand-push-up-partial'
  },

  {
    id: 'shoulder-l6-full-handstand-push-up',
    name: 'Full handstand push-up',
    aliases: ['Full HSPU','Handstand push-up','Wall HSPU (full)'],
    progressionGroup: 'shoulder',
    level: 6,
    pattern: 'push',
    plane: 'vertical',
    equipment: ['none','wall','floor','towel'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','triceps'],
      secondary: ['trapezius_upper','rectus_abdominis','pectoralis_clavicular']
    },
    region: 'shoulders',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury','wrist_injury','wrist_tendinopathy','neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[3,5], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×3-5' },
      bulk:        { sets:3, reps:[5,5], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'3×5' },
      maintenance: { sets:3, reps:[3,5], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×3-5' },
      agro:        { sets:3, reps:[3,5], unit:'reps', tempo:'normal',  rest:[60,90],  freq:1, raw:'3×3-5' }
    },
    progression: {
      prereq: { shoulder: 5 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'shoulder_injury': 'block', 'wrist_injury': 'block', 'wrist_tendinopathy': 'block', 'weight>120': 'block', 'age>=65': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#full-handstand-push-up'
  },

  // ─── SQUAT PROGRESSION (9 levels) ─────────────────────────────────────────

  {
    id: 'squat-l1-wall-squat-hold',
    name: 'Wall squat (hold)',
    aliases: ['Wall sit','Wall squat hold','Wall sit hold'],
    progressionGroup: 'squat',
    level: 1,
    pattern: 'squat',
    plane: 'isometric',
    equipment: ['none','wall'],
    muscles: {
      primary: ['quadriceps'],
      secondary: ['gluteus_maximus','hamstrings']
    },
    region: 'legs',
    type: 'isometric',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[30,30],   unit:'sec', tempo:'hold', rest:[0,0],     freq:1, raw:'2×30 sec' },
      cut:         { sets:3, reps:[30,45],   unit:'sec', tempo:'hold', rest:[60,90],   freq:2, raw:'3×30-45 sec' },
      bulk:        { sets:4, reps:[45,45],   unit:'sec', tempo:'hold', rest:[90,120],  freq:2, raw:'4×45 sec' },
      maintenance: { sets:3, reps:[30,45],   unit:'sec', tempo:'hold', rest:[60,90],   freq:2, raw:'3×30-45 sec' },
      agro:        { sets:3, reps:[30,45],   unit:'sec', tempo:'hold', rest:[60,90],   freq:3, raw:'3×30-45 sec' }
    },
    progression: {
      prereq: {},
      next: 'squat-l2-box-squat',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'regress' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-squat-hold'
  },

  {
    id: 'squat-l2-box-squat',
    name: 'Box squat',
    aliases: ['Chair squat','Box squat (chair)'],
    progressionGroup: 'squat',
    level: 2,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none','chair'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['hamstrings','rectus_abdominis']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×10-12' },
      bulk:        { sets:4, reps:[10,12], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×10-12' },
      maintenance: { sets:3, reps:[10,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×10-12' },
      agro:        { sets:3, reps:[10,12], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×10-12' }
    },
    progression: {
      prereq: { squat: 1 },
      next: 'squat-l3-bodyweight-squat-partial',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'regress' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#box-squat'
  },

  {
    id: 'squat-l3-bodyweight-squat-partial',
    name: 'Bodyweight squat (partial)',
    aliases: ['Partial squat','Half squat','Bodyweight squat partial'],
    progressionGroup: 'squat',
    level: 3,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['hamstrings','rectus_abdominis']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[12,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12-15' },
      bulk:        { sets:4, reps:[12,15], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×12-15' },
      maintenance: { sets:3, reps:[12,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×12-15' },
      agro:        { sets:3, reps:[12,15], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×12-15' }
    },
    progression: {
      prereq: { squat: 2 },
      next: 'squat-l4-bodyweight-squat-full',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'regress' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#bodyweight-squat-partial'
  },

  {
    id: 'squat-l4-bodyweight-squat-full',
    name: 'Bodyweight squat (full)',
    aliases: ['Bodyweight squat','Full squat','Air squat','Ass to grass squat'],
    progressionGroup: 'squat',
    level: 4,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus','adductors'],
      secondary: ['rectus_abdominis','erector_spinae','hamstrings']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[15,20], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×15-20' },
      bulk:        { sets:4, reps:[15,20], unit:'reps', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×15-20' },
      maintenance: { sets:3, reps:[15,20], unit:'reps', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×15-20' },
      agro:        { sets:3, reps:[15,20], unit:'reps', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×15-20' }
    },
    progression: {
      prereq: { squat: 3 },
      next: 'squat-l5-jump-squat',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'regress' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#bodyweight-squat-full'
  },

  {
    id: 'squat-l5-jump-squat',
    name: 'Jump squat',
    aliases: ['Jump squats','Squat jump','Plyometric squat'],
    progressionGroup: 'squat',
    level: 5,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['calves','rectus_abdominis','hip_flexors']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: true,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[10,10], unit:'reps', tempo:'explosive', rest:[60,90],  freq:2, raw:'3×10' },
      bulk:        { sets:4, reps:[10,10], unit:'reps', tempo:'explosive', rest:[90,120], freq:2, raw:'4×10' },
      maintenance: { sets:3, reps:[10,10], unit:'reps', tempo:'explosive', rest:[60,90],  freq:2, raw:'3×10' },
      agro:        { sets:3, reps:[10,10], unit:'reps', tempo:'explosive', rest:[60,90],  freq:3, raw:'3×10' }
    },
    progression: {
      prereq: { squat: 4 },
      next: 'squat-l6-bulgarian-split-squat',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'block', 'weight>=100': 'substitute', 'age>=65': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#jump-squat'
  },

  {
    id: 'squat-l6-bulgarian-split-squat',
    name: 'Bulgarian split squat',
    aliases: ['Rear-foot-elevated split squat','Bulgarian squat'],
    progressionGroup: 'squat',
    level: 6,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none','chair'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['rectus_abdominis','hip_flexors','adductors']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[8,10], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10/leg' },
      bulk:        { sets:4, reps:[8,10], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×8-10/leg' },
      maintenance: { sets:3, reps:[8,10], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×8-10/leg' },
      agro:        { sets:3, reps:[8,10], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×8-10/leg' }
    },
    progression: {
      prereq: { squat: 5, hinge: 2 },
      next: 'squat-l7-cossack-squat',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#bulgarian-split-squat'
  },

  {
    id: 'squat-l7-cossack-squat',
    name: 'Cossack squat',
    aliases: ['Cossack squats','Lateral squat'],
    progressionGroup: 'squat',
    level: 7,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','adductors','gluteus_maximus'],
      secondary: ['hip_flexors','hamstrings']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8/side' },
      bulk:        { sets:4, reps:[6,8], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×6-8/side' },
      maintenance: { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×6-8/side' },
      agro:        { sets:3, reps:[6,8], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×6-8/side' }
    },
    progression: {
      prereq: { squat: 6 },
      next: 'squat-l8-pistol-squat-assisted',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#cossack-squat'
  },

  {
    id: 'squat-l8-pistol-squat-assisted',
    name: 'Pistol squat (assisted)',
    aliases: ['Assisted pistol squat','Supported single-leg squat'],
    progressionGroup: 'squat',
    level: 8,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none','wall'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['rectus_abdominis','hip_flexors']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×3-5/leg' },
      bulk:        { sets:4, reps:[3,5], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×3-5/leg' },
      maintenance: { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×3-5/leg' },
      agro:        { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×3-5/leg' }
    },
    progression: {
      prereq: { squat: 7 },
      next: 'squat-l9-pistol-squat-full',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#pistol-squat-assisted'
  },

  {
    id: 'squat-l9-pistol-squat-full',
    name: 'Pistol squat (full)',
    aliases: ['Pistol squat','Full pistol squat','Single-leg squat'],
    progressionGroup: 'squat',
    level: 9,
    pattern: 'squat',
    plane: 'vertical',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['rectus_abdominis','hip_flexors']
    },
    region: 'legs',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×3-5/leg' },
      bulk:        { sets:4, reps:[3,5], unit:'perside', tempo:'3-1-2-0', rest:[90,120], freq:2, raw:'4×3-5/leg' },
      maintenance: { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:2, raw:'3×3-5/leg' },
      agro:        { sets:3, reps:[3,5], unit:'perside', tempo:'normal',  rest:[60,90],  freq:3, raw:'3×3-5/leg' }
    },
    progression: {
      prereq: { squat: 8 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 0.9 }
    },
    safetyOverrides: { 'knee_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#pistol-squat-full'
  },

  // ── from skills ──
  // ─── CROW STAND (skill_crow) — L2, L3, L4 (L1 = gold-standard example) ───────
  {
    id: 'skillcrow-l2-tuck-hold-feet-lifted',
    name: 'Tuck hold (feet lifted)',
    aliases: ['Crow tuck hold (feet lifted)'],
    progressionGroup: 'skill_crow',
    level: 2,
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
      agro: { sets:4, reps:[15,20], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'4×15-20 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: 'skillcrow-l3-crow-one-leg-extended',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#tuck-hold-feet-lifted'
  },
  {
    id: 'skillcrow-l3-crow-one-leg-extended',
    name: 'Crow (one leg extended)',
    aliases: ['Crow one leg extended'],
    progressionGroup: 'skill_crow',
    level: 3,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','rectus_abdominis'],
      secondary: ['wrist_flexors','hip_flexors','triceps']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[10,10], unit:'perside', tempo:'hold', rest:[60,90], freq:1, raw:'3×10 sec/side' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: 'skillcrow-l4-full-crow-stand',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#crow-one-leg-extended'
  },
  {
    id: 'skillcrow-l4-full-crow-stand',
    name: 'Full crow stand',
    aliases: ['Crow stand','Full crow'],
    progressionGroup: 'skill_crow',
    level: 4,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','wrist_flexors','rectus_abdominis'],
      secondary: ['triceps','finger_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[20,20], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×20 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#full-crow-stand'
  },

  // ─── HANDSTAND (skill_handstand) — L1–L4 ────────────────────────────────────
  {
    id: 'skillhandstand-l1-wall-handstand-hold',
    name: 'Wall handstand hold',
    aliases: ['Wall handstand hold (skill)'],
    progressionGroup: 'skill_handstand',
    level: 1,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','wall'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','triceps'],
      secondary: ['rectus_abdominis','trapezius_upper','forearms','wrist_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×20-30 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 3 },
      next: 'skillhandstand-l2-wall-handstand-belly-to-wall',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-handstand-hold'
  },
  {
    id: 'skillhandstand-l2-wall-handstand-belly-to-wall',
    name: 'Wall handstand (belly to wall)',
    aliases: ['Belly-to-wall handstand'],
    progressionGroup: 'skill_handstand',
    level: 2,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','wall'],
    muscles: {
      primary: ['anterior_deltoid','triceps','rectus_abdominis'],
      secondary: ['trapezius_upper','wrist_flexors','serratus_anterior']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[20,20], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×20 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 3 },
      next: 'skillhandstand-l3-kick-up-practice',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-handstand-belly-to-wall'
  },
  {
    id: 'skillhandstand-l3-kick-up-practice',
    name: 'Kick-up practice',
    aliases: ['Handstand kick-up practice'],
    progressionGroup: 'skill_handstand',
    level: 3,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','wall'],
    muscles: {
      primary: ['anterior_deltoid'],
      secondary: ['rectus_abdominis','wrist_flexors','hip_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:5, reps:[1,1], unit:'attempts', tempo:'hold', rest:[60,90], freq:1, raw:'5 attempts' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 3 },
      next: 'skillhandstand-l4-freestanding-hold-attempts',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022',
    libraryRef: 'WORKOUTS_LIBRARY.md#kick-up-practice'
  },
  {
    id: 'skillhandstand-l4-freestanding-hold-attempts',
    name: 'Freestanding hold attempts',
    aliases: ['Freestanding handstand hold attempts'],
    progressionGroup: 'skill_handstand',
    level: 4,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','rectus_abdominis','wrist_flexors'],
      secondary: ['finger_flexors','hip_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:5, reps:[1,1], unit:'attempts', tempo:'hold', rest:[60,90], freq:1, raw:'5 × max hold' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 3 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'age>=50': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#freestanding-hold-attempts'
  },

  // ─── L-SIT (skill_lsit) — L1–L3 ─────────────────────────────────────────────
  {
    id: 'skilllsit-l1-l-sit-tuck',
    name: 'L-sit tuck',
    aliases: ['L-sit tuck (skill)'],
    progressionGroup: 'skill_lsit',
    level: 1,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors','triceps','rectus_abdominis'],
      secondary: ['anterior_deltoid','wrist_flexors','serratus_anterior']
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
      agro: { sets:4, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'4×15 sec' }
    },
    progression: {
      prereq: { core: 4 },
      next: 'skilllsit-l2-l-sit-one-leg-extended',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#l-sit-tuck'
  },
  {
    id: 'skilllsit-l2-l-sit-one-leg-extended',
    name: 'L-sit one leg extended',
    aliases: ['L-sit (one leg extended)'],
    progressionGroup: 'skill_lsit',
    level: 2,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors','rectus_abdominis','triceps'],
      secondary: ['anterior_deltoid','wrist_flexors','quadriceps']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: true,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[10,10], unit:'perside', tempo:'hold', rest:[60,90], freq:1, raw:'3×10 sec/side' }
    },
    progression: {
      prereq: { core: 4 },
      next: 'skilllsit-l3-full-l-sit',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#l-sit-one-leg-extended'
  },
  {
    id: 'skilllsit-l3-full-l-sit',
    name: 'Full L-sit',
    aliases: ['Full L-sit (skill)','L-sit'],
    progressionGroup: 'skill_lsit',
    level: 3,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors','rectus_abdominis','triceps'],
      secondary: ['quadriceps','anterior_deltoid','wrist_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 5,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[10,15], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×10-15 sec' }
    },
    progression: {
      prereq: { core: 4 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#full-l-sit'
  },

  // ─── PLANCHE (skill_planche) — L1–L4 ────────────────────────────────────────
  {
    id: 'skillplanche-l1-pseudo-planche-lean',
    name: 'Pseudo-planche lean',
    aliases: ['Pseudo-planche lean (skill)'],
    progressionGroup: 'skill_planche',
    level: 1,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','pectoralis_major'],
      secondary: ['rectus_abdominis','wrist_flexors','serratus_anterior']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:4, reps:[20,20], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'4×20 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: 'skillplanche-l2-planche-lean-deeper',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#pseudo-planche-lean'
  },
  {
    id: 'skillplanche-l2-planche-lean-deeper',
    name: 'Planche lean (deeper)',
    aliases: ['Deeper planche lean'],
    progressionGroup: 'skill_planche',
    level: 2,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','pectoralis_major'],
      secondary: ['rectus_abdominis','wrist_flexors','serratus_anterior']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:4, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'4×15 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: 'skillplanche-l3-tuck-planche',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#planche-lean-deeper'
  },
  {
    id: 'skillplanche-l3-tuck-planche',
    name: 'Tuck planche',
    aliases: ['Tuck planche hold'],
    progressionGroup: 'skill_planche',
    level: 3,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','pectoralis_major','rectus_abdominis'],
      secondary: ['triceps','wrist_flexors','serratus_anterior']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[10,10], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×10 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: 'skillplanche-l4-straddle-planche',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'age>=50': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#tuck-planche'
  },
  {
    id: 'skillplanche-l4-straddle-planche',
    name: 'Straddle planche',
    aliases: ['Straddle planche hold'],
    progressionGroup: 'skill_planche',
    level: 4,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','pectoralis_major','rectus_abdominis'],
      secondary: ['adductors','triceps','wrist_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[5,5], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×5 sec' }
    },
    progression: {
      prereq: { core: 4, push: 5 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'age>=50': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#straddle-planche'
  },

  // ─── PRESS TO HANDSTAND (skill_press) — L1–L4 (dynamic → vertical/compound) ──
  {
    id: 'skillpress-l1-elevated-pike-press',
    name: 'Elevated pike press',
    aliases: ['Elevated pike press'],
    progressionGroup: 'skill_press',
    level: 1,
    pattern: 'skill',
    plane: 'vertical',
    equipment: ['none','chair','bed'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','triceps'],
      secondary: ['trapezius_upper','rectus_abdominis','serratus_anterior']
    },
    region: 'skill',
    type: 'compound',
    difficulty: 3,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[6,8], unit:'reps', tempo:'controlled', rest:[60,90], freq:1, raw:'3×6-8' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 4 },
      next: 'skillpress-l2-wall-handstand-negative',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#elevated-pike-press'
  },
  {
    id: 'skillpress-l2-wall-handstand-negative',
    name: 'Wall handstand negative',
    aliases: ['Wall handstand negative'],
    progressionGroup: 'skill_press',
    level: 2,
    pattern: 'skill',
    plane: 'vertical',
    equipment: ['none','wall'],
    muscles: {
      primary: ['anterior_deltoid','triceps','lateral_deltoid'],
      secondary: ['rectus_abdominis','trapezius_upper','wrist_flexors']
    },
    region: 'skill',
    type: 'compound',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[3,5], unit:'reps', tempo:'5-sec eccentric', rest:[60,90], freq:1, raw:'3×3-5' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 4 },
      next: 'skillpress-l3-straddle-press-negative-wall',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019; Schoenfeld 2015',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-handstand-negative'
  },
  {
    id: 'skillpress-l3-straddle-press-negative-wall',
    name: 'Straddle press negative (wall)',
    aliases: ['Straddle press negative'],
    progressionGroup: 'skill_press',
    level: 3,
    pattern: 'skill',
    plane: 'vertical',
    equipment: ['none','wall'],
    muscles: {
      primary: ['anterior_deltoid','rectus_abdominis','triceps'],
      secondary: ['hip_flexors','adductors','trapezius_upper','wrist_flexors']
    },
    region: 'skill',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[3,5], unit:'reps', tempo:'controlled', rest:[60,90], freq:1, raw:'3×3-5' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 4 },
      next: 'skillpress-l4-freestanding-press-to-handstand',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'age>=50': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#straddle-press-negative-wall'
  },
  {
    id: 'skillpress-l4-freestanding-press-to-handstand',
    name: 'Freestanding press to handstand',
    aliases: ['Press to handstand'],
    progressionGroup: 'skill_press',
    level: 4,
    pattern: 'skill',
    plane: 'vertical',
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','rectus_abdominis','triceps'],
      secondary: ['hip_flexors','adductors','trapezius_upper','wrist_flexors']
    },
    region: 'skill',
    type: 'compound',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:5, reps:[1,1], unit:'attempts', tempo:'controlled', rest:[90,90], freq:1, raw:'5 × attempts' }
    },
    progression: {
      prereq: { core: 4, push: 5, shoulder: 4 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'age>=50': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#freestanding-press-to-handstand'
  },

  // ─── BRIDGE (skill_bridge) — L1–L4 (posterior chain → isometric) ────────────
  {
    id: 'skillbridge-l1-glute-bridge-hold',
    name: 'Glute bridge hold',
    aliases: ['Glute bridge hold'],
    progressionGroup: 'skill_bridge',
    level: 1,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','erector_spinae','hamstrings'],
      secondary: ['rectus_abdominis','posterior_deltoid']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[30,45], unit:'sec', tempo:'hold', rest:[60,90], freq:2, raw:'3×30-45 sec' }
    },
    progression: {
      prereq: { core: 4, hinge: 4 },
      next: 'skillbridge-l2-short-bridge-crown-support',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#glute-bridge-hold'
  },
  {
    id: 'skillbridge-l2-short-bridge-crown-support',
    name: 'Short bridge (crown support)',
    aliases: ['Short bridge','Crown-support bridge'],
    progressionGroup: 'skill_bridge',
    level: 2,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','erector_spinae','anterior_deltoid'],
      secondary: ['triceps','hamstrings','thoracic_extensors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 3,
    jointImpact: 'moderate',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90], freq:2, raw:'3×20-30 sec' }
    },
    progression: {
      prereq: { core: 4, hinge: 4 },
      next: 'skillbridge-l3-full-bridge-hold',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'lower_back_injury': 'block', 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#short-bridge-crown-support'
  },
  {
    id: 'skillbridge-l3-full-bridge-hold',
    name: 'Full bridge hold',
    aliases: ['Full bridge','Backbend bridge'],
    progressionGroup: 'skill_bridge',
    level: 3,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','erector_spinae','anterior_deltoid','triceps'],
      secondary: ['hamstrings','thoracic_extensors','wrist_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 4,
    jointImpact: 'high',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[15,20], unit:'sec', tempo:'hold', rest:[60,90], freq:2, raw:'3×15-20 sec' }
    },
    progression: {
      prereq: { core: 4, hinge: 4 },
      next: 'skillbridge-l4-bridge-with-single-leg-lift',
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'lower_back_injury': 'block', 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#full-bridge-hold'
  },
  {
    id: 'skillbridge-l4-bridge-with-single-leg-lift',
    name: 'Bridge with single-leg lift',
    aliases: ['Single-leg bridge','One-leg bridge lift'],
    progressionGroup: 'skill_bridge',
    level: 4,
    pattern: 'skill',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','erector_spinae','anterior_deltoid'],
      secondary: ['hamstrings','rectus_abdominis','triceps','wrist_flexors']
    },
    region: 'skill',
    type: 'isometric',
    difficulty: 5,
    jointImpact: 'high',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury','wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null, cut: null, bulk: null, maintenance: null,
      agro: { sets:3, reps:[5,8], unit:'perside', tempo:'hold', rest:[60,90], freq:2, raw:'3×5-8 sec/side' }
    },
    progression: {
      prereq: { core: 4, hinge: 4 },
      next: null,
      advanceCriteria: { cleanSessions: 3, repTargetPct: 1.0 }
    },
    safetyOverrides: { 'lower_back_injury': 'block', 'age>=65': 'block', 'weight>120': 'block', 'wrist_injury': 'block' },
    citation: 'Kotarsky 2018; Plotkin 2022; Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#bridge-with-single-leg-lift'
  },

  // ── from warm_cool_iso_neck ──
  // ═══ ISOMETRIC FINISHERS (5) ═══════════════════════════════════════════════

  {
    id: 'iso-push-up-hold-at-bottom',
    name: 'Push-up hold at bottom',
    aliases: ['Bottom push-up hold','Push-up isometric hold'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['pectoralis_major','triceps','anterior_deltoid'],
      secondary: ['rectus_abdominis','serratus_anterior']
    },
    region: 'chest',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:3, reps:[10,15], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'3×10-15 sec' },
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#push-up-hold-at-bottom'
  },

  {
    id: 'iso-deep-squat-hold',
    name: 'Deep squat hold',
    aliases: ['Bottom squat hold','Deep squat isometric'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus','hip_flexors'],
      secondary: ['adductors','rectus_abdominis','calves']
    },
    region: 'legs',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk:        { sets:3, reps:[20,30], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×20-30 sec' },
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#deep-squat-hold'
  },

  {
    id: 'iso-wall-sit-isometric-extended-hold',
    name: 'Wall sit isometric (extended hold)',
    aliases: ['Wall sit','Wall sit hold','Extended wall sit'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none','wall'],
    muscles: {
      primary: ['quadriceps','gluteus_maximus'],
      secondary: ['calves','rectus_abdominis','hip_flexors']
    },
    region: 'legs',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[15,20], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'2×15-20 sec' },
      cut:         { sets:3, reps:[30,45], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'3×30-45 sec' },
      bulk:        { sets:3, reps:[45,45], unit:'sec', tempo:'hold', rest:[60,90], freq:1, raw:'3×45 sec' },
      maintenance: { sets:2, reps:[30,30], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'2×30 sec' },
      agro:        { sets:2, reps:[45,45], unit:'sec', tempo:'hold', rest:[30,45], freq:1, raw:'2×45 sec' }
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'regress', 'weight>100': 'regress', 'knee_injury': 'block' },
    citation: 'Oranchuk 2019 (PubMed 30580468); Sato 2022 (PubMed 35311855)',
    libraryRef: 'WORKOUTS_LIBRARY.md#wall-sit-isometric-extended-hold'
  },

  {
    id: 'iso-superman-hold-extended',
    name: 'Superman hold (extended)',
    aliases: ['Superman hold','Prone trunk extension hold'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['erector_spinae','gluteus_maximus','posterior_deltoid'],
      secondary: ['hamstrings','trapezius_mid','rhomboids']
    },
    region: 'core',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[10,15], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'2×10-15 sec' },
      cut:         { sets:3, reps:[20,20], unit:'sec', tempo:'hold', rest:[45,45], freq:1, raw:'3×20 sec' },
      bulk:        { sets:3, reps:[30,30], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'3×30 sec' },
      maintenance: { sets:3, reps:[20,20], unit:'sec', tempo:'hold', rest:[45,45], freq:1, raw:'3×20 sec' },
      agro:        { sets:3, reps:[30,30], unit:'sec', tempo:'hold', rest:[30,45], freq:2, raw:'3×30 sec' }
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'regress', 'lower_back_injury': 'regress' },
    citation: 'Oranchuk 2019 (PubMed 30580468)',
    libraryRef: 'WORKOUTS_LIBRARY.md#superman-hold-extended'
  },

  {
    id: 'iso-plank-hold-extended-duration',
    name: 'Plank hold (extended duration)',
    aliases: ['Plank hold','Extended plank','Plank finisher'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','transverse_abdominis','obliques'],
      secondary: ['anterior_deltoid','gluteus_maximus','serratus_anterior']
    },
    region: 'core',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[15,15], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'2×15 sec' },
      cut:         { sets:2, reps:[45,60], unit:'sec', tempo:'hold', rest:[45,45], freq:1, raw:'2×45-60 sec' },
      bulk:        { sets:2, reps:[60,90], unit:'sec', tempo:'hold', rest:[60,60], freq:1, raw:'2×60-90 sec' },
      maintenance: { sets:2, reps:[45,45], unit:'sec', tempo:'hold', rest:[45,45], freq:1, raw:'2×45 sec' },
      agro:        { sets:2, reps:[30,45], unit:'sec', tempo:'hold', rest:[30,45], freq:2, raw:'2×30-45 sec' }
    },
    progression: {},
    safetyOverrides: { 'age>=65': 'regress', 'weight>120': 'regress', 'lower_back_injury': 'regress' },
    citation: 'Oranchuk 2019 (PubMed 30580468); Sato 2022 (PubMed 35311855)',
    libraryRef: 'WORKOUTS_LIBRARY.md#plank-hold-extended-duration'
  },

  // ═══ WARMUP MOVEMENTS (5) ══════════════════════════════════════════════════

  {
    id: 'warmup-hip-cars-controlled-articular-rotations',
    name: 'Hip CARs (Controlled Articular Rotations)',
    aliases: ['Hip CARs','Hip controlled articular rotations'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','wall'],
    muscles: {
      primary: ['gluteus_medius','hip_flexors'],
      secondary: ['adductors','abductors']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[5,5], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'5 each way/hip' },
      cut:         { sets:1, reps:[5,5], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'5 each way/hip' },
      bulk:        { sets:1, reps:[5,5], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'5 each way/hip' },
      maintenance: { sets:1, reps:[5,5], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'5 each way/hip' },
      agro:        { sets:1, reps:[5,5], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'5 each way/hip' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#hip-cars-controlled-articular-rotations'
  },

  {
    id: 'warmup-arm-circles',
    name: 'Arm circles',
    aliases: ['Arm circle'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['anterior_deltoid','lateral_deltoid','posterior_deltoid'],
      secondary: ['rotator_cuff','trapezius_upper']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      cut:         { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      bulk:        { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      maintenance: { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      agro:        { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#arm-circles'
  },

  {
    id: 'warmup-leg-swings',
    name: 'Leg swings',
    aliases: ['Leg swing'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','wall'],
    muscles: {
      primary: ['hip_flexors','hamstrings','adductors','abductors'],
      secondary: ['obliques']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[10,10], unit:'each', tempo:'controlled', rest:[0,0], freq:7, raw:'10 each way/leg' },
      cut:         { sets:1, reps:[10,10], unit:'each', tempo:'controlled', rest:[0,0], freq:7, raw:'10 each way/leg' },
      bulk:        { sets:1, reps:[10,10], unit:'each', tempo:'controlled', rest:[0,0], freq:7, raw:'10 each way/leg' },
      maintenance: { sets:1, reps:[10,10], unit:'each', tempo:'controlled', rest:[0,0], freq:7, raw:'10 each way/leg' },
      agro:        { sets:1, reps:[10,10], unit:'each', tempo:'controlled', rest:[0,0], freq:7, raw:'10 each way/leg' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#leg-swings'
  },

  {
    id: 'warmup-thoracic-rotation',
    name: 'Thoracic rotation',
    aliases: ['T-spine rotation','Thoracic spine rotation'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['thoracic_extensors'],
      secondary: ['obliques','posterior_deltoid']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[8,8], unit:'perside', tempo:'slow', rest:[0,0], freq:7, raw:'8/side' },
      cut:         { sets:1, reps:[8,8], unit:'perside', tempo:'slow', rest:[0,0], freq:7, raw:'8/side' },
      bulk:        { sets:1, reps:[8,8], unit:'perside', tempo:'slow', rest:[0,0], freq:7, raw:'8/side' },
      maintenance: { sets:1, reps:[8,8], unit:'perside', tempo:'slow', rest:[0,0], freq:7, raw:'8/side' },
      agro:        { sets:1, reps:[8,8], unit:'perside', tempo:'slow', rest:[0,0], freq:7, raw:'8/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#thoracic-rotation'
  },

  {
    id: 'warmup-wrist-cars',
    name: 'Wrist CARs',
    aliases: ['Wrist controlled articular rotations','Wrist circles'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['wrist_flexors','forearms'],
      secondary: ['finger_flexors']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','wrist_tendinopathy'],
    prescriptions: {
      lite:        { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      cut:         { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      bulk:        { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      maintenance: { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' },
      agro:        { sets:1, reps:[10,10], unit:'each', tempo:'slow', rest:[0,0], freq:7, raw:'10 each way' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#wrist-cars'
  },

  // ═══ COOLDOWN / STRETCH MOVEMENTS (13) ═════════════════════════════════════

  {
    id: 'cooldown-doorframe-chest-stretch',
    name: 'Doorframe chest stretch',
    aliases: ['Doorway chest stretch','Door chest stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['pectoralis_major','pectoralis_clavicular'],
      secondary: ['anterior_deltoid','biceps']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      cut:         { sets:1, reps:[30,60], unit:'perside', tempo:'hold', rest:[0,0], freq:2, raw:'30-60 sec/side' },
      bulk:        { sets:1, reps:[30,60], unit:'perside', tempo:'hold', rest:[0,0], freq:2, raw:'30-60 sec/side' },
      maintenance: { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:2, raw:'30 sec/side' },
      agro:        { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:3, raw:'30 sec/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#doorframe-chest-stretch'
  },

  {
    id: 'cooldown-shoulder-dislocates',
    name: 'Shoulder dislocates',
    aliases: ['Shoulder dislocate','Pass-throughs'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['towel'],
    muscles: {
      primary: ['anterior_deltoid','rotator_cuff'],
      secondary: ['pectoralis_major','latissimus_dorsi','rhomboids']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'10 reps' },
      cut:         { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:2, raw:'10 reps' },
      bulk:        { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:2, raw:'10 reps' },
      maintenance: { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:2, raw:'10 reps' },
      agro:        { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:3, raw:'10 reps' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#shoulder-dislocates'
  },

  {
    id: 'cooldown-behind-back-clasp',
    name: 'Behind-back clasp',
    aliases: ['Behind back clasp','Reverse prayer stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['pectoralis_major','anterior_deltoid','biceps'],
      secondary: ['serratus_anterior']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec' },
      cut:         { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:2, raw:'20 sec' },
      bulk:        { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:2, raw:'20 sec' },
      maintenance: { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:2, raw:'20 sec' },
      agro:        { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:3, raw:'20 sec' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#behind-back-clasp'
  },

  {
    id: 'cooldown-worlds-greatest-stretch',
    name: "World's greatest stretch",
    aliases: ['Worlds greatest stretch','WGS'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors','hamstrings','thoracic_extensors'],
      secondary: ['gluteus_maximus','adductors','anterior_deltoid']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[30,30], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'30 sec/side' },
      cut:         { sets:1, reps:[30,30], unit:'perside', tempo:'slow', rest:[0,0], freq:2, raw:'30 sec/side' },
      bulk:        { sets:1, reps:[30,30], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'30 sec/side' },
      maintenance: { sets:1, reps:[30,30], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'30 sec/side' },
      agro:        { sets:1, reps:[30,30], unit:'perside', tempo:'slow', rest:[0,0], freq:1, raw:'30 sec/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#worlds-greatest-stretch'
  },

  {
    id: 'cooldown-deep-squat-hold-stretch',
    name: 'Deep squat hold stretch',
    aliases: ['Deep squat stretch','Passive deep squat'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['hip_flexors','adductors'],
      secondary: ['calves','gluteus_medius']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec' },
      cut:         { sets:1, reps:[60,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec' },
      bulk:        { sets:1, reps:[60,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec' },
      maintenance: { sets:1, reps:[60,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec' },
      agro:        { sets:1, reps:[60,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#deep-squat-hold-stretch'
  },

  {
    id: 'cooldown-90-90-hip-stretch',
    name: '90/90 hip stretch',
    aliases: ['90 90 hip stretch','Ninety-ninety hip stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','gluteus_medius'],
      secondary: ['hip_flexors','abductors']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[1,1], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'1 min/side' },
      cut:         { sets:1, reps:[2,2], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'2 min/side' },
      bulk:        { sets:1, reps:[2,2], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'2 min/side' },
      maintenance: { sets:1, reps:[2,2], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'2 min/side' },
      agro:        { sets:1, reps:[2,2], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'2 min/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#90-90-hip-stretch'
  },

  {
    id: 'cooldown-frog-stretch',
    name: 'Frog stretch',
    aliases: ['Frog pose','Adductor frog stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['adductors'],
      secondary: ['hip_flexors','erector_spinae']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[30,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30-60 sec' },
      cut:         { sets:1, reps:[2,2],   unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'2 min' },
      bulk:        { sets:1, reps:[2,2],   unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'2 min' },
      maintenance: { sets:1, reps:[2,2],   unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'2 min' },
      agro:        { sets:1, reps:[2,2],   unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'2 min' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#frog-stretch'
  },

  {
    id: 'cooldown-cossack-squat-stretch',
    name: 'Cossack squat stretch',
    aliases: ['Cossack squat','Lateral squat stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['adductors','calves'],
      secondary: ['quadriceps','hamstrings']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[60,60], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec/side' },
      bulk:        { sets:1, reps:[60,60], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec/side' },
      maintenance: { sets:1, reps:[60,60], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec/side' },
      agro:        { sets:1, reps:[60,60], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#cossack-squat-stretch'
  },

  {
    id: 'cooldown-figure-4-stretch',
    name: 'Figure-4 stretch',
    aliases: ['Figure 4 stretch','Figure four stretch','Piriformis stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor','chair'],
    muscles: {
      primary: ['gluteus_maximus','gluteus_medius'],
      secondary: ['abductors']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      cut:         { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      bulk:        { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      maintenance: { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      agro:        { sets:1, reps:[30,30], unit:'perside', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#figure-4-stretch'
  },

  {
    id: 'cooldown-neck-isometrics-4-directions',
    name: 'Neck isometrics 4 directions',
    aliases: ['Neck isometrics','4-direction neck isometrics'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['cervical_flexors','sternocleidomastoid','scalenes','splenius'],
      secondary: ['trapezius_upper']
    },
    region: 'neck',
    type: 'isometric',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['neck_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'each', tempo:'hold', rest:[0,0], freq:2, raw:'30 sec each dir' },
      bulk:        { sets:1, reps:[30,30], unit:'each', tempo:'hold', rest:[0,0], freq:2, raw:'30 sec each dir' },
      maintenance: { sets:1, reps:[30,30], unit:'each', tempo:'hold', rest:[0,0], freq:2, raw:'30 sec each dir' },
      agro:        { sets:1, reps:[30,30], unit:'each', tempo:'hold', rest:[0,0], freq:2, raw:'30 sec each dir' }
    },
    progression: {},
    safetyOverrides: { 'neck_injury': 'block' },
    citation: 'Oranchuk 2019',
    libraryRef: 'WORKOUTS_LIBRARY.md#neck-isometrics-4-directions'
  },

  {
    id: 'cooldown-heel-to-toe-walk',
    name: 'Heel-to-toe walk',
    aliases: ['Heel to toe walk','Tandem walk'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','wall'],
    muscles: {
      primary: ['calves','gluteus_medius'],
      secondary: ['rectus_abdominis']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 steps' },
      cut:         { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 steps' },
      bulk:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 steps' },
      maintenance: { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 steps' },
      agro:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 steps' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#heel-to-toe-walk'
  },

  {
    id: 'cooldown-single-leg-stand',
    name: 'Single-leg stand',
    aliases: ['Single leg stand','One-leg balance'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','wall','chair'],
    muscles: {
      primary: ['gluteus_medius','calves'],
      secondary: ['rectus_abdominis']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:3, reps:[10,15], unit:'perside', tempo:'hold', rest:[15,30], freq:1, raw:'3×10-15 sec/leg' },
      cut:         { sets:3, reps:[15,15], unit:'perside', tempo:'hold', rest:[15,30], freq:1, raw:'3×15 sec/leg' },
      bulk:        { sets:3, reps:[15,15], unit:'perside', tempo:'hold', rest:[15,30], freq:1, raw:'3×15 sec/leg' },
      maintenance: { sets:3, reps:[15,15], unit:'perside', tempo:'hold', rest:[15,30], freq:1, raw:'3×15 sec/leg' },
      agro:        { sets:3, reps:[15,15], unit:'perside', tempo:'hold', rest:[15,30], freq:1, raw:'3×15 sec/leg' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#single-leg-stand'
  },

  {
    id: 'cooldown-weight-shifts',
    name: 'Weight shifts',
    aliases: ['Weight shift','Balance weight shifts'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['gluteus_medius','calves'],
      secondary: ['rectus_abdominis']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 shifts' },
      cut:         { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 shifts' },
      bulk:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 shifts' },
      maintenance: { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 shifts' },
      agro:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:1, raw:'2×10 shifts' }
    },
    progression: {},
    safetyOverrides: {},
    citation: 'General exercise physiology',
    libraryRef: 'WORKOUTS_LIBRARY.md#weight-shifts'
  },

  // ═══ NECK PROTOCOL (2) ═════════════════════════════════════════════════════

  {
    id: 'neck-neck-nods',
    name: 'Neck nods',
    aliases: ['Neck nod','Chin nods','Cervical nods'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none'],
    muscles: {
      primary: ['cervical_flexors','splenius'],
      secondary: ['trapezius_upper']
    },
    region: 'neck',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['neck_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk: null,
      maintenance: null,
      agro:        { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[0,0], freq:7, raw:'10 nods' }
    },
    progression: {},
    safetyOverrides: { 'neck_injury': 'block' },
    citation: 'General exercise physiology; CLAUDE.md §1 (combat-sports mission context)',
    libraryRef: 'WORKOUTS_LIBRARY.md#neck-nods'
  },

  {
    id: 'neck-neck-isometrics-4-directions-30-sec',
    name: 'Neck isometrics 4 directions × 30 sec',
    aliases: ['Neck isometrics 30 sec','Combat neck isometrics','Sunday neck isometrics'],
    progressionGroup: null,
    level: null,
    pattern: 'isometric',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['sternocleidomastoid','trapezius_upper','scalenes','cervical_flexors'],
      secondary: ['splenius']
    },
    region: 'neck',
    type: 'isometric',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['neck_injury'],
    prescriptions: {
      lite: null,
      cut: null,
      bulk: null,
      maintenance: null,
      agro:        { sets:1, reps:[15,30], unit:'each', tempo:'hold', rest:[0,0], freq:7, raw:'30 sec each dir (Sun) / 15 sec each dir (daily)' }
    },
    progression: {},
    safetyOverrides: { 'neck_injury': 'block' },
    citation: 'Oranchuk 2019; CLAUDE.md §1 (combat-sports mission context)',
    libraryRef: 'WORKOUTS_LIBRARY.md#neck-isometrics-4-directions-30-sec'
  },

  // ── from yoga_pilates ──
  // ═══ YOGA POSES (18) ═══════════════════════════════════════════════════════

  {
    id: 'yoga-cat-cow',
    name: 'Cat-cow',
    aliases: ['Cat cow','Cat-cow flow'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['erector_spinae','thoracic_extensors'],
      secondary: ['rectus_abdominis','anterior_deltoid','hip_flexors']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[8,8],   unit:'reps', tempo:'hold', rest:[0,0], freq:1, raw:'8 reps' },
      cut:         { sets:1, reps:[8,10],  unit:'reps', tempo:'hold', rest:[0,0], freq:1, raw:'8-10 reps' },
      bulk: null,
      maintenance: { sets:1, reps:[8,10],  unit:'reps', tempo:'hold', rest:[0,0], freq:1, raw:'8-10 reps' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#cat-cow'
  },

  {
    id: 'yoga-downward-dog',
    name: 'Downward dog',
    aliases: ['Downward-facing dog','Down dog'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['hamstrings','calves','anterior_deltoid'],
      secondary: ['rectus_abdominis','latissimus_dorsi','serratus_anterior']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['wrist_injury','shoulder_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'wrist_injury': 'substitute' },
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#downward-dog'
  },

  {
    id: 'yoga-low-lunge',
    name: 'Low lunge',
    aliases: ['Anjaneyasana','Crescent low lunge'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors'],
      secondary: ['quadriceps','gluteus_maximus']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#low-lunge'
  },

  {
    id: 'yoga-pigeon-pose',
    name: 'Pigeon pose',
    aliases: ['Pigeon','Eka Pada Rajakapotasana'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','gluteus_medius'],
      secondary: ['hip_flexors','obliques']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[45,45], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'45 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[45,45], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'45 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#pigeon-pose'
  },

  {
    id: 'yoga-standing-forward-fold',
    name: 'Standing forward fold',
    aliases: ['Uttanasana','Forward fold'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['hamstrings','erector_spinae'],
      secondary: ['calves','gluteus_maximus']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'lower_back_injury': 'substitute' },
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#standing-forward-fold'
  },

  {
    id: 'yoga-warrior-i',
    name: 'Warrior I',
    aliases: ['Warrior 1','Virabhadrasana I'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','hip_flexors','gluteus_maximus'],
      secondary: ['anterior_deltoid','rectus_abdominis','adductors']
    },
    region: 'mobility',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#warrior-i'
  },

  {
    id: 'yoga-warrior-ii',
    name: 'Warrior II',
    aliases: ['Warrior 2','Virabhadrasana II'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['quadriceps','abductors'],
      secondary: ['lateral_deltoid','rectus_abdominis','adductors']
    },
    region: 'mobility',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['knee_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#warrior-ii'
  },

  {
    id: 'yoga-triangle-pose',
    name: 'Triangle pose',
    aliases: ['Triangle','Trikonasana'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['hamstrings','obliques'],
      secondary: ['adductors','lateral_deltoid']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#triangle-pose'
  },

  {
    id: 'yoga-tree-pose',
    name: 'Tree pose',
    aliases: ['Tree','Vrksasana'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none','wall'],
    muscles: {
      primary: ['calves','abductors'],
      secondary: ['rectus_abdominis','quadriceps','gluteus_maximus']
    },
    region: 'mobility',
    type: 'isometric',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#tree-pose'
  },

  {
    id: 'yoga-childs-pose',
    name: "Child's pose",
    aliases: ['Childs pose','Balasana'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none','floor'],
    muscles: {
      primary: ['erector_spinae','latissimus_dorsi'],
      secondary: ['anterior_deltoid','gluteus_maximus']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[60,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec' },
      cut:         { sets:1, reps:[60,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec' },
      bulk: null,
      maintenance: { sets:1, reps:[60,60], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'60 sec' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: "WORKOUTS_LIBRARY.md#child's-pose"
  },

  {
    id: 'yoga-seated-spinal-twist',
    name: 'Seated spinal twist',
    aliases: ['Seated twist','Ardha Matsyendrasana'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['thoracic_extensors','obliques'],
      secondary: ['hip_flexors','latissimus_dorsi']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite: null,
      cut:         { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-spinal-twist'
  },

  {
    id: 'yoga-savasana',
    name: 'Savasana',
    aliases: ['Corpse pose','Final relaxation'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['erector_spinae'],
      secondary: ['rectus_abdominis']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[2,3], unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'2-3 min' },
      cut:         { sets:1, reps:[2,3], unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'2-3 min' },
      bulk: null,
      maintenance: { sets:1, reps:[2,3], unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'2-3 min' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#savasana'
  },

  {
    id: 'yoga-seated-cat-cow-lite-variant',
    name: 'Seated cat-cow (Lite variant)',
    aliases: ['Seated cat-cow','Chair cat-cow'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['chair'],
    muscles: {
      primary: ['erector_spinae','thoracic_extensors'],
      secondary: ['rectus_abdominis','anterior_deltoid']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[8,8], unit:'reps', tempo:'hold', rest:[0,0], freq:1, raw:'8 reps' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-cat-cow-lite-variant'
  },

  {
    id: 'yoga-seated-side-stretch-lite-variant',
    name: 'Seated side stretch (Lite variant)',
    aliases: ['Seated side stretch','Chair side stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['chair'],
    muscles: {
      primary: ['obliques','latissimus_dorsi'],
      secondary: ['lateral_deltoid']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec/side' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-side-stretch-lite-variant'
  },

  {
    id: 'yoga-seated-forward-fold-lite-variant',
    name: 'Seated forward fold (Lite variant)',
    aliases: ['Seated forward fold','Chair forward fold'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['chair'],
    muscles: {
      primary: ['hamstrings','erector_spinae'],
      secondary: ['gluteus_maximus','trapezius_mid']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[30,30], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'30 sec' },
      cut: null,
      bulk: null,
      maintenance: null,
      agro: null
    },
    progression: {},
    safetyOverrides: { 'lower_back_injury': 'substitute' },
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-forward-fold-lite-variant'
  },

  {
    id: 'yoga-standing-chest-opener',
    name: 'Standing chest opener',
    aliases: ['Chest opener','Standing chest stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['none'],
    muscles: {
      primary: ['pectoralis_major'],
      secondary: ['anterior_deltoid','biceps']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec' },
      cut:         { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec' },
      bulk: null,
      maintenance: { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#standing-chest-opener'
  },

  {
    id: 'yoga-seated-neck-stretches',
    name: 'Seated neck stretches',
    aliases: ['Neck stretches','Seated neck stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'isometric',
    equipment: ['chair','floor'],
    muscles: {
      primary: ['trapezius_upper','sternocleidomastoid','scalenes'],
      secondary: ['splenius']
    },
    region: 'neck',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: true,
    contraindications: ['neck_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec/side' },
      cut:         { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec/side' },
      bulk: null,
      maintenance: { sets:1, reps:[20,20], unit:'sec', tempo:'hold', rest:[0,0], freq:1, raw:'20 sec/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-neck-stretches'
  },

  {
    id: 'yoga-seated-meditation',
    name: 'Seated meditation',
    aliases: ['Meditation','Breathwork'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','chair'],
    muscles: {
      primary: ['transverse_abdominis'],
      secondary: ['erector_spinae']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[3,3], unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'3 min' },
      cut:         { sets:1, reps:[3,3], unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'3 min' },
      bulk: null,
      maintenance: { sets:1, reps:[3,3], unit:'min', tempo:'hold', rest:[0,0], freq:1, raw:'3 min' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 8038747',
    libraryRef: 'WORKOUTS_LIBRARY.md#seated-meditation'
  },

  // ═══ PILATES EXERCISES (13) ════════════════════════════════════════════════

  {
    id: 'pilates-pelvic-tilts',
    name: 'Pelvic tilts',
    aliases: ['Pelvic tilt','Posterior pelvic tilt'],
    progressionGroup: null,
    level: null,
    pattern: 'core',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['transverse_abdominis'],
      secondary: ['rectus_abdominis','erector_spinae']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'2×10' },
      cut: null,
      bulk:        { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'2×10' },
      maintenance: { sets:2, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'2×10' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#pelvic-tilts'
  },

  {
    id: 'pilates-bridge',
    name: 'Bridge',
    aliases: ['Glute bridge','Pilates bridge'],
    progressionGroup: null,
    level: null,
    pattern: 'hinge',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','hamstrings'],
      secondary: ['rectus_abdominis','erector_spinae','adductors']
    },
    region: 'glutes',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[8,8], unit:'reps', tempo:'slow, 3s hold', rest:[30,30], freq:1, raw:'2×8' },
      cut: null,
      bulk:        { sets:2, reps:[8,8], unit:'reps', tempo:'slow, 3s hold', rest:[30,30], freq:1, raw:'2×8' },
      maintenance: { sets:2, reps:[8,8], unit:'reps', tempo:'slow, 3s hold', rest:[30,30], freq:1, raw:'2×8' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#bridge'
  },

  {
    id: 'pilates-single-leg-stretch-modified',
    name: 'Single leg stretch modified',
    aliases: ['Single leg stretch','Single-leg stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'core',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','hip_flexors'],
      secondary: ['obliques','transverse_abdominis']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[6,6], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'2×6/side' },
      cut: null,
      bulk:        { sets:2, reps:[6,6], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'2×6/side' },
      maintenance: { sets:2, reps:[6,6], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'2×6/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#single-leg-stretch-modified'
  },

  {
    id: 'pilates-arm-circles-lying',
    name: 'Arm circles lying',
    aliases: ['Arm circles','Lying arm circles'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['anterior_deltoid','rotator_cuff'],
      secondary: ['serratus_anterior','trapezius_upper']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'none',
    plyometric: false,
    unilateral: false,
    contraindications: ['shoulder_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[10,10], unit:'each', tempo:'slow', rest:[20,20], freq:1, raw:'2×10 each way' },
      cut: null,
      bulk: null,
      maintenance: { sets:2, reps:[10,10], unit:'each', tempo:'slow', rest:[20,20], freq:1, raw:'2×10 each way' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#arm-circles-lying'
  },

  {
    id: 'pilates-spine-twist-lying',
    name: 'Spine twist lying',
    aliases: ['Spine twist','Lying spine twist','Supine twist'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: 'rotational',
    equipment: ['none','floor'],
    muscles: {
      primary: ['obliques','thoracic_extensors'],
      secondary: ['erector_spinae','gluteus_medius']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:2, reps:[5,5], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'2×5/side' },
      cut: null,
      bulk: null,
      maintenance: { sets:2, reps:[5,5], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'2×5/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#spine-twist-lying'
  },

  {
    id: 'pilates-the-hundred-modified',
    name: 'The Hundred modified',
    aliases: ['The Hundred','Hundred','Pilates hundred'],
    progressionGroup: null,
    level: null,
    pattern: 'core',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','transverse_abdominis'],
      secondary: ['hip_flexors','anterior_deltoid']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite:        { sets:5, reps:[10,10], unit:'reps', tempo:'fast', rest:[45,45], freq:1, raw:'5×10-count' },
      cut: null,
      bulk:        { sets:5, reps:[10,10], unit:'reps', tempo:'fast', rest:[45,45], freq:1, raw:'5×10-count' },
      maintenance: { sets:5, reps:[10,10], unit:'reps', tempo:'fast', rest:[45,45], freq:1, raw:'5×10-count' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#the-hundred-modified'
  },

  {
    id: 'pilates-roll-up',
    name: 'Roll-up',
    aliases: ['Roll up','Pilates roll-up'],
    progressionGroup: null,
    level: null,
    pattern: 'core',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','hip_flexors'],
      secondary: ['erector_spinae','obliques']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[6,6], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'6 reps' },
      cut: null,
      bulk:        { sets:1, reps:[6,6], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'6 reps' },
      maintenance: { sets:1, reps:[6,6], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'6 reps' },
      agro: null
    },
    progression: {},
    safetyOverrides: { 'lower_back_injury': 'substitute' },
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#roll-up'
  },

  {
    id: 'pilates-single-leg-circles',
    name: 'Single leg circles',
    aliases: ['Single-leg circles','Leg circles'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['hip_flexors','adductors','abductors'],
      secondary: ['transverse_abdominis','hamstrings']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[8,8], unit:'each', tempo:'slow', rest:[20,20], freq:1, raw:'8/dir/leg' },
      cut: null,
      bulk: null,
      maintenance: { sets:1, reps:[8,8], unit:'each', tempo:'slow', rest:[20,20], freq:1, raw:'8/dir/leg' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#single-leg-circles'
  },

  {
    id: 'pilates-double-leg-stretch',
    name: 'Double leg stretch',
    aliases: ['Double-leg stretch'],
    progressionGroup: null,
    level: null,
    pattern: 'core',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['rectus_abdominis','obliques','transverse_abdominis'],
      secondary: ['hip_flexors','anterior_deltoid']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[8,8], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'8 reps' },
      cut: null,
      bulk:        { sets:1, reps:[8,8], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'8 reps' },
      maintenance: { sets:1, reps:[8,8], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'8 reps' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#double-leg-stretch'
  },

  {
    id: 'pilates-bridge-with-march',
    name: 'Bridge with march',
    aliases: ['Marching bridge','Bridge march'],
    progressionGroup: null,
    level: null,
    pattern: 'hinge',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_maximus','transverse_abdominis'],
      secondary: ['gluteus_medius','hamstrings']
    },
    region: 'glutes',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'10 reps' },
      cut: null,
      bulk:        { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'10 reps' },
      maintenance: { sets:1, reps:[10,10], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'10 reps' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#bridge-with-march'
  },

  {
    id: 'pilates-swimming-prone',
    name: 'Swimming prone',
    aliases: ['Swimming','Prone swimming'],
    progressionGroup: null,
    level: null,
    pattern: 'core',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['erector_spinae','gluteus_maximus'],
      secondary: ['posterior_deltoid','hamstrings']
    },
    region: 'core',
    type: 'isolation',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: ['lower_back_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[20,20], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'20 alternating' },
      cut: null,
      bulk:        { sets:1, reps:[20,20], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'20 alternating' },
      maintenance: { sets:1, reps:[20,20], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'20 alternating' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#swimming-prone'
  },

  {
    id: 'pilates-seal',
    name: 'Seal',
    aliases: ['The seal','Seal roll'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['erector_spinae','rectus_abdominis'],
      secondary: ['hip_flexors']
    },
    region: 'mobility',
    type: 'mobility',
    difficulty: 2,
    jointImpact: 'low',
    plyometric: false,
    unilateral: false,
    contraindications: ['lower_back_injury','neck_injury'],
    prescriptions: {
      lite:        { sets:1, reps:[6,6], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'6 reps' },
      cut: null,
      bulk: null,
      maintenance: { sets:1, reps:[6,6], unit:'reps', tempo:'slow', rest:[30,30], freq:1, raw:'6 reps' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#seal'
  },

  {
    id: 'pilates-side-lying-leg-lift',
    name: 'Side-lying leg lift',
    aliases: ['Side lying leg lift','Side leg lift'],
    progressionGroup: null,
    level: null,
    pattern: 'mobility',
    plane: null,
    equipment: ['none','floor'],
    muscles: {
      primary: ['gluteus_medius','abductors'],
      secondary: ['transverse_abdominis','adductors']
    },
    region: 'glutes',
    type: 'isolation',
    difficulty: 1,
    jointImpact: 'low',
    plyometric: false,
    unilateral: true,
    contraindications: [],
    prescriptions: {
      lite:        { sets:1, reps:[10,10], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'10/side' },
      cut: null,
      bulk:        { sets:1, reps:[10,10], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'10/side' },
      maintenance: { sets:1, reps:[10,10], unit:'perside', tempo:'slow', rest:[30,30], freq:1, raw:'10/side' },
      agro: null
    },
    progression: {},
    safetyOverrides: {},
    citation: 'PMC 11447755; Physiology & Behavior 2016',
    libraryRef: 'WORKOUTS_LIBRARY.md#side-lying-leg-lift'
  }
];
