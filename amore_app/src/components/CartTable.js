import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";

const CartTable = () => {
	const { cartItems, fetchCartItems, products, fetchProducts, fetchCart } = useDataContext();
	const { token, userId } = useAppContext();
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [cartItemId, setCartItemId] = useState(0);
	const [cartSortConfig, setCartSortConfig] = useState(null);
	const [sortedCartItems, setSortedCartItems] = useState([]);

	// Sorting cart items
	useEffect(() => {
		let sortedItems = [...cartItems];
		if (cartSortConfig !== null) {
			sortedItems.sort((a, b) => {
				if (a[cartSortConfig.key] < b[cartSortConfig.key]) {
					return cartSortConfig.direction === "ascending" ? -1 : 1;
				}
				if (a[cartSortConfig.key] > b[cartSortConfig.key]) {
					return cartSortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		setSortedCartItems(sortedItems);
	}, [cartItems, cartSortConfig]);

	// Handling sort direction
	const handleCartSort = (key) => {
		let direction = "ascending";
		if (cartSortConfig && cartSortConfig.key === key && cartSortConfig.direction === "ascending") {
			direction = "descending";
		}
		setCartSortConfig({ key, direction });
	};

	// Closing and opening the modal
	const handleClose = () => setShowModal(false);
	const handleShow = (cartItemId) => {
		const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
		setCartItemId(cartItemId);
		setQuantity(cartItem.quantity);
		setModalTitle(`Quantity of ${cartItem.productName}`);
		setModalBody(`Currently you have ${cartItem.quantity} ${cartItem.productName} in your cart.`);
		setShowModal(true);
	};

	// Handle API calls (PUT or DELETE)
	const handleAPI = async (method, data = null) => {
		try {
			const endpoint = `/CartItems/${cartItemId}`;
			const config = { headers: { Authorization: `Bearer ${token}` } };
			const response =
				method === "delete" ? await axios.delete(endpoint, config) : await axios.put(endpoint, data, config);
			fetchCartItems();
			fetchCart();
			fetchProducts();
			handleClose();
		} catch (error) {
			setModalTitle("Error");
			setModalBody(error.message);
		}
	};

	// Handle saving the quantity
	const handleSave = async () => {
		const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
		const product = products.find((item) => item.productId === cartItem.productId);
		if (quantity - cartItem.quantity > product.stockQuantity) {
			setModalTitle("Wow! Slow down there!");
			setModalBody(`The quantity you entered is greater than the stock quantity of ${product.stockQuantity}`);
		} else if (quantity <= 0) {
			handleAPI("delete");
		} else {
			const data = {
				cartItemId,
				cartId: userId,
				productId: product.productId,
				quantity,
			};
			handleAPI("put", data);
		}
	};

	return (
		<Table responsive hover striped className="text-center">
			<thead>
				<tr style={{ cursor: "pointer" }}>
					<th onClick={() => handleCartSort("picture")}>↕ Picture</th>
					<th onClick={() => handleCartSort("productName")}>↕ Product Name</th>
					<th onClick={() => handleCartSort("price")}>↕ Price</th>
					<th onClick={() => handleCartSort("quantity")}>↕ Quantity</th>
					<th onClick={() => handleCartSort("totalPrice")}>↕ Total Price</th>
				</tr>
			</thead>
			<tbody>
				{sortedCartItems.map((item, index) => (
					<tr
						key={index}
						onClick={() => (window.location.href = `/Products/${item.productId}`)}
						style={{ cursor: "pointer" }}>
						<td>
							<img
								src={item.picture}
								alt="product"
								style={{
									width: "50px",
									height: "50px",
									objectFit: "cover",
									borderRadius: "10px",
								}}
							/>
						</td>
						<td>{item.productName}</td>
						<td>{item.price}</td>
						<td>
							<Button
								variant="warning"
								onClick={(e) => {
									e.stopPropagation();
									handleShow(item.cartItemId);
								}}>
								{item.quantity}
							</Button>
						</td>
						<td>{item.totalPrice}</td>
					</tr>
				))}
			</tbody>
			<Modal show={showModal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>{modalTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>{modalBody}</p>
					<input
						className="text-center"
						type="number"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						style={{ borderRadius: "10px", backgroundColor: "lightgrey" }}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="warning" onClick={handleSave}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</Table>
	);
};

export default CartTable;
