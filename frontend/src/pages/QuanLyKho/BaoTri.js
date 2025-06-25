// src/pages/QuanLyKho/BaoTri.js - Quản lý bảo trì

import React, { useState, useMemo } from 'react';
import './BaoTri.css';

const BaoTri = ({ maintenance = [], locations = [], onUpdateMaintenance }) => {
  const [activeTab, setActiveTab] = useState('pending'); // pending, in_progress, completed, scheduled
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    type: 'all',
    assignee: 'all'
  });

  const tabs = [
    {
      key: 'pending',
      label: '⏳ Chờ xử lý',
      count: maintenance.filter(m => m.status === 'pending').length
    },
    {
      key: 'in_progress',
      label: '🔄 Đang thực hiện',
      count: maintenance.filter(m => m.status === 'in_progress').length
    },
    {
      key: 'completed',
      label: '✅ Hoàn thành',
      count: maintenance.filter(m => m.status === 'completed').length
    },
    {
      key: 'scheduled',
      label: '📅 Đã lên lịch',
      count: maintenance.filter(m => m.status === 'scheduled').length
    }
  ];

  // Lọc maintenance theo tab và filters
  const filteredMaintenance = useMemo(() => {
    let filtered = maintenance.filter(item => {
      // Filter by tab
      let matchesTab = false;
      switch (activeTab) {
        case 'pending':
          matchesTab = item.status === 'pending';
          break;
        case 'in_progress':
          matchesTab = item.status === 'in_progress';
          break;
        case 'completed':
          matchesTab = item.status === 'completed';
          break;
        case 'scheduled':
          matchesTab = item.status === 'scheduled';
          break;
        default:
          matchesTab = true;
      }

      // Apply other filters
      const matchesSearch = 
        item.locationCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.assignedTo.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesAssignee = filters.assignee === 'all' || item.assignedTo === filters.assignee;

      return matchesTab && matchesSearch && matchesPriority && matchesType && matchesAssignee;
    });

    return filtered;
  }, [maintenance, activeTab, filters]);

  // Lấy danh sách assignees và types
  const assignees = [...new Set(maintenance.map(m => m.assignedTo))];
  const types = [...new Set(maintenance.map(m => m.type))];

  const handleStartMaintenance = (maintenanceId) => {
    onUpdateMaintenance(maintenanceId, {
      status: 'in_progress',
      startedDate: new Date().toISOString()
    });
  };

  const handleCompleteMaintenance = (maintenanceId) => {
    onUpdateMaintenance(maintenanceId, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      actualDuration: Math.floor(Math.random() * 60) + 30 // Mock duration
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error-600, #dc2626)';
      case 'medium': return 'var(--warning-600, #d97706)';
      case 'low': return 'var(--success-600, #059669)';
      default: return 'var(--gray-600, #4b5563)';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'preventive': return '🛡️';
      case 'corrective': return '🔧';
      case 'emergency': return '🚨';
      case 'inspection': return '🔍';
      default: return '⚙️';
    }
  };

  const renderMaintenanceCard = (item) => (
    <div key={item.id} className="maintenance-card">
      <div className="card-header">
        <div className="maintenance-type">
          <span className="type-icon">{getTypeIcon(item.type)}</span>
          <span className="type-label">
            {item.type === 'preventive' ? 'Bảo trì định kỳ' :
             item.type === 'corrective' ? 'Sửa chữa' :
             item.type === 'emergency' ? 'Khẩn cấp' : 'Kiểm tra'}
          </span>
        </div>
        <div 
          className="maintenance-priority"
          style={{ color: getPriorityColor(item.priority) }}
        >
          {item.priority === 'high' ? 'Cao' :
           item.priority === 'medium' ? 'Trung bình' : 'Thấp'}
        </div>
      </div>
      
      <div className="card-content">
        <div className="location-info">
          <h3 className="location-code">{item.locationCode}</h3>
          <p className="maintenance-description">{item.description}</p>
        </div>
        
        <div className="maintenance-details">
          <div className="detail-row">
            <span className="detail-label">Người thực hiện:</span>
            <span className="detail-value">{item.assignedTo}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ngày lên lịch:</span>
            <span className="detail-value">
              {new Date(item.scheduledDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Thời gian dự kiến:</span>
            <span className="detail-value">{item.estimatedDuration} phút</span>
          </div>
          {item.completedDate && (
            <div className="detail-row">
              <span className="detail-label">Hoàn thành:</span>
              <span className="detail-value">
                {new Date(item.completedDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}
          {item.actualDuration && (
            <div className="detail-row">
              <span className="detail-label">Thời gian thực tế:</span>
              <span className="detail-value">{item.actualDuration} phút</span>
            </div>
          )}
        </div>
        
        <div className="equipment-list">
          <span className="equipment-label">Thiết bị:</span>
          <div className="equipment-tags">
            {item.equipment.map((eq, index) => (
              <span key={index} className="equipment-tag">{eq}</span>
            ))}
          </div>
        </div>
        
        {item.notes && (
          <div className="maintenance-notes">
            <span className="notes-label">Ghi chú:</span>
            <p className="notes-text">{item.notes}</p>
          </div>
        )}
      </div>
      
      <div className="card-actions">
        {item.status === 'pending' && (
          <>
            <button 
              className="btn btn-primary"
              onClick={() => handleStartMaintenance(item.id)}
            >
              <span className="btn-icon">▶️</span>
              Bắt đầu
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">📅</span>
              Lên lịch lại
            </button>
          </>
        )}
        
        {item.status === 'in_progress' && (
          <>
            <button 
              className="btn btn-success"
              onClick={() => handleCompleteMaintenance(item.id)}
            >
              <span className="btn-icon">✅</span>
              Hoàn thành
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">⏸️</span>
              Tạm dừng
            </button>
          </>
        )}
        
        {item.status === 'completed' && (
          <>
            <button className="btn btn-outline">
              <span className="btn-icon">👁️</span>
              Xem báo cáo
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">🔄</span>
              Lên lịch tiếp theo
            </button>
          </>
        )}
        
        <button 
          className="btn btn-outline"
          onClick={() => setSelectedMaintenance(item)}
        >
          <span className="btn-icon">📋</span>
          Chi tiết
        </button>
      </div>
    </div>
  );

  const renderCreateMaintenanceForm = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Tạo yêu cầu bảo trì mới</h3>
          <button 
            className="modal-close"
            onClick={() => setShowCreateModal(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <form className="maintenance-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Vị trí *</label>
                <select>
                  <option value="">Chọn vị trí</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.code}>
                      {location.code}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Loại bảo trì *</label>
                <select>
                  <option value="preventive">Bảo trì định kỳ</option>
                  <option value="corrective">Sửa chữa</option>
                  <option value="emergency">Khẩn cấp</option>
                  <option value="inspection">Kiểm tra</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Độ ưu tiên *</label>
                <select>
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Người thực hiện *</label>
                <select>
                  <option value="">Chọn người thực hiện</option>
                  {assignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Ngày thực hiện *</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label>Thời gian dự kiến (phút)</label>
                <input
                  type="number"
                  defaultValue="60"
                  min="15"
                  step="15"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Mô tả công việc *</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả chi tiết công việc bảo trì cần thực hiện"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Thiết bị liên quan</label>
                <input
                  type="text"
                  placeholder="VD: Kệ hàng, Hệ thống nâng, Đèn LED (ngăn cách bằng dấu phẩy)"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Ghi chú</label>
                <textarea
                  rows="2"
                  placeholder="Ghi chú bổ sung, yêu cầu đặc biệt..."
                />
              </div>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-outline"
            onClick={() => setShowCreateModal(false)}
          >
            Hủy
          </button>
          <button className="btn btn-primary">
            <span className="btn-icon">✅</span>
            Tạo yêu cầu
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bao-tri-container">
      {/* Header */}
      <div className="bao-tri-header">
        <div className="header-content">
          <h2>Quản lý bảo trì</h2>
          <p>Theo dõi và quản lý các hoạt động bảo trì thiết bị và cơ sở hạ tầng</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="btn-icon">➕</span>
            Tạo yêu cầu bảo trì
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bao-tri-nav">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm theo vị trí, mô tả, người thực hiện..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters-group">
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="filter-select"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="filter-select"
          >
            <option value="all">Tất cả loại</option>
            <option value="preventive">Bảo trì định kỳ</option>
            <option value="corrective">Sửa chữa</option>
            <option value="emergency">Khẩn cấp</option>
            <option value="inspection">Kiểm tra</option>
          </select>

          <select
            value={filters.assignee}
            onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
            className="filter-select"
          >
            <option value="all">Tất cả người thực hiện</option>
            {assignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        <div className="maintenance-grid">
          {filteredMaintenance.map(item => renderMaintenanceCard(item))}
          
          {filteredMaintenance.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔧</div>
              <h3>
                {activeTab === 'pending' && 'Không có yêu cầu bảo trì nào chờ xử lý'}
                {activeTab === 'in_progress' && 'Không có công việc bảo trì nào đang thực hiện'}
                {activeTab === 'completed' && 'Chưa có công việc bảo trì nào hoàn thành'}
                {activeTab === 'scheduled' && 'Không có công việc bảo trì nào được lên lịch'}
              </h3>
              <p>
                {activeTab === 'pending' && 'Tạo yêu cầu bảo trì mới hoặc kiểm tra bộ lọc'}
                {activeTab === 'in_progress' && 'Bắt đầu thực hiện các yêu cầu đã có'}
                {activeTab === 'completed' && 'Hoàn thành các công việc để xem lịch sử'}
                {activeTab === 'scheduled' && 'Lên lịch bảo trì cho các thiết bị'}
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Tạo yêu cầu bảo trì
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && renderCreateMaintenanceForm()}

      {/* Detail Modal */}
      {selectedMaintenance && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Chi tiết bảo trì: {selectedMaintenance.locationCode}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedMaintenance(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="maintenance-detail">
                <div className="detail-section">
                  <h4>Thông tin chung</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Vị trí:</span>
                      <span className="detail-value">{selectedMaintenance.locationCode}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Loại:</span>
                      <span className="detail-value">
                        {getTypeIcon(selectedMaintenance.type)} {selectedMaintenance.type}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Độ ưu tiên:</span>
                      <span 
                        className="detail-value priority"
                        style={{ color: getPriorityColor(selectedMaintenance.priority) }}
                      >
                        {selectedMaintenance.priority}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Trạng thái:</span>
                      <span className="detail-value">{selectedMaintenance.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Thời gian</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Ngày lên lịch:</span>
                      <span className="detail-value">
                        {new Date(selectedMaintenance.scheduledDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Thời gian dự kiến:</span>
                      <span className="detail-value">{selectedMaintenance.estimatedDuration} phút</span>
                    </div>
                    {selectedMaintenance.completedDate && (
                      <>
                        <div className="detail-item">
                          <span className="detail-label">Ngày hoàn thành:</span>
                          <span className="detail-value">
                            {new Date(selectedMaintenance.completedDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Thời gian thực tế:</span>
                          <span className="detail-value">{selectedMaintenance.actualDuration} phút</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Mô tả công việc</h4>
                  <p className="description">{selectedMaintenance.description}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Thiết bị liên quan</h4>
                  <div className="equipment-list">
                    {selectedMaintenance.equipment.map((eq, index) => (
                      <span key={index} className="equipment-tag">{eq}</span>
                    ))}
                  </div>
                </div>
                
                {selectedMaintenance.notes && (
                  <div className="detail-section">
                    <h4>Ghi chú</h4>
                    <p className="notes">{selectedMaintenance.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedMaintenance(null)}
              >
                Đóng
              </button>
              <button className="btn btn-outline">
                <span className="btn-icon">✏️</span>
                Chỉnh sửa
              </button>
              <button className="btn btn-outline">
                <span className="btn-icon">📄</span>
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaoTri;