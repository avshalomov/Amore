import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import notfound from "../assets/images/404page/404.webp";
import confused from "../assets/images/404page/confused.gif";

const background = {
    backgroundImage: `url(${confused})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
};

export default function NotFoundPage() {
    return (
        <Container fluid style={background}>
            <Row className="justify-content-center text-center">
                <Col className="wide-card">
                    <Image
                        src={notfound}
                        fluid
                        style={{ width: "150px", borderRadius: "50%" }}
                    />
                    <h1>Page Not Found</h1>
                    <hr />
                    <Button href="/" variant="warning" size="lg">
                        Go Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
