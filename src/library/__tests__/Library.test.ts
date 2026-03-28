import { findNotePositions, getGuitarNoteName } from "../Library";

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

describe("findNotePositions", () => {
  test("should find note positions on specified strings in a fret range", () => {
    const positions = findNotePositions("E", 1, 5, [2, 4]);
    expect(positions).toEqual(
      expect.arrayContaining([
        { stringNum: 2, fretNum: 5 },
        { stringNum: 4, fretNum: 2 },
      ])
    );
    expect(positions).toHaveLength(2);
  });

  test("should only return positions on the requested strings", () => {
    const positions = findNotePositions("C", 1, 5, [2]);
    expect(positions).toEqual([{ stringNum: 2, fretNum: 1 }]);
  });

  test("should return positions for fret range ending at 12", () => {
    const positions = findNotePositions("A", 8, 12, [1, 2, 3, 4, 5, 6]);
    for (const pos of positions) {
      expect(getGuitarNoteName(pos.stringNum, pos.fretNum)).toBe("A");
      expect(pos.fretNum).toBeGreaterThanOrEqual(8);
      expect(pos.fretNum).toBeLessThanOrEqual(12);
    }
    expect(positions.length).toBeGreaterThan(0);
  });

  test("should return empty array when note does not appear in range", () => {
    const positions = findNotePositions("E", 1, 1, [1]);
    expect(positions).toEqual([]);
  });
});
