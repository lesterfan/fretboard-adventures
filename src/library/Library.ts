import _ from "lodash";

export type TriadType = "major" | "minor" | "diminished";
export type Inversion = "root" | "first" | "second";

export interface TriadPosition {
  stringNum: number;
  fretNum: number;
  degree: number; // 1, 3, or 5
  noteName: string;
}

export interface TriadRound {
  rootNote: string;
  triadType: TriadType;
  inversion: Inversion;
  strings: [number, number, number];
  startFret: number;
  positions: TriadPosition[];
}

function getMusicalNoteNames(): string[] {
  return ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
}

export function getRandomMuscialNoteName(): string {
  return _.sample(getMusicalNoteNames()) as string;
}

/** Returns "a" or "an" depending on whether the note name starts with a vowel sound. */
export function articleForNote(noteName: string): "a" | "an" {
  return /^[AEF]/.test(noteName) ? "an" : "a";
}

/**
 * Assume the guitar has six strings. Actual tuning will be reversed of rawTuning due to the standard
 * guitar notation (i.e. first string is the highest string rather than the lowest string).
 */
export function getGuitarNoteName(
  stringNum: number,
  fretNum: number,
  rawTuning: string[] = ["E", "A", "D", "G", "B", "E"]
): string {
  if (stringNum < 1 || stringNum > 6) {
    throw new Error("Invalid string number");
  } else if (fretNum < 0) {
    throw new Error("Fret number cannot be negative");
  }
  const noteNames = getMusicalNoteNames();
  const tuning = [...rawTuning].reverse();
  if (tuning.length !== 6 || !tuning.every((note) => noteNames.includes(note))) {
    throw new Error(`Invalid tuning; each note must be one of ${noteNames}`);
  }
  const stringNote = tuning[stringNum - 1];
  const stringNoteIndex = noteNames.indexOf(stringNote);
  return noteNames[(stringNoteIndex + fretNum) % noteNames.length];
}

const TRIAD_SEMITONES: Record<TriadType, [number, number, number]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
};

export const DEGREE_COLORS: Record<number, string> = {
  1: "#1976d2", // blue — root
  2: "#9e9e9e", // grey — second
  3: "#7b1fa2", // purple — third
  4: "#9e9e9e", // grey — fourth
  5: "#2e7d32", // green — fifth
  6: "#9e9e9e", // grey — sixth
  7: "#795548", // brown — seventh
};

export const SECONDARY_DEGREE_COLORS: Record<number, string> = {
  2: "#00838f", // teal — second
  4: "#c62828", // red — fourth
  6: "#e65100", // orange — sixth
  7: "#6a1b9a", // deep purple — seventh
};

export const TRIAD_DEGREE_LABELS: Record<TriadType, Record<number, string>> = {
  major: { 1: "1", 3: "3", 5: "5" },
  minor: { 1: "1", 3: "b3", 5: "5" },
  diminished: { 1: "1", 3: "b3", 5: "b5" },
};

// Degrees assigned to strings [lowest, middle, highest] for each inversion
const INVERSION_DEGREES: Record<Inversion, [number, number, number]> = {
  root: [1, 3, 5],
  first: [3, 5, 1],
  second: [5, 1, 3],
};

export function getTriadNotes(rootNote: string, type: TriadType): [string, string, string] {
  const noteNames = getMusicalNoteNames();
  const rootIndex = noteNames.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }
  const semitones = TRIAD_SEMITONES[type];
  return semitones.map((s) => noteNames[(rootIndex + s) % 12]) as [string, string, string];
}

export function findTriadPositions(
  rootNote: string,
  type: TriadType,
  inversion: Inversion,
  strings: [number, number, number],
  startFret: number,
  endFret: number
): TriadPosition[] | null {
  const [note1, note3, note5] = getTriadNotes(rootNote, type);
  const degreeToNote: Record<number, string> = { 1: note1, 3: note3, 5: note5 };
  const degrees = INVERSION_DEGREES[inversion];

  const positions: TriadPosition[] = [];
  for (let i = 0; i < 3; i++) {
    const stringNum = strings[i];
    const degree = degrees[i];
    const targetNote = degreeToNote[degree];
    let found = false;
    for (let fretNum = startFret; fretNum <= endFret; fretNum++) {
      if (getGuitarNoteName(stringNum, fretNum) === targetNote) {
        positions.push({ stringNum, fretNum, degree, noteName: targetNote });
        found = true;
        break;
      }
    }
    if (!found) return null;
  }
  return positions;
}

const ADJACENT_STRING_GROUPS: [number, number, number][] = [
  [6, 5, 4],
  [5, 4, 3],
  [4, 3, 2],
  [3, 2, 1],
];

const TRIAD_TYPES: TriadType[] = ["major", "minor", "diminished"];
const INVERSIONS: Inversion[] = ["root", "first", "second"];

export function generateTriadRound(numFretsToShow: number): TriadRound {
  const maxStartFret = 12 - numFretsToShow + 1;
  let rootNote: string;
  let triadType: TriadType;
  let inversion: Inversion;
  let strings: [number, number, number];
  let startFret: number;
  let positions: TriadPosition[] | null;
  do {
    rootNote = getRandomMuscialNoteName();
    triadType = _.sample(TRIAD_TYPES) as TriadType;
    inversion = _.sample(INVERSIONS) as Inversion;
    strings = _.sample(ADJACENT_STRING_GROUPS) as [number, number, number];
    startFret = _.random(1, maxStartFret);
    positions = findTriadPositions(
      rootNote,
      triadType,
      inversion,
      strings,
      startFret,
      startFret + numFretsToShow - 1
    );
  } while (positions === null);
  return { rootNote, triadType, inversion, strings, startFret, positions };
}

// --- Seventh Chord Logic ---

export type SeventhChordType = "dominant7" | "minor7" | "major7" | "m7b5";
export type SeventhChordInversion = "root" | "first" | "second" | "third";

export interface SeventhChordPosition {
  stringNum: number;
  fretNum: number;
  degree: number; // 1, 3, 5, or 7
  noteName: string;
}

export interface SeventhChordRound {
  rootNote: string;
  chordType: SeventhChordType;
  inversion: SeventhChordInversion;
  strings: [number, number, number, number];
  startFret: number;
  positions: SeventhChordPosition[];
}

const SEVENTH_CHORD_SEMITONES: Record<SeventhChordType, [number, number, number, number]> = {
  dominant7: [0, 4, 7, 10],
  minor7: [0, 3, 7, 10],
  major7: [0, 4, 7, 11],
  m7b5: [0, 3, 6, 10],
};

export const SEVENTH_DEGREE_LABELS: Record<SeventhChordType, Record<number, string>> = {
  dominant7: { 1: "1", 3: "3", 5: "5", 7: "b7" },
  minor7: { 1: "1", 3: "b3", 5: "5", 7: "b7" },
  major7: { 1: "1", 3: "3", 5: "5", 7: "7" },
  m7b5: { 1: "1", 3: "b3", 5: "b5", 7: "b7" },
};

const SEVENTH_INVERSION_DEGREES: Record<SeventhChordInversion, [number, number, number, number]> = {
  root: [1, 7, 3, 5],
  first: [3, 1, 5, 7],
  second: [5, 3, 7, 1],
  third: [7, 5, 1, 3],
};

const SEVENTH_CHORD_STRINGS: [number, number, number, number] = [6, 4, 3, 2];
const SEVENTH_CHORD_TYPES: SeventhChordType[] = ["dominant7", "minor7", "major7", "m7b5"];
const SEVENTH_INVERSIONS: SeventhChordInversion[] = ["root", "first", "second", "third"];

export function getSeventhChordNotes(
  rootNote: string,
  type: SeventhChordType
): [string, string, string, string] {
  const noteNames = getMusicalNoteNames();
  const rootIndex = noteNames.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }
  const semitones = SEVENTH_CHORD_SEMITONES[type];
  return semitones.map((s) => noteNames[(rootIndex + s) % 12]) as [string, string, string, string];
}

export function findSeventhChordPositions(
  rootNote: string,
  type: SeventhChordType,
  inversion: SeventhChordInversion,
  strings: [number, number, number, number],
  startFret: number,
  endFret: number
): SeventhChordPosition[] | null {
  const [note1, note3, note5, note7] = getSeventhChordNotes(rootNote, type);
  const degreeToNote: Record<number, string> = { 1: note1, 3: note3, 5: note5, 7: note7 };
  const degrees = SEVENTH_INVERSION_DEGREES[inversion];

  const positions: SeventhChordPosition[] = [];
  for (let i = 0; i < 4; i++) {
    const stringNum = strings[i];
    const degree = degrees[i];
    const targetNote = degreeToNote[degree];
    let found = false;
    for (let fretNum = startFret; fretNum <= endFret; fretNum++) {
      if (getGuitarNoteName(stringNum, fretNum) === targetNote) {
        positions.push({ stringNum, fretNum, degree, noteName: targetNote });
        found = true;
        break;
      }
    }
    if (!found) return null;
  }
  return positions;
}

export function generateSeventhChordRound(numFretsToShow: number): SeventhChordRound {
  const maxStartFret = 12 - numFretsToShow + 1;
  let rootNote: string;
  let chordType: SeventhChordType;
  let inversion: SeventhChordInversion;
  let startFret: number;
  let positions: SeventhChordPosition[] | null;
  do {
    rootNote = getRandomMuscialNoteName();
    chordType = _.sample(SEVENTH_CHORD_TYPES) as SeventhChordType;
    inversion = _.sample(SEVENTH_INVERSIONS) as SeventhChordInversion;
    startFret = _.random(1, maxStartFret);
    const endFret = startFret + numFretsToShow - 1;
    positions = findSeventhChordPositions(
      rootNote,
      chordType,
      inversion,
      SEVENTH_CHORD_STRINGS,
      startFret,
      endFret
    );
    // Reject if multiple inversions fit — the question must have a unique answer
    if (positions !== null) {
      const fittingInversions = SEVENTH_INVERSIONS.filter(
        (inv) =>
          findSeventhChordPositions(
            rootNote,
            chordType,
            inv,
            SEVENTH_CHORD_STRINGS,
            startFret,
            endFret
          ) !== null
      );
      if (fittingInversions.length > 1) positions = null;
    }
  } while (positions === null);
  return {
    rootNote,
    chordType,
    inversion,
    strings: SEVENTH_CHORD_STRINGS,
    startFret,
    positions,
  };
}

export function findNotePositions(
  noteName: string,
  startFret: number,
  endFret: number,
  strings: number[]
): { stringNum: number; fretNum: number }[] {
  const positions: { stringNum: number; fretNum: number }[] = [];
  for (const stringNum of strings) {
    for (let fretNum = startFret; fretNum <= endFret; fretNum++) {
      if (getGuitarNoteName(stringNum, fretNum) === noteName) {
        positions.push({ stringNum, fretNum });
      }
    }
  }
  return positions;
}

// --- Pentatonic Scale Logic ---

export type PentatonicType = "minor" | "major";

export interface PentatonicPosition {
  stringNum: number;
  fretNum: number;
  degree: number;
  noteName: string;
}

export interface PentatonicRound {
  rootNote: string;
  pentatonicType: PentatonicType;
  positions: PentatonicPosition[];
  startFret: number;
}

const PENTATONIC_SEMITONES: Record<PentatonicType, number[]> = {
  minor: [0, 3, 5, 7, 10], // 1, b3, 4, 5, b7
  major: [0, 2, 4, 7, 9], // 1, 2, 3, 5, 6
};

const PENTATONIC_DEGREE_MAP: Record<PentatonicType, Record<number, number>> = {
  minor: { 0: 1, 3: 3, 5: 4, 7: 5, 10: 7 },
  major: { 0: 1, 2: 2, 4: 3, 7: 5, 9: 6 },
};

export const PENTATONIC_DEGREE_LABELS: Record<PentatonicType, Record<number, string>> = {
  minor: { 1: "1", 3: "b3", 4: "4", 5: "5", 7: "b7" },
  major: { 1: "1", 2: "2", 3: "3", 5: "5", 6: "6" },
};

export function getPentatonicNotes(
  rootNote: string,
  type: PentatonicType
): { noteName: string; degree: number }[] {
  const noteNames = getMusicalNoteNames();
  const rootIndex = noteNames.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }
  const semitones = PENTATONIC_SEMITONES[type];
  const degreeMap = PENTATONIC_DEGREE_MAP[type];
  return semitones.map((s) => ({
    noteName: noteNames[(rootIndex + s) % 12],
    degree: degreeMap[s],
  }));
}

const ALL_STRINGS = [1, 2, 3, 4, 5, 6];
const PENTATONIC_TYPES: PentatonicType[] = ["minor", "major"];

export function findPentatonicBoxPositions(
  rootNote: string,
  type: PentatonicType,
  startFret: number,
  endFret: number
): PentatonicPosition[] | null {
  const scaleNotes = getPentatonicNotes(rootNote, type);
  const noteToDegreeLookup: Record<string, number> = {};
  for (const { noteName, degree } of scaleNotes) {
    noteToDegreeLookup[noteName] = degree;
  }

  const positions: PentatonicPosition[] = [];
  for (const stringNum of ALL_STRINGS) {
    const stringPositions: PentatonicPosition[] = [];
    for (let fretNum = startFret; fretNum <= endFret; fretNum++) {
      const noteName = getGuitarNoteName(stringNum, fretNum);
      if (noteName in noteToDegreeLookup) {
        stringPositions.push({
          stringNum,
          fretNum,
          degree: noteToDegreeLookup[noteName],
          noteName,
        });
      }
    }
    // A complete box position requires exactly 2 notes per string
    if (stringPositions.length !== 2) return null;
    positions.push(...stringPositions);
  }
  return positions;
}

export function generatePentatonicRound(
  numFretsToShow: number,
  constrainType?: PentatonicType
): PentatonicRound {
  const maxStartFret = 12 - numFretsToShow + 1;
  let rootNote: string;
  let pentatonicType: PentatonicType;
  let startFret: number;
  let positions: PentatonicPosition[] | null;
  do {
    rootNote = getRandomMuscialNoteName();
    pentatonicType = constrainType ?? (_.sample(PENTATONIC_TYPES) as PentatonicType);
    startFret = _.random(1, maxStartFret);
    positions = findPentatonicBoxPositions(
      rootNote,
      pentatonicType,
      startFret,
      startFret + numFretsToShow - 1
    );
  } while (positions === null);
  return { rootNote, pentatonicType, positions, startFret };
}

// --- Mode from Pentatonic Logic ---

export type ModeName = "dorian" | "aeolian" | "phrygian" | "ionian" | "mixolydian" | "lydian";

export interface ModeExtraPosition {
  stringNum: number;
  fretNum: number;
  degree: number;
  noteName: string;
}

export interface ModeFromPentatonicRound {
  rootNote: string;
  pentatonicType: PentatonicType;
  modeName: ModeName;
  pentatonicPositions: PentatonicPosition[];
  extraPositions: ModeExtraPosition[];
  startFret: number;
}

const MODE_EXTRA_SEMITONES: Record<ModeName, number[]> = {
  dorian: [2, 9],
  aeolian: [2, 8],
  phrygian: [1, 8],
  ionian: [5, 11],
  mixolydian: [5, 10],
  lydian: [6, 11],
};

const MODE_EXTRA_DEGREE_MAP: Record<ModeName, Record<number, number>> = {
  dorian: { 2: 2, 9: 6 },
  aeolian: { 2: 2, 8: 6 },
  phrygian: { 1: 2, 8: 6 },
  ionian: { 5: 4, 11: 7 },
  mixolydian: { 5: 4, 10: 7 },
  lydian: { 6: 4, 11: 7 },
};

export const MODE_EXTRA_DEGREE_LABELS: Record<ModeName, Record<number, string>> = {
  dorian: { 2: "2", 6: "6" },
  aeolian: { 2: "2", 6: "b6" },
  phrygian: { 2: "b2", 6: "b6" },
  ionian: { 4: "4", 7: "7" },
  mixolydian: { 4: "4", 7: "b7" },
  lydian: { 4: "#4", 7: "7" },
};

export const MINOR_MODES: ModeName[] = ["dorian", "aeolian", "phrygian"];
export const MAJOR_MODES: ModeName[] = ["lydian", "ionian", "mixolydian"];
export const ALL_MODES: ModeName[] = [
  "lydian",
  "ionian",
  "mixolydian",
  "dorian",
  "aeolian",
  "phrygian",
];

export const MODE_DISPLAY_NAMES: Record<ModeName, string> = {
  dorian: "Dorian",
  aeolian: "Aeolian",
  phrygian: "Phrygian",
  ionian: "Ionian",
  mixolydian: "Mixolydian",
  lydian: "Lydian",
};

export const MODE_PENTATONIC_TYPE: Record<ModeName, PentatonicType> = {
  dorian: "minor",
  aeolian: "minor",
  phrygian: "minor",
  ionian: "major",
  mixolydian: "major",
  lydian: "major",
};

export function getExtraModeNotes(
  rootNote: string,
  modeName: ModeName
): { noteName: string; degree: number }[] {
  const noteNames = getMusicalNoteNames();
  const rootIndex = noteNames.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }
  const semitones = MODE_EXTRA_SEMITONES[modeName];
  const degreeMap = MODE_EXTRA_DEGREE_MAP[modeName];
  return semitones.map((s) => ({
    noteName: noteNames[(rootIndex + s) % 12],
    degree: degreeMap[s],
  }));
}

export function findExtraModePositions(
  rootNote: string,
  modeName: ModeName,
  startFret: number,
  endFret: number
): ModeExtraPosition[] {
  const extraNotes = getExtraModeNotes(rootNote, modeName);
  const noteToDegreeLookup: Record<string, number> = {};
  for (const { noteName, degree } of extraNotes) {
    noteToDegreeLookup[noteName] = degree;
  }

  const positions: ModeExtraPosition[] = [];
  for (const stringNum of ALL_STRINGS) {
    for (let fretNum = startFret; fretNum <= endFret; fretNum++) {
      const noteName = getGuitarNoteName(stringNum, fretNum);
      if (noteName in noteToDegreeLookup) {
        positions.push({
          stringNum,
          fretNum,
          degree: noteToDegreeLookup[noteName],
          noteName,
        });
      }
    }
  }
  return positions;
}

// --- Seventh Chord Arpeggio Logic ---

export type SeventhArpeggioType = "dominant7" | "minor7" | "major7" | "m7b5";

export interface SeventhArpeggioPosition {
  stringNum: number;
  fretNum: number;
  degree: number; // 1, 3, 5, or 7
  noteName: string;
}

export interface SeventhArpeggioRound {
  rootNote: string;
  arpeggioType: SeventhArpeggioType;
  strings: [number, number];
  startFret: number;
  positions: SeventhArpeggioPosition[];
}

const SEVENTH_ARPEGGIO_SEMITONES: Record<SeventhArpeggioType, [number, number, number, number]> = {
  dominant7: [0, 4, 7, 10],
  minor7: [0, 3, 7, 10],
  major7: [0, 4, 7, 11],
  m7b5: [0, 3, 6, 10],
};

export const SEVENTH_ARPEGGIO_DEGREE_LABELS: Record<SeventhArpeggioType, Record<number, string>> = {
  dominant7: { 1: "1", 3: "3", 5: "5", 7: "b7" },
  minor7: { 1: "1", 3: "b3", 5: "5", 7: "b7" },
  major7: { 1: "1", 3: "3", 5: "5", 7: "7" },
  m7b5: { 1: "1", 3: "b3", 5: "b5", 7: "b7" },
};

export const SEVENTH_ARPEGGIO_DISPLAY_NAMES: Record<SeventhArpeggioType, string> = {
  dominant7: "dominant 7",
  minor7: "minor 7",
  major7: "major 7",
  m7b5: "m7b5 (half-diminished)",
};

const SEVENTH_ARPEGGIO_DEGREE_MAP: Record<number, number> = { 0: 1, 1: 3, 2: 5, 3: 7 };
const SEVENTH_ARPEGGIO_TYPES: SeventhArpeggioType[] = ["dominant7", "minor7", "major7", "m7b5"];

export function getSeventhArpeggioNotes(
  rootNote: string,
  type: SeventhArpeggioType
): [
  { noteName: string; degree: number },
  { noteName: string; degree: number },
  { noteName: string; degree: number },
  { noteName: string; degree: number },
] {
  const noteNames = getMusicalNoteNames();
  const rootIndex = noteNames.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }
  const semitones = SEVENTH_ARPEGGIO_SEMITONES[type];
  return semitones.map((s, i) => ({
    noteName: noteNames[(rootIndex + s) % 12],
    degree: SEVENTH_ARPEGGIO_DEGREE_MAP[i],
  })) as [
    { noteName: string; degree: number },
    { noteName: string; degree: number },
    { noteName: string; degree: number },
    { noteName: string; degree: number },
  ];
}

export function findSeventhArpeggioPositions(
  rootNote: string,
  type: SeventhArpeggioType,
  strings: [number, number],
  startFret: number,
  endFret: number
): SeventhArpeggioPosition[] | null {
  const arpeggioNotes = getSeventhArpeggioNotes(rootNote, type);
  const noteToDegreeLookup: Record<string, number> = {};
  for (const { noteName, degree } of arpeggioNotes) {
    noteToDegreeLookup[noteName] = degree;
  }

  const positions: SeventhArpeggioPosition[] = [];
  for (const stringNum of strings) {
    for (let fretNum = startFret; fretNum <= endFret; fretNum++) {
      const noteName = getGuitarNoteName(stringNum, fretNum);
      if (noteName in noteToDegreeLookup) {
        positions.push({
          stringNum,
          fretNum,
          degree: noteToDegreeLookup[noteName],
          noteName,
        });
      }
    }
  }

  // Reject if any of the 4 degrees is missing
  const foundDegrees = new Set(positions.map((p) => p.degree));
  if (foundDegrees.size < 4) return null;

  return positions;
}

const ADJACENT_STRING_PAIRS: [number, number][] = [
  [6, 5],
  [5, 4],
  [4, 3],
  [3, 2],
  [2, 1],
];

export function generateSeventhArpeggioRound(numFretsToShow: number): SeventhArpeggioRound {
  const maxStartFret = 12 - numFretsToShow + 1;
  let rootNote: string;
  let arpeggioType: SeventhArpeggioType;
  let strings: [number, number];
  let startFret: number;
  let positions: SeventhArpeggioPosition[] | null;
  do {
    rootNote = getRandomMuscialNoteName();
    arpeggioType = _.sample(SEVENTH_ARPEGGIO_TYPES) as SeventhArpeggioType;
    strings = _.sample(ADJACENT_STRING_PAIRS) as [number, number];
    startFret = _.random(1, maxStartFret);
    positions = findSeventhArpeggioPositions(
      rootNote,
      arpeggioType,
      strings,
      startFret,
      startFret + numFretsToShow - 1
    );
  } while (positions === null);
  return { rootNote, arpeggioType, strings, startFret, positions };
}

export function generateModeFromPentatonicRound(
  numFretsToShow: number,
  enabledModes: ModeName[] = ALL_MODES
): ModeFromPentatonicRound {
  const minorModes = enabledModes.filter((m) => MODE_PENTATONIC_TYPE[m] === "minor");
  const majorModes = enabledModes.filter((m) => MODE_PENTATONIC_TYPE[m] === "major");
  if (minorModes.length === 0 && majorModes.length === 0) {
    throw new Error("At least one mode must be enabled");
  }

  let pentatonicRound: PentatonicRound;
  let modeName!: ModeName;
  let extraPositions!: ModeExtraPosition[];
  do {
    pentatonicRound = generatePentatonicRound(numFretsToShow);
    const modes = pentatonicRound.pentatonicType === "minor" ? minorModes : majorModes;
    if (modes.length === 0) continue;
    modeName = _.sample(modes) as ModeName;
    extraPositions = findExtraModePositions(
      pentatonicRound.rootNote,
      modeName,
      pentatonicRound.startFret,
      pentatonicRound.startFret + numFretsToShow - 1
    );
  } while (!extraPositions || extraPositions.length === 0);
  return {
    rootNote: pentatonicRound.rootNote,
    pentatonicType: pentatonicRound.pentatonicType,
    modeName,
    pentatonicPositions: pentatonicRound.positions,
    extraPositions,
    startFret: pentatonicRound.startFret,
  };
}
