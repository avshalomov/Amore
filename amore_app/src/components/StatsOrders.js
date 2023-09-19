import React, { useEffect, useState } from "react";

export default function StatsOrders({ orders }) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({
		Processing: 0,
		Shipped: 0,
		Delivered: 0,
		Canceled: 0,
		Total: 0,
	});

	useEffect(() => {
		if (orders) {
			const Processing = orders.filter((order) => order.status === 0).length;
			const Shipped = orders.filter((order) => order.status === 1).length;
			const Delivered = orders.filter((order) => order.status === 2).length;
			const Canceled = orders.filter((order) => order.status === 3).length;
			const Total = orders.length;

			setData({ Processing, Shipped, Delivered, Canceled, Total });
			setIsLoading(false);
		}
	}, [orders]);

	return (
		!isLoading && (
			<ul>
				<li>Orders In Process: {data.Processing}</li>
				<li>Orders Shipped: {data.Shipped}</li>
				<li>Orders Delivered: {data.Delivered}</li>
				<li>Orders Canceled: {data.Canceled}</li>
				<li>Total Order Count: {data.Total}</li>
			</ul>
		)
	);
}
