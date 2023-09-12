import { Button, Form, Container, Modal, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

// Regular expressions for each field
const REGEX_MAP = {
    username: /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,50})/,
};

// Error messages for each field
const ERROR_MAP = {
    username: "Fill in a correct username.",
    password: "Fill in a correct password.",
};

function LoginPage() {
    // Setting states and variables
    const searchWord = localStorage.getItem("searchWord");
    const navigatedFrom = localStorage.getItem("navigatedFrom");
    const navigatingTo = localStorage.getItem("navigatingTo");
    const [secondTitle, setSecondTitle] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [valid, setValid] = useState({});
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Setting secondTitle depending on navigatedFrom
        switch (navigatedFrom) {
            case "/Home":
                setSecondTitle(
                    `Greetings, please log in to continue your search for ${searchWord}.`
                );
                break;
            default:
                setSecondTitle(
                    "Welcome to Amore! Log in to embark on your unique fashion journey."
                );
        }
        // Remove the navigatedFrom from localStorage after setting secondTitle
        localStorage.removeItem("navigatedFrom");
    }, []);

    // Handle form validation
    useEffect(() => {
        const newValid = {};
        const newError = {};
        // Check if each field is valid
        for (const [key, regex] of Object.entries(REGEX_MAP)) {
            newValid[key] = regex.test(formData[key]);
            newError[key] = newValid[key] ? "" : ERROR_MAP[key];
        }
        // Set new valid and error objects
        setValid(newValid);
        setError(newError);
    }, [formData]);

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;
        // Send login request
        try {
            const response = await axios.post("Users/login", {
                username,
                password,
            });

            // Encrypt the token and store it in localStorage
            try {
                const secretKey = process.env.REACT_APP_SECRET_KEY;
                if (!secretKey || !response.data)
                    throw new Error("Invalid data or key");

                localStorage.setItem(
                    "token",
                    CryptoJS.AES.encrypt(response.data, secretKey).toString()
                );
            } catch (err) {
                console.error("Encryption or storage failed", err);
            }

            // Clear form data and redirect
            setFormData({ username: "", password: "" });
            localStorage.removeItem("navigatingTo");
            navigate(navigatingTo ? navigatingTo : "/Profile");
        } catch (error) {
            // Handle login failure (show modal)
            let errorMessage =
                error.response && error.response.data
                    ? error.response.data
                    : "Something went wrong.";
            setModalBody(errorMessage);
            setModalTitle("Login failed!");
            setShowModal(true);
        }
    };

    return (
        <Container fluid>
            <Row className="justify-content-center text-center">
                <Col className="wide-card login-page" xs={12} md={8}>
                    <h1>Login</h1>
                    {secondTitle && (
                        <h4 className="text-center">{secondTitle}</h4>
                    )}
                    <hr />
                    <Form onSubmit={handleSubmit}>
                        {["username", "password"].map((key) => (
                            <Form.Group controlId={key} key={key}>
                                <Form.Label>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Form.Label>
                                <Form.Control
                                    type={
                                        key === "password" ? "password" : "text"
                                    }
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    isInvalid={!!error[key]}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error[key]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        ))}

                        <Button
                            variant="success"
                            size="lg"
                            type="submit"
                            disabled={!Object.values(valid).every(Boolean)}
                        >
                            Login
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* Modal for window alerts */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <hr />
                    <p>{modalBody}</p>
                    <hr />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default LoginPage;
