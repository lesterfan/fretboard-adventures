import React, { useState } from "react";
import { getGuitarNoteName, getGuitarStringsDisclaimer } from "../library/Library";
import _ from "lodash";
import { useTimer } from "../hooks/useTimer";
import { Typography } from "@mui/material";
import AnswerButtonList from "../components/AnswerButtonList";

const styles = {
  answerText: {
    marginTop: "1em",
  },
};

const FretboardRecognition: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [stringNum, setStringNum] = useState<number>(() => _.random(1, 6));
  const [fretNum, setFretNum] = useState<number>(() => _.random(1, 12));
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const timer = useTimer();
  const [lastRoundTimeSeconds, setLastRoundTimeSeconds] = useState<number | null>(null);
  const resetRoundState = () => {
    setStringNum(_.random(1, 6));
    setFretNum(_.random(1, 12));
    setShowAnswer(false);
    setLastRoundTimeSeconds(timer.timerElapsedSeconds);
    timer.resetTimer();
  };
  const question = `What note is on string ${stringNum}, fret ${fretNum}?`;
  const answer = getGuitarNoteName(stringNum, fretNum);
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Score = {score}
      </Typography>
      <Typography hidden={_.isNull(lastRoundTimeSeconds)} variant="body1" gutterBottom>
        Last round: {lastRoundTimeSeconds} second(s)
      </Typography>
      <Typography variant="body1" gutterBottom>
        ({getGuitarStringsDisclaimer()})
      </Typography>
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

export default FretboardRecognition;
