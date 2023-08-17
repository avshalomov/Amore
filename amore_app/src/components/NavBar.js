import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <Navbar  expand="lg">
      <Navbar.Brand as={Link} to="/" ></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Button as={Link} to="/" variant="warning" className="navbar-button">Home</Button>
          <Button as={Link} to="/login" variant="warning" className="navbar-button">Login</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;