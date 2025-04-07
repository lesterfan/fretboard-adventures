import _ from "lodash";

export function getGuitarStringsDisclaimer(): string {
  return "Note that string 1 the high E and string 6 is the low E";
}

export function getMusicalNoteNames(): string[] {
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

export function findFretGivenStringAndNote(
  stringNum: number,
  noteName: string,
  rawTuning: string[] = ["E", "A", "D", "G", "B", "E"]
): number {
  if (stringNum < 1 || stringNum > 6) {
    throw new Error("Invalid string number");
  }
  const noteNames = getMusicalNoteNames();
  if (!noteNames.includes(noteName)) {
    throw new Error(`Invalid note name; ${noteName} is not one of ${noteNames}`);
  }
  const tuning = [...rawTuning].reverse();
  if (tuning.length !== 6 || !tuning.every((note) => noteNames.includes(note))) {
    throw new Error(`Invalid tuning; each note must be one of ${noteNames}`);
  }
  let currNoteIndex = noteNames.indexOf(tuning[stringNum - 1]);
  let fretNum = 0;
  while (noteNames[currNoteIndex] !== noteName) {
    currNoteIndex = (currNoteIndex + 1) % noteNames.length;
    ++fretNum;
  }
  return fretNum;
}

export function getMajorKeyChordPattern(): string[] {
  return ["major", "minor", "minor", "major", "major", "minor", "diminished"];
}

export function getMajorKeyNotePattern(): string[] {
  return ["W", "W", "H", "W", "W", "W", "H"];
}

export function getMinorKeyChordPattern(): string[] {
  return ["minor", "diminished", "major", "minor", "major", "major", "major"];
}

export function getMinorKeyNotePattern(): string[] {
  return ["W", "H", "W", "W", "H", "W", "W"];
}

const KEY_CHORDS: { [key: string]: string[] } = {
  // Major keys (clockwise circle of fifths)
  C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  B: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
  "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
  "C#": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"],
  // Moving to flat keys
  F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  Bb: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  Eb: ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  Ab: ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],

  // Minor keys (counterclockwise circle of fifths)
  Am: ["Am", "Bdim", "C", "Dm", "E", "F", "G"],
  Em: ["Em", "F#dim", "G", "Am", "B", "C", "D"],
  Bm: ["Bm", "C#dim", "D", "Em", "F#", "G", "A"],
  "F#m": ["F#m", "G#dim", "A", "Bm", "C#", "D", "E"],
  "C#m": ["C#m", "D#dim", "E", "F#m", "G#", "A", "B"],
  "G#m": ["G#m", "A#dim", "B", "C#m", "D#", "E", "F#"],
  // Moving to flat keys
  Dm: ["Dm", "Edim", "F", "Gm", "A", "Bb", "C"],
  Gm: ["Gm", "Adim", "Bb", "Cm", "D", "Eb", "F"],
  Cm: ["Cm", "Ddim", "Eb", "Fm", "G", "Ab", "Bb"],
  Fm: ["Fm", "Gdim", "Ab", "Bbm", "C", "Db", "Eb"],
  Bbm: ["Bbm", "Cdim", "Db", "Ebm", "F", "Gb", "Ab"],
  Ebm: ["Ebm", "Fdim", "Gb", "Abm", "Bb", "Cb", "Db"],
};

export function getChordOfKey(keyName: string, chordNum: number): string {
  if (chordNum < 1 || chordNum > 7) {
    throw new Error("Invalid chord number");
  }
  const validKeyNames = _.keys(KEY_CHORDS);
  if (!_.includes(validKeyNames, keyName)) {
    throw new Error(`Invalid key name; ${keyName} is not one of ${validKeyNames}`);
  }
  const chords = KEY_CHORDS[keyName];
  return chords[chordNum - 1];
}

export function getRandomKeyName(includeMinorKeys: boolean): string {
  const allKeys = _.keys(KEY_CHORDS);
  const filteredKeys = includeMinorKeys ? allKeys : allKeys.filter((key) => !key.includes("m"));
  return _.sample(filteredKeys) as string;
}
