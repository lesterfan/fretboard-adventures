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
const GRAY = "#9e9e9e";
const ROOT_COLOR = DEGREE_COLORS[1];

const PentatonicDegreeIdentification: React.FC = () => {
  const [round] = useState<PentatonicRound>(() => generatePentatonicRound(NUM_FRETS_TO_SHOW));
  const [showAnswer, setShowAnswer] = useState(false);

  const { rootNote, pentatonicType, positions, startFret } = round;
  const degreeLabels = PENTATONIC_DEGREE_LABELS[pentatonicType];

  const questionMarkers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    color: GRAY,
  }));

  const answerMarkers: FretboardMarker[] = positions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: degreeLabels[p.degree],
    color: p.degree === 1 ? ROOT_COLOR : GRAY,
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Find all the <span style={{ color: ROOT_COLOR }}>root</span> notes in this{" "}
          <span style={{ color: ROOT_COLOR }}>
            {rootNote} {pentatonicType}
          </span>{" "}
          pentatonic scale
        </b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? answerMarkers : questionMarkers}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[]}
      />
      <AnswerButtonList showingAnswer={showAnswer} onShowAnswer={() => setShowAnswer(true)} />
    </>
  );
};

export default PentatonicDegreeIdentification;
