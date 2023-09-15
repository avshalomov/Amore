import React from "react";
import { Spinner, Container, Image } from "react-bootstrap";
import loading from "../assets/images/404page/loading.webp";

const backgroundStyle = {
    backgroundImage: `url(${loading}), linear-gradient(to right, transparent, white, white, transparent)`,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    height: "60vh",
};

export default function Loading() {
    return (
        <Container
            fluid
            className="justify-content-between align-items-center d-flex flex-column"
            style={backgroundStyle}
        >
            <Spinner
                animation="grow"
                role="status"
                className="text-warning"
                style={{ width: "100%", height: "3%" }}
            />
            <h1>Loading</h1>
            <Spinner
                animation="grow"
                role="status"
                className="text-warning"
                style={{ width: "100%", height: "3%" }}
            />
        </Container>
    );
}
