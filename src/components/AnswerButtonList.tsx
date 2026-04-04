import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import React, { useState } from "react";
import GlobalSettingsPanel from "./GlobalSettingsPanel";
import { useQuestionHistory } from "../QuestionHistoryContext";

interface Props {
  showingAnswer: boolean;
  onShowAnswer: () => void;
}

const AnswerButtonList: React.FC<Props> = ({ showingAnswer, onShowAnswer }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { canGoBack, goBack, canGoForward, currentIndex, entries, advance } = useQuestionHistory();
  const stepsBack = entries.length - 1 - currentIndex;
  const showHistoryIndicator = canGoForward;

  return (
    <Stack
      spacing={1}
      sx={{ marginTop: "0.5em", width: 380, maxWidth: "100%", paddingLeft: "15px" }}
    >
      <Stack spacing={1} direction="row">
        <Button
          variant="outlined"
          size="large"
          onClick={goBack}
          disabled={!canGoBack}
          sx={{ minWidth: 0, px: 1.5 }}
        >
          <ArrowBackIcon />
        </Button>
        {!showingAnswer ? (
          <Button variant="outlined" size="large" fullWidth onClick={onShowAnswer}>
            Show Answer
          </Button>
        ) : (
          <Button variant="outlined" size="large" fullWidth onClick={advance}>
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
      {showHistoryIndicator && (
        <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary" }}>
          {stepsBack} {stepsBack === 1 ? "question" : "questions"} back ({entries.length - 1} saved)
        </Typography>
      )}
      <Collapse in={settingsOpen}>
        <Box sx={{ pt: 2 }}>
          <GlobalSettingsPanel />
        </Box>
      </Collapse>
    </Stack>
  );
};

export default AnswerButtonList;
