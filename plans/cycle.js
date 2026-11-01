// plans/cycle.js — CYCLE: the seasons recomp plan.
// Built to run indefinitely, not toward a deadline. Bodyweight-first by design
// law: every exercise defaults to zero equipment; the only implied "weight" is
// a loaded backpack, and DBs/machines/bars appear only as UPGRADE notes.
//
// v8.10.9: de-personalized. Every number the plan shows is derived at render
// time from the user's own Settings + logs (latest weight, target, calorie
// ceiling, TDEE, protein floor via computeMacros) — no hardcoded body stats,
// dates, locations, currencies or one person's history. Modes are computed,
// not dated:
//   GLIDE — latest weight more than 2kg above target → ceiling ≈ TDEE − 500.
//   BAND  — within ±2kg of target → ceiling ≈ TDEE; autopilot keeps it there.
//   BELOW — more than 2kg under target → ceiling ≈ TDEE + 200 until back.
// Training week: Mon PUSH · Tue RUN 1 · Wed PULL · Thu RUN 2 + skill ·
// Fri LEGS + loaded core · Sat SKILL + SPEED + batch-cook · Sun FAST + walk.

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

export const cycle = {
    name: 'CYCLE',
    goalMode: 'cut',
    // Fallback only — Settings recomputes TDEE per user (Mifflin × activity).
    tdee: 2600,
    fastDaysPerWeek: 1,
    badge: 'CYCLE',
    badgeClass: '',
    descClass: '',
    subtitle: 'Seasons recomp. Bodyweight-first. One fast day. Waist over scale.',
    bannerColor: '#82e0aa',
    bannerBg: 'rgba(130,224,170,0.07)',
    bannerBorder: 'rgba(130,224,170,0.35)',
    fastDaysDow: [0], // Sundays — rest day, fast day, prep day
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    // [protein%, carbs%, fat%] — the protein floor below is the real constraint.
    macroSplit: { base:[30,42,28], rest:[30,42,28], preFast:[30,42,28], stall:[30,42,28], satiety:[30,42,28] },
    // 1.6 g/kg of current weight — the evidence-based floor for keeping and
    // building muscle in a moderate deficit (ISSN Protein & Exercise; Morton 2018).
    proteinFloorMultiplier: 1.6,
    caloriesMode: 'floor',
    minCalories: 1400,
    activityByDayType: { eatDay: 1.65, fastDay: 1.35 },
    // Only the session item is derived from WORKOUTS-tab progress. Vacuums,
    // broth and the cooldown stretch are ordinary hand-ticked items.
    autoWorkoutIds: ['e2'],

    defaultTimes: { wakeTime:'06:30', lastMealTime:'21:00', eveningSessionTime:'17:30', eatingWindowStart:null },

    weekIcons: {0:'🔥',1:'💪',2:'🏃',3:'💪',4:'🏃',5:'🦵',6:'🤸'},

    morningSub: {
      0:'SUNDAY — FAST day. Salt water on waking. Weekly shop today or yesterday. Weigh + log.',
      1:'MONDAY — Weigh + log (the weekly average is what counts). Start banking walk minutes early.',
      2:'TUESDAY — Weigh + log. Run day — morning or evening, your call.',
      3:'WEDNESDAY — Weigh + log. Tonight is the strength centerpiece: pull-ups, long rests, low reps.',
      4:'THURSDAY — Weigh + log. Run 2 + skill practice while fresh.',
      5:'FRIDAY — Weigh + log. Legs + the loaded-core block tonight — pack the backpack.',
      6:'SATURDAY — Weigh + log + WAIST TAPE (the real scoreboard). Skill + speed session, then batch-cook for the week.'
    },
    eveningSub: {
      0:'SUNDAY — Long easy walk + 20-min hip session. Salt + electrolyte + water. That’s the whole day.',
      1:'MONDAY — SESSION: PUSH. Push-up track, pike→handstand press, planche leans, dips, side raises. 2 reps in the tank everywhere.',
      2:'TUESDAY — RUN per the ramp (see WORKOUTS) + 10-min spine armor.',
      3:'WEDNESDAY — SESSION: PULL. 5×3-5 pull-ups or negatives with long rests, then rows, Y-T-W, hanging raises, forearms.',
      4:'THURSDAY — RUN per the ramp + 15-min fresh skill: wall handstand, L-sit tucks, crow.',
      5:'FRIDAY — SESSION: LEGS + GLUTES + LOADED CORE. Pistol track, Bulgarians, hip thrusts, sliding curls, loaded crunches, carries.',
      6:'SATURDAY — SESSION: SKILL + SPEED. Skill circuit · shadowbox · jump rope · dragon flags · hollow holds.'
    },
    stretchSub: {
      0:'Full hip session — 90/90 · pigeon · cossack · deep squat + hip-flexor stretch 2×60s/side (20 min).',
      1:'Doorframe chest + shoulder dislocates + wrists + hip-flexor stretch (8 min).',
      2:'Post-run: calves · hamstrings · hip-flexor stretch (8 min).',
      3:'Full shoulder sequence + hip-flexor stretch (10 min).',
      4:'Post-run: quads · calves · child’s pose + hip-flexor stretch (8 min).',
      5:'Pigeon + figure-4 + hamstring + hip-flexor stretch (12 min).',
      6:'Wrists + shoulders + full-body gentle flow (10 min).'
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake: water + weigh + log', sub:'The weekly AVERAGE is the number that counts — single days are noise.' },
      { id:'m2', group:'MORNING', label:'Stomach vacuums 3×20-30s', sub:'Empty stomach, exhale fully, navel to spine. Daily.' },
      { id:'m3', group:'MORNING', label:'Morning role done (see today’s sub-text)', sub:'Mostly: start banking the day’s walk minutes. Saturdays: waist tape too.' },
      { id:'m4', group:'MORNING', label:'Walk minutes banked: 45-90 total today', sub:'Split freely — calls, errands, stairs. The cheapest calorie lever there is, and it spares muscle.' },
      { id:'f1', group:'EATING', label:'Protein floor hit (see NUTRITION for your number)', sub:'Set from your logged weight. Anchor every meal with a protein source first.' },
      { id:'f2', group:'EATING', label:'Stayed at today’s calorie ceiling (Settings)', sub:'Log meals in FOOD LOG — save your staples to the library once and they autocomplete.', type:'info' },
      { id:'f3', group:'EATING', label:'THE MEAL eaten — protein + carb + veg', sub:'Any cuisine works if calories are dealt with. Batch-cooked Saturday = zero decisions today.' },
      { id:'f4', group:'EATING', label:'3L+ water across the day', sub:'+500ml on run days. Never restricted.', type:'water', waterTarget:3.0 },
      { id:'f5', group:'EATING', label:'No money-trap “diet foods” (bars, rice cakes, juices)', sub:'They cost several times more per gram of protein than eggs, whole chicken, lentils and rice.' },
      { id:'e1', group:'EVENING', label:'Mug of bone broth (or a protein-rich evening snack)', sub:'Broth from your own roast-chicken bones = collagen building blocks for close to nothing. Fruit/veg covers the vitamin C.' },
      { id:'e2', group:'EVENING', label:'Session done (PUSH Mon · RUN Tue/Thu · PULL Wed · LEGS Fri · SKILL Sat)', sub:'Mon/Wed/Fri strength days are the ones that protect muscle. Miss food if life happens — not the sessions.' },
      { id:'e3', group:'EVENING', label:'Cooldown stretch + hip-flexor stretch', sub:'The hip-flexor stretch is daily — it helps untilt a forward-tipped pelvis.' },
      { id:'s1', group:'SUPPLEMENTS', label:'Supplements taken', sub:'Tap to expand',
        subItems: [
          { id:'s1_a', name:'Creatine monohydrate', dose:'3-5g', when:'Any time, daily — no loading phase (ISSN 2018)' },
          { id:'s1_b', name:'Magnesium (optional)', dose:'200-300mg', when:'Before bed' },
          { id:'s1_c', name:'Omega-3 (optional)', dose:'1-2g EPA+DHA', when:'With a meal' }
        ]
      },
      { id:'n2', group:'NIGHT', label:'Sleep 7-9h · bed at a consistent time', sub:'Short sleep in a deficit shifts the loss from fat toward muscle. Two wrecked nights in a row → next day is walk + core only.' }
    ],
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water + pinch of salt on waking, again mid-afternoon', sub:'One fast day needs hygiene, not heroics.' },
      { id:'wf2', group:'FAST', label:'Electrolyte tab mid-day', sub:'Sodium + potassium keep fasted walking comfortable.' },
      { id:'wf3', group:'FAST', label:'No food. Water, black coffee, plain tea only', sub:'Break the fast gently tomorrow morning — protein first, not a feast.' },
      { id:'wf4', group:'FAST', label:'Walk 45-90 min + full hip session', sub:'No hard lifting on the fast day — the walk IS the session.' },
      { id:'wf5', group:'FAST', label:'3L+ water total today', sub:'Sip constantly.', type:'water', waterTarget:3.0 },
      { id:'wf6', group:'FAST', label:'Weekly shop done (today or Saturday)', sub:'The list lives in NUTRITION.' },
      { id:'wf7', group:'FAST', label:'Vacuums + creatine still happen', sub:'Creatine needs no food.' },
      { id:'wf8', group:'FAST', label:'STOP check: no palpitations / chest tightness / dizziness', sub:'Any of these → salt water + some carbs immediately, fast over, zero shame.' }
    ],

    foodGroupLabel: 'CYCLE EATING',
    foodGroupBg: 'rgba(130,224,170,0.1)',
    foodGroupColor: '#82e0aa',

    workoutContent() {
      const { w, t, tdee, mode, fmt } = _cycleState();
      const _ds = todayStr();
      let _mode;
      if (!w || !t) {
        _mode = { label:'SET YOUR NUMBERS', text:'Log a morning weight (TRACK tab) and set a target weight + TDEE in Settings — CYCLE then shows your mode and calorie targets here.' };
      } else if (mode === 'glide') {
        _mode = { label:'MODE: GLIDE — ' + fmt(w - t) + 'KG ABOVE TARGET', text:'Steady loss toward ' + fmt(t) + 'kg at roughly 0.5-1% of bodyweight a week. Eating-day ceiling ≈ ' + (tdee ? (tdee - 500) + ' cal (TDEE ' + tdee + ' − 500)' : 'TDEE − 500 (set TDEE in Settings)') + '. When the weekly average reaches ' + fmt(t + 2) + 'kg, the plan switches itself to BAND.' };
      } else if (mode === 'band') {
        _mode = { label:'MODE: BAND — HOLDING ' + fmt(t - 2) + '–' + fmt(t + 2) + 'KG', text:'Recomp territory: eat around maintenance (' + (tdee ? tdee + ' cal' : 'your TDEE') + ') and let training reshape you. Autopilot: two weekly averages above ' + fmt(t + 2) + ' → add a second fast day until back inside; below ' + fmt(t - 2) + ' → +200 cal on eating days.' };
      } else {
        _mode = { label:'MODE: BELOW BAND — ' + fmt(t - w) + 'KG UNDER TARGET', text:'Eat a little above maintenance (' + (tdee ? (tdee + 200) + ' cal' : 'TDEE + 200') + ') until the weekly average is back inside ' + fmt(t - 2) + '–' + fmt(t + 2) + 'kg, or lower your target in Settings.' };
      }
      const _heavy = w && w >= 100;
      const _todayByDow = {
        0: { label:'SUNDAY — FAST + WALK', what:'No food, no decisions. Long easy walk + full hip session. Shop/batch-cook if not done Saturday.' },
        1: { label:'MONDAY — PUSH', what:'Push-up track, pike→handstand press, planche leans, dips, side raises. 2 reps in the tank everywhere.' },
        2: { label:'TUESDAY — RUN 1', what:'Run per the ramp (RUN RAMP card) + 10-min spine armor. Easy = conversational.' },
        3: { label:'WEDNESDAY — PULL (THE STRENGTH CENTERPIECE)', what:'5×3-5 pull-ups or negatives with 2-3 min rests, then rows, Y-T-W, hanging raises, forearms.' },
        4: { label:'THURSDAY — RUN 2 + SKILL', what:'Run per the ramp + 15 min of fresh handstand/L-sit/crow practice.' },
        5: { label:'FRIDAY — LEGS + GLUTES + LOADED CORE', what:'Pistol track, backpack Bulgarians, hip thrusts, sliding curls, loaded crunches, obliques, carries.' },
        6: { label:'SATURDAY — SKILL + SPEED + BATCH-COOK', what:'Skill circuit → shadowbox → rope → dragon flags + hollow + vacuums. Then batch-cook the week. Waist tape this morning.' }
      };
      const _dowNow = new Date().getDay();
      let _t = _todayByDow[_dowNow];
      if (typeof getDayType === 'function' && getDayType(_ds) === 'fast' && _dowNow !== 0) {
        _t = { label: _t.label + ' · FASTED TODAY',
               what: 'This date is marked as a fast. Cap any session at 75-80% with 2 reps in the tank — or swap it for a 45-60 min walk. A second fast day in a row = walk only. Salt + electrolyte + plenty of water. Original slot: ' + _t.what };
      }
      return `
      <div class="section-title">CYCLE <span>— THE SEASONS PLAN</span></div>

      <div class="rule-card" style="border-left-color:var(--accent)">
        <div class="rule-num" style="color:var(--accent)">▶ TODAY — ${_t.label}</div>
        <div class="rule-text">${_t.what}</div>
      </div>

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">${_mode.label}</div>
        <div class="rule-text">${_mode.text}</div>
        <div class="rule-sub">Design law: every exercise below is zero-equipment by default. The only "weight" is a backpack with books or bottles. DBs, machines and bars are UPGRADES, never requirements. A pull-up bar (park, door frame) is the one thing worth finding — table towel-rows substitute if there isn’t one.</div>
      </div>

      <div class="section-title">THE WEEK <span>— DECISIONS MADE ONCE</span></div>

      ${workoutCard('MONDAY — PUSH','STRENGTH + CHEST/SHOULDERS + SERRATUS · ~50 MIN',
        exRow('Warmup','Arm/wrist circles + scap push-ups 2×12 + easy push-ups.','8 min')+
        exRowWithLevel('push','Push-up progression track','MAIN LIFT — hardest clean variation you own, 2 reps in reserve. Level up when 4×8 is clean.','4×5-8',true)+
        exRowWithLevel('shoulder','Pike press → wall handstand push-up track','The overhead press, no bar needed. Slow lowering.','4×5-8',true)+
        exRow('Pseudo-planche lean holds','Push-up position, hands turned out, shoulders past wrists, lean and hold. Serratus + straight-arm strength.','3×15-20s')+
        exRow('Chair dips','Hands on two sturdy chairs or a counter edge, slow lowering. UPGRADE: chest press machine 3×8-12.','3×8-12')+
        exRow('Table/towel rows','Under a sturdy table or towel round a post — slow 3-count lowering. Keeps the week pull-dominant.','3×10')+
        exRow('Side raises','Water bottles or a loaded bag, strict, no swing. UPGRADE: DBs.','3×12-15')+
        exRow('Squeeze-everything plank','Clench fists, abs, glutes and thighs hard for the whole hold.','3×20s'),
        stretchRow('Doorframe chest + dislocates + wrists + hip-flexor stretch','','8 min'),
        'MON'
      )}

      ${workoutCard('TUESDAY — RUN 1 + SPINE ARMOR','PER THE RUN RAMP · EASY = CONVERSATIONAL',
        exRow('Run','See the RUN RAMP card below for this week’s distance and format. Decent shoes, flat routes.','per ramp')+
        exRow('Slow dead bugs','Lower back glued to the floor while opposite arm and leg lower slowly.','3×10/side')+
        exRow('Glute bridge march','Hips up, march the knees without the hips dropping.','3×15')+
        exRow('Hip-flexor couch stretch','Kneeling lunge, squeeze that side’s glute, push the hips gently forward.','2×60s/side'),
        stretchRow('Calves + hamstrings post-run','','8 min'),
        'TUE'
      )}

      ${workoutCard('WEDNESDAY — PULL','THE STRENGTH CENTERPIECE + BACK + HANGING CORE · ~55 MIN',
        exRow('Pull-up strength work','MAIN LIFT — 5 sets of 3-5, 2-3 MIN rests, any bar. Not there yet: jump up + 5-second negatives. No bar at all: heavy towel rows under a solid table, 5×5, same rests.','5×3-5')+
        exRow('Table/towel rows','Slow 3-count lowering, chest to the edge. UPGRADE: pulldown machine.','4×8-12')+
        exRow('Scapular pulls','Dead-hang, pull the shoulder blades down without bending the elbows.','2×10')+
        exRow('Prone Y-T-W','Face down, raise straight arms into each letter, squeeze the blades.','3×10 each')+
        exRow('Hanging knee → leg raise track','On the bar: knees up slow, no swing → straight legs as you progress. No bar: lying leg raises with the backpack on your ankles.','4×8-12')+
        exRow('Forearm block','Towel wring 2×60s + backpack farmer holds 3×30s + bottle-bag wrist curls 3×15.','3 moves'),
        stretchRow('Full shoulder sequence + hip-flexor stretch','','10 min'),
        'WED'
      )}

      ${workoutCard('THURSDAY — RUN 2 + SKILL','RAMP + STRIDES ALTERNATE WEEKS · SKILL WHILE FRESH',
        exRow('Run','Per the ramp. Alternate weeks: finish with 4×15s relaxed-fast strides.','per ramp')+
        exRow('Wall handstand holds','Kick up, arms locked, bail sideways. Quality seconds — log your PR.','5×15-30s')+
        exRow('L-sit tuck progression','Chair edges or floor — knees tucked, hips lifted, shoulders down.','5×8-15s')+
        exRow('Crow holds','Knees on elbows, lean until the feet float. Practice, not effort.','5 attempts')+
        exRow('Prone W-raises','Face down, elbows bent to a W, squeeze the shoulder blades down and back.','3×12'),
        stretchRow('Quads + calves + child’s pose + hip-flexor stretch','','8 min'),
        'THU'
      )}

      ${workoutCard('FRIDAY — LEGS + GLUTES + LOADED CORE','THE BACKPACK DAY · ~60 MIN',
        exRowWithLevel('squat','Squat → pistol progression track','MAIN LIFT — hardest clean variation you own, 2 reps in reserve.','4×5-8/leg',true)+
        exRow('Backpack Bulgarian split squats','Rear foot on a chair, bag hugged to the chest, slow lowering.','3×10/leg')+
        exRow('Single-leg hip thrusts','Shoulders on the sofa, backpack on the hips, drive up, squeeze 2s. UPGRADE: heavier DB.','4×10-12/leg')+
        exRow('Sliding leg curls','Towel or socks under the heels, bridge, slide out slow, drag back.','3×8-12')+
        exRowWithLevel('hinge','Hinge progression track (backpack single-leg RDL by default)','Hinge flat-backed — hamstrings, balance, lower back.','3×10/leg',true)+
        exRow('Calves','Single-leg slow off a step 4×15 + bent-knee raises 3×20.','2 blocks')+
        exRow('Backpack loaded crunch','Bag hugged to the chest, crunch slow, add books as it gets easy — abs grow from load and progression like any muscle. UPGRADE: cable/pulldown crunch.','4×10-15')+
        exRow('Obliques: bag side bends + suitcase carries','Side bends 3×12/side · one-hand bag carry 3×40 steps/side, dead-straight posture.','2 moves')+
        exRow('Pelvic-tilt block','Bridge march 3×15 + dead bugs 3×10/side + hip-flexor stretch.','10 min'),
        stretchRow('Pigeon + figure-4 + hamstring + hip-flexor stretch','','12 min'),
        'FRI'
      )}

      ${workoutCard('SATURDAY — SKILL + SPEED','SPEED + DENSITY + THE BATCH-COOK · ~60 MIN',
        exRow('Skill circuit','Handstand holds · L-sit · crow · planche leans — rotate, quality holds, never to failure.','20 min')+
        exRow('Shadowbox','3×3-min rounds, fast hands, real footwork.','~12 min')+
        exRow('Jump rope','Light intervals — 3×1 min.' + (_heavy ? ' At 100kg+ keep jumping work short and skip jump squats/burpees (WORKOUTS_LIBRARY §2.3); they unlock as bodyweight drops.' : ''),'3×1 min')+
        exRow('Dragon flag negatives','Bench or bed edge, grip behind the head, body dead-straight, 5-second lowering. Regress to tuck negatives if form breaks.','4×4-5')+
        exRow('Hollow body holds + vacuum ladder','Hollow 3×30-40s · vacuums 15s→20s→30s.','2 moves')+
        exRow('BATCH-COOK','Roast a couple of chickens → portion → freeze · bones + a splash of vinegar → simmer 3-4h → the week’s broth.','~30 min passive'),
        stretchRow('Wrists + shoulders + gentle full-body flow','','10 min'),
        'SAT'
      )}

      ${workoutCard('SUNDAY — FAST + WALK','REST DAY = FAST DAY = PREP DAY',
        exRow('Walk','45-90 min easy, split freely. Zero recovery cost.','45-90 min')+
        exRow('Full hip session','90/90 · pigeon · cossack · deep squat + hip-flexor stretch.','20 min')+
        exRow('Salt + electrolyte + 3L water','One fast day needs hygiene, not heroics.','all day')+
        exRow('Weekly shop','If not done Saturday. The list lives in NUTRITION.','—'),
        stretchRow('Nothing aggressive — recovery day','','—'),
        'SUN'
      )}

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">THE RUN RAMP — JOINTS FIRST</div>
        <div class="rule-text">Weeks 1-2: both runs ~3K as run/walk — 2 min run / 1 min walk. Log your baselines (hardest push-up variation, pull-up max, pistol depth, handstand seconds).<br>Weeks 3-4: ~4K continuous easy; Thursday adds 4×15s strides.<br>Week 5+: full 5Ks — Tuesday easy, Thursday easy + strides.<br>Returning after 2+ weeks off or illness: restart at weeks 1-2 and drop one level on each progression track.</div>
        <div class="rule-sub">Easy = you can talk in full sentences. Pain that changes your stride = stop. Heavier runners progress more slowly — the ramp is a minimum, not a deadline.</div>
      </div>

      <div class="rule-card" style="border-left-color:#70c8ff">
        <div class="rule-num">WHERE EACH GOAL LIVES</div>
        <div class="rule-text">STRENGTH → Mon/Wed/Fri low-rep progression mains + isometric holds · FUNCTIONAL → carries, single-leg work, grip · SPEED → Thursday strides + the Saturday speed block · CORE → 4 loaded exposures a week (crunches, hanging raises, dragon flags, obliques) + daily vacuums · CALISTHENICS SKILL → planche leans, L-sit, handstand, crow built into the strength days.</div>
        <div class="rule-sub">Loaded core work builds thickness; visible separation depends on body fat. Recomp shows up on the tape and in photos before the scale.</div>
      </div>`;
    },

    nutritionContent(s) {
      const cal = s.calories || 1500;
      const macros = computeMacros(todayStr());
      const { proteinG, carbsG, fatG, warnings: macroWarnings } = macros;
      const warningHtml = macroWarnings.length ? macroWarnings.map(w =>
        `<div style="border-left:3px solid var(--accent2);padding:6px 10px;margin-bottom:6px;border-radius:4px;background:var(--surface);font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent2);line-height:1.6">${w}</div>`
      ).join('') : '';
      const { w, tdee } = _cycleState();
      const _floorG = w ? Math.round(w * (cycle.proteinFloorMultiplier || 1.6)) : null;

      return `
      <div class="section-title">CYCLE <span>NUTRITION</span></div>
      <p class="section-note">One shopping list, one daily template, no diet foods. Your calorie ceiling and protein floor come from Settings and your latest logged weight.</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#82e0aa">${cal}</div><div class="macro-lbl">Day ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${warningHtml}

      ${(()=>{
        const _dt = getDayType(todayStr());
        if(_dt === 'fast') return '<div class="rule-card" style="border-left-color:var(--fast)"><div class="rule-num">FAST DAY ACTIVE</div><div class="rule-text">No food. Water, black coffee, plain tea. Salt + electrolyte · 3L+ water · creatine still happens.</div><div class="rule-sub">Break it gently tomorrow morning — protein first, not a feast. A second fast day in a row = walk only.</div></div>';
        const _dc = getDayCalories(todayStr());
        const _rem = cal - _dc.total;
        const _cls = !_dc.hasData ? 'var(--muted)' : _dc.total > cal ? 'var(--danger)' : (_rem <= 100 ? 'var(--accent2)' : 'var(--accent)');
        const _remTxt = !_dc.hasData ? 'No food logged yet — tap FOOD LOG on TODAY tab' : (_rem >= 0 ? _rem + ' cal remaining' : Math.abs(_rem) + ' cal OVER ceiling');
        const _pctW = _dc.hasData ? Math.min(100, Math.round(_dc.total / cal * 100)) : 0;
        const _barColor = _dc.total > cal ? 'var(--danger)' : _dc.total > cal * 0.85 ? 'var(--accent2)' : 'var(--accent)';
        return '<div class="rule-card" style="border-left-color:'+_cls+'"><div class="rule-num">TODAY\'S INTAKE</div><div class="rule-text" style="font-size:0.85rem;color:'+_cls+'">'+(_dc.hasData ? _dc.total + ' / ' + cal + ' cal' : '0 / ' + cal + ' cal')+'</div><div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+_pctW+'%;background:'+_barColor+';border-radius:3px;transition:width 0.3s"></div></div><div class="rule-sub">'+_remTxt+'</div></div>';
      })()}

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">THE WEEKLY SHOP — ONE TRIP, BORING FOOD</div>
        <div class="rule-text">A tray of eggs · whole chickens (cheapest protein per gram when you roast and portion them yourself) · dry lentils or beans · milk, yogurt or laban · a big bag of rice or oats · frozen veg + carrots · bananas + citrus (the vitamin C supports collagen)</div>
        <div class="rule-sub">Skip the “diet foods” — protein bars, rice cakes, processed deli meat, juice. Per gram of protein they usually cost several times what whole foods do.</div>
      </div>

      <div class="rule-card" style="border-left-color:#ff9966">
        <div class="rule-num">THE DAILY PLATE — SCALES TO YOUR CEILING</div>
        <div class="rule-text">Morning: eggs + fruit or oats<br>THE MEAL: a protein portion + rice/potato + lentils + veg, any cuisine<br>Evening: yogurt/milk or eggs, or a mug of broth<br>${_floorG ? 'Protein floor: ~' + _floorG + 'g (1.6 g/kg × your latest ' + w + 'kg)' : 'Log a weight to see your protein floor'}</div>
        <div class="rule-sub">Raise or lower THE MEAL’s carb portion to land on your ceiling — the protein anchors stay the same every day.</div>
      </div>

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">PROTEIN TRIAGE — THE HONEST-DAY RULE</div>
        <div class="rule-text">Can’t-eat or won’t-eat day: the only job is hitting the protein floor from whatever is easiest. Calories land where they land; the day still counts.</div>
        <div class="rule-sub">Cap: 2 such days a week beyond the fast day. More than that stops being a plan and becomes a crash diet — the strength sessions carry muscle retention on those days.</div>
      </div>

      <div class="section-title" style="margin-top:8px">SKIN — <span>THE SLOW-LOSS DEFENSE</span></div>
      ${ruleCard('RATE CONTROL IS THE TREATMENT','Aim for roughly 0.5-1% of bodyweight a week. Faster loss leaves skin and muscle less time to adapt; skin remodels over months behind the loss.','Patience is doing most of the work here.','#82e0aa')}
      ${ruleCard('BONE BROTH + VITAMIN C','Roast-chicken bones + a splash of vinegar, simmered 3-4h, provide glycine and proline — collagen building blocks. Fruit and veg supply the vitamin C collagen synthesis needs.','Collagen peptides are the paid version — modest evidence, optional.','#82e0aa')}
      ${ruleCard('MUSCLE FILLS THE SPACE','The strength sessions, glute work and loaded core build tissue under the skin as fat leaves. The pelvic-tilt block helps posture on top.','This is why the sessions matter more than any single meal.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">SUPPLEMENTS <span>— ONLY THE USEFUL ONES</span></div>
      ${ruleCard('CREATINE MONOHYDRATE','3-5g daily, any time, no loading phase (ISSN 2018). The best-evidenced supplement for strength and lean mass. The water it adds is stored inside muscle.','The one to keep if you keep nothing else.','#82e0aa')}
      ${ruleCard('OPTIONAL','Magnesium 200-300mg at bed · omega-3 1-2g EPA+DHA with a meal · vitamin D 1,000-2,000 IU if you get little sun (stay under 4,000 IU/day).','Check with a doctor before adding supplements if you take medication.','#82e0aa')}`;
    },

    rulesContent(s) {
      const { t, tdee, fmt } = _cycleState();
      const _band = t ? fmt(t - 2) + '–' + fmt(t + 2) + 'kg' : 'target ±2kg';
      return `
      <div class="section-title">THE <span>LAWS</span></div>
      ${ruleCard('LAW 01','The Mon/Wed/Fri strength sessions are the priority.','They are what keeps muscle while fat comes off. Miss food if life happens — keep the sessions. Body + backpack + gravity is the gym.')}
      ${ruleCard('LAW 02','Respect the calorie floor.','Settings warns you below the plan floor (' + (cycle.minCalories || 1400) + ' cal). Very low intake loses muscle and rebounds — slow and steady wins over seasons.')}
      ${ruleCard('LAW 03','Protein triage cap: 2 collapsed days a week beyond the fast day.','A collapsed day = protein floor + 20-min walk + one drill. Three or more is a crash diet with extra steps.')}
      ${ruleCard('LAW 04','Walks are the lever, never the punishment.','45-90 min a day costs nothing and spares muscle. On a wrecked day, cut the walk length — not the strength session.')}
      ${ruleCard('LAW 05','STOP cluster: palpitations · chest tightness · dizziness or vision changes','Salt water + some carbs immediately, whatever day it is. Persistent symptoms → see a doctor.')}
      ${ruleCard('LAW 06','No diet-food purchases.','Bars, rice cakes, processed meats, juices. Whole foods are cheaper per gram of protein and more filling.')}
      ${ruleCard('LAW 07','Sleep 7-9 hours.','Two wrecked nights in a row → next day is walk + core only. Recovery happens in bed.')}

      <div class="section-title" style="margin-top:8px">THE <span>SCOREBOARD</span></div>
      ${ruleCard('WAIST OVER SCALE','Waist tape every Saturday morning · photos monthly · PRs (pull-up reps, handstand seconds, 5K time). Scale = weekly AVERAGE only.','On a recomp plan a flat scale with a shrinking waist is winning.','var(--accent2)')}

      <div class="section-title" style="margin-top:8px">THE <span>AUTOPILOT</span></div>
      ${ruleCard('MODES ARE COMPUTED, NOT SCHEDULED','The WORKOUTS tab reads your latest weight against your target: GLIDE above the band, BAND inside ' + _band + ', BELOW under it — with a calorie suggestion from your TDEE' + (tdee ? ' (' + tdee + ')' : '') + '.','Update your target in Settings and the whole plan re-aims itself.','#70c8ff')}
      ${ruleCard('THE BAND — ' + _band.toUpperCase(),'Two weekly averages above the band → add a second fast day until back inside. Below the band → eating days +200 cal.','No end date. The plan doesn’t finish — it holds.','#70c8ff')}
      ${ruleCard('AFTER A BREAK OR ILLNESS','Two weeks at maintenance-ish calories, no fasting in week one, ~60-70% training volume, one level down on each progression track. Then resume.','Breathlessness, chest tightness or lingering symptoms → get medical clearance before hard sessions.','#70c8ff')}
      ${ruleCard('12-WEEK REPLAN CHECKPOINT','Every 12 weeks: photos + waist + PRs on the table → adjust the plan deliberately from progress, not from a bad week.','A scheduled replan beats an impulsive restart.','#70c8ff')}
      ${ruleCard('MINIMUM VIABLE DAY','Protein floor + 20-min walk + one skill drill.','Bad days are part of the design. The plan survives seasons because it expects weather.','#70c8ff')}`;
    }
};
