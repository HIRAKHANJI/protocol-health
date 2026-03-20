# Exercise Media Manifest

## Source
All images downloaded from [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db) on GitHub.

## License
**Public Domain (Unlicense)** - The free-exercise-db dataset is released under the Unlicense, placing all content in the public domain. No attribution required, though attribution is appreciated.

## Image Format
- Static JPG images (start position + end position per exercise)
- Naming: `{id}_start.jpg` and `{id}_end.jpg`
- NOT animated GIFs - these are static position photographs
- Average size: ~50KB per image, ~100KB per exercise pair

## Coverage Summary
- **Downloaded**: 33 exercises (66 image files)
- **Missing/Placeholder**: 51 exercises need custom media

---

## Downloaded Images (33 exercises)

### PUSH Progressions
| ID | Exercise | Source Exercise | Match Quality |
|----|----------|---------------|---------------|
| push-0 | Wall push-up | Incline_Push-Up | Good (similar angle) |
| push-1 | Knee push-up | Incline_Push-Up_Close-Grip | Approximate |
| push-2 | Standard push-up | Pushups | Exact |
| push-3 | Wide push-up | Push-Up_Wide | Exact |
| push-4 | Decline push-up | Decline_Push-Up | Exact |
| push-5 | Diamond push-up | Push-Ups_-_Close_Triceps_Position | Exact |
| push-7 | Pike push-up | Handstand_Push-Ups | Approximate (pike vs handstand) |

### PULL Progressions
| ID | Exercise | Source Exercise | Match Quality |
|----|----------|---------------|---------------|
| pull-1 | Superman hold | Superman | Exact |
| pull-3 | Inverted row (knees bent) | Inverted_Row | Good |
| pull-6 | Scapular push-up | Scapular_Pull-Up | Approximate |

### SQUAT Progressions
| ID | Exercise | Source Exercise | Match Quality |
|----|----------|---------------|---------------|
| squat-2 | Box squat | Sit_Squats | Good |
| squat-4 | Bodyweight squat (full) | Bodyweight_Squat | Exact |
| squat-5 | Jump squat | Freehand_Jump_Squat | Exact |
| squat-6 | Bulgarian split squat | Split_Squats | Good |

### HINGE Progressions
| ID | Exercise | Source Exercise | Match Quality |
|----|----------|---------------|---------------|
| hinge-1 | Glute bridge | Butt_Lift_Bridge | Exact |
| hinge-2 | Glute bridge (single leg) | Single_Leg_Glute_Bridge | Exact |
| hinge-6 | Nordic hamstring curl | Natural_Glute_Ham_Raise | Good |
| hinge-7 | Nordic hamstring curl (full) | Floor_Glute-Ham_Raise | Good |

### CORE Progressions
| ID | Exercise | Source Exercise | Match Quality |
|----|----------|---------------|---------------|
| core-1 | Dead bug | Dead_Bug | Exact |
| core-2 | Plank | Plank | Exact |
| core-3 | Bicycle crunch | Cross-Body_Crunch | Good |
| core-6 | Leg raises (lying) | Flat_Bench_Lying_Leg_Raise | Good |
| core-7 | Lying leg raises + hip lift | Hanging_Leg_Raise | Approximate |

### SHOULDER Progressions
| ID | Exercise | Source Exercise | Match Quality |
|----|----------|---------------|---------------|
| shoulder-6 | Full handstand push-up | Handstand_Push-Ups | Exact |

### Non-Progression Exercises
| ID | Exercise | Source Exercise | Match Quality |
|----|----------|---------------|---------------|
| jumping-jacks | Jumping jacks | Star_Jump | Good |
| mountain-climbers | Mountain climbers | Mountain_Climbers | Exact |
| burpee | Burpee | Frog_Hops | Approximate |
| reverse-lunge | Reverse lunge | Bodyweight_Walking_Lunge | Good |
| cat-cow | Cat-cow | Cat_Stretch | Good |
| chin-tuck | Chin tuck | Chin_To_Chest_Stretch | Approximate |
| hip-cars | Hip CARs | Hip_Circles_prone | Approximate |
| calf-raise | Calf raise | Calf_Stretch_Hands_Against_Wall | Approximate |
| side-plank | Side plank + hip dip | Side_Bridge | Good |
| frog-stretch | Frog stretch | Groin_and_Back_Stretch | Approximate |

---

## Missing Exercises (51 placeholders)

These exercises have `.placeholder.txt` files and need custom media:

### Push (3 missing)
- push-6: Archer push-up
- push-8: Pseudo-planche lean
- push-9: One-arm push-up (assisted)

### Pull (6 missing)
- pull-2: Prone Y-T-W raises
- pull-4: Inverted row (legs straight)
- pull-5: Inverted row (feet elevated)
- pull-7: Thread the needle
- pull-8: Towel row
- pull-9: Archer row (towel)

### Shoulder (5 missing)
- shoulder-1 through shoulder-5 (pike push-up variations, wall handstand)

### Squat (5 missing)
- squat-1: Wall squat hold
- squat-3: Bodyweight squat (partial)
- squat-7: Cossack squat
- squat-8/9: Pistol squat variations

### Hinge (3 missing)
- hinge-3: Good morning (bodyweight)
- hinge-4: Bodyweight RDL
- hinge-5: Glute bridge march

### Core (5 missing)
- core-4/5: Hollow body hold/rock
- core-8: L-sit tuck (floor)
- core-9: Dragon flag negative
- core-10: Full L-sit

### All Skill Progressions (15 missing)
- skill_crow-1 through 4
- skill_handstand-1 through 4
- skill_lsit-1 through 3
- skill_planche-1 through 4

### Other (9 missing)
- V-sit hold, World's greatest stretch, Wrist CARs, Neck exercises,
  Pigeon pose, 90/90 hip stretch, Deep squat hold, Shoulder dislocates,
  Prone neck extension

---

## Recommendations for Missing Media

1. **Record custom demonstrations** - Film short clips and convert to GIF using ffmpeg
2. **Wikimedia Commons** - Check for CC-licensed exercise photos individually
3. **wger.de** - Has ~344 CC BY-SA 3.0 images (Everkinetic illustrations) but coverage for calisthenics progressions is sparse
4. **Create SVG illustrations** - Simple line drawings would be lightweight and consistent
5. **Use start/end position composites** - Combine the _start and _end JPGs into a single side-by-side image per exercise
