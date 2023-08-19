import { Container, Row, Col, Button, Form } from "react-bootstrap";
import React from "react";
import "./LoginPage.css";

function LoginPage() {
  return (
    <Container className="p-4">
      <Row className="my-5">
        <Col className="login-col">
          <h1>Login to Amore</h1>
          <h2>Enter your credentials below</h2>
          <hr />
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Email address" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="warning" size="lg" type="submit">
              Login
            </Button>
          </Form>
          <hr />
          <h3>Don't have an account?</h3>
          <Button variant="warning" size="lg" href="/register" role="button">
            Register
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
