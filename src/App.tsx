import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import FretboardRecognition from "./pages/FretboardRecognition";
import NoteOnAString from "./pages/NoteOnAString";
import TriadInversions from "./pages/TriadInversions";
import SeventhChordInversions from "./pages/SeventhChordInversions";
import PentatonicScalePositions from "./pages/PentatonicScalePositions";
import PentatonicDegreeIdentification from "./pages/PentatonicDegreeIdentification";
import ModeFromPentatonic from "./pages/ModeFromPentatonic";
import SeventhChordArpeggios from "./pages/SeventhChordArpeggios";
import { Sidebar } from "./components/Sidebar";
import AllQuestionsCombined from "./pages/AllQuestionsCombined";
import { GlobalSettingsProvider } from "./GlobalSettingsContext";

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
        outlined: {
          color: "black",
          borderColor: "black",
          "&:hover": {
            borderColor: "black",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
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
        body1: {
          paddingLeft: "15px",
        },
      },
    },
  },
});

const App: React.FC = () => {
  const routes = [
    { path: "/", name: "Fretboard Adventures" },
    { path: "/fretboard_recognition", name: "Fretboard Recognition" },
    { path: "/note_on_a_string", name: "Note on a String" },
    { path: "/triad_inversions", name: "Triad Inversions" },
    { path: "/seventh_chord_inversions", name: "Seventh Chord Inversions" },
    { path: "/seventh_chord_arpeggios", name: "Seventh Chord Arpeggios" },
    { path: "/pentatonic", name: "Pentatonic Scale Positions" },
    { path: "/pentatonic_degrees", name: "Pentatonic Degrees" },
    { path: "/mode_from_pentatonic", name: "Mode from Pentatonic" },
  ];

  return (
    <GlobalSettingsProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Sidebar routes={routes} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              paddingLeft: "1rem",
              paddingTop: "4rem",
              width: "100%",
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route path="/" element={<AllQuestionsCombined />} />
              <Route path="/fretboard_recognition" element={<FretboardRecognition />} />
              <Route path="/note_on_a_string" element={<NoteOnAString />} />
              <Route path="/triad_inversions" element={<TriadInversions />} />
              <Route path="/seventh_chord_inversions" element={<SeventhChordInversions />} />
              <Route path="/pentatonic" element={<PentatonicScalePositions />} />
              <Route path="/pentatonic_degrees" element={<PentatonicDegreeIdentification />} />
              <Route path="/mode_from_pentatonic" element={<ModeFromPentatonic />} />
              <Route path="/seventh_chord_arpeggios" element={<SeventhChordArpeggios />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </GlobalSettingsProvider>
  );
};

export default App;
