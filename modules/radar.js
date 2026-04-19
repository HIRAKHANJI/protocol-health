// ─── RADAR CHART ──────────────────────────────────────────────────────────────
// Renders a pure-SVG spider/radar chart on the TRACK tab showing multi-metric
// performance snapshot. Supports 7D and 30D windows.
// Each axis is normalised to 0–100. Chart is drawn as filled polygon over
// concentric guide rings.

let radarWindow = 7; // default 7-day window

export function setRadarWindow(days, btn) {
  radarWindow = days;
  document.querySelectorAll('.radar-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRadar();
}

export function computeRadarMetrics(days) {
  const dayLogs = gs(SK.dayLogs) || {};
  const fastDays = gs(SK.fastDays) || {};
  const weights = gs(SK.weights) || [];
  const s = getSettings();
  const plan = getActivePlan();
  const cal = s.calories || 1500;
  const now = new Date(); now.setHours(0,0,0,0);

  // Establish anchor — earliest date user actually started tracking
  // All behavioral axes only score days from anchor onward
  const sched = gs(SK.schedule) || {};
  let anchorDate = null;
  if (sched.startDate) anchorDate = sched.startDate;
  if (weights.length > 0) {
    const oldestWeight = weights[weights.length - 1].date;
    if (!anchorDate || oldestWeight < anchorDate) anchorDate = oldestWeight;
  }
  Object.entries(dayLogs).forEach(([ds, log]) => {
    if (log && log.checks && Object.values(log.checks).some(Boolean)) {
      if (!anchorDate || ds < anchorDate) anchorDate = ds;
    }
  });

  // Collect date strings for the window
  const windowDates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    windowDates.push(dateToStr(d));
  }

  // Helper: is this date within the user's tracking period AND in the past (completed day)?
  const isPastTracked = (ds) => {
    if (anchorDate && ds < anchorDate) return false;
    return strToDate(ds) < now; // strictly past — today is still in progress
  };
  // Helper: is this date within tracking period (including today)?
  const isTracked = (ds) => {
    if (anchorDate && ds < anchorDate) return false;
    return strToDate(ds) <= now;
  };

  // Count how many completed (past) tracked days we have — used for minimum-data gates
  const completedDays = windowDates.filter(isPastTracked).length;

  // 1. CHECKLIST COMPLIANCE — avg completion % across tracked days with any log data
  // Blends TODAY checklist checks + WORKOUTS tab exercise checks for a unified score.
  // On day 1 with only today (in-progress), show today's live score
  let checkTotal = 0, checkCount = 0;
  windowDates.forEach(ds => {
    if (!isTracked(ds)) return;
    const log = dayLogs[ds];
    let dayChecked = 0, dayTotal = 0;
    // Regular checklist checks (filtered to valid IDs only — prevents orphaned ghosts)
    const vc = getValidCheckCompletion(ds);
    dayChecked += vc.done;
    dayTotal += vc.total;
    // Workout exercise checks (from WORKOUTS tab)
    if (log && log.workoutChecks) {
      const wVals = Object.values(log.workoutChecks);
      dayChecked += wVals.filter(Boolean).length;
      dayTotal += wVals.length;
    }
    if (dayTotal > 0) {
      checkTotal += (dayChecked / dayTotal) * 100;
      checkCount++;
    }
  });
  const checklist = checkCount > 0 ? Math.round(checkTotal / checkCount) : null;

  // 2. CALORIE DISCIPLINE — proportional scoring (not binary)
  // At or under ceiling = 100%. Over ceiling = ceiling/actual ratio.
  // This means 1150 on a 1000 ceiling = 87%, not 0%.
  // Only scores past days (today excluded — day isn't over)
  // Requires at least 1 completed eating day with food data to score
  let calScoreSum = 0, calTotal = 0, calDataDays = 0;
  const _ldMap = gs(SK.lightDays)||{};
  windowDates.forEach(ds => {
    if (!isPastTracked(ds)) return;
    if (fastDays[ds] || _ldMap[ds]) return; // skip fast/light days
    calTotal++;
    const dc = getDayCalories(ds);
    if (dc.hasData) {
      calDataDays++;
      if (dc.total <= cal) {
        calScoreSum += 100;
      } else {
        // Proportional: how close to ceiling? Floored at 0.
        calScoreSum += Math.max(0, Math.round((cal / dc.total) * 100));
      }
    }
  });
  // Gate: need at least 1 eating day with actual food data to produce a score
  const calories = (calTotal > 0 && calDataDays > 0) ? Math.round(calScoreSum / calTotal) : null;

  // 3. FASTING / LIGHT DAY ADHERENCE — % of scheduled fast or light days actually observed
  // Today is excluded — day is in-progress, can't score completion yet
  // Past fast days scored by food absence weighted by checklist completion
  const lightDaysMap = gs(SK.lightDays)||{};
  const lightDow = plan.lightDaysDow || [];
  const todayDateStr = dateToStr(new Date());
  let fastScheduled = 0, fastCompleted = 0;
  windowDates.forEach(ds => {
    if (!isPastTracked(ds)) return;
    if (ds === todayDateStr) return; // Today is in-progress — don't score
    const dow = strToDate(ds).getDay();
    if (plan.fastDaysDow.includes(dow)) {
      fastScheduled++;
      if (fastDays[ds]) {
        const dc = getDayCalories(ds);
        const log = dayLogs[ds];
        const checks = log ? Object.values(log.checks || {}) : [];
        const checksDone = checks.filter(Boolean).length;
        const checksTotal = checks.length;
        const checklistScore = checksTotal > 0 ? checksDone / checksTotal : 0;

        if (!dc.hasData || dc.total === 0) {
          // Food absence confirmed. Score weighted by checklist completion.
          fastCompleted += 0.5 + (checklistScore * 0.5);
        } else {
          // Food was logged on a fast day = fast was broken. Partial credit.
          fastCompleted += 0.3 * checklistScore;
        }
      }
    } else if (lightDow.includes(dow)) {
      if (ds === todayDateStr) return; // Today is in-progress — don't score
      // Only count light days that are actually marked (consistent with fast day logic)
      if (lightDaysMap[ds]) {
        fastScheduled++;
        const dc = getDayCalories(ds);
        const lightCeil = Math.round((s.tdee || 2600) * 0.6);
        if (!dc.hasData || dc.total <= lightCeil) fastCompleted++;
        else fastCompleted += 0.5;
      }
    }
  });
  const fasting = fastScheduled > 0 ? Math.round((fastCompleted / fastScheduled) * 100) : null;

  // 4. WATER INTAKE — avg vs 3L target across tracked days
  // Gate: need at least 2 days of water data for a meaningful average
  // With only 1 day, show it but flag it in legend as provisional
  let waterSum = 0, waterCount = 0;
  windowDates.forEach(ds => {
    if (!isTracked(ds)) return;
    const log = dayLogs[ds];
    if (log && log.water && log.water > 0) {
      waterSum += log.water;
      waterCount++;
    }
  });
  const waterTarget = 3.0;
  const water = waterCount > 0 ? Math.min(100, Math.round((waterSum / waterCount / waterTarget) * 100)) : null;

  // 5. WEIGHT TREND — normalised score based on whether weight is moving in the right direction
  let weightTrend = null;
  const radarCurrentW = weights.length > 0 ? weights[0].weight : s.currentKg;
  const isBulkRadar = s.targetKg && radarCurrentW && s.targetKg > radarCurrentW;
  if (weights.length >= 2) {
    const windowWeights = weights.filter(w => {
      const wd = strToDate(w.date);
      const diff = (now - wd) / 86400000;
      return diff >= 0 && diff <= days;
    });
    if (windowWeights.length >= 2) {
      const newest = windowWeights[0].weight;
      const oldest = windowWeights[windowWeights.length - 1].weight;
      const dailyChange = (oldest - newest) / Math.max(1, (strToDate(windowWeights[0].date) - strToDate(windowWeights[windowWeights.length-1].date)) / 86400000);
      const dailyProgress = isBulkRadar ? -dailyChange : dailyChange;
      const targetRate = 0.15;
      if (dailyProgress >= targetRate) weightTrend = 100;
      else if (dailyProgress > 0) weightTrend = Math.round(50 + (dailyProgress / targetRate) * 50);
      else if (dailyProgress === 0) weightTrend = 50;
      else weightTrend = Math.max(0, Math.round(50 + (dailyProgress / targetRate) * 50));

      // Dampen weight trend when data is sparse — early readings are unreliable
      // Full confidence at 7+ data points. Below that, scale linearly.
      if (weightTrend !== null && windowWeights.length < 7) {
        const confidence = windowWeights.length / 7;
        weightTrend = Math.round(weightTrend * confidence);
      }
    }
  }

  // 6. GOAL PROGRESS — overall progress toward target weight
  // This is all-time by nature, BUT we show window-specific rate in the legend
  let goalProgress = null;
  if (weights.length > 0) {
    const target = s.targetKg || 91;
    const start = weights.length ? weights[weights.length - 1].weight : (s.currentKg || 104);
    const current = weights[0].weight;
    const totalChange = isBulkRadar ? (target - start) : (start - target);
    const progress = isBulkRadar ? (current - start) : (start - current);
    if (totalChange > 0) {
      goalProgress = Math.min(100, Math.max(0, Math.round((progress / totalChange) * 100)));
    }
  }

  // 7. CONSISTENCY — depth of daily engagement + streak bonus
  // Not just "did you show up" but "how much did you do after showing up"
  // Daily quality (0-1): checklist depth × 0.50, food logged × 0.20, weight logged × 0.15, tracking × 0.15
  // Streak bonus: +1 per 2 consecutive days with quality ≥ 0.3, max +10
  // Gate: need at least 2 tracked days to produce a meaningful score.
  let qualitySum = 0;
  let effectiveDays = 0;
  // Sort window dates chronologically (oldest first) for streak calculation
  const chronoDates = [...windowDates].reverse();
  const dailyQualities = [];
  chronoDates.forEach(ds => {
    if (!isTracked(ds)) { dailyQualities.push(-1); return; } // -1 = not trackable
    effectiveDays++;
    const log = dayLogs[ds];
    // Checklist depth: what % of the day's checklist was completed (not just "any box")
    const dayType = getDayType(ds);
    const dayChecklist = dayType === 'fast' ? plan.checklistFast
      : (dayType === 'light' && plan.checklistLight ? plan.checklistLight : plan.checklistNormal);
    const totalItems = dayChecklist.length;
    let checkedCount = 0;
    if (log && log.checks && totalItems > 0) {
      dayChecklist.forEach(item => { if (log.checks[item.id]) checkedCount++; });
    }
    const checklistDepth = totalItems > 0 ? (checkedCount / totalItems) : 0;
    // Other engagement signals
    const hasWeight = weights.some(w => w.date === ds) ? 1 : 0;
    const hasFood = getDayCalories(ds).hasData ? 1 : 0;
    const hasTracking = (log && (log.water || log.energy || log.notes)) ? 1 : 0;
    // Weighted quality score
    const quality = (checklistDepth * 0.50) + (hasFood * 0.20) + (hasWeight * 0.15) + (hasTracking * 0.15);
    qualitySum += quality;
    dailyQualities.push(quality);
  });
  // Streak bonus: consecutive days with quality ≥ 0.3 ending at today/yesterday
  let currentStreak = 0;
  for (let i = dailyQualities.length - 1; i >= 0; i--) {
    if (dailyQualities[i] === -1) continue; // skip non-trackable
    if (dailyQualities[i] >= 0.3) currentStreak++;
    else break;
  }
  const streakBonus = Math.min(10, Math.floor(currentStreak / 2));
  // Gate: 1 day = you just started, not enough to measure consistency
  const consistency = effectiveDays >= 2
    ? Math.min(100, Math.round((qualitySum / effectiveDays) * 100 + streakBonus))
    : null;

  const result = [
    { key: 'checklist', label: 'CHECKLIST', value: checklist, color: 'var(--accent)' },
    { key: 'calories', label: 'CALORIES', value: calories, color: 'var(--accent2)' },
    { key: 'fasting', label: lightDow.length > 0 && plan.fastDaysDow.length === 0 ? 'LIGHT DAYS' : 'FASTING', value: fasting, color: lightDow.length > 0 && plan.fastDaysDow.length === 0 ? 'var(--light)' : 'var(--fast)' },
    { key: 'water', label: 'WATER', value: water, color: '#4fc3f7' },
    { key: 'weight', label: 'WEIGHT TREND', value: weightTrend, color: 'var(--green)' },
    { key: 'goal', label: 'GOAL', value: goalProgress, color: '#ff7043' },
    { key: 'consistency', label: 'CONSISTENCY', value: consistency, color: '#ce93d8' }
  ];
  result._anchor = anchorDate;
  result._completedDays = completedDays;
  result._streak = currentStreak;
  return result;
}

export function renderRadar() {
  const container = document.getElementById('radarSvg');
  const legend = document.getElementById('radarLegend');
  if (!container) return;

  const metrics = computeRadarMetrics(radarWindow);
  const hasData = metrics.some(m => m.value !== null);

  if (!hasData) {
    container.innerHTML = '<div class="radar-empty">Start logging to see your performance radar.<br>Checklist, weight, food, and water data build this chart.</div>';
    legend.innerHTML = '';
    return;
  }

  // Always show all 7 axes — null means no data yet, render as 0
  const axes = metrics.map(m => ({ ...m, value: m.value !== null ? m.value : 0, noData: m.value === null }));
  const n = axes.length;

  // SVG params — generous viewBox so labels never clip
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 100;
  const rings = 4; // guide rings at 25%, 50%, 75%, 100%
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // top

  // Helper to get point on circle
  const pt = (angle, r) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  });

  let svg = `<svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:${size}px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">`;

  // Guide rings
  for (let r = 1; r <= rings; r++) {
    const radius = (r / rings) * maxR;
    const points = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      const p = pt(angle, radius);
      points.push(`${p.x},${p.y}`);
    }
    svg += `<polygon points="${points.join(' ')}" fill="none" stroke="#444" stroke-width="0.8" opacity="0.7"/>`;
  }

  // Axis lines
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const p = pt(angle, maxR);
    svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#444" stroke-width="0.7" opacity="0.5"/>`;
  }

  // Data polygon
  const dataPoints = [];
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const val = Math.max(0, Math.min(100, axes[i].value));
    const r = (val / 100) * maxR;
    const p = pt(angle, r);
    dataPoints.push(p);
  }
  const polyStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  svg += `<polygon points="${polyStr}" fill="rgba(200,245,66,0.12)" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>`;

  // Data points (dots) and labels
  // Short labels so they fit on mobile
  const shortLabels = { 'CHECKLIST':'CHECK', 'CALORIES':'CAL', 'FASTING':'FAST', 'WATER':'WATER', 'WEIGHT TREND':'WEIGHT', 'GOAL':'GOAL', 'CONSISTENCY':'CONSIST' };
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const val = Math.max(0, Math.min(100, axes[i].value));
    const r = (val / 100) * maxR;
    const p = pt(angle, r);

    // Push labels out with enough gap — further for top/bottom to avoid overlap
    const isTop = (angle > -Math.PI * 0.75 && angle < -Math.PI * 0.25);
    const isBottom = (angle > Math.PI * 0.25 && angle < Math.PI * 0.75);
    const labelDist = (isTop || isBottom) ? maxR + 26 : maxR + 22;
    const labelP = pt(angle, labelDist);

    // Dot — dimmed if no data
    const dotColor = axes[i].noData ? '#333' : axes[i].color;
    svg += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${dotColor}" stroke="var(--bg)" stroke-width="1.5"/>`;

    // Label + value
    const anchor = Math.abs(labelP.x - cx) < 8 ? 'middle' : labelP.x < cx ? 'end' : 'start';
    const dy = labelP.y < cy ? '-0.2em' : '1em';
    const displayLabel = shortLabels[axes[i].label] || axes[i].label;
    const labelFill = axes[i].noData ? '#444' : '#666';
    svg += `<text x="${labelP.x}" y="${labelP.y}" text-anchor="${anchor}" dy="${dy}" fill="${labelFill}" font-family="'DM Mono',monospace" font-size="10" letter-spacing="0.5">${displayLabel}</text>`;
    // Value beneath label — show "—" for no-data
    const valDy = labelP.y < cy ? '0.8em' : '2em';
    const valText = axes[i].noData ? '—' : `${axes[i].value}%`;
    const valColor = axes[i].noData ? '#444' : axes[i].color;
    svg += `<text x="${labelP.x}" y="${labelP.y}" text-anchor="${anchor}" dy="${valDy}" fill="${valColor}" font-family="'DM Mono',monospace" font-size="9.5" font-weight="600">${valText}</text>`;
  }

  // Center % ring labels (only 50 and 100 to reduce clutter)
  [2,4].forEach(r => {
    const radius = (r / rings) * maxR;
    const pct = r * 25;
    svg += `<text x="${cx + 3}" y="${cy - radius + 8}" fill="#333" font-family="'DM Mono',monospace" font-size="8">${pct}</text>`;
  });

  svg += '</svg>';
  container.innerHTML = svg;

  // Legend — full labels with values
  // Show a note about data span when both windows would look the same
  const windowLabel = radarWindow === 7 ? '7-DAY' : '30-DAY';
  const now = new Date(); now.setHours(0,0,0,0);
  const daysFromAnchor = (() => {
    if(!metrics._anchor) return 0;
    return Math.floor((now - strToDate(metrics._anchor)) / 86400000) + 1;
  })();
  const legendNotes = {
    'checklist': 'Avg completion',
    'calories': 'Under ceiling',
    'fasting': 'Fast adherence',
    'water': 'Vs 3L target',
    'weight': radarWindow === 7 ? '7d direction' : '30d loss rate',
    'goal': 'All-time',
    'consistency': metrics._streak >= 4 ? `Depth + ${metrics._streak}d streak` : 'Engagement depth'
  };
  let legendHtml = '';
  // Show data span note when tracking period is shorter than the selected window
  if(daysFromAnchor > 0 && daysFromAnchor <= 7) {
    legendHtml += `<div style="font-family:'DM Mono',monospace;font-size:0.5rem;color:var(--muted);text-align:center;margin-bottom:8px;letter-spacing:0.5px">DAY ${daysFromAnchor} OF TRACKING — 7D and 30D will diverge after 7 days of data</div>`;
  }
  legendHtml += axes.map(a => {
    const dotBg = a.noData ? '#333' : a.color;
    const valDisplay = a.noData ? '<span style="color:#444;">—</span>' : `${a.value}%`;
    const noteText = a.noData ? 'No data yet' : (legendNotes[a.key]||'');
    return `<div class="radar-leg-item"><div class="radar-leg-dot" style="background:${dotBg}"></div><div style="display:flex;flex-direction:column;gap:1px;flex:1;min-width:0;"><span style="color:${a.noData ? '#555' : 'var(--text)'};font-size:0.52rem;">${a.label}</span><span style="font-size:0.42rem;opacity:0.6;">${noteText}</span></div><span class="radar-leg-val">${valDisplay}</span></div>`;
  }).join('');
  legend.innerHTML = legendHtml;
}
