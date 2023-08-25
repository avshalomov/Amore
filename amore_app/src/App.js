import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ManageProductsPage from "./views/ManageProductsPage";
import RegisterPage from "./views/RegisterPage";
import AboutPage from "./views/AboutPage";
import LoginPage from "./views/LoginPage";
import StorePage from "./views/StorePage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./views/HomePage";
import useProducts from "./hooks/useProducts";

export const ProductContext = createContext();

function App() {
  const { products, setProducts, fetchProducts } = useProducts();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleBackground = () => {
    const darkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("dark-mode", darkMode.toString());
    setIsDarkMode(darkMode);
  };

  useEffect(() => {
    const darkMode = localStorage.getItem("dark-mode") === "true";
    document.body.classList.toggle("dark-mode", darkMode);
    setIsDarkMode(darkMode);
  }, []);

  return (
    <Router>
      <ProductContext.Provider value={{ products, setProducts, fetchProducts }}>
        <NavBar isDarkMode={isDarkMode} toggleBackground={toggleBackground} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/manage-products" element={<ManageProductsPage />} />
        </Routes>
        <Footer />
      </ProductContext.Provider>
    </Router>
  );
}

export default App;
