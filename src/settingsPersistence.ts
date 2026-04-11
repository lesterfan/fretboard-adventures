import { ALL_MODES, ModeName } from "./library/Library";
import { ALL_QUESTION_TYPES, QuestionTypeId } from "./questionRegistry";

const STORAGE_KEY = "globalSettings";

export interface GlobalSettingsState {
  enabledModes: ModeName[];
  enabledQuestionTypes: QuestionTypeId[];
}

export const DEFAULTS: GlobalSettingsState = {
  enabledModes: ["ionian", "dorian", "aeolian"],
  enabledQuestionTypes: [...ALL_QUESTION_TYPES],
};

const validModeSet = new Set<string>(ALL_MODES);
const validQuestionTypeSet = new Set<string>(ALL_QUESTION_TYPES);

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

  let enabledQuestionTypes = DEFAULTS.enabledQuestionTypes;
  if (Array.isArray(obj.enabledQuestionTypes)) {
    const valid = obj.enabledQuestionTypes.filter(
      (q): q is QuestionTypeId => typeof q === "string" && validQuestionTypeSet.has(q)
    );
    if (valid.length > 0) {
      enabledQuestionTypes = valid;
    }
  }

  return { enabledModes, enabledQuestionTypes };
}

export function loadSettings(): GlobalSettingsState {
  return parseSettings(localStorage.getItem(STORAGE_KEY));
}

export function saveSettings(state: GlobalSettingsState): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      enabledModes: state.enabledModes,
      enabledQuestionTypes: state.enabledQuestionTypes,
    })
  );
}
