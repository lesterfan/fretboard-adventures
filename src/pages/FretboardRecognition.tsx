import React, { useState } from "react";
import { getGuitarNoteName, getGuitarStringsDisclaimer } from "../library/Library";
import _ from "lodash";
import { Typography } from "@mui/material";
import GenericQuestionComponent from "../components/GenericQuestionComponent";

const styles = {
  answerText: {
    marginTop: "1em",
  },
};

const FretboardRecognition: React.FC = () => {
  const [stringNum, setStringNum] = useState<number>(() => _.random(1, 6));
  const [fretNum, setFretNum] = useState<number>(() => _.random(1, 12));
  const resetRoundState = () => {
    setStringNum(_.random(1, 6));
    setFretNum(_.random(1, 12));
  };
  const question = `What note is on string ${stringNum}, fret ${fretNum}?`;
  const answer = getGuitarNoteName(stringNum, fretNum);
  return (
    <GenericQuestionComponent
      resetRoundState={resetRoundState}
      QuestionComponent={() => (
        <>
          <Typography variant="body1" gutterBottom>
            ({getGuitarStringsDisclaimer()})
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>{question}</b>
          </Typography>
        </>
      )}
      AnswerComponent={({ hidden }) => (
        <Typography variant="body1" sx={styles.answerText} hidden={hidden}>
          <b>Answer:</b> {answer}
        </Typography>
      )}
    />
  );
};

export default FretboardRecognition;
