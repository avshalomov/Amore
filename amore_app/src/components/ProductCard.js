import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import "../assets/styles/ProductCard.css";
import { useState } from "react";

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
                        <Button variant="warning">Add</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
