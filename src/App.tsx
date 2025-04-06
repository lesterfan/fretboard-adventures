import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import GuitarNoteRecognition from "./pages/GuitarNoteRecognition";
import GuitarNoteGivenString from "./pages/GuitarNoteGivenString";

const App: React.FC = () => {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/guitar_note_recognition">Guitar Note Recognition</Link>
        <Link to="/guitar_note_given_string">Guitar Note Given String</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guitar_note_recognition" element={<GuitarNoteRecognition />} />
        <Route path="/guitar_note_given_string" element={<GuitarNoteGivenString />} />
      </Routes>
    </>
  );
};

export default App;
