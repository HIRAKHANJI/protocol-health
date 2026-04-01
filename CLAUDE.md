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

## 3. The Five Training Plans

The app supports 5 plans — self-contained protocol objects that define workouts, nutrition rules, checklist items, fast/light day schedules, and macro configurations.

**DEFAULT PROTOCOL** — Sustainable cut. 3 water fast days/week (Sun/Wed/Sat). 1500 cal ceiling. Bodyweight calisthenics, morning + evening sessions.

**AGRO CUT CALISTHENICS** — Aggressive cut. 3 fast days/week. 1000 cal ceiling. Higher volume, running, calisthenics skill work, neck protocol.

**DEFAULT CUT** — Flexible deficit. 0 fast days. Macro-aware calorie management. Moderate training volume.

**DEFAULT BULK** — Clean surplus. 0 fast days, 2 light eating days/week (Sun/Wed). Eat above TDEE on training days. Light days for gut recovery.

**DEFAULT MAINTENANCE** — Sustain weight. 0 fast days, 1 light eating day/week (Sunday). Eat at TDEE ±200 cal. Minimal restriction, habit building.

> **Plan Architecture Rule:** Each plan is a fully self-contained object in the `PLANS` constant in `app.html`. Adding a new plan = add one object to `PLANS` + two `<option>` elements (native select + custom dropdown). Nothing else in the codebase needs to change. `getActivePlan()` handles the rest.

### Day Types

Plans support three types of special days:
- **Water fast days** — zero food. Stored in `SK.fastDays`. Used by cut plans.
- **Light eating days** — reduced calories, gut rest. Stored in `SK.lightDays`. Used by bulk/maintenance plans.
- **Normal eating days** — follow plan's calorie ceiling.

Fast and light days are mutually exclusive per date. Both can be toggled manually via the day modal on any date (past, present, or future).

---

## 4. How to Add a New Plan

Adding a plan requires exactly two changes:

### Step 1: Add the plan object to `PLANS` in `app.html`

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
  fastDaysPerWeek: 3,              // Integer — used in deficit math (0 for bulk/maintenance)
  fastDaysDow: [0, 3, 6],          // Day-of-week indices (0=Sun, 6=Sat) for auto-set fast days
  lightDaysPerWeek: 0,             // Integer — light eating days per week (for bulk/maintenance)
  lightDaysDow: [],                // Day-of-week indices for auto-set light eating days

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
  checklistLight: [
    { id:'l1', group:'LIGHT', label:'Light meals only', sub:'Eat at or below TDEE.' },
    // ... optional — for bulk/maintenance plans. Uses LIGHT group tag.
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

Nothing else changes. `getActivePlan()` reads `settings.plan`, looks up `PLANS[settings.plan]`, and returns the object. Every tab renderer calls the plan's content functions. The checklist system reads `checklistNormal` / `checklistFast` / `checklistLight` (via `getDayType()`). The calendar, schedule, and goal calculator use `fastDaysPerWeek`, `fastDaysDow`, `lightDaysPerWeek`, and `lightDaysDow`.

### What You CAN Customize Per Plan

| Area | How | Limits |
|------|-----|--------|
| **Checklist items** | Add/remove items in `checklistNormal`, `checklistFast`, and `checklistLight` (if plan uses light days) arrays | Unlimited items, any `id` string (must be unique within the plan) |
| **Checklist groups** | Set any `group` string on items — groups auto-render as sections | Built-in tag colors: MORNING, EATING, EVENING, FAST, LIGHT, NIGHT. Custom groups get `tag-rules` styling by default. Add CSS class for custom colors. |
| **Light eating days** | Set `lightDaysDow` array and `lightDaysPerWeek` + provide `checklistLight` | For bulk/maintenance plans. `checklistLight` is optional — if omitted, code falls back to `checklistNormal`. Light days are mutually exclusive with fast days. |
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
| `app.html` | The entire app — HTML, CSS, and all JavaScript in one file. ~5000+ lines. No build process, no bundler, no framework. |
| `index.html` | Landing/product page. Links to `app.html`. |
| `manifest.json` | PWA manifest. App name, icons, display mode (standalone = fullscreen), theme color. |
| `sw.js` | Service Worker. Caches all app files after first load for offline use. Cache-first strategy. Current cache name: `protocol-health-v11`. Bump version on major deploys. |
| `PH_LOGO_192.png` | Home screen icon at 192×192px. |
| `PH_LOGO_512.png` | Splash screen icon at 512×512px. |

### Data Storage

All data lives in localStorage. No server, no sync. Keys are defined in the `SK` object at the top of the script:

```
ph_wt_v1   — weight log: array of { date, weight, ts }
ph_dl_v1   — day logs: { "YYYY-MM-DD": { checks, weight, water, energy, notes, ts } }
ph_fd_v1   — fast days: { "YYYY-MM-DD": true }
ph_ld_v1   — light eating days: { "YYYY-MM-DD": true }
ph_st_v1   — settings: { plan, currentKg, targetKg, calories, tdee, risk, startDate, age, height, sex, activityLevel, name }
ph_sc_v1   — schedule: { days[], startDate, totalDays, planName, startWeight }
ph_sv_v1   — last seen app version (for update banner)
ph_fl_v1   — food log: { "YYYY-MM-DD": [{ id, name, calories, protein, carbs, fat, notes, ts }] }
ph_fb_v1   — food library: [{ name, lastCalories, useCount }]
ph_ex_v1   — exercise levels: { "YYYY-MM-DD": { groupId: levelIndex } }
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
- **REMOVE** — wipes schedule structure and always clears future auto-set fast/light days

> **Auto-Set Days:** When a schedule is created, the app automatically marks fast days (`SK.fastDays`) and/or light eating days (`SK.lightDays`) based on the active plan's `fastDaysDow` and `lightDaysDow` arrays. Users can manually override any individual day via the day modal on the calendar (including future days).

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
- **Location transition support** — workouts and nutrition should adapt to available equipment and food access
- **Habit analytics** — which checklist items are most commonly missed, what days show lowest compliance
- **Combat training integration** — as the user progresses toward combat sports, the app will need a striking and conditioning plan layer

### Completed Improvement Areas (for reference)
- ~~Bodyweight progression system~~ — implemented via EXERCISE_PROGRESSIONS with per-exercise level tracking (v1.1.0)
- ~~Water fast day flexibility~~ — fast/light days can be toggled on any date including future days (v2.0.0)
- ~~Multi-plan support~~ — 5 plans: default, agro, cut, bulk, maintenance (v1.9.0)
- ~~Performance analytics~~ — 7-axis radar chart on TRACK tab (v1.7.0)
- ~~Food/calorie tracking~~ — food logger with macro tracking and library (v1.1.0, v1.8.0)

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
9. Single file — no separate CSS or JS files, everything stays in `app.html`
10. No external API calls, no CDN dependencies beyond Google Fonts
11. Every version bump must be documented in `UPDATE_LOG.md` — never skip this
12. After `X.10.Z`, the next minor bump rolls over to `X+1.0.0` (version rollover rule)

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

**Current version:** `protocol-health-v11`

> **Rule: Bump `CACHE_NAME` on every significant update to `main`.**
> - Only bump when merging or pushing to `main` — feature branches do not need cache version increments
> - On any JS logic change, new feature, or bug fix → increment: `v10` → `v11` → `v12`
> - On pure content changes (text, nutrition rules, workout descriptions) → optional but safe to bump
> - **Always bump when:** changing storage key schemas, adding new dispatch events, restructuring plans
> - Never skip the bump when unsure — a stale cache is harder to debug than an unnecessary version increment

```javascript
// sw.js — line 22
const CACHE_NAME = 'protocol-health-v11'; // ← increment this on every significant push
```

### Files That Must Be Pushed Together

| Files | Rule |
|-------|------|
| `app.html` + `sw.js` | Always push together if CACHE_NAME needs bumping. Pushing `app.html` alone without bumping risks the old SW serving the old version. |
| `app.html` + `manifest.json` | If app name, theme color, or icon paths change, `manifest.json` must match. |
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

### Safe Commit Pattern for Claude Code (merging to `main`)

1. Make changes to `app.html`
2. Bump `APP_VERSION` in `app.html` according to versioning rules
3. Update `UPDATE_LOG.md` with the new version entry
4. Increment `CACHE_NAME` in `sw.js` (`v7` → `v8`) — only needed when pushing/merging to `main`
5. Commit all files together with a clear message describing the change
6. Do not split `app.html` and `sw.js` into separate commits — always push together
7. Never force-push to `main` — GitHub Pages may serve an inconsistent state during a force push

> **On feature branches:** commit `app.html` freely without touching `sw.js`. Bump `CACHE_NAME` once as part of the merge to `main`.

---

## 12. App Versioning (`APP_VERSION`)

The app has two independent version numbers that serve different purposes:

| Version | Location | Purpose | Bumps when |
|---------|----------|---------|-----------|
| `CACHE_NAME` (`protocol-health-vN`) | `sw.js` | Cache busting — forces fresh file download | Every deploy. Silent, invisible to user. |
| `APP_VERSION` (`X.Y.Z`) | `index.html` | User-facing version — triggers update banner | Only on notable updates. User sees it. |

### Version Format: `X.Y.Z` (Semantic)

| Bump | Threshold | Shows banner? | Examples |
|------|-----------|---------------|----------|
| **+0.0.1** (patch) | 1–3 small bug fixes, text corrections, styling tweaks | No | Fixed calendar color, typo in rule text, padding fix |
| **+0.1.0** (minor) | A new feature, a meaningful UI change, or 4+ bug fixes bundled together | Yes | Added streak counter, redesigned settings panel, new checklist group |
| **+1.0.0** (major) | New plan added, major rework of a core system, or something that changes how you use the app | Yes | New combat training plan, schedule system rewrite, new tab added |

**Current version:** `4.5.2`

> **Self-Update Rule:** Whenever `APP_VERSION` is bumped in `app.html`, also update ALL version references in this file (`CLAUDE.md`) to match — including this line and the Quick Reference section below. Never leave stale version numbers in project documentation.

### How It Works

1. `APP_VERSION` and `APP_VERSION_MSG` are constants at the top of the script in `app.html`
2. On app load, `checkVersionUpdate()` compares `APP_VERSION` to the last seen version stored in `SK.seenVer`
3. If the major or minor digit changed → show a slide-down banner with the version and message
4. If only the patch digit changed → silently update `SK.seenVer`, no banner
5. User taps OK → banner dismissed, version saved, never shown again for that version

### How to Bump

When making changes, update these two lines near the top of the script in `app.html`:

```javascript
const APP_VERSION = '4.5.2';                         // ← bump according to rules above
const APP_VERSION_MSG = 'Description of changes.';    // ← short description of what changed
```

> **Rule:** Always update `APP_VERSION_MSG` when bumping minor or major. The message appears in the update banner — it should be one short sentence describing what the user will notice.

> **Non-Negotiable:** Every commit that changes `app.html` must include an `APP_VERSION` bump according to the thresholds above. Never skip this — the version bump is part of the change, not a separate step. Accumulate changes within a session and apply the appropriate bump level (patch/minor/major) based on the total scope of changes in that commit.

> **Non-Negotiable:** When `APP_VERSION` is bumped, also update the version in the hero badge in `index.html` (`<div class="hero-badge">PROGRESSIVE WEB APP — vX.Y.Z — ZERO DEPENDENCIES</div>`) to match. The landing page must always reflect the current app version.

### Version Rollover Rule

> **When the minor version reaches 10 (e.g. `X.10.Z`), the next minor bump rolls over to the next major version.** Example: after `1.10.0`, the next minor bump becomes `2.0.0` (not `1.11.0` — that is invalid). Patch bumps within `.10.Z` are fine (e.g. `1.10.1` is valid). Only the next *minor* bump triggers the rollover. Nothing above `.10.Z` should ever exist.

### Update Log Rule

> **Non-Negotiable:** Every version bump must be documented in `UPDATE_LOG.md`. Add a new entry at the top (newest first) following the existing format: version, date, scope, banner message, and bullet points describing all changes. This file is the canonical record of what changed and when. Never skip updating it.

---

## 13. Quick Reference

```
Repository:   github.com/HIRAKHANJI/protocol-health
Live URL:     https://hirakhanji.github.io/protocol-health/
App file:     app.html (single file, ~5000+ lines)
Landing:      index.html (product page)
PWA files:    manifest.json, sw.js, PH_LOGO_192.png, PH_LOGO_512.png

Storage keys (all in SK object at top of script):
  ph_wt_v1  — weight log
  ph_dl_v1  — day logs (checks, weight, water, energy, notes)
  ph_fd_v1  — fast days
  ph_ld_v1  — light eating days
  ph_st_v1  — settings
  ph_sc_v1  — schedule
  ph_sv_v1  — last seen app version (for update banner)
  ph_fl_v1  — food log (per-day entries with macros)
  ph_fb_v1  — food library (autocomplete + macro memory)
  ph_ex_v1  — exercise levels (per-day progression tracking)
  ph_sw_v1  — last dismissed SW cache version (for reload banner)

Plans:        PLANS.default, PLANS.agro, PLANS.cut, PLANS.bulk, PLANS.maintenance
Active plan:  getActivePlan() — never reference PLANS[x] directly elsewhere
Day types:    getDayType(dateStr) → 'fast' | 'light' | 'normal'
Data writes:  always end with dispatch("EVENT_NAME")
Dialogs:      showConfirm(), showAlert() — never native confirm/alert
Dates:        dateToStr(d), strToDate(s), todayStr() — never toISOString()
Cache:        sw.js CACHE_NAME = "protocol-health-v11" — bump on every significant push
App version:  APP_VERSION = "4.5.2" — bump on notable updates (see Section 12)
Update log:   UPDATE_LOG.md — every version bump must be documented here
```

---

## 14. Related Documentation

| File | Purpose |
|------|---------|
| `CLAUDE.md` | This file. Project brief, rules, and quick reference for Claude Code. |
| `UPDATE_LOG.md` | Version history. Every version from 1.0.0 onward with dates, scope, and change descriptions. Must be updated on every version bump. |
| `ARCHITECTURE.md` | Full system architecture with Mermaid diagrams. Covers dispatcher, plan system, tabs, weight tracking, projection algorithm, goal calculator, schedule, macros, food logging, radar chart, calendar, backup/restore, service worker, and data flow. |
| `PLAN.md` | Implementation plan for the cut/bulk/maintenance plan addition (v1.9.0). Historical reference — the work is complete. |

---

## 15. Science Reference Directive

The following URLs and rules must be consulted before modifying supplement doses, nutrition targets, workout programming, or plan logic in app.html.

### Tier 1 URLs (Check First)

**Nutrition baselines:**
- All nutrient fact sheets: https://ods.od.nih.gov/factsheets/list-VitaminsMinerals/
- DRI tables: https://ods.od.nih.gov/HealthInformation/nutrientrecommendations.aspx

**Per-nutrient ODS fact sheets (for all dosing/UL checks):**
- Magnesium: https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/
- Zinc: https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/
- Vitamin D: https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/
- Omega-3: https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/
- Calcium: https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/
- Potassium: https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/

**Sports nutrition consensus:**
- ISSN Diets & Body Composition: https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/
- ISSN Protein & Exercise: https://pubmed.ncbi.nlm.nih.gov/28642676/
- ISSN Master Review 2018: https://pmc.ncbi.nlm.nih.gov/articles/PMC6090881/

**Calisthenics evidence:**
- Push-up = bench press (Kotarsky 2018): https://pubmed.ncbi.nlm.nih.gov/29466268/
- Rep vs load progression (Plotkin 2022): https://pmc.ncbi.nlm.nih.gov/articles/PMC9528903/
- Repetition continuum (Schoenfeld 2021): https://pmc.ncbi.nlm.nih.gov/articles/PMC7927075/

**Push:Pull balance:**
- Scapular stabilizers (Cools 2016): https://pmc.ncbi.nlm.nih.gov/articles/PMC4886800/
- Pull-up kinematics (Prinold 2016): https://pmc.ncbi.nlm.nih.gov/articles/PMC4916995/

### Safety Rules

Before writing ANY supplement dose into app content:
1. Open ODS fact sheet for that nutrient
2. Confirm proposed dose ≤ Tolerable Upper Intake Level (UL)
3. If dose > UL: ADD explicit safety warning to app display
4. Cross-reference with ISSN 2018 master review

### Hard-Coded Safety Limits

| Supplement | Max dose/day | Risk if exceeded |
|---|---|---|
| Vitamin D3 | 4,000 IU (NIH UL) | Hypercalcemia at sustained >10,000 IU |
| Zinc (supplemental) | 40mg/day average | Copper deficiency anemia |
| Magnesium (supplemental) | 350mg/day | Osmotic diarrhea |
| Potassium (OTC) | 99mg per serving | Hyperkalemia |
| MCT Oil | 30g max acute | GI distress |

### ZINC COPPER INTERACTION (CRITICAL)
Chronic zinc >40mg/day blocks copper absorption → copper deficiency. Current protocol: 50mg × 3 days/week (Mon/Wed/Fri) = 21.4mg/day average. True alternate-day spacing, no consecutive dosing, no coverage gaps. DO NOT change zinc to daily dosing without flagging this risk.

### Push:Pull Ratio (HARD RULE)
Protocol Health must NEVER generate a training plan with push:pull ratio > 1:1. Default for AGRO CUT: pull-dominant (5:7). Source: Cools 2016 + Prinold 2016

### Prohibited Sources
Never cite: supplement brand websites, influencer stacks, sites requiring purchase, single case reports, commercial programs, news articles about research (use original DOI).
