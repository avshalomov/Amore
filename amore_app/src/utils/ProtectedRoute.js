// import { useEffect } from "react";
// import { useAppContext } from "../context/AppContext";
// import { Navigate, useNavigate, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ element, protectedFor }) => {
//     const { role } = useAppContext();
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Setting navigatingTo and navigatedFrom
//     useEffect(() => {
//         const lastNavigatingTo = localStorage.getItem("navigatingTo");
//         localStorage.setItem("navigatedFrom", lastNavigatingTo);
//         localStorage.setItem("navigatingTo", location.pathname);
//     }, [location.pathname]);

//     // No protection
//     if (!protectedFor) {
//         return element;
//     }

//     // If logged-in user tries to access "Public" routes
//     if (role && protectedFor === "Public") {
//         return <Navigate to="/Profile" />;
//     }

//     // If a user is not logged in and the route is protected (not "Public")
//     if (!role && protectedFor !== "Public") {
//         return <Navigate to="/Login" />;
//     }

//     // Public is protected for non-logged in users
//     if (protectedFor === "Public" && !role) {
//         return element;
//     }

//     // User is protected for logged in users (User and Admin)
//     if (protectedFor === "User" && (role === "User" || role === "Admin")) {
//         return element;
//     }

//     // Admin is protected for Admin only
//     if (protectedFor === "Admin" && role === "Admin") {
//         return element;
//     }

//     return <Navigate to="/*" />;
// };

// export default ProtectedRoute;

import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element, protectedFor }) => {
    const { role } = useAppContext();
    const location = useLocation();

    // Updating navigatingTo and navigatedFrom
    useEffect(() => {
        const lastNavigatingTo = localStorage.getItem("navigatingTo");
        localStorage.setItem("navigatedFrom", lastNavigatingTo);
        localStorage.setItem("navigatingTo", location.pathname);
    }, [location.pathname]);

    // Helper functions
    const shouldNavigate = (target) => <Navigate to={target} />;
    const hasRole = (r) => role === r || role === "Admin";

    // No protection
    if (!protectedFor) return element;
    // If not logged-in user tries to access protected routes
    if (!role && protectedFor !== "Public") return shouldNavigate("/Login");
    // If logged-in user tries to access "Public" routes
    if (role && protectedFor === "Public") return shouldNavigate("/Profile");
    // Public is protected for non-logged in users
    if (protectedFor === "Public" && !role) return element;
    // User is protected for logged in users (User and Admin)
    if (protectedFor === "User" && hasRole("User")) return element;
    // Admin is protected for Admin only
    if (protectedFor === "Admin" && hasRole("Admin")) return element;

    return shouldNavigate("/*");
};

export default ProtectedRoute;
