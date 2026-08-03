import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={"Next"}
      breakLabel={"..."}
      pageCount={totalPages}
      forcePage={currentPage - 1} // ReactPaginate is zero-indexed
      pageRangeDisplayed={5}
      onPageChange={(data) => onPageChange(data.selected + 1)} // Add 1 to convert zero-indexed to one-indexed
      containerClassName={`${styles.pagination} flex gap-10`} // Use custom or predefined classes
      activeClassName={styles.active} // Highlight active page
      previousClassName={styles.previous}
      nextClassName={styles.next}
      disabledClassName={styles.disabled}
    />
  );
};

export default Pagination;
