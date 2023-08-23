import React, { useContext, useState } from "react";
import { ProductContext } from "../App";
import PaginationControl from "../components/PaginationControl";
import ProductsTable from "../components/ProductsTable";

function ManageProductsPage() {
  const { products, fetchProducts } = useContext(ProductContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-3">
      <PaginationControl
        currentPage={currentPage}
        paginate={paginate}
        numberOfPages={Math.ceil(products.length / productsPerPage)}
      />
      <ProductsTable products={currentProducts} />
      <PaginationControl
        currentPage={currentPage}
        paginate={paginate}
        numberOfPages={Math.ceil(products.length / productsPerPage)}
      />
    </div>
  );
}

export default ManageProductsPage;
