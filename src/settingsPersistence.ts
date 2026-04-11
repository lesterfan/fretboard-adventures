import { ALL_DEGREES, ALL_MODES, ModeName } from "./library/Library";
import { ALL_QUESTION_TYPES, QuestionTypeId } from "./questionRegistry";

const STORAGE_KEY = "globalSettings";

export interface GlobalSettingsState {
  enabledModes: ModeName[];
  enabledQuestionTypes: QuestionTypeId[];
  enabledIntervalReferenceDegrees: number[];
  enabledIntervalTargetDegrees: number[];
}

export const DEFAULTS: GlobalSettingsState = {
  enabledModes: ["ionian", "dorian", "aeolian"],
  enabledQuestionTypes: [...ALL_QUESTION_TYPES],
  enabledIntervalReferenceDegrees: [1],
  enabledIntervalTargetDegrees: [...ALL_DEGREES],
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
      // Determine which types were known when settings were last saved.
      // Types not in the known set are newly added and should default to enabled.
      const known = Array.isArray(obj.knownQuestionTypes)
        ? obj.knownQuestionTypes.filter(
            (q): q is string => typeof q === "string" && validQuestionTypeSet.has(q)
          )
        : valid;
      const knownSet = new Set(known);
      const newTypes = ALL_QUESTION_TYPES.filter((q) => !knownSet.has(q));
      enabledQuestionTypes = [...valid, ...newTypes];
    }
  }

  let enabledIntervalReferenceDegrees = DEFAULTS.enabledIntervalReferenceDegrees;
  if (Array.isArray(obj.enabledIntervalReferenceDegrees)) {
    const valid = obj.enabledIntervalReferenceDegrees.filter(
      (d): d is number => typeof d === "number" && ALL_DEGREES.includes(d)
    );
    if (valid.length > 0) {
      enabledIntervalReferenceDegrees = valid;
    }
  }

  let enabledIntervalTargetDegrees = DEFAULTS.enabledIntervalTargetDegrees;
  if (Array.isArray(obj.enabledIntervalTargetDegrees)) {
    const valid = obj.enabledIntervalTargetDegrees.filter(
      (d): d is number => typeof d === "number" && ALL_DEGREES.includes(d)
    );
    if (valid.length > 0) {
      enabledIntervalTargetDegrees = valid;
    }
  }

  return {
    enabledModes,
    enabledQuestionTypes,
    enabledIntervalReferenceDegrees,
    enabledIntervalTargetDegrees,
  };
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
      knownQuestionTypes: ALL_QUESTION_TYPES,
      enabledIntervalReferenceDegrees: state.enabledIntervalReferenceDegrees,
      enabledIntervalTargetDegrees: state.enabledIntervalTargetDegrees,
    })
  );
}
