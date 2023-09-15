import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import CryptoJS from "crypto-js";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import ModalAlert from "../utils/ModalAlert";
import GenericForm from "../utils/GenericForm";

// Text maps depending where the user navigated from
const TITLE_MAP = {
    "/": "New Here? Login to Start Your Exclusive Fashion Journey.",
    "/Store": "Browsing the Store, Huh? Login to Grab Those Trendy Pieces!",
    "/Profile": "Back to Your Profile? Login to Customize Your Fashion Game.",
    "/Cart": "Eyeing Your Cart? Login to Secure Those Finds!",
    "/Manage": "Checking on the Management? Login to Keep Things in Tip-Top Shape.",
    "/About": "Exploring Our Story? Login to Uncover More.",
    "/Register": "New or Returning? Login or Register to Kickstart Your Fashion Adventure.",
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

    // Handle login and token
    const handleLogin = async (e) => {
        e.preventDefault();
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

    return (
        <Container fluid>
            <Row className="justify-content-center text-center">
                <Col className="wide-card flakes-bg" xs={12} md={8}>
                    <h1>Login</h1>
                    <h4>{secondTitle}</h4>
                    <hr />
                    <br />
                    <GenericForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleLogin}
                        submitName={"Login"}
                    />
                    <h5>Don't have an account?</h5>
                    <Button variant="warning" as={Link} to="/Register">
                        Register
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

export default LoginPage;
