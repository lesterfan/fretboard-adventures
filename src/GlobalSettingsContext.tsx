import React, { createContext, useContext, useEffect, useState } from "react";
import { ModeName } from "./library/Library";
import { QuestionTypeId } from "./questionRegistry";
import { DEFAULTS, loadSettings, saveSettings } from "./settingsPersistence";

interface GlobalSettingsContextValue {
  enabledModes: ModeName[];
  setEnabledModes: React.Dispatch<React.SetStateAction<ModeName[]>>;
  enabledQuestionTypes: QuestionTypeId[];
  setEnabledQuestionTypes: React.Dispatch<React.SetStateAction<QuestionTypeId[]>>;
  enabledIntervalReferenceDegrees: number[];
  setEnabledReferenceDegrees: React.Dispatch<React.SetStateAction<number[]>>;
  enabledIntervalTargetDegrees: number[];
  setEnabledTargetDegrees: React.Dispatch<React.SetStateAction<number[]>>;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextValue>({
  enabledModes: DEFAULTS.enabledModes,
  setEnabledModes: () => {},
  enabledQuestionTypes: DEFAULTS.enabledQuestionTypes,
  setEnabledQuestionTypes: () => {},
  enabledIntervalReferenceDegrees: DEFAULTS.enabledIntervalReferenceDegrees,
  setEnabledReferenceDegrees: () => {},
  enabledIntervalTargetDegrees: DEFAULTS.enabledIntervalTargetDegrees,
  setEnabledTargetDegrees: () => {},
});

export const GlobalSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabledModes, setEnabledModes] = useState<ModeName[]>(() => loadSettings().enabledModes);
  const [enabledQuestionTypes, setEnabledQuestionTypes] = useState<QuestionTypeId[]>(
    () => loadSettings().enabledQuestionTypes
  );
  const [enabledIntervalReferenceDegrees, setEnabledReferenceDegrees] = useState<number[]>(
    () => loadSettings().enabledIntervalReferenceDegrees
  );
  const [enabledIntervalTargetDegrees, setEnabledTargetDegrees] = useState<number[]>(
    () => loadSettings().enabledIntervalTargetDegrees
  );

  useEffect(() => {
    saveSettings({
      enabledModes,
      enabledQuestionTypes,
      enabledIntervalReferenceDegrees,
      enabledIntervalTargetDegrees,
    });
  }, [
    enabledModes,
    enabledQuestionTypes,
    enabledIntervalReferenceDegrees,
    enabledIntervalTargetDegrees,
  ]);

  return (
    <GlobalSettingsContext.Provider
      value={{
        enabledModes,
        setEnabledModes,
        enabledQuestionTypes,
        setEnabledQuestionTypes,
        enabledIntervalReferenceDegrees,
        setEnabledReferenceDegrees,
        enabledIntervalTargetDegrees,
        setEnabledTargetDegrees,
      }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(GlobalSettingsContext);
