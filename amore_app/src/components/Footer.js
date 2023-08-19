import stackOverflowIcon from "../assets/images/footer/stackoverflow.png";
import linkedinIcon from "../assets/images/footer/linkedin.png";
import whatsappIcon from "../assets/images/footer/whatsapp.png";
import githubIcon from "../assets/images/footer/github.png";
import gmailIcon from "../assets/images/footer/gmail.png";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col>
            <h5>About Amore</h5>
            <p>Online fashion store offering the latest trends. Your style, our passion.</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={6} className="social-icons">
            <h5>Contact Us</h5>
            <a
              href="https://api.whatsapp.com/send?phone=972542895015&text=Hello%20%F0%9F%91%8B%2C%0AI%20wanted%20to%20talk%20about%20your%20Amore%20site."
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={whatsappIcon} alt="Whatsapp" />
            </a>
            <a href="mailto:Kananav95@gmail.com" target="_blank" rel="noopener noreferrer">
              <img src={gmailIcon} alt="Gmail" />
            </a>
          </Col>
          <Col md={6} className="social-icons">
            <h5>Follow Us</h5>
            <a href="https://github.com/avshalomov" target="_blank" rel="noopener noreferrer">
              <img src={githubIcon} alt="GitHub" />
            </a>
            <a
              href="https://il.linkedin.com/in/avshalomov"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a
              href="https://stackoverflow.com/users/17351432"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={stackOverflowIcon} alt="Stack Overflow" />
            </a>
          </Col>
        </Row>
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
