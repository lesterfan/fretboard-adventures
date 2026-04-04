import React, { createContext, useContext, useState } from "react";
import { ModeName } from "./library/Library";

const DEFAULT_MODES: ModeName[] = ["ionian", "dorian", "aeolian"];

interface GlobalSettings {
  enabledModes: ModeName[];
  setEnabledModes: React.Dispatch<React.SetStateAction<ModeName[]>>;
}

const GlobalSettingsContext = createContext<GlobalSettings>({
  enabledModes: DEFAULT_MODES,
  setEnabledModes: () => {},
});

export const GlobalSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabledModes, setEnabledModes] = useState<ModeName[]>(DEFAULT_MODES);
  return (
    <GlobalSettingsContext.Provider value={{ enabledModes, setEnabledModes }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(GlobalSettingsContext);
