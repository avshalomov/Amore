import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import OrdersTable from "../components/OrdersTable";

export default function OrdersPage() {
	const { userId } = useParams();

	return (
		<Container fluid>
			<Row>
				<Col className="wide-card">
					<h1>Orders</h1>
					<p>Orders for user {userId}</p>
					<OrdersTable userId={userId} />
				</Col>
			</Row>
		</Container>
	);
}
