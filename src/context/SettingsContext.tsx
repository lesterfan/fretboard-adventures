import React, { createContext, useContext } from "react";
import { useCookie } from "../hooks/useCookie";

interface SettingsContextType {
  showTips: boolean;
  setShowTips: (show: boolean) => void;
  includeMinorKeys: boolean;
  setIncludeMinorKeys: (include: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTips, setShowTips] = useCookie("fretboard-adventures-settings-show-tips", "false");
  const [includeMinorKeys, setIncludeMinorKeys] = useCookie(
    "fretboard-adventures-settings-include-minor-keys",
    "false"
  );

  return (
    <SettingsContext.Provider
      value={{
        showTips: showTips === "true",
        setShowTips: (show) => setShowTips(show.toString()),
        includeMinorKeys: includeMinorKeys === "true",
        setIncludeMinorKeys: (include) => setIncludeMinorKeys(include.toString()),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
