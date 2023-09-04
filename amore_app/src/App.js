import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ManageProductsPage from "./views/ManageProductsPage";
import RegisterPage from "./views/RegisterPage";
import AboutPage from "./views/AboutPage";
import LoginPage from "./views/LoginPage";
import StorePage from "./views/StorePage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./views/HomePage";
import ManageUsersPage from "./views/ManageUsersPage";
import EditUserPage from "./views/EditUserPage";

import useCRUD from "./hooks/useCRUD";
export const DataContext = createContext();

function App() {
    const users = useCRUD([], "Users");
    const products = useCRUD([], "Products");
    const orders = useCRUD([], "Orders");
    const orderItems = useCRUD([], "OrderItems");
    const carts = useCRUD([], "Carts");
    const cartItems = useCRUD([], "CartItems");

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
        <DataContext.Provider
            value={{ users, products, orders, orderItems, carts, cartItems }}
        >
            <Router>
                <NavBar
                    isDarkMode={isDarkMode}
                    toggleBackground={toggleBackground}
                />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route
                        path="/manage-products"
                        element={<ManageProductsPage />}
                    />
                    <Route path="/manage-users" element={<ManageUsersPage />} />
                    <Route
                        path="/manage-users/:userId"
                        element={<EditUserPage />}
                    />
                </Routes>
                <Footer />
            </Router>
        </DataContext.Provider>
    );
}

export default App;
