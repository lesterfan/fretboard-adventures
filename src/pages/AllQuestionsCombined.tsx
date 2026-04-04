import React, { useCallback } from "react";
import _ from "lodash";
import FretboardRecognition from "./FretboardRecognition";
import NoteOnAString from "./NoteOnAString";
import TriadInversions from "./TriadInversions";
import SeventhChordInversions from "./SeventhChordInversions";
import PentatonicScalePositions from "./PentatonicScalePositions";
import PentatonicDegreeIdentification from "./PentatonicDegreeIdentification";
import ModeFromPentatonic from "./ModeFromPentatonic";
import SeventhChordArpeggios from "./SeventhChordArpeggios";
import QuestionPageHost from "../components/QuestionPageHost";

// NB: Add new question pages to this list when adding new questions
const AllQuestionPages = [
  FretboardRecognition,
  NoteOnAString,
  TriadInversions,
  SeventhChordInversions,
  PentatonicScalePositions,
  PentatonicDegreeIdentification,
  ModeFromPentatonic,
  SeventhChordArpeggios,
];

const AllQuestionsCombined: React.FC = () => {
  const getNextComponent = useCallback(() => {
    return AllQuestionPages[_.random(0, AllQuestionPages.length - 1)];
  }, []);

  return <QuestionPageHost getNextComponent={getNextComponent} />;
};

export default AllQuestionsCombined;
