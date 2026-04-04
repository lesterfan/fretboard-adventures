import { Box, Button, Collapse, Stack } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import React, { useState } from "react";
import GlobalSettingsPanel from "./GlobalSettingsPanel";

interface Props {
  showingAnswer: boolean;
  onShowAnswer: () => void;
  onNext: () => void;
}

const AnswerButtonList: React.FC<Props> = ({ showingAnswer, onShowAnswer, onNext }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Stack
      spacing={1}
      sx={{ marginTop: "0.5em", width: 380, maxWidth: "100%", paddingLeft: "15px" }}
    >
      <Stack spacing={1} direction="row">
        {!showingAnswer ? (
          <Button variant="outlined" size="large" fullWidth onClick={onShowAnswer}>
            Show Answer
          </Button>
        ) : (
          <Button variant="outlined" size="large" fullWidth onClick={onNext}>
            Next
          </Button>
        )}
        <Button
          variant="outlined"
          size="large"
          onClick={() => setSettingsOpen((o) => !o)}
          sx={{ minWidth: 0, px: 1.5 }}
        >
          <SettingsIcon />
        </Button>
      </Stack>
      <Collapse in={settingsOpen}>
        <Box sx={{ pt: 2 }}>
          <GlobalSettingsPanel />
        </Box>
      </Collapse>
    </Stack>
  );
};

export default AnswerButtonList;
