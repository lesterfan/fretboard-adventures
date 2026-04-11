import React, { createContext, useContext, useEffect, useState } from "react";
import { ModeName } from "./library/Library";
import { QuestionTypeId } from "./questionRegistry";
import { DEFAULTS, loadSettings, saveSettings } from "./settingsPersistence";

interface GlobalSettingsContextValue {
  enabledModes: ModeName[];
  setEnabledModes: React.Dispatch<React.SetStateAction<ModeName[]>>;
  enabledQuestionTypes: QuestionTypeId[];
  setEnabledQuestionTypes: React.Dispatch<React.SetStateAction<QuestionTypeId[]>>;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextValue>({
  enabledModes: DEFAULTS.enabledModes,
  setEnabledModes: () => {},
  enabledQuestionTypes: DEFAULTS.enabledQuestionTypes,
  setEnabledQuestionTypes: () => {},
});

export const GlobalSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabledModes, setEnabledModes] = useState<ModeName[]>(() => loadSettings().enabledModes);
  const [enabledQuestionTypes, setEnabledQuestionTypes] = useState<QuestionTypeId[]>(
    () => loadSettings().enabledQuestionTypes
  );

  useEffect(() => {
    saveSettings({ enabledModes, enabledQuestionTypes });
  }, [enabledModes, enabledQuestionTypes]);

  return (
    <GlobalSettingsContext.Provider
      value={{ enabledModes, setEnabledModes, enabledQuestionTypes, setEnabledQuestionTypes }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(GlobalSettingsContext);
