import React, { useState } from "react";
import { getGuitarNoteName } from "../library/Library";
import _ from "lodash";
import { Typography } from "@mui/material";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const computeStartFret = (fretNum: number): number => {
  const halfWindow = Math.floor(NUM_FRETS_TO_SHOW / 2);
  let start = Math.max(1, fretNum - halfWindow);
  const end = Math.min(12, start + NUM_FRETS_TO_SHOW - 1);
  start = Math.max(1, end - NUM_FRETS_TO_SHOW + 1);
  return start;
};

const FretboardRecognition: React.FC = () => {
  const [stringNum] = useState<number>(() => _.random(1, 6));
  const [fretNum] = useState<number>(() => _.random(1, 12));
  const [showAnswer, setShowAnswer] = useState(false);

  const answer = getGuitarNoteName(stringNum, fretNum);

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>What note is at the marked position?</b>
      </Typography>
      <FretboardDiagram
        markers={[{ stringNum, fretNum, label: showAnswer ? answer : "?" }]}
        startFret={computeStartFret(fretNum)}
        numFretsToShow={NUM_FRETS_TO_SHOW}
      />
      <AnswerButtonList showingAnswer={showAnswer} onShowAnswer={() => setShowAnswer(true)} />
    </>
  );
};

export default FretboardRecognition;
