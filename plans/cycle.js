// plans/cycle.js — CYCLE: the seasons recomp plan (owner-approved 2026-08-29).
// Built to run a year+ — the anti-crash successor to TEMP CUT. Bodyweight-first
// by design law: every exercise defaults to zero equipment; the only implied
// "weight" is a loaded backpack, and DBs/machines/bars appear only as UPGRADE
// notes. Three phases, one weekly skeleton:
//   PHASE 0 (Sep 2026, budget month): eating days ~1,500 · protein 100g floor
//     (owner ruling — retention mode, lifts sacred) · fast Sundays · daily
//     60-90 min walks as the 92kg lever · Oct 1-3 protein-only ~500 mini-fast
//     (NO training) · Oct 4 pre-committed rollover to Phase A at 2,050.
//   PHASE A (glide → 92kg): eating days ~2,050 · protein toward 1.6 g/kg.
//   PHASE B (band 88-92): eating days ~2,350 · autopilot — two weekly
//     averages >92 → second fast until back · <88 → +200 cal.
// Training week: Mon PUSH · Tue RUN 1 · Wed PULL · Thu RUN 2 + skill ·
// Fri LEGS + loaded core · Sat SKILL + BLACK FLASH + batch-cook · Sun FAST +
// walk. Grown-core layer: backpack loaded crunches, hanging raises, dragon
// flags, obliques, pseudo-planche serratus work — all doubling as planche/
// front-lever/L-sit scaffolding. Run ramp: 3K run/walk → 4K → full 5Ks with
// strides; sprints unlock <~97kg. Scoreboard: waist weekly, photos monthly,
// PRs; scale = weekly average only. Week-12 replan checkpoint. No gates, no
// deadlines, Minimum Viable Day counts GREEN.

export const cycle = {
    name: 'CYCLE',
    goalMode: 'cut',
    // Session-day total burn at ~101kg (standard ~2,400 + session ~500 + walks
    // ~350-450). Settings recompute per-user; falls as weight falls.
    tdee: 2900,
    fastDaysPerWeek: 1,
    badge: 'CYCLE',
    badgeClass: '',
    descClass: '',
    subtitle: 'Seasons recomp. Bodyweight-first. Fast Sundays. Waist over scale.',
    bannerColor: '#82e0aa',
    bannerBg: 'rgba(130,224,170,0.07)',
    bannerBorder: 'rgba(130,224,170,0.35)',
    fastDaysDow: [0], // Sundays — rest day, fast day, batch/shop day, free day
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    // Phase 0 at the 1,500 ceiling with the 100g floor: P ~27% · C ~45% ·
    // F ~28%. Protein floor below is the real law; split is descriptive.
    macroSplit: { base:[27,45,28], rest:[27,45,28], preFast:[27,45,28], stall:[27,45,28], satiety:[27,45,28] },
    // Phase 0 owner ruling: 100g flat ≈ 1.0 g/kg (budget month, retention
    // mode — the Mon/Wed/Fri lifts carry the muscle). Raise toward 1.6 when
    // Phase A funds allow (patch this value at the phase switch).
    proteinFloorMultiplier: 1.0,
    caloriesMode: 'floor',
    minCalories: 1400,
    activityByDayType: { eatDay: 1.65, fastDay: 1.35 },

    defaultTimes: { wakeTime:'06:30', lastMealTime:'21:00', eveningSessionTime:'17:30', eatingWindowStart:null },

    // DOW roles are FIXED for the life of the plan — decisions were made once:
    // Mon PUSH · Tue RUN 1 + spine armor · Wed PULL (strength centerpiece) ·
    // Thu RUN 2 + fresh skill · Fri LEGS + glutes + loaded core · Sat SKILL +
    // BLACK FLASH + batch-cook · Sun FAST + long walk + hips.
    weekIcons: {0:'🔥',1:'💪',2:'🏃',3:'💪',4:'🏃',5:'🦵',6:'🤸'},

    morningSub: {
      0:'SUNDAY — FAST day (0 cal, 0 AED, 0 decisions). Salt water on waking. Weekly shop today or yesterday. Weigh + log.',
      1:'MONDAY — Weigh + log (weekly average is what counts). Creatine any time. Start banking the 60-90 min of daily walking early.',
      2:'TUESDAY — Weigh + log. Run day — go morning or evening, your call. Walks still count on run days.',
      3:'WEDNESDAY — Weigh + log. Tonight is the strength centerpiece: pull-ups, long rests, low reps.',
      4:'THURSDAY — Weigh + log. Run 2 + skill practice while fresh.',
      5:'FRIDAY — Weigh + log. Legs + the loaded-core block tonight — backpack packed and ready.',
      6:'SATURDAY — Weigh + log + WAIST TAPE (the real scoreboard). Skill + speed session, then batch-cook: 2 chickens roasted, portioned, frozen — bones into the broth pot.'
    },
    eveningSub: {
      0:'SUNDAY — 60-90 min easy walk + 20-min full hip session. Salt ×2 + electrolyte + 3L water. Nothing else — this is the rest day.',
      1:'MONDAY — SESSION: PUSH. Push-up track, pike→handstand press, planche leans, dips, side raises. ~45-60 min, 2 in the tank everywhere.',
      2:'TUESDAY — RUN per the ramp (see WORKOUTS) + 10-min spine armor: dead bugs, bridge march, hip-flexor stretch.',
      3:'WEDNESDAY — SESSION: PULL. 5×3-5 pull-ups/negatives with LONG rests — this is strength tanking — then rows, Y-T-W, hanging raises, forearms.',
      4:'THURSDAY — RUN per the ramp (strides on alternate weeks) + 15-min fresh skill: wall handstand, L-sit tucks, crow.',
      5:'FRIDAY — SESSION: LEGS + GLUTES + LOADED CORE. Pistol track, backpack Bulgarians, hip thrusts, sliding curls, loaded crunches, obliques, carries.',
      6:'SATURDAY — SESSION: SKILL + BLACK FLASH. Skill circuit 20 min · shadowbox 3×3 · jump rope 3×1 · dragon flags · hollow · vacuum ladder.'
    },
    stretchSub: {
      0:'Full hip session — 90/90 · pigeon · cossack · deep squat + hip-flexor couch stretch 2×60s/side (20 min).',
      1:'Doorframe chest + shoulder dislocates + wrists + hip-flexor stretch (8 min).',
      2:'Post-run: calves · hamstrings · hip-flexor stretch (8 min).',
      3:'Full shoulder sequence + hip-flexor stretch (10 min).',
      4:'Post-run: quads · calves · child’s pose + hip-flexor stretch (8 min).',
      5:'Pigeon + figure-4 + hamstring + hip-flexor stretch (12 min).',
      6:'Wrists + shoulders + full-body gentle flow (10 min).'
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake: water + weigh + log + creatine 5g', sub:'Weekly AVERAGE is the number that counts — single days are noise. Creatine daily forever, never cycle off.' },
      { id:'m2', group:'MORNING', label:'Stomach vacuums 3×20-30s', sub:'Empty stomach, exhale fully, navel to spine. The corset — free centimeter, every day.' },
      { id:'m3', group:'MORNING', label:'Morning role done (see WORKOUTS + today’s sub-text)', sub:'Mostly: start banking the daily walk minutes early. Saturdays: waist tape too.' },
      { id:'m4', group:'MORNING', label:'Walk minutes banked: 60-90 total today', sub:'Split freely — calls, errands, stairs. This is the free lever that moves the scale ~0.5kg/month on its own. Costs nothing, spares muscle.' },
      { id:'f1', group:'EATING', label:'Protein 100g hit — the floor, zero exceptions', sub:'3-4 eggs (24g) + chicken portion (40g) + dal+rice (16g) + laban/egg night (20g). Phase A/B raises this toward 1.6g/kg.' },
      { id:'f2', group:'EATING', label:'Stayed at today’s ceiling (Phase 0: ~1,500 · A: ~2,050 · B: ~2,350)', sub:'Log THE MEAL in FOOD LOG — add your staples to the library once, they autocomplete forever.', type:'info' },
      { id:'f3', group:'EATING', label:'THE MEAL eaten — chicken + rice + dal + veg', sub:'Any cuisine works if calories are dealt with. Batch-cooked Saturday = zero decisions today.' },
      { id:'f4', group:'EATING', label:'3.5L+ water across the day', sub:'+500ml on run days. Never restricted.', type:'water', waterTarget:3.5 },
      { id:'f5', group:'EATING', label:'Zero money traps: no bars, no rice cakes, no salami, no juice', sub:'The "diet foods" cost 3-8× more per gram of protein than eggs, whole chicken, dal and rice. Boring normal food IS the budget plan.' },
      { id:'e1', group:'EVENING', label:'Mug of bone broth (own chicken bones)', sub:'Simmered from Saturday’s carcasses — glycine + proline, the collagen precursors, at zero cost. The broke man’s skin supplement, and it’s real. Orange/carrots cover the vitamin C.' },
      { id:'e2', group:'EVENING', label:'Session done (PUSH Mon · RUN Tue/Thu · PULL Wed · LEGS Fri · SKILL Sat)', sub:'Mon/Wed/Fri lifts are SACRED at the 100g floor — training is what holds the muscle now. Miss food if life happens; never miss the lifts.' },
      { id:'e3', group:'EVENING', label:'Cooldown stretch done + hip-flexor stretch', sub:'The hip-flexor couch stretch is daily — it untilts the pelvis that pushes the gut out.' },
      { id:'x1', group:'TRIAGE', label:'If today collapsed: 100g protein + 20-min walk + one drill = still GREEN', sub:'Bad days are in the design, not violations of it. Hard cap: 2 collapsed days/week beyond Sunday — past that you’re crash-dieting again.' },
      { id:'s1', group:'SUPPLEMENTS', label:'Supplements taken (budget month = creatine only)', sub:'Tap to expand',
        subItems: [
          { id:'s1_a', name:'Creatine', dose:'5g', when:'Any time — the one that’s protected, ~25 AED/month' },
          { id:'s1_b', name:'Magnesium (if owned)', dose:'200-300mg', when:'Before bed' },
          { id:'s1_c', name:'Omega-3 (optional, resume Phase A)', dose:'×2', when:'With THE MEAL' }
        ]
      },
      { id:'n2', group:'NIGHT', label:'Sleep: bed by midnight · 7h target', sub:'Recomp happens in bed. Two wrecked nights in a row → next day auto-downgrades to walk + core.' }
    ],
    // Fast Sundays: rest day = fast day = shop/batch day = free day.
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water + ⅓ tsp salt on waking, again mid-afternoon', sub:'Pickle juice counts. One fast day — no heroics needed, just hygiene.' },
      { id:'wf2', group:'FAST', label:'Electrolyte tab mid-day', sub:'Or a K-tab if that’s what’s in the cupboard.' },
      { id:'wf3', group:'FAST', label:'No food. Water, black coffee, green tea only', sub:'Breaks Monday morning with the normal eggs — gentle, not a feast.' },
      { id:'wf4', group:'FAST', label:'Walk 60-90 min + full hip session', sub:'No lifting on fast days — the walk IS the session. ~300-400 clean cal.' },
      { id:'wf5', group:'FAST', label:'3L+ water total today', sub:'Sip constantly.', type:'water', waterTarget:3.0 },
      { id:'wf6', group:'FAST', label:'Weekly shop done (today or Saturday)', sub:'The list lives in NUTRITION — ~110-130 AED covers the whole week.' },
      { id:'wf7', group:'FAST', label:'Vacuums + creatine still happen', sub:'Creatine needs no food. The corset never rests.' },
      { id:'wf8', group:'FAST', label:'STOP check: no palpitations / chest tightness / vision narrowing', sub:'Any of these → salt water + 50g carbs immediately, fast over, zero shame.' }
    ],

    foodGroupLabel: 'CYCLE EATING',
    foodGroupBg: 'rgba(130,224,170,0.1)',
    foodGroupColor: '#82e0aa',

    workoutContent() {
      const _ds = todayStr();
      // Phase banner — date-aware for the September launch arc, then evergreen.
      let _phase;
      if (_ds < '2026-10-01')      _phase = { label:'PHASE 0 — SEPTEMBER BUDGET MONTH', text:'Eating days ~1,500 · 100g protein floor · fast Sundays · walks 60-90 min daily (the 92-lever). Lifts are SACRED. Ends with the Oct 1-3 protein-only mini-fast, then Phase A auto-starts Oct 4 at ~2,050 — pre-committed, because day 4 is where crashes die.' };
      else if (_ds <= '2026-10-03') _phase = { label:'OCT 1-3 — THE MINI-FAST', text:'~500 cal/day, ALL protein (powder/laban/chicken, nothing else). NO training — walks 60-90 + vacuums only. Salt ×2-3, electrolyte, 3L+. Sun Oct 4 morning: scale + waist tape = THE READ, then eat 2,050. No Sunday fast this week.' };
      else                          _phase = { label:'PHASE A/B — THE LONG GAME', text:'Phase A: eating days ~2,050, glide to 92. At 92 → Phase B: ~2,350, band autopilot 88-92 (two weekly averages >92 → second fast until back · <88 → +200 cal). Protein rises toward 1.6g/kg as budget allows. Week-12 replan checkpoint: renegotiate from progress, never abandon from impulse.' };
      const _todayByDow = {
        0: { label:'SUNDAY — FAST + WALK', what:'0 cal, 0 AED, 0 decisions. Walk 60-90 min + full hip session. Shop/batch if not done Saturday. Card is open below.' },
        1: { label:'MONDAY — PUSH', what:'Push-up track, pike→handstand press, planche leans, dips, side raises. ~45-60 min, 2 in the tank everywhere. Card is open below.' },
        2: { label:'TUESDAY — RUN 1', what:'Run per the ramp (see the RUN RAMP card) + 10-min spine armor. Easy = conversational, always.' },
        3: { label:'WEDNESDAY — PULL (THE STRENGTH CENTERPIECE)', what:'5×3-5 pull-ups or negatives with 2-3 min rests — low reps, long rests, THIS is strength tanking. Then rows, Y-T-W, hanging raises, forearms.' },
        4: { label:'THURSDAY — RUN 2 + SKILL', what:'Run per the ramp (strides on alternate weeks) + 15 min of fresh handstand/L-sit/crow practice.' },
        5: { label:'FRIDAY — LEGS + GLUTES + LOADED CORE', what:'Pistol track, backpack Bulgarians, single-leg hip thrusts, sliding curls, LOADED crunches, obliques, carries. Pack the backpack.' },
        6: { label:'SATURDAY — SKILL + BLACK FLASH + BATCH-COOK', what:'Skill circuit → shadowbox 3×3 → rope 3×1 → dragon flags + hollow + vacuums. Then roast 2 chickens, portion, freeze, bones → broth pot. Waist tape this morning.' }
      };
      const _t = _todayByDow[new Date().getDay()];
      return `
      <div class="section-title">CYCLE <span>— THE SEASONS PLAN</span></div>

      <div class="rule-card" style="border-left-color:var(--accent)">
        <div class="rule-num" style="color:var(--accent)">▶ TODAY — ${_t.label}</div>
        <div class="rule-text">${_t.what}</div>
      </div>

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">${_phase.label}</div>
        <div class="rule-text">${_phase.text}</div>
        <div class="rule-sub">Design law: every exercise below is zero-equipment by default. The only "weight" is a backpack with books/bottles. DBs, machines and bars are UPGRADES, never requirements. A pull-up point (park bar, door bar) is the one thing worth finding — table towel-rows substitute if there isn’t one.</div>
      </div>

      <div class="section-title">THE WEEK <span>— DECISIONS MADE ONCE</span></div>

      ${workoutCard('MONDAY — PUSH','TANK STRENGTH + CHEST/SHOULDERS + SERRATUS · ~50 MIN',
        exRow('Warmup','Arm/wrist circles + scap push-ups 2×12 + easy push-ups.','8 min')+
        exRowWithLevel('push','Push-up progression track','MAIN LIFT — hardest clean variation you own, 2 reps in reserve. This is strength work, not a rep contest. Level up when 4×8 is clean.','4×5-8')+
        exRowWithLevel('shoulder','Pike press → wall handstand push-up track','The overhead press, no bar needed. Slow lowering.','4×5-8')+
        exRow('Pseudo-planche lean holds','Push-up position, hands turned out, shoulders PAST wrists, lean and hold. THE serratus builder and literal planche prep — one move, both goals.','3×15-20s')+
        exRow('Chair dips','Hands on two chairs or a counter edge, slow lowering. UPGRADE: chest press machine 3×8-12.','3×8-12')+
        exRow('Decline push-ups','Feet on a chair — upper chest, the shelf that fixes the chest softness silhouette.','3×10-12')+
        exRow('Side raises','Water bottles or loaded bags, strict, no swing. UPGRADE: DBs.','3×12-15')+
        exRow('Squeeze-everything plank','Clench fists, abs, glutes, thighs as HARD as possible the whole hold.','3×20s'),
        stretchRow('Doorframe chest + dislocates + wrists + hip-flexor stretch','','8 min'),
        'MON'
      )}

      ${workoutCard('TUESDAY — RUN 1 + SPINE ARMOR','PER THE RUN RAMP · EASY = CONVERSATIONAL',
        exRow('Run','See the RUN RAMP card below for this week’s distance and format. Never deep-fasted, decent shoes, flat routes.','per ramp')+
        exRow('Slow dead bugs','Lower back GLUED to the floor while opposite arm+leg lower slowly. Pelvis school.','3×10/side')+
        exRow('Glute bridge march','Hips up, march knees without dropping — the gut-tilt fix on drip.','3×15')+
        exRow('Hip-flexor couch stretch','Kneeling lunge, squeeze that side’s glute, push hips gently forward. Daily law.','2×60s/side'),
        stretchRow('Calves + hamstrings post-run','','8 min'),
        'TUE'
      )}

      ${workoutCard('WEDNESDAY — PULL','THE STRENGTH CENTERPIECE + GROWN BACK + HANGING CORE · ~55 MIN',
        exRowWithLevel('pull','Pull-up strength track','MAIN LIFT — 5 sets of 3-5, 2-3 MIN rests, any bar (park/door/tree). Not there yet: jump up + 5-second negatives. NO BAR AT ALL: heavy towel rows under a solid table, feet elevated, 5×5 same rests.','5×3-5')+
        exRow('Table/towel rows','Slow 3-count lowering, chest to edge. Back thickness. UPGRADE: pulldown machine wide + underhand.','4×8-12')+
        exRow('Scapular pulls','Dead-hang, shrug the shoulder blades down without bending elbows. Tiny move, huge shoulders insurance.','2×10')+
        exRow('Prone Y-T-W','Face down, raise straight arms into each letter, squeeze the blades. The rear-shoulder frame.','3×10 each')+
        exRow('⭐ Hanging knee → leg raise track','On the bar: knees up slow, no swing → straight legs as you progress. Loaded lower abs + front-lever scaffolding. NO BAR: lying leg raises with the backpack on your ankles.','4×8-12')+
        exRow('Forearm block','Towel wring 2×60s + backpack farmer holds 3×30s + bottle-bag wrist curls 3×15.','3 moves'),
        stretchRow('Full shoulder sequence + hip-flexor stretch','','10 min'),
        'WED'
      )}

      ${workoutCard('THURSDAY — RUN 2 + SKILL','RAMP + STRIDES ALTERNATE WEEKS · SKILL WHILE FRESH',
        exRow('Run','Per the ramp. Alternate weeks: finish with 4×15s strides — relaxed-fast, the speed seed. Sprint buildups unlock from week 5 AND under ~97kg.','per ramp')+
        exRow('Wall handstand holds','Kick up, arms locked, bail SIDEWAYS. Quality seconds, log the PR.','5×15-30s')+
        exRow('L-sit tuck progression','Chair edges or floor — knees tucked, hips lifted, shoulders down. Build the hold.','5×8-15s')+
        exRow('Crow holds','Knees on elbows, lean till feet float. Balance is a skill — practice, not effort.','5 attempts'),
        stretchRow('Quads + calves + child’s pose + hip-flexor stretch','','8 min'),
        'THU'
      )}

      ${workoutCard('FRIDAY — LEGS + GLUTES + LOADED CORE','THE BACKPACK DAY · ~60 MIN',
        exRowWithLevel('squat','Pistol squat track','MAIN LIFT — box/assisted → full single-leg. Zero equipment strength squatting.','4×5-8/leg')+
        exRow('Backpack Bulgarian split squats','Rear foot on a chair, bag hugged to chest, slow lowering.','3×10/leg')+
        exRow('⭐ Single-leg hip thrusts','Shoulders on the sofa, backpack on the hips, drive to the ceiling, squeeze 2s. THE glute reshaper — masculine, not saggy, is built right here. UPGRADE: heavier DB.','4×10-12/leg')+
        exRow('Sliding leg curls','Towel/socks under heels, bridge, slide out slow, drag back. The no-equipment hamstring builder.','3×8-12')+
        exRowWithLevel('hinge','Backpack single-leg RDL','Hinge flat-backed, bag in hand — hamstrings + balance + lower back.','3×10/leg')+
        exRow('Calves','Single-leg slow off a step 4×15 + bent-knee raises 3×20 — both heads, diamond shape.','2 blocks')+
        exRow('⭐ Backpack loaded crunch','Bag hugged to chest, crunch slow, ADD BOOKS as it gets easy — abs grow from LOAD + progression like any muscle. This is the baked-potato builder. UPGRADE: pulldown-machine crunch.','4×10-15')+
        exRow('Obliques: bag side bends + suitcase carries','Side bends 3×12/side · one-hand bag carry 3×40 steps/side, dead straight posture. The carved waist frame.','2 moves')+
        exRow('APT block','Bridge march 3×15 + dead bugs 3×10/side + hip-flexor stretch — untilts the pelvis, pulls the gut in.','10 min'),
        stretchRow('Pigeon + figure-4 + hamstring + hip-flexor stretch','','12 min'),
        'FRI'
      )}

      ${workoutCard('SATURDAY — SKILL + BLACK FLASH','SPEED + DENSITY + THE BATCH-COOK · ~60 MIN',
        exRow('Skill circuit','Handstand holds · L-sit · crow · planche leans — rotate, quality holds, never to failure. This is where "get good at calisthenics" compounds.','20 min')+
        exRow('Shadowbox','3×3-min rounds, fast hands, real footwork. Black flash lives here.','~12 min')+
        exRow('Jump rope','Light intervals — 3×1 min. Full plyo (jump squats, sprints) unlocks under ~97kg; until then the rope stays short and the speed lives in the hands.','3×1 min')+
        exRow('⭐ Dragon flag negatives','Bench/bed edge, grip behind head, body dead-straight, 5-second lowering. The hardest home ab move — the brick-maker.','4×4-5')+
        exRow('Hollow body holds + vacuum ladder','Hollow 3×30-40s · vacuums 15s→20s→30s. Density = the poke-a-brick wall.','2 moves')+
        exRow('BATCH-COOK','Roast 2 chickens → portion → freeze · bones + splash of vinegar → simmer 3-4h → the week’s broth. Waist tape was this morning.','~30 min passive'),
        stretchRow('Wrists + shoulders + gentle full-body flow','','10 min'),
        'SAT'
      )}

      ${workoutCard('SUNDAY — FAST + WALK','REST DAY = FAST DAY = FREE DAY',
        exRow('Walk','60-90 min easy, split freely. ~300-400 clean cal, zero recovery cost, zero dirhams.','60-90 min')+
        exRow('Full hip session','90/90 · pigeon · cossack · deep squat + hip-flexor stretch.','20 min')+
        exRow('Salt ×2 + electrolyte + 3L water','One fast day needs hygiene, not heroics.','all day')+
        exRow('Weekly shop','If not done Saturday. The 110-130 AED list lives in NUTRITION.','—'),
        stretchRow('Nothing aggressive — recovery day','','—'),
        'SUN'
      )}

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">THE RUN RAMP — SEPTEMBER (AT ~100KG, JOINTS FIRST)</div>
        <div class="rule-text">Week 1 (Aug 31-Sep 6): both runs 3K as run/walk — 2 min run / 1 min walk. CALIBRATION week: log baselines (hardest push-up variation, pull-up max, pistol depth, handstand seconds).<br>Week 2 (Sep 7-13): Tue 3K mostly running · Thu first 4K easy. Full lifting volume, +1 rep on mains.<br>Week 3 (Sep 14-20): both 4K continuous · Thu adds 4×15s strides. Level-up attempt on ONE track.<br>Week 4 (Sep 21-27): first full 5Ks — Tue easy, Thu easy + strides. Heaviest backpack loads of the month; pull-up PR attempt Wednesday.<br>Final: Mon 28 PUSH · Tue 29 easy 5K · Wed 30 PULL (last hard session) · Oct 1-3 mini-fast, walks only · Sun Oct 4 = THE READ, then Phase A.</div>
        <div class="rule-sub">Expected Monday-morning bands from ~101: Sep 7 ≈ 99.2-99.8 · Sep 14 ≈ 97.8-98.6 · Sep 21 ≈ 96.4-97.4 · Sep 28 ≈ 95.0-96.2 · Oct 4 READ ≈ 92.5-93.5, or 92.0-92.8 with the walks honored. Bands, not gates — the waist tape is the real scoreboard.</div>
      </div>

      <div class="rule-card" style="border-left-color:#70c8ff">
        <div class="rule-num">WHERE EACH DEMAND LIVES</div>
        <div class="rule-text">TANK STRENGTH → Mon/Wed/Fri low-rep progression mains + isometric holds · FUNCTIONAL → carries, single-leg everything, grip, crawl-position skill work · BLACK FLASH → Thu strides + Sat speed block + every kg lost is free speed · GROWN CORE → 4 loaded exposures/week (backpack crunches, hanging raises, dragon flags, obliques) + daily vacuums · SUPER-CALISTHENICS → planche leans, L-sit, handstand, crow, front-lever scaffolding built INTO the strength days.</div>
        <div class="rule-sub">Honesty on the look: this loading buys core THICKNESS — dense, hard, 3D. Full baked-potato separation lives at ~14-16% body fat; at your chosen 19-22% you get the upper rows, carved obliques and serratus on reaches — the obviously-strong look over the shredded look, exactly the trade you picked. Want the pop some season? Phase B just glides 3-4kg lower for 8 weeks; the thickness will be waiting.</div>
      </div>`;
    },

    nutritionContent(s) {
      const cal = s.calories || 1500;
      const macros = computeMacros(todayStr());
      const { proteinG, carbsG, fatG, warnings: macroWarnings } = macros;
      const warningHtml = macroWarnings.length ? macroWarnings.map(w =>
        `<div style="border-left:3px solid var(--accent2);padding:6px 10px;margin-bottom:6px;border-radius:4px;background:var(--surface);font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent2);line-height:1.6">${w}</div>`
      ).join('') : '';

      return `
      <div class="section-title">CYCLE <span>NUTRITION</span></div>
      <p class="section-note">One shopping list, one daily template, zero diet foods. Set the Settings ceiling to your phase: 1,500 (Phase 0) · 2,050 (A) · 2,350 (B).</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#82e0aa">${cal}</div><div class="macro-lbl">Day ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${warningHtml}

      ${(()=>{
        const _dt = getDayType(todayStr());
        if(_dt === 'fast') return '<div class="rule-card" style="border-left-color:var(--fast)"><div class="rule-num">FAST SUNDAY ACTIVE</div><div class="rule-text">No food. Water, black coffee, green tea. Salt ×2 · electrolyte · 3L water · creatine still happens.</div><div class="rule-sub">Breaks Monday morning with the normal eggs — gentle, not a feast.</div></div>';
        const _dc = getDayCalories(todayStr());
        const _rem = cal - _dc.total;
        const _cls = !_dc.hasData ? 'var(--muted)' : _dc.total > cal ? 'var(--danger)' : (_rem <= 100 ? 'var(--accent2)' : 'var(--accent)');
        const _remTxt = !_dc.hasData ? 'No food logged yet — tap FOOD LOG on TODAY tab' : (_rem >= 0 ? _rem + ' cal remaining' : Math.abs(_rem) + ' cal OVER ceiling');
        const _pctW = _dc.hasData ? Math.min(100, Math.round(_dc.total / cal * 100)) : 0;
        const _barColor = _dc.total > cal ? 'var(--danger)' : _dc.total > cal * 0.85 ? 'var(--accent2)' : 'var(--accent)';
        return '<div class="rule-card" style="border-left-color:'+_cls+'"><div class="rule-num">TODAY\'S INTAKE</div><div class="rule-text" style="font-size:0.85rem;color:'+_cls+'">'+(_dc.hasData ? _dc.total + ' / ' + cal + ' cal' : '0 / ' + cal + ' cal')+'</div><div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+_pctW+'%;background:'+_barColor+';border-radius:3px;transition:width 0.3s"></div></div><div class="rule-sub">'+_remTxt+'</div></div>';
      })()}

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">THE WEEKLY SHOP — ~110-130 AED, ONE TRIP (LULU / AL MADINAH)</div>
        <div class="rule-text">30-egg tray (16-20) · 2 whole frozen chickens ~10-13/kg (45-55) · dry dal/lentils from a 2kg bag (5) · 2L milk or laban (12-15) · rice from a 5kg bag (8) · frozen veg + carrots (12-15) · bananas + oranges (10 — the vitamin C is doing skin work, see below)</div>
        <div class="rule-sub">FIRED FOREVER: protein bars, rice cakes, chicken salami, juices, gas-station anything — the "diet foods" cost 3-8× more per gram of protein than boring normal food. Rice beats rice cakes ~8× per calorie.</div>
      </div>

      <div class="rule-card" style="border-left-color:#ff9966">
        <div class="rule-num">THE DAILY PLATE — PHASE 0 (~1,500 · ~100g PROTEIN)</div>
        <div class="rule-text">Morning (2 min): 3 eggs + banana — ~300 cal, 20g P<br>THE MEAL: chicken portion (~150g cooked) + rice + dal + veg, any cuisine — ~850-900 cal, 60g P<br>Night (1 min): glass of laban + 1 egg or dal leftover — ~250 cal, 20g P<br>Anytime: a mug of bone broth</div>
        <div class="rule-sub">Phase A grows THE MEAL ~350 cal and re-adds a morning oats portion; Phase B adds ~300 more. Same skeleton forever — only portions change.</div>
      </div>

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">PROTEIN TRIAGE — THE HONEST-DAY RULE</div>
        <div class="rule-text">Can’t-eat or won’t-eat day: the ONLY job is 100g protein from whatever’s easiest (eggs, laban, chicken). Calories land where they land; the day counts GREEN as an unplanned semi-fast.</div>
        <div class="rule-sub">HARD CAP: 2 such days per week beyond Sunday. Past that it isn’t a plan anymore, it’s the crash pattern that built the sag. At the 100g floor the Mon/Wed/Fri lifts carry ALL the muscle retention — miss food if life happens, never miss the lifts.</div>
      </div>

      <div class="section-title" style="margin-top:8px">SKIN — <span>THE ZERO-DIRHAM SAG DEFENSE</span></div>
      ${ruleCard('RATE CONTROL IS THE TREATMENT','The 1,500 floor exists FOR your skin — sag punishes speed. ~1.2-1.4kg/week is the ceiling this month; Phase A slows to ~1/week; skin remodels over 6-24 months behind the loss.','Youth + time are doing the heavy lifting. Your job is not to outrun them.','#82e0aa')}
      ${ruleCard('BONE BROTH + VITAMIN C — THE BROKE MAN’S COLLAGEN','Saturday’s chicken carcasses + splash of vinegar, simmered 3-4h = glycine + proline, the literal collagen building blocks, at zero cost. The oranges/carrots in the cart supply the vitamin C collagen synthesis requires.','Collagen powder is the paid version of this mug. Resume it in a funded month if you like; the broth does the job now.','#82e0aa')}
      ${ruleCard('MUSCLE FILLS THE SPACE','The lifts + the glute block + the loaded core are the #1 skin-tightener — tissue growing under the skin as fat leaves. Vacuums + the APT block reclaim the posture centimeter on top.','This is why the sessions are sacred at the 100g floor.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">SUPPLEMENT <span>CLOCK</span></div>
      ${ruleCard('BUDGET MONTH: CREATINE ONLY','5g daily, any time, never cycle off — ~25 AED/month, the best value in your whole life. No loading phase (ISSN 2018). Water goes INSIDE the muscle: fuller, not softer.','Everything else pauses without guilt — eggs carry some omega-3, food covers 4 weeks fine.','#82e0aa')}
      ${ruleCard('FUNDED MONTHS (PHASE A/B)','Re-add in order: magnesium 200-300mg at bed → omega-3 ×2 with THE MEAL → collagen 5-10g + C if you want the paid skin assist → D3 1-2,000 IU (your call, decide once).','Zinc M/W/F if you’re continuing your existing stack.','#82e0aa')}`;
    },

    rulesContent(s) {
      return `
      <div class="section-title">THE <span>LAWS</span></div>
      ${ruleCard('LAW 01','The Mon/Wed/Fri lifts are sacred.','At the 100g protein floor, training carries ALL the muscle retention. Miss food if life happens — never miss the lifts. Body + backpack + gravity is the gym.')}
      ${ruleCard('LAW 02','Never below ~1,500 on a normal day. The floor IS the skin treatment.','Sag punishes speed. The crash pattern (500-1,000/day) is what built the current sag — it does not get a third run.')}
      ${ruleCard('LAW 03','Protein triage cap: 2 collapsed days/week beyond Sunday.','A collapsed day = 100g protein + 20-min walk + one drill = GREEN. Three or more = you’re crash-dieting with extra steps.')}
      ${ruleCard('LAW 04','Walks are the lever, never the punishment.','60-90 min daily moves the month ~0.5kg on its own and costs nothing. First thing CUT on a wrecked day, never the lifts.')}
      ${ruleCard('LAW 05','STOP cluster: palpitations · chest tightness · vision narrowing','Salt water + 50g carbs immediately, whatever day it is. Zero shame, total obedience.')}
      ${ruleCard('LAW 06','No diet-food purchases. Ever.','Bars, rice cakes, salami, juices — fired. If it markets itself as a diet food, it is overpriced protein or overpriced air.')}
      ${ruleCard('LAW 07','Sleep by midnight, 7h target.','Two wrecked nights in a row → next day auto-downgrades to walk + core. Recomp happens in bed.')}

      <div class="section-title" style="margin-top:8px">THE <span>SCOREBOARD</span></div>
      ${ruleCard('WAIST OVER SCALE','Waist tape every Saturday morning · photos monthly · PRs (pull-up reps, handstand seconds, 5K time) — these are the truth. Scale = weekly AVERAGE only.','On a recomp plan a flat scale with a shrinking waist IS winning. If you worship daily scale numbers you will quit a plan that is working. Named on day one.','var(--accent2)')}
      ${ruleCard('SEPTEMBER WAYPOINTS (BANDS, NOT GATES)','Mon Sep 7 ≈ 99.2-99.8 · Sep 14 ≈ 97.8-98.6 · Sep 21 ≈ 96.4-97.4 · Sep 28 ≈ 95.0-96.2 · Sun Oct 4 THE READ ≈ 92.5-93.5 (92.0-92.8 with the walks honored).','Miss a band? Nothing fires. Check the walks and the triage count, adjust, keep moving. No levers, no punishment days.','var(--accent2)')}

      <div class="section-title" style="margin-top:8px">THE <span>AUTOPILOT</span></div>
      ${ruleCard('OCT 4 IS PRE-COMMITTED','Sun Oct 4 morning: scale + waist tape = THE READ → then eat ~2,050. NO fast that Sunday. The +1-2kg bounce that week is glycogen refilling, not fat — the waist tape holds the truth.','Every crash you ever ran died on day 4. This time day 4 was written down a month in advance.','#70c8ff')}
      ${ruleCard('PHASE B BAND — 88-92KG','Two weekly averages above 92 → second fast day returns until back inside. Below 88 → eating days +200. That’s the whole management system, forever.','No end date. No weigh-in day. The plan doesn’t finish — it holds.','#70c8ff')}
      ${ruleCard('WEEK-12 REPLAN CHECKPOINT','Photos + waist + PRs on the table → renegotiate the plan deliberately from a position of progress.','Your future stubborn ass gets a scheduled seat at the design table — so it never has to burn the plan down to get one.','#70c8ff')}
      ${ruleCard('MINIMUM VIABLE DAY','100g protein + 20-min walk + one skill drill = GREEN.','Bad days are part of the design. The plan survives seasons because it expects weather.','#70c8ff')}`;
    }
};
