import React from "react";
import { Typography } from "@mui/material";

const NotFound: React.FC = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you're looking for doesn't exist. Click the guitar on the top left to go to a valid
        page.
      </Typography>
    </>
  );
};

export default NotFound;
