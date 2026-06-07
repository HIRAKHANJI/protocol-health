// ─── ENGINE SESSION RENDERER — Protocol Health (v9 BETA) ─────────────────────
//
// STATUS: DORMANT. Pure HTML renderer for the v9 workout engine's generated-week
// output. No DOM access, no globals, no side effects — just string building.
// Importing this module does nothing; it will be wired behind an opt-in BETA flag
// (default OFF) in a later stage and cannot affect the live app until then.
//
// It reuses the app's existing workout-card markup/classes (workout-card,
// workout-card-header, h3, wch-right, meta, chevron, workout-body, exercise-row,
// ex-name, ex-detail, ex-sets) so it inherits styling AND the existing toggle/
// expand behaviour: renderWorkouts attaches click handlers to .workout-card-header
// and auto-opens .workout-body. We therefore emit the same structure WITHOUT any
// inline open state — the caller (renderWorkouts) handles expansion.
//
// Shapes consumed (from modules/workout-engine.js generateWeek / generateSession):
//   week = { plan, eligible, reason?, deload:{due,reason}, suggestions:[{group,
//            fromLevel,toLevel,reason}], days:[session x7] }
//   session = { plan, dow, name, archetype, fasted, isDeload,
//               exercises:[{ id,name,group,level,region,sets,reps:[min,max],unit,
//               tempo,rest:[min,max],raw,slot,focusScore,rationale:[strings] }],
//               notes:[strings] }

const DOW_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// formatDose: 'sets×reps unit' — collapses equal min/max reps to a single number.
// Handles unit variants where the "reps" value is conceptually the count:
//   ladder   → '1 ladder'  (sets is the ladder count; reps not meaningful)
//   attempts → '5 attempts'
export function formatDose(ex) {
  if (!ex) return '';
  const reps = Array.isArray(ex.reps) ? ex.reps : [ex.reps, ex.reps];
  const lo = reps[0];
  const hi = reps.length > 1 ? reps[1] : reps[0];
  const repStr = (lo === hi) ? `${lo}` : `${lo}-${hi}`;
  const unit = ex.unit || '';

  // Count-style units read more naturally as "<n> <unit>" without the sets×reps form.
  if (unit === 'ladder') return `${ex.sets} ladder`;
  if (unit === 'attempts') return `${repStr} attempts`;

  return `${ex.sets}×${repStr}${unit ? ' ' + unit : ''}`;
}

// renderSessionCard: one .workout-card for a day with exercises. No inline open
// state — the caller's renderWorkouts toggles .workout-body.
function renderSessionCard(session) {
  const dayName = DOW_SHORT[session.dow] || '';
  const title = `${dayName} · ${session.name}`;
  const meta = `${session.archetype}${session.fasted ? ' · FASTED' : ''}${session.isDeload ? ' · DELOAD' : ''}`;

  // Block labels shown as the session moves through its anatomy. Exercises arrive in
  // block order (warmup first … cooldown last), so a label is emitted whenever the
  // block (kind) changes — giving the WARM-UP / MAIN / ACCESSORY / CORE / COOL-DOWN
  // structure the hand-built plans have.
  const BLOCK_LABEL = { warmup: 'WARM-UP', main: 'MAIN', accessory: 'ACCESSORY', skill: 'SKILL', core: 'CORE', conditioning: 'CONDITIONING', recovery: 'MOBILITY', cooldown: 'COOL-DOWN' };
  const warmCool = k => k === 'warmup' || k === 'cooldown';
  let lastKind = null;
  const rows = session.exercises.map(ex => {
    const kind = ex.kind || 'main';
    let head = '';
    if (kind !== lastKind && BLOCK_LABEL[kind]) {
      head = `<div class="ex-detail" style="padding:6px 0 2px;letter-spacing:1.5px;opacity:0.6;font-family:'DM Mono',monospace">${BLOCK_LABEL[kind]}</div>`;
      lastKind = kind;
    }
    const detailParts = [];
    if (!warmCool(kind) && ex.tempo && ex.tempo !== 'easy') detailParts.push(ex.tempo);
    if (ex.rationale && ex.rationale.length) detailParts.push(ex.rationale.join(', '));
    const detail = detailParts.join(' · ');
    const dose = warmCool(kind) ? '' : formatDose(ex);
    return `${head}<div class="exercise-row"><div><div class="ex-name">${ex.name}</div><div class="ex-detail">${detail}</div></div><div class="ex-sets">${dose}</div></div>`;
  }).join('');

  const noteRows = (session.notes || []).map(n =>
    `<div class="section-note" style="padding:4px 0;opacity:0.7">${n}</div>`
  ).join('');

  return `<div class="workout-card">
    <div class="workout-card-header">
      <h3>${title}</h3>
      <div class="wch-right"><div class="meta">${meta}</div><span class="chevron">▼</span></div>
    </div>
    <div class="workout-body">${rows}${noteRows}</div>
  </div>`;
}

// renderEngineWeek: full HTML string for a generated week. Pure — returns a string,
// never throws on a well-formed (or ineligible) week object.
export function renderEngineWeek(week, opts = {}) {
  if (!week || !week.eligible) {
    const reason = (week && week.reason) ? week.reason : 'This plan is not currently available for your profile.';
    return `<div class="rule-card"><h3>WORKOUT ENGINE</h3><div>${reason}</div><div style="margin-top:6px;opacity:0.75">Try a different plan in Settings.</div></div>`;
  }

  const out = [];

  // 1. Header line + active plan / focus note.
  out.push(`<div class="section-title">WORKOUT <span>ENGINE · BETA</span></div>`);
  const focusBit = opts.focusLabel ? ` · Focus: ${opts.focusLabel}` : '';
  out.push(`<div class="section-note">Plan: ${week.plan}${focusBit}</div>`);

  // 2. Deload notice.
  if (week.deload && week.deload.due) {
    out.push(`<div class="rule-card" style="border-left-color:var(--accent2)"><h3>DELOAD WEEK</h3><div>${week.deload.reason || 'Scheduled recovery week.'}</div></div>`);
  }

  // 3. Progression suggestions (suggest-only — no apply button here).
  if (week.suggestions && week.suggestions.length) {
    const items = week.suggestions.map(s => {
      const group = (s.group || '').toUpperCase();
      return `<div class="ex-detail">${group} ready to advance to level ${s.toLevel} — review in Settings</div>`;
    }).join('');
    out.push(`<div class="rule-card" style="border-left-color:var(--accent)"><h3>PROGRESSION SUGGESTIONS</h3>${items}</div>`);
  }

  // 4. One card per day with exercises; tiny muted line for rest/empty days.
  for (const session of (week.days || [])) {
    if (!session) continue;
    if (session.exercises && session.exercises.length) {
      out.push(renderSessionCard(session));
    } else {
      const dayName = DOW_SHORT[session.dow] || '';
      out.push(`<div class="section-note" style="padding:4px 0;opacity:0.6">${dayName} · Rest</div>`);
    }
  }

  return out.join('\n');
}
