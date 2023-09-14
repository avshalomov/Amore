import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element, protectedFor }) => {
    const { role } = useAppContext();
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top
        window.scrollTo(0, 0);
    
        // Update navigatingTo and navigatedFrom
        const lastNavigatingTo = localStorage.getItem("navigatingTo");
        localStorage.setItem("navigatedFrom", lastNavigatingTo);
        localStorage.setItem("navigatingTo", pathname);
    }, [pathname]);

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
