// plans/tempcut.js — TEMP CUT v3: "THE DUBAI 13" (Aug 2 → Aug 14, weigh-in Sat Aug 15).
// Owner-designed 13-day pre-flight cut, v3 spec finalised in-session 2026-08-02.
// 101-102kg → target 90.0 by the Aug 15 morning weigh-in (flight to India same day —
// no overtime exists this round, so the two gates fire earlier and harder).
// Structure: 6 water fasts (two Sun+Mon back-to-back doubles + two Thu singles),
// 7 eating days at ~900 cal in a 9AM–3PM window (protein powder + 2 clean bars +
// rice cakes + carrots/pickles — 100g protein floor), ONE ~100-min session/day on
// a plain-English A/B/C/D rotation (chest+biceps+weighted abs / back+whale lower
// back+forearms / legs+side-abs+gut-tilt fix / shoulders+arms+steel core), a
// 10-min conditioning burst every day, the sneaky-exercise drip table, and a
// low-residue flush finish. D3+K2 is OUT of the stack (owner call, 2026-08-03).
// Creatine paused until Aug 15 (starts in India). Temporary by design.
//
// Real-2026 calendar note: Aug 2 = SUNDAY. The fast dates (2,3,6,9,10,13) map to
// DOW as Sun+Mon doubles and Thu singles — hence fastDaysDow [0,1,4].

export const tempcut = {
    name: 'TEMP CUT',
    goalMode: 'cut',
    // Eating-day total burn (~2,400 standard TDEE + ~1,000-1,200 deliberate:
    // one ~100-min session + burst + post-meal walk). Settings recompute per-user.
    tdee: 3400,
    fastDaysPerWeek: 3,
    badge: 'TEMP CUT',
    badgeClass: 'agro',
    descClass: 'agro-desc',
    subtitle: '13 days. 6 fasts. 900-cal window days. One session daily. 90.0 by the flight.',
    bannerColor: '#ff5566',
    bannerBg: 'rgba(255,85,102,0.07)',
    bannerBorder: 'rgba(255,85,102,0.35)',
    // Sun + Mon (the two back-to-back doubles) + Thu (the two singles).
    fastDaysDow: [0, 1, 4],
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    // [protein%, carbs%, fat%] at the 900 ceiling: 45% P ≈ 100g (the floor and
    // the law) · 30% C ≈ 68g (rice cakes + carrots + bar carbs) · 25% F ≈ 25g
    // (bars + MCT). Protein floor below is the real constraint.
    macroSplit: { base:[45,30,25], rest:[45,30,25], preFast:[45,30,25], stall:[45,30,25], satiety:[45,30,25] },
    // 1.0 g/kg — owner's hard ceiling is 100g flat; floor = ceiling here.
    proteinFloorMultiplier: 1.0,
    caloriesMode: 'floor',
    minCalories: 700,
    activityByDayType: { eatDay: 1.70, fastDay: 1.45 },

    defaultTimes: { wakeTime:'06:30', lastMealTime:'15:00', eveningSessionTime:'17:00', eatingWindowStart:'09:00' },

    // DOW view of the 13-day arc — each weekday carries the same ROLE both weeks:
    // Sun = fast day 1 of the double (B-lite) · Mon = DEEP 48h fast, WALK ONLY ·
    // Tue/Wed = eating + full session · Thu = single fast + moderate session
    // (both gates and the low-residue start live here/Mon) · Fri = eat session D
    // week 1, FLUSH week 2 · Sat = eat session A week 1, WEIGH-IN week 2.
    weekIcons: {0:'🔥',1:'🚶',2:'💪',3:'💪',4:'🔥',5:'💪',6:'💪'},

    morningSub: {
      0:'SUNDAY — FAST day 1 of the double (Aug 2 · Aug 9). 500ml water + ⅓ tsp salt on waking, repeat ×3 across the day. Vacuums + weigh.',
      1:'MONDAY — DEEP FAST ~48h (Aug 3 · Aug 10). WALK ONLY today — law. Salt ×4 + both K-tabs. Aug 10 = GATE 2: morning scale must read ≤95.0. Vacuums + weigh.',
      2:'TUESDAY — Eating day (Aug 4 · Aug 11). Window opens 9AM: first food + Osteocare ×2 + zinc if due. Vacuums + weigh.',
      3:'WEDNESDAY — Eating day (Aug 5 · Aug 12). Same 9AM open. Vacuums + weigh + sneaky drips all day.',
      4:'THURSDAY — FAST (Aug 6: GATE 1 — morning scale ≤98.2 · Aug 13: low-residue rules begin tonight). Vacuums + weigh.',
      5:'FRIDAY — Aug 7: eating day · Aug 14: FLUSH day ~750 cal, powder + rice cakes ONLY, bed by 10. Vacuums + weigh.',
      6:'SATURDAY — Aug 8: eating day · Aug 15: WEIGH-IN (wake → bathroom → scale → write it down) → flight → creatine begins.'
    },
    eveningSub: {
      0:'SUNDAY — SESSION B-LITE @75% fasted: pulldowns + rows + whale block, one set less on everything, nothing near failure. Burst still happens.',
      1:'MONDAY — Nothing beyond the walk: 40-60 min easy + hip stretches + vacuums. Aug 10: gate verdict tonight — if missed, pick ONE lever (see RULES).',
      2:'TUESDAY — Aug 4: SESSION A (chest + biceps + weighted abs) · Aug 11: SESSION C (legs + side-abs + gut-tilt fix). ~100 min incl. burst.',
      3:'WEDNESDAY — Aug 5: SESSION B (back + whale lower back + forearms) · Aug 12: SESSION D (shoulders + arms + steel core, neck ×2).',
      4:'THURSDAY — Fasted, capped @80%: Aug 6 SESSION C-moderate · Aug 13 SESSION A-moderate, then bars are OUT (low-residue).',
      5:'FRIDAY — Aug 7: SESSION D (shoulders + arms + steel core, neck ×2) · Aug 14: FLUSH — smooth circuit ×3, NO new soreness allowed.',
      6:'SATURDAY — Aug 8: SESSION A · Aug 15: rest. The scale has spoken, the block is over, the flight is boarding.'
    },
    stretchSub: {
      0:'Hips gentle: 90/90 · pigeon · cossack + hip-flexor couch stretch 2×60s/side (10 min).',
      1:'DEEP-FAST day: full hip session — 90/90 · frog · pigeon · cossack · deep squat + hip-flexor stretch + neck isometrics (20 min).',
      2:'Doorframe chest · shoulder dislocates · wrist extension + hip-flexor stretch 2×60s/side (10 min).',
      3:'Full shoulder sequence + hip-flexor stretch + neck isometrics (12 min).',
      4:'Full-body gentle flow after the fasted session + hip-flexor stretch (10 min).',
      5:'Lower-body flush — pigeon · hamstring · quad · calf + hip-flexor stretch (10 min).',
      6:'Chest + shoulder sequence + wrist prep + hip-flexor stretch (10 min).'
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake: 500ml water + ⅓ tsp salt', sub:'Salt water first, every day. Creatine stays PAUSED until Aug 15 — its water weight fights the 90.0 target.' },
      { id:'m2', group:'MORNING', label:'Stomach vacuums 3×20s → build to 3×30s', sub:'Exhale fully, suck navel to spine, hold, breathe shallow. The corset muscle. Daily, empty stomach.' },
      { id:'m3', group:'MORNING', label:'Morning role done (see WORKOUTS + today’s sub-text)', sub:'Eating days: weigh + vacuums + start the sneaky drips — the one big session is in the evening.' },
      { id:'m4', group:'MORNING', label:'Log morning weight in TRACK tab', sub:'After waking + bathroom, before water. Judge the two gates (Aug 6 ≤98.2 · Aug 10 ≤95.0), not single days.' },
      { id:'f1', group:'EATING', label:'Protein 100g hit — the daily floor, zero exceptions', sub:'2 scoops powder in water (50g) + 2 clean bars (40g) + the extras. Bars: whey isolate first ingredient, <5g sugar alcohols — maltitol = bloat.' },
      { id:'f2', group:'EATING', label:'Stayed at ~900 today (FLUSH Fri Aug 14: ~750)', sub:'Log everything in FOOD LOG — add "protein powder" and "protein bar" to the library once, then they autocomplete.', type:'info' },
      { id:'f3', group:'EATING', label:'Eating window 9AM–3PM · last bite 3PM SHARP', sub:'The 3PM cutoff empties the gut every evening and protects your 6h sleep. Non-negotiable.' },
      { id:'f4', group:'EATING', label:'4L+ water across the day', sub:'Never restricted — high water DECREASES retention. Sodium steady 2-3g; pickles are the salt supply.', type:'water', waterTarget:4.0 },
      { id:'f5', group:'EATING', label:'Zero liquid calories · carrots + pickles + rice cakes are the only extras', sub:'Water, black coffee, green tea. Preworkout is your throttle — the STOP cluster is law (see RULES).' },
      { id:'e1', group:'EVENING', label:'Post-meal walk 10–15 min', sub:'The ONLY mandatory walk. Speeds gastric clearance = flatter evenings.' },
      { id:'e2', group:'EVENING', label:'Evening session done (A/B/C/D per date — see WORKOUTS)', sub:'~100 min incl. the 10-min burst + neck 5 min. Non-skippable — it carries ALL the muscle retention at 100g protein.' },
      { id:'e3', group:'EVENING', label:'Cooldown stretch + neck protocol', sub:'Neck 5 min daily — doubled (AM+PM) on Session D days. Hip-flexor stretch daily — it untilts the pelvis that pushes the gut out.' },
      { id:'x1', group:'SNEAKY', label:'Sneaky drips banked today', sub:'Calf raises at the kettle, glute squeezes at the desk, stairs always, pace on calls (table in RULES). +100-200 cal/day, invisible. Never to failure, skip today’s hammered muscle.' },
      { id:'s1', group:'SUPPLEMENTS', label:'Morning supplements taken (9AM with first food)', sub:'Tap to expand — D3+K2 is OUT of the stack.',
        subItems: [
          { id:'s1_a', name:'Osteocare', dose:'2 tabs', when:'With 9AM food — calcium needs food' },
          { id:'s1_b', name:'MCT gel', dose:'1 gel', when:'With first food' },
          { id:'s1_c', name:'Zinc 50mg', dose:'1 tab', when:'Mon/Wed/Fri only', days:[1,3,5] }
        ]
      },
      { id:'s2', group:'SUPPLEMENTS', label:'Omega-3 with biggest feeding · electrolyte tab pre-session', sub:'Electrolyte + 500ml water ~30 min before the evening session.' },
      { id:'s3', group:'SUPPLEMENTS', label:'Magnesium before bed', sub:'Every night, zero exceptions. At 6h sleep it is carrying your entire recovery.' },
      { id:'n2', group:'NIGHT', label:'Sleep: bed by target · 6h floor', sub:'Two wrecked nights in a row = next day auto-downgrades to walk + core. Cortisol water is scale weight.' }
    ],
    // The 6 scheduled fasts: Sun Aug 2 · Mon Aug 3 · Thu Aug 6 · Sun Aug 9 ·
    // Mon Aug 10 · Thu Aug 13. Sundays train B-lite @75%, Mondays are the deep
    // 48h days (WALK ONLY — law), Thursdays train moderate @80%.
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water + ⅓ tsp salt on waking — then ×3 across the day (×4 deep Mondays)', sub:'Electrolytes are the whole game at 24h+. Pickle juice counts.' },
      { id:'wf2', group:'FAST', label:'K-tab mid-morning + K-tab mid-afternoon', sub:'99mg potassium each. Prevents palpitations and cramps during fasted work.' },
      { id:'wf3', group:'FAST', label:'No food. Water, black coffee, green tea only', sub:'The doubles end Tue 9AM — first food is powder in water + Osteocare, gentle, not a feast.' },
      { id:'wf4', group:'FAST', label:'Training per fast-day spec — capped, nothing near failure', sub:'Sun: SESSION B-LITE @75% (−1 set on everything) · Mon deep: WALK ONLY, 40-60 min — law · Thu: moderate session @80%.' },
      { id:'wf5', group:'FAST', label:'3.5-4L water total today', sub:'Sip constantly.', type:'water', waterTarget:3.5 },
      { id:'wf6', group:'FAST', label:'Morning: MCT gel · zinc if Mon/Wed/Fri', sub:'No Osteocare on fast days — calcium needs food. D3+K2 is out of the stack entirely.' },
      { id:'wf7', group:'FAST', label:'Vacuums + neck 5 min + magnesium at bed', sub:'The corset work continues through every fast.' },
      { id:'wf8', group:'FAST', label:'STOP check: no palpitations / chest tightness / vision narrowing', sub:'Any of these → salt water + 50g carbs immediately, fast over, zero shame. Doubly live with preworkout on board.' }
    ],

    foodGroupLabel: 'TEMP CUT EATING',
    foodGroupBg: 'rgba(255,85,102,0.1)',
    foodGroupColor: '#ff5566',

    workoutContent() {
      return `
      <div class="section-title">TEMP CUT v3 <span>— THE DUBAI 13</span></div>
      <p class="section-note">Sun Aug 2 → Fri Aug 14 · WEIGH-IN Sat Aug 15 morning, then the flight. One ~100-min evening session/day on the A/B/C/D rotation, every exercise explained in plain English below. The exhaustion lives in the 10-min burst — muscles stay protected, only the lungs suffer.</p>

      <div class="rule-card" style="border-left-color:#ff5566">
        <div class="rule-num">THE CALENDAR — DATES ARE LAW</div>
        <div class="rule-text">Sun 2 FAST+B-lite · Mon 3 DEEP FAST walk-only · Tue 4 eat+A · Wed 5 eat+B · Thu 6 FAST+C-mod ✓GATE 1 ≤98.2 · Fri 7 eat+D · Sat 8 eat+A · Sun 9 FAST+B-lite · Mon 10 DEEP FAST walk-only ✓GATE 2 ≤95.0 · Tue 11 eat+C · Wed 12 eat+D · Thu 13 FAST+A-mod, low-residue starts · Fri 14 FLUSH ~750 · Sat 15 WEIGH-IN → flight → creatine</div>
        <div class="rule-sub">Eating days ~900 cal, window 9AM–3PM. Fast days zero. The 13-day ledger: OUT ~44,000-45,500 base (47,000-49,500 with extra bursts) · IN ~6,300 · NET ~38,000-43,000. Lands 91.0-92.2 base — 90.1-91.2 with the extras column + both gates hit + a clean finish. Every extra burst = +130 toward 90.0.</div>
      </div>

      <div class="rule-card" style="border-left-color:#70c8ff">
        <div class="rule-num">THE DICTIONARY — EVERY TERM, DEFINED ONCE</div>
        <div class="rule-text">"3 seconds down" — lower slowly for a 3-count, pause 1s, push back up. The slow lowering is the secret sauce.<br>"Leave 2 in the tank" — end every set while 2 clean reps are still in you. The anti-burnout rule.<br>"Final-set finisher" — ONE set per session where you empty the tank: failure → 15 slow breaths → failure → 15 breaths → last push.<br>"Drop set" — finish the set, drop the weight ~30%, keep repping. One continuous burn.<br>"EMOM" — every time a new minute starts, do the reps, rest the remainder.<br>"Squeeze-everything plank" — plank while clenching fists, abs, butt, thighs as HARD as possible. 20s feels like a minute.<br>"Burst" — 10 min of simple violent cardio at the END of the session (menu below).</div>
        <div class="rule-sub">How every session works: 8-min warmup (arm/hip/wrist circles + light first exercise) → main work, 60-90s rest between sets → burst → neck 5 min → done at ~100 min. Leave 2 in the tank on everything except the ONE marked finisher.</div>
      </div>

      <div class="section-title">THE ROTATION <span>— A / B / C / D</span></div>

      ${workoutCard('SESSION A — CHEST + BICEPS + WEIGHTED ABS','TUE AUG 4 · SAT AUG 8 · (MODERATE @80%: THU AUG 13 FASTED)',
        exRow('Chest press machine','Sit tall, lower to full chest stretch over 3 seconds, pause 1s, press out. LAST SET = final-set finisher.','4×12')+
        exRow('Decline push-up','Feet up on a chair, hands on floor, lower slow. Hits the UPPER chest — the shelf under the collarbone.','3×10')+
        exRow('Push-up burnout','Regular push-ups, max clean reps, stop when form breaks.','1 set')+
        exRow('⭐ Pulldown-machine ab crunch','Kneel FACING the pulldown machine, bar held at the top of your chest/behind neck, curl your spine down — ribs toward hips — against the stack. Weight where 12 is hard. THE weighted ab-grower — your machine was secretly a cable-crunch station the whole time.','4×12–15')+
        exRow('Dumbbell crunch','Lie back, knees bent, hug the 10kg to your chest, crunch up slow.','3×15')+
        exRow('Squeeze-everything plank','Clench everything as hard as possible the whole hold. The brick-builder.','3×20s')+
        exRow('Biceps: slow curls','Curl up normal speed, lower over a slow 3-count — the slow lowering is the arm-builder at 10kg.','3×12/arm')+
        exRow('Hammer curls','Same curl, thumb pointing up throughout. Builds the muscle that makes arms look thick from the side.','2×10/arm')+
        exRow('Reverse curls','Curl with palms facing DOWN — lighter, feels weird, builds the forearm near the elbow.','2×12')+
        exRow('Side raises','Arms slightly bent, raise the DB sideways to shoulder height, NO swinging. The shoulder-widener.','3×12')+
        exRow('BURST + neck 5 min','Pick from the burst menu below.','10 min'),
        stretchRow('Doorframe chest + dislocates + wrists + hip-flexor stretch','','8 min'),
        'TUE,SAT,THU'
      )}

      ${workoutCard('SESSION B — BACK + WHALE LOWER BACK + FOREARMS','WED AUG 5 · (LITE @75%: SUN AUG 2 + SUN AUG 9 FASTED)',
        exRow('Pulldown, wide grip','Hands wide, pull the bar to upper chest sitting tall, let it back UP over a slow 3-count. Elbows drive down, chest proud. Back WIDTH.','4×10–12')+
        exRow('Pulldown, close grip, palms facing you','Narrow underhand grip, same movement. Lower lats + biceps bonus. LAST SET = drop set: −30%, keep going.','3×12–15')+
        exRow('One-arm dumbbell row','One hand braced on a chair, row the DB to your hip, slow on the way down. Back THICKNESS.','4×12/arm')+
        exRow('Shoulder-blade pulldowns','Arms dead straight on the bar — just pull the shoulder blades DOWN. Tiny movement, huge for posture.','2×12')+
        exRow('⭐ Sliding leg curl','On your back, socks/towel under heels on smooth floor, bridge the hips up, SLIDE heels away slowly till legs are almost straight, drag them back. The hamstring builder — brutal and perfect, zero equipment.','3×8–12')+
        exRowWithLevel('hinge','Good mornings','Hands behind head, push hips BACK, hinge the flat torso forward over a slow 4-count, stand up. Lower back + hamstrings.','3×12')+
        exRow('WHALE BLOCK: Superman holds','Face down, lift arms + chest + legs, hold. Builds the thick lower-back cables — safely, zero spine load.','3×45s')+
        exRow('Bird-dog','All fours, extend opposite arm + leg, hold 2s, switch. Slow and balanced.','3×10/side')+
        exRow('Suitcase carry','DB in ONE hand, walk tall, do NOT lean — your side-abs fight the lean, that’s the point.','4×40 steps/side')+
        exRow('Forearm block','Wrist curls 3×15 (palm up) + reverse wrist curls 3×15 (palm down) + towel-wring 2×60s — wring it like it owes you money. Vein protocol.','3 moves')+
        exRow('BURST + neck 5 min','Fast Sundays: burst still happens, everything else −1 set, nothing near failure.','10 min'),
        stretchRow('Full shoulder sequence + hip-flexor stretch + neck isometrics','','12 min'),
        'WED,SUN'
      )}

      ${workoutCard('SESSION C — LEGS + SIDE-ABS + THE GUT-TILT FIX','TUE AUG 11 · (MODERATE @80%: THU AUG 6 FASTED)',
        exRow('Leg extension machine','Kick up, SQUEEZE the quads 2s at the top, lower slow. Moderate weight, HIGH REPS ONLY — heavy is bad for knees here.','4×15–20')+
        exRowWithLevel('squat','Bulgarian split squat','Rear foot up on a chair, lunge down on the front leg. Goblet the 10kg if 12 gets easy.','3×12/leg')+
        exRow('Goblet squat','DB at chest, full depth, no pausing at the top — continuous tension.','3×15')+
        exRow('Sliding leg curl','Second hamstring hit of the week.','2×10')+
        exRow('Calves, straight leg','Single-leg raise off a step edge, 3 seconds down.','4×15')+
        exRow('Calves, bent knee','Seated, DB on the knee, raise the heel. The deeper calf muscle — you need both for the diamond.','3×20')+
        exRow('Shin raises','Back against a wall, feet a step forward, lift toes toward shins repeatedly. The muscle beside the shin bone.','3×20')+
        exRow('GUT-TILT FIX: glute bridge march','Hips bridged up, march knees up alternately without the hips dropping. Weak glutes let the pelvis tip forward and push the gut OUT — strong glutes pull it back.','3×15')+
        exRow('Single-leg hip thrust','Shoulders on the sofa, one foot down, drive the hips to the ceiling.','3×10/leg')+
        exRow('Slow dead bugs','On your back, arms up, knees up. Lower opposite arm + leg SLOW while the lower back stays glued to the floor. Teaches the pelvis to sit correctly.','3×10/side')+
        exRow('Hip-flexor couch stretch','Kneel in a lunge, back knee down, squeeze that side’s butt cheek, push hips gently forward. That tight front-of-hip muscle is literally what tilts the pelvis and pooches the gut. Daily.','2×60s/side')+
        exRow('Side-abs: side plank + hip dip','Side plank on the elbow, dip the hip to the floor and lift.','3×12/side')+
        exRow('DB side bend','DB in one hand, bend sideways slow, come up using the opposite side-abs.','2×15/side')+
        exRow('BURST + leg-ext burnout + neck','One light extension set, 30+ reps to quad failure → then the burst.','~13 min'),
        stretchRow('Pigeon + figure-4 + hamstring + hip-flexor stretch','','12 min'),
        'TUE,THU'
      )}

      ${workoutCard('SESSION D — SHOULDERS + ARMS RD 2 + STEEL CORE','FRI AUG 7 · WED AUG 12',
        exRowWithLevel('shoulder','Pike push-up','Butt high like a triangle, head pointing at the floor between the hands, bend elbows to lower the head, press back. A shoulder press using bodyweight.','3×8–10')+
        exRow('Wall handstand hold','Kick up against the wall, arms locked, hold. Bail SIDEWAYS if it fails, never backward.','3×20–30s')+
        exRow('One-arm DB press','Shoulder to overhead, standing, core tight.','3×10/arm')+
        exRow('Side raises','The shoulder-widener again, strict — this muscle grows on frequency.','4×12–15')+
        exRow('Y-T-W raises','Face down, raise straight arms into a Y, then T, then W, squeezing the shoulder blades. Rear shoulders — the part everyone forgets and you won’t.','3×10 each')+
        exRow('Bent-over rear fly','Hinge forward, raise the DB out sideways with a slight elbow bend.','3×12/arm')+
        exRow('STEEL CORE: dragon flag negatives','On a bench/bed edge, grip behind your head, raise the whole body straight up on the shoulders, lower it dead-straight over 5 agonizing seconds. The hardest home ab move and THE brick-builder.','4×4')+
        exRow('Hollow body hold','Arms overhead, legs out, only the lower back touches the floor — a shallow banana, everything tight.','3×40s')+
        exRow('Pulldown ab crunch','Same star move as Session A.','3×15')+
        exRow('Vacuum ladder','Exhale everything, navel to spine, hold: 15s → 20s → 30s.','1 ladder')+
        exRow('Arms: curls + overhead triceps','Curls 2×12 · DB behind the head, elbows pointing up, extend to straight 3×12/arm.','2 moves')+
        exRow('NECK ROUTINE ×2 TODAY + BURST','Full 5-min neck protocol morning AND evening — growth needs frequency.','2×5 + 10 min'),
        stretchRow('Doorframe chest + rear shoulder + wrists + hip-flexor stretch','','8 min'),
        'FRI,WED'
      )}

      <div class="section-title">THE DEEP DAYS <span>+ THE FINISH</span></div>

      ${workoutCard('DEEP MONDAYS — AUG 3 · AUG 10 (~48H FASTED)','WALK ONLY — LAW',
        exRow('Walk','40-60 min easy. At 48h fasted the fuel tank is empty — lifting here just eats muscle and risks injury. Light movement spares muscle better than grinding.','40-60 min')+
        exRow('Vacuums + neck protocol','3×20-30s + 5 min.','10 min')+
        exRow('Salt ×4 + both K-tabs','Deepest days — electrolytes are the whole game.','all day')+
        exRow('AUG 10 ONLY: GATE 2','Morning scale must read ≤95.0. Missed → pick ONE lever tonight (see RULES).','decide today'),
        stretchRow('Full hip session','90/90 · frog · pigeon · cossack · deep squat + hip-flexor stretch','20 min'),
        'MON'
      )}

      ${workoutCard('FRI AUG 14 — FLUSH','DAY BEFORE THE SCALE · SMOOTH ONLY · ~750 CAL',
        exRow('WHY SMOOTH','No new slow-lowering damage today — fresh muscle damage = inflammation = water on tomorrow’s scale.','READ FIRST')+
        exRow('Circuit ×3, everything smooth','Chest press ×15 · pulldown ×15 · goblet ×15 · leg extension ×20 · DB row ×10/arm — smooth tempo, nowhere near failure.','3 rounds')+
        exRow('Powder + rice cakes only · bed by 10','Tomorrow: wake → bathroom → scale → write it down → flight → creatine begins.','—'),
        stretchRow('Everything, nothing aggressive','','12 min'),
        'FRI'
      )}

      <div class="section-title">DAILY <span>CONSTANTS</span></div>
      ${workoutCard('EVERY DAY','THE NON-NEGOTIABLES',
        exRow('Stomach vacuums','3×20s → 3×30s, waking, empty stomach.','daily')+
        exRow('Post-meal walk','10-15 min — the ONLY mandatory walk. Digestion + flatter evenings.','daily')+
        exRow('Neck protocol','Isometrics 4×30s + chin tucks ×15 + prone extension ×10. Doubled on D-days.','5 min')+
        exRow('Hip-flexor couch stretch','2×60s/side — the free centimeter off the gut. Daily, not just C-days.','2 min')+
        exRow('Sneaky drips','The invisible mini-exercise table lives in RULES. +100-200 cal/day.','all day')+
        exRow('Optional extra bursts','Any time you’re lit — every extra 10-min burst is +130 toward the 90.0 column. Your 3-hour rampage days are worth ~2.2k; they only help.','optional')
      )}

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">BURST MENU — PICK ANY, 10 MIN, ALL INDOOR/AC-FRIENDLY</div>
        <div class="rule-text">DB swings EMOM (15 swings each minute) · shadowboxing 3 rounds of 3 min · EMOM of 8 burpees + 8 squats + 10 mountain climbers · stair repeats · jump rope if you own one.</div>
        <div class="rule-sub">Low-skill violent cardio that can’t burn out muscles. Every extra one you stack = +130 cal to the ledger.</div>
      </div>`;
    },

    nutritionContent(s) {
      const cal = s.calories || 900;
      const macros = computeMacros(todayStr());
      const { proteinG, carbsG, fatG, warnings: macroWarnings } = macros;
      const warningHtml = macroWarnings.length ? macroWarnings.map(w =>
        `<div style="border-left:3px solid var(--accent2);padding:6px 10px;margin-bottom:6px;border-radius:4px;background:var(--surface);font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent2);line-height:1.6">${w}</div>`
      ).join('') : '';

      return `
      <div class="section-title">TEMP CUT v3 <span>NUTRITION</span></div>
      <p class="section-note">900 cal in a 9AM–3PM window on eating days. 100g protein is the daily floor and the whole muscle-retention vote. Set Settings ceiling to 900.</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#ff5566">${cal}</div><div class="macro-lbl">Day ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${warningHtml}

      ${(()=>{
        const _dt = getDayType(todayStr());
        if(_dt === 'fast') return '<div class="rule-card" style="border-left-color:var(--fast)"><div class="rule-num">FAST DAY ACTIVE</div><div class="rule-text">No food. Water, black coffee, green tea. Salt ×3-4 · K-tabs ×2 · 3.5-4L water · MCT gel on waking.</div><div class="rule-sub">Doubles end Tue 9AM — first food is powder in water + Osteocare, gentle. Deep Mondays: WALK ONLY, law.</div></div>';
        const _dc = getDayCalories(todayStr());
        const _rem = cal - _dc.total;
        const _cls = !_dc.hasData ? 'var(--muted)' : _dc.total > cal ? 'var(--danger)' : (_rem <= 100 ? 'var(--accent2)' : 'var(--accent)');
        const _remTxt = !_dc.hasData ? 'No food logged yet — tap FOOD LOG on TODAY tab' : (_rem >= 0 ? _rem + ' cal remaining' : Math.abs(_rem) + ' cal OVER ceiling');
        const _pctW = _dc.hasData ? Math.min(100, Math.round(_dc.total / cal * 100)) : 0;
        const _barColor = _dc.total > cal ? 'var(--danger)' : _dc.total > cal * 0.85 ? 'var(--accent2)' : 'var(--accent)';
        return '<div class="rule-card" style="border-left-color:'+_cls+'"><div class="rule-num">TODAY\'S INTAKE</div><div class="rule-text" style="font-size:0.85rem;color:'+_cls+'">'+(_dc.hasData ? _dc.total + ' / ' + cal + ' cal' : '0 / ' + cal + ' cal')+'</div><div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+_pctW+'%;background:'+_barColor+';border-radius:3px;transition:width 0.3s"></div></div><div class="rule-sub">'+_remTxt+'</div></div>';
      })()}

      <div class="rule-card" style="border-left-color:#ff5566">
        <div class="rule-num">THE DAILY PLATE — 9AM-3PM (~900 CAL · ~100g PROTEIN)</div>
        <div class="rule-text">Protein powder ×2 scoops in water — 50g P, ~240 cal (it’s 2 scoops, you’ll live)<br>Low-carb bars ×2 — 40g P, ~440 cal (whey isolate first ingredient, &lt;5g sugar alcohols)<br>Rice cakes ×2-3 — ~90-130 cal<br>Baby carrots 150g + pickles freely — ~60 cal (pickles = your salt supply)</div>
        <div class="rule-sub">Total ≈ 95-105g protein · ~880-930 cal. Last bite 3PM SHARP — a gift to your 6h sleep. Maltitol is a bloat machine — the literal thing you are fighting.</div>
      </div>

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">LOW-RESIDUE FINISH — THU AUG 13 → SAT AUG 15</div>
        <div class="rule-text">From Thu 13: bars OUT (their fiber + sugar alcohols sit in the gut = scale weight). FLUSH Friday Aug 14: ~750 cal, powder + rice cakes ONLY. Carrots + pickles STOP.</div>
        <div class="rule-sub">Water stays HIGH through the final night. No water cutting, ever.</div>
      </div>

      <div class="section-title" style="margin-top:8px">YOUR <span>ENERGY NUMBERS</span></div>
      ${ruleCard('BMR ~2,030→1,930 · STANDARD TDEE ~2,430→2,310','Mifflin-St Jeor at 24M · 180cm, recalculated as you shrink 102→91, metabolism-slowdown included. Standard = what you burn by being alive.','Deliberate burn per day: session ~650-1,000 + burst ~130 + walk ~90 = +1,050-1,200 base · +1,300-1,550 with extra bursts (your "lit" days). Daily deficit: eating days ~2,300-2,800 · fast days ~2,900-3,400.','#82e0aa')}
      ${ruleCard('THE 13-DAY LEDGER','OUT ~44,000-45,500 base (~47,000-49,500 with extras) · IN ~6,300 · NET ~38,000-43,000.','True fat ~4.2-4.8kg + glycogen/gut/water compartments ~3.8-4.4 → Sat Aug 15 lands 91.0-92.2 base · 90.1-91.2 with the extras column + both gates + a clean finish. 90.0 = the extras column. Weekend rebound after +2-3kg = glycogen refilling, not fat — pre-accepted.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">SUPPLEMENT <span>CLOCK — D3+K2 IS OUT</span></div>
      ${ruleCard('FAST DAYS (SUN 2 · MON 3 · THU 6 · SUN 9 · MON 10 · THU 13)','Wake: MCT gel · zinc if Mon/Wed/Fri · K-tab mid-AM + mid-PM · salt ⅓ tsp ×3 (×4 deep Mondays) · magnesium at bed.','NO Osteocare — calcium needs food. Preworkout is your throttle; the STOP rule is doubly live fasted.','#82e0aa')}
      ${ruleCard('EATING DAYS','9AM with first food: Osteocare ×2 + MCT gel + zinc (Mon/Wed/Fri) · omega-3 with the biggest feeding · electrolyte tab + 500ml water pre-session · magnesium at bed.','Magnesium every night, no exceptions — at 6h sleep it carries your recovery.','#82e0aa')}
      ${ruleCard('CREATINE — STARTS SAT AUG 15, IN INDIA','5g/day from weigh-in morning onward, with the rebuild phase.','Its ~1kg intramuscular water fights the 90.0 target and its benefits arrive after the window. Different molecule than your preworkout — this one is my call, that one is yours.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">THE GUT — <span>DEBLOAT STACK</span></div>
      ${ruleCard('FAT + GUT CONTENT','The ~40,000 kcal net kills the fat layer — slowly, systemically, no spot reduction. The 6 fasts + 3PM cutoff empty the gut every single evening.','Visceral fat responds FASTEST to daily work — the waistband loosens before the mirror does.')}
      ${ruleCard('THE CORSET + THE ARMOR','Vacuums every morning (3×20→30s) build the corset that holds the gut IN. Pulldown crunches + dragon flags build ab thickness so the wall itself looks armored.','Density = tension. This is the poke-a-brick builder.')}
      ${ruleCard('THE TILT + THE WATER','Session C’s gut-tilt block untilts the pelvis — a tilted pelvis alone pushes the belly out 1-2cm at ANY body fat. Glute strength + hip-flexor length + dead-bug control is the fix, and it’s free.','Sodium consistency + 4L water kills the retention layer. Cortisol water dies with sleep discipline.')}`;
    },

    rulesContent(s) {
      return `
      <div class="section-title">RED <span>LINES</span></div>
      ${ruleCard('RULE 01','No water cutting. Ever.','4L+ daily through the final night. High water DECREASES retention. Dehydration + Dubai heat + stims is the ER cluster.')}
      ${ruleCard('RULE 02','STOP cluster: palpitations · chest tightness · vision narrowing','Salt water + 50g carbs IMMEDIATELY. Fast over if fasting. Zero shame, total obedience. Doubly live on the four deep-fast days and with preworkout on board.')}
      ${ruleCard('RULE 03','Protein 100g daily. The untradeable floor.','At this depth it is the entire muscle-retention budget alongside the training. Miss calories if life happens — never miss protein.')}
      ${ruleCard('RULE 04','Deep Mondays (Aug 3 · Aug 10) = walk only. Law.','~48h fasted: fuel tank empty, cortisol peaked, injury risk stupid. Light movement spares muscle better than grinding.')}
      ${ruleCard('RULE 05','Leave 2 in the tank — except the ONE marked finisher per session.','Sessions end at ~100 min with reps in the tank. The exhaustion goes into the burst, which can’t burn out muscle. Muscle burn = green. Joint/wrist/spine pain = red — swap the exercise same day.')}
      ${ruleCard('RULE 06','Last bite 3PM sharp · bed by target · 6h sleep floor.','Two wrecked nights in a row → next day auto-downgrades to walk + core. Your preworkout timing decides whether this rule ever fires.')}

      <div class="section-title" style="margin-top:8px">THE TWO <span>GATES</span></div>
      ${ruleCard('GATE 1 — THU AUG 6 MORNING','Scale must read ≤98.2','On track for the central path. Missed → pick ONE lever below, today.','var(--accent2)')}
      ${ruleCard('GATE 2 — MON AUG 10 MORNING','Scale must read ≤95.0','The last correction point — no overtime exists this round, the flight is the wall.','var(--accent2)')}
      ${ruleCard('THE LEVERS — PICK ONE AT THE GATE, NOT BEFORE','(a) +2 extra bursts daily — the simplest · (b) eating days drop to 800 (cut one bar) · (c) extend Thu Aug 13’s fast through Friday 9AM.','One lever, executed hot, beats three levers planned cold.','var(--accent2)')}

      <div class="section-title" style="margin-top:8px">🥷 THE SNEAKY <span>TABLE</span></div>
      ${ruleCard('THE DRIP RULES','These help and will NOT hurt the main plan — under two laws: (1) nothing to failure, ever — drips, not sets · (2) skip any sneaky move targeting the muscle TODAY’S session hammered.','Worth +100-200 cal/day plus bonus muscle stimulus. Invisible to everyone around you.')}
      ${ruleCard('LOWER BODY DRIPS','Calf raises at the kettle / elevator / queue / brushing teeth (~3 cal/min) · glute squeezes seated or standing — the gut-tilt fix on drip-feed · wall shin raises while waiting · under-desk leg-extension holds, 10s quad squeezes · slow full-depth squat to pick ANYTHING up.','Calf definition, tilt correction, quad tone — nobody notices, ever.')}
      ${ruleCard('CORE + UPPER DRIPS','Seated ab brace — exhale, brace like taking a punch, 10s ×10 · mini vacuums seated, 3×15s anytime · doorframe press — palms outward 10s, push the frame like it owes you money · water-bottle grip crush 10s ×10 on calls.','Brick abs, corset, chest/arm isometrics, forearms — all invisible.')}
      ${ruleCard('MOVEMENT DRIPS','Take literally every stair (~8 cal/floor) · pace during phone calls (~4 cal/min) · stand instead of sit one hour/day (+~50 cal) — TV, gaming, scrolling.','Free burst fragments all day long.')}

      <div class="section-title" style="margin-top:8px">WEIGH-IN <span>+ AFTER</span></div>
      ${ruleCard('SAT AUG 15 MORNING','Wake → bathroom → scale → write it down → real breakfast → flight → creatine 5g begins.','Expected: 91.0-92.2 base · 90.1-91.2 with the extras column + both gates + clean finish. Rebound +2-3kg in the days after = glycogen refilling, not fat. Pre-accepted.','#70c8ff')}
      ${ruleCard('AUG 15+ — THE BLOCK ENDS','TEMP CUT is a 13-day tool, not a lifestyle. Switch plans in India.','The rebuild: maintenance-ish calories, protein up, progressive overload, creatine saturating. Design it when the scale has spoken.','#70c8ff')}`;
    }
};
