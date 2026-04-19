// exRowWithLevel: exercise row with level badge (AGRO plan only).
// Shows the selected level's exercise if one is set, otherwise shows the fallback.
// exRowWithLevel instance tracking — reset before each workoutContent() call
// Prevents duplicate groupIds from sharing a single level selector
let _exRowInstanceCount = {};
let _wexCounter = 0;
export function _resetExRowInstances() { _exRowInstanceCount = {}; _wexCounter = 0; }

export function exRowWithLevel(groupId, fallbackName, fallbackDetail, fallbackSets) {
  // Track instance count per groupId so duplicates get unique storage keys
  if(!_exRowInstanceCount[groupId]) _exRowInstanceCount[groupId] = 0;
  _exRowInstanceCount[groupId]++;
  const instanceNum = _exRowInstanceCount[groupId];
  // First instance keeps original key (backward compat), subsequent get suffix
  const instanceKey = instanceNum === 1 ? groupId : groupId + '_' + instanceNum;

  const wid = 'wex' + (_wexCounter++);
  const level = getCurrentExerciseLevel(instanceKey);
  const prog = EXERCISE_PROGRESSIONS[groupId];
  if(level !== null && prog) {
    const l = prog.levels.find(lv => lv.level === level);
    if(l) {
      return `<div class="exercise-row wex-row" data-wid="${wid}" onclick="toggleWorkoutEx(this)"><div style="display:flex;gap:8px;align-items:flex-start"><div class="wex-cb"><span class="wex-tick">✓</span></div><div><div class="ex-name">${l.exercise}</div><div class="ex-detail">${l.notes || fallbackDetail}</div></div></div><div style="display:flex;align-items:center;gap:8px"><div class="ex-sets">${l.sets}</div><button class="level-badge" onclick="event.stopPropagation();openLevelSelector('${instanceKey}','${groupId}')">Lv${level}<span class="level-max">/${prog.levels[prog.levels.length-1].level}</span></button></div></div>`;
    }
  }
  const maxLvl = prog ? prog.levels[prog.levels.length-1].level : '?';
  return `<div class="exercise-row wex-row" data-wid="${wid}" onclick="toggleWorkoutEx(this)"><div style="display:flex;gap:8px;align-items:flex-start"><div class="wex-cb"><span class="wex-tick">✓</span></div><div><div class="ex-name">${fallbackName}</div><div class="ex-detail">${fallbackDetail}</div></div></div><div style="display:flex;align-items:center;gap:8px"><div class="ex-sets">${fallbackSets}</div><button class="level-badge level-badge-unset" onclick="event.stopPropagation();openLevelSelector('${instanceKey}','${groupId}')">SET<span class="level-max">/${maxLvl}</span></button></div></div>`;
}

// ─── ROW + CARD GENERATORS (consolidated from the workout content section) ─

// exRow: returns an HTML row for one exercise (name + detail + sets/duration)
export function exRow(name, detail, sets) {
  const wid = 'wex' + (_wexCounter++);
  return `<div class="exercise-row wex-row" data-wid="${wid}" onclick="toggleWorkoutEx(this)"><div style="display:flex;gap:8px;align-items:flex-start"><div class="wex-cb"><span class="wex-tick">✓</span></div><div><div class="ex-name">${name}</div><div class="ex-detail">${detail}</div></div></div><div class="ex-sets">${sets}</div></div>`;
}

// workoutCard: wraps exercise rows in a collapsible card with a header and optional stretch rows
// days: optional string of day abbreviations this card applies to (e.g. 'MON,WED,FRI' or 'DAILY')
export function workoutCard(title, meta, rows, stretchRows='', days='') {
  return `<div class="workout-card"${days ? ` data-days="${days}"` : ''}>
    <div class="workout-card-header">
      <h3>${title}</h3>
      <div class="wch-right"><div class="meta">${meta}</div><span class="chevron">▼</span></div>
    </div>
    <div class="workout-body">${rows}${stretchRows ? `<div style="background:rgba(221,136,255,0.05);border-top:1px solid var(--border);padding:6px 0">${stretchRows}</div>` : ''}</div>
  </div>`;
}

// stretchRow: same as exRow but rendered in purple to distinguish cooldown/stretch work
export function stretchRow(name, detail, duration) {
  const wid = 'wex' + (_wexCounter++);
  return `<div class="exercise-row wex-row" data-wid="${wid}" onclick="toggleWorkoutEx(this)"><div style="display:flex;gap:8px;align-items:flex-start"><div class="wex-cb"><span class="wex-tick">✓</span></div><div><div class="ex-name" style="color:#dd88ff">${name}</div><div class="ex-detail">${detail}</div></div></div><div class="ex-sets" style="color:#dd88ff">${duration}</div></div>`;
}
