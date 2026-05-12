# Calibration Project — Phase C Plan

> **📜 HISTORICAL — ✅ SHIPPED in v6.4.0.** Calibration project completed at v7.8.1 (all phases A–D + 11–13). Plan retained for audit trail only. Do not follow as if active. See `UPDATE_LOG.md` for the version-by-version record.

**Status:** ✅ COMPLETED (shipped v6.4.0)
**Branch:** `claude/add-workout-exercises-KjRRh`
**Version target:** `6.4.0` (minor — new visible UX, banner shown)

## Goal

Replace the boolean fast-day model with a real start/stop fast-window model. Existing fast days continue to work as 24-hour fasts (backward-compat). Going forward, every fast requires explicit START / STOP timestamps. Food logged during an active fast prompts the user to mark it broken.

## Scope

### New file: `components/fast-window.js`

All fast-window logic lives in one component. Exports:

- **`getFastWindows(dateStr)`** — returns the array (or `[]`)
- **`getActiveFastWindow(dateStr)`** — returns the open window (no end), or `null`
- **`isFastBroken(dateStr)`** — true if any window on this date has `broken: true`
- **`getFastDurationHours(dateStr)`** — sum of (end - start) hours across windows; returns `24` if only legacy `fastDays` is set with no windows
- **`startFast(dateStr?)`** — appends `{ start: now, end: null, broken: false, brokenBy: [] }`
- **`endFast(dateStr?)`** — sets `end: now` on the most recent open window
- **`markFastBroken(dateStr, foodEntryId)`** — flips `broken: true`, sets `end: food.ts`, appends to `brokenBy`
- **`editFastWindow(dateStr, idx, startISO, endISO)`** — retroactive edit
- **`renderTodayFastUI()`** — populates `#fastBannerControls` inside the existing `#fastBanner`
- **`renderDayModalFastEditor(dateStr)`** — returns HTML for the edit-times block in the day modal
- **`openFastEditModal(dateStr)`** — opens a small modal with two `<input type="time">` pickers
- **`saveFastEditFromModal(dateStr)`** — reads the modal inputs, calls `editFastWindow`
- **`startFastTickInterval()`** — kicks off a 30s setInterval to refresh the live timer

### Edits to `app.html`

1. **Module loader** (~line 1327) — import `fast-window.js`, expose all functions to `window.*`
2. **`addFoodEntry`** (~line 1851) — after `dispatch('FOOD_LOGGED')`, if `getActiveFastWindow(dateStr)` returns an unbroken window, show `showConfirm("Break this fast?", ...)`. Cancel = fast continues (electrolyte case). Confirm = `markFastBroken`.
3. **TODAY fast banner HTML** (~line 663) — add `<div class="fast-banner-controls" id="fastBannerControls"></div>` after the existing `.fast-banner-sub`
4. **`updateFastUI`** (~line 2563) — after the existing toggles, call `renderTodayFastUI()`
5. **`runInit` end** — call `startFastTickInterval()` once
6. **CSS** — add `.fast-banner-controls`, `.fw-btn`, `.fw-timer`, `.fw-broken-pill` styles in the existing `<style>` block
7. **Bump** `APP_VERSION` 6.3.0 → 6.4.0
8. **Update** `APP_VERSION_MSG`

### Edits to `modules/calendar.js`

1. **`renderCalendar`** (~line 81-87) — for past fast days where `isFastBroken(dateStr) === true`, set class to `cal-partial` (orange) instead of `cal-fast` (purple)
2. **Same logic for today** (~line 69) — broken fast on today shows orange
3. **`openDayModal`** (~line 153) — when `isFast && !isFuture`, insert `renderDayModalFastEditor(dateStr)` after the fast-protocol box

### Edit to `UPDATE_LOG.md`

- Add v6.4.0 entry at top

## Storage shape (after Phase C)

```
SK.fastWindows = 'ph_fw_v1' = {
  "2026-04-26": [
    { start: "2026-04-25T20:00:00.000Z",
      end:   "2026-04-26T20:00:00.000Z",
      broken: false,
      brokenBy: [] }
  ]
}
```

Convention: window is stored under the date the fast PRIMARILY happens (matches `fastDays[date]`). The `start` ISO can be on the previous calendar date if the user starts the fast the night before.

## Backward compatibility

- Existing `fastDays[date] = true` entries remain in `ph_fd_v1` untouched
- All readers consult `fastWindows[date]` first; if absent, fall back to the boolean (interpreted as a 24-hour fast, never broken)
- The migration runs once on first load (Phase A already shipped this); no data is touched
- `autoSetPlanFastDays` continues to set the boolean only — does NOT pre-seed windows. User must explicitly tap START FAST per fast day going forward
- Past fast days that the user wants to backfill with real times: tap the day on calendar → use Edit Times button

## Behaviors

| Situation | App response |
|---|---|
| TODAY is fast, no window started | Banner shows `[▶ START FAST]` button |
| TODAY is fast, window started, no end | Banner shows live timer + `[■ END FAST]` |
| TODAY is fast, window ended | Banner shows last duration + `[▶ START NEW FAST]` |
| User logs food during active window | Confirm dialog: "Break this fast?" — Yes = broken, Cancel = fast continues |
| User taps Edit Times in day modal | Opens small modal with two time inputs (start, end), saves to `fastWindows` |
| Past fast day was broken | Calendar cell turns orange (cal-partial) |
| Past fast day was completed (legacy or windowed) | Calendar cell stays purple (cal-fast) |

## Files touched

| File | Change |
|---|---|
| `components/fast-window.js` (NEW) | All fast-window logic + UI helpers (~280 lines, under 400 limit) |
| `app.html` ~1327 | Module loader exposes fast-window exports to window.* |
| `app.html` ~663 | Add `<div id="fastBannerControls">` inside `#fastBanner` |
| `app.html` ~135 | Add CSS for `.fast-banner-controls`, `.fw-btn`, `.fw-timer`, `.fw-broken-pill` |
| `app.html` ~1851 | `addFoodEntry` shows break-fast confirm when active window detected |
| `app.html` ~2563 | `updateFastUI` calls `renderTodayFastUI()` |
| `app.html` runInit end | `startFastTickInterval()` |
| `app.html` ~1506 | APP_VERSION 6.3.0 → 6.4.0 |
| `modules/calendar.js` ~69, 81-87 | Broken fast → orange |
| `modules/calendar.js` ~153 | Day modal gets fast-window editor |
| `UPDATE_LOG.md` | v6.4.0 entry |

## Risk table

| Risk | Mitigation |
|---|---|
| Old fast days stop showing as fast | Only changed branch is `if (isFastBroken(dateStr))` — purely additive on top of existing logic. Old fast days have no windows, `isFastBroken` returns false, original color flow applies. |
| Live timer drains battery | 30s interval, only DOM-touches if banner controls element exists. ~negligible cost. |
| Food log prompt fires on past-day food backfill | Active-window check requires `end === null`. Past days the user is backfilling typically don't have an open window. Safe. |
| User accidentally taps BREAK FAST | The confirm dialog uses `danger: true` styling (red button). Cancel restores the fast. |
| Time-picker stores wrong day | Modal asks for start/end times; saves with the calendar date appended. Cross-midnight handled by setting start ISO with previous-day date if start time > end time. |
| Module loader load order | Fast-window module exports needed by `addFoodEntry` (in classic script). The module's loader fires `ph:components-ready` only after `window.*` assignments complete; same pattern as workout-card / rule-card / checklist (verified at app.html:1325-1356). |

## Acceptance criteria

- [ ] APP_VERSION reads `6.4.0`
- [ ] Existing fast days still color purple on calendar
- [ ] TODAY tab on a fast day shows START FAST button
- [ ] Tapping START FAST creates a window and shows live timer
- [ ] Tapping END FAST closes the window
- [ ] Logging food during active window shows confirm dialog
- [ ] Confirm BREAK FAST sets broken=true
- [ ] Past day calendar with `broken: true` shows orange
- [ ] Day modal shows Edit Times button on past fast days
- [ ] No console errors anywhere
