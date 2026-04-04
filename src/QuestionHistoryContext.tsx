import React, { createContext, useCallback, useContext, useReducer, useRef } from "react";
import {
  historyReducer,
  initialHistoryState,
  canGoBack as canGoBackFn,
  canGoForward as canGoForwardFn,
  HistoryState,
} from "./questionHistory";

type QuestionComponent = React.FC;

interface QuestionHistoryContextValue {
  entries: { key: number; Component: QuestionComponent }[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  advance: () => void;
}

const QuestionHistoryContext = createContext<QuestionHistoryContextValue>({
  entries: [],
  currentIndex: -1,
  canGoBack: false,
  canGoForward: false,
  goBack: () => {},
  advance: () => {},
});

export const QuestionHistoryProvider: React.FC<{
  getNextComponent: () => QuestionComponent;
  children: React.ReactNode;
}> = ({ getNextComponent, children }) => {
  const getNextRef = useRef(getNextComponent);
  getNextRef.current = getNextComponent;

  const [state, dispatch] = useReducer(
    historyReducer,
    initialHistoryState,
    (init): HistoryState => historyReducer(init, { type: "PUSH_NEXT", data: getNextComponent() })
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const goBack = useCallback(() => {
    dispatch({ type: "GO_BACK" });
  }, []);

  const advance = useCallback(() => {
    if (canGoForwardFn(stateRef.current)) {
      dispatch({ type: "GO_FORWARD" });
    } else {
      dispatch({ type: "PUSH_NEXT", data: getNextRef.current() });
    }
  }, []);

  const entries = state.entries.map((entry) => ({
    key: entry.key,
    Component: entry.data as QuestionComponent,
  }));

  return (
    <QuestionHistoryContext.Provider
      value={{
        entries,
        currentIndex: state.currentIndex,
        canGoBack: canGoBackFn(state),
        canGoForward: canGoForwardFn(state),
        goBack,
        advance,
      }}
    >
      {children}
    </QuestionHistoryContext.Provider>
  );
};

export const useQuestionHistory = () => useContext(QuestionHistoryContext);
