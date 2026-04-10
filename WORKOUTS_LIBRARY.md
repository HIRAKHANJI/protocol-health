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
