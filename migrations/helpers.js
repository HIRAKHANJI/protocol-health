// migrations/helpers.js — defensive storage helpers for the migration layer

export function gsSafe(key, defaultValue, validator) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      console.warn(`[migrations] Invalid data at ${key}, using default`);
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.warn(`[migrations] Could not read ${key}:`, e);
    return defaultValue;
  }
}

export function ssSafe(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[migrations] Could not write ${key}:`, e);
    return false;
  }
}

export function downloadJson(filename, data) {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error('[migrations] Auto-backup download failed:', e);
    return false;
  }
}
