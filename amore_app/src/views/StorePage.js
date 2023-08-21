import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PaginationControl from "../components/PaginationControl";
import ProductList from "../components/ProductList";
import TitleBar from "../components/TitleBar";
import Loading from "../components/Loading";
import { ProductContext } from "../App";

function StorePage() {
  // State for categories, pagination, and filtering
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 9;

  // Using Product context to get products
  const { products } = useContext(ProductContext);

  // Effect to update categories based on products
  useEffect(() => {
    const uniqueCategories = new Set(products.map((product) => product.category));
    setCategories(["All", ...uniqueCategories]);
  }, [products]);

  // Function to filter products based on selected options
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (selectedGender === "All" || product.gender === selectedGender) &&
      (searchQuery === "" ||
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Logic for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const numberOfPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Rendering
  return (
    <Container className="p-4">
      <Row className="my-5">
        {products.length > 0 ? (
          <>
            <Col>
              <TitleBar
                categories={categories}
                setSelectedCategory={setSelectedCategory}
                setSelectedGender={setSelectedGender}
                setSearchQuery={setSearchQuery}
                filteredProductsLength={filteredProducts.length}
              />
              <PaginationControl
                currentPage={currentPage}
                paginate={paginate}
                numberOfPages={numberOfPages}
              />
              <ProductList currentProducts={currentProducts} />
              <PaginationControl
                currentPage={currentPage}
                paginate={paginate}
                numberOfPages={numberOfPages}
              />
            </Col>
          </>
        ) : (
          <Col>
            <Loading text="Loading Products..." />
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default StorePage;
