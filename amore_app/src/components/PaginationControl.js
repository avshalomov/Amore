import React from "react";
import { Pagination } from "react-bootstrap";
import "./PaginationControl.css";

function PaginationControl({ currentPage, paginate, numberOfPages }) {
  const handlePageChange = (number) => {
    paginate(number + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls to the top of the page
  };

  return (
    <Pagination>
      {
        // Create pagination items based on the total number of pages
        [...Array(numberOfPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1} // Key is based on the page number
            active={number + 1 === currentPage} // Highlight the current page
            onClick={() => handlePageChange(number)} // Handle page change
          >
            {number + 1}
          </Pagination.Item>
        ))
      }
    </Pagination>
  );
}

export default PaginationControl;
