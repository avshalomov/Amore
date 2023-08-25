import React from "react";
import { Row, Col, Button, Image } from "react-bootstrap";

function ProductDetails({ product, handleEdit, handleDelete }) {
  return (
    <>
      <Row>
        <Col>
          <Image
            src={`data:image/jpeg;base64,${product.picture}`}
            alt={product.productName}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <strong>Name:</strong> {product.productName}
        </Col>
        <Col>
          <strong>Description:</strong> {product.description}
        </Col>
        <Col>
          <strong>Price:</strong> ${product.price.toFixed(2)}
        </Col>
        <Col>
          <strong>Category:</strong> {product.category}
        </Col>
      </Row>
      <Row>
        <Col>
          <strong>Gender:</strong> {product.gender}
        </Col>
        <Col>
          <strong>Stock Quantity:</strong> {product.stockQuantity}
        </Col>
        <Col>
          <strong>Date Added:</strong>{" "}
          {new Date(product.dateAdded).toLocaleDateString()}
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={handleEdit}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ProductDetails;
