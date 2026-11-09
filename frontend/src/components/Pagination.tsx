import React from 'react';

const PAGE_BLOCK_SIZE = 5;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onChange }: PaginationProps): React.JSX.Element | null {
    if (totalPages <= 1) {
        return null;
    }

    const blockStart = Math.floor(currentPage / PAGE_BLOCK_SIZE) * PAGE_BLOCK_SIZE;
    const blockEnd = Math.min(blockStart + PAGE_BLOCK_SIZE, totalPages);
    const pageNumbers = Array.from({ length: blockEnd - blockStart }, (_, index) => blockStart + index);

    return (
        <nav className="pagination" aria-label="페이지 이동">
            <button
                type="button"
                className="pagination-btn"
                aria-label="이전 페이지"
                disabled={currentPage === 0}
                onClick={() => onChange(currentPage - 1)}
            >
                ‹
            </button>
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    type="button"
                    className={`pagination-btn ${pageNumber === currentPage ? 'active' : ''}`}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                    onClick={() => onChange(pageNumber)}
                >
                    {pageNumber + 1}
                </button>
            ))}
            <button
                type="button"
                className="pagination-btn"
                aria-label="다음 페이지"
                disabled={currentPage >= totalPages - 1}
                onClick={() => onChange(currentPage + 1)}
            >
                ›
            </button>
        </nav>
    );
}
