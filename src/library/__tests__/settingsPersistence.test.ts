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

  test("returns valid enabledQuestionTypes with new types appended", () => {
    const stored = ["fretboard_recognition", "triad_inversions"];
    const raw = JSON.stringify({ enabledQuestionTypes: stored });
    const result = parseSettings(raw);
    const newTypes = ALL_QUESTION_TYPES.filter((q) => !stored.includes(q));
    expect(result.enabledQuestionTypes).toEqual([...stored, ...newTypes]);
  });

  test("filters out invalid question type names, keeps valid ones plus new types", () => {
    const raw = JSON.stringify({
      enabledQuestionTypes: ["fretboard_recognition", "bogus", "triad_inversions"],
    });
    const result = parseSettings(raw);
    const validStored = ["fretboard_recognition", "triad_inversions"];
    const newTypes = ALL_QUESTION_TYPES.filter((q) => !validStored.includes(q));
    expect(result.enabledQuestionTypes).toEqual([...validStored, ...newTypes]);
  });

  test("falls back to default enabledQuestionTypes when all names are invalid", () => {
    const raw = JSON.stringify({ enabledQuestionTypes: ["bogus", "fake"] });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  test("falls back to default enabledQuestionTypes when it is not an array", () => {
    const raw = JSON.stringify({ enabledQuestionTypes: "fretboard_recognition" });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  test("appends new question types not present in stored settings", () => {
    // Simulate stored settings from before "twelve_bar_blues_triads" existed
    const raw = JSON.stringify({
      enabledQuestionTypes: ["fretboard_recognition", "triad_inversions"],
    });
    const result = parseSettings(raw);
    // The two stored types should still be present and in order
    expect(result.enabledQuestionTypes[0]).toBe("fretboard_recognition");
    expect(result.enabledQuestionTypes[1]).toBe("triad_inversions");
    // New types not in the stored list should be appended
    expect(result.enabledQuestionTypes).toContain("twelve_bar_blues_triads");
    expect(result.enabledQuestionTypes).toContain("note_on_a_string");
    expect(result.enabledQuestionTypes).toContain("seventh_chord_inversions");
  });

  test("parses both enabledModes and enabledQuestionTypes together", () => {
    const stored = ["note_on_a_string", "seventh_chord_arpeggios"];
    const raw = JSON.stringify({
      enabledModes: ["lydian"],
      enabledQuestionTypes: stored,
    });
    const newTypes = ALL_QUESTION_TYPES.filter((q) => !stored.includes(q));
    expect(parseSettings(raw)).toEqual({
      ...DEFAULTS,
      enabledModes: ["lydian"],
      enabledQuestionTypes: [...stored, ...newTypes],
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
