import React from "react";
import { Row, Col } from "react-bootstrap";
import "./Contact.css";

// Importing social media icons
import stackOverflowIcon from "../assets/images/footer/stackoverflow.png";
import whatsappIcon from "../assets/images/footer/whatsapp.png";
import linkedinIcon from "../assets/images/footer/linkedin.png";
import githubIcon from "../assets/images/footer/github.png";
import gmailIcon from "../assets/images/footer/gmail.png";

function Contact() {
  // Render Contact Us section with Whatsapp and Gmail links
  const renderContactUs = () => (
    <Col sm={12} md={6} lg={6} className="social-icons">
      <h5>Contact Us</h5>
      <a
        href="https://api.whatsapp.com/send?phone=972542895015&text=Hello%20%F0%9F%91%8B%2C%0AI%20wanted%20to%20talk%20about%20your%20Amore%20site."
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={whatsappIcon} alt="Whatsapp" />
      </a>
      <a
        href="mailto:Kananav95@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={gmailIcon} alt="Gmail" />
      </a>
    </Col>
  );

  // Render Follow Us section with GitHub, LinkedIn, and Stack Overflow links
  const renderFollowUs = () => (
    <Col sm={12} md={6} lg={6} className="social-icons">
      <h5>Follow Us</h5>
      <a
        href="https://github.com/avshalomov"
        target="_blank"
        rel="noopener noreferrer"
      >
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
  );

  return (
    <Row>
      {renderContactUs()}
      {renderFollowUs()}
    </Row>
  );
}

export default Contact;
