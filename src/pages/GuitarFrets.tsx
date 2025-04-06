import React, { useState } from "react";
import { getGuitarNoteName, randomBetween } from "../lib/Library";

const GuitarFrets: React.FC = () => {
  const [stringNum, setStringNum] = useState<number>(randomBetween(1, 6));
  const [fretNum, setFretNum] = useState<number>(randomBetween(1, 12));
  const [score, setScore] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const resetRoundState = () => {
    setStringNum(randomBetween(1, 6));
    setFretNum(randomBetween(1, 12));
    setShowAnswer(false);
  };
  return (
    <>
      <h1>Score = {score}</h1>
      <p>
        What note is on string {stringNum}, fret {fretNum}? Note that the first string is the
        highest string and the sixth string is the lowest string.
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
      <p hidden={!showAnswer}>Answer: {getGuitarNoteName(stringNum, fretNum)}</p>
    </>
  );
};

export default GuitarFrets;
