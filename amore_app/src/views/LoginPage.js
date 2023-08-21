// Importing necessary components and styling
import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./LoginPage.css";

function LoginPage() {
  return (
    <Container className="p-4">
      <Row className="my-5">
        <Col className="login-col">
          {/* Login Heading */}
          <h1>Login to Amore</h1>
          <h2>Enter your credentials below</h2>
          <hr />

          {/* Login Form */}
          <Form>
            <Row>
              {/* Email Input */}
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Email address" />
                </Form.Group>
              </Col>

              {/* Password Input */}
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
              </Col>
            </Row>

            {/* Login Button */}
            <Button variant="warning" size="lg" type="submit">
              Login
            </Button>
          </Form>
          <hr />

          {/* Registration Redirect */}
          <h3>Don't have an account?</h3>
          <Button variant="warning" size="lg" href="/register" role="button">
            Register
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

// Exporting the component for use in other parts of the application
export default LoginPage;
