import { useState, useEffect } from "react";

const useProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch("http://localhost:5164/api/Products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("An error occurred while fetching the products:", error)
      );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, setProducts, fetchProducts };
};

export default useProducts;
