import { DEFAULTS, parseSettings } from "../../settingsPersistence";

const allQuestionTypes = DEFAULTS.enabledQuestionTypes;

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
      enabledModes: ["lydian", "phrygian"],
      enabledQuestionTypes: allQuestionTypes,
    });
  });

  test("filters out invalid mode names, keeps valid ones", () => {
    const raw = JSON.stringify({ enabledModes: ["dorian", "bogus", "lydian", "fake"] });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["dorian", "lydian"],
      enabledQuestionTypes: allQuestionTypes,
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
      enabledModes: ["mixolydian"],
      enabledQuestionTypes: allQuestionTypes,
    });
  });

  test("returns valid enabledQuestionTypes as-is", () => {
    const raw = JSON.stringify({
      enabledQuestionTypes: ["fretboard_recognition", "triad_inversions"],
    });
    expect(parseSettings(raw)).toEqual({
      enabledModes: DEFAULTS.enabledModes,
      enabledQuestionTypes: ["fretboard_recognition", "triad_inversions"],
    });
  });

  test("filters out invalid question type names, keeps valid ones", () => {
    const raw = JSON.stringify({
      enabledQuestionTypes: ["fretboard_recognition", "bogus", "triad_inversions"],
    });
    expect(parseSettings(raw)).toEqual({
      enabledModes: DEFAULTS.enabledModes,
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

  test("parses both enabledModes and enabledQuestionTypes together", () => {
    const raw = JSON.stringify({
      enabledModes: ["lydian"],
      enabledQuestionTypes: ["note_on_a_string", "seventh_chord_arpeggios"],
    });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["lydian"],
      enabledQuestionTypes: ["note_on_a_string", "seventh_chord_arpeggios"],
    });
  });
});
