# Plan: Doctor-Ready Export Report (v2.8.0)

## The Compliance Problem

A doctor doesn't need to see "Wake & 500ml water immediately — checked 28/30 days". That's too granular. But just "Compliance: 87%" is useless — 87% compliance towards *what*?

**Middle ground: Group-level compliance with weak spots.**

Instead of listing every checklist item, show compliance broken down by **group** (MORNING, EATING, EVENING, SUPPLEMENTS, FAST, NIGHT). Each group gets a percentage. Then show the **3 most-missed items** specifically — the weak spots a doctor would actually want to discuss.

This tells a doctor: "Patient followed eating rules 72% of the time — most commonly broke calorie ceiling and skipped the 6PM cutoff."

---

## Changes

### 1. Settings: Add `name` field

- Add `name: ''` to `getSettings()` defaults
- Add a text input at the top of the settings panel (above plan selector): label "YOUR NAME", placeholder "Enter your name"
- Save on settings confirm like all other fields
- Report pulls `s.name` — if blank, omit the Name line

### 2. Report: Patient Profile section (new, after header)

Placed right after the title/header block, before Summary. Pulls from settings + latest weight:

| Field | Source | Notes |
|-------|--------|-------|
| Name | `s.name` | Omit if blank |
| Age | `s.age` | Omit if null |
| Sex | `s.sex` | Capitalize first letter |
| Height | `s.height` cm | Omit if null |
| Current Weight | Latest weight entry in range | From filtered weights array |
| BMI | `weight / (height/100)²` | Only if both height and weight exist |

Rendered as a simple key-value list (not a table — too clinical for a profile block).

### 3. Report: Active Protocol section (new, after Patient Profile)

Gives the doctor context on what the user is doing. Pulls from plan object + settings:

| Field | Source |
|-------|--------|
| Plan Name | `plan.name` |
| Description | `plan.subtitle` |
| TDEE | `plan.tdee` or `s.tdee` |
| Calorie Ceiling | `s.calories` |
| Fasting Schedule | `plan.fastDaysPerWeek` + day names from `plan.fastDaysDow` |
| Light Day Schedule | `plan.lightDaysPerWeek` + day names (if applicable) |
| Exercise Burn | `s.exerciseBurn` cal/day (if set) |

Rendered as a markdown table.

### 4. Report: Replace flat "Compliance: X%" with Group-Level Breakdown

**New section: "Protocol Compliance"** replaces the old compliance column.

For each group that appears in the active plan's checklists (MORNING, EATING, EVENING, SUPPLEMENTS, FAST, LIGHT, NIGHT), compute:
- Total possible ticks across all days in range for items in that group
- Actual ticks completed
- Percentage

Rendered as a table:

```
| Group | Completion | Rate |
|-------|-----------|------|
| MORNING | 112 / 120 | 93% |
| EATING | 108 / 150 | 72% |
| EVENING | 85 / 90 | 94% |
| SUPPLEMENTS | 45 / 60 | 75% |
```

Then: **"Weak Spots"** — the 3 individual checklist items with the lowest completion rate (minimum 5 data points to avoid noise). Shown as a short list:

```
- "Stayed under calorie ceiling" — completed 18/30 days (60%)
- "Last meal before 6PM" — completed 20/30 days (67%)
- "Morning supplements taken" — completed 22/30 days (73%)
```

This gives a doctor the signal without the noise.

### 5. Report: Nutrition Overview (new section, after compliance)

Computed from food log data in range:

| Metric | Source |
|-------|--------|
| Avg daily intake (eating days) | Sum all food log calories on non-fast, non-light days, divide by count |
| Calorie ceiling | `s.calories` |
| Days over ceiling | Count of eating days where total > ceiling |
| Days under ceiling | Count of eating days where total ≤ ceiling |
| Avg protein (if macro data exists) | Average protein from food entries that have protein logged |

Rendered as a table. Only shown if food log data exists in the range.

### 6. Report: Weight Trend — Add Weekly Averages

Keep the existing weight log table. Add a **Weekly Averages** sub-table above it:

Group weight entries by ISO week, compute average per week. Show:

```
| Week | Avg Weight | Change |
|------|-----------|--------|
| Mar 10–16 | 104.2 kg | — |
| Mar 17–23 | 103.5 kg | -0.7 kg |
```

This is what a doctor actually wants to see — smoothed trend, not daily noise.

### 7. Report: BMI at Start/End

Add to the Summary table:
- BMI (start of range) — computed from first weight in range + height
- BMI (end of range) — computed from last weight in range + height
- Only shown if height is set in settings

### 8. Remove Target Weight from Report

As requested — no `s.targetKg` anywhere in the report. The target may have been different during the selected range.

### 9. Daily Compliance Table — Simplified

The existing daily compliance table stays but gets the day type column enhanced:
- Instead of just "Normal/Fast/Light", show the completion percentage with a text indicator:
  - 100% → "Full"
  - 75-99% → "Good"
  - 50-74% → "Partial"
  - <50% → "Low"

This keeps the per-day detail available without needing a separate section.

---

## Section Order in Generated Report

1. **Title** — "Protocol Health — Progress Report"
2. **Patient Profile** — name, age, sex, height, current weight, BMI
3. **Active Protocol** — plan name, TDEE, calories, fasting schedule
4. **Summary** — weight change, avg rate, days, BMI start/end, fast day count
5. **Protocol Compliance** — group-level breakdown table + weak spots
6. **Nutrition Overview** — avg intake, ceiling adherence, protein avg (if food data)
7. **Weight Trend** — weekly averages table + full weight log table
8. **Daily Log** — per-day compliance table (simplified)
9. **Food Log** — per-day food entries with macros
10. **Notes** — dated notes with blockquotes

---

## Files Changed

- `app.html` — settings defaults, settings UI, generateExport(), report sections
- `UPDATE_LOG.md` — version entry

## Version

- `2.7.0` → `2.8.0` (minor — new feature: doctor-ready report + name setting)
