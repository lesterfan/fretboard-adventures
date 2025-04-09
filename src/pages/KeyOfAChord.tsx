import React, { useState } from "react";
import { getChordOfKey, getRandomKeyName } from "../library/Library";
import _ from "lodash";
import { Typography } from "@mui/material";
import MusicalKeyTips from "../components/MusicalKeyTips";
import GenericQuestionComponent from "../components/GenericQuestionComponent";

const styles = {
  answerText: {
    marginTop: "1em",
  },
};

const getRandomChordNumber = (): number => {
  return _.random(2, 7); // The 1 chord is the tonic, so we don't ask for it.
};

const KeyOfAChord: React.FC = () => {
  const [includeMinorKeys, setIncludeMinorKeys] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [keyName, setKeyName] = useState<string>(() => getRandomKeyName(includeMinorKeys));
  const [chordNum, setChordNum] = useState<number>(() => getRandomChordNumber());
  const resetRoundState = () => {
    setKeyName(getRandomKeyName(includeMinorKeys));
    setChordNum(getRandomChordNumber());
  };
  const question = `What is the ${chordNum} chord of the ${keyName} key?`;
  const answer = getChordOfKey(keyName, chordNum);
  return (
    <GenericQuestionComponent
      resetRoundState={resetRoundState}
      QuestionComponent={() => (
        <>
          <MusicalKeyTips
            showTips={showTips}
            setShowTips={setShowTips}
            includeMinorKeys={includeMinorKeys}
            setIncludeMinorKeys={setIncludeMinorKeys}
          />
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

export default KeyOfAChord;
