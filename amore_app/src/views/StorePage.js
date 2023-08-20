import React, { useEffect, useState } from "react";
import { Container, Row, Col, Pagination, Form } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import "./StorePage.css";

function StorePage() {
  // State Variables
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 9;

  // Fetch Products and Categories
  useEffect(() => {
    fetch("https://localhost:7280/api/Products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        const uniqueCategories = new Set(data.map((product) => product.category));
        setCategories(["All", ...uniqueCategories]);
      })
      .catch((error) => console.error("An error occurred while fetching the products:", error));
  }, []);

  // Filter Products
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (selectedGender === "All" || product.gender === selectedGender) &&
      (searchQuery === "" ||
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change Page Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render Component
  return (
    <Container className="p-4">
      <Row className="my-5">
        <Col>
          <Row className="title-bar">
            {/* Title */}
            <h1>Our Collection</h1>
            <hr />

            {/* Category Dropdown */}
            <Col sm={12} md={6} lg={4}>
              <h2>Category</h2>
              <Form.Control as="select" onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Col>

            {/* Gender Dropdown */}
            <Col sm={12} md={6} lg={4}>
              <h2>Gender</h2>
              <Form.Control as="select" onChange={(e) => setSelectedGender(e.target.value)}>
                <option value="All">All</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Unisex">Unisex</option>
              </Form.Control>
            </Col>

            {/* Search Field */}
            <Col sm={12} md={6} lg={4}>
              <h2>Search</h2>
              <Form.Control
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>

            {/* Filtered Number */}
            <p>{filteredProducts.length} products found</p>
          </Row>

          {/* Top Pagination */}
          <Pagination>
            {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(
              (number) => (
                <Pagination.Item
                  key={number + 1}
                  className={`pagination-item${number + 1 === currentPage ? " active" : ""}`}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>

          {/* Products List */}
          <Row>
            {currentProducts.map((product) => (
              <Col
                sm={12}
                md={6}
                lg={4}
                key={product.productId}
                className={product.productId % 2 === 0 ? "mb-5vw" : "mb-10vw"}
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {/* Bottom Pagination */}
          <Pagination>
            {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(
              (number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

export default StorePage;
