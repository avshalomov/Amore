import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Container, Row, Image, Button, Table } from "react-bootstrap";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";
import ModalAlert from "../utils/ModalAlert";
import CartTable from "../components/CartTable";

// const product = {
//     productId: 2,
//     description: "Cotton t-shirt with blue and white stripes.",
//     price: 19.99,
//     stockQuantity: 150,
//     dateAdded: "2023-01-06T00:00:00",
//     productName: "Striped T-Shirt",
//     category: "T-Shirts",
//     gender: 2,
//     picture: "data:image/jpg;base64,/9j/4AAQSk...",
// };

// const cartItem = {
//     cartItemId: 21,
//     picture: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...",
//     price: 29.99,
//     productId: 19,
//     productName: "Sunglasses",
//     quantity: 1,
//     totalPrice: 29.99,
// };

// const cart = {
//     cartId: 0,
//     userId: 0,
//     totalPrice: 2147483647,
// };

export default function CartPage() {
    const { userId, token } = useAppContext();
    const { users, cart, fetchCart, cartItems, fetchCartItems } = useDataContext();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const user = users.find((user) => user.userId === userId);

    return (
        <Container fluid>
            <Row className="wide-card justify-content-between">
                <Col>
                    user picture, name, email
                    <Image
                        src={user.picture}
                        roundedCircle
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }}
                    />
                </Col>
                <Col>cart total price, total items count, buy button and modal, clear all button.</Col>
            </Row>
            <Row className="wide-card flakes-bg">
                <CartTable />
            </Row>
        </Container>
    );
}
