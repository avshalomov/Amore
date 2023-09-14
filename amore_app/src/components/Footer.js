import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Contact from "./Contact";
import fabricImage from "../assets/images/footer/fabric1920x653.png";

function Footer() {
    return (
        <footer
            style={{
                backgroundImage: `url(${fabricImage})`,
                padding: "2vw",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                borderTop: "3px inset darkgoldenrod",
            }}
        >
            <Container fluid>
                <Row className="justify-content-center text-center">
                    <Col xs={12} md={8}>
                        <h5>About Amore</h5>
                        <p>
                            Online fashion store offering the latest trends.
                            Your style, our passion.
                        </p>
                        <hr />
                        <Contact />
                        <hr />
                        <h6>
                            &copy; {new Date().getFullYear()} Amore. All rights
                            reserved.
                        </h6>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
