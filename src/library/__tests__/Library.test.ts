import {
  findNotePositions,
  findTriadPositions,
  findSeventhChordPositions,
  generateSeventhChordRound,
  getGuitarNoteName,
  getTriadNotes,
  getSeventhChordNotes,
  SeventhChordInversion,
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

describe("getSeventhChordNotes", () => {
  test("should return correct notes for C dominant 7", () => {
    expect(getSeventhChordNotes("C", "dominant7")).toEqual(["C", "E", "G", "A#/Bb"]);
  });

  test("should return correct notes for A minor 7", () => {
    expect(getSeventhChordNotes("A", "minor7")).toEqual(["A", "C", "E", "G"]);
  });

  test("should return correct notes for F major 7", () => {
    expect(getSeventhChordNotes("F", "major7")).toEqual(["F", "A", "C", "E"]);
  });

  test("should throw for invalid root note", () => {
    expect(() => getSeventhChordNotes("X", "dominant7")).toThrow("Invalid root note");
  });
});

describe("findSeventhChordPositions", () => {
  test("should return valid positions when chord fits in range", () => {
    // C dominant 7 root position (1,7,3,5) on strings [6,4,3,2], frets 7-12:
    // String 6 (E): C at fret 8, String 4 (D): A#/Bb at fret 8,
    // String 3 (G): E at fret 9, String 2 (B): G at fret 8
    const result = findSeventhChordPositions("C", "dominant7", "root", [6, 4, 3, 2], 7, 12);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(4);
    expect(result).toContainEqual({ stringNum: 6, fretNum: 8, degree: 1, noteName: "C" });
    expect(result).toContainEqual({ stringNum: 4, fretNum: 8, degree: 7, noteName: "A#/Bb" });
    expect(result).toContainEqual({ stringNum: 3, fretNum: 9, degree: 3, noteName: "E" });
    expect(result).toContainEqual({ stringNum: 2, fretNum: 8, degree: 5, noteName: "G" });
  });

  test("should return null when a note cannot be found in range", () => {
    // C dominant 7 root position needs C on string 6 (fret 8), not in 1-3
    const result = findSeventhChordPositions("C", "dominant7", "root", [6, 4, 3, 2], 1, 3);
    expect(result).toBeNull();
  });

  test("should assign degrees correctly for each inversion", () => {
    // C dominant 7 = C, E, G, A#/Bb on strings [6,4,3,2], frets 7-12

    // Root position: (1, 7, 3, 5)
    const root = findSeventhChordPositions("C", "dominant7", "root", [6, 4, 3, 2], 7, 12);
    expect(root).not.toBeNull();
    expect(root!.find((p) => p.stringNum === 6)!.degree).toBe(1);
    expect(root!.find((p) => p.stringNum === 4)!.degree).toBe(7);
    expect(root!.find((p) => p.stringNum === 3)!.degree).toBe(3);
    expect(root!.find((p) => p.stringNum === 2)!.degree).toBe(5);

    // Third inversion: (7, 5, 1, 3) — A#/Bb on string 6 is at fret 6, so use wider range
    const third = findSeventhChordPositions("C", "dominant7", "third", [6, 4, 3, 2], 4, 10);
    expect(third).not.toBeNull();
    expect(third!.find((p) => p.stringNum === 6)!.degree).toBe(7);
    expect(third!.find((p) => p.stringNum === 4)!.degree).toBe(5);
    expect(third!.find((p) => p.stringNum === 3)!.degree).toBe(1);
    expect(third!.find((p) => p.stringNum === 2)!.degree).toBe(3);
  });

  test("should detect when multiple inversions fit the same range", () => {
    // D dominant 7, frets 7-11: multiple inversions fit
    const inversions: SeventhChordInversion[] = ["root", "first", "second", "third"];
    const fitting = inversions.filter(
      (inv) => findSeventhChordPositions("D", "dominant7", inv, [6, 4, 3, 2], 7, 11) !== null
    );
    expect(fitting.length).toBeGreaterThan(1);
  });

  test("generateSeventhChordRound should produce rounds with a unique inversion", () => {
    const inversions: SeventhChordInversion[] = ["root", "first", "second", "third"];
    for (let i = 0; i < 20; i++) {
      const round = generateSeventhChordRound(5);
      const endFret = round.startFret + 4;
      const fitting = inversions.filter(
        (inv) =>
          findSeventhChordPositions(
            round.rootNote,
            round.chordType,
            inv,
            round.strings,
            round.startFret,
            endFret
          ) !== null
      );
      expect(fitting).toHaveLength(1);
      expect(fitting[0]).toBe(round.inversion);
    }
  });
});
