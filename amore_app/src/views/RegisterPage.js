import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./RegisterPage.css";

function RegisterPage() {
  // State to hold the image in base64 format
  const [imageBase64, setImageBase64] = useState("");

  // Handler function to change the image and validate its size
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // Limit image size to 5 MB
    if (file && file.size < 5 * 1024 * 1024) {
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
          {/* Registration header */}
          <h1>Join Amore Clothing Store!</h1>
          <h2>Create your account to explore exclusive fashion.</h2>
          <hr />

          {/* Image preview if selected */}
          {imageBase64 && <img src={imageBase64} alt="Preview" className="image-preview" />}

          {/* Registration Form */}
          <Form>
            <Row>
              {/* Left Side: Email & Username */}
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

              {/* Right Side: Password & Image */}
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" required />
                </Form.Group>
                <Form.Group controlId="formImage">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
                </Form.Group>
              </Col>
            </Row>
            
            {/* Register Button */}
            <Row>
              <Col className="text-center">
                <Button variant="warning" type="submit" size="lg" role="button">
                  Register
                </Button>
              </Col>
            </Row>
          </Form>

          {/* Login link for existing users */}
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
