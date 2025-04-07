import React from "react";
import { Typography } from "@mui/material";

const Home: React.FC = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Fretboard Adventures
      </Typography>
      <Typography variant="body1" gutterBottom>
        Some interactive test flash-card style games to help study guitar. Try out some of the games
        in the menu above!
      </Typography>
    </>
  );
};

export default Home;
