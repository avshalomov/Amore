import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Loading from "./Loading";

const ProtectedRoute = ({ element, protectedFor }) => {
    const { role } = useAppContext();
    const { pathname } = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        // If either token or role is missing, but not both
        if ((token && !role) || (!token && role)) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
            // Scroll to top
            window.scrollTo(0, 0);
            // Update navigatingTo and navigatedFrom
            const lastNavigatingTo = localStorage.getItem("navigatingTo");
            localStorage.setItem("navigatedFrom", lastNavigatingTo);
            localStorage.setItem("navigatingTo", pathname);
        }
    }, [pathname, role]);

    // Helper functions
    const shouldNavigate = (target) => <Navigate to={target} />;
    const hasRole = (r) => role === r || role === "Admin";

    // Loading
    if (isLoading) return <Loading />;
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
