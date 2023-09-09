import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./views/HomePage";
import AboutPage from "./views/AboutPage";
import RegisterPage from "./views/RegisterPage";
import LoginPage from "./views/LoginPage";
// import ManageProductsPage from "./views/ManageProductsPage";
// import StorePage from "./views/StorePage";
// import ManageUsersPage from "./views/ManageUsersPage";
// import EditUserPage from "./views/EditUserPage";
// import API_TEST from "./views/API_TEST";

// import useCRUD from "./hooks/useCRUD";
// export const DataContext = createContext();

function App() {
    // const users = useCRUD([], "Users");
    // const products = useCRUD([], "Products");
    // const orders = useCRUD([], "Orders");
    // const orderItems = useCRUD([], "OrderItems");
    // const carts = useCRUD([], "Carts");
    // const cartItems = useCRUD([], "CartItems");

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
        // <DataContext.Provider
        //     value={{ users, products, orders, orderItems, carts, cartItems }}
        // >
            <Router>
                <NavBar
                    isDarkMode={isDarkMode}
                    toggleBackground={toggleBackground}
                />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    {/* <Route path="/store" element={<StorePage />} /> */}
                    {/* <Route */}
                        {/* path="/manage-products" */}
                        {/* element={<ManageProductsPage />} */}
                    {/* /> */}
                    {/* <Route path="/manage-users" element={<ManageUsersPage />} /> */}
                    {/* <Route */}
                        {/* path="/manage-users/:userId" */}
                        {/* element={<EditUserPage />} */}
                    {/* /> */}
                    {/* <Route path="/API_TEST" element={<API_TEST />} /> */}
                </Routes>
                <Footer />
            </Router>
        // </DataContext.Provider>
    );
}

export default App;
