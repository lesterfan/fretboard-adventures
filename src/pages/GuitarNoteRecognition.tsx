import React, { useState } from "react";
import { getGuitarNoteName } from "../lib/Library";
import _ from "lodash";

const GuitarNoteRecognition: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [stringNum, setStringNum] = useState<number>(_.random(1, 6));
  const [fretNum, setFretNum] = useState<number>(_.random(1, 12));
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const resetRoundState = () => {
    setStringNum(_.random(1, 6));
    setFretNum(_.random(1, 12));
    setShowAnswer(false);
  };
  return (
    <>
      <h1>Score = {score}</h1>
      <p>
        (Note that the first string is the highest string and the sixth string is the lowest
        string.)
      </p>
      <p>
        What note is on string {stringNum}, fret {fretNum}?
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

export default GuitarNoteRecognition;
