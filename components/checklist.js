// renderTodayChecklist: dynamically builds the TODAY tab checklist from the active plan's
// checklistNormal or checklistFast array. Called on init, plan change, and fast day toggle.
export function renderTodayChecklist() {
  const plan = getActivePlan();
  const s = getSettings();
  const cal = s.calories || 1500;
  const dayType = getDayType(todayStr());
  const day = new Date().getDay();
  const _rawItems = dayType === 'fast' ? plan.checklistFast : (dayType === 'light' && plan.checklistLight ? plan.checklistLight : plan.checklistNormal);
  const _supEnabled = s.supplementsEnabled !== false;
  const items = _rawItems.filter(item => !(item.group === 'SUPPLEMENTS' && !_supEnabled));
  const container = document.getElementById('todayChecklistContainer');
  if(!container) return;

  let html = '';
  let currentGroup = '';
  items.forEach(item => {
    if(item.group !== currentGroup) {
      if(currentGroup) html += '</div>';
      currentGroup = item.group;
      const tagColor = item.group==='MORNING'?'tag-morning':item.group==='EATING'?'tag-food':item.group==='EVENING'?'tag-evening':item.group==='FAST'?'tag-fast':item.group==='LIGHT'?'tag-light':item.group==='SUPPLEMENTS'?'tag-supplements':item.group==='NIGHT'?'tag-night':'tag-rules';
      const groupId = item.group==='EATING'?' id="foodGroup"':item.group==='FAST'?' id="fastGroup"':item.group==='LIGHT'?' id="lightGroup"':'';
      // Group time labels — use dynamic times when available
      const wt = formatTime(getPlanTime(s,'wakeTime'));
      const lmt = formatTime(getPlanTime(s,'lastMealTime'));
      const est = formatTime(getPlanTime(s,'eveningSessionTime'));
      const ew = getEatingWindow(s);
      let timeLabel = '';
      if(item.group==='EATING') timeLabel = cal + ' cal' + (ew ? ' · ' + ew : (lmt ? ' · by ' + lmt : ''));
      else if(item.group==='FAST') timeLabel = 'Zero food protocol';
      else if(item.group==='LIGHT') timeLabel = 'Light eating protocol';
      else if(item.group==='MORNING') timeLabel = wt ? 'From ' + wt : 'Morning';
      else if(item.group==='EVENING') timeLabel = est ? 'From ' + est : 'Evening';
      else if(item.group==='NIGHT') timeLabel = 'Before sleep';
      else if(item.group==='SUPPLEMENTS') timeLabel = dayType === 'fast' ? 'Fast day stack' : 'Eating day stack';
      const foodStyle = (item.group==='EATING' && plan.foodGroupBg) ? ` style="background:${plan.foodGroupBg};color:${plan.foodGroupColor}"` : '';
      html += `<div class="checklist-group"${groupId}><div class="group-header"><span class="group-tag ${tagColor}"${foodStyle}>${item.group==='EATING' ? (plan.foodGroupLabel||'EATING') : item.group}</span><span class="group-time">${timeLabel}</span></div>`;
    }
    // Inject day-specific sub-text for morning/evening/stretch items
    let sub = item.sub;
    let label = item.label;
    if(item.id === 'm3' && plan.morningSub && plan.morningSub[day]) sub = plan.morningSub[day];
    if((item.id === 'e1' || item.id === 'e2') && plan.eveningSub && plan.eveningSub[day]) {
      if(item.id === 'e2' || (item.id === 'e1' && !items.find(i=>i.id==='e2'))) sub = plan.eveningSub[day];
    }
    if(item.id === 'e3' && plan.stretchSub && plan.stretchSub[day]) sub = plan.stretchSub[day];
    // Inject day-aware supplement sub-text — only show today's actual supplements with times
    if(item.group === 'SUPPLEMENTS' && !item.subItems) sub = resolveSupplementSub(item.id, sub, day, dayType, s);
    // Inject dynamic times into labels/subs
    const resolved = resolveItemTimes(item.id, label, sub, s);
    label = resolved.label; sub = resolved.sub;
    // Items with subItems get expandable panel instead of direct toggle
    if(item.subItems && item.subItems.length) {
      const visibleSubs = item.subItems.filter(si => !si.days || si.days.includes(day));
      html += `<div class="check-item has-subitems" onclick="toggleSupExpand(this)" data-id="${item.id}"><div class="checkbox"><span class="checkbox-tick">✓</span></div><div class="item-content"><div class="item-title">${label} <span class="sup-count" id="sup-count-${item.id}"></span></div><div class="item-sub" id="sup-sub-${item.id}"></div><div class="sup-panel" id="sup-panel-${item.id}" style="display:none">`;
      visibleSubs.forEach(si => {
        html += `<div class="sup-item" data-sid="${si.id}" onclick="event.stopPropagation();toggleSupItem(this,'${item.id}')"><div class="sup-cb"><span class="sup-tick">✓</span></div><div><div class="sup-name">${si.name} <span class="sup-dose">${si.dose}</span></div><div class="sup-when">${si.when}</div></div></div>`;
      });
      html += `</div></div><span class="sup-expand-icon">▼</span></div>`;
    } else if(item.type === 'water') {
      const storedWater = getDayLog(todayStr()).water || 0;
      const isDone = storedWater >= item.waterTarget;
      html += `<div class="check-item${isDone ? ' done' : ''}" onclick="toggleWaterExpand(this,'${item.id}',${item.waterTarget})" data-id="${item.id}" data-water-target="${item.waterTarget}">
        <div class="checkbox"><span class="checkbox-tick">✓</span></div>
        <div class="item-content">
          <div class="item-title">${label}</div>
          <div class="item-sub">${sub}</div>
          <div class="water-expand" id="waterExpand-${item.id}" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
            <div style="display:flex;align-items:center;gap:8px">
              <button onclick="event.stopPropagation();adjustWater('${item.id}',${item.waterTarget},-0.25)" style="background:var(--surface2);border:1px solid var(--border);color:var(--text);width:32px;height:32px;border-radius:6px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
              <input type="number" id="waterVal-${item.id}" step="0.25" min="0" max="10" value="${storedWater||0}" onclick="event.stopPropagation()" oninput="event.stopPropagation();onWaterInput('${item.id}',${item.waterTarget},this.value)" style="width:60px;text-align:center;background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:6px;color:var(--text);font-family:'DM Mono',monospace;font-size:0.9rem">
              <button onclick="event.stopPropagation();adjustWater('${item.id}',${item.waterTarget},0.25)" style="background:var(--surface2);border:1px solid var(--border);color:var(--text);width:32px;height:32px;border-radius:6px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
              <span style="font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--muted)">/ ${item.waterTarget}L</span>
            </div>
          </div>
        </div>
      </div>`;
    } else if(item.type === 'info') {
      // Info card — calorie status evaluated via universal plan-aware evaluator (v6.2.0).
      // See evalCalorieStatus() in app.html for the spec (cut/bulk/maintenance branches).
      // Only RED (>=1.5×ceiling for cut, <=0.5×target for bulk) fails the day (calPass=false).
      const dc = getDayCalories(todayStr());
      const ceiling = s.calories || 1500;
      const actual = dc.total || 0;
      const goalMode = plan.goalMode || 'cut';
      const cs = evalCalorieStatus(actual, ceiling, goalMode, dc.hasData);
      const cardBg = cs.bgColor;
      const statusText = cs.statusText;
      const calPass = cs.calPass;
      const iconHtml = !calPass
        ? '<span style="color:var(--danger);font-weight:bold;font-size:12px">\u2717</span>'
        : (cs.band === 'green' ? '<span style="color:var(--accent);font-weight:bold;font-size:10px">\u2714</span>' : '');
      html += `<div class="check-item${calPass ? '' : ' auto-status fail'}" style="background:${cardBg};cursor:default;opacity:0.95" data-id="${item.id}" data-type="info" data-cal-pass="${calPass}"><div style="width:22px;display:flex;align-items:center;justify-content:center">${iconHtml}</div><div class="item-content"><div class="item-title">${label}</div><div style="font-family:'DM Mono',monospace;font-size:0.8rem;margin-top:4px;color:var(--text)" data-cal-status>${statusText}</div></div></div>`;
    } else if(AUTO_WORKOUT_IDS.includes(item.id)) {
      // Auto workout items — reads PER-SESSION counts (morning/evening), not global total
      const wLog = getDayLog(todayStr());
      const sessions = wLog.workoutSessions || {};
      const sessionType = WORKOUT_ITEM_SESSION[item.id] || 'evening';
      // If plan has no morning cards, fall back to evening for morning items
      const sess = sessions[sessionType] || (sessionType === 'morning' ? sessions['evening'] : null) || { total:0, done:0 };
      const sPct = sess.total > 0 ? sess.done / sess.total : 0;
      let wText = 'Open WORKOUTS tab to track';
      if(sess.total > 0) wText = sess.done + '/' + sess.total + ' exercises' + (sess.done === sess.total ? ' — complete' : sPct >= 0.8 ? ' — good' : '');
      const isDone = sess.total > 0 && sPct >= 0.8;
      html += `<div class="check-item auto-status ${isDone ? 'done' : ''}" data-id="${item.id}" data-auto="workout"><div class="checkbox"><span class="checkbox-tick">✓</span></div><div class="item-content"><div class="item-title">${label}</div><div class="auto-val">${wText}</div></div></div>`;
    } else {
      html += `<div class="check-item" onclick="toggle(this)" data-id="${item.id}"><div class="checkbox"><span class="checkbox-tick">✓</span></div><div class="item-content"><div class="item-title">${label}</div><div class="item-sub">${sub}</div></div></div>`;
    }
  });
  if(currentGroup) html += '</div>';
  // If no workout auto-items were rendered (e.g. fast/light day checklists), inject a WORKOUT section
  const hasWorkoutItems = items.some(i => AUTO_WORKOUT_IDS.includes(i.id));
  if(!hasWorkoutItems) {
    const wLog = getDayLog(todayStr());
    const wTotal = wLog.workoutTodayTotal || 0;
    const wDone = wLog.workoutTodayDone || 0;
    const wPct = wTotal > 0 ? wDone / wTotal : 0;
    let wText = 'Open WORKOUTS tab to track';
    if(wTotal > 0) wText = wDone + '/' + wTotal + ' exercises' + (wDone === wTotal ? ' — complete' : wPct >= 0.8 ? ' — good' : '');
    const isDone = wTotal > 0 && wPct >= 0.8;
    html += `<div class="checklist-group"><div class="group-header"><span class="group-tag tag-evening">WORKOUT</span><span class="group-time">See WORKOUTS tab</span></div>`;
    html += `<div class="check-item auto-status ${isDone ? 'done' : ''}" data-id="_workout" data-auto="workout"><div class="checkbox"><span class="checkbox-tick">✓</span></div><div class="item-content"><div class="item-title">Today's training session</div><div class="auto-val">${wText}</div></div></div></div>`;
  }
  container.innerHTML = html;
  loadChecklist();
}

// ─── TODAY CHECKLIST LOAD + HANDLERS (consolidated from the TODAY section) ──

// loadChecklist: reads today's checks from storage and applies done/undone CSS to each item
export function loadChecklist() {
  const log = getDayLog(todayStr());
  const checks = log.checks || {};
  document.querySelectorAll('.check-item').forEach(item=>{
    if(item.classList.contains('has-subitems')) {
      // Load sub-item states and derive parent state
      const panel = item.querySelector('.sup-panel');
      if(panel) {
        const subs = panel.querySelectorAll('.sup-item');
        let subDone = 0, subTotal = subs.length;
        subs.forEach(si => {
          const sid = si.dataset.sid;
          if(checks[sid]) { si.classList.add('done'); subDone++; }
          else si.classList.remove('done');
        });
        // Update parent state: done if all sub-items done, partial if some
        item.classList.remove('done','partial');
        if(subTotal > 0 && subDone === subTotal) { item.classList.add('done'); checks[item.dataset.id] = true; }
        else if(subDone > 0) { item.classList.add('partial'); checks[item.dataset.id] = false; }
        else { checks[item.dataset.id] = false; }
        // Update count display
        updateSupCount(item.dataset.id, subDone, subTotal);
      }
    } else if(!item.dataset.waterTarget && !item.dataset.auto && item.dataset.type !== 'info') {
      // Regular toggleable items only — skip water and auto-status
      item.classList.toggle('done', !!checks[item.dataset.id]);
    }
  });
  // Restore water input values and card states from dayLogs.water
  document.querySelectorAll('.check-item[data-water-target]').forEach(card => {
    const itemId = card.dataset.id;
    const target = parseFloat(card.dataset.waterTarget);
    const storedWater = log.water || 0;
    const input = document.getElementById('waterVal-' + itemId);
    if(input) input.value = storedWater;
    card.classList.toggle('done', storedWater >= target);
  });
  // Sync auto-status items (cal + workout) into checks so calendar/radar see them
  syncAutoStatusChecks();
  updateProgress();
}

// toggleSupExpand: expand/collapse the supplement sub-items panel
export function toggleSupExpand(el) {
  const panel = el.querySelector('.sup-panel');
  const icon = el.querySelector('.sup-expand-icon');
  if(panel) {
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if(icon) icon.classList.toggle('open', !isOpen);
  }
}

// toggleSupItem: toggle individual supplement sub-item checkbox
export function toggleSupItem(el, parentId) {
  el.classList.toggle('done');
  const parentEl = el.closest('.check-item');
  const panel = parentEl.querySelector('.sup-panel');
  const subs = panel.querySelectorAll('.sup-item');
  let subDone = 0, subTotal = subs.length;
  subs.forEach(si => { if(si.classList.contains('done')) subDone++; });
  // Update parent state
  parentEl.classList.remove('done','partial');
  if(subTotal > 0 && subDone === subTotal) parentEl.classList.add('done');
  else if(subDone > 0) parentEl.classList.add('partial');
  // Update count
  updateSupCount(parentId, subDone, subTotal);
  // Save all checks properly (respects item types)
  saveAllChecks();
  updateProgress();
  dispatch('DAY_SAVED');
}

// updateSupCount: update the count display and sub-text for a supplement parent item
export function updateSupCount(parentId, done, total) {
  const countEl = document.getElementById('sup-count-' + parentId);
  const subEl = document.getElementById('sup-sub-' + parentId);
  if(countEl) countEl.textContent = done + '/' + total;
  if(subEl) subEl.textContent = done === total ? 'All taken' : done === 0 ? 'Tap to expand' : done + ' of ' + total + ' taken';
}

// toggle: called when a checklist item is tapped on the TODAY tab.
// Flips its done state, saves all checks to storage, updates the progress bar,
// and fires DAY_SAVED so the calendar cell color updates too.
export function toggle(el) {
  // Water, auto-status, and info items are not manually toggleable
  if(el.dataset.waterTarget || el.dataset.auto || el.dataset.type === 'info') return;
  el.classList.toggle('done');
  saveAllChecks();
  updateProgress();
  dispatch('DAY_SAVED');
}

// ─── WATER TRACKING ────────────────────────────────────────────────────────
// Water checklist items expand inline with a liter input + ±0.25L buttons.
// Saves to dayLogs[today].water and auto-ticks the card when target is met.

export function toggleWaterExpand(el, itemId, target) {
  const expand = document.getElementById('waterExpand-' + itemId);
  if(!expand) return;
  const isVisible = expand.style.display !== 'none';
  expand.style.display = isVisible ? 'none' : 'block';
  if(!isVisible) {
    const input = document.getElementById('waterVal-' + itemId);
    if(input) setTimeout(() => input.focus(), 100);
  }
}

export function onWaterInput(itemId, target, val) {
  const liters = parseFloat(val) || 0;
  saveDayLogField(todayStr(), { water: liters });
  updateWaterCardState(itemId, target, liters);
  dispatch('DAY_SAVED');
}

export function adjustWater(itemId, target, delta) {
  const input = document.getElementById('waterVal-' + itemId);
  if(!input) return;
  const current = parseFloat(input.value) || 0;
  const newVal = Math.max(0, Math.min(10, +(current + delta).toFixed(2)));
  input.value = newVal;
  onWaterInput(itemId, target, newVal);
}

export function updateWaterCardState(itemId, target, liters) {
  const card = document.querySelector(`.check-item[data-id="${itemId}"]`);
  if(!card) return;
  const isDone = liters >= target;
  card.classList.toggle('done', isDone);
  saveAllChecks();
  updateProgress();
}

// saveAllChecks: properly saves all checklist states, respecting item types.
// Skips auto-status items (cal/workout) — those are synced separately via syncAutoStatusChecks.
// Handles: regular items, sub-items, water items, auto-status items.
export function saveAllChecks() {
  const log = getDayLog(todayStr());
  const checks = Object.assign({}, log.checks || {});
  // Regular items (not sub-items parents, not water, not auto-status)
  document.querySelectorAll('.check-item:not(.has-subitems)').forEach(item => {
    if(item.dataset.waterTarget || item.dataset.auto) return;
    // Info items (calorie card): pass/fail based on data-cal-pass attribute
    if(item.dataset.type === 'info') {
      checks[item.dataset.id] = item.dataset.calPass === 'true';
      return;
    }
    checks[item.dataset.id] = item.classList.contains('done');
  });
  // Sub-items parents + their children
  document.querySelectorAll('.check-item.has-subitems').forEach(item => {
    checks[item.dataset.id] = item.classList.contains('done');
    const panel = item.querySelector('.sup-panel');
    if(panel) panel.querySelectorAll('.sup-item').forEach(si => { checks[si.dataset.sid] = si.classList.contains('done'); });
  });
  // Water items — done state from DOM (set by water input logic)
  document.querySelectorAll('.check-item[data-water-target]').forEach(item => {
    checks[item.dataset.id] = item.classList.contains('done');
  });
  // Auto-status items — sync from DOM (set by refreshAutoItems)
  document.querySelectorAll('.check-item[data-auto]').forEach(item => {
    checks[item.dataset.id] = item.classList.contains('done');
  });
  saveDayLogField(todayStr(), { checks });
}

// syncAutoStatusChecks: persists auto-derived states (cal ceiling + workout) into checks
// so the calendar, radar, and progress bar all reflect them
export function syncAutoStatusChecks() {
  const log = getDayLog(todayStr());
  const checks = Object.assign({}, log.checks || {});
  let changed = false;
  document.querySelectorAll('.check-item[data-auto]').forEach(el => {
    const id = el.dataset.id;
    const isDone = el.classList.contains('done');
    if(checks[id] !== isDone) { checks[id] = isDone; changed = true; }
  });
  if(changed) saveDayLogField(todayStr(), { checks });
}

// refreshAutoItems: re-render auto-status items on the TODAY tab without full re-render
// Called when food is logged or workout exercises are checked
export function refreshAutoItems() {
  const s = getSettings();
  const cal = s.calories || 1500;
  const plan = getActivePlan();
  // Refresh calorie info card — update display AND pass/fail state
  document.querySelectorAll('.check-item[data-type="info"]').forEach(el => {
    const dc = getDayCalories(todayStr());
    const actual = dc.total || 0;
    const goalMode = plan.goalMode || 'cut';
    const cs = evalCalorieStatus(actual, cal, goalMode, dc.hasData);
    const cardBg = cs.bgColor;
    const statusText = cs.statusText;
    const calPass = cs.calPass;
    el.style.background = cardBg;
    el.dataset.calPass = String(calPass);
    el.classList.toggle('fail', !calPass);
    // Update icon
    const iconEl = el.querySelector('div:first-child');
    if(iconEl && iconEl.style.width === '22px') {
      iconEl.innerHTML = !calPass
        ? '<span style="color:var(--danger);font-weight:bold;font-size:12px">\u2717</span>'
        : (cs.band === 'green' ? '<span style="color:var(--accent);font-weight:bold;font-size:10px">\u2714</span>' : '');
    }
    const valEl = el.querySelector('[data-cal-status]');
    if(valEl) valEl.textContent = statusText;
    // Persist f2 pass/fail to checks so calendar and radar see it
    const checks = Object.assign({}, getDayLog(todayStr()).checks || {});
    checks[el.dataset.id] = calPass;
    saveDayLogField(todayStr(), { checks });
  });
  // Refresh workout items (per-session: morning/evening tracked independently)
  const _wLog = getDayLog(todayStr());
  const _sessions = _wLog.workoutSessions || {};
  document.querySelectorAll('.check-item[data-auto="workout"]').forEach(el => {
    const itemId = el.dataset.id;
    const sessionType = WORKOUT_ITEM_SESSION[itemId] || 'evening';
    // _workout (fast day injected item) uses global counts
    if(itemId === '_workout') {
      const wTotal = _wLog.workoutTodayTotal || 0;
      const wDone = _wLog.workoutTodayDone || 0;
      const wPct = wTotal > 0 ? wDone / wTotal : 0;
      let wText = 'Open WORKOUTS tab to track';
      const isDone = wTotal > 0 && wPct >= 0.8;
      if(wTotal > 0) wText = wDone + '/' + wTotal + ' exercises' + (wDone === wTotal ? ' — complete' : wPct >= 0.8 ? ' — good' : '');
      el.classList.toggle('done', isDone);
      const valEl = el.querySelector('.auto-val');
      if(valEl) valEl.textContent = wText;
      return;
    }
    // Per-session items (m2/m3 → morning, e1/e2/e3 → evening)
    const sess = _sessions[sessionType] || (sessionType === 'morning' ? _sessions['evening'] : null) || { total:0, done:0 };
    const sPct = sess.total > 0 ? sess.done / sess.total : 0;
    let wText = 'Open WORKOUTS tab to track';
    const isDone = sess.total > 0 && sPct >= 0.8;
    if(sess.total > 0) wText = sess.done + '/' + sess.total + ' exercises' + (sess.done === sess.total ? ' — complete' : sPct >= 0.8 ? ' — good' : '');
    el.classList.toggle('done', isDone);
    const valEl = el.querySelector('.auto-val');
    if(valEl) valEl.textContent = wText;
  });
  syncAutoStatusChecks();
  updateProgress();
}

// resetToday: clears all checklist ticks for today and saves the cleared state
export function resetToday() {
  showConfirm('RESET CHECKLIST', 'Clear all checked items for today?', () => {
    // Clear all manual items
    document.querySelectorAll('.check-item').forEach(i => {
      if(!i.dataset.auto) i.classList.remove('done','partial');
    });
    // Clear sub-item states
    document.querySelectorAll('.sup-item').forEach(i => i.classList.remove('done'));
    // Recompute auto-status items (cal + workout) — they shouldn't be reset
    refreshAutoItems();
    // Save all states properly
    saveAllChecks();
    updateProgress();
    dispatch('DAY_SAVED');
  }, { yesLabel:'RESET', danger:true });
}
