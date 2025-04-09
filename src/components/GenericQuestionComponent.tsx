import React, { useState } from "react";
import _ from "lodash";
import { useTimer } from "../hooks/useTimer";
import { Typography } from "@mui/material";
import AnswerButtonList from "./AnswerButtonList";
import { useScore } from "../context/ScoreContext";

interface Props {
  resetRoundState: () => void;
  QuestionComponent: React.FC;
  AnswerComponent: React.FC<{ hidden: boolean }>;
}

const GenericQuestionComponent: React.FC<Props> = ({
  resetRoundState,
  QuestionComponent,
  AnswerComponent,
}) => {
  const { score, setScore } = useScore();
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const timer = useTimer();
  const [lastRoundTimeSeconds, setLastRoundTimeSeconds] = useState<number | null>(null);

  const doResetRoundState = () => {
    resetRoundState();
    setShowAnswer(false);
    setLastRoundTimeSeconds(timer.timerElapsedSeconds);
    timer.resetTimer();
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Score = {score}
      </Typography>
      <Typography hidden={_.isNull(lastRoundTimeSeconds)} variant="body1" gutterBottom>
        Last round: {lastRoundTimeSeconds} second(s)
      </Typography>
      <QuestionComponent />
      <AnswerButtonList
        onShowAnswer={() => setShowAnswer(!showAnswer)}
        onCorrect={() => {
          setScore(score + 1);
          doResetRoundState();
        }}
        onIncorrect={() => {
          setScore(score - 1);
          doResetRoundState();
        }}
      />
      <AnswerComponent hidden={!showAnswer} />
    </>
  );
};

export default GenericQuestionComponent;
