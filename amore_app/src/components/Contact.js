import React from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import whatsappIcon from "../assets/images/footer/whatsapp.png";
import gmailIcon from "../assets/images/footer/gmail.png";
import githubIcon from "../assets/images/footer/github.png";
import linkedinIcon from "../assets/images/footer/linkedin.png";
import stackOverflowIcon from "../assets/images/footer/stackoverflow.png";

// If added more links then the keys on slice should handled too
function Contact() {
    const socials = [
        {
            alt: "Whatsapp",
            icon: whatsappIcon,
            href: "https://api.whatsapp.com/send?phone=972542895015&text=Hello",
        },
        {
            alt: "Gmail",
            icon: gmailIcon,
            href: "mailto:Kananav95@gmail.com",
        },
        {
            alt: "GitHub",
            icon: githubIcon,
            href: "https://github.com/avshalomov",
        },
        {
            alt: "LinkedIn",
            icon: linkedinIcon,
            href: "https://il.linkedin.com/in/avshalomov",
        },
        {
            alt: "Stack Overflow",
            icon: stackOverflowIcon,
            href: "https://stackoverflow.com/users/17351432",
        },
    ];

    return (
        <Container fluid>
            <Row className="justify-content-center text-center">
                <Col sm={12} md={6}>
                    <h5>Contact Us</h5>
                    {socials.slice(0, 2).map((social, index) => (
                        <Link
                            key={index} // Add this line
                            className="d-inline-block rounded m-2"
                            to={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image src={social.icon} alt={social.alt} />
                        </Link>
                    ))}
                </Col>
                <Col sm={12} md={6}>
                    <h5>Follow Us</h5>
                    {socials.slice(2).map((social, index) => (
                        <Link
                            key={index + 2} // Add this line
                            className="d-inline-block rounded m-2"
                            to={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image src={social.icon} alt={social.alt} />
                        </Link>
                    ))}
                </Col>
            </Row>
        </Container>
    );
}

export default Contact;
