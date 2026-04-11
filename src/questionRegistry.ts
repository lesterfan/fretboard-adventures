export type QuestionTypeId =
  | "fretboard_recognition"
  | "note_on_a_string"
  | "triad_inversions"
  | "seventh_chord_inversions"
  | "minor_pentatonic"
  | "major_pentatonic"
  | "minor_pentatonic_degrees"
  | "major_pentatonic_degrees"
  | "mode_from_pentatonic"
  | "seventh_chord_arpeggios"
  | "interval_training";

export const ALL_QUESTION_TYPES: QuestionTypeId[] = [
  "fretboard_recognition",
  "note_on_a_string",
  "triad_inversions",
  "seventh_chord_inversions",
  "seventh_chord_arpeggios",
  "interval_training",
  "minor_pentatonic",
  "major_pentatonic",
  "minor_pentatonic_degrees",
  "major_pentatonic_degrees",
  "mode_from_pentatonic",
];

export const QUESTION_TYPE_DISPLAY_NAMES: Record<QuestionTypeId, string> = {
  fretboard_recognition: "Fretboard Recognition",
  note_on_a_string: "Note on a String",
  triad_inversions: "Triad Inversions",
  seventh_chord_inversions: "Seventh Chord Inversions",
  seventh_chord_arpeggios: "Seventh Chord Arpeggios",
  minor_pentatonic: "Minor Pentatonic Positions",
  major_pentatonic: "Major Pentatonic Positions",
  minor_pentatonic_degrees: "Minor Pentatonic Degrees",
  major_pentatonic_degrees: "Major Pentatonic Degrees",
  mode_from_pentatonic: "Mode from Pentatonic",
  interval_training: "Interval Training",
};
