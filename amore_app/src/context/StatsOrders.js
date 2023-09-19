import React, { useEffect, useState } from "react";

export default function StatsGeneral({ orders }) {
	const [isLoading, setIsLoading] = useState(true);
	const [proccessingOrders, setProccessingOrders] = useState(0);
	const [shippedOrders, setShippedOrders] = useState(0);
	const [deliveredOrders, setDeliveredOrders] = useState(0);
	const [canceledOrders, setCanceledOrders] = useState(0);
	const [totalOrders, setTotalOrders] = useState(0);

	useEffect(() => {
		if (orders) {
			setProccessingOrders(orders.filter((order) => order.status === 0).length);
			setShippedOrders(orders.filter((order) => order.status === 1).length);
			setDeliveredOrders(orders.filter((order) => order.status === 2).length);
			setCanceledOrders(orders.filter((order) => order.status === 3).length);
			setTotalOrders(orders.length);
			setIsLoading(false);
		}
	}, [orders]);

	return (
		!isLoading && (
			<ul>
				<li>Proccessing Orders: {proccessingOrders}</li>
				<li>Shipped Orders: {shippedOrders}</li>
				<li>Delivered Orders: {deliveredOrders}</li>
				<li>Canceled Orders: {canceledOrders}</li>
				<li>Total Orders: {totalOrders}</li>
			</ul>
		)
	);
}
