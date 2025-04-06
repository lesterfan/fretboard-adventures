import React, { useState } from "react";
import {
  getChordOfKey,
  getMajorKeyChordPattern,
  getMajorKeyNotePattern,
  getMinorKeyChordPattern,
  getMinorKeyNotePattern,
  getRandomKeyName,
} from "../lib/Library";
import _ from "lodash";
import { useTimer } from "../hooks/useTimer";

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
      <h1>Score = {score}</h1>
      <input
        type="checkbox"
        id="includeMinorKeysCheckbox"
        onClick={() => setIncludeMinorKeys(!includeMinorKeys)}
      />
      <label htmlFor="includeMinorKeysCheckbox">Include minor keys</label>
      <p>
        <span hidden={_.isNull(lastRoundTimeSeconds)}>
          Last round: {lastRoundTimeSeconds} seconds.
        </span>{" "}
        Helpful notes:
        <ol>
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
        </ol>
      </p>
      <p>
        What is the {chordNum} chord of the {keyName} key?
      </p>
      <button onClick={() => setShowAnswer(!showAnswer)}>Show Answer</button>
      <button
        onClick={() => {
          setScore(score + 1);
          resetRoundState();
        }}
      >
        I got it right
      </button>
      <button
        onClick={() => {
          setScore(score - 1);
          resetRoundState();
        }}
      >
        I got it wrong
      </button>
      <p hidden={!showAnswer}>Answer: {getChordOfKey(keyName, chordNum)}</p>
    </>
  );
};

export default ChordGivenKey;
