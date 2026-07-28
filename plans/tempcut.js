// plans/tempcut.js — TEMP CUT: 10-day depletion protocol (Jul 29 → Aug 7 weigh-in).
// Owner-designed aggressive mini-cut. PSMF-style eating (no true fast days —
// every day is an eating day with a protein floor), daily two-session training
// at wave intensity (BIG/MOD/MED), machine work (lat pulldown, chest press,
// leg extension) + single 10kg dumbbell + bodyweight. Weigh-in protocol and
// post-cut event-mode maintenance live in the RULES tab.
// Temporary plan by design — expected to be switched away from after the block.

export const tempcut = {
    name: 'TEMP CUT',
    goalMode: 'cut',
    // Plan-default TDEE reflects the full protocol load (BMR ~2,030 + steps +
    // 1-2 daily sessions). Settings recompute per-user as always.
    tdee: 4000,
    fastDaysPerWeek: 0,
    badge: 'TEMP CUT',
    badgeClass: 'agro',
    descClass: 'agro-desc',
    subtitle: '10-day depletion. Train daily. Always sore, never broken.',
    bannerColor: '#ff5566',
    bannerBg: 'rgba(255,85,102,0.07)',
    bannerBorder: 'rgba(255,85,102,0.35)',
    fastDaysDow: [],
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    // [protein%, carbs%, fat%] — PSMF-leaning. At the 1,100 MOD ceiling:
    // 65% P = ~179g · 15% C = ~41g · 20% F = ~24g (matches the spec table).
    macroSplit: { base:[65,15,20], rest:[70,12,18], preFast:[65,15,20], stall:[68,14,18], satiety:[68,14,18] },
    // 1.8 g/kg floor — muscle insurance is the whole point of PSMF.
    proteinFloorMultiplier: 1.8,
    // 700 is the PSMF-day floor (150g protein). Below this = muscle loss
    // territory even with perfect protein. Warn, never block.
    caloriesMode: 'floor',
    minCalories: 700,
    // Every day is an eat day; multiplier reflects daily 1-2 sessions + 12-15k
    // steps. BMR ~2,030 × 1.95 ≈ 3,960 ≈ the protocol's modeled burn.
    activityByDayType: { eatDay: 1.95 },

    defaultTimes: { wakeTime:'05:30', lastMealTime:'18:00', eveningSessionTime:'17:00', eatingWindowStart:'11:00' },

    // DOW view of the 10-day arc (some DOWs carry two dates — cards in the
    // WORKOUTS tab are date-labelled): Sun=MED walk · Mon=BIG · Tue=MOD ·
    // Wed=BIG(29)/MED(5) · Thu=MOD(30)/FLUSH(6) · Fri=BIG(31)/WEIGH-IN(7) · Sat=MOD.
    weekIcons: {0:'🚶',1:'🔥',2:'💪',3:'🔥',4:'💪',5:'🔥',6:'💪'},

    morningSub: {
      0:'SUNDAY (Aug 2) — MED. Long walk 75-90 min. No circuit. Vacuums after the walk.',
      1:'MONDAY (Aug 3) — BIG. Depletion A + swing EMOM. Caffeine 250-300mg, 30-45 min before.',
      2:'TUESDAY (Aug 4) — MOD. No AM circuit — steps only. Low-residue eating starts at dinner.',
      3:'WEDNESDAY — BIG on Jul 29 (Depletion A + swing EMOM, caffeine before) · MED on Aug 5 (Depletion B, NO finisher).',
      4:'THURSDAY — MOD on Jul 30 (steps only) · FLUSH on Aug 6 (steps + vacuums only in the AM).',
      5:'FRIDAY — BIG on Jul 31 (Depletion B + snatch EMOM, caffeine before) · WEIGH-IN on Aug 7: wake → bathroom → scale → event.',
      6:'SATURDAY (Aug 1) — MOD. No AM circuit — steps only.'
    },
    eveningSub: {
      0:'SUNDAY — Hip session + vacuum/core circuit. No structured lifting.',
      1:'MONDAY — Pull + Legs Mix: pulldowns · rows · Nordic · Bulgarian · leg ext · lower-back block · carries.',
      2:'TUESDAY — Push Pump + DB Arms: chest press rest-pause · ladder · declines · arms block.',
      3:'WEDNESDAY — Push Pump on Jul 29 · steps + stretch only on Aug 5.',
      4:'THURSDAY — Pull + Posterior on Jul 30 · FULL-BODY FLUSH on Aug 6 (smooth tempo, no max eccentrics — inflammation is scale weight).',
      5:'FRIDAY — Legs + Core on Jul 31 · travel/event day on Aug 7 after weigh-in.',
      6:'SATURDAY — Push Pump + DB Arms.'
    },
    stretchSub: {
      0:'Full hip session: 90/90 · frog · pigeon (right +30s) · cossack · deep squat · neck isometrics · dislocates · thread the needle (20 min).',
      1:'Pigeon 90s each · figure-4 · hamstring · child’s pose · calf (12 min).',
      2:'Doorframe chest · dislocates · wrist extension · rear shoulder (10 min).',
      3:'Jul 29: chest + shoulder sequence · Aug 5: full-body gentle flow (10 min).',
      4:'Jul 30: full shoulder sequence + hip flexor lunge + neck isometrics · Aug 6: full stretch, in bed by 10.',
      5:'Jul 31: lower body flush — pigeon · hamstring · quad · calf (10 min).',
      6:'Chest + shoulder sequence + wrist prep (10 min).'
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake: 500ml water + ⅓ tsp salt + creatine 5g', sub:'Salt water first, creatine in the first shake. Every day — creatine timing doesn’t matter, consistency does.' },
      { id:'m2', group:'MORNING', label:'Stomach vacuums 3×15s → build to 3×30s', sub:'Exhale fully, navel to spine, hold, shallow breaths. The corset muscle. Daily, non-negotiable.' },
      { id:'m3', group:'MORNING', label:'Morning session (per today’s day-type)', sub:'BIG: Depletion circuit + EMOM · MED: circuit or walk · MOD: steps only — see WORKOUTS tab' },
      { id:'m4', group:'MORNING', label:'Log morning weight in TRACK tab', sub:'After waking + bathroom, before water. Morning weights only — night weights are food noise.' },
      { id:'f1', group:'EATING', label:'Protein target hit (150–180g by day-type)', sub:'BIG 150g · MOD 180g · MED 160g. Whey carries most of it. This is the muscle insurance.' },
      { id:'f2', group:'EATING', label:'Stayed at today’s ceiling (700/1,100/800)', sub:'BIG 700 · MOD 1,100 · MED/FLUSH 800–900. Log everything in FOOD LOG.', type:'info' },
      { id:'f3', group:'EATING', label:'Eating window 11:00–17:30, last food before 6PM', sub:'Protects sleep. Sleep is the anti-bloat drug.' },
      { id:'f4', group:'EATING', label:'4L+ water across the day', sub:'Never restricted — high water DECREASES retention. Sodium steady 2–3g.', type:'water', waterTarget:4.0 },
      { id:'f5', group:'EATING', label:'Zero liquid calories · caffeine ≤400mg, none after 3PM', sub:'Water, black coffee, green tea. The caffeine cap IS the endurance plan — tonight’s sleep is tomorrow’s session.' },
      { id:'e1', group:'EVENING', label:'Post-meal walk 10–15 min', sub:'Speeds gastric clearance = flatter evenings. Counts toward steps.' },
      { id:'e2', group:'EVENING', label:'Evening session (per today’s day-type)', sub:'Push Pump / Pull+Posterior / Legs+Core / Mix / Flush — see WORKOUTS tab. Stim-free (citrulline ok).' },
      { id:'e3', group:'EVENING', label:'Cooldown stretch + 12–15k steps closed out', sub:'Steps are ~600 free kcal/day at zero recovery cost. Stairs always.' },
      { id:'s1', group:'SUPPLEMENTS', label:'Morning supplements taken', sub:'Tap to expand',
        subItems: [
          { id:'s1_a', name:'Creatine', dose:'5g', when:'First shake of the day — with the m1 tick' },
          { id:'s1_b', name:'Osteocare', dose:'2 tabs', when:'11:00 with first meal' },
          { id:'s1_c', name:'D3+K2 + MCT gel', dose:'1 tab + 1 gel', when:'11:00 — MCT is the fat carrier' },
          { id:'s1_d', name:'Zinc 50mg', dose:'1 tab', when:'Mon/Wed/Fri only', days:[1,3,5] }
        ]
      },
      { id:'s2', group:'SUPPLEMENTS', label:'Omega-3 with main meal · electrolyte + citrulline pre-PM', sub:'Omega-3 ×3 daily (no fast days this block). Electrolyte tab + citrulline 6–8g ~45 min before the evening session.' },
      { id:'s3', group:'SUPPLEMENTS', label:'Magnesium before bed', sub:'1 serving. Lights out for a 7h floor on BIG days — sleep is part of the protocol.' },
      { id:'n2', group:'NIGHT', label:'Sleep before midnight · 7h floor on BIG days', sub:'Two broken nights in a row = tomorrow auto-downgrades to MED. That’s a rule, not a suggestion.' }
    ],
    // TEMP CUT has zero fast days (PSMF days are eating days). This list exists
    // only to satisfy the plan shape; it renders only if the user manually marks
    // a fast day on the calendar while this plan is active.
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water + pinch salt on waking', sub:'TEMP CUT has no scheduled fasts — if you marked one manually, hydrate first.' },
      { id:'wf2', group:'FAST', label:'3.5L+ water today', sub:'Sip constantly.', type:'water', waterTarget:3.5 },
      { id:'wf3', group:'FAST', label:'No food today', sub:'Water, black coffee, green tea only.' },
      { id:'wf4', group:'FAST', label:'Training at 70–80% only', sub:'Don’t stack a max session on zero calories.' },
      { id:'wf5', group:'FAST', label:'Magnesium before bed', sub:'Unchanged on any day type.' }
    ],

    foodGroupLabel: 'TEMP CUT EATING',
    foodGroupBg: 'rgba(255,85,102,0.1)',
    foodGroupColor: '#ff5566',

    workoutContent() {
      return `
      <div class="section-title">TEMP CUT <span>— THE 10-DAY ARC</span></div>
      <p class="section-note">Jul 29 → Aug 6 training · Fri Aug 7 = WEIGH-IN morning. Wave intensity: BIG → MOD → MED. Every day trains, nothing snaps. Cards below are date-labelled — Wed/Thu/Fri carry two dates each.</p>

      <div class="rule-card" style="border-left-color:#ff5566">
        <div class="rule-num">THE CALENDAR</div>
        <div class="rule-text">Wed 29 BIG · Thu 30 MOD · Fri 31 BIG · Sat 1 MOD · Sun 2 MED · Mon 3 BIG · Tue 4 MOD · Wed 5 MED · Thu 6 FLUSH · Fri 7 WEIGH-IN</div>
        <div class="rule-sub">BIG = AM depletion + PM session, 700 cal PSMF · MOD = PM session only, 1,100 cal · MED = light AM, 800–900 · FLUSH = smooth full-body, no new muscle damage before the scale.</div>
      </div>

      <div class="section-title">MORNING <span>DEPLETION</span> — BIG/MED DAYS · ~45 MIN</div>
      <p class="section-note">Empties muscle glycogen (quads + lats = the two biggest tanks — machines hit both). Caffeine 250–300mg, 30–45 min before, BIG days only.</p>

      ${workoutCard('DEPLETION A — JUL 29 + AUG 3','4 ROUNDS · 60s REST BETWEEN',
        exRow('Goblet squat (10kg DB)','Light is correct — depletion is rep volume, not load','×20')+
        exRowWithLevel('push','Push-ups','Full range, chest to floor','×15–20')+
        exRow('Single-arm DB row','3-1-2-0 tempo makes 10kg bite','×12/arm')+
        exRow('Lat pulldown (light)','Empties the lats — smooth reps','×15')+
        exRow('Reverse lunge','Knee hovers, don’t slam','×10/leg')+
        exRow('Mountain climbers','Controlled pace','×30')+
        exRow('FINISHER — DB swing EMOM 8 min','15 swings at the top of each minute, rest the remainder. Best cal/min tool you own.','8 min'),
        stretchRow('Chest opener + deep squat hold','60s each','2 min'),
        'WED,MON'
      )}

      ${workoutCard('DEPLETION B — JUL 31 + AUG 5','4 ROUNDS · 60s REST · AUG 5: NO FINISHER',
        exRow('DB thruster (single arm)','Switch arms halfway — squat + press in one','×12')+
        exRowWithLevel('squat','Bodyweight squat','Full depth, brisk pace','×25')+
        exRow('Leg extension (light)','High-rep quad depletion — smooth, 2s squeeze','×20')+
        exRow('Single-arm DB push press','Leg drive into lockout','×10/arm')+
        exRowWithLevel('hinge','Good morning (BW)','4s eccentric','×12')+
        exRow('Plank shoulder taps','Hips quiet','×20')+
        exRow('FINISHER — single-arm DB snatch EMOM 8 min','8/arm on alternating minutes. Explosive hips, flat back. SKIP on Aug 5.','8 min'),
        stretchRow('Hamstring + calf + wrist','45s each','3 min'),
        'FRI,WED'
      )}

      <div class="section-title">EVENING <span>SESSIONS</span> — 60–75 MIN · STIM-FREE</div>
      <p class="section-note">Hypertrophy pump: 12–20 rep ranges + slow eccentrics = maximum enjoyable soreness, minimum joint load. Citrulline 6–8g pre-session if available. Nothing caffeinated after 3PM — no exceptions.</p>

      ${workoutCard('PUSH PUMP — JUL 29 · AUG 1 · AUG 4','CHEST EMPHASIS · ~70 MIN',
        exRow('Seated chest press (machine)','3-1-2-0, full stretch, 1s squeeze. FINAL SET REST-PAUSE: failure → 15 breaths → failure → 15 breaths → failure','4×12–15')+
        exRowWithLevel('push','Push-up ladder','10 down to 1 — rest = setup time','1 ladder')+
        exRowWithLevel('push','Decline push-up','Feet on chair — upper chest pop','3×12')+
        exRowWithLevel('push','Archer push-up','Unilateral chest strength','3×6/side')+
        exRowWithLevel('shoulder','Pike push-up → wall handstand','3×10, then 3×20–30s hold','3+3')+
        exRow('Prone Y-T-W raises','The pull-partner — push:pull rule stands','3×10 each')+
        exRow('FINISHER — chest press drop-set ladder','3 drops, 12–15 reps each, zero rest between drops','1 ladder'),
        stretchRow('Doorframe chest + dislocates + wrist extension','Full sequence','8 min'),
        'WED,SAT,TUE'
      )}

      ${workoutCard('PULL + POSTERIOR — JUL 30','THE BUILT-BACK DAY · ~70 MIN',
        exRow('Lat pulldown — wide grip','MAIN LIFT. 3-1-2-0, elbows down, chest tall, ≤20° lean','4×10–12')+
        exRow('Lat pulldown — close/underhand','Lower lat + biceps. LAST SET DROP-SET: −30%, to failure again','3×12–15')+
        exRow('Single-arm DB row','Thickness partner to the pulldown’s width','3×12/arm')+
        exRow('Scapular pulldown','Straight arms — depress the blades only. Feeds your skill work.','2×12')+
        exRowWithLevel('pull','Superman hold + Y-T-W','3×30s + 3×10 each','2 blocks')+
        exRowWithLevel('hinge','Nordic hamstring curl','Slow as possible down','4×3–5')+
        exRow('Single-leg RDL (10kg DB)','Balance makes 10kg plenty','3×10/leg')+
        exRow('STEEL LOWER-BACK BLOCK','Good morning 4s ecc 3×12 · bird-dog 3×10/side · superman 2×45s','3 moves')+
        exRow('Side plank + hip dip','Lateral core','3×12/side'),
        stretchRow('Full shoulder sequence + hip flexor lunge + neck isometrics','','12 min'),
        'THU'
      )}

      ${workoutCard('LEGS + CORE — JUL 31','SHRED THE BUILT WHEELS · ~70 MIN',
        exRow('Leg extension (machine)','Moderate weight, 2s squeeze, slow lower. HIGH-REP ONLY — heavy extensions are knee-shear.','4×15–20')+
        exRowWithLevel('squat','Bulgarian split squat','Goblet the 10kg if 12 gets easy','4×12/leg')+
        exRow('Goblet squat (10kg)','Continuous tension','3×20')+
        exRowWithLevel('hinge','Glute bridge march + single-leg bridge','3×15 + 3×10/leg','2 moves')+
        exRow('Wall sit + calf raises','2×60s · 4×20 slow off a step','2 moves')+
        exRowWithLevel('core','Hollow hold → rocks → dragon flag negatives','2×30s → 3×10 → 3×3','3 moves')+
        exRow('SUITCASE CARRY (10kg)','The waist-corset move — stand tall, don’t lean','4×40 steps/side')+
        exRow('FINISHER — leg extension burnout','One light set to quad failure','30+ reps'),
        stretchRow('Pigeon + hamstring + quad + calf flush','','10 min'),
        'FRI'
      )}

      ${workoutCard('PULL + LEGS MIX — AUG 3','~75 MIN',
        exRow('Lat pulldown — wide','3-1-2-0','4×10–12')+
        exRow('Lat pulldown — close','Last set drop-set','3×12–15')+
        exRow('Single-arm DB row','','3×12/arm')+
        exRowWithLevel('hinge','Nordic curl','','4×3–5')+
        exRowWithLevel('squat','Bulgarian split squat','','4×12/leg')+
        exRow('Leg extension','High-rep','3×15–20')+
        exRow('Glute bridge march','','3×15')+
        exRow('STEEL LOWER-BACK BLOCK','Good morning 4s ecc · bird-dog · superman hold','3 moves')+
        exRow('Suitcase carry (10kg)','','3×40 steps/side'),
        stretchRow('Pigeon + figure-4 + hamstring + child’s pose','','12 min'),
        'MON'
      )}

      ${workoutCard('⭐ FULL-BODY FLUSH — AUG 6','DAY BEFORE THE SCALE · ~60 MIN · SMOOTH TEMPO ONLY',
        exRow('WHY SMOOTH','No new max-eccentric damage today — fresh muscle damage = inflammation = water on tomorrow’s scale. Sweat, don’t wreck.','READ FIRST')+
        exRow('Circuit ×4 · 45s rest','Chest press ×15 (smooth) · lat pulldown ×15 · goblet squat ×15 · leg extension ×15 · push-ups ×12 · DB row ×10/arm','4 rounds')+
        exRow('DB Arms mini-block','Curl 2×12/arm · overhead triceps 2×12/arm · lateral raise 2×12/arm','3 moves')+
        exRow('FINISHER','10 min brisk walk or easy swing intervals (10 swings/min × 10)','10 min')+
        exRow('Vacuums + full stretch · in bed by 10','Tomorrow: wake → bathroom → scale → event.','—'),
        stretchRow('Full-body gentle flow','Everything, nothing aggressive','10 min'),
        'THU'
      )}

      ${workoutCard('DB ARMS BLOCK — AUG 1 + AUG 4','+15 MIN AFTER PUSH PUMP',
        exRow('Single-arm curl → hammer curl','3×12/arm slow eccentric → 2×10/arm','2 moves')+
        exRow('Overhead single-arm triceps extension','Elbow tight to head','3×12/arm')+
        exRow('Lateral raise','10kg is legitimately heavy for laterals — strict, no swing','3×12/arm')+
        exRow('DB halo','Shoulder health + pump','2×10 each direction')+
        exRow('BURNOUT — curl 21s','7 bottom-half + 7 top-half + 7 full','21 reps'),
        '',
        'SAT,TUE'
      )}

      ${workoutCard('SUNDAY AUG 2 — MED','WALK + HIPS + CORE',
        exRow('Long walk','75–90 min, outdoors, steady','75–90 min')+
        exRow('Vacuum + dead bug + hollow circuit','×3 rounds after the walk','3 rounds'),
        stretchRow('Full hip session','90/90 · frog · pigeon (right +30s) · cossack · deep squat · neck isometrics · dislocates · thread the needle','20 min'),
        'SUN'
      )}

      <div class="section-title">DAILY <span>EXTRAS</span> — ~600 FREE KCAL</div>
      ${workoutCard('EVERY DAY — NON-NEGOTIABLES','NO RECOVERY COST',
        exRow('12–15k steps','~550 kcal/day at your mass. Stairs always. Pace during calls.','all day')+
        exRow('Post-meal walk','10–15 min — measurably speeds gastric clearance = flatter evenings','daily')+
        exRow('Stomach vacuums','3×15s building to 3×30s — morning, empty stomach','daily')+
        exRow('Neck protocol','Isometrics 4×30s + chin tucks ×15 + prone extension ×10','5 min')
      )}`;
    },

    nutritionContent(s) {
      const cal = s.calories || 1100;
      const macros = computeMacros(todayStr());
      const { proteinG, carbsG, fatG, warnings: macroWarnings } = macros;
      const warningHtml = macroWarnings.length ? macroWarnings.map(w =>
        `<div style="border-left:3px solid var(--accent2);padding:6px 10px;margin-bottom:6px;border-radius:4px;background:var(--surface);font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent2);line-height:1.6">${w}</div>`
      ).join('') : '';

      return `
      <div class="section-title">TEMP CUT <span>NUTRITION</span></div>
      <p class="section-note">PSMF-style. Protein is the whole game — the deficit does the rest. Set your Settings ceiling to 1,100 (the MOD number); BIG/MED targets below.</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#ff5566">${cal}</div><div class="macro-lbl">MOD ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${warningHtml}

      ${(()=>{
        const _dc = getDayCalories(todayStr());
        const _rem = cal - _dc.total;
        const _cls = !_dc.hasData ? 'var(--muted)' : _dc.total > cal ? 'var(--danger)' : (_rem <= 100 ? 'var(--accent2)' : 'var(--accent)');
        const _remTxt = !_dc.hasData ? 'No food logged yet — tap FOOD LOG on TODAY tab' : (_rem >= 0 ? _rem + ' cal remaining vs MOD ceiling' : Math.abs(_rem) + ' cal OVER the MOD ceiling');
        const _pctW = _dc.hasData ? Math.min(100, Math.round(_dc.total / cal * 100)) : 0;
        const _barColor = _dc.total > cal ? 'var(--danger)' : _dc.total > cal * 0.85 ? 'var(--accent2)' : 'var(--accent)';
        return '<div class="rule-card" style="border-left-color:'+_cls+'"><div class="rule-num">TODAY\'S INTAKE</div><div class="rule-text" style="font-size:0.85rem;color:'+_cls+'">'+(_dc.hasData ? _dc.total + ' / ' + cal + ' cal' : '0 / ' + cal + ' cal')+'</div><div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+_pctW+'%;background:'+_barColor+';border-radius:3px;transition:width 0.3s"></div></div><div class="rule-sub">'+_remTxt+'</div></div>';
      })()}

      <div class="rule-card" style="border-left-color:#ff5566">
        <div class="rule-num">MACROS BY DAY-TYPE</div>
        <div class="rule-text">BIG (PSMF): 700 cal · 150g P · ≤20g C · 15g F<br>MOD: 1,100 cal · 180g P · 50g C (pre-PM) · 25g F<br>MED/FLUSH: 800–900 cal · 160g P · ≤30g C · 20g F</div>
        <div class="rule-sub">BIG = 4–5 whey shakes + 300g Greek yogurt + unlimited greens · MOD = whey ×2–3 + 200g chicken or 2× tuna + banana/small rice pre-training + eggs · MED = whey-forward + one real protein meal.</div>
      </div>

      <div class="rule-card" style="border-left-color:var(--accent2)">
        <div class="rule-num">LOW-RESIDUE FINAL 60H — TUE 4 DINNER → FRI 7 WEIGH-IN</div>
        <div class="rule-text">ZERO vegetables, salad, fiber. Whey · eggs · chicken · small white rice only.</div>
        <div class="rule-sub">The cucumber-volume trick reverses here — 48h without bulk clears ~1kg of gut content by Friday. Sodium stays steady. Water stays HIGH — no water cutting, ever.</div>
      </div>

      <div class="section-title" style="margin-top:8px">CREATINE + <span>PREWORKOUT PROTOCOL</span></div>
      ${ruleCard('CREATINE — 5g DAILY, FOREVER','First shake of the day. Timing does not matter — saturation over ~3–4 weeks does.','Not a stimulant — you won’t feel a dose. Week 2–3: rep 13 shows up where rep 11 used to die. No loading (GI distress for speed you don’t need). It pulls ~1kg water INTO muscle — that’s the good water, already priced into your target.','#82e0aa')}
      ${ruleCard('CAFFEINE — 250–300mg PRE-AM, BIG DAYS ONLY','30–45 min before the morning session (peak blood level ~45–60 min). That’s 2.5–3mg/kg — the proven ergogenic zone.','HARD CAP 400mg/day · ZERO after 3PM. Past ~3mg/kg the performance curve flattens while jitters, heat intolerance and sleep damage climb. The cap IS the endurance plan. Don’t dry-scoop; split 200+100 if harsh on an empty stomach.','#82e0aa')}
      ${ruleCard('WHAT MAKES YOU LAST 2.5 HOURS','1) Caffeine pre-AM · 2) Carbs pre-PM on MOD days (banana or 3–4 dates, 30–45 min before) · 3) Electrolyte tab + 500ml water pre-PM · 4) Citrulline 6–8g pre-PM (stim-free pump) · 5) Sleep.','The thing that kills you mid-session is an empty tank, not lack of stims. On PSMF days the PM pump feels flatter — expected. Target 85% effort; rest-pause and drop-sets still work.','#82e0aa')}
      ${ruleCard('DAILY SUPPLEMENT CLOCK','Wake: salt water + creatine 5g · 11:00: Osteocare ×2 + D3/K2 + MCT + zinc (M/W/F) · Main meal: omega-3 ×3 · Pre-PM: electrolyte + citrulline · Sweat days: +½ tsp salt · Bed: magnesium.','Zinc stays Mon/Wed/Fri — 21.4mg/day avg, under the 40mg NIH limit. Collagen starts NEXT month: 10–15g hydrolyzed + vitamin C (skip 5g drinks — underdosed).','#82e0aa')}

      <div class="section-title" style="margin-top:8px">BELLY — <span>SIX LAYERS</span></div>
      ${ruleCard('1 · SUBCUTANEOUS FAT','Only the deficit touches it. No spot reduction exists — crunches don’t burn belly fat.','It’s the last place your body releases from. Genetics, not failure. The ~30,000 kcal deficit handles it on the multi-week clock.')}
      ${ruleCard('2 · VISCERAL FAT','Responds FASTEST to aerobic work + deficit — consistent meta-analytic finding.','Morning circuits + steps hit it directly. Waistband loosens before the mirror catches up.')}
      ${ruleCard('3 + 4 · GLYCOGEN + GUT CONTENT','~2kg emptied by depletion training · ~1kg cleared by the low-residue finish.','Both are torso mass. Both are gone by Friday.')}
      ${ruleCard('5 · CORTISOL WATER','Killed by the 400mg caffeine cap + the 7h sleep floor.','The 800mg days were storing water on your midsection. This is why the cap exists.')}
      ${ruleCard('6 · THE CORSET','Daily vacuums + suitcase carries + hollow work = transverse abdominis tone. Hip-flexor stretching fixes the pelvic tilt that pushes a belly out.','Stand tall — free centimeter.')}`;
    },

    rulesContent(s) {
      return `
      <div class="section-title">RED <span>LINES</span></div>
      ${ruleCard('RULE 01','Caffeine ≤400mg/day. ZERO after 3PM.','Non-negotiable. Tonight’s sleep is tomorrow’s session and this week’s waistline.')}
      ${ruleCard('RULE 02','No water cutting. Ever.','4L+ daily through the final night. High water DECREASES retention. Dehydration + heat + stims is the ER cluster.')}
      ${ruleCard('RULE 03','Muscle burn = green. Joint/wrist/spine pain = red.','Sharp pain: swap the exercise the same day. The streak survives by adapting, not by pushing through the wrong pain.')}
      ${ruleCard('RULE 04','Palpitations · chest tightness · vision narrowing = STOP.','Salt water + 50g carbs immediately. Then rest. This rule carries over from AGRO and it stays forever.')}
      ${ruleCard('RULE 05','Two broken nights of sleep in a row → next day auto-downgrades to MED.','Overreach is a tool. Overtraining is a hole. The wave structure only works with sleep.')}
      ${ruleCard('RULE 06','Protein target is untradeable.','150–180g by day-type. Miss calories if life happens — never miss protein. It’s the muscle insurance for the whole stunt.')}
      <div class="section-title" style="margin-top:8px">WEIGH-IN <span>PROTOCOL</span></div>
      ${ruleCard('FRIDAY AUG 7 MORNING','Wake → bathroom → scale → write it down → go to your event.','Morning weights only. Expected landing: 92.5–94.5 from a ~100 start. Fat ~3.9kg · glycogen ~2kg · gut ~1kg · cortisol water ~0.5–1kg · minus creatine’s +0.5–1kg.','var(--accent2)')}
      <div class="section-title" style="margin-top:8px">EVENT MODE <span>AUG 7–11</span></div>
      ${ruleCard('PRE-ACCEPTED: +2–3KG REBOUND BY AUG 9','Glycogen and water refilling. ZERO fat. Chest looks better, not worse.','Do not spiral. Weigh daily for data, not judgment.','#70c8ff')}
      ${ruleCard('DAILY 35-MIN ROOM CIRCUIT','Push-up ladder 10→1 · towel/doorframe rows 4×10 · chair Bulgarians 3×12/leg · pike push-ups 3×10 · hollow rocks + side plank · vacuums · finisher: 10-min burpee EMOM ×10.','If the hotel has a gym: DB bench / row / RDL / press — 4 lifts, 3×10, 25 min, done.','#70c8ff')}
      ${ruleCard('EVENT FOOD — THREE RULES ONLY','1) Protein first at every meal · 2) One plate, no seconds · 3) Zero liquid calories — open bar is the enemy.','Fast till noon (you’re adapted — it buys the evening). 12k+ steps — events are walking gold. Home Aug 12 at ~94–95 = held = WIN.','#70c8ff')}
      <div class="section-title" style="margin-top:8px">AFTER <span>THE BLOCK</span></div>
      ${ruleCard('AUG 12+','TEMP CUT ends. Switch plans.','This protocol is a 10-day tool, not a lifestyle. The juggernaut chest/back cannot be built at 700–1,100 cal — that’s a lean-recomp block: maintenance-ish calories, big protein, progressive overload, creatine saturated, collagen started. Design it when you’re back.','#70c8ff')}`;
    }
};
