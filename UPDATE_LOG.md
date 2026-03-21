# Protocol Health — Update Log

All version history for the app. Each entry records version number, date, scope, and what changed.

---

## Version 3.0.3 — 2026-03-21

**Scope:** Patch (bug fix)
**Banner:** No banner (patch).

- **Fix: schedule removal leaves today highlighted as fast/light day** — `removeSchedule()` used strict greater-than (`d > today`) when clearing auto-set fast and light days, so today's entry was never removed. Changed to `d >= today` so the current day is also cleared. Updated confirmation message to reflect this.

---

## Version 3.0.2 — 2026-03-21

**Scope:** Patch (bug fix from codebase scan)
**Banner:** No banner (patch).

- **Fix: backup restore breaks activity level dropdown** — `restoreData()` referenced element ID `settingActivity` instead of `settingActivityLevel` (lines 5634, 5639). After restoring a backup, the activity level dropdown was not populated and TDEE calculations would use the wrong multiplier.
- **Fix: stale version in CLAUDE.md code example** — The "How to Bump" example showed `APP_VERSION = '2.8.1'` instead of the current version.

---

## Version 3.0.1 — 2026-03-21

**Scope:** Patch (bug fixes from codebase scan)
**Banner:** No banner (patch).

- **Fix: duration bar NaN when totalDays is 0** — `updateDurationBar()` now guards against `sched.totalDays === 0` to prevent NaN/Infinity percentage display.
- **Fix: index.html footer version mismatch** — Footer showed `v2.10.0` while hero badge showed `v3.0.0`. Both now show `v3.0.1`.
- **Fix: CLAUDE.md stale version references** — Quick Reference and Current Version sections still referenced `2.10.0`. Updated to `3.0.1`.
- **Fix: missing theme-color meta tag in index.html** — Added `<meta name="theme-color" content="#0a0a0a">` to match app.html and manifest.json.

---

## Version 3.0.0 — 2026-03-21

**Scope:** Major (version rollover from 2.10.0 — export report restructure with schedule-aware sections)
**Banner:** "Export reports now split by scheduled vs non-scheduled days with day-type breakdowns, per-date macro targets, and full checkbox control over every report section."

- **Schedule-split export reports** — When the "Schedule Split" checkbox is enabled and the selected date range contains both scheduled and non-scheduled days, the report renders two separate segments: "Scheduled Days (PLAN)" and "Non-Scheduled Days". Each segment gets its own day count breakdown (eating/fast/light), compliance stats, nutrition overview, daily log, and food log. If the range only contains one type, no split occurs and the report renders as a single flat section.
- **Day-type nutrition breakdown** — Nutrition sections now break down averages separately for eating days, light eating days, and fast days (if food was logged on them). Each sub-block shows its own actual vs target comparison. Light eating days use the correct ~60% TDEE ceiling instead of the normal calorie ceiling.
- **Per-date macro targets** — Macro targets in the report are now computed by averaging `computeMacros()` across the actual dates in each section, instead of using today's single snapshot. This means targets correctly reflect rest days, pre-fast days, and signal variations across the date range.
- **New export checkboxes** — Added Profile, Protocol, Nutrition, Food Log, and Schedule Split checkboxes alongside the existing Weights, Compliance, Notes, Water, and Energy controls. Each checkbox independently controls whether its section appears in the generated report.
- **Food Log checkbox control** — The food log section (per-day itemized entries with macros) is now gated behind its own "Food Log" checkbox, separate from the "Nutrition" checkbox which controls the aggregated nutrition overview with averages and weekly breakdowns.
- **Day type labels in food log** — Each date in the food log now shows its type suffix: (Fast), (Light), or nothing for normal eating days.

---

## Version 2.10.0 — 2026-03-21

**Scope:** Minor (enhanced nutrition reporting in exports)
**Banner:** "Nutrition reports — weekly macro averages, actual vs target comparison, and calorie compliance breakdown in exports."

- **Enhanced Nutrition Overview in exports** — The Nutrition Overview section in generated reports now includes a full macro comparison table showing actual daily averages vs plan targets for calories, protein, carbs, and fat. Each row shows an "On track" / "Below target" / "Over target" status so doctors and users can immediately see which macros are hitting targets and which aren't.
- **Weekly Macro Averages table** — New sub-section below the daily averages showing week-by-week average calories, protein, carbs, and fat (Mon–Sun buckets). Target macro values shown as a reference line below the table. Only renders when 2+ weeks of food data exist in the selected range.
- **Calorie compliance table** — Days under/over ceiling now shown in a separate compliance table for clarity, rather than mixed into the daily averages table.
- **All three macros tracked** — Previously only protein was shown in the nutrition overview. Now carbs and fat are included with per-macro day counting (only days where that macro was logged contribute to its average, preventing 0-entry days from skewing the numbers).

---

## Version 2.9.1 — 2026-03-21

**Scope:** Patch (critical data loss fix)
**Banner:** No banner (patch).

- **Fix: checklist checks lost when toggling day type** — Tapping a checklist item on the TODAY tab after toggling between normal/fast/light day types would permanently destroy checks from the other day type. The `toggle()` function created a new empty checks object from only DOM-visible items, overwriting all stored checks. Now preserves existing checks from storage (matching the pattern already used correctly in the day modal's `toggleModalCheck()`). Same fix applied to `resetToday()` which also cleared all day types' checks instead of only the visible ones.
- **Fix: radar chart isBulkRadar uses latest weight** — `isBulkRadar` was comparing target against `s.currentKg` (initial settings value). Now uses the latest weight log entry, so the radar correctly detects direction even if the user overshoots their target.

---

## Version 2.9.0 — 2026-03-21

**Scope:** Minor (radar chart bulk support + 4 fixes)
**Banner:** "Radar chart now works for bulk plans — weight trend, goal progress, and NIGHT checklist group gets its own color."

- **Fix: radar chart weight trend broken for bulk plans** — Weight trend axis was hardcoded to score weight loss as good. On bulk plans, gaining weight scored 0-17 (terrible) instead of 75-100 (on track). Now detects plan direction via `isBulkRadar` and inverts the scoring: gaining weight on bulk = good, losing weight on bulk = bad.
- **Fix: radar chart goal progress missing for bulk plans** — Goal progress axis calculated `totalDrop = start - target` which is negative for bulk (target > start), failing the `> 0` guard and leaving the axis as null/missing. Now calculates bidirectionally: `totalChange = target - start` for bulk, `start - target` for cut.
- **Fix: restore doesn't sync all custom dropdowns** — After backup restore, activity level and sex custom dropdowns showed stale values until manually changed. Now syncs `settingSex`/`sexSelectCustom` and `settingActivity`/`activitySelectCustom` alongside plan and risk dropdowns.
- **Fix: NIGHT checklist group missing tag color** — NIGHT group items fell through to generic `tag-rules` (blue) styling. Added `tag-night` CSS class (indigo) and added NIGHT to the tag color ternary chain in both TODAY checklist and day modal renderers.

---

## Version 2.8.2 — 2026-03-21

**Scope:** Patch (bulk plan display fixes + cleanup)
**Banner:** No banner (patch).

- **Fix: calcAdjust() rate sign wrong for bulk plans** — Schedule ADJUST rate display now shows `+X.XXkg/wk` for bulk plans instead of always showing a minus sign. Same fix applied to the observed/formula info line.
- **Fix: projection color logic broken for bulk** — Weight projection "good"/"warn" coloring now correctly detects bulk direction. Previously, losing weight on a bulk plan still showed green (good) because the condition only checked `projSunday <= target`. Now checks `projSunday > latest.weight` for bulk plans.
- **Fix: calcAdjust() aggressive warning threshold not bulk-aware** — Warning now fires at >0.5 kg/week for bulk plans (mostly fat gain territory) instead of the cut-only >2 kg/week threshold. Matches the bulk-specific thresholds already used in `calcDuration()`.
- **Fix: restoreData() date display timezone bug** — Backup restore confirmation now uses `strToDate()` instead of `new Date()` to parse the export date string. `new Date("YYYY-MM-DD")` parses as UTC midnight which could display as the previous day in negative UTC offset timezones — the exact bug the codebase's date rules exist to prevent.
- **Fix: projection band variable naming** — Renamed `bestCase`/`worstCase` to `lowCase`/`highCase` to match the direction-neutral UI labels ("LOW"/"HIGH"). The old names assumed cut-only semantics.
- **CLAUDE.md self-update rule** — Added instruction requiring all version references in CLAUDE.md to be updated whenever APP_VERSION is bumped. Prevents stale version numbers in project documentation.
- **Deleted dead files** — Removed `favicon-16.png` and `favicon-48.png` which were not referenced by any HTML, manifest, or service worker file.

---

## Version 2.8.1 — 2026-03-21

**Scope:** Patch (bug fixes from full codebase scan)
**Banner:** No banner (patch).

- **Fix: generateExport() crash on invalid plan key** — Added `|| PLANS.default` fallback to the PLANS lookup in `generateExport()`. Every other PLANS reference in the codebase had this guard; the export function was the only one missing it, causing a crash if `settings.plan` held a deleted/invalid key.
- **Fix: applySchedule() crash on invalid plan key** — Same `|| PLANS.default` fallback added to `applySchedule()` line that accessed `PLANS[p.planVal].badge` without a guard.
- **Fix: "null" displayed on first launch** — `updateGoalBar()` now guards against `null`/`undefined` weight. New installs with no weight data show "—" and "No data yet" instead of literal "null" text in the header and goal strip.
- **Fix: index.html footer version** — Footer was stuck at v2.5.0 while hero badge was correct. Both now show v2.8.1.
- **Fix: favicon files not cached offline** — Added `favicon.ico` and `favicon-32.png` to the service worker's best-effort cache list. Previously only PNG logos were cached.
- **Fix: calcAdjust() broken for bulk plans** — Schedule ADJUST now detects plan direction (cut vs bulk) and inverts the math accordingly. `remainKg` correctly calculates `target - current` for bulk and `current - target` for cut. Formula rate uses `Math.abs()` for bulk surplus. `openManageSchedule()` status text also updated to show "Gained" instead of "Lost" for bulk plans.
- **Fix: silent data loss on storage full** — `ss()` now catches `QuotaExceededError` specifically and shows a `showAlert()` warning telling the user to back up and clear old data, instead of silently swallowing the error.
- **CLAUDE.md updated** — Version references updated from 2.6.0 to 2.8.1. Settings field list corrected: removed `exerciseBurn` (deleted in v2.2.0), added `age`, `height`, `sex`, `activityLevel`, `name`. `checklistLight` spec clarified as optional for plans with 0 light days.

---

## Version 2.8.0 — 2026-03-21

**Scope:** Minor (new feature — doctor-ready export report + name setting)
**Banner:** "Doctor-ready reports — patient profile, group-level compliance, nutrition overview, weekly weight trends, BMI tracking."

- **Name field in settings** — New `name` field added to `getSettings()` defaults (empty string). Text input added at top of settings panel ("YOUR NAME"). Persists in `SK.settings` until manually changed. Used in exported reports — if blank, the Name line is omitted.
- **Patient Profile section** — Report now opens with a Patient Profile block showing name, age, sex, height, current weight, and computed BMI (weight / (height/100)²). All fields pulled from settings; each omitted if not set. Replaces the old hardcoded name.
- **Active Protocol section** — New section shows the active plan's name, subtitle, TDEE, calorie ceiling, and fasting/light day schedule (including which days of the week). Gives a doctor full context on the user's protocol without needing to explain the app.
- **Group-level compliance** — Replaced the flat "Compliance: X%" with a per-group breakdown table. Each checklist group (MORNING, EATING, EVENING, SUPPLEMENTS, FAST, LIGHT, NIGHT) gets its own completion count and percentage. Overall total shown in bold. Uses the correct day-specific checklist (fast/light/normal) for each logged day.
- **Weak spots** — Below the compliance table, the 3 individual checklist items with the lowest completion rate (minimum 5 data points) are listed with their exact day counts. Shows a doctor specifically which habits are slipping.
- **Nutrition overview** — New section computed from food log data: average daily calorie intake (eating days only, excluding fast/light days), days over/under calorie ceiling, and average protein intake. Only shown if food log data exists in the selected range.
- **Weekly weight averages** — Weight Trend section now leads with a weekly averages table that groups daily weights by calendar week (Mon–Sun) and shows the smoothed average and week-over-week change. Daily weights table moved below as "Daily Weights" sub-section. Only shown if 3+ weight entries and 2+ weeks of data exist.
- **BMI tracking** — Summary table now includes BMI change (start → end) when height is set in settings and start/end weights differ. Patient Profile shows current BMI.
- **Daily log quality indicators** — Daily Log table now includes a "Status" column with text labels: Full (100%), Good (75–99%), Partial (50–74%), Low (<50%). Replaces the old "Daily Compliance" heading.
- **Target weight removed from report** — No longer included in exports, since the target may have been different during the selected date range.

---

## Version 2.7.0 — 2026-03-21

**Scope:** Minor (new feature — export report overhaul)
**Banner:** "Export overhaul — structured markdown reports with summary stats, styled preview, and downloadable HTML reports."

- **Structured markdown export** — `generateExport()` rewritten to output a full markdown document instead of flat text. Includes header with name/plan/period, summary statistics table (start/end weight, total change, avg rate, compliance %, fast day count), weight log table, daily compliance table, food log with per-day breakdowns and macro details, and dated notes with blockquotes.
- **Summary statistics** — New computed summary section calculates start weight, end weight, total change, average weekly rate, compliance percentage, and fast/light day counts from the selected date range. All computed on the fly from existing storage data.
- **Markdown preview** — New `renderMarkdownPreview()` function converts the generated markdown into styled HTML for the in-app preview. Minimal converter (~50 lines) handles only the patterns the export produces: headers, tables, bold, blockquotes, lists, horizontal rules. Dark-themed CSS added to `.export-text` for tables, headings, blockquotes.
- **Two export buttons** — Single "COPY TO CLIPBOARD" replaced with two-button row: "COPY MARKDOWN" (copies raw markdown for pasting into Notion/Obsidian/GitHub) and "DOWNLOAD REPORT" (downloads a styled HTML file).
- **HTML report download** — New `downloadReport()` function generates a self-contained HTML document with inline CSS (light theme, clean tables, print-ready styling) and downloads it as `protocol-health-report-YYYY-MM-DD.html`. Uses the same Blob + anchor download pattern as `backupData()`. No external dependencies. File opens in any browser and prints cleanly as a medical-style progress report.
- **Food log integration** — Export now includes food log data (per-day entries with item names, calories, and macro breakdown) from `SK.foodLog`. Previously food log data was not included in exports.

---

## Version 2.6.0 — 2026-03-21

**Scope:** Minor (7 fixes — dispatcher, storage keys, plan consistency, SW cache, documentation)
**Banner:** "Dispatcher fixes, storage key cleanup, plan consistency, SW cache improvements."

- **DISPATCH_MAP goalBar fix** — Added `goalBar` to `PLAN_CHANGED`, `SCHEDULE_SET`, and `SCHEDULE_ADJUSTED` dispatch targets. Previously the goal bar was not refreshed through the dispatcher on plan change or schedule events — direct `updateGoalBar()` calls were used as a workaround.
- **Redundant direct UI calls removed** — Removed 3 direct `updateGoalBar()` calls in `confirmPlan()`, `applySchedule()`, and `calcAdjust()` that are now handled by the dispatcher. Removed redundant `renderCalendar()` and `renderRadar()` calls in `restoreData()` (already covered by dispatched events).
- **SW_DISMISSED_KEY moved to SK object** — SW reload banner dismissal key (`ph_sw_banner_dismissed_ver` → `ph_sw_v1`) now lives in the `SK` object and uses `gs()`/`ss()` instead of raw `localStorage` calls. Key is now included in backup/restore.
- **Plan consistency fix** — Added explicit `lightDaysPerWeek: 0` and `lightDaysDow: []` to DEFAULT, AGRO, and CUT plans. BULK and MAINTENANCE already had these fields. Prevents future bugs if code assumes all plans define these properties.
- **SW pre-cache fix** — Added `index.html` to service worker critical cache list. Landing page now works offline after first load.
- **CLAUDE.md documentation sync** — Fixed icon filenames (`icon-192.png` → `PH_LOGO_192.png`, `icon-512.png` → `PH_LOGO_512.png`), updated `CACHE_NAME` reference (`v7` → `v11`), updated `APP_VERSION` reference (`2.0.0` → `2.6.0`), added `ph_sw_v1` to storage key quick reference, fixed `index.html` reference to `app.html` for APP_VERSION location.
- **ARCHITECTURE.md sync** — Added missing `ph_ld_v1` (light days) and `ph_sw_v1` (SW dismissed version) to storage diagram. Fixed icon filenames in PWA shell diagram.

---

## Version 2.5.0 — 2026-03-20

**Scope:** Minor (15 bug fixes + favicon)
**Banner:** "15 bug fixes: goal calculator math, bulk goal bar, projection accuracy, light day handling, midnight refresh."

- **Goal calculator target date fix** — Target date now calculates days from the start date (not today), so end date and schedule align correctly when start date ≠ today.
- **Surplus clamping fix (4 locations)** — `Math.max(0, tdee - cal)` silently ignored eating-day surplus when calories exceeded TDEE. Removed clamping in `calcDuration()`, `calcAdjust()`, `isWeightStalling()`, and `updateProjection()`. Deficit/surplus now calculated accurately for users eating above TDEE on eating days while fasting on others.
- **Goal bar bulk fix** — Progress bar and remaining weight now work correctly for bulk plans (gaining weight). Previously showed 0% and 0.0kg remaining because the math assumed weight loss direction.
- **Schedule ADJUST auto-sets fast/light days** — `confirmAdjust()` now calls `autoSetPlanFastDays()` and `autoSetPlanLightDays()` for newly added schedule days. Previously, adjusted schedules had unmarked future days.
- **Radar chart light day fix** — `computeRadarMetrics()` referenced undefined `tdee` variable when calculating light day calorie ceiling. Now uses `s.tdee || 2600`.
- **Calendar month stats today fix** — Today's fast/light day status now counted in month statistics. Previously only past days incremented the fast/light counters.
- **Restore dropdown sync fix** — `restoreData()` now sets native select element values before syncing custom dropdowns, so plan and risk selections display correctly after restore.
- **Midnight crossover fix** — Visibility change handler now refreshes TODAY tab checklist, fast UI, and duration bar when the app returns to foreground. Previously only refreshed calendar and day label.
- **Export checklistLight fix** — Text export now includes `checklistLight` items from all plans. Previously only searched `checklistNormal` and `checklistFast`.
- **getAvgActualCalories light day fix** — Average calorie calculation now skips both fast and light days (previously only skipped fast days), preventing light day intake from skewing eating-day averages.
- **computeMacros light day fix** — Macro calculations now use ~60% of TDEE as calorie ceiling on light eating days instead of the full eating-day ceiling. Adds 'light' signal label.
- **Duration bar overflow fix** — Day counter now capped at total days. Previously showed "DAY 31 / 30" the day after schedule ended.
- **Manage schedule null weight fix** — `openManageSchedule()` and `calcAdjust()` now handle null return from `getLatestWeight()` gracefully instead of producing NaN values.
- **Favicon added** — Browser tab now shows the arrows logo (`favicon.ico` + `favicon-32.png`) on both landing page and app. Previously showed default globe icon.

---

## Version 2.4.0 — 2026-03-20

**Scope:** Minor (workout balance audit + UX improvements)
**Banner:** "All plans now push:pull balanced. CARs explained. Core progression fixed (no equipment needed)."

- **DEFAULT plan push:pull fix** — Was 9:0 (zero pull exercises). Added
  Superman hold to Morning A, inverted row + Y-T-W raises + scapular push-up
  to Evening A, Superman hold to Evening C (replacing Sprawl + Push-up).
  Evening A renamed "UPPER PUSH/PULL". Now 1:1 balanced.
- **BULK plan push:pull fix** — Was ~2.5:1 (2 push days, 1 pull day). Friday
  "Push B" converted to "Push/Pull B" with inverted rows and Y-T-W raises
  added. Saturday full body reordered to pair push+pull. Rule 06 updated.
  Now ≤1:1 across the week.
- **AGRO Evening A minor rebalance** — Removed pseudo-planche lean (moved to
  skill-only work). Added Superman hold. Reordered scapular push-up before
  archer for better superset flow. Push:pull now balanced within the session.
  Rule 08 updated to say "pull-dominant across the week" instead of "5:7".
- **Core level 7 replaced** — "Hanging leg raises" (bar required) replaced
  with "Lying leg raises + hip lift" (floor only). Entire progression chain
  is now zero-equipment.
- **CARs explanations added** — All "Hip CARs" warm-up rows across all 5
  plans now include full descriptions: what CARs stands for (Controlled
  Articular Rotations), how to perform hip CARs, wrist CARs, and cat-cow.
  Checklist sub-text also updated. No more unexplained acronyms.

---

## Version 2.3.0 — 2026-03-20

**Scope:** Minor (AGRO plan content overhaul)
**Banner:** "AGRO plan rebalanced: pull-dominant workouts, full supplement protocol, updated nutrition."

- **Workout rebalance** — Push:pull ratio fixed from 5:2 to 5:7
  (pull-dominant). Every push session now includes antagonist pull
  pairing. Inverted rows, superman holds, prone Y-T-W, towel rows,
  and scapular push-ups integrated throughout the week. Tricep dips
  removed from Evening A (redundant with push-up ladder volume).
  Side plank added to Evening B and C (lateral core was 1x/week,
  now 3x).
- **Updated morningSub/eveningSub/stretchSub** — Day descriptions
  now reflect the rebalanced sessions with pull work noted.
- **Updated checklistNormal** — Supplement items rewritten with
  accurate dosing: Osteocare 2 tabs, D3+K2 1 tab, Zinc EOD,
  MCT 1 gel (eating) / 2 gels (fast), Omega-3 3 caps with meal,
  Magnesium 1 serving nightly.
- **Updated checklistFast** — Two separate electrolyte items
  (mid-morning + pre-training). Fast day intensity reminder added.
  MCT dosing clarified (2 gels). Magnesium 1 serving nightly.
- **Nutrition tab overhaul** — Full supplement protocol section with
  6 detailed cards (morning stack eating/fast, zinc EOD rule, omega-3,
  magnesium, electrolytes). High-protein food sources grid added with
  cal:protein ratios. All existing sections retained.
- **Rules updated** — 15 rules (was 13). New: "Push + Pull in every
  upper session" training rule. "Fast days = 51% of deficit" discipline
  rule. Rules renumbered.
- **CLAUDE.md** — Science reference directive appended with tier-1
  URLs, safety rules, hard-coded supplement limits, push:pull ratio
  rule, and prohibited sources list.
- **CACHE_NAME bumped** to `protocol-health-v10`.

---

## Version 2.2.3 — 2026-03-20

**Scope:** Patch (4 bug fixes)

- **Calendar missed-day fix** — Past days with no log are now only marked
  red (missed) if they were part of an active schedule. Days before any
  schedule was set up show no colour — no expectation, no failure.
- **Radar consistency anchor** — CONSISTENCY metric now anchors to the
  earliest tracked date (schedule start or first logged entry). Pre-setup
  days are excluded from the denominator. Fresh installs show '—' instead
  of 0%. Empty resets and unticked-then-reticked boxes no longer count as
  a logged day — at least one genuinely checked item (or weight/food log)
  is now required.
- **Realistic schedule fast-day fix** — 'ADD REALISTIC TO SCHEDULE' button
  now correctly sets fast and light days across the full realistic window.
  Previously, auto-set fast/light days only covered the shorter theoretical
  window, leaving gap days as unhighlighted plan-day cells.
- **CACHE_NAME bumped** to `protocol-health-v9`.

---

## Version 2.2.2 — 2026-03-20

**Scope:** Patch (bug fix)

- **Schedule start date always defaults to today** — When opening the settings panel, the start date field now always defaults to today's date instead of loading the previously saved start date from settings. This fixes the bug where adding a new schedule would start from a past date (e.g. the 19th instead of the 20th) because `s.startDate` was persisted from a prior schedule creation and reloaded on next settings open.

---

## Version 2.2.1 — 2026-03-20

**Scope:** Patch (bug fixes)

- **Start date off-by-one fix** — Target date field was parsed using `new Date(string)` which interprets `YYYY-MM-DD` as UTC midnight. In positive UTC offset timezones (e.g. India UTC+5:30), this shifted the date back by one day. Now uses `strToDate()` for correct local time parsing.
- **Start date saved on CONFIRM PLAN** — Previously `confirmPlan()` saved all settings except the start date, which was only saved when creating a schedule. Start date is now persisted on every CONFIRM PLAN click.
- **Start date input triggers recalculation** — Added `oninput="calcDuration()"` to the plan start date field so changing it updates the goal calculator in real time (previously required changing another field to trigger recalculation).
- **Settings persistence fix** — `getSettings()` now merges saved values with defaults using `Object.assign()`, so newly added settings keys get their defaults even if the saved object predates them. Removed hardcoded `currentKg:104` default — fields show empty until the user sets them.

---

## Version 2.2.0 — 2026-03-19

**Scope:** Minor (feature removal + new features)
**Banner:** "Removed exercise burn (covered by TDEE), dual schedule modes, enhanced ADJUST with observed/formula/blended rates."

- **Exercise burn field removed** — The exercise burn input and all related calculations have been removed from the goal calculator, manage schedule, weight stalling detection, and projection math. Activity level in the TDEE auto-calculation (Mifflin-St Jeor × multiplier) already accounts for training intensity, making the separate exercise burn field redundant and a source of double-counting.
- **Dual schedule buttons** — When the realistic timeline section is visible (standard/aggressive risk modes), the goal calculator now shows two schedule buttons: "ADD TO SCHEDULE" (uses exact/theoretical days) and "ADD REALISTIC TO SCHEDULE" (uses compliance-adjusted days). Schedule stores which mode was used.
- **Schedule mode tracking** — Schedules now store `scheduleMode` (exact/realistic), `complianceRate`, and `exactDays` in the schedule data object. Manage Schedule status text shows whether the active schedule is EXACT or REALISTIC with compliance percentage.
- **Enhanced Manage Schedule ADJUST** — Three projection modes available via toggle buttons: BLENDED (default — weighted mix of observed rate and formula rate), OBSERVED ONLY (uses pure actual weight loss rate from logged data), and FORMULA ONLY (uses pure deficit math). Shows observed vs formula rate comparison with blend percentages. Warns when observed data is limited (<7 days). Stores last adjust mode used.

---

## Version 2.1.0 — 2026-03-19

**Scope:** Minor (multiple features + bug fix)
**Banner:** "Realistic timelines, auto TDEE, supplement tracker, calendar fixes."

- **Goal calculator: realistic timeline** — Added compliance-adjusted realistic days/weeks/kg-per-week below theoretical output. Standard=0.70, Aggressive=0.82, Unrestricted=1.00 multiplier. Week-by-week collapsible projected weight breakdown added.
- **Exercise burn field note** — Clarified that exercise burn should be 7-day daily average across all days, not per-session burn.
- **Auto TDEE via Mifflin-St Jeor** — Added age, height, sex, and activity level inputs to settings. TDEE field auto-populates using Mifflin-St Jeor equation × activity multiplier. Plan change auto-selects sensible activity default. Manual override always possible.
- **AGRO supplement tracker** — Full supplement protocol (Osteocare, D3+K2, Zinc EOD, Magnesium, MCT, Electrolytes, Omega-3) added to AGRO checklist (eating + fast day versions) and NUTRITION tab. Includes zinc copper-depletion warning (EOD rule).
- **Calendar today-cell fix** — Replaced epoch millisecond equality check with `dateToStr()` string comparison for today detection. Fixes PWA bug where current day incorrectly showed as red (missed) before midnight. Added visibility-change listener to re-render calendar on app foreground.
- **Today-in-progress fix** — Today's cell is now exempted from missed/partial classification while the day is still ongoing. Today only turns green if ALL checklist items are checked; otherwise it shows no compliance color. Full retroactive judgment applies only once today becomes yesterday.
- **CACHE_NAME bumped** to `protocol-health-v8` for clean force-refresh on all devices.

---

## Version 2.0.1 — 2026-03-19

**Scope:** Patch (bug fixes + UX)

- **SET button for current weight** — goal calculator now has a SET button next to the current weight input. Saves the entered weight to settings and updates goal bar and projection without needing to log it as a weight entry.
- **+/- signs on kg/week rate** — cut plans show `-X.XXkg/wk`, bulk plans show `+X.XXkg/wk`, maintenance shows `0.00kg/wk`. Makes the direction of weight change immediately clear.
- **Exercise burn affects bulk calculations** — exercise burn was previously ignored in bulk mode. Now properly accounted for: in deadline mode, required calories increase to offset exercise burn; in calorie mode, net surplus is reduced by exercise burn, extending the timeline. Shows `-Xcal/day surplus` label for bulk plans.

---

## Version 2.0.0 — 2026-03-19

**Scope:** Major (version rollover from 1.10.0 — next minor bump after X.10.Z = X+1.0.0)
**Banner:** "Light eating days for bulk & maintenance. Future days viewable. Schedule deletion simplified."

- **Light eating day system** — new day type alongside water fast days. Stored in `SK.lightDays`. Plans can define `lightDaysPerWeek`, `lightDaysDow`, and `checklistLight` arrays. Mutually exclusive with fast days.
- **Bulk plan updated** — 2 light eating days per week (Sun/Wed) replacing the nonsensical fast days. Dedicated checklist: eat at/below TDEE, protein-focused, no snacking, gut recovery.
- **Maintenance plan updated** — 1 light eating day per week (Sunday). Checklist focuses on eating 300–500 cal below TDEE with simple meals.
- **Future days viewable** — tapping future days in MONTHS tab now opens the day modal showing schedule info and toggle buttons to pre-set fast/light day type.
- **Schedule deletion simplified** — removed the "also clear fast days?" checkbox. Future fast and light days are always cleared automatically when removing a schedule.
- **Calendar** — light days shown with amber/orange styling. Legend and month stats updated.
- **Projection** — light days factored in (~60% of TDEE). Radar chart label switches to "LIGHT DAYS" for bulk/maintenance.
- **Compliance** — light day calorie compliance excluded from normal ceiling penalty.
- **Text export** — includes light eating days section.
- **Goal calculator labels** — dynamically show "surplus/balance/deficit" based on plan mode (fix from earlier in session).
- **Backup/restore** — added `dispatch('FOOD_LOGGED')`, `dispatch('FAST_DAY_TOGGLED')`, `dispatch('EXERCISE_LEVEL_CHANGED')`, `renderCalendar()`, and `renderRadar()` to restore flow, ensuring full UI refresh on data restore.

---

## Version 1.10.0 — 2026-03-19

**Scope:** Minor (feature improvements)
**Banner:** "Goal calculator now supports bulk & maintenance. Radar chart improved. Weight log moved to morning."

- **Goal calculator** — now fully plan-aware. Bulk mode calculates surplus (calories above TDEE). Maintenance mode creates tracking-only schedules. Cut mode unchanged.
- **Radar chart** — visibility improvements. All 7 axes always shown (no-data axes render as 0 with dash).
- **Weight log** — moved to morning section of TODAY tab for easier daily logging.
- **Goal calculator labels** — "weekly deficit" label updates to "weekly surplus" or "weekly balance" based on plan mode.

---

## Version 1.9.0 — 2026-03-18

**Scope:** Major (new plans added)
**Banner:** "New plans: Default Cut, Default Bulk, Default Maintenance."

- **3 new training plans** — Default Cut, Default Bulk, Default Maintenance. Each with full workout content, nutrition rules, macro configurations, and custom checklists.
- **Dynamic TODAY checklist** — replaced hardcoded checklist HTML with `renderTodayChecklist()` that builds from the active plan's checklist arrays. This was required for multi-plan support.
- **Plan-aware macros** — `computeMacros()` now reads `macroSplit` and `proteinFloorMultiplier` from the active plan. Bulk uses 30/50/20 (P/C/F), maintenance uses 35/45/20.
- **CSS** — new badge and description classes for cut, bulk, maintenance plan colors.
- **Plan selector** — 5 plans now available in settings dropdown.
- **`descClass` property** — added to plan objects. Fixed hardcoded `agro-desc` assignment in `onPlanSelectChange()`.

---

## Version 1.8.0 — 2026-03-18

**Scope:** Minor (new feature)
**Banner:** "Smart macro targets + food macro tracking + nutrition shortcut."

- **Smart auto macro engine** — `computeMacros()` function with context-aware signals (base, rest, pre-fast, stall, satiety). Signal chips on NUTRITION tab.
- **Food macro tracking** — food log entries now support protein, carbs, fat fields alongside calories. Food modal updated with macro inputs.
- **Calculator integration** — goal calculator's "APPLY CALORIES" and "VIEW NUTRITION" buttons for seamless workflow.
- **Food library** — autocomplete suggestions from previously logged foods with macro memory.

---

## Version 1.7.2 — 2026-03-18

**Scope:** Patch (bug fix)

- **iOS PWA updates** — fixed app not receiving service worker updates on iOS when resuming from background. Added `visibilitychange` and `pageshow` event listeners.

---

## Version 1.7.1 — 2026-03-18

**Scope:** Patch (bug fix)

- **Radar chart axes** — all 7 axes now always visible. No-data metrics render as 0 with a dash label instead of being hidden.

---

## Version 1.7.0 — 2026-03-18

**Scope:** Minor (new feature)
**Banner:** "Performance radar chart on TRACK tab."

- **Performance radar chart** — 7-axis spider chart on TRACK tab. Axes: checklist completion, calorie adherence, fasting adherence, water intake, weight trend, goal progress, consistency.
- **7D / 30D toggle** — switch between weekly and monthly performance windows.
- **Pure SVG rendering** — no chart library dependency.
- **Landing page** — added product feature showcase page.

---

## Version 1.6.1 — 2026-03-17

**Scope:** Patch (styling)

- **Landing page animations** — staggered content animations inside phone mockups on the landing page.

---

## Version 1.6.0 — 2026-03-17

**Scope:** Minor (new feature)
**Banner:** "New branded splash screen with arrows logo on app launch."

- **Branded splash screen** — custom splash screen with Protocol Health logo on app launch (3 second duration).

---

## Version 1.5.1 — 2026-03-17

**Scope:** Patch (restructure)

- **App moved to `app.html`** — separated landing page (`index.html`) from the app file (`app.html`). PWA still launches `app.html`.

---

## Version 1.5.0 — 2026-03-17

**Scope:** Minor (tab restructure)
**Banner:** "Food logger moved to TODAY tab. Manage & delete day notes. Backup/export moved to Settings."

- **Tab restructure** — food logger modal accessible from TODAY tab. Notes manager for viewing/deleting day notes.
- **Backup/export** — moved to Settings panel (was previously on TRACK tab, keeping it cleaner).

---

## Version 1.4.4 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — fixed banner not fully hiding. Increased `translateY` for bottom-positioned element.

---

## Version 1.4.3 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — removed false-positive `CONTENT_UPDATED` trigger. Version-tied dismiss. Enlarged X touch target.

---

## Version 1.4.2 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — fixed persistence after tap. Added X dismiss button.

---

## Version 1.4.1 — 2026-03-17

**Scope:** Patch (bug fix)

- **Reload banner** — fixed banner not dismissing after tap.

---

## Version 1.4.0 — 2026-03-17

**Scope:** Minor (new feature)
**Banner:** "App now auto-updates without reinstalling. Your data stays safe."

- **Automatic update system** — service worker detects new versions, downloads in background, shows reload banner. No reinstall needed.

---

## Version 1.3.1 — 2026-03-17

**Scope:** Patch (styling)

- **Scrollbar hidden** — global scrollbar hide on all elements (html, body, children).

---

## Version 1.3.0 — 2026-03-17

**Scope:** Minor (UX improvement)
**Banner:** "Workouts tab now shows only today's sessions expanded. Track and Rules tabs swapped."

- **Workouts tab** — auto-expands only today's workout sessions. Other days collapsed by default.
- **Tab swap** — Track and Rules tabs swapped for better navigation flow.

---

## Version 1.2.0 — 2026-03-17

**Scope:** Minor (bug fixes)
**Banner:** "Bug fixes: exercise levels, calendar plan-day colors, reset confirmation, and data safety improvements."

- **7 bugs fixed** from code review: exercise level persistence, dispatcher gaps, XSS prevention in notes, calendar plan-day color priority, reset confirmation dialog, and data safety improvements.

---

## Version 1.1.0 — 2026-03-16

**Scope:** Minor (new features)
**Banner:** "Food & calorie logger, exercise level selector, and pull work added to AGRO plan."

- **Food & calorie logger** — log food items with calorie counts per day. Daily total tracked.
- **Exercise level selector** — progressive difficulty levels for exercises in AGRO plan. Levels stored per-day.
- **AGRO pull work** — added pull-focused exercises (inverted rows, towel rows) to AGRO plan.

---

## Version 1.0.1 — 2026-03-15

**Scope:** Patch (content fix)

- **AGRO workout schedule** — moved Evening C skill session from Wednesday to Thursday.

---

## Version 1.0.0 — 2026-03-15

**Scope:** Major (initial versioned release)
**Banner:** N/A (first version)

- **Initial versioned release** — APP_VERSION system introduced. Version checking, update banner, `SK.seenVer` storage.
- **Architectural cleanup** — fixed rule violations, removed dead code.
- **Foundation** — 2 plans (DEFAULT PROTOCOL, AGRO CUT CALISTHENICS), 6 tabs, full checklist system, weight tracking, goal calculator, schedule system, calendar, backup/restore.
