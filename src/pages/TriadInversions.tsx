import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  generateTriadRound,
  TriadRound,
  TRIAD_DEGREE_LABELS,
  DEGREE_COLORS,
  articleForNote,
} from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const TriadInversions: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const [round, setRound] = useState<TriadRound>(() => generateTriadRound(NUM_FRETS_TO_SHOW));
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setRound(generateTriadRound(NUM_FRETS_TO_SHOW));
    setShowAnswer(false);
    onNext?.();
  };

  const { rootNote, triadType, positions, strings, startFret } = round;

  const markers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: TRIAD_DEGREE_LABELS[triadType][p.degree],
    color: DEGREE_COLORS[p.degree],
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Find {articleForNote(rootNote)}{" "}
          <span style={{ color: "#1976d2" }}>
            {rootNote} {triadType}
          </span>{" "}
          triad inversion here
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

export default TriadInversions;
