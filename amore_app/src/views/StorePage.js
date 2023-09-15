import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Utilities
import Loading from "../utils/Loading";

// Components
import ProductSearch from "../components/ProductSearch";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const StorePage = () => {
    const [renderProducts, setRenderProducts] = useState([]);

    return (
        <Container fluid>
            <Row className="wide-card py-3 paint-bg mb-1 text-center">
                <h1>Welcome to our store!</h1>
                <h6>
                    You can search for{" "}
                    {localStorage.getItem("searchWord")
                        ? localStorage.getItem("searchWord")
                        : "products"}{" "}
                    here.
                </h6>
                <hr />
                <ProductSearch
                    renderProducts={renderProducts}
                    setRenderProducts={setRenderProducts}
                />
            </Row>
            <Row className="justify-content-center">
                {renderProducts ? (
                    <Pagination itemsPerPage={10}>
                        {renderProducts.map((product) => (
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
                    </Pagination>
                ) : (
                    <Loading />
                )}
            </Row>
        </Container>
    );
};

export default StorePage;
