import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import LoginPage from "./views/LoginPage";
import NavBar from "./components/NavBar";
import HomePage from "./views/HomePage";
import RegisterPage from "./views/RegisterPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
