import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";
import ModalAlert from "../utils/ModalAlert";
import StatsOrders from "../components/StatsOrders";

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
	const [sortedFilteredOrders, setSortedFilteredOrders] = useState([]);
	const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [acceptButton, setAcceptButton] = useState(null);
	const [sortConfig, setSortConfig] = useState(null);

	// Fetching orders and users on page load and setting filtered orders
	useEffect(() => {
		if (userId && users && orders) {
			const userOrders = orders.filter((order) => order.userId == userId);
			setUser(users.find((user) => user.userId == userId));
			setFilteredOrders(userOrders);
			setSortedFilteredOrders(userOrders);
			setIsLoading(false);
		}
		if (!userId && orders) {
			setFilteredOrders(orders);
			setSortedFilteredOrders(orders);
			setIsLoading(false);
		}
	}, [userId, users, orders]);

	// Sorting orders
	useEffect(() => {
		let sortedOrders = [...filteredOrders];
		if (sortConfig !== null) {
			sortedOrders.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		setSortedFilteredOrders(sortedOrders);
	}, [filteredOrders, sortConfig]);

	const handleSort = (key) => {
		let direction = "ascending";
		if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

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
			<Row className="justify-content-between">
				<Col className="tall-card flakes-bg" style={{ height: "60vh" }} xl={4} xs={12}>
					{userId && user ? <h1>{user.username}'s Orders</h1> : <h1>Manage Orders</h1>}
					<StatsOrders orders={filteredOrders} />
				</Col>
				<Col className="tall-card flakes-bg" xl={7} xs={12}>
					<Table responsive hover striped className="text-center">
						<thead>
							<tr style={{ cursor: "pointer" }}>
								<th onClick={() => handleSort("orderId")}>↕ Order ID</th>
								<th onClick={() => handleSort("orderDate")}>↕ Order Date</th>
								<th onClick={() => handleSort("status")}>↕ Status</th>
							</tr>
						</thead>
						<tbody>
							{sortedFilteredOrders.map((order) => (
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
									{role === "Admin" ? (
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
