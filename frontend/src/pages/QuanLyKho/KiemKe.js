// src/pages/QuanLyKho/KiemKe.js - Kiểm kê kho

import React, { useState, useMemo } from 'react';
import './KiemKe.css';

const KiemKe = ({ 
  inspections = [], 
  locations = [], 
  products = [], 
  onUpdateInspection 
}) => {
  const [activeTab, setActiveTab] = useState('ongoing'); // ongoing, scheduled, completed, create
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inspectionProgress, setInspectionProgress] = useState({});

  // Mock kiểm kê chi tiết
  const [inspectionDetails, setInspectionDetails] = useState({
    'I002': {
      items: [
        {
          id: 'ID001',
          locationCode: 'C-01-01',
          productSku: 'SKU001',
          productName: 'Sản phẩm A',
          expectedQuantity: 50,
          countedQuantity: 48,
          variance: -2,
          status: 'counted',
          countedBy: 'Phạm Văn E',
          countedAt: '2025-01-15T09:30:00Z',
          notes: 'Thiếu 2 thùng, kiểm tra lại'
        },
        {
          id: 'ID002',
          locationCode: 'C-01-02',
          productSku: 'SKU002',
          productName: 'Sản phẩm B',
          expectedQuantity: 30,
          countedQuantity: 30,
          variance: 0,
          status: 'counted',
          countedBy: 'Phạm Văn E',
          countedAt: '2025-01-15T10:15:00Z',
          notes: 'Chính xác'
        },
        {
          id: 'ID003',
          locationCode: 'C-01-03',
          productSku: 'SKU003',
          productName: 'Sản phẩm C',
          expectedQuantity: 25,
          countedQuantity: null,
          variance: null,
          status: 'pending',
          countedBy: null,
          countedAt: null,
          notes: ''
        }
      ]
    }
  });

  const tabs = [
    {
      key: 'ongoing',
      label: '🔄 Đang thực hiện',
      count: inspections.filter(i => i.status === 'in_progress').length
    },
    {
      key: 'scheduled',
      label: '📅 Đã lên lịch',
      count: inspections.filter(i => i.status === 'pending').length
    },
    {
      key: 'completed',
      label: '✅ Hoàn thành',
      count: inspections.filter(i => i.status === 'completed').length
    },
    {
      key: 'create',
      label: '➕ Tạo mới',
      count: null
    }
  ];

  // Lọc inspections theo tab
  const filteredInspections = useMemo(() => {
    switch (activeTab) {
      case 'ongoing':
        return inspections.filter(i => i.status === 'in_progress');
      case 'scheduled':
        return inspections.filter(i => i.status === 'pending');
      case 'completed':
        return inspections.filter(i => i.status === 'completed');
      default:
        return inspections;
    }
  }, [inspections, activeTab]);

  const handleStartInspection = (inspectionId) => {
    onUpdateInspection(inspectionId, {
      status: 'in_progress',
      startedDate: new Date().toISOString(),
      progress: 0
    });
  };

  const handleCompleteInspection = (inspectionId) => {
    onUpdateInspection(inspectionId, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      progress: 100
    });
  };

  const updateItemCount = (inspectionId, itemId, countedQuantity, notes = '') => {
    setInspectionDetails(prev => ({
      ...prev,
      [inspectionId]: {
        ...prev[inspectionId],
        items: prev[inspectionId].items.map(item => {
          if (item.id === itemId) {
            const variance = countedQuantity - item.expectedQuantity;
            return {
              ...item,
              countedQuantity,
              variance,
              status: 'counted',
              countedBy: 'Current User',
              countedAt: new Date().toISOString(),
              notes
            };
          }
          return item;
        })
      }
    }));

    // Update progress
    const details = inspectionDetails[inspectionId];
    if (details) {
      const countedItems = details.items.filter(item => 
        item.id === itemId ? true : item.status === 'counted'
      ).length;
      const totalItems = details.items.length;
      const progress = Math.round((countedItems / totalItems) * 100);
      
      onUpdateInspection(inspectionId, { progress });
    }
  };

  const getInspectionStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--warning-600, #d97706)';
      case 'in_progress': return 'var(--info-600, #2563eb)';
      case 'completed': return 'var(--success-600, #059669)';
      case 'cancelled': return 'var(--error-600, #dc2626)';
      default: return 'var(--gray-600, #4b5563)';
    }
  };

  const getVarianceColor = (variance) => {
    if (variance === 0) return 'var(--success-600, #059669)';
    if (variance > 0) return 'var(--info-600, #2563eb)';
    return 'var(--error-600, #dc2626)';
  };

  const renderInspectionCard = (inspection) => (
    <div key={inspection.id} className="inspection-card">
      <div className="card-header">
        <div className="inspection-type">
          <span className="type-icon">
            {inspection.type === 'inventory_count' ? '📋' :
             inspection.type === 'quality_check' ? '🔍' :
             inspection.type === 'cycle_count' ? '🔄' : '📊'}
          </span>
          <span className="type-label">
            {inspection.type === 'inventory_count' ? 'Kiểm kê định kỳ' :
             inspection.type === 'quality_check' ? 'Kiểm tra chất lượng' :
             inspection.type === 'cycle_count' ? 'Kiểm kê luân phiên' : 'Kiểm tra đặc biệt'}
          </span>
        </div>
        <div 
          className="inspection-status"
          style={{ color: getInspectionStatusColor(inspection.status) }}
        >
          {inspection.status === 'pending' ? 'Chờ thực hiện' :
           inspection.status === 'in_progress' ? 'Đang thực hiện' :
           inspection.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="inspection-description">{inspection.description}</h3>
        
        <div className="inspection-details">
          <div className="detail-row">
            <span className="detail-label">Khu vực:</span>
            <span className="detail-value">{inspection.zones.join(', ')}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ngày thực hiện:</span>
            <span className="detail-value">
              {new Date(inspection.scheduledDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Thời gian dự kiến:</span>
            <span className="detail-value">
              {Math.floor(inspection.estimatedDuration / 60)}h {inspection.estimatedDuration % 60}m
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Người thực hiện:</span>
            <span className="detail-value">{inspection.assignedTo.join(', ')}</span>
          </div>
        </div>
        
        {inspection.status === 'in_progress' && inspection.progress !== undefined && (
          <div className="progress-section">
            <div className="progress-header">
              <span>Tiến độ</span>
              <span>{inspection.progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${inspection.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="card-actions">
        {inspection.status === 'pending' && (
          <button 
            className="btn btn-primary"
            onClick={() => handleStartInspection(inspection.id)}
          >
            <span className="btn-icon">▶️</span>
            Bắt đầu
          </button>
        )}
        
        {inspection.status === 'in_progress' && (
          <>
            <button 
              className="btn btn-outline"
              onClick={() => setSelectedInspection(inspection)}
            >
              <span className="btn-icon">📋</span>
              Chi tiết
            </button>
            <button 
              className="btn btn-success"
              onClick={() => handleCompleteInspection(inspection.id)}
            >
              <span className="btn-icon">✅</span>
              Hoàn thành
            </button>
          </>
        )}
        
        {inspection.status === 'completed' && (
          <>
            <button 
              className="btn btn-outline"
              onClick={() => setSelectedInspection(inspection)}
            >
              <span className="btn-icon">👁️</span>
              Xem kết quả
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">📄</span>
              Xuất báo cáo
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderCreateInspectionForm = () => (
    <div className="create-inspection-form">
      <h2>Tạo đợt kiểm kê mới</h2>
      
      <form className="inspection-form">
        <div className="form-section">
          <h3>Thông tin cơ bản</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Loại kiểm kê *</label>
              <select>
                <option value="inventory_count">Kiểm kê định kỳ</option>
                <option value="cycle_count">Kiểm kê luân phiên</option>
                <option value="quality_check">Kiểm tra chất lượng</option>
                <option value="spot_check">Kiểm tra đột xuất</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Mô tả *</label>
              <input
                type="text"
                placeholder="VD: Kiểm kê định kỳ tháng 1/2025"
              />
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
                defaultValue="480"
                min="60"
                step="30"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Phạm vi kiểm kê</h3>
          <div className="zones-selection">
            <label>Chọn khu vực:</label>
            <div className="zones-grid">
              {['A', 'B', 'C', 'D'].map(zone => (
                <label key={zone} className="zone-checkbox">
                  <input type="checkbox" value={zone} />
                  <span>Zone {zone}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="locations-selection">
            <label>Hoặc chọn vị trí cụ thể:</label>
            <textarea
              rows="3"
              placeholder="Nhập các mã vị trí, cách nhau bằng dấu phẩy (VD: A-01-01, A-01-02, B-02-03)"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Người thực hiện</h3>
          <div className="assignees-selection">
            <div className="form-group">
              <label>Trưởng nhóm *</label>
              <select>
                <option value="">Chọn trưởng nhóm</option>
                <option value="user1">Nguyễn Văn A</option>
                <option value="user2">Trần Thị B</option>
                <option value="user3">Lê Văn C</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Thành viên</label>
              <div className="members-list">
                {['Phạm Văn D', 'Hoàng Thị E', 'Vũ Văn F', 'Đỗ Thị G'].map(member => (
                  <label key={member} className="member-checkbox">
                    <input type="checkbox" value={member} />
                    <span>{member}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Cài đặt bổ sung</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Gửi thông báo email</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Kiểm kê blind (không hiển thị số lượng dự kiến)</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Yêu cầu xác nhận phân biệt lớn</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Tạo báo cáo tự động</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-outline">
            Lưu nháp
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="btn-icon">✅</span>
            Tạo đợt kiểm kê
          </button>
        </div>
      </form>
    </div>
  );

  const renderInspectionDetail = () => {
    if (!selectedInspection) return null;
    
    const details = inspectionDetails[selectedInspection.id];
    if (!details) return null;

    const totalItems = details.items.length;
    const countedItems = details.items.filter(item => item.status === 'counted').length;
    const totalVariance = details.items.reduce((sum, item) => sum + (item.variance || 0), 0);
    const hasDiscrepancies = details.items.some(item => item.variance !== 0);

    return (
      <div className="modal-overlay">
        <div className="modal-content large">
          <div className="modal-header">
            <h3>Chi tiết kiểm kê: {selectedInspection.description}</h3>
            <button 
              className="modal-close"
              onClick={() => setSelectedInspection(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="modal-body">
            <div className="inspection-summary">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Tiến độ:</span>
                  <span className="stat-value">{countedItems}/{totalItems} vị trí</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tổng chênh lệch:</span>
                  <span 
                    className="stat-value"
                    style={{ color: getVarianceColor(totalVariance) }}
                  >
                    {totalVariance > 0 ? '+' : ''}{totalVariance}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Trạng thái:</span>
                  <span className={hasDiscrepancies ? 'warning' : 'success'}>
                    {hasDiscrepancies ? 'Có chênh lệch' : 'Chính xác'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Vị trí</th>
                    <th>Sản phẩm</th>
                    <th>Dự kiến</th>
                    <th>Đếm được</th>
                    <th>Chênh lệch</th>
                    <th>Người đếm</th>
                    <th>Thời gian</th>
                    <th>Ghi chú</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {details.items.map(item => (
                    <tr 
                      key={item.id}
                      className={item.status === 'counted' ? 'counted' : 'pending'}
                    >
                      <td className="location-code">{item.locationCode}</td>
                      <td>
                        <div className="product-info">
                          <div className="product-sku">{item.productSku}</div>
                          <div className="product-name">{item.productName}</div>
                        </div>
                      </td>
                      <td className="expected-qty">{item.expectedQuantity}</td>
                      <td>
                        {item.status === 'counted' ? (
                          <span className="counted-qty">{item.countedQuantity}</span>
                        ) : (
                          <input
                            type="number"
                            className="count-input"
                            placeholder="Nhập số lượng"
                            onBlur={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                updateItemCount(selectedInspection.id, item.id, value);
                              }
                            }}
                          />
                        )}
                      </td>
                      <td>
                        {item.variance !== null && (
                          <span 
                            className="variance"
                            style={{ color: getVarianceColor(item.variance) }}
                          >
                            {item.variance > 0 ? '+' : ''}{item.variance}
                          </span>
                        )}
                      </td>
                      <td>{item.countedBy || '-'}</td>
                      <td>
                        {item.countedAt ? 
                          new Date(item.countedAt).toLocaleString('vi-VN') : '-'}
                      </td>
                      <td>
                        <input
                          type="text"
                          className="notes-input"
                          value={item.notes}
                          placeholder="Ghi chú..."
                          onChange={(e) => {
                            // Update notes
                          }}
                        />
                      </td>
                      <td>
                        {item.status === 'counted' && item.variance !== 0 && (
                          <button className="btn btn-outline btn-sm">
                            🔄 Đếm lại
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn btn-outline"
              onClick={() => setSelectedInspection(null)}
            >
              Đóng
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">📄</span>
              Xuất báo cáo
            </button>
            {selectedInspection.status === 'in_progress' && (
              <button 
                className="btn btn-success"
                onClick={() => handleCompleteInspection(selectedInspection.id)}
                disabled={countedItems < totalItems}
              >
                <span className="btn-icon">✅</span>
                Hoàn thành kiểm kê
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="kiem-ke-container">
      {/* Header */}
      <div className="kiem-ke-header">
        <h2>Quản lý kiểm kê</h2>
        <p>Theo dõi và thực hiện các đợt kiểm kê kho hàng</p>
      </div>

      {/* Navigation Tabs */}
      <div className="kiem-ke-nav">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-label">{tab.label}</span>
              {tab.count !== null && (
                <span className="tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="kiem-ke-content">
        {activeTab === 'create' ? (
          renderCreateInspectionForm()
        ) : (
          <div className="inspections-grid">
            {filteredInspections.map(inspection => renderInspectionCard(inspection))}
            
            {filteredInspections.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>
                  {activeTab === 'ongoing' && 'Không có đợt kiểm kê nào đang thực hiện'}
                  {activeTab === 'scheduled' && 'Không có đợt kiểm kê nào được lên lịch'}
                  {activeTab === 'completed' && 'Chưa có đợt kiểm kê nào hoàn thành'}
                </h3>
                <p>
                  {activeTab === 'scheduled' && 'Tạo đợt kiểm kê mới để bắt đầu'}
                  {activeTab === 'ongoing' && 'Bắt đầu một đợt kiểm kê đã được lên lịch'}
                  {activeTab === 'completed' && 'Hoàn thành các đợt kiểm kê để xem kết quả'}
                </p>
                {activeTab === 'scheduled' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('create')}
                  >
                    Tạo đợt kiểm kê mới
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inspection Detail Modal */}
      {selectedInspection && renderInspectionDetail()}
    </div>
  );
};

export default KiemKe;