import React from "react";
import { Pagination } from "react-bootstrap";
import "./PaginationControl.css";

function PaginationControl({ currentPage, paginate, numberOfPages }) {
  return (
    <Pagination>
      {
        // Create pagination items based on the total number of pages
        [...Array(numberOfPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1} // Key is based on the page number
            active={number + 1 === currentPage} // Highlight the current page
            onClick={() => paginate(number + 1)} // Handle page change
          >
            {number + 1}
          </Pagination.Item>
        ))
      }
    </Pagination>
  );
}

export default PaginationControl;
