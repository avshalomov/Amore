import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
    const { products } = useDataContext();
    const [newArrivals, setNewArrivals] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const navigate = useNavigate();

    // Loggin required to search
    const handleSearch = () => {
        localStorage.setItem("searchWord", searchWord);
        localStorage.setItem("navigatedFrom", "/Home");
        localStorage.setItem("navigatingTo", "/Store");
        navigate("/Store");
    };

    // Get the latest 5 products
    useEffect(() => {
        if (!products || products.length === 0) return;
        const latestProducts = products.slice(-5).reverse();
        setNewArrivals(latestProducts);
    }, [products]);

    return (
        <>
            <Container fluid className="home-page">
                <Row className="justify-content-center text-center">
                    <Col xs={12} md={8}>
                        <h1>Welcome to Amore Clothing Store!</h1>
                        <h3>
                            Discover the latest fashion trends and shop for
                            high-quality clothing.
                        </h3>
                        <hr />
                        <h4>
                            Explore our exclusive collection and find your
                            perfect style.
                        </h4>
                        <Form.Control
                            type="text"
                            placeholder="Find your style!"
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                        />
                        <Button
                            variant="warning"
                            size="lg"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
            </Container>
            {newArrivals.length > 0 ? (
                <Container fluid>
                    <h3 className="text-center mt-5">New Arrivals</h3>
                    <Row className="justify-content-center">
                        {newArrivals.map((product) => (
                            <Col
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={product.productId}
                            >
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            ) : (
                <h3 className="text-center mt-5">No products found.</h3>
            )}
        </>
    );
};

export default HomePage;
