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
  }
];
