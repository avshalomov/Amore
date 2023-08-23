import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import "./NavBar.css";

function NavBar() {
  return (
    <Navbar expand="lg">
      <Navbar.Brand as={Link} to="/"></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Button as={Link} to="/" variant="primary">primary</Button>
          <Button as={Link} to="/" variant="secondary">secondary</Button>
          <Button as={Link} to="/" variant="success">success</Button>
          <Button as={Link} to="/" variant="warning">warning</Button>
          <Button as={Link} to="/" variant="danger">danger</Button>
          <Button as={Link} to="/" variant="info">info</Button>
          <Button as={Link} to="/" variant="light">light</Button>
          <Button as={Link} to="/" variant="dark">dark</Button>
          <Button as={Link} to="/" variant="link">link</Button>
          
          {/* <Button as={Link} to="/" variant="warning" className="navbar-button">
            Home
          </Button>
          <Button
            as={Link}
            to="/about"
            variant="warning"
            className="navbar-button"
          >
            About
          </Button>
          <Button
            as={Link}
            to="/login"
            variant="warning"
            className="navbar-button"
          >
            Login
          </Button>
          <Button
            as={Link}
            to="/register"
            variant="warning"
            className="navbar-button"
          >
            Register
          </Button> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
