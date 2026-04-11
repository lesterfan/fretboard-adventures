import { ALL_MODES, ModeName } from "./library/Library";

const STORAGE_KEY = "globalSettings";

export interface GlobalSettingsState {
  enabledModes: ModeName[];
}

export const DEFAULTS: GlobalSettingsState = {
  enabledModes: ["ionian", "dorian", "aeolian"],
};

const validModeSet = new Set<string>(ALL_MODES);

export function parseSettings(raw: string | null): GlobalSettingsState {
  if (raw === null) return DEFAULTS;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return DEFAULTS;
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return DEFAULTS;
  }

  const obj = parsed as Record<string, unknown>;

  let enabledModes = DEFAULTS.enabledModes;
  if (Array.isArray(obj.enabledModes)) {
    const valid = obj.enabledModes.filter(
      (m): m is ModeName => typeof m === "string" && validModeSet.has(m)
    );
    if (valid.length > 0) {
      enabledModes = valid;
    }
  }

  return { enabledModes };
}

export function loadSettings(): GlobalSettingsState {
  return parseSettings(localStorage.getItem(STORAGE_KEY));
}

export function saveSettings(state: GlobalSettingsState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
