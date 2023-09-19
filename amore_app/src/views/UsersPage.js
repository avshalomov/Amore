import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";
import StatsUsers from "../components/StatsUsers";

const ROLE_MAP = {
	0: "User",
	1: "Admin",
};

export default function UsersPage() {
	const { userId } = useAppContext();
	const { users } = useDataContext();
	const [isLoading, setIsLoading] = useState(true);
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");

	useEffect(() => {
		if (users.length > 0 && userId && isLoading) {
			setIsLoading(false);
		}
	}, [users, userId]);

	const sortedUsers = [...users].sort((a, b) => {
		const multiplier = sortDirection === "asc" ? 1 : -1;
		if (a[sortField] < b[sortField]) return -1 * multiplier;
		if (a[sortField] > b[sortField]) return 1 * multiplier;
		return 0;
	});

	const handleSort = (field) => {
		setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
		setSortField(field);
	};

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row>
				<Col className="wide-card">
					<h1>Manage Users</h1>
					<StatsUsers />
					<Table striped bordered hover responsive>
						<thead>
							<tr style={{ cursor: "pointer" }}>
								<th onClick={() => handleSort("userId")}>↕ User ID</th>
								<th onClick={() => handleSort("username")}>↕ Username</th>
								<th onClick={() => handleSort("userRole")}>↕ User Role</th>
							</tr>
						</thead>
						<tbody>
							{sortedUsers.map((user) => (
								<tr
									key={user.userId}
									onClick={() => (window.location.href = `/Users/${user.userId}`)}
									style={{ cursor: "pointer" }}>
									<td>{user.userId}</td>
									<td>{user.username}</td>
									<td>{ROLE_MAP[user.userRole]}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
		</Container>
	);
}
