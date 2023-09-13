import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Image, Row, Col, Button } from "react-bootstrap";
import axios from "../api/axios";
import GenericForm from "../utils/GenericForm";
import ModalAlert from "../utils/ModalAlert";

function RegisterPage() {
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        picture: "",
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const { username, email, password, picture } = formData;
        try {
            await axios.post("/Users/register", {
                username,
                email,
                password,
                picture,
            });
            navigate("/Login");
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
        <Container fluid>
            <Row className="justify-content-center text-center">
                <Col className="wide-card register-page" xs={12} md={8}>
                    <h1>Register</h1>
                    <h4>
                        Unlock Your Personal Style Vault! Register to Step Up
                        Your Fashion Game!
                    </h4>
                    <hr />
                    <br />
                    {formData.picture && (
                        <Image
                            style={{
                                width: "200px",
                                border: "5px double goldenrod",
                                borderRadius: "50%",
                            }}
                            src={formData.picture}
                            alt="Uploaded Preview"
                            // rounded
                            fluid
                        />
                    )}
                    <GenericForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleRegister}
                        submitName={"Register"}
                    />
                    <h5>Already have an account?</h5>
                    <Button variant="warning" as={Link} to="/Login">
                        Login
                    </Button>
                    <ModalAlert
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        title={modalTitle}
                        body={modalBody}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;
