import React from "react";
import { useLocation } from "react-router-dom";
import { QuestionHistoryProvider, useQuestionHistory } from "../QuestionHistoryContext";

interface Props {
  getNextComponent: () => React.FC;
}

const QuestionPageHostInner: React.FC = () => {
  const { entries, currentIndex } = useQuestionHistory();

  return (
    <>
      {entries.map((entry, index) => (
        <div key={entry.key} style={index === currentIndex ? undefined : { display: "none" }}>
          <entry.Component />
        </div>
      ))}
    </>
  );
};

const QuestionPageHost: React.FC<Props> = ({ getNextComponent }) => {
  const { pathname } = useLocation();
  return (
    <QuestionHistoryProvider key={pathname} getNextComponent={getNextComponent}>
      <QuestionPageHostInner />
    </QuestionHistoryProvider>
  );
};

export default QuestionPageHost;
