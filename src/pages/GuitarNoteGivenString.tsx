import React, { useState } from "react";
import _ from "lodash";
import { findFretGivenStringAndNote, getRandomMuscialNoteName } from "../lib/Library";

const GuitarNoteRecognition: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [stringNum, setStringNum] = useState<number>(_.random(1, 6));
  const [noteName, setNoteName] = useState<string>(getRandomMuscialNoteName());
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const resetRoundState = () => {
    setStringNum(_.random(1, 6));
    setNoteName(getRandomMuscialNoteName());
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
        Find the fret number of a {noteName} note on string {stringNum}.
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
      <p hidden={!showAnswer}>Answer: {findFretGivenStringAndNote(stringNum, noteName)}</p>
    </>
  );
};

export default GuitarNoteRecognition;
