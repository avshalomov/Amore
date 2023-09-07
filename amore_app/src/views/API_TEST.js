import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Container, Alert } from "react-bootstrap";

const API_TEST = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);

    const login = async () => {
        try {
            const response = await axios.post(
                "https://localhost:7280/api/Users/login",
                {
                    username,
                    password,
                }
            );
            setToken(response.data.token);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container>
            <h2>Login</h2>
            <Form>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" onClick={login}>
                    Login
                </Button>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>}
            {token && (
                <Alert variant="success">Logged in, token: {token}</Alert>
            )}
        </Container>
    );
};

export default API_TEST;
