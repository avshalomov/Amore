import React, { useState, useEffect } from "react";
import { useDataContext } from "../context/DataContext";

export default function StatsProducts() {
	const { products, orderItems } = useDataContext();
	const [data, setData] = useState({
		totalInventory: 0,
		totalUniqueCategories: 0,
		outOfStockCount: 0,
		totalUnitsSold: 0,
		averageUnitsPerProduct: 0,
	});

	useEffect(() => {
		const totalInventory = products.length;
		const totalUniqueCategories = new Set(products.map((product) => product.category)).size;
		const outOfStockCount = products.filter((product) => product.stockQuantity === 0).length;
		const totalUnitsSold = orderItems.reduce((acc, orderItem) => acc + orderItem.quantity, 0);
		const averageUnitsPerProduct = totalUnitsSold / totalInventory;

		setData({
			totalInventory,
			totalUniqueCategories,
			outOfStockCount,
			totalUnitsSold,
			averageUnitsPerProduct,
		});
	}, [products, orderItems]);

	return (
		<ul>
			<li>Total Inventory: {data.totalInventory}</li>
			<li>Total Unique Categories: {data.totalUniqueCategories}</li>
			<li>Out-of-Stock Items: {data.outOfStockCount}</li>
			<li>Cumulative Units Sold: {data.totalUnitsSold}</li>
			<li>Avg Units per Product: {data.averageUnitsPerProduct}</li>
		</ul>
	);
}
