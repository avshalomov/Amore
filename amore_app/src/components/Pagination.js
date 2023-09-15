import React, { useState, useEffect, Children } from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import "./Pagination.css";

// Render the pagination component
const renderPaginationItems = (totalPages, currentPage, setCurrentPage, maxVisiblePages) => {
    const pageNumbers = [];

    // Compute the start and end pages
    let startPage = 1;
    let endPage = totalPages <= maxVisiblePages ? totalPages : maxVisiblePages;

    if (totalPages > maxVisiblePages) {
        let halfWay = Math.floor(maxVisiblePages / 2);
        startPage = Math.max(1, currentPage - halfWay);
        endPage = Math.min(totalPages, currentPage + halfWay);
    }

    // Create pagination items
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <BootstrapPagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => setCurrentPage(i)}
            >
                {i}
            </BootstrapPagination.Item>
        );
    }

    return pageNumbers;
}

// Main Pagination Component
const Pagination = ({ itemsPerPage, children }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxVisiblePages, setMaxVisiblePages] = useState(10);
    const totalPages = Math.ceil(Children.count(children) / itemsPerPage);

    // Handle window resize to update maxVisiblePages
    useEffect(() => {
        const handleResize = () => {
            setMaxVisiblePages(window.innerWidth < 768 ? 5 : 10);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Calculate the range of items to show
    const firstItem = (currentPage - 1) * itemsPerPage;
    const lastItem = firstItem + itemsPerPage;
    const currentChildren = Children.toArray(children).slice(firstItem, lastItem);

    return (
        <>
            <BootstrapPagination>
                <BootstrapPagination.First onClick={() => setCurrentPage(1)} />
                <BootstrapPagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                {renderPaginationItems(totalPages, currentPage, setCurrentPage, maxVisiblePages)}
                <BootstrapPagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                <BootstrapPagination.Last onClick={() => setCurrentPage(totalPages)} />
            </BootstrapPagination>
            {currentChildren}
            <BootstrapPagination>
                <BootstrapPagination.First onClick={() => setCurrentPage(1)} />
                <BootstrapPagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                {renderPaginationItems(totalPages, currentPage, setCurrentPage, maxVisiblePages)}
                <BootstrapPagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                <BootstrapPagination.Last onClick={() => setCurrentPage(totalPages)} />
            </BootstrapPagination>
        </>
    );
}

export default Pagination;