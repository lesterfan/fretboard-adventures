import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  generateSeventhArpeggioRound,
  SeventhArpeggioRound,
  SEVENTH_ARPEGGIO_DEGREE_LABELS,
  SEVENTH_ARPEGGIO_DISPLAY_NAMES,
  DEGREE_COLORS,
} from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const SeventhChordArpeggios: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const [round, setRound] = useState<SeventhArpeggioRound>(() =>
    generateSeventhArpeggioRound(NUM_FRETS_TO_SHOW)
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setRound(generateSeventhArpeggioRound(NUM_FRETS_TO_SHOW));
    setShowAnswer(false);
    onNext?.();
  };

  const { rootNote, arpeggioType, positions, strings, startFret } = round;
  const degreeLabels = SEVENTH_ARPEGGIO_DEGREE_LABELS[arpeggioType];

  const markers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: degreeLabels[p.degree],
    color: DEGREE_COLORS[p.degree],
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Find all{" "}
          <span style={{ color: "#1976d2" }}>
            {rootNote} {SEVENTH_ARPEGGIO_DISPLAY_NAMES[arpeggioType]}
          </span>{" "}
          arpeggio notes here
        </b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? markers : []}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[...strings]}
      />
      <AnswerButtonList
        showingAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onNext={handleNext}
      />
    </>
  );
};

export default SeventhChordArpeggios;
