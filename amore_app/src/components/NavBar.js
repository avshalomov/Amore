import { Navbar, Nav, Button } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../AppContext";
import "./NavBar.css";
import "../assets/styles/body.css";

// Buttons for the navbar
const BUTTONS = [
    { to: "/", text: "Home", variant: "warning" },
    { to: "/about", text: "About", variant: "warning" },
    { to: "/register", text: "Register", variant: "warning" },
    { to: "/login", text: "Login", variant: "warning" },
];

function NavBar() {
    const { isDarkMode, setIsDarkMode } = useAppContext();

    // Toggle dark mode
    const toggleBackground = () => {
        const darkMode = !isDarkMode;
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("dark-mode", darkMode.toString());
        setIsDarkMode(darkMode);
    };

    return (
        <Navbar expand="lg">
            <Navbar.Brand as={Link} to="/"></Navbar.Brand>
            <Button
                onClick={toggleBackground}
                variant={isDarkMode ? "light" : "dark"}
            >
                <span>{isDarkMode ? "☀️" : "🌙"}</span>
            </Button>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-end"
            >
                <Nav>
                    {BUTTONS.map((button, index) => (
                        <Button
                            as={Link}
                            to={button.to}
                            variant={button.variant}
                            key={index}
                        >
                            {button.text}
                        </Button>
                    ))}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
