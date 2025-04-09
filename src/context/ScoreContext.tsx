import React, { createContext, useContext } from "react";
import { useCookie } from "../hooks/useCookie";

interface ScoreContextType {
  score: number;
  setScore: (score: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookieScore, setCookieScore] = useCookie("fretboard-adventures-score", "0");
  const setScore = (newScore: number) => {
    setCookieScore(newScore.toString());
  };
  return (
    <ScoreContext.Provider
      value={{
        score: parseInt(cookieScore, 10),
        setScore,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};
