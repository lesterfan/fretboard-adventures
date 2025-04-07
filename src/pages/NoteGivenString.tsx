import React, { useState } from "react";
import _ from "lodash";
import {
  findFretGivenStringAndNote,
  getGuitarStringsDisclaimer,
  getRandomMuscialNoteName,
} from "../library/Library";
import { useTimer } from "../hooks/useTimer";
import { Typography, Button, Stack } from "@mui/material";

const styles = {
  buttonContainer: {
    marginTop: "1em",
  },
  answerText: {
    marginTop: "1em",
  },
};

const NoteGivenString: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [stringNum, setStringNum] = useState<number>(_.random(1, 6));
  const [noteName, setNoteName] = useState<string>(getRandomMuscialNoteName());
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const timer = useTimer();
  const [lastRoundTimeSeconds, setLastRoundTimeSeconds] = useState<number | null>(null);
  const resetRoundState = () => {
    setStringNum(_.random(1, 6));
    setNoteName(getRandomMuscialNoteName());
    setShowAnswer(false);
    setLastRoundTimeSeconds(timer.timerElapsedSeconds);
    timer.resetTimer();
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Score = {score}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <span hidden={_.isNull(lastRoundTimeSeconds)}>
          Last round: {lastRoundTimeSeconds} second(s).
        </span>{" "}
        ({getGuitarStringsDisclaimer()})
      </Typography>

      <Typography variant="body1" gutterBottom>
        <b>
          Find the lowest fret number of a {noteName} note on string {stringNum}.
        </b>
      </Typography>

      <Stack spacing={1} direction="row" sx={styles.buttonContainer}>
        <Button variant="outlined" size="small" onClick={() => setShowAnswer(!showAnswer)}>
          Show Answer
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setScore(score + 1);
            resetRoundState();
          }}
        >
          I got it right
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setScore(score - 1);
            resetRoundState();
          }}
        >
          I got it wrong
        </Button>
      </Stack>

      <Typography variant="body1" sx={styles.answerText} hidden={!showAnswer}>
        <b>Answer:</b> Fret {findFretGivenStringAndNote(stringNum, noteName)}
      </Typography>
    </>
  );
};

export default NoteGivenString;
