export const EXERCISE_PROGRESSIONS = {
  push: {
    name: 'PUSH', levels: [
      { level:0, exercise:'Wall push-up', sets:'3 × 15', notes:'Hands on wall, standing. Zero floor contact.' },
      { level:1, exercise:'Knee push-up', sets:'3 × 12', notes:'Knees on floor. Full chest-to-floor range.' },
      { level:2, exercise:'Standard push-up', sets:'3 × 12–15', notes:'Full body. Chest to floor.' },
      { level:3, exercise:'Wide push-up', sets:'3 × 12', notes:'Hands wider than shoulders. More chest.' },
      { level:4, exercise:'Decline push-up', sets:'3 × 10–12', notes:'Feet elevated on chair/bed. Upper chest.' },
      { level:5, exercise:'Diamond push-up', sets:'3 × 8–10', notes:'Hands form diamond. Tricep dominant.' },
      { level:6, exercise:'Archer push-up', sets:'3 × 6–8/side', notes:'One arm extended laterally. Unilateral chest.' },
      { level:7, exercise:'Pike push-up', sets:'3 × 8–10', notes:'Hips high, head toward floor. Shoulder dominant.' },
      { level:8, exercise:'Pseudo-planche lean', sets:'4 × 20 sec', notes:'Fingers back, lean forward on straight arms.' },
      { level:9, exercise:'One-arm push-up (assisted)', sets:'3 × 3–5/side', notes:'One hand on knee for assistance.' }
    ]
  },
  pull: {
    name: 'PULL', levels: [
      { level:1, exercise:'Superman hold', sets:'3 × 20–30 sec', notes:'Face down, lift arms + chest. Rear delt activation.' },
      { level:2, exercise:'Prone Y-T-W raises', sets:'3 × 10 each', notes:'Face down. Y, T, W positions. Rear delt + mid-trap.' },
      { level:3, exercise:'Inverted row (knees bent)', sets:'3 × 8–10', notes:'Under table. Knees bent. Pull chest to edge.' },
      { level:4, exercise:'Inverted row (legs straight)', sets:'3 × 8–10', notes:'Under table. Full body straight.' },
      { level:5, exercise:'Inverted row (feet elevated)', sets:'3 × 6–8', notes:'Feet on chair, body horizontal.' },
      { level:6, exercise:'Scapular push-up', sets:'3 × 12', notes:'Protract/retract shoulder blades. Planche prereq.' },
      { level:7, exercise:'Thread the needle', sets:'3 × 8/side', notes:'From all-fours, rotate arm under body.' },
      { level:8, exercise:'Towel row', sets:'3 × 8–10', notes:'Loop towel around door handle. Pull chest to door.' },
      { level:9, exercise:'Archer row (towel)', sets:'3 × 6–8/side', notes:'One-arm towel row. Unilateral lat + rhomboid.' }
    ]
  },
  shoulder: {
    name: 'SHOULDER', levels: [
      { level:1, exercise:'Pike push-up (bent knee)', sets:'3 × 8', notes:'Knees slightly bent. Reduced load.' },
      { level:2, exercise:'Pike push-up (full)', sets:'3 × 8–10', notes:'Full pike position.' },
      { level:3, exercise:'Decline pike push-up', sets:'3 × 6–8', notes:'Feet elevated on chair.' },
      { level:4, exercise:'Wall handstand hold', sets:'3 × 20–30 sec', notes:'Hands on floor, feet on wall.' },
      { level:5, exercise:'Wall handstand push-up (partial)', sets:'3 × 3–5', notes:'Small range from handstand.' },
      { level:6, exercise:'Full handstand push-up', sets:'3 × 3–5', notes:'Full range from handstand. Advanced.' }
    ]
  },
  squat: {
    name: 'SQUAT', levels: [
      { level:1, exercise:'Wall squat (hold)', sets:'3 × 30–45 sec', notes:'Back against wall. Isometric.' },
      { level:2, exercise:'Box squat', sets:'3 × 10–12', notes:'Squat to chair, stand. Partial depth.' },
      { level:3, exercise:'Bodyweight squat (partial)', sets:'3 × 12–15', notes:'Half depth.' },
      { level:4, exercise:'Bodyweight squat (full)', sets:'3 × 15–20', notes:'Full depth. Ass to grass.' },
      { level:5, exercise:'Jump squat', sets:'3 × 10', notes:'Explosive. Land soft.' },
      { level:6, exercise:'Bulgarian split squat', sets:'3 × 8–10/leg', notes:'Rear foot elevated on chair.' },
      { level:7, exercise:'Cossack squat', sets:'3 × 6–8/side', notes:'Wide feet, lateral lunge.' },
      { level:8, exercise:'Pistol squat (assisted)', sets:'3 × 3–5/leg', notes:'Hold wall or doorframe.' },
      { level:9, exercise:'Pistol squat (full)', sets:'3 × 3–5/leg', notes:'Unassisted single-leg squat. Elite.' }
    ]
  },
  hinge: {
    name: 'HINGE', levels: [
      { level:1, exercise:'Glute bridge', sets:'3 × 15', notes:'Lying on back. Hip thrust both feet.' },
      { level:2, exercise:'Glute bridge (single leg)', sets:'3 × 12/leg', notes:'One foot on floor. Unilateral.' },
      { level:3, exercise:'Good morning (bodyweight)', sets:'3 × 12', notes:'Hands behind head. Hip hinge.' },
      { level:4, exercise:'Bodyweight RDL', sets:'3 × 10–12/leg', notes:'Single-leg hinge. Balance + hamstring.' },
      { level:5, exercise:'Glute bridge march', sets:'3 × 15', notes:'Alternate legs in bridge. Stability.' },
      { level:6, exercise:'Nordic hamstring curl', sets:'3 × 3–5', notes:'Feet hooked. Lower slowly.' },
      { level:7, exercise:'Nordic hamstring curl (full)', sets:'3 × 5–8', notes:'Full controlled descent and pull back.' }
    ]
  },
  core: {
    name: 'CORE', levels: [
      { level:1, exercise:'Dead bug', sets:'3 × 8/side', notes:'Lower back glued to floor.' },
      { level:2, exercise:'Plank', sets:'3 × 30–45 sec', notes:'Elbows or straight arms. Full tension.' },
      { level:3, exercise:'Bicycle crunch', sets:'3 × 15–20/side', notes:'Slow and deliberate.' },
      { level:4, exercise:'Hollow body hold', sets:'3 × 20–30 sec', notes:'Arms overhead. Back pressed down.' },
      { level:5, exercise:'Hollow body rock', sets:'3 × 10', notes:'Rock gently. Maintain tension.' },
      { level:6, exercise:'Leg raises (lying)', sets:'3 × 10–12', notes:'Legs straight. 1 inch off floor.' },
      { level:7, exercise:'Lying leg raises + hip lift', sets:'3 × 10–12', notes:'Legs straight up, lift hips off floor at top. No equipment.' },
      { level:8, exercise:'L-sit tuck (floor)', sets:'3 × 15 sec', notes:'Hands pressing, tuck knees.' },
      { level:9, exercise:'Dragon flag negative', sets:'3 × 3–5', notes:'Bed edge. Lower slowly.' },
      { level:10, exercise:'Full L-sit', sets:'3 × 10–15 sec', notes:'Legs extended. Straight arm strength.' }
    ]
  },
  skill_crow: {
    name: 'CROW STAND', levels: [
      { level:1, exercise:'Tuck hold (feet on floor)', sets:'3 × 15 sec', notes:'Hands on floor, knees on upper arms, shift weight.' },
      { level:2, exercise:'Tuck hold (feet lifted)', sets:'4 × 15–20 sec', notes:'Lift feet off floor. Build balance.' },
      { level:3, exercise:'Crow (one leg extended)', sets:'3 × 10 sec/side', notes:'Extend one leg from crow position.' },
      { level:4, exercise:'Full crow stand', sets:'3 × 20 sec', notes:'Both legs tucked, stable hold.' }
    ]
  },
  skill_handstand: {
    name: 'HANDSTAND', levels: [
      { level:1, exercise:'Wall handstand hold', sets:'3 × 20–30 sec', notes:'Feet on wall. Shoulder + wrist base.' },
      { level:2, exercise:'Wall handstand (belly to wall)', sets:'3 × 20 sec', notes:'Walk feet up, chest near wall.' },
      { level:3, exercise:'Kick-up practice', sets:'5 attempts', notes:'Kick up to wall, hold briefly.' },
      { level:4, exercise:'Freestanding hold attempts', sets:'5 × max hold', notes:'Away from wall. Track duration.' }
    ]
  },
  skill_lsit: {
    name: 'L-SIT', levels: [
      { level:1, exercise:'L-sit tuck', sets:'4 × 15 sec', notes:'Hands pressing, knees tucked to chest.' },
      { level:2, exercise:'L-sit one leg extended', sets:'3 × 10 sec/side', notes:'Extend one leg, keep other tucked.' },
      { level:3, exercise:'Full L-sit', sets:'3 × 10–15 sec', notes:'Both legs extended. Track duration.' }
    ]
  },
  skill_planche: {
    name: 'PLANCHE', levels: [
      { level:1, exercise:'Pseudo-planche lean', sets:'4 × 20 sec', notes:'Fingers back, lean forward on straight arms.' },
      { level:2, exercise:'Planche lean (deeper)', sets:'4 × 15 sec', notes:'More forward lean, wrists behind shoulders.' },
      { level:3, exercise:'Tuck planche', sets:'3 × 10 sec', notes:'Tucked knees, feet off floor, body horizontal.' },
      { level:4, exercise:'Straddle planche', sets:'3 × 5 sec', notes:'Legs wide, body horizontal. Very advanced.' }
    ]
  }
};
