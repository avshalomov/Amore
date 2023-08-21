import React from "react";
import { Card, Button } from "react-bootstrap";
import "../components/ProductCard.css";

function getRandomBackgroundSize() {
  return Math.floor(Math.random() * (2000 - 1000 + 1) + 1000) + "px";
}

function getRandomBackgroundPosition() {
  const positions = ["left", "right", "center", "top", "bottom"];
  return positions[Math.floor(Math.random() * positions.length)];
}

function ProductCard({ product }) {
  const productStyle = {
    backgroundSize: getRandomBackgroundSize(),
    backgroundPosition: getRandomBackgroundPosition(),
  };

  return (
    <Card className="product-card" style={productStyle}>
      <Card.Img variant="top" src={`data:image/jpeg;base64,${product.picture}`} />
      <Card.Body>
        <Card.Title>{product.productName}</Card.Title>
        <hr />
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>Price: ${product.price}</Card.Text>
        <Card.Text>Category: {product.category}</Card.Text>
        <Button variant="warning" href={`/product/${product.productId}`}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
