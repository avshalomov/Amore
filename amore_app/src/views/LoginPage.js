import React, { useEffect, useState } from "react";
import { Button, Form, Container, FormControl, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const REGEX_MAP = {
    username: /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,50})/,
};

const ERROR_MAP = {
    username: "Fill in a correct username.",
    password: "Fill in a correct password.",
};

function LoginPage() {
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [valid, setValid] = useState({});
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        const newValid = {};
        const newError = {};

        for (const [key, regex] of Object.entries(REGEX_MAP)) {
            newValid[key] = regex.test(formData[key]);
            newError[key] = newValid[key] ? "" : ERROR_MAP[key];
        }

        setValid(newValid);
        setError(newError);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = formData;

        axios
            .post("Users/login", { username, password })
            .then((response) => {
                setModalTitle("Login successful!");
                setModalBody("You will be redirected to your profile.");
                console.log(response);
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setModalBody(error.response.data);
                } else {
                    setModalBody("Something went wrong.");
                }
                setModalTitle("Login failed!");
                console.log(error);
            });
        setShowModal(true);
    };

    return (
        <Container>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                {["username", "password"].map((key) => (
                    <Form.Group controlId={key} key={key}>
                        <Form.Label>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Form.Label>
                        <Form.Control
                            type={key === "password" ? "password" : "text"}
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            isInvalid={!!error[key]}
                        />
                        <FormControl.Feedback type="invalid">
                            {error[key]}
                        </FormControl.Feedback>
                    </Form.Group>
                ))}

                <Button
                    variant="success"
                    type="submit"
                    disabled={!Object.values(valid).every(Boolean)}
                >
                    Login
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => window.history.back()}
                >
                    Back
                </Button>
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalBody}</p>
                </Modal.Body>
                <Modal.Footer>
                    {modalTitle === "Login successful!" ? (
                        <Link to="/">
                            <Button variant="warning">Profile</Button>
                        </Link>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            OK
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default LoginPage;
