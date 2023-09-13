import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import {
    Button,
    Form,
    Container,
    FormControl,
    Image,
    Modal,
} from "react-bootstrap";

// Regular expressions for form validation
const REGEX_MAP = {
    username: /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/,
    email: /^[a-zA-Z0-9._-]{1,25}@[a-zA-Z0-9.-]{1,15}\.[a-zA-Z]{2,8}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,50})/,
};

// Error messages for form validation
const ERROR_MAP = {
    username:
        "Username must be 4-20 characters long, start with a letter and contain only letters, numbers, hyphens and underscores.",
    email: "Please enter a valid email address.",
    password:
        "Password must be 8-50 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character.",
    matchPassword: "Passwords do not match.",
    picture: "Please upload a valid image file.",
};

function RegisterPage() {
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [valid, setValid] = useState({});
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        matchPassword: "",
        picture: null,
    });

    // Checks if the form data is valid
    useEffect(() => {
        const newValid = {};
        const newError = {};

        // update valid and error for each key in formData
        for (const [key, regex] of Object.entries(REGEX_MAP)) {
            newValid[key] = regex.test(formData[key]);
            newError[key] = newValid[key] ? "" : ERROR_MAP[key];
        }
        // update valid and error for matchPassword
        newValid.matchPassword = formData.password === formData.matchPassword;
        newError.matchPassword = newValid.matchPassword
            ? ""
            : ERROR_MAP.matchPassword;
        // update valid and error for picture
        newValid.picture = formData.picture !== null;
        newError.picture = newValid.picture ? "" : ERROR_MAP.picture;
        // Set the new valid and error
        setValid(newValid);
        setError(newError);
    }, [formData]);

    // Validates the image file
    const isValidFile = (file) => {
        if (!file.type.startsWith("image/")) {
            setModalTitle("Wrong file!");
            setModalBody("Please upload a valid image file.");
            setShowModal(true);
            return false;
        }

        if (file.size > 1024 * 1024) {
            setModalTitle("Heavy file!");
            setModalBody("Please upload an image file smaller than 1MB.");
            setShowModal(true);
            return false;
        }

        return true;
    };

    // Reads the file and returns a data URL
    const readFileAsDataURL = (file, callback) => {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

    // Handles changes to the form
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && name === "picture") {
            const file = files[0];
            if (file && isValidFile(file)) {
                readFileAsDataURL(file, (result) => {
                    setFormData({ ...formData, picture: result });
                });
            } else e.target.value = null;
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, picture } = formData;
        try {
            const response = await axios.post("/Users/register", {
                username,
                email,
                password,
                picture,
            });
            setModalTitle("Registration successful!");
            setModalBody(
                "Welcome to Amore! we are glad to acommpany you on your journey to find your style! Please login to continue."
            );
            setFormData({
                username: "",
                email: "",
                password: "",
                matchPassword: "",
                picture: null,
            });
            setShowModal(true);
        } catch (error) {
            if (error.response && error.response.data) {
                const serverMessage = error.response.data.split(":")[1]?.trim();
                setModalBody(serverMessage || "An unexpected error occurred");
            } else {
                setModalBody("An unexpected error occurred");
            }
            setModalTitle("Registration failed!");
            setShowModal(true);
        }
    };

    return (
        <Container>
            {formData.picture && (
                <Image
                    src={formData.picture}
                    alt="Uploaded Preview"
                    rounded
                    fluid
                />
            )}
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <Form.Group controlId={key} key={key}>
                        <Form.Label>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Form.Label>
                        {key === "picture" ? (
                            <Form.Control
                                type="file"
                                name={key}
                                onChange={handleChange}
                            />
                        ) : (
                            <Form.Control
                                type={
                                    key === "password" ||
                                    key === "matchPassword"
                                        ? "password"
                                        : "text"
                                }
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                isInvalid={!!error[key]}
                                maxLength={50}
                            />
                        )}
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
                    Register
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
                    {modalTitle === "Registration successful!" ? (
                        <Link to="/login">
                            <Button variant="warning">Login</Button>
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

export default RegisterPage;
