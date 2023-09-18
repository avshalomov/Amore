import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";

export default function OrderPage() {
	const { orderId } = useParams();
	const { userId, role } = useAppContext();
	const { orders, orderItems, products } = useDataContext();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({
		filteredOrderItems: null,
		totalPrice: null,
		orderDate: null,
	});
	const navigate = useNavigate();

	// Filtering and setting the related order items
	useEffect(() => {
		if (!orderId || !orders || !orderItems || !products) return;

		// Can access only if Admin or userId matches
		const relatedOrder = orders.find((o) => o.orderId === Number(orderId));
		if (!relatedOrder) return;
		if (role !== "Admin" && relatedOrder.userId !== Number(userId)) navigate(`/Users/${userId}/Orders`);

		// Create a new array of order items with the related product info
		const filteredOrderItems = orderItems
			.filter((oi) => oi.orderId === Number(orderId))
			.map((oi) => {
				const relatedProduct = products.find((p) => p.productId === oi.productId) || {};
				return {
					orderItemId: oi.orderItemId,
					productId: oi.productId,
					quantity: oi.quantity,
					price: relatedProduct.price || null,
					totalPrice: relatedProduct.price ? relatedProduct.price * oi.quantity : null,
					productName: relatedProduct.productName || null,
					picture: relatedProduct.picture || null,
				};
			});

		// Set the data and stop loading
		const totalPrice = filteredOrderItems.reduce((acc, { totalPrice }) => acc + totalPrice, 0);
		const formattedOrderDate = new Date(relatedOrder.orderDate).toLocaleString();
		setData({ filteredOrderItems, totalPrice, orderDate: formattedOrderDate });
		setIsLoading(false);
	}, [orders, orderId, orderItems, products]);

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row>
				<Col className="wide-card text-center">
					<h1>Order {orderId}</h1>
					<h2>Order Date: {data.orderDate}</h2>
					<h3>Total Price: ${data.totalPrice.toFixed(2)}</h3>
					<Table striped bordered hover responsive>
						<thead>
							<tr>
								<th>Order Item ID</th>
								<th>Product ID</th>
								<th>Quantity</th>
								<th>Price</th>
								<th>Total Price</th>
								<th>Product Name</th>
								<th>Product Picture</th>
							</tr>
						</thead>
						<tbody>
							{data.filteredOrderItems.map((orderItem) => (
								<tr
									key={orderItem.orderItemId}
									onClick={() => (window.location.href = `/Products/${orderItem.productId}`)}
									style={{ cursor: "pointer" }}>
									<td>{orderItem.orderItemId}</td>
									<td>{orderItem.productId}</td>
									<td>{orderItem.quantity}</td>
									{orderItem.price !== null ? (
										<>
											<td>${orderItem.price.toFixed(2)}</td>
											<td>${orderItem.totalPrice.toFixed(2)}</td>
											<td>{orderItem.productName}</td>
											<td>
												<img
													src={orderItem.picture}
													alt={orderItem.productName}
													style={{
														width: "50px",
														height: "50px",
														objectFit: "cover",
														borderRadius: "10px",
													}}
												/>
											</td>
										</>
									) : (
										<td colSpan="4">N/A</td>
									)}
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
		</Container>
	);
}
