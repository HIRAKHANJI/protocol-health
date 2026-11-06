// plans/cycle.js — CYCLE: the seasons recomp plan.
// Built to run indefinitely, not toward a deadline. Bodyweight-first by design
// law: every exercise defaults to zero equipment; the only implied "weight" is
// a loaded backpack, and DBs/machines/bars appear only as UPGRADE notes.
//
// Every number the plan shows is derived at render time from the user's own
// Settings + logs (latest weight, target, calorie ceiling, TDEE, plan start
// date) — no hardcoded body stats, dates or personal history.
//
// v8.10.10 — CYCLE v2:
//   • Eating window 9AM–4PM, two meals (defaultTimes; editable in Settings).
//   • Fast days follow the computed mode (getters below):
//       GLIDE (>2kg above target)  → Thu + Sun fasts, eating days at the ceiling
//       BAND  (target ±2kg)        → Sun fast only, eat ≈ TDEE
//       BELOW (>2kg under target)  → no fasts, TDEE + 200
//       no data                    → Sun fast only
//   • Protein floor in GLIDE = 1.6 g/kg of TARGET weight (protein needs track
//     lean mass, not fat mass); otherwise 1.6 g/kg of current weight.
//   • Water target from bodyweight (~33 ml/kg, rounded to 0.5L; +0.5L on fasts).
//   • Run ramp keyed to the week number since the plan start date, with an
//     open-ended progression after week 12.
// Training week: Mon PUSH · Tue RUN + spine armor · Wed PULL ·
// Thu FAST + walk (GLIDE) or RUN 2 + skill (BAND/BELOW) ·
// Fri LEGS + GLUTES + loaded core · Sat SKILL + SPEED + CONDITIONING · Sun FAST + walk.

function _cycleState() {
  const s = (typeof getSettings === 'function') ? getSettings() : {};
  const w = (typeof getLatestWeight === 'function' ? getLatestWeight() : null) || s.currentKg || null;
  const t = s.targetKg || null;
  const tdee = s.tdee || null;
  let mode = null;
  if (w && t) {
    if (w > t + 2) mode = 'glide';
    else if (w < t - 2) mode = 'below';
    else mode = 'band';
  }
  const fmt = n => (Math.round(n * 10) / 10).toString();
  return { s, w, t, tdee, mode, fmt };
}

// Fast-day weekdays for the current mode (0 = Sun, 4 = Thu).
function _fastDow() {
  const { mode } = _cycleState();
  if (mode === 'glide') return [0, 4];
  if (mode === 'below') return [];
  return [0];
}

// Daily water targets in litres, from bodyweight (~33 ml/kg — in line with
// the DRI adequate intake for adult men, scaled to body size), rounded to 0.5L.
function _water() {
  const { w } = _cycleState();
  const base = w ? Math.min(4.0, Math.max(2.5, Math.round(w * 0.033 * 2) / 2)) : 3.0;
  return { eat: base, fast: Math.min(4.5, base + 0.5) };
}

// Week number since the plan start date (1-based), or null without a start date.
function _planWeek() {
  const { s } = _cycleState();
  if (!s.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(s.startDate)) return null;
  const [y, m, d] = s.startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const days = Math.floor((now - start) / 86400000);
  return days < 0 ? 1 : Math.floor(days / 7) + 1;
}

// Eating window labels (Settings value or plan default).
function _times() {
  const s = (typeof getSettings === 'function') ? getSettings() : {};
  const f = (typeof formatTime === 'function') ? formatTime : (x => x);
  const g = (k, d) => (typeof getPlanTime === 'function' ? getPlanTime(s, k) : null) || d;
  return { open: f(g('eatingWindowStart', '09:00')), close: f(g('lastMealTime', '16:00')) };
}

// Weekly energy math at the user's own numbers.
function _weekMath() {
  const { s, w, tdee } = _cycleState();
  const cal = s.calories || null;
  if (!tdee || !cal) return null;
  const fasts = _fastDow().length;
  const eat = 7 - fasts;
  // Fast days burn a little less (no training session) — ~95% of TDEE.
  const weekly = eat * (tdee - cal) + fasts * Math.round(tdee * 0.95);
  const kg = weekly / 7700;
  const pct = w ? (kg / w) * 100 : null;
  return { cal, tdee, fasts, eat, weekly, kg, pct };
}

const _DAYN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// The run ramp — Tuesday is the main run; Saturday adds short dashes from week 4.
const _RAMP = [
  { wk:'1',     run:'40 min brisk walk with 6 × 1-min easy jogs.', dash:'—' },
  { wk:'2',     run:'8 rounds: 1.5 min jog / 1.5 min walk (~3K).', dash:'—' },
  { wk:'3',     run:'6 rounds: 3 min jog / 1 min walk (~3.5K).', dash:'—' },
  { wk:'4',     run:'3K continuous easy, then walk to 4K.', dash:'6 × 60m at 80%, walk back' },
  { wk:'5',     run:'4K easy.', dash:'6-8 × 60m at 80%' },
  { wk:'6',     run:'4.5-5K easy (walk breaks allowed).', dash:'8 × 60m at 80%' },
  { wk:'7',     run:'5K easy.', dash:'8 × 60m at 80-85%' },
  { wk:'8',     run:'5K easy, or 4K + 6 × 20s strides.', dash:'8 × 60m at 85%' },
  { wk:'9-12',  run:'5K easy — last 1K at a steady, comfortably-hard pace.', dash:'8-10 × 60m at 85-90%' },
  { wk:'13+',   run:'Alternate weeks: (a) 5K steady, try to beat your last time · (b) 1K easy + 6 × 400m strong / 400m walk + 1K easy.', dash:'10 × 60m fast, or 6 × 100m' }
];
function _rampIndex(wk) {
  if (!wk || wk <= 8) return Math.max(0, (wk || 1) - 1);
  return wk <= 12 ? 8 : 9;
}

export const cycle = {
    name: 'CYCLE',
    goalMode: 'cut',
    // Fallback only — Settings recomputes TDEE per user (Mifflin × activity).
    tdee: 2600,
    // Mode-driven (see header). Read at call time, so the calculator,
    // calendar auto-set and projection always see the current mode.
    get fastDaysDow() { return _fastDow(); },
    get fastDaysPerWeek() { return _fastDow().length; },
    badge: 'CYCLE',
    badgeClass: '',
    descClass: '',
    subtitle: 'Seasons recomp. Bodyweight-first. 9AM–4PM, two meals. Fasts follow your mode. Waist over scale.',
    bannerColor: '#82e0aa',
    bannerBg: 'rgba(130,224,170,0.07)',
    bannerBorder: 'rgba(130,224,170,0.35)',
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    // [protein%, carbs%, fat%] — the protein floor below is the real constraint.
    macroSplit: { base:[30,42,28], rest:[30,42,28], preFast:[30,42,28], stall:[30,42,28], satiety:[30,42,28] },
    // 1.6 g/kg (ISSN Protein & Exercise; Morton 2018). While well above target
    // the floor is 1.6 g/kg of TARGET weight — protein needs follow lean mass,
    // not stored fat — expressed as a multiplier of current weight here.
    get proteinFloorMultiplier() {
      const { w, t, mode } = _cycleState();
      if (mode === 'glide' && w && t) return Math.round(1.6 * t / w * 100) / 100;
      return 1.6;
    },
    caloriesMode: 'floor',
    minCalories: 1400,
    activityByDayType: { eatDay: 1.65, fastDay: 1.35 },
    // Only the session item is derived from WORKOUTS-tab progress.
    autoWorkoutIds: ['e2'],

    defaultTimes: { wakeTime:'06:30', eatingWindowStart:'09:00', lastMealTime:'16:00', eveningSessionTime:'17:00' },

    get weekIcons() {
      const thu = _fastDow().includes(4);
      return {0:'🔥',1:'💪',2:'🏃',3:'💪',4: thu ? '🔥' : '🏃',5:'🦵',6:'🤸'};
    },

    get morningSub() {
      const thu = _fastDow().includes(4);
      const { open } = _times();
      return {
        0:'SUNDAY — FAST day. Salted water + creatine on waking. Weigh + log.',
        1:'MONDAY — Weigh + log. Meal 1 at ' + open + ' (+ D3 + multivitamin). Push session today.',
        2:'TUESDAY — Weigh + log. Run day — check this week’s RUN RAMP step.',
        3:'WEDNESDAY — Weigh + log. Pull day.' + (thu ? ' Last meal by the kitchen close — tomorrow is a fast.' : ''),
        4: thu ? 'THURSDAY — FAST day. Salted water + creatine on waking. Weigh + log.' : 'THURSDAY — Weigh + log. Run 2 + skill practice today.',
        5:'FRIDAY — Weigh + log.' + (thu ? ' Break the fast at ' + open + ' with the planned meal — protein first.' : '') + ' Legs + glutes + loaded core today.',
        6:'SATURDAY — Weigh + WAIST TAPE (navel + love-handle line). Skill + speed session, then batch-cook.'
      };
    },
    get eveningSub() {
      const thu = _fastDow().includes(4);
      return {
        0:'SUNDAY — Walk 60-90 min easy + 10 min mobility. Salted water. That’s the whole day.',
        1:'MONDAY — SESSION: PUSH. Push-up track, pike track, dips, planche leans, rows, side raises, plank + hollow.',
        2:'TUESDAY — RUN per the ramp (see WORKOUTS) + spine armor core block.',
        3:'WEDNESDAY — SESSION: PULL. Pull-ups or negatives 5×3-5 with long rests, rows, Y-T-W, W-raises, hanging raises, grip.',
        4: thu ? 'THURSDAY — FAST: walk 60-90 min + 10 min mobility. No training — the walk IS the session.' : 'THURSDAY — RUN 2 (easy) + 15 min fresh skill: handstand, L-sit, crow.',
        5:'FRIDAY — SESSION: LEGS + GLUTES + LOADED CORE. Squat track, Bulgarians, hip thrusts, sliding curls, RDLs, carries.',
        6:'SATURDAY — SESSION: SKILL + SPEED + CONDITIONING. Handstand/L-sit/crow · shadowbox · rope · dashes (week 4+).'
      };
    },
    get stretchSub() {
      const thu = _fastDow().includes(4);
      return {
        0:'Mobility: hips, upper back, hamstrings + hip-flexor stretch (10 min).',
        1:'Doorframe chest + shoulder dislocates + wrists + hip-flexor stretch (8 min).',
        2:'Post-run: calves · hamstrings · hip-flexor stretch (8 min).',
        3:'Full shoulder sequence + hip-flexor stretch (10 min).',
        4: thu ? 'Mobility: hips, upper back, hamstrings + hip-flexor stretch (10 min).' : 'Post-run: quads · calves · child’s pose + hip-flexor stretch (8 min).',
        5:'Pigeon + figure-4 + hamstring + hip-flexor stretch (12 min).',
        6:'Wrists + shoulders + full-body gentle flow (10 min).'
      };
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake: 500ml water + creatine 5g + weigh & log', sub:'The weekly AVERAGE is the number that counts — single days are noise.' },
      { id:'m2', group:'MORNING', label:'Stomach vacuums 3×20-30s', sub:'Empty stomach, exhale fully, navel to spine. Daily.' },
      { id:'m4', group:'MORNING', label:'Steps: 7-8k across the day', sub:'Calls, errands, stairs. The cheapest calorie lever there is, and it spares muscle.' },
      { id:'f6', group:'EATING', get label() { return 'MEAL 1 at ' + _times().open + ' — protein first + D3 + multivitamin'; }, sub:'e.g. eggs + bread + tuna + veg. Opens the eating window.' },
      { id:'f3', group:'EATING', label:'Last meal before 4PM', sub:'MEAL 2 — protein + rice/bread + veg (+ laban/yogurt). After this the kitchen is closed: water, black coffee, plain tea only.' },
      { id:'f1', group:'EATING', label:'Protein floor hit (see NUTRITION for your number)', sub:'Split across the two meals. Anchor each one with a protein source first.' },
      { id:'f2', group:'EATING', label:'Stayed at today’s calorie ceiling (Settings)', sub:'Log meals in FOOD LOG — save your staples to the library once and they autocomplete.', type:'info' },
      { id:'f4', group:'EATING', get label() { return 'Water: ' + _water().eat + 'L today'; }, sub:'+0.5L per hour of training. Front-load it: most of it before the evening.', type:'water', get waterTarget() { return _water().eat; } },
      { id:'f5', group:'EATING', label:'No money-trap “diet foods” (bars, rice cakes, juices)', sub:'They cost several times more per gram of protein than eggs, chicken, tuna, lentils and rice.' },
      { id:'e2', group:'EVENING', label:'Session done (PUSH Mon · RUN Tue · PULL Wed · LEGS Fri · SKILL Sat)', sub:'Mon/Wed/Fri strength days are the ones that protect muscle. Miss food if life happens — not the sessions.' },
      { id:'e3', group:'EVENING', label:'Cooldown stretch + hip-flexor stretch', sub:'The hip-flexor stretch is daily — it helps untilt a forward-tipped pelvis.' },
      { id:'s1', group:'SUPPLEMENTS', label:'Supplements taken', sub:'Tap to expand',
        subItems: [
          { id:'s1_a', name:'Creatine monohydrate', dose:'5g', when:'On waking, every day incl. fasts — no loading phase (ISSN 2018)' },
          { id:'s1_d', name:'Vitamin D3', dose:'1,000-2,000 IU', when:'With meal 1 (needs some fat). Stay under 4,000 IU/day' },
          { id:'s1_e', name:'Basic multivitamin', dose:'1 tablet', when:'With meal 1 — covers gaps on low calories' },
          { id:'s1_c', name:'Omega-3 (optional)', dose:'1-2g EPA+DHA', when:'With a meal' },
          { id:'s1_b', name:'Magnesium glycinate', dose:'200-300mg elemental', when:'Before bed' }
        ]
      },
      { id:'n2', group:'NIGHT', label:'Sleep 7-9h · bed at a consistent time', sub:'Short sleep in a deficit shifts the loss from fat toward muscle. 6h is the hard floor. Two wrecked nights in a row → next day is walk + core only.' }
    ],
    checklistFast: [
      { id:'wf1', group:'FAST', label:'Wake: 500ml salted water + creatine 5g + weigh & log', sub:'Creatine needs no food and doesn’t break the fast.' },
      { id:'wf3', group:'FAST', label:'No food until meal 1 tomorrow — water, black coffee, plain tea only', sub:'Coffee/tea before 2PM so it doesn’t wreck sleep. Max ~3-4 cups (400mg caffeine).' },
      { id:'wf2', group:'FAST', label:'Pinch of salt (~1/8-1/4 tsp) in every litre', sub:'Lots of plain water with no salt during a fast is how headaches and dizziness start.' },
      { id:'wf5', group:'FAST', get label() { return 'Water: ' + _water().fast + 'L today (salted)'; }, sub:'Sip across the day. Don’t go far past the target.', type:'water', get waterTarget() { return _water().fast; } },
      { id:'wf4', group:'FAST', label:'Walk 60-90 min easy-brisk + 10 min mobility', sub:'Split 2×40 is fine. No running, no strength work — the walk IS the session.' },
      { id:'wf7', group:'FAST', label:'Stomach vacuums 3×20s', sub:'Easy on an empty stomach.' },
      { id:'wf9', group:'FAST', label:'Magnesium 200-300mg before bed', sub:'Helps sleep and fast-day cramps.' },
      { id:'wf10', group:'FAST', label:'Tomorrow’s break-fast meal is planned', sub:'Protein first, normal size — e.g. eggs + bread + tuna. Post-fast hunger is when binges happen.' },
      { id:'wf8', group:'FAST', label:'STOP check: no palpitations / chest tightness / dizziness', sub:'Any of these → salt water + some food immediately, fast over, zero shame.' }
    ],

    foodGroupLabel: 'CYCLE EATING',
    foodGroupBg: 'rgba(130,224,170,0.1)',
    foodGroupColor: '#82e0aa',

    workoutContent() {
      const { w, t, tdee, mode, fmt, s } = _cycleState();
      const _ds = todayStr();
      const _fd = _fastDow();
      const _thuFast = _fd.includes(4);
      const _wm = _weekMath();
      const _wk = _planWeek();
      const _ri = _rampIndex(_wk);
      const _step = _RAMP[_ri];
      const _fastNames = _fd.length ? _fd.map(d => _DAYN[d]).join(' + ') : 'none';
      const _mathTxt = _wm ? ' At your numbers (' + _wm.cal + ' cal on ' + _wm.eat + ' eating days, TDEE ' + _wm.tdee + '): ≈ ' + Math.round(_wm.weekly).toLocaleString() + ' cal/week deficit ≈ ' + fmt(_wm.kg) + 'kg/week.' : '';
      let _mode;
      if (!w || !t) {
        _mode = { label:'SET YOUR NUMBERS', text:'Log a morning weight (TRACK tab) and set a target weight, calorie ceiling and TDEE in Settings — CYCLE then picks your mode, fast days and targets.' };
      } else if (mode === 'glide') {
        _mode = { label:'MODE: GLIDE — ' + fmt(w - t) + 'KG ABOVE TARGET', text:'Fasts: Thu + Sun. Eating days at your Settings ceiling' + (s.calories ? ' (' + s.calories + ' cal)' : '') + ', two meals inside the window.' + _mathTxt + ' When you’re within 2kg of ' + fmt(t) + 'kg the plan switches itself to BAND (Sunday fast only).' };
      } else if (mode === 'band') {
        _mode = { label:'MODE: BAND — HOLDING ' + fmt(t - 2) + '–' + fmt(t + 2) + 'KG', text:'Recomp territory: Sunday fast only, eat around maintenance (' + (tdee ? tdee + ' cal' : 'your TDEE') + ') and let training reshape you. Above ' + fmt(t + 2) + 'kg the plan returns to GLIDE (Thursday fast comes back); below ' + fmt(t - 2) + 'kg it goes to BELOW (+200 cal, no fasts).' };
      } else {
        _mode = { label:'MODE: BELOW BAND — ' + fmt(t - w) + 'KG UNDER TARGET', text:'No fasts. Eat a little above maintenance (' + (tdee ? (tdee + 200) + ' cal' : 'TDEE + 200') + ') until you’re back inside ' + fmt(t - 2) + '–' + fmt(t + 2) + 'kg, or lower your target in Settings.' };
      }
      const _heavy = w && w >= 100;
      const _todayByDow = {
        0: { fast:true, label:'SUNDAY — FAST + WALK', what:'No food. Walk 60-90 min easy + 10 min mobility. Salted water all day.' },
        1: { label:'MONDAY — PUSH', what:'Push-up track, pike track, dips, planche leans, rows, side raises, plank + hollow.' },
        2: { label:'TUESDAY — RUN + SPINE ARMOR', what:'This week: ' + _step.run + ' Then dead bugs, side planks, bird dogs, bridges.' },
        3: { label:'WEDNESDAY — PULL (THE STRENGTH CENTERPIECE)', what:'5×3-5 pull-ups or negatives with 2-3 min rests, then rows, Y-T-W, W-raises, hanging raises, grip.' + (_thuFast ? ' Train before meal 2 if your day allows — tomorrow is a fast.' : '') },
        4: _thuFast ? { fast:true, label:'THURSDAY — FAST + WALK', what:'No food. Walk 60-90 min easy + 10 min mobility. No training.' } : { label:'THURSDAY — RUN 2 + SKILL', what:'Easy 3-5K + 15 min of fresh handstand/L-sit/crow practice.' },
        5: { label:'FRIDAY — LEGS + GLUTES + LOADED CORE', what:'Squat track, Bulgarians, single-leg hip thrusts, sliding curls, RDLs, calves, loaded crunch, carries.' },
        6: { label:'SATURDAY — SKILL + SPEED + CONDITIONING', what:'Handstand/L-sit/crow → shadowbox → rope' + (_ri >= 3 ? ' → dashes (' + _step.dash + ')' : '') + '. Then batch-cook the week. Waist tape this morning.' }
      };
      const _dowNow = new Date().getDay();
      let _t = _todayByDow[_dowNow];
      if (typeof getDayType === 'function' && getDayType(_ds) === 'fast' && !_t.fast) {
        _t = { label: _t.label + ' · FASTED TODAY',
               what: 'This date is marked as a fast. Swap the session for a 60-90 min walk, or cap it at 75-80% with 2 reps in the tank. Salted water. Original slot: ' + _t.what };
      }
      const _wk1 = _wk === 1 ? '<div class="rule-sub" style="color:var(--accent2)">WEEK 1 = 70%: 3 sets wherever it says 4, one level easier on every track. No fasts this week if you’re returning from a break or illness (see RULES).</div>' : '';
      return `
      <div class="section-title">CYCLE <span>— THE SEASONS PLAN</span></div>

      <div class="rule-card" style="border-left-color:var(--accent)">
        <div class="rule-num" style="color:var(--accent)">▶ TODAY — ${_t.label}${_wk ? ' · WEEK ' + _wk : ''}</div>
        <div class="rule-text">${_t.what}</div>
        ${_wk1}
      </div>

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">${_mode.label}</div>
        <div class="rule-text">${_mode.text}</div>
        <div class="rule-sub">Fast days this mode: ${_fastNames}. Design law: every exercise below is zero-equipment by default — the only "weight" is a backpack with books or bottles. Load = a harder variation, not a heavier weight. DBs, machines and bars are UPGRADES, never requirements.</div>
      </div>

      <div class="section-title">THE WEEK <span>— DECISIONS MADE ONCE</span></div>

      ${workoutCard('MONDAY — PUSH','STRENGTH + CHEST/SHOULDERS + SERRATUS · ~60 MIN',
        exRow('Warmup','Arm circles + scap push-ups 2×10 + wall slides 2×10.','8 min')+
        exRowWithLevel('push','Push-up progression track','MAIN LIFT — hardest clean variation you own (decline → archer → pseudo-planche), 1-2 reps in reserve. 2 min rests. Level up when 4×8 is clean.','4×5-8',true)+
        exRowWithLevel('shoulder','Pike press → wall handstand push-up track','The overhead press, no bar needed. Slow lowering.','3×6-10',true)+
        exRow('Chair dips','Two sturdy chairs or a counter edge, slow lowering. UPGRADE: chest press machine 3×8-12.','3×8-12')+
        exRow('Pseudo-planche lean holds','Push-up position, hands turned out, shoulders past wrists, lean and hold. Serratus + straight-arm strength.','3×20s')+
        exRow('Table/towel rows','Under a sturdy table or towel round a post — slow 3-count lowering. Keeps the week pull-dominant.','3×10')+
        exRow('Side raises','Water bottles or a loaded bag, strict, no swing. UPGRADE: DBs.','3×12-15')+
        exRow('Plank + hollow hold','Squeeze-everything plank 3×30-45s, then hollow body hold 3×20s.','2 moves'),
        stretchRow('Doorframe chest + dislocates + wrists + hip-flexor stretch','','8 min'),
        'MON'
      )}

      ${workoutCard('TUESDAY — RUN + SPINE ARMOR','PER THE RUN RAMP · EASY = CONVERSATIONAL · ~45-55 MIN',
        exRow('Run','This week: ' + _step.run + ' Decent shoes, flat routes. Full ramp in the RUN RAMP card below.','per ramp')+
        exRow('Slow dead bugs','Lower back glued to the floor while opposite arm and leg lower slowly.','3×10/side')+
        exRow('Side plank','Elbow under shoulder, body in a straight line, hips high.','3×30s/side')+
        exRow('Bird dogs','Hands and knees, reach opposite arm and leg long, 2s hold, no hip rotation.','3×8/side')+
        exRow('Glute bridge','Drive through the heels, 2s squeeze at the top.','2×15'),
        stretchRow('Calves + hamstrings post-run','','8 min'),
        'TUE'
      )}

      ${workoutCard('WEDNESDAY — PULL','THE STRENGTH CENTERPIECE + BACK + HANGING CORE · ~60 MIN',
        exRow('Warmup','Dead hang 2×20-30s + scap pulls 2×8.','6 min')+
        exRow('Pull-up strength work','MAIN LIFT — 5 sets of 3-5, 2-3 MIN rests, any bar. Not there yet: jump up + 5-second negatives, 5×3. No bar at all: heavy towel rows under a solid table, 5×5, same rests.','5×3-5')+
        exRow('Table/towel rows','Slow 3-count lowering, chest to the edge. UPGRADE: pulldown machine.','4×8-12')+
        exRow('Prone Y-T-W','Face down, raise straight arms into each letter, squeeze the blades.','2×8 each')+
        exRow('Prone W-raises','Face down, elbows bent to a W, squeeze the shoulder blades down and back.','3×12')+
        exRow('Hanging knee → leg raise track','On the bar: knees up slow, no swing → straight legs as you progress. No bar: lying leg raises with the backpack on your ankles.','3×8-12')+
        exRow('Grip: towel hang or bag hold','Towel over the bar and hang, or hold the loaded backpack by the straps.','2×30s'),
        stretchRow('Full shoulder sequence + hip-flexor stretch','','10 min'),
        'WED'
      )}

      ${_thuFast ? workoutCard('THURSDAY — FAST + WALK','REST FROM TRAINING · THE WALK IS THE SESSION',
        exRow('Walk','60-90 min easy-brisk, split 2×40 if you like. No running.','60-90 min')+
        exRow('Mobility','Hips, upper back, hamstrings + hip-flexor stretch.','10 min')+
        exRow('Stomach vacuums','Optional — easy on an empty stomach.','3×20s')+
        exRow('Salted water','Pinch of salt per litre, ' + _water().fast + 'L across the day.','all day'),
        stretchRow('Nothing aggressive — recovery day','','—'),
        'THU'
      ) : workoutCard('THURSDAY — RUN 2 + SKILL','EASY RUN + SKILL WHILE FRESH',
        exRow('Run 2','Easy 3-5K. Alternate weeks: finish with 4×15s relaxed-fast strides.','3-5K')+
        exRow('Wall handstand holds','Kick up, arms locked, bail sideways. Quality seconds — log your PR.','5×15-30s')+
        exRow('L-sit tuck progression','Chair edges or floor — knees tucked, hips lifted, shoulders down.','5×8-15s')+
        exRow('Crow holds','Knees on elbows, lean until the feet float. Practice, not effort.','5 attempts'),
        stretchRow('Quads + calves + child’s pose + hip-flexor stretch','','8 min'),
        'THU'
      )}

      ${workoutCard('FRIDAY — LEGS + GLUTES + LOADED CORE','THE BACKPACK DAY · ~65 MIN',
        exRowWithLevel('squat','Squat → pistol progression track','MAIN LIFT — split squat → shrimp → pistol; hardest clean variation, 1-2 reps in reserve. Backpack optional.','4×6-10',true)+
        exRow('Bulgarian split squats','Rear foot on a chair, bag hugged to the chest once bodyweight passes 12-15 reps, slow lowering.','3×8-12/leg')+
        exRow('Single-leg hip thrusts','Shoulders on the sofa, backpack on the hips, drive up, squeeze 2s. The main glute-shape move.','3×10-15/leg')+
        exRow('Sliding leg curls','Towel or socks under the heels, bridge, slide out slow, drag back.','3×8-12')+
        exRowWithLevel('hinge','Hinge progression track (single-leg RDL by default)','Flat back — hamstrings, glutes, balance, lower back.','3×8/leg',true)+
        exRow('Single-leg calf raises','Slow, off a step, full stretch at the bottom.','3×12-15')+
        exRow('Backpack loaded crunch','Bag hugged to the chest, crunch slow, add books as it gets easy — abs grow from load like any muscle.','3×12')+
        exRow('Suitcase carries','One-hand bag carry, dead-straight posture — obliques, the muscle under the love handles.','3×30-40m/side')+
        exRow('Dead bug + reverse crunch','Pelvic-tilt control to finish.','2×10 each'),
        stretchRow('Pigeon + figure-4 + hamstring + hip-flexor stretch','','12 min'),
        'FRI'
      )}

      ${workoutCard('SATURDAY — SKILL + SPEED + CONDITIONING','SKILL · CONDITIONING · DASHES · BATCH-COOK · ~60 MIN',
        exRow('Wall handstand holds','Kick up, arms locked, bail sideways. Log your seconds.','5×20-30s')+
        exRow('Tuck → L-sit holds','Chair edges or floor, hips lifted, shoulders down.','5×10s')+
        exRow('Crow practice','Knees on elbows, lean until the feet float.','5 attempts')+
        exRow('Shadowbox','Fast hands, real footwork, 1 min rest between rounds.','5×2 min')+
        exRow('Jump rope','Light, quick contacts.' + (_heavy ? ' At 100kg+ use low hops or step-overs and keep it short; skip jump squats/burpees (WORKOUTS_LIBRARY §2.3).' : ''),'10×30s')+
        exRow('Dashes (from ramp week 4)','After the warm-up: ~60m at the ramp’s effort, walk back between each. Flat ground or grass. This week: ' + _step.dash + '.','6-10 × 60m')+
        exRow('BATCH-COOK','Cook the week’s chicken + rice, portion, refrigerate/freeze.','~30 min'),
        stretchRow('Wrists + shoulders + gentle full-body flow','','10 min'),
        'SAT'
      )}

      ${workoutCard(_fd.includes(0) ? 'SUNDAY — FAST + WALK' : 'SUNDAY — REST + WALK','REST DAY · THE WALK IS THE SESSION',
        exRow('Walk','60-90 min easy, split freely. Zero recovery cost.','60-90 min')+
        exRow('Mobility','Hips, upper back, hamstrings + hip-flexor stretch.','10 min')+
        exRow(_fd.includes(0) ? 'Salted water' : 'Water', (_fd.includes(0) ? 'Pinch of salt per litre, ' + _water().fast : _water().eat) + 'L across the day.','all day'),
        stretchRow('Nothing aggressive — recovery day','','—'),
        'SUN'
      )}

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">THE RUN RAMP — JOINTS FIRST${_wk ? ' · YOU ARE IN WEEK ' + _wk : ''}</div>
        <div class="rule-text">${_RAMP.map((r, i) => (i === _ri ? '▶ <strong>' : '') + 'Wk ' + r.wk + ': ' + r.run + (r.dash !== '—' ? ' · Sat dashes: ' + r.dash : '') + (i === _ri ? '</strong>' : '')).join('<br>')}</div>
        <div class="rule-sub">${_wk ? 'Week counted from your plan start date (Settings).' : 'Set a plan start date in Settings and the ramp tracks your week automatically.'} Easy = you can talk in full sentences. Add at most ~10-15% distance a week. Never run on a fast day. Sore knees/shins → swap that run for walk intervals. Wheeze, chest tightness or a returning cough → stop and repeat the previous week. Achilles/calf pain → stop and get it checked (some antibiotics weaken tendons for months).</div>
      </div>

      <div class="rule-card" style="border-left-color:#70c8ff">
        <div class="rule-num">WHERE EACH GOAL LIVES</div>
        <div class="rule-text">STRENGTH + DENSITY → Mon/Wed/Fri low-rep progression mains · GLUTES + LOVE HANDLES → Friday hip thrusts, Bulgarians, RDLs, carries (shape; fat loss itself is whole-body) · CORE → loaded crunches, hanging raises, planks, hollow holds + daily vacuums · SPEED + POWER → Saturday dashes + shadowbox · ENGINE → the run ramp · SKILL → handstand, L-sit, crow, planche leans.</div>
        <div class="rule-sub">Progress = a harder variation for the same 4-8 clean reps. At the 12-week checkpoint harder blocks get added. Muscle definition shows as fat comes off — the tape and photos show it before the scale.</div>
      </div>`;
    },

    nutritionContent(s) {
      const cal = s.calories || 1500;
      const macros = computeMacros(todayStr());
      const { proteinG, carbsG, fatG, warnings: macroWarnings } = macros;
      const warningHtml = macroWarnings.length ? macroWarnings.map(w =>
        `<div style="border-left:3px solid var(--accent2);padding:6px 10px;margin-bottom:6px;border-radius:4px;background:var(--surface);font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent2);line-height:1.6">${w}</div>`
      ).join('') : '';
      const { w, t, mode, fmt } = _cycleState();
      const _pfm = cycle.proteinFloorMultiplier || 1.6;
      const _floorG = w ? Math.round(w * _pfm) : null;
      const _floorTxt = !_floorG ? 'Log a weight to see your protein floor'
        : (mode === 'glide' && t ? 'Protein floor: ~' + _floorG + 'g (1.6 g/kg × your ' + fmt(t) + 'kg target)' : 'Protein floor: ~' + _floorG + 'g (1.6 g/kg × your latest ' + fmt(w) + 'kg)');
      const { open, close } = _times();
      const _wt = _water();
      const _fd = _fastDow();
      const _wm = _weekMath();
      const m1 = Math.round(cal * 0.45 / 10) * 10, m2 = cal - m1;

      const _supRows = [
        ['Creatine 5g', d => '✓'],
        ['Multivitamin', d => _fd.includes(d) ? '—' : '✓'],
        ['D3 1-2k IU', d => _fd.includes(d) ? '—' : '✓'],
        ['Omega-3 (opt)', d => _fd.includes(d) ? '—' : '✓'],
        ['Salt in water', d => _fd.includes(d) ? '✓' : '—'],
        ['Magnesium', d => '✓']
      ];
      const _order = [1, 2, 3, 4, 5, 6, 0];
      const _cell = 'padding:3px 2px;text-align:center;border-bottom:1px solid var(--border)';
      const _supTable = '<table style="width:100%;border-collapse:collapse;font-family:\'DM Mono\',monospace;font-size:0.58rem;margin-top:6px">' +
        '<tr><th style="' + _cell + ';text-align:left"></th>' + _order.map(d => '<th style="' + _cell + ';color:' + (_fd.includes(d) ? 'var(--fast)' : 'var(--muted)') + '">' + _DAYN[d].charAt(0) + (_fd.includes(d) ? '·F' : '') + '</th>').join('') + '</tr>' +
        _supRows.map(([n, f]) => '<tr><td style="' + _cell + ';text-align:left;white-space:nowrap">' + n + '</td>' + _order.map(d => '<td style="' + _cell + ';color:' + (f(d) === '✓' ? 'var(--accent)' : 'var(--muted)') + '">' + f(d) + '</td>').join('') + '</tr>').join('') +
        '</table>';

      let _mathCard = '';
      if (_wm) {
        const _risk = _wm.pct != null && _wm.pct > 1.2;
        _mathCard = '<div class="rule-card" style="border-left-color:' + (_risk ? 'var(--accent2)' : '#70c8ff') + '"><div class="rule-num">YOUR WEEK IN NUMBERS</div><div class="rule-text">' +
          'This setup: ' + _wm.eat + ' eating days at ' + _wm.cal + ' + ' + _wm.fasts + ' fast day' + (_wm.fasts === 1 ? '' : 's') + ' vs TDEE ' + _wm.tdee + '<br>' +
          '→ ≈ ' + Math.round(_wm.weekly).toLocaleString() + ' cal/week deficit ≈ <strong>' + fmt(_wm.kg) + 'kg/week</strong>' + (_wm.pct != null ? ' (' + fmt(_wm.pct) + '% of bodyweight)' : '') + '<br>' +
          'Eating at maintenance every day: 0 deficit → weight holds.</div>' +
          '<div class="rule-sub">' + (_risk ? 'Fast pace — muscle is only protected if the protein floor and all three strength days happen. Ease-off triggers are in RULES. ' : '') + 'Your TDEE falls as you get lighter, so the weekly loss slows over time. Weekly calibration (TRACK) replaces the estimate with your real burn after 2-3 weeks of logs.</div></div>';
      }

      return `
      <div class="section-title">CYCLE <span>NUTRITION</span></div>
      <p class="section-note">Two meals inside ${open}–${close}, one shopping list, no diet foods. Your ceiling and protein floor come from Settings and your latest logged weight.</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#82e0aa">${cal}</div><div class="macro-lbl">Day ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${warningHtml}

      ${(()=>{
        const _dt = getDayType(todayStr());
        if(_dt === 'fast') return '<div class="rule-card" style="border-left-color:var(--fast)"><div class="rule-num">FAST DAY ACTIVE</div><div class="rule-text">No food until meal 1 tomorrow (' + open + '). Water, black coffee, plain tea · pinch of salt per litre · ' + _wt.fast + 'L today · creatine still happens.</div><div class="rule-sub">Break it with the planned meal — protein first, normal size. Never two fast days in a row.</div></div>';
        const _dc = getDayCalories(todayStr());
        const _rem = cal - _dc.total;
        const _cls = !_dc.hasData ? 'var(--muted)' : _dc.total > cal ? 'var(--danger)' : (_rem <= 100 ? 'var(--accent2)' : 'var(--accent)');
        const _remTxt = !_dc.hasData ? 'No food logged yet — tap FOOD LOG on TODAY tab' : (_rem >= 0 ? _rem + ' cal remaining' : Math.abs(_rem) + ' cal OVER ceiling');
        const _pctW = _dc.hasData ? Math.min(100, Math.round(_dc.total / cal * 100)) : 0;
        const _barColor = _dc.total > cal ? 'var(--danger)' : _dc.total > cal * 0.85 ? 'var(--accent2)' : 'var(--accent)';
        return '<div class="rule-card" style="border-left-color:'+_cls+'"><div class="rule-num">TODAY\'S INTAKE</div><div class="rule-text" style="font-size:0.85rem;color:'+_cls+'">'+(_dc.hasData ? _dc.total + ' / ' + cal + ' cal' : '0 / ' + cal + ' cal')+'</div><div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+_pctW+'%;background:'+_barColor+';border-radius:3px;transition:width 0.3s"></div></div><div class="rule-sub">'+_remTxt+'</div></div>';
      })()}

      <div class="rule-card" style="border-left-color:#ff9966">
        <div class="rule-num">THE TWO MEALS — ${open}–${close}</div>
        <div class="rule-text">MEAL 1 · ${open} · ~${m1} cal — e.g. 4 eggs + 1 pita + 1 can tuna in water + cucumber/tomato. Take D3 + multivitamin here.<br>MEAL 2 · by ${close} · ~${m2} cal — e.g. 200g cooked chicken breast + 150g cooked rice + salad/pickles + 500ml low-fat laban or a yogurt.<br>${_floorTxt}</div>
        <div class="rule-sub">Examples are sized for ~1,500 cal (~140g protein) — scale the rice/bread to your ceiling; keep the protein anchors. Lentils and chickpeas are cheap protein top-ups. Outside the window: water, black coffee, plain tea only. Train 1-2h after meal 2, or before it on days a fast follows.</div>
      </div>

      ${_mathCard}

      <div class="rule-card" style="border-left-color:#88ccff">
        <div class="rule-num">WATER — YOUR DAILY TARGET</div>
        <div class="rule-text">Eating days: <strong>${_wt.eat}L</strong> (+0.5L per hour of training)<br>Fast days: <strong>${_wt.fast}L</strong>, with a pinch of salt (~1/8-1/4 tsp) in every litre<br>Pace: 500ml on waking · ~40% by noon · ~70% by 4PM · the rest by early evening · stop ~1h before bed.</div>
        <div class="rule-sub">Set from your weight (~33 ml/kg), so it drops as you do. Don’t drink far past the target — more plain water isn’t better, especially while fasting.</div>
      </div>

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">SUPPLEMENT TRACK — THE WEEK</div>
        <div class="rule-text">Creatine on waking · D3 + multivitamin (+ omega-3) with meal 1 · magnesium before bed · salt only on fast days.${_supTable}</div>
        <div class="rule-sub">F = fast day in your current mode. Creatine 5g, no loading (ISSN 2018) · D3 1,000-2,000 IU (NIH UL 4,000) · magnesium glycinate 200-300mg elemental (UL 350 supplemental) · caffeine ≤400mg/day, before 2PM. Check with a doctor first if you take medication or have a kidney condition. The multivitamin covers zinc — don’t add extra.</div>
      </div>

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">THE WEEKLY SHOP — ONE TRIP, BORING FOOD</div>
        <div class="rule-text">A tray of eggs · chicken breast or whole chickens · canned tuna in water · laban, yogurt or milk · dry lentils or chickpeas · a big bag of rice + pita/bread · cucumbers, tomatoes, pickles, frozen veg · bananas + citrus</div>
        <div class="rule-sub">Skip the “diet foods” — protein bars, rice cakes, processed deli meat, juice. Per gram of protein they usually cost several times what whole foods do.</div>
      </div>

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">PROTEIN TRIAGE — THE HONEST-DAY RULE</div>
        <div class="rule-text">Can’t-eat or won’t-eat day: the only job is hitting the protein floor from whatever is easiest. Calories land where they land; the day still counts.</div>
        <div class="rule-sub">Cap: 2 such days a week beyond the fast days. More than that stops being a plan and becomes a crash diet — the strength sessions carry muscle retention on those days.</div>
      </div>

      <div class="section-title" style="margin-top:8px">SKIN — <span>THE SLOW-LOSS DEFENSE</span></div>
      ${ruleCard('RATE CONTROL','Skin remodels over months behind the loss. The faster the loss, the more the strength work and protein floor matter.','Patience does the rest once you reach BAND.','#82e0aa')}
      ${ruleCard('BONE BROTH + VITAMIN C','Chicken bones + a splash of vinegar, simmered 3-4h — glycine and proline, collagen building blocks. Have it with meal 2. Fruit and veg supply the vitamin C collagen synthesis needs.','Collagen peptides are the paid version — modest evidence, optional.','#82e0aa')}
      ${ruleCard('MUSCLE FILLS THE SPACE','The strength sessions, glute work and loaded core build tissue under the skin as fat leaves.','This is why the sessions matter more than any single meal.','#82e0aa')}`;
    },

    rulesContent(s) {
      const { t, tdee, fmt } = _cycleState();
      const _band = t ? fmt(t - 2) + '–' + fmt(t + 2) + 'kg' : 'target ±2kg';
      const { open, close } = _times();
      return `
      <div class="section-title">THE <span>LAWS</span></div>
      ${ruleCard('LAW 01','The Mon/Wed/Fri strength sessions are the priority.','They are what keeps muscle while fat comes off. Miss food if life happens — keep the sessions. Body + backpack + gravity is the gym.')}
      ${ruleCard('LAW 02','Kitchen hours: ' + open + '–' + close + '. Two meals.','Outside the window: water, black coffee, plain tea. Change the window in Settings if your day shifts — the plan follows it.')}
      ${ruleCard('LAW 03','Fast days follow your mode — GLIDE: Thu + Sun · BAND: Sun · BELOW: none.','A fast runs from the last meal the day before to meal 1 the day after. Never two in a row. No training on a fast — the walk is the session. Break it with the planned, protein-first meal.')}
      ${ruleCard('LAW 04','Respect the calorie floor.','Settings warns you below the plan floor (' + (cycle.minCalories || 1400) + ' cal). Very low intake loses muscle and rebounds.')}
      ${ruleCard('LAW 05','Walks are the lever, never the punishment.','7-8k steps on eating days, 60-90 min on fast days. On a wrecked day, cut the walk length — not the strength session.')}
      ${ruleCard('LAW 06','STOP cluster: palpitations · chest tightness · dizziness or vision changes','Salt water + some food immediately, whatever day it is. Persistent symptoms → see a doctor.')}
      ${ruleCard('LAW 07','Sleep 7-9 hours. 6 is the hard floor.','Two wrecked nights in a row → next day is walk + core only. Recovery happens in bed.')}
      ${ruleCard('LAW 08','No diet-food purchases.','Bars, rice cakes, processed meats, juices. Whole foods are cheaper per gram of protein and more filling.')}

      <div class="section-title" style="margin-top:8px">EASE-OFF <span>TRIGGERS</span></div>
      ${ruleCard('RAISE EATING DAYS BY ~300 CAL FOR A WEEK (KEEP THE FASTS) IF…','Reps on your hardest variation drop 2 sessions in a row · you step down a level on a move you owned · holds get noticeably shorter for a week · dizziness or lightheadedness · sleep wrecked for several nights · fasts start leading to binges.','A week of slightly more food you stick to beats a deficit you don’t. Breathing problems back → drop the runs and see a doctor.','var(--accent2)')}

      <div class="section-title" style="margin-top:8px">THE <span>SCOREBOARD</span></div>
      ${ruleCard('WAIST OVER SCALE','Waist tape every Saturday morning at the navel AND the love-handle line · photos every 2 weeks · PRs (pull-up reps, handstand seconds, 5K time). Scale = weekly AVERAGE only.','Never measure the morning after a fast — it reads falsely low. Creatine adds ~0.5-1kg of water inside muscle; the tape ignores it.','var(--accent2)')}

      <div class="section-title" style="margin-top:8px">THE <span>AUTOPILOT</span></div>
      ${ruleCard('MODES ARE COMPUTED, NOT SCHEDULED','The plan reads your latest weight against your target: GLIDE above the band, BAND inside ' + _band + ', BELOW under it — fast days and calorie suggestions follow' + (tdee ? ' (TDEE ' + tdee + ')' : '') + '.','Changed mode? Fast days already on the calendar stay — REMOVE + re-add the schedule (or tap days in MONTHS) to apply the new pattern.','#70c8ff')}
      ${ruleCard('THE BAND — ' + _band.toUpperCase(),'Inside the band: Sunday fast only, eat ≈ maintenance, recomp. Above it the Thursday fast returns; below it, no fasts and +200 cal.','No end date. The plan doesn’t finish — it holds.','#70c8ff')}
      ${ruleCard('STARTING, OR AFTER A BREAK OR ILLNESS','Week 1: no fasts, ~70% volume (3 sets wherever it says 4), one level down on each track · Week 2: Sunday fast only · Week 3: full plan. The run ramp restarts at week 1.','Breathlessness, chest tightness or lingering symptoms → get medical clearance before hard sessions. In MONTHS, tap any auto-marked fast in weeks 1-2 to unmark it.','#70c8ff')}
      ${ruleCard('12-WEEK CHECKPOINT','Every 12 weeks: photos + waist + PRs on the table → harder variations and new blocks get added deliberately, from progress — not from a bad week.','The run ramp moves to its open-ended stage at week 13.','#70c8ff')}
      ${ruleCard('MINIMUM VIABLE DAY','Protein floor + 20-min walk + one skill drill.','Bad days are part of the design. The plan survives seasons because it expects weather.','#70c8ff')}`;
    }
};
