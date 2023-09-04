// import React, { useContext, useState } from "react";
// import { DBContext } from "../App";
// import ProductsTable from "../components/ProductsTable";
// import EditProduct from "../components/EditProduct";
// import { Button } from "react-bootstrap";
// import Pagination from "../components/Pagination";
// import DetailsCard from "../components/DetailsCard";

// function ManageProductsPage() {
//     const products = useContext(DBContext).products.resourceData;
//     const fetchProducts = useContext(DBContext).products.fetchData;

//     const [selectedProductId, setSelectedProductId] = useState(null);

//     return selectedProductId !== null ? (
//         <EditProduct
//             selectedProductId={selectedProductId}
//             setSelectedProductId={setSelectedProductId}
//             fetchProducts={fetchProducts}
//         />
//     ) : (
//         <div className="container mt-3">
//             <Button variant="primary" onClick={() => setSelectedProductId(0)}>
//                 Add Product
//             </Button>
//             <Pagination itemsPerPage={9}>
//                 {products.map((product) => (
//                     <DetailsCard resource={product} />
//                 ))}
//             </Pagination>
//         </div>
//     );
// }

// export default ManageProductsPage;

export default function ManageProductsPage() {
    return <div>Manage Products Page</div>;
};
