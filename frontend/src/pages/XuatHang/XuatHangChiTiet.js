// src/pages/XuatHang/XuatHangChiTiet.js - Chi tiết quy trình xuất hàng

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './XuatHangChiTiet.css';

const XuatHangChiTiet = ({ orders = [], exportProgress = {} }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [exportData, setExportData] = useState({
    checklist: [],
    notes: '',
    exportedBy: '',
    exportTime: null,
    pallets: []
  });

  const steps = [
    {
      id: 1,
      title: 'Chuẩn bị đơn hàng',
      description: 'Kiểm tra thông tin đơn hàng',
      icon: '📋',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Thu thập hàng hóa',
      description: 'Lấy hàng từ các vị trí trong kho',
      icon: '📦',
      status: 'active'
    },
    {
      id: 3,
      title: 'Kiểm tra chất lượng',
      description: 'Kiểm tra tình trạng và số lượng',
      icon: '🔍',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Đóng gói',
      description: 'Đóng gói và dán nhãn',
      icon: '📦',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Hoàn thành',
      description: 'Xuất hàng và giao cho vận chuyển',
      icon: '🚚',
      status: 'pending'
    }
  ];

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
        initializeExportData(order);
      }
    } else if (orders.length > 0) {
      // Nếu không có orderId, chọn đơn đầu tiên
      const firstOrder = orders.find(o => o.status === 'pending' || o.status === 'in_progress');
      if (firstOrder) {
        setSelectedOrder(firstOrder);
        navigate(`/xuat-hang/xuat-hang-chi-tiet/${firstOrder.id}`);
      }
    }
  }, [orderId, orders, navigate]);

  const initializeExportData = (order) => {
    const checklist = [
      {
        id: 'verify_order',
        category: 'order_verification',
        title: 'Xác minh thông tin đơn hàng',
        description: 'Kiểm tra mã đơn, tên cửa hàng, địa chỉ giao hàng',
        required: true,
        checked: false
      },
      {
        id: 'check_inventory',
        category: 'inventory_check',
        title: 'Kiểm tra tồn kho',
        description: 'Xác nhận đủ hàng trong kho cho đơn hàng',
        required: true,
        checked: false
      },
      {
        id: 'prepare_pallets',
        category: 'preparation',
        title: 'Chuẩn bị pallet',
        description: 'Thu thập và chuẩn bị các pallet cần thiết',
        required: true,
        checked: false
      },
      {
        id: 'quality_check',
        category: 'quality',
        title: 'Kiểm tra chất lượng',
        description: 'Kiểm tra tình trạng hàng hóa, hạn sử dụng',
        required: true,
        checked: false
      },
      {
        id: 'quantity_verify',
        category: 'quality',
        title: 'Xác minh số lượng',
        description: 'Đếm và xác nhận số lượng chính xác',
        required: true,
        checked: false
      },
      {
        id: 'packaging',
        category: 'packaging',
        title: 'Đóng gói hàng hóa',
        description: 'Đóng gói an toàn cho vận chuyển',
        required: true,
        checked: false
      },
      {
        id: 'labeling',
        category: 'packaging',
        title: 'Dán nhãn và QR code',
        description: 'Dán nhãn thông tin và mã QR cho đơn hàng',
        required: true,
        checked: false
      },
      {
        id: 'final_check',
        category: 'completion',
        title: 'Kiểm tra cuối cùng',
        description: 'Kiểm tra lại toàn bộ đơn hàng trước xuất',
        required: true,
        checked: false
      }
    ];

    setExportData(prev => ({
      ...prev,
      checklist,
      pallets: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        requestedQuantity: item.quantity,
        pickedQuantity: 0,
        unit: item.unit,
        location: '',
        palletId: '',
        notes: ''
      }))
    }));
  };

  const handleChecklistToggle = (itemId) => {
    setExportData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const handlePalletUpdate = (productId, field, value) => {
    setExportData(prev => ({
      ...prev,
      pallets: prev.pallets.map(pallet =>
        pallet.productId === productId ? { ...pallet, [field]: value } : pallet
      )
    }));
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const canProceedToNext = () => {
    const currentStepChecklist = exportData.checklist.filter(item => {
      if (currentStep === 1) return item.category === 'order_verification';
      if (currentStep === 2) return item.category === 'inventory_check' || item.category === 'preparation';
      if (currentStep === 3) return item.category === 'quality';
      if (currentStep === 4) return item.category === 'packaging';
      return item.category === 'completion';
    });

    return currentStepChecklist.every(item => !item.required || item.checked);
  };

  const handleNextStep = () => {
    if (canProceedToNext() && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderOrderVerification();
      case 2:
        return renderInventoryCollection();
      case 3:
        return renderQualityCheck();
      case 4:
        return renderPackaging();
      case 5:
        return renderCompletion();
      default:
        return null;
    }
  };

  const renderOrderVerification = () => (
    <div className="step-content">
      <h3>Xác minh thông tin đơn hàng</h3>
      
      {selectedOrder && (
        <div className="order-info-card">
          <div className="info-row">
            <span className="info-label">Mã đơn:</span>
            <span className="info-value">{selectedOrder.code}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Cửa hàng:</span>
            <span className="info-value">{selectedOrder.storeName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Địa chỉ:</span>
            <span className="info-value">{selectedOrder.storeAddress}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Tổng SP:</span>
            <span className="info-value">{selectedOrder.totalItems}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Tổng SL:</span>
            <span className="info-value">{selectedOrder.totalQuantity}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Độ ưu tiên:</span>
            <span className={`priority-badge priority-${selectedOrder.priority}`}>
              {selectedOrder.priority === 'high' ? 'Cao' : 
               selectedOrder.priority === 'medium' ? 'Trung bình' : 'Thấp'}
            </span>
          </div>
        </div>
      )}

      <div className="checklist-section">
        {exportData.checklist
          .filter(item => item.category === 'order_verification')
          .map(item => (
            <div key={item.id} className="checklist-item">
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleChecklistToggle(item.id)}
                />
                <span className="checkmark"></span>
                <div className="checklist-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </label>
            </div>
          ))}
      </div>
    </div>
  );

  const renderInventoryCollection = () => (
    <div className="step-content">
      <h3>Thu thập hàng hóa</h3>
      
      <div className="products-grid">
        {exportData.pallets.map(pallet => (
          <div key={pallet.productId} className="product-card">
            <div className="product-header">
              <h4>{pallet.productName}</h4>
              <span className="product-id">#{pallet.productId}</span>
            </div>
            
            <div className="product-details">
              <div className="detail-row">
                <span>Số lượng yêu cầu:</span>
                <strong>{pallet.requestedQuantity} {pallet.unit}</strong>
              </div>
              
              <div className="quantity-input">
                <label>Số lượng lấy được:</label>
                <input
                  type="number"
                  value={pallet.pickedQuantity}
                  onChange={(e) => handlePalletUpdate(pallet.productId, 'pickedQuantity', Number(e.target.value))}
                  max={pallet.requestedQuantity}
                  min={0}
                />
                <span>{pallet.unit}</span>
              </div>
              
              <div className="location-input">
                <label>Vị trí lấy hàng:</label>
                <input
                  type="text"
                  value={pallet.location}
                  onChange={(e) => handlePalletUpdate(pallet.productId, 'location', e.target.value)}
                  placeholder="VD: A-01-15"
                />
              </div>
              
              <div className="pallet-input">
                <label>Mã pallet:</label>
                <input
                  type="text"
                  value={pallet.palletId}
                  onChange={(e) => handlePalletUpdate(pallet.productId, 'palletId', e.target.value)}
                  placeholder="VD: P-2025-001"
                />
              </div>
            </div>
            
            <div className="quantity-status">
              {pallet.pickedQuantity === pallet.requestedQuantity ? (
                <span className="status-complete">✅ Đủ hàng</span>
              ) : pallet.pickedQuantity > 0 ? (
                <span className="status-partial">⚠️ Thiếu hàng</span>
              ) : (
                <span className="status-pending">⏳ Chưa lấy</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="checklist-section">
        {exportData.checklist
          .filter(item => item.category === 'inventory_check' || item.category === 'preparation')
          .map(item => (
            <div key={item.id} className="checklist-item">
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleChecklistToggle(item.id)}
                />
                <span className="checkmark"></span>
                <div className="checklist-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </label>
            </div>
          ))}
      </div>
    </div>
  );

  const renderQualityCheck = () => (
    <div className="step-content">
      <h3>Kiểm tra chất lượng</h3>
      
      <div className="quality-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Tổng sản phẩm:</span>
            <span className="stat-value">{exportData.pallets.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Đã kiểm tra:</span>
            <span className="stat-value">
              {exportData.pallets.filter(p => p.pickedQuantity > 0).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thiếu hàng:</span>
            <span className="stat-value warning">
              {exportData.pallets.filter(p => p.pickedQuantity < p.requestedQuantity).length}
            </span>
          </div>
        </div>
      </div>

      <div className="quality-checklist">
        {exportData.checklist
          .filter(item => item.category === 'quality')
          .map(item => (
            <div key={item.id} className="checklist-item large">
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleChecklistToggle(item.id)}
                />
                <span className="checkmark"></span>
                <div className="checklist-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </label>
            </div>
          ))}
      </div>

      <div className="notes-section">
        <label>Ghi chú kiểm tra chất lượng:</label>
        <textarea
          value={exportData.notes}
          onChange={(e) => setExportData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Ghi chú về tình trạng hàng hóa, vấn đề phát hiện..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderPackaging = () => (
    <div className="step-content">
      <h3>Đóng gói và dán nhãn</h3>
      
      <div className="packaging-instructions">
        <div className="instruction-card">
          <div className="instruction-icon">📦</div>
          <div className="instruction-content">
            <h4>Hướng dẫn đóng gói</h4>
            <ul>
              <li>Sử dụng thùng carton phù hợp với kích thước hàng hóa</li>
              <li>Đặt hàng dễ vỡ ở trên cùng</li>
              <li>Sử dụng vật liệu đệm để bảo vệ hàng hóa</li>
              <li>Đóng kín và dán băng keo chắc chắn</li>
            </ul>
          </div>
        </div>
        
        <div className="instruction-card">
          <div className="instruction-icon">🏷️</div>
          <div className="instruction-content">
            <h4>Hướng dẫn dán nhãn</h4>
            <ul>
              <li>Dán nhãn địa chỉ giao hàng rõ ràng</li>
              <li>Dán mã QR của đơn hàng</li>
              <li>Đánh dấu "DỄ VỠ" nếu cần thiết</li>
              <li>Ghi số kiện nếu có nhiều thùng</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="packaging-checklist">
        {exportData.checklist
          .filter(item => item.category === 'packaging')
          .map(item => (
            <div key={item.id} className="checklist-item large">
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleChecklistToggle(item.id)}
                />
                <span className="checkmark"></span>
                <div className="checklist-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </label>
            </div>
          ))}
      </div>

      <div className="package-info">
        <div className="info-grid">
          <div className="info-field">
            <label>Số thùng/kiện:</label>
            <input type="number" min="1" defaultValue="1" />
          </div>
          <div className="info-field">
            <label>Trọng lượng (kg):</label>
            <input type="number" step="0.1" min="0" />
          </div>
          <div className="info-field">
            <label>Người đóng gói:</label>
            <input
              type="text"
              value={exportData.exportedBy}
              onChange={(e) => setExportData(prev => ({ ...prev, exportedBy: e.target.value }))}
              placeholder="Tên người đóng gói"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompletion = () => (
    <div className="step-content">
      <h3>Hoàn thành xuất hàng</h3>
      
      <div className="completion-summary">
        <div className="summary-card success">
          <div className="summary-icon">🎉</div>
          <div className="summary-content">
            <h4>Đơn hàng đã sẵn sàng xuất</h4>
            <p>Tất cả các bước đã được hoàn thành. Đơn hàng có thể được giao cho bộ phận vận chuyển.</p>
          </div>
        </div>
        
        <div className="completion-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Mã đơn:</span>
              <span className="detail-value">{selectedOrder?.code}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tổng sản phẩm:</span>
              <span className="detail-value">{selectedOrder?.totalItems}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tổng số lượng:</span>
              <span className="detail-value">{selectedOrder?.totalQuantity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Người xuất hàng:</span>
              <span className="detail-value">{exportData.exportedBy || 'Chưa nhập'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Thời gian xuất:</span>
              <span className="detail-value">
                {new Date().toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="final-checklist">
        {exportData.checklist
          .filter(item => item.category === 'completion')
          .map(item => (
            <div key={item.id} className="checklist-item large">
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleChecklistToggle(item.id)}
                />
                <span className="checkmark"></span>
                <div className="checklist-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </label>
            </div>
          ))}
      </div>

      <div className="completion-actions">
        <button className="btn btn-success btn-large">
          <span className="btn-icon">✅</span>
          Hoàn thành xuất hàng
        </button>
        <button className="btn btn-outline btn-large">
          <span className="btn-icon">🖨️</span>
          In phiếu xuất kho
        </button>
        <button className="btn btn-outline btn-large">
          <span className="btn-icon">📧</span>
          Gửi thông báo
        </button>
      </div>
    </div>
  );

  if (!selectedOrder) {
    return (
      <div className="xuat-hang-chi-tiet-container">
        <div className="no-order-state">
          <div className="no-order-icon">📦</div>
          <h3>Chọn đơn hàng để xuất</h3>
          <p>Vui lòng chọn một đơn hàng từ danh sách để bắt đầu quy trình xuất hàng.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/xuat-hang/danh-sach-don')}
          >
            Về danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="xuat-hang-chi-tiet-container">
      {/* Header */}
      <div className="detail-header">
        <div className="header-left">
          <button 
            className="back-btn"
            onClick={() => navigate('/xuat-hang/danh-sach-don')}
          >
            ← Quay lại
          </button>
          <div className="order-info">
            <h2>Xuất hàng: {selectedOrder.code}</h2>
            <p>{selectedOrder.storeName}</p>
          </div>
        </div>
        <div className="header-right">
          <div className="order-status">
            <span className={`status-badge status-${selectedOrder.status}`}>
              {selectedOrder.status === 'pending' ? 'Chờ xuất' :
               selectedOrder.status === 'in_progress' ? 'Đang xuất' :
               selectedOrder.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="steps-container">
        <div className="steps-progress">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`step-item ${getStepStatus(step.id)}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="step-circle">
                <span className="step-icon">{step.icon}</span>
                <span className="step-number">{step.id}</span>
              </div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        <div className="content-main">
          {renderStepContent()}
        </div>
        
        {/* Sidebar */}
        <div className="content-sidebar">
          <div className="sidebar-card">
            <h4>Tiến độ hoàn thành</h4>
            <div className="progress-overview">
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(exportData.checklist.filter(item => item.checked).length / exportData.checklist.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {exportData.checklist.filter(item => item.checked).length} / {exportData.checklist.length} công việc
                </span>
              </div>
            </div>
            
            <div className="checklist-summary">
              <h5>Checklist tổng quan</h5>
              {exportData.checklist.map(item => (
                <div key={item.id} className="summary-item">
                  <span className={`summary-status ${item.checked ? 'completed' : 'pending'}`}>
                    {item.checked ? '✅' : '⏳'}
                  </span>
                  <span className="summary-title">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h4>Thông tin đơn hàng</h4>
            <div className="order-summary">
              <div className="summary-row">
                <span>Mã đơn:</span>
                <strong>{selectedOrder.code}</strong>
              </div>
              <div className="summary-row">
                <span>Độ ưu tiên:</span>
                <span className={`priority-${selectedOrder.priority}`}>
                  {selectedOrder.priority === 'high' ? 'Cao' : 
                   selectedOrder.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                </span>
              </div>
              <div className="summary-row">
                <span>Ngày tạo:</span>
                <span>{selectedOrder.createdDate}</span>
              </div>
              <div className="summary-row">
                <span>Yêu cầu giao:</span>
                <span>{selectedOrder.requestedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="detail-navigation">
        <button 
          className="btn btn-outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          ← Bước trước
        </button>
        
        <div className="nav-info">
          Bước {currentStep} / {steps.length}: {steps[currentStep - 1]?.title}
        </div>
        
        {currentStep < steps.length ? (
          <button 
            className="btn btn-primary"
            onClick={handleNextStep}
            disabled={!canProceedToNext()}
          >
            Bước tiếp theo →
          </button>
        ) : (
          <button 
            className="btn btn-success"
            disabled={!canProceedToNext()}
          >
            Hoàn thành xuất hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default XuatHangChiTiet;