import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import GuitarFrets from "./pages/GuitarFrets";

const App: React.FC = () => {
  return (
    <>
      <nav>
        <Link to="/" style={{ marginRight: "1rem" }}>
          Home
        </Link>
        <Link to="/guitar_frets">Guitar Frets</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guitar_frets" element={<GuitarFrets />} />
      </Routes>
    </>
  );
};

export default App;
