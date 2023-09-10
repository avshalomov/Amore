import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const HomePage = () => {
    return (
        <>
        <Container fluid className="home-page">
            <Row className="justify-content-center text-center">
                <Col xs={12} md={8}>
                    <h1>Welcome to Amore Clothing Store!</h1>
                    <h3>
                        Discover the latest fashion trends and shop for
                        high-quality clothing.
                    </h3>
                    <hr />
                    <h4>
                        Explore our exclusive collection and find your perfect
                        style.
                    </h4>
                    <Button
                        variant="warning"
                        size="lg"
                        href="/store"
                        role="button"
                    >
                        Shop Now
                    </Button>
                </Col>
            </Row>
        </Container>
        <h3 className="text-center mt-5">
            New Arrivals
        </h3>
        </>
    );
};

export default HomePage;
