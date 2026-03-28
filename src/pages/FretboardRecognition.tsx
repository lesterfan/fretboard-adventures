import React, { useState } from "react";
import { getGuitarNoteName } from "../library/Library";
import _ from "lodash";
import { Typography } from "@mui/material";
import GenericQuestionComponent from "../components/GenericQuestionComponent";
import FretboardDiagram from "../components/FretboardDiagram";

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
  const answer = getGuitarNoteName(stringNum, fretNum);
  return (
    <GenericQuestionComponent
      resetRoundState={resetRoundState}
      QuestionComponent={() => (
        <>
          <Typography variant="body1" gutterBottom>
            <b>What note is at the marked position?</b>
          </Typography>
          <FretboardDiagram stringNum={stringNum} fretNum={fretNum} />
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
