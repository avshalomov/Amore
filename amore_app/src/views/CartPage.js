import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row, Image, Button, Form } from "react-bootstrap";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";
import ModalAlert from "../utils/ModalAlert";
import CartTable from "../components/CartTable";

export default function CartPage() {
	const { users, cart, cartItems, fetchCart, fetchCartItems, fetchOrders, fetchOrderItems, fetchProducts } =
		useDataContext();
	const { userId, token } = useAppContext();
	const user = users.find((user) => user.userId === userId);
	const [shippingRate, setShippingRate] = useState(5.99);
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [askQuestion, setAskQuestion] = useState(false);
	const [acceptButton, setAcceptButton] = useState({
		text: null,
		variant: null,
		handleButton: null,
	});

	// Handle shipping rate and shipping cost
	const shippingCost = (cartItems.length * shippingRate).toFixed(2);
	const handleShippingChange = (e) => setShippingRate(parseFloat(e.target.value));

	// Loading the page
	useEffect(() => {
		if (!userId || !token || !user || !cart) setIsLoading(true);
		else setIsLoading(false);
	}, [userId, token, user, cart]);

	// Handle ask question
	const handleAskQuestion = (title, body, buttonName, handleButton, variant) => {
		setModalTitle(title);
		setModalBody(body);
		setAcceptButton({ text: buttonName, handleButton: handleButton, variant: variant });
		setAskQuestion(true);
		setShowModal(true);
	};

	// Handle checkout
	const handleCheckout = async () => {
		setAskQuestion(false);
		setIsLoading(true);
		if (cartItems.length < 0) {
			setModalTitle("Empty cart");
			setModalBody("Please add items to your cart before checking out.");
			setIsLoading(false);
			setShowModal(true);
			return;
		}
		try {
			const response = await axios.post(`/Orders`, null, {
				params: { userId },
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 201) {
				setModalTitle("Success");
				setModalBody("Your order has been placed successfully!");
				fetchCart();
				fetchCartItems();
				fetchOrders();
				fetchOrderItems();
				fetchProducts();
				setIsLoading(false);
				setShowModal(true);
			}
		} catch (error) {
			setModalTitle("Error");
			setModalBody("Something went wrong. Please try again later.");
			setIsLoading(false);
			setShowModal(true);
		}
	};

	// Handle clear cart
	const handleClear = async () => {
		setAskQuestion(false);
		setIsLoading(true);
		try {
			// IMPORTANT! this method doesn't delete the cart, it just deletes the cart items.
			const response = await axios.delete(`/Carts/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.status === 204) {
				setModalTitle("Success");
				setModalBody("Your cart has been cleared successfully!");
			} else {
				setModalTitle("Error");
				setModalBody("Failed to clear cart, please try again later.");
			}
			fetchCart();
			fetchCartItems();
			fetchProducts();
		} catch (error) {
			setModalTitle("Error");
			setModalBody(`Something went wrong: ${error.message}`);
		} finally {
			setIsLoading(false);
			setShowModal(true);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row className="wide-card flakes-bg justify-content-between text-center">
				<h2>Cart</h2>
				{/* Showing user info and cart info */}
				<Col xl={4} lg={4} md={4} sm={4} xs={12}>
					<Image
						src={user.picture}
						roundedCircle
						style={{
							width: "100px",
							height: "100px",
							objectFit: "cover",
							border: "3px inset goldenrod",
							boxShadow: "0 0 20px black",
						}}
					/>
					<p>{user.username}</p>
					<h5>{cartItems.length} items</h5>
					<h6>${cart.totalPrice}</h6>
				</Col>
				{/* Checkout and shipping info */}
				{cartItems.length && cartItems.length > 0 ? (
					// Showing this if there is items
					<Col xl={8} lg={8} md={8} sm={8} xs={12}>
						<p>
							{cart.totalPrice >= 100
								? "Awesome! You've just unlocked FREE Shipping! Why stop now? Add a few more favorites!"
								: `Almost there! Just add $${(100 - cart.totalPrice).toFixed(2)}
                                more to your cart to unlock FREE Shipping. Grab that extra item you've been eyeing!`}
						</p>
						<Form.Select className="w-auto mx-auto" onChange={handleShippingChange}>
							<option value="5.99">Standard: $5.99</option>
							<option value="19.99">Expedited: $19.99</option>
							<option value="29.99">Overnight: $29.99</option>
							<option value="24.99">International: $24.99</option>
						</Form.Select>
						<p>
							Shipping {cartItems.length} items x ${shippingRate}
						</p>
						<h5>
							{cart.totalPrice >= 100 ? (
								<>
									<s>${shippingCost}</s> $0
								</>
							) : (
								`$${shippingCost}`
							)}
						</h5>
						<h6>
							Total + shipping: $
							{(cart.totalPrice >= 100
								? cart.totalPrice
								: cart.totalPrice + Number(shippingCost)
							).toFixed(2)}
						</h6>
						<Button
							variant="warning"
							onClick={() =>
								handleAskQuestion(
									"Checking out",
									"Do you agree to purchase all the items?",
									"Ofcourse!",
									handleCheckout,
									"warning"
								)
							}>
							Checkout
						</Button>
					</Col>
				) : (
					// Showing this if there is no items
					<Col xl={8} lg={8} md={8} sm={8} xs={12}>
						<h3>Your cart is missing out on some serious style.</h3>
						<p>
							Why settle for empty when you can have extraordinary? Unearth the latest fashion
							collections, seasonal favorites, and exclusive deals. Make your wardrobe happy!
						</p>
						<Button as={Link} to="/Store" variant="warning">
							Dive into Fashion Now
						</Button>
					</Col>
				)}
			</Row>
			{/* Showing cart items table only if there is items */}
			{cartItems.length && cartItems.length > 0 && (
				<Row className="wide-card flakes-bg">
					<Button
						className="m-auto"
						variant="danger"
						onClick={() =>
							handleAskQuestion(
								"Clearing cart!",
								"Are you sure you want to clear all the items from your cart?",
								"Yes",
								handleClear,
								"danger"
							)
						}>
						Clear cart
					</Button>
					<CartTable />
				</Row>
			)}
			{/* Modal visible when alerting */}
			<ModalAlert
				show={showModal}
				title={modalTitle}
				body={modalBody}
				onHide={() => setShowModal(false)}
				addButton={askQuestion ? acceptButton : null}
			/>
		</Container>
	);
}
