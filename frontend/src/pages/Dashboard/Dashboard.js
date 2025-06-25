// src/pages/Dashboard/Dashboard.js

import React, { useState, useEffect } from 'react';
import DashboardWidgets from './DashboardWidgets';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    warehouseOverview: {
      totalLocations: 150,
      occupiedLocations: 105,
      emptyLocations: 45,
      utilizationRate: 70,
      maintenanceLocations: 5
    },
    inventoryStats: {
      totalPallets: 105,
      newPallets: 12,
      openedPallets: 78,
      emptyPallets: 15,
      expiringPallets: 8
    },
    todayActivity: {
      palletsIn: 5,
      palletsOut: 3,
      ordersCreated: 8,
      ordersCompleted: 6,
      deliveriesChecked: 12
    },
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Hàng sắp hết hạn',
        message: '8 pallet sẽ hết hạn trong 7 ngày tới',
        timestamp: new Date(),
        priority: 'high'
      },
      {
        id: 2,
        type: 'info',
        title: 'Kiểm tra chất lượng',
        message: '12 pallet cần kiểm tra chất lượng hôm nay',
        timestamp: new Date(),
        priority: 'medium'
      },
      {
        id: 3,
        type: 'success',
        title: 'Bảo trì hoàn thành',
        message: 'Khu vực A đã hoàn thành bảo trì định kỳ',
        timestamp: new Date(),
        priority: 'low'
      }
    ],
    quickActions: [
      {
        title: 'Nhập Hàng',
        description: 'Tạo pallet mới và phân bổ vị trí',
        icon: 'package',
        color: '#28a745',
        route: '/nhap-hang',
        count: 5
      },
      {
        title: 'Tạo Đơn',
        description: 'Tạo đơn xuất hàng mới',
        icon: 'clipboard',
        color: '#007bff',
        route: '/tao-don',
        count: 3
      },
      {
        title: 'Xuất Hàng',
        description: 'Xử lý đơn hàng chờ xuất',
        icon: 'truck',
        color: '#17a2b8',
        route: '/xuat-hang',
        count: 8
      },
      {
        title: 'Kiểm Kê',
        description: 'Thực hiện kiểm kê kho',
        icon: 'clipboard-check',
        color: '#ffc107',
        route: '/quan-ly-kho/kiem-ke',
        count: 2
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'pallet_created',
        title: 'Tạo pallet mới',
        description: 'P-2025-001 - Heineken 330ml',
        user: 'Nguyễn Văn A',
        timestamp: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: 2,
        type: 'order_completed',
        title: 'Hoàn thành đơn hàng',
        description: 'XK-001 - CH Minimart ABC',
        user: 'Trần Thị B',
        timestamp: new Date(Date.now() - 25 * 60 * 1000)
      },
      {
        id: 3,
        type: 'quality_check',
        title: 'Kiểm tra chất lượng',
        description: 'P-2025-015 - Tiger Beer',
        user: 'Lê Văn C',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 4,
        type: 'maintenance',
        title: 'Bảo trì khu vực',
        description: 'Khu vực B - Vệ sinh định kỳ',
        user: 'Phạm Văn D',
        timestamp: new Date(Date.now() - 120 * 60 * 1000)
      }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  const getActivityIcon = (type) => {
    const icons = {
      pallet_created: 'package',
      order_completed: 'check-circle',
      quality_check: 'shield-check',
      maintenance: 'tool'
    };
    return icons[type] || 'activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      pallet_created: '#28a745',
      order_completed: '#007bff',
      quality_check: '#ffc107',
      maintenance: '#6c757d'
    };
    return colors[type] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Tổng quan hệ thống quản lý kho</p>
          </div>
          
          <div className="header-info">
            <div className="current-time">
              <div className="time">{formatTime(currentTime)}</div>
              <div className="date">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Warehouse Overview Cards */}
        <div className="overview-section">
          <h2>Tổng quan kho</h2>
          <div className="overview-cards">
            <div className="overview-card total-locations">
              <div className="card-icon">
                <i className="icon-map"></i>
              </div>
              <div className="card-content">
                <h3>{dashboardData.warehouseOverview.totalLocations}</h3>
                <p>Tổng vị trí</p>
                <div className="card-progress">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${dashboardData.warehouseOverview.utilizationRate}%`,
                      backgroundColor: '#007bff'
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {dashboardData.warehouseOverview.utilizationRate}% sử dụng
                </span>
              </div>
            </div>

            <div className="overview-card occupied-locations">
              <div className="card-icon">
                <i className="icon-package"></i>
              </div>
              <div className="card-content">
                <h3>{dashboardData.warehouseOverview.occupiedLocations}</h3>
                <p>Có hàng</p>
                <div className="trend-indicator positive">
                  <i className="icon-trending-up"></i>
                  <span>+5 từ hôm qua</span>
                </div>
              </div>
            </div>

            <div className="overview-card empty-locations">
              <div className="card-icon">
                <i className="icon-square"></i>
              </div>
              <div className="card-content">
                <h3>{dashboardData.warehouseOverview.emptyLocations}</h3>
                <p>Trống</p>
                <div className="trend-indicator negative">
                  <i className="icon-trending-down"></i>
                  <span>-5 từ hôm qua</span>
                </div>
              </div>
            </div>

            <div className="overview-card maintenance-locations">
              <div className="card-icon">
                <i className="icon-tool"></i>
              </div>
              <div className="card-content">
                <h3>{dashboardData.warehouseOverview.maintenanceLocations}</h3>
                <p>Bảo trì</p>
                <div className="maintenance-schedule">
                  <span>2 hoàn thành hôm nay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="action-alerts-section">
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>
            <div className="action-cards">
              {dashboardData.quickActions.map((action, index) => (
                <div 
                  key={index}
                  className="action-card"
                  onClick={() => window.location.href = action.route}
                >
                  <div className="action-icon" style={{ backgroundColor: action.color }}>
                    <i className={`icon-${action.icon}`}></i>
                  </div>
                  <div className="action-content">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                    {action.count > 0 && (
                      <div className="action-badge">
                        {action.count}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="alerts-section">
            <h2>Cảnh báo & Thông báo</h2>
            <div className="alerts-list">
              {dashboardData.alerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.type} ${alert.priority}`}>
                  <div className="alert-icon">
                    <i className={`icon-${alert.type === 'warning' ? 'alert-triangle' : 
                                             alert.type === 'success' ? 'check-circle' : 'info'}`}></i>
                  </div>
                  <div className="alert-content">
                    <h4>{alert.title}</h4>
                    <p>{alert.message}</p>
                    <span className="alert-time">{getTimeAgo(alert.timestamp)}</span>
                  </div>
                  <div className="alert-actions">
                    <button className="btn-view">Xem</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Activity & Recent Activities */}
        <div className="activity-section">
          {/* Today's Statistics */}
          <div className="today-stats">
            <h2>Hoạt động hôm nay</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="icon-arrow-down"></i>
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.todayActivity.palletsIn}</h3>
                  <p>Pallet nhập</p>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="icon-arrow-up"></i>
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.todayActivity.palletsOut}</h3>
                  <p>Pallet xuất</p>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="icon-clipboard"></i>
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.todayActivity.ordersCreated}</h3>
                  <p>Đơn tạo</p>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="icon-check-circle"></i>
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.todayActivity.ordersCompleted}</h3>
                  <p>Đơn hoàn thành</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="recent-activities">
            <h2>Hoạt động gần đây</h2>
            <div className="activities-list">
              {dashboardData.recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div 
                    className="activity-icon"
                    style={{ backgroundColor: getActivityColor(activity.type) }}
                  >
                    <i className={`icon-${getActivityIcon(activity.type)}`}></i>
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <div className="activity-meta">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-time">{getTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <DashboardWidgets />
      </div>
    </div>
  );
};

export default Dashboard;