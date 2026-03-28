import React, { useState } from "react";
import AnswerButtonList from "./AnswerButtonList";

interface Props {
  resetRoundState: () => void;
  onNext?: () => void;
  QuestionComponent: React.FC;
  AnswerComponent: React.FC<{ hidden: boolean }>;
}

const GenericQuestionComponent: React.FC<Props> = ({
  resetRoundState,
  onNext,
  QuestionComponent,
  AnswerComponent,
}) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const handleNext = () => {
    resetRoundState();
    setShowAnswer(false);
    onNext?.();
  };

  return (
    <>
      <QuestionComponent />
      <AnswerButtonList
        showingAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onNext={handleNext}
      />
      <AnswerComponent hidden={!showAnswer} />
    </>
  );
};

export default GenericQuestionComponent;
