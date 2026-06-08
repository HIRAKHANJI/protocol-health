// ─── CALENDAR ────────────────────────────────────────────────────────────────
// The MONTHS tab shows a calendar grid. Each day cell is color-coded:
//   Green  — all checklist items done
//   Purple — water fast day
//   Orange — partial (some items done)
//   Red    — day has passed with no log (missed)
//   White border — day is part of the active schedule
// Tap any cell to open the day modal for details or to log past data.

// calYear/calMonth track which month is currently displayed
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

// changeMonth: moves the calendar forward (+1) or backward (-1) one month
export function changeMonth(dir) {
  calMonth += dir;
  if(calMonth>11){calMonth=0;calYear++;} if(calMonth<0){calMonth=11;calYear--;}
  renderCalendar();
}

export function renderCalendar() {
  document.getElementById('monthTitle').innerHTML = `${MONTHS_LIST[calMonth]} <span>${calYear}</span>`;
  const now = new Date(); now.setHours(0,0,0,0);
  const todayDateStr = todayStr();
  const firstDay = new Date(calYear,calMonth,1).getDay();
  const daysInMonth = new Date(calYear,calMonth+1,0).getDate();
  const dayLogs = gs(SK.dayLogs)||{};
  const fastDays = gs(SK.fastDays)||{};
  const lightDays = gs(SK.lightDays)||{};
  const weights = gs(SK.weights)||[];
  const sched = gs(SK.schedule)||{};
  const planDaySet = new Set(sched.days||[]);
  const weightMap = {};
  weights.forEach(w=>{ weightMap[w.date]=w.weight; });

  let done=0,fasts=0,lights=0,missed=0,partial=0;
  const grid = document.getElementById('calGridMain');
  grid.innerHTML = '';

  for(let i=0;i<firstDay;i++){const e=document.createElement('div');e.className='cal-cell empty';grid.appendChild(e);}

  for(let d=1;d<=daysInMonth;d++){
    const dt = new Date(calYear,calMonth,d); dt.setHours(0,0,0,0);
    const dateStr = dateToStr(dt);
    const isFuture = dt>now;
    const isToday = dateStr === todayDateStr;
    const isFast = !!fastDays[dateStr];
    const isLight = !!lightDays[dateStr];
    const log = dayLogs[dateStr];
    const wt = weightMap[dateStr];
    const isPlanDay = planDaySet.has(dateStr);

    let cls = 'cal-cell';
    if(isToday) cls+=' today-cal';
    if(isFuture && !isToday) cls+=' future-cal';
    if(isPlanDay) cls+=' plan-day';

    if(isFuture && !isToday){
      // Future days — show day type color as preview
      if(isFast){cls+=' cal-fast';}
      else if(isLight){cls+=' cal-light';}
    }
    else if(isToday) {
      // Current day is ALWAYS in-progress — never classify as missed or partial.
      // Only show done (green) if all items are checked, to give positive feedback.
      // Otherwise show no compliance color — the day is still ongoing.
      // Phase C: a broken fast on today shows orange immediately.
      const _todayBroken = isFast && (typeof isFastBroken === 'function') && isFastBroken(dateStr);
      if(log) {
        const vc = getValidCheckCompletion(dateStr);
        if(isFast && _todayBroken) { cls+=' cal-partial'; partial++; }
        else if(isFast)  { cls+=' cal-fast'; fasts++; }
        else if(isLight){ cls+=' cal-light'; lights++; }
        else if(vc.done > 0 && vc.done === vc.total && vc.total > 0){ cls+=' cal-done'; done++; }
        // Partial or zero checks on today: no color — day is in progress
      } else {
        // No log at all yet today — no color
        if(isFast && _todayBroken) { cls+=' cal-partial'; partial++; }
        else if(isFast) { cls+=' cal-fast'; fasts++; }
        else if(isLight) { cls+=' cal-light'; lights++; }
      }
    }
    else {
      // Past days — judge retroactively
      // Phase C: a fast that was explicitly broken (food logged during active
      // window) renders orange (cal-partial) regardless of checklist state.
      const _pastBroken = isFast && (typeof isFastBroken === 'function') && isFastBroken(dateStr);
      if(isFast && _pastBroken){
        cls+=' cal-partial'; partial++;
      } else if(isFast){
        if(log){
          const vc = getValidCheckCompletion(dateStr);
          if(vc.done===vc.total&&vc.total>0){cls+=' cal-fast'; fasts++;}
          else if(vc.done>0){cls+=' cal-partial';partial++;}
          else{cls+=' cal-fast'; fasts++;}
        } else {cls+=' cal-fast'; fasts++;}
      }
      else if(isLight){
        if(log){
          const vc = getValidCheckCompletion(dateStr);
          if(vc.done===vc.total&&vc.total>0){cls+=' cal-light'; lights++;}
          else if(vc.done>0){cls+=' cal-partial';partial++;}
          else{cls+=' cal-light'; lights++;}
        } else {cls+=' cal-light'; lights++;}
      }
      else if(log){
        const vc = getValidCheckCompletion(dateStr);
        if(vc.done>0&&vc.done<vc.total){cls+=' cal-partial';partial++;}
        else if(vc.done===vc.total&&vc.total>0){cls+=' cal-done';done++;}
        else if(isPlanDay){cls+=' cal-missed';missed++;}
        // No log + not a plan day = no colour. No expectation, no failure.
      } else if(isPlanDay){cls+=' cal-missed';missed++;}
    }

    // Phase 5 (v7.3.0): sickness flag — corner icon overlay (does NOT change cell color)
    const _sick = !!(log && log.sick);
    if (_sick) cls += ' cal-sick';

    const cell = document.createElement('div');
    cell.className = cls;
    cell.innerHTML = `<span class="cal-num">${d}</span>${wt?`<span class="cal-wt">${wt}kg</span>`:''}${_sick?'<span class="cal-sick-icon" aria-label="Marked as sick">🤒</span>':''}`;
    cell.onclick = ()=>openDayModal(dateStr,dt);
    grid.appendChild(cell);
  }

  document.getElementById('monthStats').innerHTML = `
    <div class="mstat"><div class="mstat-val green">${done}</div><div class="mstat-lbl">Done</div></div>
    <div class="mstat"><div class="mstat-val purple">${fasts}</div><div class="mstat-lbl">Fasts</div></div>
    ${lights>0?`<div class="mstat"><div class="mstat-val" style="color:var(--light)">${lights}</div><div class="mstat-lbl">Light</div></div>`:''}
    <div class="mstat"><div class="mstat-val orange">${partial}</div><div class="mstat-lbl">Partial</div></div>
    <div class="mstat"><div class="mstat-val" style="color:var(--danger)">${missed}</div><div class="mstat-lbl">Missed</div></div>`;
}

// ─── DAY MODAL ───────────────────────────────────────────────────────────────
// Opened by tapping any calendar cell. Shows:
// - Toggle to mark day as water fast
// - Weight and water intake inputs
// - Full interactive checklist for past days (or a read-only summary for today)
// - Energy level selector
// - Notes textarea
// - SAVE DAY button writes everything to SK.dayLogs[dateStr]
//
// For TODAY: checklist is shown as a count only — use the TODAY tab to tick off items.
// For PAST DAYS: full interactive checklist displayed directly in the modal.
export function openDayModal(dateStr, dt) {
  const log = getDayLog(dateStr);
  const fastDays = gs(SK.fastDays)||{};
  const isFast = !!fastDays[dateStr];
  const isToday = dateStr === todayStr();
  const now = new Date(); now.setHours(0,0,0,0);
  const isFuture = dt > now;

  document.getElementById('mTitle').textContent = dt.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  document.getElementById('mDate').textContent = dt.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});

  const isLight = isLightDay(dateStr);
  const plan = getActivePlan();

  // Day type toggle buttons — fast and light are mutually exclusive
  let html = `<button class="fast-toggle ${isFast?'active':''}" onclick="toggleFastDay('${dateStr}')">
    ${isFast?'⚡ WATER FAST DAY — TAP TO UNSET':'+ SET AS WATER FAST DAY'}
  </button>`;
  html += `<button class="light-toggle ${isLight?'active':''}" onclick="toggleLightDay('${dateStr}')">
    ${isLight?'🍽 LIGHT EATING DAY — TAP TO UNSET':'+ SET AS LIGHT EATING DAY'}
  </button>`;

  if(isFast) html+=`<div class="fast-protocol-box"><div class="fast-protocol-title">⚡ FAST PROTOCOL</div>
    <div class="fast-protocol-body">Wake: 500ml water + salt · Mid-morning: electrolyte tablet · Allowed: water/black coffee/green tea · Pre-training: electrolyte 20 min before · Sleep: 400mg magnesium<br><strong style="color:#cc4444">Stop if:</strong> palpitations · chest tightness · vision goes dark</div></div>`;

  // Phase C: fast-window editor — shows actual start/end times if logged,
  // or "legacy 24h fast" fallback. Edit button opens the time-picker modal.
  if(isFast && !isFuture && typeof renderDayModalFastEditor === 'function') {
    html += renderDayModalFastEditor(dateStr);
  }

  if(isLight) html+=`<div class="light-protocol-box"><div class="light-protocol-title">🍽 LIGHT EATING PROTOCOL</div>
    <div class="light-protocol-body">Low-cal, easy digestion day. Protein-focused · small portions · no heavy carbs or junk · hydrate well · give the gut a rest<br><strong style="color:var(--light)">Goal:</strong> recovery and digestive reset while maintaining nutrition</div></div>`;

  if(isFuture) {
    // Future day — show schedule info if available
    const sched = gs(SK.schedule);
    if(sched && sched.days && sched.days.includes(dateStr)) {
      const dayNum = sched.days.indexOf(dateStr) + 1;
      html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:10px;font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--muted);line-height:1.8">
        📅 Schedule day ${dayNum} of ${sched.totalDays} · ${sched.planName}</div>`;
    }
    html += `<div style="text-align:center;padding:16px 0;font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--muted)">Future day — use the toggles above to pre-set day type</div>`;
  } else {
    // Weight and water fields
    html += `
    <div class="field-group"><label class="field-label">Weight (kg) — morning, before food</label>
    <input type="number" step="0.1" class="field-input" id="mWeight" value="${log.weight||''}" placeholder="e.g. 103.5"></div>
    <div class="field-group"><label class="field-label">Water intake (L)</label>
    <input type="number" step="0.25" class="field-input" id="mWater" value="${log.water||''}" placeholder="e.g. 3.0"></div>`;

    // Unified checklist — full items, same as TODAY tab
    const dayType = getDayType(dateStr);
    const _modalSupEnabled = getSettings().supplementsEnabled !== false;
    if(isToday) {
      html += `<div class="field-group"><label class="field-label">Today's Checklist — tap items on TODAY tab to check off</label>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--muted);line-height:1.8">`;
      const items = (dayType === 'fast' ? plan.checklistFast : (dayType === 'light' && plan.checklistLight ? plan.checklistLight : plan.checklistNormal)).filter(it => !(it.group === 'SUPPLEMENTS' && !_modalSupEnabled));
      const checks = log.checks || {};
      let doneCount = 0;
      items.forEach(item => { if(checks[item.id]) doneCount++; });
      html += `${doneCount}/${items.length} complete. Use the TODAY tab to check off items — this syncs automatically.</div></div>`;
    } else {
      // Past day — show full interactive checklist
      const items = (dayType === 'fast' ? plan.checklistFast : (dayType === 'light' && plan.checklistLight ? plan.checklistLight : plan.checklistNormal)).filter(it => !(it.group === 'SUPPLEMENTS' && !_modalSupEnabled));
      const checks = log.checks || {};
      let currentGroup = '';
      html += `<div class="field-group"><label class="field-label">Day Checklist</label>`;
      items.forEach(item => {
        if(item.group !== currentGroup) {
          if(currentGroup) html += `</div>`;
          currentGroup = item.group;
          const tagColor = item.group==='MORNING'?'tag-morning':item.group==='EATING'?'tag-food':item.group==='EVENING'?'tag-evening':item.group==='FAST'?'tag-fast':item.group==='LIGHT'?'tag-light':item.group==='SUPPLEMENTS'?'tag-supplements':item.group==='NIGHT'?'tag-night':'tag-rules';
          html += `<div class="modal-check-group"><div class="modal-group-label ${tagColor}" style="margin-bottom:6px">${item.group}</div>`;
        }
        const done = !!checks[item.id];
        let _sub = item.sub;
        const _modalS = getSettings();
        const _modalDay = strToDate(dateStr).getDay();
        if(item.group === 'SUPPLEMENTS' && !item.subItems) _sub = resolveSupplementSub(item.id, _sub, _modalDay, dayType, _modalS);
        const _r = resolveItemTimes(item.id, item.label, _sub, _modalS);
        if(item.subItems && item.subItems.length) {
          const visSubs = item.subItems.filter(si => !si.days || si.days.includes(_modalDay));
          const subDone = visSubs.filter(si => !!checks[si.id]).length;
          const parentDone = subDone === visSubs.length && visSubs.length > 0;
          html += `<div class="modal-check-item ${parentDone?'done':''}" style="flex-direction:column;align-items:stretch">
            <div style="display:flex;align-items:center;gap:8px"><div class="modal-cb">${parentDone?'✓':''}</div><div><div class="m-title">${_r.label} <span style="font-family:'DM Mono',monospace;font-size:0.55rem;color:#82e0aa">${subDone}/${visSubs.length}</span></div></div></div>`;
          visSubs.forEach(si => {
            const siDone = !!checks[si.id];
            html += `<div class="sup-item ${siDone?'done':''}" onclick="toggleModalSupItem(this,'${dateStr}','${si.id}','${item.id}')" style="margin-left:26px"><div class="sup-cb"><span class="sup-tick">✓</span></div><div><div class="sup-name">${si.name} <span class="sup-dose">${si.dose}</span></div><div class="sup-when">${si.when}</div></div></div>`;
          });
          html += `</div>`;
        } else if(item.type === 'water') {
          // Water item — show done based on stored water vs target
          const _waterDone = (log.water || 0) >= (item.waterTarget || 0);
          html += `<div class="modal-check-item ${_waterDone?'done':''}" style="cursor:default">
            <div class="modal-cb">${_waterDone?'✓':''}</div>
            <div><div class="m-title">${_r.label}</div><div class="m-sub">${(log.water||0)}L / ${item.waterTarget}L</div></div>
          </div>`;
        } else if(item.type === 'info') {
          // Info card — calorie status. Severe overshoot (>50%) counts as failure.
          const _dc = getDayCalories(dateStr);
          const _ceil = _modalS.calories || 1500;
          const _act = _dc.total || 0;
          let _infoBg = 'var(--surface)', _infoText = '0 / ' + _ceil + ' cal', _calFail = false;
          if(_dc.hasData) {
            if(_act <= _ceil) { _infoBg = 'rgba(76,175,80,0.15)'; _infoText = _act + ' / ' + _ceil + ' cal \u2714'; }
            else if(_act <= _ceil * 1.5) { _infoBg = 'rgba(255,152,0,0.15)'; _infoText = _act + ' / ' + _ceil + ' cal \u00b7 ' + (_act-_ceil) + ' over'; }
            else { _infoBg = 'rgba(244,67,54,0.15)'; _infoText = _act + ' / ' + _ceil + ' cal \u00b7 ' + (_act-_ceil) + ' over'; _calFail = true; }
          }
          html += `<div class="modal-check-item" style="background:${_infoBg};cursor:default">
            <div style="width:22px;display:flex;align-items:center;justify-content:center">${_calFail ? '<span style="color:var(--danger);font-weight:bold;font-size:12px">\u2717</span>' : (_dc.hasData && _act <= _ceil ? '<span style="color:var(--accent);font-weight:bold;font-size:10px">\u2714</span>' : '')}</div>
            <div><div class="m-title">${_r.label}</div><div style="font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--text)">${_infoText}</div></div>
          </div>`;
        } else if(AUTO_WORKOUT_IDS.includes(item.id)) {
          // Auto workout — per-session counts
          const _mSessions = log.workoutSessions || {};
          const _mSessType = WORKOUT_ITEM_SESSION[item.id] || 'evening';
          const _mSess = _mSessions[_mSessType] || (_mSessType === 'morning' ? _mSessions['evening'] : null) || { total:0, done:0 };
          const _mPct = _mSess.total > 0 ? _mSess.done / _mSess.total : 0;
          const _mIsDone = _mSess.total > 0 && _mPct >= 0.8;
          html += `<div class="modal-check-item ${_mIsDone?'done':''}" style="cursor:default">
            <div class="modal-cb">${_mIsDone?'✓':''}</div>
            <div><div class="m-title">${_r.label}</div><div class="m-sub">${_mSess.total > 0 ? _mSess.done+'/'+_mSess.total+' exercises' : 'No workout data'}</div></div>
          </div>`;
        } else {
          html += `<div class="modal-check-item ${done?'done':''}" onclick="toggleModalCheck(this,'${dateStr}','${item.id}')">
            <div class="modal-cb">${done?'✓':''}</div>
            <div><div class="m-title">${_r.label}</div><div class="m-sub">${_r.sub}</div></div>
          </div>`;
        }
      });
      html += `</div></div>`;
    }

    // Workout checklist for this day — expandable with all exercises
    const dayWChecks = log.workoutChecks || {};
    const wxDone = Object.values(dayWChecks).filter(Boolean).length;
    const wxTotal = Object.keys(dayWChecks).length;
    const wxSummary = wxTotal > 0 ? `${wxDone}/${wxTotal} exercises done` : 'No exercises tracked';
    html += `<div class="field-group"><label class="field-label">Workout</label>`;
    html += `<button id="mWorkoutBtn" onclick="toggleModalWorkoutChecklist('${dateStr}')" style="width:100%;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:all 0.15s">
      <span style="font-family:'DM Mono',monospace;font-size:0.68rem;color:${wxTotal>0&&wxDone===wxTotal?'var(--accent)':'var(--muted)'}">${wxSummary}</span>
      <span style="font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--accent);letter-spacing:1px">SEE WORKOUT CHECKLIST</span>
    </button>`;
    html += `<div id="mWorkoutPanel" style="display:none;margin-top:8px"></div></div>`;

    // Food log for this day
    const dayFoodData = getDayCalories(dateStr);
    const mealCeiling = getSettings().calories || 1500;
    html += `<div class="field-group"><label class="field-label">Food Log</label>`;
    if(dayFoodData.entries.length) {
      html += `<div class="food-log-wrap" style="margin-bottom:8px">`;
      dayFoodData.entries.forEach(e => {
        html += `<div class="food-entry">
          <div class="food-entry-info"><div class="food-entry-name">${esc(e.name)}</div>${e.notes ? `<div class="food-entry-notes">${esc(e.notes)}</div>` : ''}</div>
          <div class="food-entry-cal">${e.calories}</div>
          <button class="food-entry-del" onclick="removeFoodFromModal('${dateStr}','${e.id}')">×</button>
        </div>`;
      });
      const fCls = dayFoodData.total > mealCeiling ? 'cal-over' : (mealCeiling - dayFoodData.total) <= 100 ? 'cal-near' : 'cal-under';
      const fRemain = mealCeiling - dayFoodData.total;
      html += `<div class="food-total-bar"><span style="font-size:0.6rem">${fRemain >= 0 ? fRemain + ' remaining' : Math.abs(fRemain) + ' over'}</span><span class="food-total-val ${fCls}">${dayFoodData.total} cal</span></div>`;
      html += `</div>`;
    }
    html += `<div style="display:flex;gap:6px;margin-top:4px">
      <input class="field-input" type="text" id="mFoodName" placeholder="Food name" style="flex:2">
      <input class="field-input" type="number" id="mFoodCal" placeholder="Cal" style="max-width:70px" min="0">
      <button class="food-add-btn" onclick="addFoodFromModal('${dateStr}')">ADD</button>
    </div>
    <div style="margin-top:4px;padding:0 2px">
      <div style="font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:2px;color:var(--muted);margin-bottom:4px">MACROS \u2014 OPTIONAL</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        <input type="number" id="mFoodProtein" placeholder="Protein g" min="0" step="1" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:6px 8px;color:var(--text);font-family:'DM Mono',monospace;font-size:0.72rem;outline:none;width:100%">
        <input type="number" id="mFoodCarbs" placeholder="Carbs g" min="0" step="1" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:6px 8px;color:var(--text);font-family:'DM Mono',monospace;font-size:0.72rem;outline:none;width:100%">
        <input type="number" id="mFoodFat" placeholder="Fat g" min="0" step="1" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:6px 8px;color:var(--text);font-family:'DM Mono',monospace;font-size:0.72rem;outline:none;width:100%">
      </div>
    </div></div>`;

    // Exercise levels for this day (AGRO only)
    const dayExLevels = (gs(SK.exLevels) || {})[dateStr];
    if(dayExLevels && typeof EXERCISE_PROGRESSIONS !== 'undefined') {
      html += `<div class="field-group"><label class="field-label">Exercise Levels</label><div class="ex-level-history">`;
      Object.entries(dayExLevels).forEach(([gid, lvl]) => {
        // Instance keys like 'push_2' map back to base groupId 'push'
        const baseGid = gid.replace(/_\d+$/, '');
        const prog = EXERCISE_PROGRESSIONS[gid] || EXERCISE_PROGRESSIONS[baseGid];
        const lvlData = prog ? prog.levels.find(l => l.level === lvl) : null;
        if(prog && lvlData) {
          const suffix = gid !== baseGid ? ` (#${gid.split('_')[1]})` : '';
          html += `${prog.name}${suffix}: Lv ${lvl} (${lvlData.exercise})<br>`;
        }
      });
      html += `</div></div>`;
    }

    // Energy + notes (custom dropdown — native <select> can't be styled on Android Chrome)
    const energyVal = log.energy || '';
    const energyOptions = [
      {value:'', label:'— select —'},
      {value:'high', label:'High — sharp & focused'},
      {value:'normal', label:'Normal — functional'},
      {value:'low', label:'Low — dragging'},
      {value:'crashed', label:'Crashed — barely made it'}
    ];
    const energyTriggerText = (energyOptions.find(o=>o.value===energyVal)||energyOptions[0]).label;
    html += `<div class="field-group"><label class="field-label">Energy level</label>
    <select class="field-input plan-select" id="mEnergy">
      ${energyOptions.map(o=>`<option value="${o.value}" ${o.value===energyVal?'selected':''}>${o.label}</option>`).join('')}
    </select>
    <div class="custom-select" id="energySelectCustom">
      <div class="custom-select-trigger" id="energySelectTrigger" onclick="toggleCustomSelect('energySelectCustom')">${energyTriggerText}</div>
      <div class="custom-select-dropdown">
        ${energyOptions.map(o=>`<div class="custom-select-option${o.value===energyVal?' selected':''}" data-value="${o.value}" onclick="selectCustomOption('energySelectCustom','mEnergy',this)">${o.label}</div>`).join('')}
      </div>
    </div></div>
    <!-- Phase 5 (v7.3.0): sickness flag — excluded by Phase 6 calibration -->
    <label class="sick-toggle-row">
      <input type="checkbox" id="mSick" ${log.sick?'checked':''} onchange="toggleSickDay('${dateStr}', this.checked)">
      <span>🤒 Mark this day as sick / disrupted</span>
    </label>
    <div class="field-group"><label class="field-label">Notes</label>
    <textarea class="field-input" id="mNotes" placeholder="How did today go?">${esc(log.notes||'')}</textarea></div>
    <button class="save-btn" onclick="saveDayLog('${dateStr}')">SAVE DAY</button>`;
  }

  document.getElementById('mBody').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('active');
}

// toggleModalCheck: called when a past-day checklist item is tapped inside the day modal.
// Updates storage for that specific date without touching today's checklist.
export function toggleModalCheck(el, dateStr, itemId) {
  el.classList.toggle('done');
  const cb = el.querySelector('.modal-cb');
  const isDone = el.classList.contains('done');
  cb.textContent = isDone ? '✓' : '';
  el.querySelector('.m-title').style.textDecoration = isDone ? 'line-through' : '';
  // Read current checks for this day and update
  const log = getDayLog(dateStr);
  const checks = Object.assign({}, log.checks||{});
  checks[itemId] = isDone;
  saveDayLogField(dateStr, { checks });
  dispatch('DAY_SAVED');
}

// toggleModalSupItem: toggle a supplement sub-item in the day modal for past days
export function toggleModalSupItem(el, dateStr, subId, parentId) {
  el.classList.toggle('done');
  const log = getDayLog(dateStr);
  const checks = Object.assign({}, log.checks||{});
  checks[subId] = el.classList.contains('done');
  // Recalculate parent state from all sibling sub-items
  const parentEl = el.closest('.modal-check-item');
  const siblings = parentEl.querySelectorAll('.sup-item');
  let subDone = 0, subTotal = siblings.length;
  siblings.forEach(si => { if(si.classList.contains('done')) subDone++; });
  const allDone = subDone === subTotal && subTotal > 0;
  checks[parentId] = allDone;
  parentEl.classList.toggle('done', allDone);
  const parentCb = parentEl.querySelector('.modal-cb');
  if(parentCb) parentCb.textContent = allDone ? '✓' : '';
  saveDayLogField(dateStr, { checks });
  dispatch('DAY_SAVED');
}

// ─── MODAL WORKOUT CHECKLIST ─────────────────────────────────────────────────
// Renders all exercises for a specific date's day-of-week inside the day modal.
// Uses a hidden container to run workoutContent() and extract exercise rows.

export function toggleModalWorkoutChecklist(dateStr) {
  const panel = document.getElementById('mWorkoutPanel');
  if(!panel) return;
  // If already open, close it
  if(panel.style.display !== 'none') {
    panel.style.display = 'none';
    const btn = document.getElementById('mWorkoutBtn');
    if(btn) btn.querySelector('span:last-child').textContent = 'SEE WORKOUT CHECKLIST';
    return;
  }

  const plan = getActivePlan();
  const s = getSettings();
  const targetDow = strToDate(dateStr).getDay();
  const targetDay = DAYS_SHORT[targetDow]; // 'MON', 'TUE', etc.

  // Generate all workout cards in a hidden container to extract exercises
  const temp = document.createElement('div');
  temp.style.display = 'none';
  document.body.appendChild(temp);
  _resetExRowInstances();
  temp.innerHTML = plan.workoutContent(s);

  // Read saved workout checks for this date
  const log = getDayLog(dateStr);
  const wChecks = Object.assign({}, log.workoutChecks || {});

  let html = '';
  let exerciseCount = 0;

  temp.querySelectorAll('.workout-card').forEach(card => {
    const daysAttr = card.dataset.days;
    // Only show cards for this date's day-of-week
    if(daysAttr && daysAttr !== 'DAILY' && !daysAttr.split(',').includes(targetDay)) return;

    const title = card.querySelector('h3');
    const meta = card.querySelector('.meta');
    html += `<div style="margin-bottom:10px"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.8rem;letter-spacing:1.5px;color:var(--accent);margin-bottom:4px">${title ? title.textContent : 'WORKOUT'}</div>`;
    if(meta) html += `<div style="font-family:'DM Mono',monospace;font-size:0.5rem;color:var(--muted);margin-bottom:6px">${meta.textContent}</div>`;

    const cardSession = classifyWorkoutCard(card);
    if(cardSession === 'rest') return;
    card.querySelectorAll('.wex-row').forEach(row => {
      const wid = row.dataset.wid;
      if(!wid) return;
      exerciseCount++;
      const nameEl = row.querySelector('.ex-name');
      const setsEl = row.querySelector('.ex-sets');
      const name = nameEl ? nameEl.textContent : '';
      const sets = setsEl ? setsEl.textContent : '';
      const isStretch = nameEl && nameEl.style.color === 'rgb(221, 136, 255)';
      const isDone = !!wChecks[wid];
      html += `<div class="modal-check-item ${isDone?'done':''}" data-session="${cardSession}" onclick="toggleModalWorkoutEx(this,'${dateStr}','${wid}')" style="padding:6px 8px;margin-bottom:3px">
        <div class="modal-cb">${isDone?'✓':''}</div>
        <div style="flex:1;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:0.72rem;${isStretch?'color:#dd88ff':''}">${name}</span>
          <span style="font-family:'DM Mono',monospace;font-size:0.6rem;color:${isStretch?'#dd88ff':'var(--accent2)'}">${sets}</span>
        </div>
      </div>`;
    });
    html += `</div>`;
  });

  // Clean up temp container
  document.body.removeChild(temp);
  // Reset wex counter so WORKOUTS tab still renders correctly after
  _resetExRowInstances();

  if(exerciseCount === 0) {
    html = `<div style="padding:10px;font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--muted);text-align:center">No exercises scheduled for ${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][targetDow]}</div>`;
  }

  panel.innerHTML = html;
  panel.style.display = 'block';

  // Update button text
  const btn = document.getElementById('mWorkoutBtn');
  if(btn) {
    const doneCount = Object.values(wChecks).filter(Boolean).length;
    btn.querySelector('span:last-child').textContent = 'HIDE WORKOUT CHECKLIST';
  }
}

export function toggleModalWorkoutEx(el, dateStr, wid) {
  el.classList.toggle('done');
  const cb = el.querySelector('.modal-cb');
  const isDone = el.classList.contains('done');
  cb.textContent = isDone ? '✓' : '';

  // Update workoutChecks in storage
  const log = getDayLog(dateStr);
  const wChecks = Object.assign({}, log.workoutChecks || {});
  wChecks[wid] = isDone;

  // Count totals and per-session data
  const panel = document.getElementById('mWorkoutPanel');
  let total = 0, done = 0;
  const sessions = {};
  if(panel) {
    panel.querySelectorAll('.modal-check-item').forEach(item => {
      total++;
      if(item.classList.contains('done')) done++;
      const sess = item.dataset.session;
      if(sess) {
        if(!sessions[sess]) sessions[sess] = { total:0, done:0 };
        sessions[sess].total++;
        if(item.classList.contains('done')) sessions[sess].done++;
      }
    });
  }

  saveDayLogField(dateStr, { workoutChecks: wChecks, workoutTodayTotal: total, workoutTodayDone: done, workoutSessions: sessions });

  // v8.0.0 (M7 fix) + v8.2.0 extension: auto-derive _workout AND per-session
  // AUTO_WORKOUT_IDS items (m2/m3 → morning, e1/e2/e3 → evening) for the
  // affected past date so calendar coloring + getValidCheckCompletion reflect
  // the new exercise completion state without waiting for next app init's
  // migrateOrphanedChecks pass. Mirrors the refreshAutoItems behaviour that
  // runs only for TODAY in components/checklist.js. Threshold (>=80% completion
  // → done) matches refreshAutoItems exactly.
  if (total > 0) {
    const newChecks = Object.assign({}, (getDayLog(dateStr).checks || {}));
    // Per-session AUTO_WORKOUT items (eating-day checklists)
    const wim = (typeof WORKOUT_ITEM_SESSION !== 'undefined') ? WORKOUT_ITEM_SESSION : {};
    Object.keys(wim).forEach(itemId => {
      const sessType = wim[itemId];
      const sess = sessions[sessType];
      if(sess && sess.total > 0) {
        newChecks[itemId] = (sess.done / sess.total) >= 0.8;
      }
    });
    // _workout global aggregate (fast/light days where AUTO_WORKOUT items
    // aren't in the checklist — pseudo-item handled by getValidCheckCompletion)
    newChecks._workout = (done / total) >= 0.8;
    saveDayLogField(dateStr, { checks: newChecks });
  }

  // Update summary button
  const btn = document.getElementById('mWorkoutBtn');
  if(btn) {
    const summarySpan = btn.querySelector('span:first-child');
    if(summarySpan) {
      summarySpan.textContent = `${done}/${total} exercises done`;
      summarySpan.style.color = done === total ? 'var(--accent)' : 'var(--muted)';
    }
  }

  dispatch('DAY_SAVED');
  dispatch('WORKOUT_CHECKED');
}

// toggleFastDay: marks or unmarks a date as a water fast day, then re-opens the modal
// so the UI immediately reflects the change (fast protocol box appears/disappears).
// Also clears light day if setting fast (mutually exclusive).
export function toggleFastDay(dateStr) {
  const fd = gs(SK.fastDays)||{};
  // v8.0.0 (H3 fix): record explicit user unsets so a later schedule extension
  // doesn't auto-re-mark the date. Mark TURNED-ON dates remove any prior unset
  // (user's latest action wins). Manual overrides are stored in SK.fastDayUnsets.
  const fdu = gs(SK.fastDayUnsets)||{};
  if(fd[dateStr]) {
    delete fd[dateStr];
    fdu[dateStr] = true; // record the unset
  } else {
    fd[dateStr]=true;
    delete fdu[dateStr]; // user re-set it; clear any prior unset record
    // Clear light day if exists (mutually exclusive)
    const ld = gs(SK.lightDays)||{};
    if(ld[dateStr]) { delete ld[dateStr]; ss(SK.lightDays, ld); }
  }
  ss(SK.fastDays, fd);
  ss(SK.fastDayUnsets, fdu);
  dispatch('FAST_DAY_TOGGLED');
  openDayModal(dateStr,strToDate(dateStr));
}

// toggleLightDay: marks or unmarks a date as a light eating day, then re-opens the modal.
// Also clears fast day if setting light (mutually exclusive).
export function toggleLightDay(dateStr) {
  const ld = gs(SK.lightDays)||{};
  // v8.0.0 (H3 fix): track explicit unsets in SK.lightDayUnsets, parallel to fastDayUnsets.
  const ldu = gs(SK.lightDayUnsets)||{};
  if(ld[dateStr]) {
    delete ld[dateStr];
    ldu[dateStr] = true;
  } else {
    ld[dateStr]=true;
    delete ldu[dateStr];
    // Clear fast day if exists (mutually exclusive)
    const fd = gs(SK.fastDays)||{};
    if(fd[dateStr]) { delete fd[dateStr]; ss(SK.fastDays, fd); }
  }
  ss(SK.lightDays, ld);
  ss(SK.lightDayUnsets, ldu);
  dispatch('FAST_DAY_TOGGLED');
  openDayModal(dateStr,strToDate(dateStr));
}

// saveDayLog: reads all fields from the open day modal and writes them to SK.dayLogs.
// If a weight was entered it also adds/updates the weight log entry for that date.
export function saveDayLog(dateStr) {
  const wt = parseFloat(document.getElementById('mWeight')?.value);
  const water = parseFloat(document.getElementById('mWater')?.value);
  const energy = document.getElementById('mEnergy')?.value||null;
  const notes = document.getElementById('mNotes')?.value||'';

  const fields = { energy: energy||null, notes, ts: Date.now() };
  if(!isNaN(water) && water >= 0) fields.water = water;
  saveDayLogField(dateStr, fields);

  if(!isNaN(wt) && wt >= 40 && wt <= 250) {
    const weights = gs(SK.weights)||[];
    const idx = weights.findIndex(w=>w.date===dateStr);
    if(idx>=0) weights.splice(idx,1);
    weights.unshift({date:dateStr, weight:wt, ts:Date.now()});
    weights.sort((a,b)=>b.date.localeCompare(a.date));
    ss(SK.weights, weights);
    saveDayLogField(dateStr, { weight: wt });
    renderWeights();
    // v7.10.1: parity with logWeight / logWeightFromToday — when saveDayLog
    // writes the latest weight, settings.currentKg and TDEE must resync, or
    // the goal calculator + projection keep using stale weight. Both helpers
    // are no-ops when the saved weight isn't the latest, so the past-date
    // edit path is safe.
    if (typeof syncCurrentKgFromLatestWeight === 'function') syncCurrentKgFromLatestWeight();
    if (typeof recomputeAndApplyTDEE === 'function') recomputeAndApplyTDEE();
    dispatch('WEIGHT_LOGGED');
  }
  closeModal();
  dispatch('DAY_SAVED');
}

export function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  // Always re-render calendar when modal closes to ensure cell colors reflect any check changes
  if(document.getElementById('tab-months').classList.contains('active')) renderCalendar();
}
document.getElementById('modalOverlay').addEventListener('click',e=>{if(e.target.id==='modalOverlay')closeModal();});
