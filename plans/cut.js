export const cut = {
  name: 'DEFAULT CUT',
  goalMode: 'cut',
  tdee: 2400,
  fastDaysPerWeek: 0,
  badge: 'DEFAULT CUT',
  badgeClass: 'cut',
  descClass: 'cut-desc',
  subtitle: 'Fat loss. Muscle preserved. No gym needed.',
  bannerColor: '#4ecdc4',
  bannerBg: 'rgba(78,205,196,0.07)',
  bannerBorder: 'rgba(78,205,196,0.35)',
  fastDaysDow: [],
  lightDaysPerWeek: 0,
  lightDaysDow: [],
  macroSplit: { base:[40,35,25], rest:[45,30,25], preFast:[40,35,25], stall:[45,30,25], satiety:[45,30,25] },
  proteinFloorMultiplier: 1.6,
  // Phase 3 (v7.2.2): plan-direction-aware calorie safety bounds.
  // 'floor' mode → warn if calorie ceiling drops below minCalories.
  // 1400 cal aligns with Helms 2014 (>= 1.5 × BMR for sustained cuts).
  caloriesMode: 'floor',
  minCalories: 1400,
  // v7.9.0: per-day-type activity multipliers. CUT has no fast days, so
  // every day is an eat day. Multiplier matches "moderate" baseline (3-5
  // training days/week + walking + life). Weekly weighted: 7×1.55 = 1.55.
  activityByDayType: { eatDay: 1.55 },

  defaultTimes: { wakeTime:'06:00', lastMealTime:'20:00', eveningSessionTime:'18:00', eatingWindowStart:null },

  weekIcons: {0:'\uD83D\uDEB6',1:'\uD83D\uDCAA',2:'\uD83D\uDD25',3:'\uD83E\uDDD8',4:'\uD83E\uDDB5',5:'\uD83D\uDD25',6:'\uD83D\uDCAA'},

  morningSub: {
    0:'SUNDAY \u2014 Full rest. Walk if you want. Recover.',
    1:'MONDAY \u2014 Upper Body Resistance. Push-ups, pike push-ups, rows, Y-T-W raises. 35\u201340 min.',
    2:'TUESDAY \u2014 HIIT Circuit A or Shadowboxing Cardio. 20\u201325 min high-intensity.',
    3:'WEDNESDAY \u2014 Active Recovery. 15\u201320 min walk + 15\u201320 min yoga flow.',
    4:'THURSDAY \u2014 Lower Body Resistance. Squats, lunges, bridges, calf raises. 35\u201340 min.',
    5:'FRIDAY \u2014 HIIT Circuit B. Squat jumps, push-ups, speed skaters, burpees. 20\u201325 min.',
    6:'SATURDAY \u2014 Full Body Resistance + Core. Compound movements + dead bugs, bicycle crunches. 35\u201340 min.'
  },
  eveningSub: {
    0:'SUNDAY \u2014 Rest day. No training.',
    1:'MONDAY \u2014 Cooldown: chest + shoulder stretch. 5 min.',
    2:'TUESDAY \u2014 Post-HIIT stretch. Legs, hips, shoulders. 5 min.',
    3:'WEDNESDAY \u2014 Yoga session IS the evening movement. See WORKOUTS tab.',
    4:'THURSDAY \u2014 Cooldown: pigeon + hamstring stretch. 5 min.',
    5:'FRIDAY \u2014 Post-HIIT stretch. Full body. 5 min.',
    6:'SATURDAY \u2014 Full body stretch cooldown. 5\u201310 min.'
  },
  stretchSub: {
    0:'Rest day. Gentle mobility if desired.',
    1:'Chest doorframe stretch, behind-back clasp, tricep overhead stretch.',
    2:'Quad stretch, hip flexor lunge, shoulder cross-body.',
    3:'Yoga cooldown covers stretching. Savasana 2 min.',
    4:'Pigeon pose 45 sec/side, standing hamstring stretch, calf stretch.',
    5:'World\'s greatest stretch, hip CARs, chest opener.',
    6:'Full body: neck rolls, cat-cow, hamstring, quad, hip, shoulder, wrist.'
  },

  checklistNormal: [
    { id:'m1', group:'MORNING', label:'500ml water on waking', sub:'Hydrate before anything else.' },
    { id:'m2', group:'MORNING', label:'Morning training session', sub:'See WORKOUTS tab. Resistance or HIIT depending on the day.' },
    { id:'m3', group:'MORNING', label:'Protein-rich breakfast', sub:'30\u201340g protein. Eggs, Greek yogurt, or protein oats.' },
    { id:'m4', group:'MORNING', label:'Log morning weight', sub:'Same conditions: after waking, before food, after bathroom.' },
    { id:'f1', group:'EATING', label:'Stayed under calorie ceiling', sub:'This drives fat loss. Track or estimate \u2014 consistency matters.' },
    { id:'f2', group:'EATING', label:'Hit protein target', sub:'1.6g/kg minimum. Muscle does not preserve itself.', type:'info' },
    { id:'f3', group:'EATING', label:'No liquid calories', sub:'Water, black coffee, plain tea only. No juice, soda, or milk drinks.' },
    { id:'f4', group:'EATING', label:'2.5L+ water today', sub:'500ml on waking. 250ml before each meal. Sip the rest.', type:'water', waterTarget:2.5 },
    { id:'f5', group:'EATING', label:'Vegetables at lunch and dinner', sub:'Volume + fibre. Half your plate.' },
    { id:'e1', group:'EVENING', label:'Post-training stretch or yoga', sub:'5 min minimum. See WORKOUTS tab for cooldown.' },
    { id:'e2', group:'EVENING', label:'15+ min walk today', sub:'Daily. Fat oxidation zone. Even if you trained \u2014 walking is separate.' },
    { id:'s1', group:'SUPPLEMENTS', label:'Daily supplements taken', sub:'Tap to expand \u2014 see NUTRITION tab for details',
      subItems: [
        { id:'s1_a', name:'Creatine', dose:'5g', when:'Any time \u2014 consistency matters' },
        { id:'s1_b', name:'Vitamin D3', dose:'2,000\u20134,000 IU', when:'With food' },
        { id:'s1_c', name:'Omega-3', dose:'2,000mg EPA+DHA', when:'With largest meal' },
        { id:'s1_d', name:'Magnesium', dose:'200\u2013350mg', when:'Before bed' }
      ]
    },
    { id:'n1', group:'NIGHT', label:'No food 2 hours before bed', sub:'Improves sleep quality and next-morning hunger signals.' },
    { id:'n2', group:'NIGHT', label:'Sleep 7\u20139 hours', sub:'Recovery + fat loss both depend on sleep.' }
  ],
  checklistFast: [
    { id:'wf1', group:'FAST', label:'500ml water on waking', sub:'Hydrate immediately.' },
    { id:'wf2', group:'FAST', label:'Stay hydrated \u2014 3L+ water today', sub:'Electrolytes if needed. Herbal tea allowed.', type:'water', waterTarget:3.0 },
    { id:'wf3', group:'FAST', label:'No food today', sub:'Water, black coffee, plain tea only. Zero calories.' },
    { id:'wf4', group:'FAST', label:'Light walk only', sub:'No HIIT or resistance on fast days. 20\u201330 min easy walk maximum.' },
    { id:'wf5', group:'FAST', label:'Break fast gently tomorrow', sub:'Start with protein + vegetables. Do not binge.' }
  ],

  foodGroupLabel: 'EATING',
  foodGroupBg: '',
  foodGroupColor: '',

  workoutContent() {
    return `
    <div class="section-title">DEFAULT CUT <span>TRAINING</span></div>
    <p class="section-note">Resistance 3\u00d7/week + HIIT 2\u00d7/week + Active recovery 1\u00d7 + Rest 1\u00d7. All bodyweight.</p>

    ${workoutCard('UPPER BODY RESISTANCE','MON \u00b7 35\u201340 MIN',
      exRow('Arm circles warm-up','Small to large, both directions','3 min')+
      exRowWithLevel('push','Push-up progression','Full range, chest to floor','3\u00d710\u201315')+
      exRowWithLevel('shoulder','Pike push-up progression','Hips high, head toward floor \u2014 shoulders','3\u00d78\u201310')+
      exRow('Diamond push-up','Hands together under chest \u2014 triceps','3\u00d78\u201310')+
      exRowWithLevel('pull','Inverted row / Superman','Back + biceps \u2014 table edge or floor','3\u00d78\u201310')+
      exRow('Prone Y-T-W raises','Face down \u2014 rear delt + mid-trap','3\u00d78 each')+
      exRow('Plank hold','Elbows, stay tight','3\u00d720\u201330 sec'),
      stretchRow('Chest + shoulder stretch','Doorframe or behind-back clasp','5 min'),
      'MON'
    )}

    ${workoutCard('HIIT CIRCUIT A / SHADOWBOXING','TUE \u00b7 20\u201325 MIN',
      exRow('OPTION 1: HIIT Circuit','30 sec work / 15 sec rest \u00d7 4 rounds, 2 min rest between rounds','20 min')+
      exRow('\u2022 High knees','Drive knees to chest','')+
      exRow('\u2022 Bodyweight squat (fast)','Full depth, quick tempo','')+
      exRow('\u2022 Mountain climbers','Controlled pace','')+
      exRow('\u2022 Reverse lunge (alternating)','Step back, knee hovers floor','')+
      exRow('\u2022 Jumping jacks','Full extension','')+
      exRow('\u2022 Plank to downdog','Flow, 2 sec each position','')+
      exRow('OPTION 2: Shadowboxing','5 \u00d7 3-min rounds, 60 sec rest between','20 min')+
      exRow('\u2022 R1: Warm-up jab-cross','Light, find rhythm','')+
      exRow('\u2022 R2: Speed round','Fast combinations','')+
      exRow('\u2022 R3: Power hooks + uppercuts','Rotate hips, controlled power','')+
      exRow('\u2022 R4: 20 sec flurry / 10 sec light','Intervals within round','')+
      exRow('\u2022 R5: Mixed tempo','Everything together','')+
      exRow('OPTION 3: Jump Rope HIIT','If rope available ($5). 30 sec jump / 20 sec rest \u00d7 8, then 3 \u00d7 60 sec continuous','15\u201320 min'),
      stretchRow('Post-HIIT stretch','Legs, hips, shoulders','5 min'),
      'TUE'
    )}

    ${workoutCard('ACTIVE RECOVERY: WALK + YOGA','WED \u00b7 30\u201340 MIN',
      exRow('Walk','15\u201320 min conversational pace','15\u201320 min')+
      exRow('Cat-cow','Arch and round spine gently','8 reps')+
      exRow('Downward dog','Hold, pedal feet','30 sec')+
      exRow('Low lunge','Hip flexor opener','30 sec/side')+
      exRow('Pigeon pose','Deep hip stretch','45 sec/side')+
      exRow('Standing forward fold','Hamstrings, relax upper body','30 sec')+
      exRow('Warrior II','Strength + balance','20 sec/side')+
      exRow('Triangle pose','Side body stretch','20 sec/side')+
      exRow('Child\'s pose','Rest, breathe deeply','60 sec')+
      exRow('Seated spinal twist','Gentle rotation each side','30 sec/side'),
      stretchRow('Savasana','Lie flat, close eyes, breathe','2 min'),
      'WED'
    )}

    ${workoutCard('LOWER BODY RESISTANCE','THU \u00b7 35\u201340 MIN',
      exRow('Leg swings + hip circles warm-up','Forward/back + side, 10 each leg','3 min')+
      exRowWithLevel('squat','Squat progression','Full depth, knees track toes','3\u00d712\u201315')+
      exRow('Reverse lunge','Step back, knee hovers floor','3\u00d710/leg')+
      exRowWithLevel('hinge','Glute bridge progression','Pause at top, squeeze','3\u00d715')+
      exRow('Single-leg RDL','Bodyweight, hinge at hip \u2014 hamstrings','3\u00d78/leg')+
      exRow('Calf raises standing','Slow up, slow down','3\u00d720')+
      exRow('Wall sit','Back against wall, thighs parallel','3\u00d730\u201345 sec')+
      exRow('Side-lying hip abduction','Lie on side, raise top leg','2\u00d712/side'),
      stretchRow('Pigeon + hamstring stretch','45 sec/side each','5 min'),
      'THU'
    )}

    ${workoutCard('HIIT CIRCUIT B','FRI \u00b7 20\u201325 MIN',
      exRow('40 sec work / 20 sec rest','3 rounds, 90 sec rest between rounds','20 min')+
      exRow('\u2022 Squat jump','Land soft (fast squat for beginners)','')+
      exRow('\u2022 Push-up','Any level from progression','')+
      exRow('\u2022 Speed skaters','Lateral leap, touch floor','')+
      exRow('\u2022 Bicycle crunch','Slow, deliberate','')+
      exRow('\u2022 Burpee','Full extension (squat thrust for beginners)','')+
      exRow('\u2022 Flutter kicks','Lower back pressed to floor',''),
      stretchRow('Post-HIIT full body stretch','World\'s greatest stretch, hip CARs','5 min'),
      'FRI'
    )}

    ${workoutCard('FULL BODY RESISTANCE + CORE','SAT \u00b7 35\u201340 MIN',
      exRow('Jumping jacks warm-up','Full extension','2 min')+
      exRowWithLevel('push','Push-up variation','Different from Monday','3\u00d710\u201312')+
      exRow('Bulgarian split squat','Rear foot on chair','3\u00d78/leg')+
      exRowWithLevel('pull','Inverted row / towel row','Back + biceps','3\u00d78\u201310')+
      exRow('Good morning bodyweight','Hinge at hips, slight knee bend','3\u00d712')+
      exRowWithLevel('core','Dead bug','Lower back glued to floor','3\u00d78/side')+
      exRow('Bicycle crunch','Slow and deliberate','3\u00d715/side')+
      exRow('Superman hold','Posterior chain endurance','3\u00d720 sec'),
      stretchRow('Full body stretch','Neck, shoulders, chest, hips, hamstrings','5\u201310 min'),
      'SAT'
    )}

    ${workoutCard('REST','SUN',
      exRow('No structured exercise','Optional easy walk',''),
      '',
      'SUN'
    )}`;
  },

  nutritionContent(s) {
    const cal = s.calories || 1800;
    const proteinG = Math.round(cal * 0.40 / 4);
    const carbsG = Math.round(cal * 0.35 / 4);
    const fatG = Math.round(cal * 0.25 / 9);
    const _supOn = s.supplementsEnabled !== false;

    return `
    <div class="section-title">DEFAULT CUT <span>NUTRITION</span></div>
    <p class="section-note">Aggressive deficit. 80/20 approach. Protein: 1.6g/kg floor. Adjust ceiling in Settings.</p>
    <div class="macro-grid">
      <div class="macro-box"><div class="macro-val" style="color:#4ecdc4">${cal}</div><div class="macro-lbl">Cal ceiling</div></div>
      <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein (40%)</div></div>
      <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs (35%)</div></div>
      <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats (25%)</div></div>
    </div>
    <div class="rule-card" style="border-left-color:#4ecdc4">
      <div class="rule-num">AGGRESSIVE DEFICIT</div>
      <div class="rule-text">400\u2013600 cal below TDEE. 0.5\u20131.0 kg/week. Fast enough to see progress, slow enough to preserve muscle.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">PROTEIN PRIORITY</div>
      <div class="rule-text">1.6g/kg minimum (Morton et al. 2017). Eggs, chicken, tuna, Greek yogurt, lentils, cottage cheese, tofu.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">MEAL STRUCTURE</div>
      <div class="rule-text">3 meals + 1 optional snack. No specific eating window \u2014 eat when it fits your day.</div>
    </div>
    <div class="rule-card">
      <div class="rule-num">HYDRATION</div>
      <div class="rule-text">2.5L+/day. 500ml on waking. 250ml before meals.</div>
    </div>
    <div class="rule-card" style="border-left-color:#4ecdc4">
      <div class="rule-num">80/20 FLEXIBLE EATING</div>
      <div class="rule-text">80% whole foods, 20% your choice. No banned foods \u2014 only budgets. Adherence > perfection.</div>
    </div>
    ${_supOn ? `
    <div class="section-title" style="margin-top:12px">SUPPLEMENTS <span>(OPTIONAL)</span></div>
    <div class="rule-card"><div class="rule-num">CREATINE</div><div class="rule-text">5g/day, NO loading phase. ISSN 2018: strongest evidence for preserving muscle during deficit. Take daily, timing irrelevant.</div></div>
    <div class="rule-card"><div class="rule-num">VITAMIN D3</div><div class="rule-text">2,000\u20134,000 IU/day with food. NIH UL: 4,000 IU/day.</div></div>
    <div class="rule-card"><div class="rule-num">OMEGA-3</div><div class="rule-text">2,000mg EPA+DHA/day with largest meal. Heart + joint health.</div></div>
    <div class="rule-card"><div class="rule-num">MAGNESIUM</div><div class="rule-text">200\u2013350mg/day before bed. Sleep + muscle recovery. NIH supplemental UL: 350mg.</div></div>
    <div class="rule-card"><div class="rule-num">CAFFEINE</div><div class="rule-text">100\u2013200mg pre-training optional. Enhances performance + fat oxidation. Not after 2PM.</div></div>` : `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin-top:12px;font-family:'DM Mono',monospace;font-size:0.65rem;color:var(--muted);line-height:1.6;text-align:center">Enable supplement tracking in Settings to see recommendations here.</div>`}`;
  },

  rulesContent(s) {
    const cal = s.calories || 1800;
    return `
    <div class="section-title">EATING <span>RULES</span></div>
    ${ruleCard('RULE 01','Stay under ' + cal + ' cal/day ceiling.','This drives fat loss. Track or estimate \u2014 consistency matters more than precision.')}
    ${ruleCard('RULE 02','Protein anchors every meal \u2014 1.6g/kg minimum.','Muscle does not preserve itself during a deficit. Morton et al. 2017.')}
    ${ruleCard('RULE 03','No liquid calories.','Water, black coffee, plain tea only.')}
    ${ruleCard('RULE 04','2.5 litres of water daily.','500ml on waking. 250ml before each meal.')}
    ${ruleCard('RULE 05','80/20 flexible eating.','80% whole foods, 20% your choice. No banned foods \u2014 only budgets.')}
    ${ruleCard('RULE 06','Pre-eat protein before social meals.','You arrive not hungry. No willpower needed.')}
    <div class="section-title" style="margin-top:8px">TRAINING <span>RULES</span></div>
    ${ruleCard('RULE 07','Resistance training 3\u00d7/week is non-negotiable.','This preserves muscle during a cut. Without it, you lose both fat and muscle.','var(--accent2)')}
    ${ruleCard('RULE 08','HIIT 2\u00d7/week \u2014 never on consecutive days.','Recovery matters. Alternate with resistance days.','var(--accent2)')}
    ${ruleCard('RULE 09','Walking daily \u2014 even 15 min counts.','Fat oxidation zone. Separate from structured training. It adds up.','var(--accent2)')}
    ${ruleCard('RULE 10','Progressive overload \u2014 when current level feels easy, advance.','Use level selectors. Rep progression = load progression for muscle growth (Plotkin 2022).','var(--accent2)')}
    <div class="section-title" style="margin-top:8px">DISCIPLINE <span>RULES</span></div>
    ${ruleCard('RULE 11','One miss = noise. Two = pattern. Minimum beats zero every time.','','#70c8ff')}
    ${ruleCard('RULE 12','Travel changes nothing. 20 min on a floor. The body goes everywhere.','','#70c8ff')}`;
  }
};
