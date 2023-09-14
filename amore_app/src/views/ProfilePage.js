import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";







export default function ProfilePage() {
    // const { role, userId } = useAppContext();
    // const { users } = useDataContext();
    // const user = users.find((user) => user.userId === userId);





    return (
        <Container fluid>
            <Row className="justify-content-between">
                <Col className="tall-card" lg={5} md={12} sm={12}>
                <h1>Profile</h1>
                {/* user picture and name */}
                </Col>

                <Col className="tall-card" lg={6} md={12} sm={12}>
                <h1>User info</h1>
                {/* users all information */}
                </Col>
            </Row>
        </Container>
    );
}
