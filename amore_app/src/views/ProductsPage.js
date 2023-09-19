import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Image } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import { useAppContext } from "../context/AppContext";
import StatsProducts from "../components/StatsProducts";
import Loading from "../utils/Loading";
import GenericForm from "../utils/GenericForm";
import axios from "../api/axios";
import ModalAlert from "../utils/ModalAlert";

const GENDER_MAP = {
	Unisex: 0,
	Male: 1,
	Female: 2,
};

export default function ProductsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const { token } = useAppContext();
	const { products, fetchProducts } = useDataContext();
	const [isAddingProduct, setIsAddingProduct] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const [formData, setFormData] = useState({
		productName: "Product Name",
		description: "Product Description",
		price: 0.01,
		category: "Category",
		gender: "Unisex",
		stockQuantity: 0,
		picture: "",
	});
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");

	const sortedProducts = [...products].sort((a, b) => {
		const multiplier = sortDirection === "asc" ? 1 : -1;
		if (a[sortField] < b[sortField]) return -1 * multiplier;
		if (a[sortField] > b[sortField]) return 1 * multiplier;
		return 0;
	});

	const handleSort = (field) => {
		setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
		setSortField(field);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Preparing expected payload
		const payload = {
			productId: 0,
			productName: formData.productName,
			description: formData.description,
			price: parseFloat(formData.price),
			category: formData.category,
			gender: GENDER_MAP[formData.gender],
			stockQuantity: parseInt(formData.stockQuantity, 10),
			dateAdded: new Date().toISOString(),
			picture: formData.picture,
		};
		const header = { headers: { Authorization: `Bearer ${token}` } };
		// Sending request
		try {
			await axios.post("/Products", payload, header);
			fetchProducts();
			setModalTitle("Success");
			setModalBody("Product added successfully!");
		} catch (err) {
			setModalTitle("Error");
			setModalBody(err.response.data);
		} finally {
			setShowModal(true);
			setIsAddingProduct(false);
		}
	};

	useEffect(() => {
		if (products) setIsLoading(false);
	}, [products]);

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row>
				<Col className="wide-card" xs={12}>
					<h1>All Products</h1>
					<StatsProducts />
				</Col>
				{isAddingProduct ? (
					<Col className="wide-card" xs={12}>
						{formData.picture && <Image src={formData.picture} fluid />}
						<GenericForm
							formData={formData}
							setFormData={setFormData}
							handleSubmit={handleSubmit}
							submitName="Add Product"
							cancel={() => setIsAddingProduct(false)}
						/>
					</Col>
				) : (
					<Col className="wide-card" xs={12}>
						<Button onClick={() => setIsAddingProduct(true)}>Add Product</Button>
						<Table striped bordered hover responsive>
							<thead>
								<tr style={{ cursor: "pointer" }}>
									<th onClick={() => handleSort("productId")}>↕ Product ID</th>
									<th onClick={() => handleSort("productName")}>↕ Product Name</th>
									<th onClick={() => handleSort("stockQuantity")}>↕ Stock Quantity</th>
								</tr>
							</thead>
							<tbody>
								{sortedProducts.map((product) => (
									<tr
										key={product.productId}
										onClick={() => (window.location.href = `/Products/${product.productId}`)}
										style={{ cursor: "pointer" }}>
										<td>{product.productId}</td>
										<td>{product.productName}</td>
										<td>{product.stockQuantity}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Col>
				)}
			</Row>
			<ModalAlert show={showModal} onHide={() => setShowModal(false)} title={modalTitle} body={modalBody} />
		</Container>
	);
}
