# Protocol Health — Update Log

All version history for the app. Each entry records version number, date, scope, and what changed.

---

## Version 8.10.2 — 2026-08-03

**Scope:** Patch (TEMP CUT usability — TODAY strip on the WORKOUTS tab). No schema change, no migration, no new SK key.
**Banner:** none (patch).
**CACHE_NAME:** v45 → v46.

### What changed

Owner reported (day 2, deep-fast Monday): "no workout mentioned for Monday" and "the workout card doesn't open for the day I'm on." Headless reproduction (Playwright against the live plan on a simulated Monday) showed the auto-open logic working correctly — the DEEP MONDAYS card (data-days MON) auto-expands — but it sits fifth on the page below four collapsed session cards, so the tab appears to open with nothing for today. Mondays deliberately have no lettered session (walk-only at ~48h fasted).

- `plans/tempcut.js` `workoutContent()` now renders a **computed TODAY strip** as the first card: today's day-of-week resolves to what today is (session letter per date, fast type, walk-only law, gate reminders) and where today's auto-expanded card sits. Content-only change; no shared renderer/UI code touched.

### Files changed

`plans/tempcut.js` (TODAY strip) · `app.html` (APP_VERSION → 8.10.2, APP_VERSION_MSG) · `sw.js` (v46) · `index.html` (full §12 sweep + changelog entry, v8.10.1 demoted) · `CLAUDE.md` / `README.md` (version refs) · `UPDATE_LOG.md` (this entry).

---

## Version 8.10.1 — 2026-08-03

**Scope:** Patch (TEMP CUT rebuilt as v3 "THE DUBAI 13" — full plan-content rework; forced to patch level by the §12 rollover rule, since v9.0.0 stays reserved for the Workout Engine consolidation). No schema change, no migration, no new SK key.
**Banner:** none (patch — silent version update; SW reload banner fires from the cache bump).
**CACHE_NAME:** v44 → v45.

### What changed (full rewrite of `plans/tempcut.js`, ~330 lines)

Owner reset the protocol again before the v2 window ran (the 92h opener was broken on day 2; flight to India moved the wall to Aug 15). v3 spec co-designed in-session 2026-08-02, plain-English edition requested and delivered:

- **Structure:** 13 days, Sun Aug 2 (D1) → Fri Aug 14 (D13), weigh-in Sat Aug 15 morning before the flight — **no overtime exists this round**, so the gates fire earlier and harder. **6 scheduled water fasts** replacing the single long fast: two Sun+Mon back-to-back doubles (Aug 2-3, Aug 9-10) + two Thu singles (Aug 6, Aug 13). `fastDaysDow` [] → **[0,1,4]**, `fastDaysPerWeek` 0 → 3. Deep Mondays (~48h fasted) are WALK-ONLY by law; fast Sundays train Session B-lite @75%; fast Thursdays train moderate @80%. Real-2026 calendar correction baked in (Aug 2 = Sunday — the in-chat design's weekday labels were off by one; dates kept as law, weekdays fixed).
- **Eating:** ~900 cal in a **9AM–3PM window** on the 7 eating days — protein powder ×2 scoops (50g P) + 2 clean bars (40g P) + rice cakes ×2-3 + carrots/pickles (salt supply). Protein floor stays 100g flat. `tdee` 3500 → 3400, `macroSplit` all rows → [45,30,25], `defaultTimes` window 09:00–15:00. FLUSH day (Fri Aug 14) ~750 cal, powder + rice cakes only; low-residue rules start Thu Aug 13 (bars out).
- **Training:** A/B/C/D re-targeted to the owner's stated goals (grow abs + biceps + visible muscle, steel core, whale lower back, debloat/APT fix) with **every exercise carrying a plain-English how-to** in its card, plus a jargon dictionary card — A: chest + biceps + weighted abs (adds the **⭐ kneeling pulldown-machine ab crunch**, the progressive-load ab-grower); B: back + whale lower back (superman/bird-dog isometric block) + forearms; C: legs + side-abs + the **gut-tilt (APT) fix block** (glute bridge march, single-leg hip thrust, slow dead bugs, daily hip-flexor couch stretch); D: shoulders + arms rd 2 + steel core (dragon flag negatives, hollow hold, vacuum ladder, neck ×2). Anti-burnout contract: leave 2 in the tank everywhere except ONE marked finisher per session; exhaustion lives in the daily 10-min burst.
- **New:** 🥷 sneaky-exercise drip table in RULES (+100-200 cal/day of invisible mini-exercises, two safety laws) + a matching `x1` SNEAKY checklist item.
- **Governance:** two gates — Thu Aug 6 ≤98.2 · Mon Aug 10 ≤95.0 — with three pre-agreed levers (pick ONE at the gate): +2 bursts daily / eating days to 800 / extend the Aug 13 fast to Fri 9AM. 13-day ledger cards: OUT ~44,000-49,500 · IN ~6,300 · NET ~38,000-43,000 → lands 91.0-92.2 base, 90.1-91.2 with the extras column.
- **Supplements: D3+K2 removed from the stack entirely (owner call).** Eating days: Osteocare ×2 + MCT gel + zinc M/W/F at 9AM · omega-3 · electrolyte pre-session · magnesium at bed. Fast days: MCT gel + zinc M/W/F + K-tabs ×2 + salt clock, no Osteocare. Creatine paused until Aug 15 (starts in India).
- `app.html`: selector labels "(14-DAY DEPLETION)" → "(THE DUBAI 13)" in both native select + custom dropdown.

### Verification

Re-ran the plan-conformance suite: `node --check` on touched JS + extracted inline script · PLANS assembles 6 keys · required fields present, 7-day sub-maps complete, macroSplit rows sum to 100, checklist ids unique, m3/e2 AUTO-id semantics intact · all three content functions executed with stubbed helpers (fast-day + defaults paths) · §12 stale-ref grep clean.

### Files changed

`plans/tempcut.js` (rewritten) · `app.html` (selector labels, APP_VERSION → 8.10.1, APP_VERSION_MSG) · `sw.js` (v45) · `index.html` (full §12 sweep + changelog entry, v8.10.0 demoted) · `CLAUDE.md` (§3 TEMP CUT blurb → v3, cache + version refs) · `README.md` (Dubai 13) · `UPDATE_LOG.md` (this entry). `WORKING_VERSIONS.md` after on-device smoke.

---

## Version 8.10.0 — 2026-07-30

**Scope:** Minor (TEMP CUT rebuilt as v2 — full plan-content rework). No schema change, no migration, no new SK key.
**Banner:** shown — "TEMP CUT v2 — the plan is rebuilt as a 14-day depletion block (Jul 30 → Aug 14 weigh-in): 92-hour fast opener with electrolyte + refeed scripting, bar-based PSMF at a 100g daily protein floor, a new A/B/C/D session rotation, checkpoints + a contingency gate + a pre-agreed 48h overtime extension, and creatine paused until day 15."
**CACHE_NAME:** v43 → v44.

### Versioning note

8.10.0 is the LAST allowed minor before the rollover rule (§12) forces the next minor to v9.0.0 — which remains reserved for the Workout Engine consolidation. Any further releases before the engine consolidation must be patches (8.10.x).

### What changed (full rewrite of `plans/tempcut.js`, ~370 lines)

Owner reset the protocol mid-block (v1's 10-day window was disrupted on day 1). v2 spec co-designed in-session over three discussion rounds:

- **Structure:** 14 days, Thu Jul 30 (D0, fast began 1PM) → Thu Aug 13 (D14), weigh-in Fri Aug 14 morning. Opens with a **92-hour water fast** (Thu 1PM → Mon Aug 3 9AM) tracked via the app's fast-session system — the 16h rule auto-marks Fri/Sat/Sun as fast days, so `checklistFast` is now a first-class fast-phase checklist (electrolyte clock: salt ×3-4/day + K-tabs ×2, capped 70-80% training, Sunday 72h+ = walk-only rule, scripted Monday refeed, STOP-cluster check item).
- **Eating:** bar-based PSMF ~1,050 cal — 4 low-carb bars (~80g P) + one of tuna/5th bar/yogurt (label law: whey isolate first ingredient, <5g sugar alcohols) + carrots + pickles. **Protein floor 100g/day** (`proteinFloorMultiplier` 1.8 → 1.0 — owner's hard ceiling; retention tax acknowledged in-session, daily resistance training carries the load). `macroSplit` base [65,15,20] → [40,25,35] (bars are fat-carried). `tdee` 4000 → 3500; `activityByDayType` { eatDay 1.70, fastDay 1.45 }.
- **Training:** new A/B/C/D rotation replacing v1's session set, built to the owner's focus list — A: shoulders all 3 heads + upper/lower chest (chest-press rest-pause + drop-set ladder, strict laterals, Y-T-W + rear-delt fly); B: back + hams + steel lower back (**sliding leg curls replace Nordics** — no equipment for Nordics; pulldown drop-sets; tibialis + forearm block); C: legs + **high-tension "brick" abs** (dragon flag negatives, RKC plank, DB-loaded crunch) + obliques + both calf heads; D: full pump + arms/forearms (reverse curls, wrist work, towel wring) + **neck protocol doubled**. Every session ends with a 10-min conditioning burst. **Steps requirement dropped** to the post-meal walk only (owner constraint; burn partially recovered via the bursts).
- **Governance:** checkpoints (Aug 6 ≤96.8, Aug 10 ≤95.2), contingency gate (Sun Aug 9 >95.6 → second 38h fast / 850 cal / second burst), **pre-agreed 48h OVERTIME extension** (Fri 14 reads 90.1-91.5 → two 700-cal liquid days → Sunday Aug 16 final weigh-in), projected day-by-day morning weights in the WORKOUTS calendar card, energy-numbers cards (BMR 2,030 · existing TDEE ~2,500 · 14-day ledger OUT ~48-51k / IN ~11.5k / net ~37-39.5k ≈ 4.7-5.1kg fat, landing 91.1-92.2 central).
- **Supplements:** creatine explicitly PAUSED until Aug 14 (water weight vs the target); event-mode section removed (event cancelled); caffeine framed as owner's throttle with the STOP cluster retained as law.
- `app.html`: selector labels "(10-DAY" → "(14-DAY DEPLETION)" in both native select + custom dropdown.

### Verification

Re-ran the full plan-conformance suite post-rewrite: `node --check` on all touched files + extracted inline script · PLANS assembles 6 keys · all required fields, 7-day sub-maps complete, macroSplit rows sum to 100, checklist ids unique (incl. new wf1-wf8 fast list), m3/e2 AUTO-id semantics intact · all three content functions executed with stubbed helpers (incl. fast-day path and defaults path) · all 7 day-codes present in workout cards · §12 stale-ref grep clean.

### Files changed

`plans/tempcut.js` (rewritten) · `app.html` (selector labels, APP_VERSION → 8.10.0, APP_VERSION_MSG) · `sw.js` (v44) · `index.html` (full §12 sweep + changelog entry, v8.9.0 demoted) · `CLAUDE.md` (§3 TEMP CUT blurb → v2, version refs) · `README.md` (14-day) · `UPDATE_LOG.md` (this entry). `WORKING_VERSIONS.md` after on-device smoke.

---

## Version 8.9.0 — 2026-07-28

**Scope:** Minor (new selectable plan: TEMP CUT). No schema change, no migration, no storage-shape change.
**Banner:** shown — "New plan: TEMP CUT — a 10-day depletion protocol (Jul 29 → Aug 7 weigh-in). PSMF-style eating with a hard protein floor, daily two-session training at wave intensity, machine work + single-dumbbell + bodyweight, creatine + capped-caffeine preworkout protocol, low-residue finish, weigh-in procedure, and post-cut event-mode maintenance rules. Select it in Settings → Training Plan. Temporary by design — switch away after the block ends."
**CACHE_NAME:** v42 → v43 (new file `plans/tempcut.js` added to the cache list — offline-first rule).

### Versioning note

Originally authored as v8.4.0 against a pre-engine main; renumbered to **v8.9.0** at merge time because main had meanwhile shipped v8.4.0 (rear-delt groups) through v8.8.0 (Workout Engine BETA) from parallel sessions. Deliberately **minor**, not the §12 new-plan major: TEMP CUT is a temporary, owner-personal 10-day protocol designed to be switched away from after Aug 7 — and v9.0.0 remains reserved for the Workout Engine's consolidation release per `docs/workout-engine-v9-roadmap.md`. Note the version-rollover rule: after 8.10.x the next minor becomes 9.0.0.

### What was added

**`plans/tempcut.js` (new, ~318 lines)** — sixth plan, key `tempcut`, owner-designed aggressive mini-cut co-developed in-session against the CLAUDE.md §15 science rules:

- **Structure:** 0 fast days (PSMF days are eating days with a low ceiling — no `fastDaysDow`), 0 light days, `caloriesMode: 'floor'` with `minCalories: 700`, `proteinFloorMultiplier: 1.8` (g/kg — muscle-sparing floor), `macroSplit` base [65% P / 15% C / 20% F] (at the 1,100 MOD ceiling ≈ 179g P / 41g C / 24g F), `activityByDayType { eatDay: 1.95 }` reflecting daily two-session training + 12-15k steps, plan-default `tdee: 4000`.
- **WORKOUTS tab:** date-labelled 10-day calendar (Jul 29 → Aug 6 training, Fri Aug 7 weigh-in) at wave intensity — 3 BIG days (AM depletion circuit + swing/snatch EMOM finishers, PM hypertrophy session), 3 MOD (PM only + DB arms), 2 MED, 1 FLUSH (pre-scale smooth-tempo day, explicitly no new max-eccentric damage). Machine work per owner's equipment: lat pulldown (wide + close-grip with drop-sets, scapular pulldowns), seated chest press (rest-pause + drop-set ladder), leg extension (high-rep only, knee-shear note). Single 10kg dumbbell programming throughout (rows, thrusters, push press, swings, snatches, suitcase carries, arms block). Daily extras card: steps, post-meal walk, stomach vacuums, neck protocol.
- **NUTRITION tab:** macros-by-day-type card (BIG 700 / MOD 1,100 / MED 800-900 with per-type protein targets), live TODAY'S INTAKE bar vs the MOD ceiling, low-residue final-60h protocol, **creatine + preworkout protocol section** (creatine 5g daily / timing-irrelevant / no loading per ISSN 2018 + app rule; caffeine 250-300mg pre-AM = 2.5-3mg/kg ergogenic zone, hard cap 400mg/day, zero after 3PM; what-makes-you-last-2.5h priority list), daily supplement clock, six-layer belly-reduction guidance (subcutaneous / visceral / glycogen / gut content / cortisol water / TVA corset).
- **RULES tab:** six red lines (caffeine cap, no water cutting ever, joint-pain swap rule, palpitations STOP rule carried over from AGRO, sleep auto-downgrade, protein untradeable), weigh-in protocol with expected-landing decomposition, event-mode Aug 7-11 maintenance (pre-accepted +2-3kg glycogen rebound, 35-min hotel room circuit, three food rules), and an explicit "this plan ends Aug 12 — switch away" card.
- **Checklist:** mirrors AGRO's id semantics exactly (m1-m4 / f1-f5 / e1-e3 / s1-s3 / n2) so the AUTO_WORKOUT_IDS auto-derivation system (m3 = morning session, e2 = evening session) works unchanged; creatine added to the s1 morning-supplement subItems; water target 4.0L; `checklistFast` present (shape-required) but only reachable via a manual calendar fast-day toggle.

**Registration (per CLAUDE.md §4, exactly two changes + cache):**
- `plans/index.js` — import + `tempcut` key in `PLANS`.
- `app.html` — native `<option value="tempcut">` + custom-dropdown option (both selector surfaces).
- `sw.js` — `./plans/tempcut.js` added to the critical cache list; `CACHE_NAME` v42 → v43.

**Engine note:** TEMP CUT is not registered in the Workout Engine BETA's `session-templates.js` — the engine toggle simply has no effect on this plan (static `workoutContent()` renders as always). Intentional: the plan is date-driven and expires Aug 12.

### Verification

- `node --check` on `plans/tempcut.js`, `plans/index.js`, `sw.js` + inline-script extraction of `app.html` (re-run post-merge).
- Module-import smoke post-merge: `plans/index.js` — `PLANS` assembles with 6 keys + engine modules intact, `tempcut` present.
- Field-conformance check vs the 5 existing plans: all required fields present; 7-day maps complete; macroSplit rows sum to 100; checklist ids unique; `fastDaysDow.length === fastDaysPerWeek`; m3/e2 AUTO semantics verified.
- Content-function runtime smoke: `workoutContent()` / `nutritionContent(s)` / `rulesContent(s)` executed with stubbed helpers incl. defaults path — no ReferenceErrors.
- Version-sync grep per §12 checklist — no stale v8.8.0 / v42 refs outside historical entries.

### Files changed

`plans/tempcut.js` (new) · `plans/index.js` · `app.html` (selector options ×2, APP_VERSION → 8.9.0, APP_VERSION_MSG) · `sw.js` (cache list + v43) · `index.html` (title, nav chip, hero, CTA note, footer stats, copyright, 9 cache-bust strings, changelog entry + demote) · `CLAUDE.md` (§3 six plans + TEMP CUT blurb, §13 plans list, version refs, line-count anchors) · `README.md` (6 plans, anchors) · `UPDATE_LOG.md` (this entry). `WORKING_VERSIONS.md` follows after on-device smoke.

---

## Version 8.8.0 — 2026-06-07

**Scope:** Minor (Workout Engine BETA — AGRO morning/evening two-card split). No schema change. No data mutation. Engine remains opt-in, default OFF.
**Banner:** shown — AGRO engine now renders a Morning card + an Evening card per training day.
**CACHE_NAME:** v41 → v42. Schema unchanged at v7.

### Why

Owner asked for the engine to mirror the hand-built AGRO plan's structure — a short morning activation session and a separate, heavier evening session — rather than one merged card, and explicitly required the engine to match or exceed the real plan's density, never less.

### What changed

**AGRO bimodal block recipes (`plans/session-templates.js`)**
- Added per-day `slots` to `SESSION_TEMPLATES.agro`, each slot tagged `block:'AM'|'PM'`, composed from reusable block recipes: Morning A (push+pull activation), Morning B (lower+hinge), Evening A (upper balance), Evening B (legs+posterior), Evening C (skill+core+pull), and the fasted run block. Sized to meet/exceed the real plan.

**Engine (`modules/workout-engine.js`)**
- `generateSession` carries each slot's `block` onto the exercise entry (`formatEntry` gains a `block` field); all-round/emphasis fills tag `PM`.

**Renderer (`components/engine-session.js`)**
- A day whose exercises carry `block:'AM'` renders TWO cards (`DAY · Morning` + `DAY · Evening`), each with its own warm-up/cool-down and block labels. All non-AGRO plans (no AM tags) stay single-card.

### Validation
- AGRO renders Morning (6-7 ex) + Evening (14 ex on Mon/Tue/Thu/Fri; lighter run days Wed/Sat) — meeting/exceeding the hand-built plan. Re-ran all 40 plan×goal combos: still full sessions, warm-up+cool-down every day, weekly push:pull ≤ 1:1; only AGRO is bimodal; renderer never throws.

### Files touched
`plans/session-templates.js`, `modules/workout-engine.js`, `components/engine-session.js`, `app.html` (APP_VERSION + banner), `sw.js` (CACHE v42), `index.html` (surfaces + changelog), `CLAUDE.md`, `README.md`, `UPDATE_LOG.md`.

---

## Version 8.7.0 — 2026-06-07

**Scope:** Minor (Workout Engine BETA rebuild). Session-generation rewrite + rich archetype recipes + plan-scaled density. No schema change. No data mutation. Engine remains opt-in, default OFF.
**Banner:** shown — see APP_VERSION_MSG (engine now builds complete 8-15 exercise sessions; goals add emphasis without dropping body parts).
**CACHE_NAME:** v40 → v41. Schema unchanged at v7.

### Why

Owner tried the engine's All-Round goal and got ~3 exercises/day vs the hand-built AGRO's real 13-15 (morning + evening). A five-agent reverse-engineering of all 5 plans confirmed the engine was building only the "compound spine" — no warm-up, no accessory volume, no cool-down, too few mains — and that selecting a goal *filtered* the session down and dropped body parts. Both are now fixed.

### What changed

**Full 7-block session anatomy (`plans/session-templates.js` ARCHETYPE_SLOTS rewrite)**
- Every archetype now declares the complete recipe: WARM-UP → MAIN(compounds) → ACCESSORY → SKILL → CORE → CONDITIONING → COOL-DOWN, sized to the real plans (e.g. resistance-upper ≈ 9 working + warm-up/cool-down; push-pull ≈ 10; chair ≈ 5-6 gentle).
- VOLUME_CAPS `maxExercisesPerSession` now caps WORKING exercises only (warm-up/cool-down exempt) so one rich recipe scales per plan: Lite ~5-6, Cut ~8-10, Bulk ~10, AGRO ~12-15. Accessories trim first; mains/core/skill/warm-up/cool-down never trim.

**Generator rebuild (`modules/workout-engine.js`)**
- New slot resolvers: `warmup`/`cooldown` (by `warmup-`/`cooldown-` id-prefix), `recovery-main` (yoga/pilates/tai-chi/animal-flow), `conditioning`, richer `accessory:<region>` (incl. balance/wrist/pull/calves/hamstrings), `core` (chair_core on Lite), `skill`, and `main:<group>` (a `push×2` slot now yields two different push variants like the real plans).
- The model is INVERTED: build a FULL base session first, then a purely-additive goal pass (`addEmphasis`) layers focus volume on top — a goal can no longer remove a base movement (the structural fix for "dropped body parts").
- `strength` rep-bias bug fixed (it was silently dropped); removed the per-session push:pull trim that ate mains — now enforced WEEKLY (`enforceWeeklyPushPull`), trimming only push accessories, never mains.
- `balanceWeek` (All-Round) retained as a coverage guarantee.

**Renderer (`components/engine-session.js`)**
- Renders block headers (WARM-UP / MAIN / ACCESSORY / SKILL / CORE / COOL-DOWN) so engine output reads like the hand-built plans.

### Validation
- Executed all 40 plan×goal combinations: every training day is full with a warm-up + cool-down, every goal stays ≥ the balanced full session, and weekly push:pull ≤ 1:1 across all of them. AGRO renders ~13-15 exercise days; Lite stays gentle (5-6 working). Render path verified (block-structured HTML, graceful ineligible path).

### Files touched
`plans/session-templates.js`, `modules/workout-engine.js`, `components/engine-session.js`, `app.html` (APP_VERSION + banner), `sw.js` (CACHE v41), `index.html` (surfaces + changelog), `CLAUDE.md`, `README.md`, `UPDATE_LOG.md`, `docs/*`.

---

## Version 8.6.0 — 2026-06-06

**Scope:** Minor (Workout Engine BETA enhancement). New goal preset + a week-level balancing algorithm + plan-aware preset gating + Settings reorder. No schema change. No data mutation. Engine remains opt-in, default OFF.
**Banner:** shown — "Workout Engine (BETA) upgrade: a new ALL-ROUND STRENGTH goal that develops the whole body evenly through functional, compound, calisthenics-progression work — it actively fills under-trained movement patterns across your week while keeping push:pull balanced. Goal options are now tailored per plan (the heavier functional/athletic goals show on Cut/Bulk/AGRO; Lite stays gentle). The WORKOUT ENGINE section also moved to the top of Settings so it is easy to find. Still opt-in and OFF by default — your normal workouts and all your data are unchanged until you turn it on."
**CACHE_NAME:** v39 → v40. Schema unchanged at v7.

### Why

Owner asked for a goal that builds the whole body for functional strength + calisthenics progress (not an aesthetic split), noting the static AGRO plan "lacks overall body development and is more intensive on some things than others." A four-agent-style balance audit confirmed it with numbers: static AGRO ≈ **56 leg / 37 back / 17 chest / 15 shoulder / 0 direct-arm** weekly sets — leg/posterior/pull heavy, starved chest/shoulders/arms (push:pull 0.5, within the ≤1:1 rule).

### What shipped

**New `functional` / "All-Round Strength" goal preset (`modules/engine-focus.js`)**
- Covers all six major regions; `functionalBias` scoring bonus (+2 compound, +2 progression-group) prefers functional calisthenics work.

**Week-level balance algorithm (`modules/workout-engine.js` `balanceWeek`)** — the real fix:
- The first cut of the preset was net-negative (audit caught it): the score bonus was inert on single-pick slots and a region-blind `volumeBias` accessory flooded AGRO with 33 leg sets. Replaced with `balanceWeek`, which fills UNDER-trained movement patterns across the week with the user's-level compound progression exercise (per-day dedup), and tops up PULL when adding push-side work so the **weekly** push:pull ≤ 1:1 rule (CLAUDE.md §15) always holds.
- Result on AGRO: all 6 major patterns trained ≥2 days (shoulder 0→2), push:pull 12:12. Verified by execution across all 5 plans (cut 9:9, bulk 18:20, maintenance 6:6, agro 12:12, lite via balanced 4:4 — all ≤1:1).
- Focus accessories (for aesthetic presets) now dedup across the week, fixing the same-exercise-every-day flood.

**Plan-aware preset gating (`engine-focus.js` `PLAN_PRESETS` / `presetsForPlan` / `isPresetAllowed`)**
- Lite → `balanced` only (catered/gentle). Maintenance → balanced/functional/core. Cut/Bulk/AGRO → full set led by functional. Settings shows only a plan's eligible presets; a stored preset invalid for the current plan is sanitised to balanced (in the UI and in `buildEngineUserState`).

**Settings UX (`app.html`)**
- The WORKOUT ENGINE (BETA) section moved to the TOP of the settings body (was last, after APP UPDATES) so it isn't buried.

### Files touched
`modules/engine-focus.js` (preset + gating + functionalBias), `modules/workout-engine.js` (balanceWeek + accessory dedup + week-level push:pull cap + shared formatEntry), `app.html` (move settings section, plan-aware paint + sanitise, expose presetsForPlan/isPresetAllowed), `sw.js` (CACHE v40), `index.html` (surfaces + changelog), `CLAUDE.md`, `README.md`, `UPDATE_LOG.md`, `docs/*`.

---

## Version 8.5.0 — 2026-06-06

**Scope:** Minor (new opt-in feature — the Workout Engine, shipped as BETA, default OFF). New ES modules + additive SK keys (no migration). app.html wiring behind a feature flag. No schema change. No data mutation.
**Banner:** shown — "NEW (opt-in BETA): a WORKOUT ENGINE that auto-builds your training week from the full 199-exercise database at your current levels — with a muscle-focus / physique-goal picker (V-taper, athletic, upper/lower, core, strength…) and optional safety brakes. Turn it on in Settings → WORKOUT ENGINE (BETA); it is OFF by default, so your normal workouts are completely unchanged until you choose to try it, and you can switch it off anytime. No data changes — your logs, weights, and settings are untouched."
**CACHE_NAME:** v38 → v39. Schema unchanged at v7.

### What shipped — the v9 Workout Engine, as an opt-in BETA

The engine that the v9 roadmap describes is now built and wired, but **OFF by default**. With the toggle off, the WORKOUTS tab renders byte-identically to before (legacy `workoutContent()`). v9.0.0 remains reserved for when/if the engine becomes the default.

**New data layer + logic modules (previously committed dormant; now wired):**
- `plans/exercise-db.js` — 199-exercise machine-readable database (focus-ready muscle/region metadata).
- `plans/session-templates.js` — 5 plans × 7-day skeletons, archetype→slot rules, volume caps.
- `modules/engine-helpers.js` — pure functions: plan eligibility, age/weight/sex/experience/re-entry modulators, injury blocks (always-on), demographic brakes (opt-in), prereq checks, push:pull cap, fast-day modifier, deload + suggest-only progression evaluation.
- `modules/engine-focus.js` — muscle-focus / physique-goal customiser: 7 goal presets + scoring/ranking.
- `modules/workout-engine.js` — `generateWeek()` / `generateSession()` / `explainSession()` orchestrator.
- `components/engine-session.js` — pure HTML renderer for engine output (reuses the app's workout-card styling).

**app.html wiring (all behind the OFF-by-default flag):**
- Non-gating engine loader (dynamic `import()` in try/catch — a load failure can never block startup).
- `renderWorkouts()` branch: `if (engineEnabled && engine loaded) try engine else/catch → legacy`. The WORKOUTS tab can never blank out from the engine.
- `buildEngineUserState()` assembles the engine's input from settings + `SK.exLevels` + completion logs.
- Settings → **WORKOUT ENGINE (BETA)**: enable toggle, goal/focus preset buttons, per-plan safety-brakes toggle.
- 3 additive SK keys (`ph_ec_v1`, `ph_ell_v1`, `ph_pe_v1`) — no migration (default sensibly when absent).

**Safety model:** demographic/volume brakes are opt-in per plan (AGRO OFF by default, others ON, user-toggleable); active-injury contraindications ALWAYS block regardless of the toggle.

### Validation
- All 4 engine modules + the renderer validated by EXECUTION against the real 199-exercise DB: all 5 plans generate valid weeks; muscle focus surfaces targeted regions first; 125kg user blocked → routed to Lite; wrist injury removes hand-loaded moves even with brakes off; deload triggers.
- Every inline `app.html` script block syntax-checked; the exact `renderWorkouts()` call path (`generateWeek`→`renderEngineWeek`) verified to render all 5 plans without throwing.

### Files touched
New: `plans/session-templates.js`, `modules/workout-engine.js`, `modules/engine-helpers.js`, `modules/engine-focus.js`, `components/engine-session.js` (and `plans/exercise-db.js` from prior dormant commits, now cached/wired). Modified: `app.html` (SK keys, settings defaults, engine loader, renderWorkouts branch, settings UI + wiring), `sw.js` (CACHE_NAME v39 + 6 new files cached), `index.html` (all version surfaces + changelog), `CLAUDE.md`, `README.md`, `UPDATE_LOG.md`, `docs/*`.

---

## Version 8.4.0 — 2026-06-06

**Scope:** Minor (workout content + library finalization). New exercises, two new progression groups, AGRO prescription update. No schema change. No data mutation.
**Banner:** shown — "Two new calisthenics skill ladders are now level-pickable: PRESS TO HANDSTAND and BRIDGE / BACKBEND (4 levels each). A dedicated REAR DELTOID / POSTERIOR SHOULDER training group was added to close the front/rear shoulder imbalance — reverse snow angels, prone reverse fly, a bodyweight face pull, and an isometric fly hold. AGRO CUT now trains rear delts 4×/week and folds the two new skills into its evening sessions. The workout library is finalized at 194 documented exercises across 12 progression groups. No data changes — your logs, weights, and settings are untouched."
**CACHE_NAME:** v37 → v38. Schema unchanged at v7.

### Root motivation

Owner is taking AGRO CUT CALISTHENICS to a more aggressive off-books version, with the app as the foundation. Two gaps were identified in the foundation review:

1. **Rear-delt imbalance.** A four-agent audit of `WORKOUTS_LIBRARY.md` found an 11:1 front-to-rear primary-deltoid ratio. Every push/shoulder progression (push-ups, pike push-ups, handstand work) is anterior-deltoid dominant; the only dedicated rear-delt isolation was Prone Y-T-W raises (Pull L2), prescribed by AGRO just once a week (Monday). Front-delt work appeared in 5+ sessions/week.
2. **Skill-track coverage.** The four existing skill ladders (crow, handstand, L-sit, planche) are all anterior-chain holds. Two high-value zero-equipment skills were missing: a dynamic vertical press (press-to-handstand) and a posterior-chain spinal-extension skill (bridge).

### What was added

**Two new calisthenics skill ladders (`plans/exercise-progressions.js` + `WORKOUTS_LIBRARY.md`)**

- `skill_press` — PRESS TO HANDSTAND (4 levels): elevated pike press → wall handstand negative → straddle press negative (wall) → freestanding press to handstand. The only dynamic skill ladder. Gated on core ≥ 4 AND push ≥ 5 AND shoulder ≥ 4.
- `skill_bridge` — BRIDGE / BACKBEND (4 levels): glute bridge hold → short bridge (crown support) → full bridge hold → bridge with single-leg lift. The only posterior-chain / spinal-extension skill. Gated on core ≥ 4 AND hinge ≥ 4 (not push).
- Both fully level-pickable via the existing `exRowWithLevel` selector. Progression groups now total 12 (6 skill tracks); progression levels now total 74.

**Rear-deltoid training group (`WORKOUTS_LIBRARY.md` non-progression)**

- New "Rear Deltoid / Posterior Shoulder" subsection: reverse snow angels, prone reverse fly, prone W pull (bodyweight face pull), prone reverse fly hold (isometric). All zero-equipment, pull-pattern, evidence-cited (Cools 2016 + Prinold 2016).

**AGRO CUT prescription update (`plans/agro.js`)**

- Rear-delt work now runs 4×/week: Mon (Y-T-W raises, existing) + Tue/Fri (reverse snow angels, Evening B) + Thu (prone W pull, Evening C). Balances the 5+ weekly front-delt sessions; push:pull stays pull-dominant.
- Bridge skill added to Tue/Fri Evening B (posterior-chain session). Press-to-handstand skill added to Thu Evening C (skill session). Evening-session description sub-text updated to match.

**Library finalization**

- `WORKOUTS_LIBRARY.md` now documents 194 exercises (74 progression + 120 non-progression). Section 2.3 contraindication matrix extended to cover the two new skill tracks (notably: full bridge blocked for active lower-back injury; press-to-handstand blocked for active wrist/shoulder injury). TOC and Library Status block updated.

### Safety / science

- Rear-delt moves cite Cools 2016 (scapular stabilisers) + Prinold 2016 — both CLAUDE.md §15 Tier 1 (Push:Pull balance).
- New skills cite Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric), Schoenfeld 2015 (tempo/eccentric for the press negative) — all §15 approved.
- Push:pull ratio across AGRO remains ≤ 1:1 (pull-dominant) per the §15 hard rule — the rear-delt additions are pull-pattern and increase pull volume.

### Files touched

`plans/exercise-progressions.js`, `plans/agro.js`, `WORKOUTS_LIBRARY.md`, `app.html` (APP_VERSION + message), `sw.js` (CACHE_NAME v37→v38), `index.html` (all version surfaces + changelog), `CLAUDE.md`, `README.md`, `docs/WORKOUTS_LIBRARY_STATUS.md`, `docs/workout-engine-v9-roadmap.md`, `UPDATE_LOG.md`.

---

## Version 8.3.4 — 2026-05-14

**Scope:** Patch (service-worker user-facing diagnostics + landing-page version audit fixes). No schema change. No data mutation.
**Banner:** shown — "Added a CHECK FOR UPDATES button in Settings → APP UPDATES that forces a service-worker update check on demand and shows your current cache version + service-worker state so you always know what code your device is actually running. Also fixed the landing page (index.html) which was stuck at v7.8.1 in the title, nav, footer, copyright and asset cache-bust strings — all 13 stale references corrected and the changelog updated to cover the six v8.x releases. Startup now logs the running APP_VERSION + schema version to the browser console so debugging 'is the deploy live yet' is unambiguous. No data changes."
**CACHE_NAME:** v36 → v37. Schema unchanged at v7.

### Root motivation

Owner asked (post-v8.3.3): "verify the sw.js system thing works properly for my phone to get regular updates for the app properly." Also requested a full project-state audit covering documentation drift, science references, repo rules, and the landing page.

The SW update mechanism itself was already well-built (SW_UPDATED postMessage on activate after `clients.claim()`, page-side message listener at `app.html:6397-6401`, version-tied dismiss via `SK.swDismissedVer`, 30-minute auto-poll, visibilitychange + pageshow resume listeners forcing `_swReg.update()`). The missing piece was user-facing visibility — no way to manually trigger a check, no way to see what cache the device is on, no way to confirm "did the deploy reach me yet" without the one-shot update banner.

The owner-driven audit also surfaced 13 stale `v7.8.1` references across `index.html` (title, nav, footer, copyright, CSS/JS cache-bust query strings) plus a changelog frozen at v7.8 — six v8.x releases never landed on the landing page. The hero badge was the only landing-page surface kept current.

### What was added

**Service-worker visibility (sw.js + app.html)**

- `sw.js`: new `message` event listener responds to `{ type: 'GET_VERSION' }` over a MessageChannel with `{ type: 'VERSION', cache: CACHE_NAME }`. Stateless RPC, no side effects.
- `app.html`: `querySwCacheVersion()` posts `GET_VERSION` to `navigator.serviceWorker.controller` on a fresh `MessageChannel` and writes the reply into the existing `_swCacheVersion` slot. Runs once on `navigator.serviceWorker.ready` and again whenever the user opens Settings or taps CHECK FOR UPDATES.
- `app.html`: existing `SW_UPDATED` message listener (lines 6397-6401) now also writes `_swCacheVersion = event.data.cache` so the diagnostic stays current after a fresh activation, not just after a manual query.
- `app.html`: new `checkForUpdates()` function exposed on `window`. Calls `_swReg.update()`, waits 1.5s, then inspects `_swReg.installing / .waiting / .active` and shows a context-appropriate `showAlert` — "Update downloading," "Update ready to activate," or "You are on the latest version (cache vN)."
- `app.html`: new `paintUpdatePanel()` function exposed on `window`. Repaints `#updPanelStatus` with APP_VERSION, current SW cache version, and SW registration state. Called from `openSettings()` so the panel is fresh every time.

**Settings → APP UPDATES section (app.html:1172-1182)**

- New `settings-section` below Data Management.
- Status row: `App version: <b>X.Y.Z</b>` / `Service worker cache: <b>protocol-health-vN</b>` / `Service worker state: <b>registered</b>`.
- CHECK FOR UPDATES button (accent yellow, full-width).
- Helper text: explains that a RELOAD banner appears if a new version is found, and that the canonical phone-refresh path is "fully close the PWA (swipe away from app switcher) and reopen."

**Startup diagnostic (app.html, end of inline script)**

- One-line `console.info('[PH] running APP_VERSION X.Y.Z · schema vN — for cache version, open Settings → APP UPDATES or check window._swCacheVersion')` fires synchronously when the inline script runs. Lets DevTools confirm at-a-glance whether the deploy actually reached the device — if the console says v8.3.2 but the latest deploy is v8.3.4, the issue is cache, not code.

### Landing page audit fixes (index.html)

- **Line 12** `<title>`: `v7.8.1` → `v8.3.4`
- **Lines 18-22, 1177-1178** CSS/JS cache-bust query strings: `?v=7.8.1` → `?v=8.3.4` (7 occurrences via replace_all)
- **Line 34** nav `.ver` chip: `v7.8.1` → `v8.3.4`
- **Line 52** hero badge: `v8.3.3` → `v8.3.4` (already current with each release; bumped per version-update rule)
- **Line 561** changelog section title: `The v7 release. Adaptive TDEE...` → `The v8 release. Audit fixes, recovery controls, schedule history.`
- **Line 562** changelog section-desc: rewritten to describe v8.x work
- **Lines 567-571** v7.8 entry: removed `.current` dot class, changed date label from `CURRENT · APR 2026` to plain `APR 2026`
- **Line 865** CTA band note: `v7.8.1 · Installable PWA · Offline ready` → `v8.3.4 · Installable PWA · Offline ready`
- **Line 878** footer stats: `v7.8.1 CURRENT` → `v8.3.4 CURRENT`
- **Line 909** copyright footer: `© 2026 PROTOCOL HEALTH · v7.8.1 · ALL RIGHTS RESERVED` → `v8.3.4`

**New changelog entries inserted at top of `.changelog-wrap`:**
- v8.3.4 (CURRENT · MAY 2026) — Service-worker visibility + landing audit fixes
- v8.3.0 → v8.3.3 — EDIT START DATE recovery control (consolidated)
- v8.2.0 — Past PARTIAL days now flip to FULL when complete
- v8.1.0 — Multi-day fast bleed-out fix
- v8.0.0 — Audit-driven 14 bug fixes

Total of 5 new entries spanning all v8.x releases. v7.8 entry preserved at its historical position.

### Audit findings deferred (not addressed in v8.3.4)

The comprehensive audit also surfaced these — left as-is per scope discipline:

- WORKOUTS_LIBRARY.md is incomplete pending the 175-workouts library project. No disclaimer added to the file top — owner has acknowledged the incompleteness in the v8.0.0 working-versions notes already.
- `docs/` folder has 12 historical phase plans (PHASE_0_RECON, PHASE_N_PLAN ×4, CALIBRATION_PHASE_×4, REFACTOR_COMPLETE, v8.0.0-bug-audit, v8.3.0-schedule-history-edit). Per CLAUDE.md §22 these are intentionally kept as historical reference. No archival pass.
- README.md doesn't pin a version — design choice for stability across releases, intentionally untouched.

### Files changed

- `app.html`: SW message listener stores cache version, `querySwCacheVersion` RPC, `checkForUpdates` + `paintUpdatePanel` window-exposed functions, APP UPDATES section in SETTINGS, `paintUpdatePanel` / `querySwCacheVersion` hooked into `openSettings`, startup console.info. `APP_VERSION` 8.3.3 → 8.3.4. `APP_VERSION_MSG` updated.
- `sw.js`: GET_VERSION message handler. `CACHE_NAME` v36 → v37.
- `index.html`: 13 stale version refs corrected. 5 new changelog entries (v8.0.0 through v8.3.4). Section title + description rewritten for v8 release. v7.8 entry demoted from CURRENT.
- `CLAUDE.md`: version refs.
- `UPDATE_LOG.md`: this entry.

### Diagnostic flow now available

If a future "I don't see my update" report comes in:

1. Owner opens Settings → APP UPDATES.
2. Status row shows `App version: 8.3.4` / `Service worker cache: protocol-health-v37` / `Service worker state: registered`.
3. If `App version` matches the latest deploy but `Service worker cache` is older, the SW is stale and a fully-close-and-reopen cycle is needed.
4. If `App version` doesn't match the latest deploy, the `app.html` itself wasn't refetched — same fix.
5. If `Service worker state` shows "not registered yet," it's a first-load race; refresh once.

CHECK FOR UPDATES forces the network re-check on demand. The startup console line (`[PH] running APP_VERSION X.Y.Z`) gives the same information in DevTools for users who don't have Settings open.

---

## Version 8.3.3 — 2026-05-12

**Scope:** Patch (UX cleanup of the EDIT START DATE sub-modal — no behavioural change). No schema change. No data mutation.
**Banner:** shown — "Cleaned up the EDIT START DATE modal: dropped the wall-of-text warning to a single paragraph, merged the current-schedule readout into one line, put the inputs and inline preview right at the top, and made the SAVE CHANGES button a big always-enabled yellow button immediately under the inputs. No more ghosted / faded button at the bottom of the modal. Validation still happens — if your inputs are wrong, tapping SAVE CHANGES shows a clear alert instead of silently doing nothing. Next patch (v8.3.4) will verify the service-worker update path so your phone always picks up new versions cleanly."
**CACHE_NAME:** v35 → v36. Schema unchanged at v7.

**Root motivation.** Owner reported after v8.3.2: "the confirm button I assure you still does not exist in the edit start date of the adjust schedule feature or the manage schedule feature at all." Two underlying root causes were identified:

1. **The SAVE CHANGES button looked unclickable.** v8.3.0–v8.3.2 had it disabled with `opacity: 0.5` whenever the inputs hadn't changed from the current values. When the modal first opened, the inputs were pre-filled with current values → `changed === false` → button rendered at 50% opacity with `disabled=true`. Visually it looked like a ghosted, inactive label, not a real button. Owner naturally concluded "there is no confirm button."

2. **The button was below a wall of text.** v8.3.0 had a ~7-line ⚠ READ FIRST section + a separate Current Schedule readout + a separate Pending Change section before the inputs were even reached. On a 375px mobile screen this pushed the SAVE CHANGES button to the bottom of a scrolling modal — easy to miss if the user didn't realise they needed to scroll.

### What was changed

**Aggressive layout cleanup of `#editStartDateOverlay`:**

- ⚠ READ FIRST `settings-section` (7 lines of `<br><br>`-separated paragraphs) → single concise paragraph in a `border-left` accent box.
- Current Schedule readout collapsed from 4 lines to 2 lines (one line: date · weight; one line: last day · total).
- Pending Change `settings-section` → inline `<div id="esdPreviewText">` immediately under the inputs, always visible (no `display:none` toggle).
- SAVE CHANGES button moved out of its `settings-section` wrapper → free-standing full-width button immediately under the inline preview. Big Bebas Neue 1.15rem text, 4px letter-spacing, 16px padding. Black text on yellow `var(--accent)` background. Cannot be missed.
- Footer caption under the button: "Tapping shows a final confirmation prompt before any write."

**Always-enabled SAVE button:**

- Dropped `btn.disabled = !canSave` and `btn.style.opacity = canSave ? '1' : '0.5'` from `updateEditStartDatePreview`. Button is always 100% opacity, always clickable.
- All validation (date format, ≤ current startDate, ≤ today, ≥ 2020-01-01, weight in (0, 500], not a no-op) still runs inside `applyEditStartDate` when the button is tapped. If validation fails, the user gets a clear single-arg `showAlert` explaining exactly what's wrong — actionable, not silent.
- The inline `#esdPreviewText` now shows validation issues as red warnings as the user types (`⚠ ${newDate} is AFTER current start ${sched.startDate}...`) so the user sees the problem before tapping.

**Compact `updateEditStartDatePreview` logic:**

- Branch order: empty inputs → field-incomplete prompts → forward / future / pre-2020 / no-change warnings → full diff. Each branch returns immediately. Simpler to reason about than the previous nested-if version.
- Diff format unchanged: `Start date: X → Y`, `Start weight: X → Y`, `Schedule length: X → Y days`.

### What did NOT change

- `applyEditStartDate` behaviour: still calls `showConfirm` with the same diff message before running `backupData` + atomic schedule write. Confirm gate is preserved.
- All write semantics: `schedule.startDate` / `startWeight` / `days` / `totalDays` / `exactDays` updated atomically, `settings.startDate` mirrored, `SCHEDULE_ADJUSTED` dispatched.
- Validation rules unchanged.
- No new SK key. No new module. No schema migration.

### Files changed

- `app.html`: `#editStartDateOverlay` HTML restructured for compactness; `updateEditStartDatePreview` rewritten without `disabled`/opacity gating; `openEditStartDate` adjusted to a 2-line current readout. `APP_VERSION` 8.3.2 → 8.3.3. `APP_VERSION_MSG` updated.
- `sw.js`: `CACHE_NAME` v35 → v36.
- `index.html`: hero badge v8.3.2 → v8.3.3.
- `CLAUDE.md`: version refs.
- `UPDATE_LOG.md`: this entry.

### Next: v8.3.4

Will audit the service-worker update propagation path. Currently `sw.js` sends a `SW_UPDATED` postMessage to clients after `clients.claim()` on the activate event, but the page-side listener for that message + reload-banner wiring needs verification. Owner has reported "I don't see updates on my phone reliably" — v8.3.4 will add diagnostics + a manual CHECK FOR UPDATES button in Settings so the SW state is never opaque again.

---

## Version 8.3.2 — 2026-05-12

**Scope:** Patch (small UX enhancement — surfaces APP_VERSION in the app UI). No schema change. No data mutation.
**Banner:** shown — "Added a visible version badge: a muted 'PROTOCOL HEALTH · vX.Y.Z · TAP FOR DETAILS' strip now appears at the bottom of every tab, and a matching version chip is in the SETTINGS header next to the close button. Tapping either one opens an alert with the current version number and the full update message for the version you are running — useful for confirming the service worker has actually picked up the latest code after a deploy. No data changes."
**CACHE_NAME:** v34 → v35. Schema unchanged at v7.

**Root motivation.** Owner reported after v8.3.1 ship: "There's no version badge anywhere in the app UI at all. Update that feature too." Until now the only way to know what version was actually running on-device was the one-shot update banner (dismissed after first view) or the desktop devtools. After dismissing the banner there was no way to verify whether a deploy had actually taken effect — particularly when debugging service-worker cache issues like the v8.3.0 → v8.3.1 EDIT START DATE fix where the owner couldn't tell whether they were running the patched code.

### What was added

- **Persistent footer strip** at the bottom of every tab (TODAY / MONTHS / WORKOUTS / NUTRITION / TRACK / RULES). Rendered as a sibling of the `.section` elements so the active-tab CSS swap doesn't hide it. Style: small DM Mono caps, muted color, top-border separator, tappable. Text: `PROTOCOL HEALTH · v<APP_VERSION> · TAP FOR DETAILS`.
- **Version chip in the SETTINGS header**, next to the close (×) button. Style: small DM Mono caps in a bordered box. Tappable.
- **`showVersionInfo()` handler** — both surfaces call it. Opens the existing `showAlert` dialog with `'Protocol Health v' + APP_VERSION + '\n\n' + APP_VERSION_MSG`. Single-arg call, displays correctly.
- **`paintVersionChips()` paint function** — finds every `[data-app-version-chip]` span on init and writes `APP_VERSION` into it. Run from `runInit()` right after `checkVersionUpdate()` so the chip text is correct the moment the user can see it. Means future version bumps only need to touch the `APP_VERSION` constant — the chips re-paint automatically.

### Files changed

- `app.html`: footer div after the last `.section`; chip in the SETTINGS header; `paintVersionChips` + `showVersionInfo` functions; `paintVersionChips()` call added to `runInit()`. `APP_VERSION` 8.3.1 → 8.3.2. `APP_VERSION_MSG` updated.
- `sw.js`: `CACHE_NAME` v34 → v35.
- `index.html`: hero badge v8.3.1 → v8.3.2.
- `CLAUDE.md`: version refs.
- `UPDATE_LOG.md`: this entry.

### Diagnostic value

If owner ever reports "I don't see the change you said you shipped," the version chip is the canonical answer: tap it, read what it says, and if the number is older than what was just pushed the issue is service-worker cache. The fix in that case is to fully close + reopen the PWA (swipe away from app switcher, then tap icon) — never a code issue.

---

## Version 8.3.1 — 2026-05-12

**Scope:** Patch (UX clarity + two real bugs in v8.3.0's EDIT START DATE flow). No schema change. No data shape change.
**Banner:** shown — "Fixed EDIT START DATE so it actually saves: the APPLY flow now shows a live preview of the pending change as you type, a clear final confirmation prompt before applying, and a SAVE CHANGES button that is disabled until your inputs are valid. v8.3.0 had two bugs that made the apply look like it did nothing — alerts were dropping their messages, and there was no obvious final confirm step. Both fixed."
**CACHE_NAME:** v33 → v34. Schema unchanged at v7.

**Root motivation.** Owner reported after testing v8.3.0: "Is there no confirm button to actually make the edit actually take action? Cuz when I changed it it went back to 4rth May instead of 23rd March." The schedule wasn't actually updating from their perspective. Two underlying defects:

### Bug 1 — `showAlert()` is single-argument; v8.3.0 was calling it as `(title, message)`

`showAlert(msg)` in `app.html` takes ONE argument and writes it into `#alertMsg`. There is no `#alertTitle`. v8.3.0's `applyEditStartDate` made 10+ calls like `showAlert('INVALID DATE', 'Pick a valid start date.')` — the helpful messages were dropped and only the all-caps titles ("INVALID DATE", "START DATE UPDATED", "NO CHANGE", "BACKUP FAILED", etc.) rendered. Users saw cryptic two-word alerts with no detail, which made every code path look broken even when it worked.

**Fix:** every `showAlert` call in `applyEditStartDate` rewritten to a single descriptive sentence. Where extra context (the exact "from → to" diff) was useful, that's now folded into the new `showConfirm` step or the live preview panel — not into an alert.

### Bug 2 — no explicit final confirmation step; APPLY ran straight to backup + write

v8.3.0's flow was: pick date → tap APPLY → backup downloads → schedule writes → success alert. On mobile (Android Chrome PWA), if the native date picker hadn't committed the value or if validation hit (because of the value not committing), the user got a one-word alert and no idea what happened. Owner experienced the schedule "going back to 5/4" — most likely the picked date never committed, or the user tapped the backdrop expecting auto-save.

**Fix:** the SAVE path is now a clear three-stage flow.

1. **Live preview panel** (`#esdPreviewSection`) appears as soon as both inputs have valid values. Renders the diff: `Start date: 2026-05-04 → 2026-03-23`, `Start weight: 95.15kg → 105kg`, `Schedule length: 17 → 51 days`. Updates on every keystroke / picker change (both `oninput` and `onchange` handlers). Shows red warnings when the picked date is forward / future / before 2020. Hidden when no change vs current.
2. **SAVE CHANGES button** (`#esdSaveBtn`) — renamed from "APPLY (downloads backup first)" to a clear active-voice label. Styled with `var(--accent)` background to stand out. Disabled (opacity 0.5, click no-op) until the live preview confirms the change is valid + meaningful. Below the button: caption "You'll get a final confirmation prompt + your data is auto-backed up before any write."
3. **`showConfirm` final gate** — tapping SAVE CHANGES no longer applies immediately. Instead it pops the existing custom confirm dialog (which z-indexes above the sub-modal at 9000) with the same diff text in the body and a "YES, SAVE" yellow button. Only after the user confirms does the canonical `await backupData()` + atomic `ss(SK.schedule, ...)` write run. Cancel preserves the inputs so the user can review again.

### Other small improvements

- Date input now has both `oninput` and `onchange` handlers so values commit on Android native date pickers regardless of whether the user taps "Done" or types directly. The live preview reacts to either signal.
- Weight input has `oninput="updateEditStartDatePreview()"` so the diff panel updates as the user types.
- `openEditStartDate()` calls `updateEditStartDatePreview()` at the end so the preview is pre-populated (shows "No change vs current values" initially).
- Error path inside the showConfirm callback: if `backupData` throws, alert is now `'Auto-backup failed. Aborting to keep your data safe. Try a manual backup from the TRACK tab first, then retry.'` — actionable, single-arg.

### What did NOT change

- Underlying data write semantics: still extends `schedule.days[]` backward to span new start → existing last day, updates `startDate` / `startWeight` / `totalDays` / `exactDays` atomically, mirrors `startDate` into `settings`, fires `SCHEDULE_ADJUSTED`. No new SK key. No schema migration. No new module. No changes to fast/light/dayLogs/weights/foodLog/activityHistory.
- v8.2.0 auto-derivation fix and v8.1.0 multi-day fast fix remain in place.
- All other modal-edit flows (ADJUST, END TODAY, REMOVE) untouched.

### Files changed

- `app.html`: `#esdPreviewSection` HTML added; SAVE CHANGES button + caption replaced the old APPLY button; `onEditStartDateChange` + new `updateEditStartDatePreview` function; `applyEditStartDate` rewritten to use `showConfirm` for the final gate and single-arg `showAlert` for all alerts. `APP_VERSION` 8.3.0 → 8.3.1. `APP_VERSION_MSG` updated.
- `sw.js`: `CACHE_NAME` v33 → v34.
- `index.html`: hero badge v8.3.0 → v8.3.1.
- `CLAUDE.md`: version refs.
- `UPDATE_LOG.md`: this entry.

---

## Version 8.3.0 — 2026-05-12

**Scope:** Minor (new user-facing recovery feature; no schema change, no data mutation outside `SK.schedule` + `getSettings().startDate`).
**Banner:** shown — "Added: a new EDIT START DATE button inside MANAGE SCHEDULE that lets you correct your schedule's original start date and start weight. Useful if your start date was reset by a previous bug, or if you want to backdate the schedule to when your journey actually began. The schedule extends backward to the new date — your target date, ADJUST math, fast/light day records, weight logs, day logs, food log, and notes are all left untouched. A full backup is downloaded before any change is applied."
**CACHE_NAME:** v32 → v33. No schema migration (still v7).

**Root motivation.** Owner inspected the 2026-05-12 backup and noted that their schedule's `startDate` is `2026-05-04` even though they started the protocol on `2026-03-23`. The 5/4 value is a side-effect of ADJUST/REMOVE-then-CREATE roundtrips during the calibration phases — past schedule.days[] entries were lost when the schedule was re-created from the goal calculator with a "today" start. Downstream effect: the MONTHS calendar overlay (white border = `schedule.days[]` membership) only covers 5/4 → 5/20, the TODAY duration strip shows "DAY 9 / 17" instead of "DAY 51 / 59," and the radar / export anchor at 5/4 instead of 3/23. Owner asked for a generic UI control to correct the original start date — explicitly not a one-off data fix.

### What was added

**New button — EDIT START DATE** inside the MANAGE SCHEDULE modal, between ADJUST and END SCHEDULE TODAY. Styled muted-cyan (`#6aa`) to distinguish it from the existing actions (orange for ADJUST, accent2 orange for END TODAY, red for REMOVE). Helper text: *"Backdates the schedule's original start date. Use only if your start date was lost or changed by a previous bug, or you want to backdate your tracking. This will NOT re-estimate your target date or rerun adjustment math. A full backup is downloaded before any change."*

Clicking it opens a new sub-modal (`#editStartDateOverlay`) with:

- A prominent ⚠ READ FIRST section explaining exactly what the operation does and does NOT do.
- A Current Schedule readout (current startDate, startWeight, last day in schedule, totalDays).
- New start date input (date picker capped at the current startDate via `max` attribute, so forward-dating is impossible through the UI).
- New start weight input (auto-filled from the weight log on the selected date if an exact match exists; otherwise falls back to the nearest log entry by absolute date difference, with a helper note explaining the source). Editable.
- APPLY button labelled "APPLY (downloads backup first)".

### Apply behaviour

1. Validates inputs: `YYYY-MM-DD` shape; `newStart <= sched.startDate`; `newStart <= todayStr()`; `newStart >= 2020-01-01`; weight in `(0, 500]` kg; not a no-op.
2. Calls `await backupData()` — the existing canonical full-backup flow (writes JSON with `sha256` checksum, updates `SK.backupTs` and `SK.backupHistory`). If the backup throws, the apply path aborts BEFORE any write — owner is shown a "BACKUP FAILED" alert and the schedule is unchanged.
3. Re-reads `gs(SK.schedule)` after the async backup in case another tab modified or removed it.
4. Builds a new `days[]` array from `newStart` through `sched.days[sched.days.length-1]` inclusive (one entry per calendar day, generated via `strToDate` / `dateToStr` loop to stay timezone-safe).
5. Writes `schedule.startDate`, `schedule.startWeight`, `schedule.days`, `schedule.totalDays`, `schedule.exactDays` atomically via a single `ss(SK.schedule, fresh)`.
6. Mirrors `startDate` into `getSettings().startDate` via `saveSettings(s)` so anything reading from settings stays consistent (matches the original `applySchedule` behaviour at line 5106).
7. Dispatches `SCHEDULE_ADJUSTED` — existing event, already refreshes `durationBar`, `calendarHighlights`, `projection`, `manageSchedBtn`, `goalBar`.
8. Closes both modals, re-renders the calendar, shows a success alert with the new range and a reminder that the backup was downloaded.

### What is deliberately NOT touched

- `SK.fastDays` / `SK.lightDays` — past fast/light day records stay exactly as the user recorded them. No `autoSetPlanFastDays` / `autoSetPlanLightDays` calls on the backfilled range. Avoids duplicate entries or overwriting user choices.
- `SK.dayLogs` / `SK.weights` / `SK.foodLog` / `SK.activityHistory` — zero changes.
- `calcAdjust()` is NOT called. No target-date re-estimation, no rate recalculation.
- `schedule.endDate`, `schedule.planName`, `schedule.scheduleMode`, `schedule.complianceRate`, `schedule.lastAdjustMode` — unchanged.
- Schema version stays at v7. No migration entry. No new `SK` key.

### Downstream consumer behaviour (verified during planning, see `docs/v8.3.0-schedule-history-edit.md`)

| Consumer | Reads | Behaviour after edit |
|---|---|---|
| `modules/calendar.js:31` (`renderCalendar`) | `schedule.days[]` | White border now appears on every date from new startDate through the original last day |
| `app.html:3198-3213` (`updateDurationBar`) | `startDate`, `totalDays`, `planName` | "DAY X / TOTAL" reflects elapsed days from new startDate |
| `app.html:5181-5220` (`openManageSchedule`) | All fields | Status text reflects new range |
| `app.html:5230-5361` (`calcAdjust`) | `startDate`, `startWeight` | Math anchors at new startDate + new startWeight — consistent kg-per-week calculation |
| `modules/radar.js:29` (`renderRadar`) | `startDate` | Behavioral scoring window anchors at new startDate, covering the full journey |
| `modules/export.js:25,28` (`openExport`) | `startDate` | Default export range starts at new startDate |
| `modules/export.js:67,74` (`generateExport`) | `days[]` | Scheduled-vs-unscheduled section split uses the extended `days[]` |
| `modules/calendar.js:182-185` (`openDayEditor`) | `days[]`, `totalDays`, `planName` | Day-modal "Day X of N" badge reflects extended range |
| `modules/calibration.js` | (does not read schedule) | No change — calibration uses `SK.weights` + `SK.activityHistory` independently |
| TDEE display (Settings) | (does not read schedule) | No change |

### Files changed

- `app.html`: new manage-modal section (button + helper); new `#editStartDateOverlay` sub-modal HTML; new `findWeightOnDate`, `openEditStartDate`, `closeEditStartDate`, `onEditStartDateChange`, `applyEditStartDate` functions; new backdrop-click handler for the sub-modal; `APP_VERSION` 8.2.0 → 8.3.0; `APP_VERSION_MSG` updated. ~225 lines added.
- `sw.js`: `CACHE_NAME` v32 → v33.
- `index.html`: hero badge v8.2.0 → v8.3.0.
- `CLAUDE.md`: version references updated; line-count target unchanged (app.html now ~6,312 / target 6,500).
- `docs/v8.3.0-schedule-history-edit.md`: pre-execution plan committed before implementation (per CLAUDE.md §25).
- `UPDATE_LOG.md`: this entry.
- `WORKING_VERSIONS.md`: entry to be added after on-device smoke.

### Data safety

- Full canonical backup auto-downloads BEFORE the write. If the backup fails for any reason, the apply path aborts with no changes. Owner can RESTORE from this backup file at any time to undo the edit.
- Atomic write — every schedule field updates in a single `ss(SK.schedule, ...)` call. No partial intermediate states.
- Two-tab race handled: re-reads `SK.schedule` after the async backup; if null, aborts.
- Forward-dating is impossible: UI date picker capped via `max=sched.startDate`, plus a hard server-side validation that rejects any apply attempt where `newStart > sched.startDate`.

---

## Version 8.2.0 — 2026-05-12

**Scope:** Minor (auto-derivation completeness fix for past days; no schema change).
**Banner:** shown — "Fixed: past days where you logged workouts retroactively (via the WORKOUTS tab or day modal on a later day) now correctly show as DONE / green on the calendar instead of PARTIAL / orange. The auto-derived checklist items (m2/m3 morning + e1/e2/e3 evening + the _workout aggregate + water item) for any historical day are now normalised on every app load — not just the day they were originally created. Same fix runs live when you tick an exercise in a past-day modal: the matching checklist items flip green immediately. Your raw data is unchanged — only the missing 'item-done' markers are filled in from the workout session counts and water totals you already recorded."
**CACHE_NAME:** v31 → v32. No schema migration (still v7).

**Root motivation.** Owner inspected the 2026-05-12 backup and asked two questions:

1. **Why do the last 9 days have a white border around the calendar cell while older days don't, given that all days from 3/23 → today are part of their tracking?** Owner expected a uniform appearance.
2. **Several past days show PARTIAL (orange) even though "everything is ticked off."** Owner asked to dig through the backup and find both the affected days and the cause.

Question 1 was **not a bug** — schedule overlay working as designed. The owner's schedule (`SK.schedule.days[]`) covers 2026-05-04 → 2026-05-20 (17 dates). The `.plan-day` CSS class (white border) is applied only to dates in `SK.schedule.days[]`. The "9 visible past days" are 5/4 → 5/12, all in the schedule. The 8 future schedule days (5/13 → 5/20) also have the border. Days before 5/4 are logged + tracked but not part of the active schedule planning overlay, so no border. **Action: explanation only, no code change.** (CLAUDE.md §8 already documents schedule overlay semantics.)

Question 2 was **a confirmed bug**. Specific affected day in the backup: **2026-05-01** (Friday, eating day). dayLog showed: 28/28 workouts done across all sessions (morning 8/8, evening 14/14, daily 6/6); all 28 exercise rows ticked in `workoutChecks`; every checklist item the user ever touched green. Calendar still rendered PARTIAL. Root cause: `getValidCheckCompletion` for an AGRO eating-day-Friday checklist produces 19 items total (15 leaves + 4 s1 sub-items). The user's `checks{}` for 5/1 had 13 keys ticked, but was missing `m2, m3, e1, e2, e3` (the AUTO_WORKOUT items derived from workout sessions) and `f4` (the water-target item). Those keys were missing because the user logged the workouts retroactively via the WORKOUTS tab / day modal on a different day, so the per-session AUTO items never made it into `checks` for 5/1. The calendar classifier counted them as un-done → 13/19 = 68% → PARTIAL.

`migrateOrphanedChecks` (app.html, runs on every init) ALREADY had logic to derive AUTO_WORKOUT items + `_workout` + water-target items from session/water values — BUT each block was gated by an `if (!(itemId in checks)) return;` guard (or `(item.id in checks)` for water). The guard ONLY updated stale values (true→false or vice versa) but NEVER inserted missing keys. Past days whose `checks{}` map never had m2/m3/e1/e2/e3 in the first place stayed forever-missing → forever-PARTIAL.

### Fix 1 — `migrateOrphanedChecks` now inserts AUTO_WORKOUT + `_workout` + water items idempotently

**File:** `app.html` (the `migrateOrphanedChecks` body, ~lines 2982–3060).

- For each AUTO_WORKOUT_ID (`m2`, `m3`, `e1`, `e2`, `e3`): gate is now `validIds.has(itemId)` (the rendered checklist for THIS date contains the item). When the matching `workoutSessions[sess].total > 0`, derive `checks[itemId] = (sess.done / sess.total) >= 0.8` regardless of whether the key already exists. Fast-day checklists don't render these items, so `validIds.has` is false there and they're correctly skipped.
- For `_workout` (pseudo-item used by `getValidCheckCompletion` only when the rendered checklist has NO AUTO_WORKOUT items — i.e. fast / light days): gate is now `!AUTO_WORKOUT_IDS.some(id => validIds.has(id)) && log.workoutTodayTotal > 0`. Derive from global `(workoutTodayDone / workoutTodayTotal) >= 0.8`. Inserts if missing.
- For water-type items (`f4` in AGRO eating, `wf4` in AGRO fast): removed the `(item.id in checks)` guard so any water-type item rendered for this date gets its value derived from `log.water >= item.waterTarget`. Inserts if missing.

Net effect: the next app init after v8.2.0 loads sweeps the full dayLog history once and fills in every missing auto-item across every historical date in one normalization pass. No separate migration needed — `migrateOrphanedChecks` already runs every init.

### Fix 2 — `toggleModalWorkoutEx` writes per-session AUTO_WORKOUT items live

**File:** `modules/calendar.js` (`toggleModalWorkoutEx`, lines ~498–555).

In v8.0.0 (M7 fix) this function was extended to set `_workout` on the dayLog when the user retroactively toggles an exercise via the day modal. That handled fast/light days correctly but NOT eating days — the per-session AUTO_WORKOUT items (m2/m3 = morning, e1/e2/e3 = evening) were never updated, so a user toggling exercises on a past eating day would not see the calendar flip green until next app init.

Extension: after the `workoutSessions` recompute, the function now also iterates `WORKOUT_ITEM_SESSION` and sets `newChecks[itemId] = (sess.done / sess.total) >= 0.8` for each AUTO item whose matching session exists. `_workout` is still set globally. Same 0.8 threshold as `refreshAutoItems` / `migrateOrphanedChecks`. Idempotent and matches existing TODAY-tab behaviour.

### What the owner will see after v8.2.0 loads

1. Update banner appears (minor version bump).
2. App init runs `migrateOrphanedChecks` once. All historical dayLogs are normalized in a single sweep. Calendar cells for past days where workouts + water were genuinely completed now render GREEN / FULL instead of PARTIAL / ORANGE.
3. Days that legitimately remain PARTIAL (e.g. 5/4 with 0/27 workouts done) still show PARTIAL — only days where the missing keys were the cause flip.
4. Future retroactive toggles: ticking an exercise on a past day's modal flips the matching checklist items + the calendar cell color immediately, without waiting for next init.

### Data safety

- No storage keys renamed. No schema bump.
- `migrateOrphanedChecks` only writes keys for items that the date's rendered checklist actually contains. Won't pollute fast-day logs with eating-day items or vice versa.
- The auto-derivation is purely additive — it only inserts a missing key or flips a stale true/false. The user's raw `workoutSessions` counts, water totals, and exercise tick state (`workoutChecks{}`) are untouched.
- Hand-traced against the owner's backup: 5/1 will flip from 13/19 (68%, PARTIAL) to 19/19 (100%, FULL) on first load (water = 3 ≥ 3 target, all sessions 100%). Past days where workouts were genuinely under-done stay PARTIAL.

### Files changed

| File | Change |
|------|--------|
| `app.html` | `migrateOrphanedChecks` AUTO_WORKOUT block: `(itemId in checks)` guard → `validIds.has(itemId)` gate. `_workout` block: insert when no AUTO_WORKOUT in checklist + global > 0. Water block: drop the `(item.id in checks)` guard. APP_VERSION 8.1.0 → 8.2.0, APP_VERSION_MSG updated. |
| `modules/calendar.js` | `toggleModalWorkoutEx`: write per-session AUTO_WORKOUT items + `_workout` live after session recompute. |
| `sw.js` | CACHE_NAME v31 → v32. |
| `index.html` | Hero badge v8.1.0 → v8.2.0. |
| `CLAUDE.md` | Version refs updated (sw.js cache name, APP_VERSION, line-count snapshot, line-count governance table). |

### Non-goals

- No change to `getValidCheckCompletion` itself. The classifier remains source-of-truth for counting; the fix happens upstream by ensuring the stored `checks{}` map contains the keys the classifier needs.
- No change to `refreshAutoItems` (TODAY-only). It already worked correctly for today.
- No new schema migration. v7 stays.
- No CLAUDE.md §8 change — schedule semantics already documented.

---

## Version 8.1.0 — 2026-05-12

**Scope:** Minor (multi-day fast bleed-out display bug + reconcile-vs-manual-unset race; schema migration v6 → v7)
**Banner:** shown — "Fixed: ending a multi-day fast no longer forces the next day into fast protocol. The 'bleed-in' evening before and the 'bleed-out' morning after a long fast were being auto-marked as fast days even though only a few hours of fasting touched them. Now a date is only auto-marked when the session covers ≥ 16 hours of that calendar day — the actual fast day. Bookend dates revert to their declared protocol (eating, light, or whatever the plan says). Active fasts still keep today in fast protocol until you end. Stale auto-marks from earlier versions are cleaned on first load (auto-backup happens first). Manual day-modal unsets are now strictly respected — session syncs no longer silently re-add a date you explicitly toggled off."
**CACHE_NAME:** v30 → v31.

**Root motivation.** Owner reported: ended a Sun-9-PM → Tue-9:45-AM multi-day fast this morning (2026-05-12). The session spanned 3 calendar dates (5/10, 5/11, 5/12) and only 5/11 was the intended fast day. But the app showed Tuesday 5/12 as a fast day on every surface (calendar coloring, TODAY checklist, day-modal protocol). When the owner toggled Tuesday off via the day modal, the toggle worked initially — but on next app open, Tuesday came back as fast. The backup snapshot showed `fastDays["2026-05-12"]: true` AND `fastDayUnsets["2026-05-12"]: true` simultaneously, which should be impossible from a normal user-flow.

**Two bugs identified by tracing the backup data + code:**

### Bug 1 — Session-to-fastDay sync uses an over-broad rule (the headline bug)

`components/fast-window.js:_syncFastDaysFromSession` added EVERY date in `session.dates[]` to `SK.fastDays`, regardless of how many hours the session actually covered on that date. This was added in v7.10.2 to fix a sibling bug (5/5 and 5/8 showing as eating-day cells when they were partial-fast bookends of a multi-day fast). The v7.10.2 fix went too far — it conflated "session touched this date" with "this date is a fast PROTOCOL day", treating bleed-in (3h on the eve) and bleed-out (9h next morning) dates as full fast days.

**Architectural clarification:** there are two distinct concepts the code was conflating:

| Concept | Storage | Meaning |
|---|---|---|
| **Fast protocol day** | `SK.fastDays` | A calendar date the user DESIGNATED as a fast day (via day-modal toggle OR plan auto-set). Drives checklist, calendar cell color, day-modal protocol, calibration intake exclusion. |
| **Fast session** | `SK.fastSessions` | The temporal record of when the user was actually fasting. `dates[]` = every calendar date the session touched (for UI badges + hour attribution). |

A session can bleed into dates that are NOT fast protocol days. That's how humans normally fast — start the evening before, end the morning after. Only the "middle" date(s) of a multi-day fast should auto-mark as protocol days. The bookends are eating days with fast-time bleed.

**Fix:** introduced a 16-hour threshold rule. A session contributes a date to `SK.fastDays` only when its activity on that calendar date's local 24h window is ≥ 16 hours. New helper `_sessionHoursOnDate(session, dateStr)` computes the per-date contribution. Applied to both `_syncFastDaysFromSession` (session-mutation entry points) and `reconcileFastDaysFromSessions` (init-time bulk reconcile). 16 hours is the threshold because:
- Full-day fasts of a multi-day session land at 24h → marked ✓
- Bleed dates typically land at 3–12h → not marked ✓
- True single-day all-day fasts (e.g. 6 AM → 11 PM = 17h) land at 17h → marked ✓
- Wake-to-wake 24h patterns (9 AM Mon → 9 AM Tue) split as 15h + 9h → neither qualifies; user must mark the intended day manually via the day modal. Correct fallback because the system can't infer which date the user calls "the fast day" for that pattern.
- Intermittent 16:8 patterns → not marked ✓

### Bug 2 — Session syncs ignored manual unsets (the contradiction-in-data root cause)

`_syncFastDaysFromSession` and `reconcileFastDaysFromSessions` didn't consult `SK.fastDayUnsets`. In v8.0.0 (H3 fix), `autoSetPlanFastDays` and `autoSetPlanLightDays` were updated to respect `fastDayUnsets` so schedule extension wouldn't clobber user toggles. **The session-sync path was missed.** When the owner manually unset 5/12 via the day modal, the toggle worked once — but the next time anything called `_syncFastDaysFromSession` or the init-time `reconcileFastDaysFromSessions`, 5/12 was added back from the covering session, creating the contradictory state observed in the backup.

**Fix:** both functions now check `fdu[d]` and skip dates the user has explicitly unset. The user's most recent explicit intent (the unset) is always preserved. (If the user later re-toggles a date ON, `toggleFastDay` already clears it from `fdu`, so re-marking is properly enabled.)

### Bug 3 — TODAY tab dropped active fasts on user without `SK.fastDays` entry

If the user spontaneously started a fast at noon without first toggling today as a fast day, `isFastDay(today)` returned false (no `SK.fastDays` entry yet) even though there's an active session. Today displayed eating-day protocol while the user was actually fasting.

**Fix:** `isFastDay` in `app.html` now consults `getActiveSession()` for today. If an active session exists, today is fast regardless of `SK.fastDays`. Past and future dates use the stored map only (no dynamic behavior). This pairs cleanly with Bug 1's fix — past bleed dates correctly fall out of fast protocol (no session is active anymore), while a still-running fast keeps today in fast protocol until ended.

### Migration v6 → v7 (one-time cleanup)

New migration cleans up the historical over-marks accumulated from v7.10.2 through v8.0.0. `requiresBackup: true` — auto-downloads a snapshot before running. Walks `SK.fastDays` and removes any date that satisfies the new rules. Algorithm:

1. **If the date is in `SK.fastDayUnsets`**: remove from `SK.fastDays` (user said off; the contradictory entry was a sync bug).
2. **Else if the date matches the active plan's `fastDaysDow` pattern**: preserve (plan auto-set, authoritative).
3. **Else if no session covers the date**: preserve (pure manual intent; we have no record of it being auto-added).
4. **Else if any covering session has ≥ 16h on this date**: preserve (legitimate full-day fast contribution).
5. **Otherwise**: remove (bleed over-mark from v7.10.2 reconcile).

Owner's backup simulation: removes 5/12 (unset-preserved), 5/8 (4h bleed-only on a Friday non-plan-day), 5/1 (12.5h bleed-only on a Friday non-plan-day). Preserves all 28 other dates including 5/11 (24h full-day session) and every plan-scheduled Sun/Wed/Sat.

Migration has `verify()` (re-checks the invariant) and `reverse()` (re-applies the old over-broad sync, for rollback).

**Files touched:**

- `components/fast-window.js` — added `_sessionHoursOnDate`, `_FAST_DAY_SESSION_HOURS_MIN = 16`, threshold + `fastDayUnsets` respect in both `_syncFastDaysFromSession` and `reconcileFastDaysFromSessions`.
- `migrations/registry.js` — new migration v6 → v7 with cleanup, verify, reverse.
- `app.html` — `isFastDay` consults `getActiveSession()` for today. APP_VERSION + APP_VERSION_MSG bumped.
- `sw.js` — CACHE_NAME v30 → v31.
- `index.html` — hero badge → v8.1.0.
- `CLAUDE.md` — schema version note updated.

**Behaviour after upgrade for the owner's data:**

1. App loads, auto-backup downloads (migration `requiresBackup: true`).
2. Migration v6→v7 fires once. Console logs: `[migration v6→v7] removed 3 bleed over-marks: 2026-05-12 [unset-preserved], 2026-05-08 [bleed-9.5h], 2026-05-01 [bleed-12.5h]`.
3. MONTHS tab: 5/12 cell now shows EATING-day color. 5/11 stays purple (correct full-day fast). 5/10 stays purple (AGRO Sun auto-set). 5/8 and 5/1 also revert to eating-day color (those were also bleed bookends from the earlier sessions).
4. Open 5/12 day modal: shows eating-day checklist. The fast session record (`fs_..._rbgjam`) is still in `SK.fastSessions` for hour-attribution; if needed, the day modal can still show "session activity here" as a secondary badge (deferred to Phase 2).
5. TODAY tab (currently 5/12): eating-day checklist visible. User can log food, projection / cal strip behave as eating day.
6. If user starts a NEW fast right now: TODAY immediately flips to fast protocol via the active-session check. End fast → reverts to eating.
7. Manual day-modal unset of any future date will now stay unset — no more silent re-add on next app load.

**Audit findings deferred:**

The earlier audit's open items (L1 ss() return signal, L2 historical fast-day plan attribution, L6 workoutChecks orphan by design, M6 idbSyncAll race) remain deferred. A Phase 2 architectural cleanup (separating session-hour attribution from protocol-day classification in calibration / radar) is a future task — v8.1.0 fully resolves the user-visible display + cross-rule data contradiction without requiring it.

---

## Version 8.0.0 — 2026-05-09

**Scope:** Major (14 confirmed bug fixes from a 6-agent aggressive codebase audit; schema migration v5 → v6).
**Banner:** shown — "Major: 14 confirmed bug fixes from a 6-agent codebase audit. Plan switches no longer carry stale check state with new meanings (n2 was 'Sleep 7-9hrs' in 4 plans but 'Monthly body comp check' in BULK — old ticks would have lied about new compliance). Markdown export now escapes user-typed food names and notes. Settings TDEE field stays in sync with background calibration so it can't be clobbered. Schedule extension preserves manually-unset fast/light days. Activity multiplier resets cleanly on plan switch. Backup restore type-checks every value. Day-modal exercise checks now auto-derive _workout for past days. Schema v5 → v6 (additive, no data transform)."
**CACHE_NAME:** v29 → v30.
**Version rollover:** v7.10.x → v8.0.0 per CLAUDE.md S12 (v7.10 was the last allowed minor; next minor rolls to v8.0.0).

**Audit context.** Owner requested an aggressive top-down + bottom-up bug scan before adding 175 workouts. Six parallel Explore agents returned ~140 raw findings. Strict triage (each critical/high traced by reading the actual file:line, math walked by hand, agent claims cross-checked against code) reduced the list to 21 confirmed bugs across critical / high / medium / low severities. Past agent runs averaged ~30% accuracy; this audit's accept-rate matched that baseline. The full triaged report lives in `docs/v8.0.0-bug-audit.md` (consolidated from the in-flight plan file).

**Critical fixes.**

- **C1 — Cross-plan checklist ID semantic conflicts.** Same checklist IDs meant different things across plans. Most damaging: `n2` was "Sleep 7-9 hrs" in 4 plans but "Monthly body comp check" in BULK. `f1` had 5 different definitions. Old check state survived `migrateOrphanedChecks` (because the ID matched in both plans) and silently rendered as the new plan's label, corrupting compliance %, calendar coloring, and calibration's exclusion logic. Fix: added `_cleanupCrossPlanCheckIds(oldPlanKey, newPlanKey)` in `app.html`. `confirmPlan` captures the old plan key before overwriting, then runs the cleanup AFTER `saveSettings(s)` to clear all `dayLog.checks[id]` entries whose label differs between old plan and new plan (or whose ID is absent from the new plan). Same-label IDs (e.g., `m1` "Wake water" across LITE/AGRO/CUT) are preserved. Workout-related keys (wex*, _workout) are preserved. Console-logs cleanup count for transparency.
- **C2 — Markdown export pipeline XSS.** Food names (line 393), profile name (line 469), plan subtitle (line 485), and day notes (line 591) flowed into the markdown string without escaping. `renderMarkdownPreview` then assigned the result via `box.innerHTML` (line 610) and embedded into the downloaded HTML file (line 703). A food name containing `<script>` or `<img onerror=...>` would execute on next EXPORT — exploitable through tampered backups or hand-edited storage. Fix: added a self-contained `_esc(s)` helper at the top of `modules/export.js` that converts `&<>"` to entities. Applied to all 4 user-controlled string interpolation sites.
- **C3 — Settings TDEE field stale after auto-recompute.** `TDEE_CHANGED` dispatch refreshed projection/goalBar/radar/etc. but NOT the Settings panel's TDEE input. Sequence: open Settings → background calibration runs → user taps CONFIRM PLAN → confirmPlan reads stale `settingTdee.value` → writes back, clobbering the calibrated TDEE. Silent data loss. Fix: added `'settingsTdeeField'` target to `DISPATCH_MAP.TDEE_CHANGED` in `app.html`, with a switch case that updates the input value (when the panel is open AND the field isn't focused) plus the formula display. Also fixed M2 in the same pass.

**High fixes.**

- **H1 — `applyInferredActivityLevel` persists `s.activityByDayType` across plan switches.** Inferred override from AGRO survived a switch to LITE, producing 19%+ wrong TDEE. Fix: `confirmPlan` now nulls `s.activityByDayType` whenever the plan key changes. User can re-run inference if desired.
- **H2 — Exercise level selector wrote to TODAY when viewing past day modal.** `setExerciseLevel` hardcoded `today = todayStr()`. Verified that the day modal currently strips level badges (so the bug isn't reachable today), but the underlying API was unsafe. Fix: `setExerciseLevel(groupId, level, dateStr)` now accepts an optional dateStr (defaults to today). `openLevelSelector(instanceKey, groupId, dateStr)` threads the date through into the row's onclick handler. Defensive — protects against future regressions when level badges are added to the day modal.
- **H3 — `autoSetPlanFastDays` / `autoSetPlanLightDays` re-marked user-unset days on schedule extension.** New SK keys `fastDayUnsets` (`ph_fdu_v1`) and `lightDayUnsets` (`ph_ldu_v1`) now record explicit user unsets. `toggleFastDay` / `toggleLightDay` populate them when a user removes a fast/light marker; clear them when a user re-marks. `autoSetPlanFastDays` / `autoSetPlanLightDays` consult these on schedule extension and skip dates the user already opted out of. New schema migration **v5 → v6** registers the keys (additive, no data transform).
- **H4 — `setCurrentWeight` had three different validation bounds.** HTML min=50/max=250, confirmPlan accepted >0, setCurrentWeight clamped 20-300. Fix: unified to **40 ≤ kg ≤ 250** across all three sites.
- **H5 — Backup restore lacked type validation.** A tampered backup with `weights: "string"` would silently restore and crash downstream renderers. Fix: added `_SK_EXPECTED_TYPE` map listing the runtime type for each SK key. `_commitBackupRestore` now type-checks every value and rejects mismatches into a `rejectedKeys` list, surfaced in the success message with an amber color.

**Medium fixes.**

- **M1** — `onLinkedOffsetInput` now clamps `targetOffset` to per-mode bounds (cut: 100-3000, bulk: 100-1000, maintenance: ±300) before storage.
- **M2** — `commitTdeeManual` now also fires on `oninput` (debounced 300ms via `commitTdeeManualDebounced`), so typing a TDEE and closing the panel via X / tap-outside no longer loses the change.
- **M3** — `calcDuration`'s macro viability check now uses `plan.proteinFloorMultiplier` instead of hardcoded `1.3`. Eliminates false "PROTEIN FLOOR IMPOSSIBLE" warnings on plans with lower multipliers.
- **M4** — `calcAdjust` now shows a hint ("Enter target weight and calorie ceiling to see the adjusted projection") when only one of the two required fields is filled, instead of silently hiding the result section.
- **M5** — `applyInferredActivityLevel` now calls `syncCustomSelect` so the visible custom-dropdown's selected class stays in sync with the new value.
- **M7** — `toggleModalWorkoutEx` now auto-derives `_workout` for the affected past date (≥80% completion → true) so calendar coloring + `getValidCheckCompletion` reflect new exercise completion without waiting for next app init's `migrateOrphanedChecks`. Likely root-cause fix for the May 6 "PARTIAL despite 100%" symptom reported in v7.10.x.

**Low fixes.**

- **L3** — Removed dead `SK.checklist` key. Old backups containing `ph_ck_v1` now restore as a "skipped key" notice instead of silently writing dead data.
- **L4** — Migration init failure message now explains the specific failure mode (download blocked / verify failed / verify threw / run threw / write failed / version mismatch) instead of a generic "Data migration failed". Helps the user understand whether to allow downloads, free up storage, or contact support.
- **L5** — `WORKOUT_CHECKED` dispatch now also targets `calendarCell` so today's calendar coloring updates immediately when the user ticks an exercise on TODAY.

**Files touched:**
- `app.html` — `_cleanupCrossPlanCheckIds` (new), confirmPlan H1+C1 hooks, DISPATCH_MAP TDEE_CHANGED + WORKOUT_CHECKED targets, `settingsTdeeField` switch case, `setExerciseLevel`/`openLevelSelector` dateStr threading, `autoSetPlanFastDays`/`autoSetPlanLightDays` unset-respect, `setCurrentWeight` + confirmPlan currentKg/targetKg bounds, `_SK_EXPECTED_TYPE` + `_commitBackupRestore` type-check, `onLinkedOffsetInput` clamp, `commitTdeeManualDebounced` (new) + oninput hookup, `calcDuration` protein floor multiplier, `calcAdjust` partial-input hint, `applyInferredActivityLevel` syncCustomSelect, runInit migration error message, SK.fastDayUnsets / lightDayUnsets entries, SK.checklist removed, APP_VERSION + APP_VERSION_MSG.
- `modules/calendar.js` — `toggleFastDay`/`toggleLightDay` write fastDayUnsets/lightDayUnsets, `toggleModalWorkoutEx` auto-derives `_workout` for the affected date.
- `modules/export.js` — `_esc` helper + 4 user-controlled interpolation sites.
- `migrations/registry.js` — new migration v5 → v6 (additive, registers `ph_fdu_v1` + `ph_ldu_v1`).
- `sw.js` — CACHE_NAME → v30.
- `index.html` — hero badge → v8.0.0.
- `CLAUDE.md` — version refs.

**Audit findings deferred (documented, not fixed in v8.0.0):**

- **L1** — `ss()` no success/fail signal (codebase-wide refactor).
- **L2** — `getValidCheckCompletion` uses current plan's checklist for historical fast/light days marked under previous plan (needs per-day plan history; large schema change).
- **L6** — Workout checks orphan across plan switches (intentional — preserves history when user returns to original plan).
- **M6** — `idbSyncAll` 2-second deferred timer can race with rapid early writes (low risk; `ss()` mirrors per-write).

**Smoke verification plan against the owner's most recent backup (5/8/2026):**

1. Open MONTHS tab → 5/6 cell should now render full purple (M7 fix derives _workout from completion %).
2. Switch from AGRO → LITE → AGRO. Verify checklist items render correctly each time. Console should log "[plan-switch] cleared N stale check id(s)" if any conflicting IDs were present.
3. Open Settings → log a weight in another tab → return to Settings → TDEE field should show the new value (C3).
4. Type a TDEE in Settings → close via X without blur → reopen → field should retain the typed value (M2).
5. Apply activity inference on AGRO → switch to LITE → weighted activity should drop to LITE's 1.30 (H1).
6. On a schedule, manually unset Sunday's auto-fast → extend the schedule → Sunday stays unset (H3).
7. Type `<script>` in a food name → open EXPORT → preview shows literal text, no script execution (C2).
8. Edit `localStorage.ph_wt_v1 = "garbage"` via DevTools → restore a backup → restore message lists `weights` in the rejected-keys note (H5).

---

## Version 7.10.3 — 2026-05-08

**Scope:** Patch (1 bug fix — break-fast prompt firing on past-day food entries)
**Banner:** silent (patch-level, per Section 12 versioning rule)
**CACHE_NAME:** unchanged on feature branch (v29 still); will bump once at merge to main per Section 11.

**Bug — break-fast prompt fires when adding food to a past day during today's fast.**

Symptom (reported by owner): on a fasting day, adding food to a previous day (e.g. backfilling a missed meal from 3 days ago) triggers the "Break this fast?" prompt. User clicks BREAK FAST (or feels forced to), then has to navigate to TODAY, open the fast editor, uncheck the broken-fast flag, and clear the end-fast time to restore the active fast. Round-trip data corruption from a single retroactive food entry.

Root cause: `addFoodEntry` in `app.html:2078-2095` calls `getActiveFastWindow(dateStr)`, but per the function definition in `components/fast-window.js:221` the `dateStr` argument is **ignored** — the function returns the global active session regardless. Any food add anywhere triggers the prompt against today's fast. Past-date and future-date food entries can't physically have broken a fast that started at a different time, so the prompt is logically wrong for those cases.

Fix: gated the prompt on `dateStr === todayStr()` at `app.html:2088`. Past-date and future-date food entries now silently skip the break-fast check. Only food added with a `dateStr` of today is evaluated against the active fast window. The check uses `todayStr()` (local-time helper, not `toISOString().slice(0,10)`) so timezones are handled correctly.

Why this is correct:
- A food entry's `dateStr` is the date the user ATE the food. If they ate it yesterday but are logging it today, `dateStr` = yesterday. That food can't have broken a fast that started today.
- Editing existing food entries goes through the same `addFoodEntry` path (edit = remove + add), so the same fix covers both add and edit flows.
- `removeFoodEntry` does not fire the prompt (correct — removing food can't break a fast).
- If a user genuinely needs to break a fast retroactively on a past date, the day modal's fast editor remains the explicit path. The prompt is just for the common case of "logging food right now while fasting".

**Files touched:**
- `app.html` — single conditional addition + APP_VERSION + APP_VERSION_MSG.
- `index.html` — hero badge → v7.10.3.
- `CLAUDE.md` — version references updated.
- `UPDATE_LOG.md` — this entry.

**Behaviour after upgrade:**
- Backfill a 3-day-old meal while currently fasting → no prompt, food saved silently for that past date.
- Add food to today while fasting → prompt fires as before, allowing user to break or continue the fast.
- Add food to a future date → no prompt (food entries on future dates are unusual but handled the same way).
- Existing broken/edited fast sessions in the user's data are unaffected — this fix only changes when the prompt is shown going forward.

---

## Version 7.10.2 — 2026-05-08

**Scope:** Patch (3 bugs surfaced from a fresh real-data backup; pre-175-workouts hardening)
**Banner:** silent (patch-level, per Section 12 versioning rule)
**CACHE_NAME:** unchanged on feature branch (v29 still); will bump once at merge to main per Section 11.

**Root motivation.** Owner reported 3 issues in v7.10.1 against a fresh 5/8/2026 backup spanning 46 days of weight + food + checklist logs across an AGRO cycle that included a multi-day water fast (Tue 4 PM → Fri 7 AM IST):
1. Wed 5/6 (a fast day, all 14 fast checklist items + workouts marked complete) shows as PARTIAL on the calendar.
2. The multi-day fast session has the wrong "feel" — `fastSessions[].dates` lists 4 dates (5/5, 5/6, 5/7, 5/8) but `SK.fastDays` only has 5/6 + 5/7 marked. 5/5 + 5/8 render as eating-day cells despite the user fasting both ends.
3. Reality Check stuck on "Gathering data — needs 1 more days of weight logs" despite 46 days of history.

A 3-agent Explore audit traced each symptom to the codebase. Two confirmed bugs are fixed in this release; the third (reported as #1 above) cannot be reproduced from the backup math but is likely resolved by the bug 2 fix's reconciliation pass.

**Bug 1 — Multi-day fast session not synced to `SK.fastDays`.**
- `SK.fastSessions` and `SK.fastDays` are parallel storage layers expected to agree. Sessions live in `components/fast-window.js`; `fastDays` is the legacy date→true map that 6 surfaces read (calendar coloring, calibration intake math, radar fasting axis, today fast banner, day modal, export).
- All 4 session-mutation entry points (`startFastSession`, `endFastSession`, `markSessionBroken`, `editSession`) computed `session.dates[]` correctly but never wrote those dates into `SK.fastDays`. After a multi-day fast, only the auto-set Wed (AGRO `fastDaysDow=[0,3,6]`) was flagged; the bookend Tue and Fri dates of the fast were missing. Calendar showed those dates as eating days; calibration deficit math under-counted by 2 days; radar fasting-axis adherence was wrong.
- Fix in `components/fast-window.js`:
  - Added private helper `_syncFastDaysFromSession(session)` that OR's `session.dates[]` into `SK.fastDays`. Additive only (never deletes — the user may have manually marked a date as fast that no session covers; removing on edit would clobber that intent).
  - Called from all 4 mutation entry points immediately before `dispatch('FAST_WINDOW_CHANGED')`.
  - Added new exported `reconcileFastDaysFromSessions()` that walks every existing session and OR's its dates into fastDays. Idempotent. Called once from `runInit` (in `app.html`, after `migrateOrphanedChecks` and before `updateFastUI`) so existing legacy data auto-reconciles on first v7.10.2 load. The owner's 5/5 and 5/8 will appear as fast days on next load without any user action.
- Promoted via `window.reconcileFastDaysFromSessions = FastWindow.reconcileFastDaysFromSessions` in the components module loader.

**Bug 2 — Reality Check span gate too strict (1 day off from real-world logging patterns).**
- v7.10.0 fixed the original off-by-one (gate was `>= 14` but `spanDays` maxes at 13 in a 14-day window). v7.10.0 changed the gate to `>= 13`. But reaching 13 still requires a weight today AND 14 days ago. Any "missed today" log left users stuck in GATHERING despite 13 of 14 days logged.
- Owner's data on 5/8: latest weight = 5/7, oldest in 14-day window = 4/25, spanDays = 12. Gate `>= 13` fails by 1. Note shows "needs 1 more day" — technically correct against the gate, profoundly misleading given the user has 46 days of history.
- Fix in `modules/calibration.js`: relaxed the gate from `>= 13` to `>= 12` in 3 lockstep locations:
  - File-top doc block (state machine description).
  - `getCalibrationStatus` line 336 — the actual state gate.
  - `_buildCadenceNote` line 770 — the displayed shortfall ("needs N more days").
- Why this is safe: `computeObservedTDEE` itself already enforces `spanDays >= 7` and `daysLogged >= 7` as the floor for valid observation. Relaxing the CALIBRATED display gate from 13 to 12 does NOT change apply behaviour — `weeklyCalibration` still requires (a) state CALIBRATED, (b) 7+ days since last apply (cadence), (c) gap > 7%, AND (d) observed within `[BMR, formula × 1.5]` sanity bounds. The 12-vs-13 change affects display only.

**Bug 3 — May 6 PARTIAL despite 100% completion.**
- The owner's data shows: 14/14 fast checks ticked, _workout=true, 21/21 workout exercises done. Walking the calendar's classifier (`modules/calendar.js:90-96`) by hand against `getValidCheckCompletion('2026-05-06')`:
  - 5 leaf wf items (wf1, wf4, wf5, wf6, wf7) + 4 sf1 subs (sf1_a, sf1_b which has `days:[3]` and 5/6 IS day 3, sf1_c, sf1_d) + 2 wf2 subs (wf2_a, wf3) + 1 sf2 leaf = 12 + `_workout` (added because no AUTO_WORKOUT_IDS in checklistFast) = 13 total.
  - All 13 are true in user's checks. done = 13. pct = 100. Calendar branch resolves to `cal-fast` (purple full).
- Walking the code, May 6 SHOULD render as a full fast day. Cannot reproduce PARTIAL from the data alone.
- Probable explanations: stale calendar render before all checks were ticked (closeModal triggers re-render but mid-modal ticks don't), CSS theme misperception, or service-worker cache showing pre-7.10.1 logic. Bug 1's reconcile pass + the fastDays sync may incidentally clear up related rendering inconsistencies.
- **No direct fix in v7.10.2.** If the symptom persists post-deploy, follow up with live diagnostic capture: `getValidCheckCompletion('2026-05-06')` and `isFastBroken('2026-05-06')` from the browser console.

**Files touched:**
- `components/fast-window.js` — added `_syncFastDaysFromSession` + 4 call sites + exported `reconcileFastDaysFromSessions`.
- `app.html` — wired `reconcileFastDaysFromSessions` into runInit; promoted to window via components module loader; APP_VERSION + APP_VERSION_MSG.
- `modules/calibration.js` — relaxed CALIBRATED gate from `>= 13` to `>= 12` in 3 locations (doc block, getCalibrationStatus, _buildCadenceNote).
- `index.html` — hero badge → v7.10.2.
- `CLAUDE.md` — version references updated.

**Behaviour after upgrade for the owner's data:**
- Fast session `fs_legacy_20260506` → reconcile pass fires once on first v7.10.2 load → SK.fastDays gains 5/5 and 5/8. Console logs `[init] reconciled 2 fast-day(s) from sessions`.
- Calendar 5/5 + 5/8 cells render as fast days (purple) instead of eating days.
- Reality Check: with 14-day window 4/25 → 5/8 still showing spanDays=12, the new `>= 12` gate passes → state = CALIBRATED → cadence note flips from "needs 1 more day" to "Last run: within ±7%, no change. Next check in 2 days." (next-run gate is 5/10 = 7 days after 5/3 last calibration). No silent TDEE change.
- May 6 calendar cell: should render full purple based on the data; if still partial, capture diagnostics.

**Audit issues left for future work (deferred, documented):**
- `autoSetPlanFastDays` re-marks user-unset dates on schedule extension (needs different storage shape to distinguish "absent because never set" from "absent because user unset").
- `getValidCheckCompletion` uses current plan's checklist for historical fast/light days marked under a previous plan (needs per-day-log plan history).
- `ss()` returns no success/fail signal under quota pressure (codebase-wide refactor).

---

## Version 7.10.1 — 2026-05-02

**Scope:** Patch (2 bugs surfaced by a high-strictness 6-agent codebase audit)
**Banner:** silent (patch-level, per Section 12 versioning rule)
**CACHE_NAME:** unchanged on feature branch (v29 still); will bump once at merge to main per Section 11.

**Audit context.** A 6-agent professional audit covering math correctness, date/time, dispatcher + storage integrity, plan/schedule logic, UI fail modes, and service-worker/init order returned ~80 findings across all severities. After verification, the vast majority were false positives or design-by-spec behaviour (e.g., the math agent's "dimensional analysis" claims were wrong by inspection — `Math.ceil(totalCalChange / (kgPerWeek * 7700 / 7))` correctly produces days). Two real bugs survived verification.

**Bug 1 — `migrations/runner.js` schema record date-keys used UTC.**
- `establishedAt` (line 43) and `exportedAt` on auto-backups (line 77) were built from `new Date().toISOString().slice(0, 10)`, which returns the UTC date.
- A user west of UTC running migrations during their local evening would get tomorrow's UTC date stored in their schema record. Cosmetic for `establishedAt`, but `exportedAt` is the user-facing date on every auto-backup filename and metadata.
- CLAUDE.md Section 5 forbids `toISOString()` for date keys — the rule existed precisely for this case; the migration runner was the one place still violating it.
- Fix: added a self-contained `_localDateStr(d)` helper at the top of `migrations/runner.js` that builds `YYYY-MM-DD` from local-time `getFullYear/getMonth/getDate`. Replaced both `toISOString().slice(0, 10)` call sites with `_localDateStr()`. Self-contained so it doesn't depend on the inline classic script's `dateToStr` having loaded first (the migration runner module evaluates before runInit calls into it).
- File: `migrations/runner.js`.

**Bug 2 — `saveDayLog` in the day modal didn't sync `currentKg` or recompute TDEE.**
- `logWeight` and `logWeightFromToday` (the TODAY tab + TRACK tab inputs) both call `syncCurrentKgFromLatestWeight()` and `recomputeAndApplyTDEE()` after writing the weight log. `saveDayLog` (the day modal SAVE button, also a weight-write path) skipped both.
- Symptom: user opens the day modal on today, types a fresh weight, taps SAVE — `SK.weights` is updated, the weight history list re-renders, but `settings.currentKg` keeps the old weight and `settings.tdee` keeps the old TDEE. Goal calculator and projection use stale weight until next app load.
- Fix: added the same two helper calls (typeof-guarded for module-load order safety) in the same position as `logWeight`. The helpers are no-ops when the saved weight isn't the latest, so editing past dates remains safe.
- File: `modules/calendar.js`.

**Findings discounted as false positives or design-by-spec:**
- Math agent's "dimensional analysis errors" in `calcAdjust` — verified by hand: `Math.ceil(totalCalChange / (safeKgPerWeek * 7700 / 7))` correctly produces days; agent's proposed "fix" would have produced 210,000 days for a 4-week goal.
- "Mutable date in for-loop" in 4 files — none of the loop variables are aliased after the loop; the pattern is style-only.
- `fast-window.js` "UTC time parsing" — `new Date("YYYY-MM-DDTHH:mm")` is parsed as LOCAL time per ECMAScript spec; round-trip through `toISOString()` preserves the same instant.
- `export.js:65` Math.round vs Math.floor — verified across DST scenarios; round produces correct day counts (47-hour spans round to 2, +1 = 3 days correctly), Math.floor would actually be wrong.
- "FULL_DAYS undefined race in visibilitychange" — `const` is hoisted; the listener body executes when the event fires, by which time the entire script has parsed.
- "Day modal allows future weight logging" — the `if(isFuture)` branch in `openDayModal` only renders schedule-info; weight/water/notes/checklist fields are gated to the `else` branch.
- `_wexCounter` reset — both call sites (`renderWorkouts` at app.html:3312 and the day-modal workout panel at calendar.js:435,481) correctly call `_resetExRowInstances()` before AND after rendering.
- `restoreData` "bypasses migrations" — verified false: `_commitBackupRestore` writes `SK.schemaVersion` from the backup, so a backup with older schema causes runMigrations to replay on next load.
- `FOOD_LOGGED` radar conditional — by-design: TRACK-tab-only render is intentional; switchTab calls `renderRadar()` when entering TRACK.
- Patch bumps don't show banner — by-design per CLAUDE.md Section 12.
- `CACHE_NAME` on patch deploys — by-design per CLAUDE.md Section 11; deploys to main always bump.

**Audit issues left for future work (documented, not fixed):**
- `getValidCheckCompletion` uses current plan's `checklistFast` for historical fast days marked under a previous plan. Real but minor — fixing properly requires storing per-day-log plan history (larger refactor).
- `autoSetPlanFastDays/LightDays` re-marks dates the user manually unset on schedule extension. Distinguishing "absent because never set" from "absent because user unset" needs a different storage shape.
- `ss()` returns no success/fail signal; multi-write user actions can partially succeed under quota pressure. Needs a return-value refactor across the codebase.
- Various UX polish (modal tap-outside warns on unsaved, dropdown sync flicker, button tap-target sizes).

**Files touched:**
- `migrations/runner.js` — added `_localDateStr` helper, replaced two `toISOString().slice(0,10)` call sites.
- `modules/calendar.js` — `saveDayLog` weight-write path now mirrors `logWeight`'s helper-call sequence.
- `index.html` — hero badge → v7.10.1.
- `app.html` — APP_VERSION + APP_VERSION_MSG.
- `CLAUDE.md` — version references updated.

---

## Version 7.10.0 — 2026-05-02

**Scope:** Minor (calibration + TDEE consistency fixes — 5 user-visible bugs)
**Banner:** shown — "TDEE & calibration fixes. The 'GATHERING DATA' status was caused by an off-by-one bug — Reality Check can now actually become CALIBRATED. Stored TDEE now resyncs to the formula on every app load (it was drifting until you next logged a weight). AGRO's activity multiplier dropdown now shows the honest weekly average (1.55× — 4 eat days × 1.70 + 3 fast days × 1.35), instead of misleadingly showing 1.725×. Stale calibration snapshots that violate physiological bounds now auto-clear, and TDEE auto-revert no longer silently locks the calibration cadence."
**CACHE_NAME:** v28 → v29.

**Root motivation.** Owner reported five linked symptoms in v7.9.0 on real data (40+ days of weight + food + checklist logs):
1. Reality Check stuck on "GATHERING DATA — needs 1 more day of weight logs" despite a full month of data.
2. Stored TDEE = 3,363 cal/day = BMR × 1.725 (legacy single multiplier), even though the AGRO plan's day-type model gives 1.55× weighted (= 3,022 cal). The new model wasn't being applied to the stored value.
3. `lastCalibrationObserved: 291` cal — physiologically impossible (below BMR), left over as orphan data, never cleared.
4. `lastCalibrationOutcome: 'never-run'` while `lastCalibrationAt` was set to today — internal-state inconsistency that locked the calibration cadence.
5. Activity dropdown still showing "1.725 — Very active 6-7×/week" (the legacy single value), even though the formula uses 1.55× weighted.

All five trace back to model-vs-storage drift introduced in v7.9.0's day-type model rollout. v7.10.0 closes the loop.

**Bug 1 — Calibration off-by-one (highest impact).**
- `getCalibrationStatus` gated CALIBRATED on `obs.daysAvailable >= 14`. But `daysAvailable = spanDays = (newest weight − oldest weight in window) / 86400000`, capped at `days − 1` for a 14-day window. Maximum reachable value: 13. The gate was unreachable for any user.
- Fix: gate on `>= 13`, matching the 14-day window's actual maximum span.
- `_buildCadenceNote` had the same off-by-one in the "needs N more days" message — fixed in lockstep.
- File: `modules/calibration.js`.

**Bug 2 — Stored TDEE never resynced to current formula model.**
- `recomputeAndApplyTDEE()` only fired on weight log. Users who upgraded to v7.9.0 (new day-type model) without immediately logging a new weight kept their old TDEE indefinitely.
- For the owner: `s.tdee = 3,363` (= BMR × 1.725, legacy) vs. the new day-type formula's `3,022` (= BMR × 1.55, weighted).
- Fix: added `recomputeAndApplyTDEE()` to `runInit` BEFORE the calibration steps. Every load now reconciles `s.tdee` with `_computeFormulaTDEE`, unless the user has manually frozen TDEE (override toggle still respected).
- File: `app.html`.

**Bug 3 — `autoRevertImplausibleTdee` silently locked the cadence.**
- After reverting an out-of-bounds stored TDEE, the function set `lastCalibrationAt = NOW`, which blocked `weeklyCalibration` from running for 7 days.
- It also did NOT update `lastCalibrationOutcome`, so Reality Check kept showing the stale outcome (often 'never-run').
- Fix: now sets `lastCalibrationAt = null` (cadence unblocked), `lastCalibrationOutcome = 'reverted'`, and snapshots the formula value for transparency. Added matching cadence-note case ("TDEE was auto-corrected to formula. Calibration will retry on next app load.").
- File: `modules/calibration.js`.

**Bug 4 — `clearStaleCalibrationData` too lenient.**
- Required `lastCalibrationAt` to be > 21 days old before clearing physiologically-impossible stored values. A value below BMR is never going to "recover" — keeping it just confuses the user.
- Also did not detect the orphan-state pattern: `outcome='never-run'` BUT `lastCalibrationObserved` populated (the symptom on the owner's data).
- Fix: removed the 21-day grace period for out-of-bounds values. Added an explicit orphan-cleanup branch: when `outcome='never-run'` AND any calibration snapshot fields are populated, wipe them all (including `lastCalibrationAt`) so the next cycle evaluates fresh.
- File: `modules/calibration.js`.

**Bug 5 — Activity multiplier dropdown defaulted to the wrong value.**
- `PLAN_ACTIVITY_DEFAULTS.agro = '1.725'` in app.html. But the AGRO formula uses `(4 eat × 1.70 + 3 fast × 1.35) / 7 = 1.55`. The dropdown showed "Very active 1.725" while the formula silently used 1.55 — a 10% misrepresentation.
- Fix: realigned every plan's dropdown default to its weekly-weighted average. AGRO is the only meaningful change (1.725 → 1.55); the others were already aligned within the dropdown's resolution.
- The TDEE auto-note in the Settings panel now spells out the breakdown for any plan with `activityByDayType`: e.g. "AGRO uses per-day-type activity: 4 eat × 1.70 + 3 fast × 1.35 = weekly avg 1.55×. Dropdown is informational; the formula uses the weighted average."
- File: `app.html`.

**Files touched:**
- `modules/calibration.js` — off-by-one fix, autoRevert outcome tracking, stale-data cleanup tightening.
- `app.html` — TDEE resync at init, PLAN_ACTIVITY_DEFAULTS realignment, TDEE auto-note rewrite.
- `index.html` — hero badge → v7.10.0.
- `sw.js` — CACHE_NAME → v29.
- `CLAUDE.md` — version references updated.

**Behaviour after upgrade for the owner's data (illustrative).**
- `s.tdee`: 3,363 → recomputed at load → 3,022 (BMR × 1.55, day-type weighted).
- `lastCalibrationObserved` 291 (orphan) → cleared.
- `lastCalibrationFormula` 3,453 (orphan) → cleared.
- `lastCalibrationAt` orphan → cleared, weeklyCalibration runs fresh.
- weeklyCalibration evaluates: state = CALIBRATED (off-by-one fix), observedTDEE = 1,328, fails sanity check (below BMR 1,950), records `outcome='rejected-out-of-bounds'`. `s.tdee` stays at 3,022 (formula). Reality Check honestly reports the rejection so the owner can investigate the underlying data (post-fast weight depletion in the window).

---

## Version 7.9.0 — 2026-05-02

**Scope:** Minor (TDEE estimation accuracy upgrade — Phases A-E from the second roadmap, all bundled)
**Banner:** shown — "Major TDEE accuracy upgrade. Plans now use per-day-type activity multipliers (eat-day vs fast-day) instead of one number applied to every day. Adaptive thermogenesis factor models the natural metabolic slowdown after weeks of cutting. Reality Check shows the full breakdown so you can see exactly where your TDEE comes from. Three calibration bugs fixed at the same time. Auto-corrects stale data on first load."
**CACHE_NAME:** v27 → v28 (forces installed PWAs to fetch the new TDEE model).

**Root motivation.** Owner found an 18% TDEE overestimate (3,363 vs reality ~2,758) caused by two architectural gaps: a single static activity multiplier applied uniformly to every day-of-week (wrong for plans with fast days), and zero modeling of adaptive thermogenesis after weeks of sustained deficit. Plus three latent bugs that were preventing self-correction. v7.9.0 fixes all five at once. Plan-aware, user-configurable, NO hardcoded user-specific tuning — works for any user on any plan.

**Phase A — Per-day-type activity multipliers.** Each plan now declares an `activityByDayType` object:

| Plan | eatDay | fastDay | lightDay | Weekly weighted avg | Old uniform | Δ |
|---|---|---|---|---|---|---|
| LITE     | 1.375 | 1.20 | — | 1.30 | 1.375 | −5.5% |
| AGRO     | 1.70  | 1.35 | — | **1.55** | **1.725** | **−10.1%** |
| CUT      | 1.55  | —    | — | 1.55 | 1.55 | 0% |
| BULK     | 1.55  | —    | 1.40 | 1.51 | 1.55 | −2.6% |
| MAINTENANCE | 1.375 | — | 1.30 | 1.36 | 1.375 | −1.1% |

New helper `getWeeklyAvgActivity(plan, settings)` computes weighted weekly multiplier. Priority: `settings.activityByDayType` (user override) → `plan.activityByDayType` (plan default) → `settings.activityLevel` (legacy fallback). New unified compute helper `_computeFormulaTDEE(weight, settings, plan)` is used by every TDEE consumer in the app: `computeAutoTDEE`, `recomputeTDEE`, `computeFormulaTDEEAtWeight`, plus the calibration module's `getCalibrationStatus` and `checkStoredTdeeSanity`.

**Phase B — Adaptive thermogenesis factor.** New exported helper `computeATPFactor(settings, weights, plan)` in `modules/calibration.js`. Returns multiplier in [0.85, 1.0]. Plan-aware: only cut plans accumulate ATP (bulk/maintenance always return 1.0). Math: cumulative kg loss × duration → loss rate → ATP curve. ~5% per 4 weeks at moderate (<1 kg/wk), scaling to ~10% per 4 weeks at aggressive (≥1.5 kg/wk). Capped at 15% lifetime. Skipped for first 2 weeks (ATP needs sustained deficit). Reference: [Trexler 2014, PMC 3943438](https://pmc.ncbi.nlm.nih.gov/articles/PMC3943438/).

**Phase C — Three latent bug fixes:**

1. **`lastCalibrationOutcome` fallback bug** (`modules/calibration.js:299`). Old code: `s.lastCalibrationOutcome || (lastAt ? 'unknown' : 'never-run')` — the `||` short-circuits when stored value is `'never-run'` (truthy string), so the fallback to `'unknown'` for legacy data with `lastCalibrationAt` set never ran. Owner's data had `lastCalibrationOutcome: 'never-run'` despite `lastCalibrationAt: '2026-05-02'` → cadence note read "First calibration on next app load" forever. **Fix:** distinguish "real outcome stored" from "default placeholder + actually ran" via explicit `s.lastCalibrationOutcome !== 'never-run'` check.

2. **`confirmPlan` linked-mode override bug** (`app.html:3798 area`). Tapping CONFIRM PLAN with `linkedOffsetMode = true` would write the manually-typed calorie field to `s.calories`, overwriting the linked-mode-managed value. **Fix:** if linked mode is on, re-run `syncCalorieCeilingFromOffset()` after the form persist so the linked value wins.

3. **Stale calibration data auto-clear** — new `clearStaleCalibrationData()` exported helper. If `lastCalibrationObserved` is from > 21 days ago AND fails today's sanity bounds, the value is poisoned legacy data (e.g. one-off broken-fast spike that the cadence gate then locked in). Clears `lastCalibrationObserved`, `lastCalibrationFormula`, `lastCalibrationOutcome`, AND `lastCalibrationAt` so the next cycle evaluates fresh. Called from `runInit` BEFORE `autoRevertImplausibleTdee`. For owner: this clears the `lastCalibrationObserved: 291` that's been blocking calibration for two weeks.

**Phase D — Wider activity-inference cap for fast-day plans.** `inferActivityMultiplier` cap was `± 0.20` for all plans. With the new day-type model, plans like AGRO with 3 fast days have a weekly-weighted multiplier ~10% below the legacy default, putting the inferred value at the edge of the cap. **Fix:** plans with `fastDaysPerWeek > 0` get `± 0.35` cap; plans without fast days keep `± 0.20`.

**Phase E — Reality Check TDEE BREAKDOWN section.** New section in the Reality Check block that shows the full TDEE decomposition:
```
TDEE BREAKDOWN
BMR (Mifflin):         1,943 cal
Eat-day activity:      ×1.70  (4d/wk)
Fast-day activity:     ×1.35  (3d/wk)
Weekly avg activity:   ×1.55
Adaptive thermo:       ×0.90  (−10%)
─────────────────────────────────
Effective formula TDEE: 2,710 cal
```

For plans without `activityByDayType` (legacy fallback path), the breakdown collapses to a single "Activity multiplier" line. ATP row shows "none yet" when factor = 1.0. Hidden entirely when BMR can't be computed (missing settings).

**Sanity bounds correction (incidental fix).** `weeklyCalibration` previously computed `bmrFloor = formulaTDEE / actMult` — wrong when `formulaTDEE` already includes ATP factor (the division leaves an extra `÷ atpFactor` that produces too-low floor). v7.9.0 reads `bmrFloor` from `tdeeBreakdown.bmr` directly (raw Mifflin BMR), which is the correct physiological floor.

**`applyInferredActivityLevel` upgrade.** Tapping APPLY on the Activity Inference diagnostic now scales the plan's day-type multipliers proportionally (preserving eat:fast ratio) so the new weekly weighted average equals the inferred value. Writes `s.activityByDayType` override. Falls back to writing `s.activityLevel` for plans without day-type model.

**Files touched:**
- `plans/lite.js`, `plans/agro.js`, `plans/cut.js`, `plans/bulk.js`, `plans/maintenance.js` — each gains `activityByDayType` map.
- `app.html` — new `_mifflinBMR`, `getWeeklyAvgActivity`, `_computeFormulaTDEE` helpers; `computeAutoTDEE`, `recomputeTDEE`, `computeFormulaTDEEAtWeight` refactored to use them; `applyInferredActivityLevel` upgraded for day-type model; `confirmPlan` re-syncs linked mode; `runInit` calls `clearStaleCalibrationData` before `autoRevertImplausibleTdee`; settings defaults gain `activityByDayType: null`; module loader exposes new exports.
- `modules/calibration.js` — `computeATPFactor` (new export); `getCalibrationStatus` uses new model + exposes `tdeeBreakdown` field; `weeklyCalibration` uses `tdeeBreakdown.bmr` for sanity floor; `inferActivityMultiplier` adds plan-specific cap; `checkStoredTdeeSanity` uses new model; `clearStaleCalibrationData` (new export); `_getActivePlanForCalibration` private helper; `renderRealityCheck` adds TDEE BREAKDOWN block; `lastCalibrationOutcome` fallback fixed.
- `sw.js` — CACHE_NAME bumped to v28.

**Backward compat:**
- Plans without `activityByDayType` continue to work via legacy `s.activityLevel` fallback.
- `s.activityLevel` is preserved (used as fallback + still exposed via dropdown).
- All existing user data (settings, weights, fastSessions, dayLogs) untouched.
- No new SK keys, no migrations.
- Old TDEE consumers continue to work — they all read `s.tdee` which is updated through the same write paths.

**Effect on owner's data (verified math):**
- Old: BMR 1,949 × 1.725 (uniform) = **3,363 cal**
- New: BMR 1,949 × 1.55 (weekly-weighted AGRO) × 0.90 (ATP, 40d at 1.85 kg/wk) = **2,719 cal**
- Diff: −644 cal/day, matches owner's external analysis (2,758) within ~40 cal.

**Effect on other plan users:**
- LITE: small drop (~−5%) from per-day-type weighted avg.
- CUT: no change (no fast days; weekly == single multiplier).
- BULK: small drop (~−3%) from light-day weighting.
- MAINTENANCE: tiny drop (~−1%).
- All plans: ATP factor = 1.0 until 2+ weeks of sustained loss, only kicks in for cuts.

---

## Version 7.8.1 — 2026-04-28

**Scope:** Patch (Phase 13 of calibration roadmap — activity history foundation, with v4→v5 migration; landing-page version refresh)
**Banner:** none (patch — silent observation; no behaviour change beyond writing snapshots)

**Goal.** Closes the 13-phase calibration roadmap. Each `weeklyCalibration` cycle now writes a structured snapshot to `SK.activityHistory` so future trend-analysis features have a clean dataset to work from. Pure observation; no UI in this phase.

**Storage:**

- **New SK key:** `SK.activityHistory = 'ph_ah_v1'`. Array capped at 90 entries (oldest dropped on overflow). Each entry:
  ```js
  {
    date: 'YYYY-MM-DD',          // calibration run date
    ts: number,                   // exact timestamp
    outcome: string,              // 'gathering' | 'missing-inputs' |
                                  // 'sickness-pattern-detected' |
                                  // 'rejected-out-of-bounds' |
                                  // 'within-threshold' | 'applied'
    formulaTDEE: number | null,
    observedTDEE: number | null,
    ratio: number | null,         // observedTDEE / formulaTDEE
    daysAvailable: number,
    daysLogged: number,
    excludedSick: number,
    excludedLowCompliance: number,
    sicknessPatternDetected: boolean,
    longestRun: number,           // longest consecutive disrupted days
    oldTdee: number | null,       // pre-calibration TDEE
    newTdee: number | null        // post-calibration TDEE
  }
  ```
- **Migration v4 → v5** in `migrations/registry.js`. No-op data transformation (`requiresBackup: false`). Reverse handler drops the key. Schema version bumps from 4 to 5 on next load.
- **Cap:** 90 entries (~21 months at the weekly cadence; ~3 months at daily).

**Changes:**

- **`modules/calibration.js`:**
  - **New constant `ACTIVITY_HISTORY_CAP = 90`** + private helper `_appendActivitySnapshot(snapshot)` — writes to `SK.activityHistory`, trims to cap, no dispatch (silent).
  - **`weeklyCalibration` extended:** new `_baseSnapshot()` template inside the function (closure over the local `status`) populates common fields. Each evaluation branch (`gathering`, `missing-inputs`, `sickness-pattern-detected`, `rejected-out-of-bounds`, `within-threshold`, `applied`) calls `_appendActivitySnapshot(Object.assign(_baseSnapshot(), { outcome, ...extras }))`. The two non-evaluation branches (`manual-override`, `too-soon`) skip the snapshot since they represent "no cycle ran".
- **`app.html`:**
  - `SK.activityHistory: 'ph_ah_v1'` added.

**Landing page (`index.html`) — comprehensive version refresh** (separate concern bundled in this commit per owner request):

- **Title** and **`<meta>` cache-bust query strings** for all 5 CSS + 2 JS asset references: `?v=6.2.4` → `?v=7.8.1`.
- **Hero badge** version string `v6.2.4` → `v7.8.1` (DOM `.ver` element + `v6.2.4 · FREE · OFFLINE · NO ACCOUNT` line).
- **Stats counter** "85+ UPDATES / 85+ SHIPPED" → "100+ UPDATES / 100+ SHIPPED" (we've shipped 14 versions across the calibration roadmap; the "100+" is honest given the v5/v6/v7 cumulative count).
- **Changelog section title** "The v6 release" → "The v7 release. Adaptive TDEE, sickness-aware, multi-day fasts."
- **Changelog entries prepended** for the calibration project: v7.8 (multi-day fasts), v7.6 (calibration loop), v7.3 (sickness-aware), v7.1 (sanity bounds hot-fix). Older v6.x entries kept for context.
- **Footer note** + **install-guide note** + **closing copyright line** all bumped to v7.8.1.

**Backward compat.** No new dispatch event, no `sw.js` change. Existing user data untouched. The `activityHistory` array is empty until the next calibration cycle runs.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 13 — IN PROGRESS until owner confirms PR merge. Final phase of the 13-phase calibration & stability roadmap.

---

## Version 7.8.0 — 2026-04-28

**Scope:** Minor (Phase 12 of calibration roadmap — multi-day fast sessions, with v3→v4 migration; data restructure)
**Banner:** shown — "Multi-day fasts now work properly. Start a fast Friday evening, end Monday morning — one session covers all days, no duplicate windows. Tap START FAST during an active session does nothing (no more confused state). Data restructure migrated automatically with auto-backup. Calendar and Reality Check unchanged in look — the fix is under the hood plus the Edit Times modal now labels multi-day spans clearly."

**Goal.** Solve the multi-day fast bug surfaced earlier (Sat-Sun fast spanning Fri 6PM → Mon 9AM creating duplicate windows on Sat AND Sun, double-counting in calibration). Replace the per-date window model from Phase C with a date-agnostic session abstraction. One continuous fast = one session, regardless of how many calendar dates it spans.

**Storage:**

- **New SK key:** `SK.fastSessions = 'ph_fs_v1'`. Array of `{ id, start, end, broken, brokenBy[], dates[], legacy? }`. `dates[]` computed from start/end (or now if active); a date is included if the session was active for any portion of that local-time calendar day.
- **`SK.fastWindows`** (Phase A/C) becomes vestigial — kept in storage post-migration for rollback compat, no longer read by new code. New writes only go to `fastSessions`.
- **Migration v3 → v4** in `migrations/registry.js`. `requiresBackup: true` (auto-backup runs before migration applies). Two-step backfill:
  1. Convert each existing `fastWindows[date]` entry to a session with `dates: [date]`. Dedupe via `(date|start|end)` signature.
  2. For each `fastDays[date]` without coverage from step 1, create a 24-hour legacy session with `legacy: true`. Consecutive fast days **NOT auto-merged** — without timestamp data, can't infer continuity. User can manually merge later via the day-modal session editor.
  - Verify function: every `fastDays` entry must be covered by at least one session; no session may have an empty `dates[]`.
  - Reverse: drops `fastSessions`. `fastWindows` and `fastDays` were never touched.

**API restructure (`components/fast-window.js`, full rewrite):**

- **New session-level API (primary surface):** `getActiveSession()` (date-agnostic, one global active session at a time), `getSessionsForDate(dateStr)`, `getMostRecentSessionForDate(dateStr)`, `startFastSession()`, `endFastSession()`, `markSessionBroken(foodEntryId, foodTs)`, `editSession(sessionId, startISO, endISO, broken)`, `deleteSession(sessionId)`. All recompute `dates[]` from start/end on every write.
- **Backward-compat shims (Phase C names preserved):** `getFastWindows`, `getActiveFastWindow`, `getMostRecentWindow`, `isFastBroken`, `getFastDurationHours`, `startFast`, `endFast`, `markFastBroken`, `editFastWindow`, `deleteFastWindow`. All delegate to the session API. Phase C onclick handlers (`onclick="startFast()"`, `onclick="markFastBroken('${dateStr}', ...)"`) keep working without HTML changes.
- **`getFastDurationHours(dateStr)`** now correctly slices each multi-day session by the local-time calendar boundaries of that date — a Fri 6PM → Mon 9AM session contributes 6h to Friday's count, 24h to Saturday's, 24h to Sunday's, 9h to Monday's (not 63h to all four). Fixes calibration math that previously could double-count via duplicate windows.

**UX changes:**

- **TODAY tab fast banner:** active session shows "FASTING X h Y m" with the start time labelled `Started Fri 18:00` for multi-day sessions (vs `Started 18:00` for same-day). Tapping `▶ START FAST` during an active session is a no-op (active session is global; no duplicate created).
- **Live timer interval:** reads global active session via `getActiveSession()` — works correctly across multi-day sessions even when "today" rolls over.
- **Day modal Edit Times:** shows session-level info. When a session spans multiple dates, displays `⏱ Multi-day fast: spans N days` and the full Fri-→-Mon date+time range. Edit applies to the entire session, not a date-scoped slice.
- **Edit Modal title** when editing a multi-day session: appends `(multi-day session — covers N dates)`.
- **Legacy sessions** (created from pre-Phase-12 fastDays without timestamp data): day modal shows `Backfilled from pre-Phase-12 data — edit times to set the actual fast window.` to encourage manual cleanup.

**Backward compat verified:**

- Calibration math (`modules/calibration.js`) unchanged — it reads `gs(SK.fastDays)` directly to gate fast-day intake counting, never uses `getFastWindows`. Phase 12 doesn't touch fastDays storage. So calibration continues to work identically.
- Calendar coloring (`modules/calendar.js`) uses `isFastBroken(dateStr)` shim — still returns correct boolean.
- `addFoodEntry` break-fast prompt uses `getActiveFastWindow()` — now returns the global active session regardless of date. Logging food on Saturday during a Fri-started session correctly fires the break-fast prompt.

**APP_VERSION 7.7.0 → 7.8.0** (minor — banner shown; data restructure with `requiresBackup: true` migration). **No `sw.js` change.**

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 12 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.7.0 — 2026-04-28

**Scope:** Minor (Phase 11 of calibration roadmap — backup history tracking, with v2→v3 migration)
**Banner:** shown — "Settings → Data Management now shows your last 5 backup events with relative-time labels (Today 2:14 PM, Yesterday, 3 days ago). Helps you see backup cadence at a glance and remember when you last saved your data."

**Goal.** Surface backup cadence so the owner can see at a glance when they last saved their data — without digging through their downloads folder. Tracks the last 5 backup events.

**Storage:**

- **New SK key:** `SK.backupHistory = 'ph_bh_v1'`. Array of `{ ts: number, filename: string }`. Capped at 5 entries (oldest dropped).
- **New migration v2 → v3:** registers the new key. No-op data transformation (the key is empty by default; populated organically by `backupData()` going forward). `requiresBackup: false`.
- **Schema version** bumps from 2 to 3 on next app load.

**Changes:**

- **`app.html`:**
  - `SK` object gains `backupHistory: 'ph_bh_v1'`.
  - `backupData()` pushes a new entry on each successful download: `{ ts: Date.now(), filename: a.download }`. Trims to last 5. Calls `renderBackupHistory()` to refresh the UI block immediately.
  - **New helper `_fmtRelativeTime(ts)`:** formats UNIX timestamp as `Today, 2:14 PM` / `Yesterday, 8:00 AM` / `3 days ago, 5:00 PM` / `1 week ago` / `N weeks ago` / `N months ago` / absolute date for older. Uses local timezone for date math (matches existing `dateToStr` convention).
  - **New helper `renderBackupHistory()`:** populates `#backupHistoryList`. Hidden when array is empty. Shows "RECENT BACKUPS" header + per-entry row with relative-time on the left and filename on the right (truncated with ellipsis).
  - **Settings UI:** new `#backupHistoryList` div inserted in Data Management section, between the BACKUP/RESTORE buttons + status row and the storage health block.
  - `openSettings()` calls `renderBackupHistory()` for hydration on each open.
  - **CSS:** `.backup-history-list` (compact panel matching schema-version block style), `.backup-history-header`, `.backup-history-row`, `.bh-when`, `.bh-name` (filename truncated with ellipsis to fit narrow screens).
- **`migrations/registry.js`:** new migration object `{ from: 2, to: 3, ... }` appended after the v1→v2 fast-windows entry. Both are no-op transforms; just register schema state.

**Backward compat.** Existing users see an empty backup-history list until they make their first backup with this version. The migration is purely additive and `requiresBackup: false`. Backup files already include the new key automatically since `backupData()` iterates `SK` for the dump.

**No `sw.js` change.** No new dispatch event.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 11 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.6.1 — 2026-04-28

**Scope:** Patch (Phase 10 of calibration roadmap — backup integrity checksum)
**Banner:** none (patch — silent infrastructure; only surfaces if an integrity mismatch is detected on restore)

**Goal.** Add SHA-256 integrity verification to backup files so corrupted or tampered restores are detected before they can write bad data into storage. Old backups (no checksum field) continue to work — the verification is purely additive.

**Changes:**

- **`app.html`:**
  - **New helper `sha256Hex(str)`:** async function returning the lowercase hex digest of the input via `crypto.subtle.digest('SHA-256', ...)`. Returns `null` if Web Crypto is unavailable (very old browsers, non-secure contexts) — caller skips checksum gracefully rather than failing.
  - **`backupData()` is now `async`:** before stringifying the final backup, computes `sha256Hex(JSON.stringify(backup.data))` and stores `'sha256:<64-hex>'` in `backup.checksum`. Hash is over the canonical stringified `data` field only — metadata changes (appVersion bumps, exportedAt edits) don't invalidate the checksum, but data tampering does. Skipped silently if Web Crypto unavailable.
  - **`restoreData()`:** the inner `reader.onload` callback wraps logic in an async IIFE so it can `await sha256Hex`. New checksum-verification step:
    - `verified`: checksum present and matches → normal RESTORE confirm dialog.
    - `mismatch`: checksum present but data doesn't match → **danger-tinted "INTEGRITY CHECK FAILED" dialog** with explicit "RESTORE ANYWAY" override.
    - `absent`: no checksum field (older backup) → normal dialog with note `(older backup format — no integrity check available)`.
    - `compute-failed`: hash function returned null → normal dialog with note `(could not verify integrity — Web Crypto unavailable)`.
  - **New helper `_commitBackupRestore(backup, keys, exported)`:** factored from the inline restore body so the verified path and the integrity-override path share the same write logic. No behaviour change to the restore body itself.

**Backward compat.** Backups created with prior versions (no `checksum` field) restore exactly as before — just with an extra note in the confirm dialog. New backups are still readable by older versions of the app since the `checksum` field is ignored by older `restoreData` (it's only validated when present).

**No new SK key. No migration. No new dispatch event. No `sw.js` change.**

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 10 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.6.0 — 2026-04-28

**Scope:** Minor (Phase 9 of calibration roadmap — adaptive activity multiplier diagnostic)
**Banner:** shown — "New diagnostic in Settings: after 28+ days of clean data, the app infers your true effective activity multiplier from observed TDEE / BMR. Shown next to your current activity level with an APPLY button if there is a meaningful gap. Capped to plan default ± 0.2 to prevent wild swings. Pure read-only diagnostic until you tap APPLY."

**Goal.** Surface a data-driven activity-multiplier inference so users can correct the formula's blind assumption that real activity always matches the dropdown they picked at onboarding. Pure diagnostic by default; the APPLY button is the only path that writes to settings.

**Math.** `effective = observedTDEE / BMR`, then clamped to plan default ± 0.2 (e.g. AGRO default 1.725 → cap range 1.525–1.925). Rounded to 3 decimals for stable display + storage equality.

**Validity gates** (any failure hides the row entirely):
- Settings has `weight`, `height`, `age` (BMR baseline)
- 28+ days of weight data (`computeObservedTDEE(28)` window)
- 14+ logged days inside that window
- No active sickness pattern in last 14 days (`_detectSicknessPattern`)
- BMR > 0 (sanity)

**Changes:**

- **`modules/calibration.js`:**
  - **New `inferActivityMultiplier()` export.** Returns `{ valid, effective, rawEffective, current, gap, daysOfData, daysLogged, planDefault, lowerCap, upperCap, capped, bmr, observedTDEE, reason }`. Constants: `ACTIVITY_INFER_CAP_DELTA = 0.2`, `ACTIVITY_INFER_MIN_DAYS = 28`, `ACTIVITY_INFER_MIN_LOGS = 14`.
- **`app.html`:**
  - Module loader exposes `inferActivityMultiplier` to `window`.
  - Settings panel: new `#activityInferRow` block immediately under the activity-level custom dropdown. Empty `<span>` for the diagnostic text + APPLY button.
  - **New helpers:**
    - `renderActivityInference()` queries `inferActivityMultiplier()`, hides the row when invalid, populates text + button visibility (APPLY hidden when gap < 5%).
    - `applyInferredActivityLevel()` writes `s.activityLevel = effective`, updates the hidden native select + custom dropdown trigger to show "Custom: 1.624 (inferred)", calls `autoFillTDEE()` to recompute formula TDEE with the new multiplier, dispatches `TDEE_CHANGED`, refreshes the inference row, shows confirmation alert.
  - Hydrated by `openSettings()` and re-rendered on `onPlanSelectChange()` (plan default changes the cap range).
  - **CSS:** `.activity-infer-row` (teal-tinted compact row, flex layout), `.activity-infer-text` (small mono muted), `.activity-infer-apply-btn` (teal outline pill, opacity dimmed when value was capped).

**No new dispatch event** (reuses `TDEE_CHANGED`). **No new SK key.** **No migration.** **No `sw.js` change.**

**Backward-compat:** existing users see no change unless they have 28+ days of clean data. The row stays hidden by default.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 9 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.5.0 — 2026-04-28

**Scope:** Minor (Phase 8 of calibration roadmap — Linked Offset Mode, plan-direction-aware)
**Banner:** shown — "New Settings toggle: link calorie ceiling to TDEE. Pick a target deficit (cut), surplus (bulk), or band offset (maintenance). When TDEE moves, the ceiling auto-adjusts to keep the same offset. Lose 5kg → TDEE drops → ceiling drops too, deficit stays constant. Off by default; opt-in."

**Goal.** Opt-in mode where calorie ceiling auto-tracks TDEE changes by maintaining a constant offset relative to TDEE. Plan-direction-aware so the same toggle works for cut, bulk, and maintenance plans without redesign per plan.

**Plan-direction model** (uses `caloriesMode` discriminator from Phase 3):

| Plan mode | Offset semantic | Default | Range | Floor / clamp |
|---|---|---|---|---|
| `floor` (LITE/CUT/AGRO) | Deficit (positive, subtracted) | 1500 | 100–3000 | `max(plan.minCalories, TDEE − offset)` |
| `above-tdee` (BULK) | Surplus (positive, added) | 300 | 100–1000 | `TDEE + offset` (no upper clamp) |
| `tdee-band` (MAINTENANCE) | Signed delta | 0 | −300 to +300 | `clamp(TDEE − 300, TDEE + 300, TDEE + offset)` |

**Changes:**

- **Settings defaults** in `getSettings()` gain `linkedOffsetMode: false, targetOffset: null`.
- **Settings panel UI:** new toggle row directly under the existing "Freeze TDEE" row. When ON, an indented offset-input row reveals beneath. Toggle label, input label, input min/max all adapt to active plan's `caloriesMode`. The calorie ceiling field gets `readonly` attribute when linked + a subtle green-tinted background as visual cue.
- **New helpers in `app.html`:**
  - `defaultOffsetForPlan(plan)` returns 1500 / 300 / 0 by mode.
  - `syncCalorieCeilingFromOffset()` computes new ceiling per plan mode, writes `s.calories`, dispatches `CALORIES_CHANGED`. No-op when toggle off. Floor/band/clamp enforcement built in.
  - `updateLinkedOffsetUI()` adapts toggle label, input label, input bounds, current value, and calorie-field readonly state. Called from `openSettings` and `onPlanSelectChange`.
  - `toggleLinkedOffsetMode(checked)` flips the flag, picks default offset on first enable, syncs ceiling immediately, refreshes UI.
  - `onLinkedOffsetInput()` debounced offset-change handler — saves and re-syncs ceiling.
- **Plan switch handling** in `onPlanSelectChange`: if `linkedOffsetMode` is ON and the new plan's `caloriesMode` would make the current offset out-of-range (e.g. switching to BULK from CUT with deficit 1500 — sign flips to surplus territory), the offset auto-resets to the new plan's default. Then UI refreshes labels + bounds.
- **Auto-sync trigger sites:**
  - `recomputeAndApplyTDEE()` (every weight log) calls `syncCalorieCeilingFromOffset()` after TDEE write.
  - `weeklyCalibration()` (in `modules/calibration.js`) calls `syncCalorieCeilingFromOffset()` after applying a new TDEE.
  - Both helpers no-op when toggle is off, so existing user behaviour is unchanged unless they opt in.
- **CSS:** `.field-input[readonly]` (subtle green-tint, not-allowed cursor) + `#linkedOffsetRow` (indented + green left-border to visually link to the toggle).

**Backward compat.** `linkedOffsetMode: false` default means existing users see no change until they tap the toggle. `targetOffset: null` defaults to plan-appropriate value on first enable. No migration. No new SK key. No `sw.js` change.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 8 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.4.1 — 2026-04-28

**Scope:** Patch (Phase 7 of calibration roadmap — sickness pattern auto-detection)
**Banner:** none (patch — defensive math; UI surfaces in Reality Check cadence note)

**Goal.** Safety net for users who don't manually flag sick days. When 3+ consecutive disrupted days (sick OR sub-30% compliance) appear inside the 14-day calibration window, `weeklyCalibration` defers applying — even if observed math otherwise passes. Pattern clears naturally once the user has 3+ consecutive non-disrupted days.

**Changes:**

- **`modules/calibration.js`:**
  - **New helper `_detectSicknessPattern(days = 14, requiredConsecutive = 3)`:** walks the last `days` calendar dates oldest→newest, calling `_getDayExclusion` per date. Tracks the longest consecutive run of excluded days. Returns `{ detected, longestRun, runDates }`. Constant `SICKNESS_PATTERN_REQUIRED_CONSECUTIVE = 3` defines the threshold.
  - **`getCalibrationStatus` extended:** new `sicknessPattern` field exposed so display code can surface the pattern proactively (before next calibration cycle runs).
  - **`weeklyCalibration` adds a new gate** between the state-CALIBRATED check and the missing-inputs check. When `status.sicknessPattern.detected === true`, sets `lastCalibrationAt = now`, writes `lastCalibrationOutcome = 'sickness-pattern-detected'`, returns `{ applied: false, reason: 'sickness-pattern-detected', longestRun, runDates }`. No TDEE write; no banner alert (it's a deferral, not a failure).
  - **`_buildCadenceNote` extended:**
    - Proactive: if state is CALIBRATED AND pattern is currently detected AND last outcome wasn't already `sickness-pattern-detected`, returns `Calibration will pause — sickness pattern detected (N consecutive disrupted days). Will retry once pattern clears. Next check in X days.`
    - Past tense: when last outcome was `sickness-pattern-detected`, branches on whether the pattern still holds. If yes: same deferral message in past tense. If pattern cleared: `Last run: deferred for sickness pattern. Pattern has cleared — next check in X days.`
- **`app.html` APP_VERSION 7.4.0 → 7.4.1** (patch — silent; deferral logic is defensive). No new dispatch event. No new SK key. No migration. No `sw.js` change.

**Effect on existing data.** Today (Apr 28): if user marks Apr 24-26 sick (3 consecutive days), pattern auto-detects on next calibration cycle and defers apply. Reality Check shows: `Calibration will pause — sickness pattern detected (3 consecutive disrupted days). Will retry once pattern clears.` Pattern resolves once 3+ consecutive non-disrupted days accumulate (mid-May given current trajectory).

**Manual override path** (for owner who wants to force a calibration cycle despite pattern): toggle "Freeze TDEE" ON → OFF. The override flag pause-resume cycle effectively resets the deferral on next load. Or the owner can simply wait for the pattern to clear naturally.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 7 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.4.0 — 2026-04-28

**Scope:** Minor (Phase 6 of calibration roadmap — sickness-aware calibration math)
**Banner:** shown — "Calibration is now sickness-aware. Days you mark sick (🤒) and days where checklist completion fell below 30% are excluded from observed-TDEE math. Bad weeks of sickness or travel no longer corrupt your TDEE estimate. The Reality Check shows the exclusion breakdown so you can see exactly what was skipped."

**Goal.** Wire the Phase 5 sickness flag into the calibration math. Days flagged sick OR with very low checklist completion (likely a disrupted day, even if user forgot to mark it) are excluded from `computeObservedTDEE`'s intake aggregation. The kgLoss / spanDays attribution is unchanged; only intake-side aggregation is filtered. Prevents a bad week from skewing your TDEE estimate downward.

**Exclusion gate:**

A day is excluded when:
1. `dayLogs[ds].sick === true` (Phase 5 manual flag), OR
2. `getValidCheckCompletion(ds).pct < 30` AND `vc.total > 0` (compliance gate; only applies if a checklist was actually rendered for that day — purely unlogged days fall through to existing "unlogged" branch).

Threshold: `LOW_COMPLIANCE_PCT = 30`.

**Changes:**

- **`modules/calibration.js`:**
  - **New private helper `_getDayExclusion(ds, dayLogs)`** returns `'sick' | 'low-compliance' | null`. Single source of truth for exclusion logic — used by both `getDayBreakdown` and `computeObservedTDEE` so display + math stay consistent.
  - **`getDayBreakdown` updated:** exclusion gate runs before day-type classification. Excluded days don't appear in `eatingDayCount` / `fastDayCount` / `unloggedEatingDayCount`. New return fields: `excludedSick`, `excludedLowCompliance`, `excludedTotal`.
  - **`computeObservedTDEE` updated:** exclusion gate runs before intake aggregation. Excluded days don't add to `intakeSum` / `daysLogged`. New return fields: `excludedSick`, `excludedLowCompliance`. Refactored early-exit branches to use a shared `empty` template so all return paths have a consistent shape (still backward-compat — unknown fields ignored by callers).
  - **`getCalibrationStatus` extended:** passes through `excludedSick`, `excludedLowCompliance`, `excludedTotal` to consumers.
  - **`renderRealityCheck` extended:** new "Days excluded" row appears in the intake block when `excludedTotal > 0`. Format: `Days excluded: 3 · 1 sick, 2 low compliance`. Hidden entirely when zero exclusions.
- **`app.html` APP_VERSION 7.3.0 → 7.4.0** with the banner message above. No new dispatch event. No new SK key. No migration. No `sw.js` change.

**Effect on existing user data.** Any day where `dayLogs[ds].sick === true` (Phase 5 flag) will now be excluded from observed-TDEE. For your current data: if you mark Apr 24-26 sick (sickness window from the audit), observed TDEE recomputes higher (closer to formula), since those broken-fast days at 1648/1416 cal stop dragging the math. Reality Check displays "Days excluded: 3 · 3 sick" so you can see what changed.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 6 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.3.0 — 2026-04-28

**Scope:** Minor (Phase 5 of calibration roadmap — sickness flag UI + storage)
**Banner:** shown — "You can now mark any day as sick / disrupted with a 🤒 toggle on the TODAY tab and in the calendar day modal. Marked days show a small icon in the corner of their calendar cell. Phase 6 will use this flag to exclude sick days from the calibration math, so a bad week of sickness or travel no longer corrupts your TDEE."

**Goal.** Pure additive UI surface. Lets the user manually flag any day as sick or disrupted. No math consumer ships in this phase — Phase 6 wires it into calibration. Phase 5 is the storage + UX foundation.

**Storage:**

- Field: `dayLogs[date].sick: boolean` (defaults to `false`/absent on read).
- Backup: automatic — already nested inside `dayLogs[date]` which is fully serialised by the existing backup iteration.
- No new SK key, no migration.

**Changes:**

- **`modules/calendar.js`:**
  - `openDayModal` adds a sickness checkbox row right above the Notes field. Hydrated from `log.sick`. Live-saves via `toggleSickDay(dateStr, this.checked)` onchange — no need to tap SAVE DAY.
  - `renderCalendar` reads `log.sick` per cell; when truthy, adds the `cal-sick` class and renders a small `🤒` icon overlay positioned in the top-right corner. Cell base color (compliance / fast / partial) is preserved — the icon is an additional indicator, not a replacement.
- **`app.html`:**
  - **New top-level handler `toggleSickDay(dateStr, checked)`:** writes via `saveDayLogField(dateStr, { sick: !!checked })`, syncs both checkboxes (TODAY + day-modal) if both are present, dispatches `DAY_SAVED` so the calendar refreshes immediately.
  - **TODAY tab** gains its own sickness toggle row (`#tSick`) inserted between the weight-log row and the food-log button. Hydrated by `updateFastUI()` (which already runs on TODAY render and on tab switch).
  - **CSS:** new `.sick-toggle-row` (compact pill-style row, orange accent on checkbox), `.cal-sick` (placeholder class for future styling hooks), `.cal-sick-icon` (absolute-positioned emoji corner overlay). `.cal-cell` already had `position:relative` so no change needed there.

**No new dispatch event** — reuses existing `DAY_SAVED`. **No new SK key.** **No migration.** **No `sw.js` change.**

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 5 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.3 — 2026-04-28

**Scope:** Patch (Phase 4 of calibration roadmap — spike-trim port to radar + ADJUST)
**Banner:** none (patch — math correctness, no new feature)

**Goal.** Finish the v7.1.0 spike-protection rollout. Previously only `updateProjection()` had spike trimming. The radar's WEIGHT TREND axis still used raw newest/oldest weights (so a single +3kg sickness spike could crash the axis to red), and `calcAdjust()` used raw `getLatestWeight()` for `currentWeight` (so opening ADJUST during a water-spike day would feed bad data to the schedule recalculation).

**Changes:**

- **`app.html` — new shared helper `getSpikeTrimmedWeights(weights, opts)`** placed next to `getLatestWeight`. Extracted byte-identical from the original v7.1.0 inline logic in `updateProjection`. Inputs: weights array (newest-first), optional `{ spikeKg = 1.5, maxKgPerWeek = 2.0 }`. Returns `{ rateWindow, trimmedCount, spikeDetected, rawDailyLoss, rawIsImplausible, daySpan, rateLatest, oldest }`.
- **`updateProjection()` refactored** to call the helper instead of carrying its own inline logic. Behaviour bit-identical (same defaults, same trim algorithm).
- **`calcAdjust()`** — `curW` resolution now goes through the spike-trim helper. If a spike is detected, `curW` becomes the trimmed-latest (the most recent stable reading) instead of raw `getLatestWeight()`. Falls back to `getLatestWeight()` then `startW` if helper isn't available or no weights exist. Every other field in `calcAdjust` (`startW`, `elapsed`, `actualRate`, etc.) unchanged.
- **`modules/radar.js` WEIGHT TREND axis** uses `getSpikeTrimmedWeights(windowWeights)` for `dailyChange` calculation. Existing dampener (sparse-data confidence) preserved. New: when spike-trim flags `rawIsImplausible`, the axis confidence drops further (×0.5) — even the trimmed signal can still be water/sickness noise, so the score reflects that uncertainty.
- **Backward-compat fallback** in radar.js: if `getSpikeTrimmedWeights` isn't defined (paranoid defensive), the original raw newest/oldest math runs. No behaviour regression.

**No data shape change.** No new dispatch event. No new SK key. No `sw.js` change.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 4 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.2 — 2026-04-28

**Scope:** Patch (Phase 3 of calibration roadmap — plan-direction-aware calorie safety hints/warnings)
**Banner:** none (patch — silent; advisory UI only)

**Goal.** Surface non-blocking warnings when the calorie ceiling falls outside the safe range for the active plan. Semantics differ by plan direction (cut = floor, bulk = above-TDEE, maintenance = TDEE band). Never blocks the goal calculator; always informs.

**Plan direction model:**

| Plan | `caloriesMode` | Threshold logic |
|---|---|---|
| LITE | `floor` | warn if ceiling < `minCalories: 1200` |
| AGRO | `floor` | warn if ceiling < `minCalories: 800` |
| CUT | `floor` | warn if ceiling < `minCalories: 1400` |
| BULK | `above-tdee` | warn if ceiling ≤ TDEE (computed dynamically) |
| MAINTENANCE | `tdee-band` | warn if abs(ceiling − TDEE) > 300 (band computed dynamically) |

**Changes:**

- **`plans/lite.js`, `plans/agro.js`, `plans/cut.js`, `plans/bulk.js`, `plans/maintenance.js`** — each plan object gains `caloriesMode` + threshold field(s):
  - Static numeric `minCalories` for cut plans
  - `null` for bulk + maintenance (computed from TDEE at validation time)
  - Maintenance also gets `maxCalories: null` for the upper bound
- **`app.html`:**
  - **New helper `validateCaloriesAgainstPlan(cals, plan, tdee)`** dispatches on `plan.caloriesMode`. Returns `{ ok, severity, message }`. No hardcoded plan keys outside the helper.
  - **New `renderCalorieSafetyWarning(cals, plan, tdee)`** writes the warning to the goal-calculator result panel `#calcCalorieSafety`. Hidden when validation passes.
  - **New `renderCaloriesHint()`** writes a live floor/band hint under the Settings calorie field `#caloriesHint`. Reads current plan + current TDEE input value (or settings fallback).
  - **`calcDuration()`** calls `renderCalorieSafetyWarning(calcCals, plan, tdee)` just before showing the result panel.
  - **`openSettings()`** calls `renderCaloriesHint()` after hydrating fields.
  - **`onPlanSelectChange()`** calls `renderCaloriesHint()` to refresh on plan switch.
  - **Settings calorie field oninput** also calls `renderCaloriesHint()` (in addition to `calcDuration`) so hint reflects live edits.
  - **Settings TDEE field oninput** also calls `renderCaloriesHint()` (TDEE changes shift the band/threshold for bulk + maintenance plans).
  - New CSS: `.cal-floor-hint` (small muted text under the field), `.cal-floor-warn` (orange-tinted warning panel in result block).
  - New DOM: `#caloriesHint` div under settings calorie field, `#calcCalorieSafety` div in goal-calculator result panel.

**No data migration.** New plan fields are additive; existing plan readers ignore unknown fields. No `sw.js` change.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 3 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.1 — 2026-04-28

**Scope:** Patch (Phase 2 of calibration roadmap — quick-access ADJUST link in Settings)
**Banner:** none (patch — no popup; small UI add)

**Goal.** Surface the existing `MANAGE SCHEDULE → ADJUST` flow from the Settings panel. Previously, adjusting an active schedule required navigating to MONTHS tab → tapping `⚙ MANAGE SCHEDULE`. Phase 2 adds a one-tap shortcut from Settings.

**Changes:**

- **`app.html` Settings panel HTML:** new button `↗ ADJUST CURRENT SCHEDULE` (`#settingsAdjustLink`) inserted under the goal-calculator section, after the `ADD TO SCHEDULE` button. Styled with the orange `--accent2-warm` palette (`#ff8855`) to match the existing Manage Schedule button on MONTHS tab. `display:none` by default; revealed only when a schedule is active.
- **`openSettings()`** extended to toggle the new link's visibility based on `gs(SK.schedule)` — visible if schedule exists, hidden otherwise.
- **New top-level function `adjustCurrentScheduleFromSettings()`:** closes the Settings overlay then calls `openManageSchedule()`. The existing `openManageSchedule` already pre-fills `msTargetKg` from `s.targetKg` and `msCalories` from `s.calories`, so the user lands directly on a populated ADJUST view ready to edit.
- **No changes** to `openManageSchedule` itself — its existing pre-fill behaviour was already correct. This phase is purely about discoverability: a Settings-panel entry point so the owner doesn't need to remember the MONTHS tab path.

**No new modules.** No new CSS classes (button reuses existing `.reset-btn` styling). No new dispatch events. No data shape change. No `sw.js` change in this commit.

**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 2 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.2.0 — 2026-04-28

**Scope:** Minor (Phase 1 of calibration roadmap — Reality Check display clarity)
**Banner:** shown — "Reality Check redesigned for clarity. Eating-day average now shown separately from period average (which includes fast days). Calibration cadence visible: see exactly when the next check happens and why the last one was applied/rejected/skipped. New ⓘ Explain button opens a plain-English guide to what every number means."

**Root motivation.** The Reality Check block was mathematically correct but humanly confusing. Owner's actual data showed `Avg intake (12 logged days): 812 cal` which looked alarmingly low; in fact 6 of those 12 days were fasts counted at 0, dragging the average down. Plus `Currently using 3382 / Observed 2352` left no explanation for why the displayed TDEE didn't match the observed value (cadence gate preventing apply). Phase 1 fixes the labels and surfaces the why.

**Changes:**

- **`modules/calibration.js`** — three additions and one rewrite:
  - **New `getDayBreakdown(days=14)`** helper. Splits intake into `eatingDayAvg` (non-fast days only), `periodAvg` (all included days), `fastDayCount`, `brokenFastCount`, `unloggedEatingDayCount`. Used purely for display; doesn't change TDEE math.
  - **`getCalibrationStatus()`** extended with cadence + breakdown fields: `breakdown` (from above), `lastCalibrationAt` (Date), `nextCalibrationAt` (Date), `daysUntilNextCheck` (number), `lastCalibrationOutcome` (string from new settings field), `lastCalibrationFormula`, `lastCalibrationObserved`.
  - **`weeklyCalibration()`** now writes `s.lastCalibrationOutcome` at every evaluation branch — `'applied' | 'within-threshold' | 'rejected-out-of-bounds' | 'gathering' | 'missing-inputs'`. Cadence gate uses new `CALIBRATION_CADENCE_DAYS = 7` constant.
  - **`renderRealityCheck()`** rewritten with three structured sections (loss / intake / TDEE) and a cadence note that explains in plain English when the next check happens or why the last one didn't apply. New helper `_buildCadenceNote(status)` produces the message based on outcome.

- **`app.html`** — wiring + UI:
  - `getSettings()` defaults gain `lastCalibrationOutcome: 'never-run'`. Backward-compatible via existing `Object.assign({}, defaults, saved)` pattern; existing user data unaffected.
  - Module loader exposes `Calibration.getDayBreakdown` to `window.getDayBreakdown`.
  - New **Reality Check Explain Modal** (`#realityExplainModal`) using the existing `popup-overlay` pattern at z-index 9100. Six sections: What this shows / Predicted vs Actual / Eating-day vs Period avg / Formula vs Observed TDEE / When calibration applies / What you can do.
  - New top-level functions `openRealityExplain()` / `closeRealityExplain()` registered.
  - New CSS classes: `.rc-section` (groups intake/TDEE/loss), `.rc-cadence-note` (italic explanation under TDEE block), `.rc-header-actions` (right-side group for state pill + explain button), `.rc-explain-btn` (small pill-style button), `.rc-explain-section` / `.rc-explain-h` / `.rc-explain-p` / `.rc-explain-p em` for the modal content.

**No data migration.** New `lastCalibrationOutcome` field defaults via getSettings; backups round-trip cleanly.
**No `sw.js` change** in this commit — bumps with merge to main per feature-branch convention.
**Roadmap:** `PENDING_IMPLEMENTATIONS.md` Phase 1 — IN PROGRESS until owner confirms PR merge.

---

## Version 7.1.0 — 2026-04-26

**Scope:** Minor (hot-fix for calibration corrupted by sickness-induced weight spike; multiple UX/math fixes)
**Banner:** shown — "Hot-fix: calibration sanity bounds. Sudden weight spikes from sickness or water retention no longer corrupt your TDEE. App auto-reverts implausible TDEE values on load. New RESET button in Settings if you ever need to manually restore the formula value. ADJUST and projection now handle weight noise correctly."

### Root cause

A user who gained ~3 kg in 3 days from sickness/water retention triggered a calibration cascade where:
1. computeObservedTDEE took the +3 kg as "real" weight gain → computed observedTDEE = avgIntake − 1650 cal/day
2. weeklyCalibration applied the result, writing TDEE = ~1300 cal/day to settings (below physiological BMR floor of ~2000)
3. updateProjection trusted the broken TDEE → predicted weight gain by Sunday
4. ADJUST math used the broken TDEE → would have produced nonsense schedules

### Fixes (6 layered protections)

- **Sanity bounds in `computeObservedTDEE`** (`modules/calibration.js`) — rejects when weekly weight change exceeds 2 kg (physiological limit; sustained loss/gain at this rate without sickness/water/glycogen confounds is implausible). Returns `valid: false, reason: 'spike-detected'`.
- **Sanity bounds in `weeklyCalibration`** — even if observed math passes the spike gate, the resulting TDEE must fall between BMR (formula ÷ activityMultiplier) and formula × 1.5. Anything outside this band is rejected, lastCalibrationAt bumps, no settings.tdee write. Returns `reason: 'observed-out-of-bounds'`.
- **Auto-revert on load** (`autoRevertImplausibleTdee` in `modules/calibration.js`, called from `runInit`) — if the currently-stored settings.tdee is below BMR or above formula × 1.5, automatically reverts to formula TDEE on next load and shows a banner explaining why. This is the auto-recovery path that unbreaks any user already affected by the bug. Honors `settings.tdeeManualOverride` (skipped if user explicitly froze TDEE).
- **Manual RESET button** in Settings panel (`resetTdeeToFormula`) — one-tap recovery. Also displays the formula TDEE alongside the current value: `Formula: 3103 cal/day [↺ RESET]`. Writes the formula value to settings.tdee, sets lastCalibrationAt to now (suppresses next auto-cal for 7 days while data stabilizes), shows confirmation alert.
- **Spike handling in `updateProjection`** — detects consecutive day-to-day weight deltas > 1.5 kg (sickness, water, glycogen) and trims spike-affected entries from the rate window. Implausibility check on the trimmed rate (> 2 kg/wk) drops observedWeight from default 0.7 → 0.1, making formula dominate the projection. Stops the "predicting +0.4 kg gain by Sunday" nonsense.
- **Trajectory-aware ADJUST** (`calcAdjust`) — for a long cut from 99 → 89 kg, BMR drops by ~100 cal as weight drops, so TDEE drops by ~155 cal at activity 1.55. Previously calcAdjust used a single TDEE snapshot which overestimated the deficit. Now uses average of `computeFormulaTDEEAtWeight(currentWeight)` and `computeFormulaTDEEAtWeight(targetWeight)` for the projection. Result is a more accurate end-date estimate.

### Bonus fixes

- **TDEE field commits on blur** — settings.tdee field gains `onchange="commitTdeeManual()"` which writes the value to settings and dispatches `TDEE_CHANGED` immediately, so projection / goal bar / nutrition macros refresh without needing CONFIRM PLAN. Previously a typed TDEE override only updated the goal calculator preview until CONFIRM PLAN was tapped.
- **Formula TDEE display** in Settings — always-visible diagnostic line showing what Mifflin-St Jeor predicts at the user's current weight/age/height/activity. Useful for spotting calibration drift at a glance.

### Files touched

- `modules/calibration.js` — added `MAX_KG_CHANGE_PER_WEEK`, `TDEE_CEIL_RATIO` constants; sanity gate in `computeObservedTDEE`; bounds check in `weeklyCalibration`; new exports `checkStoredTdeeSanity` and `autoRevertImplausibleTdee`.
- `app.html` — module loader exposes 2 new calibration exports; runInit calls `autoRevertImplausibleTdee()` before `weeklyCalibration()`; new functions `commitTdeeManual`, `computeFormulaTDEEAtWeight`, `resetTdeeToFormula`; settings panel gains RESET button + formula display + onchange on TDEE field; openSettings hydrates the formula display; updateProjection adds spike trimming + implausibility weight; calcAdjust uses trajectory-averaged TDEE.
- `UPDATE_LOG.md` — this entry.

### What this means for the user

On next load:
1. App detects current TDEE = 1300 is below BMR (~2000)
2. Auto-reverts to formula TDEE (~3103 for 99 kg / 180 cm / 24 yo / cut)
3. Shows banner explaining what happened
4. Projection refreshes — should show weight-loss trajectory, not water-retention noise
5. Settings panel shows "Formula: 3103 cal/day" with RESET button if any future drift happens
6. ADJUST will now correctly model TDEE drop over the planned 35-day cut from ~99 → 89 kg

---

## Version 7.0.1 — 2026-04-26

**Scope:** Patch (3 bug fixes from post-Phase-D triple bug-hunt; no user-visible feature change)
**Banner:** none (patch)

- **Fixed `components/fast-window.js:340`** — `deleteFastWindowFromModal` was checking the wrong DOM ID (`'dayModal'` instead of `'modalOverlay'`). The day modal failed to re-render after a fast window was deleted from the edit modal, leaving stale UI on screen until the user manually closed and reopened the day modal. Earlier fix attempted with `replace_all=true` only matched one indentation variant; the second occurrence was missed.
- **Fixed `modules/calibration.js:102`** — off-by-one in the state-determination gate. The condition `obs.daysAvailable >= 14 - 1` (i.e. `>= 13`) allowed CALIBRATED state with only 13 days of weight history. Changed to `>= 14` to match the documented "14 days of weight + 7 days of food log" threshold.
- **Refactored `recomputeAndApplyTDEE`** — separated TDEE recompute from `settings.currentKg` sync. Previously, when manual TDEE override was on, the function would silently write `settings.currentKg` without dispatching anything, leaving the goal bar stale. Now `recomputeAndApplyTDEE` only handles TDEE; new `syncCurrentKgFromLatestWeight` helper handles the weight-field sync and is called explicitly from `logWeight` / `logWeightFromToday`. The existing `dispatch('WEIGHT_LOGGED')` in those callers refreshes the goal bar (the only consumer of `settings.currentKg` outside the Settings panel).
- **No `sw.js` change** — module file lists unchanged.

---

## Version 7.0.0 — 2026-04-26

**Scope:** Major (calibration project — Phase D; closes the TDEE feedback loop)
**Banner:** shown — "Adaptive TDEE calibration is now live. The app compares your real intake + weight loss against the formula prediction every week and adjusts your TDEE if reality disagrees by more than 7%. New REALITY CHECK block on the TRACK tab shows predicted vs actual loss live. Manual override toggle in Settings if you want to freeze TDEE."

- **New file `modules/calibration.js`** (~210 lines) — closes the TDEE feedback loop:
  - **`computeObservedTDEE(days=14)`** — pure CICO rearrangement: `observedTDEE = avgIntake + (kgLoss × 7700 ÷ spanDays)`. Excludes unlogged eating days from the intake average. Treats fast days as 0 intake unless broken (then uses food log). Returns full status: `{ tdee, daysLogged, daysAvailable, kgLoss, avgIntake, spanDays, valid, reason }`.
  - **`getCalibrationStatus()`** — composes formula TDEE (Mifflin × activity), observed TDEE, and a 70/30 blend. Returns state: `GATHERING` (< 14 days weight or < 7 days food log) or `CALIBRATED`.
  - **`weeklyCalibration()`** — runs at app load. Cadence-gated to once every 7 days. Skipped if `settings.tdeeManualOverride === true` or if state is `GATHERING`. Otherwise blends 70% observed + 30% formula → if change > 7%, writes `settings.tdee`, dispatches `TDEE_CHANGED` (registered in Phase A), and shows a `showAlert` explanation.
  - **`renderRealityCheck()`** — populates the new `#realityCheckBox` block on the TRACK tab. Shows predicted loss, actual loss, gap %, formula TDEE, observed TDEE, currently-used TDEE, average intake, and days logged. Hidden if `daysAvailable < 7`. Color-codes the gap (orange = slower than predicted, green = faster).
- **New TRACK tab block** — `<div id="realityCheckBox">` inserted between radar and weight log. Always-visible (per the simplified plan), no banner-only treatment. New `.reality-check`, `.rc-row`, `.rc-label`, `.rc-val`, `.rc-state-pill`, `.rc-title` CSS.
- **Settings panel** — new "Freeze TDEE — disable weekly auto-calibration" checkbox under the TDEE field. Wired to `settings.tdeeManualOverride`. `openSettings()` hydrates the checkbox from settings on open.
- **`recomputeAndApplyTDEE` (Phase B)** now also syncs `settings.currentKg` to the latest weight log, fixing the minor UX inconsistency identified in the Phase A/B audit (settings panel display was lagging behind reality after a weight log).
- **`runInit`** runs `weeklyCalibration()` once after `idbAutoRestore` + migrations + plan UI setup. Wrapped in try/catch to avoid blocking init on calibration errors.
- **`switchTab('track')`** now also calls `renderRealityCheck()`.
- **Settings defaults** (in `getSettings`) gain four new fields: `tdeeManualOverride: false`, `lastCalibrationAt: null`, `lastCalibrationFormula: null`, `lastCalibrationObserved: null`. All default-merged via the existing `Object.assign({}, defaults, saved)` pattern — backward compatible with all existing user data.
- **No new SK key, no new migration.** All calibration state lives in `settings`. Phase A's v1→v2 schema bump remains the only schema change in this project.
- **APP_VERSION** 6.4.0 → 7.0.0 (major — closes a multi-phase feature category, rework of how TDEE is computed and applied).
- **Phase plan:** `docs/CALIBRATION_PHASE_D_PLAN.md`.
- **At merge to main, `sw.js` cache list must include the two new module files** (`components/fast-window.js` and `modules/calibration.js`) and `CACHE_NAME` must bump (`v25` → `v26`).

---

## Version 6.4.0 — 2026-04-26

**Scope:** Minor (calibration project — Phase C; fast-window timestamps + broken-fast UX)
**Banner:** shown — "Fast days now have real start/stop timestamps. Tap START FAST when you begin, END FAST when you finish. Edit times retroactively. Logging food during an active fast asks if it breaks the fast. Old fast days remain valid (treated as 24-hour fasts)."

- **New file `components/fast-window.js`** (~290 lines) — all fast-window logic:
  - **Read helpers:** `getFastWindows`, `getActiveFastWindow`, `getMostRecentWindow`, `isFastBroken`, `getFastDurationHours`
  - **Write helpers:** `startFast`, `endFast`, `markFastBroken`, `editFastWindow`, `deleteFastWindow` — each fires `FAST_WINDOW_CHANGED` (registered in Phase A)
  - **Render helpers:** `renderTodayFastUI` (TODAY banner state machine — Ready / Active / Broken / Done), `renderDayModalFastEditor` (calendar day modal block), `openFastEditModal` / `saveFastEditFromModal` / `deleteFastWindowFromModal` / `closeFastEditModal`
  - **Live timer:** `startFastTickInterval` — 30 s setInterval refreshes `#fwTimerVal` text; cheap no-op when not on TODAY tab
- **`SK.fastWindows`** (added in Phase A) is now populated by these helpers. Old `SK.fastDays` remains untouched and is interpreted as a 24-hour fast wherever no window exists. **Backward compatible.**
- **`addFoodEntry`** in `app.html` now checks for an active unbroken fast window after logging food; shows a confirm dialog "Break this fast? — BREAK FAST / Cancel". Cancel keeps the fast intact (water, electrolytes, salt, black coffee, green tea allowed mid-fast).
- **Fast banner** on TODAY tab gains a controls strip: live timer, Start/End buttons, Edit Times link.
- **Fast Edit Modal** added (popup-overlay style, matches existing dialogs). Two date+time pickers, "Mark broken" checkbox, Save/Cancel/Delete actions. Cross-midnight overnight fasts handled — start ISO can be on the previous calendar date.
- **Calendar (`modules/calendar.js`)** — `renderCalendar` now colors broken-fast days **orange** (cal-partial) instead of purple (cal-fast), for both today and past days. Uncomplicated fast days remain purple. `openDayModal` now shows the fast-window editor block on past fast days; tap Edit Times to backfill or correct historical fast windows.
- **Module loader** at `app.html:1325` registers all fast-window exports on `window.*` for inline-script + onclick-handler access (same pattern as workout-card / rule-card / checklist).
- **CSS** — new `.fast-banner-controls`, `.fw-state`, `.fw-timer`, `.fw-meta`, `.fw-broken-pill`, `.fw-btn`, `.fw-btn-start`, `.fw-btn-end`, `.fw-btn-edit`, `.fw-btn-row`, `.fast-window-editor`, `.fw-editor-title` classes added inline in `app.html`.
- **No data migration** — fastWindows[date] is empty by default; readers fall back to existing fastDays. The Phase A migration v1→v2 already registered the schema version bump.
- **Phase plan:** `docs/CALIBRATION_PHASE_C_PLAN.md`.
- **No `sw.js` change** — CACHE_NAME bumps once at merge to main per CLAUDE.md feature-branch convention. **`components/fast-window.js` will need to be added to the sw.js cache list at merge time.**

---

## Version 6.3.0 — 2026-04-26

**Scope:** Minor (calibration project — Phase B; new auto-recompute behavior on weight log)
**Banner:** shown — "TDEE now updates automatically when you log a new weight. Lose weight → TDEE drops; gain weight → TDEE rises. No more manual auto-fill."

- **`recomputeTDEE()`** added near `computeAutoTDEE` in `app.html`. DOM-free Mifflin-St Jeor recompute that reads weight from the latest weight log and reads height/age/sex/activity multiplier from `settings`. Returns `null` if any input is missing or if `settings.tdeeManualOverride` is truthy (override flag ships in Phase D).
- **`recomputeAndApplyTDEE()`** wrapper. Compares the recomputed TDEE to `settings.tdee`, writes if different, fires `TDEE_CHANGED` (added in Phase A). Returns true/false. Skips dispatch when no change.
- **`logWeightFromToday()`** and **`logWeight()`** now call `recomputeAndApplyTDEE()` after `saveDayLogField()` and before the existing `dispatch('WEIGHT_LOGGED')`. Weight loss → lower TDEE; weight gain → higher TDEE. Cascades to projection, goal bar, duration bar, nutrition macros, radar.
- **`autoFillTDEE()`** now fires `dispatch('TDEE_CHANGED')` after `saveSettings(s)`. Pre-existing bug fix: previously the function wrote `s.tdee` silently and dependent UI stayed stale until another event triggered a re-render.
- **Phase plan:** `docs/CALIBRATION_PHASE_B_PLAN.md`.
- **No** `sw.js` change (CACHE_NAME bumps once at merge to main).

---

## Version 6.2.5 — 2026-04-26

**Scope:** Patch (calibration project — Phase A scaffolding; no user-visible behavior change)
**Banner:** none (patch)

- **New storage key `SK.fastWindows = 'ph_fw_v1'`** added to the SK object in `app.html`. Empty by default. Will hold per-day fast-window timestamps `{ start, end, broken, brokenBy }` once Phase C ships. Existing `SK.fastDays` is untouched and continues to work; calendar/checklist/radar readers fall back to the legacy boolean (interpreted as a 24-hour fast).
- **Two new dispatch events** registered in `DISPATCH_MAP`:
  - `TDEE_CHANGED → ['projection','durationBar','goalBar','nutritionMacros','radar']` — fired by Phase B/D when calibration writes a new TDEE.
  - `FAST_WINDOW_CHANGED → ['fastUI','checklist','calendarCell','projection','radar']` — fired by Phase C when a fast window starts, stops, edits, or breaks.
  No new dispatch targets — every target name already existed in the `dispatch()` switch.
- **Schema migration v1 → v2** registered in `migrations/registry.js`. Purely additive — no data is read, transformed, or rewritten. `requiresBackup: false`. The migration only bumps the schema-version record so future migrations can build on this state.
- **No `sw.js` change** (per CLAUDE.md feature-branch convention; CACHE_NAME bumps once at merge to main).
- **Phase plan:** `docs/CALIBRATION_PHASE_A_PLAN.md` documents scope, files touched, smoke test, and acceptance criteria.

---

## Version 6.2.4 — 2026-04-21

**Scope:** Patch (landing page content corrections; app unchanged)
**Banner:** none (patch)

- **Stats corrected** on `index.html`. "60+ UPDATES" and "60+ SHIPPED" were stale (actual version count is 85+). Bumped both stat displays to `85+`. Visitors now see an accurate cadence indicator.
- **Changelog entry for v6.2.3 rewritten** to accurately describe the release. Previously the "current" entry had bullets for the plan-aware calorie work (actually v6.2.0-v6.2.2). Now v6.2.4 entry describes the landing redesign + animated install guide + these content corrections, and a new v6.2.2 entry was added below it to cover the calorie/radar work chronologically.
- **Plan cards qualifier added.** The section description now explicitly notes "Calorie numbers below are typical presets — every plan is user-configurable in Settings." Clarifies that the displayed numbers (LITE 1200, CUT 1500, AGRO 1000, BULK +300, MAINTENANCE TDEE ±200) are editorial typicals rather than hard plan defaults.
- **Version surfaces synced** to `v6.2.4` across title, nav badge, hero badge, install-guide header, stat card, footer, cache-bust query strings (`?v=6.2.4`).
- **`sw.js`:** bumped `CACHE_NAME` to `v25` to force visitors to fetch the updated landing on their next visit.

---

## Version 6.2.3 — 2026-04-21

**Scope:** Patch (landing page redesign + animated install guide; app unchanged)
**Banner:** none (patch — only new visitors see the landing; installed PWA users skip via the standalone redirect)

- **New landing page (`index.html`) shipped** with a full visual redesign: hero, anywhere/globe section, features, power, plans, changelog, science, FAQ, and a new **animated install guide modal** with three tabs (Android/iOS/Desktop). Each tab auto-advances through its platform-specific steps with a live device mockup, tap-ring pulses, timeline progress, and synchronized step list.
- **New `assets/` directory** with 9 files: 5 CSS (`landing.css`, `landing-sections.css`, `landing-demos.css`, `landing-v5.css`, `install-guide.css`), 3 JS (`landing.js`, `landing-v5.js`, `install-guide.js`), 1 JSON (`land-110m.json` — world map topology for the "ANYWHERE" section's interactive globe).
- **PWA standalone redirect preserved** at the very top of `<head>`. Users who have already installed the PWA never see the landing page — their app icon opens `index.html` → inline script fires before paint → `window.location.replace('app.html')`.
- **Logos use existing repo-root assets.** Handoff bundle included `assets/PH_ARROWS_LOGO.png` (duplicate of the existing one at repo root); skipped to avoid duplication. All image refs in the new `index.html` were rewritten to point at the repo-root `PH_ARROWS_LOGO.png` and `PH_LOGO_192.png`. `hero3d.js` in the handoff was also unused (never referenced by `index.html`); skipped.
- **Cache-bust query strings aligned** to `?v=6.2.3` across all 5 CSS and 3 JS asset references for consistent invalidation on returning visitors.
- **Version surface consistency:** title, nav badge, hero badge, changelog entry, footer, all note `v6.2.3`. Historical changelog entries for prior versions left untouched.
- **`sw.js`:** bumped `CACHE_NAME` to `v24` and added the 9 new `assets/*` files to the critical cache list so the landing page + install guide work offline for returning visitors.
- **`app.html`:** bumped `APP_VERSION` to `6.2.3`. No code behavior changed.
- **Cleanup:** the handoff `Temp/` directory was removed from the repo after the migration; only the production assets remain.

---

## Version 6.2.2 — 2026-04-21

**Scope:** Patch (cleanup pass — dead code, docs, repo polish; no behavior change)
**Banner:** none (patch)

- **Dead code removed:** `idbGet(key)` in `app.html` was never called anywhere in the repo (only `idbGetAll` and `idbPut` are used). Deleted.
- **`ARCHITECTURE.md` stale claim fixed:** the "app.html — Single File Application" subgraph label updated to reflect the post-v6.0.0 modular structure; added a top-of-file note explaining the doc covers domain logic and pointing readers to `CLAUDE.md` §23 for the module layout.
- **`README.md` added** at repo root — short visitor-facing intro: what the app does, architecture at a glance, documentation map, editing rules (with pointers to `CLAUDE.md`).
- **`docs/REFACTOR_COMPLETE.md` added** — consolidated retrospective of the 2-day v5.0.1 → v6.0.0 modular refactor: phase ladder, file-level delta, interop pattern rationale, decisions made, post-refactor bugs found and fixed, owner-confirmed smoke results, lessons. Replaces the per-phase summary docs that were never written (owner used batched testing strategy).
- **`CLAUDE.md` §14 (Related Documentation) expanded** to cover `README.md`, `WORKING_VERSIONS.md`, `docs/REFACTOR_COMPLETE.md`, and the `docs/PHASE_N_PLAN.md` files with honest descriptions of each.
- **Comprehensive audit run:** 5 scans across repo structure, dead code, bugs, documentation, and data integrity. Only findings were the items above — code-level invariants (onclick resolution, import resolution, module-to-window assignments, DOM ID references, SK key usage) all scanned clean.
- **`sw.js`:** bumped `CACHE_NAME` to `v23`.

---

## Version 6.2.1 — 2026-04-21

**Scope:** Patch (calendar root-cause fix — calorie info item missing from legacy days)
**Banner:** none (patch)

- **Root cause fix for "all past days showing partial orange".** `migrateOrphanedChecks` previously updated the `f2` calorie info check value ONLY when `f2` was already present in the day's `checks` object. Legacy days where the user never tapped the calorie card had `f2` missing entirely. The completion counter (`getValidCheckCompletion`) counts every plan-checklist item in the denominator and treats missing as not-done — so a day with all 18 other items ticked plus a missing f2 showed as 18/19 = 94.7% → partial.
- **Fix:** removed the `(item.id in checks)` guard in `migrateOrphanedChecks`. Info items (`type: 'info'`, e.g. `f2` across all plans) are now always populated from the food log via `evalCalorieStatus`. On next reload, every past day's `f2` auto-computes:
  - Day with no food log → `f2 = true` (no penalty, no log means nothing to judge).
  - Day with food ≤ ceiling → `f2 = true` (green card).
  - Day with food > ceiling but < 1.5× → `f2 = true` (orange card, still passes).
  - Day with food ≥ 1.5× ceiling → `f2 = false` (red card, day fails).
- **Effect on owner's data:** days 3/23-3/31 that were fully ticked with food 750-1300 cal will flip back to green on next reload. Days that genuinely had calorie overages ≥ 1.5× ceiling stay partial/red.
- **`sw.js`:** bumped `CACHE_NAME` to `v22`.

---

## Version 6.2.0 — 2026-04-21

**Scope:** Minor (Calorie logic rebuilt plan-aware + calendar semantics fix)
**Banner:** "Calorie logic rebuilt per plan: CUT/LITE/MAINTENANCE ≤ceiling=green, ceiling-1.5×=orange, ≥1.5×=red+fails day. BULK ≥target=green, >0.5×=orange, ≤0.5×=red+fails day. Past days will re-evaluate on reload."

- **Plan-aware calorie card logic (new utility `evalCalorieStatus` in `app.html`)** replaces the three duplicated threshold blocks in `components/checklist.js` (render + refresh) and `migrateOrphanedChecks` in `app.html`.
- **CUT / LITE / MAINTENANCE plans (goalMode === 'cut' or 'maintenance'):**
  - `actual ≤ ceiling` → **GREEN** (at or under cap — ideal cut day). Does NOT fail day.
  - `ceiling < actual < ceiling × 1.5` → **ORANGE** on TODAY card only. Does NOT fail day. Calendar stays green/partial based on other items.
  - `actual ≥ ceiling × 1.5` → **RED** on TODAY card. **Fails the day** (calPass=false). Calendar marks partial due to this single item.
- **BULK plan (goalMode === 'bulk'):**
  - `actual ≥ target` → **GREEN** (met or exceeded target).
  - `target × 0.5 < actual < target` → **ORANGE** on TODAY card. Does NOT fail day.
  - `actual ≤ target × 0.5` → **RED**. Fails day (severely under target).
- **Previous v6.1.0 regression fixed.** v6.1.0 mistakenly flipped the red threshold to `> ceiling` (any overshoot fails), which falsely marked everything between `ceiling` and `ceiling × 1.5` as failing. Days with 1113 cal on a 1000 ceiling (11% over — normal cut variation) were incorrectly partial. Restored to the original intent: only ≥50% overshoot fails.
- **Auto re-evaluation on load.** `migrateOrphanedChecks` runs every init and re-computes stored `f2` (calorie info) check values from the food log using the new evaluator. Past days will retroactively correct to the new bands on next reload — no user action needed.
- **`sw.js`:** bumped `CACHE_NAME` to `v21`.

---

## Version 6.1.0 — 2026-04-21

**Scope:** Minor (Post-refactor regression fixes + radar consistency + UX polish)
**Banner:** "Calorie card bands restored (≤1000 green, 1001-1500 orange, >1500 red = fails day). Radar consistency + fasting axes now use the same checklist counter as the calendar."

- **Calorie card color bands restored to pre-refactor behavior.** Thresholds on the TODAY calorie info card and the auto-refresh code:
  - `actual ≤ ceiling × 2/3` (≤1000 when ceiling is 1500) → GREEN
  - `ceiling × 2/3 < actual ≤ ceiling` (1001-1500) → ORANGE — doesn't fail the day
  - `actual > ceiling` (>1500) → RED — fails the day (calPass = false)
  Previously (post-refactor regression): red threshold was at `ceiling × 1.5` (2250), so 1501-2249 cal days were scored as "pass" and flooded calendar with false-green days. Fix brings the threshold back to `ceiling`, matching owner's actual intent. Applied in three places: `components/checklist.js` render, `components/checklist.js` refresh, `app.html` `migrateOrphanedChecks`.
- **Radar CONSISTENCY axis aligned with calendar.** Previously computed `checklistDepth` from `plan.checklistNormal.length` (parent-only counter). Now uses `getValidCheckCompletion(ds)` — same source of truth the calendar uses. Fixes parent-aggregate under-counting for supplement groups (a group with N subs used to count as 1 item; now counts as N).
- **Radar FASTING axis aligned with calendar.** Previously used `Object.values(log.checks).filter(Boolean).length / .length` — unfiltered by valid IDs, could include orphans. Now uses `getValidCheckCompletion(ds)` — same as calendar + CHECKLIST axis.
- **Schema card explanation added.** Settings → Data Management → Schema card now has a one-line description: "Tracks the data-shape version of your stored data. Used internally to safely upgrade your data when the app changes how things are saved. Safe to ignore."
- **Expected user-visible effect:** past days with 1501-2249 cal that previously displayed green will now display partial. This matches the pre-refactor intent (over-ceiling = fails day). Radar CONSISTENCY and FASTING axis values may shift slightly to reflect true checklist completion (usually slightly lower because the denominator is more accurate).
- **`sw.js`:** bumped `CACHE_NAME` to `v20`.

---

## Version 6.0.0 — 2026-04-21

**Scope:** Major (Architecture refactor complete — Phase 6 of 2-day refactor)
**Banner:** "Architecture refactor complete. Zero behavior change; app is now modular under the hood."

- **Refactor milestone.** The 2-day modular refactor that began with v5.1.0 is complete. Zero observable behavior change across the six phases; the app is now a modular ES-module PWA with a ~4,600-line bootstrap (`app.html`), plan definitions under `plans/`, large function groups under `modules/`, shared UI helpers under `components/`, and a schema-migration framework under `migrations/`. See `CLAUDE.md` Section 23 for the full architecture.
- **CLAUDE.md gains four new sections:**
  - Section 23 — Modular Architecture (post-refactor directory map + the bare-name/globalThis interop pattern + startup sequence + change-location guide).
  - Section 24 — Schema Migration Playbook (copy-pasteable migration template + rules).
  - Section 25 — Working With This Codebase (session-start checklist, feature / bugfix / rollback procedures, non-negotiable principles).
  - Section 26 — File Line-Count Governance (soft limits with current actuals).
- **Stale prose fixed:** removed "single-file" / "one HTML file" / "~5000+ lines" claims from Sections 2, 5, 10, and 13.
- **`sw.js`:** `CACHE_NAME` bumped to `v19`.
- **`index.html`:** hero-badge updated to `v6.0.0`.
- **Zero app code changed in Phase 6** — it's pure documentation + version bump.

**Cumulative refactor delta (v5.0.1 → v6.0.0):**
- `app.html` reduced from ~8,572 lines to ~4,600 (-46%).
- New directories: `plans/` (7 files), `modules/` (4 files), `components/` (3 files), `migrations/` (3 files) — 17 module files loading natively via ES-module `<script>` tags.
- New infrastructure: schema version tracking (`ph_sch_v1`), auto-backup before destructive migrations, future-schema-backup guard on restore.
- New discipline: `WORKING_VERSIONS.md` append-only log, per-phase git tags (`vX.Y.Z-working`), version-tagging rule in CLAUDE.md §11.

---

## Version 5.5.0 — 2026-04-21

**Scope:** Minor (Shared components extraction — Phase 5 of 2-day refactor)
**Banner:** "Under the hood: shared UI components extracted. No behavior change."

- **Extracted shared UI helpers from `app.html` into the new `components/` directory:**
  - `components/workout-card.js` — `exRow`, `exRowWithLevel`, `workoutCard`, `stretchRow`, `_resetExRowInstances`, plus module-scoped `_exRowInstanceCount` and `_wexCounter` state (54 lines).
  - `components/rule-card.js` — `ruleCard` (4 lines).
  - `components/checklist.js` — full TODAY-tab checklist lifecycle: `renderTodayChecklist`, `loadChecklist`, `toggleSupExpand`, `toggleSupItem`, `updateSupCount`, `toggle`, `toggleWaterExpand`, `onWaterInput`, `adjustWater`, `updateWaterCardState`, `saveAllChecks`, `syncAutoStatusChecks`, `refreshAutoItems`, `resetToday` (404 lines).
- **`app.html` reduced by another ~456 lines** (from ~5045 to ~4590). All content byte-identical to source, verified via text-diff.
- **Module interop:** a fourth `<script type="module">` shim imports the three component modules and promotes all exports to `window.*`. Plans' `workoutContent`/`rulesContent` templates continue to call `exRow`, `workoutCard`, `ruleCard`, etc. by bare name — resolved via globalThis fallback.
- **`runInit()`** now awaits a fourth readiness event, `ph:components-ready`, after the existing migrations/plans/fnmodules gates.
- **Module-local state:** `_exRowInstanceCount` and `_wexCounter` (used by `exRowWithLevel`, `exRow`, `stretchRow` to generate unique row IDs) live inside `components/workout-card.js`. External callers clear them via the exported `_resetExRowInstances()`.
- **`sw.js`:** bumped `CACHE_NAME` to `v18` and added the three `components/*.js` paths to the critical cache list.
- **`index.html`:** hero-badge updated to `v5.5.0`.
- **Part B (judgment-heavy factoring of in-plan duplication) was NOT done** — prompt recommended skipping; app would gain filing-cabinet value at meaningful risk. Left as a post-refactor backlog item if ever warranted.

---

## Version 5.4.0 — 2026-04-21

**Scope:** Minor (Large function extraction — Phase 4 of 2-day refactor)
**Banner:** "Under the hood: export, calendar, and radar load as separate modules. No behavior change."

- **Extracted four large function groups from `app.html` into the new `modules/` directory:**
  - `modules/schedule-html.js` — `downloadScheduleHTML` (233 lines)
  - `modules/radar.js` — `setRadarWindow`, `computeRadarMetrics`, `renderRadar`, plus the module-scoped `radarWindow` state (411 lines)
  - `modules/calendar.js` — `changeMonth`, `renderCalendar`, `openDayModal`, 6 modal handlers (`toggleModalCheck`, `toggleModalSupItem`, `toggleModalWorkoutChecklist`, `toggleModalWorkoutEx`, `toggleFastDay`, `toggleLightDay`), `saveDayLog`, `closeModal`, plus the module-scoped `calYear`/`calMonth` state and the modalOverlay click-outside listener (583 lines)
  - `modules/export.js` — `openExport`, `generateExport` (with all nested helpers), `renderMarkdownPreview`, `inlineFormat`, `copyExport`, `downloadReport` (716 lines)
- **`app.html` reduced by another ~1943 lines** (from ~6929 to ~4990). All extracted code is byte-identical to its former inline source, verified by text-diff before removal.
- **Module interop:** a new `<script type="module">` shim imports the four modules and promotes each exported function to `window.*`. Runtime callers (classic script + HTML onclick handlers) continue to resolve bare identifiers (`renderCalendar()`, `openDayModal('2026-04-10')`, etc.) via globalThis fallback.
- **Globals exposure:** the classic script explicitly runs `Object.assign(window, { SK, MONTHS_LIST, DAYS_SHORT, AUTO_WORKOUT_IDS, WORKOUT_ITEM_SESSION })` so the extracted modules can reference those `const` bindings by bare name. Function declarations are automatically window-attached; only `const`/`let` needed explicit exposure.
- **New startup gate:** `runInit()` now awaits a third readiness event, `ph:fnmodules-ready`, after the existing migrations-ready and plans-ready gates.
- **Module-local state:** `radarWindow` (default 7-day radar window) lives inside `modules/radar.js`; `calYear`/`calMonth` (current calendar month pointer) lives inside `modules/calendar.js`. Neither is reachable from the classic script — the module exports the functions that read/mutate them.
- **`sw.js`:** bumped `CACHE_NAME` to `v17` and added the four `modules/*.js` paths to the critical cache list.
- **`index.html`:** hero-badge updated to `v5.4.0`.

---

## Version 5.3.0 — 2026-04-20

**Scope:** Minor (Plan extraction — Phase 3 of 2-day refactor)
**Banner:** "Under the hood: plan definitions now load as separate files. No behavior change."

- **Extracted all 5 plan objects and `EXERCISE_PROGRESSIONS` from `app.html` into ES modules** under the new `plans/` directory: `lite.js` (historical `default` key), `agro.js`, `cut.js`, `bulk.js`, `maintenance.js`, `exercise-progressions.js`, plus `index.js` that assembles the `PLANS` object and maps the historical `default` key to LITE PROTOCOL.
- **`app.html` reduced by ~1765 lines** — the inline plan definitions (previously ~L2253-L4027) are now a 10-line pointer comment.
- **Module interop:** new `<script type="module">` loader in `<body>` imports from `plans/index.js` and promotes `PLANS` + `EXERCISE_PROGRESSIONS` to `window.*`. Dispatches a `ph:plans-ready` event; `runInit()` awaits this gate alongside the existing `ph:migrations-ready` gate.
- **Byte-fidelity:** every extracted plan was verified identical to its original source lines via text diff before the source was removed. Zero behavior change.
- **Backward compatibility:** users whose `settings.plan === 'default'` continue to see LITE PROTOCOL — the historical key is explicitly mapped in `plans/index.js`.
- **`sw.js`:** bumped `CACHE_NAME` to `v16` and added the 7 new `plans/*.js` paths to the critical cache list so the whole app works offline.
- **`index.html`:** hero-badge updated to `v5.3.0`.

---

## Version 5.2.0 — 2026-04-20

**Scope:** Minor (Bugfixes — Phase 2 of 2-day refactor)
**Banner:** "Calendar accuracy: compliance now measured against full checklist, not just items you touched. Some past days will shift from green to partial — this is correct."

- **`getValidCheckCompletion` denominator bug fixed.** Total is now computed from the filtered checklist definition (items + day-filtered sub-items + `_workout` when rendered), not from the count of check entries the user had previously touched. Past days that were green from partial compliance now correctly display as partial or missed. Parent items with sub-items are no longer double-counted; the parent is a derived aggregate per `loadChecklist`, only the sub-items themselves count toward the ratio.
- **`idbSyncAll` no longer silently swallows errors.** Replaces the empty `catch {}` with `console.warn` including the storage key and error, so IndexedDB mirror sync failures are visible in devtools.
- **`idbAutoRestore` surfaces partial restore failures to the user.** Tracks failed keys, logs each with `console.error`, and shows a `showAlert` after init if any key couldn't be written back from the IDB mirror to localStorage.
- Bumped `CACHE_NAME` to `v15`, hero-badge to `v5.2.0`.

---

## Version 5.1.0 — 2026-04-20

**Scope:** Minor (Migration framework — Phase 1 of 2-day refactor)
**Banner:** "Data safety: migration framework installed. Your existing data is untouched."

- **Added `migrations/` directory** with three ES modules: `runner.js`, `registry.js`, `helpers.js`. All loaded via `<script type="module">` from `app.html` and promoted to `window.*` for use from the main inline script.
- **New schema version tracking** via `ph_sch_v1` localStorage key. On first run of v5.1.0 the record is established with `schemaVersion: 1` and `establishedFrom: 'existing-user' | 'fresh-install'`. No migrations registered in this release — the framework ships empty.
- **Backup JSON expanded** with two additive fields: `schemaVersion` and `appVersion`. Old backups (without these fields) continue to restore cleanly — missing `schemaVersion` is treated as `1`.
- **Restore guard added:** backups from a future schema version are rejected with a clear message instructing the user to update the app first. Prevents silently loading data the current app can't interpret.
- **Auto-backup mechanism** in the migration runner: any migration with `requiresBackup: true` triggers a JSON download of all `ph_*` keys before running. No migrations use this yet, but the plumbing is in place for Phase 3+.
- **Settings → Data Management:** new SCHEMA card displays the current schema version. EXPORT MIGRATION LOG button downloads the full `ph_sch_v1` record.
- **`runInit()` converted to async** and reordered: wait for migrations module → `idbAutoRestore` → `runMigrations` → rest of init. Halts with alert if migrations fail. Entry-point IIFE simplified since conditional IDB branching moved into `runInit`.
- **`sw.js`:** bumped `CACHE_NAME` to `protocol-health-v14` and added the three `migrations/*.js` paths to the critical cache list. Framework works offline.
- **`index.html`:** hero-badge updated to `v5.1.0` (corrected lingering `v5.0.0` drift from pre-5.0.1).

---

## Version 5.0.1 — 2026-04-08

**Scope:** Patch (Day modal food log macro inputs)

- **Macro inputs added to MONTHS day modal food logger** — The food log input in the day modal (opened by tapping any past day on MONTHS tab) now includes Protein, Carbs, and Fat fields matching the TODAY tab's food logger. Previously only Name and Calories were available, so past-day food entries couldn't include macros.

---

## Version 5.0.0 — 2026-04-07

**Scope:** Major (Lite Protocol + Supplement Toggle)
**Banner:** "Lite Protocol: gentle workouts for all ages. Supplement tracking now optional in Settings."

- **Default Protocol renamed to Lite Protocol** — Complete rewrite of the default plan. New identity: "Gentle. Sustainable. For every body." Plan key (`'default'`) unchanged for backward compatibility with existing localStorage data.
- **New workout content** — Chair Strength A/B/C (Mon/Wed/Fri) with seated exercises, wall push-ups, and isometric holds. Tai Chi Flow (Tue), Gentle Yoga (Thu), Mat Pilates + Balance (Sat). All exercises safe for elderly and limited mobility — no push-ups, burpees, or high-impact movements.
- **New nutrition content** — 30/45/25 macro split (protein/carbs/fat). Gentle deficit guidance (300–500 cal below TDEE, 0.25–0.5 kg/week). Supplement section (D3, Omega-3, Magnesium, Calcium, Multivitamin) with NIH safety notes, conditional on supplement toggle.
- **New rules content** — 13 rules covering eating (6), training (4), discipline (3). Gentle and encouraging language. Includes "Consult your doctor before starting" as Rule 13.
- **New checklists** — Normal day (15 items), fast day (5 items), light day (6 items). Supplement sub-items (D3, Omega-3, Magnesium) as expandable panel.
- **Global supplement toggle** — New `supplementsEnabled` setting (defaults to `true`). Toggle in Settings panel controls whether SUPPLEMENTS group items render in TODAY checklist, day modal, and completion scoring. All plans affected. AGRO users unaffected — `undefined` in saved settings evaluates as `true`.
- **Supplement filtering in completion** — `getValidCheckCompletion()`, `renderTodayChecklist()`, and `openDayModal()` all filter out SUPPLEMENTS items when disabled. Calendar cell colors, progress bars, and radar chart reflect the filtered set.
- **Updated labels** — "LITE PROTOCOL" in header badge, settings dropdown, active plan banner, splash screen, index.html plan switcher. No visible references to "DEFAULT PROTOCOL" remain.
- **PLANS.agro unchanged** — Not one line modified. All AGRO-specific code (resolveSupplementSub, zinc schedule, workout/nutrition/rules content) preserved byte-for-byte.
- **DEFAULT CUT overhauled** — New multi-modal training: Resistance 3x/week (upper/lower/full body) + HIIT 2x/week (circuits + shadowboxing + jump rope) + active recovery yoga + daily walking. 40/35/25 macro split. Supplement sub-items (creatine, D3, omega-3, magnesium). 12 rules (6 eating, 4 training, 2 discipline).
- **DEFAULT BULK overhauled** — Tempo 3-1-2-0 on all primary compounds. Animal Flow mobility sessions. Pilates core work. Isometric finishers (push-up bottom hold, deep squat hold). 30/50/20 macro split. Per-meal protein dosing (0.40–0.55g/kg). Calorie cycling. 14 rules with science citations.
- **DEFAULT MAINTENANCE overhauled** — Multi-modal variety: Bodyweight Resistance A/B + Cardio Rotation (4 options) + Yoga/Pilates (alternate weeks) + Animal Flow + Saturday recreation. 30/45/25 macro split. Monthly weight drift check. Skill-based progression goals. 12 rules.
- **All plans get supplement sub-items** — Cut, Bulk, Maintenance checklists now include SUPPLEMENTS group with expandable sub-items (creatine, D3, omega-3, magnesium), controlled by the global supplement toggle.
- **Nutrition conditional on supplement toggle** — All plans show supplement cards in NUTRITION tab only when supplementsEnabled is true. Otherwise show "Enable in Settings" message.
- **index.html plan descriptions updated** — Cut, Bulk, Maintenance plan switcher descriptions reflect new multi-modal training content.

---

## Version 4.6.0 — 2026-04-05

**Scope:** Minor (Calendar update bug fix + export report overhaul)
**Banner:** "Calendar updates instantly on modal edits. Export report overhauled: date range fixed, compliance labels clarified, non-scheduled section removed, fast day status corrected, pluralization fixed."

- **BUG FIX: Calendar cell color now updates immediately on modal check toggle** — `closeModal()` now calls `renderCalendar()` when the MONTHS tab is active, ensuring calendar cells reflect the latest check state the moment the modal closes. Previously, cell colors could remain stale (e.g. orange instead of green) until a tab switch or app reload.
- **Export report date range fixed** — Default "From" date now uses schedule start date (or settings start date, or first logged date) instead of hardcoded 30 days ago. Report period accurately reflects the actual data window.
- **Non-Scheduled Days section removed** — The confusing "Non-Scheduled Days" segment (showing days before the schedule existed) is replaced with a brief footnote if any logged days exist outside the schedule window.
- **Compliance section overhauled** — Added day-level compliance summary (days at 100%, partial, no data). Category breakdown now uses descriptive labels ("Morning routine items" instead of "MORNING") with an explanatory subtitle. `type:'info'` items (f2 calorie ceiling card) excluded from compliance calculations.
- **Weak spots exclude info items** — The f2 calorie ceiling info card no longer appears in weak spots. Weak spot labels now include day type context (e.g. "(fast days)") and use proper pluralization.
- **Fast Days Completed fixed** — Only counts fast days up to today, not future scheduled ones. Displays as "6 / 6 so far (13 total in plan)" instead of the misleading "6 / 13 scheduled".
- **Broken Fast Days labeled correctly** — "Fast Days (food logged)" renamed to "Broken Fast Days" with explanatory note. Status shows "Fast broken" instead of incorrect "On track" for any food consumed on fast days.
- **Section descriptions added** — Summary, Compliance, Nutrition (eating days), Weight Trend, Notes, and Daily Log sections now include one-line descriptions explaining what they show.
- **Daily Log legend added** — Status column now has a legend: Full = 100%, Good = 70–99%, Partial = 50–69%, Low = below 50%. Threshold for "Good" corrected from 75% to 70% to match.
- **Pluralization fixed** — All day count displays use proper singular/plural ("1 day" not "1 days") throughout the report.

---

## Version 4.5.3 — 2026-04-01

**Scope:** Patch (Migration corrects stale historical workout/water/calorie checks)

- **Stale workout auto-items fixed** — `migrateOrphanedChecks()` now detects days where `workoutSessions` shows completion (≥80% per session) but the checks for m2/m3/e1/e2/e3 are `false`. Corrects them to `true`. Also fixes `_workout` item from global counts.
- **Stale water items fixed** — If `dayLogs[date].water` meets the plan's water target but `checks[waterItemId]` is `false`, corrects it to `true`.
- **Stale calorie info items fixed** — Recomputes f2 pass/fail from actual food log data for each historical day. If calories ≤ ceiling×1.5, f2 = true (pass). Over 150% = false (fail).
- **Root cause:** These items were saved as `false` by versions before v4.4.0 which didn't have auto-workout per-session tracking, water input syncing, or info card logic. The `checks` object retained stale values that `getValidCheckCompletion()` counted as failures.
- **Affected days:** Any eating day where all workouts were done but the pre-v4.4 code wrote m2/m3/e1/e2/e3 as false. March 30 is the primary example.

---

## Version 4.5.2 — 2026-04-01

**Scope:** Patch (Audit warning fixes — loadChecklist guard + backup timestamp migration)

- **loadChecklist() info guard** — Added `item.dataset.type !== 'info'` to the else branch condition. Info items no longer get `.done` class toggled during checklist load, preventing CSS conflict with their dynamic background color.
- **Backup timestamp migrated to SK** — Added `SK.backupTs = 'ph_bts_v1'` to the storage key registry. All 3 raw `localStorage.getItem/setItem('ph_last_backup_ts')` calls replaced with `gs(SK.backupTs)` / `ss(SK.backupTs)`. Backup timestamp is now included in backup exports, restored from backup files, and mirrored to IndexedDB.
- **BUG 1 (updateProgress) was already fixed** in v4.5.1 — info items are counted via `data-cal-pass` attribute, not excluded. Severe overshoot (>50% over ceiling) correctly fails the day per user requirement.

---

## Version 4.5.1 — 2026-04-01

**Scope:** Patch (Calorie card severe overshoot now counts toward day completion)

- **Calorie card counts toward completion** — The info card (f2) is NOT a checkbox but its pass/fail state IS written to checks and counted by `updateProgress()`, `getValidCheckCompletion()`, calendar scoring, and radar CHECKLIST axis. Under ceiling or mildly over (≤50%) = pass. Severely over (>50%) = fail, making the day partial.
- **`updateProgress()` bug fixed** — Was counting all `.check-item` elements uniformly. Now reads `data-cal-pass` attribute for info items to determine pass/fail instead of checking `.done` class.
- **`saveAllChecks()` persists f2** — Info items saved to checks with `calPass` boolean from `data-cal-pass` attribute.
- **`refreshAutoItems()` persists f2** — When food is logged, f2 pass/fail is immediately written to checks so calendar and radar update in real-time.
- **`getValidCheckCompletion()` includes f2** — Reverted the info-item exclusion. f2 is now a valid check ID that participates in completion scoring.
- **`migrateOrphanedChecks()` keeps f2** — No longer deletes f2 from historical checks. Info items are included in the valid ID set.
- **Day modal shows severity** — Past day info cards show ✗ icon on severe overshoot, ✓ on under ceiling.

---

## Version 4.5.0 — 2026-04-01

**Scope:** Minor (Calorie ceiling info card + orphan migration enhancement)
**Banner:** "Calorie ceiling is now an info card (no longer affects checklist completion). Orphaned check IDs cleaned from version transitions."

### Calorie Ceiling → Info Card
- **`f2` items across all 5 plans** changed from `type:'auto-cal'` to `type:'info'`. No longer a checkbox or auto-status item — now a read-only colored info card.
- **Rendering** — shows `actual / ceiling cal` with green background (under), orange (1–50% over), or red (50%+ over). No checkbox circle, not clickable (`cursor:default`).
- **Excluded from completion** — `getValidCheckCompletion()` now skips `type:'info'` items. They don't count toward checklist percentage, calendar day color, or radar CHECKLIST axis.
- **`saveAllChecks()` skips info items** — `data-type="info"` items are not written to `checks` object.
- **`toggle()` skips info items** — early return guard added.
- **`refreshAutoItems()` updated** — calorie section now updates the info card's background color and status text instead of toggling done/fail classes.
- **Day modal** — past days show the info card with correct color based on food log data for that date.

### Migration Enhancement
- **`migrateOrphanedChecks()` now removes `f2`** from all historical `checks` objects. Days that were orange because of `f2=false` will recalculate as green.
- **Whitelists `wex*` IDs** — workout exercise check IDs (`wex0`, `wex1`, etc.) are no longer deleted by the migration.
- **Info-type items excluded from valid ID set** — items with `type:'info'` are never considered valid check IDs.

---

## Version 4.4.0 — 2026-03-31

**Scope:** Minor (Per-session workout tracking — morning and evening items tick independently)
**Banner:** "Workout items now track per-session: morning exercises tick morning items, evening exercises tick evening items. No more all-or-nothing."

- **Per-session workout tracking** — Workout auto-items (m2/m3, e1/e2/e3) now track INDEPENDENTLY. Morning items (m2 mobility, m3 morning workout) tick when morning session exercises are ≥80% done. Evening items (e1/e2 evening session, e3 stretch) tick when evening session exercises are ≥80% done. Previously all items shared ONE global count and ticked/unticked together.
- **`classifyWorkoutCard()`** — classifies workout cards by title: "MORNING"/"ACTIVATION" → morning session, "REST"/"WALK" → rest (skipped), everything else → evening session.
- **`WORKOUT_ITEM_SESSION` map** — `{ m2:'morning', m3:'morning', e1:'evening', e2:'evening', e3:'evening' }`.
- **`workoutSessions` storage field** — `{ morning: { total, done }, evening: { total, done } }` saved alongside `workoutChecks` in dayLogs. Computed by `toggleWorkoutEx()`, `updateWorkoutProgress()`, and `toggleModalWorkoutEx()`.
- **Fallback for single-session plans** — CUT/BULK/MAINTENANCE plans have no "MORNING" cards. Morning items (m2/m3) fall back to the evening session counts so they still work.
- **Day modal workout checklist** — `toggleModalWorkoutEx()` now computes per-session data from `data-session` attribute on each exercise item. Modal exercises tagged with session type during `toggleModalWorkoutChecklist()`.
- **Fast-day injected `_workout` item** — still uses global totals (single consolidated item).

---

## Version 4.3.0 — 2026-03-30

**Scope:** Minor (Workout checklist in MONTHS day modal)
**Banner:** "Workout checklist in day modal: tap any day on MONTHS, hit See Workout Checklist to check off exercises for that day."

- **"See Workout Checklist" button** in day modal — tap any day on the MONTHS calendar, the modal now has a button below the workout summary. Tapping it expands a full interactive checklist of all exercises scheduled for that day's day-of-week.
- **Exercise generation** — uses a hidden temp container to run the plan's `workoutContent()`, filters cards by the target date's day-of-week (via `data-days` attribute matching `DAYS_SHORT`), extracts all `.wex-row` elements with their names, sets, and stretch styling.
- **Interactive checkboxes** — each exercise has a tappable checkbox. Checking/unchecking saves to `dayLogs[date].workoutChecks` via `toggleModalWorkoutEx()`. Also saves `workoutTodayTotal` and `workoutTodayDone` counts.
- **Live summary update** — the summary button text updates in real-time as exercises are checked ("5/8 exercises done").
- **Dispatches** — fires both `DAY_SAVED` (calendar recolors) and `WORKOUT_CHECKED` (TODAY tab auto-workout items refresh, radar updates).
- **Toggle behavior** — button switches between "SEE WORKOUT CHECKLIST" and "HIDE WORKOUT CHECKLIST".
- **Works for any date** — past, present, or future. Can retroactively check off workouts you forgot to track.

---

## Version 4.2.0 — 2026-03-30

**Scope:** Minor (IndexedDB persistence mirror + backup reminder + storage health)
**Banner:** "Data persistence: IndexedDB mirror auto-recovers if localStorage is wiped. Backup reminder after 7 days. Storage health in settings."

### IndexedDB Mirror — Automatic Data Recovery
- **Every `ss()` write** now mirrors data to IndexedDB via `idbPut()`. IndexedDB is stored at a different iOS filesystem path than localStorage — a partial eviction may clear one but not the other.
- **On app init** — if localStorage is empty but IndexedDB has data, `idbAutoRestore()` silently restores all keys before the UI renders. User never sees it happen.
- **Background full sync** — `idbSyncAll()` runs 2 seconds after init to ensure the mirror is complete.
- **Functions added:** `openIDB()`, `idbPut()`, `idbGet()`, `idbGetAll()`, `idbSyncAll()`, `idbAutoRestore()`.
- **Constants:** `IDB_NAME = 'protocol-health-mirror'`, `IDB_STORE = 'kvstore'`, `IDB_VERSION = 1`.

### Backup Reminder Banner
- **`checkBackupReminder()`** — shows a slide-down banner if 7+ days since last backup and user has 3+ days of data.
- **Banner shows:** "Last backup was X days ago" or "You've never backed up" with BACKUP and LATER buttons.
- **BACKUP button** — dismisses banner and triggers `backupData()`.
- **Timestamp tracking** — `ph_last_backup_ts` saved to localStorage on every successful backup.

### Storage Health Display
- **`renderStorageHealth()`** — shows in Data Management section when settings open.
- **Displays:** localStorage usage (KB), IndexedDB mirror status, persistent storage grant status, last backup age, total origin storage quota/usage (via `navigator.storage.estimate()`).

### Init Flow Change
- **`runInit()`** extracted from IIFE — reusable after async IDB restore.
- **Init sequence:** check localStorage → if empty, attempt IDB restore → then `runInit()`.
- **`checkBackupReminder()`** called at end of init.

---

## Version 4.1.1 — 2026-03-30

**Scope:** Patch (Zinc schedule corrected to true alternate days)

- **Zinc schedule changed from Tue/Thu/Sat to Mon/Wed/Fri** — The previous Tue/Thu/Sat schedule left Monday completely uncovered (Saturday's dose covers Sat+Sun, but Tuesday is 3 days away, leaving Monday with no zinc coverage). New Mon/Wed/Fri schedule provides true alternate-day coverage with no gaps:
  - Mon (eating day): zinc → covers Mon + Tue
  - Wed (fast day): zinc → covers Wed + Thu
  - Fri (eating day): zinc → covers Fri + Sat
  - Sun: covered by Friday (2 days, within range)
- **No consecutive dosing** — Mon→Wed = 2 day gap, Wed→Fri = 2 day gap, Fri→Mon = 3 day gap. All safe.
- **Same weekly total** — 3 × 50mg = 150mg/week = 21.4mg/day avg (under 40mg NIH UL).
- **9 code locations updated** — `s1_c` subItems days `[1,5]`, `sf1_b` subItems days `[3]`, `resolveSupplementSub()` arrays, `nutritionContent()` zinc arrays + next-zinc calc + status cards, `rulesContent()` stack cards + schedule card.
- **Fast day zinc on Wednesday** — Previously no zinc on any fast day (Sat removed, Sun removed). Now Wednesday (fast day) is a zinc day, with zinc appearing in the fast day supplement checklist.

---

## Version 4.1.0 — 2026-03-30

**Scope:** Minor (6 bug fixes — checklist state management, workout threshold, radar scoring, day modal)
**Banner:** "Workout items tick at 80% completion (not all-or-nothing). Fixed stale state bugs in checklist saving. Radar light day scoring fixed."

- **BUG 1: Workout auto-items no longer all-or-nothing** — Items m2/m3/e1/e2/e3 and the injected `_workout` item now tick as done at ≥80% exercise completion (was 100%). Doing 7/8 exercises checks off the item. Shows "— good" label at ≥80%, "— complete" at 100%.
- **BUG 2: loadChecklist guards auto-status items** — The generic `else` branch now skips items with `data-water-target` or `data-auto` attributes instead of overwriting their computed state from stale `checks[id]` values.
- **BUG 3: saveAllChecks() helper replaces inline check-saving** — New centralized function properly handles all item types (regular, sub-items, water, auto-status). Used by `toggle()`, `toggleSupItem()`, and `updateWaterCardState()`. Prevents stale auto-status states from being saved.
- **BUG 4: Day modal handles all item types** — Past day checklist now renders water items (shows L vs target), auto-cal items (shows cal vs ceiling with tick/cross), and auto-workout items (shows exercise count) correctly instead of using stale `checks[id]`. Non-toggleable in modal (read-only status).
- **BUG 5: resetToday preserves auto-status** — Reset now only clears manual items and sub-items. Calls `refreshAutoItems()` to recompute cal/workout states, then `saveAllChecks()` to persist correctly. Auto-items no longer show false negatives after reset.
- **BUG 6: Radar light day scoring fixed** — Light days only count toward `fastScheduled` if actually marked in `lightDaysMap`. Previously, untracked scheduled light days counted as failures (0% completion), inconsistent with fast day logic where unmarked days are simply not scored.
- **BUG 7 (no-fix): Food modal stays open** — Confirmed intentional: users log multiple items in sequence, form clears for next entry while entries list updates live.
- **DOC: index.html footer version updated** — Was stuck at v3.7.0, now shows v4.1.0.

---

## Version 4.0.4 — 2026-03-29

**Scope:** Patch (Fix orphaned checklist IDs + restore electrolyte IDs)

- **Migration on init** — `migrateOrphanedChecks()` runs once on app startup. Compares each day's stored check IDs against the current checklist definition. Deletes orphaned IDs (e.g., old `sf3`, `sf3_a`, `sf3_b`) that no longer exist in any checklist array. Idempotent.
- **`getValidCheckCompletion()` helper** — New function that counts only check IDs that exist in the current checklist. Used by calendar day classification and radar CHECKLIST axis to prevent orphaned IDs from dragging down scores.
- **Calendar scoring fixed** — All 5 check-counting blocks in `renderCalendar()` (today, past fast, past light, past normal) now use `getValidCheckCompletion()` instead of raw `Object.values(log.checks)`.
- **Radar CHECKLIST axis fixed** — `computeRadarMetrics()` checklist scoring now uses `getValidCheckCompletion()` for filtered counts.
- **Electrolyte IDs restored** — Pre-training supplement parent changed from `sf3` to `wf2`. Sub-items changed from `sf3_a`/`sf3_b` to `wf2_a`/`wf3`. Matches original electrolyte IDs to preserve existing localStorage check states.

---

## Version 4.0.3 — 2026-03-29

**Scope:** Patch (AGRO fast day supplement checklist restructure)

- **MCT gel split into two items** — Morning stack (`sf1`) now has 1 MCT gel (fat carrier for D3). New pre-training stack (`sf3`) has 1 MCT gel (pre-training energy). Previously both were lumped as "2 gels" in the morning stack.
- **Electrolytes paired by time of day** — Morning electrolyte (`sf1_d`) moved into the morning stack expandable panel. Pre-training electrolyte (`sf3_b`) moved into the new pre-training stack expandable panel. Previously both were standalone items (`wf2`, `wf3`).
- **New pre-training expandable item** — `sf3` with subItems `sf3_a` (MCT gel) and `sf3_b` (electrolyte). Same expand/collapse behavior as morning stack.
- **Old standalone electrolyte items removed** — `wf2` and `wf3` replaced by sub-items inside the morning and pre-training stacks. Existing check states for `wf2`/`wf3` in localStorage are orphaned (no data loss, just no longer displayed).

---

## Version 4.0.2 — 2026-03-29

**Scope:** Patch (Safety fix — zinc consecutive-day dosing)

- **Zinc schedule corrected** — Removed Sunday from zinc days to prevent consecutive Sat→Sun dosing (100mg in 48 hours blocks copper absorption). New schedule: Tue/Thu/Sat only (3 days/week, 150mg/week, 21.4mg/day avg — well under 40mg NIH UL).
- **8 code locations updated** — `checklistNormal` s1 subItems (`days:[2,4,6]`), `checklistFast` sf1 subItems (`days:[6]`), `nutritionContent()` zinc arrays and status cards, `rulesContent()` supplement stack cards and zinc schedule card, `resolveSupplementSub()` zinc day arrays and comment.
- **All zinc references verified** — no remaining "Sun" as a zinc day, all averages updated to 21.4mg/day, all schedules say "Tue/Thu/Sat".

---

## Version 4.0.1 — 2026-03-28

**Scope:** Patch (3 bug fixes for workout auto-items)

- **Exercise count fixed** — `toggleWorkoutEx()` now only saves exercises from today's workout cards (filtered by `data-days`), not all 7 days' worth. Stores `workoutTodayTotal` and `workoutTodayDone` fields. Fixes the "10/112 exercises" display bug.
- **Fast/light day workout section** — When `checklistFast` or `checklistLight` doesn't contain workout items (m2/m3/e1/e2/e3), a WORKOUT group is injected automatically with a single "Today's training session" auto-status indicator. Fixes workout items missing on fast days.
- **Auto-workout items read filtered counts** — Both `renderTodayChecklist()` and `refreshAutoItems()` now read `workoutTodayTotal`/`workoutTodayDone` instead of counting all keys in `workoutChecks`. Fixes exercise count showing wrong numbers.

---

## Version 4.0.0 — 2026-03-28

**Scope:** Major (version rollover from 3.10.0 — auto-status checklist items + radar workout integration)
**Banner:** "Calorie ceiling auto-tracks from food log. Workout items auto-update from WORKOUTS tab. Radar CHECKLIST axis now includes exercise completion."

### Issue 1: Calorie ceiling auto-tracks from food log
- **`f2` items across all 5 plans** tagged with `type:'auto-cal'`. No longer a manual checkbox.
- **Rendered as status indicator** — shows live "850 / 1000 cal — under ceiling" or "1150 / 1000 cal — over ceiling" with tick/cross icon. Non-clickable (`cursor:default`).
- **Bulk-aware** — BULK plan shows "target hit" when eating above ceiling (surplus required). MAINTENANCE shows "on target" within ±200 cal.
- **Auto-refreshes** on `FOOD_LOGGED` dispatch via new `refreshAutoItems()` function.
- **CSS** — `.auto-status`, `.auto-status.done`, `.auto-status.fail` classes with `.auto-val` for the status text.

### Issue 2: Workout items auto-update from WORKOUTS tab
- **Items `m2`, `m3`, `e1`, `e2`, `e3`** (mobility, morning workout, evening session, stretch) detected by `AUTO_WORKOUT_IDS` constant. No longer manual checkboxes.
- **Rendered as status indicator** — shows "5/8 exercises — complete" or "Open WORKOUTS tab to track". Non-clickable.
- **Auto-refreshes** on `WORKOUT_CHECKED` dispatch via `refreshAutoItems()`.
- **All plans covered** — the detection is by item ID, works regardless of plan-specific label text.

### Issue 2b: Radar CHECKLIST axis includes workout exercises
- **`computeRadarMetrics()` CHECKLIST axis** now blends regular `dayLogs[date].checks` with `dayLogs[date].workoutChecks` for a unified completion score.
- **Effect** — checking exercises on the WORKOUTS tab directly improves the radar CHECKLIST score, not just the standalone workout progress bar.

### Infrastructure
- **`syncAutoStatusChecks()`** — persists auto-derived done/fail states into `checks` object so calendar and radar see them.
- **`refreshAutoItems()`** — lightweight re-render of only auto-status items without full checklist rebuild.
- **`autoItems` dispatch target** added to `FOOD_LOGGED` and `WORKOUT_CHECKED` events.
- **`toggle()` guarded** — auto-status items (`data-auto`) skip manual toggle, same as water items.

---

## Version 3.10.0 — 2026-03-26

**Scope:** Minor (Water tracking inline input on TODAY tab)
**Banner:** "Water tracking: tap the water checklist item to log liters with +/− buttons. Auto-ticks when daily target is met."

- **Water input replaces checkbox** — Water checklist items across all 5 plans now have `type:'water'` and `waterTarget` fields. Tapping the water card on the TODAY tab expands an inline panel with a numeric input and ±0.25L buttons instead of toggling done/undone directly.
- **Auto-tick on target met** — When the entered value meets or exceeds the plan's daily water target (e.g., 3.0L for AGRO/DEFAULT normal days, 3.5L for fast days, 2.5L for CUT, 2.0L for MAINTENANCE), the card auto-marks as complete (green). Below target = unchecked.
- **Single source of truth** — Water value saves to `dayLogs[date].water`, which the radar WATER axis and day modal already read. No dual-tracking between checkbox and liter value.
- **All plans covered** — 12 water items across all 5 plans' checklistNormal, checklistFast, and checklistLight arrays tagged with type/target.
- **State persistence** — `loadChecklist()` restores water input values and card done state from storage on tab revisit or app reopen.
- **Functions added** — `toggleWaterExpand()`, `onWaterInput()`, `adjustWater()`, `updateWaterCardState()`. `toggle()` skips items with `data-water-target`.

---

## Version 3.9.1 — 2026-03-25

**Scope:** Patch (TRACK tab notes display fix)

- **Notes fully hidden by default** — Day notes in the TRACK tab are now completely hidden behind a "Show Note" button instead of showing a truncated 80-character preview. Tapping "Show Note" reveals the full text with a "hide" button to collapse it back. Reduces vertical scroll clutter when multiple days have long notes.

---

## Version 3.9.0 — 2026-03-25

**Scope:** Minor (2 new features — workout exercise checklist, supplement sub-items)
**Banner:** "Workout exercise checkboxes on WORKOUTS tab with per-day progress tracking. Supplement checklist items now expandable with individual pill checkboxes."

### ISSUE 1: Workout tab per-exercise completion checklist
- **Exercise checkboxes** — every exercise row (`exRow`, `exRowWithLevel`, `stretchRow`) now has a tappable checkbox on the left. Checking off exercises saves to `dayLogs[date].workoutChecks`.
- **Progress bar** — WORKOUTS tab shows "TODAY'S EXERCISES X/Y" progress bar at top, counting only exercises from today's workout cards (using `data-days` matching).
- **Workout ID system** — counter-based `wex0`, `wex1`, etc. generated per render, reset via `_resetExRowInstances()`. Deterministic and stable across re-renders.
- **Day modal integration** — past days show "Workout Completion: X/Y exercises completed (Z%)" in the day modal.
- **Dispatch event** — added `WORKOUT_CHECKED` event to `DISPATCH_MAP` (refreshes recentNotes).
- **CSS** — `.wex-row`, `.wex-cb`, `.wex-done` classes for checkbox appearance and strikethrough.

### ISSUE 2: Supplement checklist expandable sub-items
- **subItems array** — checklist items can now include a `subItems` array with individual supplements: `{ id, name, dose, when, days? }`. The `days` array (optional) restricts sub-item to specific days of week.
- **AGRO plan updated** — `s1` (eating day morning stack) has 4 sub-items: Osteocare, D3+K2, Zinc (EOD: Sun/Tue/Thu/Sat), MCT gel. `sf1` (fast day morning stack) has 3 sub-items: D3+K2, Zinc (Sun/Sat), MCT gel.
- **Expandable UI** — items with subItems show expand/collapse panel. Tapping the parent expands; tapping individual sub-items toggles their checkbox.
- **Parent state** — auto-derived: empty (0 done), partial (some done), done (all done). Parent checkbox reflects sub-item completion with partial fill state.
- **Count display** — shows "3/4" count on parent item, sub-text updates to "3 of 4 taken" or "All taken".
- **Storage** — sub-item states stored as individual keys in `dayLogs[date].checks` (e.g., `s1_a: true, s1_b: true`). Parent key auto-set based on sub-item completion.
- **Day modal** — past days show expandable sub-items with individual toggles via `toggleModalSupItem()`.
- **CSS** — `.sup-panel`, `.sup-item`, `.sup-cb`, `.has-subitems`, `.partial` classes for expandable UI.

---

## Version 3.8.0 — 2026-03-25

**Scope:** Minor (5 bug fixes — radar scoring, notes display, settings persistence, checklist grouping)
**Banner:** "Radar scoring improved (proportional calories, dampened weight trend, fasting excludes today). Notes collapsible. Age/height persist. Fast day electrolytes in supplements section."

- **BUG 1: AGRO fast day checklist grouping** — Electrolyte items (wf2, wf3) moved from FAST group to SUPPLEMENTS group. Array reordered so all SUPPLEMENTS items (sf1, wf2, wf3, sf2) render as one coherent section. Item IDs unchanged to preserve existing dayLog check states.
- **BUG 2A: Radar calorie scoring — proportional** — Replaced binary pass/fail calorie scoring with proportional: at or under ceiling = 100%, over ceiling = ceiling/actual ratio (e.g. 1150 on 1000 ceiling = 87%, not 0%). Affects all plans.
- **BUG 2B: Radar weight trend — sparse data dampening** — Weight trend score now scales by data confidence: full score at 7+ data points, linearly dampened below that (e.g. 2 points = 29% of raw score). Prevents misleading 100% from early water weight drops.
- **BUG 3: Collapsible notes in TRACK tab** — Notes longer than 80 characters now truncated with "show more" / "show less" toggle. Short notes render unchanged. Reduces vertical scrolling on TRACK tab.
- **BUG 4: Age/height persistence** — autoFillTDEE() now saves age, height, sex, and activityLevel to settings immediately when TDEE is computed. Values no longer lost when settings panel is closed without clicking CONFIRM PLAN.
- **BUG 5: Radar fasting — today excluded, checklist-weighted scoring** — Today excluded from fasting completion scoring (in-progress day can't be scored). Past fast days now scored by combining food absence with checklist completion: full fast + full checklist = 100%, full fast + no checklist = 50%, broken fast scored proportionally. Light day scoring also excludes today.

---

## Version 3.7.0 — 2026-03-24

**Scope:** Minor (Default Bulk plan research-backed enhancement)
**Banner:** "Default Bulk plan enhanced: research-backed nutrition, per-meal protein dosing, calorie cycling, food source grids, supplement tracking."

- **Protein floor raised** — `proteinFloorMultiplier` changed from 1.4 to 1.6g/kg, matching Iraki et al. 2019 (PMC6680710) lower bound of 1.6–2.2g/kg for muscle growth.
- **Checklist (eating day)** — expanded from 11 to 14 items: added pre-training meal, post-training protein, carb target, creatine tracking (SUPPLEMENTS group), updated protein target to show 1.6–2.2g/kg range.
- **Checklist (light day)** — expanded from 7 to 8 items: added creatine tracking, explicit 1.6g/kg protein minimum, updated descriptions.
- **Nutrition tab rewrite** — added per-meal protein dosing card (0.40–0.55g/kg per meal, dynamic calculation from user weight, Iraki 2019), nutrient timing card (ISSN 2018), calorie cycling card (full surplus on training days, maintenance on rest), bulk tracking guidance card (weekly weigh-in, monthly waist, photos). Added collapsible protein/fat/carb source grids (8 items each). Expanded supplement section with creatine monohydrate dosing detail. Added drinks section.
- **Rules tab rewrite** — expanded from 11 to 14 rules: added 2× frequency per muscle group (ISSN 2018), push:pull balance (Cools 2016), calorie cycling, monthly body composition check, travel rule (Kotarsky 2018). All rules now cite research sources.
- **Workout tab** — section note updated to mention 2×/week frequency (ISSN 2018). Push:pull balance note added at bottom (Cools 2016, Prinold 2016).
- **No other plans modified** — all changes scoped exclusively to PLANS.bulk.

---

## Version 3.6.2 — 2026-03-24

**Scope:** Patch (bug fix)
**Banner:** No banner (patch).

- **Exercise level selector collision fix** — when the same exercise group (e.g. `push`, `pull`, `core`) appeared multiple times in a workout session, changing the level on one instance would overwrite all others sharing that groupId. Root cause: `exRowWithLevel` used the raw groupId as the storage key, so all instances of `push` read/wrote the same key. Fix: auto-index instances — first occurrence keeps original key (backward compatible with existing saved data), subsequent occurrences get suffixed keys (`push_2`, `push_3`). Each instance now tracks its own level independently while still showing the same progression options. Day modal exercise history also updated to display instance suffixes correctly.

---

## Version 3.6.1 — 2026-03-23

**Scope:** Patch (additional macro source items)
**Banner:** No banner (patch).

- **5 more fat sources** — avocado, full-fat yogurt, macadamia nuts, olives, trail mix added to fat sources card (now 13 items total).
- **7 more carb sources** — toast+honey, cornflakes+milk, grapes, granola bars, orange juice, crackers, dried apricots added to carb sources card (now 15 items total).

---

## Version 3.6.0 — 2026-03-23

**Scope:** Minor (new nutrition content + collapsible UI)
**Banner:** "Fat + carb source cards added to AGRO nutrition tab. All 3 macro source lists are now collapsible."

- **Fat sources card** — 8 fat-portioned items (~25g fat each) added to AGRO nutrition tab: peanuts, almonds, peanut butter, cheese/paneer, boiled eggs, coconut chunks, mixed seeds, cashews. India-available, zero-prep options.
- **Carb sources card** — 8 carb-portioned items (max ~63g carbs each) added to AGRO nutrition tab: bananas, dates, roti/chapati, muri/puffed rice, apple+banana, roasted chana, sweet potato, oats. India-available, cheap, minimal prep.
- **Collapsible macro source lists** — all three cards (HIGH PROTEIN SOURCES, FAT SOURCES, CARB SOURCES) are now collapsible with tap-to-expand headers using the same inline toggle pattern as the supplement schedule. Collapsed by default to reduce scroll on the nutrition tab.

---

## Version 3.5.1 — 2026-03-23

**Scope:** Patch (bug fixes from codebase scan)
**Banner:** No banner (patch).

- **Compliance score floor** — projection compliance modifier now has a 0.3 minimum. Previously, 3+ days of poor checklist + calorie overages could drive compliance to near 0, making weight projections absurdly pessimistic (150+ weeks for 5kg). Fasting days still create a deficit even at worst compliance — the floor reflects that.
- **syncCustomSelect null guards** — function no longer throws if either the native select or custom dropdown element doesn't exist. Prevents potential crashes during backup restore or when elements are conditionally rendered.
- **index.html footer version sync** — footer was stuck at v3.2.1 while hero badge and app were at v3.5.x. Now in sync.

---

## Version 3.5.0 — 2026-03-23

**Scope:** Minor (consistency metric redesign)
**Banner:** "Consistency now measures engagement depth + streaks, not just attendance."

- **Consistency metric redesign** — the CONSISTENCY axis on the performance radar no longer uses binary "did you show up" scoring. Previously, checking a single box out of 15 gave 100% for that day — same as completing everything. Now measures **engagement depth**: checklist completion depth (50% weight), food logged (20%), weight logged (15%), water/energy/notes (15%). A day where you check 1 item and log nothing else scores ~3%, not 100%.
- **Streak bonus** — consecutive days with quality ≥ 0.3 earn a streak bonus: +1 point per 2 consecutive days, capped at +10. Rewards showing up AND doing the work day after day. Streak resets on days with low engagement (< 0.3 quality score).
- **Streak display in legend** — when streak is 4+ days, the consistency legend shows "Depth + Xd streak" instead of generic "Engagement depth", giving visibility into the streak factor.
- **Day-type-aware scoring** — consistency now uses the correct checklist for each day type (fast/light/normal) when calculating completion depth, so fast days are scored against the fast checklist, not the normal one.

---

## Version 3.4.1 — 2026-03-23

**Scope:** Patch (radar scoring overhaul)
**Banner:** No banner (patch).

- **Radar anchor-based filtering** — all behavioral axes (checklist, calories, fasting, water, consistency) now only score days from the anchor date (earliest of: schedule start, first weight, first checklist) onward. Days before the user started tracking are never counted — prevents false failures on pre-start dates.
- **Consistency minimum-data gate** — requires at least 2 tracked days to produce a score. On day 1, consistency returns null ("—") instead of 100%. One day of data is not enough to measure consistency.
- **Calorie axis honest scoring** — past eating days without food data count as non-compliant (you should have logged but didn't), but only after anchor date. Today is excluded (day isn't over). Requires at least 1 day with actual food data before scoring — avoids showing 0% when food logging hasn't started yet.
- **Checklist includes today** — checklist axis now scores today's in-progress checklist alongside completed past days. Since you're actively checking items, the live score is meaningful.
- **Data span indicator** — legend now shows "DAY X OF TRACKING" with a note that 7D and 30D will diverge after 7 days of data. Explains why the shapes are identical early on.
- **Anchor metadata** — `computeRadarMetrics()` now returns `_anchor` and `_completedDays` alongside the axis array for use by the renderer.

---

## Version 3.4.0 — 2026-03-23

**Scope:** Minor (live calorie tracking, food log history, radar fix, storage persistence)
**Banner:** "Live calorie tracking on Nutrition tab, food log history on Track tab, radar scoring fix."

- **Live calorie intake on NUTRITION tab** — AGRO plan's nutrition tab now shows a "TODAY'S INTAKE" card below the macro grid that reads from the food log in real-time. Shows calories consumed vs ceiling with a progress bar, remaining/over text, and macro progress bars (protein/carbs/fat) when macro data is available. On fast days, shows a fast day notice instead. Updates via `FOOD_LOGGED` dispatch event whenever food is logged.
- **Food log history on TRACK tab** — new "FOOD LOG" section on the TRACK tab showing the last 7 days of food entries with per-day totals, individual items with macros, and color-coded budget status. Updates live via new `trackFoodLog` dispatch target.
- **Radar calorie scoring fix** — eating days without food data are now counted as non-compliant (missed logging = missed target) instead of being silently skipped. Previously, logging food on 1 of 7 eating days and staying under ceiling gave 100% — now gives 14%. Only scores past days (today excluded — day isn't over).
- **Removed duplicate Export Logs button** — the Export Logs button was duplicated in both Settings > Data Management and the MONTHS tab. Removed from settings; kept on MONTHS tab where it's contextually appropriate next to the calendar.
- **Persistent storage request** — app now calls `navigator.storage.persist()` on load, asking Chrome to protect localStorage from automatic eviction under storage pressure. Won't prevent manual "Clear browsing data" wipe, but stops silent data loss. PWAs installed to home screen are more likely to be granted persistence.
- **New dispatch target: `trackFoodLog`** — added to `FOOD_LOGGED` event and `DISPATCH_MAP`. Renders food log history on TRACK tab when active.

---

## Version 3.3.0 — 2026-03-23

**Scope:** Minor (new feature — day-aware supplement display)
**Banner:** "Day-aware supplements — checklist and nutrition tab now show only what you take today, not the full week."

- **Day-aware supplement checklist (TODAY tab)** — AGRO plan supplement items now dynamically resolve sub-text based on today's day of week and day type (fast/eating). Every supplement item shows exact pills, doses, and timing computed from user settings (wake time, eating window start, evening session time). On zinc days (Sun/Tue/Thu/Sat for eating days, Sun/Sat for fast days), zinc appears in the morning stack. On non-zinc days, zinc is omitted entirely — no more mental filtering needed. Applied to both `renderTodayChecklist()` and the day modal for past dates.
- **Dynamic timing on all supplement items** — morning stack shows actual take time (eating window start for eating days, wake time for fast days). MCT pre-training gels show computed pre-session time. Omega-3 shows exact dose breakdown. Magnesium says "take before bed tonight". All times respect user-configured settings and fall back to plan defaults.
- **Day-aware supplement section (NUTRITION tab)** — AGRO plan's NUTRITION tab now shows a "TODAY'S SUPPLEMENTS" section that displays only what applies right now: morning stack with exact pill list and timing, MCT pre-training (fast days), zinc status with next zinc day, omega-3 or skip notice, electrolytes with exact tab timing (fast days only), magnesium. Active supplements shown in green (#82e0aa), skipped items shown in grey (#666) with reason. All times computed from settings.
- **Full schedule reference (collapsible)** — the complete weekly supplement protocol is preserved under a collapsible "SUPPLEMENT FULL SCHEDULE" section below the day-aware cards. Also shows computed times from settings. Tap to expand for reference.
- **Supplement group time label** — TODAY tab's SUPPLEMENTS group header now shows "Eating day stack" or "Fast day stack" instead of generic "Daily stack".
- **Schedule-driven day type** — supplement display is driven by `getDayType()` which reads `SK.fastDays` — when a schedule is set, the auto-marked fast days automatically drive which supplement stack appears on each day. Toggle a fast day manually and the supplements update immediately.
- **New helper: `resolveSupplementSub()`** — centralised function for day-aware supplement sub-text resolution with full timing computation, used by both the TODAY checklist and the day modal. Zinc EOD schedule, dose info, and timing all defined once here. Only applies to AGRO plan — other plans pass through unchanged.

---

## Version 3.2.1 — 2026-03-22

**Scope:** Patch (bug fixes from full codebase scan)
**Banner:** No banner (patch).

- **XSS fix: food name backslash escaping** — food suggestion and delete button inline handlers now escape backslashes before single quotes, preventing JS syntax errors from food names containing backslash characters.
- **Time overflow fix** — `resolveItemTimes` and AGRO nutritionContent now use modulo 24 arithmetic, preventing invalid times when wake time is set very late (e.g. 20:00 producing 24:00+).
- **Schedule download TDEE** — now correctly prefers user-configured TDEE over plan default TDEE. Also fixed "WEIGHT TO LOSE" label to show "WEIGHT TO GAIN" for bulk plans with correct absolute value.
- **removeSchedule preserves today** — changed `>=` to `>` so removing a schedule no longer clears today's fast/light day status mid-day, which could swap the checklist from fast to normal and lose checked items.
- **endScheduleToday clears future days** — ending a schedule now also clears future auto-set fast and light eating days, matching removeSchedule behavior. Previously these orphaned future day markers persisted.
- **Backup status timeout race** — `showBackupStatus` now clears the previous timeout before setting a new one, preventing an earlier timeout from hiding a newer message prematurely.
- **calcAdjust edge cases** — capped maximum remaining days at 730 (2 years) instead of 999 to prevent oversized localStorage arrays. Also returns 0 remaining days when target is already reached instead of incorrectly showing 730/999.
- **Explicit macroSplit on all plans** — DEFAULT and AGRO plans now declare their own `macroSplit` and `proteinFloorMultiplier` fields explicitly instead of relying on hardcoded fallbacks in `computeMacros()`. All 5 plans are now truly self-contained.
- **goalMode field on all plans** — each plan now declares `goalMode: 'cut'|'bulk'|'maintenance'` so the goal calculator reads the plan object instead of hardcoding mode detection by plan key name. Future custom plans will work correctly without code changes.
- **CLAUDE.md version sync** — updated all stale `3.0.2` version references to match current `3.2.1`.

---

## Version 3.2.0 — 2026-03-22

**Scope:** Minor (new feature)
**Banner:** "Customisable daily timing — set wake time, last meal, evening session, and eating window in Settings. All plans adapt automatically."

- **Customisable daily timing** — new "Daily Timing" section in Settings with 4 time fields: wake time, last meal by, evening session, and eating window start. Each plan defines its own defaults; user overrides persist across plan switches.
- **`formatTime()` utility** — converts 24h `"HH:MM"` to display format like `"5:30AM"` or `"6PM"`. Used across checklist, nutrition, and rules rendering.
- **`getPlanTime()` / `getEatingWindow()` helpers** — resolve user override → plan default → null fallback chain for all time lookups.
- **`resolveItemTimes()` function** — dynamically replaces hardcoded time references in checklist item labels at render time. Affects: "Last meal before 6PM" (all plans with the item), "Electrolyte tablet mid-morning (9-10am)" (agro fast days), "Electrolyte tablet pre-evening" (agro fast days).
- **Dynamic group headers** — MORNING and EVENING group headers on TODAY tab now show "From 5:30AM" / "From 5PM" based on configured times. EATING group shows calorie ceiling + eating window.
- **Nutrition/rules content updated** — eating window, last meal time, supplement timing, and fast day protocol in DEFAULT and AGRO plans now use dynamic times from settings instead of hardcoded strings.
- **Day modal updated** — past-day checklist items in the calendar modal also resolve dynamic times.
- **Eating window start visibility** — the "Eating window opens" field is only shown in Settings when the active plan has fasting days (fastDaysPerWeek > 0).
- **Plan defaults**: DEFAULT/AGRO: wake 5:30AM, window 11AM, last meal 6PM, session 5PM. CUT/BULK/MAINTENANCE: wake 7AM, last meal 8PM, session 6PM, no eating window.

---

## Version 3.1.1 — 2026-03-22

**Scope:** Patch (codebase scan fixes)
**Banner:** No banner (patch).

- **Fix: escape user name in schedule download** — `downloadScheduleHTML()` now uses `esc(s.name)` to sanitize the user's name before injecting into generated HTML, preventing potential HTML injection.
- **Fix: restore warns about unknown backup keys** — `restoreData()` now tracks keys present in the backup but missing from the current SK object and appends a note to the success message listing them, so the user knows if data from a newer app version was skipped.
- **Fix: autoSetPlanFastDays/LightDays now dispatch** — Both functions now end with `dispatch('FAST_DAY_TOGGLED')` instead of calling `updateFastUI()` directly, following the architectural rule that all data writes end with a dispatch event.

---

## Version 3.1.0 — 2026-03-22

**Scope:** Minor (new feature)
**Banner:** "Download Schedule — export your full schedule as a printable HTML document with daily tasks, workouts, nutrition, and rules."

- **New: Download Schedule as HTML** — When pressing "Add to Schedule" or "Add Realistic to Schedule" in the goal calculator, a choice popup now appears with two options: "ADD TO APP" (existing behavior) and "DOWNLOAD SCHEDULE". The download generates a standalone HTML document containing:
  - Schedule overview (start/end dates, duration, calorie ceiling, start/target weight, TDEE, user details)
  - Full weekly routine (Monday–Sunday) with day type labels (eating/fast/light), checklist items grouped by category, and morning/evening workout sub-text
  - Complete workout cards with all exercises, sets, and cooldown stretches
  - Nutrition section with macro targets, eating rules, supplement protocol, food sources
  - All plan rules (eating, training, discipline)
  - Dark theme styling matching the app, with print-friendly light theme via `@media print`
- The document can be opened in any browser, printed to PDF, or shared with a doctor/trainer.
- Includes version 3.0.3 bug fix: schedule removal now clears today's fast/light day marker.

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
