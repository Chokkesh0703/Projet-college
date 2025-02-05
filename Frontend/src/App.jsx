import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/login/index";
import StudentHomePage from "./components/pages/StudentHome"; // Ensure this import is correct

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/StudentHomePage" element={<StudentHomePage />} /> {/* Correct path */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;