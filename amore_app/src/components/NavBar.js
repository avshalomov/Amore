import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.css";
import "../assets/styles/body.css";

const BUTTONS = [
  { to: "/manage-products", text: "Manage Products", variant: "info" },
  { to: "/manage-users", text: "Manage Users", variant: "info" },
  { to: "/", text: "Home", variant: "warning" },
  { to: "/store", text: "Store", variant: "warning" },
  { to: "/about", text: "About", variant: "warning" },
  { to: "/login", text: "Login", variant: "warning" },
  { to: "/register", text: "Register", variant: "warning" },
];

function NavBar({ isDarkMode, toggleBackground }) {
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
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
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
