// ─── DOWNLOAD SCHEDULE AS HTML ─────────────────────────────────────────────
// Generates a standalone, printable HTML document with the full schedule details:
// user info, plan overview, daily tasks (Mon-Sun), workouts, nutrition, supplements, rules.
export function downloadScheduleHTML() {
  const p = window._pendingSchedule;
  if(!p) return;
  const mode = window._pendingScheduleMode || 'exact';
  const useDays = (mode === 'realistic' && p.realisticDays) ? p.realisticDays : p.totalDays;
  const s = getSettings();
  const plan = PLANS[p.planVal] || PLANS.default;
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // Calculate end date
  const startDate = strToDate(p.startDateStr);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + useDays - 1);
  const endDateStr = dateToStr(endDate);

  // Format date nicely
  const fmtDate = ds => {
    const d = strToDate(ds);
    return d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  };

  // Compute macros for a normal eating day (use a Monday as reference)
  const cal = p.cal || s.calories || 1500;
  const pfm = plan.proteinFloorMultiplier || 1.3;
  const splits = plan.macroSplit || { base:[50,30,20] };
  const baseSplit = splits.base || [50,30,20];
  const proteinG = Math.round(cal * (baseSplit[0]/100) / 4);
  const carbsG = Math.round(cal * (baseSplit[1]/100) / 4);
  const fatG = Math.round(cal * (baseSplit[2]/100) / 9);

  // Build week schedule: for each day Mon-Sun, show day type + checklist
  const weekOrder = [1,2,3,4,5,6,0]; // Mon-Sun
  const fastDow = plan.fastDaysDow || [];
  const lightDow = plan.lightDaysDow || [];

  let weekHTML = '';
  weekOrder.forEach(dow => {
    const dayName = dayNames[dow];
    const isFast = fastDow.includes(dow);
    const isLight = lightDow.includes(dow);
    const dayType = isFast ? 'WATER FAST' : isLight ? 'LIGHT EATING' : 'EATING DAY';
    const dayColor = isFast ? '#b388ff' : isLight ? '#f5a623' : '#c8f542';
    const icon = (plan.weekIcons && plan.weekIcons[dow]) || '';

    // Pick the right checklist
    const checklist = isFast ? (plan.checklistFast || [])
      : isLight ? (plan.checklistLight || plan.checklistNormal || [])
      : (plan.checklistNormal || []);

    // Morning/evening/stretch sub-texts
    const mSub = (plan.morningSub && plan.morningSub[dow]) || '';
    const eSub = (plan.eveningSub && plan.eveningSub[dow]) || '';
    const sSub = (plan.stretchSub && plan.stretchSub[dow]) || '';

    let checklistHTML = '';
    let currentGroup = '';
    checklist.forEach(item => {
      if(item.group !== currentGroup) {
        currentGroup = item.group;
        const groupColor = currentGroup === 'MORNING' ? '#c8f542' : currentGroup === 'EATING' ? '#f5a623'
          : currentGroup === 'EVENING' ? '#70c8ff' : currentGroup === 'FAST' ? '#b388ff'
          : currentGroup === 'LIGHT' ? '#f5a623' : currentGroup === 'NIGHT' ? '#888'
          : currentGroup === 'SUPPLEMENTS' ? '#82e0aa' : '#888';
        checklistHTML += `<div style="margin-top:10px;margin-bottom:4px;font-size:11px;letter-spacing:2px;color:${groupColor};font-weight:bold">${currentGroup}</div>`;
      }
      // Resolve dynamic sub-text
      let sub = item.sub || '';
      if(item.id === 'm3' && mSub) sub = mSub;
      if(item.id === 'e2' && eSub) sub = eSub;
      if(item.id === 'e3' && sSub) sub = sSub;
      checklistHTML += `<div style="padding:5px 0;border-bottom:1px solid #222">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-block;width:14px;height:14px;border:1.5px solid #555;border-radius:3px;flex-shrink:0"></span>
          <span style="font-size:12px;color:#e0e0e0">${item.label}</span>
        </div>
        ${sub ? `<div style="font-size:10px;color:#777;margin-left:22px;margin-top:2px">${sub}</div>` : ''}
      </div>`;
    });

    weekHTML += `
      <div style="page-break-inside:avoid;margin-bottom:16px;background:#111;border:1px solid #222;border-radius:10px;padding:14px 16px;border-left:3px solid ${dayColor}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:${dayColor}">${icon} ${dayName.toUpperCase()}</div>
          <div style="font-size:10px;letter-spacing:1.5px;padding:3px 10px;border-radius:12px;border:1px solid ${dayColor};color:${dayColor}">${dayType}</div>
        </div>
        ${mSub && !isFast ? `<div style="font-size:10px;color:#999;margin-bottom:6px">${mSub}</div>` : ''}
        ${eSub && !isFast ? `<div style="font-size:10px;color:#999;margin-bottom:6px">${eSub}</div>` : ''}
        ${checklistHTML}
      </div>`;
  });

  // Extract workout content — strip interactive elements (level badges etc), keep structure
  // We'll render plan workout/nutrition/rules content as-is since it's HTML
  const tempDiv = document.createElement('div');

  // Workouts
  tempDiv.innerHTML = plan.workoutContent ? plan.workoutContent() : '';
  // Remove level selector buttons (interactive — not useful in print)
  tempDiv.querySelectorAll('.level-badge').forEach(el => {
    el.style.pointerEvents = 'none';
    el.style.cursor = 'default';
  });
  const workoutHTML = tempDiv.innerHTML;

  // Nutrition
  tempDiv.innerHTML = plan.nutritionContent ? plan.nutritionContent(Object.assign({}, s, { calories: cal })) : '';
  const nutritionHTML = tempDiv.innerHTML;

  // Rules
  tempDiv.innerHTML = plan.rulesContent ? plan.rulesContent(Object.assign({}, s, { calories: cal })) : '';
  const rulesHTML = tempDiv.innerHTML;

  // Build the full HTML document
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${plan.name} — Schedule (${fmtDate(p.startDateStr)} to ${fmtDate(endDateStr)})</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0a0a0a; color:#e0e0e0; font-family:'DM Sans',sans-serif; padding:20px; max-width:800px; margin:0 auto; line-height:1.6; }
  h1 { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:3px; color:#c8f542; margin-bottom:4px; }
  h2 { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:2px; color:#c8f542; margin:24px 0 12px; border-bottom:1px solid #222; padding-bottom:6px; }
  h2 span { color:#888; }
  .header-badge { display:inline-block; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:1.5px; padding:3px 10px; border-radius:12px; border:1px solid ${plan.bannerColor || '#c8f542'}; color:${plan.bannerColor || '#c8f542'}; margin-bottom:12px; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0; }
  .info-box { background:#111; border:1px solid #222; border-radius:8px; padding:10px 12px; }
  .info-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:1.5px; color:#888; margin-bottom:2px; }
  .info-val { font-family:'DM Mono',monospace; font-size:16px; color:#e0e0e0; }
  .section-title { font-family:'Bebas Neue',sans-serif; font-size:1.1rem; letter-spacing:2px; color:#c8f542; margin:20px 0 8px; }
  .section-title span { color:#888; }
  .section-note { font-size:0.75rem; color:#777; margin-bottom:10px; }
  .macro-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin:8px 0; }
  .macro-box { background:#111; border:1px solid #222; border-radius:8px; padding:10px 6px; text-align:center; }
  .macro-val { font-family:'DM Mono',monospace; font-size:1.1rem; color:#c8f542; }
  .macro-lbl { font-family:'DM Mono',monospace; font-size:0.6rem; color:#888; letter-spacing:1px; margin-top:2px; }
  .rule-card { background:#111; border:1px solid #222; border-left:3px solid #c8f542; border-radius:8px; padding:10px 14px; margin-bottom:6px; }
  .rule-num { font-family:'DM Mono',monospace; font-size:0.65rem; letter-spacing:1.5px; color:#c8f542; margin-bottom:2px; }
  .rule-text { font-size:0.82rem; color:#e0e0e0; }
  .rule-sub { font-size:0.7rem; color:#777; margin-top:4px; }
  .workout-card { background:#111; border:1px solid #222; border-radius:10px; margin-bottom:8px; overflow:hidden; }
  .workout-card-header { display:flex; justify-content:space-between; align-items:center; padding:12px 14px; cursor:default; }
  .workout-card-header h3 { font-family:'Bebas Neue',sans-serif; font-size:0.95rem; letter-spacing:2px; color:#c8f542; }
  .wch-right { display:flex; align-items:center; gap:8px; }
  .meta { font-family:'DM Mono',monospace; font-size:0.6rem; color:#888; letter-spacing:1px; }
  .chevron { display:none; }
  .workout-body { padding:0 14px 12px; }
  .exercise-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #1a1a1a; }
  .ex-name { font-size:0.82rem; color:#e0e0e0; }
  .ex-detail { font-size:0.65rem; color:#777; }
  .ex-sets { font-family:'DM Mono',monospace; font-size:0.7rem; color:#c8f542; text-align:right; white-space:nowrap; }
  .level-badge { display:inline-block; font-family:'DM Mono',monospace; font-size:9px; padding:2px 6px; border-radius:8px; background:rgba(200,245,66,0.1); color:#c8f542; border:1px solid rgba(200,245,66,0.2); margin-left:4px; }
  .snack-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin:8px 0; }
  .snack-item { background:#111; border:1px solid #222; border-radius:8px; padding:8px 10px; }
  .snack-name { font-size:0.78rem; color:#e0e0e0; }
  .snack-cal { font-family:'DM Mono',monospace; font-size:0.7rem; color:#c8f542; }
  .snack-note { font-size:0.6rem; color:#777; }
  .footer { margin-top:30px; padding-top:14px; border-top:1px solid #222; text-align:center; font-size:10px; color:#555; letter-spacing:1px; }
  @media print {
    body { background:#fff; color:#111; padding:10px; }
    .info-box, .rule-card, .workout-card, .macro-box, .snack-item { background:#f9f9f9; border-color:#ddd; }
    .info-val, .ex-name, .rule-text, .snack-name { color:#111; }
    h1, h2, .section-title, .rule-num, .macro-val, .ex-sets, .snack-cal, .workout-card-header h3 { color:#222; }
    .header-badge { border-color:#333; color:#333; }
  }
</style>
</head>
<body>

<h1>${plan.name}</h1>
<div class="header-badge">${plan.badge}${mode === 'realistic' ? ' · REALISTIC' : ''}</div>
<p style="font-size:12px;color:#888;margin-bottom:16px">${plan.subtitle || ''}</p>

<h2>SCHEDULE <span>OVERVIEW</span></h2>
<div class="info-grid">
  <div class="info-box"><div class="info-label">START DATE</div><div class="info-val">${fmtDate(p.startDateStr)}</div></div>
  <div class="info-box"><div class="info-label">END DATE</div><div class="info-val">${fmtDate(endDateStr)}</div></div>
  <div class="info-box"><div class="info-label">DURATION</div><div class="info-val">${useDays} days (${Math.round(useDays/7)} weeks)</div></div>
  <div class="info-box"><div class="info-label">CALORIE CEILING</div><div class="info-val">${cal} cal/day</div></div>
  <div class="info-box"><div class="info-label">START WEIGHT</div><div class="info-val">${p.curKg} kg</div></div>
  <div class="info-box"><div class="info-label">TARGET WEIGHT</div><div class="info-val">${p.tgtKg} kg</div></div>
  <div class="info-box"><div class="info-label">TDEE</div><div class="info-val">${s.tdee || plan.tdee || 2600} cal</div></div>
  <div class="info-box"><div class="info-label">${p.tgtKg > p.curKg ? 'WEIGHT TO GAIN' : 'WEIGHT TO LOSE'}</div><div class="info-val">${Math.abs(p.curKg - p.tgtKg).toFixed(1)} kg</div></div>
</div>

${s.name ? `<div class="info-grid" style="grid-template-columns:1fr 1fr 1fr"><div class="info-box"><div class="info-label">NAME</div><div class="info-val">${esc(s.name)}</div></div><div class="info-box"><div class="info-label">AGE</div><div class="info-val">${s.age || '—'}</div></div><div class="info-box"><div class="info-label">HEIGHT</div><div class="info-val">${s.height ? s.height + ' cm' : '—'}</div></div></div>` : ''}

${plan.fastDaysPerWeek > 0 ? `<div style="margin:12px 0;padding:10px 14px;background:rgba(179,136,255,0.08);border:1px solid rgba(179,136,255,0.2);border-radius:8px;font-size:12px;color:#b388ff"><strong>WATER FAST DAYS:</strong> ${fastDow.map(d => dayNames[d]).join(', ')} (${plan.fastDaysPerWeek}/week)</div>` : ''}
${plan.lightDaysPerWeek > 0 ? `<div style="margin:12px 0;padding:10px 14px;background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:8px;font-size:12px;color:#f5a623"><strong>LIGHT EATING DAYS:</strong> ${lightDow.map(d => dayNames[d]).join(', ')} (${plan.lightDaysPerWeek}/week)</div>` : ''}
${mode === 'realistic' ? `<div style="margin:12px 0;padding:10px 14px;background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:8px;font-size:12px;color:#f5a623"><strong>COMPLIANCE RATE:</strong> ${Math.round(p.complianceRate * 100)}% — timeline adjusted for real-world adherence.</div>` : ''}

<h2>WEEKLY <span>ROUTINE (MON–SUN)</span></h2>
${weekHTML}

<h2>WORKOUTS</h2>
${workoutHTML || '<p style="color:#777;font-size:12px">No workout content defined for this plan.</p>'}

<h2>NUTRITION</h2>
<div class="info-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:12px">
  <div class="info-box" style="text-align:center"><div class="info-val">${cal}</div><div class="info-label">CALORIES</div></div>
  <div class="info-box" style="text-align:center"><div class="info-val" style="color:#ff9966">${proteinG}g</div><div class="info-label">PROTEIN</div></div>
  <div class="info-box" style="text-align:center"><div class="info-val" style="color:#f5a623">${carbsG}g</div><div class="info-label">CARBS</div></div>
  <div class="info-box" style="text-align:center"><div class="info-val" style="color:#88ccff">${fatG}g</div><div class="info-label">FATS</div></div>
</div>
${nutritionHTML || ''}

<h2>RULES</h2>
${rulesHTML || '<p style="color:#777;font-size:12px">No rules content defined for this plan.</p>'}

<div class="footer">
  PROTOCOL HEALTH — Generated ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })} — v${APP_VERSION}
</div>

</body>
</html>`;

  // Download
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `protocol-health-schedule-${p.startDateStr}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showAlert('Schedule downloaded. Open it in any browser or print to PDF.');
}
