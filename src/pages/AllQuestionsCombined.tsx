import React, { useState } from "react";
import _ from "lodash";
import FretboardRecognition from "./FretboardRecognition";
import NoteOnAString from "./NoteOnAString";
import TriadRecognition from "./TriadRecognition";

// NB: Add new question pages to this list when adding new questions
const AllQuestionPages = [FretboardRecognition, NoteOnAString, TriadRecognition];

const getRandomQuestionIndex = () => {
  return _.random(0, AllQuestionPages.length - 1);
};

const AllQuestionsCombined: React.FC = () => {
  const [round, setRound] = useState(0);
  const [currPageIndex, setCurrPageIndex] = useState<number>(() => getRandomQuestionIndex());

  const handleNext = () => {
    setCurrPageIndex(getRandomQuestionIndex());
    setRound((r) => r + 1);
  };

  const CurrentQuestion = AllQuestionPages[currPageIndex];
  return <CurrentQuestion key={round} onNext={handleNext} />;
};

export default AllQuestionsCombined;
