import { Navigate } from "react-router-dom";
import { useAppContext } from "../AppContext";

// Protects routes based on the role of the user
const ProtectedRoute = ({ element, rolesAllowed }) => {
    const { role } = useAppContext();

    if (rolesAllowed.includes(role)) {
        return element;
    }

    return <Navigate to="/login" />;
};

export default ProtectedRoute;
