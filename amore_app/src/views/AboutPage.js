import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import logo from "../assets/images/about/A400x400.png";
import owner from "../assets/images/about/kanan.png";
import "./AboutPage.css";
import Contact from "../components/Contact";

function AboutPage() {
  return (
    <Container className="about-page">
      {/* Left Column - About Amore and Owner Info */}
      <Row>
        <Col sm={12} md={6} lg={6}>
          <Row className="left-col">
            <img className="logo-image" src={logo} alt="Store's Logo" />
            <hr />
            <h1>About Amore</h1>
            <h2>Delivering Quality Fashion to Every Individual</h2>
            {/* About Description */}
            <p>
              Welcome to Amore Clothing Store, where quality and elegance
              converge. Founded in 2023, our passion lies in offering top-tier
              fashion that resonates with individuality and class. With a
              commitment to simplicity and joy in the shopping experience, we
              have curated exclusive collections of luxury clothing crafted from
              the finest materials. Whether you are seeking everyday chic or
              timeless elegance, explore Amore to discover the style that
              represents you. Your unique fashion journey begins here.
            </p>
            <hr />
            <img className="owner-image" src={owner} alt="Store's Owner" />
            <h3>Made with passion by Kanan</h3>
          </Row>
        </Col>

        {/* Right Column - Mission, Careers, Contact, and Policies */}
        <Col sm={12} md={6} lg={6}>
          <Row className="right-col">
            {/* Mission Statement */}
            <h1>Our Mission</h1>
            <p>
              Our mission is to lead the fashion industry in sustainability,
              ethical manufacturing, and exceptional customer service. We strive
              to set the standards in responsible fashion by offering a range of
              exquisite, hand-crafted garments, created by skilled artisans. We
              are unwavering in our commitment to quality and innovation and
              invite you to explore the elegance and craftsmanship that define
              our brand. Together, we can make fashion a force for good and lead
              the way to a more thoughtful and sustainable future.
            </p>
            <hr />
            {/* Career Opportunities */}
            <h2>Careers</h2>
            <p>
              Join our esteemed team of fashion experts, designers, and customer
              service specialists. We are dedicated to providing the best
              shopping experience and creating a luxurious environment. Explore
              opportunities to be part of our mission and contribute to our
              latest achievements in the fashion world.
            </p>
            <hr />
            {/* Contact Information */}
            <h2>Reach us on one of the platforms</h2>
            <p>
              We are here to assist you. Find answers to the most common
              questions about our store and services on any of our platforms.
              Your satisfaction is our priority.
            </p>
            <Contact />
            {/* Map */}
            <iframe
              title="Amore Clothing Store Location"
              className="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d181052.1217436574!2d49.690149357212945!3d40.394737007916994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku!5e1!3m2!1sen!2saz!4v1692715537560!5m2!1sen!2saz"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <hr />
            {/* Policies Section */}
            <h2>Our Policies</h2>
            <p>
              At Amore Clothing Store, we are committed to maintaining
              transparency and providing the best service to our customers.
              Please review our key policies below:
            </p>
            <ul style={{ marginLeft: "2vw" }}>
              <li>
                <strong>Return Policy:</strong> 30-day return policy on all
                items. Terms and conditions apply.
              </li>
              <li>
                <strong>Shipping Policy:</strong> Free shipping on orders over
                $100. International shipping available.
              </li>
              <li>
                <strong>Privacy Policy:</strong> We value your privacy and
                adhere to strict guidelines to protect your information.
              </li>
              <li>
                <strong>Terms of Service:</strong> Read our comprehensive terms
                of service for all the details regarding our services.
              </li>
            </ul>
          </Row>
        </Col>
      </Row>

      {/* Bottom Section - Website Development Details */}
      <Row>
        <Col sm={12} md={12} lg={12}>
          <Row className="bottom-col">
            {/* Introduction */}
            <h1>Development of the Website</h1>
            <Button
              target="blank"
              variant="warning"
              href="https://github.com/avshalomov/Amore"
            >
              Github Repository
            </Button>
            <br />
            <hr />
            {/* Planning, Description, Data Management, Development */}
            <h2>Introduction and Planning</h2>
            <p>
              A comprehensive end-to-end solution featuring client and
              server-side components, with an emphasis on quality and responsive
              design. Established development plan with careful consideration of
              self-learning and time management, spread over 35 days.
            </p>
            <hr />
            <h2>Project Description and Requirements</h2>
            <p>
              Development of central functionalities including content display,
              login system, site management interface, and server-side content
              saving. The design is aesthetically clean and adheres to coding
              conventions, encapsulating an honorable representation to
              potential employers.
            </p>
            <hr />
            <h2>Data Management</h2>
            <p>
              Structured database management involving MySQL and Entity
              Framework, with models that include Users, Products, Orders, and
              Carts. Operations include CRUD actions, depth in navigation, and
              initial data population handled through code.
            </p>
            <hr />
            <h2>Client-Side and Server-Side Development</h2>
            <p>
              Implementation using React for client-side and Asp.Net Core for
              server-side, with features like accessibility, pagination,
              responsive design, OOP principles, JSON configurations, JWT Token
              authentication, and bonus implementations including CSS division,
              state management, and external API usage.
            </p>
            <hr />
            {/* Conclusion */}
            <h2>Timeline and Conclusion</h2>
            <p>
              A systematic 16-day development plan followed by 19 days for
              debugging and enhancements. Completion by 20.9.2023 with adherence
              to quality and aesthetics, representing a showcase project for
              future career prospects.
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;
