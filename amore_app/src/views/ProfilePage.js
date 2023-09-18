import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

// Context
import { useDataContext } from "../context/DataContext";
import { useAppContext } from "../context/AppContext";

// Utilities
import GenericForm from "../utils/GenericForm";
import ModalAlert from "../utils/ModalAlert";
import Loading from "../utils/Loading";

// Components
import WelcomeMessage from "../components/WelcomeMessage";
import MemberMessage from "../components/MemberMessage";
import MiniCart from "../components/MiniCart";

export default function ProfilePage() {
	const { role, userId, refreshToken, token } = useAppContext();
	const { users, setUsers, cart, cartItems } = useDataContext();
	const [user, setUser] = useState(null);
	const [userToEdit, setUserToEdit] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState(null);
	const [modalBody, setModalBody] = useState(null);
	const [editing, setEditing] = useState(false);
	const navigate = useNavigate();

	// if navigated from login and searchWord is present then navigate to /Store.
	useEffect(() => {
		const navigatedFrom = localStorage.getItem("navigatedFrom");
		const searchWord = localStorage.getItem("searchWord");
		if (navigatedFrom === "/Login" && searchWord) {
			navigate("/Store");
		}
	}, []);

	// Set user if users and userId are available
	useEffect(() => {
		if (users) {
			const foundUser = users.find((user) => user.userId === userId);
			if (foundUser) {
				setUser(foundUser);
				setUserToEdit({
					username: foundUser.username,
					email: foundUser.email,
					picture: foundUser.picture,
					password: "",
				});
			}
		}
	}, [users, userId]);

	// Log out
	const handleLogout = () => {
		localStorage.removeItem("token");
		refreshToken();
	};

	// Edit user
	const handleEditUser = async (e) => {
		e.preventDefault();
		const updatedUser = {
			...user,
			...userToEdit,
			passwordHash: userToEdit.password,
		};
		if (updatedUser.password) delete updatedUser.password;
		try {
			const response = await axios.put(`/Users/${user.userId}`, updatedUser, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// Update users state
			const updatedUsers = users.map((user) => {
				if (user.userId === response.data.userId) {
					return response.data;
				} else {
					return user;
				}
			});
			// Update user state
			setUsers(updatedUsers);
			setUser(response.data);
			setEditing(false);
		} catch (error) {
			console.log(error);
		}
	};

	return user && cart ? (
		<Container fluid>
			<Row className="justify-content-between">
				<hr />
				<h1>Profile</h1>
				<Col className="tall-card flakes-bg d-flex flex-column" lg={5} md={12} sm={12}>
					<WelcomeMessage user={user.username} />
					<Image
						className="rounded-pill my-5 mx-auto"
						src={user.picture}
						alt={user.username + "'s profile picture"}
						style={{
							border: "5px double darkgoldenrod",
							boxShadow: "0px 0px 10px black",
							maxHeight: "500px",
							width: "300px",
						}}
					/>
					<MemberMessage createdDate={user.dateCreated} />
					<Button
						as={Link}
						to={`/Users/${userId}/Orders`}
						variant="info"
						style={{ width: "150px", margin: "auto" }}>
						View Orders
					</Button>
					<hr />
					<Button
						variant="danger"
						onClick={() => {
							setModalTitle("Logging out!");
							setModalBody("Are you sure you want to log out?");
							setShowModal(true);
						}}>
						Log out
					</Button>
					<ModalAlert
						show={showModal}
						title={modalTitle}
						body={modalBody}
						onHide={() => setShowModal(false)}
						addButton={{
							variant: "danger",
							handleButton: handleLogout,
							text: "Log out",
						}}
					/>
				</Col>
				<Col lg={6} md={12} sm={12} className="tall-card flakes-bg text-center">
					{editing ? (
						<Row>
							<h3>Editing Profile</h3>
							<Image
								className="rounded-pill my-5 p-0 mx-auto"
								src={userToEdit.picture}
								alt={userToEdit.username + "'s profile picture"}
								style={{
									border: "5px double darkgoldenrod",
									boxShadow: "0px 0px 10px black",
									maxHeight: "500px",
									width: "200px",
								}}
							/>
							<GenericForm
								formData={userToEdit}
								setFormData={setUserToEdit}
								handleSubmit={handleEditUser}
								submitName={"Save"}
								cancel={() => {
									setEditing(false);
								}}
							/>
						</Row>
					) : (
						<Row>
							<h3>Your Info</h3>
							<p>
								<strong>Username: </strong>
								{user.username}
							</p>
							<p>
								<strong>Email: </strong>
								{user.email}
							</p>
							<p>
								<strong>Role: </strong>
								{role}
							</p>
							<Button
								variant="warning"
								onClick={() => {
									setEditing(true);
								}}>
								Edit Your Profile
							</Button>
						</Row>
					)}
					<hr />
					<h4>Cart</h4>
					<MiniCart cartItems={cartItems} />
				</Col>
			</Row>
		</Container>
	) : (
		<Loading />
	);
}
