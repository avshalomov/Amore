import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import axios from "../api/axios";

const CartTable = () => {
    const { cartItems, fetchCartItems, products, fetchProducts, fetchCart } = useDataContext();
    const { token, userId } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cartItemId, setCartItemId] = useState(0);

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
        <Table hover striped className="text-center">
            <thead>
                <tr>
                    <th>Picture</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                {cartItems.map((item, index) => (
                    <tr key={index}>
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
                            <Button variant="warning" onClick={() => handleShow(item.cartItemId)}>
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
