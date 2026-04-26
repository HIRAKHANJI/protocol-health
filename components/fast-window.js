// ─── FAST WINDOWS — Phase C ──────────────────────────────────────────────────
// Replaces the boolean fast-day model with start/stop timestamps. Old fast
// days (SK.fastDays) remain valid and are interpreted as 24-hour fasts when
// no window exists. Going forward, every fast day requires explicit START /
// STOP user action.
//
// Storage shape (under SK.fastWindows = 'ph_fw_v1'):
//   { "YYYY-MM-DD": [
//       { start: ISO_string,
//         end:   ISO_string | null,
//         broken: boolean,
//         brokenBy: [foodEntryId, ...] }
//     ] }
//
// Convention: window is stored under the date the fast PRIMARILY belongs to
// (matches SK.fastDays). The `start` ISO can be on the previous calendar
// date if the user starts the fast the night before (overnight fast pattern).

// ─── READ HELPERS ────────────────────────────────────────────────────────────

export function getFastWindows(dateStr) {
  const all = gs(SK.fastWindows) || {};
  return all[dateStr] || [];
}

export function getActiveFastWindow(dateStr) {
  const wins = getFastWindows(dateStr);
  // "Active" = started but not yet ended AND not broken. Most recent open one.
  for (let i = wins.length - 1; i >= 0; i--) {
    if (wins[i].start && !wins[i].end && !wins[i].broken) return wins[i];
  }
  return null;
}

export function getMostRecentWindow(dateStr) {
  const wins = getFastWindows(dateStr);
  return wins.length ? wins[wins.length - 1] : null;
}

export function isFastBroken(dateStr) {
  const wins = getFastWindows(dateStr);
  return wins.some(w => w.broken === true);
}

// Returns total fasted duration in hours for a date.
// - Sums (end - start) across all windows; null end = now (live timer).
// - Falls back to 24h if no windows exist but SK.fastDays[date] is true.
// - Returns 0 otherwise.
export function getFastDurationHours(dateStr) {
  const wins = getFastWindows(dateStr);
  if (wins.length === 0) {
    const fd = gs(SK.fastDays) || {};
    return fd[dateStr] ? 24 : 0;
  }
  const now = Date.now();
  let totalMs = 0;
  for (const w of wins) {
    if (!w.start) continue;
    const startMs = new Date(w.start).getTime();
    const endMs = w.end ? new Date(w.end).getTime() : now;
    if (endMs > startMs) totalMs += (endMs - startMs);
  }
  return totalMs / 3600000;
}

// ─── WRITE HELPERS ───────────────────────────────────────────────────────────

function _writeWindows(dateStr, wins) {
  const all = gs(SK.fastWindows) || {};
  if (wins.length === 0) {
    delete all[dateStr];
  } else {
    all[dateStr] = wins;
  }
  ss(SK.fastWindows, all);
}

export function startFast(dateStr) {
  const date = dateStr || todayStr();
  const wins = getFastWindows(date);
  // If there's already an active (open, unbroken) window, do nothing.
  if (getActiveFastWindow(date)) return false;
  wins.push({
    start: new Date().toISOString(),
    end: null,
    broken: false,
    brokenBy: []
  });
  _writeWindows(date, wins);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

export function endFast(dateStr) {
  const date = dateStr || todayStr();
  const wins = getFastWindows(date);
  const win = getActiveFastWindow(date);
  if (!win) return false;
  win.end = new Date().toISOString();
  _writeWindows(date, wins);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

export function markFastBroken(dateStr, foodEntryId, foodTs) {
  const wins = getFastWindows(dateStr);
  const win = getActiveFastWindow(dateStr);
  if (!win) return false;
  win.broken = true;
  win.end = foodTs ? new Date(foodTs).toISOString() : new Date().toISOString();
  win.brokenBy = win.brokenBy || [];
  if (foodEntryId) win.brokenBy.push(foodEntryId);
  _writeWindows(dateStr, wins);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// Retroactive edit. idx defaults to most-recent window.
// startISO and endISO can be null to clear; '' is treated as null.
export function editFastWindow(dateStr, idx, startISO, endISO, broken) {
  const wins = getFastWindows(dateStr);
  if (!wins.length) {
    // No window yet — create one
    wins.push({ start: startISO || null, end: endISO || null, broken: !!broken, brokenBy: [] });
  } else {
    const i = (idx == null) ? wins.length - 1 : idx;
    if (i < 0 || i >= wins.length) return false;
    wins[i].start = startISO || null;
    wins[i].end   = endISO   || null;
    wins[i].broken = !!broken;
    if (!broken) wins[i].brokenBy = [];
  }
  _writeWindows(dateStr, wins);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

export function deleteFastWindow(dateStr, idx) {
  const wins = getFastWindows(dateStr);
  const i = (idx == null) ? wins.length - 1 : idx;
  if (i < 0 || i >= wins.length) return false;
  wins.splice(i, 1);
  _writeWindows(dateStr, wins);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// ─── FORMATTERS ──────────────────────────────────────────────────────────────

function _fmtHM(hoursDecimal) {
  if (!isFinite(hoursDecimal) || hoursDecimal < 0) return '0h 0m';
  const h = Math.floor(hoursDecimal);
  const m = Math.floor((hoursDecimal - h) * 60);
  return h + 'h ' + m + 'm';
}

function _fmtTime(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function _isoToDateStr(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return dateToStr(d);
}

// ─── TODAY TAB UI ────────────────────────────────────────────────────────────

export function renderTodayFastUI() {
  const container = document.getElementById('fastBannerControls');
  if (!container) return;
  const today = todayStr();
  const isFast = isFastDay(today);
  if (!isFast) { container.innerHTML = ''; return; }

  const win = getActiveFastWindow(today);
  const recent = getMostRecentWindow(today);
  let html = '';

  if (win) {
    // Active fast in progress
    const elapsed = (Date.now() - new Date(win.start).getTime()) / 3600000;
    html += `<div class="fw-state">
      <div class="fw-timer">FASTING <span id="fwTimerVal">${_fmtHM(elapsed)}</span></div>
      <div class="fw-meta">Started ${_fmtTime(win.start)}</div>
    </div>
    <div class="fw-btn-row">
      <button class="fw-btn fw-btn-end" onclick="endFastFromBanner()">■ END FAST</button>
      <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${today}')">✎ EDIT</button>
    </div>`;
  } else if (recent && recent.broken) {
    // Broken fast — most recent window was broken
    const dur = recent.end ? (new Date(recent.end).getTime() - new Date(recent.start).getTime()) / 3600000 : 0;
    html += `<div class="fw-state fw-state-broken">
      <div class="fw-broken-pill">⚠ FAST BROKEN at ${_fmtTime(recent.end)}</div>
      <div class="fw-meta">Fasted ${_fmtHM(dur)} before break</div>
    </div>
    <div class="fw-btn-row">
      <button class="fw-btn fw-btn-start" onclick="startFastFromBanner()">▶ START NEW FAST</button>
      <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${today}')">✎ EDIT</button>
    </div>`;
  } else if (recent && recent.end) {
    // Completed fast
    const dur = (new Date(recent.end).getTime() - new Date(recent.start).getTime()) / 3600000;
    html += `<div class="fw-state fw-state-done">
      <div class="fw-timer">FAST DONE ✓ <span>${_fmtHM(dur)}</span></div>
      <div class="fw-meta">${_fmtTime(recent.start)} → ${_fmtTime(recent.end)}</div>
    </div>
    <div class="fw-btn-row">
      <button class="fw-btn fw-btn-start" onclick="startFastFromBanner()">▶ START NEW FAST</button>
      <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${today}')">✎ EDIT</button>
    </div>`;
  } else {
    // No window started yet today — fast day waiting for user input
    html += `<div class="fw-state">
      <div class="fw-timer">READY TO FAST</div>
      <div class="fw-meta">Tap START when you begin. Log when you end.</div>
    </div>
    <div class="fw-btn-row">
      <button class="fw-btn fw-btn-start" onclick="startFastFromBanner()">▶ START FAST</button>
      <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${today}')">✎ EDIT TIMES</button>
    </div>`;
  }
  container.innerHTML = html;
}

// Wrapper handlers exposed to onclick (need the today date computed at click time)
export function startFastFromBanner() { startFast(); renderTodayFastUI(); }
export function endFastFromBanner()   { endFast();   renderTodayFastUI(); }

// Background tick — refreshes the live timer text without rebuilding the banner.
let _fwTickInterval = null;
export function startFastTickInterval() {
  if (_fwTickInterval) return;
  _fwTickInterval = setInterval(() => {
    const timerEl = document.getElementById('fwTimerVal');
    if (!timerEl) return;
    const today = todayStr();
    const win = getActiveFastWindow(today);
    if (!win) return;
    const elapsed = (Date.now() - new Date(win.start).getTime()) / 3600000;
    timerEl.textContent = _fmtHM(elapsed);
  }, 30000);
}

// ─── DAY MODAL EDITOR ────────────────────────────────────────────────────────

export function renderDayModalFastEditor(dateStr) {
  const wins = getFastWindows(dateStr);
  const fd = gs(SK.fastDays) || {};
  const isFast = !!fd[dateStr];
  if (!isFast) return '';

  let stateHtml = '';
  if (wins.length === 0) {
    stateHtml = `<div class="fw-meta">Legacy fast day — no times logged. Treated as full 24-hour fast.</div>`;
  } else {
    const w = wins[wins.length - 1];
    const dur = w.end ? (new Date(w.end).getTime() - new Date(w.start).getTime()) / 3600000 : 0;
    if (w.broken) {
      stateHtml = `<div class="fw-broken-pill">⚠ BROKEN at ${_fmtTime(w.end)}</div>
                   <div class="fw-meta">${_fmtTime(w.start)} → ${_fmtTime(w.end)} · ${_fmtHM(dur)} fasted</div>`;
    } else if (w.end) {
      stateHtml = `<div class="fw-meta">✓ ${_fmtTime(w.start)} → ${_fmtTime(w.end)} · ${_fmtHM(dur)}</div>`;
    } else {
      stateHtml = `<div class="fw-meta">⏱ Started ${_fmtTime(w.start)} · still ongoing</div>`;
    }
  }

  return `<div class="fast-window-editor">
    <div class="fw-editor-title">FAST WINDOW</div>
    ${stateHtml}
    <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${dateStr}')">✎ EDIT TIMES</button>
  </div>`;
}

// ─── EDIT MODAL ──────────────────────────────────────────────────────────────

export function openFastEditModal(dateStr) {
  const wins = getFastWindows(dateStr);
  const w = wins.length ? wins[wins.length - 1] : null;
  const startTime = w && w.start ? _fmtTime(w.start) : '';
  const endTime   = w && w.end   ? _fmtTime(w.end)   : '';
  const startDateStr = w && w.start ? _isoToDateStr(w.start) : dateStr;
  const broken = !!(w && w.broken);

  const modal = document.getElementById('fastEditModal');
  if (!modal) return;
  document.getElementById('fweTitle').textContent = 'EDIT FAST — ' + dateStr;
  document.getElementById('fweStartDate').value = startDateStr || dateStr;
  document.getElementById('fweStartTime').value = startTime;
  document.getElementById('fweEndDate').value   = w && w.end ? _isoToDateStr(w.end) : dateStr;
  document.getElementById('fweEndTime').value   = endTime;
  document.getElementById('fweBroken').checked  = broken;
  document.getElementById('fweDateStr').value   = dateStr;
  modal.classList.add('active');
}

export function closeFastEditModal() {
  const modal = document.getElementById('fastEditModal');
  if (modal) modal.classList.remove('active');
}

export function saveFastEditFromModal() {
  const dateStr = document.getElementById('fweDateStr').value;
  const sd = document.getElementById('fweStartDate').value;
  const st = document.getElementById('fweStartTime').value;
  const ed = document.getElementById('fweEndDate').value;
  const et = document.getElementById('fweEndTime').value;
  const broken = document.getElementById('fweBroken').checked;

  const startISO = (sd && st) ? new Date(sd + 'T' + st).toISOString() : null;
  const endISO   = (ed && et) ? new Date(ed + 'T' + et).toISOString() : null;

  if (startISO && endISO && new Date(endISO).getTime() <= new Date(startISO).getTime()) {
    showAlert('End time must be after start time.');
    return;
  }
  editFastWindow(dateStr, null, startISO, endISO, broken);
  closeFastEditModal();
  // If the day modal is open for this date, re-render it to reflect the change
  if (typeof openDayModal === 'function') {
    const isModalOpen = document.getElementById('modalOverlay') && document.getElementById('modalOverlay').classList.contains('active');
    if (isModalOpen) openDayModal(dateStr, strToDate(dateStr));
  }
  renderTodayFastUI();
}

export function deleteFastWindowFromModal() {
  const dateStr = document.getElementById('fweDateStr').value;
  showConfirm(
    'Delete fast window?',
    'This removes the recorded start/end times for this day. The day stays marked as a fast day (legacy fallback = 24-hour fast). You can re-enter times any time.',
    () => {
      deleteFastWindow(dateStr, null);
      closeFastEditModal();
      if (typeof openDayModal === 'function') {
        const isModalOpen = document.getElementById('modalOverlay') && document.getElementById('modalOverlay').classList.contains('active');
        if (isModalOpen) openDayModal(dateStr, strToDate(dateStr));
      }
      renderTodayFastUI();
    },
    { yesLabel: 'DELETE', danger: true }
  );
}
