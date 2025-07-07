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
  const [orderList, setOrderList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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

  // Khi vào tab 'danh-sach-don', trigger gọi 2 API song song
  useEffect(() => {
    if (activeTab === 'danh-sach-don') {
      fetchOrdersAndStores();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchOrdersAndStores = async () => {
    setLoadingOrders(true);
    try {
      // Gọi song song
      const [storeRes, orderRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/orders/cuahang/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('http://127.0.0.1:8000/api/orders/donxuat/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      if (!storeRes.ok || !orderRes.ok) throw new Error('Lỗi lấy dữ liệu');
      const storeData = await storeRes.json();
      const orderData = await orderRes.json();
      const stores = (storeData.results || storeData).map(s => ({ id: s.id, ten_cua_hang: s.ten_cua_hang }));
      const storeMap = {};
      stores.forEach(s => { storeMap[s.id] = s.ten_cua_hang; });
      const ordersRaw = orderData.results || orderData;
      // Lọc và nối dữ liệu
      const orders = ordersRaw
        .filter(o => storeMap[o.cua_hang])
        .map(o => ({
          ma_don: o.ma_don,
          cua_hang: o.cua_hang,
          ten_cua_hang: storeMap[o.cua_hang],
          ngay_tao: o.ngay_tao,
          ngay_giao: o.ngay_giao,
          ghi_chu: o.ghi_chu
        }));
      setOrderList(orders);
    } catch (err) {
      setOrderList([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadExportData = async () => {
    setLoading(true);
    try {
      // TODO: Gọi API thực tế để lấy dữ liệu đơn xuất hàng ở đây
      // Ví dụ:
      // const response = await fetch('/api/export-orders');
      // const data = await response.json();
      // setExportData(prev => ({ ...prev, orders: data.orders, ... }));

      // Hiện tại để orders là mảng rỗng
      setExportData(prev => ({
        ...prev,
        orders: [],
        stats: {
          totalOrders: 0,
          pendingOrders: 0,
          inProgressOrders: 0,
          completedOrders: 0
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
        {activeTab === 'danh-sach-don' ? (
          <div className="order-list-table-container">
            <table className="order-list-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Cửa hàng</th>
                  <th>Ngày tạo</th>
                  <th>Ngày giao</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <tr><td colSpan={5} style={{textAlign:'center'}}>Đang tải dữ liệu...</td></tr>
                ) : orderList.length === 0 ? (
                  <tr><td colSpan={5} style={{textAlign:'center'}}>Không có dữ liệu</td></tr>
                ) : orderList.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.ma_don}</td>
                    <td>{order.ten_cua_hang}</td>
                    <td>{order.ngay_tao}</td>
                    <td>{order.ngay_giao}</td>
                    <td>{order.ghi_chu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default XuatHang;