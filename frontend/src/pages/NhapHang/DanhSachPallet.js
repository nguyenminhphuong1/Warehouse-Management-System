// frontend/src/pages/NhapHang/DanhSachPallet.js

import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './DanhSachPallet.css';
import api from '../../services/api';

const DanhSachPallet = ({ onViewDetail, canEdit, canDelete, canPrint, canExport }) => {
  const [pallets, setPallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPallets, setSelectedPallets] = useState([]);
  //const [showBulkActions, setShowBulkActions] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRPallet, setSelectedQRPallet] = useState(null);
  const [printQRData, setPrintQRData] = useState(null);
  const [showPrintQRModal, setShowPrintQRModal] = useState(false);
  const [showCreateQRModal, setShowCreateQRModal] = useState(false);
  const [createQRUrl, setCreateQRUrl] = useState('');
  const [createQRMaPallet, setCreateQRMaPallet] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
        // Sử dụng axios instance đã cấu hình baseURL và interceptor
        const response = await api.get('/warehouse/pallet/get_dict/');
        const data = response.data;
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
        (pallet.ma_pallet ? pallet.ma_pallet.toLowerCase() : '').includes(searchLower) ||
        (pallet.ten ? pallet.ten.toLowerCase() : '') .includes(searchLower) ||
        (pallet.san_pham && pallet.san_pham.ten ? pallet.san_pham.ten.toLowerCase() : '').includes(searchLower) ||
        (pallet.ghi_chu ? pallet.ghi_chu.toLowerCase() : '').includes(searchLower)
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
        (pallet.ten ? pallet.ten.toLowerCase() : '').includes(filters.san_pham.toLowerCase()) ||
        (pallet.san_pham && pallet.san_pham.ten ? pallet.san_pham.ten.toLowerCase() : '').includes(filters.san_pham.toLowerCase())
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
        aValue = a.san_pham.ten;
        bValue = b.san_pham.ten;
      } else if (sorting.field === 'vi_tri') {
        aValue = a.vi_tri_kho || '';
        bValue = b.vi_tri_kho || '';
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
    console.log('Chọn pallet:', palletId);
    setSelectedPallets(prev => {
      const newSelection = prev.includes(palletId)
        ? prev.filter(id => id !== palletId)
        : [...prev, palletId];
      
      //setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    console.log('Chọn tất cả pallet trang hiện tại');
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
    console.log('Exporting:', selectedData);
  };

  const handleBulkPrint = () => {
    const selectedData = pallets.filter(p => selectedPallets.includes(p.id));
    console.log('Printing:', selectedData);
  };

  // const handleBulkDelete = async () => {
  //   if (window.confirm(`Bạn có chắc muốn xóa ${selectedPallets.length} pallet đã chọn?`)) {
  //     try {
  //       console.log('Bulk deleting pallets:', selectedPallets); // DEBUG
  //       const response = await fetch('http://127.0.0.1:8000/warehouse/pallet/bulk-delete/', {
  //         method: 'DELETE',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         },
  //         body: JSON.stringify({ pallet_ids: selectedPallets })
  //       });
        
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
        
  //       // Remove from local state after successful API call
  //       setPallets(prev => prev.filter(p => !selectedPallets.includes(p.id)));
  //       setSelectedPallets([]);
  //       setShowBulkActions(false);
        
  //       alert('Đã xóa thành công các pallet đã chọn');
  //     } catch (err) {
  //       console.error('Error deleting pallets:', err); // DEBUG
  //       alert('Có lỗi xảy ra khi xóa pallet');
  //     }
  //   }
  // };

  // Xử lý chọn 1 pallet (single select)
  const handleSelectSinglePallet = (palletId) => {
    setSelectedId(prev => prev === palletId ? null : palletId);
  };

  // Sửa hàm handleDeletePallet nhận vào id
  const handleDeletePallet = async (id) => {
    console.log('Thực hiện xoá pallet:', id);
    if (!id) return;
    try {
      const confirmed = window.confirm('Bạn có chắc chắn muốn xoá pallet này?');
      if (!confirmed) {
        console.log('Huỷ xoá pallet:', id);
        return;
      }
      // Gọi DELETE API đúng baseURL (8001)
      const response = await api.delete(`/warehouse/pallet/${id}/`);
      // axios trả về 204 hoặc 200 là thành công
      if (![200, 204].includes(response.status)) throw new Error('Lỗi xoá pallet');
      setPallets(prev => prev.filter(p => p.id !== id));
      alert('Đã xoá pallet thành công!');
      console.log('Đã xoá pallet thành công:', id);
    } catch (err) {
      // Kiểm tra lỗi liên quan đến ProtectedError hoặc lịch sử xuất/nhập
      if (
        (err.response && err.response.data && typeof err.response.data === 'string' && err.response.data.includes('ProtectedError')) ||
        (err.response && err.response.status === 500 && err.response.data && typeof err.response.data === 'string' && err.response.data.includes('LichSuXuatNhap'))
      ) {
        alert('Không thể xóa pallet này vì liên quan tới dữ liệu lịch sử xuất nhập. Vui lòng xoá lịch sử xuất/nhập của Pallet trước!');
      } else {
        alert('Có lỗi khi xoá pallet!');
      }
      console.error('Lỗi khi xoá pallet:', err);
    }
  };

  const handleDeleteLichSuPallet = async (palletId) => {
    if (!palletId) return;
    const confirmed = window.confirm('Bạn có chắc chắn muốn xoá toàn bộ lịch sử xuất/nhập của pallet này?');
    if (!confirmed) return;
    try {
      // 1. Lấy danh sách lịch sử xuất/nhập của pallet
      const res = await api.get(`/orders/lichsuxuatnhap/?pallet_id=${palletId}`);
      const lichSuList = res.data.results || res.data;
      if (!lichSuList.length) {
        alert('Không có lịch sử xuất/nhập để xoá!');
        return;
      }
      // 2. Xoá từng bản ghi theo id
      for (const lichSu of lichSuList) {
        await api.delete(`/orders/lichsuxuatnhap/${lichSu.id}/`);
      }
      alert('Đã xoá toàn bộ lịch sử xuất/nhập của pallet thành công!');
      window.location.reload();
    } catch (err) {
      alert('Có lỗi khi xoá lịch sử xuất/nhập của pallet!');
      console.error('Lỗi khi xoá lịch sử xuất/nhập pallet:', err);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    console.log('Chuyển trang:', page);
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size) => {
    console.log('Đổi số dòng/trang:', size);
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
      san_pham: pallet.san_pham.ten,
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
              placeholder="Tìm kiếm theo mã pallet, sản phẩm, ghi chú..."
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
            placeholder="Tên sản phẩm..."
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
      {/* {showBulkActions && (
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
                Tạo QR
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
      )} */}

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
              <th>Vị trí</th>
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
                <td>{pallet.san_pham.ten}</td>
                <td>{pallet.vi_tri_kho}</td>
                <td>{pallet.ghi_chu}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-info"
                      onClick={async (e) => {
                        console.log('Xem chi tiết pallet:', pallet.id);
                        e.stopPropagation();
                        try {
                          const response = await api.get(`/warehouse/pallet/${pallet.id}/`);
                          if (response.status !== 200) {
                            throw new Error(`Lỗi lấy chi tiết pallet: ${response.status}`);
                          }
                          const data = response.data;
                          setSelectedQRPallet(data);
                          setShowQRModal(true);
                          console.log('Đã xem chi tiết pallet:', pallet.id);
                        } catch (err) {
                          alert('Không lấy được chi tiết pallet!');
                          console.error('Lỗi lấy chi tiết pallet:', err);
                        }
                      }}
                      title="Xem chi tiết"
                    >
                      <i className="icon-eye"></i> Xem chi tiết
                    </button>
                    <button
                      className="btn-icon btn-info"
                      onClick={async (e) => {
                        console.log('Xem QR code pallet:', pallet.id);
                        e.stopPropagation();
                        try {
                          const response = await api.get(`/warehouse/pallet/${pallet.id}/qr_code/`);
                          if (response.status !== 200) {
                            throw new Error(`Lỗi lấy QR Code: ${response.status}`);
                          }
                          const data = response.data;
                          if (data.qr_code_url) {
                            setCreateQRUrl(`http://127.0.0.1:8001${data.qr_code_url}`);
                            setCreateQRMaPallet(pallet.ma_pallet || data.ma_pallet || '');
                            setShowCreateQRModal(true);
                            console.log('Đã xem và in QR code pallet:', pallet.id);
                          } else {
                            alert('Không nhận được đường dẫn QR code!');
                            console.error('Không nhận được đường dẫn QR code!');
                          }
                        } catch (err) {
                          alert('Lấy QR Code thất bại!');
                          console.error('Lấy QR Code thất bại:', err);
                        }
                      }}
                      title="Xem và in QR Code cho pallet này"
                    >
                      <i className="icon-qr-code"></i> QR Code
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDeletePallet(pallet.id)}
                      title="Xoá pallet này"
                    >
                      <i className="icon-trash-2"></i> Xoá
                    </button>
                    {/* Nút xoá lịch sử pallet */}
                    <button
                      className="btn-icon btn-warning"
                      onClick={() => handleDeleteLichSuPallet(pallet.id)}
                      title="Xoá lịch sử xuất/nhập của pallet này"
                    >
                      <i className="icon-trash"></i> Xoá lịch sử Pallet
                    </button>
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

      {/* Modal hiển thị chi tiết pallet */}
      {showQRModal && selectedQRPallet && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3>Chi tiết Pallet - {selectedQRPallet.ma_pallet}</h3>
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
              <div className="qr-info">
                <table className="detail-table">
                  <tbody>
                    {Object.entries(selectedQRPallet).map(([key, value]) => {
                      const fieldMap = {
                        id: 'ID',
                        ma_pallet: 'Mã Pallet',
                        san_pham: 'Sản phẩm',
                        nha_cung_cap: 'Nhà cung cấp',
                        vi_tri_kho: 'Vị trí',
                        so_thung_ban_dau: 'Số thùng ban đầu',
                        so_thung_con_lai: 'Số thùng còn lại',
                        han_su_dung: 'Hạn sử dụng',
                        ngay_san_xuat: 'Ngày sản xuất',
                        ngay_kiem_tra_cl: 'Ngày kiểm tra CL',
                        trong_luong_thung: 'Trọng lượng/thùng (kg)',
                        chieu_dai: 'Chiều dài (cm)',
                        chieu_rong: 'Chiều rộng (cm)',
                        chieu_cao: 'Chiều cao (cm)',
                        nhiet_do_bao_quan: 'Nhiệt độ bảo quản (°C)',
                        do_am_bao_quan: 'Độ ẩm bảo quản (%)',
                        nguoi_tao: 'Người tạo',
                        created_at: 'Ngày tạo',
                        ngay_nhap_kho: 'Ngày nhập kho',
                        trang_thai: 'Trạng thái',
                        lo_san_xuat: 'Lô sản xuất',
                        so_phieu_nhap: 'Số phiếu nhập',
                        ghi_chu: 'Ghi chú',
                        qr_code_url: 'QR Code',
                        qr_code: 'QR Code',
                      };
                      let displayValue = value;
                      if (typeof value === 'object' && value !== null) {
                        if (value.san_pham.ten) displayValue = value.san_pham.ten;
                        else if (value.ten_nha_cung_cap) displayValue = value.ten_nha_cung_cap;
                        else if (value.ma_vi_tri) displayValue = value.ma_vi_tri;
                        else displayValue = JSON.stringify(value);
                      }
                      if (key === 'qr_code_url' && value) {
                        displayValue = <a href={`http://127.0.0.1:8001${value}`} target="_blank" rel="noopener noreferrer">Xem QR</a>;
                      }
                      return (
                        <tr key={key}>
                          <td className="detail-label">{fieldMap[key] || key}</td>
                          <td className="detail-value">{displayValue}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {selectedQRPallet.qr_code_url && (
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        console.log('Tạo QR từ URL:', selectedQRPallet.qr_code_url);
                        window.open(`http://127.0.0.1:8001${selectedQRPallet.qr_code_url}`, '_blank');
                      }}
                    >
                      Tạo QR
                    </button>
                  </div>
                )}
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
            </div>
          </div>
        </div>
      )}

      {/* Modal in QR code */}
      {showPrintQRModal && printQRData && (
        <div className="qr-modal">
          <div className="qr-modal-content qr-modal-print">
            <div className="qr-modal-header">
              <h3>In QR Code - {printQRData.ma_pallet || printQRData.id}</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowPrintQRModal(false);
                  setPrintQRData(null);
                }}
              >
                <i className="icon-x"></i>
              </button>
            </div>
            <div className="qr-modal-body" style={{ textAlign: 'center' }}>
              {printQRData.qr_code_url ? (
                <img
                  src={`http://127.0.0.1:8001${printQRData.qr_code_url}`}
                  alt="QR Code"
                  style={{ width: 256, height: 256 }}
                />
              ) : printQRData.qr_code ? (
                <QRCodeCanvas value={printQRData.qr_code} size={256} />
              ) : (
                <p>Không có dữ liệu QR code.</p>
              )}
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPrintQRModal(false);
                    setPrintQRData(null);
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateQRModal && createQRUrl && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3>QR Code - {createQRMaPallet}</h3>
              <button
                className="close-button"
                onClick={() => {
                  setShowCreateQRModal(false);
                  setCreateQRUrl('');
                  setCreateQRMaPallet('');
                }}
              >
                <i className="icon-x"></i>
              </button>
            </div>
            <div className="qr-modal-body" style={{ textAlign: 'center' }}>
              <img
                src={createQRUrl}
                alt="QR Code"
                style={{ width: 256, height: 256 }}
                className="qr-print-image"
              />
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateQRModal(false);
                    setCreateQRUrl('');
                    setCreateQRMaPallet('');
                  }}
                >
                  Đóng
                </button>
                <button
                  className="btn btn-info"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    // Tạo thẻ a ẩn để download ảnh
                    const link = document.createElement('a');
                    link.href = createQRUrl;
                    link.download = `${createQRMaPallet || 'qr_code'}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Save QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DanhSachPallet;