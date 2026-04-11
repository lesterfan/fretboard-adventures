import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  generateIntervalTrainingRound,
  IntervalTrainingRound,
  MODE_DEGREE_LABELS,
  MODE_DISPLAY_NAMES,
  DEGREE_COLORS,
  SECONDARY_DEGREE_COLORS,
} from "../library/Library";
import { useGlobalSettings } from "../GlobalSettingsContext";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";

const NUM_FRETS_TO_SHOW = 5;

const IntervalTraining: React.FC = () => {
  const { enabledModes, enabledIntervalReferenceDegrees, enabledIntervalTargetDegrees } =
    useGlobalSettings();

  const [round] = useState<IntervalTrainingRound>(() =>
    generateIntervalTrainingRound(
      NUM_FRETS_TO_SHOW,
      enabledModes,
      enabledIntervalReferenceDegrees,
      enabledIntervalTargetDegrees
    )
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const {
    rootNote,
    modeName,
    referenceDegree,
    targetDegree,
    referencePositions,
    targetPositions,
    strings,
    startFret,
  } = round;
  const degreeLabels = MODE_DEGREE_LABELS[modeName];
  const refLabel = degreeLabels[referenceDegree - 1];
  const targetLabel = degreeLabels[targetDegree - 1];

  const refColor = DEGREE_COLORS[referenceDegree] ?? "#1976d2";
  const targetColor =
    SECONDARY_DEGREE_COLORS[targetDegree] ?? DEGREE_COLORS[targetDegree] ?? "#e65100";

  const referenceMarkers: FretboardMarker[] = referencePositions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: refLabel,
    color: refColor,
  }));

  const targetMarkers: FretboardMarker[] = targetPositions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: targetLabel,
    color: targetColor,
  }));

  const markers = showAnswer ? [...referenceMarkers, ...targetMarkers] : referenceMarkers;

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          This is the <span style={{ color: refColor }}>{refLabel}</span> of{" "}
          <span style={{ color: "#1976d2" }}>
            {rootNote} {MODE_DISPLAY_NAMES[modeName]}
          </span>
          . Find the <span style={{ color: targetColor }}>{targetLabel}</span>.
        </b>
      </Typography>
      <FretboardDiagram
        markers={markers}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[...strings]}
      />
      <AnswerButtonList showingAnswer={showAnswer} onShowAnswer={() => setShowAnswer(true)} />
    </>
  );
};

export default IntervalTraining;
