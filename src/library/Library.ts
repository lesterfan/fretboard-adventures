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
