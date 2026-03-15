# CLAUDE.md
## Protocol Health — Project Brief for Claude Code

**Repository:** `github.com/HIRAKHANJI/protocol-health`
**Live URL:** `https://hirakhanji.github.io/protocol-health/`

---

## 1. What This App Is and Why It Exists

Protocol Health is a personal fitness tracking PWA built from scratch to match one specific protocol — not adapted from a template, not built for a general audience. Every existing fitness tracker was either too generic, required a subscription, demanded gym access, or could not be configured precisely enough. This app exists because none of them were good enough.

It is actively used daily. Every feature exists because it was needed, not because it was interesting to build.

**The Mission**
- Reach the current target weight while building functional strength and calisthenics capability.
- The target is variable — set in the app settings. The mission does not change, the numbers do.
- Establish a training and nutrition habit that works regardless of location or equipment access.
- Foundation protocol is bodyweight-first, zero equipment, zero location dependency.
- Long-term goal: combat sports capability (striking, conditioning, functional strength).

---

## 2. What the App Is

Protocol Health is a single-file Progressive Web App (PWA) — the entire application lives in one HTML file (`index.html`) with no backend, no server, no database, and no external dependencies beyond Google Fonts. All data is stored in the browser's localStorage on the user's device.

Installed on Android Chrome as a fullscreen PWA — behaves like a native app with its own icon, no browser chrome, and full offline capability after first load.

**Core purpose — the app does three things:**
1. Tracks daily compliance — a structured checklist the user ticks off each day, tailored to whichever training plan is active
2. Tracks weight over time — daily logging, goal bar progress, and a forward-looking projection to Sunday
3. Plans and calculates goals — a goal calculator that takes current weight, target weight, timeline, calories, TDEE, and exercise burn and outputs the required eating strategy with realistic/aggressive/unrealistic flags

**What it is not:**
- Not a generic fitness app — it has exactly the features needed, nothing more
- Not connected to any external service — no API calls, no accounts, no cloud sync
- Not designed for multiple users — built for one person's specific protocol
- Not a simple TDEE calculator — it models fasting days, eating windows, exercise burn, and compliance rate in its projections

---

## 3. The Two Training Plans

The app supports multiple "plans" — self-contained protocol objects that define workouts, nutrition rules, checklist items, and fast day schedules. Currently two plans exist:

**DEFAULT PROTOCOL**
A moderate, sustainable approach. 3 water fast days per week (Sun/Wed/Sat). 1500 cal ceiling on eating days. Bodyweight calisthenics, morning + evening sessions. Designed as the entry point and long-term maintenance protocol.

**AGRO CUT CALISTHENICS**
An aggressive cut protocol. Same 3 fast days per week. 1000 cal ceiling on eating days. Higher volume training, running sessions added (Wed and Sat), calisthenics skill work (crow stand, L-sit, handstand foundations), neck strengthening protocol. Designed for accelerated fat loss while building functional strength.

> **Plan Architecture Rule:** Each plan is a fully self-contained object in the `PLANS` constant in `index.html`. Adding a new plan = add one object to `PLANS` + two `<option>` elements (native select + custom dropdown). Nothing else in the codebase needs to change. `getActivePlan()` handles the rest.

---

## 4. How to Add a New Plan

Adding a plan requires exactly two changes:

### Step 1: Add the plan object to `PLANS` in `index.html`

Add a new key to the `PLANS` constant. The key becomes the plan's internal ID (e.g. `combat`, `maintenance`, `bulkcut`). Every field below is required.

```javascript
PLANS.myplan = {

  // ─── IDENTITY ──────────────────────────────────────────────
  name: 'MY PLAN NAME',            // Displayed in plan banner, settings, schedule
  badge: 'MY PLAN',                // Short label for badges/tags
  badgeClass: 'agro-badge',        // CSS class for badge styling ('' for default, 'agro-badge' for red)
  subtitle: 'Short tagline here.', // Shown under plan name in settings

  // ─── BANNER STYLING ────────────────────────────────────────
  bannerColor: 'var(--text)',       // Text color for TODAY tab banner
  bannerBg: 'var(--surface)',       // Background for TODAY tab banner
  bannerBorder: 'var(--border)',    // Border for TODAY tab banner

  // ─── CORE PROTOCOL NUMBERS ─────────────────────────────────
  tdee: 2600,                      // Total daily energy expenditure (cal)
  fastDaysPerWeek: 3,              // Integer — used in deficit math
  fastDaysDow: [0, 3, 6],          // Day-of-week indices (0=Sun, 6=Sat) for auto-set fast days

  // ─── WEEK ICONS (workout grid on WORKOUTS tab) ────────────
  weekIcons: {0:'🚶', 1:'💪', 2:'🦵', 3:'💪', 4:'🦵', 5:'💪', 6:'🦵'},

  // ─── DAY-SPECIFIC SUB-TEXT (shown under TODAY checklist items) ──
  // Keys are day-of-week (0=Sun, 6=Sat). Values are short strings.
  morningSub: {
    0:'SUNDAY — Rest day.',
    1:'MONDAY — Morning session details...',
    // ... all 7 days
  },
  eveningSub: { /* same structure — 0-6 */ },
  stretchSub: { /* same structure — 0-6 */ },

  // ─── CHECKLIST ITEMS ───────────────────────────────────────
  // checklistNormal: shown on eating days
  // checklistFast: shown on water fast days
  //
  // Each item: { id, group, label, sub }
  //   id    — unique string key (stored in localStorage checks object)
  //   group — category tag: 'MORNING', 'EATING', 'EVENING', 'NIGHT', 'FAST', or ANY custom string
  //   label — main text the user sees
  //   sub   — smaller detail text below the label
  //
  // You can add ANY number of items and ANY group names.
  // Groups are rendered as collapsible sections with color-coded tags.
  // Tag colors are assigned by group name:
  //   MORNING → tag-morning, EATING → tag-food, EVENING → tag-evening,
  //   FAST → tag-fast, everything else → tag-rules
  //
  // To add a custom group color, add a CSS class in the <style> section:
  //   .tag-mygroup { background: rgba(R,G,B,0.15); color: #hex; }
  // Then use group:'MYGROUP' in checklist items and add a case in the
  // tag color assignment in openDayModal().
  checklistNormal: [
    { id:'m1', group:'MORNING', label:'Wake & hydrate', sub:'500ml water immediately.' },
    { id:'f1', group:'EATING',  label:'Hit protein target', sub:'Protein first in every meal.' },
    { id:'e1', group:'EVENING', label:'Evening session', sub:'See WORKOUTS tab.' },
    // ... add as many as needed
  ],
  checklistFast: [
    { id:'wf1', group:'FAST', label:'Water + salt on waking', sub:'Prevents headaches.' },
    // ... add as many as needed
  ],

  // ─── EATING GROUP STYLING (TODAY tab) ──────────────────────
  foodGroupLabel: 'EATING',        // Label shown on the eating section header
  foodGroupBg: '',                 // Background override ('' = default)
  foodGroupColor: '',              // Text color override ('' = default)

  // ─── CONTENT FUNCTIONS (return HTML strings) ───────────────
  // These generate the tab content. They receive settings object where needed.

  workoutContent() {
    // Return full HTML for WORKOUTS tab.
    // Use workoutCard(title, subtitle, rows) and exRow(name, notes, reps) helpers.
    return `
      <div class="section-title">MY PLAN <span>WORKOUTS</span></div>
      ${workoutCard('SESSION A', 'UPPER BODY',
        exRow('Push-ups','Standard form','3 × 15') +
        exRow('Pike push-up','Shoulders','3 × 10')
      )}`;
  },

  nutritionContent(s) {
    // s = getSettings(). Use s.calories for dynamic calorie display.
    const cal = s.calories || 1500;
    const protein = Math.round(cal * 0.4 / 4);
    return `
      <div class="section-title">MY PLAN <span>NUTRITION</span></div>
      <div class="macro-grid">
        <div class="macro-box"><div class="macro-val">${cal}</div><div class="macro-lbl">Cal ceiling</div></div>
        <div class="macro-box"><div class="macro-val">${protein}g</div><div class="macro-lbl">Protein</div></div>
      </div>`;
  },

  rulesContent(s) {
    // s = getSettings(). Use s.calories if rules reference the calorie ceiling.
    const cal = s.calories || 1500;
    return `
      <div class="section-title">EATING <span>RULES</span></div>
      ${ruleCard('RULE 01', cal+' cal/day ceiling.', 'Details here.')}
      ${ruleCard('RULE 02', 'No liquid calories.', 'Water, coffee, tea only.')}`;
  }
};
```

### Step 2: Add the plan to the settings HTML (two places)

Find the plan selector in the settings panel HTML. Add both a native `<option>` (hidden, keeps JS `.value` working) and a custom dropdown `<div>`:

```html
<!-- Native select (hidden — class="plan-select") -->
<option value="myplan">MY PLAN NAME</option>

<!-- Custom dropdown (visible — inside .custom-select-dropdown) -->
<div class="custom-select-option" data-value="myplan"
     onclick="selectCustomOption('planSelectCustom','planSelect',this)">MY PLAN NAME</div>
```

### That's It

Nothing else changes. `getActivePlan()` reads `settings.plan`, looks up `PLANS[settings.plan]`, and returns the object. Every tab renderer calls the plan's content functions. The checklist system reads `checklistNormal` / `checklistFast`. The calendar, schedule, and goal calculator all use `fastDaysPerWeek` and `fastDaysDow`.

### What You CAN Customize Per Plan

| Area | How | Limits |
|------|-----|--------|
| **Checklist items** | Add/remove items in `checklistNormal` and `checklistFast` arrays | Unlimited items, any `id` string (must be unique within the plan) |
| **Checklist groups** | Set any `group` string on items — groups auto-render as sections | Built-in tag colors: MORNING, EATING, EVENING, FAST, NIGHT. Custom groups get `tag-rules` styling by default. Add CSS class for custom colors. |
| **Workout sections** | Return any HTML from `workoutContent()` | Use `workoutCard()` + `exRow()` helpers for consistency, or write raw HTML |
| **Nutrition content** | Return any HTML from `nutritionContent(s)` | Has access to settings for dynamic values (calories, macros) |
| **Rules content** | Return any HTML from `rulesContent(s)` | Has access to settings. Use `ruleCard()` helper for consistent styling |
| **Fast day schedule** | Set `fastDaysDow` array and `fastDaysPerWeek` | Any combination of weekdays. Must match (e.g. 3 days in array = `fastDaysPerWeek: 3`) |
| **Banner appearance** | Set `bannerColor`, `bannerBg`, `bannerBorder` | Any CSS color values |
| **Macro split** | Calculate in `nutritionContent(s)` from `s.calories` | Entirely custom math per plan |

### What You CANNOT Customize Per Plan (Without Code Changes)

- **Tab structure** — the 6 tabs (Today, Months, Workouts, Nutrition, Rules, Track) are fixed in HTML
- **Checklist behavior** — ticking items, saving to storage, calendar classification logic is shared code
- **Goal calculator** — uses `fastDaysPerWeek` and `tdee` from the plan but the calculation model is shared
- **Weight tracking** — independent of plans, shared across all
- **Schedule system** — uses plan's `fastDaysDow` for auto-set but otherwise shared

---

## 5. Technical Architecture

### File Structure

| File | Purpose |
|------|---------|
| `index.html` | The entire app — HTML, CSS, and all JavaScript in one file. ~3000 lines. No build process, no bundler, no framework. |
| `manifest.json` | PWA manifest. App name, icons, display mode (standalone = fullscreen), theme color. |
| `sw.js` | Service Worker. Caches all app files after first load for offline use. Cache-first strategy. Current cache name: `protocol-health-v6`. Bump version on major deploys. |
| `icon-192.png` | Home screen icon at 192×192px. |
| `icon-512.png` | Splash screen icon at 512×512px. |

### Data Storage

All data lives in localStorage. No server, no sync. Keys are defined in the `SK` object at the top of the script:

```
ph_wt_v1   — weight log: array of { date: "YYYY-MM-DD", weight: number, ts: timestamp }
ph_dl_v1   — day logs: { "YYYY-MM-DD": { checks, weight, water, energy, notes, ts } }
ph_fd_v1   — fast days: { "YYYY-MM-DD": true }
ph_st_v1   — settings: { plan, currentKg, targetKg, calories, tdee, risk, exerciseBurn, startDate }
ph_sc_v1   — schedule: { days[], startDate, totalDays, planName, startWeight }
```

> **Storage Key Rule:** All keys are defined in the `SK` object at the top of the script. NEVER hardcode storage key strings anywhere else in the code. Always use `SK.keyName`. If a schema changes, bump the version suffix (`v1` → `v2`). The backup system iterates `SK` to export/restore — new keys added to `SK` are automatically included.

### Central Dispatcher Pattern

The app uses a pub/sub-style dispatcher for all UI updates. **This is the most important architectural pattern to preserve.**

```javascript
// Every function that writes data ends with dispatch("EVENT_NAME")
// The DISPATCH_MAP defines which UI components each event refreshes
// dispatch() only re-renders tabs that are currently visible

const DISPATCH_MAP = {
  WEIGHT_LOGGED:    ["goalBar", "projection", "recentNotes", "durationBar"],
  DAY_SAVED:        ["calendarCell", "monthStats", "recentNotes", "projection"],
  FAST_DAY_TOGGLED: ["fastUI", "checklist", "calendarCell", "projection"],
  PLAN_CHANGED:     ["allTabs", "checklist", "durationBar", "projection", "calendar"],
  // ...
}
```

> **Dispatcher Rule:** Never call UI update functions directly from data-writing functions. Always end data writes with `dispatch("EVENT_NAME")`. To add a new event: add a key to `DISPATCH_MAP` + a case in the `dispatch()` switch. Nothing else changes.

### Other Architectural Rules

- **`getActivePlan()`** — single entry point for all plan-dependent rendering. No scattered `if(plan==='agro')` checks elsewhere.
- **`showConfirm()` / `showAlert()`** — custom modal dialogs. Native `confirm()`/`alert()` are blocked in GitHub Pages iframes. Always use these.
- **Custom dropdowns** — native `<select>` elements cannot be styled on Android Chrome. The app uses a custom dropdown system (`toggleCustomSelect`, `selectCustomOption`, `syncCustomSelect`) that keeps a hidden native select in sync.
- **`dateToStr()` / `strToDate()`** — all dates stored as `"YYYY-MM-DD"` strings in local time. Never use `toISOString()` for date keys — it returns UTC and causes off-by-one day bugs.
- **`getSettings()`** — always returns a full object with defaults. Never returns null. Add new settings fields here with a default value.

---

## 6. App Tab Structure

| Tab | Purpose |
|-----|---------|
| **TODAY** | Primary daily driver. Active plan banner, today's checklist (eating or fast day version), progress bar, fast day banner. All checklist ticks write to `SK.dayLogs[today].checks`. |
| **MONTHS** | Calendar view. Each cell color-coded: green = full compliance, purple = fast day, orange = partial, red = missed. Tap any cell to open day modal — log past weight, water, energy, notes, edit past checklists. Also shows schedule highlight overlay. |
| **WORKOUTS** | Collapsible workout cards generated from active plan's `workoutContent()` function. Shows 7-day week grid with today highlighted. |
| **NUTRITION** | Generated from active plan's `nutritionContent(s)`. Macro targets, meal timing rules, fast day protocol, snack list, allowed/banned drinks. |
| **RULES** | Generated from active plan's `rulesContent(s)`. Eating rules + training rules + discipline rules. Can reference settings (e.g. calorie ceiling). |
| **TRACK** | Weight logging input, weight history list, goal bar, weight projection, recent day logs, data backup/restore, and text export. |

---

## 7. Goal Calculator Logic

The settings panel contains a goal calculator that models the user's deficit protocol. It accounts for fasting days, exercise burn, and compliance rate — not just TDEE.

### Two Calculation Modes
- **MODE A — Deadline given:** user enters days (or target date). Calculator outputs required eating-day calorie ceiling.
- **MODE B — Calories given:** user enters calorie ceiling. Calculator outputs how many days it will take.

### Deficit Model

```
Total deficit needed = (currentKg - targetKg) × 7700 cal

Weekly deficit = eating days × (TDEE - calories)
               + fast days × TDEE
               + exercise burn × 7

If fast days + exercise already covers the required deficit:
  → calcCals = TDEE (eating days at maintenance, no restriction needed)
```

### Risk Tolerance Flags

| Mode | Unrealistic | Aggressive | Achievable |
|------|-------------|------------|------------|
| **Standard** | < 800 cal/day OR > 1.5 kg/week | 800–1200 cal/day OR 1.0–1.5 kg/week | > 1200 cal/day AND < 1.0 kg/week |
| **Aggressive** | Weekly avg intake < 300 cal/day | > 2.5 kg/week | Everything else incl. 2 kg/week |
| **Unrestricted** | calcCals went negative | > 3 kg/week | Everything else |

### Weight Projection
The TRACK tab projects weight at end of week using a blended rate model:
- **Observed rate** — actual kg/day from last 7 weight log entries
- **Formula rate** — theoretical kg/day from deficit math + fast days ahead
- **Blend weight** — shifts from formula-heavy (early, little data) to observed-heavy (more entries)
- **Compliance modifier** — adjusts projection if checklist completion rate has been low

---

## 8. Schedule System

A schedule is an optional overlay that highlights a block of days on the calendar and drives the duration progress bar. It does not replace the checklist — it is a planning layer on top.

- **Created via** the goal calculator's ADD TO SCHEDULE button
- **Stored as** `{ days[], startDate, totalDays, planName, startWeight }` in `SK.schedule`
- **Visualised as** white-border highlighted cells on MONTHS calendar + DAY X / TOTAL DAYS strip on TODAY
- **ADJUST** — recalculates remaining days using a blend of actual achieved rate + new calorie target
- **END TODAY** — trims `days[]` to today, keeps all past data intact
- **REMOVE** — wipes schedule structure, optionally clears future auto-set fast days

> **Fast Day Auto-Set:** When a schedule is created, the app automatically marks fast days in `SK.fastDays` based on the active plan's `fastDaysDow` array (e.g. `[0, 3, 6]` = Sun/Wed/Sat). Users can manually override any individual day via the day modal on the calendar.

---

## 9. Backup System

localStorage is wiped when the user clears Chrome browsing data. The backup system is the only recovery mechanism.

- **Backup** — exports all `SK.*` keys as a JSON file named `protocol-health-backup-YYYY-MM-DD.json`
- **Restore** — reads a backup JSON, validates version prefix (`ph_`), confirms with user, writes all keys back, runs full UI refresh
- **Backup version** — tagged as `ph_v1` in the JSON. Future schema migrations should handle version detection here.
- **Export (separate)** — generates a human-readable plain text log for a selected date range — not a backup, not restorable

> **Critical:** No server, no cloud sync, no account. If localStorage is wiped without a backup, all data is gone. Recommend backing up to Google Drive after first setup and weekly thereafter.

---

## 10. The Improvement Project

This app is in active development. Updates are made through Claude Code connected directly to the GitHub repository. The single-file architecture makes this straightforward — there is no build system, no compiled output, no package manager for the app itself.

### Known Improvement Areas
- **Streak tracking** — visible consecutive day compliance counter with streak protection mechanics
- **Bodyweight progression system** — the app shows static workout plans but does not track reps/sets over time or suggest when to progress to harder variations
- **Location transition support** — workouts and nutrition should adapt to available equipment and food access
- **Habit analytics** — which checklist items are most commonly missed, what days show lowest compliance
- **Combat training integration** — as the user progresses toward combat sports, the app will need a striking and conditioning plan layer
- **Water fast day flexibility** — currently fast days are set by day-of-week; a more flexible system would allow ad-hoc fast day designation without breaking the schedule

### Non-Negotiable Architectural Rules

> ⚠️ Do not break these. They exist for specific reasons documented in the codebase comments.

1. All storage keys live in `SK` object — never hardcode storage key strings
2. All data writes end with `dispatch("EVENT_NAME")` — never call UI functions directly
3. All plan content lives in the `PLANS` object — never scatter plan-specific logic through the codebase
4. `showConfirm()` / `showAlert()` replace native dialogs — never use `confirm()` or `alert()`
5. `dateToStr()` for all date keys — never `toISOString()` (UTC off-by-one bug)
6. `getActivePlan()` is the only plan entry point
7. `getSettings()` always returns full object with defaults — add new fields here with a default value
8. Custom dropdown system for any new select elements — not native `<select>`
9. Single file — no separate CSS or JS files, everything stays in `index.html`
10. No external API calls, no CDN dependencies beyond Google Fonts

### Design Principles

- **Mobile-first.** The app is used on a phone. Every UI change must work on a 375px screen.
- **Dark theme only.** Colors: bg `#0a0a0a`, surface `#111111`, accent `#c8f542` (green), accent2 `#f5a623` (orange).
- **Fonts:** Bebas Neue (headers), DM Mono (data/labels), DM Sans (body). Do not introduce new fonts.
- **No over-engineering.** The single-file architecture is a feature, not a limitation.
- **Bodyweight first.** Any new workout content must default to zero-equipment exercises.

---

## 11. Deployment & Update Rules

Protocol Health is hosted on GitHub Pages. Updates are deployed by pushing changed files to the `main` branch. There is no build step, no CI/CD pipeline — push the file, it is live within ~60 seconds.

### How Updates Reach the Phone

```
Push to GitHub → GitHub Pages serves new files (~60s)
→ User opens app → SW detects change → downloads in background
→ User closes app fully (swipe away) → reopens → update applied
```

### Cache Version — Most Important Rule

The service worker caches files under `CACHE_NAME` in `sw.js`. If this name does not change, the SW may keep serving the old cached version even after new files are pushed.

**Current version:** `protocol-health-v6`

> **Rule: Bump `CACHE_NAME` on every significant update.**
> - On any JS logic change, new feature, or bug fix → increment: `v6` → `v7` → `v8`
> - On pure content changes (text, nutrition rules, workout descriptions) → optional but safe to bump
> - **Always bump when:** changing storage key schemas, adding new dispatch events, restructuring plans
> - Never skip the bump when unsure — a stale cache is harder to debug than an unnecessary version increment

```javascript
// sw.js — line 22
const CACHE_NAME = 'protocol-health-v6'; // ← increment this on every significant push
```

### Files That Must Be Pushed Together

| Files | Rule |
|-------|------|
| `index.html` + `sw.js` | Always push together if CACHE_NAME needs bumping. Pushing `index.html` alone without bumping risks the old SW serving the old index. |
| `index.html` + `manifest.json` | If app name, theme color, or icon paths change, `manifest.json` must match. |
| `sw.js` + icons | `sw.js` caches icon files by name. If icons are renamed or replaced, update the cache files list in `sw.js`. |

### What NOT to Push to the Repo
- `CLAUDE.md` — keep locally or in a separate docs branch, does not affect the app
- Any `.docx` setup/reference files — local only
- Backup JSON files — these are user data exports, not source files
- `.DS_Store`, `node_modules`, or temp files

### After Pushing — Verification Checklist
1. Wait 60 seconds, open the live URL in desktop Chrome
2. Hard refresh (`Ctrl+Shift+R`) to bypass browser cache and confirm new version is live
3. On phone: close app fully, reopen, check that the change is visible
4. If update is not appearing: Chrome DevTools → Application → Service Workers → click "Update" or "Unregister" then reload
5. If still stuck: bump `CACHE_NAME` in `sw.js`, push again — guaranteed fresh load

### Safe Commit Pattern for Claude Code

1. Make changes to `index.html`
2. Increment `CACHE_NAME` in `sw.js` (`v6` → `v7`)
3. Commit both files together with a clear message describing the change
4. Do not split `index.html` and `sw.js` into separate commits — always push together
5. Never force-push to `main` — GitHub Pages may serve an inconsistent state during a force push

---

## 12. Quick Reference

```
Repository:   github.com/HIRAKHANJI/protocol-health
Live URL:     https://hirakhanji.github.io/protocol-health/
App file:     index.html (single file, ~3000 lines)
PWA files:    manifest.json, sw.js, icon-192.png, icon-512.png

Storage keys (all in SK object at top of script):
  ph_wt_v1  — weight log
  ph_dl_v1  — day logs (checks, weight, water, energy, notes)
  ph_fd_v1  — fast days
  ph_st_v1  — settings
  ph_sc_v1  — schedule

Plans:        PLANS.default, PLANS.agro (add more as needed)
Active plan:  getActivePlan() — never reference PLANS[x] directly elsewhere
Data writes:  always end with dispatch("EVENT_NAME")
Dialogs:      showConfirm(), showAlert() — never native confirm/alert
Dates:        dateToStr(d), strToDate(s), todayStr() — never toISOString()
Cache:        sw.js CACHE_NAME = "protocol-health-v6" — bump on every significant push
```
