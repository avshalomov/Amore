import React, { useEffect, useState } from "react";
import { useDataContext } from "../context/DataContext";

export default function StatsGeneral() {
	const { users, products, orders, orderItems } = useDataContext();
	const [averageRevenuePerUser, setAverageRevenuePerUser] = useState(0);
	const [dailyRevenue, setDailyRevenue] = useState(0);
	const [weeklyRevenue, setWeeklyRevenue] = useState(0);
	const [monthlyRevenue, setMonthlyRevenue] = useState(0);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (users && products && orders && orderItems) {
			// Calculates the revenue per user and the total revenue
			let totalRevenue = 0;
			const revenuePerUser = {};
			orders.forEach((order) => {
				const relevantOrderItems = orderItems.filter((item) => item.orderId === order.orderId);
				const totalPrice = calculateTotalPrice(relevantOrderItems, products);
				revenuePerUser[order.userId] = (revenuePerUser[order.userId] || 0) + totalPrice;
				totalRevenue += totalPrice;
			});
			// Sets the states
			setAverageRevenuePerUser(
				Object.values(revenuePerUser).reduce((acc, revenue) => acc + revenue, 0) / users.length
			);
			setDailyRevenue(calculateRevenue(filterOrders(orders, 1), orderItems, products));
			setWeeklyRevenue(calculateRevenue(filterOrders(orders, 7), orderItems, products));
			setMonthlyRevenue(calculateRevenue(filterOrders(orders, 30), orderItems, products));
			setTotalRevenue(totalRevenue);
			setIsLoading(false);
		}
	}, [users, products, orders, orderItems]);

	// Calculates the total price of an order
	const calculateTotalPrice = (orderItems, products) => {
		return orderItems.reduce((acc, orderItem) => {
			const product = products.find((p) => p.productId === orderItem.productId);
			return product ? acc + product.price * orderItem.quantity : acc;
		}, 0);
	};
	// Filters orders by date
	const filterOrders = (orders, days) => {
		const today = new Date();
		const pastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
		return orders.filter((order) => new Date(order.orderDate) >= pastDate && new Date(order.orderDate) <= today);
	};
	// Calculates the revenue of an order
	const calculateRevenue = (filteredOrders, orderItems, products) => {
		return filteredOrders.reduce((acc, order) => {
			const relevantOrderItems = orderItems.filter((item) => item.orderId === order.orderId);
			return acc + calculateTotalPrice(relevantOrderItems, products);
		}, 0);
	};

	return (
		!isLoading && (
			<ul>
				<li>Average Revenue Per User: {averageRevenuePerUser.toFixed(2)}</li>
				<li>Daily Revenue: ${dailyRevenue.toFixed(2)}</li>
				<li>Weekly Revenue: ${weeklyRevenue.toFixed(2)}</li>
				<li>Monthly Revenue: ${monthlyRevenue.toFixed(2)}</li>
				<li>Total Revenue: ${totalRevenue.toFixed(2)}</li>
			</ul>
		)
	);
}
