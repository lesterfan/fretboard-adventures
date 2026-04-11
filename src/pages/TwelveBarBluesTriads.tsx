import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  generateTwelveBarBluesRound,
  TwelveBarBluesRound,
  TRIAD_DEGREE_LABELS,
  DEGREE_COLORS,
} from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;
const REFERENCE_COLOR = "#9e9e9e";

const TwelveBarBluesTriads: React.FC = () => {
  const [round] = useState<TwelveBarBluesRound>(() =>
    generateTwelveBarBluesRound(NUM_FRETS_TO_SHOW)
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const {
    key,
    targetDegree,
    currentChordRoot,
    currentDegree,
    targetChordRoot,
    referencePositions,
    targetPositions,
    strings,
    startFret,
  } = round;

  const referenceMarkers: FretboardMarker[] = referencePositions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: p.degree === 1 ? currentChordRoot : undefined,
    color: REFERENCE_COLOR,
  }));

  const targetMarkers: FretboardMarker[] = targetPositions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: TRIAD_DEGREE_LABELS["major"][p.degree],
    color: DEGREE_COLORS[p.degree],
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          From this {currentDegree} triad of the <span style={{ color: "#1976d2" }}>{key}</span>{" "}
          12-bar blues, find a nearby{" "}
          <span style={{ color: "#1976d2" }}>
            {targetChordRoot} ({targetDegree}) triad
          </span>{" "}
        </b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? [...referenceMarkers, ...targetMarkers] : referenceMarkers}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[...strings]}
      />
      <AnswerButtonList showingAnswer={showAnswer} onShowAnswer={() => setShowAnswer(true)} />
    </>
  );
};

export default TwelveBarBluesTriads;
