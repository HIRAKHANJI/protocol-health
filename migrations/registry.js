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
  // No migrations registered at v5.1.0. Framework ships empty.
];
