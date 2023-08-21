import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./TitleBar.css";

function TitleBar({ categories, setSelectedCategory, setSelectedGender, setSearchQuery, filteredProductsLength }) {
  return (
    <Row className="title-bar">
      <h1>Our Collection</h1>
      <hr />
      <Col sm={12} md={6} lg={4}>
        <h2>Category</h2>
        <Form.Control as="select" onChange={(e) => setSelectedCategory(e.target.value)}>
          {
            // Map through categories to create options
            categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))
          }
        </Form.Control>
      </Col>
      <Col sm={12} md={6} lg={4}>
        <h2>Gender</h2>
        <Form.Control as="select" onChange={(e) => setSelectedGender(e.target.value)}>
          <option value="All">All</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Unisex">Unisex</option>
        </Form.Control>
      </Col>
      <Col sm={12} md={6} lg={4}>
        <h2>Search</h2>
        <Form.Control
          type="text"
          placeholder="Search for products..."
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </Col>
      <p>{filteredProductsLength} products found</p>

    </Row>
  );
}

export default TitleBar;
