// plans/tempcut.js — TEMP CUT v3.2: "THE DUBAI 13" (Aug 3 → Aug 14, weigh-in Sat Aug 15).
// Owner-designed pre-flight cut. v3 finalised 2026-08-02; v3.1 recalendared to the
// real fast pattern (Wed/Sat/Sun fasts, 6PM-prior-evening → 9AM-morning-after);
// v3.2 (owner-approved 2026-08-03): MONDAY IS THE REST DAY (it follows the ~63h
// weekend double — worst slot to train), and the burn moves to the other days:
// Tue/Thu/Fri sessions carry a MANDATORY DOUBLE BURST (2×10 min), Session A
// relocates to Saturday fasted @80% (no finisher, nothing near failure), the
// Wednesday fast gets a standard light circuit + two bursts + 60-min walk, and
// Sunday's walk extends to 60-75 min. Muscle-goal coverage preserved: every
// target from v3 keeps ≥2 weekly touches (abs: A+D+daily vacuums · biceps:
// A+B underhand+D · shoulders: A+D · back/whale lower back: B+carries · legs/
// calves: C+Wed circuit · forearms: A reverse curls+B block). Eating days
// (Mon/Tue/Thu/Fri): ~900 cal, 9AM–3PM window, 100g protein floor. Gates:
// Thu Aug 6 9AM ≤98.2 · Mon Aug 10 9AM ≤95.0 — weighed BEFORE breaking the
// fast. Low-residue from Thu 13 night, FLUSH Fri 14 (~750), weigh-in Sat 15
// → flight. D3+K2 is OUT of the stack. Creatine paused until Aug 15.
// Temporary by design — switch away after the block.

export const tempcut = {
    name: 'TEMP CUT',
    goalMode: 'cut',
    // Session-day total burn (~2,400 standard TDEE + ~1,200-1,400 deliberate:
    // ~100-min session + DOUBLE burst + post-meal walk). Settings recompute per-user.
    tdee: 3400,
    fastDaysPerWeek: 3,
    badge: 'TEMP CUT',
    badgeClass: 'agro',
    descClass: 'agro-desc',
    subtitle: 'Dubai 13. Wed/Sat/Sun fasts. Mon rest. Double bursts. 90.0 by the flight.',
    bannerColor: '#ff5566',
    bannerBg: 'rgba(255,85,102,0.07)',
    bannerBorder: 'rgba(255,85,102,0.35)',
    // Sun + Wed + Sat — the owner's real pattern (same DOW set as AGRO).
    // Each fast starts 6PM the PREVIOUS evening and breaks 9AM the NEXT morning.
    fastDaysDow: [0, 3, 6],
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    macroSplit: { base:[45,30,25], rest:[45,30,25], preFast:[45,30,25], stall:[45,30,25], satiety:[45,30,25] },
    // 1.0 g/kg — owner's hard ceiling is 100g flat; floor = ceiling here.
    proteinFloorMultiplier: 1.0,
    caloriesMode: 'floor',
    minCalories: 700,
    activityByDayType: { eatDay: 1.70, fastDay: 1.50 },

    defaultTimes: { wakeTime:'06:30', lastMealTime:'15:00', eveningSessionTime:'17:00', eatingWindowStart:'09:00' },

    // DOW roles (v3.2): Mon = eat + REST (recovery after the 63h double; Aug 10
    // GATE 2 first) · Tue = eat + SESSION B + double burst, fast from 6PM ·
    // Wed = FAST burn day (circuit + 2 bursts + 60-min walk) · Thu = eat +
    // SESSION C + double burst (Aug 6 GATE 1 first) · Fri = eat + SESSION D +
    // double burst (Aug 14 FLUSH instead) · Sat = FAST + SESSION A-MODERATE
    // @80% (Aug 15 WEIGH-IN) · Sun = FAST deep, WALK ONLY 60-75 min — law.
    weekIcons: {0:'🚶',1:'😴',2:'💪',3:'🔥',4:'💪',5:'💪',6:'🔥'},

    morningSub: {
      0:'SUNDAY — FAST day 2 of the weekend double (Aug 9), the deepest stretch. WALK ONLY today — law. Salt ×4 + both K-tabs. Vacuums.',
      1:'MONDAY — REST DAY (Aug 10). WEIGH FIRST at 9AM — GATE 2, scale must read ≤95.0 — then break the double: powder in water + Osteocare, gentle. Eat 900. No session today — recovery after the 63h double. Vacuums + sneaky drips only.',
      2:'TUESDAY — Eating day (Aug 4 · Aug 11). Window 9AM–3PM. First burst mid-day. Tonight 6PM the Wednesday fast begins. Vacuums + weigh.',
      3:'WEDNESDAY — FAST BURN DAY (Aug 5 · Aug 12; started Tue 6PM, breaks Thu 9AM). Circuit + two bursts + 60-min walk, all capped clean. Salt ×3 + K-tabs. Vacuums + weigh.',
      4:'THURSDAY — Eating day (Aug 6 · Aug 13). Aug 6: WEIGH FIRST — GATE 1, ≤98.2 — then break fast at 9AM. First burst mid-day. Aug 13: low-residue starts tonight. Vacuums.',
      5:'FRIDAY — Aug 7: eating day, first burst mid-day; tonight 6PM the weekend double begins · Aug 14: FLUSH day ~750 cal, powder + rice cakes ONLY, bed by 10. Vacuums + weigh.',
      6:'SATURDAY — Aug 8: FAST + SESSION A-MODERATE @80% this evening · Aug 15: WEIGH-IN (wake → bathroom → scale → write it down) → real breakfast → flight → creatine begins.'
    },
    eveningSub: {
      0:'SUNDAY — Nothing beyond the walk: 60-75 min easy + hip stretches + vacuums. Tomorrow 9AM the double ends — weigh before you break it (Aug 10 = GATE 2).',
      1:'MONDAY — REST. Post-meal walk 10-15 min + evening stretch. That’s it — the double bursts on Tue/Thu/Fri and the Saturday session carry what Monday used to.',
      2:'TUESDAY — SESSION B: back + whale lower back + forearms + SECOND burst after the session. Last bite was 3PM; fast is on from 6PM.',
      3:'WEDNESDAY — Fasted burn: light circuit ×3 @75% + second burst + finish the 60-min walk. Nothing near failure — clean burn only.',
      4:'THURSDAY — SESSION C: legs + side-abs + gut-tilt fix + SECOND burst. Aug 13: bars OUT from tonight (low-residue).',
      5:'FRIDAY — Aug 7: SESSION D — shoulders + arms + steel core, neck ×2, SECOND burst · Aug 14: FLUSH — smooth circuit ×3, NO new soreness allowed.',
      6:'SATURDAY — Aug 8: SESSION A-MODERATE @80% fasted (chest + biceps + weighted abs — no finisher, 2 in the tank everywhere) + 30-40 min walk · Aug 15: rest, the flight is boarding.'
    },
    stretchSub: {
      0:'DEEP-FAST day: full hip session — 90/90 · frog · pigeon · cossack · deep squat + hip-flexor stretch + neck isometrics (20 min).',
      1:'REST-day full body gentle: neck · shoulders · hips + hip-flexor couch stretch 2×60s/side (12 min).',
      2:'Full shoulder sequence + hip-flexor stretch + neck isometrics (12 min).',
      3:'Fasted day: gentle full-body flow + hip-flexor stretch, nothing aggressive (10 min).',
      4:'Pigeon + figure-4 + hamstring + hip-flexor stretch (12 min).',
      5:'Doorframe chest + rear shoulder + wrists + hip-flexor stretch (8 min).',
      6:'Doorframe chest + dislocates + wrists + hip-flexor stretch (8 min).'
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake: 500ml water + ⅓ tsp salt', sub:'Salt water first, every day. Creatine stays PAUSED until Aug 15 — its water weight fights the 90.0 target.' },
      { id:'m2', group:'MORNING', label:'Stomach vacuums 3×20s → build to 3×30s', sub:'Exhale fully, suck navel to spine, hold, breathe shallow. The corset muscle. Daily, empty stomach.' },
      { id:'m3', group:'MORNING', label:'Morning role done (see WORKOUTS + today’s sub-text)', sub:'Session days: weigh + vacuums + first burst mid-day. Monday: rest — drips only. Gate mornings: weigh BEFORE breaking the fast.' },
      { id:'m4', group:'MORNING', label:'Log morning weight in TRACK tab', sub:'After waking + bathroom, before water. Judge the two gates (Thu Aug 6 ≤98.2 · Mon Aug 10 ≤95.0), not single days.' },
      { id:'f1', group:'EATING', label:'Protein 100g hit — the daily floor, zero exceptions', sub:'2 scoops powder in water (50g) + 2 clean bars (40g) + the extras. Bars: whey isolate first ingredient, <5g sugar alcohols — maltitol = bloat.' },
      { id:'f2', group:'EATING', label:'Stayed at ~900 today (FLUSH Fri Aug 14: ~750)', sub:'Log everything in FOOD LOG — every unlogged bite is a lie the scale exposes at the gate.', type:'info' },
      { id:'f3', group:'EATING', label:'Eating window 9AM–3PM · last bite 3PM SHARP', sub:'On Tue and Fri the next fast formally starts at 6PM — the 3PM cutoff means you’re already fasting when it does.' },
      { id:'f4', group:'EATING', label:'4L+ water across the day', sub:'Never restricted — high water DECREASES retention. Sodium steady 2-3g; pickles are the salt supply.', type:'water', waterTarget:4.0 },
      { id:'f5', group:'EATING', label:'Zero liquid calories · carrots + pickles + rice cakes are the only extras', sub:'Water, black coffee, green tea. Preworkout is your throttle — the STOP cluster is law (see RULES).' },
      { id:'e1', group:'EVENING', label:'Post-meal walk 10–15 min', sub:'Mandatory every day including Monday. Speeds gastric clearance = flatter evenings.' },
      { id:'e2', group:'EVENING', label:'Session + DOUBLE burst done (B Tue · C Thu · D Fri — Mon is REST)', sub:'~100 min + 2×10-min bursts (one mid-day, one post-session). The doubles are v3.2’s engine — they buy back Monday.' },
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
    // Fast days: Wed Aug 5 · Sat Aug 8 · Sun Aug 9 · Wed Aug 12. Every fast
    // starts 6PM the previous evening and breaks 9AM the morning after —
    // Wed singles ≈ 39h (Tue 6PM → Thu 9AM), the weekend double ≈ 63h
    // (Fri 6PM → Mon 9AM). v3.2 fast-day burn: Wed = circuit + 2 bursts +
    // 60-min walk · Sat = SESSION A-moderate @80% · Sun = WALK ONLY (law).
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water + ⅓ tsp salt on waking — then ×3 across the day (×4 Sundays)', sub:'Electrolytes are the whole game past 24h. Pickle juice counts.' },
      { id:'wf2', group:'FAST', label:'K-tab mid-morning + K-tab mid-afternoon', sub:'99mg potassium each. Prevents palpitations and cramps during fasted work.' },
      { id:'wf3', group:'FAST', label:'No food. Water, black coffee, green tea only', sub:'Fasts run 6PM the night before → 9AM the morning after. Weekend double: Fri 6PM → Mon 9AM. First food back: powder in water + Osteocare, gentle — not a feast.' },
      { id:'wf4', group:'FAST', label:'Fast-day burn done — capped clean, nothing near failure', sub:'Wed: circuit ×3 @75% + TWO bursts + 60-min walk · Sat: SESSION A-MODERATE @80%, no finisher + 30-40 min walk · Sun: WALK ONLY 60-75 min — law.' },
      { id:'wf5', group:'FAST', label:'3.5-4L water total today', sub:'Sip constantly.', type:'water', waterTarget:3.5 },
      { id:'wf6', group:'FAST', label:'Morning: MCT gel · zinc if Mon/Wed/Fri', sub:'No Osteocare on fast days — calcium needs food. D3+K2 is out of the stack entirely.' },
      { id:'wf7', group:'FAST', label:'Vacuums + neck 5 min + magnesium at bed', sub:'The corset work continues through every fast.' },
      { id:'wf8', group:'FAST', label:'STOP check: no palpitations / chest tightness / vision narrowing', sub:'Any of these → salt water + 50g carbs immediately, fast over, zero shame. Extra-live during fasted training and with preworkout on board.' }
    ],

    foodGroupLabel: 'TEMP CUT EATING',
    foodGroupBg: 'rgba(255,85,102,0.1)',
    foodGroupColor: '#ff5566',

    workoutContent() {
      // "TODAY" strip — computed at render time so the tab always opens with
      // today's marching orders on top.
      const _todayByDow = {
        0: { label:'SUNDAY — FAST DAY 2, THE DEEP ONE', what:'WALK ONLY — 60-75 min easy + hips + vacuums. NO lifting at 48h+ fasted, by law. Tomorrow 9AM the double ends — Aug 10: weigh FIRST (GATE 2 ≤95.0), then break it.' },
        1: { label:'MONDAY — REST DAY (900 · 9AM-3PM)', what:'No session — recovery after the 63h double. Aug 10: GATE 2 weigh-in BEFORE breaking the fast at 9AM. Eat the template, post-meal walk, vacuums, sneaky drips. The double bursts Tue-Fri carry today.' },
        2: { label:'TUESDAY — SESSION DAY (900 · 9AM-3PM)', what:'SESSION B tonight: back + whale lower back + forearms. DOUBLE BURST day — one 10-min burst mid-day, one after the session. The Wednesday fast begins 6PM tonight.' },
        3: { label:'WEDNESDAY — FAST BURN DAY (~39H)', what:'Started 6PM yesterday, breaks tomorrow 9AM. Circuit ×3 @75% + TWO bursts + 60-min walk — capped clean, nothing near failure. Your card: WEDNESDAY FAST BURN, open below.' },
        4: { label:'THURSDAY — SESSION DAY (900 · 9AM-3PM)', what:'Break the fast 9AM (Aug 6: weigh FIRST — GATE 1 ≤98.2). SESSION C tonight: legs + side-abs + gut-tilt fix. DOUBLE BURST day. Aug 13: bars OUT from tonight.' },
        5: { label:'FRIDAY', what:'Aug 7: SESSION D tonight (shoulders + arms + steel core, neck ×2) + DOUBLE BURST; weekend double begins 6PM · Aug 14: FLUSH — smooth circuit ×3 only, ~750 cal, bed by 10.' },
        6: { label:'SATURDAY — FASTED SESSION A DAY', what:'Aug 8: SESSION A-MODERATE @80% this evening — chest + biceps + weighted abs, NO finisher, 2 in the tank everywhere + 30-40 min walk · Aug 15: WEIGH-IN morning → flight → creatine.' }
      };
      const _t = _todayByDow[new Date().getDay()];
      return `
      <div class="section-title">TEMP CUT v3.2 <span>— THE DUBAI 13</span></div>

      <div class="rule-card" style="border-left-color:var(--accent)">
        <div class="rule-num" style="color:var(--accent)">▶ TODAY — ${_t.label}</div>
        <div class="rule-text">${_t.what}</div>
      </div>

      <p class="section-note">Mon Aug 3 → Fri Aug 14 · WEIGH-IN Sat Aug 15 morning, then the flight. Monday rests. Tue/Thu/Fri train with DOUBLE bursts. Fasts (Wed/Sat/Sun, 6PM night before → 9AM morning after) each carry their own capped burn engine. Every exercise explained in plain English below.</p>

      <div class="rule-card" style="border-left-color:#ff5566">
        <div class="rule-num">THE CALENDAR — DATES ARE LAW</div>
        <div class="rule-text">Mon 3/10 eat+REST (10th: ✓GATE 2 ≤95.0 at 9AM) · Tue 4/11 eat+B+2 bursts (fast from 6PM) · Wed 5/12 FAST BURN · Thu 6/13 eat+C+2 bursts (6th: ✓GATE 1 ≤98.2 at 9AM · 13th: low-residue from tonight) · Fri 7 eat+D+2 bursts (double from 6PM) · Fri 14 FLUSH ~750 · Sat 8 FAST + SESSION A @80% · Sun 9 FAST walk-only · Sat 15 WEIGH-IN → flight → creatine</div>
        <div class="rule-sub">Eating days ~900 cal, window 9AM–3PM. Wed singles ≈39h · weekend double ≈63h. Both gates are weighed at the END of a fast, before breaking it. Monday’s old session is fully bought back by the doubles + the Saturday session + the Wed upgrade.</div>
      </div>

      <div class="rule-card" style="border-left-color:#70c8ff">
        <div class="rule-num">THE DICTIONARY — EVERY TERM, DEFINED ONCE</div>
        <div class="rule-text">"3 seconds down" — lower slowly for a 3-count, pause 1s, push back up. The slow lowering is the secret sauce.<br>"Leave 2 in the tank" — end every set while 2 clean reps are still in you. The anti-burnout rule.<br>"Final-set finisher" — ONE set per session where you empty the tank: failure → 15 slow breaths → failure → 15 breaths → last push. (Fasted Saturday: NO finisher.)<br>"Drop set" — finish the set, drop the weight ~30%, keep repping. One continuous burn.<br>"EMOM" — every time a new minute starts, do the reps, rest the remainder.<br>"Squeeze-everything plank" — plank while clenching fists, abs, butt, thighs as HARD as possible. 20s feels like a minute.<br>"Burst" — 10 min of simple violent cardio (menu below). "DOUBLE BURST" — two of them: one mid-day, one after the session. Mandatory Tue/Thu/Fri.</div>
        <div class="rule-sub">How every session works: 8-min warmup → main work, 60-90s rest between sets → burst → neck 5 min → done at ~100 min. Leave 2 in the tank on everything except the ONE marked finisher (fed days only).</div>
      </div>

      <div class="rule-card" style="border-left-color:#82e0aa">
        <div class="rule-num">MUSCLE GOALS — NOTHING WAS LOST IN v3.2</div>
        <div class="rule-text">Every target from the original rotation keeps ≥2 weekly touches: ABS — Session A (Sat) + Session D dragon flags (Fri) + daily vacuums + sneaky braces · BICEPS — A curls (Sat) + B underhand pulldowns (Tue) + D curls (Fri) · SHOULDERS — A side raises (Sat) + D full block (Fri) · BACK + WHALE LOWER BACK — B (Tue) + suitcase carries · LEGS/CALVES — C (Thu) + Wed circuit · FOREARMS — A reverse curls + B block.</div>
        <div class="rule-sub">Monday was the redundant slot — its work was re-homed, not deleted. The muscle-retention vote is unchanged: 100g protein + heavy-enough tension on everything, every week.</div>
      </div>

      <div class="section-title">THE ROTATION <span>— B TUE · C THU · D FRI · A SAT (FASTED @80%)</span></div>

      ${workoutCard('SESSION B — BACK + WHALE LOWER BACK + FOREARMS','TUESDAYS — AUG 4 · AUG 11 · + DOUBLE BURST',
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
        exRow('SECOND BURST + neck 5 min','First burst was mid-day. This one closes the session. 2×10 min total = +260 on the ledger.','10 min'),
        stretchRow('Full shoulder sequence + hip-flexor stretch + neck isometrics','','12 min'),
        'TUE'
      )}

      ${workoutCard('SESSION C — LEGS + SIDE-ABS + THE GUT-TILT FIX','THURSDAYS — AUG 6 · AUG 13 · + DOUBLE BURST',
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
        exRow('SECOND BURST + leg-ext burnout + neck','One light extension set, 30+ reps to quad failure → then the closing burst. First burst was mid-day.','~13 min'),
        stretchRow('Pigeon + figure-4 + hamstring + hip-flexor stretch','','12 min'),
        'THU'
      )}

      ${workoutCard('SESSION D — SHOULDERS + ARMS RD 2 + STEEL CORE','FRIDAY AUG 7 · + DOUBLE BURST (AUG 14 = FLUSH INSTEAD)',
        exRowWithLevel('shoulder','Pike push-up','Butt high like a triangle, head pointing at the floor between the hands, bend elbows to lower the head, press back. A shoulder press using bodyweight.','3×8–10')+
        exRow('Wall handstand hold','Kick up against the wall, arms locked, hold. Bail SIDEWAYS if it fails, never backward.','3×20–30s')+
        exRow('One-arm DB press','Shoulder to overhead, standing, core tight.','3×10/arm')+
        exRow('Side raises','The shoulder-widener again, strict — this muscle grows on frequency (it’s in Session A too).','4×12–15')+
        exRow('Y-T-W raises','Face down, raise straight arms into a Y, then T, then W, squeezing the shoulder blades. Rear shoulders — the part everyone forgets and you won’t.','3×10 each')+
        exRow('Bent-over rear fly','Hinge forward, raise the DB out sideways with a slight elbow bend.','3×12/arm')+
        exRow('STEEL CORE: dragon flag negatives','On a bench/bed edge, grip behind your head, raise the whole body straight up on the shoulders, lower it dead-straight over 5 agonizing seconds. The hardest home ab move and THE brick-builder.','4×4')+
        exRow('Hollow body hold','Arms overhead, legs out, only the lower back touches the floor — a shallow banana, everything tight.','3×40s')+
        exRow('Pulldown ab crunch','Same star move as Session A.','3×15')+
        exRow('Vacuum ladder','Exhale everything, navel to spine, hold: 15s → 20s → 30s.','1 ladder')+
        exRow('Arms: curls + overhead triceps','Curls 2×12 · DB behind the head, elbows pointing up, extend to straight 3×12/arm.','2 moves')+
        exRow('NECK ROUTINE ×2 TODAY + SECOND BURST','Full 5-min neck protocol morning AND evening. First burst was mid-day; this one closes. The weekend double starts 6PM tonight.','2×5 + 10 min'),
        stretchRow('Doorframe chest + rear shoulder + wrists + hip-flexor stretch','','8 min'),
        'FRI'
      )}

      ${workoutCard('SESSION A — CHEST + BICEPS + WEIGHTED ABS · FASTED @80%','SATURDAY AUG 8 (AUG 15 = WEIGH-IN) · NO FINISHER',
        exRow('THE 80% CONTRACT','You’re ~24h fasted at session time. Every set stops 2 clean reps short. NO finisher, NO drop set, NO burnout today — the volume still builds, the risk stays zero. STOP cluster is extra-live.','READ FIRST')+
        exRow('Chest press machine','Sit tall, lower to full chest stretch over 3 seconds, pause 1s, press out. Weight ~80% of your fed-day setting.','4×10–12')+
        exRow('Decline push-up','Feet up on a chair, hands on floor, lower slow. Hits the UPPER chest — the shelf under the collarbone.','3×8–10')+
        exRow('⭐ Pulldown-machine ab crunch','Kneel FACING the pulldown machine, bar held at the top of your chest/behind neck, curl your spine down — ribs toward hips — against the stack. THE weighted ab-grower.','4×12')+
        exRow('Dumbbell crunch','Lie back, knees bent, hug the 10kg to your chest, crunch up slow.','3×12')+
        exRow('Squeeze-everything plank','Clench everything as hard as possible the whole hold. The brick-builder.','3×20s')+
        exRow('Biceps: slow curls','Curl up normal speed, lower over a slow 3-count — the slow lowering is the arm-builder at 10kg.','3×10/arm')+
        exRow('Hammer curls','Same curl, thumb pointing up throughout. Thick-from-the-side muscle.','2×10/arm')+
        exRow('Reverse curls','Palms facing DOWN — builds the forearm near the elbow.','2×12')+
        exRow('Side raises','Strict, no swinging. The shoulder-widener, touch #1 of the week.','3×12')+
        exRow('ONE burst + 30-40 min walk + neck 5 min','Single burst on fasted Saturdays — the walk carries the rest of the burn.','~50 min'),
        stretchRow('Doorframe chest + dislocates + wrists + hip-flexor stretch','','8 min'),
        'SAT'
      )}

      <div class="section-title">REST · FAST BURN <span>+ THE FINISH</span></div>

      ${workoutCard('MONDAY — REST DAY','AUG 10 · GATE 2 MORNING · RECOVERY AFTER THE 63H DOUBLE',
        exRow('9AM: weigh FIRST, then break the double','GATE 2: scale must read ≤95.0 BEFORE any food or water beyond the wake glass. Then: powder in water + Osteocare, gentle.','weigh first')+
        exRow('Eat the full 900 template','Rest day still hits 100g protein — recovery IS the muscle-building step.','9AM-3PM')+
        exRow('Post-meal walk 10-15 min + vacuums + sneaky drips','The only movement asked of you today. The double bursts Tue-Fri bought this day back.','easy')+
        exRow('Early night','Recovery day. The week restarts hard tomorrow.','—'),
        stretchRow('Full body gentle + hip-flexor stretch','','12 min'),
        'MON'
      )}

      ${workoutCard('WEDNESDAY FAST BURN — AUG 5 · AUG 12 (~39H: TUE 6PM → THU 9AM)','CIRCUIT + TWO BURSTS + 60-MIN WALK · ALL CAPPED CLEAN',
        exRow('Light circuit ×3 @75%','Chest press ×12 · pulldown ×12 · goblet squat ×12 · DB row ×10/arm — smooth, 2 in the tank everywhere, zero grinding.','3 rounds')+
        exRow('Burst #1 (mid-day) + Burst #2 (evening)','Two 10-min bursts from the menu. Fasted cardio at this intensity is clean — it burns without eating muscle.','2×10 min')+
        exRow('Walk 60 min','Split it if you want (30+30). This is the chunky-burn backbone of the day.','60 min')+
        exRow('Vacuums + neck protocol','3×20-30s + 5 min.','10 min')+
        exRow('Salt ×3 + both K-tabs','Electrolytes are the whole game. Total deliberate burn today: ~550-700.','all day'),
        stretchRow('Gentle full-body flow','Nothing aggressive.','10 min'),
        'WED'
      )}

      ${workoutCard('SUNDAY FAST — AUG 9 (DAY 2, THE DEEP ONE)','WALK ONLY 60-75 MIN — LAW',
        exRow('Walk','60-75 min easy, split freely. At 48h+ fasted the fuel tank is empty — lifting here just eats muscle and risks injury. The long walk IS the burn: ~350-450 clean.','60-75 min')+
        exRow('Vacuums + neck protocol','3×20-30s + 5 min.','10 min')+
        exRow('Salt ×4 + both K-tabs','Deepest day — electrolytes are the whole game.','all day')+
        exRow('Tomorrow 9AM: GATE 2','Mon Aug 10 morning: weigh BEFORE breaking the fast. Must read ≤95.0. Missed → pick ONE lever (see RULES).','weigh first'),
        stretchRow('Full hip session','90/90 · frog · pigeon · cossack · deep squat + hip-flexor stretch','20 min'),
        'SUN'
      )}

      ${workoutCard('FRI AUG 14 — FLUSH','DAY BEFORE THE SCALE · SMOOTH ONLY · ~750 CAL',
        exRow('WHY SMOOTH','No new slow-lowering damage today — fresh muscle damage = inflammation = water on tomorrow’s scale. Session D is skipped this Friday on purpose.','READ FIRST')+
        exRow('Circuit ×3, everything smooth','Chest press ×15 · pulldown ×15 · goblet ×15 · leg extension ×20 · DB row ×10/arm — smooth tempo, nowhere near failure.','3 rounds')+
        exRow('Powder + rice cakes only · bed by 10','Tomorrow: wake → bathroom → scale → write it down → real breakfast → flight → creatine begins.','—'),
        stretchRow('Everything, nothing aggressive','','12 min'),
        'FRI'
      )}

      <div class="section-title">DAILY <span>CONSTANTS</span></div>
      ${workoutCard('EVERY DAY','THE NON-NEGOTIABLES',
        exRow('Stomach vacuums','3×20s → 3×30s, waking, empty stomach.','daily')+
        exRow('Post-meal walk','10-15 min — mandatory every day including Monday. Digestion + flatter evenings.','daily')+
        exRow('Neck protocol','Isometrics 4×30s + chin tucks ×15 + prone extension ×10. Doubled on D-days.','5 min')+
        exRow('Hip-flexor couch stretch','2×60s/side — the free centimeter off the gut. Daily.','2 min')+
        exRow('Sneaky drips','The invisible mini-exercise table lives in RULES. +100-200 cal/day.','all day')+
        exRow('Extra bursts beyond the plan','Any time you’re lit — every additional 10-min burst is +130 more. Your 3-hour rampage days only help.','optional'),
        '',
        'DAILY'
      )}

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">BURST MENU — PICK ANY, 10 MIN, ALL INDOOR/AC-FRIENDLY</div>
        <div class="rule-text">DB swings EMOM (15 swings each minute) · shadowboxing 3 rounds of 3 min · EMOM of 8 burpees + 8 squats + 10 mountain climbers · stair repeats · jump rope if you own one.</div>
        <div class="rule-sub">Low-skill violent cardio that can’t burn out muscles. Tue/Thu/Fri run DOUBLES (mid-day + post-session). Wed runs doubles fasted. Sat runs one.</div>
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
      <div class="section-title">TEMP CUT v3.2 <span>NUTRITION</span></div>
      <p class="section-note">900 cal in a 9AM–3PM window on eating days (Mon/Tue/Thu/Fri — yes, rest Monday still eats the full template). 100g protein is the daily floor. Set Settings ceiling to 900.</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#ff5566">${cal}</div><div class="macro-lbl">Day ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${warningHtml}

      ${(()=>{
        const _dt = getDayType(todayStr());
        if(_dt === 'fast') return '<div class="rule-card" style="border-left-color:var(--fast)"><div class="rule-num">FAST DAY ACTIVE</div><div class="rule-text">No food. Water, black coffee, green tea. Salt ×3-4 · K-tabs ×2 · 3.5-4L water · MCT gel on waking.</div><div class="rule-sub">This fast breaks at 9AM the morning after — first food is powder in water + Osteocare, gentle. Sundays: WALK ONLY, law. Gate mornings: weigh BEFORE breaking.</div></div>';
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
        <div class="rule-sub">Total ≈ 95-105g protein · ~880-930 cal. Lean protein swaps (chicken slices for a bar’s worth of protein) are fine — match the calories. Last bite 3PM SHARP. Maltitol is a bloat machine — the literal thing you are fighting.</div>
      </div>

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">LOW-RESIDUE FINISH — THU AUG 13 NIGHT → SAT AUG 15</div>
        <div class="rule-text">From Thu 13 evening: bars OUT (their fiber + sugar alcohols sit in the gut = scale weight). FLUSH Friday Aug 14: ~750 cal, powder + rice cakes ONLY. Carrots + pickles STOP.</div>
        <div class="rule-sub">Water stays HIGH through the final night. No water cutting, ever.</div>
      </div>

      <div class="section-title" style="margin-top:8px">YOUR <span>ENERGY NUMBERS</span></div>
      ${ruleCard('BMR ~2,030→1,930 · STANDARD TDEE ~2,430→2,310','Mifflin-St Jeor at 24M · 180cm, recalculated as you shrink, metabolism-slowdown included. Standard = what you burn by being alive.','v3.2 deliberate burn: session days ~1,200-1,400 (session + DOUBLE burst + walk) · Wed fast ~550-700 (circuit + 2 bursts + 60-min walk) · Sat fast ~700-900 (Session A @80% + burst + walk) · Sun ~350-450 (long walk) · Mon rest ~150 (post-meal walk + drips).','#82e0aa')}
      ${ruleCard('THE LEDGER — v3.2 (MON REST, EVERYONE ELSE WORKS OVERTIME)','Monday’s dropped session (~-1,000/wk) is bought back by: doubles on Tue/Thu/Fri (+~780/wk) + the Wed upgrade (+~250/wk) + Saturday A @80% vs the old light circuit (+~450/wk) = net POSITIVE vs v3.1.','From here the base path lands ~91.5-92.5 · clean execution of the doubles + both gates + the flush lands ~90.5-91.5 with 90.0 in reach. Rebound after +2-3kg = glycogen refilling, not fat — pre-accepted.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">SUPPLEMENT <span>CLOCK — D3+K2 IS OUT</span></div>
      ${ruleCard('FAST DAYS (WED 5 · SAT 8 · SUN 9 · WED 12)','Wake: MCT gel · zinc if Mon/Wed/Fri · K-tab mid-AM + mid-PM · salt ⅓ tsp ×3 (×4 Sundays) · magnesium at bed.','NO Osteocare — calcium needs food. Preworkout is your throttle; the STOP rule is extra-live during fasted training.','#82e0aa')}
      ${ruleCard('EATING DAYS (MON/TUE/THU/FRI)','9AM with first food: Osteocare ×2 + MCT gel + zinc (Mon/Wed/Fri) · omega-3 with the biggest feeding · electrolyte tab + 500ml water pre-session · magnesium at bed.','Magnesium every night, no exceptions — at 6h sleep it carries your recovery.','#82e0aa')}
      ${ruleCard('CREATINE — STARTS SAT AUG 15, IN INDIA','5g/day from weigh-in morning onward, with the rebuild phase.','Its ~1kg intramuscular water fights the 90.0 target and its benefits arrive after the window. Different molecule than your preworkout — this one is my call, that one is yours.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">THE GUT — <span>DEBLOAT STACK</span></div>
      ${ruleCard('FAT + GUT CONTENT','The net deficit kills the fat layer — slowly, systemically, no spot reduction. The fasts + 3PM cutoff empty the gut every single evening.','Visceral fat responds FASTEST to daily work — the waistband loosens before the mirror does.')}
      ${ruleCard('THE CORSET + THE ARMOR','Vacuums every morning (3×20→30s) build the corset that holds the gut IN. Pulldown crunches + dragon flags build ab thickness so the wall itself looks armored.','Density = tension. This is the poke-a-brick builder.')}
      ${ruleCard('THE TILT + THE WATER','Session C’s gut-tilt block untilts the pelvis — a tilted pelvis alone pushes the belly out 1-2cm at ANY body fat. Glute strength + hip-flexor length + dead-bug control is the fix, and it’s free.','Sodium consistency + 4L water kills the retention layer. Cortisol water dies with sleep discipline.')}`;
    },

    rulesContent(s) {
      return `
      <div class="section-title">RED <span>LINES</span></div>
      ${ruleCard('RULE 01','No water cutting. Ever.','4L+ daily through the final night. High water DECREASES retention. Dehydration + Dubai heat + stims is the ER cluster.')}
      ${ruleCard('RULE 02','STOP cluster: palpitations · chest tightness · vision narrowing','Salt water + 50g carbs IMMEDIATELY. Fast over if fasting. Zero shame, total obedience. Extra-live during the fasted Saturday session, deep in the weekend double, and with preworkout on board.')}
      ${ruleCard('RULE 03','Protein 100g daily. The untradeable floor.','At this depth it is the entire muscle-retention budget alongside the training. Miss calories if life happens — never miss protein.')}
      ${ruleCard('RULE 04','Fast-day caps are law.','Sun = walk only (48h+ deep). Sat = Session A @80%, NO finisher, 2 in the tank everywhere. Wed = circuit @75% + bursts, zero grinding. Fasted lifting near failure eats muscle — the caps are what make the chunky fast-day burn CLEAN.')}
      ${ruleCard('RULE 05','Double burst Tue/Thu/Fri is mandatory, not optional.','One mid-day, one post-session. The doubles are what bought Monday back — skip them and Monday wasn’t a rest day, it was a retreat.')}
      ${ruleCard('RULE 06','Last bite 3PM sharp · bed by target · 6h sleep floor.','Two wrecked nights in a row → next day auto-downgrades to walk + core. Unlogged meals get priced at the next gate — log everything, even the bad nights.')}

      <div class="section-title" style="margin-top:8px">THE TWO <span>GATES</span></div>
      ${ruleCard('GATE 1 — THU AUG 6, 9AM (END OF THE WED FAST)','Weigh BEFORE breaking the fast. Scale must read ≤98.2','The end-of-fast morning is your truest weight of the week. Missed → pick ONE lever below, today.','var(--accent2)')}
      ${ruleCard('GATE 2 — MON AUG 10, 9AM (END OF THE WEEKEND DOUBLE)','Weigh BEFORE breaking the fast. Scale must read ≤95.0','The last correction point — no overtime exists this round, the flight is the wall.','var(--accent2)')}
      ${ruleCard('THE LEVERS — PICK ONE AT THE GATE, NOT BEFORE','(a) +1 more burst on every remaining day — the simplest · (b) eating days drop to 800 (cut one bar) · (c) extend the Wed Aug 12 fast through Friday 9AM (skip Thu eating, C moves to Fri).','One lever, executed hot, beats three levers planned cold.','var(--accent2)')}

      <div class="section-title" style="margin-top:8px">🥷 THE SNEAKY <span>TABLE</span></div>
      ${ruleCard('THE DRIP RULES','These help and will NOT hurt the main plan — under two laws: (1) nothing to failure, ever — drips, not sets · (2) skip any sneaky move targeting the muscle TODAY’S session hammered.','Worth +100-200 cal/day plus bonus muscle stimulus. Invisible to everyone around you.')}
      ${ruleCard('LOWER BODY DRIPS','Calf raises at the kettle / elevator / queue / brushing teeth (~3 cal/min) · glute squeezes seated or standing — the gut-tilt fix on drip-feed · wall shin raises while waiting · under-desk leg-extension holds, 10s quad squeezes · slow full-depth squat to pick ANYTHING up.','Calf definition, tilt correction, quad tone — nobody notices, ever.')}
      ${ruleCard('CORE + UPPER DRIPS','Seated ab brace — exhale, brace like taking a punch, 10s ×10 · mini vacuums seated, 3×15s anytime · doorframe press — palms outward 10s, push the frame like it owes you money · water-bottle grip crush 10s ×10 on calls.','Brick abs, corset, chest/arm isometrics, forearms — all invisible.')}
      ${ruleCard('MOVEMENT DRIPS','Take literally every stair (~8 cal/floor) · pace during phone calls (~4 cal/min) · stand instead of sit one hour/day (+~50 cal) — TV, gaming, scrolling.','Free burst fragments all day long.')}

      <div class="section-title" style="margin-top:8px">WEIGH-IN <span>+ AFTER</span></div>
      ${ruleCard('SAT AUG 15 MORNING','Wake → bathroom → scale → write it down → real breakfast → flight → creatine 5g begins.','Clean execution of the doubles + both gates + the flush: ~90.5-91.5, and 90.0 in reach. Rebound +2-3kg in the days after = glycogen refilling, not fat. Pre-accepted.','#70c8ff')}
      ${ruleCard('AUG 15+ — THE BLOCK ENDS','TEMP CUT is a 13-day tool, not a lifestyle. Switch plans in India.','The rebuild: maintenance-ish calories, protein up, progressive overload, creatine saturating. Design it when the scale has spoken.','#70c8ff')}`;
    }
};
