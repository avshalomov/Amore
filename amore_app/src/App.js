// React and Router imports
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Utility imports
import ProtectedRoute from "./utils/ProtectedRoute";
import DynamicTitles from "./utils/DynamicTitles";

// Component imports
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// View imports
import NotFoundPage from "./views/NotFoundPage";
import ManagePage from "./views/ManagePage";
import HomePage from "./views/HomePage";
import AboutPage from "./views/AboutPage";
import RegisterPage from "./views/RegisterPage";
import LoginPage from "./views/LoginPage";
import StorePage from "./views/StorePage";
import ProfilePage from "./views/ProfilePage";
import CartPage from "./views/CartPage";
import ProductPage from "./views/ProductPage";
import UsersPage from "./views/UsersPage";
import UserPage from "./views/UserPage";
import OrdersPage from "./views/OrdersPage";
import OrderPage from "./views/OrderPage";

const App = () => {
	// Add routes here only (if needs protection then add a role to protectedFor)
	// no protectedFor: accessible for all
	// Admin: accessible for Admin only
	// UserId: accessible for Admin and the user with the same userId
	// User: accessible for logged in users (User and Admin)
	// Public: accessible for non-logged in users only
	const routes = [
		{ path: "*", element: <NotFoundPage /> },
		{ path: "/Manage", element: <ManagePage />, protectedFor: "Admin" },
		{ path: "/", element: <HomePage /> },
		{ path: "/About", element: <AboutPage /> },
		{ path: "/Register", element: <RegisterPage />, protectedFor: "Public" },
		{ path: "/Login", element: <LoginPage />, protectedFor: "Public" },
		{ path: "/Store", element: <StorePage />, protectedFor: "User" },
		{ path: "/Profile", element: <ProfilePage />, protectedFor: "User" },
		{ path: "/Cart", element: <CartPage />, protectedFor: "User" },
		{ path: "/Products/:productId", element: <ProductPage />, protectedFor: "User" },
		{ path: "/Users", element: <UsersPage />, protectedFor: "Admin" },
		{ path: "/Users/:userId", element: <UserPage />, protectedFor: "Admin" },
		{ path: "/Users/:userId/Orders", element: <OrdersPage />, protectedFor: "UserId" },
		{ path: "/Users/:userId/Orders/:orderId", element: <OrderPage />, protectedFor: "UserId" },
	];

	// Automatically generates the routes from the routes array
	return (
		<BrowserRouter>
			<DynamicTitles>
				<NavBar />
				<Routes>
					{routes.map(({ path, element, protectedFor }, index) => (
						<Route
							key={index}
							path={path}
							element={<ProtectedRoute protectedFor={protectedFor} element={element} />}
						/>
					))}
				</Routes>
				<Footer />
			</DynamicTitles>
		</BrowserRouter>
	);
};

export default App;
