# Implementation Plan: Default Cut / Default Bulk / Default Maintenance

## Overview

Add 3 new plans to Protocol Health. Each plan is a self-contained object in the `PLANS` constant, following the existing architecture. The research document provides all content — this plan covers the exact code changes.

---

## Critical Discovery: TODAY Tab Checklist is Hardcoded

The TODAY tab's checklist items are **hardcoded HTML** (lines 588–630). Only the sub-text is updated dynamically from the plan object. The day modal (MONTHS tab) correctly generates its checklist from `plan.checklistNormal` / `plan.checklistFast`.

This means: if the new plans have different checklist items (different IDs, different counts, different labels), the TODAY tab will show the wrong items.

**The research doc specifies different checklists per plan** (Section 5.3), so the TODAY tab checklist **must be made dynamic**.

---

## Change List (in order)

### 1. Make TODAY Tab Checklist Dynamic

**What:** Replace the hardcoded checklist HTML (lines ~588–630) with a single container div. Add a `renderTodayChecklist()` function that builds checklist HTML from `getActivePlan().checklistNormal` and `getActivePlan().checklistFast`.

**Why:** New plans have different items. This also makes future plan additions zero-effort for the checklist.

**HTML change:**
- Replace the MORNING, EATING, FAST, EVENING, NIGHT groups with:
  ```html
  <div id="todayChecklistContainer"></div>
  <button class="reset-btn" onclick="resetToday()">↺ RESET TODAY'S CHECKLIST</button>
  ```

**JS change — new function `renderTodayChecklist()`:**
- Reads `getActivePlan()` to get `checklistNormal` and `checklistFast`
- Reads `isFastDay(todayStr())` to pick which list
- Groups items by `group` field
- For each group: renders a `group-header` with the correct tag class + group items
- Uses the same tag color mapping as `openDayModal()`: MORNING→tag-morning, EATING→tag-food, EVENING→tag-evening, FAST→tag-fast, NIGHT→tag-rules, else→tag-rules
- Preserves existing `data-id` + `onclick="toggle(this)"` pattern
- Updates `#todayChecklistContainer` innerHTML
- Then calls `loadChecklist()` to restore check states
- Preserves the `todayMorningSub`, `todayEveningSub`, `todayStretchSub` dynamic sub-text by finding items with IDs matching `m3`/`e2`/`e3` and injecting the plan's day-specific sub-text

**Integration:**
- Called from `updateTodayTab()` (replaces the mSub/eSub/stSub assignments)
- Called from `updateFastUI()` (when fast day toggles, re-render the checklist)
- Called on `PLAN_CHANGED` dispatch

**`updateFastUI()` change:**
- Instead of toggling `foodGroup`/`fastGroup` display, it calls `renderTodayChecklist()` which handles the fast/normal switch internally

### 2. Add 3 Plan Objects to `PLANS`

Add `PLANS.cut`, `PLANS.bulk`, `PLANS.maintenance` after `PLANS.agro` (around line 2340).

Each plan object follows the exact structure documented in CLAUDE.md Section 4. Content comes from the research document.

#### PLANS.cut (Default Cut)
```
name: 'DEFAULT CUT'
badge: 'DEFAULT CUT'
badgeClass: 'cut'
subtitle: 'Fat loss · Muscle preservation · Flexible deficit'
bannerColor: '#4ecdc4'  (teal)
bannerBg: 'rgba(78,205,196,0.07)'
bannerBorder: 'rgba(78,205,196,0.35)'
tdee: 2400
fastDaysPerWeek: 0
fastDaysDow: []
weekIcons: {0:'🚶',1:'💪',2:'🦵',3:'🚶',4:'💪',5:'🦵',6:'💪'}
checklistNormal: [items from research doc Section 5.3 — Cut column]
checklistFast: [same generic fast checklist as default/agro]
workoutContent(): 6 workout cards from research doc Section 1.4
nutritionContent(s): macro grid + 80/20 principle + food guidelines from Section 1.3
rulesContent(s): eating rules + training rules from research doc
```

#### PLANS.bulk (Default Bulk)
```
name: 'DEFAULT BULK'
badge: 'DEFAULT BULK'
badgeClass: 'bulk'
subtitle: 'Muscle growth · Controlled surplus · Clean bulk'
bannerColor: '#f7dc6f'  (gold)
bannerBg: 'rgba(247,220,111,0.07)'
bannerBorder: 'rgba(247,220,111,0.35)'
tdee: 2400
fastDaysPerWeek: 0
fastDaysDow: []
weekIcons: {0:'🚶',1:'💪',2:'💪',3:'🚶',4:'🦵',5:'💪',6:'🤸'}
checklistNormal: [items from research doc Section 5.3 — Bulk column]
checklistFast: [same generic fast checklist]
workoutContent(): 6 workout cards from research doc Section 2.4
nutritionContent(s): macro grid + surplus strategy + meal examples from Section 2.3
rulesContent(s): bulking rules from research doc
```

#### PLANS.maintenance (Default Maintenance)
```
name: 'DEFAULT MAINTENANCE'
badge: 'DEFAULT MAINTENANCE'
badgeClass: 'maint'
subtitle: 'Sustain composition · Build habits · Flexible for life'
bannerColor: '#82e0aa'  (soft green)
bannerBg: 'rgba(130,224,170,0.07)'
bannerBorder: 'rgba(130,224,170,0.35)'
tdee: 2400
fastDaysPerWeek: 0
fastDaysDow: []
weekIcons: {0:'🚶',1:'💪',2:'🚶',3:'💪',4:'🚶',5:'💪',6:'🤸'}
checklistNormal: [items from research doc Section 5.3 — Maintenance column]
checklistFast: [same generic fast checklist]
workoutContent(): 4 workout cards from research doc Section 3.4
nutritionContent(s): macro grid + equilibrium approach from Section 3.3
rulesContent(s): maintenance rules from research doc
```

### 3. Add Badge CSS Classes

Add after the existing `.plan-badge.agro` rule (line 53):

```css
.plan-badge.cut { border-color:#4ecdc4; color:#4ecdc4; background:rgba(78,205,196,0.08); }
.plan-badge.bulk { border-color:#f7dc6f; color:#f7dc6f; background:rgba(247,220,111,0.08); }
.plan-badge.maint { border-color:#82e0aa; color:#82e0aa; background:rgba(130,224,170,0.08); }
```

Add plan description CSS variants (after `.plan-description.agro-desc` on line 299):

```css
.plan-description.cut-desc { border-color:rgba(78,205,196,0.3); background:rgba(78,205,196,0.05); color:#4ecdc4; }
.plan-description.bulk-desc { border-color:rgba(247,220,111,0.3); background:rgba(247,220,111,0.05); color:#f7dc6f; }
.plan-description.maint-desc { border-color:rgba(130,224,170,0.3); background:rgba(130,224,170,0.05); color:#82e0aa; }
```

### 4. Fix `onPlanSelectChange()` Description Styling

Currently line 3610 hardcodes `agro-desc` for any plan with a `badgeClass`:
```javascript
desc.className = 'plan-description' + (plan.badgeClass ? ' agro-desc' : '');
```

Change to use a `descClass` property from the plan object:
```javascript
desc.className = 'plan-description' + (plan.descClass ? ' ' + plan.descClass : '');
```

Add `descClass` property to each plan:
- `default`: `descClass: ''`
- `agro`: `descClass: 'agro-desc'`
- `cut`: `descClass: 'cut-desc'`
- `bulk`: `descClass: 'bulk-desc'`
- `maintenance`: `descClass: 'maint-desc'`

### 5. Update `computeMacros()` for Plan-Specific Splits

Currently `computeMacros()` uses hardcoded splits (50/30/20 base). The research doc specifies different base splits per plan:

- Default / AGRO: 50% protein, 30% carbs, 20% fat (unchanged)
- Cut: 50% protein, 30% carbs, 20% fat (same as default)
- Bulk: 30% protein, 50% carbs, 20% fat
- Maintenance: 35% protein, 45% carbs, 20% fat

**Change:** Add a `macroSplit` property to each plan object:
```javascript
macroSplit: { base: [50,30,20], rest: [58,22,20], preFast: [46,34,20], stall: [56,24,20], satiety: [58,22,20] }
```

Modify `computeMacros()` to read splits from `plan.macroSplit` instead of hardcoded values. Fall back to current hardcoded splits if the property doesn't exist (backward compat for default/agro).

Also add plan-specific protein floors:
- Add `proteinFloorMultiplier` to plan: Cut = 1.6, Bulk = 1.4, Maintenance = 1.2, Default/AGRO = 1.3

### 6. Add Plan Selector Options (Settings HTML)

Add 3 new options to both the native select and custom dropdown (around lines 762-777):

**Native select:**
```html
<option value="cut">DEFAULT CUT</option>
<option value="bulk">DEFAULT BULK</option>
<option value="maintenance">DEFAULT MAINTENANCE</option>
```

**Custom dropdown:**
```html
<div class="custom-select-option" data-value="cut" onclick="selectCustomOption('planSelectCustom','planSelect',this)">DEFAULT CUT</div>
<div class="custom-select-option" data-value="bulk" onclick="selectCustomOption('planSelectCustom','planSelect',this)">DEFAULT BULK</div>
<div class="custom-select-option" data-value="maintenance" onclick="selectCustomOption('planSelectCustom','planSelect',this)">DEFAULT MAINTENANCE</div>
```

Order: DEFAULT PROTOCOL → DEFAULT CUT → DEFAULT BULK → DEFAULT MAINTENANCE → AGRO CUT CALISTHENICS

### 7. Bump APP_VERSION

```javascript
const APP_VERSION = '1.9.0';
const APP_VERSION_MSG = 'New plans: Default Cut, Default Bulk, Default Maintenance.';
```

Minor version bump — 3 new features (plans) + dynamic checklist system.

---

## What Does NOT Change

- **Tab structure** — same 6 tabs
- **Storage keys** — no new SK keys needed
- **Weight tracking** — completely independent of plans
- **Calendar logic** — reads checklist items from plan object (already dynamic in day modal)
- **Schedule system** — reads `fastDaysPerWeek` / `fastDaysDow` from plan (already dynamic)
- **Goal calculator** — reads `tdee` / `fastDaysPerWeek` from plan (already dynamic)
- **Backup/restore** — no schema changes
- **Service worker** — no CACHE_NAME bump (feature branch, not merging to main)
- **EXERCISE_PROGRESSIONS** — same progression ladders shared across all plans
- **Existing plans** — DEFAULT PROTOCOL and AGRO CUT unchanged in behavior

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Dynamic checklist breaks TODAY tab toggle/save | Preserve exact same `data-id` + `onclick="toggle(this)"` pattern. `loadChecklist()` operates on `.check-item` class, not specific IDs. |
| Calendar day modal breaks | Already dynamic — reads from plan object. No change needed. |
| Check state lost on plan switch | Checks are stored by item ID in dayLogs. Different plans have different IDs. Old IDs remain in storage but are ignored by the new plan's checklist — no data loss. |
| computeMacros signal logic breaks | Fall back to current hardcoded splits if plan has no `macroSplit` property. Existing plans unaffected. |
| Progress bar breaks | `updateProgress()` counts `.check-item` elements — works regardless of how many items exist. |

---

## File Changes Summary

| File | Changes |
|------|---------|
| `app.html` | CSS: 6 new rules (badges + desc). HTML: replace hardcoded checklist with container + add 6 dropdown options. JS: new `renderTodayChecklist()`, modify `updateTodayTab()`, modify `updateFastUI()`, modify `computeMacros()`, fix `onPlanSelectChange()`, add 3 plan objects, bump APP_VERSION. |

Single file. No new files created.

---

## Estimated Scope

- ~50 lines CSS
- ~40 lines HTML changes (remove hardcoded checklist, add dropdown options)
- ~600-800 lines JS (3 plan objects with workout/nutrition/rules content + renderTodayChecklist + computeMacros changes)
- Total net: ~700-900 lines added to the file
