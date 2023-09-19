import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import { useState, useEffect } from "react";
import StatsGeneral from "../components/StatsGeneral";
import Loading from "../utils/Loading";

export default function ManagePage() {
	const { userId } = useAppContext();
	const { users } = useDataContext();
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState({});

	useEffect(() => {
		if (users.length > 0 && userId && isLoading) {
			setUser(users.find((user) => user.userId == userId));
			setIsLoading(false);
		}
	}, [users, userId]);

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row className="wide-card paint-bg justify-content-between">
				<h1>Welcome {user.username}!</h1>
				<h3>What would you like to do?</h3>
				<Col className="tall-card" xl={6} lg={7} xs={12}>
					<h4>Statistics</h4>
					<StatsGeneral />
				</Col>
				<Col className="tall-card text-center" xl={5} lg={4} xs={12}>
					<h4>Manage Website</h4>
					<Button as={Link} to="/Users" variant="info" size="lg">
						Users
					</Button>
					<Button as={Link} to="/Products" variant="info" size="lg">
						Products
					</Button>
					<Button as={Link} to="/Orders" variant="info" size="lg">
						Orders
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
