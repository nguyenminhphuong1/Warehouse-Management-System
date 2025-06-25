// src/pages/QuanLyKho/TinhTrangHang.js - Tình trạng hàng hóa

import React, { useState, useMemo } from 'react';
import './TinhTrangHang.css';

const TinhTrangHang = ({ products = [], locations = [] }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, expiry, stock_alerts, quality
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    location: 'all'
  });

  const [alertSettings, setAlertSettings] = useState({
    lowStockDays: 7,
    expiryWarningDays: 30,
    criticalExpiryDays: 7
  });

  // Tính toán thống kê tổng quan
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.cost), 0);
    
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);
    const outOfStockProducts = products.filter(p => p.currentStock === 0);
    
    const today = new Date();
    const expiryWarningDate = new Date(today.getTime() + alertSettings.expiryWarningDays * 24 * 60 * 60 * 1000);
    const criticalExpiryDate = new Date(today.getTime() + alertSettings.criticalExpiryDays * 24 * 60 * 60 * 1000);
    
    const expiringProducts = products.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      return expiryDate <= expiryWarningDate && expiryDate > today;
    });
    
    const criticalExpiryProducts = products.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      return expiryDate <= criticalExpiryDate && expiryDate > today;
    });
    
    const expiredProducts = products.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      return expiryDate <= today;
    });

    return {
      totalProducts,
      totalValue,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      expiringProducts: expiringProducts.length,
      criticalExpiryProducts: criticalExpiryProducts.length,
      expiredProducts: expiredProducts.length,
      stockUtilization: totalProducts > 0 ? 
        ((totalProducts - outOfStockProducts.length) / totalProducts * 100).toFixed(1) : 0
    };
  }, [products, alertSettings]);

  // Lấy sản phẩm theo category
  const productsByCategory = useMemo(() => {
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = {
          name: product.category,
          totalProducts: 0,
          totalValue: 0,
          lowStock: 0,
          expiring: 0
        };
      }
      
      categories[product.category].totalProducts++;
      categories[product.category].totalValue += product.currentStock * product.cost;
      
      if (product.currentStock <= product.minStock) {
        categories[product.category].lowStock++;
      }
      
      const today = new Date();
      const expiryDate = new Date(product.expiryDate);
      const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysToExpiry <= alertSettings.expiryWarningDays && daysToExpiry > 0) {
        categories[product.category].expiring++;
      }
    });
    
    return Object.values(categories);
  }, [products, alertSettings]);

  // Lấy sản phẩm sắp hết hạn
  const expiringProducts = useMemo(() => {
    const today = new Date();
    
    return products
      .map(product => {
        const expiryDate = new Date(product.expiryDate);
        const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return { ...product, daysToExpiry };
      })
      .filter(product => product.daysToExpiry <= alertSettings.expiryWarningDays)
      .sort((a, b) => a.daysToExpiry - b.daysToExpiry);
  }, [products, alertSettings]);

  // Lấy sản phẩm có cảnh báo tồn kho
  const stockAlertProducts = useMemo(() => {
    return products
      .filter(product => product.currentStock <= product.minStock)
      .sort((a, b) => {
        const aPercentage = (a.currentStock / a.minStock) * 100;
        const bPercentage = (b.currentStock / b.minStock) * 100;
        return aPercentage - bPercentage;
      });
  }, [products]);

  const getExpiryStatusColor = (daysToExpiry) => {
    if (daysToExpiry <= 0) return 'var(--error-600, #dc2626)';
    if (daysToExpiry <= alertSettings.criticalExpiryDays) return 'var(--error-600, #dc2626)';
    if (daysToExpiry <= alertSettings.expiryWarningDays) return 'var(--warning-600, #d97706)';
    return 'var(--success-600, #059669)';
  };

  const getStockLevelColor = (currentStock, minStock) => {
    const percentage = (currentStock / minStock) * 100;
    if (percentage <= 0) return 'var(--error-600, #dc2626)';
    if (percentage <= 50) return 'var(--error-600, #dc2626)';
    if (percentage <= 100) return 'var(--warning-600, #d97706)';
    return 'var(--success-600, #059669)';
  };

  const renderOverview = () => (
    <div className="overview-section">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Tổng quan kho hàng</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Tổng sản phẩm:</span>
              <span className="stat-value">{stats.totalProducts}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Giá trị tồn kho:</span>
              <span className="stat-value">{(stats.totalValue / 1000000).toFixed(1)}M VND</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tỷ lệ sử dụng:</span>
              <span className="stat-value">{stats.stockUtilization}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-header">
            <h3>Cảnh báo tồn kho</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item warning">
              <span className="stat-label">Sắp hết hàng:</span>
              <span className="stat-value">{stats.lowStockProducts}</span>
            </div>
            <div className="stat-item error">
              <span className="stat-label">Hết hàng:</span>
              <span className="stat-value">{stats.outOfStockProducts}</span>
            </div>
          </div>
        </div>

        <div className="stat-card expiry">
          <div className="stat-header">
            <h3>Cảnh báo hạn sử dụng</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item warning">
              <span className="stat-label">Sắp hết hạn:</span>
              <span className="stat-value">{stats.expiringProducts}</span>
            </div>
            <div className="stat-item error">
              <span className="stat-label">Hết hạn:</span>
              <span className="stat-value">{stats.expiredProducts}</span>
            </div>
            <div className="stat-item critical">
              <span className="stat-label">Cần xử lý gấp:</span>
              <span className="stat-value">{stats.criticalExpiryProducts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="category-analysis">
        <h3>Phân tích theo danh mục</h3>
        <div className="categories-grid">
          {productsByCategory.map(category => (
            <div key={category.name} className="category-card">
              <div className="category-header">
                <h4>{category.name}</h4>
                <span className="category-count">{category.totalProducts} SP</span>
              </div>
              <div className="category-content">
                <div className="category-stat">
                  <span className="category-label">Giá trị:</span>
                  <span className="category-value">
                    {(category.totalValue / 1000000).toFixed(1)}M VND
                  </span>
                </div>
                <div className="category-stat">
                  <span className="category-label">Sắp hết:</span>
                  <span className={`category-value ${category.lowStock > 0 ? 'warning' : ''}`}>
                    {category.lowStock}
                  </span>
                </div>
                <div className="category-stat">
                  <span className="category-label">Sắp hết hạn:</span>
                  <span className={`category-value ${category.expiring > 0 ? 'warning' : ''}`}>
                    {category.expiring}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Hành động nhanh</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span className="action-label">Xuất báo cáo tồn kho</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚠️</span>
            <span className="action-label">Xem tất cả cảnh báo</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📦</span>
            <span className="action-label">Lập đơn nhập hàng</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🔄</span>
            <span className="action-label">Cập nhật tồn kho</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderExpiryAlerts = () => (
    <div className="expiry-section">
      <div className="section-header">
        <h3>Cảnh báo hạn sử dụng</h3>
        <div className="alert-settings">
          <button className="btn btn-outline btn-sm">
            <span className="btn-icon">⚙️</span>
            Cài đặt cảnh báo
          </button>
        </div>
      </div>

      <div className="expiry-table-container">
        <table className="expiry-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SKU</th>
              <th>Số lượng</th>
              <th>Hạn sử dụng</th>
              <th>Còn lại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {expiringProducts.map(product => (
              <tr 
                key={product.id}
                className={product.daysToExpiry <= 0 ? 'expired' : 
                          product.daysToExpiry <= alertSettings.criticalExpiryDays ? 'critical' : 'warning'}
              >
                <td>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product.category}</div>
                  </div>
                </td>
                <td className="product-sku">{product.sku}</td>
                <td className="stock-quantity">{product.currentStock} {product.unit}</td>
                <td>{new Date(product.expiryDate).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span 
                    className="days-remaining"
                    style={{ color: getExpiryStatusColor(product.daysToExpiry) }}
                  >
                    {product.daysToExpiry <= 0 ? 'Đã hết hạn' : 
                     product.daysToExpiry === 1 ? '1 ngày' : 
                     `${product.daysToExpiry} ngày`}
                  </span>
                </td>
                <td>
                  <span 
                    className="expiry-status"
                    style={{ color: getExpiryStatusColor(product.daysToExpiry) }}
                  >
                    {product.daysToExpiry <= 0 ? 'Hết hạn' :
                     product.daysToExpiry <= alertSettings.criticalExpiryDays ? 'Cần xử lý gấp' : 
                     'Sắp hết hạn'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {product.daysToExpiry <= 0 ? (
                      <button className="btn btn-error btn-sm">
                        <span className="btn-icon">🗑️</span>
                        Loại bỏ
                      </button>
                    ) : (
                      <>
                        <button className="btn btn-warning btn-sm">
                          <span className="btn-icon">🏷️</span>
                          Giảm giá
                        </button>
                        <button className="btn btn-outline btn-sm">
                          <span className="btn-icon">📤</span>
                          Xuất gấp
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {expiringProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3>Không có sản phẩm nào sắp hết hạn</h3>
            <p>Tất cả sản phẩm đều còn trong thời hạn sử dụng an toàn</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStockAlerts = () => (
    <div className="stock-alerts-section">
      <div className="section-header">
        <h3>Cảnh báo tồn kho</h3>
        <div className="alert-summary">
          <span className="alert-count error">{stats.outOfStockProducts} hết hàng</span>
          <span className="alert-count warning">{stats.lowStockProducts} sắp hết</span>
        </div>
      </div>

      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SKU</th>
              <th>Tồn kho</th>
              <th>Tối thiểu</th>
              <th>Tối đa</th>
              <th>Tỷ lệ</th>
              <th>Đã đặt</th>
              <th>Cần nhập</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stockAlertProducts.map(product => {
              const stockPercentage = (product.currentStock / product.minStock) * 100;
              const suggestedOrder = Math.max(0, product.maxStock - product.currentStock - product.reservedStock);
              
              return (
                <tr 
                  key={product.id}
                  className={product.currentStock === 0 ? 'out-of-stock' : 'low-stock'}
                >
                  <td>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-category">{product.category}</div>
                    </div>
                  </td>
                  <td className="product-sku">{product.sku}</td>
                  <td>
                    <span 
                      className="current-stock"
                      style={{ color: getStockLevelColor(product.currentStock, product.minStock) }}
                    >
                      {product.currentStock} {product.unit}
                    </span>
                  </td>
                  <td>{product.minStock} {product.unit}</td>
                  <td>{product.maxStock} {product.unit}</td>
                  <td>
                    <div className="stock-percentage">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ 
                            width: `${Math.min(100, stockPercentage)}%`,
                            backgroundColor: getStockLevelColor(product.currentStock, product.minStock)
                          }}
                        ></div>
                      </div>
                      <span className="percentage-text">
                        {stockPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td>{product.reservedStock} {product.unit}</td>
                  <td className="suggested-order">
                    <strong>{suggestedOrder} {product.unit}</strong>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary btn-sm">
                        <span className="btn-icon">📦</span>
                        Tạo đơn nhập
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <span className="btn-icon">📞</span>
                        Liên hệ NCC
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {stockAlertProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3>Không có cảnh báo tồn kho</h3>
            <p>Tất cả sản phẩm đều có mức tồn kho an toàn</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderQualityCheck = () => (
    <div className="quality-section">
      <div className="section-header">
        <h3>Kiểm tra chất lượng</h3>
        <p>Theo dõi và đánh giá chất lượng hàng hóa trong kho</p>
      </div>

      <div className="quality-metrics">
        <div className="quality-card">
          <div className="quality-header">
            <h4>Đánh giá tổng quan</h4>
          </div>
          <div className="quality-score">
            <div className="score-circle">
              <span className="score-number">92</span>
              <span className="score-label">điểm</span>
            </div>
            <div className="score-description">
              <p>Chất lượng hàng hóa đạt mức tốt</p>
              <small>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</small>
            </div>
          </div>
        </div>

        <div className="quality-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Hàng hết hạn:</span>
            <span className="breakdown-value error">{stats.expiredProducts}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Hàng sắp hết hạn:</span>
            <span className="breakdown-value warning">{stats.expiringProducts}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Hàng chất lượng tốt:</span>
            <span className="breakdown-value success">
              {stats.totalProducts - stats.expiredProducts - stats.expiringProducts}
            </span>
          </div>
        </div>
      </div>

      <div className="quality-actions">
        <h4>Hành động cần thiết</h4>
        <div className="actions-list">
          {stats.expiredProducts > 0 && (
            <div className="action-item error">
              <span className="action-icon">🗑️</span>
              <span className="action-text">
                Cần loại bỏ {stats.expiredProducts} sản phẩm hết hạn
              </span>
              <button className="btn btn-error btn-sm">Xử lý ngay</button>
            </div>
          )}
          
          {stats.criticalExpiryProducts > 0 && (
            <div className="action-item warning">
              <span className="action-icon">⚠️</span>
              <span className="action-text">
                Cần xử lý gấp {stats.criticalExpiryProducts} sản phẩm sắp hết hạn
              </span>
              <button className="btn btn-warning btn-sm">Xem chi tiết</button>
            </div>
          )}
          
          <div className="action-item info">
            <span className="action-icon">📋</span>
            <span className="action-text">
              Lập kế hoạch kiểm tra chất lượng định kỳ
            </span>
            <button className="btn btn-outline btn-sm">Lên lịch</button>
          </div>
          
          <div className="action-item info">
            <span className="action-icon">📊</span>
            <span className="action-text">
              Tạo báo cáo chất lượng hàng hóa
            </span>
            <button className="btn btn-outline btn-sm">Tạo báo cáo</button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { key: 'overview', label: '📊 Tổng quan', component: renderOverview },
    { key: 'expiry', label: '⏰ Hạn sử dụng', component: renderExpiryAlerts },
    { key: 'stock_alerts', label: '⚠️ Cảnh báo tồn kho', component: renderStockAlerts },
    { key: 'quality', label: '🔍 Chất lượng', component: renderQualityCheck }
  ];

  return (
    <div className="tinh-trang-hang-container">
      {/* Header */}
      <div className="tinh-trang-hang-header">
        <h2>Tình trạng hàng hóa</h2>
        <p>Theo dõi và quản lý tình trạng, chất lượng hàng hóa trong kho</p>
      </div>

      {/* Navigation */}
      <div className="tinh-trang-hang-nav">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="tinh-trang-hang-content">
        {tabs.find(tab => tab.key === activeTab)?.component()}
      </div>
    </div>
  );
};

export default TinhTrangHang;