import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  generateModeFromPentatonicRound,
  ModeFromPentatonicRound,
  MODE_EXTRA_DEGREE_LABELS,
  MODE_DISPLAY_NAMES,
  DEGREE_COLORS,
  SECONDARY_DEGREE_COLORS,
  PENTATONIC_DEGREE_LABELS,
} from "../library/Library";
import AnswerButtonList from "../components/AnswerButtonList";
import FretboardDiagram, { FretboardMarker } from "../components/FretboardDiagram";
import { useGlobalSettings } from "../GlobalSettingsContext";

const NUM_FRETS_TO_SHOW = 5;
const GRAY = "#9e9e9e";
const ROOT_COLOR = DEGREE_COLORS[1];

const ModeFromPentatonic: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const { enabledModes } = useGlobalSettings();
  const [round, setRound] = useState<ModeFromPentatonicRound>(() =>
    generateModeFromPentatonicRound(NUM_FRETS_TO_SHOW, enabledModes)
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setRound(generateModeFromPentatonicRound(NUM_FRETS_TO_SHOW, enabledModes));
    setShowAnswer(false);
    onNext?.();
  };

  const { rootNote, pentatonicType, modeName, pentatonicPositions, extraPositions, startFret } =
    round;
  const extraDegreeLabels = MODE_EXTRA_DEGREE_LABELS[modeName];
  const pentatonicDegreeLabels = PENTATONIC_DEGREE_LABELS[pentatonicType];

  const questionMarkers: FretboardMarker[] = pentatonicPositions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    color: GRAY,
  }));

  const answerPentatonicMarkers: FretboardMarker[] = pentatonicPositions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: pentatonicDegreeLabels[p.degree],
    color: p.degree === 1 ? ROOT_COLOR : GRAY,
  }));

  const extraMarkers: FretboardMarker[] = extraPositions.map((p) => ({
    stringNum: p.stringNum,
    fretNum: p.fretNum,
    label: extraDegreeLabels[p.degree],
    color: SECONDARY_DEGREE_COLORS[p.degree],
  }));

  return (
    <>
      <Typography variant="body1" gutterBottom>
        <b>
          Given this{" "}
          <span style={{ color: ROOT_COLOR }}>
            {rootNote} {pentatonicType}
          </span>{" "}
          pentatonic box, find the remaining notes of{" "}
          <span style={{ color: "#e65100" }}>
            {rootNote} {MODE_DISPLAY_NAMES[modeName]}
          </span>
        </b>
      </Typography>
      <FretboardDiagram
        markers={showAnswer ? [...answerPentatonicMarkers, ...extraMarkers] : questionMarkers}
        startFret={startFret}
        numFretsToShow={NUM_FRETS_TO_SHOW}
        highlightedStrings={[]}
      />
      <AnswerButtonList
        showingAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onNext={handleNext}
      />
    </>
  );
};

export default ModeFromPentatonic;
