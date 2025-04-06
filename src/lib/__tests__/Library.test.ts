import { findFretGivenStringAndNote, getGuitarNoteName } from "../Library";

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
