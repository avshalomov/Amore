import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Contact from "../components/Contact";
import logo from "../assets/images/about/A400x400.png";
import owner from "../assets/images/about/kanan.png";
import "../assets/styles/AboutPage.css";

function AboutPage() {
	return (
		<Container fluid>
			<Row className="justify-content-between">
				{/* Left Column */}
				<Col sm={12} md={5} className="left-col tall-card text-center">
					<h1>About Amore</h1>
					<h3>Fashion for All, Versatile, Quality, Affordable</h3>
					<hr />
					<img className="logo-image" src={logo} alt="Amore's Universal Logo" />
					<hr />
					<p>
						Welcome to Amore, the one-stop shop for all your fashion needs. Established in 2023, our mission
						is simple: to bring quality and style to everyone. We believe that fashion is a way to express
						yourself, and everyone should have access to great clothing without compromising on quality or
						breaking the bank. Our collections are diverse, featuring styles that range from everyday casual
						to special-occasion elegance. With Amore, great fashion is just a click away. Start your
						all-inclusive style journey with us today.
					</p>
					<hr />
					<img className="owner-image" src={owner} alt="Store's Owner" />
					<h3>Made with passion by Kanan</h3>
				</Col>

				{/* Right Column */}
				<Col sm={12} md={6} className="right-col flakes-bg tall-card">
					<h3>Our Mission</h3>
					<p>
						At Amore, we're more than a fashion brand; we're agents of change. We aim to reshape the
						industry by focusing on sustainable, ethical fashion and unmatched customer service. Our
						collections are responsibly made and widely accessible. Join us as we turn fashion into a force
						for good, fostering a sustainable and inclusive future.
					</p>
					<br />
					<hr />
					<h3>Careers at Amore</h3>
					<p>
						Join our dynamic team of fashion experts, designers, and customer service professionals.
						Committed to elevating the retail experience, we offer you a chance to contribute to our
						industry-leading innovations. Discover purpose in your passion with a career at Amore.
					</p>
					<br />
					<hr />
					<h3>Contact</h3>
					<p>
						Your satisfaction is paramount to us. For immediate answers to common inquiries about our store
						and services. We're committed to providing you with exceptional assistance.
					</p>
					<Contact />
					<br />
					<hr />
					<h3>Location</h3>
					<iframe
						title="Amore Clothing Store Location"
						className="map"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d181052.1217436574!2d49.690149357212945!3d40.394737007916994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku!5e1!3m2!1sen!2saz!4v1692715537560!5m2!1sen!2saz"
						allowfullscreen=""
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"></iframe>
					<br />
					<hr />
					<h3>Our Policies</h3>
					<p>
						At Amore, our aim is to provide an unmatched service experience underpinned by transparency.
						Kindly take a moment to review our key policies:
					</p>
					<ul>
						<li>
							<strong>Return Policy:</strong> Enjoy a hassle-free 30-day return period on all products.
							Terms and conditions are applicable.
						</li>
						<li>
							<strong>Shipping Policy:</strong> Benefit from complimentary shipping on orders exceeding
							$100. We also offer international shipping options.
						</li>
						<li>
							<strong>Privacy Policy:</strong> Your privacy is our utmost priority; rest assured, we
							adhere to rigorous protocols to safeguard your information.
						</li>
						<li>
							<strong>Terms of Service:</strong> For a thorough understanding of our services, please
							consult our detailed Terms of Service.
						</li>
					</ul>
				</Col>
			</Row>

			<Row className="justify-content-between">
				{/* Website Use Information */}
				<Col sm={12} md={6} className="right-col tall-card geometry-bg">
					<h2>Website Use Information</h2>
					<p>
						Welcome to Amore, an online clothing store designed for a convenient and personalized shopping
						experience. Whether you're a casual visitor or a registered user, this platform provides a
						seamless way to browse, search, and purchase clothing items.
					</p>
					<hr />
					<h4>Home Page</h4>
					<p>
						On the Home Page, find our newest offerings and featured selections. Use the search bar to find
						exactly what you're looking for, or navigate to the store page to see our full range of
						products.
					</p>
					<hr />
					<h4>Login Page</h4>
					<p>
						Not logged in? No worries. We'll save your search activity temporarily. Log in for a tailored
						search and shopping experience.
					</p>
					<hr />
					<h4>Register Page</h4>
					<p>
						Sign up to access all of our platform's features. Also upload a profile picture for a
						personalized touch.
					</p>
					<hr />
					<h4>Store Page</h4>
					<p>
						Our Store Page offers a simplified search engine. Find products by category, gender, or
						keywords. Browse easily with our 10-products-per-page pagination feature.
					</p>
					<hr />
					<h4>Profile Page</h4>
					<p>
						Here's where you can see your essential user information, a mini shopping cart, and a random
						welcome message. Edit your profile, go to your cart, or check your past orders all from one
						page.
					</p>
					<hr />
					<h4>Cart Page</h4>
					<p>
						Review your cart items here. Change quantities, remove items, or empty your cart. Choose your
						shipping options and proceed to checkout when you're ready.
					</p>
					<hr />
					<h4>About Page</h4>
					<p>
						Learn all about Amore's history and how to get the most out of our platform. This is your guide
						to maximizing your shopping experience.
					</p>
					<hr />
					<h4>Manage Page</h4>
					<p>
						For admins only: Access important site stats and manage elements like users, products, and
						orders. Perform actions like reading statistics, sorting, editing, adding, and deleting data.
					</p>
				</Col>

				{/* Development Overview */}
				<Col sm={12} md={5} className="right-col tall-card lines-bg">
					<Button target="blank" variant="warning" href="https://github.com/avshalomov/Amore">
						Github Repository
					</Button>
					<h2>Development Overview</h2>
					<h4>Intro & Planning</h4>
					<p>
						Created in a planned 35-day timeline, the website prioritizes quality and responsive design.
						This accommodates self-paced learning and effective time management.
					</p>
					<hr />
					<h4>Features & Requirements</h4>
					<p>
						This platform boasts core functionalities like dynamic content, secure login, an admin panel,
						and persistent server-side data, making it an ideal portfolio project for job hunting.
					</p>
					<hr />
					<h4>Data Management</h4>
					<p>
						I used MySQL and Entity Framework for robust data management. Features include CRUD operations
						and advanced navigation for users, products, orders, and carts.
					</p>
					<hr />
					<h4>Client & Server Tech</h4>
					<p>
						Using React for the client-side and Asp.Net Core for the server-side, the platform supports
						features like accessibility and pagination. Advanced tech includes JWT authentication and state
						management.
					</p>
					<hr />
					<h4>Timeline & Wrap-up</h4>
					<p>
						After a focused 30-day development phase, I spent 5 days debugging and enhancing. The project
						meets quality standards as of September 20, 2023, and serves as a strong career portfolio piece.
					</p>
				</Col>
			</Row>
		</Container>
	);
}

export default AboutPage;
