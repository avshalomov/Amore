// React and Router imports
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Utility imports
import ProtectedRoute from "./utils/ProtectedRoute";
import DynamicTitles from "./utils/DynamicTitles";

// Component imports
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// View imports
import NotFoundPage from "./views/NotFoundPage";
import ManagePage from "./views/ManagePage";
import HomePage from "./views/HomePage";
import AboutPage from "./views/AboutPage";
import RegisterPage from "./views/RegisterPage";
import LoginPage from "./views/LoginPage";
import StorePage from "./views/StorePage";
import ProfilePage from "./views/ProfilePage";
import CartPage from "./views/CartPage";
import ProductPage from "./views/ProductPage";

const App = () => {
    // Add routes here only (if needs protection then add a role to protectedFor)
    const routes = [
        { path: "*", element: <NotFoundPage /> },
        { path: "/Manage", element: <ManagePage />, protectedFor: "Admin" },
        { path: "/", element: <HomePage /> },
        { path: "/About", element: <AboutPage /> },
        { path: "/Register", element: <RegisterPage />, protectedFor: "Public" },
        { path: "/Login", element: <LoginPage />, protectedFor: "Public" },
        { path: "/Store", element: <StorePage />, protectedFor: "User" },
        { path: "/Profile", element: <ProfilePage />, protectedFor: "User" },
        { path: "/Cart", element: <CartPage />, protectedFor: "User" } ,
        { path: "/Products/:productId", element: <ProductPage />, protectedFor: "User" },
    ];

    // Automatically generates the routes from the routes array
    return (
        <BrowserRouter>
            <DynamicTitles>
                <NavBar />
                <Routes>
                    {routes.map(({ path, element, protectedFor }, index) => (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <ProtectedRoute
                                    protectedFor={protectedFor}
                                    element={element}
                                />
                            }
                        />
                    ))}
                </Routes>
                <Footer />
            </DynamicTitles>
        </BrowserRouter>
    );
};

export default App;
