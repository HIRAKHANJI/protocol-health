export const bulk = {
  name: 'DEFAULT BULK',
  goalMode: 'bulk',
  tdee: 2400,
  fastDaysPerWeek: 0,
  lightDaysPerWeek: 2,
  badge: 'DEFAULT BULK',
  badgeClass: 'bulk',
  descClass: 'bulk-desc',
  subtitle: 'Build muscle. Controlled surplus. Zero equipment.',
  bannerColor: '#f7dc6f',
  bannerBg: 'rgba(247,220,111,0.07)',
  bannerBorder: 'rgba(247,220,111,0.35)',
  fastDaysDow: [],
  lightDaysDow: [0, 3],  // Sun/Wed — rest days = light eating days for gut recovery
  macroSplit: { base:[30,50,20], rest:[35,45,20], preFast:[30,50,20], stall:[35,45,20], satiety:[35,45,20] },
  proteinFloorMultiplier: 1.6, // Iraki et al. 2019 (PMC6680710): 1.6–2.2g/kg for muscle growth
  // Phase 3 (v7.2.2): plan-direction-aware calorie safety bounds.
  // 'above-tdee' mode → warn if calorie ceiling falls at or below TDEE
  // (would mean an accidental cut on a bulk plan). minCalories computed
  // dynamically by validateCaloriesAgainstPlan as TDEE itself.
  caloriesMode: 'above-tdee',
  minCalories: null,

  defaultTimes: { wakeTime:'07:00', lastMealTime:'20:00', eveningSessionTime:'18:00', eatingWindowStart:null },

  weekIcons: {0:'\uD83D\uDEB6',1:'\uD83D\uDCAA',2:'\uD83D\uDCAA',3:'\uD83D\uDEB6',4:'\uD83E\uDDB5',5:'\uD83D\uDCAA',6:'\uD83E\uDD38'},

  morningSub: {
    0:'SUNDAY \u2014 Full rest. Eat at maintenance. Sleep and recover.',
    1:'MONDAY \u2014 Push Volume. Push-ups (tempo 3-1-2-0), decline push-ups, pike press, diamond push-ups, dips. 40\u201350 min.',
    2:'TUESDAY \u2014 Pull + Posterior Chain. Inverted rows (tempo), towel rows, Y-T-W raises, bridges, good mornings. 40\u201350 min.',
    3:'WEDNESDAY \u2014 Animal Flow Mobility + Light Walk. Wrist prep, beast hold, crab reach, ape, step-throughs. 30\u201335 min.',
    4:'THURSDAY \u2014 Lower Body Volume. Squats, Bulgarian split squats, Nordic curls, single-leg bridges, wall sit. 40\u201350 min.',
    5:'FRIDAY \u2014 Push/Pull Intensity. Push-up ladder, inverted rows, archer push-ups, Y-T-W, pike press. 40\u201350 min.',
    6:'SATURDAY \u2014 Full Body + Pilates Core. Compound resistance 30 min + mat Pilates core 15 min.'
  },
  eveningSub: {
    0:'SUNDAY \u2014 Rest day. No training.',
    1:'MONDAY \u2014 Cooldown: chest, shoulder, wrist stretch. 5 min.',
    2:'TUESDAY \u2014 Cooldown: rear shoulder + hamstring stretch. 5 min.',
    3:'WEDNESDAY \u2014 Animal Flow session IS the movement. Walk beforehand.',
    4:'THURSDAY \u2014 Cooldown: pigeon, hamstring, calf. 5 min.',
    5:'FRIDAY \u2014 Cooldown: chest + shoulder stretch. 5 min.',
    6:'SATURDAY \u2014 Full body stretch after Pilates. 5\u201310 min.'
  },
  stretchSub: {
    0:'Rest day. Gentle mobility if desired.',
    1:'Chest doorframe stretch, behind-back clasp, wrist flexor stretch.',
    2:'Rear delt cross-body, seated hamstring, cat-cow.',
    3:'Animal Flow includes mobility. Wrist mobilizations built in.',
    4:'Pigeon pose 45 sec/side, calf stretch wall lean, deep squat hold.',
    5:'Chest opener, shoulder cross-body, tricep overhead.',
    6:'Pilates cooldown: lying spinal twist, full body stretch sequence.'
  },

  checklistNormal: [
    { id:'m1', group:'MORNING', label:'500ml water on waking', sub:'Hydrate first.' },
    { id:'m2', group:'MORNING', label:'Morning training session', sub:'See WORKOUTS tab. Tempo training on all primary exercises (3-1-2-0).' },
    { id:'m3', group:'MORNING', label:'Protein-rich breakfast', sub:'30\u201340g protein. Eggs, oats with nuts, or Greek yogurt bowl.' },
    { id:'m4', group:'MORNING', label:'Log morning weight (weekly)', sub:'Weekly average matters, not daily fluctuations.' },
    { id:'f1', group:'EATING', label:'Hit calorie ceiling (surplus)', sub:'You MUST eat enough. Under-eating wastes the training stimulus.' },
    { id:'f2', group:'EATING', label:'Hit protein target', sub:'1.6\u20132.2g/kg across 3\u20134 meals. 0.40\u20130.55g/kg per meal.', type:'info' },
    { id:'f3', group:'EATING', label:'Carbs around training', sub:'Pre-training meal 1\u20132 hrs before. Post-training protein within 60 min.' },
    { id:'f4', group:'EATING', label:'2.5\u20133L water today', sub:'More on training days. Sip throughout.', type:'water', waterTarget:2.5 },
    { id:'f5', group:'EATING', label:'Ate 3\u20134 structured meals', sub:'Distribute protein evenly. Do not backload everything at dinner.' },
    { id:'e1', group:'EVENING', label:'Post-training stretch or mobility', sub:'5 min minimum. Cooldown from WORKOUTS tab.' },
    { id:'e2', group:'EVENING', label:'Light walk on rest days', sub:'20\u201330 min. Recovery, not calorie burn.' },
    { id:'s1', group:'SUPPLEMENTS', label:'Daily supplements taken', sub:'Tap to expand \u2014 see NUTRITION tab for details',
      subItems: [
        { id:'s1_a', name:'Creatine', dose:'5g', when:'Any time \u2014 consistency matters' },
        { id:'s1_b', name:'Vitamin D3', dose:'2,000\u20134,000 IU', when:'With food' },
        { id:'s1_c', name:'Omega-3', dose:'2,000mg EPA+DHA', when:'With largest meal' },
        { id:'s1_d', name:'Magnesium', dose:'200\u2013350mg', when:'Before bed' }
      ]
    },
    { id:'n1', group:'NIGHT', label:'Sleep 7\u20139 hours', sub:'Growth hormone peaks during deep sleep. Non-negotiable for muscle growth.' },
    { id:'n2', group:'NIGHT', label:'Monthly body comp check', sub:'Weigh weekly. Waist + photos monthly. Adjust if gaining >0.5% BW/week.' }
  ],
  checklistFast: [
    { id:'wf1', group:'FAST', label:'500ml water on waking', sub:'Hydrate.' },
    { id:'wf2', group:'FAST', label:'Stay hydrated \u2014 2.5L+ water', sub:'Herbal tea allowed.', type:'water', waterTarget:2.5 },
    { id:'wf3', group:'FAST', label:'No food today', sub:'If you feel unwell, eat. Health first.' },
    { id:'wf4', group:'FAST', label:'Light walk only', sub:'No resistance training on fast days.' },
    { id:'wf5', group:'FAST', label:'Resume surplus eating tomorrow', sub:'Post-fast meal: moderate protein + carbs. Do not overeat.' }
  ],
  checklistLight: [
    { id:'l1', group:'LIGHT', label:'Wake & 500ml water', sub:'Hydration first. Light day, not skip day.' },
    { id:'l2', group:'LIGHT', label:'Light mobility or walk', sub:'20\u201330 min walk or gentle stretching. No heavy training.' },
    { id:'l3', group:'LIGHT', label:'Eat at or slightly below TDEE', sub:'Maintenance calories. Protein stays high. Give digestion a break.' },
    { id:'l4', group:'LIGHT', label:'Protein still hits 1.6g/kg minimum', sub:'Lean protein + vegetables. Muscle needs protein on rest days too.' },
    { id:'l5', group:'LIGHT', label:'No junk food or heavy processed meals', sub:'Light, clean meals. This is gut recovery \u2014 treat it like one.' },
    { id:'l6', group:'LIGHT', label:'2.5L+ water', sub:'Stay hydrated. Water, herbal tea, black coffee only.', type:'water', waterTarget:2.5 },
    { id:'l7', group:'NIGHT', label:'Sleep 7\u20139 hours', sub:'Recovery is amplified on light days.' }
  ],

  foodGroupLabel: 'EATING',
  foodGroupBg: '',
  foodGroupColor: '',

  workoutContent() {
    return `
    <div class="section-title">DEFAULT BULK <span>TRAINING</span></div>
    <p class="section-note">5 training days + 1 active rest + 1 full rest. Each muscle group 2\u00d7/week. ALL primary exercises use <strong>tempo 3-1-2-0</strong> (3s eccentric, 1s pause, 2s concentric, 0 pause). Surplus fuels recovery.</p>

    ${workoutCard('PUSH VOLUME','MON \u00b7 40\u201350 MIN \u00b7 TEMPO 3-1-2-0',
      exRow('Arm circles + push-up negatives warm-up','Small to large circles, then 3 slow negatives','5 min')+
      exRowWithLevel('push','Push-up progression','Tempo 3-1-2-0 \u2014 chest, shoulders, triceps','4\u00d712\u201315')+
      exRow('Decline push-up','Feet on chair \u2014 upper chest focus, tempo 3-1-2-0','4\u00d710\u201312')+
      exRowWithLevel('shoulder','Pike push-up progression','Hips high, tempo 3-1-2-0 \u2014 shoulders','3\u00d710')+
      exRow('Diamond push-up','Hands together, tempo 3-1-2-0 \u2014 triceps','3\u00d710\u201312')+
      exRow('Tricep dips (chair edge)','Tempo 2-1-2-0','3\u00d712')+
      exRow('Plank to downdog','Flow movement, 2 sec each','3\u00d710')+
      exRow('ISOMETRIC: Push-up bottom hold','Hold 1 inch off floor (Oranchuk 2019)','3\u00d710\u201315 sec'),
      stretchRow('Chest + shoulder + wrist stretch','Doorframe, behind-back clasp, wrist flexors','5 min'),
      'MON'
    )}

    ${workoutCard('PULL + POSTERIOR CHAIN','TUE \u00b7 40\u201350 MIN \u00b7 TEMPO 3-1-2-0',
      exRow('Cat-cow + thoracic rotation warm-up','Spine mobility','5 min')+
      exRowWithLevel('pull','Inverted row progression','Tempo 3-1-2-0 \u2014 back + biceps','4\u00d78\u201310')+
      exRow('Towel row','Towel over door, unilateral, tempo 2-1-2-0','3\u00d710/side')+
      exRow('Prone Y-T-W raises','Face down \u2014 rear delt + mid-trap, tempo 2-2-0-0','3\u00d710 each')+
      exRow('Superman hold','Posterior chain isometric','3\u00d730 sec')+
      exRow('Scapular push-up','Protract/retract shoulder blades, tempo 2-1-2-0','3\u00d712')+
      exRowWithLevel('hinge','Glute bridge progression','Tempo 3-1-2-0 \u2014 glutes + hamstrings','3\u00d715')+
      exRow('Good morning bodyweight','Hinge at hips, tempo 3-1-2-0','3\u00d712'),
      stretchRow('Rear shoulder + hamstring stretch','Cross-body, seated hamstring, cat-cow','5 min'),
      'TUE'
    )}

    ${workoutCard('ANIMAL FLOW MOBILITY + WALK','WED \u00b7 30\u201335 MIN',
      exRow('Walk','15 min easy pace','15 min')+
      exRow('Wrist mobilizations','Circles, flexion, extension','3 min')+
      exRow('Beast hold','On all fours, knees 1 inch off ground','3\u00d715 sec')+
      exRow('Beast to crab transition','Flow between positions','5 reps')+
      exRow('Crab reach','Reach one arm overhead from crab','5/side')+
      exRow('Lateral ape','Side-to-side squat walk','5/direction')+
      exRow('Front step-through','Step leg through from beast','5/side')+
      exRow('Scorpion reach','Prone, reach foot to opposite hand','4/side')+
      exRow('Loaded beast to underswitch','Transition flow','5 reps')+
      exRow('Free flow','Combine all movements freely','2 min'),
      stretchRow('Beginner note','Slow everything down. Hold each position 5 sec before transitioning.',''),
      'WED'
    )}

    ${workoutCard('LOWER BODY VOLUME','THU \u00b7 40\u201350 MIN \u00b7 TEMPO 3-1-2-0',
      exRow('Leg swings + high knees warm-up','Forward/back + side, then high knees','5 min')+
      exRowWithLevel('squat','Squat progression','Tempo 3-1-2-0 \u2014 quads + glutes','4\u00d712\u201315')+
      exRow('Bulgarian split squat','Rear foot on chair, tempo 3-1-2-0','4\u00d710/leg')+
      exRow('Nordic hamstring curl','Slow eccentric \u2014 use towel anchor if needed','4\u00d73\u20136')+
      exRow('Single-leg glute bridge','Tempo 2-1-2-0','3\u00d712/leg')+
      exRow('Calf raises','Tempo 2-1-3-0 (3 sec eccentric)','3\u00d720')+
      exRow('Wall sit','Isometric \u2014 Oranchuk 2019','3\u00d745 sec')+
      exRow('Side-lying hip abduction','Tempo 2-1-2-0','2\u00d715/side')+
      exRow('ISOMETRIC: Deep squat hold','Heels flat, full depth','3\u00d720\u201330 sec'),
      stretchRow('Pigeon + hamstring + calf stretch','45 sec/side each','5 min'),
      'THU'
    )}

    ${workoutCard('PUSH/PULL INTENSITY','FRI \u00b7 40\u201350 MIN',
      exRow('Hip CARs + arm circles warm-up','Joint prep','5 min')+
      exRowWithLevel('push','Push-up ladder','10 down to 1, normal tempo, rest = time for next set','1 ladder')+
      exRowWithLevel('pull','Inverted row progression','Superset after ladder, tempo 3-1-2-0','3\u00d78\u201310')+
      exRowWithLevel('push','Archer push-up','Unilateral, tempo 3-1-2-0','3\u00d76/side')+
      exRow('Prone Y-T-W raises','Rear delt + mid-trap balance','3\u00d710 each')+
      exRowWithLevel('shoulder','Pike push-up progression','Tempo 3-1-2-0','3\u00d710')+
      exRowWithLevel('core','Hollow body hold','True core tension','3\u00d720\u201330 sec'),
      stretchRow('Chest + shoulder stretch','Doorframe or behind-back clasp','5 min'),
      'FRI'
    )}

    ${workoutCard('FULL BODY + PILATES CORE','SAT \u00b7 45\u201355 MIN',
      exRow('--- RESISTANCE (30 min) ---','',''),
      exRowWithLevel('push','Push-up variation','Different from Mon/Fri','3\u00d710\u201312')+
      exRowWithLevel('pull','Inverted row or towel row','Back + biceps','3\u00d78\u201310')+
      exRowWithLevel('squat','Squat variation','Compound lower','3\u00d712')+
      exRow('Glute bridge march','Alternate legs, stability','3\u00d715'),
      '',
      'SAT'
    )}

    ${workoutCard('PILATES CORE (SAT continued)','15 MIN',
      exRow('Pelvic tilts','Lie on back, tilt pelvis','10 reps')+
      exRow('The Hundred (modified)','Arms pump, breathe 5 in / 5 out','5\u00d710-count')+
      exRow('Single leg stretch','Alternate extending legs','8/side')+
      exRow('Double leg stretch','Both legs extend + arms','8 reps')+
      exRow('Spine twist lying','Knees drop to each side','6/side')+
      exRow('Bridge with march','Lift hips, alternate knee lift','10 reps')+
      exRow('Swimming prone','Face down, alternate arm/leg','20 alternating')+
      exRow('Roll-up (assisted)','Slow roll up from lying','6 reps'),
      stretchRow('Full body stretch','Hips, shoulders, spine, lying twist','5\u201310 min'),
      'SAT'
    )}

    ${workoutCard('FULL REST','SUN',
      exRow('Complete recovery','No structured training',''),
      '',
      'SUN'
    )}

    <div style="margin-top:6px;padding:5px 8px;background:var(--surface);border-radius:6px;border-left:2px solid var(--accent);">
      <div style="font-family:'DM Mono',monospace;font-size:0.4rem;color:var(--accent);letter-spacing:1px;">PUSH:PULL RATIO \u2014 BALANCED \u00b7 TEMPO 3-1-2-0 ON ALL PRIMARY COMPOUNDS</div>
      <div style="font-family:'DM Mono',monospace;font-size:0.38rem;color:var(--muted);margin-top:2px;">Oranchuk 2019: isometric at long muscle length = greater hypertrophy \u00b7 ISSN 2018: 2\u00d7/week per muscle group \u00b7 Buxton 2022: Animal Flow rationale</div>
    </div>`;
  },

  nutritionContent(s) {
    const cal = s.calories || 2800;
    const proteinG = Math.round(cal * 0.30 / 4);
    const carbsG = Math.round(cal * 0.50 / 4);
    const fatG = Math.round(cal * 0.20 / 9);
    const _supOn = s.supplementsEnabled !== false;
    const wt = s.currentKg || 80;
    const mealLow = Math.round(wt * 0.40);
    const mealHigh = Math.round(wt * 0.55);

    return `
    <div class="section-title">DEFAULT BULK <span>NUTRITION</span></div>
    <p class="section-note">Controlled surplus. Carb-forward. Protein: 1.6\u20132.2g/kg (Iraki 2019). Adjust ceiling in Settings.</p>
    <div class="macro-grid">
      <div class="macro-box"><div class="macro-val" style="color:#f7dc6f">${cal}</div><div class="macro-lbl">Cal ceiling</div></div>
      <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein (30%)</div></div>
      <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs (50%)</div></div>
      <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats (20%)</div></div>
    </div>
    <div class="rule-card" style="border-left-color:#f7dc6f">
      <div class="rule-num">CONTROLLED SURPLUS</div>
      <div class="rule-text">250\u2013400 cal/day above TDEE. 0.25\u20130.5% BW/week. Enough for growth, minimal fat gain.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">PROTEIN PRIORITY</div>
      <div class="rule-text">1.6\u20132.2g/kg (Iraki 2019). ${mealLow}\u2013${mealHigh}g per meal across 3\u20134 meals (0.40\u20130.55g/kg per meal).</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">CARBS = FUEL</div>
      <div class="rule-text">\u22653\u20135g/kg/day. Carbs around training: pre-training meal 1\u20132 hrs before, post-training protein within 60 min.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">HYDRATION</div>
      <div class="rule-text">2.5\u20133L/day. More on training days.</div>
    </div>
    <div class="rule-card" style="border-left-color:#88ccff">
      <div class="rule-num">CALORIE CYCLING</div>
      <div class="rule-text">Full surplus on training days. Maintenance on rest/light days. Anabolic stimulus peaks around training.</div>
    </div>
    ${_supOn ? `
    <div class="section-title" style="margin-top:12px">SUPPLEMENTS <span>(OPTIONAL)</span></div>
    <div class="rule-card"><div class="rule-num">CREATINE</div><div class="rule-text">5g/day. ISSN 2018: strongest evidence for muscle mass + strength. Daily, timing irrelevant.</div></div>
    <div class="rule-card"><div class="rule-num">VITAMIN D3</div><div class="rule-text">2,000\u20134,000 IU/day with food. NIH UL: 4,000 IU/day.</div></div>
    <div class="rule-card"><div class="rule-num">OMEGA-3</div><div class="rule-text">2,000mg EPA+DHA/day. Joint + heart health.</div></div>
    <div class="rule-card"><div class="rule-num">MAGNESIUM</div><div class="rule-text">200\u2013350mg/day before bed. Sleep + recovery.</div></div>
    <div class="rule-card"><div class="rule-num">WHEY PROTEIN</div><div class="rule-text">25\u201330g/serving. Only if food protein consistently below 1.6g/kg.</div></div>` : `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin-top:12px;font-family:'DM Mono',monospace;font-size:0.65rem;color:var(--muted);line-height:1.6;text-align:center">Enable supplement tracking in Settings to see recommendations here.</div>`}`;
  },

  rulesContent(s) {
    const cal = s.calories || 2800;
    return `
    <div class="section-title">EATING <span>RULES</span></div>
    ${ruleCard('RULE 01','Hit your ' + cal + ' cal/day ceiling daily.','Surplus is required for growth. Under-eating wastes training stimulus.')}
    ${ruleCard('RULE 02','Protein density first \u2014 1.6\u20132.2g/kg, distributed across 3\u20134 meals.','0.40\u20130.55g/kg per meal (Iraki et al. 2019).')}
    ${ruleCard('RULE 03','Carbs around training \u2014 pre-training 1\u20132 hrs, post-training within 60 min.','ISSN 2018: carb availability essential for resistance training. \u22653\u20135g/kg/day.')}
    ${ruleCard('RULE 04','Calorie cycling \u2014 full surplus on training days, maintenance on rest/light days.','Reduces unnecessary fat gain.')}
    ${ruleCard('RULE 05','2.5\u20133L water daily.','Hydration supports muscle protein synthesis.')}
    ${ruleCard('RULE 06','Monthly body composition check.','Weigh weekly. Waist monthly. Photos monthly. Adjust if gaining >0.5% BW/week.')}
    <div class="section-title" style="margin-top:8px">TRAINING <span>RULES</span></div>
    ${ruleCard('RULE 07','Tempo training on all primary exercises \u2014 3-1-2-0.','Time under tension drives growth. 3 sec eccentric, 1 sec pause, 2 sec concentric.','var(--accent2)')}
    ${ruleCard('RULE 08','Each muscle group trained 2\u00d7/week minimum.','ISSN 2018: superior to 1\u00d7 for hypertrophy.','var(--accent2)')}
    ${ruleCard('RULE 09','Push:pull balanced across the week \u2014 never push-dominant.','Cools 2016: pull work prevents impingement and anterior shoulder issues.','var(--accent2)')}
    ${ruleCard('RULE 10','Progressive overload \u2014 when top of rep range feels easy, advance level.','Plotkin 2022: rep progression = load progression for muscle growth.','var(--accent2)')}
    ${ruleCard('RULE 11','Deload every 8\u201310 weeks \u2014 40% volume reduction for one week.','Full recovery before next progression block.','var(--accent2)')}
    ${ruleCard('RULE 12','Sleep 7\u20139 hours. Non-negotiable.','Growth hormone peaks during deep sleep.','var(--accent2)')}
    <div class="section-title" style="margin-top:8px">DISCIPLINE <span>RULES</span></div>
    ${ruleCard('RULE 13','One miss = noise. Two = pattern. Minimum beats zero.','','#70c8ff')}
    ${ruleCard('RULE 14','Travel changes nothing. 20 min on a floor. Zero location dependency.','','#70c8ff')}`;
  }
};
