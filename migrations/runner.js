// migrations/runner.js — executes migrations in registry order

import { MIGRATIONS } from './registry.js';
import { gsSafe, ssSafe, downloadJson } from './helpers.js';

const SCHEMA_KEY = 'ph_sch_v1';

// v7.10.1: local "YYYY-MM-DD" formatter for the schema record's date fields.
// Avoids `new Date().toISOString().slice(0,10)`, which returns the UTC date —
// for users west of UTC after local-evening migration runs, that string can
// be tomorrow's date in their timezone, corrupting establishedAt /
// exportedAt. Self-contained so we don't depend on the inline classic
// script's `dateToStr` having loaded first.
function _localDateStr(d) {
  d = d || new Date();
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return yr + '-' + mo + '-' + dy;
}

function getSchemaRecord() { return gsSafe(SCHEMA_KEY, null); }
function writeSchemaRecord(rec) { return ssSafe(SCHEMA_KEY, rec); }

function hasAnyAppData() {
  const ignore = [SCHEMA_KEY, 'ph_sv_v1', 'ph_sw_v1', 'ph_bts_v1'];
  return Object.keys(localStorage).some(k => k.startsWith('ph_') && !ignore.includes(k));
}

function readAllAppData(skKeys) {
  const out = {};
  for (const key of skKeys) {
    const raw = localStorage.getItem(key);
    if (raw === null) continue;
    try { out[key] = JSON.parse(raw); }
    catch { console.warn(`[migrations] Unreadable: ${key}`); }
  }
  return out;
}

function writeAllAppData(dataMap) {
  const failures = [];
  for (const [key, value] of Object.entries(dataMap)) {
    if (!ssSafe(key, value)) failures.push(key);
  }
  return failures;
}

export async function runMigrations(skKeys) {
  let record = getSchemaRecord();

  if (!record) {
    record = {
      schemaVersion: 1,
      lastMigration: null,
      migrationsApplied: [],
      establishedAt: _localDateStr(),
      establishedFrom: hasAnyAppData() ? 'existing-user' : 'fresh-install'
    };
    writeSchemaRecord(record);
    console.log(`[migrations] Schema record established: v${record.schemaVersion} (${record.establishedFrom})`);
  }

  const toRun = MIGRATIONS
    .filter(m => m.from >= record.schemaVersion)
    .sort((a, b) => a.from - b.from);

  if (toRun.length === 0) {
    return { ok: true, ran: 0, currentVersion: record.schemaVersion };
  }

  console.log(`[migrations] Running ${toRun.length} migration(s) from v${record.schemaVersion}`);

  for (const m of toRun) {
    if (m.from !== record.schemaVersion) {
      console.error(`[migrations] Version gap: expected from=${record.schemaVersion}, got ${m.from}`);
      return { ok: false, error: 'version-mismatch', migration: m };
    }

    if (m.requiresBackup) {
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith('ph_'));
      const snapshot = {};
      for (const k of allKeys) {
        try { snapshot[k] = JSON.parse(localStorage.getItem(k)); } catch {}
      }
      const filename = `auto-backup-pre-migration-v${m.to}-${Date.now()}.json`;
      const downloaded = downloadJson(filename, {
        version: 'ph_v1',
        schemaVersion: m.from,
        appVersion: window.APP_VERSION || 'unknown',
        exportedAt: _localDateStr(),
        autoBackup: true,
        migration: { from: m.from, to: m.to, description: m.description },
        data: snapshot
      });
      if (!downloaded) {
        console.error('[migrations] Auto-backup failed. Aborting migration.');
        return { ok: false, error: 'backup-failed', migration: m };
      }
      console.log(`[migrations] Auto-backup downloaded: ${filename}`);
    }

    const beforeMap = readAllAppData(skKeys);
    let afterMap;
    try { afterMap = m.run(structuredClone(beforeMap)); }
    catch (e) {
      console.error(`[migrations] v${m.from}→v${m.to} threw:`, e);
      return { ok: false, error: 'run-threw', migration: m, thrown: e };
    }

    if (m.verify) {
      try { if (!m.verify(afterMap)) return { ok: false, error: 'verify-failed', migration: m }; }
      catch (e) { return { ok: false, error: 'verify-threw', migration: m, thrown: e }; }
    }

    const failures = writeAllAppData(afterMap);
    if (failures.length > 0) {
      return { ok: false, error: 'write-failed', migration: m, failures };
    }

    record = {
      ...record,
      schemaVersion: m.to,
      lastMigration: new Date().toISOString(),
      migrationsApplied: [
        ...record.migrationsApplied,
        { from: m.from, to: m.to, description: m.description, at: new Date().toISOString() }
      ]
    };
    writeSchemaRecord(record);
    console.log(`[migrations] Applied v${m.from}→v${m.to}: ${m.description}`);
  }

  return { ok: true, ran: toRun.length, currentVersion: record.schemaVersion };
}

export function getSchemaVersion() {
  const r = getSchemaRecord();
  return r ? r.schemaVersion : null;
}

export function getMigrationLog() {
  return getSchemaRecord();
}
