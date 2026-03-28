import React, { useState } from "react";
import { Typography, FormControlLabel, Checkbox } from "@mui/material";
import { generateTriadRound, TriadRound } from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const TriadInversions: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const [round, setRound] = useState<TriadRound>(() => generateTriadRound(NUM_FRETS_TO_SHOW));
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDegrees, setShowDegrees] = useState(true);

  const handleNext = () => {
    setRound(generateTriadRound(NUM_FRETS_TO_SHOW));
    setShowAnswer(false);
    onNext?.();
  };

  const { rootNote, triadType, positions, strings, startFret } = round;

  const markers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: showDegrees ? String(p.degree) : p.noteName,
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Find a {rootNote} {triadType} triad inversion here
        </b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? markers : []}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[...strings]}
      />
      {showAnswer && (
        <FormControlLabel
          control={
            <Checkbox
              checked={showDegrees}
              onChange={(e) => setShowDegrees(e.target.checked)}
              size="small"
            />
          }
          label="Show interval degrees"
        />
      )}
      <AnswerButtonList
        showingAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onNext={handleNext}
      />
    </>
  );
};

export default TriadInversions;
