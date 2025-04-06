import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import NoteRecognition from "./pages/NoteRecognition";
import NoteGivenString from "./pages/NoteGivenString";

const App: React.FC = () => {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/note_recognition">Note Recognition</Link>
        <Link to="/note_given_string">Note Given String</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note_recognition" element={<NoteRecognition />} />
        <Route path="/note_given_string" element={<NoteGivenString />} />
      </Routes>
    </>
  );
};

export default App;
