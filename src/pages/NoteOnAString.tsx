import React, { useState } from "react";
import _ from "lodash";
import { findNotePositions, getRandomMuscialNoteName } from "../library/Library";
import { Typography } from "@mui/material";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;
const MAX_START_FRET = 12 - NUM_FRETS_TO_SHOW + 1; // 8
const ALL_STRINGS = [1, 2, 3, 4, 5, 6];

interface RoundParams {
  noteName: string;
  startFret: number;
  string: number;
}

const generateRound = (): RoundParams => {
  let noteName: string;
  let startFret: number;
  let string: number;
  do {
    noteName = getRandomMuscialNoteName();
    startFret = _.random(1, MAX_START_FRET);
    string = _.sample(ALL_STRINGS) as number;
  } while (
    findNotePositions(noteName, startFret, startFret + NUM_FRETS_TO_SHOW - 1, [string]).length === 0
  );
  return { noteName, startFret, string };
};

const NoteOnAString: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const [round, setRound] = useState<RoundParams>(generateRound);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setRound(generateRound());
    setShowAnswer(false);
    onNext?.();
  };

  const { noteName, startFret, string } = round;
  const endFret = startFret + NUM_FRETS_TO_SHOW - 1;
  const answerMarkers: FretboardMarker[] = findNotePositions(noteName, startFret, endFret, [
    string,
  ]);

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>Find a {noteName} note here</b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? answerMarkers : []}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[string]}
      />
      <AnswerButtonList
        showingAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onNext={handleNext}
      />
    </>
  );
};

export default NoteOnAString;
