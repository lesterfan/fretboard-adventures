import React, { createContext, useContext, useState } from "react";

interface ScoreContextType {
  score: number;
  setScore: (score: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState(0);
  return <ScoreContext.Provider value={{ score, setScore }}>{children}</ScoreContext.Provider>;
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};
