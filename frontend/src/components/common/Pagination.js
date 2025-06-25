/*
 * File: frontend/src/components/common/Pagination.js
 * Description: Advanced pagination component with multiple variants and features
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useCallback, useMemo } from 'react';
import './Pagination.css';

const Pagination = ({
  // Data
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  
  // Display options
  showInfo = true,
  showPageSize = true,
  showJumpToPage = false,
  showFirstLast = true,
  showPrevNext = true,
  
  // Page size options
  pageSizeOptions = [5, 10, 20, 50, 100],
  
  // Styling
  size = 'md', // sm, md, lg
  variant = 'default', // default, outlined, minimal, rounded
  layout = 'default', // default, compact, simple, center
  
  // Behavior
  maxVisiblePages = 5,
  disabled = false,
  loading = false,
  
  // Callbacks
  onPageChange,
  onPageSizeChange,
  
  // Custom labels
  labels = {
    info: 'Hiển thị {start}-{end} trong tổng số {total} bản ghi',
    pageSize: 'Hiển thị',
    jumpTo: 'Đến trang',
    go: 'Đi',
    first: '⏮️',
    previous: '⏪',
    next: '⏩',
    last: '⏭️',
    page: 'Trang {page}'
  },
  
  // Custom styling
  className = ''
}) => {
  const [jumpValue, setJumpValue] = useState('');

  // Calculate pagination data
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const visiblePages = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // Event handlers
  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !disabled && !loading) {
      onPageChange?.(page);
    }
  }, [currentPage, totalPages, disabled, loading, onPageChange]);

  const handlePageSizeChange = useCallback((newPageSize) => {
    if (newPageSize !== pageSize && !disabled && !loading) {
      const newPage = Math.ceil((startItem - 1) / newPageSize) + 1;
      onPageSizeChange?.(newPageSize, newPage);
    }
  }, [pageSize, startItem, disabled, loading, onPageSizeChange]);

  const handleJumpToPage = useCallback(() => {
    const page = parseInt(jumpValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpValue('');
    }
  }, [jumpValue, totalPages, handlePageChange]);

  const handleJumpKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  }, [handleJumpToPage]);

  // Format info text
  const formatInfo = () => {
    return labels.info
      .replace('{start}', startItem.toLocaleString())
      .replace('{end}', endItem.toLocaleString())
      .replace('{total}', totalItems.toLocaleString());
  };

  // Don't render if no items
  if (totalItems === 0) {
    return null;
  }

  // Simple layout (prev/next only)
  if (layout === 'simple') {
    return (
      <div className={`pagination-simple ${className}`}>
        <button
          className={`pagination-btn nav ${size} ${variant}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled || loading}
          aria-label="Trang trước"
        >
          {labels.previous}
        </button>

        <div className="pagination-simple-info">
          {formatInfo()}
        </div>

        <button
          className={`pagination-btn nav ${size} ${variant}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled || loading}
          aria-label="Trang sau"
        >
          {labels.next}
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`pagination-container ${layout} ${loading ? 'loading' : ''} ${className}`}
      role="navigation"
      aria-label="Pagination navigation"
    >
      {/* Info */}
      {showInfo && (
        <div className={`pagination-info ${size === 'sm' ? 'compact' : ''}`}>
          {formatInfo()}
        </div>
      )}

      {/* Page Controls */}
      <div className="pagination-controls">
        {/* First page */}
        {showFirstLast && (
          <button
            className={`pagination-btn nav first ${size} ${variant}`}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || disabled || loading}
            aria-label="Trang đầu"
            title="Trang đầu"
          >
            {labels.first}
          </button>
        )}

        {/* Previous page */}
        {showPrevNext && (
          <button
            className={`pagination-btn nav ${size} ${variant}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || disabled || loading}
            aria-label="Trang trước"
            title="Trang trước"
          >
            {labels.previous}
          </button>
        )}

        {/* Page numbers */}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className={`pagination-ellipsis ${size}`}>
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`pagination-btn ${size} ${variant} ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
              disabled={disabled || loading}
              aria-label={labels.page.replace('{page}', page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next page */}
        {showPrevNext && (
          <button
            className={`pagination-btn nav ${size} ${variant}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || disabled || loading}
            aria-label="Trang sau"
            title="Trang sau"
          >
            {labels.next}
          </button>
        )}

        {/* Last page */}
        {showFirstLast && (
          <button
            className={`pagination-btn nav last ${size} ${variant}`}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || disabled || loading}
            aria-label="Trang cuối"
            title="Trang cuối"
          >
            {labels.last}
          </button>
        )}
      </div>

      {/* Page size selector */}
      {showPageSize && pageSizeOptions.length > 1 && (
        <div className="pagination-page-size">
          <span>{labels.pageSize}</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={disabled || loading}
            aria-label="Số bản ghi mỗi trang"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>bản ghi</span>
        </div>
      )}

      {/* Jump to page */}
      {showJumpToPage && totalPages > maxVisiblePages && (
        <div className="pagination-jump">
          <span>{labels.jumpTo}</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyPress={handleJumpKeyPress}
            disabled={disabled || loading}
            placeholder="1"
            aria-label="Nhập số trang"
          />
          <button
            onClick={handleJumpToPage}
            disabled={!jumpValue || disabled || loading}
            aria-label="Đi đến trang"
          >
            {labels.go}
          </button>
        </div>
      )}
    </div>
  );
};

// Hook for pagination state management
export const usePagination = (initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize, newPage = 1) => {
    setPageSize(newPageSize);
    setCurrentPage(newPage);
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
    goToPage,
    setCurrentPage,
    setPageSize
  };
};

// Utility function to calculate pagination data
export const getPaginationData = (currentPage, totalItems, pageSize) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    totalPages,
    startItem,
    endItem,
    hasNextPage,
    hasPrevPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

// Simplified pagination component for basic use cases
export const SimplePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  disabled = false,
  className = '' 
}) => (
  <div className={`pagination-simple ${className}`}>
    <button
      className="pagination-btn nav"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || disabled}
      aria-label="Trang trước"
    >
      ⏪ Trước
    </button>

    <span className="pagination-simple-info">
      Trang {currentPage} / {totalPages}
    </span>

    <button
      className="pagination-btn nav"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages || disabled}
      aria-label="Trang sau"
    >
      Sau ⏩
    </button>
  </div>
);

// Compact pagination for mobile or limited space
export const CompactPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  disabled = false,
  className = '' 
}) => (
  <div className={`pagination-controls spaced ${className}`}>
    <button
      className="pagination-btn nav sm"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || disabled}
      aria-label="Trang trước"
    >
      ⏪
    </button>

    <span className="pagination-info compact">
      {currentPage}/{totalPages}
    </span>

    <button
      className="pagination-btn nav sm"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages || disabled}
      aria-label="Trang sau"
    >
      ⏩
    </button>
  </div>
);

export default Pagination;