// src/pages/QuanLyKho/QuanLyViTri.js - Quản lý vị trí

import React, { useState, useMemo } from 'react';
import './QuanLyViTri.css';

const QuanLyViTri = ({ locations = [], onUpdateLocation }) => {
  const [filters, setFilters] = useState({
    search: '',
    zone: 'all',
    status: 'all',
    type: 'all'
  });

  const [viewMode, setViewMode] = useState('grid'); // grid, table, map
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'code',
    direction: 'asc'
  });

  // Lọc và sắp xếp vị trí
  const filteredAndSortedLocations = useMemo(() => {
    let filtered = locations.filter(location => {
      const matchesSearch = 
        location.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        location.zone.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesZone = filters.zone === 'all' || location.zone === filters.zone;
      const matchesStatus = filters.status === 'all' || location.status === filters.status;
      const matchesType = filters.type === 'all' || location.type === filters.type;

      return matchesSearch && matchesZone && matchesStatus && matchesType;
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
  }, [locations, filters, sortConfig]);

  // Tính toán thống kê
  const stats = useMemo(() => {
    const total = locations.length;
    const occupied = locations.filter(l => l.status === 'occupied').length;
    const available = locations.filter(l => l.status === 'available').length;
    const maintenance = locations.filter(l => l.status === 'maintenance').length;
    const utilizationRate = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;

    return { total, occupied, available, maintenance, utilizationRate };
  }, [locations]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleLocationSelect = (locationId) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLocations.length === filteredAndSortedLocations.length) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations(filteredAndSortedLocations.map(location => location.id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'var(--error-600, #dc2626)';
      case 'available': return 'var(--success-600, #059669)';
      case 'maintenance': return 'var(--warning-600, #d97706)';
      case 'reserved': return 'var(--info-600, #2563eb)';
      default: return 'var(--gray-600, #4b5563)';
    }
  };

  const getCapacityColor = (currentLoad, capacity) => {
    const percentage = (currentLoad / capacity) * 100;
    if (percentage >= 90) return 'var(--error-600, #dc2626)';
    if (percentage >= 70) return 'var(--warning-600, #d97706)';
    return 'var(--success-600, #059669)';
  };

  const renderLocationCard = (location) => (
    <div 
      key={location.id} 
      className={`location-card ${selectedLocations.includes(location.id) ? 'selected' : ''}`}
    >
      <div className="card-header">
        <div className="location-checkbox">
          <input
            type="checkbox"
            checked={selectedLocations.includes(location.id)}
            onChange={() => handleLocationSelect(location.id)}
          />
        </div>
        <div className="location-code">{location.code}</div>
        <div 
          className="location-status"
          style={{ backgroundColor: getStatusColor(location.status) }}
        ></div>
      </div>
      
      <div className="card-content">
        <div className="location-info">
          <div className="info-row">
            <span className="info-label">Khu vực:</span>
            <span className="info-value">Zone {location.zone}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Lối đi:</span>
            <span className="info-value">Aisle {location.aisle}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Kệ:</span>
            <span className="info-value">Rack {location.rack}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Tầng:</span>
            <span className="info-value">Level {location.level}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Loại:</span>
            <span className="info-value">
              {location.type === 'standard' ? 'Tiêu chuẩn' :
               location.type === 'heavy' ? 'Hàng nặng' :
               location.type === 'cold' ? 'Lạnh' : 'Đặc biệt'}
            </span>
          </div>
        </div>
        
        <div className="capacity-info">
          <div className="capacity-header">
            <span>Sức chứa</span>
            <span>{location.currentLoad}/{location.capacity}</span>
          </div>
          <div className="capacity-bar">
            <div 
              className="capacity-fill"
              style={{ 
                width: `${(location.currentLoad / location.capacity) * 100}%`,
                backgroundColor: getCapacityColor(location.currentLoad, location.capacity)
              }}
            ></div>
          </div>
          <div className="capacity-percentage">
            {Math.round((location.currentLoad / location.capacity) * 100)}% sử dụng
          </div>
        </div>
        
        <div className="maintenance-info">
          <span className={`maintenance-status ${location.maintenanceStatus}`}>
            {location.maintenanceStatus === 'good' ? '✅ Tốt' :
             location.maintenanceStatus === 'requires_attention' ? '⚠️ Cần chú ý' : '🔧 Cần bảo trì'}
          </span>
        </div>
      </div>
      
      <div className="card-actions">
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => setEditingLocation(location)}
        >
          ✏️ Sửa
        </button>
        <button className="btn btn-outline btn-sm">
          📊 Chi tiết
        </button>
      </div>
    </div>
  );

  const renderWarehouseMap = () => (
    <div className="warehouse-map">
      {/* Render warehouse map content */}
    </div>
  );

  return (
    <div className="quan-ly-vi-tri-container">
      {/* Header Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Tổng vị trí</div>
          </div>
        </div>
        <div className="stat-card occupied">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">{stats.occupied}</div>
            <div className="stat-label">Đang sử dụng</div>
          </div>
        </div>
        <div className="stat-card available">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.available}</div>
            <div className="stat-label">Có sẵn</div>
          </div>
        </div>
        <div className="stat-card maintenance">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <div className="stat-number">{stats.maintenance}</div>
            <div className="stat-label">Bảo trì</div>
          </div>
        </div>
        <div className="stat-card utilization">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.utilizationRate}%</div>
            <div className="stat-label">Tỷ lệ sử dụng</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="controls-header">
          <h2>Quản lý vị trí ({filteredAndSortedLocations.length})</h2>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <span className="btn-icon">➕</span>
              Thêm vị trí
            </button>
          </div>
        </div>
        
        <div className="filters-row">
          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo mã vị trí, khu vực..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="search-input"
            />
            <span className="search-icon"></span>
          </div>

          {/* Filters */}
          <div className="filters-group">
            <select
              value={filters.zone}
              onChange={(e) => setFilters(prev => ({ ...prev, zone: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả khu vực</option>
              {/* Add zone options here */}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Có sẵn</option>
              <option value="occupied">Đang sử dụng</option>
              <option value="maintenance">Bảo trì</option>
              <option value="reserved">Đã đặt</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="filter-select"
            >
              <option value="all">Tất cả loại</option>
              <option value="standard">Tiêu chuẩn</option>
              <option value="heavy">Hàng nặng</option>
              <option value="cold">Lạnh</option>
              <option value="special">Đặc biệt</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="view-controls">
            <div className="view-mode-group">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Dạng lưới"
              >
                ⚏
              </button>
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Dạng bảng"
              >
                📋
              </button>
              <button
                className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
                title="Bản đồ kho"
              >
                🗺️
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedLocations.length > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              <span>Đã chọn {selectedLocations.length} vị trí</span>
            </div>
            <div className="bulk-buttons">
              <button className="btn btn-outline">
                <span className="btn-icon">🔧</span>
                Lên lịch bảo trì
              </button>
              <button className="btn btn-outline">
                <span className="btn-icon">📊</span>
                Xuất báo cáo
              </button>
              <button className="btn btn-warning">
                <span className="btn-icon">⚠️</span>
                Đánh dấu bảo trì
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedLocations([])}
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="content-section">
        {viewMode === 'grid' && (
          <div className="locations-grid">
            {filteredAndSortedLocations.map(location => renderLocationCard(location))}
            
            {filteredAndSortedLocations.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📍</div>
                <h3>Không tìm thấy vị trí</h3>
                <p>Thử thay đổi bộ lọc hoặc thêm vị trí mới</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="table-container">
            <table className="locations-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedLocations.length === filteredAndSortedLocations.length && filteredAndSortedLocations.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort('code')}
                  >
                    Mã vị trí
                    {sortConfig.key === 'code' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th>Khu vực</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>Sức chứa</th>
                  <th>Sử dụng</th>
                  <th>Tỷ lệ (%)</th>
                  <th>Bảo trì</th>
                  <th>Cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedLocations.map(location => (
                  <tr 
                    key={location.id}
                    className={selectedLocations.includes(location.id) ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location.id)}
                        onChange={() => handleLocationSelect(location.id)}
                      />
                    </td>
                    <td className="location-code">{location.code}</td>
                    <td>Zone {location.zone}</td>
                    <td>
                      {location.type === 'standard' ? 'Tiêu chuẩn' :
                       location.type === 'heavy' ? 'Hàng nặng' :
                       location.type === 'cold' ? 'Lạnh' : 'Đặc biệt'}
                    </td>
                    <td>
                      <span 
                        className={`status-badge status-${location.status}`}
                        style={{ backgroundColor: getStatusColor(location.status) }}
                      >
                        {location.status === 'available' ? 'Có sẵn' :
                         location.status === 'occupied' ? 'Đang dùng' :
                         location.status === 'maintenance' ? 'Bảo trì' : 'Đã đặt'}
                      </span>
                    </td>
                    <td>{location.capacity}</td>
                    <td>{location.currentLoad}</td>
                    <td>
                      <span 
                        style={{ 
                          color: getCapacityColor(location.currentLoad, location.capacity)
                        }}
                      >
                        {Math.round((location.currentLoad / location.capacity) * 100)}%
                      </span>
                    </td>
                    <td>
                      <span className={`maintenance-status ${location.maintenanceStatus}`}>
                        {location.maintenanceStatus === 'good' ? 'Tốt' :
                         location.maintenanceStatus === 'requires_attention' ? 'Cần chú ý' : 'Cần bảo trì'}
                      </span>
                    </td>
                    <td>{new Date(location.lastUpdated).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditingLocation(location)}
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
          </div>
        )}

        {viewMode === 'map' && renderWarehouseMap()}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingLocation) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingLocation ? 'Chỉnh sửa vị trí' : 'Thêm vị trí mới'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingLocation(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <form className="location-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Khu vực *</label>
                    <select defaultValue={editingLocation?.zone || ''}>
                      <option value="">Chọn khu vực</option>
                      {/* Add zone options here */}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Lối đi *</label>
                    <select defaultValue={editingLocation?.aisle || ''}>
                      <option value="">Chọn lối đi</option>
                      {/* Add aisle options here */}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Kệ hàng *</label>
                    <input
                      type="text"
                      defaultValue={editingLocation?.rack || ''}
                      placeholder="VD: 01, 02, 03..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tầng *</label>
                    <select defaultValue={editingLocation?.level || 1}>
                      {/* Add level options here */}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Loại vị trí</label>
                    <select defaultValue={editingLocation?.type || 'standard'}>
                      <option value="standard">Tiêu chuẩn</option>
                      <option value="heavy">Hàng nặng</option>
                      <option value="cold">Lạnh</option>
                      <option value="special">Đặc biệt</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Sức chứa tối đa</label>
                    <input
                      type="number"
                      defaultValue={editingLocation?.capacity || 100}
                      min="1"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tải trọng hiện tại</label>
                    <input
                      type="number"
                      defaultValue={editingLocation?.currentLoad || 0}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select defaultValue={editingLocation?.status || 'available'}>
                      <option value="available">Có sẵn</option>
                      <option value="occupied">Đang sử dụng</option>
                      <option value="maintenance">Bảo trì</option>
                      <option value="reserved">Đã đặt</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Tình trạng bảo trì</label>
                    <select defaultValue={editingLocation?.maintenanceStatus || 'good'}>
                      <option value="good">Tốt</option>
                      <option value="requires_attention">Cần chú ý</option>
                      <option value="needs_maintenance">Cần bảo trì</option>
                    </select>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Ghi chú</label>
                    <textarea
                      rows="3"
                      defaultValue={editingLocation?.notes || ''}
                      placeholder="Ghi chú về vị trí, thiết bị, đặc điểm..."
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
                  setEditingLocation(null);
                }}
              >
                Hủy
              </button>
              <button className="btn btn-primary">
                {editingLocation ? 'Cập nhật' : 'Thêm vị trí'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyViTri;