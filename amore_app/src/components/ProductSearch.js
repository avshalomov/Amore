import React, { useState, useEffect } from "react";
import { Form, FormControl, Dropdown, Alert, Row, Col } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";

const GENDER_MAP = {
	all: "All",
	0: "Unisex",
	1: "Male",
	2: "Female",
};

// Check if field includes term.
const matchTerm = (field, term) => field.toLowerCase().includes(term.toLowerCase());

const ProductSearch = ({ renderProducts, setRenderProducts }) => {
	const { products } = useDataContext();
	const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchWord") || "");
	const [selectedGender, setSelectedGender] = useState("all");
	const [selectedCategory, setSelectedCategory] = useState("All");

	// Get unique categories from products.
	const uniqueCategories = ["All", ...new Set(products.map(({ category }) => category))];

	// If search changes, remove the searchWord from localStorage.
	useEffect(() => {
		localStorage.getItem("searchWord") !== searchTerm && localStorage.removeItem("searchWord");
	}, [searchTerm]);

	// Searching text by name, description, and category.
	// filtering by gender and category.
	useEffect(() => {
		const filterLogic = ({ productName, description, category, gender }) => {
			const termMatches = [productName, description, category].some((field) => matchTerm(field, searchTerm));
			const genderMatches = selectedGender === "all" ? true : gender === Number(selectedGender);
			const categoryMatches = selectedCategory === "All" ? true : category === selectedCategory;
			return termMatches && genderMatches && categoryMatches;
		};

		setRenderProducts(products.filter(filterLogic));
	}, [searchTerm, selectedGender, selectedCategory, products]);

	const handleChange = (e) => {
		setSearchTerm(e.target.value);
	};

	return (
		<>
			<Form>
				<Row className="wide-card p-0 my-0 pt-2 justify-content-center text-center">
					<Col xl={8} lg={8} md={6} sm={12} xs={12}>
						<Form.Label>Search</Form.Label>
						<FormControl type="text" placeholder="Search" value={searchTerm} onChange={handleChange} />
					</Col>
					<Col xl={2} lg={2} md={3} sm={6} xs={6}>
						<Form.Label>Gender</Form.Label>
						<Dropdown onSelect={(key) => setSelectedGender(key)}>
							<Dropdown.Toggle variant="warning">
								{GENDER_MAP[selectedGender] || "Select Gender"}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								{Object.keys(GENDER_MAP).map((key) => (
									<Dropdown.Item key={key} eventKey={key}>
										{GENDER_MAP[key]}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>
					</Col>
					<Col xl={2} lg={2} md={3} sm={6} xs={6}>
						<Form.Label>Category</Form.Label>
						<Dropdown onSelect={(key) => setSelectedCategory(key)}>
							<Dropdown.Toggle variant="warning">{selectedCategory || "Select Category"}</Dropdown.Toggle>
							<Dropdown.Menu>
								{uniqueCategories.map((category) => (
									<Dropdown.Item key={category} eventKey={category}>
										{category}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>
					</Col>
					<Col xl={3} lg={3} md={4} sm={5} xs={6}>
						<Alert variant="warning" className="mt-2">
							{renderProducts.length} Products
						</Alert>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default ProductSearch;
