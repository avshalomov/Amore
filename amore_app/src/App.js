import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { createContext, useState, useEffect } from "react";
import RegisterPage from "./views/RegisterPage";
import AboutPage from "./views/AboutPage";
import LoginPage from "./views/LoginPage";
import StorePage from "./views/StorePage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./views/HomePage";

// Creating Product Context
export const ProductContext = createContext();

function App() {
  // State to hold products data
  const [products, setProducts] = useState([]);

  // Function to fetch products from the server
  const fetchProducts = () => {
    fetch("http://localhost:5164/api/Products") // or the correct endpoint if "api/Products" is not the full path
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("An error occurred while fetching the products:", error)
      );
  };

  // Using useEffect to call fetchProducts on initial render
  useEffect(() => {
    fetchProducts();
  }, []);

  // Rendering
  return (
    <Router>
      <ProductContext.Provider value={{ products, setProducts, fetchProducts }}>
        {/* Navigation Bar */}
        <NavBar />

        {/* Routes for different views */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </ProductContext.Provider>
    </Router>
  );
}

export default App;
