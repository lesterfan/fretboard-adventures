import React, { useState } from "react";
import _ from "lodash";
import {
  findFretGivenStringAndNote,
  getGuitarStringsDisclaimer,
  getRandomMuscialNoteName,
} from "../library/Library";
import { Typography } from "@mui/material";
import GenericQuestionComponent from "../components/GenericQuestionComponent";

const styles = {
  answerText: {
    marginTop: "1em",
  },
};

const NoteOnAString: React.FC = () => {
  const [stringNum, setStringNum] = useState<number>(_.random(1, 6));
  const [noteName, setNoteName] = useState<string>(() => getRandomMuscialNoteName());
  const resetRoundState = () => {
    setStringNum(_.random(1, 6));
    setNoteName(getRandomMuscialNoteName());
  };
  const question = `Find the lowest fret ${noteName} note on string ${stringNum}.`;
  const answer = findFretGivenStringAndNote(stringNum, noteName);
  return (
    <GenericQuestionComponent
      resetRoundState={resetRoundState}
      QuestionComponent={() => (
        <>
          <Typography variant="body1" gutterBottom>
            {getGuitarStringsDisclaimer()}
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

export default NoteOnAString;
