import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";

// Importing the context providers
import { AppProvider } from "./context/AppContext";
import { DataProvider } from "./context/DataContext";

// Importing the global styles
import "./assets/styles/buttons.css";
import "./assets/styles/body.css";
import "./assets/styles/text.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Providing the AppContext to the entire app
root.render(
    <React.StrictMode>
        <AppProvider>
            <DataProvider>
                <App />
            </DataProvider>
        </AppProvider>
    </React.StrictMode>
);

reportWebVitals();
