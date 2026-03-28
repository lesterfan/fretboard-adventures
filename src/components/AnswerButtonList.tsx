import { Button, Stack } from "@mui/material";
import React from "react";

interface Props {
  showingAnswer: boolean;
  onShowAnswer: () => void;
  onNext: () => void;
}

const styles = {
  buttonContainer: {
    marginTop: "1em",
  },
};

const AnswerButtonList: React.FC<Props> = ({ showingAnswer, onShowAnswer, onNext }) => {
  return (
    <Stack spacing={1} direction="row" sx={styles.buttonContainer}>
      {!showingAnswer ? (
        <Button variant="outlined" size="small" onClick={onShowAnswer}>
          Show Answer
        </Button>
      ) : (
        <Button variant="outlined" size="small" onClick={onNext}>
          Next
        </Button>
      )}
    </Stack>
  );
};

export default AnswerButtonList;
