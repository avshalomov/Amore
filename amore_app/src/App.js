// React and Router imports
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Utility imports
import ProtectedRoute from "./utils/ProtectedRoute";
import DynamicTitles from "./utils/DynamicTitles";

// Component imports
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";

// View imports
import HomePage from "./views/HomePage";
import AboutPage from "./views/AboutPage";
import RegisterPage from "./views/RegisterPage";
import LoginPage from "./views/LoginPage";

const App = () => {
    // Add routes here only (if added roles it will be a protected route)
    const routes = [
        { path: "*", element: <NotFoundPage /> },
        { path: "/Manage", element: <NotFoundPage />, roles: ["admin"] },
        { path: "/", element: <HomePage />},
        { path: "/About", element: <AboutPage />},
        { path: "/Register", element: <RegisterPage /> },
        { path: "/Login", element: <LoginPage /> },
        { path: "/Store", element: <NotFoundPage />, roles: ["user", "admin"] },
        { path: "/Profile", element: <NotFoundPage />, roles: ["user", "admin"] },
        { path: "/Cart", element: <NotFoundPage />, roles: ["user", "admin"] },
    ];

    // Automatically generates the routes from the routes array
    return (
        <BrowserRouter>
            <DynamicTitles>
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
            </DynamicTitles>
        </BrowserRouter>
    );
};

export default App;
