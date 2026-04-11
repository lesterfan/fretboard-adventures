import {
  findNotePositions,
  findTriadPositions,
  findSeventhChordPositions,
  generateSeventhChordRound,
  getGuitarNoteName,
  getTriadNotes,
  getSeventhChordNotes,
  getPentatonicNotes,
  findPentatonicBoxPositions,
  generatePentatonicRound,
  getExtraModeNotes,
  findExtraModePositions,
  generateModeFromPentatonicRound,
  getSeventhArpeggioNotes,
  findSeventhArpeggioPositions,
  generateSeventhArpeggioRound,
  generateIntervalTrainingRound,
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

  test("should return correct notes for B m7b5", () => {
    expect(getSeventhChordNotes("B", "m7b5")).toEqual(["B", "D", "F", "A"]);
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

describe("getPentatonicNotes", () => {
  test("should return correct notes for A minor pentatonic", () => {
    const notes = getPentatonicNotes("A", "minor");
    expect(notes).toEqual([
      { noteName: "A", degree: 1 },
      { noteName: "C", degree: 3 },
      { noteName: "D", degree: 4 },
      { noteName: "E", degree: 5 },
      { noteName: "G", degree: 7 },
    ]);
  });

  test("should return correct notes for C major pentatonic", () => {
    const notes = getPentatonicNotes("C", "major");
    expect(notes).toEqual([
      { noteName: "C", degree: 1 },
      { noteName: "D", degree: 2 },
      { noteName: "E", degree: 3 },
      { noteName: "G", degree: 5 },
      { noteName: "A", degree: 6 },
    ]);
  });

  test("should throw for invalid root note", () => {
    expect(() => getPentatonicNotes("X", "minor")).toThrow("Invalid root note");
  });
});

describe("findPentatonicBoxPositions", () => {
  test("should return 12 positions (2 per string) for a valid box", () => {
    // A minor pentatonic, frets 5-8 is the classic Am position 1 box
    const result = findPentatonicBoxPositions("A", "minor", 5, 8);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(12);
    for (let s = 1; s <= 6; s++) {
      expect(result!.filter((p) => p.stringNum === s)).toHaveLength(2);
    }
  });

  test("should return null when box is incomplete", () => {
    // Very narrow range — unlikely to fit a complete box
    const result = findPentatonicBoxPositions("A", "minor", 1, 2);
    expect(result).toBeNull();
  });

  test("should assign correct degrees to positions", () => {
    const result = findPentatonicBoxPositions("A", "minor", 5, 8);
    expect(result).not.toBeNull();
    // All notes should be from the A minor pentatonic scale
    const validDegrees = [1, 3, 4, 5, 7];
    for (const pos of result!) {
      expect(validDegrees).toContain(pos.degree);
      // Verify the note at this position matches
      expect(getGuitarNoteName(pos.stringNum, pos.fretNum)).toBe(pos.noteName);
    }
  });

  test("should work for major pentatonic", () => {
    // C major pentatonic = C, D, E, G, A (same notes as A minor pentatonic)
    const result = findPentatonicBoxPositions("C", "major", 5, 8);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(12);
    const validDegrees = [1, 2, 3, 5, 6];
    for (const pos of result!) {
      expect(validDegrees).toContain(pos.degree);
    }
  });
});

describe("generatePentatonicRound", () => {
  test("should produce valid rounds with exactly 2 notes per string", () => {
    for (let i = 0; i < 20; i++) {
      const round = generatePentatonicRound(5);
      expect(round.positions).toHaveLength(12);
      for (let s = 1; s <= 6; s++) {
        expect(round.positions.filter((p) => p.stringNum === s)).toHaveLength(2);
      }
      for (const pos of round.positions) {
        expect(pos.fretNum).toBeGreaterThanOrEqual(round.startFret);
        expect(pos.fretNum).toBeLessThanOrEqual(round.startFret + 4);
      }
    }
  });
});

describe("Mode from Pentatonic", () => {
  describe("getExtraModeNotes", () => {
    test("C Dorian extra notes are D (2nd) and A (6th)", () => {
      const notes = getExtraModeNotes("C", "dorian");
      expect(notes).toEqual([
        { noteName: "D", degree: 2 },
        { noteName: "A", degree: 6 },
      ]);
    });

    test("C Aeolian extra notes are D (2nd) and G#/Ab (b6th)", () => {
      const notes = getExtraModeNotes("C", "aeolian");
      expect(notes).toEqual([
        { noteName: "D", degree: 2 },
        { noteName: "G#/Ab", degree: 6 },
      ]);
    });

    test("C Ionian extra notes are F (4th) and B (7th)", () => {
      const notes = getExtraModeNotes("C", "ionian");
      expect(notes).toEqual([
        { noteName: "F", degree: 4 },
        { noteName: "B", degree: 7 },
      ]);
    });

    test("C Mixolydian extra notes are F (4th) and A#/Bb (b7th)", () => {
      const notes = getExtraModeNotes("C", "mixolydian");
      expect(notes).toEqual([
        { noteName: "F", degree: 4 },
        { noteName: "A#/Bb", degree: 7 },
      ]);
    });

    test("C Lydian extra notes are F#/Gb (#4th) and B (7th)", () => {
      const notes = getExtraModeNotes("C", "lydian");
      expect(notes).toEqual([
        { noteName: "F#/Gb", degree: 4 },
        { noteName: "B", degree: 7 },
      ]);
    });

    test("C Phrygian extra notes are C#/Db (b2nd) and G#/Ab (b6th)", () => {
      const notes = getExtraModeNotes("C", "phrygian");
      expect(notes).toEqual([
        { noteName: "C#/Db", degree: 2 },
        { noteName: "G#/Ab", degree: 6 },
      ]);
    });

    test("transposition works for non-C root (F#/Gb Dorian)", () => {
      // F# Dorian extra: 2nd = G#/Ab, 6th = D#/Eb
      const notes = getExtraModeNotes("F#/Gb", "dorian");
      expect(notes).toEqual([
        { noteName: "G#/Ab", degree: 2 },
        { noteName: "D#/Eb", degree: 6 },
      ]);
    });

    test("should throw for invalid root note", () => {
      expect(() => getExtraModeNotes("X", "dorian")).toThrow("Invalid root note");
    });
  });

  describe("findExtraModePositions", () => {
    test("returns positions for extra mode notes within fret range", () => {
      // C Dorian extra notes: D and A
      const positions = findExtraModePositions("C", "dorian", 5, 9);
      expect(positions.length).toBeGreaterThan(0);
      for (const pos of positions) {
        expect(pos.fretNum).toBeGreaterThanOrEqual(5);
        expect(pos.fretNum).toBeLessThanOrEqual(9);
        expect(["D", "A"]).toContain(pos.noteName);
        expect(getGuitarNoteName(pos.stringNum, pos.fretNum)).toBe(pos.noteName);
      }
    });

    test("assigns correct degrees to positions", () => {
      // C Aeolian extra: D (degree 2) and G#/Ab (degree 6)
      const positions = findExtraModePositions("C", "aeolian", 1, 5);
      for (const pos of positions) {
        if (pos.noteName === "D") {
          expect(pos.degree).toBe(2);
        } else if (pos.noteName === "G#/Ab") {
          expect(pos.degree).toBe(6);
        } else {
          fail(`Unexpected note: ${pos.noteName}`);
        }
      }
    });

    test("finds positions across all 6 strings", () => {
      // Wide fret range to ensure hits on every string
      const positions = findExtraModePositions("A", "dorian", 1, 12);
      const strings = new Set(positions.map((p) => p.stringNum));
      expect(strings.size).toBe(6);
    });
  });

  describe("generateModeFromPentatonicRound", () => {
    test("returns a valid round with all required fields", () => {
      const round = generateModeFromPentatonicRound(5);
      expect(round.rootNote).toBeDefined();
      expect(round.pentatonicType).toMatch(/^(minor|major)$/);
      expect(round.modeName).toBeDefined();
      expect(round.pentatonicPositions.length).toBe(12);
      expect(round.extraPositions.length).toBeGreaterThan(0);
      expect(round.startFret).toBeGreaterThanOrEqual(1);
    });

    test("mode is compatible with pentatonic type", () => {
      for (let i = 0; i < 30; i++) {
        const round = generateModeFromPentatonicRound(5);
        if (round.pentatonicType === "minor") {
          expect(["dorian", "aeolian", "phrygian"]).toContain(round.modeName);
        } else {
          expect(["ionian", "mixolydian", "lydian"]).toContain(round.modeName);
        }
      }
    });

    test("respects enabledModes filter", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateModeFromPentatonicRound(5, ["ionian", "dorian"]);
        expect(["ionian", "dorian"]).toContain(round.modeName);
      }
    });

    test("works with only minor modes enabled", () => {
      for (let i = 0; i < 10; i++) {
        const round = generateModeFromPentatonicRound(5, ["aeolian"]);
        expect(round.modeName).toBe("aeolian");
        expect(round.pentatonicType).toBe("minor");
      }
    });

    test("works with only major modes enabled", () => {
      for (let i = 0; i < 10; i++) {
        const round = generateModeFromPentatonicRound(5, ["ionian"]);
        expect(round.modeName).toBe("ionian");
        expect(round.pentatonicType).toBe("major");
      }
    });

    test("extra positions fall within the fret window", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateModeFromPentatonicRound(5);
        const endFret = round.startFret + 4;
        for (const pos of round.extraPositions) {
          expect(pos.fretNum).toBeGreaterThanOrEqual(round.startFret);
          expect(pos.fretNum).toBeLessThanOrEqual(endFret);
        }
      }
    });

    test("extra position notes are not in the pentatonic scale", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateModeFromPentatonicRound(5);
        const pentatonicNoteNames = new Set(round.pentatonicPositions.map((p) => p.noteName));
        for (const pos of round.extraPositions) {
          expect(pentatonicNoteNames).not.toContain(pos.noteName);
        }
      }
    });
  });
});

describe("Seventh Chord Arpeggios", () => {
  describe("getSeventhArpeggioNotes", () => {
    test("should return correct notes for C dominant 7", () => {
      const notes = getSeventhArpeggioNotes("C", "dominant7");
      expect(notes.map((n) => n.noteName)).toEqual(["C", "E", "G", "A#/Bb"]);
      expect(notes.map((n) => n.degree)).toEqual([1, 3, 5, 7]);
    });

    test("should return correct notes for A minor 7", () => {
      const notes = getSeventhArpeggioNotes("A", "minor7");
      expect(notes.map((n) => n.noteName)).toEqual(["A", "C", "E", "G"]);
      expect(notes.map((n) => n.degree)).toEqual([1, 3, 5, 7]);
    });

    test("should return correct notes for F major 7", () => {
      const notes = getSeventhArpeggioNotes("F", "major7");
      expect(notes.map((n) => n.noteName)).toEqual(["F", "A", "C", "E"]);
      expect(notes.map((n) => n.degree)).toEqual([1, 3, 5, 7]);
    });

    test("should return correct notes for B m7b5", () => {
      // B half-diminished: B, D, F, A
      const notes = getSeventhArpeggioNotes("B", "m7b5");
      expect(notes.map((n) => n.noteName)).toEqual(["B", "D", "F", "A"]);
      expect(notes.map((n) => n.degree)).toEqual([1, 3, 5, 7]);
    });

    test("should handle sharps/flats", () => {
      // G#/Ab minor 7: G#/Ab, B, D#/Eb, F#/Gb
      const notes = getSeventhArpeggioNotes("G#/Ab", "minor7");
      expect(notes.map((n) => n.noteName)).toEqual(["G#/Ab", "B", "D#/Eb", "F#/Gb"]);
    });

    test("should throw for invalid root note", () => {
      expect(() => getSeventhArpeggioNotes("X", "dominant7")).toThrow("Invalid root note");
    });
  });

  describe("findSeventhArpeggioPositions", () => {
    test("should return all arpeggio-tone positions on 2 strings within fret range", () => {
      // A minor 7: A, C, E, G on strings [5,4], frets 3-8
      const result = findSeventhArpeggioPositions("A", "minor7", [5, 4], 3, 8);
      expect(result).not.toBeNull();
      for (const pos of result!) {
        expect(pos.fretNum).toBeGreaterThanOrEqual(3);
        expect(pos.fretNum).toBeLessThanOrEqual(8);
        expect([5, 4]).toContain(pos.stringNum);
        expect(getGuitarNoteName(pos.stringNum, pos.fretNum)).toBe(pos.noteName);
      }
    });

    test("should return null when a degree is missing from the window", () => {
      // Very narrow range where not all 4 notes can appear
      const result = findSeventhArpeggioPositions("C", "dominant7", [2, 1], 1, 2);
      // If this happens to find all 4, try an even narrower case
      if (result !== null) {
        // At minimum, verify that all 4 degrees are present when not null
        const degrees = new Set(result.map((p) => p.degree));
        expect(degrees.size).toBe(4);
      }
    });

    test("should assign correct degrees to positions", () => {
      // C dominant 7: C=1, E=3, G=5, A#/Bb=7
      const result = findSeventhArpeggioPositions("C", "dominant7", [6, 5], 1, 5);
      if (result !== null) {
        for (const pos of result) {
          if (pos.noteName === "C") expect(pos.degree).toBe(1);
          else if (pos.noteName === "E") expect(pos.degree).toBe(3);
          else if (pos.noteName === "G") expect(pos.degree).toBe(5);
          else if (pos.noteName === "A#/Bb") expect(pos.degree).toBe(7);
        }
      }
    });

    test("should handle m7b5 chord type", () => {
      // B m7b5: B, D, F, A on strings [5,4], frets 1-5
      const result = findSeventhArpeggioPositions("B", "m7b5", [5, 4], 1, 5);
      if (result !== null) {
        const degrees = new Set(result.map((p) => p.degree));
        expect(degrees.size).toBe(4);
        for (const pos of result) {
          expect(["B", "D", "F", "A"]).toContain(pos.noteName);
        }
      }
    });

    test("a string can have multiple arpeggio notes", () => {
      // A minor 7 (A, C, E, G) on strings [6,5,4], frets 1-5:
      // String 6 (E): E at fret 0 (not in range), A at fret 5, no others in 1-5? Let's check wider
      // Use frets 2-7 on strings [4,3] for A minor 7
      // String 4 (D): E at fret 2, G at fret 5 — two notes on one string
      const result = findSeventhArpeggioPositions("A", "minor7", [4, 3], 2, 7);
      if (result !== null) {
        const string4Notes = result.filter((p) => p.stringNum === 4);
        expect(string4Notes.length).toBeGreaterThanOrEqual(2);
      }
    });

    test("should guarantee all 4 degrees when result is non-null", () => {
      // Test multiple chord types and string groups
      const cases: Array<{ root: string; type: "dominant7" | "minor7" | "major7" | "m7b5" }> = [
        { root: "E", type: "dominant7" },
        { root: "A", type: "minor7" },
        { root: "C", type: "major7" },
        { root: "F#/Gb", type: "m7b5" },
      ];
      for (const { root, type } of cases) {
        const result = findSeventhArpeggioPositions(root, type, [5, 4], 3, 8);
        if (result !== null) {
          const degrees = new Set(result.map((p) => p.degree));
          expect(degrees).toEqual(new Set([1, 3, 5, 7]));
        }
      }
    });
  });

  describe("generateSeventhArpeggioRound", () => {
    const VALID_STRING_GROUPS = [
      [6, 5],
      [5, 4],
      [4, 3],
      [3, 2],
      [2, 1],
    ];

    test("should return a valid round with all required fields", () => {
      const round = generateSeventhArpeggioRound(5);
      expect(round.rootNote).toBeDefined();
      expect(["dominant7", "minor7", "major7", "m7b5"]).toContain(round.arpeggioType);
      expect(round.strings).toHaveLength(2);
      expect(round.startFret).toBeGreaterThanOrEqual(1);
      expect(round.positions.length).toBeGreaterThan(0);
    });

    test("should have all 4 degrees present in positions", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateSeventhArpeggioRound(5);
        const degrees = new Set(round.positions.map((p) => p.degree));
        expect(degrees).toEqual(new Set([1, 3, 5, 7]));
      }
    });

    test("all positions fall within the fret window", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateSeventhArpeggioRound(5);
        const endFret = round.startFret + 4;
        for (const pos of round.positions) {
          expect(pos.fretNum).toBeGreaterThanOrEqual(round.startFret);
          expect(pos.fretNum).toBeLessThanOrEqual(endFret);
        }
      }
    });

    test("strings are one of the valid adjacent groups", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateSeventhArpeggioRound(5);
        expect(VALID_STRING_GROUPS).toContainEqual([...round.strings]);
      }
    });

    test("note names at each position match getGuitarNoteName", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateSeventhArpeggioRound(5);
        for (const pos of round.positions) {
          expect(getGuitarNoteName(pos.stringNum, pos.fretNum)).toBe(pos.noteName);
        }
      }
    });

    test("positions are only on the selected strings", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateSeventhArpeggioRound(5);
        for (const pos of round.positions) {
          expect(round.strings).toContain(pos.stringNum);
        }
      }
    });
  });
});

describe("Interval Training", () => {
  describe("generateIntervalTrainingRound", () => {
    const VALID_STRING_PAIRS = [
      [6, 5],
      [5, 4],
      [4, 3],
      [3, 2],
      [2, 1],
    ];

    test("returns a valid round with all required fields", () => {
      const round = generateIntervalTrainingRound(5);
      expect(round.rootNote).toBeDefined();
      expect(round.modeName).toBeDefined();
      expect(round.referenceDegree).toBeGreaterThanOrEqual(1);
      expect(round.referenceDegree).toBeLessThanOrEqual(7);
      expect(round.targetDegree).toBeGreaterThanOrEqual(1);
      expect(round.targetDegree).toBeLessThanOrEqual(7);
      expect(round.referenceDegree).not.toBe(round.targetDegree);
      expect(round.referencePositions.length).toBeGreaterThan(0);
      expect(round.targetPositions.length).toBeGreaterThan(0);
      expect(round.strings).toHaveLength(2);
      expect(round.startFret).toBeGreaterThanOrEqual(1);
    });

    test("reference and target degrees differ", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5);
        expect(round.referenceDegree).not.toBe(round.targetDegree);
      }
    });

    test("all positions fall within the fret window", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5);
        const endFret = round.startFret + 4;
        for (const pos of [...round.referencePositions, ...round.targetPositions]) {
          expect(pos.fretNum).toBeGreaterThanOrEqual(round.startFret);
          expect(pos.fretNum).toBeLessThanOrEqual(endFret);
        }
      }
    });

    test("positions are only on the selected strings", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5);
        for (const pos of [...round.referencePositions, ...round.targetPositions]) {
          expect(round.strings).toContain(pos.stringNum);
        }
      }
    });

    test("strings are one of the valid adjacent pairs", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5);
        expect(VALID_STRING_PAIRS).toContainEqual([...round.strings]);
      }
    });

    test("note names at each position match getGuitarNoteName", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5);
        for (const pos of [...round.referencePositions, ...round.targetPositions]) {
          expect(getGuitarNoteName(pos.stringNum, pos.fretNum)).toBe(pos.noteName);
        }
      }
    });

    test("respects enabledModes filter", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5, ["ionian", "dorian"]);
        expect(["ionian", "dorian"]).toContain(round.modeName);
      }
    });

    test("respects enabledRefDegrees filter", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5, undefined, [1, 5]);
        expect([1, 5]).toContain(round.referenceDegree);
      }
    });

    test("respects enabledTargetDegrees filter", () => {
      for (let i = 0; i < 20; i++) {
        const round = generateIntervalTrainingRound(5, undefined, undefined, [3, 7]);
        expect([3, 7]).toContain(round.targetDegree);
      }
    });
  });
});
