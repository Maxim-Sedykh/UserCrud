import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
                Предыдущая
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    style={{ backgroundColor: currentPage === page ? '#007bff' : '#6c757d' }}
                >
                    {page + 1}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                Следующая
            </button>
        </div>
    );
};

export default Pagination;