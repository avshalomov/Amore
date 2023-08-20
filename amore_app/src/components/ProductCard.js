import React from "react";
import { Card, Button } from "react-bootstrap";
import "../components/ProductCard.css";

function ProductCard({ product }) {
  return (
    <Card>
      <Card.Img variant="top" src={`data:image/jpeg;base64,${product.picture}`} />
      <Card.Body>
        <Card.Title>{product.productName}</Card.Title>
        <hr />
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>Price: ${product.price}</Card.Text>
        <Card.Text>Category: {product.category}</Card.Text>
        <Button variant="primary" href={`/product/${product.productId}`}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
