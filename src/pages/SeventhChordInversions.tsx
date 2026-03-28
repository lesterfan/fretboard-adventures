import React, { useState } from "react";
import { Typography, FormControlLabel, Checkbox } from "@mui/material";
import { generateSeventhChordRound, SeventhChordRound } from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const CHORD_TYPE_LABEL: Record<string, string> = {
  dominant7: "dominant 7",
  minor7: "minor 7",
  major7: "major 7",
};

const SeventhChordInversions: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const [round, setRound] = useState<SeventhChordRound>(() =>
    generateSeventhChordRound(NUM_FRETS_TO_SHOW)
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDegrees, setShowDegrees] = useState(true);

  const handleNext = () => {
    setRound(generateSeventhChordRound(NUM_FRETS_TO_SHOW));
    setShowAnswer(false);
    onNext?.();
  };

  const { rootNote, chordType, positions, strings, startFret } = round;

  const markers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: showDegrees ? String(p.degree) : p.noteName,
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Find a {rootNote} {CHORD_TYPE_LABEL[chordType]} inversion here
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

export default SeventhChordInversions;
