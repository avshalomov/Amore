// const order = {
// 	orderId: 0,
// 	userId: 0,
// 	orderDate: "2023-09-17T18:59:15.166Z",
// 	status: 0,
// };
// const orderItem = {
// 	orderItemId: 0,
// 	orderId: 0,
// 	productId: 0,
// 	quantity: 2147483647,
// };
// const product = {
// 	productId: 0,
// 	productName: "string",
// 	description: "string",
// 	price: 0.01,
// 	category: "string",
// 	gender: 0,
// 	stockQuantity: 2147483647,
// 	dateAdded: "2023-09-17T19:56:55.254Z",
// 	picture: "string",
// };

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import { Table } from "react-bootstrap";

export default function OrderPage() {
	const { orderId } = useParams();
	const { orders, orderItems, products } = useDataContext();
	const [filteredOrderItems, setFilteredOrderItems] = useState([]);

	useEffect(() => {
		if (orders && orderId && orderItems && products) {
			const relatedOrder = orders.find((order) => order.orderId === Number(orderId));
			const relatedOrderItems = orderItems.filter((orderItem) => orderItem.orderId === Number(orderId));
			const filteredOrderItems = relatedOrderItems.map((orderItem) => {
				const relatedProduct = products.find((product) => product.productId === orderItem.productId);
				return {
					orderItemId: orderItem.orderItemId,
					picture: relatedProduct ? relatedProduct.picture : null,
					productName: relatedProduct ? relatedProduct.productName : null,
					orderDate: relatedOrder ? relatedOrder.orderDate : null,
					quantity: orderItem.quantity,
					price: relatedProduct ? relatedProduct.price : null,
				};
			});
			setFilteredOrderItems(filteredOrderItems);
		}
	}, [orders, orderId, orderItems, products]);

	console.log(filteredOrderItems);

	return (
		<Container fluid>
			<Row>
				<Col className="wide-card">
					<h1>Order</h1>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Order Item ID</th>
								<th>Product Picture</th>
								<th>Product Name</th>
								<th>Order Date</th>
								<th>Quantity</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{filteredOrderItems.map((orderItem) => (
								<tr key={orderItem.orderItemId}>
									<td>{orderItem.orderItemId}</td>
									<td>
										{orderItem.picture ? (
											<img src={orderItem.picture} alt={orderItem.productName} />
										) : (
											"N/A"
										)}
									</td>
									<td>{orderItem.productName || "N/A"}</td>
									<td>
										{orderItem.orderDate
											? `${new Date(orderItem.orderDate).toLocaleDateString()} ${new Date(
													orderItem.orderDate
											  ).toLocaleTimeString()}`
											: "N/A"}
									</td>
									<td>{orderItem.quantity}</td>
									<td>{orderItem.price !== null ? `$${orderItem.price.toFixed(2)}` : "N/A"}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
		</Container>
	);
}
