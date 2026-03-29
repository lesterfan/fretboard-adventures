import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  generatePentatonicRound,
  PentatonicRound,
  PENTATONIC_DEGREE_LABELS,
  DEGREE_COLORS,
} from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const PentatonicScalePositions: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const [round, setRound] = useState<PentatonicRound>(() =>
    generatePentatonicRound(NUM_FRETS_TO_SHOW)
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setRound(generatePentatonicRound(NUM_FRETS_TO_SHOW));
    setShowAnswer(false);
    onNext?.();
  };

  const { rootNote, pentatonicType, positions, startFret } = round;

  const markers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: PENTATONIC_DEGREE_LABELS[pentatonicType][p.degree],
    color: DEGREE_COLORS[p.degree],
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Find the {rootNote} {pentatonicType} pentatonic scale here
        </b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? markers : []}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[1, 2, 3, 4, 5, 6]}
      />
      <AnswerButtonList
        showingAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onNext={handleNext}
      />
    </>
  );
};

export default PentatonicScalePositions;
