import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import LoginPage from './views/LoginPage';
import NavBar from './components/NavBar';
import HomePage from './views/HomePage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;