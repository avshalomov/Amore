import React, { useState, useEffect } from "react";
import { useDataContext } from "../context/DataContext";

export default function StatsUsers() {
	const { users, orders } = useDataContext();
	const [data, setData] = useState({
		totalUsers: 0,
		activeUsers: 0,
		adminCount: 0,
		avgOrdersPerUser: 0,
		latestRegistrations: 0,
	});

	useEffect(() => {
		const today = new Date();
		const thirtyDaysAgo = new Date(today - 30 * 24 * 60 * 60 * 1000);
		const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);

		const totalUsers = users.length;
		const activeUsers = users.filter((u) => new Date(u.lastLoginDate) > thirtyDaysAgo).length;
		const adminCount = users.filter((u) => u.userRole === 1).length;
		const avgOrdersPerUser = orders.length / totalUsers;
		const latestRegistrations = users.filter((u) => new Date(u.dateCreated) > sevenDaysAgo).length;

		setData({ totalUsers, activeUsers, adminCount, avgOrdersPerUser, latestRegistrations });
	}, [users, orders]);

	return (
		<ul>
			<li>Total User Count: {data.totalUsers}</li>
			<li>Active Users: {data.activeUsers}</li>
			<li>Admin Count: {data.adminCount}</li>
			<li>Avg Orders/User: {data.avgOrdersPerUser.toFixed(2)}</li>
			<li>Latest Registrations: {data.latestRegistrations}</li>
		</ul>
	);
}
