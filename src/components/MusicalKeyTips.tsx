import React from "react";
import {
  getMajorKeyChordPattern,
  getMajorKeyNotePattern,
  getMinorKeyChordPattern,
  getMinorKeyNotePattern,
} from "../library/Library";
import { Box, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";

interface Props {
  showTips: boolean;
  setShowTips: (showTips: boolean) => void;
  includeMinorKeys: boolean;
  setIncludeMinorKeys: (includeMinorKeys: boolean) => void;
}

const styles = {
  tipsContainer: {
    marginTop: "0",
  },
  checkboxContainer: {
    mb: 2,
    "& .MuiFormControlLabel-root": { maxHeight: "1.5em" },
  },
};

const MusicalKeyTips: React.FC<Props> = ({
  showTips,
  setShowTips,
  includeMinorKeys,
  setIncludeMinorKeys,
}) => {
  return (
    <>
      <Stack sx={styles.checkboxContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeMinorKeys}
              onChange={() => setIncludeMinorKeys(!includeMinorKeys)}
              size="small"
            />
          }
          label="Include minor keys"
        />
        <FormControlLabel
          control={
            <Checkbox checked={showTips} onChange={() => setShowTips(!showTips)} size="small" />
          }
          label="Show tips"
        />
      </Stack>
      <div hidden={!showTips}>
        <Typography variant="body1" gutterBottom>
          Tips:
        </Typography>
        <Box component="ol" sx={styles.tipsContainer}>
          <li>Major key note pattern: {getMajorKeyNotePattern().join(", ")}</li>
          <li>Major key chord pattern: {getMajorKeyChordPattern().join(", ")}</li>
          {includeMinorKeys ? (
            <>
              <li>The 6th note of the major scale is the relative minor.</li>
              <li>The 3rd note of the minor scale is the relative major.</li>
              <li>Minor key note pattern: {getMinorKeyNotePattern().join(", ")}</li>
              <li>Minor key chord pattern: {getMinorKeyChordPattern().join(", ")}</li>
            </>
          ) : null}
        </Box>
      </div>
    </>
  );
};

export default MusicalKeyTips;
