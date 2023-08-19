import { Container, Row, Col, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import "./RegisterPage.css";

function RegisterPage() {
  const [imageBase64, setImageBase64] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      // 5 MB
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image under 5MB.");
    }
  };

  return (
    <Container className="p-4">
      <Row className="my-5">
        <Col className="register-col">
          <h1>Join Amore Clothing Store!</h1>
          <h2>Create your account to explore exclusive fashion.</h2>
          <hr />
          {imageBase64 && <img src={imageBase64} alt="Preview" className="image-preview" />}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Email address" required maxLength={50} />
                </Form.Group>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Username" required maxLength={20} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" required />
                </Form.Group>
                <Form.Group controlId="formImage">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <Button variant="warning" type="submit" size="lg" role="button">
                  Register
                </Button>
              </Col>
            </Row>
          </Form>
          <hr />
          <h3>Already have an account?</h3>
          <Button variant="warning" size="lg" href="/login" role="button">
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
