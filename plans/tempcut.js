// plans/tempcut.js — TEMP CUT v2: 14-day depletion protocol (Jul 30 → Aug 14 weigh-in).
// Owner-designed aggressive mini-cut, v2 spec finalised in-session 2026-07-30.
// Opens with a 92-hour water fast (Thu Jul 30 1PM → Mon Aug 3 9AM, tracked via
// the app's fast-session system — Fri/Sat/Sun auto-mark as fast days via the
// 16h rule). Then 8 grind days: bar-based PSMF (~1,050 cal, 100g protein floor),
// one ~90-min session/day on an A/B/C/D rotation targeting the owner's focus
// list (all delt heads, back + lower back, hams WITHOUT Nordics via sliding leg
// curls, tibialis, forearms, calves both heads, high-tension "brick" abs,
// obliques, upper+lower chest, daily neck work). Low-residue finish, weigh-in
// Fri Aug 14, pre-agreed 48h OVERTIME extension if the scale reads 90.1-91.5.
// Creatine deliberately paused until Day 15. Temporary by design — switch away
// after the block.

export const tempcut = {
    name: 'TEMP CUT',
    goalMode: 'cut',
    // Grind-day total burn (BMR 2,030 × ~1.7 with one 90-min session + burst
    // + post-meal walk). Settings recompute per-user as always.
    tdee: 3500,
    fastDaysPerWeek: 0,
    badge: 'TEMP CUT',
    badgeClass: 'agro',
    descClass: 'agro-desc',
    subtitle: '14-day depletion. 92h fast opener. Train daily. 90.0 or overtime.',
    bannerColor: '#ff5566',
    bannerBg: 'rgba(255,85,102,0.07)',
    bannerBorder: 'rgba(255,85,102,0.35)',
    // No scheduled DOW fasts — the 92h opener is a manual fast session
    // (START FAST on TODAY). The 16h rule marks Fri/Sat/Sun automatically.
    fastDaysDow: [],
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    // [protein%, carbs%, fat%] — bar-based PSMF. At the 1,050 grind ceiling:
    // 40% P = ~105g · 25% C = ~66g nominal (real-world bars run lower net) ·
    // 35% F = ~41g (bars are fat-carried). Protein floor below is the real law.
    macroSplit: { base:[40,25,35], rest:[45,20,35], preFast:[40,25,35], stall:[42,23,35], satiety:[42,23,35] },
    // 1.0 g/kg — the owner's hard ceiling is 100g flat; floor = ceiling here.
    // Below optimal for deep-deficit retention (tax acknowledged in-session);
    // daily resistance work carries the muscle-retention load.
    proteinFloorMultiplier: 1.0,
    caloriesMode: 'floor',
    minCalories: 700,
    activityByDayType: { eatDay: 1.70, fastDay: 1.45 },

    defaultTimes: { wakeTime:'06:30', lastMealTime:'18:00', eveningSessionTime:'17:00', eatingWindowStart:'11:00' },

    // DOW view of the 14-day arc. Several DOWs carry 2-3 dates — WORKOUTS
    // cards are date-labelled: Thu = D0 fast-start (Jul 30) / D7 Session D
    // (Aug 6) / D14 FLUSH (Aug 13) · Fri = D1 FAST (Jul 31) / D8 Session A
    // (Aug 7) / WEIGH-IN (Aug 14) · Sat = D2 FAST / D9 Session B · Sun = D3
    // FAST walk-only / D10 gate · Mon = D4 refeed + A / D11 Session C ·
    // Tue = D5 B / D12 D + low-residue · Wed = D6 C / D13 depletion.
    weekIcons: {0:'🚶',1:'🔥',2:'💪',3:'🔥',4:'💪',5:'🔥',6:'💪'},

    morningSub: {
      0:'SUNDAY — Aug 2: FAST 72-92h, WALK ONLY (no resistance, final) · Aug 9: gate day — walk 60 min + hips. Vacuums both.',
      1:'MONDAY — Aug 3: REFEED 9AM (scripted — bar/tuna, wait 40 min, then small rice+tuna) · Aug 10: normal grind morning. Vacuums + weigh.',
      2:'TUESDAY — Vacuums + weigh + post-meal walk later. Aug 11: LOW-RESIDUE starts at dinner (bars out).',
      3:'WEDNESDAY — Aug 5: grind day · Aug 12: depletion day (low-residue). Vacuums + weigh.',
      4:'THURSDAY — Jul 30: fast began 1PM, easy walk PM · Aug 6: CHECKPOINT ≤96.8 · Aug 13: FLUSH day, bed by 10. Vacuums + weigh.',
      5:'FRIDAY — Jul 31: FAST ~24-44h, one machine session @70-80% · Aug 7: grind · Aug 14: WEIGH-IN (wake → bathroom → scale) then creatine starts.',
      6:'SATURDAY — Aug 1: FAST ~48-68h, light circuit + walk · Aug 8: grind. Vacuums + weigh.'
    },
    eveningSub: {
      0:'SUNDAY — Aug 2: nothing beyond the walk · Aug 9: CONTINGENCY GATE — scale >95.6 this morning fires a lever (see RULES).',
      1:'MONDAY — Aug 3: SESSION A (shoulders + chest), first fueled session · Aug 10: SESSION C (legs + brick abs). CHECKPOINT Aug 10: ≤95.2.',
      2:'TUESDAY — Aug 4: SESSION B (back + hams + lower back) · Aug 11: SESSION D (full pump + arms + neck ×2), then bars OUT at dinner.',
      3:'WEDNESDAY — Aug 5: SESSION C (legs + brick abs + obliques) · Aug 12: depletion circuit ×4, high-rep, smooth.',
      4:'THURSDAY — Jul 30: easy 20-30 min walk only · Aug 6: SESSION D (full pump + arms + neck ×2) · Aug 13: FLUSH — smooth circuit ×3, NO new eccentric damage.',
      5:'FRIDAY — Jul 31: machine pull @70-80% (~40 min) · Aug 7: SESSION A (shoulders + chest) · Aug 14: rest, real breakfast, block over.',
      6:'SATURDAY — Aug 1: light full-body ×3 smooth + 30-40 min walk · Aug 8: SESSION B (back + hams).'
    },
    stretchSub: {
      0:'Full hip session: 90/90 · frog · pigeon (right +30s) · cossack · deep squat · neck isometrics · dislocates · thread the needle (20 min).',
      1:'Pigeon 90s each · figure-4 · hamstring · child’s pose · calf (12 min).',
      2:'Doorframe chest · dislocates · wrist extension · rear shoulder (10 min).',
      3:'Full-body gentle flow after the session (10 min).',
      4:'Full shoulder sequence + hip flexor lunge + neck isometrics (12 min). Aug 13: everything, nothing aggressive.',
      5:'Lower body flush — pigeon · hamstring · quad · calf (10 min).',
      6:'Chest + shoulder sequence + wrist prep (10 min).'
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake: 500ml water + ⅓ tsp salt', sub:'Salt water first. Creatine is PAUSED until Aug 14 (day 15) — its water weight fights the target.' },
      { id:'m2', group:'MORNING', label:'Stomach vacuums 3×20s → build to 3×30s', sub:'Exhale fully, navel to spine, hold, shallow breaths. The corset muscle. Daily.' },
      { id:'m3', group:'MORNING', label:'Morning session / day-type task (see WORKOUTS)', sub:'Grind days: weigh + vacuums only in the AM — the one big session is in the evening.' },
      { id:'m4', group:'MORNING', label:'Log morning weight in TRACK tab', sub:'After waking + bathroom, before water. Judge checkpoints, not single days. Refeed bump Tue Aug 4 (+0.4-0.8) is pre-accepted.' },
      { id:'f1', group:'EATING', label:'Protein 100g hit — the daily floor, zero exceptions', sub:'4 low-carb bars (~80g) + tuna can / 5th bar / 150g yogurt. Bars: whey isolate first ingredient, <5g sugar alcohols — maltitol = bloat.' },
      { id:'f2', group:'EATING', label:'Stayed at today’s ceiling (~1,050 · finish days 750-800)', sub:'Log every bar in FOOD LOG — add "protein bar" to the library once, then it autocompletes.', type:'info' },
      { id:'f3', group:'EATING', label:'Eating window 11:00–17:30 · last food before 6PM', sub:'Bars spread across the window, not stacked. Protects sleep.' },
      { id:'f4', group:'EATING', label:'4L+ water across the day', sub:'Never restricted — high water DECREASES retention. Sodium steady 2-3g (pickles count).', type:'water', waterTarget:4.0 },
      { id:'f5', group:'EATING', label:'Zero liquid calories · carrots + pickles are the only extras', sub:'Water, black coffee, green tea. Preworkout is your throttle — STOP cluster is law (see RULES).' },
      { id:'e1', group:'EVENING', label:'Post-meal walk 10–15 min', sub:'The ONLY mandatory walk. Speeds gastric clearance = flatter evenings.' },
      { id:'e2', group:'EVENING', label:'Evening session done (A/B/C/D per date — see WORKOUTS)', sub:'~90 min incl. the 10-min conditioning burst. Non-skippable — it carries ALL the muscle retention at 100g protein.' },
      { id:'e3', group:'EVENING', label:'Cooldown stretch + neck protocol', sub:'Neck 5 min daily — doubled (AM+PM) on Session D days. Growth = frequency.' },
      { id:'s1', group:'SUPPLEMENTS', label:'Morning supplements taken (~11AM with first bar)', sub:'Tap to expand',
        subItems: [
          { id:'s1_a', name:'Osteocare', dose:'2 tabs', when:'With first bar — needs food' },
          { id:'s1_b', name:'D3+K2 + MCT gel', dose:'1 tab + 1 gel', when:'MCT is the fat carrier' },
          { id:'s1_c', name:'Zinc 50mg', dose:'1 tab', when:'Mon/Wed/Fri only', days:[1,3,5] }
        ]
      },
      { id:'s2', group:'SUPPLEMENTS', label:'Omega-3 with biggest feeding · electrolyte tab pre-session', sub:'Omega-3 ×3 daily. Electrolyte + 500ml water ~30 min before the evening session.' },
      { id:'s3', group:'SUPPLEMENTS', label:'Magnesium before bed', sub:'Every night. Most critical supplement on this protocol.' },
      { id:'n2', group:'NIGHT', label:'Sleep before midnight · 7h floor', sub:'Two wrecked nights in a row = next day auto-downgrades to walk + core. Cortisol water is scale weight.' }
    ],
    // First-class here: Fri Aug 1 / Sat Aug 2 / Sun Aug 3 auto-mark as fast
    // days via the 92h fast session + 16h rule. This IS the fast-phase checklist.
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water + ⅓ tsp salt on waking — then ×3 across the day (×4 Sunday)', sub:'Electrolytes are the whole game at 48h+. Pickle juice counts.' },
      { id:'wf2', group:'FAST', label:'K-tab mid-morning + K-tab mid-afternoon', sub:'99mg potassium each. Prevents palpitations and cramps during deep-fast work.' },
      { id:'wf3', group:'FAST', label:'No food. Water, black coffee, green tea only', sub:'The 92h ends Mon Aug 3, 9AM — scripted refeed: bar/tuna → wait 40 min → small rice + tuna. NOT the April shawarma.' },
      { id:'wf4', group:'FAST', label:'Training per fast-day spec — capped 70-80%', sub:'Fri: one machine pull session ~40 min · Sat: light circuit ×3 + walk · Sun 72h+: WALK ONLY, no resistance — final.' },
      { id:'wf5', group:'FAST', label:'3.5-4L water total today', sub:'Sip constantly.', type:'water', waterTarget:3.5 },
      { id:'wf6', group:'FAST', label:'Morning stack: D3+K2 + MCT gel · zinc if Mon/Wed/Fri', sub:'No Osteocare on fast days — calcium needs food.' },
      { id:'wf7', group:'FAST', label:'Vacuums + neck 5 min + magnesium at bed', sub:'The corset work continues through the fast.' },
      { id:'wf8', group:'FAST', label:'STOP check: no palpitations / chest tightness / vision narrowing', sub:'Any of these → salt water + 50g carbs immediately, fast over, zero shame. Doubly live with preworkout on board.' }
    ],

    foodGroupLabel: 'TEMP CUT EATING',
    foodGroupBg: 'rgba(255,85,102,0.1)',
    foodGroupColor: '#ff5566',

    workoutContent() {
      return `
      <div class="section-title">TEMP CUT v2 <span>— THE CLEAN 14</span></div>
      <p class="section-note">Jul 30 → Aug 13 · WEIGH-IN Fri Aug 14 morning. Opens with the 92h fast, then one ~90-min session/day on the A/B/C/D rotation. Cards are date-labelled — Thu/Fri/Sat/Sun/Mon/Tue/Wed each carry 2-3 dates.</p>

      <div class="rule-card" style="border-left-color:#ff5566">
        <div class="rule-num">THE CALENDAR</div>
        <div class="rule-text">Thu 30 fast begins 1PM · Fri 31 FAST+pull · Sat 1 FAST+light · Sun 2 FAST walk-only · Mon 3 REFEED 9AM + Session A · Tue 4 B · Wed 5 C · Thu 6 D ✓CP≤96.8 · Fri 7 A · Sat 8 B · Sun 9 gate · Mon 10 C ✓CP≤95.2 · Tue 11 D + low-residue · Wed 12 depletion · Thu 13 FLUSH · Fri 14 WEIGH-IN</div>
        <div class="rule-sub">Projected morning weights: Fri 31 ≈101 (official start) · Sun 2 ≈97.9-98.6 · Mon 3 ≈96.6-97.4 (the low) · Tue 4 bump +0.4-0.8 (refeed mass, pre-accepted) · then −0.35-0.45/day · Fri 14 ≈91.1-92.2 central, 90.3-91.0 with the gate lever + hot execution.</div>
      </div>

      <div class="section-title">PHASE 1 <span>— THE 92-HOUR FAST</span></div>

      ${workoutCard('FRI JUL 31 — FAST ~24-44H · MACHINE PULL @ 70-80%','~40 MIN · ONE SESSION ONLY',
        exRow('Lat pulldown — wide','Smooth, no grinding, 2 in reserve every set','3×10')+
        exRow('Lat pulldown — close/underhand','Same restraint','2×12')+
        exRow('Single-arm DB row','Controlled','2×12/arm')+
        exRow('Superman hold','Posterior chain signal','3×30s')+
        exRow('Bird-dog','Slow, balanced','3×10/side')+
        exRow('Evening: 15-min easy stroll','Nothing more today','15 min'),
        stretchRow('Light full-body','Nothing aggressive','8 min'),
        'FRI'
      )}

      ${workoutCard('SAT AUG 1 — FAST ~48-68H · LIGHT FULL-BODY','3 SMOOTH ROUNDS + WALK',
        exRow('Goblet squat (10kg)','Smooth, zero failure','×15')+
        exRow('Lat pulldown (light)','Smooth','×12')+
        exRow('Push-ups','Easy range','×10')+
        exRow('Suitcase carry (10kg)','Tall posture','40 steps/side')+
        exRow('Walk','30-40 min, easy pace','30-40 min'),
        stretchRow('Hips + shoulders gentle','','10 min'),
        'SAT'
      )}

      ${workoutCard('SUN AUG 2 — FAST 72-92H · WALK ONLY (FINAL)','NO RESISTANCE TODAY',
        exRow('Walk','40-60 min easy. Glycogen is gone, cortisol is peaked — light movement spares muscle better than grinding.','40-60 min')+
        exRow('Vacuums + neck protocol','3×20-30s + 5 min','10 min')+
        exRow('Salt ×4 today + both K-tabs','Deepest day — electrolytes are the whole game','all day'),
        stretchRow('Full hip session','90/90 · frog · pigeon · cossack · deep squat · thread the needle','20 min'),
        'SUN'
      )}

      <div class="section-title">PHASE 2 <span>— THE ROTATION</span> · ~90 MIN + 10-MIN BURST</div>
      <p class="section-note">Every session ends with a 10-min conditioning burst (your pick: rope / shadowbox / jump-squat-burpee-climber EMOM) + neck 5 min. Post-meal walk 10-15 min is the only mandatory walk of the day.</p>

      ${workoutCard('SESSION A — SHOULDERS (ALL 3 HEADS) + CHEST','MON AUG 3 · FRI AUG 7',
        exRow('Warmup: CARs + wrist prep','Full joint circles','8 min')+
        exRow('Seated chest press','3-1-2-0 tempo, full stretch, 1s squeeze. FINAL SET REST-PAUSE: failure → 15 breaths → failure → 15 breaths → failure','4×12–15')+
        exRow('Decline push-up (feet on chair)','Slow — UPPER chest','4×10–12')+
        exRow('Push-up AMRAP burnout','Sternal / lower chest','2 sets')+
        exRowWithLevel('shoulder','Pike push-up → wall handstand','Front delt + overhead base','3×8–10 → 3×20–30s')+
        exRow('Single-arm DB press','Front/side delt','3×10/arm')+
        exRow('DB lateral raise','STRICT, no swing — the side-delt definition head. 10kg is heavy for laterals.','4×12–15')+
        exRow('Prone Y-T-W + bent-over single-arm rear-delt fly','Rear delt pair','3×10 each + 3×12/arm')+
        exRow('FINISHER — chest press drop-set ladder + 10-min burst','3 drops, 12-15 reps each, zero rest → then the burst','~14 min')+
        exRow('Calves: single-leg raises slow + seated DB-on-knee','Gastroc + soleus','4×15 + 3×20'),
        stretchRow('Doorframe chest + dislocates + wrist extension','','8 min'),
        'MON,FRI'
      )}

      ${workoutCard('SESSION B — BACK + HAMS (NO NORDICS) + STEEL LOWER BACK','TUE AUG 4 · SAT AUG 8',
        exRow('Lat pulldown — wide','MAIN LIFT. 3-1-2-0, elbows down, chest tall','4×10–12')+
        exRow('Lat pulldown — close/underhand','LAST SET DROP-SET: −30%, to failure again','3×12–15')+
        exRow('Single-arm DB row','Thickness to the pulldown’s width','4×12/arm')+
        exRow('Scapular pulldown','Straight arms, depress the blades only','2×12')+
        exRow('SLIDING LEG CURL (towel/socks, smooth floor)','The Nordic replacement: bridge up, slide heels out 4s, drag back','4×8–12')+
        exRow('Single-leg RDL (10kg DB)','Hams + balance + lower back','3×10/leg')+
        exRowWithLevel('hinge','Good morning (BW)','4s eccentric','3×12')+
        exRow('STEEL BLOCK: superman hold + bird-dog','3×40s + 3×10/side','2 moves')+
        exRow('Suitcase carry (10kg)','Obliques + grip','4×40 steps/side')+
        exRow('FINISHER — 10-min burst','Your pick','10 min')+
        exRow('Tibialis wall raises + forearm block','Shins 3×20 · DB wrist curls 3×15 + reverse wrist curls 3×15 + towel-wrapped DB hold 3×30s','2 blocks'),
        stretchRow('Full shoulder sequence + hip flexor + neck isometrics','','12 min'),
        'TUE,SAT'
      )}

      ${workoutCard('SESSION C — LEGS + BRICK ABS + OBLIQUES','WED AUG 5 · MON AUG 10',
        exRow('Leg extension','2s squeeze, slow lower. HIGH-REP ONLY — heavy extensions are knee-shear.','4×15–20')+
        exRowWithLevel('squat','Bulgarian split squat','Goblet the 10kg if easy','4×12/leg')+
        exRow('Goblet squat (10kg)','Continuous tension','3×20')+
        exRow('Sliding leg curl','Hams ×2/week frequency','3×8–12')+
        exRow('Single-leg hip thrust (shoulders on sofa)','Glute/ham tie-in','3×12/leg')+
        exRow('Calves + tibialis','Straight-leg 4×15 slow + seated DB 3×20 + tibialis raises 4×20','3 blocks')+
        exRow('BRICK BLOCK','Dragon flag negatives 4×4 (5s down) · hollow hold 3×40s · DB-loaded crunch (10kg on chest) 3×15 · RKC plank (max total-body tension) 3×20s — density = tension, this is the poke-a-brick builder','4 moves')+
        exRow('OBLIQUES','Side plank + hip dip 3×12/side · Russian twist w/ DB 3×20 · DB side bend 2×15/side','3 moves')+
        exRow('FINISHER — leg-ext burnout + 10-min burst','One light set 30+ reps to quad failure → burst','~13 min'),
        stretchRow('Pigeon + figure-4 + hamstring + child’s pose','','12 min'),
        'WED,MON'
      )}

      ${workoutCard('SESSION D — FULL PUMP + ARMS/FOREARMS + NECK ×2','THU AUG 6 · TUE AUG 11',
        exRow('Circuit ×4 (45s rest)','Chest press ×15 · pulldown ×15 · goblet ×15 · leg ext ×15 · push-up ×12 · DB row ×10/arm','4 rounds')+
        exRow('ARMS','Single-arm curl 3×12 slow ecc → hammer 2×10 · overhead triceps 3×12/arm','3 moves')+
        exRow('FOREARMS','Reverse curl 3×12 (brachioradialis = the forearm pop) · wrist + reverse wrist curls 3×15 · towel wring 2×60s','3 moves')+
        exRow('DB lateral raise','Side-delt frequency bump','3×12')+
        exRow('Hollow rocks + vacuum ladder','3×12 + 15s/20s/30s','2 moves')+
        exRow('NECK PROTOCOL ×2 TODAY','Full 5-min protocol morning AND evening — growth = frequency','2×5 min')+
        exRow('FINISHER — swing EMOM','15 swings at the top of each minute','10 min'),
        stretchRow('Doorframe chest + rear shoulder + wrists','','8 min'),
        'THU,TUE'
      )}

      ${workoutCard('SUN AUG 9 — GATE DAY','WALK + HIPS + LIGHT CORE',
        exRow('Morning scale = THE GATE','>95.6 → fire a lever: (a) second fast Sun 6PM → Tue 8AM ~38h — strongest · (b) drop to 850 cal (cut the 5th protein source) · (c) second daily 10-min burst','decide today')+
        exRow('Walk','60 min easy','60 min')+
        exRow('Light obliques + vacuums','Side plank 2×10/side + vacuum ladder','10 min'),
        stretchRow('Full hip session','','20 min'),
        'SUN'
      )}

      <div class="section-title">PHASE 3 <span>— THE FINISH</span></div>

      ${workoutCard('WED AUG 12 — DEPLETION','LOW-RESIDUE DAY · HIGH-REP SMOOTH',
        exRow('Circuit ×4','Chest press ×15 · pulldown ×15 · goblet ×15 · leg ext ×20 · DB row ×10/arm — empties the last glycogen','4 rounds')+
        exRow('Post-meal walk + vacuums','','15 min'),
        stretchRow('Full-body gentle','','10 min'),
        'WED'
      )}

      ${workoutCard('THU AUG 13 — FLUSH','DAY BEFORE THE SCALE · SMOOTH ONLY',
        exRow('WHY SMOOTH','No new max-eccentric damage — fresh muscle damage = inflammation = water on tomorrow’s scale','READ FIRST')+
        exRow('Circuit ×3','Same depletion circuit, everything smooth tempo','3 rounds')+
        exRow('Vacuums + full stretch + bed by 10','Tomorrow: wake → bathroom → scale → real breakfast → creatine begins','—'),
        stretchRow('Everything, nothing aggressive','','12 min'),
        'THU'
      )}

      <div class="section-title">DAILY <span>CONSTANTS</span></div>
      ${workoutCard('EVERY DAY','THE NON-NEGOTIABLES',
        exRow('Stomach vacuums','3×20s → 3×30s, waking, empty stomach','daily')+
        exRow('Post-meal walk','10-15 min — the ONLY mandatory walk. Digestion + flatter evenings.','daily')+
        exRow('Neck protocol','Isometrics 4×30s + chin tucks ×15 + prone extension ×10. Doubled on D-days.','5 min')+
        exRow('Optional extra burst','Any day you’re lit — every 10-min burst is ~130 bonus kcal','optional')
      )}`;
    },

    nutritionContent(s) {
      const cal = s.calories || 1050;
      const macros = computeMacros(todayStr());
      const { proteinG, carbsG, fatG, warnings: macroWarnings } = macros;
      const warningHtml = macroWarnings.length ? macroWarnings.map(w =>
        `<div style="border-left:3px solid var(--accent2);padding:6px 10px;margin-bottom:6px;border-radius:4px;background:var(--surface);font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent2);line-height:1.6">${w}</div>`
      ).join('') : '';

      return `
      <div class="section-title">TEMP CUT v2 <span>NUTRITION</span></div>
      <p class="section-note">Bar-based PSMF. 100g protein is the daily floor and the whole muscle-retention vote. Set Settings ceiling to 1,050.</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#ff5566">${cal}</div><div class="macro-lbl">Grind ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${warningHtml}

      ${(()=>{
        const _dt = getDayType(todayStr());
        if(_dt === 'fast') return '<div class="rule-card" style="border-left-color:var(--fast)"><div class="rule-num">FAST PHASE ACTIVE</div><div class="rule-text">No food. Water, black coffee, green tea. Salt ×3-4 · K-tabs ×2 · 4L water.</div><div class="rule-sub">Ends Mon Aug 3, 9AM — scripted refeed: bar or tuna → WAIT 40 MIN → small white rice + tuna. Small. Slow. No fat bomb, no fiber bomb.</div></div>';
        const _dc = getDayCalories(todayStr());
        const _rem = cal - _dc.total;
        const _cls = !_dc.hasData ? 'var(--muted)' : _dc.total > cal ? 'var(--danger)' : (_rem <= 100 ? 'var(--accent2)' : 'var(--accent)');
        const _remTxt = !_dc.hasData ? 'No food logged yet — tap FOOD LOG on TODAY tab' : (_rem >= 0 ? _rem + ' cal remaining' : Math.abs(_rem) + ' cal OVER ceiling');
        const _pctW = _dc.hasData ? Math.min(100, Math.round(_dc.total / cal * 100)) : 0;
        const _barColor = _dc.total > cal ? 'var(--danger)' : _dc.total > cal * 0.85 ? 'var(--accent2)' : 'var(--accent)';
        return '<div class="rule-card" style="border-left-color:'+_cls+'"><div class="rule-num">TODAY\'S INTAKE</div><div class="rule-text" style="font-size:0.85rem;color:'+_cls+'">'+(_dc.hasData ? _dc.total + ' / ' + cal + ' cal' : '0 / ' + cal + ' cal')+'</div><div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+_pctW+'%;background:'+_barColor+';border-radius:3px;transition:width 0.3s"></div></div><div class="rule-sub">'+_remTxt+'</div></div>';
      })()}

      <div class="rule-card" style="border-left-color:#ff5566">
        <div class="rule-num">THE DAILY PLATE (~1,050 CAL · 100-105g PROTEIN)</div>
        <div class="rule-text">4 low-carb protein bars spread 11AM-5:30PM (~80g P, ~880 cal)<br>+ ONE of: tuna can (+25g P, 100 cal — cheapest, no bloat) · 5th bar (+20g, 210) · 150g Greek yogurt (+15g, 90)<br>+ 200g baby carrots + pickles freely (~80 cal)</div>
        <div class="rule-sub">BAR LABEL LAW: whey isolate first ingredient · under 5g sugar alcohols. Maltitol is a bloat machine — the literal thing you are fighting.</div>
      </div>

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">LOW-RESIDUE FINAL 60H — TUE AUG 11 DINNER → FRI 14</div>
        <div class="rule-text">BARS OUT (fiber + sugar alcohols sit in the gut = scale weight). Final 2 days: tuna + small white rice, or shakes if you can stomach 2 days of them. Carrots + pickles STOP.</div>
        <div class="rule-sub">Water stays HIGH through the final night. No water cutting, ever.</div>
      </div>

      <div class="section-title" style="margin-top:8px">YOUR <span>ENERGY NUMBERS</span></div>
      ${ruleCard('BMR 2,030 · EXISTING TDEE ~2,500','Mifflin-St Jeor at 24M · 180cm · ~102kg. Existing = what you burn by being alive with 1.5-3k ambient steps.','Plan-day totals: fast days ~2,850-3,000 · grind days ~3,350-3,600 (session +850-1,100) · finish ~2,950-3,100.','#82e0aa')}
      ${ruleCard('THE 14-DAY LEDGER','OUT ~48,000-51,000 · IN ~11,300-11,700 · NET ~37,000-39,500 ≈ 4.7-5.1kg fat','+ glycogen/water ~2.2 + gut ~1.2 + cortisol water ~0.5-1 → total drop 8.8-9.9. Landing 91.1-92.2 central · 90.3-91.0 with the gate lever + hot execution · OVERTIME exists if the 14th reads 90.1-91.5.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">SUPPLEMENT <span>CLOCK</span></div>
      ${ruleCard('FAST DAYS (JUL 30 - AUG 2)','Wake: D3+K2 + MCT gel · zinc Fri · K-tab mid-AM + mid-PM · salt ⅓ tsp ×3 (×4 Sunday) · magnesium bed.','NO Osteocare — calcium needs food. Preworkout: your throttle; the STOP rule is doubly live fasted.','#82e0aa')}
      ${ruleCard('EATING DAYS','~11AM with first bar: Osteocare ×2 + D3+K2 + MCT + zinc (Mon/Wed/Fri) · omega-3 ×3 with biggest feeding · electrolyte tab + 500ml water pre-session · magnesium bed.','Every night, no exceptions on the magnesium.','#82e0aa')}
      ${ruleCard('CREATINE — PAUSED UNTIL FRI AUG 14','Restarts day 15 at 5g/day with the rebuild phase.','Its ~1kg intramuscular water fights the 90.0 target and its benefits arrive after the window. Different molecule than your preworkout — this one is my call, that one is yours.','#82e0aa')}

      <div class="section-title" style="margin-top:8px">BELLY — <span>SIX LAYERS</span></div>
      ${ruleCard('1-2 · FAT','Subcutaneous: only the deficit touches it, no spot reduction, it goes last. Visceral: responds FASTEST to the daily work — waistband loosens before the mirror.','The ~38,000 kcal net handles both on their own clocks.')}
      ${ruleCard('3-4 · GLYCOGEN + GUT','~2.2kg emptied by the fast + depletion training · ~1.2kg cleared by the low-residue finish.','Both are torso mass. Both gone by the 14th.')}
      ${ruleCard('5-6 · WATER + CORSET','Cortisol water dies with sleep discipline. Vacuums + suitcase carries + RKC planks build the transverse abdominis that holds the gut IN.','Hip-flexor stretching fixes the pelvic tilt that pushes a belly out. Free centimeter.')}`;
    },

    rulesContent(s) {
      return `
      <div class="section-title">RED <span>LINES</span></div>
      ${ruleCard('RULE 01','No water cutting. Ever.','4L+ daily through the final night. High water DECREASES retention. Dehydration + heat + stims is the ER cluster.')}
      ${ruleCard('RULE 02','STOP cluster: palpitations · chest tightness · vision narrowing','Salt water + 50g carbs IMMEDIATELY. Fast over if fasting. Zero shame, total obedience. Doubly live during the 92h and with preworkout on board.')}
      ${ruleCard('RULE 03','Protein 100g daily. The untradeable floor.','At this depth it is the entire muscle-retention budget alongside the training. Miss calories if life happens — never miss protein.')}
      ${ruleCard('RULE 04','Muscle burn = green. Joint/wrist/spine pain = red.','Sharp pain: swap the exercise same day. Adapt, don’t push through the wrong pain.')}
      ${ruleCard('RULE 05','Sunday Aug 2 = walk only. Final.','72h+ fasted: glycogen gone, cortisol peaked, injury risk stupid. Light movement spares muscle better than grinding.')}
      ${ruleCard('RULE 06','Two wrecked nights of sleep in a row → next day downgrades to walk + core.','Your preworkout timing is the main thing that decides whether this rule ever fires. Your throttle, your rule-trigger.')}
      <div class="section-title" style="margin-top:8px">CHECKPOINTS <span>+ GATE</span></div>
      ${ruleCard('THU AUG 6','Morning scale ≤96.8','On track for the central path. Above it: tighten the plate, add the optional burst.','var(--accent2)')}
      ${ruleCard('SUN AUG 9 — THE GATE','Morning scale >95.6 → fire ONE lever','(a) Second fast Sun 6PM → Tue 8AM ~38h — the strongest lever · (b) drop to 850 cal (cut the 5th protein source, keep 4 bars) · (c) add a second 10-min burst daily. Pick on the day, not before.','var(--accent2)')}
      ${ruleCard('MON AUG 10','Morning scale ≤95.2','With the gate lever fired if needed, this stays reachable.','var(--accent2)')}
      <div class="section-title" style="margin-top:8px">WEIGH-IN <span>+ OVERTIME</span></div>
      ${ruleCard('FRI AUG 14 MORNING','Wake → bathroom → scale → write it down → real breakfast → creatine 5g begins.','Expected: 91.1-92.2 central · 90.3-91.0 with gate + hot execution. Weekend rebound +2-3kg = glycogen refilling, not fat. Pre-accepted.','#70c8ff')}
      ${ruleCard('OVERTIME — PRE-AGREED','If the 14th reads 90.1-91.5: extend 48h. Fri + Sat = 700-cal liquid days + depletion circuits · Sunday Aug 16 morning = final weigh-in.','The guaranteed-90 path if the 14th falls short. It exists so a near-miss never becomes a spiral.','#70c8ff')}
      <div class="section-title" style="margin-top:8px">AFTER <span>THE BLOCK</span></div>
      ${ruleCard('AUG 15+ (OR 17+)','TEMP CUT ends. Switch plans.','This is a 14-day tool, not a lifestyle. The rebuild phase: maintenance-ish calories, protein up, progressive overload, creatine saturating, collagen starting. Design it when the scale has spoken.','#70c8ff')}`;
    }
};
