import { Button, Stack } from "@mui/material";
import React from "react";

interface Props {
  showingAnswer: boolean;
  onShowAnswer: () => void;
  onNext: () => void;
}

const AnswerButtonList: React.FC<Props> = ({ showingAnswer, onShowAnswer, onNext }) => {
  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{ marginTop: "0.5em", width: 380, maxWidth: "100%", paddingLeft: "15px" }}
    >
      {!showingAnswer ? (
        <Button variant="outlined" size="large" fullWidth onClick={onShowAnswer}>
          Show Answer
        </Button>
      ) : (
        <Button variant="outlined" size="large" fullWidth onClick={onNext}>
          Next
        </Button>
      )}
    </Stack>
  );
};

export default AnswerButtonList;
