import _ from "lodash";

export function getGuitarStringsDisclaimer(): string {
  return "Note that string 1 is high E string and string 6 is the low E string.";
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
