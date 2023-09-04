import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const EditResourceForm = ({
    resource,
    resourceType,
    handleDelete,
    handleSubmit,
}) => {
    const [updatedResource, setUpdatedResource] = useState(resource);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedResource({ ...updatedResource, [name]: value });
    };

    const onSubmit = (e) => {
        if (
            window.confirm(
                `Are you sure you want to save this ${resourceType}?`
            )
        ) {
            e.preventDefault();
            handleSubmit(updatedResource);
            window.history.back();
            console.log("Saved " + resourceType);
        } else {
            console.log("Cancelled saving of " + resourceType);
        }
    };

    const onDelete = (e) => {
        if (
            window.confirm(
                `Are you sure you want to delete this ${resourceType}?`
            )
        ) {
            handleDelete(updatedResource);
            window.history.back();
            console.log("Deleted " + resourceType);
        } else {
            console.log("Cancelled deletion of " + resourceType);
        }
    };

    return (
        <Container>
            <Card className="edit-resource-form-card">
                <Row className="align-items-center">
                    <Col xs={12} sm={4} md={3} lg={2}>
                        {updatedResource.picture && (
                            <Card.Img
                                variant="top"
                                src={`data:image/jpeg;base64,${updatedResource.picture}`}
                                className="img-fluid"
                            />
                        )}
                    </Col>
                    <Col xs={12} sm={8} md={9} lg={10}>
                        <h1>Editing {resourceType}</h1>
                        <hr />
                        <Form onSubmit={onSubmit}>
                            <Row>
                                {Object.keys(updatedResource).map((key) => {
                                    if (key.includes("Id")) return null; // Skipping IDs for editing

                                    return (
                                        <Col
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            lg={3}
                                            key={key}
                                        >
                                            <Form.Group>
                                                <Form.Label>{`${key
                                                    .charAt(0)
                                                    .toUpperCase()}${key
                                                    .slice(1)
                                                    .replace(
                                                        /([A-Z])/g,
                                                        " $1"
                                                    )}`}</Form.Label>

                                                <Form.Control
                                                    type="text"
                                                    name={key}
                                                    value={
                                                        updatedResource[key] ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    );
                                })}
                            </Row>
                            <hr />
                            <Button variant="success" type="submit">
                                Save
                            </Button>
                            <Button variant="danger" onClick={onDelete}>
                                Delete
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default EditResourceForm;
