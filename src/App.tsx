import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Home from "./pages/Home";
import NoteRecognition from "./pages/NoteRecognition";
import NoteGivenString from "./pages/NoteGivenString";
import ChordGivenKey from "./pages/ChordGivenKey";
import { Sidebar } from "./components/Sidebar";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-sizeSmall": {
            minWidth: "80px",
            padding: "2px 8px",
            fontSize: "0.75rem",
            color: "black",
            borderColor: "black",
            "&:hover": {
              borderColor: "black",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h3: {
          marginTop: "0.35em",
          marginBottom: "0.35em",
        },
      },
    },
  },
});

const App: React.FC = () => {
  const routes = [
    { path: "/", name: "Home" },
    { path: "/note_recognition", name: "Note Recognition" },
    { path: "/note_given_string", name: "Note Given String" },
    { path: "/chord_given_key", name: "Chord Given Key" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Sidebar routes={routes} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            paddingTop: 0,
            width: "100%",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/note_recognition" element={<NoteRecognition />} />
            <Route path="/note_given_string" element={<NoteGivenString />} />
            <Route path="/chord_given_key" element={<ChordGivenKey />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
