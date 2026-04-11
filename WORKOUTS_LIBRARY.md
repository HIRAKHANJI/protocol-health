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
