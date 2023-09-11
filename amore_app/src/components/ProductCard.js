import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "../components/ProductCard.css";

// Generates random style for each product card
const randomBackground = () => ({
    backgroundSize: `${Math.floor(Math.random() * (2000 - 1000 + 1) + 1000)}px`,
    backgroundPosition: ["left", "right", "center", "top", "bottom"][
        Math.floor(Math.random() * 5)
    ],
    marginTop: `${Math.floor(Math.random() * (15 - 3 + 1) + 3)}vw`,
});

const ProductCard = ({ product }) => {
    const productStyle = randomBackground();

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
                <Button variant="warning">Add to Cart</Button>
                <Button as={Link} to={`/Products/${product.productId}`} variant="info">
                    View Product
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
