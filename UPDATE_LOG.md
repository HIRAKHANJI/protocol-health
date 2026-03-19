# Protocol Health — Update Log

All version history for the app. Each entry records version number, date, scope, and what changed.

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
