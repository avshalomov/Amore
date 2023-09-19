import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import { useAppContext } from "../context/AppContext";
import StatsOrders from "../context/StatsOrders";
import Loading from "../utils/Loading";
import ModalAlert from "../utils/ModalAlert";
import axios from "../api/axios";

const STATUS_MAP = {
	0: "Processing",
	1: "Shipped",
	2: "Delivered",
	3: "Canceled",
};
const STATUS_VARIANT_MAP = {
	0: "info",
	1: "warning",
	2: "success",
	3: "secondary",
};

// This page is displays in 2 cases:
// /Orders - All orders
// /Users/:userId/Orders - Specific user orders
export default function OrdersPage() {
	const { userId } = useParams();
	const { token, role } = useAppContext();
	const { orders, fetchOrders, users } = useDataContext();
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [acceptButton, setAcceptButton] = useState(null);

	useEffect(() => {
		// Specific user orders
		if (userId && users && orders) {
			setUser(users.find((user) => user.userId == userId));
			setFilteredOrders(orders.filter((order) => order.userId == userId));
			setIsLoading(false);
		}
		// All orders
		if (!userId && orders) {
			setFilteredOrders(orders);
			setIsLoading(false);
		}
	}, [userId, users, orders]);

	// Handling order status change
	const handleStatusChange = async (order) => {
		try {
			if (order.status == 3) {
				setModalTitle("Error");
				setModalBody(`Order ID-${order.orderId} status cannot be changed from ${STATUS_MAP[order.status]}`);
				return;
			} else {
				setModalTitle("Change Order Status");
				setModalBody(
					`Change Order ID-${order.orderId} status from ${STATUS_MAP[order.status]} to ${
						STATUS_MAP[order.status + 1]
					}?`
				);
				setAcceptButton({
					text: `Change to ${STATUS_MAP[order.status + 1]}`,
					variant: `${STATUS_VARIANT_MAP[order.status + 1]}`,
					handleButton: () => changeOrderStatus(order),
				});
			}
		} catch (error) {
			setModalTitle("Error");
			setModalBody(error.message);
		} finally {
			setShowModal(true);
		}
	};

	// Changing order status
	const changeOrderStatus = async (order) => {
		try {
			const response = await axios.put(
				`/Orders/${order.orderId}`,
				{ ...order, status: order.status + 1 },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status == 204) {
				setAcceptButton(null);
				setModalTitle("Success");
				setModalBody(
					`Order ID-${order.orderId} status changed from ${STATUS_MAP[order.status]} to ${
						STATUS_MAP[order.status + 1]
					}`
				);
				fetchOrders();
			}
		} catch (error) {
			setModalTitle("Error");
			setModalBody(error.message);
		} finally {
			setShowModal(true);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row>
				<Col className="wide-card">
					{userId && user ? <h1>{user.username}'s Orders</h1> : <h1>All Orders</h1>}
					<StatsOrders orders={filteredOrders} />
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
									onClick={() =>
										(window.location.href = `/Users/${order.userId}/Orders/${order.orderId}`)
									}
									style={{ cursor: "pointer" }}>
									<td>{order.orderId}</td>
									<td>
										{new Date(order.orderDate).toLocaleDateString()}{" "}
										{new Date(order.orderDate).toLocaleTimeString()}
									</td>
									{role == "Admin" ? (
										<td>
											<Button
												variant={STATUS_VARIANT_MAP[order.status]}
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													handleStatusChange(order);
												}}>
												{STATUS_MAP[order.status]}
											</Button>
										</td>
									) : (
										<td>{STATUS_MAP[order.status]}</td>
									)}
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
			<ModalAlert
				title={modalTitle}
				body={modalBody}
				show={showModal}
				onHide={() => {
					setAcceptButton(null);
					setShowModal(false);
				}}
				addButton={acceptButton}
			/>
		</Container>
	);
}
