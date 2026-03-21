# Protocol Health — Full Architecture

## 1. System Overview

```mermaid
graph TB
    subgraph PWA["📱 PWA Shell"]
        SW["sw.js<br/>Service Worker<br/>Cache-first strategy"]
        MAN["manifest.json<br/>Standalone display"]
        ICONS["PH_LOGO_192 / PH_LOGO_512"]
    end

    subgraph APP["app.html — Single File Application"]
        HTML["HTML Structure<br/>6 Tabs + Settings + Modals"]
        CSS["CSS Styles<br/>Dark theme, mobile-first"]
        JS["JavaScript Engine<br/>All logic, no framework"]
    end

    subgraph STORAGE["💾 localStorage (Device Only)"]
        SK_WT["ph_wt_v1<br/>Weight Log"]
        SK_DL["ph_dl_v1<br/>Day Logs"]
        SK_FD["ph_fd_v1<br/>Fast Days"]
        SK_ST["ph_st_v1<br/>Settings"]
        SK_SC["ph_sc_v1<br/>Schedule"]
        SK_FL["ph_fl_v1<br/>Food Log"]
        SK_FB["ph_fb_v1<br/>Food Library"]
        SK_EX["ph_ex_v1<br/>Exercise Levels"]
        SK_SV["ph_sv_v1<br/>Seen Version"]
        SK_LD["ph_ld_v1<br/>Light Days"]
        SK_SW["ph_sw_v1<br/>SW Dismissed Ver"]
    end

    USER["👤 User"] -->|"installs PWA"| PWA
    PWA -->|"serves cached"| APP
    APP <-->|"gs() / ss()"| STORAGE

    style PWA fill:#1a1a2e,stroke:#c8f542,color:#e8e8e8
    style APP fill:#0a0a0a,stroke:#c8f542,color:#e8e8e8
    style STORAGE fill:#111111,stroke:#f5a623,color:#e8e8e8
```

---

## 2. Initialization Flow

```mermaid
flowchart TD
    LOAD["Page Load"] --> REG["Register Service Worker"]
    LOAD --> INIT["init()"]

    INIT --> SPLASH["Show Splash Screen<br/>1750ms with plan name"]
    SPLASH --> PLAN_UI["applyPlanUI()<br/>Load plan CSS + badge"]
    PLAN_UI --> FAST_UI["updateFastUI()<br/>Fast banner + checklist swap"]
    FAST_UI --> TODAY["updateTodayTab()<br/>Banner + renderTodayChecklist()"]
    TODAY --> LOAD_CK["loadChecklist()<br/>Restore tick states"]
    LOAD_CK --> WEEK["buildWeekGrid()<br/>7-day workout icons"]
    WEEK --> WEIGHTS["renderWeights()<br/>Weight history list"]
    WEIGHTS --> GOAL["updateGoalBar()<br/>% progress to target"]
    GOAL --> DUR["updateDurationBar()<br/>Schedule DAY X / TOTAL"]
    DUR --> PROJ["updateProjection()<br/>Sunday weight forecast"]
    PROJ --> NOTES["renderRecentNotes()<br/>Day log notes"]
    NOTES --> CAL_STRIP["updateTodayCalStrip()<br/>Food calorie status"]
    CAL_STRIP --> SCHED_BTN["updateManageSchedBtn()<br/>Schedule controls"]
    SCHED_BTN --> VER["checkVersionUpdate()<br/>Show banner if needed"]

    REG --> POLL["Poll for SW updates<br/>every 30 min"]
    REG --> IOS["iOS resume detection<br/>visibilitychange + pageshow"]

    style LOAD fill:#c8f542,stroke:#000,color:#000
    style INIT fill:#1a1a2e,stroke:#c8f542,color:#e8e8e8
    style VER fill:#1a1a2e,stroke:#c8f542,color:#e8e8e8
```

---

## 3. Central Dispatcher — The Nervous System

Every data write ends with `dispatch("EVENT")`. The dispatcher is the **only** bridge between data mutations and UI updates.

```mermaid
flowchart LR
    subgraph DATA_WRITES["Data Mutations"]
        W1["logWeight()"]
        W2["toggle() / saveDayLogField()"]
        W3["toggleFastDay()"]
        W4["onPlanSelectChange()"]
        W5["saveSettings() calories"]
        W6["applySchedule()"]
        W7["calcAdjust()"]
        W8["endScheduleToday()"]
        W9["removeSchedule()"]
        W10["addFoodEntry()"]
        W11["setExerciseLevel()"]
    end

    subgraph DISPATCH["dispatch()"]
        D["DISPATCH_MAP<br/>Event Router"]
    end

    subgraph UI_UPDATES["UI Renderers"]
        U1["updateGoalBar()"]
        U2["updateProjection()"]
        U3["renderRecentNotes()"]
        U4["updateDurationBar()"]
        U5["updateFastUI()"]
        U6["renderTodayChecklist()"]
        U7["renderCalendar()"]
        U8["renderNutrition()"]
        U9["updateManageSchedBtn()"]
        U10["updateTodayCalStrip()"]
        U11["renderRadar()"]
    end

    W1 -->|"WEIGHT_LOGGED"| D
    W2 -->|"DAY_SAVED"| D
    W3 -->|"FAST_DAY_TOGGLED"| D
    W4 -->|"PLAN_CHANGED"| D
    W5 -->|"CALORIES_CHANGED"| D
    W6 -->|"SCHEDULE_SET"| D
    W7 -->|"SCHEDULE_ADJUSTED"| D
    W8 -->|"SCHEDULE_ENDED"| D
    W9 -->|"SCHEDULE_REMOVED"| D
    W10 -->|"FOOD_LOGGED"| D
    W11 -->|"EXERCISE_LEVEL_CHANGED"| D

    D --> U1 & U2 & U3 & U4 & U5 & U6 & U7 & U8 & U9 & U10 & U11

    style DISPATCH fill:#c8f542,stroke:#000,color:#000
    style DATA_WRITES fill:#1a1a2e,stroke:#f5a623,color:#e8e8e8
    style UI_UPDATES fill:#1a1a2e,stroke:#3ddc84,color:#e8e8e8
```

### Dispatch Event Map

```mermaid
graph LR
    WL["WEIGHT_LOGGED"] --> WL1["goalBar"] & WL2["projection"] & WL3["recentNotes"] & WL4["durationBar"]
    DS["DAY_SAVED"] --> DS1["calendarCell"] & DS2["monthStats"] & DS3["recentNotes"] & DS4["projection"]
    FT["FAST_DAY_TOGGLED"] --> FT1["fastUI"] & FT2["checklist"] & FT3["calendarCell"] & FT4["projection"]
    PC["PLAN_CHANGED"] --> PC1["allTabs"] & PC2["checklist"] & PC3["durationBar"] & PC4["projection"] & PC5["calendar"]
    CC["CALORIES_CHANGED"] --> CC1["projection"] & CC2["durationBar"] & CC3["nutritionMacros"]
    SS["SCHEDULE_SET"] --> SS1["durationBar"] & SS2["calendarHighlights"] & SS3["manageSchedBtn"]
    FL["FOOD_LOGGED"] --> FL1["projection"] & FL2["goalBar"] & FL3["recentNotes"] & FL4["todayCalStrip"] & FL5["nutritionMacros"] & FL6["radar"]

    style WL fill:#f5a623,stroke:#000,color:#000
    style DS fill:#f5a623,stroke:#000,color:#000
    style FT fill:#7b68ee,stroke:#000,color:#000
    style PC fill:#c8f542,stroke:#000,color:#000
    style CC fill:#c8f542,stroke:#000,color:#000
    style SS fill:#4ecdc4,stroke:#000,color:#000
    style FL fill:#3ddc84,stroke:#000,color:#000
```

---

## 4. Plan System — Content Gateway

```mermaid
flowchart TD
    SETTINGS["getSettings()<br/>settings.plan = 'default' | 'agro' | 'cut' | 'bulk' | 'maintenance'"]
    GAP["getActivePlan()<br/>Returns PLANS[key]"]

    SETTINGS --> GAP

    subgraph PLANS_OBJ["PLANS Object — 5 Plans"]
        P1["PLANS.default<br/>Sustainable cut<br/>3 fast days, 1500 cal"]
        P2["PLANS.agro<br/>Aggressive cut<br/>3 fast days, 1000 cal"]
        P3["PLANS.cut<br/>Flexible deficit<br/>0 fast days, macro-aware"]
        P4["PLANS.bulk<br/>Clean surplus<br/>0 fast days, carb-forward"]
        P5["PLANS.maintenance<br/>Sustain weight<br/>0 fast days, balanced"]
    end

    GAP --> PLANS_OBJ

    subgraph PLAN_FIELDS["Each Plan Contains"]
        ID["Identity<br/>name, badge, badgeClass, descClass, subtitle"]
        PROTO["Protocol Numbers<br/>tdee, fastDaysPerWeek, fastDaysDow"]
        STYLE["Banner Styling<br/>bannerColor, bannerBg, bannerBorder"]
        CK_DATA["Checklist Arrays<br/>checklistNormal[], checklistFast[]"]
        DAY_SUB["Day Sub-text<br/>morningSub{}, eveningSub{}, stretchSub{}"]
        MACROS["Macro Config<br/>macroSplit{}, proteinFloorMultiplier"]
        CONTENT["Content Generators<br/>workoutContent(), nutritionContent(), rulesContent()"]
    end

    PLANS_OBJ --> PLAN_FIELDS

    subgraph CONSUMERS["Plan Consumers"]
        C1["TODAY tab<br/>Banner + Checklist"]
        C2["WORKOUTS tab<br/>workoutContent()"]
        C3["NUTRITION tab<br/>nutritionContent()"]
        C4["RULES tab<br/>rulesContent()"]
        C5["MONTHS calendar<br/>fastDaysDow for auto-set"]
        C6["Goal Calculator<br/>tdee, fastDaysPerWeek"]
        C7["Projection<br/>tdee, fast day count"]
        C8["computeMacros()<br/>macroSplit, proteinFloorMultiplier"]
    end

    PLAN_FIELDS --> CONSUMERS

    style GAP fill:#c8f542,stroke:#000,color:#000
    style PLANS_OBJ fill:#1a1a2e,stroke:#c8f542,color:#e8e8e8
    style CONSUMERS fill:#111111,stroke:#3ddc84,color:#e8e8e8
```

---

## 5. Tab Architecture

```mermaid
flowchart TD
    NAV["Tab Navigation Bar<br/>switchTab(id, btn)"]

    NAV --> T1 & T2 & T3 & T4 & T5 & T6

    subgraph T1["TODAY"]
        T1A["Plan Banner<br/>Name + badge + cal ceiling"]
        T1B["renderTodayChecklist()<br/>Dynamic from plan arrays"]
        T1C["Progress Bar<br/>updateProgress() → % done"]
        T1D["Fast Day Banner<br/>updateFastUI()"]
        T1E["Quick Weight Log<br/>logWeightFromToday()"]
        T1F["Food Log Button<br/>openFoodModal()"]
        T1G["Duration Strip<br/>DAY X / TOTAL"]
        T1A --> T1B --> T1C
    end

    subgraph T2["MONTHS"]
        T2A["renderCalendar()<br/>Monthly grid"]
        T2B["Cell Colors<br/>🟢 done 🟣 fast 🟠 partial 🔴 missed"]
        T2C["Schedule Overlay<br/>White border on plan days"]
        T2D["Month Stats<br/>4 boxes: done/fast/partial/missed"]
        T2E["openDayModal()<br/>Edit past day data"]
        T2A --> T2B & T2C & T2D
        T2B -->|"tap cell"| T2E
    end

    subgraph T3["WORKOUTS"]
        T3A["buildWeekGrid()<br/>7-day emoji row"]
        T3B["plan.workoutContent()<br/>Collapsible workout cards"]
        T3C["Exercise Level Selector<br/>exRowWithLevel() + EXERCISE_PROGRESSIONS"]
    end

    subgraph T4["NUTRITION"]
        T4A["plan.nutritionContent(s)<br/>Macro targets + meal timing"]
        T4B["Signal Chips<br/>base/rest/preFast/stall/satiety"]
        T4C["computeMacros()<br/>Context-aware targets"]
    end

    subgraph T5["RULES"]
        T5A["plan.rulesContent(s)<br/>Eating + training + discipline"]
    end

    subgraph T6["TRACK"]
        T6A["Weight Input + History<br/>logWeight() + renderWeights()"]
        T6B["Goal Bar<br/>updateGoalBar() → % to target"]
        T6C["Projection<br/>updateProjection() → Sunday forecast"]
        T6D["Recent Notes<br/>renderRecentNotes()"]
        T6E["Radar Chart<br/>renderRadar() → 7-axis spider"]
        T6F["Backup / Restore<br/>backupData() + restoreData()"]
        T6G["Text Export<br/>Date range → plain text"]
    end

    style NAV fill:#c8f542,stroke:#000,color:#000
    style T1 fill:#1a1a2e,stroke:#c8f542,color:#e8e8e8
    style T2 fill:#1a1a2e,stroke:#7b68ee,color:#e8e8e8
    style T3 fill:#1a1a2e,stroke:#f5a623,color:#e8e8e8
    style T4 fill:#1a1a2e,stroke:#3ddc84,color:#e8e8e8
    style T5 fill:#1a1a2e,stroke:#ff4444,color:#e8e8e8
    style T6 fill:#1a1a2e,stroke:#4ecdc4,color:#e8e8e8
```

---

## 6. Checklist System

```mermaid
flowchart TD
    PLAN["getActivePlan()"] --> FAST_CHECK{"isFastDay(today)?"}

    FAST_CHECK -->|"Yes"| FAST_LIST["plan.checklistFast[]"]
    FAST_CHECK -->|"No"| NORMAL_LIST["plan.checklistNormal[]"]

    FAST_LIST --> RENDER
    NORMAL_LIST --> RENDER

    RENDER["renderTodayChecklist()<br/>Group by item.group<br/>Inject day-specific sub-text"]

    RENDER --> GROUPS["Checklist Groups"]
    subgraph GROUPS
        G1["🌅 MORNING<br/>tag-morning<br/>Includes: weight log"]
        G2["🍽️ EATING<br/>tag-food"]
        G3["🌙 EVENING<br/>tag-evening"]
        G4["💧 FAST<br/>tag-fast"]
        G5["🛏️ NIGHT<br/>tag-rules<br/>Sleep only"]
    end

    GROUPS --> LOAD["loadChecklist()<br/>Read SK.dayLogs[today].checks<br/>Apply done/undone CSS"]

    LOAD --> PROGRESS["updateProgress()<br/>done / visible items → %"]

    LOAD --> USER_TAP{"User taps item"}
    USER_TAP --> TOGGLE["toggle(el)<br/>Flip CSS class"]
    TOGGLE --> SAVE["saveDayLogField(today, {checks})<br/>Write to SK.dayLogs"]
    SAVE --> PROGRESS
    SAVE --> DISPATCH["dispatch('DAY_SAVED')"]
    DISPATCH --> CALENDAR["Calendar cell recolors"]
    DISPATCH --> PROJECTION["Projection recalculates"]

    USER_TAP -->|"RESET button"| RESET["resetToday()<br/>showConfirm → clear all"]
    RESET --> SAVE

    style RENDER fill:#c8f542,stroke:#000,color:#000
    style DISPATCH fill:#f5a623,stroke:#000,color:#000
```

---

## 7. Weight Tracking & Goal Bar

```mermaid
flowchart TD
    subgraph INPUT["Weight Input"]
        TODAY_LOG["TODAY tab<br/>logWeightFromToday()"]
        TRACK_LOG["TRACK tab<br/>logWeight()"]
        MODAL_LOG["Day Modal<br/>logModalWeight()"]
    end

    INPUT --> VALIDATE["Validate<br/>20–300 kg range"]
    VALIDATE --> STORE["Append to SK.weights[]<br/>{date, weight, ts}"]
    STORE --> SAVE_DAY["saveDayLogField(date, {weight})"]
    STORE --> DISPATCH["dispatch('WEIGHT_LOGGED')"]

    DISPATCH --> GOAL_BAR & PROJECTION & NOTES & DUR_BAR

    subgraph GOAL_BAR["updateGoalBar()"]
        GB1["Start weight = oldest log entry"]
        GB2["Current = getLatestWeight()"]
        GB3["Target = settings.targetKg"]
        GB4["% = (start - current) / (start - target) × 100"]
        GB1 --> GB4
        GB2 --> GB4
        GB3 --> GB4
    end

    subgraph DUR_BAR["updateDurationBar()"]
        DB1["Read SK.schedule"]
        DB2["Elapsed = today - startDate"]
        DB3["Show DAY X / TOTAL DAYS"]
    end

    subgraph NOTES["renderRecentNotes()"]
        N1["List recent day logs<br/>with weight, notes, compliance"]
    end

    style DISPATCH fill:#f5a623,stroke:#000,color:#000
    style GOAL_BAR fill:#1a1a2e,stroke:#c8f542,color:#e8e8e8
```

---

## 8. Weight Projection Algorithm

```mermaid
flowchart TD
    START["updateProjection()<br/>Needs ≥2 weight entries"] --> LATEST["Get latest weight + date"]

    LATEST --> OBS["SIGNAL 1: Observed Rate"]
    LATEST --> FORM["SIGNAL 2: Formula Rate"]
    LATEST --> COMP["COMPLIANCE MODIFIER"]

    subgraph OBS["Observed Rate"]
        O1["Last 7 weight entries"]
        O2["Oldest weight - Latest weight"]
        O3["÷ actual day span"]
        O4["= observedRate kg/day"]
        O1 --> O2 --> O3 --> O4
    end

    subgraph FORM["Formula Rate"]
        F1["For each of next 7 days:"]
        F2{"Is fast day?"}
        F2 -->|"Yes"| F3["deficit = tdee / 7700"]
        F2 -->|"No, past"| F4["deficit = (tdee - actualFoodCal) / 7700"]
        F2 -->|"No, future"| F5["deficit = (tdee - settingsCal) / 7700"]
        F3 & F4 & F5 --> F6["Sum all deficits / 7"]
        F6 --> F7["= formulaRate kg/day"]
        F1 --> F2
    end

    subgraph COMP["Compliance Score"]
        C1["Last 7 days avg:<br/>checklist % + calorie discipline"]
        C2{"Actual food > ceiling?"}
        C2 -->|"Yes"| C3["dayScore *= ceiling / actual"]
        C2 -->|"No"| C4["dayScore = 1.0"]
        C1 --> C2
        C3 & C4 --> C5["complianceScore = average"]
    end

    OBS --> BLEND
    FORM --> BLEND
    COMP --> BLEND

    subgraph BLEND["Blended Rate"]
        B1["observedWeight = min(0.75, entries / 10)"]
        B2["blendedRate = obs × obsWeight + form × (1 - obsWeight)"]
        B3["adjustedRate = blendedRate × complianceScore"]
        B1 --> B2 --> B3
    end

    BLEND --> OUTPUT

    subgraph OUTPUT["Projection Output"]
        P1["Projected Sunday weight<br/>= latest - (adjustedRate × daysToSunday)"]
        P2["Delta from today"]
        P3["Confidence band ±15%"]
        P4["Basis: data points, rate, fast days, compliance %"]
    end

    style START fill:#c8f542,stroke:#000,color:#000
    style BLEND fill:#f5a623,stroke:#000,color:#000
```

---

## 9. Goal Calculator (Plan-Aware)

```mermaid
flowchart TD
    INPUTS["User Inputs<br/>currentKg, targetKg, calories, tdee,<br/>exerciseBurn, risk, deadline/days"]

    INPUTS --> PLAN_MODE{"Plan Mode?<br/>(from selected plan)"}

    PLAN_MODE -->|"CUT<br/>(default/agro/cut)"| CUT_VALIDATE["Validate: target < current"]
    PLAN_MODE -->|"BULK"| BULK_VALIDATE["Validate: target > current"]
    PLAN_MODE -->|"MAINTENANCE"| MAINT_MODE["No weight change<br/>calcCals = TDEE<br/>Schedule for tracking only"]

    CUT_VALIDATE --> CUT_CALC["totalCalChange = abs(cur-tgt) × 7700"]
    BULK_VALIDATE --> BULK_CALC["totalCalChange = abs(cur-tgt) × 7700"]

    CUT_CALC --> CUT_MODE{"Which input?"}
    BULK_CALC --> BULK_MODE{"Which input?"}

    CUT_MODE -->|"Deadline given"| CUT_A
    CUT_MODE -->|"Calories given"| CUT_B

    subgraph CUT_A["CUT MODE A: Deadline → Calories"]
        CA1["weeklyDeficit = totalChange / days × 7"]
        CA2["Subtract exercise burn × 7"]
        CA3["Subtract fast day contribution<br/>fastDaysPerWeek × tdee"]
        CA4["calcCals = tdee - (dietDeficit / eatDaysPerWeek)"]
        CA1 --> CA2 --> CA3 --> CA4
    end

    subgraph CUT_B["CUT MODE B: Calories → Days"]
        CB1["dailyDeficit from eating + fasting + exercise"]
        CB2["calcDays = ceil(totalChange / dailyDeficit)"]
        CB1 --> CB2
    end

    BULK_MODE -->|"Deadline given"| BULK_A
    BULK_MODE -->|"Calories given"| BULK_B

    subgraph BULK_A["BULK MODE A: Deadline → Calories"]
        BA1["dailySurplus = totalChange / days"]
        BA2["calcCals = TDEE + dailySurplus"]
        BA1 --> BA2
    end

    subgraph BULK_B["BULK MODE B: Calories → Days"]
        BB1["dailySurplus = calories - TDEE"]
        BB2["calcDays = ceil(totalChange / dailySurplus)"]
        BB1 --> BB2
    end

    CUT_A & CUT_B --> CUT_RISK
    BULK_A & BULK_B --> BULK_RISK

    subgraph CUT_RISK["Cut Risk Assessment"]
        CR1{"Risk tolerance?"}
        CR1 -->|"Standard"| CR2["🔴 <800cal OR >1.5kg/wk<br/>🟠 800-1200cal OR 1.0-1.5kg/wk<br/>🟢 >1200cal AND <1.0kg/wk"]
        CR1 -->|"Aggressive"| CR3["🔴 Avg <300cal/day<br/>🟠 >2.5kg/wk<br/>🟢 Everything else"]
        CR1 -->|"Unrestricted"| CR4["🔴 calcCals < 0<br/>🟠 >3kg/wk<br/>🟢 Everything else"]
    end

    subgraph BULK_RISK["Bulk Risk Assessment"]
        BR1["🟠 >0.5 kg/wk gain (aggressive)"]
        BR2["🔴 >1.0 kg/wk gain (unrealistic — mostly fat)"]
        BR3["🟢 0.25–0.5 kg/wk (lean gains)"]
    end

    CUT_RISK & BULK_RISK & MAINT_MODE --> RESULT

    subgraph RESULT["Calculator Output"]
        RES1["calcWeeks, calcDays, calcCals"]
        RES2["calcRate kg/week"]
        RES3["calcEndDate"]
        RES4["Risk flag + color"]
        RES5["→ window._pendingSchedule"]
    end

    RESULT --> ACTIONS

    subgraph ACTIONS["User Actions"]
        ACT1["APPLY CALORIES<br/>Save to settings"]
        ACT2["VIEW NUTRITION<br/>Switch to tab"]
        ACT3["ADD TO SCHEDULE<br/>→ promptSchedule()"]
    end

    style INPUTS fill:#c8f542,stroke:#000,color:#000
    style PLAN_MODE fill:#f5a623,stroke:#000,color:#000
    style RESULT fill:#1a1a2e,stroke:#3ddc84,color:#e8e8e8
    style CUT_RISK fill:#ff4444,stroke:#000,color:#fff
    style BULK_RISK fill:#f7dc6f,stroke:#000,color:#000
    style MAINT_MODE fill:#82e0aa,stroke:#000,color:#000
```

---

## 10. Schedule System

```mermaid
flowchart TD
    CALC["Goal Calculator<br/>window._pendingSchedule"] -->|"ADD TO SCHEDULE"| PROMPT["promptSchedule()<br/>showConfirm()"]

    PROMPT -->|"User confirms"| APPLY["applySchedule()"]

    APPLY --> SAVE_SETTINGS["Save settings<br/>(plan, weights, calories)"]
    APPLY --> BUILD_DAYS["Build days[] array<br/>startDate → +totalDays"]
    APPLY --> STORE["Store in SK.schedule<br/>{days, startDate, totalDays,<br/>planName, startWeight}"]
    APPLY --> AUTO_FAST["autoSetPlanFastDays()<br/>Mark fast days from plan.fastDaysDow"]

    SAVE_SETTINGS & BUILD_DAYS & STORE & AUTO_FAST --> DISPATCH["dispatch('SCHEDULE_SET')<br/>dispatch('PLAN_CHANGED')"]

    DISPATCH --> CAL_VIZ["Calendar: white border<br/>on schedule days"]
    DISPATCH --> DUR_BAR["Duration bar<br/>DAY X / TOTAL"]

    subgraph MANAGE["Manage Schedule"]
        ADJ["ADJUST<br/>Recalculate remaining days"]
        END_T["END TODAY<br/>Trim days[] to today"]
        REM["REMOVE<br/>Delete schedule entirely"]
    end

    DUR_BAR -->|"manage button"| MANAGE

    subgraph ADJ_ALGO["Adjust Algorithm"]
        AD1["actualRate = kg lost / elapsed days"]
        AD2["formulaRate from new cal target<br/>+ 60% target / 40% actual blend"]
        AD3["obsWeight = min(0.7, elapsed/60)"]
        AD4["blendedRate = actual×obsW + formula×(1-obsW)"]
        AD5["remainDays = ceil(remainKg / blendedRate)"]
        AD6["Rebuild days[]: keep past + add future"]
        AD1 --> AD4
        AD2 --> AD4
        AD3 --> AD4
        AD4 --> AD5 --> AD6
    end

    ADJ --> ADJ_ALGO
    ADJ_ALGO --> DISPATCH2["dispatch('SCHEDULE_ADJUSTED')"]

    END_T --> DISPATCH3["dispatch('SCHEDULE_ENDED')"]
    REM --> DISPATCH4["dispatch('SCHEDULE_REMOVED')"]

    style APPLY fill:#c8f542,stroke:#000,color:#000
    style MANAGE fill:#1a1a2e,stroke:#f5a623,color:#e8e8e8
```

---

## 11. Macro Computation Engine

```mermaid
flowchart TD
    CALL["computeMacros(dateStr)"] --> FAST{"isFastDay?"}

    FAST -->|"Yes"| ZERO["Return zeros<br/>signal = 'fast'"]

    FAST -->|"No"| CONTEXT["Detect Context Signal"]

    subgraph CONTEXT["Signal Priority (first match wins)"]
        direction TB
        S1["1. REST DAY<br/>dow===0 or 'rest' in eveningSub"]
        S2["2. PRE-FAST<br/>tomorrow is a fast day"]
        S3["3. STALL<br/>observed rate < 50% formula rate"]
        S4["4. SATIETY<br/>avg intake > ceiling for 4+ days"]
        S5["5. BASE<br/>default fallback"]
        S1 --> S2 --> S3 --> S4 --> S5
    end

    CONTEXT --> SPLIT["Get macro split from plan.macroSplit<br/>or fallback defaults"]

    subgraph SPLIT_TABLE["Macro Splits (Protein / Carbs / Fat)"]
        SP1["base: 50/30/20"]
        SP2["rest: 58/22/20"]
        SP3["preFast: 46/34/20"]
        SP4["stall: 56/24/20"]
        SP5["satiety: 58/22/20"]
    end

    SPLIT --> SPLIT_TABLE
    SPLIT_TABLE --> CALC_G["Calculate grams<br/>g = (cal × pct / 100) / calsPerGram"]

    CALC_G --> FLOORS{"Biological floors met?"}

    subgraph FLOOR_CHECK["Floors"]
        FL1["Protein ≥ currentKg × pfm<br/>(default 1.3 g/kg)"]
        FL2["Fat ≥ 20g"]
    end

    FLOORS -->|"Yes"| OUTPUT
    FLOORS -->|"No"| ENFORCE["Enforce floors<br/>Remaining cal → carbs"]
    ENFORCE --> OUTPUT

    subgraph OUTPUT["Returns"]
        OUT1["cal, proteinG, carbsG, fatG"]
        OUT2["proteinPct, carbsPct, fatPct"]
        OUT3["signal (base/rest/preFast/stall/satiety)"]
        OUT4["warnings[], isFeasible"]
    end

    style CALL fill:#c8f542,stroke:#000,color:#000
    style CONTEXT fill:#f5a623,stroke:#000,color:#000
    style FLOOR_CHECK fill:#ff4444,stroke:#000,color:#fff
```

---

## 12. Food Logging & Library

```mermaid
flowchart TD
    BUTTON["Log Food button<br/>(TODAY or Day Modal)"] --> MODAL["openFoodModal(dateStr)"]

    MODAL --> SEARCH["Name input<br/>onFoodModalNameInput()"]
    SEARCH --> AUTO["Autocomplete<br/>Search food library<br/>Top 5 fuzzy matches"]
    AUTO -->|"tap suggestion"| FILL["Populate fields<br/>cal, protein, carbs, fat"]

    FILL --> ADD["addFoodFromModal2()<br/>Validate + save"]
    SEARCH -->|"manual entry"| ADD

    ADD --> STORE_FL["Append to SK.foodLog[dateStr]<br/>{id, name, calories, protein,<br/>carbs, fat, notes, ts}"]
    ADD --> STORE_LIB["updateFoodLibrary(name, macros)<br/>Increment useCount in SK.foodLibrary"]
    ADD --> DISPATCH["dispatch('FOOD_LOGGED')"]

    DISPATCH --> CAL_STRIP["updateTodayCalStrip()<br/>Show eaten / ceiling"]
    DISPATCH --> PROJECTION["updateProjection()<br/>Actual cal → formula rate"]
    DISPATCH --> RADAR["renderRadar()<br/>Calorie adherence axis"]
    DISPATCH --> MACROS_UI["renderNutrition()<br/>Actual vs target macros"]

    MODAL --> ENTRIES["renderFoodModalEntries()<br/>List today's foods"]
    ENTRIES -->|"swipe/tap delete"| REMOVE["removeFoodEntry()"]
    REMOVE --> DISPATCH

    style MODAL fill:#c8f542,stroke:#000,color:#000
    style DISPATCH fill:#f5a623,stroke:#000,color:#000
```

---

## 13. Performance Radar Chart

```mermaid
flowchart TD
    WINDOW["7D or 30D toggle<br/>setRadarWindow()"] --> COMPUTE["computeRadarMetrics(days)"]

    subgraph COMPUTE["7 Performance Axes"]
        AX1["CHECKLIST<br/>Avg % completion"]
        AX2["CALORIES<br/>% eating days ≤ ceiling"]
        AX3["FASTING<br/>% scheduled fasts observed"]
        AX4["WATER<br/>Avg liters / 3L target"]
        AX5["WEIGHT TREND<br/>≥0.15kg/day=100%, 0=50%"]
        AX6["GOAL<br/>(start-current)/(start-target)"]
        AX7["CONSISTENCY<br/>% days with any logged data"]
    end

    COMPUTE --> SVG["renderRadar()<br/>SVG spider chart"]

    subgraph SVG["Radar Visualization"]
        R1["4 concentric guide rings<br/>25% / 50% / 75% / 100%<br/>stroke:#444, width:0.8"]
        R2["7 axes radiating from center<br/>stroke:#444, width:0.7"]
        R3["Filled polygon = performance shape<br/>stroke-width:2"]
        R4["Labels font-size:10<br/>Values font-size:9.5"]
    end

    style WINDOW fill:#c8f542,stroke:#000,color:#000
    style COMPUTE fill:#1a1a2e,stroke:#4ecdc4,color:#e8e8e8
```

---

## 14. Calendar & Day Modal

```mermaid
flowchart TD
    RENDER["renderCalendar()<br/>Build monthly grid"] --> CELLS["Color each cell"]

    subgraph CELLS["Cell Classification"]
        CL1["🟢 .cal-done<br/>All checklist items ticked"]
        CL2["🟣 .cal-fast<br/>Water fast day"]
        CL3["🟠 .cal-partial<br/>Some items ticked"]
        CL4["🔴 .cal-missed<br/>No items / missing log"]
        CL5["⬜ .plan-day<br/>White border = in schedule"]
    end

    CELLS --> STATS["Month Stats<br/>4 summary boxes"]

    CELLS -->|"tap cell"| DAY_MODAL["openDayModal(dateStr)"]

    subgraph DAY_MODAL["Day Modal"]
        DM1["Checklist toggles<br/>(for past days)"]
        DM2["Weight input + log"]
        DM3["Water intake (L)"]
        DM4["Energy level<br/>Good / Normal / Low"]
        DM5["Notes textarea"]
        DM6["Fast day toggle"]
        DM7["Food log display<br/>+ add food button"]
    end

    DM1 -->|"save"| DISPATCH1["dispatch('DAY_SAVED')"]
    DM2 -->|"log"| DISPATCH2["dispatch('WEIGHT_LOGGED')"]
    DM6 -->|"toggle"| DISPATCH3["dispatch('FAST_DAY_TOGGLED')"]

    style RENDER fill:#7b68ee,stroke:#000,color:#000
    style DAY_MODAL fill:#1a1a2e,stroke:#f5a623,color:#e8e8e8
```

---

## 15. Backup & Restore

```mermaid
flowchart LR
    subgraph BACKUP["backupData()"]
        B1["Read all SK.* keys"]
        B2["Package as JSON<br/>{version:'ph_v1', data:{}}"]
        B3["Download as<br/>protocol-health-backup-YYYY-MM-DD.json"]
    end

    subgraph RESTORE["restoreData()"]
        R1["Read JSON file"]
        R2["Validate 'ph_' prefix"]
        R3["showConfirm with summary"]
        R4["Write all keys back"]
        R5["Run init() to refresh"]
    end

    subgraph EXPORT["Text Export"]
        E1["Select date range"]
        E2["Generate plain text<br/>weights, compliance, notes"]
        E3["Copy to clipboard"]
    end

    STORAGE["localStorage<br/>All SK.* keys"] --> BACKUP
    RESTORE --> STORAGE

    style BACKUP fill:#3ddc84,stroke:#000,color:#000
    style RESTORE fill:#f5a623,stroke:#000,color:#000
    style EXPORT fill:#4ecdc4,stroke:#000,color:#000
```

---

## 16. Service Worker Update Flow

```mermaid
sequenceDiagram
    participant U as User
    participant APP as app.html
    participant SW as sw.js
    participant GH as GitHub Pages
    participant CACHE as Browser Cache

    U->>APP: Open PWA
    APP->>SW: Register / check update
    SW->>GH: Fetch sw.js (network)
    GH-->>SW: New CACHE_NAME detected

    Note over SW: Old cache ≠ new CACHE_NAME

    SW->>GH: Download all files
    GH-->>CACHE: Store under new CACHE_NAME
    SW->>CACHE: Delete old cache
    SW-->>APP: 'controllerchange' event

    APP->>U: Show "New version available" banner
    U->>APP: Tap RELOAD
    APP->>APP: location.reload()
    APP->>CACHE: Serve from new cache

    Note over APP: APP_VERSION check runs
    APP->>U: Show update banner<br/>(if minor/major bump)
```

---

## 17. Data Flow — Everything Connected

```mermaid
flowchart TD
    subgraph USER_ACTIONS["User Actions"]
        UA1["Tick checklist item"]
        UA2["Log weight"]
        UA3["Log food"]
        UA4["Toggle fast day"]
        UA5["Switch plan"]
        UA6["Run goal calculator"]
        UA7["Create schedule"]
    end

    subgraph STORAGE_LAYER["Storage Layer (localStorage)"]
        S1["SK.dayLogs"]
        S2["SK.weights"]
        S3["SK.foodLog"]
        S4["SK.fastDays"]
        S5["SK.settings"]
        S6["SK.schedule"]
    end

    subgraph DISPATCH_HUB["Dispatch Hub"]
        D["dispatch(EVENT)"]
    end

    subgraph CALCULATION_ENGINES["Calculation Engines"]
        CE1["updateGoalBar()<br/>% to target weight"]
        CE2["updateProjection()<br/>Sunday weight forecast"]
        CE3["computeMacros()<br/>Context-aware targets"]
        CE4["calcDuration()<br/>Goal calculator"]
        CE5["computeRadarMetrics()<br/>7-axis performance"]
        CE6["updateProgress()<br/>Checklist %"]
    end

    subgraph UI_OUTPUT["UI Output"]
        UI1["TODAY: Checklist + Progress"]
        UI2["MONTHS: Calendar grid"]
        UI3["WORKOUTS: Exercise cards"]
        UI4["NUTRITION: Macro targets"]
        UI5["RULES: Protocol rules"]
        UI6["TRACK: Charts + History"]
    end

    UA1 --> S1
    UA2 --> S2
    UA3 --> S3
    UA4 --> S4
    UA5 --> S5
    UA6 --> S5
    UA7 --> S6

    S1 & S2 & S3 & S4 & S5 & S6 --> D

    D --> CE1 & CE2 & CE3 & CE4 & CE5 & CE6

    CE1 --> UI6
    CE2 --> UI6
    CE3 --> UI4
    CE4 --> UI6
    CE5 --> UI6
    CE6 --> UI1

    S1 --> UI1 & UI2
    S2 --> UI6
    S3 --> UI4 & UI6
    S4 --> UI1 & UI2
    S5 --> UI1 & UI3 & UI4 & UI5
    S6 --> UI2 & UI6

    style DISPATCH_HUB fill:#c8f542,stroke:#000,color:#000
    style CALCULATION_ENGINES fill:#1a1a2e,stroke:#f5a623,color:#e8e8e8
    style STORAGE_LAYER fill:#111111,stroke:#7b68ee,color:#e8e8e8
    style USER_ACTIONS fill:#1a1a2e,stroke:#3ddc84,color:#e8e8e8
    style UI_OUTPUT fill:#1a1a2e,stroke:#4ecdc4,color:#e8e8e8
```

---

## 18. Custom UI Systems

```mermaid
flowchart LR
    subgraph DIALOGS["Modal Dialogs"]
        D1["showConfirm(title, msg, onYes, opts)<br/>Custom confirm with danger/checkbox options"]
        D2["showAlert(msg)<br/>Simple notification modal"]
        D3["Never use native confirm() / alert()<br/>Blocked in GitHub Pages iframes"]
    end

    subgraph DROPDOWNS["Custom Dropdowns"]
        DD1["toggleCustomSelect(id)<br/>Open/close dropdown"]
        DD2["selectCustomOption(customId, nativeId, el)<br/>Select + sync hidden native select"]
        DD3["syncCustomSelect(customId, nativeId)<br/>Update visual from native value"]
        DD4["Native select elements cannot be<br/>styled on Android Chrome"]
    end

    subgraph DATES["Date Utilities"]
        DT1["dateToStr(date) → 'YYYY-MM-DD'<br/>Local time, NOT UTC"]
        DT2["strToDate(str) → Date object"]
        DT3["todayStr() → today's date string"]
        DT4["Never use toISOString()<br/>Causes off-by-one day bugs"]
    end

    style DIALOGS fill:#1a1a2e,stroke:#ff4444,color:#e8e8e8
    style DROPDOWNS fill:#1a1a2e,stroke:#f5a623,color:#e8e8e8
    style DATES fill:#1a1a2e,stroke:#c8f542,color:#e8e8e8
```
