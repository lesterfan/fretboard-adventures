import { Button, Stack } from "@mui/material";
import React from "react";

interface Props {
  onShowAnswer: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

const styles = {
  buttonContainer: {
    marginTop: "1em",
  },
};

const AnswerButtonList: React.FC<Props> = ({ onShowAnswer, onCorrect, onIncorrect }) => {
  return (
    <Stack spacing={1} direction="row" sx={styles.buttonContainer}>
      <Button variant="outlined" size="small" onClick={onShowAnswer}>
        Show Answer
      </Button>
      <Button variant="outlined" size="small" onClick={onCorrect}>
        I got it right
      </Button>
      <Button variant="outlined" size="small" onClick={onIncorrect}>
        I got it wrong
      </Button>
    </Stack>
  );
};

export default AnswerButtonList;
