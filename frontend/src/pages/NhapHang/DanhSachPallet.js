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

  // Sample data for demonstration
  useEffect(() => {
    const loadSampleData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const samplePallets = [
          {
            id: 1,
            ma_pallet: 'P-2025-001',
            san_pham: {
              ten_san_pham: 'Bia Heineken 330ml',
              nhom_hang: 'Bia',
              ma_san_pham: 'SP-001'
            },
            so_thung_ban_dau: 100,
            so_thung_con_lai: 85,
            vi_tri_kho: { ma_vi_tri: 'A1', khu_vuc: 'A' },
            ngay_san_xuat: '2025-01-15',
            han_su_dung: '2025-07-15',
            ngay_kiem_tra_cl: '2025-06-15',
            trang_thai: 'Đã_mở',
            trong_luong_thung: 15.5,
            nguoi_tao: 'Nguyễn Văn A',
            created_at: '2025-01-20T08:30:00Z',
            ghi_chu: 'Lô mới, chất lượng tốt'
          },
          {
            id: 2,
            ma_pallet: 'P-2025-002',
            san_pham: {
              ten_san_pham: 'Coca Cola 355ml',
              nhom_hang: 'Nước ngọt',
              ma_san_pham: 'SP-002'
            },
            so_thung_ban_dau: 120,
            so_thung_con_lai: 120,
            vi_tri_kho: { ma_vi_tri: 'B2', khu_vuc: 'B' },
            ngay_san_xuat: '2025-01-10',
            han_su_dung: '2025-06-10',
            ngay_kiem_tra_cl: '2025-06-08',
            trang_thai: 'Mới',
            trong_luong_thung: 12.8,
            nguoi_tao: 'Trần Thị B',
            created_at: '2025-01-22T10:15:00Z',
            ghi_chu: ''
          },
          {
            id: 3,
            ma_pallet: 'P-2025-003',
            san_pham: {
              ten_san_pham: 'Nước suối Lavie 500ml',
              nhom_hang: 'Nước suối',
              ma_san_pham: 'SP-003'
            },
            so_thung_ban_dau: 80,
            so_thung_con_lai: 0,
            vi_tri_kho: { ma_vi_tri: 'C1', khu_vuc: 'C' },
            ngay_san_xuat: '2025-01-05',
            han_su_dung: '2025-12-05',
            ngay_kiem_tra_cl: '2025-07-05',
            trang_thai: 'Trống',
            trong_luong_thung: 10.2,
            nguoi_tao: 'Lê Văn C',
            created_at: '2025-01-25T14:20:00Z',
            ghi_chu: 'Đã xuất hết'
          },
          {
            id: 4,
            ma_pallet: 'P-2025-004',
            san_pham: {
              ten_san_pham: 'Tiger Beer 355ml',
              nhom_hang: 'Bia',
              ma_san_pham: 'SP-004'
            },
            so_thung_ban_dau: 90,
            so_thung_con_lai: 45,
            vi_tri_kho: { ma_vi_tri: 'A3', khu_vuc: 'A' },
            ngay_san_xuat: '2025-01-08',
            han_su_dung: '2025-06-08',
            ngay_kiem_tra_cl: '2025-06-06',
            trang_thai: 'Đã_mở',
            trong_luong_thung: 14.2,
            nguoi_tao: 'Phạm Văn D',
            created_at: '2025-01-28T09:45:00Z',
            ghi_chu: 'Cần kiểm tra CL sớm'
          }
        ];
        
        setPallets(samplePallets);
        setPagination(prev => ({
          ...prev,
          totalItems: samplePallets.length,
          totalPages: Math.ceil(samplePallets.length / prev.pageSize)
        }));
      } catch (err) {
        setError('Không thể tải danh sách pallet');
      } finally {
        setLoading(false);
      }
    };

    loadSampleData();
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

  const handleBulkDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedPallets.length} pallet đã chọn?`)) {
      setPallets(prev => prev.filter(p => !selectedPallets.includes(p.id)));
      setSelectedPallets([]);
      setShowBulkActions(false);
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
              <th 
                className={`sortable ${sorting.field === 'ma_pallet' ? sorting.direction : ''}`}
                onClick={() => handleSort('ma_pallet')}
              >
                Mã Pallet
                <i className="icon-chevron-down"></i>
              </th>
              <th 
                className={`sortable ${sorting.field === 'san_pham' ? sorting.direction : ''}`}
                onClick={() => handleSort('san_pham')}
              >
                Sản phẩm
                <i className="icon-chevron-down"></i>
              </th>
              <th className="center">Số lượng</th>
              <th 
                className={`sortable ${sorting.field === 'vi_tri' ? sorting.direction : ''}`}
                onClick={() => handleSort('vi_tri')}
              >
                Vị trí
                <i className="icon-chevron-down"></i>
              </th>
              <th 
                className={`sortable ${sorting.field === 'han_su_dung' ? sorting.direction : ''}`}
                onClick={() => handleSort('han_su_dung')}
              >
                Hạn sử dụng
                <i className="icon-chevron-down"></i>
              </th>
              <th 
                className={`sortable ${sorting.field === 'trang_thai' ? sorting.direction : ''}`}
                onClick={() => handleSort('trang_thai')}
              >
                Trạng thái
                <i className="icon-chevron-down"></i>
              </th>
              <th 
                className={`sortable ${sorting.field === 'created_at' ? sorting.direction : ''}`}
                onClick={() => handleSort('created_at')}
              >
                Ngày tạo
                <i className="icon-chevron-down"></i>
              </th>
              <th className="actions-col">Thao tác</th>
            </tr>
          </thead>
          
          <tbody>
            {paginatedPallets.map(pallet => {
              const statusInfo = getStatusInfo(pallet.trang_thai);
              const expiryInfo = getExpiryInfo(pallet.han_su_dung);
              const utilizationRate = (pallet.so_thung_con_lai / pallet.so_thung_ban_dau) * 100;
              
              return (
                <tr key={pallet.id} className={selectedPallets.includes(pallet.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPallets.includes(pallet.id)}
                      onChange={() => handleSelectPallet(pallet.id)}
                    />
                  </td>
                  
                  <td>
                    <div className="pallet-code">
                      <strong>{pallet.ma_pallet}</strong>
                      {pallet.ghi_chu && (
                        <i className="icon-message-circle note-indicator" title={pallet.ghi_chu}></i>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <div className="product-info">
                      <div className="product-name">{pallet.san_pham.ten_san_pham}</div>
                      <div className="product-group">{pallet.san_pham.nhom_hang}</div>
                    </div>
                  </td>
                  
                  <td className="center">
                    <div className="quantity-info">
                      <div className="quantity-text">
                        <strong>{pallet.so_thung_con_lai}</strong>/{pallet.so_thung_ban_dau}
                      </div>
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
                      <div className="quantity-percent">{utilizationRate.toFixed(0)}%</div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="location-info">
                      <span className="location-code">{pallet.vi_tri_kho?.ma_vi_tri || 'N/A'}</span>
                      {pallet.vi_tri_kho && (
                        <span className="location-area">Khu {pallet.vi_tri_kho.khu_vuc}</span>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <div className="expiry-info">
                      <div className="expiry-date">
                        {new Date(pallet.han_su_dung).toLocaleDateString('vi-VN')}
                      </div>
                      <div className={`expiry-status ${expiryInfo.color}`}>
                        {expiryInfo.type === 'expired' ? `Quá hạn ${expiryInfo.days} ngày` :
                         expiryInfo.type === 'expiring' ? `Còn ${expiryInfo.days} ngày` :
                         expiryInfo.type === 'warning' ? `Còn ${expiryInfo.days} ngày` :
                         `Còn ${expiryInfo.days} ngày`}
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <span className={`status-badge ${statusInfo.color}`}>
                      <i className={`icon-${statusInfo.icon}`}></i>
                      {statusInfo.text}
                    </span>
                  </td>
                  
                  <td>
                    <div className="date-info">
                      <div className="create-date">
                        {new Date(pallet.created_at).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="create-time">
                        {new Date(pallet.created_at).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </td>
                  
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
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa pallet ${pallet.ma_pallet}?`)) {
                              setPallets(prev => prev.filter(p => p.id !== pallet.id));
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
              );
            })}
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