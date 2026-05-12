// migrations/registry.js — ordered list of schema migrations

// Migration object shape:
// {
//   from: number,                  // migrate FROM this schemaVersion
//   to: number,                    // migrate TO this schemaVersion
//   description: string,           // human-readable short description
//   requiresBackup: boolean,       // if true, force backup download before running
//   run: (dataMap) => dataMap,     // pure function taking { [key]: value }, returning new map
//   verify: (dataMap) => boolean,  // optional, validates migration result
//   reverse: (dataMap) => dataMap  // optional, inverse operation for rollback
// }
//
// dataMap is an object keyed by storage key names (e.g. 'ph_dl_v1') mapped to
// deserialized values. `run` returns a new dataMap; keys absent from the return
// are left unchanged in storage.

export const MIGRATIONS = [
  {
    from: 1,
    to: 2,
    description: 'Register fast-window storage key (ph_fw_v1). No data transformation — purely additive.',
    requiresBackup: false,
    run: (data) => {
      // No-op. SK.fastWindows is added in app.html. New key is empty by default.
      // All readers continue to fall through to existing fastDays entries
      // (interpreted as 24-hour fasts) until Phase C adds the start/stop UX.
      return data;
    },
    verify: () => true,
    reverse: (data) => data
  },
  {
    from: 2,
    to: 3,
    description: 'Register backup-history storage key (ph_bh_v1). No data transformation — purely additive.',
    requiresBackup: false,
    run: (data) => {
      // No-op. SK.backupHistory is added in app.html. The key is empty by
      // default; backupData() pushes entries on each successful download
      // and trims to the last 5. Phase 11 (v7.7.0).
      return data;
    },
    verify: () => true,
    reverse: (data) => data
  },
  {
    from: 3,
    to: 4,
    description: 'Multi-day fast sessions: backfill SK.fastSessions from existing fastWindows + fastDays. Phase 12 (v7.8.0).',
    requiresBackup: true,
    run: (data) => {
      const fwKey = 'ph_fw_v1';
      const fdKey = 'ph_fd_v1';
      const fsKey = 'ph_fs_v1';
      const fw = data[fwKey] || {};
      const fd = data[fdKey] || {};
      const sessions = [];
      const seenSig = new Set();
      const baseTs = Date.now();

      // Step A: convert each existing fastWindows entry to a session.
      // Dedupe by (date|start|end) signature in case Phase C ever
      // double-wrote a window across dates.
      let serial = 0;
      const fwDates = Object.keys(fw).sort();
      for (const date of fwDates) {
        const arr = Array.isArray(fw[date]) ? fw[date] : [];
        for (const win of arr) {
          if (!win || typeof win !== 'object') continue;
          const sig = date + '|' + (win.start || '') + '|' + (win.end || '');
          if (seenSig.has(sig)) continue;
          seenSig.add(sig);
          sessions.push({
            id: 'fs_mig_' + baseTs + '_' + (serial++),
            start: win.start || (date + 'T00:00:00.000Z'),
            end:   win.end   || (date + 'T23:59:59.999Z'),
            broken: !!win.broken,
            brokenBy: Array.isArray(win.brokenBy) ? win.brokenBy.slice() : [],
            dates: [date],
            legacy: false
          });
        }
      }

      // Step B: for each fastDays entry without a session covering it,
      // create a 24-hour legacy session. Consecutive fast days are NOT
      // auto-merged — without timestamp data we can't infer continuity.
      // User can manually merge later via the day-modal session editor.
      const coveredDates = new Set();
      sessions.forEach(s => (s.dates || []).forEach(d => coveredDates.add(d)));
      const fdDates = Object.keys(fd).sort();
      for (const date of fdDates) {
        if (!fd[date]) continue;
        if (coveredDates.has(date)) continue;
        sessions.push({
          id: 'fs_legacy_' + date.replace(/-/g, ''),
          start: date + 'T00:00:00.000Z',
          end:   date + 'T23:59:59.999Z',
          broken: false,
          brokenBy: [],
          dates: [date],
          legacy: true
        });
        coveredDates.add(date);
      }

      data[fsKey] = sessions;
      return data;
    },
    verify: (data) => {
      const fd = data['ph_fd_v1'] || {};
      const sessions = data['ph_fs_v1'] || [];
      // Every fastDays entry must be covered by at least one session
      const coveredDates = new Set();
      sessions.forEach(s => (s.dates || []).forEach(d => coveredDates.add(d)));
      for (const date of Object.keys(fd)) {
        if (!fd[date]) continue;
        if (!coveredDates.has(date)) return false;
      }
      // Every session must have a non-empty dates[] array
      for (const s of sessions) {
        if (!Array.isArray(s.dates) || s.dates.length === 0) return false;
      }
      return true;
    },
    reverse: (data) => {
      // Reverse: drop fastSessions. fastWindows + fastDays were never
      // touched by run() so they're unchanged in storage.
      delete data['ph_fs_v1'];
      return data;
    }
  },
  {
    from: 4,
    to: 5,
    description: 'Register activity-history storage key (ph_ah_v1). No data transformation — silent observation foundation. Phase 13 (v7.8.1).',
    requiresBackup: false,
    run: (data) => {
      // No-op. SK.activityHistory is added in app.html. The key is empty by
      // default; weeklyCalibration() pushes a snapshot per evaluation cycle
      // (capped at 90 entries). Future phases may surface this data via UI
      // to power smarter calibration / trend analysis.
      return data;
    },
    verify: () => true,
    reverse: (data) => {
      delete data['ph_ah_v1'];
      return data;
    }
  },
  {
    from: 5,
    to: 6,
    description: 'Register fast/light day manual-unset storage keys (ph_fdu_v1, ph_ldu_v1). No data transformation — purely additive. v8.0.0 (H3 fix): autoSetPlanFastDays / autoSetPlanLightDays now consult these to skip dates the user explicitly unset, so schedule extension preserves manual overrides.',
    requiresBackup: false,
    run: (data) => {
      // No-op. SK.fastDayUnsets and SK.lightDayUnsets are added in app.html.
      // Both keys default to empty {} on first read. Going forward,
      // toggleFastDay and toggleLightDay populate them as the user explicitly
      // unsets dates. autoSetPlanFastDays / LightDays read them and skip those
      // dates on schedule extension.
      return data;
    },
    verify: () => true,
    reverse: (data) => {
      delete data['ph_fdu_v1'];
      delete data['ph_ldu_v1'];
      return data;
    }
  },
  {
    from: 6,
    to: 7,
    description: 'v8.1.0: clean up fast-day over-marks caused by the v7.10.2 reconcile bug. Walks SK.fastDays; removes any date that satisfies ALL of: (a) covered by some session whose hours on that date are < 16, (b) NOT in the active plan\'s fastDaysDow pattern, (c) NOT in SK.fastDayUnsets. Dates without any covering session (= pure manual intent) are preserved. Dates matching plan auto-set are preserved. Bleed-in/out dates from multi-day fasts (e.g. Tuesday morning ending a Sun→Tue fast) get correctly demoted back to eating days. Auto-backup runs first.',
    requiresBackup: true,
    run: (data) => {
      const fdKey = 'ph_fd_v1';
      const fsKey = 'ph_fs_v1';
      const fduKey = 'ph_fdu_v1';
      const stKey = 'ph_st_v1';
      const fd = data[fdKey] || {};
      const sessions = data[fsKey] || [];
      const fdu = data[fduKey] || {};
      const settings = data[stKey] || {};

      // Inline _sessionHoursOnDate (migrations module is sandboxed from
      // fast-window.js; replicate the helper here so the migration is
      // self-contained and survives module-load timing).
      const sessionHoursOnDate = (session, dateStr) => {
        if (!session || !session.start) return 0;
        // Build local-midnight Date from YYYY-MM-DD without going through
        // strToDate (helpers module doesn't import it). Date constructor
        // with year/month/day yields local midnight.
        const [y, m, day] = dateStr.split('-').map(Number);
        const dayStart = new Date(y, m - 1, day, 0, 0, 0, 0);
        const dayEnd = new Date(y, m - 1, day + 1, 0, 0, 0, 0);
        const sessionStart = new Date(session.start).getTime();
        const sessionEnd = session.end ? new Date(session.end).getTime() : Date.now();
        const start = Math.max(sessionStart, dayStart.getTime());
        const end = Math.min(sessionEnd, dayEnd.getTime());
        return end > start ? (end - start) / 3600000 : 0;
      };

      // Build the active plan's auto-set day-of-week pattern.
      // PLANS is on window after the plans module loads. Migration runs
      // EARLY in init, before plan modules necessarily evaluate, so we
      // must derive fastDaysDow from a known-safe source. Fortunately,
      // the active plan key is stored in settings.plan; the dow arrays
      // are hardcoded per-plan in the plan files but unavailable here.
      //
      // Fallback: use the most common pattern [0, 3, 6] (Sun/Wed/Sat) if
      // settings.plan is 'agro' or 'lite' (both fast plans use this).
      // CUT/BULK/MAINT use fastDaysPerWeek=0 so the dow array is empty.
      const planKey = settings.plan || 'default';
      const FAST_DOW_BY_PLAN = {
        default: [0, 3, 6], // LITE: Sun/Wed/Sat
        agro:    [0, 3, 6], // AGRO: Sun/Wed/Sat
        cut:     [],
        bulk:    [],
        maintenance: []
      };
      const fastDow = FAST_DOW_BY_PLAN[planKey] || [];

      // Build a quick lookup: any session covering each date in fastDays?
      const sessionsByDate = {};
      for (const s of sessions) {
        if (!s || !Array.isArray(s.dates)) continue;
        for (const d of s.dates) {
          if (!sessionsByDate[d]) sessionsByDate[d] = [];
          sessionsByDate[d].push(s);
        }
      }

      const removedDates = [];
      for (const dateStr of Object.keys(fd)) {
        if (!fd[dateStr]) continue;
        // Pass 1: if the user explicitly unset this date via the day modal
        // (fdu has it) but the buggy reconcile re-added it to fd, the
        // user's most recent explicit intent is "off". Remove the
        // contradictory fd entry. (toggleFastDay normally clears fdu
        // when the user toggles back ON, so a date present in fdu means
        // the user has NOT re-toggled it on. We respect that.)
        if (fdu[dateStr]) {
          delete fd[dateStr];
          removedDates.push(dateStr + ' [unset-preserved]');
          continue;
        }
        // Pass 2: skip if matches the active plan's auto-set pattern.
        // Even if the session contribution is < 16h, the date is on a
        // plan-scheduled fast day-of-week, so leave it alone.
        const [y, m, day] = dateStr.split('-').map(Number);
        const dow = new Date(y, m - 1, day).getDay();
        if (fastDow.includes(dow)) continue;
        // Pass 3: skip if no covering session — pure manual intent we
        // don't have a record of explicitly. Leave it alone.
        const covering = sessionsByDate[dateStr] || [];
        if (covering.length === 0) continue;
        // Pass 4: skip if any covering session has ≥ 16h on this date —
        // legitimate full-day fast contribution, not a bleed.
        const maxHours = Math.max(0, ...covering.map(s => sessionHoursOnDate(s, dateStr)));
        if (maxHours >= 16) continue;
        // All passes failed safety checks → this is a bleed over-mark.
        delete fd[dateStr];
        removedDates.push(dateStr + ' [bleed-' + maxHours.toFixed(1) + 'h]');
      }

      data[fdKey] = fd;
      // Stash diagnostic into the schema record so the user can see what
      // got cleaned (UPDATE_LOG / migration log surface this).
      console.log('[migration v6→v7] removed ' + removedDates.length + ' bleed over-marks: ' + (removedDates.join(', ') || '(none)'));
      return data;
    },
    verify: (data) => {
      // Invariant: after migration, no date in SK.fastDays should be a
      // bleed-only auto-add. Re-check the four conditions; if any date
      // still satisfies "would-be-removed", verification fails.
      const fd = data['ph_fd_v1'] || {};
      const sessions = data['ph_fs_v1'] || [];
      const fdu = data['ph_fdu_v1'] || {};
      const settings = data['ph_st_v1'] || {};
      const FAST_DOW_BY_PLAN = {
        default: [0, 3, 6], agro: [0, 3, 6],
        cut: [], bulk: [], maintenance: []
      };
      const fastDow = FAST_DOW_BY_PLAN[settings.plan || 'default'] || [];
      const sessionsByDate = {};
      for (const s of sessions) {
        if (!s || !Array.isArray(s.dates)) continue;
        for (const d of s.dates) {
          if (!sessionsByDate[d]) sessionsByDate[d] = [];
          sessionsByDate[d].push(s);
        }
      }
      for (const dateStr of Object.keys(fd)) {
        if (!fd[dateStr]) continue;
        // Invariant 1: no date should be in BOTH fd and fdu
        // (the user's most recent explicit intent must hold).
        if (fdu[dateStr]) {
          console.error('[migration v6→v7 verify] fd/fdu contradiction not cleaned: ' + dateStr);
          return false;
        }
        const [y, m, day] = dateStr.split('-').map(Number);
        const dow = new Date(y, m - 1, day).getDay();
        if (fastDow.includes(dow)) continue;
        const covering = sessionsByDate[dateStr] || [];
        if (covering.length === 0) continue;
        const sessHrs = (session) => {
          if (!session || !session.start) return 0;
          const dayStart = new Date(y, m - 1, day, 0, 0, 0, 0).getTime();
          const dayEnd = new Date(y, m - 1, day + 1, 0, 0, 0, 0).getTime();
          const s0 = new Date(session.start).getTime();
          const s1 = session.end ? new Date(session.end).getTime() : Date.now();
          const a = Math.max(s0, dayStart);
          const b = Math.min(s1, dayEnd);
          return b > a ? (b - a) / 3600000 : 0;
        };
        const maxHours = Math.max(0, ...covering.map(sessHrs));
        if (maxHours < 16) {
          // Invariant 2: no bleed-only over-marks (session < 16h, not in plan, not manual)
          console.error('[migration v6→v7 verify] bleed over-mark not cleaned: ' + dateStr);
          return false;
        }
      }
      return true;
    },
    reverse: (data) => {
      // Best-effort rollback: re-apply the OLD v7.10.2 reconcile rule
      // (any date in any session.dates[] gets marked). Won't perfectly
      // restore the pre-migration state because we don't know which
      // dates were already there manually vs. which got auto-added,
      // but it restores the over-marking behavior conservatively.
      const fdKey = 'ph_fd_v1';
      const fsKey = 'ph_fs_v1';
      const fd = data[fdKey] || {};
      const sessions = data[fsKey] || [];
      for (const s of sessions) {
        if (!s || !Array.isArray(s.dates)) continue;
        for (const d of s.dates) {
          fd[d] = true;
        }
      }
      data[fdKey] = fd;
      return data;
    }
  }
];
