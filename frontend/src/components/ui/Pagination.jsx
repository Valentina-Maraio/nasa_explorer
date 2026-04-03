export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
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
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '20px',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          background: 'rgba(0, 255, 159, 0.1)',
          border: '1px solid rgba(0, 255, 159, 0.3)',
          color: currentPage === 1 ? 'rgba(0, 255, 159, 0.3)' : '#00ff9f',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          fontSize: '0.9rem',
          minWidth: '80px'
        }}
      >
        ◀ PREV
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          style={{
            padding: '8px 12px',
            background: page === currentPage ? 'rgba(0, 255, 159, 0.2)' : 'rgba(0, 255, 159, 0.1)',
            border: page === currentPage ? '1px solid #00ff9f' : '1px solid rgba(0, 255, 159, 0.3)',
            color: page === currentPage ? '#00ff9f' : 'rgba(0, 255, 159, 0.7)',
            cursor: page === '...' ? 'default' : 'pointer',
            borderRadius: '4px',
            fontSize: '0.9rem',
            minWidth: '40px',
            fontWeight: page === currentPage ? 'bold' : 'normal'
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          background: 'rgba(0, 255, 159, 0.1)',
          border: '1px solid rgba(0, 255, 159, 0.3)',
          color: currentPage === totalPages ? 'rgba(0, 255, 159, 0.3)' : '#00ff9f',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          fontSize: '0.9rem',
          minWidth: '80px'
        }}
      >
        NEXT ▶
      </button>
    </div>
  );
}