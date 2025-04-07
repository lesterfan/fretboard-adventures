import React, { useState } from "react";
import {
  getChordOfKey,
  getMajorKeyChordPattern,
  getMajorKeyNotePattern,
  getMinorKeyChordPattern,
  getMinorKeyNotePattern,
  getRandomKeyName,
} from "../library/Library";
import _ from "lodash";
import { useTimer } from "../hooks/useTimer";
import { Typography, Button, Stack, Checkbox, FormControlLabel, Box } from "@mui/material";

const styles = {
  buttonContainer: {
    marginTop: "1em",
  },
  answerText: {
    marginTop: "1em",
  },
  helpfulNotesList: {
    marginTop: "0",
  },
};

const ChordGivenKey: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [includeMinorKeys, setIncludeMinorKeys] = useState<boolean>(false);
  const [keyName, setKeyName] = useState<string>(getRandomKeyName(includeMinorKeys));
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

  return (
    <>
      <Typography variant="h3">Score = {score}</Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={includeMinorKeys}
            onChange={() => setIncludeMinorKeys(!includeMinorKeys)}
            size="small"
          />
        }
        label="Include minor keys"
      />

      <Typography variant="body1" gutterBottom>
        <span hidden={_.isNull(lastRoundTimeSeconds)}>
          Last round: {lastRoundTimeSeconds} second(s).
        </span>{" "}
        Helpful notes:
      </Typography>
      <Box component="ol" sx={styles.helpfulNotesList}>
        <li>Major key note pattern: {getMajorKeyNotePattern().join(", ")}</li>
        <li>Major key chord pattern: {getMajorKeyChordPattern().join(", ")}</li>
        {includeMinorKeys ? (
          <>
            <li>The 6th note of the major scale is the relative minor.</li>
            <li>The 3rd note of the minor scale is the relative major.</li>
            <li>Minor key note pattern: {getMinorKeyNotePattern().join(", ")}</li>
            <li>Minor key chord pattern: {getMinorKeyChordPattern().join(", ")}</li>
          </>
        ) : null}
      </Box>

      <Typography variant="body1" gutterBottom>
        <b>
          What is the {chordNum} chord of the {keyName} key?
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
        <b>Answer:</b> {getChordOfKey(keyName, chordNum)}
      </Typography>
    </>
  );
};

export default ChordGivenKey;
