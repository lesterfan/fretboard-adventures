import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import FretboardRecognition from "./pages/FretboardRecognition";
import NoteOnAString from "./pages/NoteOnAString";
import TriadInversions from "./pages/TriadInversions";
import SeventhChordInversions from "./pages/SeventhChordInversions";
import MinorPentatonicScalePositions from "./pages/MinorPentatonicScalePositions";
import MajorPentatonicScalePositions from "./pages/MajorPentatonicScalePositions";
import MinorPentatonicDegreeIdentification from "./pages/MinorPentatonicDegreeIdentification";
import MajorPentatonicDegreeIdentification from "./pages/MajorPentatonicDegreeIdentification";
import ModeFromPentatonic from "./pages/ModeFromPentatonic";
import SeventhChordArpeggios from "./pages/SeventhChordArpeggios";
import IntervalTraining from "./pages/IntervalTraining";
import { Sidebar } from "./components/Sidebar";
import AllQuestionsCombined from "./pages/AllQuestionsCombined";
import { GlobalSettingsProvider } from "./GlobalSettingsContext";
import QuestionPageHost from "./components/QuestionPageHost";

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
    { path: "/minor_pentatonic", name: "Minor Pentatonic Positions" },
    { path: "/major_pentatonic", name: "Major Pentatonic Positions" },
    { path: "/minor_pentatonic_degrees", name: "Minor Pentatonic Degrees" },
    { path: "/major_pentatonic_degrees", name: "Major Pentatonic Degrees" },
    { path: "/mode_from_pentatonic", name: "Mode from Pentatonic" },
    { path: "/interval_training", name: "Interval Training" },
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
              <Route
                path="/fretboard_recognition"
                element={<QuestionPageHost getNextComponent={() => FretboardRecognition} />}
              />
              <Route
                path="/note_on_a_string"
                element={<QuestionPageHost getNextComponent={() => NoteOnAString} />}
              />
              <Route
                path="/triad_inversions"
                element={<QuestionPageHost getNextComponent={() => TriadInversions} />}
              />
              <Route
                path="/seventh_chord_inversions"
                element={<QuestionPageHost getNextComponent={() => SeventhChordInversions} />}
              />
              <Route
                path="/minor_pentatonic"
                element={
                  <QuestionPageHost getNextComponent={() => MinorPentatonicScalePositions} />
                }
              />
              <Route
                path="/major_pentatonic"
                element={
                  <QuestionPageHost getNextComponent={() => MajorPentatonicScalePositions} />
                }
              />
              <Route
                path="/minor_pentatonic_degrees"
                element={
                  <QuestionPageHost getNextComponent={() => MinorPentatonicDegreeIdentification} />
                }
              />
              <Route
                path="/major_pentatonic_degrees"
                element={
                  <QuestionPageHost getNextComponent={() => MajorPentatonicDegreeIdentification} />
                }
              />
              <Route
                path="/mode_from_pentatonic"
                element={<QuestionPageHost getNextComponent={() => ModeFromPentatonic} />}
              />
              <Route
                path="/seventh_chord_arpeggios"
                element={<QuestionPageHost getNextComponent={() => SeventhChordArpeggios} />}
              />
              <Route
                path="/interval_training"
                element={<QuestionPageHost getNextComponent={() => IntervalTraining} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </GlobalSettingsProvider>
  );
};

export default App;
