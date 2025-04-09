import React, { useState } from "react";
import {
  getChordsOfKey,
  getIndexOfChordInKey,
  getRandomChord,
  getRandomKeyName,
} from "../library/Library";
import _ from "lodash";
import { Typography } from "@mui/material";
import MusicalKeyTips from "../components/MusicalKeyTips";
import GenericQuestionComponent from "../components/GenericQuestionComponent";

const styles = {
  answerText: {
    marginTop: "1em",
  },
};

/* We want a chord in the key roughly 50% of the time. */
const getRandomChordWeightedInKey = (keyName: string): string => {
  const chordInKey = _.sample(getChordsOfKey(keyName));
  const chordNotInKey = getRandomChord();
  const result = _.sample([chordInKey, chordNotInKey]) as string;
  return result;
};

const getChordNumber = (keyName: string, chordName: string): number => {
  try {
    return getIndexOfChordInKey(keyName, chordName);
  } catch (error) {
    return -1;
  }
};

const IsChordInKey: React.FC = () => {
  const [includeMinorKeys, setIncludeMinorKeys] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [keyName, setKeyName] = useState<string>(() => getRandomKeyName(includeMinorKeys));
  const [chord, setChord] = useState<string>(() => getRandomChordWeightedInKey(keyName));
  const resetRoundState = () => {
    const newKeyName = getRandomKeyName(includeMinorKeys);
    setKeyName(newKeyName);
    setChord(getRandomChordWeightedInKey(keyName));
  };
  const question = `Is the ${chord} chord in the key of ${keyName}? What number is it?`;
  const chordNum = getChordNumber(keyName, chord);
  const answer = chordNum === -1 ? "No" : `Yes, it's the ${chordNum} chord.`;
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

export default IsChordInKey;
