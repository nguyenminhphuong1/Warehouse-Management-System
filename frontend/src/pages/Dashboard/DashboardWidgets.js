// src/pages/Dashboard/DashboardWidgets.js

import React, { useState, useEffect } from 'react';
import './DashboardWidgets.css';

const DashboardWidgets = () => {
  const [widgets, setWidgets] = useState({
    warehouseMap: {
      areas: [
        { id: 'A', name: 'Khu vực A - Bia', utilization: 85, color: '#28a745' },
        { id: 'B', name: 'Khu vực B - Nước ngọt', utilization: 72, color: '#17a2b8' },
        { id: 'C', name: 'Khu vực C - Nước suối', utilization: 60, color: '#ffc107' },
        { id: 'D', name: 'Khu vực D - Kho lạnh', utilization: 45, color: '#6f42c1' }
      ]
    },
    performanceMetrics: {
      weekly: [
        { day: 'T2', palletsIn: 12, palletsOut: 8, orders: 15 },
        { day: 'T3', palletsIn: 15, palletsOut: 11, orders: 18 },
        { day: 'T4', palletsIn: 10, palletsOut: 14, orders: 12 },
        { day: 'T5', palletsIn: 18, palletsOut: 9, orders: 20 },
        { day: 'T6', palletsIn: 14, palletsOut: 16, orders: 17 },
        { day: 'T7', palletsIn: 8, palletsOut: 6, orders: 10 },
        { day: 'CN', palletsIn: 5, palletsOut: 3, orders: 7 }
      ]
    },
    topProducts: [
      { name: 'Heineken 330ml', quantity: 450, trend: 'up', percentage: 15 },
      { name: 'Coca Cola 355ml', quantity: 380, trend: 'up', percentage: 8 },
      { name: 'Tiger Beer 355ml', quantity: 320, trend: 'down', percentage: -5 },
      { name: 'Lavie 500ml', quantity: 280, trend: 'up', percentage: 12 },
      { name: 'Sprite 330ml', quantity: 250, trend: 'stable', percentage: 2 }
    ],
    qualityMetrics: {
      passed: 95,
      failed: 3,
      pending: 2,
      totalChecks: 156
    }
  });

  const [currentWeather, setCurrentWeather] = useState({
    temperature: 28,
    humidity: 75,
    condition: 'sunny'
  });

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#28a745';
      case 'down': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return 'sun';
      case 'cloudy': return 'cloud';
      case 'rainy': return 'cloud-rain';
      default: return 'sun';
    }
  };

  return (
    <div className="dashboard-widgets">
      {/* Warehouse Map Widget */}
      <div className="widget warehouse-map-widget">
        <div className="widget-header">
          <h3>
            <i className="icon-map"></i>
            Sơ đồ kho
          </h3>
          <button className="widget-action">
            <i className="icon-external-link"></i>
          </button>
        </div>
        
        <div className="widget-content">
          <div className="warehouse-overview">
            {widgets.warehouseMap.areas.map(area => (
              <div key={area.id} className="area-overview">
                <div className="area-header">
                  <span className="area-id" style={{ backgroundColor: area.color }}>
                    {area.id}
                  </span>
                  <span className="area-name">{area.name}</span>
                </div>
                
                <div className="area-utilization">
                  <div className="utilization-bar">
                    <div 
                      className="utilization-fill"
                      style={{ 
                        width: `${area.utilization}%`,
                        backgroundColor: area.color
                      }}
                    ></div>
                  </div>
                  <span className="utilization-text">{area.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="warehouse-grid-mini">
            <div className="grid-legend">
              <div className="legend-item">
                <div className="legend-color occupied"></div>
                <span>Có hàng</span>
              </div>
              <div className="legend-item">
                <div className="legend-color empty"></div>
                <span>Trống</span>
              </div>
              <div className="legend-item">
                <div className="legend-color maintenance"></div>
                <span>Bảo trì</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Widget */}
      <div className="widget performance-widget">
        <div className="widget-header">
          <h3>
            <i className="icon-bar-chart"></i>
            Hiệu suất tuần
          </h3>
          <select className="period-selector">
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
          </select>
        </div>
        
        <div className="widget-content">
          <div className="performance-chart">
            {widgets.performanceMetrics.weekly.map((day, index) => (
              <div key={index} className="chart-day">
                <div className="chart-bars">
                  <div 
                    className="bar pallets-in"
                    style={{ 
                      height: `${(day.palletsIn / 20) * 100}%`,
                      backgroundColor: '#28a745'
                    }}
                    title={`Nhập: ${day.palletsIn} pallet`}
                  ></div>
                  <div 
                    className="bar pallets-out"
                    style={{ 
                      height: `${(day.palletsOut / 20) * 100}%`,
                      backgroundColor: '#17a2b8'
                    }}
                    title={`Xuất: ${day.palletsOut} pallet`}
                  ></div>
                  <div 
                    className="bar orders"
                    style={{ 
                      height: `${(day.orders / 25) * 100}%`,
                      backgroundColor: '#ffc107'
                    }}
                    title={`Đơn: ${day.orders}`}
                  ></div>
                </div>
                <div className="chart-label">{day.day}</div>
              </div>
            ))}
          </div>
          
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
              <span>Nhập kho</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#17a2b8' }}></div>
              <span>Xuất kho</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
              <span>Đơn hàng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Widget */}
      <div className="widget top-products-widget">
        <div className="widget-header">
          <h3>
            <i className="icon-trending-up"></i>
            Sản phẩm hàng đầu
          </h3>
          <span className="widget-badge">Top 5</span>
        </div>
        
        <div className="widget-content">
          <div className="products-list">
            {widgets.topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">{index + 1}</div>
                
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-quantity">{product.quantity} thùng</div>
                </div>
                
                <div className="product-trend">
                  <i 
                    className={`icon-${getTrendIcon(product.trend)}`}
                    style={{ color: getTrendColor(product.trend) }}
                  ></i>
                  <span 
                    className="trend-percentage"
                    style={{ color: getTrendColor(product.trend) }}
                  >
                    {product.percentage > 0 ? '+' : ''}{product.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Control Widget */}
      <div className="widget quality-widget">
        <div className="widget-header">
          <h3>
            <i className="icon-shield-check"></i>
            Kiểm tra chất lượng
          </h3>
          <span className="widget-period">Hôm nay</span>
        </div>
        
        <div className="widget-content">
          <div className="quality-overview">
            <div className="quality-circle">
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e9ecef"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#28a745"
                  strokeWidth="8"
                  strokeDasharray={`${(widgets.qualityMetrics.passed / widgets.qualityMetrics.totalChecks) * 251.2} 251.2`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="quality-percentage">
                {Math.round((widgets.qualityMetrics.passed / widgets.qualityMetrics.totalChecks) * 100)}%
              </div>
            </div>
            
            <div className="quality-stats">
              <div className="quality-stat passed">
                <i className="icon-check-circle"></i>
                <div>
                  <span className="stat-number">{widgets.qualityMetrics.passed}</span>
                  <span className="stat-label">Đạt</span>
                </div>
              </div>
              
              <div className="quality-stat failed">
                <i className="icon-x-circle"></i>
                <div>
                  <span className="stat-number">{widgets.qualityMetrics.failed}</span>
                  <span className="stat-label">Không đạt</span>
                </div>
              </div>
              
              <div className="quality-stat pending">
                <i className="icon-clock"></i>
                <div>
                  <span className="stat-number">{widgets.qualityMetrics.pending}</span>
                  <span className="stat-label">Chờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather & Environment Widget */}
      <div className="widget weather-widget">
        <div className="widget-header">
          <h3>
            <i className="icon-thermometer"></i>
            Môi trường kho
          </h3>
          <span className="widget-status normal">Bình thường</span>
        </div>
        
        <div className="widget-content">
          <div className="weather-info">
            <div className="weather-main">
              <i className={`icon-${getWeatherIcon(currentWeather.condition)} weather-icon`}></i>
              <div className="temperature">{currentWeather.temperature}°C</div>
            </div>
            
            <div className="weather-details">
              <div className="weather-detail">
                <i className="icon-droplet"></i>
                <span>Độ ẩm: {currentWeather.humidity}%</span>
              </div>
              
              <div className="weather-detail">
                <i className="icon-wind"></i>
                <span>Thông gió: Tốt</span>
              </div>
              
              <div className="weather-detail">
                <i className="icon-eye"></i>
                <span>Tầm nhìn: Rõ</span>
              </div>
            </div>
          </div>
          
          <div className="environment-alerts">
            <div className="alert-item normal">
              <i className="icon-check-circle"></i>
              <span>Nhiệt độ ổn định</span>
            </div>
            <div className="alert-item normal">
              <i className="icon-check-circle"></i>
              <span>Độ ẩm phù hợp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Widget */}
      <div className="widget quick-stats-widget">
        <div className="widget-header">
          <h3>
            <i className="icon-zap"></i>
            Thống kê nhanh
          </h3>
        </div>
        
        <div className="widget-content">
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <div className="stat-icon">
                <i className="icon-clock"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">2.5h</div>
                <div className="stat-label">Thời gian xuất TB</div>
              </div>
            </div>
            
            <div className="quick-stat">
              <div className="stat-icon">
                <i className="icon-target"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">98.5%</div>
                <div className="stat-label">Độ chính xác</div>
              </div>
            </div>
            
            <div className="quick-stat">
              <div className="stat-icon">
                <i className="icon-users"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">12</div>
                <div className="stat-label">Nhân viên online</div>
              </div>
            </div>
            
            <div className="quick-stat">
              <div className="stat-icon">
                <i className="icon-truck"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">8</div>
                <div className="stat-label">Xe đang giao</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;