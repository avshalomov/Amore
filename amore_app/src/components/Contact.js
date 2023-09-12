import React from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import stackOverflowIcon from "../assets/images/footer/stackoverflow.png";
import whatsappIcon from "../assets/images/footer/whatsapp.png";
import linkedinIcon from "../assets/images/footer/linkedin.png";
import githubIcon from "../assets/images/footer/github.png";
import gmailIcon from "../assets/images/footer/gmail.png";

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
                <Col sm={12} md={6} className="my-3">
                    <h5>Contact Us</h5>
                    {socials.slice(0, 2).map((social) => (
                        <Link
                            className="d-inline-block mx-2"
                            to={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image src={social.icon} alt={social.alt} />
                        </Link>
                    ))}
                </Col>
                <Col sm={12} md={6} className="my-3">
                    <h5>Follow Us</h5>
                    {socials.slice(2).map((social) => (
                        <Link
                            className="d-inline-block mx-2"
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
