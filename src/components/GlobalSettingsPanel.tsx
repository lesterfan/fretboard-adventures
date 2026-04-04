import React from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ALL_MODES, MODE_DISPLAY_NAMES, ModeName } from "../library/Library";
import { useGlobalSettings } from "../GlobalSettingsContext";

const GlobalSettingsPanel: React.FC = () => {
  const { enabledModes, setEnabledModes } = useGlobalSettings();

  const handleModeChange = (event: SelectChangeEvent<ModeName[]>) => {
    const value = event.target.value as ModeName[];
    if (value.length === 0) return;
    setEnabledModes(value);
  };

  return (
    <FormControl sx={{ width: 365, maxWidth: "100%" }} size="small">
      <InputLabel id="mode-select-label">Available Modes</InputLabel>
      <Select
        labelId="mode-select-label"
        multiple
        value={enabledModes}
        onChange={handleModeChange}
        input={<OutlinedInput label="Available Modes" />}
        renderValue={(selected) => selected.map((m) => MODE_DISPLAY_NAMES[m]).join(", ")}
      >
        {ALL_MODES.map((mode) => (
          <MenuItem key={mode} value={mode}>
            <Checkbox checked={enabledModes.includes(mode)} />
            <ListItemText primary={MODE_DISPLAY_NAMES[mode]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GlobalSettingsPanel;
