import {
  findFretGivenStringAndNote,
  getChordOfKey,
  getGuitarNoteName,
  getIndexOfChordInKey,
} from "../Library";

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
    expect(getChordOfKey("Am", 1)).toBe("Am");
    expect(getChordOfKey("Am", 2)).toBe("Bdim");
    expect(getChordOfKey("Am", 3)).toBe("C");
    expect(getChordOfKey("Am", 4)).toBe("Dm");
    expect(getChordOfKey("Am", 5)).toBe("E");
    expect(getChordOfKey("Am", 6)).toBe("F");
    expect(getChordOfKey("Am", 7)).toBe("G");

    // E minor
    expect(getChordOfKey("Em", 1)).toBe("Em");
    expect(getChordOfKey("Em", 2)).toBe("F#dim");
    expect(getChordOfKey("Em", 3)).toBe("G");
    expect(getChordOfKey("Em", 4)).toBe("Am");
    expect(getChordOfKey("Em", 5)).toBe("B");
    expect(getChordOfKey("Em", 6)).toBe("C");
    expect(getChordOfKey("Em", 7)).toBe("D");

    // B minor
    expect(getChordOfKey("Bm", 1)).toBe("Bm");
    expect(getChordOfKey("Bm", 2)).toBe("C#dim");
    expect(getChordOfKey("Bm", 3)).toBe("D");
    expect(getChordOfKey("Bm", 4)).toBe("Em");
    expect(getChordOfKey("Bm", 5)).toBe("F#");
    expect(getChordOfKey("Bm", 6)).toBe("G");
    expect(getChordOfKey("Bm", 7)).toBe("A");

    // C# minor
    expect(getChordOfKey("C#m", 1)).toBe("C#m");
    expect(getChordOfKey("C#m", 2)).toBe("D#dim");
    expect(getChordOfKey("C#m", 3)).toBe("E");
    expect(getChordOfKey("C#m", 4)).toBe("F#m");
    expect(getChordOfKey("C#m", 5)).toBe("G#");
    expect(getChordOfKey("C#m", 6)).toBe("A");
    expect(getChordOfKey("C#m", 7)).toBe("B");

    // Eb minor
    expect(getChordOfKey("Ebm", 1)).toBe("Ebm");
    expect(getChordOfKey("Ebm", 2)).toBe("Fdim");
    expect(getChordOfKey("Ebm", 3)).toBe("Gb");
    expect(getChordOfKey("Ebm", 4)).toBe("Abm");
    expect(getChordOfKey("Ebm", 5)).toBe("Bb");
    expect(getChordOfKey("Ebm", 6)).toBe("Cb");
    expect(getChordOfKey("Ebm", 7)).toBe("Db");
  });

  test("should throw an error for invalid key name", () => {
    expect(() => getChordOfKey("InvalidKey", 1)).toThrow();
  });

  test("should throw an error for invalid chord number", () => {
    expect(() => getChordOfKey("C", 8)).toThrow();
    expect(() => getChordOfKey("Am", 0)).toThrow();
  });
});

describe("getIndexOfChordInKey", () => {
  test("should return correct index for major keys", () => {
    // C major
    expect(getIndexOfChordInKey("C", "C")).toBe(1);
    expect(getIndexOfChordInKey("C", "Dm")).toBe(2);
    expect(getIndexOfChordInKey("C", "Em")).toBe(3);
    expect(getIndexOfChordInKey("C", "F")).toBe(4);
    expect(getIndexOfChordInKey("C", "G")).toBe(5);
    expect(getIndexOfChordInKey("C", "Am")).toBe(6);
    expect(getIndexOfChordInKey("C", "Bdim")).toBe(7);

    // G major
    expect(getIndexOfChordInKey("G", "G")).toBe(1);
    expect(getIndexOfChordInKey("G", "Am")).toBe(2);
    expect(getIndexOfChordInKey("G", "Bm")).toBe(3);
    expect(getIndexOfChordInKey("G", "C")).toBe(4);
    expect(getIndexOfChordInKey("G", "D")).toBe(5);
    expect(getIndexOfChordInKey("G", "Em")).toBe(6);
    expect(getIndexOfChordInKey("G", "F#dim")).toBe(7);

    // D major
    expect(getIndexOfChordInKey("D", "D")).toBe(1);
    expect(getIndexOfChordInKey("D", "Em")).toBe(2);
    expect(getIndexOfChordInKey("D", "F#m")).toBe(3);
    expect(getIndexOfChordInKey("D", "G")).toBe(4);
    expect(getIndexOfChordInKey("D", "A")).toBe(5);
    expect(getIndexOfChordInKey("D", "Bm")).toBe(6);
    expect(getIndexOfChordInKey("D", "C#dim")).toBe(7);

    // F# major
    expect(getIndexOfChordInKey("F#", "F#")).toBe(1);
    expect(getIndexOfChordInKey("F#", "G#m")).toBe(2);
    expect(getIndexOfChordInKey("F#", "A#m")).toBe(3);
    expect(getIndexOfChordInKey("F#", "B")).toBe(4);
    expect(getIndexOfChordInKey("F#", "C#")).toBe(5);
    expect(getIndexOfChordInKey("F#", "D#m")).toBe(6);
    expect(getIndexOfChordInKey("F#", "E#dim")).toBe(7);

    // Bb major
    expect(getIndexOfChordInKey("Bb", "Bb")).toBe(1);
    expect(getIndexOfChordInKey("Bb", "Cm")).toBe(2);
    expect(getIndexOfChordInKey("Bb", "Dm")).toBe(3);
    expect(getIndexOfChordInKey("Bb", "Eb")).toBe(4);
    expect(getIndexOfChordInKey("Bb", "F")).toBe(5);
    expect(getIndexOfChordInKey("Bb", "Gm")).toBe(6);
    expect(getIndexOfChordInKey("Bb", "Adim")).toBe(7);
  });

  test("should return correct index for minor keys", () => {
    // A minor
    expect(getIndexOfChordInKey("Am", "Am")).toBe(1);
    expect(getIndexOfChordInKey("Am", "Bdim")).toBe(2);
    expect(getIndexOfChordInKey("Am", "C")).toBe(3);
    expect(getIndexOfChordInKey("Am", "Dm")).toBe(4);
    expect(getIndexOfChordInKey("Am", "E")).toBe(5);
    expect(getIndexOfChordInKey("Am", "F")).toBe(6);
    expect(getIndexOfChordInKey("Am", "G")).toBe(7);

    // E minor
    expect(getIndexOfChordInKey("Em", "Em")).toBe(1);
    expect(getIndexOfChordInKey("Em", "F#dim")).toBe(2);
    expect(getIndexOfChordInKey("Em", "G")).toBe(3);
    expect(getIndexOfChordInKey("Em", "Am")).toBe(4);
    expect(getIndexOfChordInKey("Em", "B")).toBe(5);
    expect(getIndexOfChordInKey("Em", "C")).toBe(6);
    expect(getIndexOfChordInKey("Em", "D")).toBe(7);

    // B minor
    expect(getIndexOfChordInKey("Bm", "Bm")).toBe(1);
    expect(getIndexOfChordInKey("Bm", "C#dim")).toBe(2);
    expect(getIndexOfChordInKey("Bm", "D")).toBe(3);
    expect(getIndexOfChordInKey("Bm", "Em")).toBe(4);
    expect(getIndexOfChordInKey("Bm", "F#")).toBe(5);
    expect(getIndexOfChordInKey("Bm", "G")).toBe(6);
    expect(getIndexOfChordInKey("Bm", "A")).toBe(7);

    // C# minor
    expect(getIndexOfChordInKey("C#m", "C#m")).toBe(1);
    expect(getIndexOfChordInKey("C#m", "D#dim")).toBe(2);
    expect(getIndexOfChordInKey("C#m", "E")).toBe(3);
    expect(getIndexOfChordInKey("C#m", "F#m")).toBe(4);
    expect(getIndexOfChordInKey("C#m", "G#")).toBe(5);
    expect(getIndexOfChordInKey("C#m", "A")).toBe(6);
    expect(getIndexOfChordInKey("C#m", "B")).toBe(7);

    // Eb minor
    expect(getIndexOfChordInKey("Ebm", "Ebm")).toBe(1);
    expect(getIndexOfChordInKey("Ebm", "Fdim")).toBe(2);
    expect(getIndexOfChordInKey("Ebm", "Gb")).toBe(3);
    expect(getIndexOfChordInKey("Ebm", "Abm")).toBe(4);
    expect(getIndexOfChordInKey("Ebm", "Bb")).toBe(5);
    expect(getIndexOfChordInKey("Ebm", "Cb")).toBe(6);
    expect(getIndexOfChordInKey("Ebm", "Db")).toBe(7);
  });

  test("should throw for invalid inputs", () => {
    expect(() => getIndexOfChordInKey("C", "H")).toThrow(); // Invalid chord name
    expect(() => getIndexOfChordInKey("H", "C")).toThrow(); // Invalid key name
    expect(() => getIndexOfChordInKey("C", "D")).toThrow(); // Valid chord not in key
    expect(() => getIndexOfChordInKey("Am", "G#m")).toThrow(); // Valid chord not in key
  });
});
