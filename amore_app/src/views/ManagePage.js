import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import { useState, useEffect } from "react";
import StatsGeneral from "../context/StatsGeneral";

export default function ManagePage() {
	return (
		<Container fluid>
			<Row className="wide-card text-center">
				<Col>
					<h1>Statistics</h1>
					<StatsGeneral />
				</Col>
				<Col>
					<h1>Manage Website</h1>
					<Button as={Link} to="/Users" variant="info" size="lg">
						Users
					</Button>
					<Button as={Link} to="/Products" variant="info" size="lg">
						Products
					</Button>
					<Button as={Link} to="/Orders" variant="info" size="lg">
						Orders
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
