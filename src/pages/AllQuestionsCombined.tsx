import React, { useCallback } from "react";
import _ from "lodash";
import FretboardRecognition from "./FretboardRecognition";
import NoteOnAString from "./NoteOnAString";
import TriadInversions from "./TriadInversions";
import SeventhChordInversions from "./SeventhChordInversions";
import MinorPentatonicScalePositions from "./MinorPentatonicScalePositions";
import MajorPentatonicScalePositions from "./MajorPentatonicScalePositions";
import MinorPentatonicDegreeIdentification from "./MinorPentatonicDegreeIdentification";
import MajorPentatonicDegreeIdentification from "./MajorPentatonicDegreeIdentification";
import ModeFromPentatonic from "./ModeFromPentatonic";
import SeventhChordArpeggios from "./SeventhChordArpeggios";
import { ALL_QUESTION_TYPES, QuestionTypeId } from "../questionRegistry";
import { useGlobalSettings } from "../GlobalSettingsContext";
import QuestionPageHost from "../components/QuestionPageHost";

// NB: Add new question pages to this map when adding new questions
const QUESTION_TYPE_COMPONENTS: Record<QuestionTypeId, React.FC> = {
  fretboard_recognition: FretboardRecognition,
  note_on_a_string: NoteOnAString,
  triad_inversions: TriadInversions,
  seventh_chord_inversions: SeventhChordInversions,
  minor_pentatonic: MinorPentatonicScalePositions,
  major_pentatonic: MajorPentatonicScalePositions,
  minor_pentatonic_degrees: MinorPentatonicDegreeIdentification,
  major_pentatonic_degrees: MajorPentatonicDegreeIdentification,
  mode_from_pentatonic: ModeFromPentatonic,
  seventh_chord_arpeggios: SeventhChordArpeggios,
};

const AllQuestionsCombined: React.FC = () => {
  const { enabledQuestionTypes } = useGlobalSettings();

  const getNextComponent = useCallback(() => {
    const types = enabledQuestionTypes.length > 0 ? enabledQuestionTypes : ALL_QUESTION_TYPES;
    const chosen = types[_.random(0, types.length - 1)];
    return QUESTION_TYPE_COMPONENTS[chosen];
  }, [enabledQuestionTypes]);

  return <QuestionPageHost getNextComponent={getNextComponent} />;
};

export default AllQuestionsCombined;
