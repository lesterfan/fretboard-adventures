import { DEFAULTS, parseSettings } from "../../settingsPersistence";
import { ALL_QUESTION_TYPES } from "../../questionRegistry";

describe("parseSettings", () => {
  test("returns defaults when raw is null", () => {
    expect(parseSettings(null)).toEqual(DEFAULTS);
  });

  test("returns defaults for invalid JSON", () => {
    expect(parseSettings("not json")).toEqual(DEFAULTS);
  });

  test("returns defaults for non-object JSON (number)", () => {
    expect(parseSettings("42")).toEqual(DEFAULTS);
  });

  test("returns defaults for non-object JSON (array)", () => {
    expect(parseSettings("[]")).toEqual(DEFAULTS);
  });

  test("returns valid enabledModes as-is", () => {
    const raw = JSON.stringify({ enabledModes: ["lydian", "phrygian"] });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledModes: ["lydian", "phrygian"],
    });
  });

  test("filters out invalid mode names, keeps valid ones", () => {
    const raw = JSON.stringify({ enabledModes: ["dorian", "bogus", "lydian", "fake"] });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledModes: ["dorian", "lydian"],
    });
  });

  test("falls back to default enabledModes when all names are invalid", () => {
    const raw = JSON.stringify({ enabledModes: ["bogus", "fake"] });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  test("falls back to default enabledModes when it is not an array", () => {
    const raw = JSON.stringify({ enabledModes: "dorian" });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  test("fills in default enabledModes when key is missing", () => {
    const raw = JSON.stringify({ someOtherSetting: true });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  test("ignores extra unknown keys without crashing", () => {
    const raw = JSON.stringify({
      enabledModes: ["mixolydian"],
      unknownKey: 123,
      anotherOne: { nested: true },
    });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledModes: ["mixolydian"],
    });
  });

  test("preserves enabled question types and does not re-enable disabled ones", () => {
    const raw = JSON.stringify({
      enabledQuestionTypes: ["fretboard_recognition", "triad_inversions"],
      knownQuestionTypes: ALL_QUESTION_TYPES,
    });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledQuestionTypes: ["fretboard_recognition", "triad_inversions"],
    });
  });

  test("filters out invalid question type names, keeps valid ones", () => {
    const raw = JSON.stringify({
      enabledQuestionTypes: ["fretboard_recognition", "bogus", "triad_inversions"],
      knownQuestionTypes: ALL_QUESTION_TYPES,
    });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledQuestionTypes: ["fretboard_recognition", "triad_inversions"],
    });
  });

  test("falls back to default enabledQuestionTypes when all names are invalid", () => {
    const raw = JSON.stringify({ enabledQuestionTypes: ["bogus", "fake"] });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  test("falls back to default enabledQuestionTypes when it is not an array", () => {
    const raw = JSON.stringify({ enabledQuestionTypes: "fretboard_recognition" });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  test("auto-enables new question types not in knownQuestionTypes", () => {
    // Simulate settings saved before "twelve_bar_blues_triads" existed
    const knownAtSaveTime = ALL_QUESTION_TYPES.filter((q) => q !== "twelve_bar_blues_triads");
    const raw = JSON.stringify({
      enabledQuestionTypes: ["fretboard_recognition", "triad_inversions"],
      knownQuestionTypes: knownAtSaveTime,
    });
    const result = parseSettings(raw);
    // User's enabled choices preserved
    expect(result.enabledQuestionTypes).toContain("fretboard_recognition");
    expect(result.enabledQuestionTypes).toContain("triad_inversions");
    // New type auto-enabled
    expect(result.enabledQuestionTypes).toContain("twelve_bar_blues_triads");
    // Types that were known but disabled stay disabled
    expect(result.enabledQuestionTypes).not.toContain("note_on_a_string");
    expect(result.enabledQuestionTypes).not.toContain("seventh_chord_inversions");
  });

  test("parses both enabledModes and enabledQuestionTypes together", () => {
    const raw = JSON.stringify({
      enabledModes: ["lydian"],
      enabledQuestionTypes: ["note_on_a_string", "seventh_chord_arpeggios"],
      knownQuestionTypes: ALL_QUESTION_TYPES,
    });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledModes: ["lydian"],
      enabledQuestionTypes: ["note_on_a_string", "seventh_chord_arpeggios"],
    });
  });

  test("returns valid enabledIntervalReferenceDegrees as-is", () => {
    const raw = JSON.stringify({ enabledIntervalReferenceDegrees: [1, 3, 5] });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledIntervalReferenceDegrees: [1, 3, 5],
    });
  });

  test("returns valid enabledIntervalTargetDegrees as-is", () => {
    const raw = JSON.stringify({ enabledIntervalTargetDegrees: [3, 7] });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledIntervalTargetDegrees: [3, 7],
    });
  });

  test("filters out invalid degree values", () => {
    const raw = JSON.stringify({ enabledIntervalReferenceDegrees: [1, 0, 8, 3, "bad"] });
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledIntervalReferenceDegrees: [1, 3],
    });
  });

  test("falls back to default degrees when all values are invalid", () => {
    const raw = JSON.stringify({ enabledIntervalTargetDegrees: [0, 8, 99] });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });
});
