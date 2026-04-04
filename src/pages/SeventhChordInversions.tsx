import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  generateSeventhChordRound,
  SeventhChordRound,
  SEVENTH_DEGREE_LABELS,
  DEGREE_COLORS,
  articleForNote,
} from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const CHORD_TYPE_LABEL: Record<string, string> = {
  dominant7: "dominant 7",
  minor7: "minor 7",
  major7: "major 7",
  m7b5: "m7b5 (half diminished)",
};

const SeventhChordInversions: React.FC = () => {
  const [round] = useState<SeventhChordRound>(() => generateSeventhChordRound(NUM_FRETS_TO_SHOW));
  const [showAnswer, setShowAnswer] = useState(false);

  const { rootNote, chordType, positions, strings, startFret } = round;

  const markers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: SEVENTH_DEGREE_LABELS[chordType][p.degree],
    color: DEGREE_COLORS[p.degree],
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Find {articleForNote(rootNote)}{" "}
          <span style={{ color: "#1976d2" }}>
            {rootNote} {CHORD_TYPE_LABEL[chordType]}
          </span>{" "}
          inversion here
        </b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? markers : []}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[...strings]}
      />
      <AnswerButtonList showingAnswer={showAnswer} onShowAnswer={() => setShowAnswer(true)} />
    </>
  );
};

export default SeventhChordInversions;
