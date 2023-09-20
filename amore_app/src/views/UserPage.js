import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";
import axios from "../api/axios";
import ModalAlert from "../utils/ModalAlert";

const ROLE_MAP = {
	0: "User",
	1: "Admin",
};

// const user = {
// 	userId: 0,
// 	username: "string",
// 	email: "user@example.com",
// 	userRole: 0,
// 	lastLoginDate: "2023-09-18T15:40:33.000Z",
// 	dateCreated: "2023-09-18T15:40:33.000Z",
// 	passwordHash: "string",
// 	picture: "string",
// };

export default function UserPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [user, setUser] = useState(null);
	const { users, fetchUsers } = useDataContext();
	const { userId, role, token } = useAppContext();
	const { userId: pathUserId } = useParams();
	const [acceptButton, setAcceptButton] = useState({
		text: null,
		variant: null,
		handleButton: null,
	});

	// Set user
	useEffect(() => {
		if (users.length > 0 && pathUserId && isLoading) {
			setUser(users.find((user) => user.userId == pathUserId));
			setIsLoading(false);
		}
	}, [users, pathUserId]);

	// Helper function to set modal properties and show it
	const setModalAndShow = (title, body, button = null) => {
		setModalTitle(title);
		setModalBody(body);
		setAcceptButton(button);
		setShowModal(true);
	};

	// ============================== ROLE CHANGE ==============================
	// Function to handle change of user roles
	const handleChangeRole = () => {
		// Messages for unauthorized actions
		const notAuthMsg =
			role != "Admin" ? "You are not authorized to change user roles!" : "You cannot change your own role!";
		// Check for admin role and that admins can't change their own roles
		if (role != "Admin" || pathUserId == userId) return setModalAndShow("Not authorized!", notAuthMsg);
		// Determine the target role to switch to
		const targetRole = user.userRole == 0 ? "Admin" : "User";
		// Set modal properties for role change and show it
		setModalAndShow(
			`Change role to ${targetRole}?`,
			`Are you sure you want to change ${user.username}'s role to ${targetRole}?`,
			{
				text: `Change to ${targetRole}`,
				variant: "danger",
				handleButton: changeRole,
			}
		);
	};
	// Function to change the user role through API call
	const changeRole = async () => {
		try {
			// API call to change the user role
			const res = await axios.put(
				`/Users/${user.userId}/ChangeRole`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// Message based on successful or failed role change
			const message = res.status === 200 ? "User role changed successfully!" : "User role change failed!";
			setModalAndShow(res.status === 200 ? "Success!" : "Error!", message);
			setUser(res.data);
			fetchUsers();
		} catch (err) {
			// Error handling
			setModalAndShow("Error!", "User role change failed!");
		} finally {
			// Final steps: Reset button, show modal, and fetch updated users
			setAcceptButton(null);
			setShowModal(true);
		}
	};
	// ========================================================================

	// ============================== DELETE USER ==============================
	// Delete user if role = "Admin" and pathUserId != userId
	const handleDeleteUser = () => {
		// Message for unauthorized actions
		const notAuthMsg = role != "Admin" ? "You are not authorized to delete users!" : "You cannot delete yourself!";
		// Check if user is an admin and not trying to delete themselves
		if (role != "Admin" || pathUserId == userId) return setModalAndShow("Not authorized!", notAuthMsg);
		// Set modal properties for user deletion and show it
		setModalAndShow("Delete User?", `Are you sure you want to delete ${user.username}?`, {
			text: "Delete",
			variant: "danger",
			handleButton: deleteUser,
		});
	};
	// Function to delete the user through API call
	const deleteUser = async () => {
		try {
			// API call to delete the user
			const res = await axios.delete(`/Users/${user.userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// Check if the delete was successful
			if (res.status === 204) {
				// Set button to navigate to /Users only if successful
				const navButton = {
					text: "Go to Users",
					variant: "warning",
					handleButton: () => (window.location.href = "/Users"),
				};
				fetchUsers();
				setModalAndShow("Success!", "User deleted successfully!", navButton);
			} else {
				setModalAndShow("Error!", "User deletion failed!");
			}
		} catch (err) {
			// Error handling
			setModalAndShow("Error!", "User deletion failed!");
		} finally {
			// Final steps: Reset button and fetch updated users
			fetchUsers();
		}
	};
	// ========================================================================

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row className="wide-card flakes-bg justify-content-between">
				<h1>{user.username}</h1>
				{/* Picture */}
				<Col className="text-center" xl={4} lg={8} md={8} sm={12} xs={12}>
					<Image
						className="rounded-pill"
						src={user.picture}
						alt={user.username + "'s profile picture"}
						style={{
							border: "5px double darkgoldenrod",
							boxShadow: "0px 0px 10px black",
							maxHeight: "500px",
							objectFit: "cover",
							width: "300px",
						}}
					/>
				</Col>
				{/* Buttons */}
				<Col xl={3} lg={4} md={4} sm={12} xs={12}>
					<Button as={Link} to={`/Users/${user.userId}/Orders`} variant="info">
						Orders
					</Button>
					<Button onClick={handleChangeRole} variant="warning">
						Change role
					</Button>
					<Button onClick={handleDeleteUser} variant="danger">
						Delete user
					</Button>
				</Col>
				{/* User Info */}
				<Col xl={5} lg={12} md={12} sm={12} xs={12}>
					<ul style={{ listStyleType: "dotted" }}>
						<li>
							<strong>User ID: </strong>
							{user.userId}
						</li>
						<li>
							<strong>Role: </strong>
							{ROLE_MAP[user.userRole]}
						</li>
						<li>
							<strong>Username: </strong>
							{user.username}
						</li>
						<li>
							<strong>Email: </strong>
							{user.email}
						</li>
						<li>
							<strong>Last Login: </strong>
							{new Date(user.lastLoginDate).toLocaleString()}
						</li>
						<li>
							<strong>Date Created: </strong>
							{new Date(user.dateCreated).toLocaleString()}
						</li>
					</ul>
				</Col>
			</Row>
			<ModalAlert
				show={showModal}
				title={modalTitle}
				body={modalBody}
				onHide={() => setShowModal(false)}
				addButton={acceptButton}
			/>
		</Container>
	);
}
