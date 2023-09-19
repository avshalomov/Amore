import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Image } from "react-bootstrap";
import axios from "../api/axios";
import { useDataContext } from "../context/DataContext";
import { useAppContext } from "../context/AppContext";
import Loading from "../utils/Loading";
import ModalAlert from "../utils/ModalAlert";
import GenericForm from "../utils/GenericForm";
import StatsProducts from "../components/StatsProducts";

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
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");
	const [formData, setFormData] = useState({
		productName: "",
		description: "",
		price: 0.01,
		category: "",
		gender: "",
		stockQuantity: 0,
		picture: "",
	});

	useEffect(() => {
		if (products) setIsLoading(false);
	}, [products]);

	// Sorting products
	const sortedProducts = [...products].sort((a, b) => {
		const multiplier = sortDirection === "asc" ? 1 : -1;
		if (a[sortField] < b[sortField]) return -1 * multiplier;
		if (a[sortField] > b[sortField]) return 1 * multiplier;
		return 0;
	});
	// Handling sort direction
	const handleSort = (field) => {
		setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
		setSortField(field);
	};

	// Adding product
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

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row className="justify-content-between">
				<Col className="tall-card flakes-bg" style={{ height: "60vh" }} xl={4} xs={12}>
					<h1>All Products</h1>
					<p>Here you can view all products, add new products, and edit existing products.</p>
					<StatsProducts />
				</Col>
				{isAddingProduct ? (
					<Col className="tall-card flakes-bg" xl={7} xs={12}>
						{formData.picture && <Image className="form-picture" src={formData.picture} fluid />}
						<GenericForm
							formData={formData}
							setFormData={setFormData}
							handleSubmit={handleSubmit}
							submitName="Add Product"
							cancel={() => setIsAddingProduct(false)}
						/>
					</Col>
				) : (
					<Col className="tall-card flakes-bg text-center" xl={7} xs={12}>
						<Button onClick={() => setIsAddingProduct(true)}>Add Product</Button>
						<Table responsive hover striped className="text-center">
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
