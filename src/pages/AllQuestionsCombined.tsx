import React, { useEffect, useState } from "react";
import _ from "lodash";
import FretboardRecognition from "./FretboardRecognition";
import NoteOnAString from "./NoteOnAString";
import KeyOfAChord from "./KeyOfAChord";
import IsChordInKey from "./IsChordInKey";
import { useScore } from "../context/ScoreContext";

// NB: Add new question pages to this list when adding new questions
const AllQuestionPages = [FretboardRecognition, NoteOnAString, KeyOfAChord, IsChordInKey];

const getRandomQuestionIndex = () => {
  return _.random(0, AllQuestionPages.length - 1);
};

const AllQuestionsCombined: React.FC = () => {
  const { score } = useScore();
  const [currPageIndex, setCurrPageIndex] = useState<number>(() => getRandomQuestionIndex());
  useEffect(() => {
    setCurrPageIndex(getRandomQuestionIndex());
  }, [score]);
  const CurrentQuestion = AllQuestionPages[currPageIndex];
  return <CurrentQuestion />;
};

export default AllQuestionsCombined;
