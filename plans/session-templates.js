// ─── SESSION TEMPLATES — Protocol Health Workout Engine (v9, Phase 1) ─────────
//
// STATUS: DORMANT. This module has NO consumer yet. It is pure data + the
// week-level skeleton that the v9 Workout Engine (modules/workout-engine.js,
// not yet built) will read to decide WHICH KIND of session each weekday is,
// HOW LONG it runs, and WHICH SLOTS that session should fill. Importing it has
// zero side effects and cannot affect the live app. The legacy static
// workoutContent() in each plans/*.js remains the only render path until the
// engine ships behind an opt-in BETA toggle (default OFF).
//
// RELATIONSHIP TO exercise-db.js (do NOT import it here — kept independent):
//   • A `slot` resolves to one of:
//       - a PROGRESSION_GROUPS token  (e.g. 'push','pull','squat','hinge','core',
//         'shoulder', or the chair_* groups 'chair_push'/'chair_pull'/
//         'chair_legs'/'chair_core', or any skill_* group),
//       - a 'pattern:<PATTERN>' reference (e.g. 'pattern:conditioning',
//         'pattern:mobility','pattern:skill'),
//       - or an 'accessory:<REGION>' reference (e.g. 'accessory:shoulders').
//   • The engine will query exercise-db.js to fill each slot with a concrete
//     exercise at the user's unlocked level, respecting demographic + push:pull
//     constraints. This file only declares the SHAPE of a week, not the picks.
//
// AUTHORITY: the weekly day→archetype mapping mirrors each plan's real Mon–Sun
// structure (plans/*.js morningSub/eveningSub + fastDaysDow/lightDaysDow) and
// the "Weekly Templates Per Plan" + "Volume Caps Per Plan" tables in
// WORKOUTS_LIBRARY.md "AUTO-PRESCRIPTION DATA MODEL".
//
// dow convention: 0 = Sunday … 6 = Saturday (matches Date.getDay() + plan DOW
// arrays throughout the codebase).
// ─────────────────────────────────────────────────────────────────────────────

// Canonical archetype vocabulary. Every SESSION_TEMPLATES[*].weekly[*].archetype
// MUST be one of these, and every key here (except those intentionally without a
// session, none currently) MUST have a matching entry in ARCHETYPE_SLOTS.
export const ARCHETYPES = [
  'rest',
  'recovery',
  'conditioning',
  'resistance-upper',
  'resistance-lower',
  'resistance-full',
  'push-pull',
  'skill',
  'chair-upper',
  'chair-lower',
  'chair-full',
  'mobility'
];

// ─── WEEKLY DAY→ARCHETYPE MAPS (one per plan) ────────────────────────────────
// Each weekly[] element: { dow, name, archetype, duration (minutes), fasted }.
// `fasted` is true ONLY for AGRO on its fastDaysDow [0,3,6]; false everywhere
// else (no other plan declares fast days). `name` carries the human-readable
// session label; for AGRO bimodal days it names both sessions and the archetype
// reflects the dominant (longer/heavier) session.
export const SESSION_TEMPLATES = {
  // LITE PROTOCOL — gentle, chair-first, zero equipment.
  // Lib template: Mon Walk+ChairUpper | Tue TaiChi | Wed Walk+ChairLower |
  //               Thu Yoga | Fri Walk+ChairFull+Iso | Sat Pilates+Balance | Sun Rest
  lite: {
    plan: 'lite',
    weekly: [
      { dow: 0, name: 'Rest',                          archetype: 'rest',         duration: 0,  fasted: false },
      { dow: 1, name: 'Walk + Chair Strength A (Upper)', archetype: 'chair-upper',  duration: 35, fasted: false },
      { dow: 2, name: 'Tai Chi Flow',                  archetype: 'recovery',     duration: 30, fasted: false },
      { dow: 3, name: 'Walk + Chair Strength B (Lower)', archetype: 'chair-lower',  duration: 35, fasted: false },
      { dow: 4, name: 'Gentle Yoga',                   archetype: 'recovery',     duration: 30, fasted: false },
      { dow: 5, name: 'Walk + Chair Strength C (Full + Isometric)', archetype: 'chair-full', duration: 35, fasted: false },
      { dow: 6, name: 'Mat Pilates + Balance',         archetype: 'mobility',     duration: 30, fasted: false }
    ]
  },

  // DEFAULT CUT — flexible deficit, 0 fast days.
  // Lib template: Mon Upper Resistance | Tue HIIT | Wed Walk+Yoga |
  //               Thu Lower Resistance | Fri HIIT B | Sat Full Body+Core | Sun Rest
  cut: {
    plan: 'cut',
    weekly: [
      { dow: 0, name: 'Rest',                       archetype: 'rest',             duration: 0,  fasted: false },
      { dow: 1, name: 'Upper Body Resistance',      archetype: 'resistance-upper', duration: 40, fasted: false },
      { dow: 2, name: 'HIIT / Shadowbox',           archetype: 'conditioning',     duration: 25, fasted: false },
      { dow: 3, name: 'Active Recovery (Walk + Yoga)', archetype: 'recovery',      duration: 35, fasted: false },
      { dow: 4, name: 'Lower Body Resistance',      archetype: 'resistance-lower', duration: 40, fasted: false },
      { dow: 5, name: 'HIIT Circuit B',             archetype: 'conditioning',     duration: 25, fasted: false },
      { dow: 6, name: 'Full Body + Core',           archetype: 'resistance-full',  duration: 40, fasted: false }
    ]
  },

  // DEFAULT BULK — clean surplus, 0 fast, light days Sun/Wed.
  // Lib template: Mon Push Volume | Tue Pull+Posterior | Wed Animal Flow+Walk |
  //               Thu Lower Volume | Fri Push/Pull Intensity | Sat Full Body+Pilates | Sun Rest
  bulk: {
    plan: 'bulk',
    weekly: [
      { dow: 0, name: 'Rest',                       archetype: 'rest',             duration: 0,  fasted: false },
      { dow: 1, name: 'Push Volume (tempo)',        archetype: 'resistance-upper', duration: 50, fasted: false },
      { dow: 2, name: 'Pull + Posterior Chain (tempo)', archetype: 'push-pull',    duration: 50, fasted: false },
      { dow: 3, name: 'Animal Flow + Walk',         archetype: 'mobility',         duration: 35, fasted: false },
      { dow: 4, name: 'Lower Body Volume (tempo)',  archetype: 'resistance-lower', duration: 50, fasted: false },
      { dow: 5, name: 'Push/Pull Intensity',        archetype: 'push-pull',        duration: 50, fasted: false },
      { dow: 6, name: 'Full Body + Pilates Core',   archetype: 'resistance-full',  duration: 45, fasted: false }
    ]
  },

  // DEFAULT MAINTENANCE — sustain weight, 0 fast, 1 light day (Sun).
  // Lib template: Mon Resistance A | Tue Cardio Rotation | Wed Yoga/Pilates |
  //               Thu Resistance B | Fri Animal Flow | Sat Recreation | Sun Rest
  maintenance: {
    plan: 'maintenance',
    weekly: [
      { dow: 0, name: 'Rest',                       archetype: 'rest',            duration: 0,  fasted: false },
      { dow: 1, name: 'Bodyweight Resistance A',    archetype: 'resistance-full', duration: 35, fasted: false },
      { dow: 2, name: 'Cardio Rotation',            archetype: 'conditioning',    duration: 35, fasted: false },
      { dow: 3, name: 'Yoga / Pilates',             archetype: 'recovery',        duration: 30, fasted: false },
      { dow: 4, name: 'Bodyweight Resistance B',    archetype: 'resistance-full', duration: 35, fasted: false },
      { dow: 5, name: 'Animal Flow + Mobility',     archetype: 'mobility',        duration: 30, fasted: false },
      { dow: 6, name: 'Recreational Activity',      archetype: 'conditioning',    duration: 45, fasted: false }
    ]
  },

  // AGRO CUT CALISTHENICS — 7 sessions/week, bimodal (morning + evening).
  // fastDaysDow [0,3,6] → fasted:true. Archetype reflects the dominant session.
  //   Sun: active rest (walk + full hip session)               → recovery (fasted)
  //   Mon: Morning A (push+pull) + Evening A (push/pull balance) → push-pull
  //   Tue: Morning B (lower+hinge) + Evening B (legs+posterior)  → resistance-lower
  //   Wed: Morning A + Midweek Run (fasted)                      → conditioning (fasted)
  //   Thu: Morning B + Evening C (skill+core+pull)               → skill
  //   Fri: Morning A + Evening B (legs+posterior)                → resistance-lower
  //   Sat: Morning B + Run + conditioning circuit (fasted)       → conditioning (fasted)
  agro: {
    plan: 'agro',
    weekly: [
      { dow: 0, name: 'Active Rest — Walk + Full Hip Session', archetype: 'recovery',         duration: 50, fasted: true  },
      { dow: 1, name: 'Morning A + Evening A',                 archetype: 'push-pull',        duration: 65, fasted: false },
      { dow: 2, name: 'Morning B + Evening B',                 archetype: 'resistance-lower', duration: 65, fasted: false },
      { dow: 3, name: 'Morning A + Midweek Run',              archetype: 'conditioning',     duration: 55, fasted: true  },
      { dow: 4, name: 'Morning B + Evening C',                 archetype: 'skill',            duration: 60, fasted: false },
      { dow: 5, name: 'Morning A + Evening B',                 archetype: 'resistance-lower', duration: 65, fasted: false },
      { dow: 6, name: 'Morning B + Run + Conditioning',        archetype: 'conditioning',     duration: 65, fasted: true  }
    ]
  }
};

// ─── ARCHETYPE → SLOT COMPOSITION ────────────────────────────────────────────
// What an engine session of each archetype should contain. A `slot` is a
// progressionGroup, a 'pattern:<PATTERN>' reference, or an 'accessory:<REGION>'.
// `count` is how many distinct exercises the engine should select for that slot.
// Push:pull is kept ≤ 1:1 by construction: every push-bearing archetype pairs a
// push slot with a pull slot (CLAUDE.md §15 hard rule).
export const ARCHETYPE_SLOTS = {
  'rest':              [],
  'recovery':          [ { slot: 'pattern:mobility', count: 3 } ],
  'mobility':          [ { slot: 'pattern:mobility', count: 3 } ],
  'conditioning':      [ { slot: 'pattern:conditioning', count: 2 } ],
  'resistance-upper':  [ { slot: 'push', count: 1 }, { slot: 'pull', count: 1 }, { slot: 'shoulder', count: 1 }, { slot: 'core', count: 1 } ],
  'resistance-lower':  [ { slot: 'squat', count: 1 }, { slot: 'hinge', count: 1 }, { slot: 'core', count: 1 } ],
  'resistance-full':   [ { slot: 'push', count: 1 }, { slot: 'pull', count: 1 }, { slot: 'squat', count: 1 }, { slot: 'core', count: 1 } ],
  'push-pull':         [ { slot: 'push', count: 1 }, { slot: 'pull', count: 1 }, { slot: 'core', count: 1 } ],
  'skill':             [ { slot: 'skill', count: 2 }, { slot: 'core', count: 1 }, { slot: 'pull', count: 1 } ],
  'chair-upper':       [ { slot: 'chair_push', count: 1 }, { slot: 'chair_pull', count: 1 } ],
  'chair-lower':       [ { slot: 'chair_legs', count: 1 }, { slot: 'chair_core', count: 1 } ],
  'chair-full':        [ { slot: 'chair_push', count: 1 }, { slot: 'chair_pull', count: 1 }, { slot: 'chair_legs', count: 1 }, { slot: 'chair_core', count: 1 } ]
};

// ─── VOLUME CAPS PER PLAN ────────────────────────────────────────────────────
// maxSessionsPerWeek / maxExercisesPerSession / maxWeeklySets pulled from the
// WORKOUTS_LIBRARY.md "Volume Caps Per Plan" table. deloadEveryWeeks defaults to
// 8 (range 6-10 per the deload trigger rule) and advanceCleanSessions encodes
// the streak threshold (3 sessions to advance; Lite = 5).
export const VOLUME_CAPS = {
  lite:        { maxSessionsPerWeek: 6, maxExercisesPerSession: 10, maxWeeklySets: 30, deloadEveryWeeks: 9, advanceCleanSessions: 5 },
  cut:         { maxSessionsPerWeek: 6, maxExercisesPerSession: 10, maxWeeklySets: 50, deloadEveryWeeks: 7, advanceCleanSessions: 3 },
  bulk:        { maxSessionsPerWeek: 5, maxExercisesPerSession: 12, maxWeeklySets: 70, deloadEveryWeeks: 7, advanceCleanSessions: 3 },
  maintenance: { maxSessionsPerWeek: 6, maxExercisesPerSession: 8,  maxWeeklySets: 40, deloadEveryWeeks: 9, advanceCleanSessions: 3 },
  agro:        { maxSessionsPerWeek: 7, maxExercisesPerSession: 12, maxWeeklySets: 80, deloadEveryWeeks: 6, advanceCleanSessions: 3 }
};

// ─── SELF-TEST (dormant; run manually, see header of this comment block) ──────
// node --check plans/session-templates.js
// node --input-type=module -e "import {SESSION_TEMPLATES,ARCHETYPE_SLOTS,ARCHETYPES,VOLUME_CAPS} from './plans/session-templates.js';
//   for(const p of Object.keys(SESSION_TEMPLATES)){
//     const t=SESSION_TEMPLATES[p];
//     if(t.plan!==p) throw new Error(p+' plan-key mismatch');
//     const w=t.weekly; if(w.length!==7) throw new Error(p+' not 7 days');
//     w.forEach((d,i)=>{
//       if(d.dow!==i) throw new Error(p+' dow out of order at index '+i);
//       if(!ARCHETYPES.includes(d.archetype)) throw new Error(p+' bad archetype '+d.archetype);
//       if(!(d.archetype in ARCHETYPE_SLOTS)) throw new Error(p+' archetype has no slots '+d.archetype);
//       if(d.archetype==='rest' && d.duration!==0) throw new Error(p+' rest day must be 0 min');
//       if(p!=='agro' && d.fasted) throw new Error(p+' non-agro day marked fasted');
//     });
//     if(!VOLUME_CAPS[p]) throw new Error(p+' missing volume caps');
//   }
//   // fasted days for agro must be exactly its fastDaysDow [0,3,6]
//   const af=SESSION_TEMPLATES.agro.weekly.filter(d=>d.fasted).map(d=>d.dow);
//   if(JSON.stringify(af)!=='[0,3,6]') throw new Error('agro fasted dow mismatch '+af);
//   // every ARCHETYPES entry must have a slot definition
//   for(const a of ARCHETYPES) if(!(a in ARCHETYPE_SLOTS)) throw new Error('archetype missing slots: '+a);
//   console.log('OK 5 plans x7 days, archetypes valid');"
