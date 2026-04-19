export const agro = {
    name: 'AGRO CUT CALISTHENICS',
    goalMode: 'cut',
    tdee: 2600,
    fastDaysPerWeek: 3,
    badge: 'AGRO CUT CALISTHENICS',
    badgeClass: 'agro',
    descClass: 'agro-desc',
    subtitle: 'Cut. Build. No equipment. No quit.',
    bannerColor: '#ff8855',
    bannerBg: 'rgba(255,107,53,0.07)',
    bannerBorder: 'rgba(255,107,53,0.35)',
    fastDaysDow: [0, 3, 6], // Sun/Wed/Sat
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    macroSplit: { base:[50,30,20], rest:[58,22,20], preFast:[46,34,20], stall:[56,24,20], satiety:[58,22,20] },
    proteinFloorMultiplier: 1.3,

    defaultTimes: { wakeTime:'05:30', lastMealTime:'18:00', eveningSessionTime:'17:00', eatingWindowStart:'11:00' },

    weekIcons: {0:'🚶',1:'💪',2:'🦵',3:'🏃',4:'🤸',5:'🦵',6:'🏃'},

    morningSub: {
      0:'SUNDAY — Active rest. Walk 30 min + full hip session (20 min)',
      1:'MONDAY — Morning A: Push + Pull Superset · Hip CARs → Push-ups + Superman · Plank · Mountain climbers',
      2:'TUESDAY — Morning B: Lower + Hinge · Hip CARs → Squats · Good morning · Reverse lunge',
      3:'WEDNESDAY — Morning A: Push + Pull Superset · Hip CARs → Push-ups + Superman · Dead bug · Mountain climbers',
      4:'THURSDAY — Morning B: Lower + Hinge · Hip CARs → Squats · Good morning · Reverse lunge',
      5:'FRIDAY — Morning A: Push + Pull Superset · Hip CARs → Push-ups + Superman · Plank · Mountain climbers',
      6:'SATURDAY — Morning B: Lower + Hinge · Hip CARs → Squats · Good morning · Single-leg RDL'
    },
    eveningSub: {
      0:'SUNDAY — Rest. Walk + full hip session. No structured workout.',
      1:'MONDAY — Evening A: Push/Pull Balance · Push-up ladder + Inverted row · Decline + Y-T-W · Archer + Scapular · Pike · Planche lean · Handstand',
      2:'TUESDAY — Evening B: Legs + Posterior Chain · Nordic curl + Inverted row · Bulgarian · Single-leg RDL · Glute bridge march · Good morning · Side plank',
      3:'WEDNESDAY — Midweek Run · 5 min walk → 20 min run → 5 min walk → jump squats/burpees/mountain climbers',
      4:'THURSDAY — Evening C: Skill + Core + Pull Focus · Towel row · Scapular push-up · Crow/L-sit · Dead bug · Hollow rock · Dragon flag · Side plank',
      5:'FRIDAY — Evening B: Legs + Posterior Chain · Nordic curl + Inverted row · Bulgarian · Single-leg RDL · Glute bridge march · Good morning · Side plank',
      6:'SATURDAY — Run + Conditioning · 5 min walk → 30 min run → circuit: push-ups/jump squats/sprawls/plank × 3 rounds'
    },
    stretchSub: {
      0:'Sunday full hip session: 90/90 · frog · pigeon (extra right side) · cossack · deep squat · neck isometrics · shoulder dislocates · thread needle (20 min)',
      1:'Monday cooldown: Doorframe chest stretch · Shoulder dislocates · Wrist extension · Rear shoulder stretch (10 min)',
      2:'Tuesday cooldown: Pigeon 90s each (right +30s) · Figure-4 · Hamstring · Child\'s pose · Calf stretch (12 min)',
      3:'Wednesday post-run: Pigeon 60s/side · Hamstring · Calf stretch (8 min)',
      4:'Thursday cooldown: Full shoulder sequence · Thread needle · Hip flexor lunge · Neck isometrics (12 min)',
      5:'Friday cooldown: Pigeon 90s each (right +30s) · Figure-4 · Hamstring · Child\'s pose · Calf stretch (12 min)',
      6:'Saturday post-run: Lower body flush — pigeon · hamstring · quad · calf (10 min)'
    },

    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Wake & 500ml water immediately', sub:'Before phone. Non-negotiable.' },
      { id:'m2', group:'MORNING', label:'10 min daily mobility (CARs + neck)', sub:'Hip CARs \u00d7 5 \u00b7 Cat-cow \u00d7 10 \u00b7 Thoracic rotation \u00b7 Wrist CARs \u00b7 Neck nods' },
      { id:'m3', group:'MORNING', label:'Morning workout (20 min)', sub:'Morning A (Push+Pull) or B (Lower+Hinge) \u2014 see WORKOUTS tab' },
      { id:'m4', group:'MORNING', label:'Log morning weight in TRACK tab', sub:'Weigh first thing after waking, before food.' },
      { id:'f1', group:'EATING', label:'Protein in first meal (60-70g)', sub:'Eggs \u00b7 chicken \u00b7 tuna \u00b7 lentils \u00b7 Greek yogurt. Anchor protein first.' },
      { id:'f2', group:'EATING', label:'Stayed under calorie ceiling', sub:'Hard ceiling. Never more. Log in FOOD LOG.', type:'info' },
      { id:'f3', group:'EATING', label:'Last meal before 6PM', sub:'16+ hour overnight fast every day.' },
      { id:'f4', group:'EATING', label:'3L+ water across the day', sub:'500ml wake \u00b7 500ml pre-meal \u00b7 sip continuously', type:'water', waterTarget:3.0 },
      { id:'f5', group:'EATING', label:'No liquid calories', sub:'Water \u00b7 black coffee \u00b7 plain green tea only.' },
      { id:'e1', group:'EVENING', label:'Change clothes on arriving home', sub:'Trigger signal. Don\'t sit down first.' },
      { id:'e2', group:'EVENING', label:'Evening session (40-45 min)', sub:'Evening A/B/C or Run \u2014 see WORKOUTS tab' },
      { id:'e3', group:'EVENING', label:'Post-workout stretch protocol', sub:'Cooldown per day \u2014 see WORKOUTS tab' },
      { id:'s1', group:'SUPPLEMENTS', label:'Morning supplements taken', sub:'Tap to expand',
        subItems: [
          { id:'s1_a', name:'Osteocare', dose:'2 tabs', when:'With breakfast' },
          { id:'s1_b', name:'D3+K2', dose:'1 tab', when:'With MCT gel for absorption' },
          { id:'s1_c', name:'Zinc 50mg', dose:'1 tab', when:'Mon/Fri only', days:[1,5] },
          { id:'s1_d', name:'MCT gel', dose:'1 gel', when:'Fat carrier for D3' }
        ]
      },
      { id:'s2', group:'SUPPLEMENTS', label:'Omega-3 with largest meal', sub:'3 caps with lunch or dinner. 2,475mg EPA+DHA total.' },
      { id:'s3', group:'SUPPLEMENTS', label:'Magnesium before bed', sub:'1 serving (~67.6mg elemental). Every night, 7 days.' },
      { id:'n2', group:'NIGHT', label:'Sleep before midnight', sub:'Recovery is training. Don\'t skip it.' }
    ],
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water + pinch salt on waking', sub:'Prevents headaches. Do this before anything else.' },
      { id:'wf4', group:'FAST', label:'Black coffee or green tea only', sub:'Appetite suppression. Zero calories. Allowed.' },
      { id:'wf5', group:'FAST', label:'3.5L+ water total today', sub:'Sip constantly. Don\'t chug all at once.', type:'water', waterTarget:3.5 },
      { id:'wf6', group:'FAST', label:'No food consumed today', sub:'Fast is unbroken. If you break it \u2014 log it honestly.' },
      { id:'wf7', group:'FAST', label:'Fast day intensity: 70-80% only', sub:'Training fasted is fine. Don\'t push 100% on zero calories.' },
      { id:'sf1', group:'SUPPLEMENTS', label:'Morning supplements', sub:'Tap to expand',
        subItems: [
          { id:'sf1_a', name:'D3+K2', dose:'1 tab', when:'With MCT gel on waking' },
          { id:'sf1_b', name:'Zinc 50mg', dose:'1 tab', when:'Wed only', days:[3] },
          { id:'sf1_c', name:'MCT gel', dose:'1 gel', when:'Morning — fat carrier for D3' },
          { id:'sf1_d', name:'Electrolyte tablet', dose:'99mg potassium', when:'Mid-morning (9–10am)' }
        ]
      },
      { id:'wf2', group:'SUPPLEMENTS', label:'Pre-training supplements', sub:'Tap to expand',
        subItems: [
          { id:'wf2_a', name:'MCT gel', dose:'1 gel', when:'Pre-training (~20 min before)' },
          { id:'wf3', name:'Electrolyte tablet', dose:'99mg potassium', when:'Pre-training — prevents palpitations during fasted work' }
        ]
      },
      { id:'sf2', group:'SUPPLEMENTS', label:'Magnesium before bed', sub:'1 serving (~67.6mg elemental). Every night including fast days.' }
    ],

    foodGroupLabel: 'AGRO EATING',
    foodGroupBg: 'rgba(255,107,53,0.1)',
    foodGroupColor: '#ff8855',

    workoutContent() {
      return `
      <div class="section-title">MORNING <span>ACTIVATION</span> — 20 MIN</div>
      <p class="section-note">Every morning. Alternate A/B. Includes 10 min daily mobility.</p>

      ${workoutCard('MON \u00b7 MORNING A — PUSH + PULL SUPERSET','20 MIN',
        exRow('Hip CARs + Cat-cow + Wrist CARs','CARs = Controlled Articular Rotations. Slow, full-circle joint movements. Hip CARs: stand on one leg, draw largest circle with raised knee (5 each way per hip). Cat-cow: arch/round spine ×10. Wrist CARs: interlace fingers, slow circles ×10.','10 min')+
        exRow('Jumping jacks / high knees','Warm-up','2 min')+
        exRowWithLevel('push','Push-ups','Full range, chest to floor','3\u00d710\u201315')+
        exRowWithLevel('pull','Superman hold','Face down, lift arms + chest. Immediately after push-ups.','3\u00d720\u201330 sec')+
        exRowWithLevel('core','Plank OR Dead bug','Alternate between sessions','2\u00d730 sec')+
        exRow('Mountain climbers','Controlled pace','2\u00d720'),
        stretchRow('Chest opener','Doorframe or arms wide','60 sec')+
        stretchRow('Shoulder dislocates','Towel/stick, full arc','10 reps'),
        'MON'
      )}

      ${workoutCard('TUE \u00b7 MORNING B — LOWER + HINGE','20 MIN',
        exRow('Hip CARs + Cat-cow + Wrist CARs','CARs = Controlled Articular Rotations. Hip CARs: stand on one leg, draw largest circle with raised knee (5 each way per hip). Cat-cow: arch/round spine ×10. Wrist CARs: interlace fingers, slow circles ×10.','10 min')+
        exRow('High knees','Warm-up, 60% pace','2 min')+
        exRowWithLevel('squat','Bodyweight squat','Full depth','3\u00d715')+
        exRowWithLevel('hinge','Hip hinge / Good morning','Slow eccentric (4 sec down)','3\u00d712')+
        exRow('Reverse lunge','Step back, knee hovers floor','2\u00d710/leg'),
        stretchRow('Deep squat hold','Heels flat','60 sec')+
        stretchRow('Hip CARs extra','Right hip gets 2 extra circles','1 min'),
        'TUE'
      )}

      ${workoutCard('WED \u00b7 MORNING A — PUSH + PULL SUPERSET','20 MIN',
        exRow('Hip CARs + Cat-cow + Wrist CARs','CARs = Controlled Articular Rotations. Hip CARs: stand on one leg, draw largest circle with raised knee (5 each way per hip). Cat-cow: arch/round spine ×10. Wrist CARs: interlace fingers, slow circles ×10.','10 min')+
        exRow('Jumping jacks / high knees','Warm-up','2 min')+
        exRowWithLevel('push','Push-ups','Full range, chest to floor','3\u00d710\u201315')+
        exRowWithLevel('pull','Superman hold','Face down, lift arms + chest. Immediately after push-ups.','3\u00d720\u201330 sec')+
        exRowWithLevel('core','Plank OR Dead bug','Alternate between sessions','2\u00d730 sec')+
        exRow('Mountain climbers','Controlled pace','2\u00d720'),
        stretchRow('Chest opener','Doorframe or arms wide','60 sec')+
        stretchRow('Shoulder dislocates','Towel/stick, full arc','10 reps'),
        'WED'
      )}

      ${workoutCard('THU \u00b7 MORNING B — LOWER + HINGE','20 MIN',
        exRow('Hip CARs + Cat-cow + Wrist CARs','CARs = Controlled Articular Rotations. Hip CARs: stand on one leg, draw largest circle with raised knee (5 each way per hip). Cat-cow: arch/round spine ×10. Wrist CARs: interlace fingers, slow circles ×10.','10 min')+
        exRow('High knees','Warm-up, 60% pace','2 min')+
        exRowWithLevel('squat','Bodyweight squat','Full depth','3\u00d715')+
        exRowWithLevel('hinge','Hip hinge / Good morning','Slow eccentric (4 sec down)','3\u00d712')+
        exRow('Reverse lunge','Step back, knee hovers floor','2\u00d710/leg'),
        stretchRow('Deep squat hold','Heels flat','60 sec')+
        stretchRow('Hip CARs extra','Right hip gets 2 extra circles','1 min'),
        'THU'
      )}

      ${workoutCard('FRI \u00b7 MORNING A — PUSH + PULL SUPERSET','20 MIN',
        exRow('Hip CARs + Cat-cow + Wrist CARs','CARs = Controlled Articular Rotations. Hip CARs: stand on one leg, draw largest circle with raised knee (5 each way per hip). Cat-cow: arch/round spine ×10. Wrist CARs: interlace fingers, slow circles ×10.','10 min')+
        exRow('Jumping jacks / high knees','Warm-up','2 min')+
        exRowWithLevel('push','Push-ups','Full range, chest to floor','3\u00d710\u201315')+
        exRowWithLevel('pull','Superman hold','Face down, lift arms + chest. Immediately after push-ups.','3\u00d720\u201330 sec')+
        exRowWithLevel('core','Plank OR Dead bug','Alternate between sessions','2\u00d730 sec')+
        exRow('Mountain climbers','Controlled pace','2\u00d720'),
        stretchRow('Chest opener','Doorframe or arms wide','60 sec')+
        stretchRow('Shoulder dislocates','Towel/stick, full arc','10 reps'),
        'FRI'
      )}

      ${workoutCard('SAT \u00b7 MORNING B — LOWER + HINGE','20 MIN',
        exRow('Hip CARs + Cat-cow + Wrist CARs','CARs = Controlled Articular Rotations. Hip CARs: stand on one leg, draw largest circle with raised knee (5 each way per hip). Cat-cow: arch/round spine ×10. Wrist CARs: interlace fingers, slow circles ×10.','10 min')+
        exRow('High knees','Warm-up, 60% pace','2 min')+
        exRowWithLevel('squat','Bodyweight squat','Full depth','3\u00d715')+
        exRowWithLevel('hinge','Hip hinge / Good morning','Slow eccentric (4 sec down)','3\u00d712')+
        exRow('Reverse lunge','Step back, knee hovers floor','2\u00d710/leg'),
        stretchRow('Deep squat hold','Heels flat','60 sec')+
        stretchRow('Hip CARs extra','Right hip gets 2 extra circles','1 min'),
        'SAT'
      )}

      ${workoutCard('SUN \u00b7 ACTIVE REST','WALK 30 MIN + FULL HIP SESSION 20 MIN',
        exRow('Walk','Minimum 30 min outdoors. Not optional.','30 min'),
        stretchRow('90/90 hip stretch','2 min each side','4 min')+
        stretchRow('Frog stretch','Knees wide, push hips back','2 min')+
        stretchRow('Pigeon pose','90 sec each (right side +30 sec)','3+ min')+
        stretchRow('Cossack squat stretch','60 sec each side','2 min')+
        stretchRow('Deep squat hold','Full depth','2 min')+
        stretchRow('Neck isometrics','4 directions \u00d7 30 sec','2 min')+
        stretchRow('Shoulder dislocates','Towel/stick','10 slow reps')+
        stretchRow('Thread the needle','8/side, thoracic rotation','2 min'),
        'SUN'
      )}

      <div style="height:10px"></div>
      <div class="section-title">EVENING <span>SESSIONS</span> — 40\u201345 MIN</div>
      <p class="section-note">Mon=A \u00b7 Tue=B \u00b7 Wed=Run \u00b7 Thu=C \u00b7 Fri=B \u00b7 Sat=Run. Sun=rest.</p>

      ${workoutCard('EVENING A — UPPER BODY PUSH/PULL BALANCE','MON \u00b7 40\u201345 MIN',
        exRowWithLevel('push','Push-up ladder','10 down to 1. Rest = time for next set.','1 ladder')+
        exRowWithLevel('pull','Inverted row (under table)','Grip edge, pull chest to table. Immediately after ladder.','3\u00d78\u201310')+
        exRowWithLevel('push','Decline push-up','Feet on chair/bed \u2014 upper chest focus','4\u00d712')+
        exRow('Prone Y-T-W raises','Face down, 3 positions. Rear delt + mid-trap. After decline.','3\u00d710 each')+
        exRowWithLevel('pull','Scapular push-up','Protract/retract. Planche prereq.','3×12')+
        exRowWithLevel('push','Archer push-up','Unilateral chest strength','3×6/side')+
        exRow('Superman hold','Posterior chain endurance — pairs with archer','3×30 sec')+
        exRowWithLevel('shoulder','Pike push-up','Hips high, head toward floor','3×10')+
        exRowWithLevel('skill_handstand','Wall handstand hold','Every session — wrist + shoulder base','3×20–30 sec'),
        stretchRow('Doorframe chest stretch','Upper chest + anterior shoulder','60 sec')+
        stretchRow('Shoulder dislocates','Towel/stick \u2014 full arc','10 reps')+
        stretchRow('Wrist extension stretch','Fingers pointing back','60 sec')+
        stretchRow('Rear shoulder stretch','Arm across body','30 sec each'),
        'MON'
      )}

      ${workoutCard('EVENING B — LEGS + POSTERIOR CHAIN','TUE / FRI \u00b7 45 MIN',
        exRowWithLevel('hinge','Nordic hamstring curl','Feet under sofa/bed \u2014 hardest hamstring move','4\u00d73\u20135')+
        exRowWithLevel('pull','Inverted row (under table)','Superset immediately after Nordic','3\u00d78\u201310')+
        exRowWithLevel('squat','Bulgarian split squat','Rear foot elevated \u2014 quad + glute','4\u00d710/leg')+
        exRow('Single-leg RDL (BW)','Control the descent \u2014 lower back + hamstring','3\u00d710/leg')+
        exRow('Glute bridge march','Alternate legs in bridge \u2014 stability','3\u00d715')+
        exRowWithLevel('hinge','Good morning (BW)','Hip hinge, erector strengthening','3\u00d712')+
        exRow('Wall sit','90\u00b0 hold','2\u00d745 sec')+
        exRow('Side plank + hip dip','Lateral core \u2014 was missing from this session','3\u00d712/side')+
        exRowWithLevel('core','Hollow body hold','Lower back protection','2\u00d730 sec'),
        stretchRow('Pigeon pose','90 sec each (right side +30 sec)','3+ min')+
        stretchRow('Figure-4 stretch','Lying on back, ankle over knee','60 sec each')+
        stretchRow('Hamstring stretch','One leg extended reach','60 sec each')+
        stretchRow('Child\'s pose','Lower back release','60 sec')+
        stretchRow('Calf stretch','Wall lean','45 sec each'),
        'TUE,FRI'
      )}

      ${workoutCard('EVENING C — SKILL + CORE + PULL FOCUS','THU \u00b7 40 MIN',
        exRowWithLevel('pull','Towel row','Loop towel around door handle. Pull chest to door.','4\u00d78\u201310')+
        exRowWithLevel('pull','Scapular push-up','Protract/retract \u2014 planche prereq','3\u00d712')+
        exRowWithLevel('skill_crow','Crow/frog stand attempts','Multiple attempts \u2014 build the balance','5 min')+
        exRowWithLevel('skill_crow','Tuck hold (crow position)','Build balance','4\u00d715\u201320 sec')+
        exRowWithLevel('skill_lsit','L-sit tuck (floor)','Hands pressing, tuck knees','4\u00d715 sec')+
        exRowWithLevel('core','Dead bug','Deep core, back pressed to floor','3\u00d710/side')+
        exRowWithLevel('core','Hollow body rock','True core tension \u2014 rock gently','3\u00d710')+
        exRow('Dragon flag negative','Bed edge \u2014 lower slowly','3\u00d73')+
        exRow('Side plank + hip dip','Lateral core','2\u00d710/side')+
        exRow('Superman hold','Posterior chain endurance','3\u00d730 sec'),
        stretchRow('Full shoulder sequence','Thread needle \u00b7 rear shoulder \u00b7 chest open','8 min')+
        stretchRow('Hip flexor lunge stretch','60 sec each side','2 min')+
        stretchRow('Neck isometrics','4 directions \u00d7 30 sec','2 min'),
        'THU'
      )}

      ${workoutCard('WED — MIDWEEK RUN (FASTED)','35 MIN TOTAL',
        exRow('Walk warm-up','Easy pace','5 min')+
        exRow('Run','Conversational pace. Don\'t gasp.','20 min')+
        exRow('Walk cooldown','Easy pace','5 min')+
        exRow('Circuit','3 \u00d7 10 each: jump squats + burpees + mountain climbers','10 min'),
        stretchRow('Pigeon','60 sec/side','2 min')+
        stretchRow('Hamstring stretch','One leg extended','60 sec each')+
        stretchRow('Calf stretch','Wall lean','60 sec each'),
        'WED'
      )}

      ${workoutCard('SAT — RUN + CONDITIONING (FASTED)','40\u201345 MIN TOTAL',
        exRow('Walk warm-up','Easy pace','5 min')+
        exRow('Run','Conversational pace. Build weekly: +5 min every 2 weeks.','30 min')+
        exRow('Walk cooldown','Easy pace','5 min')+
        exRow('Conditioning circuit','3 rounds: 10 push-ups + 10 jump squats + 10 sprawls + 30 sec plank','15 min'),
        stretchRow('Lower body flush','Pigeon \u00b7 hamstring \u00b7 quad \u00b7 calf','10 min'),
        'SAT'
      )}

      <div style="height:8px"></div>
      <div class="section-title">NECK <span>STRENGTHENING</span></div>
      <p class="section-note">Add to any session. 5 min. Don\u2019t skip.</p>

      ${workoutCard('NECK PROTOCOL — DAILY 5 MIN','ADD TO ANY SESSION',
        exRow('Isometric resist \u2014 forward','Hand on forehead, resist with neck','30 sec')+
        exRow('Isometric resist \u2014 back','Hand on back of head, resist','30 sec')+
        exRow('Isometric resist \u2014 left','Hand on left temple, resist','30 sec')+
        exRow('Isometric resist \u2014 right','Hand on right temple, resist','30 sec')+
        exRow('Chin tuck (neck nod)','Tuck chin straight back \u2014 deep cervical flexors','15 reps')+
        exRow('Prone neck extension','Face down, lift chin slowly from floor','10 reps')
      )}`;
    },

    nutritionContent(s) {
      const cal = s.calories || 1500;
      const macros = computeMacros(todayStr());
      const { proteinG, carbsG, fatG, warnings: macroWarnings, signal } = macros;

      // Signal chip labels
      const signalLabels = { base:'BASE SPLIT', rest:'REST DAY SPLIT', 'pre-fast':'PRE-FAST SPLIT', stall:'STALL PROTOCOL', satiety:'SATIETY PROTOCOL', fast:'FAST DAY' };
      const signalColor = signal === 'base' ? 'var(--muted)' : 'var(--accent2)';
      const signalChip = `<div style="margin-top:8px;margin-bottom:8px"><span style="display:inline-block;font-family:'DM Mono',monospace;font-size:0.55rem;letter-spacing:1.5px;padding:4px 10px;border-radius:20px;border:1px solid ${signalColor};color:${signalColor};background:${signal === 'base' ? 'transparent' : 'rgba(245,166,35,0.08)'}">${signalLabels[signal] || 'BASE SPLIT'}</span></div>`;

      const warningHtml = macroWarnings.length ? macroWarnings.map(w =>
        `<div style="border-left:3px solid var(--accent2);padding:6px 10px;margin-bottom:6px;border-radius:4px;background:var(--surface);font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent2);line-height:1.6">${w}</div>`
      ).join('') : '';

      return `
      <div class="section-title">AGRO CUT <span>NUTRITION</span></div>
      <p class="section-note">Aggressive deficit. Muscle-sparing priority. 3 water fast days per week.</p>

      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val" style="color:#ff8855">${cal}</div><div class="macro-lbl">Cal ceiling</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats</div></div>
      </div>
      ${signalChip}
      ${warningHtml}

      ${(()=>{
        const _dt2 = getDayType(todayStr());
        if(_dt2 === 'fast') return '<div class="rule-card" style="border-left-color:var(--fast)"><div class="rule-num">TODAY IS A FAST DAY</div><div class="rule-text">No food intake. Water, black coffee, and green tea only.</div></div>';
        const _dc = getDayCalories(todayStr());
        const _dm = getDayMacros(todayStr());
        const _rem = cal - _dc.total;
        const _cls = !_dc.hasData ? 'var(--muted)' : _dc.total > cal ? 'var(--danger)' : (_rem <= 100 ? 'var(--accent2)' : 'var(--accent)');
        const _remTxt = !_dc.hasData ? 'No food logged yet — tap FOOD LOG on TODAY tab' : (_rem >= 0 ? _rem + ' cal remaining' : Math.abs(_rem) + ' cal OVER ceiling');
        const _pctW = _dc.hasData ? Math.min(100, Math.round(_dc.total / cal * 100)) : 0;
        const _barColor = _dc.total > cal ? 'var(--danger)' : _dc.total > cal * 0.85 ? 'var(--accent2)' : 'var(--accent)';
        let _macroHtml = '';
        if(_dc.hasData && _dm.hasMacroData) {
          const _mkP = (lbl,cur,tgt,c) => {const p=tgt>0?Math.min(100,Math.round(cur/tgt*100)):0;const ov=cur>tgt;return '<div style="margin-bottom:4px"><div style="display:flex;justify-content:space-between;font-family:DM Mono,monospace;font-size:0.55rem;margin-bottom:1px"><span style="color:'+(ov?'var(--danger)':'var(--muted)')+';letter-spacing:1px">'+lbl+'</span><span style="color:'+(ov?'var(--danger)':'var(--muted)')+'">'+cur+'g / '+tgt+'g</span></div><div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden"><div style="height:100%;width:'+p+'%;background:'+(ov?'var(--danger)':c)+';border-radius:2px"></div></div></div>';};
          _macroHtml = '<div style="margin-top:8px">'+_mkP('PROTEIN',_dm.protein,proteinG,'#ff9966')+_mkP('CARBS',_dm.carbs,carbsG,'var(--accent2)')+_mkP('FAT',_dm.fat,fatG,'#88ccff')+'</div>';
        }
        return '<div class="rule-card" style="border-left-color:'+_cls+'"><div class="rule-num">TODAY\'S INTAKE</div><div class="rule-text" style="font-size:0.85rem;color:'+_cls+'">'+(_dc.hasData ? _dc.total + ' / ' + cal + ' cal' : '0 / ' + cal + ' cal')+'</div><div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+_pctW+'%;background:'+_barColor+';border-radius:3px;transition:width 0.3s"></div></div><div class="rule-sub">'+_remTxt+'</div>'+_macroHtml+'</div>';
      })()}

      <div class="rule-card" style="border-left-color:#ff8855">
        <div class="rule-num">EATING WINDOW</div>
        <div class="rule-text">${getEatingWindow(s) || '11AM\u20135:30PM'}. Two meals only. Protein anchors every meal.</div>
        <div class="rule-sub">Meal 1 (~${Math.round(cal*0.55)}cal): Protein-heavy, 60-70g protein \u00b7 Meal 2 (~${Math.round(cal*0.45)}cal): Lighter, more vegetables</div>
      </div>

      ${(()=>{
        const _wk = getPlanTime(s,'wakeTime') || '05:30';
        const [_wh] = _wk.split(':').map(Number);
        const _midH = (_wh + 4) % 24;
        const _midRange = formatTime(String(_midH).padStart(2,'0')+':00') + '-' + formatTime(String((_midH+1)%24).padStart(2,'0')+':00');
        return `<div class="rule-card">
        <div class="rule-num">FAST DAY PROTOCOL \u2014 SUN/WED/SAT</div>
        <div class="rule-text">Wake: 500ml water + salt \u00b7 ${_midRange}: electrolyte tab #1 (99mg K) \u00b7 Pre-training: 2\u00d7 MCT gels (2,000mg) \u00b7 During/post: 500ml water \u00b7 Mid-afternoon: electrolyte tab #2 \u00b7 Throughout: 3.5L total water \u00b7 Before bed: Magnesium Complex</div>
        <div class="rule-sub" style="color:#cc4444">STOP IF: palpitations \u00b7 chest tightness \u00b7 vision narrowing. Salt water + 50-100g carbs immediately.</div>
      </div>`;
      })()}

      <div class="section-title" style="margin-top:8px">TODAY'S <span>SUPPLEMENTS</span></div>

      ${(()=>{
        const _ews = formatTime(getPlanTime(s,'eatingWindowStart') || '11:00');
        const _wk2 = getPlanTime(s,'wakeTime') || '05:30';
        const _wkFmt = formatTime(_wk2);
        const [_wh2] = _wk2.split(':').map(Number);
        const _midR2 = formatTime(String((_wh2+4)%24).padStart(2,'0')+':00');
        const _midEnd2 = formatTime(String((_wh2+5)%24).padStart(2,'0')+':00');
        const _evRaw = getPlanTime(s,'eveningSessionTime') || '17:00';
        const [_eh,_em] = _evRaw.split(':').map(Number);
        const _preMin = _em-20<0 ? _em+40 : _em-20;
        const _preH = ((_em-20<0 ? _eh-1 : _eh)+24)%24;
        const _preTime = formatTime(String(_preH).padStart(2,'0')+':'+String(_preMin).padStart(2,'0'));
        const _evFmt = formatTime(_evRaw);
        const _dow = new Date().getDay();
        const _dt = getDayType(todayStr());
        const _isFast = _dt === 'fast';
        const _zincEating = [1,5].includes(_dow);
        const _zincFast = [3].includes(_dow);
        const _isZincDay = _isFast ? _zincFast : _zincEating;
        const _dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const _nextZinc = (()=>{ const zd=[1,3,5]; const i=zd.findIndex(d=>d>_dow); return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i>=0?zd[i]:zd[0]]; })();

        let cards = '';
        // === MORNING STACK ===
        if(_isFast) {
          const pills = ['D3+K2 1 tab + MCT gel (fat carrier for D3 absorption)'];
          if(_isZincDay) pills.push('Zinc 50mg');
          cards += ruleCard('MORNING STACK \u2014 ' + _dayNames[_dow].toUpperCase() + ' (FAST DAY)',
            pills.join(' \u00b7 '),
            'Take at ' + _wkFmt + ' on waking. No Osteocare today \u2014 calcium needs food for full absorption. No omega-3 today \u2014 effects are chronic, one day off has zero impact.',
            '#82e0aa');
        } else {
          const pills = ['Osteocare 2 tabs (calcium + D3 + zinc base)', 'D3+K2 1 tab (4,000 IU + K2 for calcium routing)'];
          if(_isZincDay) pills.push('Zinc 50mg (alternate-day dose)');
          pills.push('MCT 1 gel (fat carrier for D3 absorption)');
          cards += ruleCard('MORNING STACK \u2014 ' + _dayNames[_dow].toUpperCase() + ' (EATING DAY)',
            pills.join(' \u00b7 '),
            'Take at ' + _ews + ' with breakfast. D3+K2 needs dietary fat for absorption \u2014 meal provides it.',
            '#82e0aa');
        }

        // === MCT PRE-TRAINING (fast days) ===
        if(_isFast) {
          cards += ruleCard('MCT GELS \u2014 PRE-TRAINING',
            '2\u00d7 MCT gels (~2,000mg total) before evening session.',
            'Take at ~' + _preTime + ' (20 min before ' + _evFmt + ' training). Provides small fat energy source for fasted work.',
            '#82e0aa');
        }

        // === ZINC STATUS ===
        if(_isZincDay) {
          cards += ruleCard('ZINC \u2014 TODAY IS A ZINC DAY',
            '50mg with morning stack at ' + (_isFast ? _wkFmt : _ews) + '. 3 days/week (Mon/Wed/Fri) = 21.4mg/day avg (under 40mg NIH limit).',
            'Daily dosing depletes copper \u2192 anemia risk. Alternate-day keeps you safe.',
            '#82e0aa');
        } else {
          cards += ruleCard('ZINC \u2014 NO ZINC TODAY',
            'Next zinc day: ' + _nextZinc + '. 3 days/week (Mon/Wed/Fri) = 21.4mg/day avg. Under 40mg NIH limit.',
            'Daily dosing depletes copper \u2192 anemia risk.',
            '#666');
        }

        // === OMEGA-3 ===
        if(!_isFast) {
          cards += ruleCard('OMEGA-3 FISH OIL \u2014 WITH LARGEST MEAL',
            '3 caps (1,485mg EPA + 990mg DHA = 2,475mg total).',
            'Take with your largest meal. Meets anti-inflammatory threshold (\u22652,400mg).',
            '#82e0aa');
        } else {
          cards += ruleCard('OMEGA-3 \u2014 SKIP TODAY',
            'No omega-3 on fast days. Effects are chronic not acute \u2014 missing one day has zero impact.',
            'Resume with next eating day meal.',
            '#666');
        }

        // === ELECTROLYTES (fast days only) ===
        if(_isFast) {
          cards += ruleCard('ELECTROLYTES \u2014 2 TABS TODAY',
            'Tab 1: mid-morning at ~' + _midR2 + ' (99mg potassium) \u00b7 Tab 2: pre-evening at ~' + _preTime + ' (99mg potassium).',
            'Prevents palpitations, cramps, and headaches during fasted sessions. Stop immediately if: palpitations, chest tightness, or vision narrows.',
            '#82e0aa');
        }

        // === MAGNESIUM (every night) ===
        cards += ruleCard('MAGNESIUM COMPLEX \u2014 TONIGHT',
          '1 serving (~67.6mg elemental Mg). Glycinate + Malate blend.',
          'Take before bed. Glycinate targets sleep/NMDA pathway. Malate supports Krebs cycle. Most critical supplement \u2014 runs out first.',
          '#82e0aa');

        return cards;
      })()}

      <div class="section-title" style="margin-top:8px;cursor:pointer" onclick="const el=document.getElementById('fullSupProto');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('span').textContent=el.style.display==='none'?'FULL SCHEDULE \u25b8':'FULL SCHEDULE \u25be'">SUPPLEMENT <span>FULL SCHEDULE \u25b8</span></div>
      <div id="fullSupProto" style="display:none">
      ${(()=>{
        const _ews2 = formatTime(getPlanTime(s,'eatingWindowStart') || '11:00');
        const _wkFmt2 = formatTime(getPlanTime(s,'wakeTime') || '05:30');
        const _wk3 = getPlanTime(s,'wakeTime') || '05:30';
        const [_wh3] = _wk3.split(':').map(Number);
        const _midR3 = formatTime(String((_wh3+4)%24).padStart(2,'0')+':00');
        const _evRaw3 = getPlanTime(s,'eveningSessionTime') || '17:00';
        const [_eh3,_em3] = _evRaw3.split(':').map(Number);
        const _preMin3 = _em3-20<0 ? _em3+40 : _em3-20;
        const _preH3 = ((_em3-20<0 ? _eh3-1 : _eh3)+24)%24;
        const _preTime3 = formatTime(String(_preH3).padStart(2,'0')+':'+String(_preMin3).padStart(2,'0'));
        return ruleCard('EATING DAY STACK','At ' + _ews2 + ' with breakfast: Osteocare 2 tabs \u00b7 D3+K2 1 tab \u00b7 MCT 1 gel \u00b7 Zinc 50mg (Mon/Fri only)','D3+K2 needs dietary fat for absorption \u2014 meal provides it.','#666')
        + ruleCard('FAST DAY STACK','At ' + _wkFmt2 + ' on waking: D3+K2 1 tab + MCT gel (fat carrier) \u00b7 Zinc (Wed only) \u00b7 2 MCT gels pre-training (~' + _preTime3 + ')','No Osteocare on fast days \u2014 calcium needs food for full absorption.','#666')
        + ruleCard('ZINC SCHEDULE','Mon \u00b7 Wed \u00b7 Fri. True alternate days, never consecutive. 150mg/week = 21.4mg/day avg (under 40mg NIH limit).','Each dose covers that day + next day. No gaps, no consecutive dosing.','#666')
        + ruleCard('OMEGA-3','3 caps with largest meal on eating days. 1,485mg EPA + 990mg DHA = 2,475mg.','Skip on fast days \u2014 effects are chronic not acute.','#666')
        + ruleCard('MAGNESIUM','1 serving before bed, all 7 days. ~67.6mg elemental Mg (Glycinate + Malate).','Glycinate targets sleep/NMDA. Malate supports Krebs cycle.','#666')
        + ruleCard('ELECTROLYTES','Fast days only (Sun/Wed/Sat): Tab 1 mid-morning (~' + _midR3 + ') \u00b7 Tab 2 pre-evening (~' + _preTime3 + '). 99mg potassium each.','Prevents fasted session palpitations, cramps, headaches.','#666');
      })()}
      </div>

      <div class="section-title" style="margin-top:8px;cursor:pointer" onclick="const el=document.getElementById('proteinSrcGrid');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.src-chev').textContent=el.style.display==='none'?'\u25b8':'\u25be'">HIGH PROTEIN <span>SOURCES <span class="src-chev" style="font-size:0.7rem">\u25b8</span></span></div>
      <div id="proteinSrcGrid" style="display:none">
      <div class="snack-grid">
        <div class="snack-item"><div class="snack-name">Chicken breast (150g)</div><div class="snack-cal">250 cal</div><div class="snack-note">46g protein \u00b7 King of protein density</div></div>
        <div class="snack-item"><div class="snack-name">Eggs (3 large)</div><div class="snack-cal">215 cal</div><div class="snack-note">18g protein \u00b7 Batch cook 12 at a time</div></div>
        <div class="snack-item"><div class="snack-name">Greek yogurt (200g)</div><div class="snack-cal">130 cal</div><div class="snack-note">20g protein \u00b7 Buy plain, not flavoured</div></div>
        <div class="snack-item"><div class="snack-name">Canned tuna (100g)</div><div class="snack-cal">100 cal</div><div class="snack-note">25g protein \u00b7 Best cal:protein ratio</div></div>
        <div class="snack-item"><div class="snack-name">Lentils/dal (200g cooked)</div><div class="snack-cal">230 cal</div><div class="snack-note">18g protein \u00b7 Plant protein + fibre</div></div>
        <div class="snack-item"><div class="snack-name">Cottage cheese (100g)</div><div class="snack-cal">100 cal</div><div class="snack-note">12g protein \u00b7 Casein \u2014 slow digestion</div></div>
        <div class="snack-item"><div class="snack-name">Turkey mince (100g)</div><div class="snack-cal">150 cal</div><div class="snack-note">30g protein \u00b7 Lean ground meat</div></div>
        <div class="snack-item"><div class="snack-name">Whey protein (1 scoop)</div><div class="snack-cal">120 cal</div><div class="snack-note">25g protein \u00b7 Only if food protein falls short</div></div>
      </div>
      </div>

      <div class="section-title" style="margin-top:8px;cursor:pointer" onclick="const el=document.getElementById('fatSrcGrid');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.src-chev').textContent=el.style.display==='none'?'\u25b8':'\u25be'">FAT <span>SOURCES (~25g FAT) <span class="src-chev" style="font-size:0.7rem">\u25b8</span></span></div>
      <div id="fatSrcGrid" style="display:none">
      <div class="snack-grid">
        <div class="snack-item"><div class="snack-name">Peanuts (55g)</div><div class="snack-cal">310 cal</div><div class="snack-note">25g fat \u00b7 14g protein \u00b7 Two handfuls</div></div>
        <div class="snack-item"><div class="snack-name">Almonds (45g)</div><div class="snack-cal">260 cal</div><div class="snack-note">22g fat \u00b7 10g protein \u00b7 1.5 handfuls</div></div>
        <div class="snack-item"><div class="snack-name">Peanut butter (3 tbsp)</div><div class="snack-cal">285 cal</div><div class="snack-note">24g fat \u00b7 10g protein \u00b7 Spoon from jar</div></div>
        <div class="snack-item"><div class="snack-name">Cheese/paneer (80g)</div><div class="snack-cal">280 cal</div><div class="snack-note">23g fat \u00b7 18g protein \u00b7 Slice or cube</div></div>
        <div class="snack-item"><div class="snack-name">Boiled eggs (4)</div><div class="snack-cal">280 cal</div><div class="snack-note">20g fat \u00b7 24g protein \u00b7 Batch cook, fridge</div></div>
        <div class="snack-item"><div class="snack-name">Coconut chunks (70g dried)</div><div class="snack-cal">230 cal</div><div class="snack-note">24g fat \u00b7 2g protein \u00b7 Snack bag</div></div>
        <div class="snack-item"><div class="snack-name">Mixed seeds (50g)</div><div class="snack-cal">290 cal</div><div class="snack-note">24g fat \u00b7 12g protein \u00b7 Zinc + magnesium</div></div>
        <div class="snack-item"><div class="snack-name">Cashews (45g)</div><div class="snack-cal">250 cal</div><div class="snack-note">20g fat \u00b7 8g protein \u00b7 Available everywhere</div></div>
        <div class="snack-item"><div class="snack-name">Avocado (1 medium)</div><div class="snack-cal">240 cal</div><div class="snack-note">22g fat \u00b7 3g protein \u00b7 Slice, salt, eat</div></div>
        <div class="snack-item"><div class="snack-name">Full-fat yogurt (250g)</div><div class="snack-cal">200 cal</div><div class="snack-note">22g fat \u00b7 10g protein \u00b7 Bowl from fridge</div></div>
        <div class="snack-item"><div class="snack-name">Macadamia nuts (35g)</div><div class="snack-cal">250 cal</div><div class="snack-note">26g fat \u00b7 3g protein \u00b7 Highest fat/gram nut</div></div>
        <div class="snack-item"><div class="snack-name">Olives (170g)</div><div class="snack-cal">250 cal</div><div class="snack-note">25g fat \u00b7 Jar in fridge, grab a handful</div></div>
        <div class="snack-item"><div class="snack-name">Trail mix (50g)</div><div class="snack-cal">260 cal</div><div class="snack-note">22g fat \u00b7 Nuts + dark choc chips \u00b7 Premade bags</div></div>
      </div>
      </div>

      <div class="section-title" style="margin-top:8px;cursor:pointer" onclick="const el=document.getElementById('carbSrcGrid');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.src-chev').textContent=el.style.display==='none'?'\u25b8':'\u25be'">CARB <span>SOURCES (\u226463g CARBS) <span class="src-chev" style="font-size:0.7rem">\u25b8</span></span></div>
      <div id="carbSrcGrid" style="display:none">
      <div class="snack-grid">
        <div class="snack-item"><div class="snack-name">Bananas (2 medium)</div><div class="snack-cal">210 cal</div><div class="snack-note">54g carbs \u00b7 Peel and eat</div></div>
        <div class="snack-item"><div class="snack-name">Dates (6 pieces)</div><div class="snack-cal">200 cal</div><div class="snack-note">50g carbs \u00b7 Instant energy, pocket-sized</div></div>
        <div class="snack-item"><div class="snack-name">Roti/chapati (3)</div><div class="snack-cal">360 cal</div><div class="snack-note">60g carbs \u00b7 Cold or warm, always available</div></div>
        <div class="snack-item"><div class="snack-name">Muri/puffed rice (70g)</div><div class="snack-cal">260 cal</div><div class="snack-note">58g carbs \u00b7 Dirt cheap everywhere</div></div>
        <div class="snack-item"><div class="snack-name">Apple + banana combo</div><div class="snack-cal">200 cal</div><div class="snack-note">52g carbs \u00b7 Two fruits, zero prep</div></div>
        <div class="snack-item"><div class="snack-name">Roasted chana (80g)</div><div class="snack-cal">290 cal</div><div class="snack-note">48g carbs \u00b7 14g protein bonus \u00b7 Crunchy</div></div>
        <div class="snack-item"><div class="snack-name">Sweet potato (200g boiled)</div><div class="snack-cal">180 cal</div><div class="snack-note">42g carbs \u00b7 Boil in batch, eat cold</div></div>
        <div class="snack-item"><div class="snack-name">Oats (70g dry + water)</div><div class="snack-cal">265 cal</div><div class="snack-note">47g carbs \u00b7 9g protein \u00b7 3 min microwave</div></div>
        <div class="snack-item"><div class="snack-name">Toast + honey (2 slices)</div><div class="snack-cal">240 cal</div><div class="snack-note">50g carbs \u00b7 2 minutes</div></div>
        <div class="snack-item"><div class="snack-name">Cornflakes + milk (50g)</div><div class="snack-cal">250 cal</div><div class="snack-note">48g carbs \u00b7 Pour and eat</div></div>
        <div class="snack-item"><div class="snack-name">Grapes (300g)</div><div class="snack-cal">210 cal</div><div class="snack-note">54g carbs \u00b7 Wash and eat</div></div>
        <div class="snack-item"><div class="snack-name">Granola bars (2)</div><div class="snack-cal">240 cal</div><div class="snack-note">42g carbs \u00b7 Wrapper off, done</div></div>
        <div class="snack-item"><div class="snack-name">Orange juice (500ml)</div><div class="snack-cal">220 cal</div><div class="snack-note">52g carbs \u00b7 Fresh, pour and drink</div></div>
        <div class="snack-item"><div class="snack-name">Crackers (10 pieces)</div><div class="snack-cal">200 cal</div><div class="snack-note">34g carbs \u00b7 Box in cupboard</div></div>
        <div class="snack-item"><div class="snack-name">Dried apricots (80g)</div><div class="snack-cal">215 cal</div><div class="snack-note">50g carbs \u00b7 Bag snack, no prep</div></div>
      </div>
      </div>

      <div class="section-title" style="margin-top:8px">CHEAP SNACKS</div>
      <div class="snack-grid">
        <div class="snack-item"><div class="snack-name">Cucumber</div><div class="snack-cal">15 cal/100g</div><div class="snack-note">Eat as much as you want</div></div>
        <div class="snack-item"><div class="snack-name">Cherry tomatoes</div><div class="snack-cal">18 cal/100g</div><div class="snack-note">Full bowl = ~50 cal</div></div>
        <div class="snack-item"><div class="snack-name">Boiled egg</div><div class="snack-cal">70 cal each</div><div class="snack-note">6g protein. Batch cook.</div></div>
        <div class="snack-item"><div class="snack-name">Roasted chickpeas</div><div class="snack-cal">120 cal/30g</div><div class="snack-note">Crunchy, filling</div></div>
        <div class="snack-item"><div class="snack-name">Watermelon</div><div class="snack-cal">30 cal/100g</div><div class="snack-note">Kills sweet cravings</div></div>
        <div class="snack-item"><div class="snack-name">Carrots</div><div class="snack-cal">40 cal/100g</div><div class="snack-note">Dense, feels real</div></div>
        <div class="snack-item"><div class="snack-name">Plain popcorn</div><div class="snack-cal">30 cal/cup</div><div class="snack-note">Air-popped, no butter</div></div>
        <div class="snack-item"><div class="snack-name">Pumpkin seeds</div><div class="snack-cal">85 cal/20g</div><div class="snack-note">Zinc + magnesium</div></div>
      </div>

      <div class="section-title">DRINKS</div>
      <div class="rule-card" style="border-left-color:var(--green)">
        <div class="rule-num">ALLOWED \u2014 ALWAYS</div>
        <div class="rule-text">Water \u00b7 Black coffee \u00b7 Plain green tea \u00b7 Sparkling water \u00b7 Salt water</div>
        <div class="rule-sub">Cold water marginally boosts metabolism. Black coffee before training increases fat oxidation. Green tea EGCG is studied and genuine.</div>
      </div>
      <div class="rule-card" style="border-left-color:var(--danger)">
        <div class="rule-num">NEVER</div>
        <div class="rule-text">Juice \u00b7 soda \u00b7 sweetened chai \u00b7 energy drinks \u00b7 milk with sugar \u00b7 flavoured water</div>
        <div class="rule-sub">All spike insulin, add hidden calories, or both. These break your deficit every time.</div>
      </div>

      <div class="section-title" style="margin-top:8px">MEAL SOURCES</div>
      <div class="rule-card">
        <div class="rule-num">PROTEIN \u2014 KEEP STOCKED</div>
        <div class="rule-text">Eggs \u00b7 canned tuna \u00b7 grilled chicken breast \u00b7 lentils/dal \u00b7 Greek yogurt \u00b7 boiled chickpeas</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">CARBS \u2014 TRAINING DAYS ONLY</div>
        <div class="rule-text">Oats \u00b7 white rice (small portion) \u00b7 sweet potato \u00b7 banana pre-workout</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">VEGETABLES \u2014 EAT FREELY</div>
        <div class="rule-text">Spinach \u00b7 cucumber \u00b7 tomato \u00b7 broccoli \u00b7 zucchini \u00b7 green beans</div>
        <div class="rule-sub">Fill your plate with these. Near-zero calories, huge volume. This is what makes ${cal} cal feel like more food than it is.</div>
      </div>
      <div class="rule-card" style="border-left-color:var(--danger)">
        <div class="rule-num">THE ONE THING THAT BREAKS YOUR DEFICIT</div>
        <div class="rule-text">Unplanned social eating</div>
        <div class="rule-sub">Fix: eat a protein snack 30 min before any social meal. You arrive not hungry. You eat less automatically. No willpower required.</div>
      </div>`;
    },

    rulesContent(s) {
      const cal = s.calories || 1500;
      return `
      <div class="section-title">EATING <span>RULES</span></div>
      ${ruleCard('RULE 01',cal+' cal/day. Never more.','Hard ceiling. Protein anchors every meal. Hit protein before filling anything else.')}
      ${ruleCard('RULE 02','Last meal before ' + (formatTime(getPlanTime(s,'lastMealTime')) || '6PM') + '. No exceptions.','Creates 16+ hour overnight fast. Lock it permanently.')}
      ${ruleCard('RULE 03','No liquid calories. Ever.','Water \u00b7 black coffee \u00b7 plain tea only.')}
      ${ruleCard('RULE 04','3 litres of water daily. Minimum.','500ml on wake. 250ml before each meal.')}
      ${ruleCard('RULE 05','High volume, low calorie foods fill the gap.','Cucumber, tomato, spinach, lentils. When social eating: take protein, skip bread/rice silently.')}
      <div class="section-title" style="margin-top:8px">TRAINING <span>RULES</span></div>
      ${ruleCard('RULE 06','Change clothes the moment you get home.','Sit down first = workout done.','var(--accent2)')}
      ${ruleCard('RULE 07','Daily mobility 10 min every morning. Non-negotiable.','Tight hips block L-sit. Tight shoulders block handstand.','var(--accent2)')}
      ${ruleCard('RULE 08','Push + Pull in every upper session.','Pull-dominant across the week. Every push exercise has a pull partner. Don\'t skip the pull work.','var(--accent2)')}
      ${ruleCard('RULE 09','Fast days: 70-80% intensity only.','Training fasted is fine. Don\'t push 100% on zero calories.','var(--accent2)')}
      ${ruleCard('RULE 10','Calisthenics skills require daily practice of foundations.','Crow, handstand, L-sit \u2014 progress is invisible for weeks then it clicks.','var(--accent2)')}
      <div class="section-title" style="margin-top:8px">DISCIPLINE <span>RULES</span></div>
      ${ruleCard('RULE 11','One miss = noise. Two = pattern. Three = decision.','At day two: lower the bar. 10 push-ups + stretch = keeping the streak.','#70c8ff')}
      ${ruleCard('RULE 12','Boredom = add progression, not novelty.','Every 2 weeks: +1 rep, -5 sec rest, or harder variation.','#70c8ff')}
      ${ruleCard('RULE 13','Friends not on a mission are not your benchmark.','They\'re comfortable. You have a reason they don\'t.','#70c8ff')}
      ${ruleCard('RULE 14','Travel changes nothing.','20 min on a floor. The body goes everywhere. The mission doesn\'t pause.','#70c8ff')}
      ${ruleCard('RULE 15','The fast days are 51% of the weekly deficit.','Miss them consistently and the timeline doubles.','#70c8ff')}`;
    }
};
