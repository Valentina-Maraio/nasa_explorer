import { memo, useMemo, useCallback } from 'react';
import styles from './styles/Pagination.module.css';

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  style = {},
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePrevClick = useCallback(() => {
    onPageChange(currentPage - 1);
  }, [onPageChange, currentPage]);

  const handleNextClick = useCallback(() => {
    onPageChange(currentPage + 1);
  }, [onPageChange, currentPage]);

  const handlePageClick = useCallback((event) => {
    const { page } = event.currentTarget.dataset;
    if (!page) {
      return;
    }
    onPageChange(Number(page));
  }, [onPageChange]);

  return (
    <div className={`${styles.container} ${className}`} style={style}>
      <button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className={`${styles.button} ${styles.navButton}`}
      >
        ◀ PREV
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          data-page={typeof page === 'number' ? page : undefined}
          onClick={handlePageClick}
          disabled={page === '...'}
          className={`${styles.button} ${styles.pageButton} ${
            page === currentPage ? styles.activePage : ''
          } ${page === '...' ? styles.ellipsis : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className={`${styles.button} ${styles.navButton}`}
      >
        NEXT ▶
      </button>
    </div>
  );
});