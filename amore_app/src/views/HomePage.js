import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const HomePage = () => {
    const { products } = useDataContext();
    const [newArrivals, setNewArrivals] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const navigate = useNavigate();
    const { token } = useAppContext();

    // Loggin required to search
    const handleSearch = () => {
        localStorage.setItem("searchWord", searchWord);
        if (!token) {
            localStorage.setItem("navigatedFrom", "/Home");
            localStorage.setItem("navigatingTo", "/Store");
            navigate("/Login");
        } else navigate("/Store");
    };

    // Get the latest 5 products
    useEffect(() => {
        if (!products || products.length === 0) return;
        const latestProducts = products.slice(-5).reverse();
        setNewArrivals(latestProducts);
    }, [products]);

    return (
        <Container fluid>
            <Row className="justify-content-center text-center">
                <Col className="wide-card home-page" xs={12} md={8}>
                    <h1>Welcome to Amore Clothing Store!</h1>
                    <h3>
                        Discover the latest fashion trends and shop for
                        high-quality clothing.
                    </h3>
                    <hr />
                    <h4>
                        Explore our exclusive collection and find your perfect
                        style.
                    </h4>
                    <Form.Control
                        type="text"
                        placeholder="Find your style!"
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                    />
                    <Button variant="warning" size="lg" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
            </Row>
            <h3 className="text-center mt-5">New Arrivals</h3>
            {newArrivals.length > 0 ? (
                <Row className="justify-content-center text-center">
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
            ) : (
                <h3 className="text-center mt-5">No products found.</h3>
            )}
        </Container>
    );
};

export default HomePage;
