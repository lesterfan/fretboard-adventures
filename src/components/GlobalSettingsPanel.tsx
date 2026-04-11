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
  Stack,
} from "@mui/material";
import { ALL_DEGREES, ALL_MODES, MODE_DISPLAY_NAMES, ModeName } from "../library/Library";
import {
  ALL_QUESTION_TYPES,
  QUESTION_TYPE_DISPLAY_NAMES,
  QuestionTypeId,
} from "../questionRegistry";
import { useGlobalSettings } from "../GlobalSettingsContext";
import { useLocation } from "react-router-dom";

const GlobalSettingsPanel: React.FC = () => {
  const {
    enabledModes,
    setEnabledModes,
    enabledQuestionTypes,
    setEnabledQuestionTypes,
    enabledIntervalReferenceDegrees,
    setEnabledReferenceDegrees,
    enabledIntervalTargetDegrees,
    setEnabledTargetDegrees,
  } = useGlobalSettings();
  const location = useLocation();
  const isCombinedPage = location.pathname === "/";

  const handleModeChange = (event: SelectChangeEvent<ModeName[]>) => {
    const value = event.target.value as ModeName[];
    if (value.length === 0) return;
    setEnabledModes(value);
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent<QuestionTypeId[]>) => {
    const value = event.target.value as QuestionTypeId[];
    if (value.length === 0) return;
    setEnabledQuestionTypes(value);
  };

  const handleRefDegreeChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    if (value.length === 0) return;
    setEnabledReferenceDegrees(value);
  };

  const handleTargetDegreeChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    if (value.length === 0) return;
    setEnabledTargetDegrees(value);
  };

  return (
    <Stack spacing={2}>
      {isCombinedPage && (
        <FormControl sx={{ width: 365, maxWidth: "100%" }} size="small">
          <InputLabel id="question-type-select-label">Enabled Question Types</InputLabel>
          <Select
            labelId="question-type-select-label"
            multiple
            value={enabledQuestionTypes}
            onChange={handleQuestionTypeChange}
            input={<OutlinedInput label="Enabled Question Types" />}
            renderValue={(selected) =>
              selected.map((q) => QUESTION_TYPE_DISPLAY_NAMES[q]).join(", ")
            }
          >
            {ALL_QUESTION_TYPES.map((qt) => (
              <MenuItem key={qt} value={qt}>
                <Checkbox checked={enabledQuestionTypes.includes(qt)} />
                <ListItemText primary={QUESTION_TYPE_DISPLAY_NAMES[qt]} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
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
      <FormControl sx={{ width: 365, maxWidth: "100%" }} size="small">
        <InputLabel id="ref-degree-select-label">Interval Reference Degrees</InputLabel>
        <Select
          labelId="ref-degree-select-label"
          multiple
          value={enabledIntervalReferenceDegrees}
          onChange={handleRefDegreeChange}
          input={<OutlinedInput label="Interval Reference Degrees" />}
          renderValue={(selected) => selected.sort().join(", ")}
        >
          {ALL_DEGREES.map((d) => (
            <MenuItem key={d} value={d}>
              <Checkbox checked={enabledIntervalReferenceDegrees.includes(d)} />
              <ListItemText primary={String(d)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 365, maxWidth: "100%" }} size="small">
        <InputLabel id="target-degree-select-label">Interval Target Degrees</InputLabel>
        <Select
          labelId="target-degree-select-label"
          multiple
          value={enabledIntervalTargetDegrees}
          onChange={handleTargetDegreeChange}
          input={<OutlinedInput label="Interval Target Degrees" />}
          renderValue={(selected) => selected.sort().join(", ")}
        >
          {ALL_DEGREES.map((d) => (
            <MenuItem key={d} value={d}>
              <Checkbox checked={enabledIntervalTargetDegrees.includes(d)} />
              <ListItemText primary={String(d)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default GlobalSettingsPanel;
