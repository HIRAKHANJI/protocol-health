// ─── EXPORT — RANGE BASED ────────────────────────────────────────────────────
// Different from backup — this generates a structured markdown progress report
// for a selected date range. Preview renders as styled HTML in the modal.
// Two outputs: COPY MARKDOWN (for Notion/Obsidian) and DOWNLOAD REPORT (styled HTML file).
// Backup = machine-readable full snapshot. Export = human-readable selected range.

// v8.0.0 (C2 fix): HTML escape user-controlled strings before they enter the
// markdown. The markdown is later rendered via innerHTML in the preview pane
// (renderMarkdownPreview) and embedded into the downloaded HTML file. Any
// raw <script> or <img onerror="..."> in food names, notes, or settings text
// would execute. Self-XSS via tampered backup or DevTools-edited storage.
// _esc converts &, <, >, " to entities. Numbers are coerced to string first.
function _esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function openExport() {
  // Default range: schedule start (or first logged date) to today
  const to = new Date();
  const _sched = gs(SK.schedule);
  const _s = getSettings();
  const _dl = gs(SK.dayLogs)||{};
  const _schedStart = _sched && _sched.startDate ? _sched.startDate : null;
  const _firstLog = Object.keys(_dl).sort()[0] || null;
  const _settingsStart = _s.startDate || null;
  // Pick most meaningful start: schedule > settings > first log > 30 days ago
  let _fromStr = null;
  if(_schedStart) _fromStr = _schedStart;
  else if(_settingsStart) _fromStr = _settingsStart;
  else if(_firstLog) _fromStr = _firstLog;
  if(!_fromStr) { const f = new Date(); f.setDate(f.getDate()-30); _fromStr = dateToStr(f); }
  document.getElementById('exportFrom').value = _fromStr;
  document.getElementById('exportTo').value = dateToStr(to);
  document.getElementById('exportText').style.display = 'none';
  document.getElementById('exportBtnRow').style.display = 'none';
  document.getElementById('exportOverlay').classList.add('active');
  window._exportMd = '';
}

export function generateExport() {
  const fromStr = document.getElementById('exportFrom').value;
  const toStr = document.getElementById('exportTo').value;
  const incProfile = document.getElementById('exProfile').checked;
  const incProtocol = document.getElementById('exProtocol').checked;
  const incWeights = document.getElementById('exWeights').checked;
  const incCompliance = document.getElementById('exCompliance').checked;
  const incNutrition = document.getElementById('exNutrition').checked;
  const incFoodLog = document.getElementById('exFoodLog').checked;
  const incNotes = document.getElementById('exNotes').checked;
  const incWater = document.getElementById('exWater').checked;
  const incEnergy = document.getElementById('exEnergy').checked;
  const incScheduleSplit = document.getElementById('exSchedule').checked;

  if(!fromStr||!toStr){showAlert('Select a date range first.');return;}
  if(fromStr>toStr){showAlert('From date must be before To date.');return;}

  const dayLogs = gs(SK.dayLogs)||{};
  const fastDays = gs(SK.fastDays)||{};
  const lightDaysData = gs(SK.lightDays)||{};
  const weights = gs(SK.weights)||[];
  const foodLog = gs(SK.foodLog)||{};
  const schedule = gs(SK.schedule);
  const s = getSettings();
  const plan = PLANS[s.plan||'default'] || PLANS.default;
  const exportDate = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // ─── Build set of scheduled dates for fast lookup ───
  const schedDaysSet = new Set((schedule && schedule.days) ? schedule.days : []);

  // ─── Shared computations ───
  const filteredW = weights.filter(w=>w.date>=fromStr&&w.date<=toStr);
  const startW = filteredW.length ? filteredW[filteredW.length-1].weight : null;
  const endW = filteredW.length ? filteredW[0].weight : null;
  const totalChange = (startW && endW) ? (endW - startW) : null;
  const dayCount = Math.round((strToDate(toStr) - strToDate(fromStr)) / 86400000) + 1;
  const weeks = dayCount / 7;
  const avgRate = (totalChange !== null && weeks > 0) ? (totalChange / weeks) : null;
  const logDates = Object.keys(dayLogs).filter(d=>d>=fromStr&&d<=toStr).sort().reverse();
  const _todayExport = todayStr();
  const fastInRange = Object.keys(fastDays).filter(d=>d>=fromStr&&d<=toStr&&d<=_todayExport);
  const lightInRange = Object.keys(lightDaysData).filter(d=>d>=fromStr&&d<=toStr);
  const foodDates = Object.keys(foodLog).filter(d=>d>=fromStr&&d<=toStr).sort().reverse();

  // ─── Split dates by schedule status ───
  const allDatesInRange = [];
  const cur = strToDate(fromStr);
  const end = strToDate(toStr);
  while(cur <= end) { allDatesInRange.push(dateToStr(cur)); cur.setDate(cur.getDate() + 1); }

  const scheduledDates = allDatesInRange.filter(d => schedDaysSet.has(d));
  const nonScheduledDates = allDatesInRange.filter(d => !schedDaysSet.has(d));
  const hasScheduled = scheduledDates.length > 0;
  const hasNonScheduled = nonScheduledDates.length > 0;
  const hasBothSegments = hasScheduled && hasNonScheduled;

  // Count scheduled fast days only up to today (not future ones)
  const fastDaysScheduledSoFar = plan.fastDaysPerWeek > 0 ? allDatesInRange.filter(d=>d<=_todayExport&&plan.fastDaysDow.includes(strToDate(d).getDay())).length : 0;
  const totalFastsInPlan = plan.fastDaysPerWeek > 0 ? allDatesInRange.filter(d=>plan.fastDaysDow.includes(strToDate(d).getDay())).length : 0;

  // BMI helper
  const calcBMI = (kg) => (s.height && kg) ? (kg / Math.pow(s.height/100, 2)).toFixed(1) : null;

  // ─── Helper: compute macro targets averaged across a set of eating dates ───
  function avgMacroTargets(dates) {
    let tP=0, tC=0, tF=0, tCal=0, n=0;
    dates.forEach(d => {
      if(fastDays[d]) return;
      const m = computeMacros(d);
      tP += m.proteinG; tC += m.carbsG; tF += m.fatG; tCal += m.cal; n++;
    });
    if(n === 0) return { cal:s.calories||1500, proteinG:0, carbsG:0, fatG:0 };
    return { cal:Math.round(tCal/n), proteinG:Math.round(tP/n), carbsG:Math.round(tC/n), fatG:Math.round(tF/n) };
  }

  // ─── Helper: generate compliance section for a set of dates ───
  // lvl: markdown heading level ('##' or '###')
  // Excludes type:'info' items (e.g. f2 calorie ceiling card) from compliance calculations
  function buildCompliance(dates, heading, lvl) {
    lvl = lvl || '###';
    let out = '';
    const datesSet = new Set(dates);
    const filteredLogs = logDates.filter(d => datesSet.has(d));
    if(!filteredLogs.length) return out;

    // Build set of info item IDs to exclude from compliance
    const allItems = [...plan.checklistNormal, ...plan.checklistFast, ...(plan.checklistLight||[])];
    const infoIds = new Set(allItems.filter(it => it.type === 'info').map(it => it.id));

    const groupStats = {};
    const itemStats = {};
    allItems.forEach(item => {
      if(infoIds.has(item.id)) return;
      if(!itemStats[item.id]) itemStats[item.id] = { done:0, total:0, label:item.label, group:item.group };
    });

    // Day-level compliance counters
    let fullDays = 0, partialDays = 0, noDays = 0, totalLoggedDays = 0;

    filteredLogs.forEach(dateStr => {
      const log = dayLogs[dateStr];
      if(!log || !log.checks) { noDays++; totalLoggedDays++; return; }
      const isFast = !!fastDays[dateStr];
      const isLight = !!lightDaysData[dateStr];
      const dayChecklist = isFast ? plan.checklistFast : (isLight ? (plan.checklistLight||plan.checklistNormal) : plan.checklistNormal);
      let dayDone = 0, dayTotal = 0;
      dayChecklist.forEach(item => {
        if(infoIds.has(item.id)) return;
        const grp = item.group;
        if(!groupStats[grp]) groupStats[grp] = { done:0, total:0 };
        groupStats[grp].total++;
        if(!itemStats[item.id]) itemStats[item.id] = { done:0, total:0, label:item.label, group:item.group };
        itemStats[item.id].total++;
        dayTotal++;
        if(log.checks[item.id]) {
          groupStats[grp].done++;
          itemStats[item.id].done++;
          dayDone++;
        }
      });
      totalLoggedDays++;
      if(dayTotal > 0 && dayDone === dayTotal) fullDays++;
      else if(dayDone > 0) partialDays++;
      else noDays++;
    });

    // Also count dates in range with no log at all
    const datesWithNoLog = dates.filter(d => d <= _todayExport && !dayLogs[d]).length;
    noDays += datesWithNoLog;

    const groupEntries = Object.entries(groupStats).filter(([,v]) => v.total > 0);
    if(groupEntries.length) {
      out += `${lvl} ${heading}\n\n`;

      // Day-level summary
      const totalDaysInScope = filteredLogs.length + datesWithNoLog;
      if(totalDaysInScope > 0) {
        out += `**Day-Level Compliance:**\n\n`;
        out += `| Metric | Value |\n`;
        out += `|--------|-------|\n`;
        out += `| Days with 100% checklist | ${fullDays} (${totalDaysInScope>0?Math.round(fullDays/totalDaysInScope*100):0}%) |\n`;
        out += `| Days with partial checklist | ${partialDays} (${totalDaysInScope>0?Math.round(partialDays/totalDaysInScope*100):0}%) |\n`;
        out += `| Days with no data | ${noDays} (${totalDaysInScope>0?Math.round(noDays/totalDaysInScope*100):0}%) |\n`;
        out += `\n`;
      }

      // Category breakdown
      const groupNameMap = { MORNING:'Morning routine items', EATING:'Eating protocol items', EVENING:'Evening training items', FAST:'Fasting protocol items', LIGHT:'Light day items', NIGHT:'Night routine items', SUPPLEMENTS:'Supplement items' };
      out += `**Category Breakdown:**\n\n`;
      out += `*Items checked off across all logged days, grouped by checklist category.*\n\n`;
      out += `| Category | Completed | Rate |\n`;
      out += `|----------|-----------|------|\n`;
      groupEntries.forEach(([grp, v]) => {
        const label = groupNameMap[grp] || (grp.charAt(0) + grp.slice(1).toLowerCase() + ' items');
        out += `| ${label} | ${v.done} / ${v.total} | ${Math.round(v.done/v.total*100)}% |\n`;
      });
      const totalDone = groupEntries.reduce((s,e) => s+e[1].done, 0);
      const totalAll = groupEntries.reduce((s,e) => s+e[1].total, 0);
      if(totalAll > 0) out += `| **OVERALL** | **${totalDone} / ${totalAll}** | **${Math.round(totalDone/totalAll*100)}%** |\n`;
      out += `\n`;

      // Weak spots — exclude info items
      const weakItems = Object.values(itemStats)
        .filter(it => it.total >= 5 && !infoIds.has(it.id))
        .map(it => ({ ...it, rate: it.done / it.total }))
        .sort((a,b) => a.rate - b.rate)
        .slice(0, 3);
      if(weakItems.length) {
        out += `**Weak spots:**\n\n`;
        weakItems.forEach(it => {
          const dayType = plan.checklistFast.some(fi => fi.id === it.id) ? 'fast' : (plan.checklistLight||[]).some(li => li.id === it.id) ? 'light' : 'eating';
          const dayTypeLabel = dayType === 'fast' ? ' (fast days)' : dayType === 'light' ? ' (light days)' : '';
          out += `- "${it.label}"${dayTypeLabel} — checked on ${it.done} of ${it.total} ${it.total===1?'day':'days'} (${Math.round(it.rate*100)}%)\n`;
        });
        out += `\n`;
      }
    }
    return out;
  }

  // ─── Helper: generate nutrition overview for a set of dates ───
  // lvl: markdown heading level ('##' or '###')
  function buildNutrition(dates, heading, lvl) {
    lvl = lvl || '###';
    let out = '';
    const datesSet = new Set(dates);
    const segFoodDates = foodDates.filter(d => datesSet.has(d));
    const eatingDates = segFoodDates.filter(d => !fastDays[d] && !lightDaysData[d]);
    const lightEatingDates = segFoodDates.filter(d => !!lightDaysData[d]);
    const fastEatingDates = segFoodDates.filter(d => !!fastDays[d]);

    // Compute per-date-type nutrition stats
    // isBrokenFast: true for fast days where food was consumed — status logic differs
    function nutritionBlock(label, dayList, ceiling, isBrokenFast) {
      let blk = '';
      if(!dayList.length) return blk;
      let totalCal=0, totalP=0, totalC=0, totalF=0, pDays=0, cDays=0, fDays=0, overCount=0, underCount=0;
      dayList.forEach(d => {
        const entries = foodLog[d] || [];
        const dayCal = entries.reduce((sum,e)=>sum+(e.calories||0),0);
        totalCal += dayCal;
        if(ceiling) { if(dayCal > ceiling) overCount++; else underCount++; }
        const dayP = entries.reduce((sum,e)=>sum+(e.protein||0),0);
        const dayC = entries.reduce((sum,e)=>sum+(e.carbs||0),0);
        const dayF = entries.reduce((sum,e)=>sum+(e.fat||0),0);
        if(dayP>0){totalP+=dayP;pDays++;}
        if(dayC>0){totalC+=dayC;cDays++;}
        if(dayF>0){totalF+=dayF;fDays++;}
      });
      const avgCal = Math.round(totalCal/dayList.length);
      const avgP = pDays>0 ? Math.round(totalP/pDays) : null;
      const avgC = cDays>0 ? Math.round(totalC/cDays) : null;
      const avgF = fDays>0 ? Math.round(totalF/fDays) : null;

      // Average macro targets across these specific dates
      const targets = avgMacroTargets(dayList);
      const dayWord = dayList.length === 1 ? 'day' : 'days';

      blk += `**${label}** (${dayList.length} ${dayWord})\n\n`;
      if(isBrokenFast) {
        blk += `*These are fast days where food was consumed. Targets are 0 because these were supposed to be zero-calorie days.*\n\n`;
        blk += `| Metric | Actual | Target | Status |\n`;
        blk += `|--------|--------|--------|--------|\n`;
        blk += `| Calories | ${avgCal} cal | 0 cal | Fast broken |\n`;
        if(avgP!==null) blk += `| Protein | ${avgP}g | 0g | Fast broken |\n`;
        if(avgC!==null) blk += `| Carbs | ${avgC}g | 0g | Fast broken |\n`;
        if(avgF!==null) blk += `| Fat | ${avgF}g | 0g | Fast broken |\n`;
      } else {
        if(ceiling) blk += `*Average daily macros across ${dayList.length} ${dayWord} compared to your plan targets.*\n\n`;
        blk += `| Metric | Actual | Target | Status |\n`;
        blk += `|--------|--------|--------|--------|\n`;
        blk += `| Calories | ${avgCal} cal | ${ceiling || targets.cal} cal | ${ceiling ? (avgCal<=ceiling?'Within ceiling':'Over ceiling') : '—'} |\n`;
        if(avgP!==null) blk += `| Protein | ${avgP}g | ${targets.proteinG}g | ${avgP>=targets.proteinG?'On track':'Below target'} |\n`;
        if(avgC!==null) blk += `| Carbs | ${avgC}g | ${targets.carbsG}g | ${avgC<=targets.carbsG+20?'On track':'Over target'} |\n`;
        if(avgF!==null) blk += `| Fat | ${avgF}g | ${targets.fatG}g | ${avgF<=targets.fatG+10?'On track':'Over target'} |\n`;
      }
      blk += `\n`;
      if(ceiling && !isBrokenFast) {
        blk += `| Compliance | Value |\n`;
        blk += `|------------|-------|\n`;
        blk += `| Days Under Ceiling | ${underCount} / ${dayList.length} |\n`;
        blk += `| Days Over Ceiling | ${overCount} / ${dayList.length} |\n`;
        blk += `\n`;
      }
      return blk;
    }

    const hasAnyFood = eatingDates.length || lightEatingDates.length || fastEatingDates.length;
    if(!hasAnyFood) return out;

    out += `${lvl} ${heading}\n\n`;
    if(eatingDates.length) out += nutritionBlock('Eating Days', eatingDates, s.calories, false);
    if(lightEatingDates.length) {
      const lightCeiling = Math.round((s.tdee||2600)*0.6);
      out += nutritionBlock('Light Eating Days', lightEatingDates, lightCeiling, false);
    }
    if(fastEatingDates.length) out += nutritionBlock('Broken Fast Days', fastEatingDates, null, true);

    // Weekly macro breakdown (eating days only, if enough data)
    if(eatingDates.length) {
      const weekMacroBuckets = {};
      eatingDates.forEach(d => {
        const dt = strToDate(d);
        const day = dt.getDay();
        const mon = new Date(dt); mon.setDate(dt.getDate()-((day+6)%7));
        const sun = new Date(mon); sun.setDate(mon.getDate()+6);
        const key = dateToStr(mon);
        if(!weekMacroBuckets[key]) weekMacroBuckets[key] = { monStr:dateToStr(mon), sunStr:dateToStr(sun), days:0, cal:0, protein:0, carbs:0, fat:0, pDays:0, cDays:0, fDays:0 };
        const b = weekMacroBuckets[key];
        const entries = foodLog[d]||[];
        const dayCal = entries.reduce((sum,e)=>sum+(e.calories||0),0);
        const dayP = entries.reduce((sum,e)=>sum+(e.protein||0),0);
        const dayC = entries.reduce((sum,e)=>sum+(e.carbs||0),0);
        const dayF = entries.reduce((sum,e)=>sum+(e.fat||0),0);
        b.days++; b.cal+=dayCal;
        if(dayP>0){b.protein+=dayP;b.pDays++;}
        if(dayC>0){b.carbs+=dayC;b.cDays++;}
        if(dayF>0){b.fat+=dayF;b.fDays++;}
      });
      const weekMacroKeys = Object.keys(weekMacroBuckets).sort();
      if(weekMacroKeys.length >= 2) {
        const targets = avgMacroTargets(eatingDates);
        out += `**Weekly Macro Averages (eating days)**\n\n`;
        out += `| Week | Avg Cal | Avg Protein | Avg Carbs | Avg Fat |\n`;
        out += `|------|---------|-------------|-----------|----------|\n`;
        weekMacroKeys.forEach(k => {
          const b = weekMacroBuckets[k];
          const wCal = Math.round(b.cal/b.days);
          const wP = b.pDays>0 ? Math.round(b.protein/b.pDays)+'g' : '—';
          const wC = b.cDays>0 ? Math.round(b.carbs/b.cDays)+'g' : '—';
          const wF = b.fDays>0 ? Math.round(b.fat/b.fDays)+'g' : '—';
          out += `| ${b.monStr.slice(5)} to ${b.sunStr.slice(5)} | ${wCal} cal | ${wP} | ${wC} | ${wF} |\n`;
        });
        out += `\n`;
        out += `*Targets: ${targets.proteinG}g protein, ${targets.carbsG}g carbs, ${targets.fatG}g fat per eating day.*\n\n`;
      }
    }
    return out;
  }

  // ─── Helper: generate daily log table for a set of dates ───
  // lvl: markdown heading level ('##' or '###')
  function buildDailyLog(dates, heading, lvl) {
    lvl = lvl || '###';
    let out = '';
    const datesSet = new Set(dates);
    const filteredLogs = logDates.filter(d => datesSet.has(d));
    if(!filteredLogs.length) return out;

    out += `${lvl} ${heading}\n\n`;
    out += `*Full = 100% checklist complete · Good = 70–99% · Partial = 50–69% · Low = below 50%*\n\n`;
    out += `| Date | Type | Score | Status |`;
    if(incWater) out += ` Water |`;
    if(incEnergy) out += ` Energy |`;
    out += `\n`;
    out += `|------|------|-------|--------|`;
    if(incWater) out += `-------|`;
    if(incEnergy) out += `--------|`;
    out += `\n`;
    filteredLogs.forEach(dateStr => {
      const log = dayLogs[dateStr];
      const type = fastDays[dateStr] ? 'Fast' : (lightDaysData[dateStr] ? 'Light' : 'Normal');
      let score = '—', status = '—';
      if(log.checks) {
        const done = Object.values(log.checks).filter(Boolean).length;
        const total = Object.keys(log.checks).length;
        if(total > 0) {
          const pct = Math.round(done/total*100);
          score = `${done}/${total} (${pct}%)`;
          status = pct === 100 ? 'Full' : pct >= 70 ? 'Good' : pct >= 50 ? 'Partial' : 'Low';
        }
      }
      out += `| ${dateStr} | ${type} | ${score} | ${status} |`;
      if(incWater) out += ` ${log.water ? log.water+'L' : '—'} |`;
      if(incEnergy) out += ` ${_esc(log.energy || '—')} |`;
      out += `\n`;
    });
    out += `\n`;
    return out;
  }

  // ─── Helper: generate food log for a set of dates ───
  // lvl: markdown heading level ('##' or '###')
  function buildFoodLog(dates, heading, lvl) {
    lvl = lvl || '###';
    let out = '';
    const datesSet = new Set(dates);
    const segFoodDates = foodDates.filter(d => datesSet.has(d));
    if(!segFoodDates.length) return out;

    out += `${lvl} ${heading}\n\n`;
    segFoodDates.forEach(dateStr => {
      const entries = foodLog[dateStr];
      if(!entries || !entries.length) return;
      const type = fastDays[dateStr] ? ' (Fast)' : (lightDaysData[dateStr] ? ' (Light)' : '');
      out += `**${dateStr}${type}**\n\n`;
      let dayCalTotal = 0;
      entries.forEach(e => {
        const parts = [];
        if(e.protein) parts.push(`P: ${e.protein}g`);
        if(e.carbs) parts.push(`C: ${e.carbs}g`);
        if(e.fat) parts.push(`F: ${e.fat}g`);
        const macros = parts.length ? ` (${parts.join(', ')})` : '';
        out += `- ${_esc(e.name)} — ${e.calories} cal${macros}\n`;
        dayCalTotal += e.calories || 0;
      });
      const cal = s.calories || 1500;
      out += `- **Total: ${dayCalTotal} / ${cal} cal**\n\n`;
    });
    return out;
  }

  // ─── Helper: render a full segment (scheduled or non-scheduled) ───
  function buildSegment(dates, segmentTitle) {
    let out = '';
    if(!dates.length) return out;

    const datesSet = new Set(dates);
    const segLogDates = logDates.filter(d => datesSet.has(d));
    const segFastDates = dates.filter(d => !!fastDays[d]);
    const segLightDates = dates.filter(d => !!lightDaysData[d]);
    const segEatingDates = dates.filter(d => !fastDays[d] && !lightDaysData[d]);

    out += `## ${segmentTitle}\n\n`;
    out += `| Metric | Value |\n`;
    out += `|--------|-------|\n`;
    out += `| Days | ${dates.length} |\n`;
    if(segEatingDates.length) out += `| Eating ${segEatingDates.length===1?'Day':'Days'} | ${segEatingDates.length} |\n`;
    if(segFastDates.length) out += `| Fast ${segFastDates.length===1?'Day':'Days'} | ${segFastDates.length} |\n`;
    if(segLightDates.length) out += `| Light ${segLightDates.length===1?'Day':'Days'} | ${segLightDates.length} |\n`;
    out += `\n`;

    if(incCompliance && segLogDates.length) {
      out += buildCompliance(dates, 'Compliance');
    }

    if(incNutrition) {
      out += buildNutrition(dates, 'Nutrition');
    }

    if(incCompliance && segLogDates.length) {
      out += buildDailyLog(dates, 'Daily Log');
    }

    if(incFoodLog) {
      out += buildFoodLog(dates, 'Food Log');
    }

    out += `---\n\n`;
    return out;
  }

  let md = '';

  // ═══ 1. HEADER ═══
  md += `# Protocol Health — Progress Report\n\n`;
  md += `**Period:** ${fromStr} to ${toStr}  \n`;
  md += `**Exported:** ${exportDate}\n\n`;
  md += `---\n\n`;

  // ═══ 2. PATIENT PROFILE ═══
  if(incProfile) {
    md += `## Patient Profile\n\n`;
    if(s.name) md += `**Name:** ${_esc(s.name)}  \n`;
    if(s.age) md += `**Age:** ${s.age}  \n`;
    if(s.sex) md += `**Sex:** ${s.sex.charAt(0).toUpperCase() + s.sex.slice(1)}  \n`;
    if(s.height) md += `**Height:** ${s.height} cm  \n`;
    if(endW) md += `**Current Weight:** ${endW} kg  \n`;
    const currentBMI = calcBMI(endW);
    if(currentBMI) md += `**BMI:** ${currentBMI}  \n`;
    md += `\n---\n\n`;
  }

  // ═══ 3. ACTIVE PROTOCOL ═══
  if(incProtocol) {
    md += `## Active Protocol\n\n`;
    md += `| Parameter | Value |\n`;
    md += `|-----------|-------|\n`;
    md += `| Plan | ${plan.name} |\n`;
    md += `| Description | ${_esc(plan.subtitle)} |\n`;
    md += `| TDEE | ${s.tdee || plan.tdee} cal/day |\n`;
    if(s.calories) md += `| Calorie Ceiling | ${s.calories} cal/day |\n`;
    if(plan.fastDaysPerWeek > 0) {
      const fastDayNamesList = plan.fastDaysDow.map(d => dayNames[d]).join(', ');
      md += `| Fasting Schedule | ${plan.fastDaysPerWeek} days/week (${fastDayNamesList}) |\n`;
    }
    if(plan.lightDaysPerWeek > 0) {
      const lightDayNamesList = plan.lightDaysDow.map(d => dayNames[d]).join(', ');
      md += `| Light Eating Days | ${plan.lightDaysPerWeek} days/week (${lightDayNamesList}) |\n`;
    }
    md += `\n---\n\n`;
  }

  // ═══ 4. SUMMARY ═══
  md += `## Summary\n\n`;
  md += `*Overview of your progress from plan start to today.*\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  if(startW) md += `| Start Weight | ${startW} kg |\n`;
  if(endW) md += `| End Weight | ${endW} kg |\n`;
  if(totalChange !== null) md += `| Total Change | ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(1)} kg |\n`;
  if(avgRate !== null) md += `| Avg Rate | ${avgRate >= 0 ? '+' : ''}${avgRate.toFixed(2)} kg/week |\n`;
  md += `| Days in Range | ${dayCount} |\n`;
  if(hasScheduled) md += `| Scheduled Days | ${scheduledDates.length} |\n`;
  const startBMI = calcBMI(startW);
  const endBMI = calcBMI(endW);
  if(startBMI && endBMI && startW !== endW) md += `| BMI Change | ${startBMI} → ${endBMI} |\n`;
  if(fastInRange.length > 0) md += `| Fast Days Completed | ${fastInRange.length} / ${fastDaysScheduledSoFar} so far${totalFastsInPlan > fastDaysScheduledSoFar ? ' ('+totalFastsInPlan+' total in plan)' : ''} |\n`;
  if(lightInRange.length > 0) md += `| Light Days | ${lightInRange.length} |\n`;
  md += `\n---\n\n`;

  // ═══ 5–9. SCHEDULE-SPLIT SECTIONS ═══
  if(incScheduleSplit && hasScheduled) {
    // Focus on scheduled days — non-scheduled days mentioned only as footnote
    md += buildSegment(scheduledDates, 'Scheduled Days (' + (schedule ? schedule.planName : plan.badge) + ')');
    if(hasNonScheduled) {
      const nonSchedLogged = nonScheduledDates.filter(d => !!dayLogs[d]).length;
      if(nonSchedLogged > 0) md += `*${nonScheduledDates.length} ${nonScheduledDates.length===1?'day':'days'} outside the schedule window (${nonSchedLogged} with logged data).*\n\n---\n\n`;
    }
  } else {
    // Single segment — no split needed (all scheduled, all non-scheduled, or split disabled)
    const allDates = allDatesInRange;

    if(incCompliance && logDates.length) {
      md += buildCompliance(allDates, 'Protocol Compliance', '##');
      md += `---\n\n`;
    }

    if(incNutrition) {
      const nutr = buildNutrition(allDates, 'Nutrition Overview', '##');
      if(nutr) { md += nutr; md += `---\n\n`; }
    }

    if(incCompliance && logDates.length) {
      md += buildDailyLog(allDates, 'Daily Log', '##');
      md += `---\n\n`;
    }

    if(incFoodLog) {
      const fl = buildFoodLog(allDates, 'Food Log', '##');
      if(fl) { md += fl; md += `---\n\n`; }
    }
  }

  // ═══ WEIGHT TREND — WEEKLY AVERAGES + FULL LOG ��══
  if(incWeights && filteredW.length) {
    md += `## Weight Trend\n\n`;
    md += `*Daily and weekly weight measurements.*\n\n`;

    // Weekly averages
    if(filteredW.length >= 3) {
      const weekBuckets = {};
      filteredW.forEach(w => {
        const d = strToDate(w.date);
        const day = d.getDay();
        const mon = new Date(d); mon.setDate(d.getDate() - ((day + 6) % 7));
        const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
        const key = dateToStr(mon);
        if(!weekBuckets[key]) weekBuckets[key] = { weights:[], monStr:dateToStr(mon), sunStr:dateToStr(sun) };
        weekBuckets[key].weights.push(w.weight);
      });
      const weekKeys = Object.keys(weekBuckets).sort();
      if(weekKeys.length >= 2) {
        md += `### Weekly Averages\n\n`;
        md += `| Week | Avg Weight | Change |\n`;
        md += `|------|-----------|--------|\n`;
        let prevAvg = null;
        weekKeys.forEach(k => {
          const b = weekBuckets[k];
          const avg = b.weights.reduce((s,v)=>s+v,0) / b.weights.length;
          const delta = prevAvg !== null ? `${(avg-prevAvg)>=0?'+':''}${(avg-prevAvg).toFixed(1)} kg` : '—';
          const monD = b.monStr.slice(5);
          const sunD = b.sunStr.slice(5);
          md += `| ${monD} to ${sunD} | ${avg.toFixed(1)} kg | ${delta} |\n`;
          prevAvg = avg;
        });
        md += `\n`;
      }
    }

    // Full weight log
    md += `### Daily Weights\n\n`;
    md += `| Date | Weight | Change |\n`;
    md += `|------|--------|--------|\n`;
    filteredW.forEach((w,i) => {
      const prev = filteredW[i+1];
      const delta = prev ? `${(w.weight-prev.weight)>=0?'+':''}${(w.weight-prev.weight).toFixed(1)} kg` : '—';
      md += `| ${w.date} | ${w.weight} kg | ${delta} |\n`;
    });
    md += `\n---\n\n`;
  }

  // ═══ NOTES ═══
  if(incNotes) {
    const noteDates = logDates.filter(d => dayLogs[d].notes);
    if(noteDates.length) {
      md += `## Notes\n\n`;
      md += `*Your daily journal entries.*\n\n`;
      noteDates.forEach(dateStr => {
        const log = dayLogs[dateStr];
        md += `### ${dateStr}\n\n`;
        md += `> ${_esc(log.notes).replace(/\n/g, '\n> ')}\n`;
        const extras = [];
        if(log.energy) extras.push(`Energy: ${_esc(log.energy)}`);
        if(log.weight) extras.push(`Weight: ${_esc(String(log.weight))}kg`);
        if(extras.length) md += `> ${extras.join(' · ')}\n`;
        md += `\n`;
      });
    }
  }

  if(!logDates.length && !filteredW.length && !foodDates.length) {
    md += `*No data found in this date range.*\n`;
  }

  // Store markdown for copy/download
  window._exportMd = md;

  // Render preview
  const box = document.getElementById('exportText');
  box.innerHTML = renderMarkdownPreview(md);
  box.style.display = 'block';
  document.getElementById('exportBtnRow').style.display = 'flex';
}

// Minimal markdown→HTML converter for in-app preview.
// Only handles patterns that generateExport() produces — not a general parser.
export function renderMarkdownPreview(md) {
  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let inList = false;

  for(let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Horizontal rule
    if(line.trim() === '---') { if(inTable) { html += '</table>'; inTable = false; } if(inList) { html += '</ul>'; inList = false; } html += '<hr>'; continue; }
    // H1
    if(line.startsWith('# ')) { if(inList) { html += '</ul>'; inList = false; } html += `<h1>${inlineFormat(line.slice(2))}</h1>`; continue; }
    // H2
    if(line.startsWith('## ')) { if(inList) { html += '</ul>'; inList = false; } html += `<h2>${inlineFormat(line.slice(3))}</h2>`; continue; }
    // H3
    if(line.startsWith('### ')) { if(inList) { html += '</ul>'; inList = false; } html += `<h3>${inlineFormat(line.slice(4))}</h3>`; continue; }
    // Table row
    if(line.startsWith('|')) {
      // Skip separator rows like |---|---|
      if(line.match(/^\|[\s\-|:]+\|$/)) { continue; }
      if(!inTable) { html += '<table>'; inTable = true; }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // First table row = header if we just opened table
      const tag = (html.endsWith('<table>')) ? 'th' : 'td';
      html += '<tr>' + cells.map(c => `<${tag}>${inlineFormat(c)}</${tag}>`).join('') + '</tr>';
      continue;
    } else if(inTable) { html += '</table>'; inTable = false; }
    // Blockquote
    if(line.startsWith('> ')) { if(inList) { html += '</ul>'; inList = false; } html += `<blockquote>${inlineFormat(line.slice(2))}</blockquote>`; continue; }
    // List item
    if(line.startsWith('- ')) {
      if(!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inlineFormat(line.slice(2))}</li>`;
      continue;
    } else if(inList) { html += '</ul>'; inList = false; }
    // Emphasis-only line (italic)
    if(line.startsWith('*') && line.endsWith('*') && line.length > 2) { html += `<p><em>${inlineFormat(line.slice(1, -1))}</em></p>`; continue; }
    // Paragraph (non-empty lines)
    if(line.trim()) { html += `<p>${inlineFormat(line)}</p>`; }
  }
  if(inTable) html += '</table>';
  if(inList) html += '</ul>';
  return html;
}

// Inline formatting: **bold**, trailing double-space line breaks
export function inlineFormat(s) {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/ {2}$/, '<br>');
}

export function copyExport() {
  if(!window._exportMd) return;
  navigator.clipboard.writeText(window._exportMd)
    .then(()=>{ const btn=document.querySelector('.export-btn-copy'); btn.textContent='✓ COPIED'; setTimeout(()=>btn.textContent='COPY MARKDOWN',1500); })
    .catch(()=>showAlert('Select all and copy manually.'));
}

export function downloadReport() {
  if(!window._exportMd) return;
  const md = window._exportMd;
  // Build a self-contained styled HTML document
  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Protocol Health — Progress Report</title>
<style>
  body { font-family: 'Segoe UI', -apple-system, sans-serif; max-width: 700px; margin: 40px auto; color: #111; font-size: 13px; line-height: 1.6; padding: 0 20px; }
  h1 { font-size: 20px; border-bottom: 2px solid #333; padding-bottom: 6px; margin-bottom: 16px; }
  h2 { font-size: 16px; margin-top: 28px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  h3 { font-size: 14px; margin-top: 18px; color: #444; }
  hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 12px; }
  th { background: #f5f5f5; font-weight: 600; }
  blockquote { border-left: 3px solid #999; padding-left: 12px; color: #555; margin: 8px 0; font-style: italic; }
  ul { padding-left: 20px; }
  li { margin: 3px 0; }
  strong { color: #111; }
  p { margin: 4px 0; }
  @media print { body { margin: 20px; max-width: 100%; } }
</style>
</head>
<body>
${renderMarkdownPreview(md)}
</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'protocol-health-report-' + dateToStr(new Date()) + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
