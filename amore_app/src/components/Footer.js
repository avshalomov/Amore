import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import Contact from "./Contact";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col>
            <h5>About Amore</h5>
            <p>
              Online fashion store offering the latest trends. Your style, our
              passion.
            </p>
          </Col>
        </Row>
        <hr />
        <Contact />
        <hr />
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Amore. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
