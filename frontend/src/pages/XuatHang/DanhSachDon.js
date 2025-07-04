// src/pages/XuatHang/DanhSachDon.js - Danh sách đơn xuất hàng

import React, { useState, useEffect, useMemo } from 'react';
import './DanhSachDon.css';

const DanhSachDon = ({ 
  orders = [], 
  onStartExport, 
  onCompleteExport, 
  exportProgress = {} 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    store: 'all'
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'createdDate',
    direction: 'desc'
  });

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // table, grid, compact

  // Lọc và sắp xếp đơn hàng
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = 
        order.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.storeName.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.storeAddress.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || order.status === filters.status;
      const matchesPriority = filters.priority === 'all' || order.priority === filters.priority;
      
      const matchesDateFrom = !filters.dateFrom || order.createdDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || order.createdDate <= filters.dateTo;

      return matchesSearch && matchesStatus && matchesPriority && matchesDateFrom && matchesDateTo;
    });

    // Sắp xếp
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [orders, filters, sortConfig]);

  // Phân trang
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);

  // Xử lý sắp xếp
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Xử lý chọn đơn hàng
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    }
  };

  // Xử lý hành động hàng loạt
  const handleBulkAction = (action) => {
    if (action === 'export' && selectedOrders.length > 0) {
      selectedOrders.forEach(orderId => {
        const order = orders.find(o => o.id === orderId);
        if (order && order.status === 'pending') {
          onStartExport(orderId);
        }
      });
      setSelectedOrders([]);
    }
  };

  // Render trạng thái đơn hàng
  const renderStatus = (status, progress) => {
    const statusConfig = {
      pending: { 
        label: 'Chờ xuất', 
        color: 'warning', 
        icon: '⏳' 
      },
      in_progress: { 
        label: 'Đang xuất', 
        color: 'info', 
        icon: '🔄',
        showProgress: true 
      },
      completed: { 
        label: 'Hoàn thành', 
        color: 'success', 
        icon: '✅' 
      },
      cancelled: { 
        label: 'Đã hủy', 
        color: 'error', 
        icon: '❌' 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div className={`status-badge status-${config.color}`}>
        <span className="status-icon">{config.icon}</span>
        <span className="status-label">{config.label}</span>
        {config.showProgress && progress !== undefined && (
          <div className="status-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}
      </div>
    );
  };

  // Render độ ưu tiên
  const renderPriority = (priority) => {
    const priorityConfig = {
      high: { label: 'Cao', color: 'error', icon: '🔥' },
      medium: { label: 'Trung bình', color: 'warning', icon: '📋' },
      low: { label: 'Thấp', color: 'success', icon: '📝' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <div className={`priority-badge priority-${config.color}`}>
        <span className="priority-icon">{config.icon}</span>
        <span className="priority-label">{config.label}</span>
      </div>
    );
  };

  // Render hành động
  const renderActions = (order) => {
    const progress = exportProgress[order.id];
    
    return (
      <div className="order-actions">
        {order.status === 'pending' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onStartExport(order.id)}
            disabled={progress && progress.status === 'starting'}
          >
            {progress && progress.status === 'starting' ? (
              <>
                <span className="btn-icon">🔄</span>
                Đang bắt đầu...
              </>
            ) : (
              <>
                <span className="btn-icon">🚚</span>
                Bắt đầu xuất
              </>
            )}
          </button>
        )}
        
        {order.status === 'in_progress' && (
          <button
            className="btn btn-success btn-sm"
            onClick={() => onCompleteExport(order.id)}
          >
            <span className="btn-icon">✅</span>
            Hoàn thành
          </button>
        )}
        
        <button className="btn btn-outline btn-sm">
          <span className="btn-icon">👁️</span>
          Chi tiết
        </button>
        
        <button className="btn btn-outline btn-sm">
          <span className="btn-icon">🖨️</span>
          In QR
        </button>
      </div>
    );
  };

  return (
    <div className="danh-sach-don-container">
      {/* Filters và Controls */}
      <div className="controls-section">
        <div className="filters-row">
          {/* Tìm kiếm */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên cửa hàng..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="search-input"
            />
            <span className="search-icon"></span>
          </div>

          {/* Bộ lọc */}
          <div className="filters-group">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xuất</option>
              <option value="in_progress">Đang xuất</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="high">Ưu tiên cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="filter-date"
              placeholder="Từ ngày"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="filter-date"
              placeholder="Đến ngày"
            />
          </div>

          {/* View Mode */}
          <div className="view-controls">
            <div className="view-mode-group">
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Dạng bảng"
              >
                📋
              </button>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Dạng lưới"
              >
                ⚏
              </button>
              <button
                className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => setViewMode('compact')}
                title="Dạng compact"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              <span>Đã chọn {selectedOrders.length} đơn hàng</span>
            </div>
            <div className="bulk-buttons">
              <button
                className="btn btn-primary"
                onClick={() => handleBulkAction('export')}
              >
                <span className="btn-icon">🚚</span>
                Xuất hàng hàng loạt
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setSelectedOrders([])}
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Thống kê nhanh */}
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Tổng số đơn:</span>
          <span className="stat-value">{filteredAndSortedOrders.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Chờ xuất:</span>
          <span className="stat-value pending">
            {filteredAndSortedOrders.filter(o => o.status === 'pending').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Đang xuất:</span>
          <span className="stat-value in-progress">
            {filteredAndSortedOrders.filter(o => o.status === 'in_progress').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Hoàn thành:</span>
          <span className="stat-value completed">
            {filteredAndSortedOrders.filter(o => o.status === 'completed').length}
          </span>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'table' && (
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('code')}
                >
                  Mã đơn
                  {sortConfig.key === 'code' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Cửa hàng</th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('totalItems')}
                >
                  Số SP
                  {sortConfig.key === 'totalItems' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('totalQuantity')}
                >
                  Tổng SL
                  {sortConfig.key === 'totalQuantity' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Độ ưu tiên</th>
                <th>Trạng thái</th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('createdDate')}
                >
                  Ngày tạo
                  {sortConfig.key === 'createdDate' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr 
                  key={order.id}
                  className={selectedOrders.includes(order.id) ? 'selected' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </td>
                  <td className="order-code">
                    <strong>{order.code}</strong>
                  </td>
                  <td>
                    <div className="store-info">
                      <div className="store-name">{order.storeName}</div>
                      <div className="store-address">{order.storeAddress}</div>
                    </div>
                  </td>
                  <td className="text-center">{order.totalItems}</td>
                  <td className="text-center">{order.totalQuantity}</td>
                  <td>{renderPriority(order.priority)}</td>
                  <td>{renderStatus(order.status, order.progress)}</td>
                  <td>{order.createdDate}</td>
                  <td>{renderActions(order)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedOrders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Không tìm thấy đơn hàng</h3>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="grid-container">
          <div className="orders-grid">
            {paginatedOrders.map(order => (
              <div 
                key={order.id} 
                className={`order-card ${selectedOrders.includes(order.id) ? 'selected' : ''}`}
              >
                <div className="card-header">
                  <div className="card-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </div>
                  <div className="card-code">{order.code}</div>
                  <div className="card-priority">
                    {renderPriority(order.priority)}
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="store-section">
                    <h4>{order.storeName}</h4>
                    <p>{order.storeAddress}</p>
                  </div>
                  
                  <div className="stats-section">
                    <div className="stat-row">
                      <span>Số SP:</span>
                      <strong>{order.totalItems}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Tổng SL:</span>
                      <strong>{order.totalQuantity}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Ngày tạo:</span>
                      <span>{order.createdDate}</span>
                    </div>
                  </div>
                  
                  <div className="status-section">
                    {renderStatus(order.status, order.progress)}
                  </div>
                </div>
                
                <div className="card-actions">
                  {renderActions(order)}
                </div>
              </div>
            ))}
          </div>

          {paginatedOrders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Không tìm thấy đơn hàng</h3>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)} 
            trong tổng số {filteredAndSortedOrders.length} đơn hàng
          </div>
          
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              ⏮️
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ⬅️
            </button>
            
            <span className="pagination-pages">
              Trang {currentPage} / {totalPages}
            </span>
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              ➡️
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              ⏭️
            </button>
          </div>
          
          <div className="items-per-page">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 / trang</option>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DanhSachDon;