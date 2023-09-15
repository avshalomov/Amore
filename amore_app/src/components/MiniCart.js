import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image } from "react-bootstrap";
import "../assets/styles/MiniCart.css";

const CartItemRow = ({ item }) => (
    <Row key={item.cartItemId}>
        <Col lg={4} md={4} sm={4}>
            <Image src={item.picture} alt={item.productName} fluid />
        </Col>
        <Col lg={6} md={6} sm={6}>
            <strong>{item.productName}</strong>
        </Col>
        <Col lg={2} md={2} sm={2}>
            <strong>{item.quantity}</strong>
        </Col>
    </Row>
);

const MiniCart = ({ cartItems }) => (
    <Link to="/Cart" style={{ textDecoration: "none", color: "inherit" }}>
        <Row className="mini-cart justify-content-center align-items-center">
            <h4>
                {cartItems.length > 0
                    ? `You have ${cartItems.length} items in your cart`
                    : "Your cart is empty"}
            </h4>
            {cartItems.slice(-5).map((item) => (
                <CartItemRow key={item.cartItemId} item={item} />
            ))}
            <p>Click to show cart.</p>
        </Row>
    </Link>
);

export default MiniCart;
