import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./HomePage.css";

function HomePage() {
  return (
    <Container className="p-4">
      <Row className="my-5">
        <Col className="home-col">
          <h1>Welcome to Amore Clothing Store!</h1>
          <h2>Discover the latest fashion trends and shop for high-quality clothing.</h2>
          <hr />

          <h3>Explore our exclusive collection and find your perfect style.</h3>

          {/* Shop Now Button leading to the Store Page */}
          <Button variant="warning" size="lg" href="/store" role="button">
            Shop Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
