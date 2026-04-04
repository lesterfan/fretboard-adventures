import React, { useState } from "react";
import _ from "lodash";
import FretboardRecognition from "./FretboardRecognition";
import NoteOnAString from "./NoteOnAString";
import TriadInversions from "./TriadInversions";
import SeventhChordInversions from "./SeventhChordInversions";
import PentatonicScalePositions from "./PentatonicScalePositions";
import PentatonicDegreeIdentification from "./PentatonicDegreeIdentification";

// NB: Add new question pages to this list when adding new questions
const AllQuestionPages = [
  FretboardRecognition,
  NoteOnAString,
  TriadInversions,
  SeventhChordInversions,
  PentatonicScalePositions,
  PentatonicDegreeIdentification,
];

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
