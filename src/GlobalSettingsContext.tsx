import React, { createContext, useContext, useEffect, useState } from "react";
import { ModeName } from "./library/Library";
import { DEFAULTS, loadSettings, saveSettings } from "./settingsPersistence";

interface GlobalSettingsContextValue {
  enabledModes: ModeName[];
  setEnabledModes: React.Dispatch<React.SetStateAction<ModeName[]>>;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextValue>({
  enabledModes: DEFAULTS.enabledModes,
  setEnabledModes: () => {},
});

export const GlobalSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabledModes, setEnabledModes] = useState<ModeName[]>(() => loadSettings().enabledModes);

  useEffect(() => {
    saveSettings({ enabledModes });
  }, [enabledModes]);

  return (
    <GlobalSettingsContext.Provider value={{ enabledModes, setEnabledModes }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(GlobalSettingsContext);
