import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    console.log(`auth: ${auth}`); // auth: [object Object]

    const location = useLocation();
    console.log(`location: ${location}`); // location


    return auth?.username ? (
        <Outlet />
    ) : (
        <Navigate
            to={{ pathname: "/login", state: { from: location } }}
            replace
        />
    );
};

export default RequireAuth;
