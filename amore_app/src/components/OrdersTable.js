import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";

const STATUS_MAP = {
	0: "Processing",
	1: "Shipped",
	2: "Delivered",
	3: "Canceled",
};

export default function OrdersTable({ userId }) {
	const { orders } = useDataContext();
	const [filteredOrders, setFilteredOrders] = useState([]);

	useEffect(() => {
		if (orders && userId) setFilteredOrders(orders.filter((order) => order.userId === Number(userId)));
	}, [orders, userId]);

	return (
		<div>
			<h1>OrdersTable</h1>
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
		</div>
	);
}

// const order = {
// 	orderId: 0,
// 	userId: 0,
// 	orderDate: "2023-09-17T18:59:15.166Z",
// 	status: 0,
