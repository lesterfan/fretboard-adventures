import { findFretGivenStringAndNote, getChordOfKey, getGuitarNoteName } from "../Library";

describe("getGuitarNoteName", () => {
  test("should return the correct note for a given string and fret", () => {
    expect(getGuitarNoteName(1, 0)).toBe("E");
    expect(getGuitarNoteName(3, 5)).toBe("C");
    expect(getGuitarNoteName(5, 10)).toBe("G");
    expect(getGuitarNoteName(5, 11)).toBe("G#/Ab");
    expect(getGuitarNoteName(2, 2)).toBe("C#/Db");
    expect(getGuitarNoteName(4, 8)).toBe("A#/Bb");
    expect(getGuitarNoteName(6, 5)).toBe("A");
  });

  test("should handle custom tunings", () => {
    const dropDTuning = ["D", "A", "D", "G", "B", "E"];
    expect(getGuitarNoteName(6, 3, dropDTuning)).toBe("F");
  });

  test("should throw an error for invalid string number", () => {
    expect(() => getGuitarNoteName(7, 0)).toThrow("Invalid string number");
  });

  test("should throw an error for negative fret number", () => {
    expect(() => getGuitarNoteName(1, -1)).toThrow("Fret number cannot be negative");
  });

  test("should throw an error for invalid tunings", () => {
    expect(() => getGuitarNoteName(1, 1, ["X", "Y", "Z", "A", "B", "C"])).toThrow();
    expect(() => getGuitarNoteName(1, 1, ["A", "B", "C"])).toThrow();
  });
});

describe("findFretGivenStringAndNote", () => {
  test("should return the correct fret for a given string and note", () => {
    expect(findFretGivenStringAndNote(1, "E")).toBe(0);
    expect(findFretGivenStringAndNote(2, "C#/Db")).toBe(2);
    expect(findFretGivenStringAndNote(3, "C")).toBe(5);
    expect(findFretGivenStringAndNote(4, "A#/Bb")).toBe(8);
    expect(findFretGivenStringAndNote(5, "G")).toBe(10);
    expect(findFretGivenStringAndNote(5, "G#/Ab")).toBe(11);
    expect(findFretGivenStringAndNote(6, "A")).toBe(5);
  });

  test("should throw an error for invalid note name", () => {
    expect(() => findFretGivenStringAndNote(1, "InvalidNote")).toThrow();
  });

  test("should handle custom tunings", () => {
    const dropDTuning = ["D", "A", "D", "G", "B", "E"];
    expect(findFretGivenStringAndNote(6, "F", dropDTuning)).toBe(3);
  });

  test("should throw an error for invalid string number", () => {
    expect(() => findFretGivenStringAndNote(7, "E")).toThrow("Invalid string number");
  });

  test("should throw an error for invalid tunings", () => {
    expect(() => findFretGivenStringAndNote(1, "E", ["X", "Y", "Z", "A", "B", "C"])).toThrow();
    expect(() => findFretGivenStringAndNote(1, "E", ["A", "B", "C"])).toThrow();
  });
});

describe("getChordOfKey", () => {
  test("should return the correct chords for major keys", () => {
    // C major
    expect(getChordOfKey("C", 1)).toBe("C");
    expect(getChordOfKey("C", 2)).toBe("Dm");
    expect(getChordOfKey("C", 3)).toBe("Em");
    expect(getChordOfKey("C", 4)).toBe("F");
    expect(getChordOfKey("C", 5)).toBe("G");
    expect(getChordOfKey("C", 6)).toBe("Am");
    expect(getChordOfKey("C", 7)).toBe("Bdim");

    // G major
    expect(getChordOfKey("G", 1)).toBe("G");
    expect(getChordOfKey("G", 2)).toBe("Am");
    expect(getChordOfKey("G", 3)).toBe("Bm");
    expect(getChordOfKey("G", 4)).toBe("C");
    expect(getChordOfKey("G", 5)).toBe("D");
    expect(getChordOfKey("G", 6)).toBe("Em");
    expect(getChordOfKey("G", 7)).toBe("F#dim");

    // D major
    expect(getChordOfKey("D", 1)).toBe("D");
    expect(getChordOfKey("D", 2)).toBe("Em");
    expect(getChordOfKey("D", 3)).toBe("F#m");
    expect(getChordOfKey("D", 4)).toBe("G");
    expect(getChordOfKey("D", 5)).toBe("A");
    expect(getChordOfKey("D", 6)).toBe("Bm");
    expect(getChordOfKey("D", 7)).toBe("C#dim");

    // F# major
    expect(getChordOfKey("F#", 1)).toBe("F#");
    expect(getChordOfKey("F#", 2)).toBe("G#m");
    expect(getChordOfKey("F#", 3)).toBe("A#m");
    expect(getChordOfKey("F#", 4)).toBe("B");
    expect(getChordOfKey("F#", 5)).toBe("C#");
    expect(getChordOfKey("F#", 6)).toBe("D#m");
    expect(getChordOfKey("F#", 7)).toBe("E#dim");

    // Bb major
    expect(getChordOfKey("Bb", 1)).toBe("Bb");
    expect(getChordOfKey("Bb", 2)).toBe("Cm");
    expect(getChordOfKey("Bb", 3)).toBe("Dm");
    expect(getChordOfKey("Bb", 4)).toBe("Eb");
    expect(getChordOfKey("Bb", 5)).toBe("F");
    expect(getChordOfKey("Bb", 6)).toBe("Gm");
    expect(getChordOfKey("Bb", 7)).toBe("Adim");
  });

  test("should return the correct chords for minor keys", () => {
    // A minor
    expect(getChordOfKey("Am", 1)).toBe("Am"); // minor
    expect(getChordOfKey("Am", 2)).toBe("Bdim"); // diminished
    expect(getChordOfKey("Am", 3)).toBe("C"); // major
    expect(getChordOfKey("Am", 4)).toBe("Dm"); // minor
    expect(getChordOfKey("Am", 5)).toBe("E"); // major
    expect(getChordOfKey("Am", 6)).toBe("F"); // major
    expect(getChordOfKey("Am", 7)).toBe("G"); // major

    // E minor
    expect(getChordOfKey("Em", 1)).toBe("Em"); // minor
    expect(getChordOfKey("Em", 2)).toBe("F#dim"); // diminished
    expect(getChordOfKey("Em", 3)).toBe("G"); // major
    expect(getChordOfKey("Em", 4)).toBe("Am"); // minor
    expect(getChordOfKey("Em", 5)).toBe("B"); // major
    expect(getChordOfKey("Em", 6)).toBe("C"); // major
    expect(getChordOfKey("Em", 7)).toBe("D"); // major

    // B minor
    expect(getChordOfKey("Bm", 1)).toBe("Bm"); // minor
    expect(getChordOfKey("Bm", 2)).toBe("C#dim"); // diminished
    expect(getChordOfKey("Bm", 3)).toBe("D"); // major
    expect(getChordOfKey("Bm", 4)).toBe("Em"); // minor
    expect(getChordOfKey("Bm", 5)).toBe("F#"); // major
    expect(getChordOfKey("Bm", 6)).toBe("G"); // major
    expect(getChordOfKey("Bm", 7)).toBe("A"); // major

    // C# minor
    expect(getChordOfKey("C#m", 1)).toBe("C#m"); // minor
    expect(getChordOfKey("C#m", 2)).toBe("D#dim"); // diminished
    expect(getChordOfKey("C#m", 3)).toBe("E"); // major
    expect(getChordOfKey("C#m", 4)).toBe("F#m"); // minor
    expect(getChordOfKey("C#m", 5)).toBe("G#"); // major
    expect(getChordOfKey("C#m", 6)).toBe("A"); // major
    expect(getChordOfKey("C#m", 7)).toBe("B"); // major

    // Eb minor
    expect(getChordOfKey("Ebm", 1)).toBe("Ebm"); // minor
    expect(getChordOfKey("Ebm", 2)).toBe("Fdim"); // diminished
    expect(getChordOfKey("Ebm", 3)).toBe("Gb"); // major
    expect(getChordOfKey("Ebm", 4)).toBe("Abm"); // minor
    expect(getChordOfKey("Ebm", 5)).toBe("Bb"); // major
    expect(getChordOfKey("Ebm", 6)).toBe("Cb"); // major
    expect(getChordOfKey("Ebm", 7)).toBe("Db"); // major
  });

  test("should throw an error for invalid key name", () => {
    expect(() => getChordOfKey("InvalidKey", 1)).toThrow();
  });

  test("should throw an error for invalid chord number", () => {
    expect(() => getChordOfKey("C", 8)).toThrow();
    expect(() => getChordOfKey("Am", 0)).toThrow();
  });
});
