// ─── FAST SESSIONS — Phase 12 (v7.8.0) ──────────────────────────────────────
// Multi-day fast support. Replaces the per-date window model from Phase C
// with a date-agnostic session abstraction. One continuous fast = one
// session, regardless of how many calendar dates it spans.
//
// Storage shape under SK.fastSessions = 'ph_fs_v1':
//   [
//     { id: 'fs_<ts>_<rand>',
//       start: ISO_string,
//       end:   ISO_string | null,
//       broken: boolean,
//       brokenBy: [foodEntryId, ...],
//       dates: [YYYY-MM-DD, ...],   // calendar dates the session spans
//       legacy: boolean (optional)  // true if backfilled from pre-Phase-12 data
//     },
//     ...
//   ]
//
// `dates` is computed from start + end (or now if active). A date is included
// if the session was active for any portion of that calendar day. Recomputed
// whenever start, end, or broken flag changes.
//
// Backward-compat: old SK.fastWindows storage stays intact post-migration
// (vestigial; not read by new code) so a rollback can recover. New writes
// only go to fastSessions. Phase C onclick handlers (startFast, endFast,
// markFastBroken, editFastWindow, deleteFastWindow, getFastWindows,
// getActiveFastWindow, getMostRecentWindow, isFastBroken,
// getFastDurationHours) remain callable as thin shims over the session API.
//
// Migration v3→v4 (in migrations/registry.js) backfills sessions from
// existing fastWindows + fastDays. Consecutive fastDays are NOT auto-merged
// during migration — without timestamp data, we can't infer continuity.
// Each gets its own session; user can manually merge later via the day-modal
// session editor by editing one session's end time to span the next day.

// ─── INTERNAL HELPERS ───────────────────────────────────────────────────────

function _allSessions() {
  return gs(SK.fastSessions) || [];
}

function _writeSessions(sessions) {
  ss(SK.fastSessions, sessions || []);
}

// Compute calendar dates the session spans. A date is included if the session
// was active for ≥ 1 second on that local-time calendar day. Active sessions
// (end === null) span up to today.
function _datesCoveredBySession(session) {
  if (!session || !session.start) return [];
  const startMs = new Date(session.start).getTime();
  const endMs = session.end ? new Date(session.end).getTime() : Date.now();
  if (!isFinite(startMs) || !isFinite(endMs) || endMs < startMs) return [];
  const dates = [];
  const startD = new Date(startMs); startD.setHours(0,0,0,0);
  const endD = new Date(endMs); endD.setHours(0,0,0,0);
  for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
    dates.push(dateToStr(d));
  }
  return dates;
}

function _newSessionId() {
  return 'fs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

// v7.10.2: After any session mutation, the legacy SK.fastDays map must
// reflect every date the session spans — calendar coloring, calibration
// math, radar fasting axis, today banner, day modal, and export all read
// SK.fastDays only and never look at SK.fastSessions. Without this sync a
// multi-day fast (e.g. Tue 4PM → Fri 7AM) only flagged the calendar-auto
// midweek date, leaving the bookend dates rendered as eating days even
// though the user was fasting.
//
// IMPORTANT: this is ADDITIVE only. Never delete an existing fastDays
// entry — the user may have manually marked a date as fast that no
// session covers (legacy single-tap-toggle path). Removing on edit would
// clobber that intent.
function _syncFastDaysFromSession(session) {
  if (!session || !Array.isArray(session.dates) || !session.dates.length) return false;
  const fd = gs(SK.fastDays) || {};
  let changed = false;
  for (const d of session.dates) {
    if (!fd[d]) { fd[d] = true; changed = true; }
  }
  if (changed) ss(SK.fastDays, fd);
  return changed;
}

// ─── SESSION-LEVEL API (Phase 12 primary surface) ───────────────────────────

// The active session is global (not date-scoped). At most one active session
// can exist — open + unbroken. Returns null when none.
export function getActiveSession() {
  const sessions = _allSessions();
  for (let i = sessions.length - 1; i >= 0; i--) {
    const s = sessions[i];
    if (s && s.start && !s.end && !s.broken) return s;
  }
  return null;
}

// All sessions whose `dates[]` array includes the given date string.
// Sorted by ascending start time (matches storage order from migration).
export function getSessionsForDate(dateStr) {
  return _allSessions().filter(s => Array.isArray(s.dates) && s.dates.includes(dateStr));
}

// Most recent session covering a given date (or null).
export function getMostRecentSessionForDate(dateStr) {
  const list = getSessionsForDate(dateStr);
  return list.length ? list[list.length - 1] : null;
}

// Start a new fast session. No-op if an active session already exists
// (date-agnostic — sessions span calendar dates, so a Saturday-tap during
// a Friday-started fast does nothing). Returns true when a new session
// was created.
export function startFastSession() {
  if (getActiveSession()) return false;
  const sessions = _allSessions();
  const session = {
    id: _newSessionId(),
    start: new Date().toISOString(),
    end: null,
    broken: false,
    brokenBy: [],
    dates: [todayStr()]
  };
  sessions.push(session);
  _writeSessions(sessions);
  _syncFastDaysFromSession(session);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// End the active session. Sets `end = now`, recomputes `dates[]` based on
// actual elapsed span (so a Fri 6PM → Mon 9AM fast lists Fri/Sat/Sun/Mon).
export function endFastSession() {
  const sessions = _allSessions();
  const active = sessions.find(s => s && s.start && !s.end && !s.broken);
  if (!active) return false;
  active.end = new Date().toISOString();
  active.dates = _datesCoveredBySession(active);
  _writeSessions(sessions);
  _syncFastDaysFromSession(active);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// Mark active session as broken (food was logged during the fast). Sets
// end to the food timestamp (or now), broken=true, appends foodEntryId
// to brokenBy. Recomputes dates[].
export function markSessionBroken(foodEntryId, foodTs) {
  const sessions = _allSessions();
  const active = sessions.find(s => s && s.start && !s.end && !s.broken);
  if (!active) return false;
  active.broken = true;
  active.end = foodTs ? new Date(foodTs).toISOString() : new Date().toISOString();
  active.brokenBy = active.brokenBy || [];
  if (foodEntryId) active.brokenBy.push(foodEntryId);
  active.dates = _datesCoveredBySession(active);
  _writeSessions(sessions);
  _syncFastDaysFromSession(active);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// Edit a session by ID. startISO / endISO / broken can be null to clear.
// Recomputes dates[] from new start/end. Useful for backfilling legacy
// sessions or correcting timestamps retroactively.
export function editSession(sessionId, startISO, endISO, broken) {
  const sessions = _allSessions();
  const idx = sessions.findIndex(s => s && s.id === sessionId);
  if (idx < 0) return false;
  sessions[idx].start = startISO || null;
  sessions[idx].end = endISO || null;
  sessions[idx].broken = !!broken;
  if (!broken) sessions[idx].brokenBy = [];
  sessions[idx].dates = _datesCoveredBySession(sessions[idx]);
  // If editing produced an empty dates array (start invalid), keep at
  // least the original primary date as a fallback so the session remains
  // discoverable via getSessionsForDate.
  if (!sessions[idx].dates.length) sessions[idx].dates = [todayStr()];
  _writeSessions(sessions);
  _syncFastDaysFromSession(sessions[idx]);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// Remove a session by ID.
export function deleteSession(sessionId) {
  const sessions = _allSessions();
  const idx = sessions.findIndex(s => s && s.id === sessionId);
  if (idx < 0) return false;
  sessions.splice(idx, 1);
  _writeSessions(sessions);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// ─── BACKWARD-COMPAT SHIMS (Phase C API surface preserved) ──────────────────

// Returns array of session objects covering the given date, exposed as
// "windows" so existing readers (none in calibration; some in calendar +
// app.html addFoodEntry) continue to work without rewrites.
export function getFastWindows(dateStr) {
  const sessions = getSessionsForDate(dateStr);
  return sessions.map(s => ({
    start: s.start,
    end: s.end,
    broken: !!s.broken,
    brokenBy: s.brokenBy || [],
    sessionId: s.id,
    sessionDates: s.dates || []
  }));
}

// Active fast window — date-agnostic post-Phase-12. The `dateStr` argument
// is ignored: the active session is global. Returns null if none.
export function getActiveFastWindow(/* dateStr (ignored) */) {
  const active = getActiveSession();
  if (!active) return null;
  return {
    start: active.start,
    end: active.end,
    broken: !!active.broken,
    brokenBy: active.brokenBy || [],
    sessionId: active.id,
    sessionDates: active.dates || []
  };
}

// Most recent window covering a date.
export function getMostRecentWindow(dateStr) {
  const s = getMostRecentSessionForDate(dateStr);
  if (!s) return null;
  return {
    start: s.start,
    end: s.end,
    broken: !!s.broken,
    brokenBy: s.brokenBy || [],
    sessionId: s.id,
    sessionDates: s.dates || []
  };
}

// v7.10.2: One-time at-init reconciliation. Walks every session and OR's its
// dates[] into SK.fastDays. Idempotent — safe to run on every app load.
// Fixes legacy data where multi-day sessions only had their auto-set dates
// in fastDays (the bookend dates of a fast spanning Tue→Fri got missed).
// Returns the count of date keys added (for diagnostic logging).
export function reconcileFastDaysFromSessions() {
  const sessions = gs(SK.fastSessions) || [];
  if (!sessions.length) return 0;
  const fd = gs(SK.fastDays) || {};
  let added = 0;
  for (const s of sessions) {
    if (!s || !Array.isArray(s.dates)) continue;
    for (const d of s.dates) {
      if (!fd[d]) { fd[d] = true; added++; }
    }
  }
  if (added > 0) {
    ss(SK.fastDays, fd);
    if (typeof dispatch === 'function') dispatch('FAST_DAY_TOGGLED');
  }
  return added;
}

// True if any session covering the date is broken.
export function isFastBroken(dateStr) {
  return getSessionsForDate(dateStr).some(s => s.broken === true);
}

// Total fasted hours on a date. Sums across all sessions covering it.
// Falls back to 24h if no sessions exist but legacy SK.fastDays[date] is
// set — only relevant in the rare case migration didn't populate the
// session for some reason. Active sessions count up to "now".
export function getFastDurationHours(dateStr) {
  const sessions = getSessionsForDate(dateStr);
  if (sessions.length === 0) {
    const fd = gs(SK.fastDays) || {};
    return fd[dateStr] ? 24 : 0;
  }
  const now = Date.now();
  // Compute the slice of each session that falls within the local-time
  // calendar day represented by dateStr. Otherwise multi-day sessions
  // would over-credit a single date.
  const dayStart = strToDate(dateStr);
  dayStart.setHours(0,0,0,0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);
  let totalMs = 0;
  for (const s of sessions) {
    if (!s.start) continue;
    const startMs = Math.max(new Date(s.start).getTime(), dayStart.getTime());
    const endMs = Math.min(s.end ? new Date(s.end).getTime() : now, dayEnd.getTime());
    if (endMs > startMs) totalMs += (endMs - startMs);
  }
  return totalMs / 3600000;
}

// Legacy date-scoped onclick wrappers — all delegate to the session API.
export function startFast(/* dateStr */) { return startFastSession(); }
export function endFast(/* dateStr */)   { return endFastSession(); }
export function markFastBroken(dateStr, foodEntryId, foodTs) { return markSessionBroken(foodEntryId, foodTs); }

// editFastWindow finds the most-recent session covering dateStr (or creates
// a new one if none exists) and applies the edit. The `idx` parameter from
// Phase C is ignored — sessions don't have per-date indices.
export function editFastWindow(dateStr, idx, startISO, endISO, broken) {
  const target = getMostRecentSessionForDate(dateStr);
  if (target) return editSession(target.id, startISO, endISO, broken);
  // No existing session — create one and apply the edit
  const sessions = _allSessions();
  const session = {
    id: _newSessionId(),
    start: startISO || null,
    end: endISO || null,
    broken: !!broken,
    brokenBy: []
  };
  session.dates = _datesCoveredBySession(session);
  if (!session.dates.length) session.dates = [dateStr];
  sessions.push(session);
  _writeSessions(sessions);
  dispatch('FAST_WINDOW_CHANGED');
  return true;
}

// Delete the most-recent session for a date (matching Phase C semantics
// for the day-modal "Delete window" button).
export function deleteFastWindow(dateStr /*, idx (ignored) */) {
  const target = getMostRecentSessionForDate(dateStr);
  if (!target) return false;
  return deleteSession(target.id);
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

function _fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function _isoToDateStr(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return dateToStr(d);
}

function _sessionDurationHours(s) {
  if (!s || !s.start) return 0;
  const startMs = new Date(s.start).getTime();
  const endMs = s.end ? new Date(s.end).getTime() : Date.now();
  return (endMs - startMs) / 3600000;
}

// ─── TODAY TAB UI ────────────────────────────────────────────────────────────

export function renderTodayFastUI() {
  const container = document.getElementById('fastBannerControls');
  if (!container) return;
  const today = todayStr();
  const isFast = isFastDay(today);
  if (!isFast) { container.innerHTML = ''; return; }

  // Phase 12: active session is global, not date-scoped.
  const active = getActiveSession();
  const recent = getMostRecentSessionForDate(today);
  let html = '';

  if (active) {
    // Active fast in progress (may have started on a previous day)
    const elapsed = _sessionDurationHours(active);
    const isMultiDay = (active.dates || []).length > 1
      || _isoToDateStr(active.start) !== today;
    const startLabel = isMultiDay ? _fmtDateTime(active.start) : ('Started ' + _fmtTime(active.start));
    html += `<div class="fw-state">
      <div class="fw-timer">FASTING <span id="fwTimerVal">${_fmtHM(elapsed)}</span></div>
      <div class="fw-meta">${isMultiDay ? 'Started ' : ''}${startLabel}</div>
    </div>
    <div class="fw-btn-row">
      <button class="fw-btn fw-btn-end" onclick="endFastFromBanner()">■ END FAST</button>
      <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${today}')">✎ EDIT</button>
    </div>`;
  } else if (recent && recent.broken) {
    // Most recent session covering today was broken
    const dur = _sessionDurationHours(recent);
    html += `<div class="fw-state fw-state-broken">
      <div class="fw-broken-pill">⚠ FAST BROKEN at ${_fmtTime(recent.end)}</div>
      <div class="fw-meta">Fasted ${_fmtHM(dur)} before break</div>
    </div>
    <div class="fw-btn-row">
      <button class="fw-btn fw-btn-start" onclick="startFastFromBanner()">▶ START NEW FAST</button>
      <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${today}')">✎ EDIT</button>
    </div>`;
  } else if (recent && recent.end) {
    // Completed fast covering today
    const dur = _sessionDurationHours(recent);
    const isMultiDay = (recent.dates || []).length > 1;
    html += `<div class="fw-state fw-state-done">
      <div class="fw-timer">FAST DONE ✓ <span>${_fmtHM(dur)}</span></div>
      <div class="fw-meta">${isMultiDay ? _fmtDateTime(recent.start) + ' → ' + _fmtDateTime(recent.end) : _fmtTime(recent.start) + ' → ' + _fmtTime(recent.end)}</div>
    </div>
    <div class="fw-btn-row">
      <button class="fw-btn fw-btn-start" onclick="startFastFromBanner()">▶ START NEW FAST</button>
      <button class="fw-btn fw-btn-edit" onclick="openFastEditModal('${today}')">✎ EDIT</button>
    </div>`;
  } else {
    // No session yet — fast day waiting for user input
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

export function startFastFromBanner() { startFastSession(); renderTodayFastUI(); }
export function endFastFromBanner()   { endFastSession();   renderTodayFastUI(); }

// Background tick — refreshes the live timer text without rebuilding the banner.
let _fwTickInterval = null;
export function startFastTickInterval() {
  if (_fwTickInterval) return;
  _fwTickInterval = setInterval(() => {
    const timerEl = document.getElementById('fwTimerVal');
    if (!timerEl) return;
    const active = getActiveSession();
    if (!active) return;
    const elapsed = _sessionDurationHours(active);
    timerEl.textContent = _fmtHM(elapsed);
  }, 30000);
}

// ─── DAY MODAL EDITOR ────────────────────────────────────────────────────────

export function renderDayModalFastEditor(dateStr) {
  const fd = gs(SK.fastDays) || {};
  const isFast = !!fd[dateStr];
  if (!isFast) return '';

  const session = getMostRecentSessionForDate(dateStr);
  let stateHtml = '';

  if (!session) {
    // No session for this date — can happen if migration didn't backfill
    // or user explicitly deleted the session. Fall back to legacy 24h note.
    stateHtml = `<div class="fw-meta">Legacy fast day — no times logged. Treated as full 24-hour fast.</div>`;
  } else {
    const dur = _sessionDurationHours(session);
    const isMultiDay = (session.dates || []).length > 1;
    const dateLabel = isMultiDay
      ? _fmtDateTime(session.start) + ' → ' + (session.end ? _fmtDateTime(session.end) : 'ongoing')
      : _fmtTime(session.start) + ' → ' + (session.end ? _fmtTime(session.end) : 'ongoing');
    if (isMultiDay) {
      stateHtml += `<div class="fw-meta" style="color:var(--accent2);font-weight:500">⏱ Multi-day fast: spans ${(session.dates || []).length} days</div>`;
    }
    if (session.broken) {
      stateHtml += `<div class="fw-broken-pill">⚠ BROKEN at ${_fmtTime(session.end)}</div>
                    <div class="fw-meta">${dateLabel} · ${_fmtHM(dur)} fasted</div>`;
    } else if (session.end) {
      stateHtml += `<div class="fw-meta">✓ ${dateLabel} · ${_fmtHM(dur)}</div>`;
    } else {
      stateHtml += `<div class="fw-meta">⏱ Started ${_fmtDateTime(session.start)} · still ongoing</div>`;
    }
    if (session.legacy) {
      stateHtml += `<div class="fw-meta" style="opacity:0.7;font-style:italic">Backfilled from pre-Phase-12 data — edit times to set the actual fast window.</div>`;
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
  // Find the session for this date. Edits apply to the entire session,
  // even when it spans multiple dates.
  const session = getMostRecentSessionForDate(dateStr);
  const startTime = session && session.start ? _fmtTime(session.start) : '';
  const endTime   = session && session.end   ? _fmtTime(session.end)   : '';
  const startDateStr = session && session.start ? _isoToDateStr(session.start) : dateStr;
  const broken = !!(session && session.broken);

  const modal = document.getElementById('fastEditModal');
  if (!modal) return;
  const titleSuffix = (session && (session.dates || []).length > 1)
    ? ' (multi-day session — covers ' + session.dates.length + ' dates)'
    : '';
  document.getElementById('fweTitle').textContent = 'EDIT FAST — ' + dateStr + titleSuffix;
  document.getElementById('fweStartDate').value = startDateStr || dateStr;
  document.getElementById('fweStartTime').value = startTime;
  document.getElementById('fweEndDate').value   = session && session.end ? _isoToDateStr(session.end) : dateStr;
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
  if (typeof openDayModal === 'function') {
    const isModalOpen = document.getElementById('modalOverlay') && document.getElementById('modalOverlay').classList.contains('active');
    if (isModalOpen) openDayModal(dateStr, strToDate(dateStr));
  }
  renderTodayFastUI();
}

export function deleteFastWindowFromModal() {
  const dateStr = document.getElementById('fweDateStr').value;
  showConfirm(
    'Delete fast session?',
    'This removes the recorded session for this fast (including any multi-day span). The fast day mark stays (legacy fallback = 24-hour fast). You can re-enter times any time.',
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
