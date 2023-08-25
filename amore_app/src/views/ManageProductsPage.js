import React, { useContext, useState } from "react";
import { ProductContext } from "../App";
import PaginationControl from "../components/PaginationControl";
import ProductsTable from "../components/ProductsTable";
import EditProduct from "../components/EditProduct";
import { Button } from "react-bootstrap";

function ManageProductsPage() {
    const { products, fetchProducts } = useContext(ProductContext);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [selectedProductId, setSelectedProductId] = useState(null);

    const currentProducts = products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const numberOfPages = Math.ceil(products.length / productsPerPage);

    const paginationControl = (
        <PaginationControl
            currentPage={currentPage}
            paginate={setCurrentPage}
            numberOfPages={numberOfPages}
        />
    );

    return selectedProductId !== null ? (
        <EditProduct
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            fetchProducts={fetchProducts}
        />
    ) : (
        <div className="container mt-3">
            <Button variant="primary" onClick={() => setSelectedProductId(0)}>
                Add Product
            </Button>
            {paginationControl}
            <ProductsTable
                products={currentProducts}
                setSelectedProductId={setSelectedProductId}
            />
            {paginationControl}
        </div>
    );
}

export default ManageProductsPage;
