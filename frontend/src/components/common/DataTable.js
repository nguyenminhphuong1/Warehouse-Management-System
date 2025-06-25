/*
 * File: frontend/src/components/common/DataTable.js
 * Description: Advanced data table component with sorting, filtering, pagination
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './DataTable.css';

const DataTable = ({
  // Data
  data = [],
  columns = [],
  
  // Table configuration
  title,
  subtitle,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  emptyDescription = 'Hiện tại chưa có dữ liệu để hiển thị',
  emptyIcon = '📊',
  
  // Features
  searchable = true,
  sortable = true,
  filterable = false,
  selectable = false,
  paginated = true,
  
  // Search
  searchPlaceholder = 'Tìm kiếm...',
  searchFields = [], // Các field được search, nếu empty thì search tất cả
  
  // Pagination
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPageSizeSelector = true,
  
  // Actions
  actions = [],
  rowActions = [],
  bulkActions = [],
  
  // Callbacks
  onRowClick,
  onSelectionChange,
  onSearch,
  onSort,
  onFilter,
  
  // Styling
  className = '',
  tableClassName = '',
  height,
  stickyHeader = true,
  
  // Filters
  filters = []
}) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [activeFilters, setActiveFilters] = useState({});

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      onSearch?.(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        });
      }
    });

    // Apply search
    if (debouncedSearchTerm) {
      const searchFields = searchFields.length > 0 ? searchFields : columns.map(col => col.key);
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        })
      );
    }

    return filtered;
  }, [data, debouncedSearchTerm, activeFilters, columns, searchFields]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue, 'vi');
      } else {
        comparison = String(aValue).localeCompare(String(bValue), 'vi');
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    
    const startIndex = (currentPage - 1) * currentPageSize;
    return sortedData.slice(startIndex, startIndex + currentPageSize);
  }, [sortedData, currentPage, currentPageSize, paginated]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / currentPageSize);
  const startRecord = (currentPage - 1) * currentPageSize + 1;
  const endRecord = Math.min(currentPage * currentPageSize, sortedData.length);

  // Handlers
  const handleSort = useCallback((key) => {
    if (!sortable) return;
    
    setSortConfig(prev => {
      const newDirection = 
        prev.key === key && prev.direction === 'asc' ? 'desc' :
        prev.key === key && prev.direction === 'desc' ? null : 'asc';
      
      const newConfig = { key: newDirection ? key : null, direction: newDirection };
      onSort?.(newConfig);
      return newConfig;
    });
  }, [sortable, onSort]);

  const handleSelectRow = useCallback((rowId, checked) => {
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (checked) {
        newSelection.add(rowId);
      } else {
        newSelection.delete(rowId);
      }
      onSelectionChange?.(Array.from(newSelection));
      return newSelection;
    });
  }, [onSelectionChange]);

  const handleSelectAll = useCallback((checked) => {
    const newSelection = checked ? new Set(paginatedData.map(row => row.id)) : new Set();
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  }, [paginatedData, onSelectionChange]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setSelectedRows(new Set()); // Clear selection when changing page
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
    setSelectedRows(new Set());
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
    onFilter?.({ ...activeFilters, [key]: value });
  }, [activeFilters, onFilter]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  // Get cell content
  const getCellContent = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    
    const value = row[column.key];
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('vi-VN');
    }
    
    if (column.type === 'currency' && value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    }
    
    if (column.type === 'number' && value) {
      return new Intl.NumberFormat('vi-VN').format(value);
    }
    
    return value;
  };

  // Render pagination
  const renderPagination = () => {
    if (!paginated || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="data-table-pagination">
        <div className="data-table-pagination-info">
          Hiển thị {startRecord}-{endRecord} trong tổng số {sortedData.length} bản ghi
        </div>
        
        <div className="data-table-pagination-controls">
          <button
            className="data-table-pagination-btn"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            ⏮️
          </button>
          
          <button
            className="data-table-pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⏪
          </button>

          {pages.map(page => (
            <button
              key={page}
              className={`data-table-pagination-btn ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="data-table-pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ⏩
          </button>
          
          <button
            className="data-table-pagination-btn"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            ⏭️
          </button>
        </div>

        {showPageSizeSelector && (
          <div className="data-table-page-size">
            <span>Hiển thị</span>
            <select
              value={currentPageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>bản ghi</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`data-table-container ${className}`} style={{ height }}>
      {/* Selection Bar */}
      {selectable && selectedRows.size > 0 && (
        <div className="data-table-selection-bar show">
          <div className="data-table-selection-info">
            Đã chọn {selectedRows.size} bản ghi
          </div>
          <div className="data-table-selection-actions">
            {bulkActions.map((action, index) => (
              <button
                key={index}
                className="data-table-selection-btn"
                onClick={() => action.onClick(Array.from(selectedRows))}
              >
                {action.icon} {action.label}
              </button>
            ))}
            <button
              className="data-table-selection-btn"
              onClick={clearSelection}
            >
              ✕ Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      {(title || subtitle) && (
        <div className="data-table-header">
          {title && (
            <h3 className="data-table-title">
              {title}
              {loading && <span>🔄</span>}
            </h3>
          )}
          {subtitle && <p className="data-table-subtitle">{subtitle}</p>}
        </div>
      )}

      {/* Controls */}
      <div className="data-table-controls">
        {/* Search */}
        {searchable && (
          <div className="data-table-search">
            <span className="data-table-search-icon">🔍</span>
            <input
              type="text"
              className="data-table-search-input"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="data-table-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`data-table-action-btn ${action.variant || ''}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      {filterable && filters.length > 0 && (
        <div className="data-table-filters">
          {filters.map((filter) => (
            <div key={filter.key} className="data-table-filter">
              <label className="data-table-filter-label">{filter.label}</label>
              {filter.type === 'select' ? (
                <select
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type || 'text'}
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  placeholder={filter.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="data-table-wrapper">
        <table className={`data-table ${tableClassName}`}>
          <thead className={stickyHeader ? 'sticky' : ''}>
            <tr>
              {selectable && (
                <th className="data-table-cell-checkbox">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.sortable !== false && sortable ? 'sortable' : ''} ${
                    sortConfig.key === column.key ? sortConfig.direction : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
              
              {rowActions.length > 0 && (
                <th className="data-table-cell-actions">Thao tác</th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                className={selectedRows.has(row.id) ? 'selected' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="data-table-cell-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`data-table-cell-${column.type || 'text'}`}
                  >
                    {getCellContent(row, column)}
                  </td>
                ))}
                
                {rowActions.length > 0 && (
                  <td className="data-table-cell-actions">
                    <div className="data-table-row-actions">
                      {rowActions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className={`data-table-action-icon ${action.type || ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          title={action.title}
                          disabled={action.disabled?.(row)}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {!loading && paginatedData.length === 0 && (
          <div className="data-table-empty">
            <div className="data-table-empty-icon">{emptyIcon}</div>
            <h4 className="data-table-empty-title">{emptyMessage}</h4>
            <p className="data-table-empty-description">{emptyDescription}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Loading Overlay */}
      {loading && (
        <div className="data-table-loading">
          <div className="data-table-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default DataTable;