// src/pages/QuanLyKho/QuanLyHangHoa.js - Quản lý hàng hóa

import React, { useState, useMemo } from 'react';
import './QuanLyHangHoa.css';

const QuanLyHangHoa = ({ products = [], locations = [], onUpdateProduct }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    supplier: 'all'
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table, grid, compact

  // Lọc và sắp xếp sản phẩm
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.supplier.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesStatus = filters.status === 'all' || product.status === filters.status;
      const matchesSupplier = filters.supplier === 'all' || product.supplier === filters.supplier;

      return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
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
  }, [products, filters, sortConfig]);

  // Lấy danh sách unique values cho filters
  const categories = [...new Set(products.map(p => p.category))];
  const suppliers = [...new Set(products.map(p => p.supplier))];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredAndSortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredAndSortedProducts.map(product => product.id));
    }
  };

  const getStockStatus = (product) => {
    if (product.currentStock <= product.minStock) {
      return 'low';
    } else if (product.currentStock >= product.maxStock * 0.8) {
      return 'high';
    }
    return 'normal';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low': return 'var(--error-600, #dc2626)';
      case 'high': return 'var(--warning-600, #d97706)';
      default: return 'var(--success-600, #059669)';
    }
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'critical';
    if (diffDays <= 30) return 'warning';
    return 'normal';
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="product-card">
      <div className="card-header">
        <div className="product-checkbox">
          <input
            type="checkbox"
            checked={selectedProducts.includes(product.id)}
            onChange={() => handleProductSelect(product.id)}
          />
        </div>
        <div className="product-sku">{product.sku}</div>
        <div className="product-actions">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setEditingProduct(product)}
          >
            ✏️
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className="product-supplier">{product.supplier}</span>
        </div>
        
        <div className="stock-info">
          <div className="stock-item">
            <span className="stock-label">Tồn kho:</span>
            <span 
              className="stock-value"
              style={{ color: getStockStatusColor(getStockStatus(product)) }}
            >
              {product.currentStock} {product.unit}
            </span>
          </div>
          <div className="stock-item">
            <span className="stock-label">Có thể dùng:</span>
            <span className="stock-value">{product.availableStock} {product.unit}</span>
          </div>
          <div className="stock-item">
            <span className="stock-label">Đã đặt:</span>
            <span className="stock-value reserved">{product.reservedStock} {product.unit}</span>
          </div>
        </div>
        
        <div className="expiry-info">
          <span className="expiry-label">Hạn sử dụng:</span>
          <span 
            className={`expiry-date ${getExpiryStatus(product.expiryDate)}`}
          >
            {new Date(product.expiryDate).toLocaleDateString('vi-VN')}
          </span>
        </div>
        
        <div className="stock-range">
          <div className="range-bar">
            <div 
              className="range-fill"
              style={{ 
                width: `${(product.currentStock / product.maxStock) * 100}%`,
                backgroundColor: getStockStatusColor(getStockStatus(product))
              }}
            ></div>
          </div>
          <div className="range-labels">
            <span>Min: {product.minStock}</span>
            <span>Max: {product.maxStock}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="quan-ly-hang-hoa-container">
      {/* Controls */}
      <div className="controls-section">
        <div className="controls-header">
          <h2>Quản lý hàng hóa ({filteredAndSortedProducts.length})</h2>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <span className="btn-icon">➕</span>
              Thêm sản phẩm
            </button>
          </div>
        </div>
        
        <div className="filters-row">
          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo tên, SKU, nhà cung cấp..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="search-input"
            />
            <span className="search-icon"></span>
          </div>

          {/* Filters */}
          <div className="filters-group">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="in_stock">Còn hàng</option>
              <option value="low_stock">Sắp hết</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>

            <select
              value={filters.supplier}
              onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả nhà cung cấp</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
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
        {selectedProducts.length > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              <span>Đã chọn {selectedProducts.length} sản phẩm</span>
            </div>
            <div className="bulk-buttons">
              <button className="btn btn-outline">
                <span className="btn-icon">📤</span>
                Xuất Excel
              </button>
              <button className="btn btn-outline">
                <span className="btn-icon">🏷️</span>
                In nhãn
              </button>
              <button className="btn btn-warning">
                <span className="btn-icon">📊</span>
                Cập nhật tồn kho
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedProducts([])}
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="content-section">
        {viewMode === 'table' && (
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort('sku')}
                  >
                    SKU
                    {sortConfig.key === 'sku' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort('name')}
                  >
                    Tên sản phẩm
                    {sortConfig.key === 'name' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th>Danh mục</th>
                  <th>Tồn kho</th>
                  <th>Có thể dùng</th>
                  <th>Đã đặt</th>
                  <th>Min-Max</th>
                  <th>Hạn sử dụng</th>
                  <th>Nhà cung cấp</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProducts.map(product => (
                  <tr 
                    key={product.id}
                    className={selectedProducts.includes(product.id) ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                      />
                    </td>
                    <td className="product-sku">{product.sku}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <span 
                        className="stock-value"
                        style={{ color: getStockStatusColor(getStockStatus(product)) }}
                      >
                        {product.currentStock} {product.unit}
                      </span>
                    </td>
                    <td>{product.availableStock} {product.unit}</td>
                    <td className="reserved-stock">{product.reservedStock} {product.unit}</td>
                    <td className="min-max-range">
                      {product.minStock} - {product.maxStock}
                    </td>
                    <td>
                      <span 
                        className={`expiry-date ${getExpiryStatus(product.expiryDate)}`}
                      >
                        {new Date(product.expiryDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td>{product.supplier}</td>
                    <td>
                      <span className={`status-badge status-${product.status}`}>
                        {product.status === 'in_stock' ? 'Còn hàng' :
                         product.status === 'low_stock' ? 'Sắp hết' : 'Hết hàng'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditingProduct(product)}
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-outline btn-sm"
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn btn-outline btn-sm"
                          title="Lịch sử"
                        >
                          📊
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAndSortedProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Thêm sản phẩm đầu tiên
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="products-grid">
            {filteredAndSortedProducts.map(product => renderProductCard(product))}
            
            {filteredAndSortedProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Thêm sản phẩm đầu tiên
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'compact' && (
          <div className="products-compact">
            {filteredAndSortedProducts.map(product => (
              <div key={product.id} className="compact-item">
                <div className="compact-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductSelect(product.id)}
                  />
                </div>
                <div className="compact-info">
                  <div className="compact-main">
                    <span className="compact-sku">{product.sku}</span>
                    <span className="compact-name">{product.name}</span>
                  </div>
                  <div className="compact-meta">
                    <span className="compact-category">{product.category}</span>
                    <span 
                      className="compact-stock"
                      style={{ color: getStockStatusColor(getStockStatus(product)) }}
                    >
                      {product.currentStock} {product.unit}
                    </span>
                    <span 
                      className={`compact-expiry ${getExpiryStatus(product.expiryDate)}`}
                    >
                      {new Date(product.expiryDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="compact-actions">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingProduct) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <form className="product-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>SKU *</label>
                    <input
                      type="text"
                      defaultValue={editingProduct?.sku || ''}
                      placeholder="Nhập mã SKU"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tên sản phẩm *</label>
                    <input
                      type="text"
                      defaultValue={editingProduct?.name || ''}
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Danh mục</label>
                    <select defaultValue={editingProduct?.category || ''}>
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="new">+ Thêm danh mục mới</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Đơn vị</label>
                    <input
                      type="text"
                      defaultValue={editingProduct?.unit || 'Thùng'}
                      placeholder="VD: Thùng, Cái, Kg"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tồn kho hiện tại</label>
                    <input
                      type="number"
                      defaultValue={editingProduct?.currentStock || 0}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Đã đặt trước</label>
                    <input
                      type="number"
                      defaultValue={editingProduct?.reservedStock || 0}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tồn kho tối thiểu</label>
                    <input
                      type="number"
                      defaultValue={editingProduct?.minStock || 0}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tồn kho tối đa</label>
                    <input
                      type="number"
                      defaultValue={editingProduct?.maxStock || 100}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Hạn sử dụng</label>
                    <input
                      type="date"
                      defaultValue={editingProduct?.expiryDate || ''}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nhà cung cấp</label>
                    <select defaultValue={editingProduct?.supplier || ''}>
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers.map(supplier => (
                        <option key={supplier} value={supplier}>{supplier}</option>
                      ))}
                      <option value="new">+ Thêm nhà cung cấp mới</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Giá nhập</label>
                    <input
                      type="number"
                      defaultValue={editingProduct?.cost || 0}
                      min="0"
                      step="1000"
                      placeholder="VND"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Mô tả</label>
                    <textarea
                      rows="3"
                      defaultValue={editingProduct?.description || ''}
                      placeholder="Mô tả chi tiết sản phẩm"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
              >
                Hủy
              </button>
              <button className="btn btn-primary">
                {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyHangHoa;