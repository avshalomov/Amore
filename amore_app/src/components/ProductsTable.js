import React from "react";
import { Row, Col, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductsTable.css";

function ProductsTable({ products }) {
  return (
    <Container>
      {products.map((product) => (
        <Link
          to={`/manage-products/${product.productId}`}
          key={product.productId}
        >
          <Row className="product-row clickable">
            <Col xl={3} lg={3} md={2} sm={2} xs={2}>
              <Image
                className="product-image"
                src={`data:image/jpeg;base64,${product.picture}`}
                alt={product.productName}
                fluid
              />
            </Col>
            <Col xl={9} lg={9} md={10} sm={10} xs={10}>
              <Row>
                <Col xl={6} lg={12} md={12} sm={12} xs={12}>
                  <strong>Name:</strong> {product.productName}
                </Col>
                <Col xl={6} lg={12} md={12} sm={12} xs={12}>
                  <strong>Description:</strong> {product.description}
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                  <strong>Category:</strong> {product.category}
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                  <strong>Gender:</strong> {product.gender}
                </Col>
              </Row>

              <Row>
                <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                  <strong>Date Added:</strong>{" "}
                  {new Date(product.dateAdded).toLocaleDateString()}
                </Col>
                <Col xl={3} lg={3} md={6} sm={6} xs={6}>
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </Col>
                <Col xl={3} lg={3} md={6} sm={6} xs={6}>
                  <strong>Stock:</strong> {product.stockQuantity}
                </Col>
              </Row>
            </Col>
          </Row>
        </Link>
      ))}
    </Container>
  );
}

export default ProductsTable;
