// frontend/src/pages/NhapHang/ChiTietPallet.js

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './ChiTietPallet.css';

const ChiTietPallet = ({ pallet, onEdit, onBack, canEdit, canPrint }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    ghi_chu: pallet.ghi_chu || '',
    ngay_kiem_tra_cl: pallet.ngay_kiem_tra_cl,
    nhiet_do_bao_quan: pallet.nhiet_do_bao_quan || '',
    do_am_bao_quan: pallet.do_am_bao_quan || ''
  });
  const printRef = useRef();

  const getStatusInfo = (status) => {
    const statusConfig = {
      'Mới': { color: 'success', icon: 'plus-circle', text: 'Mới nhập', description: 'Pallet vừa được nhập kho, chưa xuất' },
      'Đã_mở': { color: 'warning', icon: 'box', text: 'Đã mở', description: 'Đã xuất một phần, còn hàng trong pallet' },
      'Trống': { color: 'secondary', icon: 'square', text: 'Trống', description: 'Đã xuất hết hàng' },
      'Hỏng': { color: 'danger', icon: 'x-circle', text: 'Hỏng', description: 'Hàng bị hỏng, không thể sử dụng' },
      'Cách_ly': { color: 'danger', icon: 'shield', text: 'Cách ly', description: 'Đang được cách ly kiểm tra' }
    };
    return statusConfig[status] || statusConfig['Mới'];
  };

  const getExpiryInfo = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        type: 'expired', 
        text: 'Đã hết hạn', 
        days: Math.abs(diffDays),
        color: 'danger',
        icon: 'alert-circle'
      };
    } else if (diffDays <= 7) {
      return { 
        type: 'expiring', 
        text: 'Sắp hết hạn', 
        days: diffDays,
        color: 'warning',
        icon: 'alert-triangle'
      };
    } else if (diffDays <= 30) {
      return { 
        type: 'warning', 
        text: 'Cần theo dõi', 
        days: diffDays,
        color: 'info',
        icon: 'clock'
      };
    } else {
      return { 
        type: 'normal', 
        text: 'Bình thường', 
        days: diffDays,
        color: 'success',
        icon: 'check-circle'
      };
    }
  };

  const generateQRData = () => {
    return JSON.stringify({
      type: 'pallet',
      ma_pallet: pallet.ma_pallet,
      san_pham: pallet.san_pham.ten_san_pham,
      so_thung: pallet.so_thung_con_lai,
      han_su_dung: pallet.han_su_dung,
      vi_tri: pallet.vi_tri_kho?.ma_vi_tri,
      created_at: pallet.created_at,
      checksum: `${pallet.ma_pallet}-${Date.now()}`
    }, null, 2);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>In nhãn pallet ${pallet.ma_pallet}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .pallet-label { border: 2px solid #000; padding: 20px; max-width: 400px; }
            .header { text-align: center; margin-bottom: 20px; }
            .qr-section { text-align: center; margin: 20px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            .value { margin-left: 10px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="pallet-label">
            <div class="header">
              <h2>${pallet.ma_pallet}</h2>
              <h3>${pallet.san_pham.ten_san_pham}</h3>
            </div>
            <div class="qr-section">
              <canvas id="qr-canvas"></canvas>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Số lượng:</span>
                <span class="value">${pallet.so_thung_con_lai}/${pallet.so_thung_ban_dau} thùng</span>
              </div>
              <div class="info-item">
                <span class="label">Vị trí:</span>
                <span class="value">${pallet.vi_tri_kho?.ma_vi_tri || 'Chưa phân bổ'}</span>
              </div>
              <div class="info-item">
                <span class="label">NSX:</span>
                <span class="value">${new Date(pallet.ngay_san_xuat).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="info-item">
                <span class="label">HSD:</span>
                <span class="value">${new Date(pallet.han_su_dung).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            <div class="footer">
              <p>In lúc: ${new Date().toLocaleString('vi-VN')}</p>
              <p>Hệ thống quản lý kho</p>
            </div>
          </div>
          <script>
            // Generate QR code
            const canvas = document.getElementById('qr-canvas');
            // QR code generation would go here
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSaveEdit = () => {
    onEdit(pallet.id, editData);
    setEditMode(false);
  };

  const statusInfo = getStatusInfo(pallet.trang_thai);
  const expiryInfo = getExpiryInfo(pallet.han_su_dung);
  const totalWeight = pallet.so_thung_con_lai * (pallet.trong_luong_thung || 0);
  const utilizationRate = (pallet.so_thung_con_lai / pallet.so_thung_ban_dau) * 100;

  return (
    <div className="chi-tiet-pallet">
      {/* Header */}
      <div className="detail-header">
        <div className="header-left">
          <button className="btn btn-secondary" onClick={onBack}>
            <i className="icon-arrow-left"></i>
            Quay lại
          </button>
          
          <div className="pallet-title">
            <h2>{pallet.ma_pallet}</h2>
            <div className="status-line">
              <span className={`status-badge ${statusInfo.color}`}>
                <i className={`icon-${statusInfo.icon}`}></i>
                {statusInfo.text}
              </span>
              <span className={`expiry-badge ${expiryInfo.color}`}>
                <i className={`icon-${expiryInfo.icon}`}></i>
                {expiryInfo.text} ({expiryInfo.days} ngày)
              </span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          {canPrint && (
            <>
              <button 
                className="btn btn-info"
                onClick={() => setShowQRCode(true)}
              >
                <i className="icon-qr-code"></i>
                Xem QR
              </button>
              
              <button 
                className="btn btn-warning"
                onClick={handlePrint}
              >
                <i className="icon-printer"></i>
                In nhãn
              </button>
            </>
          )}
          
          {canEdit && (
            <button 
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              <i className="icon-edit"></i>
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <div className="detail-content">
        {/* Overview Cards */}
        <div className="overview-section">
          <div className="overview-cards">
            <div className="overview-card quantity">
              <div className="card-icon">
                <i className="icon-layers"></i>
              </div>
              <div className="card-content">
                <h3>{pallet.so_thung_con_lai}<span>/{pallet.so_thung_ban_dau}</span></h3>
                <p>Số thùng còn lại</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${utilizationRate}%`,
                      backgroundColor: utilizationRate === 0 ? '#dc3545' : 
                                     utilizationRate < 30 ? '#ffc107' : '#28a745'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="overview-card weight">
              <div className="card-icon">
                <i className="icon-weight"></i>
              </div>
              <div className="card-content">
                <h3>{totalWeight.toFixed(1)}<span>kg</span></h3>
                <p>Tổng trọng lượng</p>
                <small>{pallet.trong_luong_thung || 0}kg/thùng</small>
              </div>
            </div>
            
            <div className="overview-card location">
              <div className="card-icon">
                <i className="icon-map-pin"></i>
              </div>
              <div className="card-content">
                <h3>{pallet.vi_tri_kho?.ma_vi_tri || 'N/A'}</h3>
                <p>Vị trí lưu trữ</p>
                <small>
                  {pallet.vi_tri_kho ? `Khu ${pallet.vi_tri_kho.khu_vuc}` : 'Chưa phân bổ'}
                </small>
              </div>
            </div>
            
            <div className="overview-card age">
              <div className="card-icon">
                <i className="icon-calendar"></i>
              </div>
              <div className="card-content">
                <h3>{Math.ceil((new Date() - new Date(pallet.created_at)) / (1000 * 60 * 60 * 24))}</h3>
                <p>Ngày trong kho</p>
                <small>Kể từ {new Date(pallet.created_at).toLocaleDateString('vi-VN')}</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Product Information */}
          <div className="info-section">
            <h3>
              <i className="icon-package"></i>
              Thông tin sản phẩm
            </h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Tên sản phẩm:</label>
                <span>{pallet.san_pham.ten_san_pham}</span>
              </div>
              
              <div className="info-item">
                <label>Nhóm hàng:</label>
                <span>{pallet.san_pham.nhom_hang}</span>
              </div>
              
              <div className="info-item">
                <label>Mã sản phẩm:</label>
                <span>{pallet.san_pham.ma_san_pham || 'N/A'}</span>
              </div>
              
              <div className="info-item">
                <label>Đơn vị tính:</label>
                <span>{pallet.san_pham.don_vi_tinh || 'thùng'}</span>
              </div>
              
              {pallet.nha_cung_cap && (
                <div className="info-item full-width">
                  <label>Nhà cung cấp:</label>
                  <span>{pallet.nha_cung_cap.ten_nha_cung_cap}</span>
                </div>
              )}
            </div>
          </div>

          {/* Date Information */}
          <div className="info-section">
            <h3>
              <i className="icon-calendar"></i>
              Thông tin ngày tháng
            </h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Ngày sản xuất:</label>
                <span>{new Date(pallet.ngay_san_xuat).toLocaleDateString('vi-VN')}</span>
              </div>
              
              <div className="info-item">
                <label>Hạn sử dụng:</label>
                <span className={`expiry-text ${expiryInfo.type}`}>
                  {new Date(pallet.han_su_dung).toLocaleDateString('vi-VN')}
                  <small>({expiryInfo.text})</small>
                </span>
              </div>
              
              <div className="info-item">
                <label>Ngày nhập kho:</label>
                <span>{new Date(pallet.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
              
              <div className="info-item">
                <label>Ngày kiểm tra CL:</label>
                {editMode ? (
                  <input
                    type="date"
                    value={editData.ngay_kiem_tra_cl}
                    onChange={(e) => setEditData(prev => ({ ...prev, ngay_kiem_tra_cl: e.target.value }))}
                  />
                ) : (
                  <span>{new Date(pallet.ngay_kiem_tra_cl).toLocaleDateString('vi-VN')}</span>
                )}
              </div>
            </div>
          </div>

          {/* Physical Information */}
          <div className="info-section">
            <h3>
              <i className="icon-box"></i>
              Thông tin vật lý
            </h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Kích thước (D×R×C):</label>
                <span>
                  {pallet.chieu_dai}×{pallet.chieu_rong}×{pallet.chieu_cao} cm
                </span>
              </div>
              
              <div className="info-item">
                <label>Thể tích:</label>
                <span>
                  {((pallet.chieu_dai * pallet.chieu_rong * pallet.chieu_cao) / 1000000).toFixed(3)} m³
                </span>
              </div>
              
              <div className="info-item">
                <label>Trọng lượng/thùng:</label>
                <span>{pallet.trong_luong_thung || 0} kg</span>
              </div>
              
              <div className="info-item">
                <label>Tổng trọng lượng:</label>
                <span>{totalWeight.toFixed(1)} kg</span>
              </div>
            </div>
          </div>

          {/* Storage Conditions */}
          <div className="info-section">
            <h3>
              <i className="icon-thermometer"></i>
              Điều kiện bảo quản
            </h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Nhiệt độ:</label>
                {editMode ? (
                  <input
                    type="number"
                    step="0.1"
                    value={editData.nhiet_do_bao_quan}
                    onChange={(e) => setEditData(prev => ({ ...prev, nhiet_do_bao_quan: e.target.value }))}
                    placeholder="°C"
                  />
                ) : (
                  <span>{pallet.nhiet_do_bao_quan ? `${pallet.nhiet_do_bao_quan}°C` : 'Không yêu cầu'}</span>
                )}
              </div>
              
              <div className="info-item">
                <label>Độ ẩm:</label>
                {editMode ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editData.do_am_bao_quan}
                    onChange={(e) => setEditData(prev => ({ ...prev, do_am_bao_quan: e.target.value }))}
                    placeholder="%"
                  />
                ) : (
                  <span>{pallet.do_am_bao_quan ? `${pallet.do_am_bao_quan}%` : 'Không yêu cầu'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="info-section">
            <h3>
              <i className="icon-file-text"></i>
              Thông tin bổ sung
            </h3>
            
            <div className="info-grid">
              {pallet.lo_san_xuat && (
                <div className="info-item">
                  <label>Lô sản xuất:</label>
                  <span>{pallet.lo_san_xuat}</span>
                </div>
              )}
              
              {pallet.so_phieu_nhap && (
                <div className="info-item">
                  <label>Số phiếu nhập:</label>
                  <span>{pallet.so_phieu_nhap}</span>
                </div>
              )}
              
              <div className="info-item">
                <label>Người tạo:</label>
                <span>{pallet.nguoi_tao}</span>
              </div>
              
              <div className="info-item">
                <label>Trạng thái:</label>
                <span className={`status-badge ${statusInfo.color}`}>
                  <i className={`icon-${statusInfo.icon}`}></i>
                  {statusInfo.text}
                </span>
              </div>
              
              <div className="info-item full-width">
                <label>Ghi chú:</label>
                {editMode ? (
                  <textarea
                    value={editData.ghi_chu}
                    onChange={(e) => setEditData(prev => ({ ...prev, ghi_chu: e.target.value }))}
                    rows="3"
                    placeholder="Nhập ghi chú..."
                  />
                ) : (
                  <span>{pallet.ghi_chu || 'Không có ghi chú'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Actions */}
      {editMode && (
        <div className="edit-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setEditMode(false);
              setEditData({
                ghi_chu: pallet.ghi_chu || '',
                ngay_kiem_tra_cl: pallet.ngay_kiem_tra_cl,
                nhiet_do_bao_quan: pallet.nhiet_do_bao_quan || '',
                do_am_bao_quan: pallet.do_am_bao_quan || ''
              });
            }}
          >
            <i className="icon-x"></i>
            Hủy
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={handleSaveEdit}
          >
            <i className="icon-check"></i>
            Lưu thay đổi
          </button>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3>QR Code - {pallet.ma_pallet}</h3>
              <button 
                className="close-button"
                onClick={() => setShowQRCode(false)}
              >
                <i className="icon-x"></i>
              </button>
            </div>
            
            <div className="qr-modal-body">
              <div className="qr-code-container">
                <QRCodeCanvas
                  value={generateQRData()}
                  size={256}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <div className="qr-info">
                <h4>Thông tin trong QR:</h4>
                <ul>
                  <li>Mã pallet: {pallet.ma_pallet}</li>
                  <li>Sản phẩm: {pallet.san_pham.ten_san_pham}</li>
                  <li>Số lượng: {pallet.so_thung_con_lai} thùng</li>
                  <li>Vị trí: {pallet.vi_tri_kho?.ma_vi_tri || 'Chưa có'}</li>
                  <li>Hạn sử dụng: {new Date(pallet.han_su_dung).toLocaleDateString('vi-VN')}</li>
                </ul>
              </div>
            </div>
            
            <div className="qr-modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowQRCode(false)}
              >
                Đóng
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // Download QR as image
                  const canvas = document.querySelector('#qr-canvas canvas');
                  if (canvas) {
                    const link = document.createElement('a');
                    link.download = `QR-${pallet.ma_pallet}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                  }
                }}
              >
                <i className="icon-download"></i>
                Tải về
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiTietPallet;