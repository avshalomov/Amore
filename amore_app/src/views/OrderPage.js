import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import ModalAlert from "../utils/ModalAlert";
import Loading from "../utils/Loading";

export default function OrderPage() {
	const { orderId } = useParams();
	const { userId, role, token } = useAppContext();
	const { orders, fetchOrders, orderItems, products } = useDataContext();
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [acceptButton, setAcceptButton] = useState(null);
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

	// Handle delete order
	const handleDeleteOrder = () => {
		setModalTitle("Delete Order");
		setModalBody("Are you sure you want to delete this order?");
		setAcceptButton({
			text: "Delete",
			variant: "danger",
			handleButton: deleteOrder,
		});
		setShowModal(true);
	};

	// Delete order
	const deleteOrder = async () => {
		try {
			await axios.delete(`/Orders/${orderId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setIsLoading(true);
			fetchOrders();
			navigate(-1);
		} catch (err) {
			setModalTitle("Error");
			setModalBody(err.response.data.message);
			setAcceptButton(null);
			setShowModal(true);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row>
				<Col className="wide-card flakes-bg text-center">
					<h1>Order {orderId}</h1>
					<h2>Total Price: ${data.totalPrice.toFixed(2)}</h2>
					<h3>Order Date: {data.orderDate}</h3>
					{role === "Admin" && (
						<Button variant="danger" onClick={handleDeleteOrder}>
							Delete Order
						</Button>
					)}
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
			<ModalAlert
				show={showModal}
				onHide={() => setShowModal(false)}
				title={modalTitle}
				body={modalBody}
				addButton={acceptButton}
			/>
		</Container>
	);
}
