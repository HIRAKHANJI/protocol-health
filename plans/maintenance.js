export const maintenance = {
  name: 'DEFAULT MAINTENANCE',
  goalMode: 'maintenance',
  tdee: 2400,
  fastDaysPerWeek: 0,
  lightDaysPerWeek: 1,
  badge: 'DEFAULT MAINTENANCE',
  badgeClass: 'maint',
  descClass: 'maint-desc',
  subtitle: 'Sustain. Move well. Live longer.',
  bannerColor: '#82e0aa',
  bannerBg: 'rgba(130,224,170,0.07)',
  bannerBorder: 'rgba(130,224,170,0.35)',
  fastDaysDow: [],
  lightDaysDow: [0],  // Sunday — weekly light eating day for digestive reset
  macroSplit: { base:[30,45,25], rest:[35,40,25], preFast:[30,45,25], stall:[35,40,25], satiety:[35,40,25] },
  proteinFloorMultiplier: 1.2,

  defaultTimes: { wakeTime:'07:00', lastMealTime:'20:00', eveningSessionTime:'18:00', eatingWindowStart:null },

  weekIcons: {0:'\uD83D\uDEB6',1:'\uD83D\uDCAA',2:'\uD83C\uDFC3',3:'\uD83E\uDDD8',4:'\uD83D\uDCAA',5:'\uD83C\uDFC3',6:'\uD83C\uDFAF'},

  morningSub: {
    0:'SUNDAY \u2014 Full rest or light walk. Meal prep for the week.',
    1:'MONDAY \u2014 Bodyweight Resistance A. Push-ups, rows, squats, plank, superman. 30\u201335 min.',
    2:'TUESDAY \u2014 Cardio Rotation: walk/jog, shadowboxing, jump rope, or HIIT. Pick one. 25\u201340 min.',
    3:'WEDNESDAY \u2014 Yoga or Pilates (alternate weeks). Flexibility, core, balance. 30 min.',
    4:'THURSDAY \u2014 Bodyweight Resistance B. Pike push-ups, towel rows, split squats, bridges, dead bugs. 30\u201335 min.',
    5:'FRIDAY \u2014 Animal Flow + Mobility. Beast holds, crab reach, lateral ape, step-throughs, balance. 25\u201330 min.',
    6:'SATURDAY \u2014 Recreational Activity. Do something fun for 30\u201360 min. Hiking, sports, cycling, dance.'
  },
  eveningSub: {
    0:'SUNDAY \u2014 Rest. No training.',
    1:'MONDAY \u2014 Cooldown: chest + hip stretch. 5 min.',
    2:'TUESDAY \u2014 Post-cardio mobility add-on: hip CARs, cat-cow, deep squat hold. 10 min.',
    3:'WEDNESDAY \u2014 Yoga/Pilates session IS the movement. See WORKOUTS tab.',
    4:'THURSDAY \u2014 Cooldown: full body stretch. 5 min.',
    5:'FRIDAY \u2014 Animal Flow includes cooldown. Balance practice at end.',
    6:'SATURDAY \u2014 Stretch after activity if needed. Enjoy the rest of the day.'
  },
  stretchSub: {
    0:'Rest day. Gentle mobility if desired.',
    1:'Chest doorframe stretch, hip flexor lunge, quad stretch.',
    2:'Post-cardio: world\'s greatest stretch, calf stretch, thoracic rotation.',
    3:'Yoga/Pilates session covers flexibility. Savasana or lying twist to close.',
    4:'Full body: pigeon, hamstring, calf, shoulder cross-body, neck rolls.',
    5:'Animal Flow includes mobility. Wrist mobilizations built in.',
    6:'Recreational activity stretch: whatever feels tight. 5 min minimum.'
  },

  checklistNormal: [
    { id:'m1', group:'MORNING', label:'Glass of water on waking', sub:'200\u2013500ml. Start the day hydrated.' },
    { id:'m2', group:'MORNING', label:'Today\'s movement session', sub:'See WORKOUTS tab. Strength, cardio, yoga, Animal Flow, or recreation.' },
    { id:'m3', group:'MORNING', label:'Balanced breakfast', sub:'Protein + carbs + fat. Eggs, oats, fruit, yogurt \u2014 whatever works.' },
    { id:'m4', group:'MORNING', label:'Log weight (weekly)', sub:'Weekly average. Do not stress daily fluctuations.' },
    { id:'f1', group:'EATING', label:'Ate near TDEE', sub:'\u00b1200 cal is fine. Maintenance is eating normally while staying active.' },
    { id:'f2', group:'EATING', label:'Protein in every meal', sub:'1.2\u20131.6g/kg total. Distribute across meals.', type:'info' },
    { id:'f3', group:'EATING', label:'80/20 eating', sub:'80% whole foods, 20% flexible. No food is banned.' },
    { id:'f4', group:'EATING', label:'2L+ water today', sub:'Tea and herbal drinks count.', type:'water', waterTarget:2.0 },
    { id:'e1', group:'EVENING', label:'Post-session stretch or cooldown', sub:'5 min minimum. See WORKOUTS tab.' },
    { id:'e2', group:'EVENING', label:'Moved for 30+ minutes today', sub:'Any modality counts. Walking counts. Recreation counts.' },
    { id:'s1', group:'SUPPLEMENTS', label:'Daily supplements taken', sub:'Tap to expand \u2014 see NUTRITION tab for details',
      subItems: [
        { id:'s1_a', name:'Creatine', dose:'3\u20135g', when:'Any time' },
        { id:'s1_b', name:'Vitamin D3', dose:'2,000 IU', when:'With food' },
        { id:'s1_c', name:'Omega-3', dose:'1,000\u20132,000mg', when:'With largest meal' },
        { id:'s1_d', name:'Magnesium', dose:'200mg', when:'Before bed' }
      ]
    },
    { id:'n1', group:'NIGHT', label:'Wind down routine', sub:'No screens 30 min before bed. Read, stretch, or breathe.' },
    { id:'n2', group:'NIGHT', label:'Sleep 7\u20138 hours', sub:'Consistent bedtime matters more than duration.' }
  ],
  checklistFast: [
    { id:'wf1', group:'FAST', label:'500ml water on waking', sub:'Hydrate.' },
    { id:'wf2', group:'FAST', label:'Stay hydrated \u2014 2L+ water', sub:'Herbal tea allowed.', type:'water', waterTarget:2.0 },
    { id:'wf3', group:'FAST', label:'No food today', sub:'If you feel unwell, eat something. Health first.' },
    { id:'wf4', group:'FAST', label:'Light walk or rest', sub:'No structured training on fast days.' },
    { id:'wf5', group:'FAST', label:'Resume normal eating tomorrow', sub:'Normal portions. Do not overeat after a fast.' }
  ],
  checklistLight: [
    { id:'l1', group:'LIGHT', label:'Wake & 500ml water', sub:'Hydration first. Gentle start.' },
    { id:'l2', group:'LIGHT', label:'Light movement only', sub:'Walk, gentle stretch, or complete rest. No structured training.' },
    { id:'l3', group:'LIGHT', label:'Eat 300\u2013500 cal below TDEE', sub:'Smaller portions. Clean, simple meals. Give the gut a break.' },
    { id:'l4', group:'LIGHT', label:'Protein in every meal', sub:'Lean protein + vegetables. Avoid heavy, processed, or fried food.' },
    { id:'l5', group:'LIGHT', label:'2L+ water', sub:'Stay hydrated. Herbal tea, black coffee allowed.', type:'water', waterTarget:2.0 },
    { id:'l6', group:'NIGHT', label:'Sleep before midnight', sub:'Recovery day. Let the body reset.' }
  ],

  foodGroupLabel: 'EATING',
  foodGroupBg: '',
  foodGroupColor: '',

  workoutContent() {
    return `
    <div class="section-title">DEFAULT MAINTENANCE <span>TRAINING</span></div>
    <p class="section-note">Multi-modal: resistance + cardio rotation + yoga/Pilates + Animal Flow + recreation. Move 5\u20136 days. Sustainable forever.</p>

    ${workoutCard('BODYWEIGHT RESISTANCE A','MON \u00b7 30\u201335 MIN',
      exRow('Hip CARs + arm circles warm-up','Joint prep','5 min')+
      exRowWithLevel('push','Push-up progression','Chest, shoulders, triceps','3\u00d710\u201315')+
      exRowWithLevel('pull','Inverted row / Superman','Back + biceps','3\u00d78\u201310')+
      exRowWithLevel('squat','Squat progression','Quads + glutes','3\u00d712\u201315')+
      exRow('Plank','Elbows, stay tight','3\u00d730 sec')+
      exRow('Superman hold','Posterior chain','3\u00d720 sec'),
      stretchRow('Chest + hip stretch','Doorframe, hip flexor lunge','5 min'),
      'MON'
    )}

    ${workoutCard('CARDIO ROTATION','TUE \u00b7 25\u201340 MIN',
      exRow('OPTION A: Brisk Walk / Jog','Zone 2 (60\u201370% max HR). Conversational pace.','30\u201340 min')+
      exRow('OPTION B: Shadowboxing','5 \u00d7 3-min rounds, 60 sec rest. Jab-cross, hooks, uppercuts.','20\u201325 min')+
      exRow('OPTION C: Jump Rope','3 min continuous / 1 min rest \u00d7 4 rounds. Basic bounce, alternating feet.','15\u201320 min')+
      exRow('OPTION D: HIIT Circuit','30 sec work / 15 sec rest \u00d7 3 rounds: high knees, squats, mountain climbers, lunges, jacks, plank','20 min')+
      exRow('--- MOBILITY ADD-ON (after any option) ---','','10 min')+
      exRow('Hip CARs','Slow full circles, 5/side','')+
      exRow('Cat-cow','10 reps','')+
      exRow('World\'s greatest stretch','30 sec/side','')+
      exRow('Deep squat hold','Heels flat','60 sec')+
      exRow('Thoracic rotation','8/side','')+
      exRow('Calf stretch','30 sec/side',''),
      '',
      'TUE'
    )}

    ${workoutCard('YOGA OR PILATES','WED \u00b7 30 MIN (alternate weeks)',
      exRow('--- YOGA (Hatha flow) ---','','30 min')+
      exRow('Mountain pose + breathing','Stand tall, breathe deeply','1 min')+
      exRow('Sun salutation A (modified)','Flow through forward fold, lunge, plank, updog, downdog','3 rounds')+
      exRow('Warrior I + Warrior II','30 sec/side each','')+
      exRow('Triangle pose','20 sec/side','')+
      exRow('Tree pose','20 sec/side (wall for balance)','')+
      exRow('Pigeon pose','45 sec/side','')+
      exRow('Seated forward fold','30 sec','')+
      exRow('Supine spinal twist','30 sec/side','')+
      exRow('--- OR PILATES (Mat flow) ---','','30 min')+
      exRow('Pelvic tilts + Roll-up','10 reps + 6 reps','')+
      exRow('The Hundred (modified)','5\u00d710-count','')+
      exRow('Single leg circles + stretch','8/direction/leg + 8/side','')+
      exRow('Spine twist lying + Swimming prone','6/side + 20 alternating','')+
      exRow('Bridge + side-lying leg lift','10 reps + 10/side','')+
      exRow('Seal rocking','6 reps',''),
      stretchRow('Savasana or lying twist','Deep relaxation','3 min'),
      'WED'
    )}

    ${workoutCard('BODYWEIGHT RESISTANCE B','THU \u00b7 30\u201335 MIN',
      exRow('Leg swings + thoracic rotation warm-up','Joint prep','5 min')+
      exRowWithLevel('shoulder','Pike push-up progression','Shoulders','3\u00d78\u201310')+
      exRow('Towel row','Towel over door, unilateral','3\u00d710/side')+
      exRow('Bulgarian split squat','Rear foot on chair','3\u00d78/leg')+
      exRowWithLevel('hinge','Glute bridge progression','Posterior chain','3\u00d712')+
      exRowWithLevel('core','Dead bug','Lower back glued to floor','3\u00d78/side')+
      exRow('Calf raises','Slow up, slow down','3\u00d715'),
      stretchRow('Full body stretch','Pigeon, hamstring, calf, shoulder, neck','5 min'),
      'THU'
    )}

    ${workoutCard('ANIMAL FLOW + MOBILITY','FRI \u00b7 25\u201330 MIN',
      exRow('Wrist mobilizations','Circles, flexion, extension','3 min')+
      exRow('Beast hold','On all fours, knees 1 inch off ground','3\u00d715 sec')+
      exRow('Lateral ape','Side-to-side squat walk','5/direction')+
      exRow('Crab reach','Reach one arm overhead from crab','5/side')+
      exRow('Front step-through','Step leg through from beast','5/side')+
      exRow('Beast to crab transition','Flow between positions','5 reps')+
      exRow('Scorpion reach','Prone, reach foot to opposite hand','4/side')+
      exRow('Free flow','Combine all movements freely','3 min')+
      exRow('Single-leg stand','Hold chair if needed, 15 sec/leg','3/side')+
      exRow('Heel-to-toe walk','Straight line, slow and steady','2\u00d710 steps'),
      stretchRow('Beginner note','Start with beast hold + crab reach + lateral ape only',''),
      'FRI'
    )}

    ${workoutCard('RECREATIONAL ACTIVITY','SAT \u00b7 30\u201360 MIN',
      exRow('Do something you enjoy','Hiking, swimming, cycling, dancing, sports, gardening, playground','30\u201360 min')+
      exRow('Only rule','Move 30+ min doing something fun',''),
      stretchRow('Stretch what feels tight','5 min minimum',''),
      'SAT'
    )}

    ${workoutCard('REST','SUN',
      exRow('No structured exercise','Optional 15\u201320 min walk. Focus: hydration, sleep, meal prep.',''),
      '',
      'SUN'
    )}`;
  },

  nutritionContent(s) {
    const cal = s.calories || 2200;
    const proteinG = Math.round(cal * 0.30 / 4);
    const carbsG = Math.round(cal * 0.45 / 4);
    const fatG = Math.round(cal * 0.25 / 9);
    const _supOn = s.supplementsEnabled !== false;

    return `
    <div class="section-title">DEFAULT MAINTENANCE <span>NUTRITION</span></div>
    <p class="section-note">Eat at TDEE. Sustain composition. 80/20 flexible approach. Sustainable forever.</p>
    <div class="macro-grid">
      <div class="macro-box"><div class="macro-val" style="color:#82e0aa">${cal}</div><div class="macro-lbl">Cal target</div></div>
      <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein (30%)</div></div>
      <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs (45%)</div></div>
      <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats (25%)</div></div>
    </div>
    <div class="rule-card" style="border-left-color:#82e0aa">
      <div class="rule-num">EAT AT TDEE</div>
      <div class="rule-text">\u00b1200 cal. No deficit, no surplus. The body self-regulates when not under extreme restriction.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">PROTEIN</div>
      <div class="rule-text">1.2\u20131.6g/kg. Distribute across 2\u20134 meals. Preserves muscle without excess.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">80/20 FLEXIBLE</div>
      <div class="rule-text">Sustainable indefinitely. No food banned. Social meals fine. If it feels like a diet, calories are too low.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">HYDRATION</div>
      <div class="rule-text">2L+/day. Tea and herbal drinks count.</div>
    </div>
    <div class="rule-card" style="border-left-color:var(--accent2)">
      <div class="rule-num">MONTHLY CHECK</div>
      <div class="rule-text">If weight drifts >1kg over 4 weeks, adjust \u00b1100\u2013150 cal/day. \u00b11.5kg fluctuation is normal.</div>
    </div>
    ${_supOn ? `
    <div class="section-title" style="margin-top:12px">SUPPLEMENTS <span>(OPTIONAL)</span></div>
    <div class="rule-card"><div class="rule-num">CREATINE</div><div class="rule-text">3\u20135g/day. Maintains strength + cognitive benefits.</div></div>
    <div class="rule-card"><div class="rule-num">VITAMIN D3</div><div class="rule-text">2,000 IU/day with food.</div></div>
    <div class="rule-card"><div class="rule-num">OMEGA-3</div><div class="rule-text">1,000\u20132,000mg EPA+DHA/day.</div></div>
    <div class="rule-card"><div class="rule-num">MAGNESIUM</div><div class="rule-text">200mg/day before bed.</div></div>` : `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin-top:12px;font-family:'DM Mono',monospace;font-size:0.65rem;color:var(--muted);line-height:1.6;text-align:center">Enable supplement tracking in Settings to see recommendations here.</div>`}`;
  },

  rulesContent(s) {
    const cal = s.calories || 2200;
    return `
    <div class="section-title">EATING <span>RULES</span></div>
    ${ruleCard('RULE 01','Eat near ' + cal + ' cal/day (\u00b1200 cal).','At TDEE \u2014 not a deficit, not a surplus.')}
    ${ruleCard('RULE 02','Protein in every meal.','1.2\u20131.6g/kg. Distribute across 2\u20134 meals.')}
    ${ruleCard('RULE 03','80/20 flexible eating.','Sustainable indefinitely. No rigid restrictions.')}
    ${ruleCard('RULE 04','2L+ water daily.','Basic hydration supports everything.')}
    ${ruleCard('RULE 05','Monthly weight check.','If drifting >1kg over 4 weeks, adjust by 100\u2013150 cal.')}
    <div class="section-title" style="margin-top:8px">TRAINING <span>RULES</span></div>
    ${ruleCard('RULE 06','Move 5\u20136 days per week across multiple modalities.','Strength, cardio, yoga, Pilates, Animal Flow, recreation. Variety prevents boredom.','var(--accent2)')}
    ${ruleCard('RULE 07','Strength training 2\u00d7/week minimum (WHO 2020).','Resistance A + B. Preserves muscle and bone density.','var(--accent2)')}
    ${ruleCard('RULE 08','Progress through level selectors.','Maintenance is not stagnation. The goal shifts from body change to capability.','var(--accent2)')}
    ${ruleCard('RULE 09','Saturday is for fun. Do what you enjoy. It still counts.','Hiking, sports, dance, cycling \u2014 movement is movement.','var(--accent2)')}
    <div class="section-title" style="margin-top:8px">DISCIPLINE <span>RULES</span></div>
    ${ruleCard('RULE 10','Maintenance is not passive.','Without stimulus, the body defaults to muscle loss and fat gain. Training prevents this.','#70c8ff')}
    ${ruleCard('RULE 11','Travel changes nothing. The body goes everywhere.','','#70c8ff')}
    ${ruleCard('RULE 12','Set skill goals, not body goals.','Hold tree pose 30 sec. Animal Flow free flow 3 min. These keep training purposeful.','#70c8ff')}`;
  }
};
