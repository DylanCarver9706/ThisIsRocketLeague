import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dictionary from "./pages/Dictionary";
import TermDetail from "./pages/TermDetail";
import WorldRecords from "./pages/WorldRecords";
import Plugins from "./pages/Plugins";
import CarDesigns from "./pages/CarDesigns";
import Admin from "./pages/Admin";

function App() {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Navbar />
      <Box className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/dictionary/:slug" element={<TermDetail />} />
          <Route path="/world-records" element={<WorldRecords />} />
          <Route path="/plugins" element={<Plugins />} />
          <Route path="/car-designs" element={<CarDesigns />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
