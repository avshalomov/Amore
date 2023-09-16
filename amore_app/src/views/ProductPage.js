import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Image, Button, Link } from "react-bootstrap";
import Loading from "../utils/Loading";
import { useDataContext } from "../context/DataContext";

// Maps for text generation
const GENDER_MAP = {
    0: "Unisex",
    1: "Man",
    2: "Woman",
};
const getIntroductionMap = (product) => ({
    0: `Elevate your wardrobe with our ${product.productName}. A versatile choice in the ${product.category} category, designed specifically for ${GENDER_MAP[product.gender]}.`,
    1: `Looking for something timeless? Our ${product.productName} fits the bill, classified under ${product.category} and perfect for ${GENDER_MAP[product.gender]}.`,
    2: `Find your new favorite piece with our ${product.productName}, a staple in the ${product.category} section, ideal for ${GENDER_MAP[product.gender]}.`,
    3: `${product.productName}: Where style and comfort collide. A prominent member of our ${product.category} collection, crafted for ${GENDER_MAP[product.gender]}.`,
    4: `Immerse yourself in the unmatched comfort and style of our ${product.productName}, designed for ${GENDER_MAP[product.gender]} and categorized under ${product.category}.`,
    5: `Explore endless possibilities with our ${product.productName}. An essential in the ${product.category} lineup, tailored for ${GENDER_MAP[product.gender]}.`
});
const getDescriptionMap = (product) => ({
    0: `Available since ${new Date(product.dateAdded).toLocaleDateString()}, this ${product.description} is priced at $${product.price}. Currently, we have ${product.stockQuantity} items in stock.`,
    1: `Our ${product.description} was added to our collection on ${new Date(product.dateAdded).toLocaleDateString()}. With ${product.stockQuantity} units available, it's a steal at just $${product.price}.`,
    2: `Priced at $${product.price}, this ${product.description} has been in stock since ${new Date(product.dateAdded).toLocaleDateString()}. We have ${product.stockQuantity} units currently available.`,
    3: `Since ${new Date(product.dateAdded).toLocaleDateString()}, our ${product.description} has been capturing attention. Priced at $${product.price}, we still have ${product.stockQuantity} in stock.`,
    4: `Released on ${new Date(product.dateAdded).toLocaleDateString()}, this ${product.description} costs only $${product.price}. Stock is limited with ${product.stockQuantity} units left.`,
    5: `This ${product.description}, available since ${new Date(product.dateAdded).toLocaleDateString()}, is a fantastic deal at $${product.price}. Hurry, we've only got ${product.stockQuantity} left in stock.`
});

// const product = {
//     productId: 2,
//     description: "Cotton t-shirt with blue and white stripes.",
//     price: 19.99,
//     stockQuantity: 150,
//     dateAdded: "2023-01-06T00:00:00",
//     productName: "Striped T-Shirt",
//     category: "T-Shirts",
//     gender: 2,
//     picture: "data:image/jpg;base64,/9j/4AAQSk...",
// };

const ProductPage = () => {
    const productId = parseInt(useParams().productId, 10);
    const [product, setProduct] = useState(null);
    const { products } = useDataContext();

    // Setting the product
    useEffect(() => {
        if (products && products.length > 0)
            setProduct(
                products.find((product) => product.productId === productId)
            );
    }, [products, productId]);

    return product ? (
        <Container fluid>
            <Row className="wide-card flakes-bg justify-content-between">
                <h3>{product.productName}</h3>
                <hr />
                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                    <Image
                        src={product.picture}
                        fluid
                        rounded
                        style={{
                            width: "500px",
                            maxHeight: "600px",
                            objectFit: "cover",
                            marginBottom: "20px",
                        }}
                    />
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                    <h4>Introduction</h4>
                    <p>{getIntroductionMap(product)[product.productId % 6]}</p>
                    <h5>Description</h5>
                    <p>{getDescriptionMap(product)[product.productId % 6]}</p>
                    <hr />
                    <ul>
                        <li><strong>Category:</strong> {product.category}</li>
                        <li><strong>Gender:</strong> {GENDER_MAP[product.gender]}</li>
                        <li><strong>Price:</strong> {product.price}</li>
                        <li><strong>Stock:</strong> {product.stockQuantity}</li>
                        <li><strong>Added:</strong> {new Date(product.dateAdded).toLocaleDateString()}</li>
                    </ul>
                    <hr />
                </Col>
                <Col xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
                </Col>
                <Col xl={4} lg={4} md={4} sm={10} xs={9}>
                    <Button variant="warning" onClick={() => alert("Added to cart!")}>Add to Cart</Button>
                </Col>
            </Row>
        </Container>
    ) : (
        <Loading />
    );
};

export default ProductPage;
