// src/pages/XuatHang/XuatHang.js - Module 3: Xuất Hàng Main Component

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './XuatHang.css';

// Import các components con
import DanhSachDon from './DanhSachDon';
import XuatHangChiTiet from './XuatHangChiTiet';
import SapXepThuTu from './SapXepThuTu';
import InQRDon from './InQRDon';

// Import common components (sẽ được tạo sau)
// import { Loading, Toast, Modal, ConfirmDialog } from '../../components/common';

const XuatHang = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('danh-sach-don');

  // State cho module xuất hàng
  const [exportData, setExportData] = useState({
    orders: [],
    selectedOrders: [],
    exportProgress: {},
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      inProgressOrders: 0,
      completedOrders: 0
    }
  });

  useEffect(() => {
    // Set active tab dựa trên route
    const path = location.pathname.split('/').pop();
    if (path && path !== 'xuat-hang') {
      setActiveTab(path);
    } else {
      setActiveTab('danh-sach-don');
    }
  }, [location]);

  useEffect(() => {
    // Load dữ liệu xuất hàng
    loadExportData();
  }, []);

  const loadExportData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockOrders = [
        {
          id: 'DX001',
          code: 'DX-2025-001',
          storeName: 'Cửa hàng Hà Nội 1',
          storeAddress: '123 Phố Huế, Hai Bà Trưng, Hà Nội',
          totalItems: 25,
          totalQuantity: 150,
          status: 'pending',
          priority: 'high',
          createdDate: '2025-01-15',
          requestedDate: '2025-01-16',
          estimatedTime: 120,
          items: [
            { productId: 'SP001', productName: 'Sản phẩm A', quantity: 50, unit: 'Thùng' },
            { productId: 'SP002', productName: 'Sản phẩm B', quantity: 30, unit: 'Thùng' },
            { productId: 'SP003', productName: 'Sản phẩm C', quantity: 70, unit: 'Thùng' }
          ]
        },
        {
          id: 'DX002',
          code: 'DX-2025-002',
          storeName: 'Cửa hàng TP.HCM 2',
          storeAddress: '456 Nguyễn Huệ, Quận 1, TP.HCM',
          totalItems: 18,
          totalQuantity: 95,
          status: 'in_progress',
          priority: 'medium',
          createdDate: '2025-01-15',
          requestedDate: '2025-01-17',
          estimatedTime: 90,
          progress: 35,
          items: [
            { productId: 'SP004', productName: 'Sản phẩm D', quantity: 45, unit: 'Thùng' },
            { productId: 'SP005', productName: 'Sản phẩm E', quantity: 50, unit: 'Thùng' }
          ]
        },
        {
          id: 'DX003',
          code: 'DX-2025-003',
          storeName: 'Cửa hàng Đà Nẵng 1',
          storeAddress: '789 Trần Phú, Hải Châu, Đà Nẵng',
          totalItems: 32,
          totalQuantity: 200,
          status: 'completed',
          priority: 'low',
          createdDate: '2025-01-14',
          requestedDate: '2025-01-15',
          completedDate: '2025-01-15',
          estimatedTime: 150,
          actualTime: 135,
          items: [
            { productId: 'SP006', productName: 'Sản phẩm F', quantity: 80, unit: 'Thùng' },
            { productId: 'SP007', productName: 'Sản phẩm G', quantity: 60, unit: 'Thùng' },
            { productId: 'SP008', productName: 'Sản phẩm H', quantity: 60, unit: 'Thùng' }
          ]
        }
      ];

      setExportData(prev => ({
        ...prev,
        orders: mockOrders,
        stats: {
          totalOrders: mockOrders.length,
          pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
          inProgressOrders: mockOrders.filter(o => o.status === 'in_progress').length,
          completedOrders: mockOrders.filter(o => o.status === 'completed').length
        }
      }));

    } catch (error) {
      console.error('Error loading export data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/xuat-hang/${tabKey}`);
  };

  const handleStartExport = async (orderId) => {
    try {
      setExportData(prev => ({
        ...prev,
        exportProgress: {
          ...prev.exportProgress,
          [orderId]: { status: 'starting', progress: 0 }
        }
      }));

      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportData(prev => ({
          ...prev,
          exportProgress: {
            ...prev.exportProgress,
            [orderId]: { status: 'in_progress', progress: i }
          }
        }));
      }

      // Update order status
      setExportData(prev => ({
        ...prev,
        orders: prev.orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'in_progress', progress: 100 }
            : order
        ),
        exportProgress: {
          ...prev.exportProgress,
          [orderId]: { status: 'completed', progress: 100 }
        }
      }));

    } catch (error) {
      console.error('Error starting export:', error);
      setExportData(prev => ({
        ...prev,
        exportProgress: {
          ...prev.exportProgress,
          [orderId]: { status: 'error', progress: 0 }
        }
      }));
    }
  };

  const handleCompleteExport = (orderId) => {
    setExportData(prev => ({
      ...prev,
      orders: prev.orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'completed', completedDate: new Date().toISOString().split('T')[0] }
          : order
      )
    }));
  };

  const tabs = [
    {
      key: 'danh-sach-don',
      label: '📋 Danh sách đơn',
      icon: '📋',
      description: 'Quản lý đơn xuất hàng'
    },
    {
      key: 'xuat-hang-chi-tiet',
      label: '📦 Xuất hàng chi tiết',
      icon: '📦',
      description: 'Quy trình xuất hàng'
    },
    {
      key: 'sap-xep-thu-tu',
      label: '🔄 Sắp xếp thứ tự',
      icon: '🔄',
      description: 'Tối ưu tuyến đường'
    },
    {
      key: 'in-qr-don',
      label: '🖨️ In QR đơn',
      icon: '🖨️',
      description: 'In mã QR cho đơn hàng'
    }
  ];

  if (loading) {
    return (
      <div className="xuat-hang-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu xuất hàng...</p>
      </div>
    );
  }

  return (
    <div className="xuat-hang-container">
      {/* Header */}
      <div className="xuat-hang-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">
              <span className="title-icon">🚚</span>
              Xuất Hàng
            </h1>
            <p className="page-subtitle">
              Quản lý quy trình xuất hàng và giao hàng
            </p>
          </div>

          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-number">{exportData.stats.totalOrders}</div>
                <div className="stat-label">Tổng đơn</div>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{exportData.stats.pendingOrders}</div>
                <div className="stat-label">Chờ xuất</div>
              </div>
            </div>
            <div className="stat-card in-progress">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-number">{exportData.stats.inProgressOrders}</div>
                <div className="stat-label">Đang xuất</div>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{exportData.stats.completedOrders}</div>
                <div className="stat-label">Hoàn thành</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="xuat-hang-nav">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-description">{tab.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="xuat-hang-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <DanhSachDon 
                orders={exportData.orders}
                onStartExport={handleStartExport}
                onCompleteExport={handleCompleteExport}
                exportProgress={exportData.exportProgress}
              />
            } 
          />
          <Route 
            path="/danh-sach-don" 
            element={
              <DanhSachDon 
                orders={exportData.orders}
                onStartExport={handleStartExport}
                onCompleteExport={handleCompleteExport}
                exportProgress={exportData.exportProgress}
              />
            } 
          />
          <Route 
            path="/xuat-hang-chi-tiet/*" 
            element={
              <XuatHangChiTiet 
                orders={exportData.orders}
                exportProgress={exportData.exportProgress}
              />
            } 
          />
          <Route 
            path="/sap-xep-thu-tu" 
            element={
              <SapXepThuTu 
                orders={exportData.orders.filter(o => o.status === 'pending')}
              />
            } 
          />
          <Route 
            path="/in-qr-don" 
            element={
              <InQRDon 
                orders={exportData.orders}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default XuatHang;