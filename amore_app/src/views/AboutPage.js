import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Contact from "../components/Contact";
import logo from "../assets/images/about/A400x400.png";
import owner from "../assets/images/about/kanan.png";
import "./AboutPage.css";

function AboutPage() {
    return (
        <Container fluid>
            <Row className="justify-content-between">
                {/* Left Column */}
                <Col sm={12} md={5} className="left-col tall-card text-center">
                    <h1>About Amore</h1>
                    <h3>Fashion for All, Versatile, Quality, Affordable</h3>
                    <hr />
                    <img
                        className="logo-image"
                        src={logo}
                        alt="Amore's Universal Logo"
                    />
                    <hr />
                    <p>
                        Welcome to Amore, the one-stop shop for all your fashion
                        needs. Established in 2023, our mission is simple: to
                        bring quality and style to everyone. We believe that
                        fashion is a way to express yourself, and everyone
                        should have access to great clothing without
                        compromising on quality or breaking the bank. Our
                        collections are diverse, featuring styles that range
                        from everyday casual to special-occasion elegance. With
                        Amore, great fashion is just a click away. Start your
                        all-inclusive style journey with us today.
                    </p>
                    <hr />
                    <img
                        className="owner-image"
                        src={owner}
                        alt="Store's Owner"
                    />
                    <h3>Made with passion by Kanan</h3>
                </Col>

                {/* Right Column */}
                <Col sm={12} md={6} className="right-col tall-card">
                    <h3>Our Mission</h3>
                    <p>
                        At Amore, we're more than a fashion brand; we're agents
                        of change. We aim to reshape the industry by focusing on
                        sustainable, ethical fashion and unmatched customer
                        service. Our collections are responsibly made and widely
                        accessible. Join us as we turn fashion into a force for
                        good, fostering a sustainable and inclusive future.
                    </p>
                    <br />
                    <hr />
                    <h3>Careers at Amore</h3>
                    <p>
                        Join our dynamic team of fashion experts, designers, and
                        customer service professionals. Committed to elevating
                        the retail experience, we offer you a chance to
                        contribute to our industry-leading innovations. Discover
                        purpose in your passion with a career at Amore.
                    </p>
                    <br />
                    <hr />
                    <h3>Contact</h3>
                    <p>
                        Your satisfaction is paramount to us. For immediate
                        answers to common inquiries about our store and
                        services. We're committed to providing you with
                        exceptional assistance.
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
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <br />
                    <hr />
                    <h3>Our Policies</h3>
                    <p>
                        At Amore, our aim is to provide an unmatched service
                        experience underpinned by transparency. Kindly take a
                        moment to review our key policies:
                    </p>
                    <ul>
                        <li>
                            <strong>Return Policy:</strong> Enjoy a hassle-free
                            30-day return period on all products. Terms and
                            conditions are applicable.
                        </li>
                        <li>
                            <strong>Shipping Policy:</strong> Benefit from
                            complimentary shipping on orders exceeding $100. We
                            also offer international shipping options.
                        </li>
                        <li>
                            <strong>Privacy Policy:</strong> Your privacy is our
                            utmost priority; rest assured, we adhere to rigorous
                            protocols to safeguard your information.
                        </li>
                        <li>
                            <strong>Terms of Service:</strong> For a thorough
                            understanding of our services, please consult our
                            detailed Terms of Service.
                        </li>
                    </ul>
                </Col>
            </Row>

            {/* Bottom Section */}
            <Row className="justify-content-between">
                <Col className="bottom-col wide-card" sm={12}>
                    <Button
                        target="blank"
                        variant="warning"
                        href="https://github.com/avshalomov/Amore"
                    >
                        Github Repository
                    </Button>
                    <h2>Website Development Overview</h2>
                    <hr />
                    <h4>Introduction & Planning</h4>
                    <p>
                        An all-encompassing solution with a focus on
                        high-quality, responsive design, meticulously planned
                        over a 35-day development schedule to accommodate
                        self-paced learning and effective time management.
                    </p>
                    <br />
                    <hr />
                    <h4>Functional Specifications & Requirements</h4>
                    <p>
                        The platform includes core features such as a dynamic
                        content display, secure login, administrative interface,
                        and server-side data persistence. Designed to meet
                        industry best practices, the project serves as an
                        exemplary portfolio piece for prospective employers.
                    </p>
                    <br />
                    <hr />
                    <h4>Data Management Strategy</h4>
                    <p>
                        Robust data management using MySQL and Entity Framework,
                        incorporating models like Users, Products, Orders, and
                        Carts. Capabilities include CRUD operations,
                        sophisticated navigation hierarchies, and automated
                        initial data population.
                    </p>
                    <br />
                    <hr />
                    <h4>Client & Server Development</h4>
                    <p>
                        Employing React for client-side interactions and Asp.Net
                        Core for server-side logic, the platform offers
                        comprehensive features such as accessibility,
                        pagination, and responsive layouts. Advanced elements
                        include JSON configurations, JWT Token authentication,
                        and additional extensions like CSS modularization and
                        state management.
                    </p>
                    <br />
                    <hr />
                    <h4>Development Timeline & Conclusion</h4>
                    <p>
                        Rigorous 16-day development phase succeeded by a 19-day
                        period for debugging and enhancements, culminating in a
                        project that adheres to quality and aesthetic standards
                        by September 20, 2023, thereby serving as a robust
                        showcase for career opportunities.
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

export default AboutPage;
