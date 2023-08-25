import { useContext, useState } from "react";
import { ProductContext } from "../App";
import axios from "axios";

const defaultProduct = {
    productName: "",
    description: "",
    price: 0,
    category: "",
    gender: "Unisex",
    stockQuantity: 0,
    picture: "",
};

const handleAPIResponse =
    (fetchProducts, setSelectedProductId) => (response) => {
        console.log(response);
        fetchProducts();
        setSelectedProductId(null);
    };

const handleAPIError = (setError) => (error) => {
    console.log(error);
    setError(error.message);
};

export const useEditProduct = (
    selectedProductId,
    fetchProducts,
    setSelectedProductId
) => {
    const { products } = useContext(ProductContext);
    const isNewProduct = selectedProductId === 0;
    const url = isNewProduct
        ? "http://localhost:5164/api/Products"
        : `http://localhost:5164/api/Products/${selectedProductId}`;
    const method = isNewProduct ? "post" : "put";
    const [product, setProduct] = useState(
        isNewProduct
            ? defaultProduct
            : products.find((p) => p.productId === selectedProductId)
    );
    const [error, setError] = useState(null);

    const handleCancel = () => {
        setSelectedProductId(null);
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    const handleDelete = () => {
        if (window.confirm("Delete the product?")) {
            axios
                .delete(url)
                .then(handleAPIResponse(fetchProducts, setSelectedProductId))
                .catch(handleAPIError(setError));
        }
    };

    const handleChange = (e) => {
        const value =
            e.target.name === "picture" ? e.target.files[0] : e.target.value;
        setProduct({ ...product, [e.target.name]: value });
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setError("No file selected");
            return;
        }

        if (file.size / 1024 / 1024 >= 1) {
            setError("File size exceeds 1 MB");
            e.target.value = null;
            return;
        }

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            setError("File type must be jpeg, jpg, or png");
            e.target.value = null;
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result.split(",")[1];
            setProduct({ ...product, picture: base64String });
        };

        reader.onerror = () => {
            setError("An error occurred while reading the file");
        };

        reader.readAsDataURL(file);
        e.target.required = false;
    };

    const handleSubmit = (e) => {
        if (window.confirm("Save the product?")) {
            e.preventDefault();
            if (isNewProduct) product.dateAdded = new Date().toISOString();
            axios[method](url, product)
                .then(handleAPIResponse(fetchProducts, setSelectedProductId))
                .catch(handleAPIError(setError));
        }
    };

    return {
        isNewProduct,
        product,
        error,
        handlePictureChange,
        handleSubmit,
        handleChange,
        handleCancel,
        handleDelete,
    };
};
