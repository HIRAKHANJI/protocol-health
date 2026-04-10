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
