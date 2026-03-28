import {
  findNotePositions,
  findTriadPositions,
  getGuitarNoteName,
  getTriadNotes,
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

describe("getTriadNotes", () => {
  test("should return correct notes for C major", () => {
    expect(getTriadNotes("C", "major")).toEqual(["C", "E", "G"]);
  });

  test("should return correct notes for A minor", () => {
    expect(getTriadNotes("A", "minor")).toEqual(["A", "C", "E"]);
  });

  test("should return correct notes for B diminished", () => {
    expect(getTriadNotes("B", "diminished")).toEqual(["B", "D", "F"]);
  });

  test("should handle sharps/flats", () => {
    // F# major: F#, A#, C#
    expect(getTriadNotes("F#/Gb", "major")).toEqual(["F#/Gb", "A#/Bb", "C#/Db"]);
  });

  test("should throw for invalid root note", () => {
    expect(() => getTriadNotes("X", "major")).toThrow("Invalid root note");
  });
});

describe("findTriadPositions", () => {
  test("should return null when triad does not fit in range", () => {
    // A minor root position on strings 4,3,2, frets 1-5:
    // A (degree 1) on string 4 (D) is at fret 7, not in 1-5
    const result = findTriadPositions("A", "minor", "root", [4, 3, 2], 1, 5);
    expect(result).toBeNull();
  });

  test("should return valid positions when triad fits in range", () => {
    // D major first inversion (3,5,1) on strings 4,3,2, frets 1-5:
    // String 4 (D): F#/Gb at fret 4, String 3 (G): A at fret 2, String 2 (B): D at fret 3
    const result = findTriadPositions("D", "major", "first", [4, 3, 2], 1, 5);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
    // Verify each position
    expect(result).toContainEqual({ stringNum: 4, fretNum: 4, degree: 3, noteName: "F#/Gb" });
    expect(result).toContainEqual({ stringNum: 3, fretNum: 2, degree: 5, noteName: "A" });
    expect(result).toContainEqual({ stringNum: 2, fretNum: 3, degree: 1, noteName: "D" });
  });

  test("should return null when a note cannot be found in range", () => {
    // C major root position on strings 3,2,1, frets 1-2
    // degrees 1,3,5 = C,E,G
    // String 3 (G): C at fret 5... not in 1-2
    const result = findTriadPositions("C", "major", "root", [3, 2, 1], 1, 2);
    expect(result).toBeNull();
  });

  test("should assign degrees correctly for each inversion", () => {
    // D major on strings 4,3,2, frets 1-5
    // D=root, F#/Gb=3rd, A=5th

    // First inversion: 3,5,1
    const first = findTriadPositions("D", "major", "first", [4, 3, 2], 1, 5);
    expect(first).not.toBeNull();
    expect(first!.find((p) => p.stringNum === 4)!.degree).toBe(3);
    expect(first!.find((p) => p.stringNum === 3)!.degree).toBe(5);
    expect(first!.find((p) => p.stringNum === 2)!.degree).toBe(1);

    // Second inversion: 5,1,3 (need wider range since A on D string is fret 7)
    const second = findTriadPositions("D", "major", "second", [4, 3, 2], 5, 9);
    expect(second).not.toBeNull();
    expect(second!.find((p) => p.stringNum === 4)!.degree).toBe(5);
    expect(second!.find((p) => p.stringNum === 3)!.degree).toBe(1);
    expect(second!.find((p) => p.stringNum === 2)!.degree).toBe(3);
  });
});
