import React from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useEditProduct } from "../hooks/useEditProduct";
import { TextInput } from "./TextInput";
import "./EditProduct.css";

function EditProduct({
    selectedProductId,
    setSelectedProductId,
    fetchProducts,
}) {
    const {
        isNewProduct,
        product,
        error,
        handlePictureChange,
        handleSubmit,
        handleChange,
        handleCancel,
        handleDelete,
    } = useEditProduct(selectedProductId, fetchProducts, setSelectedProductId);

    // Render form
    return (
        <Form className="edit-product-form" onSubmit={handleSubmit}>
            <h1>
                {isNewProduct
                    ? `Adding ${
                          product.productName
                              ? product.productName
                              : "New Product"
                      }`
                    : `Editing ${product.productName}`}
            </h1>
            <hr />
            {product.picture && (
                <Row>
                    <img
                        src={`data:image/jpeg;base64,${product.picture}`}
                        alt="Product"
                    />
                </Row>
            )}
            <Row>
                <TextInput
                    label="Name"
                    name="productName"
                    value={product.productName}
                    maxLength={50}
                    required
                    onChange={handleChange}
                />
                <TextInput
                    label="Category"
                    name="category"
                    value={product.category}
                    maxLength={20}
                    required
                    onChange={handleChange}
                />
                <TextInput
                    label="Description"
                    name="description"
                    value={product.description}
                    maxLength={50}
                    required
                    onChange={handleChange}
                />
                <Form.Group
                    controlId="Picture"
                    className="col-xl-4 col-lg-5 col-md-5 col-sm-6 col-xs-12"
                >
                    <Form.Label>
                        <strong>Picture:</strong>
                    </Form.Label>
                    <Form.Control
                        type="file"
                        name="picture"
                        accept="image/*"
                        required={isNewProduct}
                        onChange={handlePictureChange}
                    />
                    {error && <Alert variant="danger">{error}</Alert>}
                </Form.Group>
                <Form.Group
                    controlId="Gender"
                    className="col-xl-3 col-lg-2 col-md-2 col-sm-6 col-xs-12"
                >
                    <Form.Label>
                        <strong>Gender:</strong>
                    </Form.Label>
                    <Form.Select
                        name="gender"
                        value={product.gender}
                        required
                        onChange={handleChange}
                    >
                        <option value="Unisex">Unisex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group
                    controlId="Price"
                    className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-12"
                >
                    <Form.Label>
                        <strong>Price:</strong>
                    </Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={product.price}
                        min={0.01}
                        step={0.01}
                        required
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group
                    controlId="Stock Quantity"
                    className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12"
                >
                    <Form.Label>
                        <strong>Stock Quantity:</strong>
                    </Form.Label>
                    <Form.Control
                        type="number"
                        name="stockQuantity"
                        value={product.stockQuantity}
                        min={0}
                        required
                        onChange={handleChange}
                    />
                </Form.Group>
            </Row>
            <hr />
            <Row>
                {!isNewProduct && (
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                )}
                <Button variant="success" type="submit">
                    Save
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
            </Row>
        </Form>
    );
}

export default EditProduct;
