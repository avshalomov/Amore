import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Image } from "react-bootstrap";

// Custom Contexts
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";

// Stylesheets
import "./NavBar.css";

// Buttons to display in the NavBar.
// to = path to link to
// text = text to display on the button
// variant = color scheme for the button
// roles = array of roles that can see the button
const BUTTONS = [
    { to: "/Manage", text: "Manage", variant: "info", protectedFor: "Admin" },
    { to: "/", text: "Home", variant: "warning", protectedFor: null },
    { to: "/About", text: "About", variant: "warning", protectedFor: null },
    { to: "/Register", text: "Register", variant: "warning", protectedFor: "Public" },
    { to: "/Login", text: "Login", variant: "warning", protectedFor: "Public" },
    { to: "/Store", text: "Store", variant: "warning", protectedFor: "User" },
    { to: "/Profile", text: "Profile", variant: "warning", protectedFor: "User" },
    { to: "/Cart", text: "Cart", variant: "warning", protectedFor: "User" },
];

function NavBar() {
    const { isDarkMode, setIsDarkMode, role, userId } = useAppContext();
    const { users } = useDataContext();
    const [picture, setPicture] = useState(null);

    // Show profile icon if user is logged in
    useEffect(() => {
        if (userId && users) {
            const user = users.find((user) => user.userId === userId);
            if (user) {
                setPicture(user.picture);
            }
        } else setPicture(null);
    }, [userId, users]);

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
                className="dark-mode-button"
                onClick={toggleBackground}
                variant={isDarkMode ? "light" : "dark"}
            >
                <span>{isDarkMode ? "☀️" : "🌙"}</span>
            </Button>
            {picture && (
                <Link to="/Profile" className="profile-icon">
                    <Image
                        src={picture}
                        alt="Profile"
                        roundedCircle
                        height="40"
                        width="40"
                    />
                </Link>
            )}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-end"
            >
                <Nav>
                    {BUTTONS.filter((button) => {
                        if (
                            button.protectedFor === null ||
                            typeof button.protectedFor === "undefined"
                        ) {
                            return true; // Accessible for all
                        }
                        if (
                            button.protectedFor === "Public" &&
                            (role === null || typeof role === "undefined")
                        ) {
                            return true; // Accessible only if not logged in or role is undefined
                        }
                        if (
                            button.protectedFor === "User" &&
                            (role === "User" || role === "Admin")
                        ) {
                            return true; // Accessible for User and Admin
                        }
                        if (
                            button.protectedFor === "Admin" &&
                            role === "Admin"
                        ) {
                            return true; // Accessible only for Admin
                        }
                        return false;
                    }).map((button, index) => (
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
