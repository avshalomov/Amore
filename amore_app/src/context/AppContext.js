import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useRef,
} from "react";
import CryptoJS from "crypto-js";
import jwt_decode from "jwt-decode";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [expires, setExpires] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const expiresRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // Decrypts the token and sets the state variables
    const updateTokenState = (encryptedToken) => {
        // Decrypt the token
        const decryptedToken = CryptoJS.AES.decrypt(
            encryptedToken,
            process.env.REACT_APP_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);
        // Decode the token
        const decoded = jwt_decode(decryptedToken);
        // Set the state variables
        setToken(decryptedToken);
        setUserId(Number(decoded.UserId));
        setRole(
            decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ]
        );
        const expDate = new Date(decoded.exp * 1000);
        expiresRef.current = expDate;
        setExpires(expDate);
        setIsLoading(false);
    };

    // Clears the state variables
    const clearTokenState = () => {
        setToken(null);
        setUserId(null);
        setRole(null);
        setExpires(null);
        setIsLoading(false);
    };

    // Handles the token change event
    const handleTokenChange = () => {
        setIsLoading(true);
        const encryptedToken = localStorage.getItem("token");
        encryptedToken ? updateTokenState(encryptedToken) : clearTokenState();
    };

    // Handles the storage change event
    const handleStorageChange = (e) => e.key === "token" && handleTokenChange();

    // Initial setup
    useEffect(() => {
        // Initialize dark mode
        const initDarkMode = () => {
            const darkMode = localStorage.getItem("dark-mode") === "true";
            document.body.classList.toggle("dark-mode", darkMode);
            setIsDarkMode(darkMode);
        };

        // Check if the token has expired
        const checkTokenExpiration = () => {
            if (expiresRef.current && new Date() >= expiresRef.current) {
                localStorage.removeItem("token");
                clearTokenState();
                console.log(`Token expired at ${expiresRef.current}`);
            }
        };

        initDarkMode();
        handleTokenChange();

        // Add event listener
        window.addEventListener("storage", handleStorageChange);

        // Check token expiration every minute
        const expirationChecker = setInterval(checkTokenExpiration, 60000);

        // Cleanup
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(expirationChecker);
        };
    }, []);

    // Refreshes the token
    const refreshToken = () => {
        handleTokenChange();
    };

    return (
        <AppContext.Provider
            value={{
                token,
                setToken,
                userId,
                setUserId,
                role,
                setRole,
                expires,
                setExpires,
                isDarkMode,
                setIsDarkMode,
                isLoading,
                refreshToken,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a AppProvider");
    }
    return context;
};
