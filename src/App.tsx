import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Home from "./pages/Home";
import FretboardRecognition from "./pages/FretboardRecognition";
import NoteOnAString from "./pages/NoteOnAString";
import ChordOnAKey from "./pages/ChordOnAKey";
import { Sidebar } from "./components/Sidebar";
import NotFound from "./pages/NotFound";

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
    { path: "/fretboard_recognition", name: "Fretboard Recognition" },
    { path: "/note_on_a_string", name: "Note on a String" },
    { path: "/chord_in_a_key", name: "Chord in a Key" },
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
            paddingLeft: "1rem",
            paddingTop: "4rem",
            width: "100%",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fretboard_recognition" element={<FretboardRecognition />} />
            <Route path="/note_on_a_string" element={<NoteOnAString />} />
            <Route path="/chord_in_a_key" element={<ChordOnAKey />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
