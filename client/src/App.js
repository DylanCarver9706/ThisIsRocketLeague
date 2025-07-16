import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dictionary from "./pages/Dictionary";
import WorldRecords from "./pages/WorldRecords";
import SubmitTerm from "./pages/SubmitTerm";
import SubmitRecord from "./pages/SubmitRecord";

function App() {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Navbar />
      <Box className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/world-records" element={<WorldRecords />} />
          <Route path="/submit-term" element={<SubmitTerm />} />
          <Route path="/submit-record" element={<SubmitRecord />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
