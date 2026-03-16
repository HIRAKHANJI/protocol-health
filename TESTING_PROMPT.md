# Protocol Health — Comprehensive QA Testing Prompt for Claude (Chrome Extension)

> **Instructions for Claude:** You are testing a single-page Progressive Web App called **Protocol Health** loaded in this browser tab. The app is a personal fitness tracker — dark theme, mobile-first, no backend, all data in localStorage. Your job is to systematically test every feature, interaction, and edge case, then produce a detailed report at the end. Work through each section below in order. **Click, type, and interact with every element.** Do not skip sections.

---

## PHASE 0 — INITIAL STATE AUDIT

Before touching anything:
1. Note the current tab displayed (should be TODAY)
2. Check if a plan banner is visible at the top — record which plan is active (DEFAULT PROTOCOL or AGRO CUT CALISTHENICS)
3. Check if a fast day banner is showing (purple "WATER FAST DAY" strip) — note if today is a fast day
4. Check if a duration/schedule strip is visible (shows "DAY X / TOTAL")
5. Check if a calorie strip is visible below the checklist
6. Check if a projection strip is visible (shows projected Sunday weight)
7. Check the goal bar — record current weight, target weight, percentage
8. Note how many checklist items are visible and in which groups (MORNING, EATING or FAST, EVENING, NIGHT)
9. Check the header — is there a plan badge? What does it say?
10. Screenshot the full TODAY tab state

---

## PHASE 1 — TODAY TAB (Checklist System)

### 1.1 Checklist Interaction
- Tap each checklist item one by one — confirm it toggles to "done" state (green border, strikethrough text, checkmark appears)
- Tap a completed item again — confirm it toggles back to unchecked
- After checking several items, verify the progress bar updates in real time (percentage and fill width)
- Check all items — verify progress shows 100%

### 1.2 Checklist Groups
- Verify items are grouped under section headers: MORNING (green tag), EATING or FAST (red or purple tag), EVENING (orange tag), NIGHT (blue tag)
- Each group header should have a colored tag label
- Verify sub-text appears below each item label in muted/smaller text

### 1.3 Fast Day Detection
- Note whether today shows EATING items or FAST items — this depends on whether today is marked as a fast day
- If it's a fast day: verify the purple "WATER FAST DAY" banner is visible with protocol instructions
- If it's an eating day: verify EATING group items are shown and fast banner is hidden

### 1.4 Reset Checklist
- Check a few items, then scroll to the bottom and tap "RESET TODAY'S CHECKLIST"
- A confirmation dialog should appear — verify it says something about resetting
- Confirm the reset — all items should return to unchecked, progress bar to 0%

### 1.5 Plan Banner
- At the top of the TODAY tab, verify the active plan banner shows:
  - Plan name (e.g., "DEFAULT PROTOCOL" or "AGRO CUT CALISTHENICS")
  - Calorie ceiling (e.g., "1500 CAL" or "1000 CAL")
- Verify banner styling matches the plan (default = neutral colors, agro = distinct styling)

### 1.6 Dynamic Sub-Text
- The morning workout item, evening session item, and stretch item should show day-specific sub-text
- Note what today's sub-text says — it should reference today's specific workout (e.g., "MONDAY — Upper body push + pull")

---

## PHASE 2 — BOTTOM NAVIGATION

### 2.1 Tab Switching
- Tap each of the 6 tabs in order: TODAY, MONTHS, WORKOUTS, NUTRITION, RULES, TRACK
- Verify each tab loads its content correctly
- Verify the active tab has a green underline/highlight
- Verify only one tab is active at a time
- Switch back to TODAY — verify checklist state is preserved (items you checked earlier should still be checked)

---

## PHASE 3 — MONTHS TAB (Calendar)

### 3.1 Calendar Rendering
- Switch to MONTHS tab
- Verify a month calendar grid is displayed with day-of-week headers (S M T W T F S)
- Verify today's date has a highlighted border (green glow)
- Verify future dates appear dimmed/faded
- Check month/year header is correct

### 3.2 Month Navigation
- Tap "NEXT" button — verify calendar advances one month
- Tap "PREV" button — verify it goes back
- Navigate to a past month where you have data — verify cells are color-coded:
  - **Green** = full compliance day
  - **Purple** = water fast day
  - **Orange** = partial compliance
  - **Red** = missed/no data
- Navigate back to current month

### 3.3 Month Stats
- Above the calendar, verify 4 stat boxes are shown: DONE (green), FASTS (purple), PARTIAL (orange), MISSED (red)
- Verify the numbers match what you see in the calendar cells

### 3.4 Day Modal (Tap a Past Day)
- Tap on a past date cell in the calendar
- A modal should slide up with:
  - Date as title (e.g., "Mon, Mar 9")
  - Full date subtitle
  - Close button (×)
- Inside the modal, verify these fields:
  - **Fast day toggle** — button to set/unset water fast day
  - **Weight input** — number field, placeholder "e.g. 103.5"
  - **Water input** — number field, placeholder "e.g. 3.0"
  - **Full checklist** — all items for that day with interactive checkboxes (should be tappable in the modal)
  - **Food log section** — list of food entries (if any), ADD button with name + cal inputs
  - **Energy dropdown** — custom dropdown with options: High, Normal, Low, Crashed
  - **Notes textarea** — free text, placeholder "How did today go?"
  - **SAVE DAY button** at the bottom

### 3.5 Day Modal — Data Entry
- In the day modal for a past day:
  - Enter a weight (e.g., 102.5) and water (e.g., 3.0)
  - Check a few checklist items
  - Select an energy level from the dropdown
  - Type a note (e.g., "Test note from QA")
  - Tap SAVE DAY
- Close the modal — verify the calendar cell color updates based on what you logged

### 3.6 Day Modal — Fast Day Toggle
- Open a day modal for a non-fast day
- Tap the fast day toggle — it should turn active (purple, text changes to "WATER FAST DAY — TAP TO UNSET")
- The checklist should switch from eating items to fast day items
- Toggle it back off — checklist should revert to eating items
- Save and close

### 3.7 Day Modal — Food Logging
- Open a day modal
- In the food section, type a food name and calorie amount
- Tap ADD — verify it appears in the list
- Add a second food — verify running total updates
- Verify the calorie total shows remaining vs ceiling (color-coded: green if under, orange if near, red if over)
- Try deleting a food entry — tap the delete/remove button next to it

### 3.8 Day Modal — Today
- Tap today's cell on the calendar
- The modal should open but the checklist should show a summary count (e.g., "5/12 complete") instead of interactive items (since today's checklist is on the TODAY tab)

### 3.9 Schedule Overlay
- If a schedule is active, verify some calendar cells have a white border overlay indicating scheduled days
- If no schedule is active, note this and test schedule creation later in Phase 7

### 3.10 Export Logs Button
- On MONTHS tab, tap "EXPORT LOGS" button
- An export modal should open with:
  - From date and To date inputs (pre-filled with reasonable defaults)
  - Checkboxes: Weights, Compliance, Notes, Water, Energy (all checked by default)
  - GENERATE button
  - CLOSE button
- Tap GENERATE — verify text output appears
- Tap COPY TO CLIPBOARD — verify confirmation message
- Close the export modal

---

## PHASE 4 — WORKOUTS TAB

### 4.1 Content Rendering
- Switch to WORKOUTS tab
- Verify the section title shows the active plan name + "WORKOUTS"
- Verify workout cards are displayed — each card should have:
  - A title (e.g., "SESSION A — UPPER PUSH + PULL")
  - Exercise rows with: name, notes/form cues, sets/reps

### 4.2 Week Grid
- At the top, verify a 7-day week grid showing day icons (emoji like 💪 🦵 🚶)
- Today should be highlighted
- Each day icon should reflect the plan's workout schedule

### 4.3 Workout Cards
- Verify each workout card is collapsible (tap to expand/collapse)
- Count the number of workout sessions shown
- Verify exercise details are readable and complete

### 4.4 Exercise Levels (AGRO Plan Only)
- If the AGRO plan is active, look for "SET" or "Lv X/Y" badges on exercises
- Tap a level badge — a level selector modal should appear at the bottom
- The modal should show all progression levels for that exercise (e.g., Level 1: Wall push-ups → Level 8: One-arm push-ups)
- Current level should be highlighted
- Select a different level — verify it updates the exercise display
- Close the level selector

---

## PHASE 5 — NUTRITION TAB

### 5.1 Content Rendering
- Switch to NUTRITION tab
- Verify section title shows plan name + "NUTRITION"
- Verify macro grid boxes are displayed:
  - Calorie ceiling (should match settings)
  - Protein target (calculated from calories)
  - Other macros as defined by the plan

### 5.2 Dynamic Values
- The calorie value should match what's set in settings
- Protein should be calculated (typically 40% of calories / 4)
- Verify all nutrition content is readable and complete

### 5.3 Meal Timing & Protocol
- Verify the plan shows eating window rules (e.g., "Last meal before 6PM")
- On AGRO plan: verify more aggressive nutrition rules are shown
- Check for snack lists, allowed/banned items, fast day protocol sections

---

## PHASE 6 — RULES TAB

### 6.1 Content Rendering
- Switch to RULES tab
- Verify section title shows "EATING RULES" or similar
- Verify rule cards are displayed with:
  - Rule number (RULE 01, RULE 02, etc.)
  - Rule title
  - Rule detail/explanation

### 6.2 Dynamic References
- At least one rule should reference the calorie ceiling value from settings
- Verify the number matches your current settings

---

## PHASE 7 — TRACK TAB

### 7.1 Weight Logging
- Switch to TRACK tab
- In the weight input field, enter a test weight (e.g., 103.2)
- Tap LOG — verify:
  - The weight appears in the history list below
  - Date and weight are shown
  - Delta from previous entry is calculated (green for loss, red for gain, grey for same)
  - Goal bar updates
  - Projection strip updates (if visible)

### 7.2 Weight History
- Verify the weight history list shows entries in reverse chronological order (newest first)
- Each entry should show: date, weight in kg, change from previous entry
- If this is the first entry, delta should show "—" or similar

### 7.3 Food Logging (Track Tab)
- Find the food input section on the TRACK tab
- Type a food name — if you've logged foods before, verify autocomplete suggestions appear
- Enter a food name and calorie amount, tap ADD
- Verify it appears in today's food log
- Verify the today calorie strip on the TODAY tab updates (switch back to check)

### 7.4 Food Suggestions
- Start typing a previously logged food name
- Verify a dropdown appears with matching suggestions
- Each suggestion should show the food name and its last-used calorie value
- Tap a suggestion — verify both name and calorie fields auto-fill

### 7.5 Goal Bar
- Verify the goal bar shows:
  - Current weight (left)
  - Target weight (right)
  - Remaining kg
  - Percentage progress
  - Filled bar proportional to progress
- If target is lower than current (weight loss), progress increases as weight drops

### 7.6 Projection Strip
- If enough weight data exists (2+ entries), verify the projection strip shows:
  - Projected weight by Sunday
  - Delta from current weight
  - Best/worst case range
  - Basis note explaining the projection method

### 7.7 Recent Day Logs
- Scroll down on TRACK tab to find the "RECENT LOGS" or similar section
- Verify it shows the last 14 days with any logged data
- Each entry should show date and color-coded badges for: weight, water, energy, compliance count

### 7.8 Clear Weight Log
- Tap "CLEAR WEIGHTS" button
- A confirmation dialog should appear with a danger/red button
- **Cancel** the dialog — verify nothing is deleted
- (Do not actually clear unless you want to reset test data)

### 7.9 Backup
- Tap "BACKUP TO FILE"
- Verify a JSON file downloads named `protocol-health-backup-YYYY-MM-DD.json`
- A confirmation message should appear briefly

### 7.10 Restore
- Tap "RESTORE FROM FILE"
- A file picker should open
- Select the backup file you just downloaded
- A confirmation dialog should appear asking to confirm restore
- Confirm — verify all data is restored and UI refreshes

### 7.11 Export (Text)
- Tap "EXPORT LOGS" on the TRACK tab
- Same export modal as on MONTHS tab should open
- Test with different checkbox combinations (uncheck some, generate, verify output changes)

---

## PHASE 8 — SETTINGS PANEL

### 8.1 Opening Settings
- Tap the gear icon (⚙) in the top-right header
- Settings panel should slide in as an overlay
- Verify it has a title "SETTINGS" and a close button (×)

### 8.2 Plan Selection
- Verify the plan dropdown shows the current active plan
- Tap the dropdown — verify both options appear:
  - "DEFAULT PROTOCOL"
  - "AGRO CUT CALISTHENICS PLAN"
- Select the OTHER plan (not the current one)
- Verify:
  - Plan description text updates below the dropdown
  - A "CONFIRM PLAN" button is visible
- Tap CONFIRM PLAN
- Close settings and check:
  - TODAY tab banner changes to new plan
  - Checklist items change (different items for each plan)
  - WORKOUTS tab content changes
  - NUTRITION tab content changes
  - RULES tab content changes
- **Switch back to the original plan** to restore state

### 8.3 Goal Calculator — Mode A (Deadline Given)
- In settings, fill in:
  - Current weight: e.g., 104
  - Target weight: e.g., 91
  - Days: e.g., 90
  - Leave calories blank (auto-calculate mode)
  - TDEE: 2600
  - Exercise burn: 200
- Tap CALCULATE
- Verify results panel appears with:
  - Weeks and total days
  - Required cal/day
  - kg/week rate
  - Deficit per week
  - End date
  - Diet deficit vs exercise contribution breakdown
  - Risk flag (Achievable/Aggressive/Unrealistic) — color-coded green/orange/red
  - Warning text if applicable

### 8.4 Goal Calculator — Mode B (Calories Given)
- Clear the days field
- Enter calories: e.g., 1200
- Tap CALCULATE
- Verify it now calculates how many days/weeks to reach target at that calorie level
- Verify end date is computed

### 8.5 Risk Tolerance Levels
- Test each risk tolerance setting:
  - **Standard** — verify it flags aggressive calorie levels as unrealistic
  - **Aggressive** — verify it allows lower calories
  - **Unrestricted** — verify it shows math without blocking
- Switch between them and re-calculate each time

### 8.6 USE THESE CALORIES Button
- After a calculation, if a "USE THESE CALORIES" button appears, tap it
- Verify the calculated calorie value is saved to settings
- The nutrition tab and checklist sub-text should update to reflect new calories

### 8.7 ADD TO SCHEDULE Button
- After a calculation, tap "ADD TO SCHEDULE"
- A confirmation popup should appear: "ADD TO SCHEDULE?" with YES/NO buttons
- Tap YES — verify:
  - Duration strip appears on TODAY tab (shows DAY X / TOTAL)
  - Calendar on MONTHS tab shows schedule overlay (white-bordered cells)
  - Fast days are auto-set on the plan's fast day schedule (e.g., Sun/Wed/Sat)
  - "MANAGE SCHEDULE" button appears on MONTHS tab

### 8.8 Start Date
- Verify the start date field exists and can be set
- Changing it should affect the schedule if one is active

### 8.9 Close Settings
- Tap the × button — verify settings panel closes
- Tap the gear icon again and verify settings are preserved (not reset)

---

## PHASE 9 — SCHEDULE MANAGEMENT

### 9.1 Open Manage Schedule
- On the MONTHS tab, tap "MANAGE SCHEDULE" (only visible if a schedule exists)
- A management panel should open showing:
  - Current schedule status (start date, day count, plan name)
  - Adjust section with target weight and calorie inputs
  - End Today button
  - Remove Schedule button

### 9.2 Adjust Schedule
- Enter a new target weight or calorie amount
- Verify projected results update (weeks left, days, rate, end date)
- Tap CONFIRM ADJUSTMENT — verify schedule updates
- Check calendar and duration strip reflect changes

### 9.3 End Schedule Today
- Tap "END SCHEDULE TODAY"
- Confirmation should appear
- Confirm — verify:
  - Schedule trimmed to today (past days kept, future days removed)
  - Duration strip updates
  - Calendar overlay adjusts

### 9.4 Remove Schedule
- Tap "REMOVE SCHEDULE COMPLETELY"
- Confirmation should appear (may include checkbox about clearing future fast days)
- Confirm — verify:
  - Duration strip disappears from TODAY
  - Calendar overlay removed
  - MANAGE SCHEDULE button hidden

---

## PHASE 10 — EDGE CASES & STRESS TESTS

### 10.1 Empty State
- If possible (or imagine): what happens with zero data?
  - Weight history should show "No entries yet"
  - Goal bar should show default values
  - Projection should be hidden or show placeholder
  - Calendar should have no colored cells for current month

### 10.2 Boundary Values
- Try logging weight of 60 (minimum) and 250 (maximum)
- Try entering 0 calories for a food — does it accept?
- Try entering extremely long food name — check for overflow
- Try entering negative values in weight/calorie fields

### 10.3 Date Edge Cases
- Navigate calendar to the very first month (if weight data goes back far)
- Navigate to a far future month — verify future days are dimmed
- Open day modal for a future date — verify limited interaction (no checklist editing)

### 10.4 Fast Day on Eating Day Toggle
- On the TODAY tab, if today is an eating day, open the day modal from MONTHS and toggle fast day ON
- Switch to TODAY tab — verify:
  - Checklist switches to fast day items
  - Fast day banner appears
  - EATING group is hidden, FAST group is shown
- Toggle it back and verify everything reverts

### 10.5 Multiple Weight Entries Same Day
- Log two different weights on the same day
- Verify the most recent one is used for the goal bar and projection
- Check weight history — does it show both entries or update the existing one?

### 10.6 Plan Switch Persistence
- Switch plan to AGRO, check a few items, switch back to DEFAULT
- Switch back to AGRO — are the checked items preserved? (They should be, since checks are stored by item ID)

### 10.7 Rapid Tab Switching
- Quickly tap between all 6 tabs multiple times
- Verify no rendering glitches, no stale content, no broken layout

### 10.8 Modal Interactions
- Open day modal, then try to open settings — verify proper overlay stacking or that one closes first
- Open settings, then try switching tabs — verify behavior
- Click outside a modal — verify it closes
- Open the export modal, then close it — verify clean state

---

## PHASE 11 — VISUAL / UI AUDIT

### 11.1 Typography
- Verify headers use Bebas Neue font (tall, condensed)
- Verify data labels use DM Mono (monospace)
- Verify body text uses DM Sans
- Check for any text overflow or clipping

### 11.2 Color Consistency
- Background should be near-black (#0a0a0a)
- Cards/surfaces should be dark grey (#111111)
- Primary accent should be green (#c8f542)
- Secondary accent should be orange (#f5a623)
- Fast day elements should be purple (#7b68ee)
- Danger elements should be red (#ff4444)

### 11.3 Responsive Layout
- If testing on desktop, resize browser to 375px width (mobile) — verify no horizontal scroll
- Verify all buttons are tappable size (min 44px touch target)
- Verify modals don't overflow the screen
- Verify calendar grid fits within the viewport

### 11.4 Dark Theme Consistency
- Scroll through every tab — verify no white backgrounds, no light-themed elements
- Check all modals and overlays for dark theme consistency
- Verify input fields have dark backgrounds with light text

---

## PHASE 12 — PWA BEHAVIOR

### 12.1 Service Worker
- Open Chrome DevTools → Application → Service Workers
- Verify a service worker is registered
- Note the cache name (should be `protocol-health-v7` or similar)

### 12.2 Manifest
- In DevTools → Application → Manifest
- Verify app name, icons, display mode (standalone), theme color

### 12.3 Offline Capability
- In DevTools → Network tab, switch to "Offline" mode
- Reload the page — verify the app still loads from cache
- Switch back to online mode

---

## REPORT FORMAT

After completing all phases, generate a report with this exact structure:

```
# PROTOCOL HEALTH — QA TEST REPORT
Date: [today's date]
Plan Tested: [which plan was active]
Browser: Chrome [version]
Device/Screen: [dimensions or device name]

## SUMMARY
- Total tests performed: [count]
- Passed: [count]
- Failed: [count]
- Warnings: [count]
- Blocked: [count] (tests you could not perform and why)

## CRITICAL ISSUES (bugs that break functionality)
1. [Issue title]
   - Steps to reproduce: ...
   - Expected: ...
   - Actual: ...
   - Screenshot: [if applicable]

## MODERATE ISSUES (bugs that degrade experience)
1. [Issue title]
   - Steps to reproduce: ...
   - Expected: ...
   - Actual: ...

## MINOR ISSUES (cosmetic, polish, text)
1. [Issue title]
   - Details: ...

## WARNINGS (not bugs, but worth noting)
1. [Warning description]

## PHASE-BY-PHASE RESULTS
### Phase 0 — Initial State
- [Result for each check]

### Phase 1 — Today Tab
- [Result for each test]

[... continue for all 12 phases ...]

## SUGGESTIONS
- [Any UX improvements noticed during testing]
- [Any missing features that seem like oversights]
- [Performance observations]

## DATA INTEGRITY CHECK
- localStorage keys found: [list SK keys and their sizes]
- Any orphaned data: [yes/no]
- Any corrupted entries: [yes/no]
```

**Important notes:**
- Be brutally honest — do not skip issues to be polite
- Test BOTH plans if possible (switch plans mid-test and re-verify key features)
- If something fails, document it precisely with reproduction steps
- If an element is missing or not rendering, note exactly what you expected vs what you see
- Check the browser console for JavaScript errors throughout — report any you find
- Take screenshots of any visual bugs or unexpected states
