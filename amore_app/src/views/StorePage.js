import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TitleBar from "../components/TitleBar";
import Loading from "../components/Loading";
import { DBContext } from "../App"; // <-- import DBContext here
import Pagination from "../components/Pagination";
import DetailsCard from "../components/DetailsCard";

function StorePage() {
    // State for categories, pagination, and filtering
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedGender, setSelectedGender] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    //  Using DBContext to get products
    const products = useContext(DBContext).products.resourceData;

    // Effect to update categories based on products
    useEffect(() => {
        const uniqueCategories = new Set(
            products.map((product) => product.category)
        );
        setCategories(["All", ...uniqueCategories]);
    }, [products]);

    // Function to filter products based on selected options
    const filteredProducts = products.filter(
        (product) =>
            (selectedCategory === "All" ||
                product.category === selectedCategory) &&
            (selectedGender === "All" || product.gender === selectedGender) &&
            (searchQuery === "" ||
                product.productName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
    );

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
                            <Pagination itemsPerPage={9}>
                                {filteredProducts.map((product) => (
                                    <DetailsCard resource={product} />
                                ))}
                            </Pagination>
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
