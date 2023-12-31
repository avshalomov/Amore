import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Container, Row, Image, Button } from "react-bootstrap";
import axios from "../api/axios";
import { useAppContext } from "../context/AppContext";
import { useDataContext } from "../context/DataContext";
import Loading from "../utils/Loading";
import ModalAlert from "../utils/ModalAlert";
import GenericForm from "../utils/GenericForm";

// Maps for text generation
const GENDER_MAP = {
	0: "Unisex",
	1: "Male",
	2: "Female",
};
const REVERSE_GENDER_MAP = {
	Unisex: 0,
	Male: 1,
	Female: 2,
};
const getIntroductionMap = (product) => ({
	0: `Elevate your wardrobe with our ${product.productName}. A versatile choice in the ${
		product.category
	} category, designed specifically for ${GENDER_MAP[product.gender]}.`,
	1: `Looking for something timeless? Our ${product.productName} fits the bill, classified under ${
		product.category
	} and perfect for ${GENDER_MAP[product.gender]}.`,
	2: `Find your new favorite piece with our ${product.productName}, a staple in the ${
		product.category
	} section, ideal for ${GENDER_MAP[product.gender]}.`,
	3: `${product.productName}: Where style and comfort collide. A prominent member of our ${
		product.category
	} collection, crafted for ${GENDER_MAP[product.gender]}.`,
	4: `Immerse yourself in the unmatched comfort and style of our ${product.productName}, designed for ${
		GENDER_MAP[product.gender]
	} and categorized under ${product.category}.`,
	5: `Explore endless possibilities with our ${product.productName}. An essential in the ${
		product.category
	} lineup, tailored for ${GENDER_MAP[product.gender]}.`,
});
const getDescriptionMap = (product) => ({
	0: `Available since ${new Date(product.dateAdded).toLocaleDateString()}, this ${
		product.description
	} is priced at $${product.price}. Currently, we have ${product.stockQuantity} items in stock.`,
	1: `Our ${product.description} was added to our collection on ${new Date(
		product.dateAdded
	).toLocaleDateString()}. With ${product.stockQuantity} units available, it's a steal at just $${product.price}.`,
	2: `Priced at $${product.price}, this ${product.description} has been in stock since ${new Date(
		product.dateAdded
	).toLocaleDateString()}. We have ${product.stockQuantity} units currently available.`,
	3: `Since ${new Date(product.dateAdded).toLocaleDateString()}, our ${
		product.description
	} has been capturing attention. Priced at $${product.price}, we still have ${product.stockQuantity} in stock.`,
	4: `Released on ${new Date(product.dateAdded).toLocaleDateString()}, this ${product.description} costs only $${
		product.price
	}. Stock is limited with ${product.stockQuantity} units left.`,
	5: `This ${product.description}, available since ${new Date(
		product.dateAdded
	).toLocaleDateString()}, is a fantastic deal at $${product.price}. Hurry, we've only got ${
		product.stockQuantity
	} left in stock.`,
});

const ProductPage = () => {
	const productId = parseInt(useParams().productId, 10);
	const [product, setProduct] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalBody, setModalBody] = useState("");
	const { products, fetchProducts, cartItems, fetchCartItems, fetchCart } = useDataContext();
	const { userId, token, role } = useAppContext();
	const navigate = useNavigate();
	const [isEditingProduct, setIsEditingProduct] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [formData, setFormData] = useState({});
	const [acceptButton, setAcceptButton] = useState(null);

	// Setting the product
	useEffect(() => {
		if (products && products.length > 0) {
			const product = products.find((product) => product.productId === productId);
			setProduct(product);
			setFormData({
				productName: product.productName,
				description: product.description,
				price: product.price,
				category: product.category,
				gender: GENDER_MAP[product.gender],
				stockQuantity: product.stockQuantity,
				picture: product.picture,
			});
			setIsLoading(false);
		}
	}, [products, productId]);

	// Handdle add to cart
	const handleAddToCart = async () => {
		// Check if productId is already in cartItems
		if (cartItems.find((item) => item.productId === productId)) {
			setModalTitle("Wait!");
			setModalBody("You already have this item in your cart, please update the quantity there.");
			setAcceptButton({
				text: "Go to cart",
				variant: "warning",
				handleButton: () => navigate("/Cart"),
			});
			setShowModal(true);
			return;
		} else if (product.stockQuantity === 0) {
			setModalTitle("Wait!");
			setModalBody("This item is out of stock.");
			setAcceptButton({
				text: "Go to Store",
				variant: "warning",
				handleButton: () => navigate("/Store"),
			});
			setShowModal(true);
			return;
		} else {
			try {
				const cartItem = {
					cartId: userId,
					productId: productId,
					quantity: 1,
				};
				await axios.post("/CartItems", cartItem, {
					headers: { Authorization: `Bearer ${token}` },
				});
				// Update context
				fetchCartItems();
				fetchCart();
				fetchProducts();
				// Show modal
				setModalTitle("Nice!");
				setModalBody("Item added to cart, you can now proceed to checkout.");
				setAcceptButton({
					text: "Go to cart",
					variant: "warning",
					handleButton: () => navigate("/Cart"),
				});
				setShowModal(true);
			} catch (err) {
				setModalTitle("Error!");
				setModalBody("Failed to add item to cart.");
				setAcceptButton(null);
				setShowModal(true);
			}
		}
	};

	// Handle edit product
	const handleEditProduct = async (e) => {
		e.preventDefault();
		// Preparing expected payload
		const payload = {
			productId: product.productId,
			productName: formData.productName,
			description: formData.description,
			price: parseFloat(formData.price),
			category: formData.category,
			gender: REVERSE_GENDER_MAP[formData.gender],
			stockQuantity: parseInt(formData.stockQuantity, 10),
			dateAdded: new Date().toISOString(),
			picture: formData.picture,
		};
		const header = { headers: { Authorization: `Bearer ${token}` } };
		// Sending request
		try {
			await axios.put(`/Products/${product.productId}`, payload, header);
			fetchProducts();
			setModalTitle("Success");
			setModalBody("Product edited successfully!");
		} catch (err) {
			setModalTitle("Error");
			setModalBody(err.response.data);
		} finally {
			setShowModal(true);
			setIsEditingProduct(false);
		}
	};

	// Handle delete product
	const handleDeleteProduct = async () => {
		setModalTitle("Are you sure?");
		setModalBody("This action cannot be undone.");
		setAcceptButton({
			text: "Delete",
			variant: "danger",
			handleButton: deleteProduct,
		});
		setShowModal(true);
	};

	// Delete product
	const deleteProduct = async () => {
		try {
			await axios.delete(`/Products/${product.productId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setIsLoading(true);
			fetchProducts();
			navigate(-1);
		} catch (err) {
			setModalTitle("Error");
			setModalBody(err.response.data);
		} finally {
			setAcceptButton(null);
			setShowModal(true);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<Container fluid>
			<Row className="wide-card flakes-bg justify-content-between">
				<h3>{product.productName}</h3>
				<hr />
				{!isEditingProduct && role === "Admin" && userId && (
					<Col xl={12} lg={12} md={12} sm={12} xs={12}>
						<Button variant="info" onClick={() => setIsEditingProduct(true)}>
							Edit Product
						</Button>
						<Button variant="danger" onClick={handleDeleteProduct}>
							Delete Product
						</Button>
					</Col>
				)}
				{!isEditingProduct && (
					<>
						<Col xl={6} lg={6} md={6} sm={12} xs={12}>
							<Image src={product.picture} fluid rounded className="product-picture" />
						</Col>
						<Col xl={6} lg={6} md={6} sm={12} xs={12}>
							<h4>Introduction</h4>
							<p>{getIntroductionMap(product)[product.productId % 6]}</p>
							<h5>Description</h5>
							<p>{getDescriptionMap(product)[product.productId % 6]}</p>
							<hr />
							<ul>
								<li>
									<strong>Category:</strong> {product.category}
								</li>
								<li>
									<strong>Gender:</strong> {GENDER_MAP[product.gender]}
								</li>
								<li>
									<strong>Price:</strong> ${product.price}
								</li>
								<li>
									<strong>Stock:</strong> {product.stockQuantity}
								</li>
								<li>
									<strong>Added:</strong> {new Date(product.dateAdded).toLocaleDateString()}
								</li>
							</ul>
							<hr />
						</Col>
						<Col xl={2} lg={2} md={2} sm={2} xs={2}>
							<Button variant="secondary" onClick={() => window.history.back()}>
								Back
							</Button>
						</Col>
						<Col xl={4} lg={4} md={4} sm={10} xs={9}>
							<Button variant="warning" onClick={handleAddToCart}>
								Add to Cart
							</Button>
						</Col>
					</>
				)}
				{isEditingProduct && (
					<>
						<Col xl={6} lg={6} md={6} sm={12} xs={12}>
							<Image src={formData.picture} fluid rounded className="product-picture" />
						</Col>
						<Col xl={6} lg={6} md={6} sm={12} xs={12}>
							<GenericForm
								formData={formData}
								setFormData={setFormData}
								handleSubmit={handleEditProduct}
								submitName="Save Changes"
								cancel={() => setIsEditingProduct(false)}
							/>
						</Col>
					</>
				)}
			</Row>
			{showModal && (
				<ModalAlert
					title={modalTitle}
					body={modalBody}
					show={showModal}
					onHide={() => setShowModal(false)}
					addButton={acceptButton}
				/>
			)}
		</Container>
	);
};

export default ProductPage;
