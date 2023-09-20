import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DynamicTitles = ({ children }) => {
	const location = useLocation();

	// Set the title of the page based on the current path
	useEffect(() => {
		const defaultTitle = "Amore - ";

		// Removing numbers, slashes, spaces and capitalizing words
		let formattedPath = location.pathname
			.replace(/[0-9]+|\//g, " ")
			.trim()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
			.join(" ");

		if (formattedPath) {
			document.title = defaultTitle + formattedPath;
		} else {
			document.title = defaultTitle + "Home";
		}
	}, [location]);

	return children;
};

export default DynamicTitles;
