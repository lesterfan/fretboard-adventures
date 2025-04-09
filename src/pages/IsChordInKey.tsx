import React, { useState } from "react";
import {
  getChordsOfKey,
  getIndexOfChordInKey,
  getRandomChord,
  getRandomKeyName,
} from "../library/Library";
import _ from "lodash";
import { useTimer } from "../hooks/useTimer";
import { Typography } from "@mui/material";
import MusicalKeyTips from "../components/MusicalKeyTips";
import AnswerButtonList from "../components/AnswerButtonList";

const styles = {
  answerText: {
    marginTop: "1em",
  },
};

/* We want a chord in the key roughly 50% of the time. */
const getRandomChordWeightedInKey = (keyName: string): string => {
  const chordInKey = _.sample(getChordsOfKey(keyName));
  const chordNotInKey = getRandomChord();
  return _.sample([chordInKey, chordNotInKey]) as string;
};

const getChordNumber = (keyName: string, chordName: string): number => {
  try {
    return getIndexOfChordInKey(keyName, chordName);
  } catch (error) {
    return -1;
  }
};

const IsChordInKey: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [includeMinorKeys, setIncludeMinorKeys] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [keyName, setKeyName] = useState<string>(() => getRandomKeyName(includeMinorKeys));
  const [chord, setChord] = useState<string>(() => getRandomChordWeightedInKey(keyName));
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const timer = useTimer();
  const [lastRoundTimeSeconds, setLastRoundTimeSeconds] = useState<number | null>(null);
  const resetRoundState = () => {
    setShowAnswer(false);
    setLastRoundTimeSeconds(timer.timerElapsedSeconds);
    const newKeyName = getRandomKeyName(includeMinorKeys);
    setKeyName(newKeyName);
    setChord(getRandomChordWeightedInKey(newKeyName));
    timer.resetTimer();
  };
  const question = `Is the ${chord} chord in the key of ${keyName}? What number is it?`;
  const chordNum = getChordNumber(keyName, chord);
  const answer = chordNum === -1 ? "No" : `Yes, it's the ${chordNum} chord.`;
  return (
    <>
      <Typography variant="h3">Score = {score}</Typography>
      <Typography hidden={_.isNull(lastRoundTimeSeconds)} variant="body1" gutterBottom>
        Last round: {lastRoundTimeSeconds} second(s)
      </Typography>
      <MusicalKeyTips
        showTips={showTips}
        setShowTips={setShowTips}
        includeMinorKeys={includeMinorKeys}
        setIncludeMinorKeys={setIncludeMinorKeys}
      />
      <Typography variant="body1" gutterBottom>
        <b>{question}</b>
      </Typography>
      <AnswerButtonList
        onShowAnswer={() => setShowAnswer(!showAnswer)}
        onCorrect={() => {
          setScore(score + 1);
          resetRoundState();
        }}
        onIncorrect={() => {
          setScore(score - 1);
          resetRoundState();
        }}
      />
      <Typography variant="body1" sx={styles.answerText} hidden={!showAnswer}>
        <b>Answer:</b> {answer}
      </Typography>
    </>
  );
};

export default IsChordInKey;
