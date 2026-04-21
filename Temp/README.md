# Handoff: Landing Page + Animated Install Guide

**Target repo:** `github.com/HIRAKHANJI/protocol-health`
**Live site:** `https://hirakhanji.github.io/protocol-health/`
**Feature version:** v6.2.2 (asset query strings bumped to `?v=6.2.5`)

---

## TL;DR for Claude Code

The landing page (`index.html`) and its asset bundle in `/assets/` have been redesigned and a new **animated install guide** has been added. The bundle in `./files/` is the **complete, working set of files** that must land in the repo — this is not a design mock that needs recreating. Drop them in, bump the Service Worker cache version, commit, push.

This repo is a vanilla single-file PWA (`app.html`) with a **separate static landing page** (`index.html`) that links into it. There is no build step, no framework, no bundler. These files ship as-is to GitHub Pages.

---

## Overview

`index.html` is the product landing page a visitor sees before installing the PWA. It:

1. Redirects straight to `app.html` if already running as an installed PWA (standalone display mode).
2. Markets the product (hero, features, plans, FAQ sections).
3. Provides an **"INSTALL" button** in the nav and hero that opens an **animated install guide modal**.

The install guide modal is the headline new thing. It has three tabs — **Android / iOS / Desktop** — and each tab shows:

- A numbered step list on the left (5 steps for Android/iOS, 4 for Desktop)
- A **live animated device mockup** on the right (phone for Android/iOS, browser window for Desktop)
- A timeline progress bar + caption below the mockup

The mockup auto-advances through its steps every ~2.8s. On the last step it holds an extra 1.6s, then loops. Tap-ring pulses highlight the exact UI element the user should tap at each step. The step list on the left stays in sync — the current step glows, past steps get a ✓.

---

## About the Design Files

**Important:** unlike a typical design handoff, the files in `./files/` are **not HTML references to recreate in a target framework**. They are the **actual production files** that go straight into the repo. This project has no build step or framework to "recreate" anything in — the files ship as static assets on GitHub Pages.

Your job is:
1. Replace the existing files in the repo with the ones in `./files/`
2. Bump the service worker cache version so returning visitors get the update
3. Commit + push
4. Verify the deployed site

## Fidelity

**Production-ready / shipped code.** Not a mock. Live-tested in an iframe and verified by an automated check.

---

## Deployment Steps (the "what to do" part)

### Step 1 — Replace the landing page + its asset bundle

From the `./files/` folder in this handoff, copy the following files into the repo at the **same relative paths**:

```
files/index.html                          → index.html
files/assets/install-guide.css            → assets/install-guide.css     (NEW FILE)
files/assets/install-guide.js             → assets/install-guide.js      (NEW FILE)
files/assets/landing.css                  → assets/landing.css
files/assets/landing.js                   → assets/landing.js
files/assets/landing-v5.css               → assets/landing-v5.css
files/assets/landing-v5.js                → assets/landing-v5.js
files/assets/landing-sections.css         → assets/landing-sections.css
files/assets/landing-demos.css            → assets/landing-demos.css
files/assets/hero3d.js                    → assets/hero3d.js
files/assets/PH_ARROWS_LOGO.png           → assets/PH_ARROWS_LOGO.png   (if not already present)
files/assets/land-110m.json               → assets/land-110m.json       (if not already present)
```

**Do NOT touch these files** (out of scope for this handoff):
- `app.html` — the actual PWA app, unchanged
- `manifest.json` — unchanged
- `CLAUDE.md`, `README.md`, `ARCHITECTURE.md`, other docs — unchanged
- `PH_LOGO_192.png`, `PH_LOGO_512.png` (at repo root) — unchanged
- `favicon.ico`, `favicon-32.png` — unchanged
- `index.old.html` — old landing page, keep as a backup

### Step 2 — Bump the Service Worker cache version

Open `sw.js` at the repo root and find the cache name. Per `CLAUDE.md`, it is currently `protocol-health-v13` (or whatever the latest version is). Increment it:

```js
const CACHE_NAME = 'protocol-health-v14';   // was v13
```

Also make sure the new files are in the service worker's precache list. Check the `PRECACHE_ASSETS` (or equivalent) array in `sw.js` and ensure it includes:
- `assets/install-guide.css`
- `assets/install-guide.js`

If `assets/landing-v5.css`, `assets/landing-v5.js`, `assets/hero3d.js`, `assets/PH_ARROWS_LOGO.png` are not in the precache list either, add them too. The landing page assets need to be cached so the install guide works offline (important for returning users).

### Step 3 — Commit + push

```bash
git add index.html assets/ sw.js
git commit -m "Landing v6.2.2: animated install guide (Android/iOS/Desktop)"
git push
```

GitHub Pages will deploy within ~1 minute.

### Step 4 — Verify

Open `https://hirakhanji.github.io/protocol-health/` in an **incognito window** (to bypass the cached old service worker) and check:

1. ✅ The landing page loads without console errors.
2. ✅ Click the **INSTALL** button in the nav (or the **INSTALL GUIDE** ghost button in the hero).
3. ✅ A modal opens with three tabs: **ANDROID** (active by default), **iOS**, **DESKTOP**.
4. ✅ On the Android tab, a phone mockup auto-advances through 5 steps: idle → ⋮ menu tap → menu opens → "Install app" confirm dialog → home screen with the app icon.
5. ✅ On the iOS tab, a phone mockup (with Safari chrome) advances: page → share button tap → share sheet up → "Add to Home Screen" naming dialog → home screen.
6. ✅ On the Desktop tab, a browser window advances: ⊕ install icon pulse → install popover → standalone app window.
7. ✅ The caption below each mockup updates in sync ("Step N of 5 · [action]").
8. ✅ Closing the modal pauses the animation; reopening restarts from step 1.
9. ✅ No console errors anywhere.
10. ✅ Mobile viewport (≤720px): the device mockup reflows above the step list.

---

## How the Install Guide Works (architectural notes)

### File responsibilities

| File | Role |
|---|---|
| `index.html` | Landing page shell. Contains nav + hero + feature sections + the INSTALL button. Loads all CSS/JS below. |
| `assets/landing.css` | Base landing styles, variables, typography. |
| `assets/landing-sections.css` | Styles for the marketing sections (features, plans, FAQ). |
| `assets/landing-demos.css` | Styles for inline product demos embedded in the marketing sections. |
| `assets/landing-v5.css` | v5 landing refinements + **the install modal chrome** (backdrop, tabs, base `.install-step` styles). |
| `assets/landing-v5.js` | Landing behavior + **the install modal itself** — injects the modal DOM, defines `openInstall()`, `closeInstall()`, `switchTab(name)`. Creates the three `.install-panel[data-panel="android|ios|desktop"]` panels with their step lists and device mockups. |
| `assets/install-guide.css` | **NEW.** All styles for the animated device mockups (phone frames, browser frame, Chrome/Safari chrome, dialogs, share sheet, home screens) and step-by-step keyframe animations keyed off `data-step="N"`. |
| `assets/install-guide.js` | **NEW.** The animator. Wraps `openInstall()`, `closeInstall()`, `switchTab()` to start/stop a `setTimeout` loop that mutates `data-step` on the active mockup and toggles `.active`/`.past` on the step list. |
| `assets/hero3d.js` | Three.js hero animation (unrelated to the install guide). |

### Data flow — how a step advances

1. User clicks INSTALL → `landing-v5.js`'s `openInstall()` unhides the modal.
2. `install-guide.js` wraps that function, so after the original runs, it calls `start('android')`.
3. `start(tab)`:
   - Finds `.install-panel[data-panel="android"]`.
   - Finds the mockup inside: `.ig-phone` or `.ig-browser`.
   - Sets the mockup's `data-step="1"` → CSS keyed on `[data-step="1"]` shows step-1 state (tap-ring pulse on ⋮).
   - Adds `.active` to the first `.install-step` in the list.
   - Updates the timeline width and caption text.
   - Schedules `tick()` in 2800ms.
4. `tick()` increments the step, calls `setStep(tab, n)`, schedules itself again. On the last step it holds an extra 1600ms before looping to step 1.
5. When the user clicks a different tab, `switchTab(name)` (also wrapped) stops the current loop and starts one for the new tab.
6. Closing the modal stops the loop.

### Key DOM contract

The animator depends on this structure (which `landing-v5.js` must produce when it builds the modal):

```html
<div class="install-panel" data-panel="android">
  <ol class="ig-steps-col">
    <li class="install-step" data-s="1"><span class="num">1</span> ... </li>
    <li class="install-step" data-s="2"><span class="num">2</span> ... </li>
    <!-- etc -->
  </ol>
  <div class="ig-demo-col">
    <div class="ig-demo-label"><span class="ig-demo-dot"></span> LIVE PREVIEW</div>
    <div class="ig-phone ig-phone-android" data-step="1">
      <div class="ig-phone-notch"></div>
      <div class="ig-phone-screen">
        <!-- Chrome chrome, page, menu, dialog, home screen layers -->
      </div>
    </div>
    <div class="ig-timeline"><div class="ig-timeline-fill"></div></div>
    <div class="ig-caption">Step <span class="ig-cap-n">1</span> of 5 · <span class="ig-cap-t"></span></div>
  </div>
</div>
```

The iOS panel uses `.ig-phone.ig-phone-ios` with a Safari bar instead of a Chrome bar.
The Desktop panel uses `.ig-browser` instead of `.ig-phone`.

### Captions (hard-coded in `install-guide.js`)

```js
android: ['Open in Chrome', 'Tap the ⋮ menu', 'Select Install app', 'Confirm install', 'Launches fullscreen']
ios:     ['Open in Safari', 'Tap the Share button', 'Add to Home Screen', 'Name it, tap Add', 'Launches fullscreen']
desktop: ['Open in Chrome/Edge', 'Spot the ⊕ icon', 'Click Install', 'Standalone app window']
```

### Timing constants (top of `install-guide.js`)

```js
const STEP_MS = 2800;        // time per step
const HOLD_LAST_MS = 1600;   // extra pause on the final step before looping
```

Tweak here if timing feels off — don't hard-code in CSS.

### PWA auto-redirect (top of `index.html`)

```js
if(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  window.location.replace('app.html');
}
```

This runs **before anything else** so that users who already installed the PWA never see the landing page again — they open the app icon, the browser loads `index.html`, this line fires, and they land on `app.html` with near-zero flash. Leave this line first in `<head>`.

---

## Design Tokens (inherited from the PWA)

All colors and type come from `colors_and_type.css` / the `:root` block in `landing.css`. Do not hardcode these — use the CSS variables. Key ones in use:

| Token | Value | Used for |
|---|---|---|
| `--accent` | `#c8f542` (lime) | Primary action color, step highlights, tap rings |
| `--bg` | `#0a0a0a` | Page background |
| `--surface` | `#151515` | Cards, modal |
| `--surface2` | `#1f1f1f` | Nested surfaces |
| `--text` | `#f0f0f0` | Primary text |
| `--text-2` | `rgba(240,240,240,0.55)` | Secondary text |
| `--border` | `rgba(255,255,255,0.08)` | Dividers |
| `--f-body` | Inter (or fallback) | Body |
| `--f-mono` | JetBrains Mono (or fallback) | Labels, captions, badges |

---

## Things that must NOT change

- **`app.html` is untouched.** This handoff is landing-only.
- **The `display: standalone` redirect** at the top of `index.html` must stay first in `<head>`.
- **The cache-busting query strings** (`?v=6.2.5`) on the `<link>` tags in `index.html` — these force browsers to pick up the new CSS/JS. If you change the version number, change it everywhere in `index.html`.
- **The `CLAUDE.md` architectural rules** — storage keys via `SK`, dispatcher pattern, `getActivePlan()`, custom dropdowns, `dateToStr` — all still apply to any app-side changes you make later.

---

## If something goes wrong after deploy

**"Modal opens but the mockup is blank / not animating"** → `install-guide.js` isn't loaded, or the modal markup injected by `landing-v5.js` doesn't have the expected structure. Open devtools and check:
- Is `install-guide.js` in the Network tab with a 200?
- Does `document.querySelector('.install-panel[data-panel="android"] .ig-phone')` return a node?
- Does that node have a `data-step` attribute?

**"Old landing page still showing"** → Service worker hasn't updated. Bump `CACHE_NAME` in `sw.js` and redeploy. For local testing: devtools → Application → Service Workers → Unregister, then reload.

**"Modal doesn't open"** → `landing-v5.js` didn't load, or the nav button's `onclick="openInstall()"` isn't wired. Check console.

**"Styling looks broken"** → one of the five landing CSS files didn't load. Check Network tab for 404s. `install-guide.css` is new — if the path is wrong it'll silently fail.

---

## Files in this handoff

- `README.md` (this file)
- `files/index.html` — the updated landing page
- `files/assets/install-guide.css` — NEW. Animated mockup styles.
- `files/assets/install-guide.js` — NEW. The step animator.
- `files/assets/landing.css`, `landing.js` — updated landing base
- `files/assets/landing-sections.css`, `landing-demos.css` — updated sections
- `files/assets/landing-v5.css`, `landing-v5.js` — updated landing v5 (owns the install modal shell)
- `files/assets/hero3d.js` — hero 3D animation (unchanged but bundled for completeness)
- `files/assets/PH_ARROWS_LOGO.png` — logo asset
- `files/assets/land-110m.json` — world map data used in the "ANYWHERE" section
