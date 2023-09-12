import { Button, Form, Container, Modal, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import CryptoJS from "crypto-js";
import { useAppContext } from "../context/AppContext";

const TITLE_MAP = {
    "/": "Hey there! Log in to continue your exciting journey.",
    "/Store": "Welcome, fashionista! Log in to shop for the latest trends.",
    "/Profile": "Hi again! Log in to personalize your experience.",
    "/Cart": "Almost there! Log in to complete your purchase.",
    "/Manage": "Greetings, Admin! Log in to manage the store.",
    "/About": "Curious, aren't you? Log in to learn more about us.",
    "/Register": "New here? Log in or register to get started.",
};

function LoginPage() {
    const [secondTitle, setSecondTitle] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const { refreshToken } = useAppContext();

    // Setting secondTitle depending on navigatedFrom
    useEffect(() => {
        const searchWord = localStorage.getItem("searchWord");
        const navigatedFrom = localStorage.getItem("navigatedFrom");
        const secondTitle = TITLE_MAP[navigatedFrom];
        if (searchWord && searchWord.length > 1 && navigatedFrom === "/Store")
            setSecondTitle(`Want to shop for ${searchWord}? ` + secondTitle);
        else setSecondTitle(secondTitle);
    }, []);

    // Update formData when input changes
    const handleChange = ({ target: { name, value } }) =>
        setFormData({ ...formData, [name]: value });

    // Handle login and token
    const handleLogin = async () => {
        const { username, password } = formData;
        try {
            // Send login request
            const response = await axios.post("Users/login", {
                username,
                password,
            });

            // Encrypt the token and store it in localStorage
            const secretKey = process.env.REACT_APP_SECRET_KEY;
            if (!secretKey || !response.data)
                throw new Error("Invalid data or key");
            localStorage.setItem(
                "token",
                CryptoJS.AES.encrypt(response.data, secretKey).toString()
            );

            // Refresh token
            refreshToken();
        } catch (error) {
            // Handle login failure (show modal)
            const errMsg = error.response?.data || "Something went wrong.";
            setModalBody(errMsg);
            setModalTitle("Login failed!");
            setShowModal(true);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
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
                                />
                            </Form.Group>
                        ))}

                        <Button
                            variant="success"
                            size="lg"
                            type="submit"
                            disabled={
                                formData.username === "" ||
                                formData.password === ""
                            }
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
