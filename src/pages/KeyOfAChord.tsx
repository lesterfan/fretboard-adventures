import React, { useState } from "react";
import { getChordOfKey, getRandomKeyName } from "../library/Library";
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

const KeyOfAChord: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [includeMinorKeys, setIncludeMinorKeys] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [keyName, setKeyName] = useState<string>(() => getRandomKeyName(includeMinorKeys));
  const [chordNum, setChordNum] = useState<number>(_.random(1, 7));
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const timer = useTimer();
  const [lastRoundTimeSeconds, setLastRoundTimeSeconds] = useState<number | null>(null);
  const resetRoundState = () => {
    setShowAnswer(false);
    setLastRoundTimeSeconds(timer.timerElapsedSeconds);
    setKeyName(getRandomKeyName(includeMinorKeys));
    setChordNum(_.random(2, 7)); // The 1 chord is the tonic, so we don't ask for it.
    timer.resetTimer();
  };
  const question = `What is the ${chordNum} chord of the ${keyName} key?`;
  const answer = getChordOfKey(keyName, chordNum);
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

export default KeyOfAChord;
