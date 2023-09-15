import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { useState } from "react";
import ProductSearch from "../components/ProductSearch";

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
                    <h3 className="text-center mt-5">No products found.</h3>
                )}
            </Row>
        </Container>
    );
};

export default StorePage;
