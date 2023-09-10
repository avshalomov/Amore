import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ProtectedRoute from "./utils/ProtectedRoute";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";
import HomePage from "./views/HomePage";
import AboutPage from "./views/AboutPage";
import RegisterPage from "./views/RegisterPage";
import LoginPage from "./views/LoginPage";

const App = () => {
    // If roles are not specified, the route is public
    const routes = [
        { path: "*", element: <NotFoundPage /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/", element: <HomePage />, roles: ["User", "Admin"] },
        { path: "/about", element: <AboutPage />, roles: ["Admin"] },
    ];

    // Automatically generates the routes from the routes array
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                {routes.map(({ path, element, roles }, index) => (
                    <Route
                        key={index}
                        path={path}
                        element={
                            roles ? (
                                <ProtectedRoute
                                    rolesAllowed={roles}
                                    element={element}
                                />
                            ) : (
                                element
                            )
                        }
                    />
                ))}
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
