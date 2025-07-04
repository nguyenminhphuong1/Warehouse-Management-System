// src/pages/QuanLyKho/QuanLyKho.js - Module 4: Quản Lý Kho Main Component

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './QuanLyKho.css';

// Import các components con
import BaoTri from './BaoTri';
import CaiDat from './CaiDat';
import KiemKe from './KiemKe';
import QuanLyHangHoa from './QuanLyHangHoa';
import QuanLyViTri from './QuanLyViTri';
import TinhTrangHang from './TinhTrangHang';

const QuanLyKho = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quan-ly-hang-hoa');

  // State cho module quản lý kho
  const [warehouseData, setWarehouseData] = useState({
    locations: [],
    products: [],
    inventory: [],
    maintenance: [],
    inspections: [],
    settings: {},
    stats: {
      totalLocations: 0,
      occupiedLocations: 0,
      totalProducts: 0,
      lowStockProducts: 0,
      maintenanceRequired: 0,
      pendingInspections: 0
    }
  });

  useEffect(() => {
    // Set active tab dựa trên route
    const path = location.pathname.split('/').pop();
    if (path && path !== 'quan-ly-kho') {
      setActiveTab(path);
    } else {
      setActiveTab('quan-ly-hang-hoa');
    }
  }, [location]);

  useEffect(() => {
    // Load dữ liệu quản lý kho
    loadWarehouseData();
  }, []);

  const loadWarehouseData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // // Mock data
      // const mockData = {
      //   locations: [
      //     {
      //       id: 'L001',
      //       code: 'A-01-01',
      //       zone: 'A',
      //       aisle: '01',
      //       rack: '01',
      //       level: 1,
      //       type: 'standard',
      //       status: 'occupied',
      //       capacity: 100,
      //       currentLoad: 85,
      //       lastUpdated: '2025-01-15T10:30:00Z',
      //       maintenanceStatus: 'good'
      //     },
      //     {
      //       id: 'L002',
      //       code: 'A-01-02',
      //       zone: 'A',
      //       aisle: '01',
      //       rack: '02',
      //       level: 1,
      //       type: 'standard',
      //       status: 'available',
      //       capacity: 100,
      //       currentLoad: 0,
      //       lastUpdated: '2025-01-15T09:15:00Z',
      //       maintenanceStatus: 'good'
      //     },
      //     {
      //       id: 'L003',
      //       code: 'B-02-01',
      //       zone: 'B',
      //       aisle: '02',
      //       rack: '01',
      //       level: 2,
      //       type: 'heavy',
      //       status: 'maintenance',
      //       capacity: 200,
      //       currentLoad: 0,
      //       lastUpdated: '2025-01-14T14:20:00Z',
      //       maintenanceStatus: 'requires_attention'
      //     }
      //   ],
      //   products: [
      //     {
      //       id: 'P001',
      //       sku: 'SKU001',
      //       name: 'Sản phẩm A',
      //       category: 'Electronics',
      //       unit: 'Thùng',
      //       minStock: 50,
      //       maxStock: 500,
      //       currentStock: 25,
      //       reservedStock: 10,
      //       availableStock: 15,
      //       lastRestocked: '2025-01-10',
      //       expiryDate: '2025-06-15',
      //       supplier: 'Nhà cung cấp 1',
      //       cost: 150000,
      //       status: 'low_stock'
      //     },
      //     {
      //       id: 'P002',
      //       sku: 'SKU002',
      //       name: 'Sản phẩm B',
      //       category: 'Food',
      //       unit: 'Thùng',
      //       minStock: 30,
      //       maxStock: 300,
      //       currentStock: 120,
      //       reservedStock: 20,
      //       availableStock: 100,
      //       lastRestocked: '2025-01-12',
      //       expiryDate: '2025-03-20',
      //       supplier: 'Nhà cung cấp 2',
      //       cost: 80000,
      //       status: 'in_stock'
      //     }
      //   ],
      //   maintenance: [
      //     {
      //       id: 'M001',
      //       locationId: 'L003',
      //       locationCode: 'B-02-01',
      //       type: 'preventive',
      //       priority: 'high',
      //       status: 'pending',
      //       description: 'Kiểm tra và bảo trì kệ hàng',
      //       scheduledDate: '2025-01-16',
      //       estimatedDuration: 120,
      //       assignedTo: 'Nguyễn Văn A',
      //       equipment: ['Kệ hàng', 'Hệ thống nâng'],
      //       notes: 'Phát hiện tiếng kêu bất thường'
      //     },
      //     {
      //       id: 'M002',
      //       locationId: 'L001',
      //       locationCode: 'A-01-01',
      //       type: 'corrective',
      //       priority: 'medium',
      //       status: 'completed',
      //       description: 'Thay thế đèn LED',
      //       scheduledDate: '2025-01-14',
      //       completedDate: '2025-01-14',
      //       estimatedDuration: 30,
      //       actualDuration: 25,
      //       assignedTo: 'Trần Văn B',
      //       equipment: ['Đèn LED'],
      //       notes: 'Hoàn thành thành công'
      //     }
      //   ],
      //   inspections: [
      //     {
      //       id: 'I001',
      //       type: 'inventory_count',
      //       status: 'pending',
      //       scheduledDate: '2025-01-16',
      //       zones: ['A', 'B'],
      //       assignedTo: ['Nguyễn Thị C', 'Lê Văn D'],
      //       estimatedDuration: 480,
      //       description: 'Kiểm kê định kỳ tháng 1'
      //     },
      //     {
      //       id: 'I002',
      //       type: 'quality_check',
      //       status: 'in_progress',
      //       scheduledDate: '2025-01-15',
      //       startedDate: '2025-01-15T08:00:00Z',
      //       zones: ['C'],
      //       assignedTo: ['Phạm Văn E'],
      //       estimatedDuration: 240,
      //       description: 'Kiểm tra chất lượng hàng thực phẩm',
      //       progress: 65
      //     }
      //   ]
      // };

      // Calculate stats
      const stats = {
        totalLocations: mockData.locations.length,
        occupiedLocations: mockData.locations.filter(l => l.status === 'occupied').length,
        totalProducts: mockData.products.length,
        lowStockProducts: mockData.products.filter(p => p.status === 'low_stock').length,
        maintenanceRequired: mockData.maintenance.filter(m => m.status === 'pending').length,
        pendingInspections: mockData.inspections.filter(i => i.status === 'pending').length
      };

      setWarehouseData(prev => ({
        ...prev,
        ...mockData,
        stats
      }));

    } catch (error) {
      console.error('Error loading warehouse data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/quan-ly-kho/${tabKey}`);
  };

  const tabs = [
    {
      key: 'quan-ly-hang-hoa',
      label: '📦 Quản lý hàng hóa',
      icon: '📦',
      description: 'Quản lý sản phẩm và tồn kho'
    },
    {
      key: 'quan-ly-vi-tri',
      label: '📍 Quản lý vị trí',
      icon: '📍',
      description: 'Quản lý vị trí trong kho'
    },
    {
      key: 'tinh-trang-hang',
      label: '📊 Tình trạng hàng',
      icon: '📊',
      description: 'Theo dõi tình trạng hàng hóa'
    },
    {
      key: 'kiem-ke',
      label: '📋 Kiểm kê',
      icon: '📋',
      description: 'Kiểm kê và đối soát'
    },
    {
      key: 'bao-tri',
      label: '🔧 Bảo trì',
      icon: '🔧',
      description: 'Bảo trì thiết bị và cơ sở hạ tầng'
    },
    {
      key: 'cai-dat',
      label: '⚙️ Cài đặt',
      icon: '⚙️',
      description: 'Cấu hình hệ thống'
    }
  ];

  if (loading) {
    return (
      <div className="quan-ly-kho-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu quản lý kho...</p>
      </div>
    );
  }

  // Nếu không có dữ liệu thực tế, hiển thị thông báo
  const hasData = warehouseData && warehouseData.stats && warehouseData.stats.totalLocations > 0;

  if (!hasData) {
    return (
      <div className="quan-ly-kho-container">
        <div className="no-data-message">
          <h2>Chưa có dữ liệu quản lý kho</h2>
          <p>Vui lòng nhập dữ liệu hoặc kết nối API để hiển thị thông tin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quan-ly-kho-container">
      {/* Header */}
      <div className="quan-ly-kho-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">
              <span className="title-icon">🏭</span>
              Quản Lý Kho
            </h1>
            <p className="page-subtitle">
              Quản lý toàn diện hàng hóa, vị trí và vận hành kho
            </p>
          </div>

          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <div className="stat-number">{warehouseData.stats.totalLocations}</div>
                <div className="stat-label">Tổng vị trí</div>
                <div className="stat-detail">
                  {warehouseData.stats.occupiedLocations} đang sử dụng
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-number">{warehouseData.stats.totalProducts}</div>
                <div className="stat-label">Sản phẩm</div>
                <div className="stat-detail warning">
                  {warehouseData.stats.lowStockProducts} sắp hết
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔧</div>
              <div className="stat-content">
                <div className="stat-number">{warehouseData.stats.maintenanceRequired}</div>
                <div className="stat-label">Cần bảo trì</div>
                <div className="stat-detail">
                  Yêu cầu xử lý
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-number">{warehouseData.stats.pendingInspections}</div>
                <div className="stat-label">Kiểm kê</div>
                <div className="stat-detail">
                  Chờ thực hiện
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="quan-ly-kho-nav">
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
      <div className="quan-ly-kho-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <QuanLyHangHoa 
                products={warehouseData.products}
                locations={warehouseData.locations}
                onUpdateProduct={(productId, updates) => {
                  setWarehouseData(prev => ({
                    ...prev,
                    products: prev.products.map(p => 
                      p.id === productId ? { ...p, ...updates } : p
                    )
                  }));
                }}
              />
            } 
          />
          <Route 
            path="/quan-ly-hang-hoa" 
            element={
              <QuanLyHangHoa 
                products={warehouseData.products}
                locations={warehouseData.locations}
                onUpdateProduct={(productId, updates) => {
                  setWarehouseData(prev => ({
                    ...prev,
                    products: prev.products.map(p => 
                      p.id === productId ? { ...p, ...updates } : p
                    )
                  }));
                }}
              />
            } 
          />
          <Route 
            path="/quan-ly-vi-tri" 
            element={
              <QuanLyViTri 
                locations={warehouseData.locations}
                onUpdateLocation={(locationId, updates) => {
                  setWarehouseData(prev => ({
                    ...prev,
                    locations: prev.locations.map(l => 
                      l.id === locationId ? { ...l, ...updates } : l
                    )
                  }));
                }}
              />
            } 
          />
          <Route 
            path="/tinh-trang-hang" 
            element={
              <TinhTrangHang 
                products={warehouseData.products}
                locations={warehouseData.locations}
              />
            } 
          />
          <Route 
            path="/kiem-ke" 
            element={
              <KiemKe 
                inspections={warehouseData.inspections}
                locations={warehouseData.locations}
                products={warehouseData.products}
                onUpdateInspection={(inspectionId, updates) => {
                  setWarehouseData(prev => ({
                    ...prev,
                    inspections: prev.inspections.map(i => 
                      i.id === inspectionId ? { ...i, ...updates } : i
                    )
                  }));
                }}
              />
            } 
          />
          <Route 
            path="/bao-tri" 
            element={
              <BaoTri 
                maintenance={warehouseData.maintenance}
                locations={warehouseData.locations}
                onUpdateMaintenance={(maintenanceId, updates) => {
                  setWarehouseData(prev => ({
                    ...prev,
                    maintenance: prev.maintenance.map(m => 
                      m.id === maintenanceId ? { ...m, ...updates } : m
                    )
                  }));
                }}
              />
            } 
          />
          <Route 
            path="/cai-dat" 
            element={
              <CaiDat 
                settings={warehouseData.settings}
                onUpdateSettings={(updates) => {
                  setWarehouseData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, ...updates }
                  }));
                }}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default QuanLyKho;