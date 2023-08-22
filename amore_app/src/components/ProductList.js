import React from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

function getRandomMargin() {
  return Math.floor(Math.random() * (10 - 2 + 1) + 2) + "vw";
}

function ProductList({ currentProducts }) {
  return (
    <Row>
      {currentProducts.map((product) => {
        const productStyle = {
          marginTop: getRandomMargin(),
        };

        return (
          <Col
            sm={12}
            md={6}
            lg={4}
            key={product.productId}
            style={productStyle}
          >
            <ProductCard product={product} />
          </Col>
        );
      })}
    </Row>
  );
}

export default ProductList;
