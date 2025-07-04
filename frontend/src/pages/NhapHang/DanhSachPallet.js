// frontend/src/pages/NhapHang/DanhSachPallet.js

import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './DanhSachPallet.css';

const DanhSachPallet = ({ onViewDetail, canEdit, canDelete, canPrint, canExport }) => {
  const [pallets, setPallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPallets, setSelectedPallets] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRPallet, setSelectedQRPallet] = useState(null);
  
  // Filters and Sorting
  const [filters, setFilters] = useState({
    search: '',
    trang_thai: '',
    khu_vuc: '',
    san_pham: '',
    han_su_dung: '',
    ngay_tao_tu: '',
    ngay_tao_den: ''
  });
  
  const [sorting, setSorting] = useState({
    field: 'created_at',
    direction: 'desc'
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  // Load pallets data from API
  useEffect(() => {
    const loadPallets = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/warehouse/pallet/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched pallet data:', data); // DEBUG
        
        // Transform API data to match component structure
        const transformedPallets = data.results || data || [];
        
        setPallets(transformedPallets);
        setPagination(prev => ({
          ...prev,
          totalItems: data.count || transformedPallets.length,
          totalPages: Math.ceil((data.count || transformedPallets.length) / prev.pageSize)
        }));
      } catch (err) {
        setError('Không thể tải danh sách pallet');
        console.error('Error loading pallets:', err); // DEBUG
      } finally {
        setLoading(false);
      }
    };

    loadPallets();
  }, []);

  // Filter and sort pallets
  const filteredAndSortedPallets = useMemo(() => {
    let result = [...pallets];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(pallet => 
        pallet.ma_pallet.toLowerCase().includes(searchLower) ||
        pallet.san_pham.ten_san_pham.toLowerCase().includes(searchLower) ||
        pallet.nguoi_tao.toLowerCase().includes(searchLower)
      );
    }

    if (filters.trang_thai) {
      result = result.filter(pallet => pallet.trang_thai === filters.trang_thai);
    }

    if (filters.khu_vuc) {
      result = result.filter(pallet => pallet.vi_tri_kho?.khu_vuc === filters.khu_vuc);
    }

    if (filters.san_pham) {
      result = result.filter(pallet => 
        pallet.san_pham.nhom_hang.toLowerCase().includes(filters.san_pham.toLowerCase())
      );
    }

    if (filters.han_su_dung) {
      const today = new Date();
      const filterDays = parseInt(filters.han_su_dung);
      result = result.filter(pallet => {
        const expiryDate = new Date(pallet.han_su_dung);
        const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return diffDays <= filterDays;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sorting.field];
      let bValue = b[sorting.field];

      // Handle nested properties
      if (sorting.field === 'san_pham') {
        aValue = a.san_pham.ten_san_pham;
        bValue = b.san_pham.ten_san_pham;
      } else if (sorting.field === 'vi_tri') {
        aValue = a.vi_tri_kho?.ma_vi_tri || '';
        bValue = b.vi_tri_kho?.ma_vi_tri || '';
      }

      // Handle dates
      if (sorting.field.includes('ngay') || sorting.field === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [pallets, filters, sorting]);

  // Paginated pallets
  const paginatedPallets = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredAndSortedPallets.slice(startIndex, endIndex);
  }, [filteredAndSortedPallets, pagination.currentPage, pagination.pageSize]);

  // Status info helper
  const getStatusInfo = (status) => {
    const statusConfig = {
      'Mới': { color: 'success', icon: 'plus-circle', text: 'Mới' },
      'Đã_mở': { color: 'warning', icon: 'box', text: 'Đã mở' },
      'Trống': { color: 'secondary', icon: 'square', text: 'Trống' },
      'Hỏng': { color: 'danger', icon: 'x-circle', text: 'Hỏng' },
      'Cách_ly': { color: 'danger', icon: 'shield', text: 'Cách ly' }
    };
    return statusConfig[status] || statusConfig['Mới'];
  };

  // Expiry info helper
  const getExpiryInfo = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { type: 'expired', color: 'danger', days: Math.abs(diffDays) };
    if (diffDays <= 7) return { type: 'expiring', color: 'warning', days: diffDays };
    if (diffDays <= 30) return { type: 'warning', color: 'info', days: diffDays };
    return { type: 'normal', color: 'success', days: diffDays };
  };

  // Handle sorting
  const handleSort = (field) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle selection
  const handleSelectPallet = (palletId) => {
    setSelectedPallets(prev => {
      const newSelection = prev.includes(palletId)
        ? prev.filter(id => id !== palletId)
        : [...prev, palletId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const allIds = paginatedPallets.map(p => p.id);
    const allSelected = allIds.every(id => selectedPallets.includes(id));
    
    if (allSelected) {
      setSelectedPallets(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedPallets(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  // Handle bulk actions
  const handleBulkExport = () => {
    const selectedData = pallets.filter(p => selectedPallets.includes(p.id));
    // Export logic here
    console.log('Exporting:', selectedData);
  };

  const handleBulkPrint = () => {
    const selectedData = pallets.filter(p => selectedPallets.includes(p.id));
    // Print logic here
    console.log('Printing:', selectedData);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedPallets.length} pallet đã chọn?`)) {
      try {
        console.log('Bulk deleting pallets:', selectedPallets); // DEBUG
        const response = await fetch('http://127.0.0.1:8000/warehouse/pallet/bulk-delete/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ pallet_ids: selectedPallets })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Remove from local state after successful API call
        setPallets(prev => prev.filter(p => !selectedPallets.includes(p.id)));
        setSelectedPallets([]);
        setShowBulkActions(false);
        
        alert('Đã xóa thành công các pallet đã chọn');
      } catch (err) {
        console.error('Error deleting pallets:', err); // DEBUG
        alert('Có lỗi xảy ra khi xóa pallet');
      }
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size) => {
    setPagination(prev => ({
      ...prev,
      pageSize: parseInt(size),
      currentPage: 1,
      totalPages: Math.ceil(filteredAndSortedPallets.length / parseInt(size))
    }));
  };

  // Generate QR data
  const generateQRData = (pallet) => {
    return JSON.stringify({
      type: 'pallet',
      ma_pallet: pallet.ma_pallet,
      san_pham: pallet.san_pham.ten_san_pham,
      so_thung: pallet.so_thung_con_lai,
      han_su_dung: pallet.han_su_dung,
      vi_tri: pallet.vi_tri_kho?.ma_vi_tri,
      checksum: `${pallet.ma_pallet}-${Date.now()}`
    });
  };

  if (loading) {
    return (
      <div className="danh-sach-pallet">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách pallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="danh-sach-pallet">
        <div className="error-container">
          <i className="icon-alert-circle"></i>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="danh-sach-pallet">
      {/* Header with Stats */}
      <div className="list-header">
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="icon-layers"></i>
            </div>
            <div className="stat-content">
              <h3>{pallets.length}</h3>
              <p>Tổng pallet</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon new">
              <i className="icon-plus-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{pallets.filter(p => p.trang_thai === 'Mới').length}</h3>
              <p>Pallet mới</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon opened">
              <i className="icon-box"></i>
            </div>
            <div className="stat-content">
              <h3>{pallets.filter(p => p.trang_thai === 'Đã_mở').length}</h3>
              <p>Đã mở</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon expiring">
              <i className="icon-alert-triangle"></i>
            </div>
            <div className="stat-content">
              <h3>
                {pallets.filter(p => {
                  const expiry = getExpiryInfo(p.han_su_dung);
                  return expiry.type === 'expiring' || expiry.type === 'expired';
                }).length}
              </h3>
              <p>Sắp hết hạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="search-box">
            <i className="icon-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã pallet, sản phẩm, người tạo..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <select
            value={filters.trang_thai}
            onChange={(e) => setFilters(prev => ({ ...prev, trang_thai: e.target.value }))}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Mới">Mới</option>
            <option value="Đã_mở">Đã mở</option>
            <option value="Trống">Trống</option>
            <option value="Hỏng">Hỏng</option>
            <option value="Cách_ly">Cách ly</option>
          </select>
          
          <select
            value={filters.khu_vuc}
            onChange={(e) => setFilters(prev => ({ ...prev, khu_vuc: e.target.value }))}
          >
            <option value="">Tất cả khu vực</option>
            <option value="A">Khu vực A</option>
            <option value="B">Khu vực B</option>
            <option value="C">Khu vực C</option>
            <option value="D">Khu vực D</option>
          </select>
          
          <input
            type="text"
            placeholder="Nhóm hàng..."
            value={filters.san_pham}
            onChange={(e) => setFilters(prev => ({ ...prev, san_pham: e.target.value }))}
          />
          
          <select
            value={filters.han_su_dung}
            onChange={(e) => setFilters(prev => ({ ...prev, han_su_dung: e.target.value }))}
          >
            <option value="">Tất cả hạn sử dụng</option>
            <option value="7">Hết hạn trong 7 ngày</option>
            <option value="30">Hết hạn trong 30 ngày</option>
            <option value="90">Hết hạn trong 90 ngày</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bulk-actions">
          <div className="selection-info">
            <span>Đã chọn {selectedPallets.length} pallet</span>
            <button 
              className="btn-link"
              onClick={() => {
                setSelectedPallets([]);
                setShowBulkActions(false);
              }}
            >
              Bỏ chọn tất cả
            </button>
          </div>
          
          <div className="bulk-buttons">
            {canExport && (
              <button className="btn btn-info" onClick={handleBulkExport}>
                <i className="icon-download"></i>
                Xuất Excel
              </button>
            )}
            
            {canPrint && (
              <button className="btn btn-warning" onClick={handleBulkPrint}>
                <i className="icon-printer"></i>
                In QR
              </button>
            )}
            
            {canDelete && (
              <button className="btn btn-danger" onClick={handleBulkDelete}>
                <i className="icon-trash-2"></i>
                Xóa
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="pallet-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={paginatedPallets.length > 0 && paginatedPallets.every(p => selectedPallets.includes(p.id))}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Mã Pallet</th>
              <th>Sản phẩm</th>
              <th>Nhà cung cấp</th>
              <th>Số thùng ban đầu</th>
              <th>Số thùng còn lại</th>
              <th>Vị trí</th>
              <th>Hạn sử dụng</th>
              <th>Ngày sản xuất</th>
              <th>Ngày kiểm tra CL</th>
              <th>Trọng lượng/thùng (kg)</th>
              <th>Chiều dài (cm)</th>
              <th>Chiều rộng (cm)</th>
              <th>Chiều cao (cm)</th>
              <th>Nhiệt độ bảo quản (°C)</th>
              <th>Độ ẩm bảo quản (%)</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          
          <tbody>
            {paginatedPallets.map(pallet => (
              <tr key={pallet.id} className={selectedPallets.includes(pallet.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedPallets.includes(pallet.id)}
                    onChange={() => handleSelectPallet(pallet.id)}
                  />
                </td>
                <td>{pallet.ma_pallet}</td>
                <td>{pallet.san_pham?.ten_san_pham}</td>
                <td>{pallet.nha_cung_cap?.ten_nha_cung_cap}</td>
                <td>{pallet.so_thung_ban_dau}</td>
                <td>{pallet.so_thung_con_lai}</td>
                <td>{pallet.vi_tri_kho?.ma_vi_tri}</td>
                <td>{pallet.han_su_dung ? new Date(pallet.han_su_dung).toLocaleDateString('vi-VN') : ''}</td>
                <td>{pallet.ngay_san_xuat ? new Date(pallet.ngay_san_xuat).toLocaleDateString('vi-VN') : ''}</td>
                <td>{pallet.ngay_kiem_tra_cl ? new Date(pallet.ngay_kiem_tra_cl).toLocaleDateString('vi-VN') : ''}</td>
                <td>{pallet.trong_luong_thung}</td>
                <td>{pallet.chieu_dai}</td>
                <td>{pallet.chieu_rong}</td>
                <td>{pallet.chieu_cao}</td>
                <td>{pallet.nhiet_do_bao_quan}</td>
                <td>{pallet.do_am_bao_quan}</td>
                <td>{pallet.nguoi_tao}</td>
                <td>{pallet.created_at ? new Date(pallet.created_at).toLocaleString('vi-VN') : ''}</td>
                <td>{pallet.ghi_chu}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-info"
                      onClick={() => onViewDetail(pallet)}
                      title="Xem chi tiết"
                    >
                      <i className="icon-eye"></i>
                    </button>
                    {canPrint && (
                      <button
                        className="btn-icon btn-warning"
                        onClick={() => {
                          setSelectedQRPallet(pallet);
                          setShowQRModal(true);
                        }}
                        title="Xem QR Code"
                      >
                        <i className="icon-qr-code"></i>
                      </button>
                    )}
                    {canEdit && (
                      <button
                        className="btn-icon btn-primary"
                        onClick={() => console.log('Edit pallet:', pallet.id)}
                        title="Chỉnh sửa"
                      >
                        <i className="icon-edit"></i>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="btn-icon btn-danger"
                        onClick={async () => {
                          if (window.confirm(`Bạn có chắc muốn xóa pallet ${pallet.ma_pallet}?`)) {
                            try {
                              console.log('Deleting pallet:', pallet.id); // DEBUG
                              const response = await fetch(`http://127.0.0.1:8000/warehouse/pallet/${pallet.id}/`, {
                                method: 'DELETE',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                              });
                              if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                              }
                              setPallets(prev => prev.filter(p => p.id !== pallet.id));
                              alert('Đã xóa pallet thành công');
                            } catch (err) {
                              console.error('Error deleting pallet:', err); // DEBUG
                              alert('Có lỗi xảy ra khi xóa pallet');
                            }
                          }
                        }}
                        title="Xóa"
                      >
                        <i className="icon-trash-2"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <div className="pagination-info">
          <span>
            Hiển thị {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, filteredAndSortedPallets.length)} 
            trong tổng số {filteredAndSortedPallets.length} pallet
          </span>
          
          <select
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="page-size-selector"
          >
            <option value="10">10 / trang</option>
            <option value="25">25 / trang</option>
            <option value="50">50 / trang</option>
            <option value="100">100 / trang</option>
          </select>
        </div>
        
        <div className="pagination-controls">
          <button
            className="btn btn-secondary"
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            <i className="icon-chevrons-left"></i>
          </button>
          
          <button
            className="btn btn-secondary"
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            <i className="icon-chevron-left"></i>
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNumber = pagination.currentPage - 2 + i;
              if (pageNumber < 1 || pageNumber > pagination.totalPages) return null;
              
              return (
                <button
                  key={pageNumber}
                  className={`btn ${pageNumber === pagination.currentPage ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button
            className="btn btn-secondary"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            <i className="icon-chevron-right"></i>
          </button>
          
          <button
            className="btn btn-secondary"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.totalPages)}
          >
            <i className="icon-chevrons-right"></i>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedQRPallet && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3>QR Code - {selectedQRPallet.ma_pallet}</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedQRPallet(null);
                }}
              >
                <i className="icon-x"></i>
              </button>
            </div>
            
            <div className="qr-modal-body">
              <div className="qr-code-container">
                <QRCodeCanvas
                  value={generateQRData(selectedQRPallet)}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <div className="qr-info">
                <div className="qr-details">
                  <div className="detail-row">
                    <span className="label">Mã pallet:</span>
                    <span className="value">{selectedQRPallet.ma_pallet}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Sản phẩm:</span>
                    <span className="value">{selectedQRPallet.san_pham.ten_san_pham}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Số lượng:</span>
                    <span className="value">{selectedQRPallet.so_thung_con_lai} thùng</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Vị trí:</span>
                    <span className="value">{selectedQRPallet.vi_tri_kho?.ma_vi_tri || 'Chưa có'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Hạn sử dụng:</span>
                    <span className="value">{new Date(selectedQRPallet.han_su_dung).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="qr-modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedQRPallet(null);
                }}
              >
                Đóng
              </button>
              
              <button 
                className="btn btn-warning"
                onClick={() => {
                  // Print single QR
                  const printWindow = window.open('', '_blank');
                  const qrData = generateQRData(selectedQRPallet);
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>QR Code - ${selectedQRPallet.ma_pallet}</title>
                        <style>
                          body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            margin: 20px; 
                          }
                          .qr-container { 
                            border: 2px solid #000; 
                            padding: 20px; 
                            display: inline-block; 
                          }
                          h2 { margin: 0 0 10px 0; }
                          .info { margin-top: 15px; }
                        </style>
                      </head>
                      <body>
                        <div class="qr-container">
                          <h2>${selectedQRPallet.ma_pallet}</h2>
                          <div id="qr-placeholder">[QR Code sẽ được tạo ở đây]</div>
                          <div class="info">
                            <p><strong>Sản phẩm:</strong> ${selectedQRPallet.san_pham.ten_san_pham}</p>
                            <p><strong>Số lượng:</strong> ${selectedQRPallet.so_thung_con_lai} thùng</p>
                            <p><strong>Vị trí:</strong> ${selectedQRPallet.vi_tri_kho?.ma_vi_tri || 'N/A'}</p>
                          </div>
                        </div>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  setTimeout(() => printWindow.print(), 500);
                }}
              >
                <i className="icon-printer"></i>
                In QR
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // Download QR as image
                  const canvas = document.querySelector('.qr-modal canvas');
                  if (canvas) {
                    const link = document.createElement('a');
                    link.download = `QR-${selectedQRPallet.ma_pallet}.png`;
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

export default DanhSachPallet;