// frontend/src/pages/NhapHang/NhapHang.js

import React, { useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import ThemPallet from './ThemPallet';
import DanhSachPallet from './DanhSachPallet';
import ChiTietPallet from './ChiTietPallet';
import WarehouseGrid from '../../components/warehouse/WarehouseGrid';
import Toast from '../../components/common/Toast';
import './NhapHang.css';

const NhapHang = () => {
  const { canPerformAction } = usePermissions();
  
  // State management
  const [activeTab, setActiveTab] = useState('danh-sach');
  const [pallets, setPallets] = useState([]);
  const [selectedPallet, setSelectedPallet] = useState(null);
  const [warehouseAreas, setWarehouseAreas] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    trang_thai: 'all',
    khu_vuc: 'all',
    san_pham: 'all',
    han_su_dung: 'all'
  });
  
  const [statistics, setStatistics] = useState({
    total_pallets: 0,
    pallets_moi: 0,
    pallets_da_mo: 0,
    pallets_sap_het_han: 0,
    total_boxes: 0,
    utilization_rate: 0
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 5000);
  };

  const handleCreatePallet = (palletData) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPallet = {
        id: pallets.length + 1,
        ma_pallet: `P-2024-${String(pallets.length + 1).padStart(3, '0')}`,
        ...palletData,
        trang_thai: 'Mới',
        created_at: new Date().toISOString()
      };
      
      setPallets([newPallet, ...pallets]);
      setStatistics(prev => ({
        ...prev,
        total_pallets: prev.total_pallets + 1,
        pallets_moi: prev.pallets_moi + 1,
        total_boxes: prev.total_boxes + newPallet.so_thung_ban_dau
      }));
      
      setActiveTab('danh-sach');
      showToast('success', `Tạo pallet ${newPallet.ma_pallet} thành công!`);
      setLoading(false);
    }, 1500);
  };

  const handleEditPallet = (id, updates) => {
    setPallets(pallets.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('success', 'Cập nhật pallet thành công!');
  };

  const handleDeletePallet = (id) => {
    const pallet = pallets.find(p => p.id === id);
    setPallets(pallets.filter(p => p.id !== id));
    setStatistics(prev => ({
      ...prev,
      total_pallets: prev.total_pallets - 1,
      total_boxes: prev.total_boxes - pallet.so_thung_con_lai
    }));
    showToast('success', 'Xóa pallet thành công!');
  };

  const handleViewPallet = (pallet) => {
    setSelectedPallet(pallet);
    setActiveTab('chi-tiet');
  };

  const filteredPallets = pallets.filter(pallet => {
    const matchSearch = !filters.search || 
      pallet.ma_pallet.toLowerCase().includes(filters.search.toLowerCase()) ||
      pallet.san_pham.ten_san_pham.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchStatus = filters.trang_thai === 'all' || pallet.trang_thai === filters.trang_thai;
    const matchArea = filters.khu_vuc === 'all' || pallet.vi_tri_kho?.khu_vuc === filters.khu_vuc;
    const matchProduct = filters.san_pham === 'all' || pallet.san_pham.id === parseInt(filters.san_pham);
    
    let matchExpiry = true;
    if (filters.han_su_dung !== 'all') {
      const today = new Date();
      const expiry = new Date(pallet.han_su_dung);
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      
      switch (filters.han_su_dung) {
        case 'het_han':
          matchExpiry = diffDays < 0;
          break;
        case 'sap_het_han':
          matchExpiry = diffDays >= 0 && diffDays <= 7;
          break;
        case 'can_theo_doi':
          matchExpiry = diffDays > 7 && diffDays <= 30;
          break;
        default:
          matchExpiry = true;
      }
    }
    
    return matchSearch && matchStatus && matchArea && matchProduct && matchExpiry;
  });

  if (!canPerformAction('nhap_hang', 'view')) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <i className="icon-lock"></i>
          <h3>Không có quyền truy cập</h3>
          <p>Bạn không có quyền truy cập module Nhập hàng.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nhap-hang">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <i className="icon-package"></i>
            Module 1: Nhập Hàng
          </h1>
          <p>Quản lý nhập kho, tạo pallet và theo dõi vị trí lưu trữ</p>
        </div>
        
        {canPerformAction('nhap_hang', 'create') && (
          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('them-moi')}
          >
            <i className="icon-plus"></i>
            Nhập hàng mới
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      {/* <div className="statistics-section">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <i className="icon-package"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.total_pallets}</h3>
              <p>Tổng Pallet</p>
            </div>
          </div>
          
          <div className="stat-card new">
            <div className="stat-icon">
              <i className="icon-plus-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.pallets_moi}</h3>
              <p>Pallet Mới</p>
            </div>
          </div>
          
          <div className="stat-card opened">
            <div className="stat-icon">
              <i className="icon-box"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.pallets_da_mo}</h3>
              <p>Đã Mở</p>
            </div>
          </div>
          
          <div className="stat-card expiring">
            <div className="stat-icon">
              <i className="icon-alert-triangle"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.pallets_sap_het_han}</h3>
              <p>Sắp Hết Hạn</p>
            </div>
          </div>
          
          <div className="stat-card boxes">
            <div className="stat-icon">
              <i className="icon-layers"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.total_boxes.toLocaleString()}</h3>
              <p>Tổng Thùng</p>
            </div>
          </div>
          
          <div className="stat-card utilization">
            <div className="stat-icon">
              <i className="icon-trending-up"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.utilization_rate}%</h3>
              <p>Sử Dụng Kho</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Navigation Tabs */}
      <div className="tabs-section">
        <div className="tabs-nav">
          <button 
            className={`tab-button ${activeTab === 'danh-sach' ? 'active' : ''}`}
            onClick={() => setActiveTab('danh-sach')}
          >
            <i className="icon-list"></i>
            Danh sách Pallet
          </button>
          
          {canPerformAction('nhap_hang', 'create') && (
            <button 
              className={`tab-button ${activeTab === 'them-moi' ? 'active' : ''}`}
              onClick={() => setActiveTab('them-moi')}
            >
              <i className="icon-plus"></i>
              Nhập hàng mới
            </button>
          )}
          
          <button 
            className={`tab-button ${activeTab === 'kho' ? 'active' : ''}`}
            onClick={() => setActiveTab('kho')}
          >
            <i className="icon-warehouse"></i>
            Sơ đồ kho
          </button>
          
          {activeTab === 'chi-tiet' && selectedPallet && (
            <button className="tab-button active">
              <i className="icon-eye"></i>
              Chi tiết: {selectedPallet.ma_pallet}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {activeTab === 'danh-sach' && (
          <DanhSachPallet
            pallets={filteredPallets}
            loading={loading}
            filters={filters}
            onFiltersChange={setFilters}
            onView={handleViewPallet}
            onEdit={handleEditPallet}
            onDelete={handleDeletePallet}
            canEdit={canPerformAction('nhap_hang', 'edit')}
            canDelete={canPerformAction('nhap_hang', 'delete')}
            products={products}
            warehouseAreas={warehouseAreas}
          />
        )}
        
        {activeTab === 'them-moi' && (
          <ThemPallet
            onSubmit={handleCreatePallet}
            onCancel={() => setActiveTab('danh-sach')}
            products={products}
            suppliers={suppliers}
            warehouseAreas={warehouseAreas}
            loading={loading}
          />
        )}
        
        {activeTab === 'kho' && (
          <WarehouseGrid />
        )}
        
        {activeTab === 'chi-tiet' && selectedPallet && (
          <ChiTietPallet
            pallet={selectedPallet}
            onEdit={handleEditPallet}
            onBack={() => setActiveTab('danh-sach')}
            canEdit={canPerformAction('nhap_hang', 'edit')}
            canPrint={canPerformAction('nhap_hang', 'print')}
          />
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: '', message: '' })}
        />
      )}
    </div>
  );
};

export default NhapHang;