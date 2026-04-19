# WORKOUTS LIBRARY — Protocol Health Exercise Encyclopedia

This file is the canonical reference for all exercises and training modalities used across
Protocol Health's 5 plans. Claude Code must consult this file before generating, modifying,
or prescribing any workout content in `app.html`.

## Purpose

1. Define every exercise with biomechanical detail, target muscles, and safety notes
2. Prescribe specific sets/reps/tempo per plan (Lite, Cut, Bulk, Maintenance, AGRO)
3. Provide the data foundation for future auto-prescription features
4. Eliminate the need for AI judgment on exercise selection — every workout has a defined
   identity with quantities that can be algorithmically assigned

## How This File Is Used

- **By Claude Code:** Before modifying any plan's `workoutContent()`, check this file for
  the exercise's per-plan prescription. Never invent sets/reps — use what's defined here.
- **By future app features:** The structured data in this file can be parsed to build
  auto-progression, workout generation, and plan-specific training algorithms.
- **By CLAUDE.md:** Section 16 references this file. All workout-related questions route here.

---

## Section 1 — Training Modalities

Protocol Health uses 12 distinct training modalities across its 5 plans. Each modality has
a defined purpose, evidence base (cited against CLAUDE.md Section 15), and specific plan
integration. Claude Code must preserve this modality identity when editing plans — never
move a modality between plans without understanding its rationale.

---

### 1. Bodyweight Calisthenics

**What it is:** The foundation of every Protocol Health plan. Progressive overload is
achieved through rep progression and level advancement (harder variations), not external
load. Every compound movement — push, pull, squat, hinge, core — is built on calisthenics.
Zero equipment, zero location dependency.

**Evidence:**
- Kotarsky 2018 — push-ups produce strength gains equivalent to bench press when matched
  for intensity and volume (CLAUDE.md §15: Push-up = bench press).
- Plotkin 2022 — rep progression produces the same hypertrophy as load progression when
  sets are taken near failure (CLAUDE.md §15: Rep vs load progression).
- Schoenfeld 2021 — the repetition continuum shows hypertrophy occurs across a wide rep
  range provided effort is sufficient (CLAUDE.md §15: Repetition continuum).

**Used in:** ALL plans (Lite via chair-supported variants, Cut/Bulk/Maintenance/AGRO via
full progression ladders).

**Integration:** Exercise selection is driven by `EXERCISE_PROGRESSIONS` in `app.html`.
Each user picks a level per group (push / pull / shoulder / squat / hinge / core / skill)
and advances when the top of the rep range feels easy.

---

### 2. HIIT (Bodyweight)

**What it is:** High-intensity interval training using bodyweight movements only. Standard
circuit structures: 30 sec work / 15 sec rest × 4 rounds, or 40 sec work / 20 sec rest × 3
rounds. Exercises chosen from push, squat, plyo, and core categories for full-body output.
EPOC (excess post-exercise oxygen consumption) elevates metabolism for hours post-session.

**Evidence:**
- ACE 2024 — HIIT burns up to 30% more calories per minute than steady-state cardio, plus
  EPOC effect (CLAUDE.md §15: HIIT calorie burn).
- Schoenfeld 2021 — meta-analysis of 54 studies shows HIIT and MICT produce equivalent fat
  loss outcomes (CLAUDE.md §15: HIIT vs MICT fat loss meta-analysis).
- Boutcher 2011 — HIIT improves body composition, particularly abdominal/visceral fat
  (CLAUDE.md §15: HIIT body composition).

**Used in:** Cut (Tuesday + Friday circuits), Maintenance (Tuesday rotation option D), AGRO
(Wednesday and Saturday run-based conditioning circuits).

**Integration:** Always placed on non-consecutive days, never alongside resistance work on
the same muscle group. Fast days prohibit HIIT (AGRO) — only light walking allowed.

---

### 3. Steady-State Cardio (Walking / Jogging)

**What it is:** Zone 2 cardio at 60-70% max HR — conversational pace. Primary driver of
fat oxidation without eating into recovery capacity. The base layer of cardiovascular
health across every plan. Walking is the lowest-barrier modality in the entire library.

**Evidence:**
- WHO 2020 — 150 minutes/week of moderate cardio is the baseline adult physical activity
  recommendation (CLAUDE.md §15: WHO 2020 Physical Activity Guidelines).
- Schoenfeld 2021 — MICT matches HIIT for fat loss outcomes (CLAUDE.md §15: HIIT vs MICT
  fat loss meta-analysis).
- JAMA Network Open 2021 — walking 7,000-10,000 steps/day is associated with reduced
  all-cause mortality (CLAUDE.md §15: Walking & general activity).

**Used in:** ALL plans. Lite (daily walk + chair days), Cut (daily 15+ min walk), Bulk
(active recovery Wednesday + light walks), Maintenance (Tuesday option A + daily walks),
AGRO (Sunday active rest, fast day light walks, Wednesday/Saturday run warmup/cooldown).

**Integration:** Walking is always "free" — it does not count against training volume and
is prescribed on every day including rest days.

---

### 4. Shadowboxing

**What it is:** 5 × 3-minute round protocol with 60 sec rest between rounds. Full-body
cardio engaging upper body (jab-cross, hooks, uppercuts) and lower body (footwork, stance)
simultaneously. High caloric output with zero equipment and minimal space requirement.
Builds toward the long-term combat sports goal in the Protocol Health mission.

**Evidence:**
- Croom 2023 — 3-week shadowboxing program: ↑ aerobic capacity, ↑ muscle mass, ↑ bone
  mass, ↑ BMR; ↓ resting HR, ↓ fat mass, ↓ body fat %, ↓ visceral fat. Burns 300-400
  cal/30 min (CLAUDE.md §15: Shadowboxing — Croom 2023).

**Used in:** Cut (Tuesday HIIT Option 2 — Shadowboxing), Maintenance (Tuesday Cardio
Rotation Option B).

**Integration:** Round structure: R1 warmup jab-cross, R2 speed, R3 power hooks+uppercuts,
R4 20-sec flurry/10-sec light intervals, R5 mixed tempo. Can replace any HIIT session on
Tuesday in Cut and Maintenance.

---

### 5. Animal Flow / QMT (Quadrupedal Movement Training)

**What it is:** Ground-based locomotion patterns — beast hold, crab reach, lateral ape,
front step-through, scorpion reach, loaded beast to underswitch. Builds mobility,
proprioception, wrist and shoulder capacity, and cognitive flexibility all at once.
Low-impact but high-coordination. Wrist preparation is built in.

**Evidence:**
- Buxton 2022 (J Strength Cond Res) — 8-week QMT RCT (n=42) improved FMS scores, active
  joint ROM, balance, and upper body endurance (CLAUDE.md §15: Buxton 2022 J Strength
  Cond Res).
- Matthews 2016 — 4-week QMT improved cognitive flexibility (Wisconsin Card Sorting Task)
  and joint repositioning sense (CLAUDE.md §15: Matthews 2016).
- Buxton 2022 (Front Sports Act Living) — energy demands of QMT comparable to
  moderate-intensity walking, making it suitable as active recovery (CLAUDE.md §15).

**Used in:** Bulk (Wednesday Animal Flow Mobility + Walk), Maintenance (Friday Animal Flow
+ Mobility).

**Integration:** Positioned mid-week on Bulk (between push Mon/Tue and lower Thu) and end
of week on Maintenance (as balance + mobility day). Never placed on the same day as heavy
pull work due to shared wrist/shoulder load.

---

### 6. Yoga

**What it is:** Flexibility, mild strength, balance, breath control, and cortisol
management. Hatha flow style for recovery days. Seated and standing variants in Lite to
accommodate elderly/limited-mobility users. Savasana or supine twist closes each session.

**Evidence:**
- PMC 8038747 (2021) — Pilates and Yoga health impacts: functional autonomy, balance,
  flexibility, muscle strength (CLAUDE.md §15: Yoga & Pilates).
- PMC 11123216 (2024) — Pilates vs Yoga comparison: both improve functional movement and
  balance (CLAUDE.md §15: Pilates vs Yoga comparison).

**Used in:** Cut (Wednesday Active Recovery: Walk + Yoga), Maintenance (Wednesday Yoga or
Pilates — alternating weeks), Lite (Thursday Gentle Yoga — Seated + Standing).

**Integration:** Always placed on active recovery days, never stacked with resistance
training on the same day. Lite uses chair support for balance poses.

---

### 7. Mat Pilates

**What it is:** Core strength, posture correction, spinal health, and mind-muscle
connection. Mat-based flow: The Hundred, single leg stretch, double leg stretch, spine
twist, bridge with march, swimming prone, roll-up. Targets the deep core musculature that
braces compound movements.

**Evidence:**
- PMC 11447755 (2024) — Pilates and posture: core strength, posture correction, spinal
  health (CLAUDE.md §15: Pilates and posture).
- Physiology & Behavior 2016 — once-weekly Pilates produces detectable benefits in muscle
  mass, flexibility, and balance (CLAUDE.md §15).
- PMC 8038747 — functional autonomy, balance, flexibility, muscle strength (CLAUDE.md §15:
  Pilates and Yoga health impacts).

**Used in:** Bulk (Saturday Full Body + Pilates Core — 15-min block after resistance),
Maintenance (Wednesday Yoga or Pilates — alternating weeks), Lite (Saturday Mat Pilates
Basics + Balance).

**Integration:** In Bulk, Pilates serves as the core finisher (not a standalone day). In
Maintenance it alternates weekly with Yoga. In Lite it's a full session incorporating
balance work.

---

### 8. Isometric Training

**What it is:** Strength and hypertrophy without joint movement. Static holds at specific
muscle lengths — wall sit, plank, superman, push-up bottom hold, deep squat hold, seated
chest press holds. Low CNS cost, joint-friendly, and effective for hypertrophy when held
near failure.

**Evidence:**
- Oranchuk 2019 — systematic review showing 5-23% muscle CSA increase from isometric
  training; long muscle length > short for hypertrophy (CLAUDE.md §15: Oranchuk 2019).
- Sato 2022 — similar hypertrophy between concentric, eccentric, and isometric when effort
  is matched (CLAUDE.md §15: Sato 2022).
- Lum & Barbosa 2019 — ~5% strength gain per week from a single 6-sec daily isometric
  effort (CLAUDE.md §15: Lum & Barbosa 2019).

**Used in:** Bulk (finishers on Push Monday "Push-up bottom hold", Lower Thursday "Deep
squat hold", wall sits), Lite (seated chest press hold, seated leg extension hold, wall
sit) on Friday Full Body + Isometrics day.

**Integration:** Placed at the end of sessions as finishers. Never replaces compound work.
In Lite, isometrics are the primary strength modality because they're joint-safe for
elderly users.

---

### 9. Tempo Training

**What it is:** Controlled rep speed using the 4-digit tempo notation: 3-1-2-0 (3 sec
eccentric / 1 sec pause at bottom / 2 sec concentric / 0 pause at top). Increases time
under tension ~3× without adding external load, which drives hypertrophy from bodyweight
exercises.

**Evidence:**
- Schoenfeld 2015 — tempo training review: increased TUT via slow eccentrics enhances
  hypertrophy (CLAUDE.md §15: Schoenfeld 2015 tempo training review).

**Used in:** Bulk only. Applied to ALL primary compounds across the week — push-ups,
decline push-ups, pike push-ups, diamond push-ups, inverted rows, squats, Bulgarian split
squats, glute bridges, good mornings. Secondary movements may use 2-1-2-0 or 2-1-3-0.

**Integration:** Tempo is the defining characteristic of the Bulk plan's training
philosophy — it replaces the role that external load plays in a traditional bulk. Never
applied in Cut/Maintenance/Lite/AGRO because those plans prioritize rep output or density
over time under tension.

---

### 10. Jump Rope

**What it is:** Time-efficient cardio via rhythmic single-unders, alternating feet, or
double-unders. Bone density stimulus via impact loading. Minimal equipment cost (~$5) and
space requirement. ~100 cal per 10 min at moderate pace.

**Evidence:**
- PMC 8467906 — 8-week RCT: rope-skipping improved body composition, inflammation markers,
  and blood pressure (CLAUDE.md §15: Jump rope 8-week RCT).
- PMC 12473967 (2025) — controlled trial: 10 min/week improved cardiovascular capacity and
  lower limb strength (CLAUDE.md §15: 2025 controlled trial).

**Used in:** Cut (Tuesday HIIT Option 3 — Jump Rope HIIT, optional if rope available),
Maintenance (Tuesday Cardio Rotation Option C).

**Integration:** Treated as an optional substitute for other cardio modalities on cardio
days. Caveat: users above ~100kg should start on softer surfaces and short durations due
to joint impact load.

---

### 11. Tai Chi

**What it is:** Yang-style simplified 8-form. Slow, controlled, weight-shifting movements
for balance, fall prevention, joint mobility, and breath control. Forms include Wu Ji
stance, Part the Wild Horse's Mane, White Crane Spreads Wings, Brush Knee and Push,
Playing the Lute, Reverse Reeling Forearm, Wave Hands Like Clouds, Closing Form.

**Evidence:**
- Chen 2023 (Front Public Health) — meta-analysis of 24 RCTs: fall risk reduced 24% (RR
  0.76). Yang style shown as most effective. Improved TUG, FRT, and BBS balance scores
  (CLAUDE.md §15: Chen 2023 Tai Chi meta-analysis).

**Used in:** Lite only (Tuesday Tai Chi Flow — Yang Style 8-Form).

**Integration:** The single dedicated balance-training modality in Protocol Health. Placed
on Tuesday in Lite as a counterbalance to Monday's chair strength session. Not used in any
other plan because fall prevention is specifically a Lite protocol target.

---

### 12. Chair Exercise / Seated Resistance

**What it is:** Seated and chair-supported strength exercises designed for elderly or
limited-mobility users. Includes seated arm raises, seated bicep curls with water bottles,
seated shoulder press, seated row with resistance band, sit-to-stand, seated heel raises,
seated marching, wall push-ups, and seated isometric holds.

**Evidence:**
- ICFSR 2021 Expert Consensus — multicomponent exercise for elderly, resistance training
  2+ days/week (CLAUDE.md §15: ICFSR 2021 Expert Consensus).
- ICFSR 2025 Global Consensus — aerobic + resistance + balance + flexibility prescription
  for elderly (CLAUDE.md §15: ICFSR 2025 Global Consensus).
- Scoping Review of Elderly PA Guidelines (PMC 8886780) — 150 min core, 3×/week optimal
  frequency (CLAUDE.md §15: Scoping Review of Elderly PA Guidelines).
- Oranchuk 2019 — isometric training effective from brief efforts, directly applicable to
  seated holds (CLAUDE.md §15: Oranchuk 2019).

**Used in:** Lite only (Monday Chair Strength A — Upper Body, Wednesday Chair Strength B —
Lower Body, Friday Chair Strength C — Full Body + Isometrics).

**Integration:** Chair exercise is the primary resistance modality in Lite — it replaces
the progression ladder approach used in other plans. Never used in Cut/Bulk/Maintenance/
AGRO because those plans assume full mobility and bodyweight load tolerance.

---

## PROGRESSION EXERCISES

Protocol Health uses group-based progression ladders stored in `EXERCISE_PROGRESSIONS` in
`app.html`. Each group (push, pull, shoulder, squat, hinge, core, skill tracks) contains a
sequence of levelled exercises. Users pick a level per group and advance when the top of
the rep range feels easy. The entries below must match `EXERCISE_PROGRESSIONS` in
`app.html` exactly — any change to the code must be reflected here in the same commit.

The per-plan prescription tables follow this convention:

- **Lite** — Never uses these progressions. Uses chair/seated resistance instead. Always N/A.
- **Cut** — Moderate volume, standard tempo. 2× per week on Mon upper + Sat full body.
- **Bulk** — Tempo-driven hypertrophy (3-1-2-0). 3× per week on Mon + Fri + Sat.
- **Maintenance** — Moderate volume, standard tempo. 2× per week on Mon + Thu.
- **AGRO** — Sets and reps match `EXERCISE_PROGRESSIONS` exactly. 3× per week on
  Mon/Wed/Fri morning sessions (excluded on fast days).

---

### PUSH PROGRESSION (10 Levels)

The push ladder is the primary horizontal and vertical pressing track. It builds chest,
triceps, and anterior deltoid capacity through 10 sequential exercises ranging from a
standing wall push-up (L0) to an assisted one-arm push-up (L9). Progression follows the
principle: own the top of the rep range with clean form before advancing a level. Source
of truth: `EXERCISE_PROGRESSIONS.push` in `app.html`.

---

#### Wall push-up

**Category:** Push
**Progression group:** push | **Level:** 0
**Equipment:** None | Optional: wall
**Target muscles (primary):** Anterior deltoid, triceps
**Target muscles (secondary):** Pectoralis major (minimal), serratus anterior
**Movement type:** Compound

**Description:** Standing push variation with hands placed on a wall at shoulder height
and feet planted on the floor. Lower the chest toward the wall by bending the elbows, then
press back to a locked-out arm position. The steepness of the body angle governs the load
— closer feet = easier, further feet = harder. The safest entry point in the push ladder,
usable in any age or rehab context.

**Common mistakes:**
- Hands placed too high or too low, shifting load away from the chest and shoulders
- Elbows flaring wide past 90°, stressing the anterior shoulder capsule

**Safety notes:** Zero floor contact and very low injury risk. No prerequisites. Suitable
for users returning from injury, deconditioned users, or anyone unable to perform a knee
push-up yet.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×15 | Normal | 60-90s | 2× | Mon upper + Sat full body (regression / warmup) |
| Bulk | 4×15 | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat (typically too easy — used as warmup) |
| Maintenance | 3×15 | Normal | 60-90s | 2× | Mon + Thu (entry level / deload) |
| AGRO | 3×15 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** None — this is the ladder's entry point.
**Progression path:** → Knee push-up (L1) once 3×15 feels easy with clean tempo.

---

#### Knee push-up

**Category:** Push
**Progression group:** push | **Level:** 1
**Equipment:** None | Optional: knee pad
**Target muscles (primary):** Pectoralis major, triceps
**Target muscles (secondary):** Anterior deltoid, core
**Movement type:** Compound

**Description:** A plank-on-knees position with hands under the shoulders and knees as the
body's pivot point. The chest lowers to the floor while maintaining a straight line from
the knees through the head, then presses back up to a locked-out plank. Delivers
approximately 50-60% of bodyweight load compared to a standard push-up, making it the
bridge between a wall push and a full push-up.

**Common mistakes:**
- Hips sagging toward the floor, breaking the straight knee-to-head line and losing core tension
- Leading the descent with the chin instead of the chest, reducing chest activation and shortening ROM

**Safety notes:** Pad the knees if training on a hard surface. Requires enough wrist
flexibility to hold neutral under load — use fists or parallettes if wrists are sensitive.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×12 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×12 | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×12 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×12 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Wall push-up 3×15 clean.
**Progression path:** → Standard push-up (L2) once 3×12 feels easy with full ROM.

---

#### Standard push-up

**Category:** Push
**Progression group:** push | **Level:** 2
**Equipment:** None | Optional: parallettes (wrist relief)
**Target muscles (primary):** Pectoralis major, triceps, anterior deltoid
**Target muscles (secondary):** Core, serratus anterior
**Movement type:** Compound

**Description:** Full plank position with hands shoulder-width apart and the body rigid
from heels through head. Lower the chest until it lightly touches the floor, then press
back to a full lockout. This is the benchmark for upper-body bodyweight strength and the
baseline from which all harder push progressions are built. Matches bench press strength
development when intensity and volume are equated (Kotarsky 2018).

**Common mistakes:**
- Hips sagging or piking upward, breaking the rigid plank and offloading the chest
- Stopping short of the floor, reducing ROM and undercutting hypertrophy stimulus

**Safety notes:** Requires healthy wrists and shoulders. Use parallettes if wrist
extension is painful. Do not lock elbows with violent snap at the top — maintain control.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×12-15 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×12-15 | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×12-15 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×12-15 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Knee push-up 3×12 clean.
**Progression path:** → Wide push-up (L3) once 3×15 feels easy with chest touching floor.

---

#### Wide push-up

**Category:** Push
**Progression group:** push | **Level:** 3
**Equipment:** None
**Target muscles (primary):** Pectoralis major (emphasised)
**Target muscles (secondary):** Triceps, anterior deltoid
**Movement type:** Compound

**Description:** A push-up variant with hands placed approximately 1.5-2× shoulder width.
Lower the chest to the floor with elbows tracking at roughly 75° from the torso. The
wider hand position biases pectoral recruitment — especially the sternal fibers — while
reducing the relative contribution from the triceps. A natural next step once the
standard push-up is mastered.

**Common mistakes:**
- Letting elbows flare past 90°, creating shear stress at the anterior shoulder
- Hands placed excessively wide, reducing motor control and wasting ROM

**Safety notes:** Avoid if you have a history of shoulder impingement. Do not exceed 2×
shoulder width — beyond that, the joint capsule takes load the musculature should own.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×12 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×12 | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×12 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×12 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Standard push-up 3×15 clean.
**Progression path:** → Decline push-up (L4) once 3×12 feels easy.

---

#### Decline push-up

**Category:** Push
**Progression group:** push | **Level:** 4
**Equipment:** None | Optional: chair, bed, or low bench
**Target muscles (primary):** Upper (clavicular) pectoralis, anterior deltoid
**Target muscles (secondary):** Triceps, core
**Movement type:** Compound

**Description:** A push-up with the feet elevated on a chair, bed, or low bench while
the hands remain on the floor. The inclined trunk angle shifts the relative load toward
the upper chest fibers and anterior deltoid, emulating the upper-chest bias of an incline
press in a traditional strength program. The higher the feet, the more the exercise
drifts toward a pike push-up.

**Common mistakes:**
- Elevating the feet too high, unintentionally converting the exercise into a near-pike push-up
- Letting hips sag mid-rep, losing midline tension and the clean horizontal line

**Safety notes:** Use a stable, non-slip elevation surface. Avoid soft couches or wheeled
furniture. Ensure the shoulder can tolerate overhead-biased pressing before increasing
elevation height.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×10-12 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×10-12 | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×10-12 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×10-12 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Wide push-up 3×12 clean.
**Progression path:** → Diamond push-up (L5) once 3×12 feels easy.

---

#### Diamond push-up

**Category:** Push
**Progression group:** push | **Level:** 5
**Equipment:** None
**Target muscles (primary):** Triceps
**Target muscles (secondary):** Pectoralis major (inner), anterior deltoid
**Movement type:** Compound

**Description:** The hands form a triangle beneath the chest, with the thumbs and index
fingers touching to create the "diamond" shape. Lower the chest toward the diamond while
keeping the elbows tight against the ribs. The narrow grip maximises triceps recruitment
while still loading the chest, serving as the first true tricep-dominant step in the push
ladder.

**Common mistakes:**
- Elbows flaring outward, which negates the tricep bias and transfers load to the shoulders
- Stopping at partial depth, robbing the triceps of the stimulus the hand position provides

**Safety notes:** Requires healthy wrists — the narrow hand base increases wrist extension
demand significantly compared to shoulder-width variants. Prerequisite wrist conditioning.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×8-10 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×8-10 | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×8-10 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×8-10 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Decline push-up 3×12 clean.
**Progression path:** → Archer push-up (L6) once 3×10 feels easy with elbows pinned.

---

#### Archer push-up

**Category:** Push
**Progression group:** push | **Level:** 6
**Equipment:** None
**Target muscles (primary):** Pectoralis major (unilateral)
**Target muscles (secondary):** Triceps, core (anti-rotation), obliques
**Movement type:** Compound

**Description:** Begin in a wide push-up stance. Lower the body toward one arm while the
opposite arm extends straight out laterally along the floor. The working arm performs
nearly the entire rep; the extended arm offers only minimal assist. The archer is the
primary stepping stone on the path to a full one-arm push-up, training the nervous system
to handle asymmetric load.

**Common mistakes:**
- The extended arm cheating by pressing through the palm, reducing true unilateral load
- The trunk twisting toward the working arm, shortening the lever and defeating the purpose

**Safety notes:** Maintain strong anti-rotation through the core and glutes. Do not force
strength parity between sides — instead, address imbalances gradually via rep matching.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×6-8/side | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×6-8/side | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×6-8/side | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×6-8/side | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Diamond push-up 3×10 clean.
**Progression path:** → Pike push-up (L7) once 3×8/side feels clean with no cheating.

---

#### Pike push-up

**Category:** Push
**Progression group:** push | **Level:** 7
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, medial deltoid
**Target muscles (secondary):** Triceps, upper pectoralis
**Movement type:** Compound

**Description:** Begin in a downward-dog position with hips high and head pointing
toward the floor. Bend the elbows to lower the crown of the head toward the hands, then
press back up. The inverted trunk angle shifts the dominant load onto the shoulders,
effectively turning the exercise into a bodyweight overhead press and preparing the
shoulder girdle for vertical pressing progressions.

**Common mistakes:**
- Hips dropping during the rep, reverting the movement back toward a standard push-up
- The head "crashing" down from weak shoulders — indicates insufficient strength for the level

**Safety notes:** Requires adequate hamstring flexibility to achieve and hold the hip
position. Discontinue if any shoulder impingement symptoms arise — the overhead position
is unforgiving to a compromised shoulder.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×8-10 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×8-10 | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×8-10 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×8-10 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Archer push-up 3×8/side clean.
**Progression path:** → Pseudo-planche lean (L8) once 3×10 feels easy.

---

#### Pseudo-planche lean

**Category:** Push
**Progression group:** push | **Level:** 8
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, pectoralis major, biceps tendon
**Target muscles (secondary):** Core, wrist flexors, serratus anterior
**Movement type:** Compound (isometric)

**Description:** Support the body on straight arms with the fingers pointed back toward
the feet. Lean the shoulders forward past the hand position while keeping the elbows
fully locked. An isometric hold rather than a dynamic rep — it trains the anterior
deltoid, biceps tendon, and wrist capacity required for any future planche progression.
Time under tension is the progression driver.

**Common mistakes:**
- Bending the elbows under load, which defeats the straight-arm isometric purpose entirely
- Fingers pointed forward instead of backward, skipping the wrist-conditioning stimulus

**Safety notes:** Start with a shallow lean and progress the lean angle over weeks, not
days. The wrists must be thoroughly warmed up before loading. Stop immediately on any
sharp wrist pain — this is a common injury site for this exercise.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×15-20 sec | Hold | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×20 sec | Hold | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×15-20 sec | Hold | 60-90s | 2× | Mon + Thu |
| AGRO | 4×20 sec | Hold | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Pike push-up 3×10 clean; thoroughly conditioned wrists.
**Progression path:** → One-arm push-up assisted (L9) once 4×20 sec feels stable with a
deep forward lean.

---

#### One-arm push-up (assisted)

**Category:** Push
**Progression group:** push | **Level:** 9
**Equipment:** None | Optional: bench or low step for assist variation
**Target muscles (primary):** Pectoralis major (unilateral), triceps
**Target muscles (secondary):** Core (anti-rotation), obliques, anterior deltoid
**Movement type:** Compound

**Description:** Begin in a wide stance with one hand on the floor in push-up position
and the other hand resting on the same-side knee (or on a low bench for a lighter
assist). Perform a push-up with the overwhelming majority of the load on the working
arm; the assisting hand provides only what's needed to complete clean reps. The final
rung of the push ladder before the full free-standing one-arm push-up.

**Common mistakes:**
- The trunk rotating toward the working arm, shortening the lever and reducing unilateral demand
- The assisting hand bearing too much load — converting the exercise back into a two-arm push-up

**Safety notes:** Extremely asymmetric load — both the elbow and shoulder of the working
arm must be fully healthy. Alternate sides strictly on every set to prevent the kind of
left/right imbalance that this exercise can otherwise entrench.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises instead |
| Cut | 3×3-5/side | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×3-5/side | 3-1-2-0 | 90-120s | 3× | Mon + Fri + Sat |
| Maintenance | 3×3-5/side | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×3-5/side | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Pseudo-planche lean 4×20 sec clean.
**Progression path:** → End of push progression. Advance into the dedicated planche
track (`EXERCISE_PROGRESSIONS.skill_planche`) to continue developing straight-arm
pressing strength.

---

### PULL PROGRESSION (9 Levels)

The pull ladder is the primary horizontal pulling and posterior-chain track. Because
Protocol Health is a zero-equipment system, the ladder cannot rely on a pull-up bar — it
builds the back through prone holds, inverted rows under a table, scapular control work,
and finally improvised resistance from a doored towel. The ladder runs from Superman hold
(L1) through Archer row towel (L9). Source of truth: `EXERCISE_PROGRESSIONS.pull` in
`app.html`.

The pull track is also the enforcement mechanism for Protocol Health's hard push:pull rule
— no plan may exceed a 1:1 push:pull ratio across the week (CLAUDE.md §15: Cools 2016 +
Prinold 2016). Every push session must be matched by a corresponding pull stimulus.

---

#### Superman hold

**Category:** Pull
**Progression group:** pull | **Level:** 1
**Equipment:** None
**Target muscles (primary):** Erector spinae, posterior deltoid
**Target muscles (secondary):** Glutes, rhomboids, hamstrings
**Movement type:** Compound (isometric)

**Description:** Lie face down on the floor with arms extended overhead and legs
straight. Lift the arms, chest, and legs simultaneously off the floor and hold the
position with a strong contraction throughout the entire posterior chain. An isometric
hold that builds baseline back endurance and reintroduces the posterior chain to active
contraction — the entry point for users who have no pulling strength yet.

**Common mistakes:**
- Cranking the head back to "lift higher", which compresses the cervical spine instead of working the back
- Holding breath through the rep — breathing must continue through the entire isometric

**Safety notes:** Keep the gaze down at the floor to maintain a neutral neck. Stop
immediately on any sharp lower-back pain — discomfort and burn are normal, sharp pain is
not.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×20-30 sec | Hold | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×30 sec | Hold | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×20-30 sec | Hold | 60-90s | 2× | Mon + Thu |
| AGRO | 3×20-30 sec | Hold | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** None — this is the ladder's entry point.
**Progression path:** → Prone Y-T-W raises (L2) once 3×30 sec is held cleanly with
controlled breathing.

---

#### Prone Y-T-W raises

**Category:** Pull
**Progression group:** pull | **Level:** 2
**Equipment:** None
**Target muscles (primary):** Posterior deltoid, mid-trapezius, lower trapezius
**Target muscles (secondary):** Rhomboids, rotator cuff
**Movement type:** Isolation (multi-position)

**Description:** Lie face down with chest off the floor. Move the arms through three
distinct positions in sequence — Y (arms overhead at 45°), T (arms straight out to the
sides), and W (elbows bent, hands by ears with shoulder blades retracted). Each
position targets a different region of the upper-back stabilisers and cues scapular
retraction patterns critical for healthy shoulder function.

**Common mistakes:**
- Using momentum to swing the arms up instead of lifting them slowly with the back
- Shrugging the shoulders toward the ears in the T and W positions, which steals work from the mid- and lower-trap

**Safety notes:** Keep the neck long and the gaze at the floor. If a position causes
pinching at the front of the shoulder, reduce the lift height — never push through
impingement.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×10 each | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×10 each | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×10 each | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×10 each | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022, Cools 2016 (scapular stabilisers)
**Progression prerequisites:** Superman hold 3×30 sec clean.
**Progression path:** → Inverted row knees bent (L3) once 3×10 each position is clean
with no shrugging.

---

#### Inverted row (knees bent)

**Category:** Pull
**Progression group:** pull | **Level:** 3
**Equipment:** None | Optional: sturdy table edge
**Target muscles (primary):** Latissimus dorsi, rhomboids, biceps
**Target muscles (secondary):** Posterior deltoid, forearms
**Movement type:** Compound

**Description:** Lie face up under a sturdy table with hands gripping the table edge
shoulder-width apart. With knees bent and feet flat on the floor, pull the chest up to
the table edge by retracting the shoulder blades and bending the elbows. The first true
horizontal pulling movement in the ladder — equivalent to a regressed bodyweight row
that loads the lats and biceps directly.

**Common mistakes:**
- Leading the pull with the chin instead of driving with the chest, shortening ROM
- Letting the hips sag, which removes the core anti-extension component and cheats the row angle

**Safety notes:** Test the table for stability before loading it — it must comfortably
hold full body weight. If no table is available, use any horizontal surface at hip
height (low rail, sturdy desk).

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×8-10 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×8-10 | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×8-10 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×8-10 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Prone Y-T-W raises 3×10 each.
**Progression path:** → Inverted row legs straight (L4) once 3×10 is clean with chest
touching the table edge.

---

#### Inverted row (legs straight)

**Category:** Pull
**Progression group:** pull | **Level:** 4
**Equipment:** None | Optional: sturdy table edge
**Target muscles (primary):** Latissimus dorsi, rhomboids, biceps
**Target muscles (secondary):** Core (anti-extension), posterior deltoid
**Movement type:** Compound

**Description:** Same set-up as the bent-knee inverted row, but legs are straight and
heels are the only contact with the floor. The body forms a rigid plank from heels to
shoulders throughout the rep. Straightening the legs both increases the load on the
upper back and adds an anti-extension demand on the core.

**Common mistakes:**
- Hips sagging mid-rep, breaking the rigid plank line and reducing the anti-extension stimulus
- Pulling unevenly because one side is stronger — often hidden by the bent-knee variant

**Safety notes:** Wrist position should be neutral with the table edge cradled in the
palm. Discontinue if shoulder pain appears at the top of the pull.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×8-10 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×8-10 | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×8-10 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×8-10 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Inverted row knees bent 3×10 clean.
**Progression path:** → Inverted row feet elevated (L5) once 3×10 is clean with no hip sag.

---

#### Inverted row (feet elevated)

**Category:** Pull
**Progression group:** pull | **Level:** 5
**Equipment:** None | Optional: sturdy table + chair
**Target muscles (primary):** Latissimus dorsi, rhomboids, biceps
**Target muscles (secondary):** Core, posterior deltoid
**Movement type:** Compound

**Description:** Inverted row set-up with the feet elevated on a chair so the body is
fully horizontal — parallel to the floor — at the top of the row. Elevating the feet
shifts the row angle steeper, increasing the percentage of bodyweight pulled and
intensifying both the back and core demand. The hardest inverted row variant in the
ladder.

**Common mistakes:**
- Chair shifting mid-set, breaking position — chair must be braced or against a wall
- Cheating the rep by piking the hips, reducing the steeper angle's intended load

**Safety notes:** Brace the chair against a wall to prevent slipping. Ensure the table
edge can take the full perpendicular load. Bail by un-gripping safely — never twist out
of the position under load.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×6-8 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×6-8 | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×6-8 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×6-8 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Inverted row legs straight 3×10 clean.
**Progression path:** → Scapular push-up (L6) once 3×8 is clean with full horizontal body.

---

#### Scapular push-up

**Category:** Pull
**Progression group:** pull | **Level:** 6
**Equipment:** None
**Target muscles (primary):** Serratus anterior
**Target muscles (secondary):** Pectoralis (isometric), triceps (isometric), rhomboids
**Movement type:** Isolation

**Description:** Begin in a standard plank or push-up position with elbows fully locked
throughout the entire rep. Without bending the elbows, protract (push the floor away,
spreading the shoulder blades) and then retract (squeeze the blades together) the
scapulae. The arms remain straight — only the shoulder blades move. Trains scapular
control and serratus anterior strength, both of which are non-negotiable prerequisites
for any planche progression.

**Common mistakes:**
- Bending the elbows to fake the range of motion, which converts the exercise into a partial push-up
- Failing to fully protract at the top, leaving the serratus under-stimulated

**Safety notes:** A planche prerequisite exercise — placement here in the pull ladder
is intentional because of the heavy scapular and rhomboid involvement. Wrists must be
healthy enough for plank loading.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×12 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×12 | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×12 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×12 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022, Cools 2016 (scapular stabilisers)
**Progression prerequisites:** Standard push-up 3×12 clean.
**Progression path:** → Thread the needle (L7) once 3×12 is clean with full scapular ROM.
Also serves as a prerequisite into the planche skill track.

---

#### Thread the needle

**Category:** Pull
**Progression group:** pull | **Level:** 7
**Equipment:** None
**Target muscles (primary):** Thoracic rotators, obliques
**Target muscles (secondary):** Posterior deltoid, rhomboids, serratus anterior
**Movement type:** Mobility-strength hybrid

**Description:** Begin on all-fours with hands under shoulders and knees under hips.
Lift one arm and rotate it under the supporting arm, threading it through the gap
between the opposite arm and the floor while the shoulder, head, and upper torso follow
the rotation. Return to the start position. Builds thoracic spine rotational mobility
plus controlled rotational strength — the missing link between basic horizontal pulling
and the more advanced unilateral pulls that follow.

**Common mistakes:**
- Letting the hips sway as the arm rotates, leaking the rotation out of the spine and into the pelvis
- Rushing the rep, missing the mobility benefit that comes from controlled tempo

**Safety notes:** Keep weight evenly distributed across the supporting hand. Stop on any
sharp shoulder or thoracic pain — gentle stretch is correct, sharp pain is not.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×8/side | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×8/side | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×8/side | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×8/side | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Scapular push-up 3×12 clean.
**Progression path:** → Towel row (L8) once 3×8/side is controlled and even on both sides.

---

#### Towel row

**Category:** Pull
**Progression group:** pull | **Level:** 8
**Equipment:** Required: sturdy towel + closeable door
**Target muscles (primary):** Latissimus dorsi, biceps, rhomboids
**Target muscles (secondary):** Forearms, posterior deltoid
**Movement type:** Compound

**Description:** Loop a sturdy towel around a door handle (or through a closed door
above the handle for a higher anchor), grip both ends of the towel, and lean back so
the towel is taut. Pull the chest toward the door by retracting the scapulae and
bending the elbows, then control the descent. The towel grip simultaneously builds
forearm and grip strength, which a standard inverted row does not.

**Common mistakes:**
- Letting the door swing or shift — the door must be fully closed and latched, with the towel anchored on the opposite side from the puller
- Curling the wrists to take load off the lats, converting the row into a biceps-dominant movement

**Safety notes:** Equipment requirement — needs a sturdy towel that will not tear and a
door rated to take the load. Do not use hollow-core doors. Test the set-up at low load
before performing full sets.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×8-10 | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×8-10 | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×8-10 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×8-10 | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Thread the needle 3×8/side clean.
**Progression path:** → Archer row towel (L9) once 3×10 is clean with strong grip and
full retraction.

---

#### Archer row (towel)

**Category:** Pull
**Progression group:** pull | **Level:** 9
**Equipment:** Required: sturdy towel + closeable door
**Target muscles (primary):** Latissimus dorsi (unilateral), rhomboids
**Target muscles (secondary):** Biceps, forearms, core (anti-rotation), obliques
**Movement type:** Compound

**Description:** Same set-up as the towel row, but only one hand grips the towel while
the other hand presses against the door (or hangs free) for assistance. The working
arm performs the bulk of the row while the assisting hand provides only as much help
as needed for clean reps. The pull-side counterpart to the archer push-up — building
unilateral pulling strength that progresses toward a true one-arm row.

**Common mistakes:**
- The assisting hand bearing too much load, masking the unilateral demand
- The trunk rotating away from the working arm, shortening the working lever and reducing the lat stretch

**Safety notes:** Equipment requirement — same door and towel safety checks as the
standard towel row apply. Strict side alternation is essential to prevent any left/right
imbalance. Stop on any sharp elbow or shoulder pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair exercises (seated row) |
| Cut | 3×6-8/side | Normal | 60-90s | 2× | Mon upper + Sat full body |
| Bulk | 4×6-8/side | 3-1-2-0 | 90-120s | 3× | Tue + Fri + Sat |
| Maintenance | 3×6-8/side | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×6-8/side | Normal | 60-90s | 3× | Mon/Wed/Fri mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Towel row 3×10 clean.
**Progression path:** → End of pull progression. Continue accumulating unilateral
pulling volume and bias toward improvised single-arm rowing variations as needed.

---

### SHOULDER PROGRESSION (6 Levels)

The shoulder ladder is the dedicated vertical pressing track. Where the push ladder
addresses horizontal pressing, the shoulder ladder builds the strict overhead press
pattern through progressively steeper pike positions and ultimately the wall and
freestanding handstand push-up. Source of truth: `EXERCISE_PROGRESSIONS.shoulder` in
`app.html`.

The shoulder progression overlaps with the upper end of the push progression: pike
push-up appears in both ladders because it serves as both the L7 push exercise and the
L2 shoulder exercise. AGRO sources its dedicated shoulder work via the push progression's
pike variant, so per-plan tables note this routing in the AGRO row.

---

#### Pike push-up (bent knee)

**Category:** Shoulder
**Progression group:** shoulder | **Level:** 1
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, medial deltoid
**Target muscles (secondary):** Triceps, upper pectoralis
**Movement type:** Compound

**Description:** Begin in a downward-dog position with hips piked high but knees kept
slightly bent to shorten the lever and reduce the percentage of bodyweight loaded onto
the shoulders. Bend the elbows to lower the crown of the head toward the floor between
the hands, then press back up. The bent-knee variation makes it the entry point for
users who can press a standard push-up but cannot yet tolerate full inverted-trunk
loading.

**Common mistakes:**
- Letting the hips drop, which converts the rep into a half push-up and removes the shoulder bias
- Flaring the elbows out wide instead of tracking them in the same plane as the body, stressing the shoulder capsule

**Safety notes:** Requires basic horizontal pressing strength first. Stop immediately on
any pinch at the front of the shoulder — the pike position is unforgiving to a
compromised shoulder.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated shoulder press instead |
| Cut | 3×8 | Normal | 60-90s | 1× | Mon upper body |
| Bulk | 3×8 | 3-1-2-0 | 90-120s | 2× | Mon + Fri |
| Maintenance | 3×8 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×8 | Normal | 60-90s | — | Via push progression pike variant |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Standard push-up 3×12 clean.
**Progression path:** → Pike push-up (full) (L2) once 3×8 is clean with stable hips.

---

#### Pike push-up (full)

**Category:** Shoulder
**Progression group:** shoulder | **Level:** 2
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, medial deltoid
**Target muscles (secondary):** Triceps, upper pectoralis, core
**Movement type:** Compound

**Description:** Same movement as the bent-knee variation but with the legs straight,
forming a full pike position with the hips driven high. The straighter the legs and
the higher the hips, the more vertical the trunk angle becomes — and the more bodyweight
the shoulders take. The full pike push-up is the bodyweight equivalent of a strict
overhead press with a moderate load and is the foundation pattern for all handstand
work.

**Common mistakes:**
- Hips creeping down through the set as fatigue accumulates, regressing the rep back toward bent-knee
- The head crashing to the floor without control, indicating insufficient eccentric strength for the level

**Safety notes:** Requires adequate hamstring flexibility for the hip position.
Discontinue on any shoulder impingement symptoms.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated shoulder press instead |
| Cut | 3×8-10 | Normal | 60-90s | 1× | Mon upper body |
| Bulk | 3×10 | 3-1-2-0 | 90-120s | 2× | Mon + Fri |
| Maintenance | 3×8-10 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×8-10 | Normal | 60-90s | — | Via push progression pike variant (L7) |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Pike push-up bent knee 3×8 clean.
**Progression path:** → Decline pike push-up (L3) once 3×10 is clean with stable hips and
controlled descent.

---

#### Decline pike push-up

**Category:** Shoulder
**Progression group:** shoulder | **Level:** 3
**Equipment:** None | Optional: chair, bed, or low bench
**Target muscles (primary):** Anterior deltoid, medial deltoid
**Target muscles (secondary):** Triceps, upper pectoralis, core
**Movement type:** Compound

**Description:** A pike push-up performed with the feet elevated on a chair or low
bench. Elevating the feet drives the trunk angle even more vertical than the standard
pike, increasing the bodyweight load on the shoulders and bringing the movement closer
to a true handstand press. The final pike-pattern step before transitioning to wall
handstand work.

**Common mistakes:**
- Elevation too high too soon, jumping the load past what the shoulders are ready for
- Hips drifting away from the elevation point, breaking the steep trunk angle

**Safety notes:** Use a stable, non-slip elevation surface. Avoid soft couches or wheeled
furniture. Bail forward by stepping the feet down — never collapse to one side.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated shoulder press instead |
| Cut | 3×6-8 | Normal | 60-90s | 1× | Mon upper body |
| Bulk | 3×8 | 3-1-2-0 | 90-120s | 2× | Mon + Fri |
| Maintenance | 3×6-8 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×6-8 | Normal | 60-90s | — | Via push progression pike variant |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Pike push-up full 3×10 clean.
**Progression path:** → Wall handstand hold (L4) once 3×8 is clean with stable elevated
feet.

---

#### Wall handstand hold

**Category:** Shoulder
**Progression group:** shoulder | **Level:** 4
**Equipment:** None | Required: clear wall space
**Target muscles (primary):** Anterior deltoid, medial deltoid, triceps
**Target muscles (secondary):** Core, trapezius, forearms
**Movement type:** Compound (isometric)

**Description:** Place the hands on the floor a comfortable distance from the wall and
walk the feet up the wall until the body is fully inverted with the heels resting on
the wall. Hold the inverted position with elbows fully locked, body stacked vertically,
and tension throughout the entire kinetic chain. The first true handstand step in the
ladder — a static hold that builds shoulder, wrist, and core capacity for the dynamic
handstand pressing that follows.

**Common mistakes:**
- Banana-back arch with the lower spine compensating for tight shoulders or weak core
- Walking the hands too far from the wall, creating a planche-like lean instead of a vertical stack

**Safety notes:** Wrist strength is required — warm up wrists thoroughly before any
handstand work. **Bail laterally**, not backward — if the hold fails, step one foot
down to the side and rotate out of the position. Never collapse straight backward onto
the spine. Ensure the wall is clear of obstacles, picture frames, and breakables before
kicking up.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated shoulder press instead |
| Cut | 3×20-30 sec | Hold | 60-90s | 1× | Mon upper body |
| Bulk | 3×30 sec | Hold | 90-120s | 2× | Mon + Fri |
| Maintenance | 3×20-30 sec | Hold | 60-90s | 1× | Thu |
| AGRO | 3×20-30 sec | Hold | 60-90s | — | Via push progression pike variant |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Decline pike push-up 3×8 clean; thoroughly conditioned
wrists.
**Progression path:** → Wall handstand push-up (partial) (L5) once 3×30 sec is held
stable with no lateral wobble.

---

#### Wall handstand push-up (partial)

**Category:** Shoulder
**Progression group:** shoulder | **Level:** 5
**Equipment:** None | Required: clear wall space
**Target muscles (primary):** Anterior deltoid, medial deltoid, triceps
**Target muscles (secondary):** Trapezius, core
**Movement type:** Compound

**Description:** From a stable wall handstand hold, bend the elbows to lower the head
a small distance toward the floor — typically only a few inches at this stage — and
press back up to the locked-out handstand. The partial range builds the strength
required for the eventual full HSPU without overloading the shoulders. Range increases
gradually over weeks and months until full range is achievable.

**Common mistakes:**
- Going for too much range too soon and collapsing under the load
- Letting the body drift away from the wall during the descent, losing the vertical line

**Safety notes:** Requires a solid 30-second wall handstand hold first — do not attempt
this level without that base. **Bail laterally** on any failed rep — never let the head
crash straight down. Pad the floor with a folded towel under the head while learning the
movement.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated shoulder press instead |
| Cut | 3×3-5 | Normal | 60-90s | 1× | Mon upper body |
| Bulk | 3×5 | 3-1-2-0 | 90-120s | 2× | Mon + Fri |
| Maintenance | 3×3-5 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×3-5 | Normal | 60-90s | — | Via push progression pike variant |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Wall handstand hold 3×30 sec stable.
**Progression path:** → Full handstand push-up (L6) once 3×5 is clean with the partial
range expanded toward full ROM.

---

#### Full handstand push-up

**Category:** Shoulder
**Progression group:** shoulder | **Level:** 6
**Equipment:** None | Required: clear wall space
**Target muscles (primary):** Anterior deltoid, medial deltoid, triceps
**Target muscles (secondary):** Trapezius, core, upper pectoralis
**Movement type:** Compound

**Description:** From a stable wall handstand, bend the elbows to lower the head all
the way to the floor (or to a folded towel for protection), then press back up to a
fully locked-out handstand. A complete strict overhead press performed against full
bodyweight, with the wall providing only balance — not load relief. Considered an
advanced bodyweight pressing milestone in any zero-equipment system.

**Common mistakes:**
- Cheating range by stopping the descent inches above the floor and calling it a full rep
- Kipping the legs to drive the press, losing the strict-press quality

**Safety notes:** Requires consistent wall handstand push-up partial reps in the bag
first. **Bail laterally** on any failed rep. Always pad the floor with a folded towel
under the head. Stop immediately on any neck or shoulder pain — this is the most
demanding shoulder exercise in the entire library.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated shoulder press instead |
| Cut | 3×3-5 | Normal | 60-90s | 1× | Mon upper body |
| Bulk | 3×5 | 3-1-2-0 | 90-120s | 2× | Mon + Fri |
| Maintenance | 3×3-5 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×3-5 | Normal | 60-90s | — | Via push progression pike variant |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Wall handstand push-up partial 3×5 clean.
**Progression path:** → End of shoulder progression. Advance into the dedicated
handstand skill track (`EXERCISE_PROGRESSIONS.skill_handstand`) to develop freestanding
HSPU and away-from-wall handstand work.

---

### SQUAT PROGRESSION (9 Levels)

The squat ladder is the primary lower-body knee-dominant track. It builds quad, glute,
and adductor capacity through 9 sequential exercises ranging from a static wall squat
hold (L1) for users with no leg-strength base, all the way to a full unassisted pistol
squat (L9). Source of truth: `EXERCISE_PROGRESSIONS.squat` in `app.html`.

The squat ladder is the only lower-body track in Lite — Lite users perform the L1 wall
squat hold exclusively (2×30 sec) on Friday full body day and never advance to L2+. All
other plans run the full ladder according to the per-plan prescription tables below.

---

#### Wall squat (hold)

**Category:** Squat
**Progression group:** squat | **Level:** 1
**Equipment:** None | Required: clear wall space
**Target muscles (primary):** Quadriceps
**Target muscles (secondary):** Glutes, hamstrings (isometric)
**Movement type:** Compound (isometric)

**Description:** Stand with the back flat against a wall and walk the feet out until
the thighs are parallel to the floor (or as close as the user can hold cleanly). Knees
track over the toes, feet flat, lower back pressed gently into the wall. Hold the
position with the quadriceps under continuous tension. The entry point for users with
no functional leg strength and the only squat exercise prescribed in the Lite plan.

**Common mistakes:**
- Knees caving inward as fatigue accumulates, breaking knee tracking
- Letting the hips drift higher than parallel to cheat the time

**Safety notes:** Stop immediately on any sharp knee pain. Mild quad burn is correct
and expected. The wall must be clear of obstacles and the floor non-slip.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×30 sec | Hold | As needed | 1× | Fri full body — Lite uses ONLY this level |
| Cut | 3×30-45 sec | Hold | 60-90s | 2× | Thu lower + Sat full body (warmup / regression) |
| Bulk | 4×45 sec | Hold | 90-120s | 2× | Thu lower + Sat full body (warmup) |
| Maintenance | 3×30-45 sec | Hold | 60-90s | 2× | Mon + Thu (entry level / deload) |
| AGRO | 3×30-45 sec | Hold | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** None — this is the ladder's entry point.
**Progression path:** → Box squat (L2) once 3×45 sec is held cleanly with thighs at
parallel. **Lite users do not progress past this level.**

---

#### Box squat

**Category:** Squat
**Progression group:** squat | **Level:** 2
**Equipment:** None | Required: chair, bench, or low surface
**Target muscles (primary):** Quadriceps, glutes
**Target muscles (secondary):** Hamstrings, core
**Movement type:** Compound

**Description:** Stand in front of a chair or low bench with feet shoulder-width apart.
Squat down until the glutes lightly touch the chair, then stand back up. The chair acts
as a depth regulator and a confidence cue — the user knows exactly where the bottom of
the squat is. Used to teach the squat pattern under load without requiring full
ankle/hip mobility.

**Common mistakes:**
- Slamming down onto the chair, losing eccentric control and shock-loading the spine
- Using the hands or arms to push off the chair, removing the leg drive

**Safety notes:** The chair must be sturdy and braced against a wall to prevent
slipping. Touch the chair lightly — do not sit and rest between reps unless explicitly
prescribed.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×10-12 | Normal | 60-90s | 2× | Thu lower + Sat full body |
| Bulk | 4×10-12 | 3-1-2-0 | 90-120s | 2× | Thu lower + Sat full body |
| Maintenance | 3×10-12 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×10-12 | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Wall squat hold 3×45 sec clean.
**Progression path:** → Bodyweight squat (partial) (L3) once 3×12 is clean with controlled
descent.

---

#### Bodyweight squat (partial)

**Category:** Squat
**Progression group:** squat | **Level:** 3
**Equipment:** None
**Target muscles (primary):** Quadriceps, glutes
**Target muscles (secondary):** Hamstrings, core
**Movement type:** Compound

**Description:** A free-standing squat performed to roughly half depth — the thighs
parallel to the floor or slightly above. Removes the chair as a depth cue and teaches
the user to find depth proprioceptively. The bridge between the box squat's external
depth regulator and the full-depth squat's full ROM demand.

**Common mistakes:**
- Knees caving inward at the bottom of the rep, breaking knee tracking
- Heels lifting off the floor, indicating insufficient ankle dorsiflexion

**Safety notes:** Maintain heels-down throughout. If heels lift, regress back to box
squat or address ankle mobility. Stop on any sharp knee pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×12-15 | Normal | 60-90s | 2× | Thu lower + Sat full body |
| Bulk | 4×12-15 | 3-1-2-0 | 90-120s | 2× | Thu lower + Sat full body |
| Maintenance | 3×12-15 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×12-15 | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Box squat 3×12 clean.
**Progression path:** → Bodyweight squat (full) (L4) once 3×15 is clean with stable knee
tracking and heels down.

---

#### Bodyweight squat (full)

**Category:** Squat
**Progression group:** squat | **Level:** 4
**Equipment:** None
**Target muscles (primary):** Quadriceps, glutes, adductors
**Target muscles (secondary):** Core, erector spinae, hamstrings
**Movement type:** Compound

**Description:** A full-depth bodyweight squat — "ass to grass" — with the hip crease
dropping below the knee crease at the bottom of the rep. The benchmark for lower body
bodyweight strength and the foundation for every harder squat variation that follows.
Trains the full hip and knee range of motion required for athletic and combat
movements.

**Common mistakes:**
- Stopping at parallel and counting it as a full rep, robbing the bottom-end ROM
- Letting the lower back round at the bottom (butt wink), placing shear on the lumbar spine

**Safety notes:** Healthy ankles, knees, hips, and lumbar spine required. Address any
mobility limitations rather than forcing depth. Stop on any sharp knee or back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×15-20 | Normal | 60-90s | 2× | Thu lower + Sat full body |
| Bulk | 4×15-20 | 3-1-2-0 | 90-120s | 2× | Thu lower + Sat full body |
| Maintenance | 3×15-20 | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×15-20 | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Bodyweight squat partial 3×15 clean.
**Progression path:** → Jump squat (L5) once 3×20 is clean with full ROM. **Users >100kg
should skip L5 entirely and progress directly to Bulgarian split squat (L6).**

---

#### Jump squat

**Category:** Squat
**Progression group:** squat | **Level:** 5
**Equipment:** None
**Target muscles (primary):** Quadriceps, glutes
**Target muscles (secondary):** Calves, core, hip flexors
**Movement type:** Compound (plyometric)

**Description:** A bodyweight squat performed with maximal explosive intent — at the
bottom of the rep, drive aggressively upward, leaving the floor entirely, then absorb
the landing softly back into the next rep. Adds a power and rate-of-force-development
component to the squat ladder that pure strength reps cannot deliver.

**Common mistakes:**
- Landing stiff-legged, sending impact straight into the knees and lower back
- Cutting the depth to maximise jump height, sacrificing the squat pattern's load

**Safety notes:** **N/A for users >100kg — substitute fast bodyweight squats. The joint
impact load at heavy bodyweight is too high for routine plyometric training.** All users
must land soft, with knees tracking over toes and hips absorbing the descent. Stop on any
knee, ankle, or lower back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×10 | Explosive | 60-90s | 2× | Thu lower + Sat full body. N/A >100kg — sub fast BW squats |
| Bulk | 4×10 | Explosive | 90-120s | 2× | Thu lower + Sat full body. N/A >100kg — sub fast BW squats |
| Maintenance | 3×10 | Explosive | 60-90s | 2× | Mon + Thu. N/A >100kg — sub fast BW squats |
| AGRO | 3×10 | Explosive | 60-90s | 3× | Tue/Thu/Sat mornings. N/A >100kg — sub fast BW squats |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Bodyweight squat full 3×20 clean.
**Progression path:** → Bulgarian split squat (L6) once 3×10 is clean with soft landings.
Heavy users (>100kg) skip directly from L4 to L6.

---

#### Bulgarian split squat

**Category:** Squat
**Progression group:** squat | **Level:** 6
**Equipment:** None | Optional: chair or low bench for rear foot
**Target muscles (primary):** Quadriceps, glutes (unilateral)
**Target muscles (secondary):** Core (balance), hip flexors, adductors
**Movement type:** Compound

**Description:** Stand a stride length in front of a chair, place the top of the rear
foot on the chair, and lower the rear knee toward the floor while bending the front
knee deeply. Drive back up through the front foot. The first true unilateral lower
body movement in the ladder, exposing strength and balance asymmetries between sides.

**Common mistakes:**
- The front knee tracking inward at the bottom of the rep
- The torso pitching too far forward, converting the exercise into a hip-dominant lunge instead of a quad-dominant split squat

**Safety notes:** **Cross-level dependency: requires hinge level ≥ 2 (single-leg
glute bridge) for sufficient unilateral hip stability before attempting.** The rear
foot surface must be stable. Bail forward by stepping the rear foot off the chair if
balance fails.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×8-10/leg | Normal | 60-90s | 2× | Thu lower + Sat full body |
| Bulk | 4×8-10/leg | 3-1-2-0 | 90-120s | 2× | Thu lower + Sat full body |
| Maintenance | 3×8-10/leg | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×8-10/leg | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Jump squat 3×10 clean (or Bodyweight squat full 3×20 if
>100kg). **Plus** hinge level ≥ 2 (single-leg glute bridge 3×12/leg).
**Progression path:** → Cossack squat (L7) once 3×10/leg is clean with even side balance.

---

#### Cossack squat

**Category:** Squat
**Progression group:** squat | **Level:** 7
**Equipment:** None
**Target muscles (primary):** Quadriceps, adductors, glutes
**Target muscles (secondary):** Ankle dorsiflexors, hip flexors, hamstrings
**Movement type:** Compound

**Description:** Stand with feet wider than shoulder width and toes pointed slightly
out. Shift the weight onto one leg and bend the knee deeply, descending into a full
squat on that side while the opposite leg remains straight with the heel down or toes
up. Stand back up and shift to the other side. A lateral squat pattern that builds
adductor strength and hip + ankle mobility simultaneously.

**Common mistakes:**
- The straight-leg side coming off the floor or losing the heel contact, breaking the lateral squat shape
- Rounding the lower back at the bottom of the rep instead of staying tall through the chest

**Safety notes:** Requires healthy hip and ankle mobility. Approach the depth gradually
over weeks — do not force a deep position. Stop on any sharp groin or knee pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×6-8/side | Normal | 60-90s | 2× | Thu lower + Sat full body |
| Bulk | 4×6-8/side | 3-1-2-0 | 90-120s | 2× | Thu lower + Sat full body |
| Maintenance | 3×6-8/side | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×6-8/side | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Bulgarian split squat 3×10/leg clean.
**Progression path:** → Pistol squat (assisted) (L8) once 3×8/side is clean with full
depth and heel-down on the straight side.

---

#### Pistol squat (assisted)

**Category:** Squat
**Progression group:** squat | **Level:** 8
**Equipment:** None | Required: wall, doorframe, or sturdy upright
**Target muscles (primary):** Quadriceps (unilateral), glutes
**Target muscles (secondary):** Core, ankle dorsiflexors, hip flexors (non-working leg)
**Movement type:** Compound

**Description:** A single-leg squat with one hand holding a wall, doorframe, or sturdy
upright for assistance and balance. The non-working leg extends straight forward. Lower
into a full pistol position on the working leg, then drive back up. The assist provides
just enough support to make full-depth single-leg squats possible while the legs and
core build the strength to perform them unassisted.

**Common mistakes:**
- The assisting hand pulling the body up, removing the unilateral leg load
- The non-working leg drifting toward the floor, losing the pistol shape

**Safety notes:** The doorframe or upright must be sturdy enough to take significant
load. Bail by sitting back onto the working heel if the rep fails. Healthy ankles and
knees required.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×3-5/leg | Normal | 60-90s | 2× | Thu lower + Sat full body |
| Bulk | 4×3-5/leg | 3-1-2-0 | 90-120s | 2× | Thu lower + Sat full body |
| Maintenance | 3×3-5/leg | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×3-5/leg | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Cossack squat 3×8/side clean.
**Progression path:** → Pistol squat (full) (L9) once 3×5/leg is clean with the assisting
hand barely loaded.

---

#### Pistol squat (full)

**Category:** Squat
**Progression group:** squat | **Level:** 9
**Equipment:** None
**Target muscles (primary):** Quadriceps, glutes
**Target muscles (secondary):** Core, ankle dorsiflexors, hip flexors (non-working leg)
**Movement type:** Compound

**Description:** An unassisted full-depth single-leg squat. Stand on one leg with the
other leg extended straight forward and arms outstretched in front for counterbalance.
Lower the working leg into a deep squat with the non-working leg held off the floor
throughout the entire rep, then drive back up. The terminal exercise of the squat
ladder and a recognised elite-level bodyweight strength milestone.

**Common mistakes:**
- The non-working heel touching the floor at the bottom of the rep, converting the exercise into an assisted variant
- Cutting the depth, robbing the rep of the full pistol-squat ROM

**Safety notes:** Requires excellent ankle dorsiflexion, hip flexor strength on the
non-working leg, and full single-leg strength on the working leg. Bail by stepping out
of the rep with the front leg if the descent fails. Stop on any sharp knee or ankle pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Wall squat (L1) only |
| Cut | 3×3-5/leg | Normal | 60-90s | 2× | Thu lower + Sat full body |
| Bulk | 4×3-5/leg | 3-1-2-0 | 90-120s | 2× | Thu lower + Sat full body |
| Maintenance | 3×3-5/leg | Normal | 60-90s | 2× | Mon + Thu |
| AGRO | 3×3-5/leg | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Pistol squat assisted 3×5/leg clean.
**Progression path:** → End of squat progression. Continue accumulating volume and bias
toward weighted unilateral variants if external load becomes available.

---

### HINGE PROGRESSION (7 Levels)

The hinge ladder is the primary lower-body posterior-chain track. Where the squat ladder
addresses knee-dominant movement, the hinge ladder builds the hip-dominant pattern
through 7 sequential exercises ranging from a basic two-foot glute bridge (L1) to a full
concentric Nordic hamstring curl (L7). The hinge progression is critical for hamstring
strength, glute development, lower-back resilience, and hamstring injury prevention.
Source of truth: `EXERCISE_PROGRESSIONS.hinge` in `app.html`.

The hinge ladder is also the gate-keeper for the squat ladder's L6 (Bulgarian split
squat) — that exercise carries an explicit cross-level dependency requiring hinge
level ≥ 2 (single-leg glute bridge) before it can be attempted.

Lite users perform ONLY L1 (Glute bridge) at 2×10 on the Saturday Pilates session and
do not progress past this level. All other plans run the full ladder according to the
per-plan prescription tables below.

---

#### Glute bridge

**Category:** Hinge
**Progression group:** hinge | **Level:** 1
**Equipment:** None
**Target muscles (primary):** Glutes, hamstrings
**Target muscles (secondary):** Core, erector spinae
**Movement type:** Compound

**Description:** Lie on the back with knees bent and feet flat on the floor about hip
width apart. Drive through the heels to lift the hips off the floor until the body
forms a straight line from shoulders to knees, squeezing the glutes hard at the top,
then lower with control. The entry point for the entire hinge ladder and the only
hinge exercise prescribed in the Lite plan.

**Common mistakes:**
- Pushing through the toes instead of the heels, shifting load away from the glutes onto the quads
- Hyperextending the lower back at the top to make the bridge "higher", compressing the lumbar spine

**Safety notes:** Stop immediately on any sharp lower-back pain. Mild glute and
hamstring contraction is correct. Squeeze the glutes, do not arch the back.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×10 | Normal | As needed | 1× | Sat Pilates session — Lite uses ONLY this level |
| Cut | 3×12-15 | Normal | 60-90s | 1-2× | Thu lower body |
| Bulk | 3×15 | 3-1-2-0 | 90-120s | 2× | Tue pull + Thu lower |
| Maintenance | 3×12 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×15 | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** None — this is the ladder's entry point.
**Progression path:** → Glute bridge (single leg) (L2) once 3×15 is clean with strong
glute squeeze and no lower-back arching. **Lite users do not progress past this level.**

---

#### Glute bridge (single leg)

**Category:** Hinge
**Progression group:** hinge | **Level:** 2
**Equipment:** None
**Target muscles (primary):** Glutes (unilateral), hamstrings
**Target muscles (secondary):** Core (anti-rotation), erector spinae
**Movement type:** Compound

**Description:** Set up as a standard glute bridge with one foot flat on the floor, then
extend the opposite leg straight out (or hold it bent at the hip with the knee at 90°).
Drive through the working heel to lift the hips, keeping them level and square through
the entire rep. The first true unilateral hinge in the ladder, exposing left/right
strength and stability asymmetries that the two-foot bridge can hide. Also the unlock
for the Bulgarian split squat (squat L6).

**Common mistakes:**
- Hips dropping or rotating to the non-working side at the top, breaking the level pelvis
- The non-working leg dropping toward the floor, robbing the core of its anti-rotation work

**Safety notes:** Approach side asymmetries gradually with rep matching, not by forcing
the weaker side. Stop on any sharp lower-back, hip, or hamstring pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Glute bridge (L1) only |
| Cut | 3×12/leg | Normal | 60-90s | 1-2× | Thu lower body |
| Bulk | 3×12/leg | 3-1-2-0 | 90-120s | 2× | Tue pull + Thu lower |
| Maintenance | 3×12/leg | Normal | 60-90s | 1× | Thu |
| AGRO | 3×12/leg | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Glute bridge 3×15 clean.
**Progression path:** → Good morning (bodyweight) (L3) once 3×12/leg is clean with a
level pelvis on both sides. **Also unlocks Bulgarian split squat (squat L6).**

---

#### Good morning (bodyweight)

**Category:** Hinge
**Progression group:** hinge | **Level:** 3
**Equipment:** None
**Target muscles (primary):** Hamstrings, erector spinae
**Target muscles (secondary):** Glutes, core
**Movement type:** Compound

**Description:** Stand with feet hip width apart and place the hands behind the head
with elbows out wide. Hinge at the hips by pushing the glutes back as the torso pitches
forward, maintaining a flat (neutral) spine throughout. Lower until the torso is roughly
parallel to the floor — or as far as hamstring flexibility allows — then drive the hips
forward to return to standing. The first standing hip-hinge pattern in the ladder and
the foundation for the bodyweight RDL that follows.

**Common mistakes:**
- Bending at the lower back instead of hinging at the hips, turning the rep into a spinal flexion exercise
- Bending the knees excessively, converting the hinge into a partial squat

**Safety notes:** Maintain a neutral spine throughout. Stop the descent before form
breaks — depth is earned through hamstring flexibility, not forced. Stop on any lower
back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Glute bridge (L1) only |
| Cut | 3×12 | Normal | 60-90s | 1-2× | Thu lower body |
| Bulk | 3×12 | 3-1-2-0 | 90-120s | 2× | Tue pull + Thu lower |
| Maintenance | 3×12 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×12 | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Single leg glute bridge 3×12/leg clean.
**Progression path:** → Bodyweight RDL (L4) once 3×12 is clean with a neutral spine and
controlled depth.

---

#### Bodyweight RDL

**Category:** Hinge
**Progression group:** hinge | **Level:** 4
**Equipment:** None
**Target muscles (primary):** Hamstrings (unilateral), glutes
**Target muscles (secondary):** Core (balance), erector spinae, ankle stabilisers
**Movement type:** Compound

**Description:** Stand on one leg with a slight bend in the working knee. Hinge at the
hip by extending the non-working leg straight back behind you while the torso pitches
forward, keeping the body in a straight T-line from heel through head at the bottom of
the rep. Return to standing by driving the hip forward. A unilateral version of the
good morning that adds significant balance and ankle-stability demand.

**Common mistakes:**
- Twisting the hips open as the back leg extends, breaking the square hip line
- Letting the back leg drop or bend instead of holding it in line with the torso

**Safety notes:** Use a wall or chair fingertip touch as a balance aid early in the
learning curve. Maintain neutral spine. Stop on any sharp hamstring or lower back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Glute bridge (L1) only |
| Cut | 3×10-12/leg | Normal | 60-90s | 1-2× | Thu lower body |
| Bulk | 3×10-12/leg | 3-1-2-0 | 90-120s | 2× | Tue pull + Thu lower |
| Maintenance | 3×10-12/leg | Normal | 60-90s | 1× | Thu |
| AGRO | 3×10-12/leg | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Good morning 3×12 clean.
**Progression path:** → Glute bridge march (L5) once 3×12/leg is clean with stable
balance and a square pelvis.

---

#### Glute bridge march

**Category:** Hinge
**Progression group:** hinge | **Level:** 5
**Equipment:** None
**Target muscles (primary):** Glutes, core
**Target muscles (secondary):** Hamstrings, hip flexors
**Movement type:** Compound

**Description:** Hold a standard glute bridge position with hips lifted and the spine
neutral. Without dropping the hips, lift one knee toward the chest, lower it back to
the floor, and immediately repeat on the other side, marching the legs alternately.
The hips must stay stable and level through every rep. Trains the ability to maintain
hip extension under unilateral leg movement — a key transfer skill for running and
single-leg stability.

**Common mistakes:**
- Hips dropping every time a foot lifts, breaking the bridge and removing the core demand
- Hips rotating side to side as the knees alternate, leaking the anti-rotation work

**Safety notes:** Stop on any sharp lower-back pain. The exercise should be felt
primarily in the glutes and core — not the lumbar spine.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Glute bridge (L1) only |
| Cut | 3×15 | Normal | 60-90s | 1-2× | Thu lower body |
| Bulk | 3×15 | 3-1-2-0 | 90-120s | 2× | Tue pull + Thu lower |
| Maintenance | 3×12 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×15 | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Bodyweight RDL 3×10/leg clean.
**Progression path:** → Nordic hamstring curl (L6) once 3×15 is clean with stable hips
through every alternation.

---

#### Nordic hamstring curl

**Category:** Hinge
**Progression group:** hinge | **Level:** 6
**Equipment:** None | Required: anchor for the feet (heavy sofa, low bed, partner, weighted bar)
**Target muscles (primary):** Hamstrings (eccentric)
**Target muscles (secondary):** Calves, glutes, core
**Movement type:** Compound (eccentric-dominant)

**Description:** Kneel on a soft surface with the ankles hooked securely under a heavy
anchor — sofa, bed, or partner-pinned. Keeping the body straight from knees through
head, lower the torso forward toward the floor as slowly as possible by resisting with
the hamstrings alone. Catch the descent with the hands at the bottom and push back to
the start position to reset for the next rep. An eccentric-dominant exercise that
delivers extreme hamstring loading and is one of the strongest evidence-based
hamstring injury-prevention exercises in the literature.

**Common mistakes:**
- Bending at the hips ("piking") instead of holding a straight knee-to-head line, taking load off the hamstrings
- Letting the descent become a free-fall once the hamstring fatigues, missing the eccentric stimulus

**Safety notes:** **Extreme hamstring load — do not attempt before mastering L5
(Glute bridge march 3×15). Slow eccentric only at first; expect significant hamstring
soreness for 3-7 days after the first session even at very low volume.** The anchor
must be heavy enough that it cannot shift. Catch every rep with the hands — never let
the chest impact the floor.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Glute bridge (L1) only |
| Cut | 3×3-5 | Slow eccentric | 60-90s | 1× | Thu lower body — start with 1×3 and ramp slowly |
| Bulk | 3×3-5 | 5-0-X-0 (slow eccentric) | 90-120s | 1× | Thu lower — ramp slowly |
| Maintenance | 3×3-5 | Slow eccentric | 60-90s | 1× | Thu — ramp slowly |
| AGRO | 3×3-5 | Slow eccentric | 60-90s | 3× | Tue/Thu/Sat mornings — ramp slowly |

**Evidence:** Kotarsky 2018, Plotkin 2022, Schoenfeld 2015 (tempo / eccentric)
**Progression prerequisites:** Glute bridge march 3×15 clean.
**Progression path:** → Nordic hamstring curl (full) (L7) once 3×5 is performed with
genuine eccentric control through the entire descent (no free-fall).

---

#### Nordic hamstring curl (full)

**Category:** Hinge
**Progression group:** hinge | **Level:** 7
**Equipment:** None | Required: anchor for the feet
**Target muscles (primary):** Hamstrings
**Target muscles (secondary):** Calves, glutes, core
**Movement type:** Compound

**Description:** The complete Nordic curl — both the slow eccentric descent and a
genuine concentric pull back up using the hamstrings alone, without pushing off the
floor with the hands. The terminal exercise of the hinge ladder and a recognised
elite-level posterior-chain milestone. Very few people on a pure bodyweight system ever
achieve a full strict concentric Nordic, which is why it sits at the top of the ladder.

**Common mistakes:**
- Pushing off the floor with the hands to assist the concentric, robbing the rep of its purpose
- Cheating range of motion by stopping the descent above horizontal before pulling back up

**Safety notes:** Same anchor and ramp-up rules as L6 apply. Do not attempt until L6
(eccentric Nordic) is owned at 3×5 with full controlled descent. Stop on any sharp
hamstring or lower-back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Glute bridge (L1) only |
| Cut | 3×5-8 | Normal | 60-90s | 1× | Thu lower body |
| Bulk | 3×5-8 | 3-1-2-0 | 90-120s | 1× | Thu lower body |
| Maintenance | 3×5-8 | Normal | 60-90s | 1× | Thu |
| AGRO | 3×5-8 | Normal | 60-90s | 3× | Tue/Thu/Sat mornings |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Nordic hamstring curl 3×5 with full eccentric control.
**Progression path:** → End of hinge progression. Continue accumulating volume and
consider weighted hinge variants if external load becomes available.

---

### CORE PROGRESSION (10 Levels)

The core ladder is the trunk-strength and anti-extension/anti-rotation track. It builds
the deep core (transverse abdominis, internal obliques) and the visible anterior chain
(rectus abdominis, external obliques) through 10 sequential exercises ranging from
the dead bug (L1) for users with no core base, all the way to a full L-sit (L10).
Source of truth: `EXERCISE_PROGRESSIONS.core` in `app.html`.

**Skill unlock threshold:** The core ladder gates access to the four skill tracks
(crow stand, handstand, L-sit, planche). A user must own L4 (Hollow body hold 3×30 sec)
before any skill track is prescribed — without that core base, the straight-arm and
inverted positions of the skill ladders are unsafe and unproductive.

Lite users perform ONLY L1 (Dead bug) at 2×6/side on the Friday session and do not
progress past this level. AGRO trains core every session (6×/week), making it the
highest-frequency progression group in the entire library — no other ladder is touched
that often. All other plans run the full ladder according to the per-plan prescription
tables below.

---

#### Dead bug

**Category:** Core
**Progression group:** core | **Level:** 1
**Equipment:** None
**Target muscles (primary):** Transverse abdominis, rectus abdominis
**Target muscles (secondary):** Hip flexors, obliques
**Movement type:** Isolation (anti-extension)

**Description:** Lie on the back with arms straight up toward the ceiling and knees
bent at 90° with shins parallel to the floor. Slowly extend one arm overhead and the
opposite leg straight out toward the floor while keeping the lower back pressed firmly
into the floor. Return to start and alternate sides. The entry point for the entire
core ladder and the only core exercise prescribed in the Lite plan.

**Common mistakes:**
- Letting the lower back arch off the floor as the limbs extend, defeating the entire anti-extension purpose
- Rushing the rep tempo, which lets momentum take over from the deep-core stabilisers

**Safety notes:** Stop on any sharp lower-back pain. The lower back must remain in
contact with the floor through the entire rep — if it starts to arch, shorten the
limb extension range until it can be controlled.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×6/side | Normal | As needed | 1× | Fri session — Lite uses ONLY this level |
| Cut | 3×8/side | Normal | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×8/side | 3-1-2-0 | 60s | 5× | Integrated every session |
| Maintenance | 3×8/side | Normal | 60s | 2× | Mon + Thu |
| AGRO | 3×8/side | Normal | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** None — this is the ladder's entry point.
**Progression path:** → Plank (L2) once 3×8/side is clean with the lower back firmly
glued to the floor throughout the entire range. **Lite users do not progress past this
level.**

---

#### Plank

**Category:** Core
**Progression group:** core | **Level:** 2
**Equipment:** None
**Target muscles (primary):** Rectus abdominis, transverse abdominis
**Target muscles (secondary):** Shoulders (isometric), glutes, quads
**Movement type:** Compound (isometric)

**Description:** Support the body face down on the forearms (or on straight arms in
push-up position) with feet together, body forming a rigid straight line from heels
through the head. Brace the entire trunk and hold the position with continuous
tension. The classic anti-extension isometric and the foundational tension-holding
exercise of the core ladder.

**Common mistakes:**
- Hips sagging toward the floor, breaking the straight line and compressing the lumbar spine
- Hips piking upward to make the hold easier, removing the anti-extension demand

**Safety notes:** Stop the hold the moment form breaks rather than grinding out extra
seconds with a sagging hip — quality over duration. Stop on any sharp lower-back or
shoulder pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×30-45 sec | Hold | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×30-45 sec | Hold | 60s | 5× | Integrated every session |
| Maintenance | 3×30 sec | Hold | 60s | 2× | Mon + Thu |
| AGRO | 3×30-45 sec | Hold | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Dead bug 3×8/side clean.
**Progression path:** → Bicycle crunch (L3) once 3×45 sec is held cleanly with no hip
sag.

---

#### Bicycle crunch

**Category:** Core
**Progression group:** core | **Level:** 3
**Equipment:** None
**Target muscles (primary):** Obliques, rectus abdominis
**Target muscles (secondary):** Hip flexors
**Movement type:** Compound

**Description:** Lie on the back with hands lightly behind the head and legs lifted to
a tabletop position. Bring one elbow toward the opposite knee while extending the
other leg straight out, then alternate sides in a controlled, deliberate cycling
pattern. Trains the obliques' rotational function and adds a dynamic component to the
core ladder after the static plank.

**Common mistakes:**
- Yanking on the head and neck with the hands instead of cradling them gently, causing cervical strain
- Speeding through reps to use momentum instead of muscle, missing the oblique stimulus

**Safety notes:** Hands cradle the head — never pull on it. Stop on any sharp neck
or lower-back pain. Slow tempo is more effective than fast tempo here.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×15-20/side | Slow | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×15-20/side | 3-1-2-0 | 60s | 5× | Integrated every session |
| Maintenance | 3×15/side | Slow | 60s | 2× | Mon + Thu |
| AGRO | 3×15-20/side | Slow | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Plank 3×45 sec clean.
**Progression path:** → Hollow body hold (L4) once 3×20/side is clean with controlled
rotation and no neck pulling.

---

#### Hollow body hold

**Category:** Core
**Progression group:** core | **Level:** 4
**Equipment:** None
**Target muscles (primary):** Rectus abdominis, transverse abdominis
**Target muscles (secondary):** Hip flexors, quads (isometric), serratus anterior
**Movement type:** Compound (isometric)

**Description:** Lie on the back, press the lower back firmly into the floor, then
lift the legs straight out a few inches off the floor and the arms straight out
overhead with the head and shoulders just off the floor. The body forms a slight
banana shape with the lower back glued to the ground. Hold this position with full
tension throughout the entire trunk. The single most important position in
gymnastics-style bodyweight training and the core's link to all skill work.

**Common mistakes:**
- Letting the lower back peel off the floor, immediately disqualifying the rep
- Holding the breath through the rep instead of breathing shallowly behind a braced trunk

**Safety notes:** **This is the SKILL UNLOCK THRESHOLD — owning Hollow body hold at
3×30 sec is the prerequisite for any of the four skill tracks (crow stand, handstand,
L-sit, planche).** Without this base, skill work is unproductive and unsafe. Stop on
any sharp lower-back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×20-30 sec | Hold | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×20-30 sec | Hold | 60s | 5× | Integrated every session |
| Maintenance | 3×20-30 sec | Hold | 60s | 2× | Mon + Thu |
| AGRO | 3×20-30 sec | Hold | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Bicycle crunch 3×20/side clean.
**Progression path:** → Hollow body rock (L5) once 3×30 sec is held cleanly with the
lower back glued to the floor. **At 3×30 sec, skill tracks unlock.**

---

#### Hollow body rock

**Category:** Core
**Progression group:** core | **Level:** 5
**Equipment:** None
**Target muscles (primary):** Rectus abdominis
**Target muscles (secondary):** Hip flexors, serratus anterior, transverse abdominis
**Movement type:** Compound

**Description:** Adopt the hollow body position, then rock gently forward and backward
along the spine while maintaining the rigid hollow shape throughout — no opening up,
no breaking position. The rocking adds a dynamic stability component to the static
hollow hold and progresses the user's ability to hold the shape under perturbation.

**Common mistakes:**
- Letting the body open up at the bottom of each rock, breaking the hollow shape
- Rocking too hard or too fast, sacrificing position for momentum

**Safety notes:** Stop on any sharp lower-back pain. Rock smoothly along the spine —
never on a single vertebra. Pad the floor with a yoga mat or rug if a hard floor causes
discomfort.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×10 | Controlled | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×10 | 3-1-2-0 | 60s | 5× | Integrated every session |
| Maintenance | 3×10 | Controlled | 60s | 2× | Mon + Thu |
| AGRO | 3×10 | Controlled | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Hollow body hold 3×30 sec clean.
**Progression path:** → Leg raises lying (L6) once 3×10 is clean with maintained hollow
shape.

---

#### Leg raises (lying)

**Category:** Core
**Progression group:** core | **Level:** 6
**Equipment:** None
**Target muscles (primary):** Lower rectus abdominis, hip flexors
**Target muscles (secondary):** Transverse abdominis
**Movement type:** Compound

**Description:** Lie on the back with hands by the sides or under the lower back for
support. Keep the legs straight and lift them from a position roughly one inch off
the floor up to vertical (or as high as the hamstrings allow), then lower with
control back to one inch off the floor without letting them rest. The lower-abdominal
benchmark of the core ladder.

**Common mistakes:**
- Letting the legs drop fast on the descent, using gravity instead of the abs
- Letting the lower back arch off the floor as the legs lower, indicating insufficient core control for the level

**Safety notes:** Place hands under the glutes for lower-back support if needed. Stop
on any sharp lower-back pain. Bend the knees slightly if straight legs cause back
arching.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×10-12 | Controlled | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×10-12 | 3-1-2-0 | 60s | 5× | Integrated every session |
| Maintenance | 3×10 | Controlled | 60s | 2× | Mon + Thu |
| AGRO | 3×10-12 | Controlled | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Hollow body rock 3×10 clean.
**Progression path:** → Lying leg raises + hip lift (L7) once 3×12 is clean with no lower
back arching.

---

#### Lying leg raises + hip lift

**Category:** Core
**Progression group:** core | **Level:** 7
**Equipment:** None
**Target muscles (primary):** Lower abdominals, hip flexors
**Target muscles (secondary):** Obliques, transverse abdominis
**Movement type:** Compound

**Description:** Perform a standard lying leg raise to vertical, then at the top of
the rep continue by lifting the hips off the floor — driving the feet straight up
toward the ceiling — before lowering the hips back to the floor and the legs back
to the start. The added hip lift recruits the deep abdominals and shifts the loading
significantly higher up the rectus abdominis chain.

**Common mistakes:**
- Swinging the legs to use momentum for the hip lift instead of contracting the abs
- Dropping the legs and hips uncontrolled on the descent, missing the eccentric stimulus

**Safety notes:** Pad the upper back and head with a folded towel if needed. Stop on
any sharp lower-back or neck pain. Control the descent every rep.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×10-12 | Controlled | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×10-12 | 3-1-2-0 | 60s | 5× | Integrated every session |
| Maintenance | 3×10 | Controlled | 60s | 2× | Mon + Thu |
| AGRO | 3×10-12 | Controlled | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Leg raises lying 3×12 clean.
**Progression path:** → L-sit tuck (floor) (L8) once 3×12 is clean with controlled hip
lift on every rep.

---

#### L-sit tuck (floor)

**Category:** Core
**Progression group:** core | **Level:** 8
**Equipment:** None | Optional: parallettes (wrist relief)
**Target muscles (primary):** Hip flexors, triceps (pressing), abdominals
**Target muscles (secondary):** Shoulders, wrist flexors, serratus anterior
**Movement type:** Compound (isometric)

**Description:** Sit on the floor with legs extended in front. Place the hands flat
on the floor by the hips with elbows fully locked, press down hard, and lift the
butt off the floor while tucking the knees toward the chest so the entire body is
supported on the hands alone. Hold the tucked L-sit position. The first true
straight-arm support hold in the core ladder and a stepping stone toward the full
L-sit.

**Common mistakes:**
- Letting the elbows bend, converting the rep into a partial support and removing the straight-arm demand
- Hunching the shoulders up by the ears instead of pressing them down and away from the head

**Safety notes:** Wrist health is required — warm up wrists thoroughly. Use parallettes
if wrist extension on the floor is painful. Stop on any sharp wrist or shoulder pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×15 sec | Hold | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×15 sec | Hold | 60s | 5× | Integrated every session |
| Maintenance | 3×15 sec | Hold | 60s | 2× | Mon + Thu |
| AGRO | 3×15 sec | Hold | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Lying leg raises + hip lift 3×12 clean.
**Progression path:** → Dragon flag negative (L9) once 3×15 sec is held cleanly with
locked elbows and depressed shoulders.

---

#### Dragon flag negative

**Category:** Core
**Progression group:** core | **Level:** 9
**Equipment:** None | Required: bench, sturdy bed edge, or anchored vertical pole
**Target muscles (primary):** Entire anterior chain (rectus abdominis, obliques, hip flexors)
**Target muscles (secondary):** Lats (grip), serratus anterior, glutes
**Movement type:** Compound (eccentric)

**Description:** Lie on a bench (or the edge of a sturdy bed) and grip the bench
above your head with both hands. Brace the entire body into a rigid straight line
and lift the legs and hips up so the body is nearly vertical with only the upper back
and shoulders touching the bench. From this top position, slowly lower the rigid
body down toward horizontal, fighting gravity the entire way with the anterior chain.
A Bruce-Lee-popularised eccentric anti-extension exercise that loads the entire
front of the body extraordinarily hard.

**Common mistakes:**
- Bending at the hips ("piking") on the descent, taking load off the abs and onto the hip flexors alone
- Free-falling through the descent once the abs fatigue, missing the eccentric stimulus and risking a hard landing

**Safety notes:** **Requires a solid core base — never attempt before owning L7 (Lying
leg raises + hip lift 3×12) and ideally L8 (L-sit tuck 3×15 sec) as well. Heavy load
on the entire anterior chain plus the lower back.** The grip anchor must be sturdy and
must not move under load. Bail by bending the knees and stepping the feet down to the
bench rather than dropping rigidly.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×3-5 | Slow eccentric | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×3-5 | 5-0-X-0 | 60s | 5× | Integrated every session |
| Maintenance | 3×3-5 | Slow eccentric | 60s | 2× | Mon + Thu |
| AGRO | 3×3-5 | Slow eccentric | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Schoenfeld 2015 (tempo / eccentric)
**Progression prerequisites:** L-sit tuck (floor) 3×15 sec clean. L7 mastery is
non-negotiable.
**Progression path:** → Full L-sit (L10) once 3×5 is performed with genuine eccentric
control through the entire descent (no piking, no free-fall).

---

#### Full L-sit

**Category:** Core
**Progression group:** core | **Level:** 10
**Equipment:** None | Optional: parallettes (wrist relief)
**Target muscles (primary):** Hip flexors, abdominals, triceps
**Target muscles (secondary):** Quadriceps (isometric), shoulders, serratus anterior, wrist flexors
**Movement type:** Compound (isometric)

**Description:** Sit on the floor with legs extended in front. Press through both
hands with locked elbows to lift the entire body off the floor with the legs held
straight out parallel to the ground, forming a clean L shape. Hold the position with
the legs squeezed straight, the toes pointed, and the shoulders pressed down and
away from the head. The terminal exercise of the core ladder and a recognised
elite-level bodyweight strength milestone.

**Common mistakes:**
- Bending the knees mid-hold, regressing the rep to a tuck variant
- Hunching the shoulders, indicating insufficient straight-arm strength for the position

**Safety notes:** Wrist conditioning is essential. Use parallettes if floor-based
wrist extension is painful. Stop on any sharp wrist, shoulder, or elbow pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Lite uses Dead bug (L1) only |
| Cut | 3×10-15 sec | Hold | 60s | 3× | Mon + Sat + integrated |
| Bulk | 2×10-15 sec | Hold | 60s | 5× | Integrated every session |
| Maintenance | 3×10 sec | Hold | 60s | 2× | Mon + Thu |
| AGRO | 3×10-15 sec | Hold | 60s | 6× | Every session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Dragon flag negative 3×5 with clean eccentric control.
**Progression path:** → End of core progression. Advance into the dedicated L-sit skill
track (`EXERCISE_PROGRESSIONS.skill_lsit`) and ultimately toward V-sit and manna for
continued progression in the support-hold family.

---

### SKILL PROGRESSIONS

**Skill unlock rule:** Skill tracks are only available when core level ≥ 4 (hollow body
hold) AND push level ≥ 5 (diamond push-up). Per-plan: AGRO only (Thursday evening skill
work). All other plans = N/A.

Skill tracks are isometric balance and support-hold practices rather than rep-based
strength work. Their purpose is motor learning, proprioception, and positional strength
in the straight-arm and inverted postures that traditional bodyweight strength work
does not reach. Entries below are intentionally concise — each exercise is a hold
position with a practice dose. Source of truth: `EXERCISE_PROGRESSIONS.skill_crow`,
`skill_handstand`, `skill_lsit`, and `skill_planche` in `app.html`.

---

#### CROW STAND (4 Levels)

The crow stand ladder is the balance-arm-support track. It trains the wrist, anterior
deltoid, and core to hold the body on the hands with the knees resting on the upper
arms. Built into AGRO's Thursday evening skill + core session as the entry skill
because it has the lowest joint-load demand of the four skill tracks.

---

#### Tuck hold (feet on floor)

**Category:** Skill — Crow Stand
**Progression group:** skill_crow | **Level:** 1
**Equipment:** None
**Target muscles (primary):** Wrist flexors, anterior deltoid, core
**Target muscles (secondary):** Triceps, finger flexors
**Movement type:** Isometric (balance)

**Description:** Squat down, place both hands flat on the floor shoulder-width apart,
and rest the knees high on the backs of the upper arms. Shift the body weight forward
onto the hands while keeping the feet lightly in contact with the floor — finding and
holding the forward-balance point without yet committing to a full lift.

**Common mistakes:**
- Placing the knees too low on the elbows or forearms, losing the knee-to-arm shelf
- Keeping the weight back over the feet instead of actively leaning forward onto the hands

**Safety notes:** Warm up wrists thoroughly before any crow work. Pad the floor in front
of the hands — tip-overs fall forward onto the forehead, not backward. Stop on any
sharp wrist pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×15 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Core ≥ 4 (hollow body hold 3×30 sec), push ≥ 5 (diamond
push-up 3×10).
**Progression path:** → Tuck hold (feet lifted) (L2) once 3×15 sec is stable with
consistent forward balance.

---

#### Tuck hold (feet lifted)

**Category:** Skill — Crow Stand
**Progression group:** skill_crow | **Level:** 2
**Equipment:** None
**Target muscles (primary):** Wrist flexors, anterior deltoid, core
**Target muscles (secondary):** Triceps, finger flexors
**Movement type:** Isometric (balance)

**Description:** From the L1 position, commit to the balance point by lifting both
feet off the floor so the entire body is supported on the hands with the knees resting
on the upper arms. The first true balance-on-hands skill in the ladder.

**Common mistakes:**
- Flinching the hips up when the feet leave the floor, toppling backward
- Failing to grip the floor with the fingers to make micro-balance corrections

**Safety notes:** Pad the floor in front of the hands. Bail forward by rolling the
head under — never try to catch a tip-over with the face. Stop on any sharp wrist
pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 4×15-20 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Tuck hold (feet on floor) 3×15 sec stable.
**Progression path:** → Crow (one leg extended) (L3) once 4×20 sec is held stable with
no taps down.

---

#### Crow (one leg extended)

**Category:** Skill — Crow Stand
**Progression group:** skill_crow | **Level:** 3
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, core (anti-rotation)
**Target muscles (secondary):** Wrist flexors, hip flexors, triceps
**Movement type:** Isometric (balance)

**Description:** From a stable tuck crow, extend one leg straight back behind the body
while the other knee remains on the upper arm. The asymmetric lever shifts the centre
of mass and demands stronger core anti-rotation plus shoulder control to hold the
balance.

**Common mistakes:**
- Letting the extended leg drift down toward the floor, breaking the horizontal line
- Rotating the hips open to compensate for extension, leaking the core's anti-rotation stimulus

**Safety notes:** Forward bail only. Stop on any sharp wrist, shoulder, or elbow pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×10 sec/side | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Tuck hold (feet lifted) 4×20 sec stable.
**Progression path:** → Full crow stand (L4) once 3×10 sec/side is held cleanly on both
sides.

---

#### Full crow stand

**Category:** Skill — Crow Stand
**Progression group:** skill_crow | **Level:** 4
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, wrist flexors, core
**Target muscles (secondary):** Triceps, finger flexors
**Movement type:** Isometric (balance)

**Description:** A fully stable tuck crow held for extended duration with both knees
on the upper arms and feet tucked tight to the glutes. The terminal exercise of the
crow stand ladder — demonstrates ownership of the fundamental arm-balance position
before progressing into straight-arm balance variants.

**Common mistakes:**
- Rocking fore/aft to hold balance instead of using finger-grip micro-corrections
- Letting fatigue collapse the position rather than bailing cleanly when the hold fails

**Safety notes:** Forward bail only. Stop on any sharp wrist, shoulder, or elbow pain.
Accumulate hold time gradually.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×20 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Crow (one leg extended) 3×10 sec/side stable on both sides.
**Progression path:** → End of crow stand progression. Advance into crane pose (straight-
arm crow with knees still resting on arms) and ultimately toward a free straight-arm
crow as the next arm-balance milestones.

---

#### HANDSTAND (4 Levels)

The handstand skill ladder is the inverted-support track — distinct from the shoulder
progression's wall handstand work in that its purpose is balance and free-standing
proficiency rather than pressing strength. Where the shoulder ladder uses the wall
handstand hold as a strength exercise, the handstand skill ladder uses it as the entry
step toward kicking up to and holding a free handstand.

---

#### Wall handstand hold (skill)

**Category:** Skill — Handstand
**Progression group:** skill_handstand | **Level:** 1
**Equipment:** None | Required: clear wall space
**Target muscles (primary):** Anterior deltoid, medial deltoid, triceps
**Target muscles (secondary):** Core, trapezius, forearms, wrist flexors
**Movement type:** Isometric (balance)

**Description:** Kick up to a handstand with the back of the body against the wall and
the heels resting on the wall, body stacked vertically with elbows fully locked. The
entry point for the handstand skill ladder — builds the wrist, shoulder, and inverted
core capacity required for all further handstand work.

**Common mistakes:**
- Banana-back arch, with the lower spine compensating for tight shoulders or weak core
- Walking the hands too far from the wall, creating a planche-like lean instead of a vertical stack

**Safety notes:** Wrist warmup is essential before any handstand work. **Bail laterally,
not backward** — if the hold fails, step one foot down to the side and rotate out of
the position. Never collapse straight backward onto the spine. Ensure the wall and
floor are clear.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×20-30 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Core ≥ 4 (hollow body hold 3×30 sec), push ≥ 5 (diamond
push-up 3×10), shoulder ≥ 3 (decline pike push-up 3×8).
**Progression path:** → Wall handstand (belly to wall) (L2) once 3×30 sec is held stable
with a stacked vertical line.

---

#### Wall handstand (belly to wall)

**Category:** Skill — Handstand
**Progression group:** skill_handstand | **Level:** 2
**Equipment:** None | Required: clear wall space
**Target muscles (primary):** Anterior deltoid, triceps, core
**Target muscles (secondary):** Trapezius, wrist flexors, serratus anterior
**Movement type:** Isometric (balance)

**Description:** Start in a plank position with feet against the wall. Walk the hands
toward the wall as the feet walk up the wall, until the chest is nearly touching the
wall and the body is close to fully vertical with the belly side facing the wall. A
more challenging balance position than back-to-wall because the visual cue of the
wall is removed from view.

**Common mistakes:**
- Stopping the walk-up before reaching a near-vertical stack, short-changing the work
- Losing the stacked line by letting the hips sag away from the wall

**Safety notes:** **Bail laterally** — turn out to one side when the hold fails rather
than dropping back. Warm up wrists thoroughly. Clear wall space required.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×20 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Wall handstand hold (skill L1) 3×30 sec stable.
**Progression path:** → Kick-up practice (L3) once 3×20 sec belly-to-wall is stable.

---

#### Kick-up practice

**Category:** Skill — Handstand
**Progression group:** skill_handstand | **Level:** 3
**Equipment:** None | Required: clear wall space
**Target muscles (primary):** Coordination, anterior deltoid
**Target muscles (secondary):** Core, wrist flexors, hip flexors
**Movement type:** Dynamic (skill practice)

**Description:** From a lunge start position with hands on the floor, kick the back
leg up into a handstand against the wall, catching the balance briefly before
stepping down in a controlled manner. Rehearses the kick-up motor pattern that every
freestanding handstand attempt starts with — building consistency of the kick before
attempting handstands away from the wall.

**Common mistakes:**
- Kicking too hard and slamming the wall, losing the balance point entirely
- Kicking too softly and never reaching vertical, missing the catch opportunity

**Safety notes:** **Bail laterally** on any overshoot — rotate out to the side.
Start with shallow kicks and increase force gradually. Clear wall space required.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 5 attempts | Practice | As needed | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022
**Progression prerequisites:** Wall handstand (belly to wall) 3×20 sec stable.
**Progression path:** → Freestanding hold attempts (L4) once kick-ups consistently catch
balance against the wall with minimal over- or under-shoot.

---

#### Freestanding hold attempts

**Category:** Skill — Handstand
**Progression group:** skill_handstand | **Level:** 4
**Equipment:** None | Required: clear open space
**Target muscles (primary):** Entire shoulder girdle, core, wrist stabilisers
**Target muscles (secondary):** Finger flexors (balance corrections), hip flexors
**Movement type:** Isometric (balance)

**Description:** Kick up to a handstand away from the wall and attempt to catch and
hold the balance freely. Each attempt is its own hold — track the best duration
achieved per session. The terminal step of the handstand skill ladder and the bridge
into freestanding HSPU work.

**Common mistakes:**
- Giving up at the first wobble instead of making micro-corrections with the fingers
- Failing to bail cleanly, risking a hard fall

**Safety notes:** **Bail laterally** — cartwheel out to the side or step one foot
down. Never try to bail backward. Clear open space required — no walls, furniture, or
breakables in the fall zone. Warm up wrists thoroughly.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 5 × max hold | Hold | 60-90s | 1× | Thursday evening — track best duration |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Kick-up practice with consistent wall catches.
**Progression path:** → End of handstand skill progression. Advance toward freestanding
handstand push-ups and away-from-wall press to handstand as the next milestones.

---

#### L-SIT (3 Levels)

The L-sit skill ladder is the straight-arm compression hold track. It builds the hip
flexor, triceps, and abdominal capacity required to support the body on locked-out
arms with the legs held out horizontally. Shares its terminal exercise with the core
ladder (Full L-sit) because owning the full L-sit is simultaneously a core milestone
and a skill milestone.

---

#### L-sit tuck (skill)

**Category:** Skill — L-sit
**Progression group:** skill_lsit | **Level:** 1
**Equipment:** None | Optional: parallettes (wrist relief)
**Target muscles (primary):** Hip flexors, triceps (pressing), abdominals
**Target muscles (secondary):** Shoulders, wrist flexors, serratus anterior
**Movement type:** Isometric

**Description:** Sit on the floor with legs extended. Place the hands flat by the hips
with elbows fully locked, press down hard to lift the entire body off the floor, and
tuck the knees toward the chest. Hold the body suspended on the hands alone with
shoulders pressed down away from the ears.

**Common mistakes:**
- Letting the elbows bend, converting the hold into a partial support that removes the straight-arm demand
- Hunching the shoulders up by the ears, indicating insufficient scapular depression strength

**Safety notes:** Wrist warmup required. Use parallettes if floor-based wrist extension
is painful. Stop on any sharp wrist or shoulder pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 4×15 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Core ≥ 4 (hollow body hold 3×30 sec).
**Progression path:** → L-sit one leg extended (L2) once 4×15 sec is held cleanly with
locked elbows and depressed shoulders.

---

#### L-sit (one leg extended)

**Category:** Skill — L-sit
**Progression group:** skill_lsit | **Level:** 2
**Equipment:** None | Optional: parallettes (wrist relief)
**Target muscles (primary):** Hip flexors (extended leg), abdominals, triceps
**Target muscles (secondary):** Shoulders, wrist flexors, quadriceps (isometric)
**Movement type:** Isometric

**Description:** From a stable tuck L-sit, extend one leg straight forward parallel to
the floor while keeping the other knee tucked toward the chest. The intermediate step
that increases lever arm demand on one side at a time before committing to full
extension.

**Common mistakes:**
- The extended leg sagging toward the floor instead of being held strictly horizontal
- Bending the elbows under the increased asymmetric load, breaking the straight-arm support

**Safety notes:** Wrist warmup required. Use parallettes if wrist extension is painful.
Stop on any sharp wrist, shoulder, or elbow pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×10 sec/side | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** L-sit tuck (skill) 4×15 sec clean.
**Progression path:** → Full L-sit (L3) once 3×10 sec/side is clean on both sides with
strict horizontal extension.

---

#### Full L-sit (skill)

**Category:** Skill — L-sit
**Progression group:** skill_lsit | **Level:** 3
**Equipment:** None | Optional: parallettes (wrist relief)
**Target muscles (primary):** Hip flexors, abdominals, triceps
**Target muscles (secondary):** Quadriceps (isometric), shoulders, wrist flexors
**Movement type:** Isometric

**Description:** Both legs extended fully forward, body in a clean L shape, supported
entirely on locked-out straight arms with toes pointed and legs squeezed straight.
The terminal exercise of the L-sit skill ladder and a recognised elite bodyweight
strength milestone.

**Common mistakes:**
- Bending the knees mid-hold, regressing the position to a tuck variant
- Hunching the shoulders upward, indicating insufficient scapular depression and straight-arm strength

**Safety notes:** Same wrist conditioning and parallette guidance as previous L-sit
levels. Stop on any sharp wrist, shoulder, or elbow pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×10-15 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** L-sit (one leg extended) 3×10 sec/side clean.
**Progression path:** → End of L-sit skill progression. Advance toward V-sit (legs
lifted above horizontal) and ultimately manna (legs lifted further still toward the
chest) as the next support-hold milestones.

---

#### PLANCHE (4 Levels)

The planche skill ladder is the straight-arm horizontal hold track — the most
wrist-intensive and most advanced skill progression in the library. It begins with
the pseudo-planche lean (already present as push L8) used here as a skill entry
point, and builds toward the tuck and straddle planche. True full planche sits beyond
the end of this ladder as a long-term aspirational milestone. Every planche exercise
carries significant wrist load — wrists must be conditioned and warmed up thoroughly
before any planche work.

---

#### Pseudo-planche lean (skill)

**Category:** Skill — Planche
**Progression group:** skill_planche | **Level:** 1
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, pectoralis major, biceps tendon
**Target muscles (secondary):** Core, wrist flexors, serratus anterior
**Movement type:** Isometric

**Description:** Support the body on straight arms with the fingers pointed back
toward the feet. Lean the shoulders forward past the hand position while keeping the
elbows fully locked. The entry point of the planche skill ladder — identical
movement to push L8 but held here with a progression target toward the straight-arm
horizontal holds that follow.

**Common mistakes:**
- Bending the elbows under load, which defeats the straight-arm isometric purpose
- Fingers pointed forward instead of backward, skipping the critical wrist-conditioning stimulus

**Safety notes:** **Significant wrist load — build up gradually over weeks.** Wrists
must be thoroughly warmed up before loading. Start with a shallow lean and increase
the lean angle progressively. Stop immediately on any sharp wrist pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 4×20 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Push ≥ 5 (diamond push-up 3×10), scapular push-up
(pull L6) 3×12.
**Progression path:** → Planche lean (deeper) (L2) once 4×20 sec is held cleanly with
locked elbows and healthy wrists.

---

#### Planche lean (deeper)

**Category:** Skill — Planche
**Progression group:** skill_planche | **Level:** 2
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, pectoralis major
**Target muscles (secondary):** Core, wrist flexors, biceps tendon, serratus anterior
**Movement type:** Isometric

**Description:** A deeper version of the pseudo-planche lean in which the shoulders
travel further forward until the wrists are behind the shoulders — the line of the
torso past the hands becomes visibly steeper. Increased shoulder protraction and
wrist extension demand.

**Common mistakes:**
- Piking the hips up to cheat the lean, removing the loading from the shoulders
- Letting the scapulae retract instead of actively protracting, losing the serratus anterior stimulus

**Safety notes:** **Wrist load increases significantly vs L1.** Progress the lean
angle over weeks, not sessions. Stop on any sharp wrist pain or biceps tendon discomfort.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 4×15 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Pseudo-planche lean (skill L1) 4×20 sec clean.
**Progression path:** → Tuck planche (L3) once 4×15 sec deeper lean is clean and
wrists tolerate the load without symptoms.

---

#### Tuck planche

**Category:** Skill — Planche
**Progression group:** skill_planche | **Level:** 3
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, pectoralis major, core
**Target muscles (secondary):** Triceps, wrist flexors, biceps tendon, serratus anterior
**Movement type:** Isometric

**Description:** From a straight-arm support, lean the shoulders far forward and lift
the feet off the floor with the knees tucked tight to the chest so the body is
horizontal but compacted. The first true planche position — feet clear of the floor,
body supported entirely on straight arms. The transition from lean-based preparation
into actual planche work.

**Common mistakes:**
- Letting the hips sag below the shoulder line, losing the horizontal body position
- Losing scapular protraction under load, which offloads the serratus and overloads the biceps tendon

**Safety notes:** **Extreme wrist, biceps tendon, and shoulder load.** Do not attempt
before mastering L2 (deeper lean 4×15 sec) AND L-sit tuck (skill L1) 4×15 sec — this
dual prerequisite ensures both the straight-arm pressing base and the compression
hold base are present before combining them.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×10 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** **Dual prerequisite** — Planche lean deeper 4×15 sec
clean AND L-sit tuck (skill) 4×15 sec clean.
**Progression path:** → Straddle planche (L4) once 3×10 sec is held cleanly with
strong scapular protraction and no sagging hips.

---

#### Straddle planche

**Category:** Skill — Planche
**Progression group:** skill_planche | **Level:** 4
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, pectoralis major, core
**Target muscles (secondary):** Hip adductors (holding straddle), triceps, wrist flexors,
biceps tendon
**Movement type:** Isometric

**Description:** A planche position in which the legs are extended wide in a straddle
rather than tucked. Holds the body horizontal on straight arms with the legs spread
laterally to reduce the effective lever arm compared to a full planche while still
removing the knee-tuck leverage advantage. Very advanced — only a small number of
dedicated bodyweight practitioners ever achieve this level.

**Common mistakes:**
- Letting the hips drop below horizontal, regressing the position
- Failing to engage the adductors, which allows the legs to drift out of position

**Safety notes:** **Extreme wrist, biceps tendon, and shoulder load.** Stop on any
sharp pain in wrists, biceps tendon, elbows, or shoulders. Bail forward by stepping
the feet down in sequence rather than collapsing straight down.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not available |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×5 sec | Hold | 60-90s | 1× | Thursday evening skill + core session |

**Evidence:** Kotarsky 2018, Plotkin 2022, Oranchuk 2019 (isometric)
**Progression prerequisites:** Tuck planche 3×10 sec clean.
**Progression path:** → End of planche skill progression. Advance toward full planche
(legs together, body fully extended horizontally) as the terminal long-term bodyweight
straight-arm milestone.

---

## NON-PROGRESSION EXERCISES

This section catalogs exercises that are not part of a level-based progression ladder.
They are prescribed directly per plan — without prerequisites or advancement paths —
and are used as accessories, conditioning pieces, mobility finishers, or HIIT circuit
components. Every entry follows the same per-plan prescription format used throughout
this file so that workout content can be generated consistently across all 5 plans.

---

### Calisthenics / Resistance

---

#### Mountain climbers

**Category:** Core / Cardio
**Equipment:** None
**Target muscles (primary):** Hip flexors, core (rectus abdominis, obliques)
**Target muscles (secondary):** Anterior deltoid, pectoralis major, quadriceps
**Movement type:** Compound / Cardio

**Description:** From a high plank position, drive one knee at a time toward the chest
in a rapid, alternating sprint-style motion. The shoulders remain stacked over the
wrists while the core resists rotation and the hips stay level. A staple HIIT movement
that drives heart rate hard while training hip-flexor endurance and core anti-rotation.

**Common mistakes:**
- Letting the hips bounce upward into a pike, shortening knee travel and offloading the core
- Collapsing the shoulders forward of the wrists, which overloads the wrist joint

**Safety notes:** Requires healthy wrists and shoulders. Slow the pace if form breaks
down — speed is earned, not forced. Stop on any sharp wrist pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair/mobility work instead |
| Cut | 30s intervals | Fast | 15s | 2× | HIIT Circuit A and B component |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | 30s intervals | Fast | 15s | 1× | HIIT rotation option |
| AGRO | 30s × 3-4 rounds | Fast | 30s | 2× | Morning conditioning finisher |

**Evidence:** ACE 2024 (HIIT calorie burn), Schoenfeld 2021 (HIIT vs MICT)

---

#### Reverse lunge

**Category:** Squat / Lower body
**Equipment:** None
**Target muscles (primary):** Quadriceps, gluteus maximus
**Target muscles (secondary):** Hamstrings, core (anti-rotation, balance), adductors
**Movement type:** Compound

**Description:** From a standing position, step one leg straight back and lower the
rear knee toward the floor while keeping the front shin vertical and the torso upright.
Drive through the front heel to return to standing. The reverse pattern reduces knee
shear compared to a forward lunge and is more knee-friendly for most lifters.

**Common mistakes:**
- Front knee collapsing inward or drifting past the toes, shifting load off the glutes
- Torso pitching forward, turning the movement into a hinge instead of a unilateral squat

**Safety notes:** Step back far enough that the front shin stays vertical — a short
step overloads the knee. Hold a wall or sturdy surface for balance if needed.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair-supported lower body work |
| Cut | 3×12/side | Normal | 60-90s | 1× | Thursday lower body |
| Bulk | 4×12/side | 3-1-2-0 | 90-120s | 2× | Tue + Sat lower body |
| Maintenance | 3×10/side | Normal | 60-90s | 1× | Thursday lower body |
| AGRO | 3×12/side | Normal | 60s | 2× | Tue/Thu morning lower |

**Evidence:** Plotkin 2022 (rep progression), Schoenfeld 2021 (rep continuum)

---

#### Jumping jacks

**Category:** Cardio / Plyometric
**Equipment:** None
**Target muscles (primary):** Deltoids, calves (gastrocnemius, soleus), quadriceps
**Target muscles (secondary):** Core, adductors, abductors
**Movement type:** Cardio / Plyometric

**Description:** Classic full-body warm-up movement. Jump the feet out to a wide stance
while simultaneously raising the arms overhead, then jump back to the start. Elevates
heart rate quickly, warms the shoulders, and primes the ankles and hips for faster
movement patterns. Scales up in intensity with cadence.

**Common mistakes:**
- Landing stiff-legged, increasing impact on knees and ankles
- Shrugging the traps instead of reaching the arms overhead with a full shoulder ROM

**Safety notes:** **For users >100kg, substitute marching jacks** (step feet out
alternately instead of jumping) to reduce cumulative joint impact on knees and ankles.
Stop on any ankle or knee pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses tai chi / gentle mobility |
| Cut | 30s intervals | Fast | 15s | 2× | HIIT Circuit A component |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | 30s intervals | Fast | 15s | 1× | HIIT rotation option |
| AGRO | N/A | — | — | — | Uses run/shadowbox warmups |

**Evidence:** ACE 2024 (HIIT calorie burn)

---

#### High knees

**Category:** Cardio
**Equipment:** None
**Target muscles (primary):** Hip flexors, quadriceps
**Target muscles (secondary):** Core, calves, glutes (drive leg)
**Movement type:** Cardio

**Description:** A stationary sprint pattern — drive one knee at a time up to at least
hip height while the opposite arm swings forward in a coordinated running motion. The
torso stays upright and the core braces against the rapid hip flexion cycle. Excellent
warm-up and HIIT tool for elevating heart rate without lateral space.

**Common mistakes:**
- Leaning the torso backward to hoist the knees, rather than driving them from the hip
- Landing flat-footed or heel-first, which blunts the elastic calf response

**Safety notes:** Land softly on the balls of the feet. Caution if knee or hip flexor
issues are present — substitute marches at a slower tempo.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated marches instead |
| Cut | 30s intervals | Fast | 15s | 2× | HIIT Circuit A component |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | 30s intervals | Fast | 15s | 1× | HIIT rotation option |
| AGRO | 30s warmup | Fast | — | 3× | Pre-run / pre-shadowbox warmup |

**Evidence:** ACE 2024 (HIIT calorie burn)

---

#### Speed skaters

**Category:** Plyometric / Lateral
**Equipment:** None
**Target muscles (primary):** Gluteus medius, quadriceps
**Target muscles (secondary):** Calves, core (lateral stability), hamstrings
**Movement type:** Plyometric

**Description:** From a slight athletic stance, jump laterally from one foot to the
other, swinging the trailing leg behind in a speed-skating motion. Land soft on the
outside foot and immediately load the glute med before exploding to the opposite side.
Trains lateral power, single-leg deceleration, and hip abduction strength.

**Common mistakes:**
- Landing stiff or vertical, eliminating the lateral glute-med loading phase
- Letting the planted knee cave inward, compromising hip control

**Safety notes:** Controlled, soft landings with soft knees. Not suitable if knee or
ankle instability is present. Start with short lateral distance and build up.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not suitable — impact |
| Cut | 40s intervals | Fast | 20s | 1× | HIIT Circuit B component |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** ACE 2024 (HIIT calorie burn), Schoenfeld 2021 (HIIT vs MICT)

---

#### Burpee / Squat thrust

**Category:** Compound / Cardio
**Equipment:** None
**Target muscles (primary):** Chest, quadriceps, anterior deltoid, core
**Target muscles (secondary):** Triceps, hip flexors, calves, glutes
**Movement type:** Compound

**Description:** From standing, drop the hands to the floor, kick the feet back to a
plank (optional push-up at the bottom), snap the feet back under the hips, and jump
up with arms overhead. The full burpee is one of the highest cal/min bodyweight
movements. The **squat thrust** variant drops the push-up and the jump — used for
beginners and users >100kg to preserve the movement pattern without the high impact.

**Common mistakes:**
- Collapsing the hips when kicking back to the plank, sagging the lumbar spine
- Landing the jump stiff-kneed, spiking impact forces on the knees

**Safety notes:** **For users >100kg or those with wrist/knee/shoulder issues, use the
squat thrust variant** — no push-up, no jump. Slow the cadence if form breaks. Stop
on any sharp joint pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not suitable — impact |
| Cut | 40s intervals | Moderate | 20s | 1× | HIIT Circuit B component |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | 3×10 | Fast | 60s | 1× | Saturday conditioning finisher |

**Evidence:** ACE 2024 (HIIT calorie burn), Schoenfeld 2021 (HIIT vs MICT)

---

#### Flutter kicks

**Category:** Core
**Equipment:** None
**Target muscles (primary):** Lower abs (rectus abdominis, lower portion), hip flexors
**Target muscles (secondary):** Quadriceps, obliques
**Movement type:** Isolation

**Description:** Lie supine with legs extended and hands tucked under the glutes or
flat by the hips. Lift the heels a few inches off the floor and alternate small,
rapid up-down kicks while keeping the legs straight. Trains lower-ab endurance and
hip-flexor capacity under sustained tension.

**Common mistakes:**
- Letting the lower back arch off the floor, transferring load onto the lumbar spine
- Kicking too high, which shortens the hip-flexor lever and reduces the core demand

**Safety notes:** **Press the lower back into the floor throughout — never let the
lumbar spine arch.** Tuck the hands under the glutes if anterior pelvic tilt is hard
to control. Stop on any lower back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses gentler core work |
| Cut | 40s intervals | Fast | 20s | 1× | HIIT Circuit B component |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Uses leg raise progression |

**Evidence:** Schoenfeld 2021 (rep continuum)

---

#### Plank to downdog

**Category:** Mobility / Compound
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, hamstrings, calves
**Target muscles (secondary):** Core, serratus anterior, lats, gastrocnemius
**Movement type:** Compound / Mobility

**Description:** From a high plank, press the hips up and back into a downward-dog
position — arms straight, heels driving toward the floor, spine long. Return to plank.
Each rep alternates between shoulder stability loading (plank) and posterior-chain
stretch + shoulder flexion (down-dog). A mobility-biased piece that doubles as a
shoulder and hamstring warm-up.

**Common mistakes:**
- Bending the elbows during the downdog transition, offloading the shoulders
- Forcing heels to the floor when hamstrings are tight — let them hover

**Safety notes:** Stop short of pain in the hamstrings or calves. Do not force
shoulder flexion past comfortable ROM if shoulder impingement is present.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×6 | Slow | 45s | 2× | Yoga-adjacent mobility piece |
| Cut | 30s intervals | Controlled | 15s | 1× | HIIT Circuit A component |
| Bulk | 3×8 | 2-1-2-0 | 60s | 1× | Monday push-day mobility finisher |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022 (QMT mobility), Schoenfeld 2015 (tempo)

---

#### Calf raises standing

**Category:** Isolation / Lower body
**Equipment:** None | Optional: step or ledge for full ROM
**Target muscles (primary):** Gastrocnemius, soleus
**Target muscles (secondary):** Tibialis posterior (stabilizer), intrinsic foot muscles
**Movement type:** Isolation

**Description:** Stand tall with feet hip-width, rise onto the balls of the feet by
contracting the calves, pause at the top, then lower under control. Performing on a
step or ledge with the heels hanging off lets the calves load through a full stretch
and produces better hypertrophy than floor-only reps. Legs kept straight biases the
gastrocnemius; slight knee bend shifts load to the soleus.

**Common mistakes:**
- Short ROM — not lowering heels fully between reps, cutting the stretch phase
- Bouncing through the bottom, using the Achilles elastic recoil instead of the muscle

**Safety notes:** Use a wall or sturdy surface for balance if needed. Stop on any
Achilles pain — calf strains respond poorly to being trained through.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×12 | Slow | 45s | 2× | Seated calf raises as alternative |
| Cut | 3×15 | Normal | 45-60s | 1× | Thursday lower body |
| Bulk | 4×15 | 2-0-2-0 | 60-90s | 2× | Tue + Sat lower body |
| Maintenance | 3×12 | Normal | 45-60s | 1× | Thursday lower body |
| AGRO | N/A | — | — | — | Running covers calf stimulus |

**Evidence:** Plotkin 2022 (rep progression), Schoenfeld 2021 (rep continuum)

---

#### Side-lying hip abduction

**Category:** Isolation / Lower body
**Equipment:** None
**Target muscles (primary):** Gluteus medius, tensor fasciae latae (TFL)
**Target muscles (secondary):** Core (anti-rotation), gluteus minimus
**Movement type:** Isolation

**Description:** Lie on one side with the bottom leg bent for stability and the top
leg extended straight. Lift the top leg vertically without rotating the hip forward
or backward, pause briefly at the top, and lower under control. Directly trains the
gluteus medius — the primary pelvic stabilizer — which is commonly weak from prolonged
sitting.

**Common mistakes:**
- Rotating the hip forward to recruit hip flexors / TFL instead of isolating glute med
- Swinging the leg up with momentum rather than controlling through the range

**Safety notes:** Keep the top hip stacked directly over the bottom hip throughout.
Stop on any sharp hip pain or lateral knee discomfort.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×10/side | Slow | 30s | 2× | Mobility-bias accessory |
| Cut | 3×15/side | Normal | 45s | 1× | Thursday lower body accessory |
| Bulk | 3×15/side | 2-1-2-0 | 60s | 2× | Tue + Sat lower body accessory |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Cools 2016 (stabilizer training)

---

#### Wall sit

**Category:** Isometric / Lower body
**Equipment:** None | Required: wall
**Target muscles (primary):** Quadriceps (rectus femoris, vastus lateralis/medialis/intermedius)
**Target muscles (secondary):** Glutes, calves, core
**Movement type:** Isometric

**Description:** Slide the back down a wall until the hips and knees are both at
approximately 90°, with the shins vertical and feet planted flat. Hold the position
for time. A pure isometric quad hold — effective for building quad strength and
endurance with zero impact and minimal equipment.

**Common mistakes:**
- Letting the knees drift forward past the toes, collapsing the 90° shin angle
- Resting the forearms on the thighs, cheating the quads out of work

**Safety notes:** Stop if knee pain arises — the 90° position is not appropriate for
all knees. Reduce the depth (thighs above parallel) if needed. Press the lower back
flat against the wall.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×20s | Hold | 45s | 1× | Supported, reduced depth |
| Cut | 3×30-45s | Hold | 60s | 1× | Thursday lower body finisher |
| Bulk | 3×45s | Hold | 60s | 1× | Tuesday lower body isometric finisher |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Oranchuk 2019 (isometric hypertrophy), Lum & Barbosa 2019 (isometric strength)

---

#### Single-leg RDL bodyweight

**Category:** Hinge / Lower body
**Equipment:** None | Optional: wall for balance
**Target muscles (primary):** Hamstrings, gluteus maximus
**Target muscles (secondary):** Core (anti-rotation), spinal erectors, ankle stabilizers
**Movement type:** Compound

**Description:** Standing on one leg, hinge at the hip by pushing the non-standing leg
straight back and lowering the torso parallel to the floor, keeping a flat spine. The
planted knee stays softly bent. Return to standing by driving the hips forward and
squeezing the glute. Trains unilateral posterior chain strength and proprioceptive
balance simultaneously.

**Common mistakes:**
- Rotating the hip open as the back leg rises, breaking the squared-off pelvis
- Rounding the lower back at end-range, taking load off the hamstrings

**Safety notes:** **Prerequisite: hinge progression level ≥ 3** — do not attempt if
basic hip-hinge pattern is not yet clean. Start with a hand on the wall or chair for
balance. Stop on any sharp low-back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated hamstring work |
| Cut | 3×10/side | Normal | 60s | 1× | Thursday lower body |
| Bulk | 4×10/side | 3-1-2-0 | 90s | 2× | Tue + Sat lower body |
| Maintenance | 3×8/side | Normal | 60s | 1× | Thursday lower body |
| AGRO | 3×10/side | Normal | 60s | 1× | Thursday evening posterior chain |

**Evidence:** Plotkin 2022 (rep progression), Schoenfeld 2015 (tempo)

---

#### Tricep dips chair edge

**Category:** Push
**Equipment:** Required: sturdy chair, bench, or low stable surface
**Target muscles (primary):** Triceps brachii (all three heads)
**Target muscles (secondary):** Anterior deltoid, pectoralis major (lower fibers)
**Movement type:** Compound

**Description:** Sit on the edge of a sturdy chair, place the hands beside the hips
gripping the front edge, slide the hips forward off the seat, and lower the body by
bending the elbows to approximately 90°. Press back to a full lockout. Fingers point
forward, elbows track straight back — never flare. Effective tricep builder on days
when pulling is absent and extra push volume is wanted.

**Common mistakes:**
- Dipping too deep (past 90° elbow flexion), creating shoulder impingement risk
- Elbows flaring outward, shifting load off the triceps and onto the shoulder capsule

**Safety notes:** **Keep elbows tight to the body and do not dip below 90° of elbow
flexion — going deeper risks anterior shoulder impingement.** Stop on any sharp
shoulder pain. Not recommended for those with existing shoulder injuries. Ensure the
chair is stable and will not tip.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses chair-supported push exercises |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 3×12 | 2-1-2-0 | 60-90s | 1× | Monday push-day accessory |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Plotkin 2022 (rep progression), Schoenfeld 2015 (tempo)

---

#### Push-up ladder 10 down to 1

**Category:** Push (intensity protocol)
**Equipment:** None
**Target muscles (primary):** Pectoralis major, triceps, anterior deltoid
**Target muscles (secondary):** Core, serratus anterior
**Movement type:** Compound (descending-ladder protocol)

**Description:** A descending-ladder intensity protocol. Perform 10 push-ups, rest
~10 seconds, then 9 reps, rest, 8 reps, rest — continuing down to 1 rep. Total volume
is 10+9+8+7+6+5+4+3+2+1 = **55 reps** in one extended set. The short rest windows
force cumulative fatigue and produce a high-volume stimulus in under 5 minutes.
Used as a brutal Friday push-day volume finisher.

**Common mistakes:**
- Form collapse in the upper rungs (hips sagging, partial ROM) due to accumulated fatigue
- Extending rest beyond 10 seconds, which defeats the cumulative-fatigue purpose

**Safety notes:** **Stop and regress to knee push-ups rather than breaking form.**
Maintain the full plank position and full ROM on every rep. Skip the ladder if
push-up form is not yet clean at standard volume.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not suitable — volume intensity |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 1 ladder (55 reps) | Normal | 10s between rungs | 1× | **Friday push-day finisher only** |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Kotarsky 2018 (push-up strength), Plotkin 2022 (rep progression),
Schoenfeld 2021 (rep continuum)

---

### HIIT Protocols

---

#### HIIT Circuit A

**Category:** Cardio / HIIT
**Equipment:** None
**Target muscles (primary):** Cardiovascular system, full body (glutes, quads,
hamstrings, hip flexors, core)
**Target muscles (secondary):** Deltoids, calves, pectoralis major, hamstrings
**Movement type:** Circuit protocol

**Description:** A 30 sec work / 15 sec rest interval circuit rotating through six
bodyweight exercises for four rounds, with 2 min rest between rounds. Total duration
~20 min. Biases full-body cardiovascular conditioning and fat oxidation over raw
power output — lower-impact than Circuit B and appropriate as the week's first HIIT
session. Exercise order is fixed: high knees → bodyweight squat (fast) → mountain
climbers → reverse lunge (alternating) → jumping jacks → plank to downdog.

**Common mistakes:**
- Rushing form as fatigue builds in later rounds — sacrificing depth, ROM, and posture
- Holding breath during the work interval instead of maintaining rhythmic breathing

**Safety notes:** Scale every exercise to current fitness level — substitute easier
variants rather than breaking form. **For users >100kg: substitute marching jacks
for jumping jacks, and use controlled bodyweight squats (no jump) for any jump-based
movement.** Stop if dizziness, chest pain, or sharp joint pain occurs. Never program
Circuit A and Circuit B on consecutive days.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses tai chi / gentle mobility |
| Cut | 4 rounds of 6×30s | Fast | 15s intra / 2 min inter-round | 1× | Tuesday HIIT |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | 4 rounds of 6×30s | Fast | 15s intra / 2 min inter-round | 1× | Tuesday HIIT rotation option |
| AGRO | N/A | — | — | — | Uses run + shadowbox conditioning |

**Evidence:** ACE 2024 (HIIT calorie burn — up to 30% more cal/min than steady-state,
CLAUDE.md §15), Schoenfeld 2021 (HIIT vs MICT meta-analysis of 54 studies — equivalent
fat loss outcomes, CLAUDE.md §15), Boutcher 2011 (HIIT body composition, CLAUDE.md §15)

---

#### HIIT Circuit B

**Category:** Cardio / HIIT
**Equipment:** None
**Target muscles (primary):** Cardiovascular system, full body (quads, glutes, chest,
triceps, core)
**Target muscles (secondary):** Deltoids, hamstrings, hip flexors, calves, obliques
**Movement type:** Circuit protocol

**Description:** A 40 sec work / 20 sec rest interval circuit rotating through six
bodyweight exercises for three rounds, with 90 sec rest between rounds. Total
duration ~20 min. Higher-intensity and higher-impact than Circuit A, biasing full
body power and muscular endurance. Exercise order is fixed: squat jump → push-up
(any level from the push progression) → speed skaters → bicycle crunch → burpee →
flutter kicks.

**Common mistakes:**
- Sacrificing squat depth for speed on squat jumps — short ROM reduces both power and safety
- Collapsing hips on push-ups under fatigue; not controlling landings on speed skaters

**Safety notes:** **For users >100kg: use squat thrust (no push-up, no jump) instead
of burpee, and fast bodyweight squat (no jump) instead of squat jump — this removes
the two highest-impact movements.** Stop on any sharp joint pain. Pick a push-up
level that allows clean form for the full 40 sec interval. **Never program Circuit A
and Circuit B on consecutive days** — separate by at least 48 hours.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not suitable — impact + intensity |
| Cut | 3 rounds of 6×40s | Fast | 20s intra / 90s inter-round | 1× | Friday HIIT |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Uses run + shadowbox conditioning |

**Evidence:** ACE 2024 (HIIT calorie burn, CLAUDE.md §15), Schoenfeld 2021 (HIIT vs
MICT meta-analysis of 54 studies, CLAUDE.md §15), Boutcher 2011 (HIIT body composition,
CLAUDE.md §15)

---

### Shadowboxing

---

#### Shadowboxing cardio

**Category:** Cardio / Combat conditioning
**Equipment:** None | Optional: hand wraps
**Target muscles (primary):** Deltoids (anterior, lateral, posterior), core
(rotational — obliques, transverse abdominis), cardiovascular system
**Target muscles (secondary):** Hip flexors, calves, forearms, glutes (rotation
drivers), upper back (rear delts, rhomboids)
**Movement type:** Cardio / Skill

**Description:** Five 3-minute rounds of imagined boxing work with 60 sec rest
between rounds, structured in a classic boxing-gym progression — warm-up, speed,
power, intervals, and mixed tempo. No opponent, no bag — pure cardio and skill
training focused on technique, rotation, footwork, and breath rhythm. Burns 300-400
cal per 30 min session while building shoulder endurance, rotational core strength,
and combat-sport fundamentals. Total duration ~20 min including rest periods.

**Round breakdown:**
- **Round 1 — Warm-up:** Jab-cross combinations, light footwork, finding rhythm.
- **Round 2 — Speed:** Fast combinations (jab-cross-hook, 1-2-3), high volume, light power.
- **Round 3 — Power:** Hooks, uppercuts, overhand rights. Rotate hips fully on every shot. Fewer combos, maximum force.
- **Round 4 — Intervals:** 20 sec all-out flurry (max speed, max volume) / 10 sec light movement. Repeat 9×.
- **Round 5 — Mixed tempo:** Alternate 30 sec speed / 30 sec power for the full 3 min. Combine everything from rounds 2-3.

**Common mistakes:**
- Dropping the hands between punches under fatigue, breaking defensive posture
- Flat-footed stance or arms-only punching — must stay on balls of feet and rotate hips for real power

**Safety notes:** **Wrist alignment is critical** — punch with flat knuckles aligned
with the forearm to prevent wrist injury. Use hand wraps if available. Beginners
should start at a slow pace focused on form before adding speed or power. Reduce
round count if shoulder pain develops. **Beginner modification:** 3 × 2-min rounds
with 90 sec rest; use rounds 1-2 only (jab-cross + speed) and add rounds 3-5
progressively over weeks as conditioning improves.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not suitable — intensity |
| Cut | 5 × 3-min rounds | Varies by round | 60s between rounds | 1× | Tuesday option (alternates with HIIT/jump rope) |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | 5 × 3-min rounds | Varies by round | 60s between rounds | 1× | Tuesday cardio rotation option |
| AGRO | N/A | — | — | — | Uses dedicated boxing/MMA conditioning |

**Evidence:** Croom 2023 (Int J Phys Educ Fit Sports 12(2), 8-29, CLAUDE.md §15) —
3-week shadowboxing program produced increased aerobic capacity, muscle mass, bone
mass, and BMR; decreased resting HR, fat mass, body fat %, and visceral fat. Burns
300-400 cal/30 min.

---

### Jump Rope

---

#### Jump rope HIIT

**Category:** Cardio / HIIT
**Equipment:** Required: jump rope (~₹200-500 / ~$5)
**Target muscles (primary):** Calves (gastrocnemius, soleus), cardiovascular system
**Target muscles (secondary):** Shoulders (rope turning), core, forearms, quadriceps
**Movement type:** Cardio

**Description:** An interval-style rope protocol in two phases. Phase 1: 30 sec jump
/ 20 sec rest × 8 rounds. Phase 2: 3 × 60 sec continuous jumping with 30 sec rest
between. Total ~18 min. High cardiovascular output in a small footprint, strong
calf-elastic and coordination stimulus. Used as the Cut Tuesday cardio option,
alternating weekly with shadowboxing and HIIT Circuit A.

**Common mistakes:**
- Jumping too high (should be only 1-2 inches off the ground) — wastes energy and spikes impact
- Using arms instead of wrists to turn the rope — creates shoulder fatigue and breaks rhythm

**Safety notes:** **Caution for users >100kg — jump rope creates significant joint
impact on ankles, knees, and hips.** Start with 15 sec intervals and progress.
**Always jump on a forgiving surface (rubber mat, wooden floor, grass) — never on
concrete.** If shin splints develop, stop and substitute another cardio option.
Keep eyes forward, not down. Use a rope length sized correctly: standing on the
middle of the rope, the handles should reach the armpits.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not suitable — impact |
| Cut | 8×30s + 3×60s | Fast | 20s / 30s | 1× | Tuesday option (alternates with HIIT/shadowbox) |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Uses steady-state jump rope instead |
| AGRO | N/A | — | — | — | Uses run + shadowbox conditioning |

**Evidence:** PMC 8467906 (CLAUDE.md §15) — 8-week RCT showed jump rope improved
body composition, reduced inflammation markers, and improved blood pressure.
PMC 12473967 — 10 min/week improved cardiovascular capacity and lower-limb strength.

---

#### Jump rope steady-state

**Category:** Cardio
**Equipment:** Required: jump rope (~₹200-500 / ~$5)
**Target muscles (primary):** Calves (gastrocnemius, soleus), cardiovascular
endurance
**Target muscles (secondary):** Shoulders, core, forearms, coordination systems
(proprioception, timing)
**Movement type:** Cardio

**Description:** Four 3-minute continuous-jumping rounds with 1 min rest between
rounds, rotating technique each round to maintain engagement. Round 1: basic bounce.
Round 2: alternating feet (boxer skip). Round 3: high knees. Round 4: mixed
(freestyle — combine all three or add footwork variations). Total ~16 min. Burns
~100 cal/10 min while training coordination, balance, and bone density. Used as a
Maintenance Tuesday cardio rotation option.

**Common mistakes:**
- Tensing the shoulders instead of keeping them relaxed and letting the wrists do the turning
- Landing on the heels rather than the balls of the feet — blunts calf elasticity and spikes impact

**Safety notes:** **Same >100kg impact caution as jump rope HIIT** — use forgiving
surface, start with shorter intervals, stop on shin pain. Start with 1 min continuous
if 3 min is too demanding. **Progress duration before adding technique complexity**
— master basic bounce for the full 3 min before attempting alternating feet or
high-knee variations.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not suitable — impact |
| Cut | N/A | — | — | — | Uses jump rope HIIT instead |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | 4 × 3 min continuous | Moderate | 60s between rounds | 1× | Tuesday cardio rotation option |
| AGRO | N/A | — | — | — | Uses run + shadowbox conditioning |

**Evidence:** PMC 8467906 (CLAUDE.md §15) — 8-week RCT, body composition,
inflammation, blood pressure benefits. Cleveland Clinic 2024 — ~100 cal/10 min,
coordination + balance + bone density benefits; AHA and British Osteoporosis Society
recommend jump rope for bone health at all life stages.

---

### Animal Flow / QMT

> **Beginner note for all Animal Flow movements:** Hold each position 5 seconds before
> transitioning. Build position quality before chaining. Wrist prep is mandatory
> before any ground-based flow work.

---

#### Wrist mobilizations

**Category:** Mobility / Prep
**Equipment:** None
**Target muscles (primary):** Wrist flexors, wrist extensors
**Target muscles (secondary):** Forearms, fingers
**Movement type:** Mobility

**Description:** Essential preparation for all ground-based Animal Flow work. From
all fours, perform slow wrist circles, forward and backward flexion/extension,
finger-point variations, and knuckle rolls. 3 min continuous cycling through the
positions.

**Common mistakes:**
- Rushing through the positions instead of exploring end-range
- Not loading each position (staying light on the hands) — defeats the tissue prep purpose

**Safety notes:** If wrist pain persists after prep, modify subsequent exercises to
fist-based positions (knuckles down) to offload the wrist extensors.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 3 min continuous | Slow | — | 1× (Wed) | Mandatory prep for Animal Flow block |
| Maintenance | 3 min continuous | Slow | — | 1× (Fri) | Mandatory prep for Animal Flow block |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Beast hold

**Category:** Isometric / Foundational
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, quadriceps
**Target muscles (secondary):** Core (rectus abdominis, obliques), hip flexors, wrists
**Movement type:** Isometric

**Description:** From all fours, press the knees ~1 inch off the ground while keeping
a neutral spine, shoulders stacked over wrists, and hips at knee height. The
foundational position of Animal Flow — everything else is built on this. 3×15 sec holds.

**Common mistakes:**
- Lifting the knees too high, which disengages the core and quads
- Holding the breath instead of breathing steadily through the hold

**Safety notes:** Complete wrist mobilizations first. Stop on any sharp wrist pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 3×15 sec | Hold | 30-45s | 1× (Wed) | Foundational position |
| Maintenance | 3×15 sec | Hold | 30-45s | 1× (Fri) | Foundational position |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Beast to crab transition

**Category:** Compound / Mobility
**Equipment:** None
**Target muscles (primary):** Full body (rotational power)
**Target muscles (secondary):** Shoulders, core, hip mobility, wrists
**Movement type:** Compound transition

**Description:** From the beast position, rotate 180° by pivoting through the hands
and feet to land in a crab position (supine support on hands and feet, hips up), then
rotate back. Trains rotational coordination and shoulder mobility under load. 5 full
reps (beast → crab → beast counts as one).

**Common mistakes:**
- Rushing the rotation before the supporting hand is firmly planted
- Letting the hips drop mid-transition, interrupting the flow

**Safety notes:** Master the beast hold and a static crab position separately before
attempting the transition. Skip if wrist or shoulder pain is present.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 5 reps | Controlled | 30s | 1× (Wed) | After beast hold |
| Maintenance | 5 reps | Controlled | 30s | 1× (Fri) | After beast hold |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Crab reach

**Category:** Mobility
**Equipment:** None
**Target muscles (primary):** Thoracic spine extensors, gluteus maximus
**Target muscles (secondary):** Anterior deltoid, hip flexors (stretch), obliques
**Movement type:** Mobility

**Description:** From a crab position (supine support on hands and feet, hips lifted),
drive the hips high and reach one arm overhead behind the body while the gaze follows
the reaching hand. Opens the thoracic spine and hip flexors. 5/side.

**Common mistakes:**
- Not driving the hips high enough — reduces the thoracic opening
- Straining the neck by craning it instead of following the reaching hand naturally

**Safety notes:** Skip if shoulder impingement or anterior shoulder instability is
present. Stop on any neck discomfort.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 5/side | Slow | 20-30s | 1× (Wed) | Thoracic mobility piece |
| Maintenance | 5/side | Slow | 20-30s | 1× (Fri) | Thoracic mobility piece |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Lateral ape

**Category:** Squat / Mobility
**Equipment:** None
**Target muscles (primary):** Hip adductors, hip abductors, quadriceps
**Target muscles (secondary):** Ankle mobility, core, shoulders (support)
**Movement type:** Compound / Mobility

**Description:** From a deep squat position, walk laterally by planting both hands to
one side, shifting the feet across, and resetting. Requires full ankle and hip
mobility. 5 steps/direction.

**Common mistakes:**
- Not sitting deep enough into the squat — reduces the mobility stimulus
- Shifting weight too far forward onto the hands, pulling the feet off the ground

**Safety notes:** Requires adequate ankle and hip mobility — regress to assisted deep
squat holds if the position is not yet accessible.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 5/direction | Controlled | 20-30s | 1× (Wed) | Hip + ankle mobility piece |
| Maintenance | 5/direction | Controlled | 20-30s | 1× (Fri) | Hip + ankle mobility piece |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Front step-through

**Category:** Core / Mobility
**Equipment:** None
**Target muscles (primary):** Obliques, hip flexors
**Target muscles (secondary):** Shoulders (supporting side), core, adductors
**Movement type:** Compound / Rotational

**Description:** From a beast hold, lift one leg and thread it across under the body
to the opposite side while rotating the torso open. Return and alternate. Trains
rotational core control and hip mobility under shoulder load. 5/side.

**Common mistakes:**
- Collapsing the supporting shoulder as the leg threads through
- Not rotating the torso fully — the ribcage should open toward the ceiling

**Safety notes:** Master the beast hold first. Stop on any sharp shoulder or hip pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 5/side | Controlled | 30s | 1× (Wed) | Rotational core piece |
| Maintenance | 5/side | Controlled | 30s | 1× (Fri) | Rotational core piece |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Scorpion reach

**Category:** Mobility
**Equipment:** None
**Target muscles (primary):** Thoracic spine (rotation), hip flexors (stretch)
**Target muscles (secondary):** Gluteus maximus, obliques, latissimus dorsi
**Movement type:** Mobility

**Description:** Lie prone with arms out to the sides. Lift one leg, bend the knee,
and reach the foot across the body toward the opposite hand while keeping the chest
pressed into the floor. Trains thoracic rotation and hip mobility. 4/side.

**Common mistakes:**
- Forcing the rotation with momentum instead of controlling it
- Lifting the chest off the floor, which cheats the thoracic segment

**Safety notes:** Avoid if lower back pain is present. Move slowly and stop at the
first point of restriction — do not force end range.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 4/side | Slow | 20-30s | 1× (Wed) | Thoracic rotation piece |
| Maintenance | 4/side | Slow | 20-30s | 1× (Fri) | Thoracic rotation piece |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Loaded beast to underswitch

**Category:** Compound / Advanced transition
**Equipment:** None
**Target muscles (primary):** Anterior deltoid, quadriceps, core (rotational), hip rotators
**Target muscles (secondary):** Wrists, forearms, glutes, coordination systems
**Movement type:** Compound transition

**Description:** From a loaded beast (hips pushed back toward the heels, arms long),
explode forward and rotate under one shoulder to land in a seated side-sit
("underswitch") position. Return and alternate. The most complex movement in this
Animal Flow sequence. 5 reps total.

**Common mistakes:**
- Not loading the hips back far enough before the explosive rotation
- Losing hand placement mid-transition, creating an unsafe landing

**Safety notes:** **Master every preceding movement in this section first** — the
underswitch requires the wrist, shoulder, and core coordination built by beast hold,
beast/crab transition, and step-through. Skip if any shoulder instability is present.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 5 reps | Explosive | 45-60s | 1× (Wed) | Most complex movement — master prerequisites first |
| Maintenance | 5 reps | Explosive | 45-60s | 1× (Fri) | Most complex movement — master prerequisites first |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

#### Free flow

**Category:** Cardio / Mobility
**Equipment:** None
**Target muscles (primary):** Full body
**Target muscles (secondary):** Coordination, creativity, transitional strength
**Movement type:** Flow / Continuous

**Description:** Link any combination of previously learned Animal Flow movements
continuously without stopping. This is the creative integration block — not a
prescribed sequence. 2-3 min continuous.

**Common mistakes:**
- Defaulting to only comfortable movements — this is the time to practice weak transitions
- Stopping between movements, which breaks the flow and the cardio stimulus

**Safety notes:** Stay within movements already mastered. This is practice, not
performance — abort any transition that feels unsafe mid-flow.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Not in plan structure |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 2-3 min continuous | Varied | — | 1× (Wed) | Closing integration block |
| Maintenance | 2-3 min continuous | Varied | — | 1× (Fri) | Closing integration block |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Buxton 2022, Matthews 2016 (CLAUDE.md §15)

---

### Yoga Poses

> **Plan integration:** Standing/floor poses (1-12, 16-18) run in the Cut Wed
> recovery flow (15-20 min) and Maintenance Wed alternating weeks (30 min).
> Lite Thu sessions (25-30 min) use the seated variants (13-15) plus poses
> 1, 10, 16, 17, 18. Bulk/AGRO do not program yoga in their structured week
> but any pose here is available as an optional cooldown.

---

#### Cat-cow

**Category:** Mobility
**Equipment:** None | Optional: mat
**Target muscles (primary):** Spine (segmental flexion and extension)
**Target muscles (secondary):** Core, shoulders, hip flexors
**Movement type:** Mobility

**Description:** On all fours, alternate between arching the spine (cow — chest and
tailbone lift, belly drops) and rounding it (cat — chin tucks, spine domes upward).
Syncs breath with movement to mobilize every segment of the spine. 8-10 reps.

**Common mistakes:**
- Rushing the reps, skipping segmental articulation
- Not syncing the breath — inhale on cow, exhale on cat

**Safety notes:** Gentle on the lower back and appropriate for all levels. Move
through available range; never force.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 8 reps | Slow | — | 1× (Thu) | Warm-up for seated flow |
| Cut | 8-10 reps | Slow | — | 1× (Wed) | Recovery flow opener |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 8-10 reps | Slow | — | 1× (Wed) | Recovery flow opener |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Downward dog

**Category:** Mobility / Strength
**Equipment:** None | Optional: mat
**Target muscles (primary):** Hamstrings, calves, anterior deltoid
**Target muscles (secondary):** Core, latissimus dorsi, serratus anterior
**Movement type:** Mobility / Isometric

**Description:** Inverted V position — hands shoulder-width, feet hip-width, press
heels toward floor while pushing hips high and long through the spine. A whole-body
decompression pose. Hold 30 sec.

**Common mistakes:**
- Rounding the upper back because tight shoulders pull the chest down
- Bending the knees excessively — reduces the hamstring stretch (some bend is fine)

**Safety notes:** Modify with bent knees if hamstrings are tight. Skip if wrist or
shoulder impingement flares up.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 30 sec | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 30 sec | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Low lunge

**Category:** Mobility
**Equipment:** None | Optional: mat, knee pad
**Target muscles (primary):** Hip flexors (psoas, iliacus)
**Target muscles (secondary):** Quadriceps, gluteus maximus (back leg)
**Movement type:** Mobility

**Description:** Deep lunge position with the back knee resting on the floor and the
hips pressing forward and down. Opens the front-line hip flexors — critical for
everyone who sits for extended periods. 30 sec/side.

**Common mistakes:**
- Front knee drifting past the toes, overloading the patellar tendon
- Collapsing the torso forward rather than stacking it tall over the hips

**Safety notes:** Pad the back knee if the floor is uncomfortable. Ease off if any
sharp hip or knee pain arises.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Pigeon pose

**Category:** Mobility
**Equipment:** None | Optional: mat, pillow
**Target muscles (primary):** Hip external rotators (piriformis, gluteus medius/maximus)
**Target muscles (secondary):** Hip flexors (back leg), obliques
**Movement type:** Mobility

**Description:** Front shin crossed in front of the body, back leg extended straight.
Square the pelvis and let the hip sink. Opens the deep external rotators that tighten
from sitting and running. 45 sec/side.

**Common mistakes:**
- Forcing depth instead of allowing the hip to open gradually
- Rotating the pelvis so one hip drops — reduces the stretch target

**Safety notes:** Place a pillow or folded blanket under the front-leg hip if the
pelvis doesn't square. **Skip if knee pain is present** — the front knee is
vulnerable in this position.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 45 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 45 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Standing forward fold

**Category:** Mobility
**Equipment:** None
**Target muscles (primary):** Hamstrings, erector spinae
**Target muscles (secondary):** Calves, glutes
**Movement type:** Mobility

**Description:** From standing, hinge forward at the hips and let the arms and head
hang. Release lower back tension and stretch the posterior chain. 30 sec.

**Common mistakes:**
- Rounding the upper back aggressively instead of hinging cleanly at the hips
- Locking the knees, which over-stretches the hamstring attachments

**Safety notes:** A slight knee bend is fine and often safer. Rise slowly to avoid
orthostatic dizziness.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 30 sec | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 30 sec | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Warrior I

**Category:** Strength / Mobility
**Equipment:** None
**Target muscles (primary):** Quadriceps, hip flexors (back leg), gluteus maximus
**Target muscles (secondary):** Shoulders, core, adductors
**Movement type:** Isometric / Strength-mobility hybrid

**Description:** A deep front lunge with the back foot angled ~45°, hips squared
forward, and arms extended overhead. Builds leg strength while opening the back-leg
hip flexor. 30 sec/side.

**Common mistakes:**
- Back foot not angled — creates knee torque on the front leg
- Front knee caving medially instead of tracking over the middle toes

**Safety notes:** Shorten the stance if balance or knee comfort is an issue.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Warrior II

**Category:** Strength / Mobility
**Equipment:** None
**Target muscles (primary):** Quadriceps, hip abductors
**Target muscles (secondary):** Deltoids (isometric hold), core, adductors
**Movement type:** Isometric / Strength-mobility hybrid

**Description:** Wide stance, front knee stacked over the ankle at ~90°, arms
extended parallel to the floor, gaze over the front fingertips. Trains quad
endurance and hip-opening capacity simultaneously. 30 sec/side.

**Common mistakes:**
- Leaning the torso forward over the front knee rather than stacking it upright
- Front knee not tracking over the middle toes

**Safety notes:** Reduce the depth if quad fatigue causes form breakdown.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Triangle pose

**Category:** Mobility
**Equipment:** None | Optional: block
**Target muscles (primary):** Hamstrings, obliques
**Target muscles (secondary):** Adductors, deltoids (top arm)
**Movement type:** Mobility

**Description:** Wide stance with one foot turned out 90°, hinge sideways over that
leg and reach the hand to the shin, ankle, or floor while the other arm reaches
vertical. 20 sec/side.

**Common mistakes:**
- Collapsing the chest downward instead of opening it toward the ceiling
- Bending the front knee — should stay straight or gently soft

**Safety notes:** Use a block or the shin instead of forcing the hand to the floor.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 20 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 20 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Tree pose

**Category:** Balance
**Equipment:** None | Optional: wall for support
**Target muscles (primary):** Ankle stabilizers, hip abductors
**Target muscles (secondary):** Core, quadriceps, glutes
**Movement type:** Balance / Isometric

**Description:** Stand on one leg and place the other foot on the inner thigh or
inner calf — **never on the knee joint**. Hands at heart center or overhead. Trains
static single-leg balance. 20 sec/side.

**Common mistakes:**
- Placing the foot directly on the knee joint — creates lateral ligament stress
- Staring at moving objects, destabilizing balance — fix gaze on a stationary point

**Safety notes:** Use a wall or chair for support initially. Never place the foot on
the supporting knee.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated variants |
| Cut | 20 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 20 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Child's pose

**Category:** Recovery
**Equipment:** None | Optional: pillow
**Target muscles (primary):** Lower back (erector spinae), latissimus dorsi
**Target muscles (secondary):** Shoulders, hips, gluteus maximus (stretch)
**Movement type:** Recovery / Mobility

**Description:** Kneel, sit the hips back toward the heels, walk the hands forward
and rest the forehead on the floor. Universal reset pose. 60 sec.

**Common mistakes:**
- Forcing the hips to the heels if the knees or ankles are tight

**Safety notes:** Place a pillow between the calves and thighs if needed — this is
one of the safest poses in the catalog and should be accessible to everyone.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 60 sec | Hold | — | 1× (Thu) | Recovery piece in seated flow |
| Cut | 60 sec | Hold | — | 1× (Wed) | Recovery flow closer |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 60 sec | Hold | — | 1× (Wed) | Recovery flow closer |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Seated spinal twist

**Category:** Mobility
**Equipment:** None | Optional: mat
**Target muscles (primary):** Thoracic rotators, obliques
**Target muscles (secondary):** Hip flexors, latissimus dorsi
**Movement type:** Mobility

**Description:** Seated with one leg crossed over the other, rotate the torso toward
the raised knee using the opposite arm as a lever. Trains thoracic rotation while
the hips stay anchored. 30 sec/side.

**Common mistakes:**
- Rounding the spine instead of sitting tall through the crown
- Using the arm to crank the rotation rather than breathing into it

**Safety notes:** Gentle — never force the rotation. Stop on any lumbar pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | N/A | — | — | — | Uses seated cat-cow instead |
| Cut | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 30 sec/side | Hold | — | 1× (Wed) | Recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Savasana

**Category:** Recovery
**Equipment:** None | Optional: mat, pillow
**Target muscles (primary):** Full body (relaxation, parasympathetic activation)
**Target muscles (secondary):** Nervous system downregulation
**Movement type:** Recovery

**Description:** Lie flat on the back with arms slightly out, palms up, legs
relaxed, eyes closed. Consciously release tension from feet to crown. The closing
pose of every yoga flow. 2-3 min.

**Common mistakes:**
- Tensing muscles instead of letting them fall heavy
- Fidgeting or rushing to end — give the nervous system time to downshift

**Safety notes:** None — the safest exercise in existence.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2-3 min | Rest | — | 1× (Thu) | Closes seated flow |
| Cut | 2-3 min | Rest | — | 1× (Wed) | Closes recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 2-3 min | Rest | — | 1× (Wed) | Closes recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Seated cat-cow (Lite variant)

**Category:** Mobility (Lite variant)
**Equipment:** Chair
**Target muscles (primary):** Spine (segmental flexion and extension)
**Target muscles (secondary):** Core, shoulders
**Movement type:** Mobility

**Description:** Seated on the front edge of a chair with hands on thighs, alternate
arching (cow) and rounding (cat) the spine in sync with the breath. The seated
mobility opener for the Lite Protocol. 8 reps.

**Common mistakes:**
- Not syncing with breath — inhale on cow, exhale on cat

**Safety notes:** Ideal for limited mobility. Keep both feet planted throughout.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 8 reps | Slow | — | 1× (Thu) | Seated flow opener |
| Cut | N/A | — | — | — | Uses standing cat-cow |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Uses standing cat-cow |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Seated side stretch (Lite variant)

**Category:** Mobility (Lite variant)
**Equipment:** Chair
**Target muscles (primary):** Obliques, latissimus dorsi
**Target muscles (secondary):** Intercostals, shoulder (raised arm)
**Movement type:** Mobility

**Description:** Seated tall with one arm raised overhead, lean to the opposite side
while keeping both sit bones planted. 30 sec/side.

**Common mistakes:**
- Rotating the torso forward or backward instead of staying in pure lateral flexion

**Safety notes:** Both sit bones must stay on the chair throughout. Stop on any
lumbar pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 30 sec/side | Hold | — | 1× (Thu) | Seated flow |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Not in plan structure |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Seated forward fold (Lite variant)

**Category:** Mobility (Lite variant)
**Equipment:** Chair
**Target muscles (primary):** Hamstrings, lower back (erector spinae)
**Target muscles (secondary):** Glutes, upper back
**Movement type:** Mobility

**Description:** Seated in a chair, hinge forward at the hips and reach toward the
shins or ankles while letting the head hang heavy. 30 sec.

**Common mistakes:**
- Rounding the spine aggressively instead of hinging cleanly at the hips

**Safety notes:** Only go as far as comfortable. Rise slowly to prevent dizziness.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 30 sec | Hold | — | 1× (Thu) | Seated flow |
| Cut | N/A | — | — | — | Uses standing forward fold |
| Bulk | N/A | — | — | — | Not in plan structure |
| Maintenance | N/A | — | — | — | Uses standing forward fold |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Standing chest opener

**Category:** Mobility
**Equipment:** None
**Target muscles (primary):** Pectoralis major, pectoralis minor
**Target muscles (secondary):** Anterior deltoid, biceps
**Movement type:** Mobility

**Description:** Clasp the hands behind the back, squeeze the shoulder blades
together, and lift the arms gently away from the body while keeping the chest
lifted. 20 sec.

**Common mistakes:**
- Jutting the chin forward instead of keeping a neutral neck

**Safety notes:** Skip or reduce range if shoulder impingement is present.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 20 sec | Hold | — | 1× (Thu) | Posture piece in seated flow |
| Cut | 20 sec | Hold | — | 1× (Wed) | Recovery flow piece |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 20 sec | Hold | — | 1× (Wed) | Recovery flow piece |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Seated neck stretches

**Category:** Mobility
**Equipment:** Chair or floor seated
**Target muscles (primary):** Upper trapezius, sternocleidomastoid (SCM), scalenes
**Target muscles (secondary):** Levator scapulae
**Movement type:** Mobility

**Description:** Seated tall, drop one ear toward the shoulder and let gravity do
the work — no pulling with the hand. 20 sec/side.

**Common mistakes:**
- Raising the opposite shoulder up to meet the ear, which cancels the stretch

**Safety notes:** Never force — the passive weight of the head is enough stimulus.
Stop immediately on any tingling, numbness, or dizziness.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 20 sec/side | Hold | — | 1× (Thu) | Seated flow |
| Cut | 20 sec/side | Hold | — | 1× (Wed) | Recovery flow piece |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 20 sec/side | Hold | — | 1× (Wed) | Recovery flow piece |
| AGRO | N/A | — | — | — | Uses dedicated neck protocol |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

#### Seated meditation

**Category:** Recovery / Mental
**Equipment:** None | Optional: cushion, chair
**Target muscles (primary):** Parasympathetic nervous system, diaphragm
**Target muscles (secondary):** Focus, attention regulation
**Movement type:** Recovery / Breathwork

**Description:** Seated comfortably — cushion, chair, or floor — with spine tall
and eyes closed or soft-gazed. Breathing pattern: **4 sec inhale / 4 sec hold /
6 sec exhale**. The extended exhale drives parasympathetic activation. 3 min.

**Common mistakes:**
- Forcing the breath into rigid counts instead of letting it settle into rhythm
- Getting frustrated with a wandering mind — notice and return, don't grade

**Safety notes:** None. Skip the breath hold if it creates anxiety.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 3 min | 4/4/6 breath | — | 1× (Thu) | Closes seated flow |
| Cut | 3 min | 4/4/6 breath | — | 1× (Wed) | Closes recovery flow |
| Bulk | N/A | — | — | — | Optional cooldown |
| Maintenance | 3 min | 4/4/6 breath | — | 1× (Wed) | Closes recovery flow |
| AGRO | N/A | — | — | — | Optional cooldown |

**Evidence:** Evidence-Based CAM, PMC 8038747 (CLAUDE.md §15)

---

### Pilates Exercises

> **Plan integration:** Lite Sat (25-30 min full mat session), Bulk Sat (15 min
> core-focused portion as finisher), Maintenance Wed (alternating weeks, 30 min).
> Cut/AGRO do not program Pilates in their structured week.

---

#### Pelvic tilts

**Category:** Core
**Equipment:** None (mat optional)
**Target muscles (primary):** Transverse abdominis, pelvic floor
**Target muscles (secondary):** Rectus abdominis, deep lumbar stabilizers
**Movement type:** Core activation

**Description:** Lying supine with knees bent and feet flat, gently tilt the pelvis
to flatten the lower back against the floor, then release. Builds awareness of deep
core activation and neutral pelvis — the foundation of every other Pilates movement.
2×10.

**Common mistakes:**
- Using the glutes to drive the tilt instead of the deep core
- Holding the breath instead of exhaling into the contraction

**Safety notes:** Foundational — master this before progressing. Stop on any lumbar
pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×10 | Slow | 30s | 1× (Sat) | 25-30 min mat session opener |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 2×10 | Slow | 30s | 1× (Sat) | 15 min core portion opener |
| Maintenance | 2×10 | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Bridge

**Category:** Core / Glutes
**Equipment:** None (mat optional)
**Target muscles (primary):** Gluteus maximus, hamstrings
**Target muscles (secondary):** Core, erector spinae, adductors
**Movement type:** Hinge / Isometric-dynamic hybrid

**Description:** Lying supine with knees bent and feet flat, lift the hips by
squeezing the glutes and pressing through the heels. Hold the top position for 3 sec,
then lower with control. 2×8.

**Common mistakes:**
- Hyperextending the lower back at the top instead of stopping at neutral hip extension
- Pushing from the toes instead of the heels — shifts load off the glutes

**Safety notes:** Safe for all levels. Stop on any lower back discomfort.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×8 | Slow, 3s hold | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 2×8 | Slow, 3s hold | 30s | 1× (Sat) | 15 min core portion |
| Maintenance | 2×8 | Slow, 3s hold | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Single leg stretch modified

**Category:** Core
**Equipment:** None (mat optional)
**Target muscles (primary):** Rectus abdominis, hip flexors
**Target muscles (secondary):** Obliques, transverse abdominis
**Movement type:** Dynamic core

**Description:** Supine with head and shoulders lifted slightly, alternate pulling
one knee to the chest while the opposite leg extends low — **foot stays above
floor level, not hovering just above it**. The modified version keeps the extended
leg higher to reduce lumbar demand. 2×6/side.

**Common mistakes:**
- Neck strain from lifting the head too high instead of letting it rest on the hands
- Losing pelvic stability as the legs switch — the lower back should stay pressed down

**Safety notes:** Keep the head down on the mat if neck pain arises. Extend the leg
higher (closer to vertical) if the lower back lifts.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×6/side | Slow | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 2×6/side | Slow | 30s | 1× (Sat) | 15 min core portion |
| Maintenance | 2×6/side | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Arm circles lying

**Category:** Shoulders / Mobility
**Equipment:** None (mat optional)
**Target muscles (primary):** Deltoids, rotator cuff
**Target muscles (secondary):** Serratus anterior, upper traps
**Movement type:** Mobility

**Description:** Supine with arms extended toward the ceiling, draw small controlled
circles. Reverse direction after the target rep count. 2×10 each direction.

**Common mistakes:**
- Making circles too large, losing control and shoulder centration
- Letting the lower back arch off the floor

**Safety notes:** Very low intensity — suitable for all. Stop on any sharp shoulder
pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×10 each way | Slow | 20s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in core portion |
| Maintenance | 2×10 each way | Slow | 20s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Spine twist lying

**Category:** Core / Mobility
**Equipment:** None (mat optional)
**Target muscles (primary):** Obliques, thoracic spine
**Target muscles (secondary):** Lumbar paraspinals, hip rotators
**Movement type:** Mobility

**Description:** Supine with knees bent and stacked, arms extended T-shape. Let both
knees drop to one side while the opposite shoulder stays anchored. 2×5/side.

**Common mistakes:**
- Letting the shoulders lift off the floor — reduces thoracic rotation
- Rushing the rotation instead of dropping the knees with gravity

**Safety notes:** Keep knees stacked and let gravity do the work — never force.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 2×5/side | Slow | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in core portion |
| Maintenance | 2×5/side | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### The Hundred modified

**Category:** Core endurance
**Equipment:** None (mat optional)
**Target muscles (primary):** Rectus abdominis, transverse abdominis
**Target muscles (secondary):** Hip flexors, deltoids
**Movement type:** Dynamic core endurance

**Description:** Supine with legs in tabletop (knees bent 90°, shins parallel to
floor — modified version), head and shoulders slightly lifted. Pump the arms
vigorously up and down while inhaling for 5 pumps and exhaling for 5 pumps. 5 cycles
of 10-count = 50 pumps total.

**Common mistakes:**
- Holding breath instead of maintaining the 5-in / 5-out pattern
- Neck strain from overlifting the head

**Safety notes:** Keep legs in tabletop (not extended) if the core cannot hold the
lower back pressed to the floor. Head-down modification is available — rest the
head on the mat if neck fatigue builds.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 5×10-count | Fast arm pumps | 45s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 5×10-count | Fast arm pumps | 45s | 1× (Sat) | 15 min core portion |
| Maintenance | 5×10-count | Fast arm pumps | 45s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Roll-up

**Category:** Core / Mobility
**Equipment:** None (mat optional)
**Target muscles (primary):** Rectus abdominis, hip flexors
**Target muscles (secondary):** Spinal articulators, obliques
**Movement type:** Dynamic core

**Description:** From supine with arms overhead, slowly roll up to a seated forward
fold one vertebra at a time, then reverse the motion back down. Trains segmental
spinal control and strong hip-flexor engagement. 6 reps.

**Common mistakes:**
- Using momentum to "throw" the torso up instead of articulating through each segment
- Feet lifting off the mat — anchor them throughout

**Safety notes:** Use the assisted variant (hold the backs of the thighs) if strength
is insufficient. **Skip if lower back pain is present.**

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 6 reps | Slow | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 6 reps | Slow | 30s | 1× (Sat) | 15 min core portion |
| Maintenance | 6 reps | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Single leg circles

**Category:** Hip mobility
**Equipment:** None (mat optional)
**Target muscles (primary):** Hip flexors, hip adductors, hip abductors
**Target muscles (secondary):** Core (anti-rotation), hamstrings
**Movement type:** Mobility

**Description:** Supine with one leg extended toward the ceiling (bottom leg
straight or bent), draw controlled circles with the raised leg. Reverse direction
after target reps. 8/direction/leg.

**Common mistakes:**
- Circles too large so the pelvis rocks — keep the pelvis anchored
- Bending the circling leg instead of keeping it long

**Safety notes:** Bend the bottom leg for stability if the lower back rises off the
mat.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 8/dir/leg | Slow | 20s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in core portion |
| Maintenance | 8/dir/leg | Slow | 20s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Double leg stretch

**Category:** Core
**Equipment:** None (mat optional)
**Target muscles (primary):** Full core (rectus abdominis, obliques, transverse abdominis)
**Target muscles (secondary):** Hip flexors, deltoids
**Movement type:** Dynamic core

**Description:** Supine with head and shoulders slightly lifted, start tucked (knees
to chest, hands around shins). Extend both arms overhead and legs out to a long
diagonal simultaneously, then return to the tuck. 8 reps.

**Common mistakes:**
- Lower back arching off the mat when arms and legs extend — extend only as far as control allows
- Losing control on the return, slamming knees back to chest

**Safety notes:** Only extend legs as far as the core can control — **the lower
back must stay pressed against the floor throughout**.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 8 reps | Slow | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 8 reps | Slow | 30s | 1× (Sat) | 15 min core portion |
| Maintenance | 8 reps | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Bridge with march

**Category:** Core / Glutes
**Equipment:** None (mat optional)
**Target muscles (primary):** Gluteus maximus, core (anti-rotation)
**Target muscles (secondary):** Gluteus medius, hamstrings
**Movement type:** Dynamic stability

**Description:** From a bridge position (hips lifted), alternate lifting one foot
off the floor into a march while keeping the hips level. 10 reps total (5/side).

**Common mistakes:**
- Hips dropping each time a foot lifts — must stay level
- Rotating the pelvis as the leg lifts instead of resisting rotation

**Safety notes:** Master the regular bridge first. Stop on any low-back pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 10 reps | Slow | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 10 reps | Slow | 30s | 1× (Sat) | 15 min core portion |
| Maintenance | 10 reps | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Swimming prone

**Category:** Posterior chain
**Equipment:** None (mat optional)
**Target muscles (primary):** Erector spinae, gluteus maximus
**Target muscles (secondary):** Deltoids, hamstrings
**Movement type:** Dynamic stability

**Description:** Prone with arms extended overhead, alternate lifting the opposite
arm and leg a few inches off the floor in a swimming pattern. 20 alternating (10/side).

**Common mistakes:**
- Lifting too high, hyperextending the lumbar spine — keep movements small
- Holding the breath instead of maintaining steady rhythm

**Safety notes:** Small controlled movements — the work is the contraction, not the
height. Stop on any lumbar pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 20 alternating | Slow | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 20 alternating | Slow | 30s | 1× (Sat) | 15 min core portion |
| Maintenance | 20 alternating | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Seal

**Category:** Mobility / Recovery
**Equipment:** None (mat required — soft surface)
**Target muscles (primary):** Spine (segmental massage), core
**Target muscles (secondary):** Hip flexors
**Movement type:** Mobility

**Description:** Seated with knees open, soles of feet together, hands grasping the
ankles. Rock backward onto the mid-back and return to seated under control. 6 reps.

**Common mistakes:**
- Rolling onto the neck — **stop the roll at the upper back**, never on the cervical spine
- Using too much momentum and losing control on the return

**Safety notes:** Soft surface only — never on hard floor. **Skip if any spinal
issues are present.**

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 6 reps | Controlled | 30s | 1× (Sat) | 25-30 min mat session closer |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | N/A | — | — | — | Not in core portion |
| Maintenance | 6 reps | Controlled | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---

#### Side-lying leg lift

**Category:** Hip stability
**Equipment:** None (mat optional)
**Target muscles (primary):** Gluteus medius, tensor fasciae latae (TFL)
**Target muscles (secondary):** Core (anti-rotation), adductors (bottom leg)
**Movement type:** Isolation

**Description:** Side-lying with bottom leg bent for stability and top leg extended
straight. Lift the top leg to ~45° without rotating the hip forward, pause, lower
under control. 10/side.

**Common mistakes:**
- Rotating the hip forward to recruit hip flexors / TFL instead of glute med
- Kicking with momentum instead of a controlled lift

**Safety notes:** Very low intensity — suitable for all levels. Stop on any sharp
lateral hip pain.

**Per-Plan Prescription:**

| Plan | Sets × Reps | Tempo | Rest | Freq/week | Notes |
|------|-------------|-------|------|-----------|-------|
| Lite | 10/side | Slow | 30s | 1× (Sat) | 25-30 min mat session |
| Cut | N/A | — | — | — | Not in plan structure |
| Bulk | 10/side | Slow | 30s | 1× (Sat) | 15 min core portion |
| Maintenance | 10/side | Slow | 30s | 1× (Wed alt) | 30 min alternating-week session |
| AGRO | N/A | — | — | — | Not in plan structure |

**Evidence:** PMC 11447755, Physiology & Behavior 2016 (CLAUDE.md §15)

---
