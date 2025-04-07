import React from "react";
import { Typography } from "@mui/material";

const Home: React.FC = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Fretboard Adventures
      </Typography>
      <Typography variant="body1" gutterBottom>
        Some interactive flash-card style games for learning guitar. Try out some of the games by
        clicking the guitar icon on the top left!
      </Typography>
    </>
  );
};

export default Home;
