import React from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import "./DetailsCard.css";

const DetailsCard = ({ resource }) => {
    if (!resource) {
        return (
            <Spinner
                animation="grow"
                role="status"
                className="loading-spinner"
            ></Spinner>
        );
    }

    const displayKeys = Object.keys(resource).filter(
        (key) => key !== "picture"
    );

    return (
        <Card className="details-card">
            <Row className="align-items-center">
                <Col xs={12} sm={4} md={3} lg={2}>
                    {resource.picture && (
                        <Card.Img
                            variant="top"
                            src={`data:image/jpeg;base64,${resource.picture}`}
                            className="img-fluid"
                        />
                    )}
                </Col>
                <Col xs={12} sm={8} md={9} lg={10}>
                    <Row>
                        {displayKeys.map((key) => (
                            <Col xs={12} md={6} lg={4} key={key}>
                                <Card.Text className="text-wrap text-break">
                                    <strong>{key}:</strong> {resource[key]}
                                </Card.Text>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};

export default DetailsCard;
