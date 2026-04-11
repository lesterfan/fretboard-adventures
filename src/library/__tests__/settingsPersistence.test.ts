import { parseSettings } from "../../settingsPersistence";

describe("parseSettings", () => {
  test("returns defaults when raw is null", () => {
    expect(parseSettings(null)).toEqual({
      enabledModes: ["ionian", "dorian", "aeolian"],
    });
  });

  test("returns defaults for invalid JSON", () => {
    expect(parseSettings("not json")).toEqual({
      enabledModes: ["ionian", "dorian", "aeolian"],
    });
  });

  test("returns defaults for non-object JSON (number)", () => {
    expect(parseSettings("42")).toEqual({
      enabledModes: ["ionian", "dorian", "aeolian"],
    });
  });

  test("returns defaults for non-object JSON (array)", () => {
    expect(parseSettings("[]")).toEqual({
      enabledModes: ["ionian", "dorian", "aeolian"],
    });
  });

  test("returns valid enabledModes as-is", () => {
    const raw = JSON.stringify({ enabledModes: ["lydian", "phrygian"] });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["lydian", "phrygian"],
    });
  });

  test("filters out invalid mode names, keeps valid ones", () => {
    const raw = JSON.stringify({ enabledModes: ["dorian", "bogus", "lydian", "fake"] });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["dorian", "lydian"],
    });
  });

  test("falls back to default enabledModes when all names are invalid", () => {
    const raw = JSON.stringify({ enabledModes: ["bogus", "fake"] });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["ionian", "dorian", "aeolian"],
    });
  });

  test("falls back to default enabledModes when it is not an array", () => {
    const raw = JSON.stringify({ enabledModes: "dorian" });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["ionian", "dorian", "aeolian"],
    });
  });

  test("fills in default enabledModes when key is missing", () => {
    const raw = JSON.stringify({ someOtherSetting: true });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["ionian", "dorian", "aeolian"],
    });
  });

  test("ignores extra unknown keys without crashing", () => {
    const raw = JSON.stringify({
      enabledModes: ["mixolydian"],
      unknownKey: 123,
      anotherOne: { nested: true },
    });
    expect(parseSettings(raw)).toEqual({
      enabledModes: ["mixolydian"],
    });
  });
});
