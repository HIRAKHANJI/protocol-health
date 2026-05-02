export const lite = {
    name: 'LITE PROTOCOL',
    goalMode: 'cut',
    tdee: 2600,
    fastDaysPerWeek: 3,
    badge: 'LITE PROTOCOL',
    badgeClass: '',
    descClass: '',
    subtitle: 'Gentle. Sustainable. For every body.',
    bannerColor: 'var(--text)',
    bannerBg: 'var(--surface)',
    bannerBorder: 'var(--border)',
    fastDaysDow: [0, 3, 6], // Sun/Wed/Sat
    lightDaysPerWeek: 0,
    lightDaysDow: [],
    macroSplit: { base:[30,45,25], rest:[35,40,25], preFast:[30,45,25], stall:[35,40,25], satiety:[35,40,25] },
    proteinFloorMultiplier: 1.0,
    // Phase 3 (v7.2.2): plan-direction-aware calorie safety bounds.
    // 'floor' mode → warn if calorie ceiling drops below minCalories.
    // 1200 cal is the general safe minimum for sustained eating without
    // medical supervision (Helms 2014; lower risks lean mass loss + adherence drops).
    caloriesMode: 'floor',
    minCalories: 1200,
    // v7.9.0: per-day-type activity multipliers. Replaces single uniform
    // s.activityLevel for plans that declare this map. Eat-day = chair
    // exercises / tai chi / pilates / walking; fast-day = recovery, no
    // training. Weekly weighted: 4×1.375 + 3×1.20 = 1.30.
    activityByDayType: { eatDay: 1.375, fastDay: 1.20 },

    // Default timing values — used when user hasn't set custom times in Settings
    defaultTimes: { wakeTime:'05:30', lastMealTime:'18:00', eveningSessionTime:'17:00', eatingWindowStart:'11:00' },

    // Week icons for workout grid
    weekIcons: {0:'🚶',1:'🚶',2:'🧘',3:'🚶',4:'🧘',5:'🚶',6:'🧘'},

    // Day-of-week sub-texts for TODAY checklist items
    morningSub: {
      0:'SUNDAY — Rest day. Gentle 15-min walk if desired.',
      1:'MONDAY — Walk 15\u201320 min + Chair Strength A (Upper Body). Seated arm raises, bicep curls, shoulder press, rows.',
      2:'TUESDAY — Tai Chi Flow (Yang style 8-form). Balance, weight transfer, breathing. 25\u201330 min.',
      3:'WEDNESDAY — Walk 15\u201320 min + Chair Strength B (Lower Body). Leg extensions, sit-to-stand, heel raises.',
      4:'THURSDAY — Gentle Yoga (seated + standing). Cat-cow, side stretch, tree pose, breathing. 25\u201330 min.',
      5:'FRIDAY — Walk 15\u201320 min + Chair Strength C (Full Body + Isometrics). Wall push-up, chest press hold, leg hold.',
      6:'SATURDAY — Mat Pilates Basics + Balance Practice. Pelvic tilts, bridge, heel-to-toe walk. 25\u201330 min.'
    },
    eveningSub: {
      0:'SUNDAY — Rest. No structured exercise.',
      1:'MONDAY — Light stretch 5 min. Neck, shoulders, hips.',
      2:'TUESDAY — Tai Chi session. See WORKOUTS tab.',
      3:'WEDNESDAY — Light stretch 5 min. Lower body focus.',
      4:'THURSDAY — Yoga session. See WORKOUTS tab.',
      5:'FRIDAY — Light stretch 5 min. Full body.',
      6:'SATURDAY — Pilates + balance. See WORKOUTS tab.'
    },
    stretchSub: {
      0:'Gentle mobility if desired. Cat-cow, neck rolls.',
      1:'Neck rolls, shoulder shrugs, wrist circles. 5 min.',
      2:'Tai Chi cooldown \u2014 standing breathing, gentle sway.',
      3:'Seated hamstring stretch, ankle circles, calf pumps.',
      4:'Yoga cooldown \u2014 seated meditation, deep breathing.',
      5:'Full body seated stretch \u2014 neck, shoulders, hips, ankles.',
      6:'Pilates cooldown \u2014 lying spinal twist, deep breathing.'
    },

    // Checklist items — normal day and fast day
    // These are used by both TODAY tab and day modal
    checklistNormal: [
      { id:'m1', group:'MORNING', label:'Glass of water on waking', sub:'200\u2013500ml. Hydrate before anything else.' },
      { id:'m2', group:'MORNING', label:'Morning movement (walk or chair exercises)', sub:'See WORKOUTS tab for today\'s session. Start gentle.' },
      { id:'m3', group:'MORNING', label:'Eat a protein-rich breakfast', sub:'Eggs, yogurt, or oats with nuts. Protein first.' },
      { id:'m4', group:'MORNING', label:'Log morning weight (weekly minimum)', sub:'Same conditions: after waking, before food.' },
      { id:'f1', group:'EATING', label:'Protein in every meal', sub:'Eggs, fish, chicken, lentils, dairy, tofu. Aim for palm-sized portion.' },
      { id:'f2', group:'EATING', label:'Stayed near calorie target', sub:'Gentle deficit. Don\'t skip meals.', type:'info' },
      { id:'f3', group:'EATING', label:'Vegetables at lunch and dinner', sub:'Half your plate. Any vegetable counts.' },
      { id:'f4', group:'EATING', label:'1.5\u20132L water across the day', sub:'Sip regularly. Tea and herbal drinks count.', type:'water', waterTarget:1.5 },
      { id:'f5', group:'EATING', label:'No sugary drinks', sub:'Water, tea, black coffee. Avoid juice, soda, sweetened drinks.' },
      { id:'e1', group:'EVENING', label:'Afternoon or evening session (if scheduled)', sub:'Tai chi, yoga, Pilates, or balance work. See WORKOUTS tab.' },
      { id:'e2', group:'EVENING', label:'Light stretch before bed', sub:'5 min gentle stretching. Neck, shoulders, hips.' },
      { id:'s1', group:'SUPPLEMENTS', label:'Daily supplements taken', sub:'Tap to expand',
        subItems: [
          { id:'s1_a', name:'Vitamin D3', dose:'1,000\u20132,000 IU', when:'With breakfast' },
          { id:'s1_b', name:'Omega-3', dose:'1,000mg', when:'With largest meal' },
          { id:'s1_c', name:'Magnesium', dose:'200\u2013300mg', when:'Before bed' }
        ]
      },
      { id:'n1', group:'NIGHT', label:'Wind down by 10PM', sub:'No screens 30 min before bed. Read, stretch, or breathe.' },
      { id:'n2', group:'NIGHT', label:'Sleep 7\u20138 hours', sub:'Recovery happens during sleep. Prioritize it.' }
    ],
    checklistFast: [
      { id:'wf1', group:'FAST', label:'500ml water on waking', sub:'Hydrate first.' },
      { id:'wf2', group:'FAST', label:'Stay hydrated \u2014 2L+ water today', sub:'Sip constantly. Herbal tea allowed.', type:'water', waterTarget:2.0 },
      { id:'wf3', group:'FAST', label:'No food today', sub:'If you feel unwell, eat something. Health first.' },
      { id:'wf4', group:'FAST', label:'Light walk only if feeling good', sub:'No structured exercise on fast days. Listen to your body.' },
      { id:'wf5', group:'FAST', label:'Resume normal eating tomorrow', sub:'Don\'t overeat after a fast. Normal portions.' }
    ],
    checklistLight: [
      { id:'l1', group:'LIGHT', label:'Glass of water on waking', sub:'Start hydrated.' },
      { id:'l2', group:'LIGHT', label:'Light meals only today', sub:'Soup, salad, yogurt, fruit. Eat 300\u2013500 cal below normal.' },
      { id:'l3', group:'LIGHT', label:'Protein in every meal', sub:'Keep to 1.0g/kg minimum even on light days.' },
      { id:'l4', group:'LIGHT', label:'Gentle walk or rest', sub:'15\u201320 min easy walk. Or complete rest. Either is fine.' },
      { id:'l5', group:'LIGHT', label:'1.5L+ water', sub:'Herbal tea counts. Stay hydrated.', type:'water', waterTarget:1.5 },
      { id:'l6', group:'NIGHT', label:'Early to bed', sub:'Recovery day. Sleep well.' }
    ],

    // Eating group tag styling
    foodGroupLabel: 'EATING',
    foodGroupBg: '',
    foodGroupColor: '',

    // Content renderers — return HTML strings
    workoutContent() {
      return `
      <div class="section-title">WALKING + <span>CHAIR STRENGTH</span></div>
      <p class="section-note">15\u201320 min walk + 15\u201320 min seated/standing exercises. Gentle, safe, effective.</p>

      ${workoutCard('CHAIR STRENGTH A \u2014 UPPER BODY','MON \u00b7 Walk + 15\u201320 min',
        exRow('Seated Arm Raises','Sit tall, raise arms overhead slowly','2\u00d710')+
        exRow('Seated Bicep Curls','Light weight or water bottles','2\u00d710')+
        exRow('Seated Shoulder Press','Press up from shoulder height','2\u00d78')+
        exRow('Seated Row (resistance band)','Pull elbows back, squeeze shoulder blades','2\u00d710')+
        exRow('Wrist Circles','Gentle mobility for hands and forearms','10 each way'),
        stretchRow('Neck + Shoulder Stretch','Gentle side bends, shoulder rolls','3 min'),
        'MON'
      )}

      ${workoutCard('CHAIR STRENGTH B \u2014 LOWER BODY','WED \u00b7 Walk + 15\u201320 min',
        exRow('Seated Leg Extensions','Straighten one leg at a time, hold 3 sec','2\u00d710/leg')+
        exRow('Sit-to-Stand','Use chair, stand up fully, sit back controlled','2\u00d78')+
        exRow('Seated Heel Raises','Both feet, slow up and down','2\u00d712')+
        exRow('Seated Toe Raises','Lift toes off floor, hold briefly','2\u00d712')+
        exRow('Seated Marching','Alternate lifting knees gently','2\u00d720'),
        stretchRow('Ankle Circles + Calf Pumps','Seated, 10 each direction per ankle','3 min'),
        'WED'
      )}

      ${workoutCard('CHAIR STRENGTH C \u2014 FULL BODY + ISOMETRICS','FRI \u00b7 Walk + 15\u201320 min',
        exRow('Wall Push-up','Hands on wall, lean in slowly, push back','2\u00d78')+
        exRow('Seated Chest Press Hold','Press palms together at chest, hold','3\u00d710 sec')+
        exRow('Seated Leg Extension Hold','Straighten leg, hold at top','3\u00d710 sec/leg')+
        exRow('Wall Sit (45\u00b0 angle)','Back against wall, slide down gently','2\u00d710\u201315 sec')+
        exRow('Seated Arm Circles','Small circles forward then backward','10 each way'),
        stretchRow('Full Body Seated Stretch','Neck, shoulders, hips, ankles','3 min'),
        'FRI'
      )}

      <div style="height:8px"></div>
      <div class="section-title">TAI CHI \u00b7 YOGA \u00b7 <span>PILATES</span></div>
      <p class="section-note">25\u201330 min sessions. Balance, flexibility, breathing. No impact.</p>

      ${workoutCard('TAI CHI FLOW \u2014 YANG STYLE 8-FORM','TUE \u00b7 25\u201330 min',
        exRow('Wu Ji Stance','Stand quiet, feet shoulder-width, breathe deeply','2 min')+
        exRow('Part the Wild Horse\u2019s Mane','Weight shift L/R with arm sweep','4 reps/side')+
        exRow('White Crane Spreads Wings','Open arms wide, shift to one leg gently','4 reps')+
        exRow('Brush Knee and Push','Step forward, brush knee, push palm','4 reps/side')+
        exRow('Playing the Lute','One foot forward, hands as if holding instrument','4 reps/side')+
        exRow('Reverse Reeling Forearm','Step back, sweep arm across body','4 reps/side')+
        exRow('Wave Hands Like Clouds','Side step with flowing arm movements','6 reps')+
        exRow('Closing Form','Return to Wu Ji, hands to sides, breathe','1 min'),
        stretchRow('Standing Breathing','Deep belly breaths, gentle sway','3 min'),
        'TUE'
      )}

      ${workoutCard('GENTLE YOGA \u2014 SEATED + STANDING','THU \u00b7 25\u201330 min',
        exRow('Seated Cat-Cow','Sit on chair edge, arch and round spine','8 reps')+
        exRow('Seated Side Stretch','One arm up, lean gently to opposite side','4/side')+
        exRow('Seated Forward Fold','Hinge at hips, reach toward floor gently','Hold 20 sec')+
        exRow('Seated Spinal Twist','Turn torso, hand on opposite knee','Hold 20 sec/side')+
        exRow('Standing Tree Pose (chair)','One hand on chair back, foot on ankle','Hold 15 sec/side')+
        exRow('Warrior I Modified','Chair for balance, gentle lunge position','Hold 15 sec/side')+
        exRow('Standing Chest Opener','Clasp hands behind back, lift gently','Hold 15 sec')+
        exRow('Neck Stretches','Ear to shoulder each side, gentle','Hold 15 sec/side'),
        stretchRow('Seated Meditation','Eyes closed, deep breathing','3 min'),
        'THU'
      )}

      ${workoutCard('MAT PILATES BASICS + BALANCE','SAT \u00b7 25\u201330 min',
        exRow('Pelvic Tilts','Lie on back, gently tilt pelvis','2\u00d710')+
        exRow('Bridge','Lie on back, lift hips, hold briefly','2\u00d78')+
        exRow('Single Leg Stretch (modified)','Lie on back, alternate extending legs gently','2\u00d76/leg')+
        exRow('Arm Circles (lying)','Arms to sides, small circles','10 each way')+
        exRow('Spine Twist (lying)','Knees together, drop gently to each side','4/side')+
        exRow('Hundred (modified)','Arms pump gently, breathe 5 in / 5 out','3\u00d710 breaths')+
        exRow('Heel-to-Toe Walk','Straight line, slow and steady','2\u00d710 steps')+
        exRow('Single-Leg Stand','Hold chair if needed, 15 sec each leg','2/side')+
        exRow('Weight Shifts','Shift weight side to side, controlled','10 reps'),
        stretchRow('Lying Spinal Twist + Breathing','Deep relaxation cooldown','3 min'),
        'SAT'
      )}

      ${workoutCard('REST DAY','SUN \u00b7 Optional gentle walk',
        exRow('Gentle Walk','15 min at comfortable pace if desired','Optional')+
        exRow('Seated Stretching','Neck rolls, shoulder shrugs, ankle circles','5 min'),
        stretchRow('Deep Breathing','Relax, recover, be kind to yourself','5 min'),
        'SUN'
      )}`;
    },

    nutritionContent(s) {
      const cal = s.calories || 1500;
      const proteinG = Math.round(cal * 0.30 / 4);
      const carbsG = Math.round(cal * 0.45 / 4);
      const fatG = Math.round(cal * 0.25 / 9);
      const _supOn = s.supplementsEnabled !== false;

      return `
      <div class="section-title">LITE <span>NUTRITION</span></div>
      <p class="section-note">Gentle deficit. 3 meals + snacks. Protein at every meal.</p>
      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val">${cal}</div><div class="macro-lbl">Cal target</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#ff9966">${proteinG}g</div><div class="macro-lbl">Protein (30%)</div></div>
        <div class="macro-box"><div class="macro-val" style="color:var(--accent2)">${carbsG}g</div><div class="macro-lbl">Carbs (45%)</div></div>
        <div class="macro-box"><div class="macro-val" style="color:#88ccff">${fatG}g</div><div class="macro-lbl">Fats (25%)</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-num">GENTLE DEFICIT</div>
        <div class="rule-text">300\u2013500 cal below TDEE. Aim for 0.25\u20130.5 kg/week. Sustainable, not aggressive.</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">MEAL STRUCTURE</div>
        <div class="rule-text">3 meals + 1\u20132 small snacks. Protein in every meal. Vegetables at lunch and dinner. Half your plate = veg.</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">HYDRATION</div>
        <div class="rule-text">1.5\u20132L daily. Sip regularly. Tea, herbal drinks, and water all count.</div>
      </div>
      <div class="rule-card" style="border-left-color:var(--danger)">
        <div class="rule-num">NEVER</div>
        <div class="rule-text">Sugary drinks, deep-fried food, processed snacks. Water, tea, black coffee only.</div>
      </div>
      ${_supOn ? `
      <div class="section-title" style="margin-top:12px">SUPPLEMENTS <span>(OPTIONAL)</span></div>
      <p class="section-note">Consult your doctor before starting any supplements.</p>
      <div class="rule-card">
        <div class="rule-num">VITAMIN D3</div>
        <div class="rule-text">1,000\u20132,000 IU/day with breakfast. Supports bones and immune function. NIH UL: 4,000 IU/day.</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">OMEGA-3</div>
        <div class="rule-text">1,000mg/day with largest meal. Supports heart and joint health. EPA + DHA combined.</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">MAGNESIUM</div>
        <div class="rule-text">200\u2013300mg/day before bed. Supports sleep and muscle recovery. NIH supplemental UL: 350mg.</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">CALCIUM</div>
        <div class="rule-text">If not getting enough from dairy/leafy greens: 500mg/day. Take separately from other minerals.</div>
      </div>
      <div class="rule-card">
        <div class="rule-num">MULTIVITAMIN</div>
        <div class="rule-text">Optional daily multi for general coverage. Choose one formulated for your age group.</div>
      </div>` : `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin-top:12px;font-family:'DM Mono',monospace;font-size:0.65rem;color:var(--muted);line-height:1.6;text-align:center">
        Enable supplement tracking in Settings to see recommendations here.
      </div>`}`;
    },

    rulesContent(s) {
      return `
      <div class="section-title">EATING <span>RULES</span></div>
      ${ruleCard('RULE 01','Protein in every meal.','Eggs, fish, chicken, lentils, dairy, tofu. Palm-sized portion minimum.')}
      ${ruleCard('RULE 02','Vegetables at lunch and dinner.','Half your plate. Any vegetable counts \u2014 fresh, frozen, or cooked.')}
      ${ruleCard('RULE 03','No sugary drinks.','Water, tea, black coffee only. Avoid juice, soda, and sweetened drinks.')}
      ${ruleCard('RULE 04','1.5\u20132 litres of water daily.','Sip regularly throughout the day. Herbal tea counts.')}
      ${ruleCard('RULE 05','Eat 3 meals and 1\u20132 small snacks.','Do not skip meals. Steady energy throughout the day.')}
      ${ruleCard('RULE 06','Gentle calorie deficit.','300\u2013500 cal below TDEE. No crash dieting. Sustainable loss only.')}
      <div class="section-title" style="margin-top:8px">TRAINING <span>RULES</span></div>
      ${ruleCard('RULE 07','Move every day.','Even 15 minutes of walking counts. Something is always better than nothing.','var(--accent2)')}
      ${ruleCard('RULE 08','Chair exercises are real exercises.','Seated strength work builds muscle and bone density. Do not underestimate it.','var(--accent2)')}
      ${ruleCard('RULE 09','Listen to your body.','Pain means stop. Discomfort is OK, sharp pain is not. Rest when needed.','var(--accent2)')}
      ${ruleCard('RULE 10','Balance and flexibility matter.','Tai chi, yoga, and Pilates prevent falls and maintain independence.','var(--accent2)')}
      <div class="section-title" style="margin-top:8px">DISCIPLINE <span>RULES</span></div>
      ${ruleCard('RULE 11','One miss is nothing. Two is a pattern. Three is a choice.','Get back on track the next day. Progress, not perfection.','#88ccff')}
      ${ruleCard('RULE 12','Sleep is non-negotiable.','7\u20138 hours. Recovery happens during sleep. Everything works better when rested.','#88ccff')}
      ${ruleCard('RULE 13','Consult your doctor before starting.','Especially if you have existing conditions, take medications, or have not exercised recently.','#88ccff')}`;
    }
};
