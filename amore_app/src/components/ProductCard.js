import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Col, Row, Button, Card } from "react-bootstrap";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import ModalAlert from "../utils/ModalAlert";
import "../assets/styles/ProductCard.css";

// Generates random style for each product card
const randomStyle = () => ({
    backgroundSize: `${Math.floor(Math.random() * (1000 - 500 + 1) + 500)}px`,
    backgroundPosition: ["left", "right", "center", "top", "bottom"][
        Math.floor(Math.random() * 5)
    ],
    marginTop: `${Math.floor(Math.random() * (15 - 3 + 1) + 3)}vw`,
});

const ProductCard = ({ product }) => {
    const [productStyle, setProductStyle] = useState(randomStyle);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const { userId, token } = useAppContext();
    const { cartItems, fetchCartItems, fetchCart, fetchProducts } = useDataContext();
    const navigate = useNavigate();
    const productId = product.productId;

    // Handdle add to cart
    const handleAddToCart = async () => {
        // Check if productId is already in cartItems
        if (cartItems.find((item) => item.productId === productId)) {
            setModalTitle("Wait!");
            setModalBody("You already have this item in your cart, please update the quantity there.");
            setShowModal(true);
            return;
        }
        else if (product.stockQuantity === 0) {
            setModalTitle("Wait!");
            setModalBody("This item is out of stock.");
            setShowModal(true);
            return;
        }
        else
        {try {
            const cartItem = {
                cartId: userId,
                productId: productId,
                quantity: 1,
            };
            await axios.post("/CartItems", cartItem, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Update context
            fetchCartItems();
            fetchCart();
            fetchProducts();
            // Show modal
            setModalTitle("Nice!");
            setModalBody("Item added to cart, you can now proceed to checkout.");
            setShowModal(true);
        } catch (err) {
            setModalTitle("Error!");
            setModalBody("Failed to add item to cart.");
            setShowModal(true);
        }}};

    return (
        <Card className="product-card" style={productStyle}>
            <Card.Img
                variant="top"
                src={product.picture}
                alt={product.productName}
            />
            <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Price: ${product.price}</Card.Text>
                <Row className="card-buttons justify-content-between">
                    <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                        <Button
                            as={Link}
                            to={`/Products/${product.productId}`}
                            variant="info"
                        >
                            Details
                        </Button>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                        <Button variant="warning" onClick={handleAddToCart}>Add</Button>
                    </Col>
                </Row>
            </Card.Body>
            <ModalAlert
                    title={modalTitle}
                    body={modalBody}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    addButton={{
                        variant: "warning",
                        text: "Go to cart",
                        handleButton: () => navigate("/Cart"),
                    }}
            />
        </Card>
    );
};

export default ProductCard;


