import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";

const STATUS_MAP = {
	0: "Processing",
	1: "Shipped",
	2: "Delivered",
	3: "Canceled",
};

export default function OrdersPage() {
	const { userId } = useParams();
	const { orders } = useDataContext();
	const [filteredOrders, setFilteredOrders] = useState([]);

	useEffect(() => {
		if (orders && userId) setFilteredOrders(orders.filter((order) => order.userId === Number(userId)));
	}, [orders, userId]);

	return (
		<Container fluid>
			<Row>
				<Col className="wide-card">
					<h1>Orders for user {userId}</h1>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Order ID</th>
								<th>Order Date</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{filteredOrders.map((order) => (
								<tr
									key={order.orderId}
									onClick={() => (window.location.href = `/Users/${userId}/Orders/${order.orderId}`)}
									style={{ cursor: "pointer" }}>
									<td>{order.orderId}</td>
									<td>
										{new Date(order.orderDate).toLocaleDateString()}{" "}
										{new Date(order.orderDate).toLocaleTimeString()}
									</td>
									<td>{STATUS_MAP[order.status]}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
		</Container>
	);
}
