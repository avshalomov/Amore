import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DynamicTitles = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        const defaultTitle = "Amore - ";
        let formattedPath = location.pathname.substring(1);

        if (formattedPath) {
            formattedPath =
                formattedPath.charAt(0).toUpperCase() + formattedPath.slice(1);
            document.title = defaultTitle + formattedPath;
        } else {
            document.title = defaultTitle + "Home";
        }
    }, [location]);

    return children;
};

export default DynamicTitles;
