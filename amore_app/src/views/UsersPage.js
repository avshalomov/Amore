import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";

const ROLE_MAP = {
	0: "User",
	1: "Admin",
};

// const user = {
// 	userId: 0,
// 	username: "string",
// 	email: "user@example.com",
// 	userRole: 0,
// 	lastLoginDate: "2023-09-18T15:40:33.000Z",
// 	dateCreated: "2023-09-18T15:40:33.000Z",
// 	passwordHash: "string",
// 	picture: "string",
// };

export default function UsersPage() {
	const { userId, role } = useAppContext();
	const { users } = useDataContext();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (users.length > 0 && userId && isLoading) setIsLoading(false);
	}, [users, userId]);

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row>
				<Col className="wide-card">
					<h1>Manage Users</h1>
					<Table striped bordered hover responsive>
						<thead>
							<tr>
								<th>User ID</th>
								<th>Username</th>
								<th>User Role</th>
								<th>Last Login Date</th>
								<th>Date Created</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr
									key={user.userId}
									onClick={() => (window.location.href = `/Users/${user.userId}`)}
									style={{ cursor: "pointer" }}>
									<td>{user.userId}</td>
									<td>{user.username}</td>
									<td>{ROLE_MAP[user.userRole]}</td>
									<td>{new Date(user.lastLoginDate).toLocaleString()}</td>
									<td>{new Date(user.dateCreated).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
		</Container>
	);
}
