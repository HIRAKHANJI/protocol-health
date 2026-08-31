// plans/index.js — assembles the PLANS object from individual plan modules
// and re-exports EXERCISE_PROGRESSIONS. Loaded via <script type="module"> in app.html.
//
// The key `default` is HISTORICAL — existing users have `plan: 'default'` in their
// settings (localStorage). That key maps to the LITE PROTOCOL. Do NOT rename.

import { lite } from './lite.js';
import { agro } from './agro.js';
import { cut } from './cut.js';
import { bulk } from './bulk.js';
import { maintenance } from './maintenance.js';
import { cycle } from './cycle.js';
import { EXERCISE_PROGRESSIONS } from './exercise-progressions.js';

export const PLANS = {
  default: lite,   // historical key — maps LITE PROTOCOL to stored 'default'
  agro,
  cut,
  bulk,
  maintenance,
  cycle            // CYCLE — the seasons recomp plan (v8.10.6)
};

export { EXERCISE_PROGRESSIONS };
