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
  }
];
