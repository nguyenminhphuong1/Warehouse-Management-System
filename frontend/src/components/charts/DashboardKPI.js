/*
 * File: frontend/src/components/Dashboard/DashboardKPI.js
 * Description: KPI cards component for warehouse dashboard
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const DashboardKPI = ({
  // Data
  kpis = [],
  
  // Layout
  columns = 4,
  gap = 'md', // sm, md, lg
  
  // Features
  animated = true,
  showTrend = true,
  showComparison = true,
  
  // Loading
  loading = false,
  
  // Styling
  className = '',
  variant = 'default' // default, compact, detailed
}) => {
  const [animatedValues, setAnimatedValues] = useState({});

  // Animate number values
  useEffect(() => {
    if (!animated) return;

    kpis.forEach((kpi, index) => {
      if (typeof kpi.value === 'number') {
        const duration = 1500;
        const startTime = Date.now() + (index * 200); // Stagger animations
        const startValue = animatedValues[kpi.id] || 0;
        const endValue = kpi.value;
        
        const animate = () => {
          const now = Date.now();
          const elapsed = Math.max(0, now - startTime);
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentValue = startValue + (endValue - startValue) * easeOut;
          
          setAnimatedValues(prev => ({
            ...prev,
            [kpi.id]: currentValue
          }));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    });
  }, [kpis, animated]);

  // Format value based on type
  const formatValue = (kpi, value = kpi.value) => {
    if (typeof value !== 'number') return value;
    
    const animatedValue = animated ? (animatedValues[kpi.id] || 0) : value;
    
    switch (kpi.type) {
      case 'currency':
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(animatedValue);
        
      case 'percentage':
        return `${animatedValue.toFixed(1)}%`;
        
      case 'number':
        return new Intl.NumberFormat('vi-VN').format(Math.round(animatedValue));
        
      default:
        return Math.round(animatedValue).toLocaleString();
    }
  };

  // Get trend indicator
  const getTrendIndicator = (trend) => {
    if (!trend) return null;
    
    const { direction, value } = trend;
    const icons = {
      up: '↗️',
      down: '↘️',
      stable: '→'
    };
    
    const colors = {
      up: '#10b981',
      down: '#ef4444',
      stable: '#6b7280'
    };
    
    return {
      icon: icons[direction] || '→',
      color: colors[direction] || '#6b7280',
      text: `${Math.abs(value || 0).toFixed(1)}%`
    };
  };

  // Get comparison text
  const getComparisonText = (comparison) => {
    if (!comparison) return null;
    
    const { period, value, direction } = comparison;
    const directionText = {
      up: 'tăng',
      down: 'giảm',
      stable: 'ổn định'
    };
    
    return `${directionText[direction] || ''} ${Math.abs(value || 0).toFixed(1)}% so với ${period}`;
  };

  if (loading) {
    return (
      <div className={`dashboard-kpi-container ${className}`}>
        <div 
          className={`dashboard-kpi-grid columns-${columns} gap-${gap}`}
          style={{ '--columns': columns }}
        >
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`dashboard-kpi-card loading ${variant}`}>
              <div className="kpi-skeleton">
                <div className="kpi-skeleton-icon"></div>
                <div className="kpi-skeleton-content">
                  <div className="kpi-skeleton-title"></div>
                  <div className="kpi-skeleton-value"></div>
                  <div className="kpi-skeleton-trend"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-kpi-container ${className}`}>
      <div 
        className={`dashboard-kpi-grid columns-${columns} gap-${gap}`}
        style={{ '--columns': columns }}
      >
        {kpis.map((kpi, index) => {
          const trend = getTrendIndicator(kpi.trend);
          const comparison = getComparisonText(kpi.comparison);
          
          return (
            <div 
              key={kpi.id}
              className={`dashboard-kpi-card ${variant} ${animated ? 'animated' : ''}`}
              style={{ 
                '--delay': `${index * 0.1}s`,
                '--accent-color': kpi.color || '#3b82f6'
              }}
            >
              {/* Card Header */}
              <div className="kpi-header">
                {kpi.icon && (
                  <div className="kpi-icon" style={{ backgroundColor: kpi.color }}>
                    {kpi.icon}
                  </div>
                )}
                <div className="kpi-title-section">
                  <h3 className="kpi-title">{kpi.title}</h3>
                  {kpi.subtitle && (
                    <p className="kpi-subtitle">{kpi.subtitle}</p>
                  )}
                </div>
                {kpi.actions && (
                  <div className="kpi-actions">
                    {kpi.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className="kpi-action-btn"
                        onClick={action.onClick}
                        title={action.title}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="kpi-body">
                <div className="kpi-value-section">
                  <div className="kpi-value">
                    {formatValue(kpi)}
                  </div>
                  
                  {showTrend && trend && (
                    <div 
                      className="kpi-trend"
                      style={{ color: trend.color }}
                    >
                      <span className="kpi-trend-icon">{trend.icon}</span>
                      <span className="kpi-trend-text">{trend.text}</span>
                    </div>
                  )}
                </div>

                {variant === 'detailed' && kpi.details && (
                  <div className="kpi-details">
                    {kpi.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="kpi-detail-item">
                        <span className="kpi-detail-label">{detail.label}:</span>
                        <span className="kpi-detail-value">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              {(showComparison && comparison) && (
                <div className="kpi-footer">
                  <div className="kpi-comparison">
                    {comparison}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {kpi.target && (
                <div className="kpi-progress">
                  <div className="kpi-progress-bar">
                    <div 
                      className="kpi-progress-fill"
                      style={{ 
                        width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`,
                        backgroundColor: kpi.color
                      }}
                    />
                  </div>
                  <div className="kpi-progress-text">
                    {((kpi.value / kpi.target) * 100).toFixed(1)}% của mục tiêu
                  </div>
                </div>
              )}

              {/* Status Indicator */}
              {kpi.status && (
                <div className={`kpi-status ${kpi.status}`}>
                  <div className="kpi-status-dot"></div>
                  <span className="kpi-status-text">
                    {kpi.status === 'good' && 'Tốt'}
                    {kpi.status === 'warning' && 'Cảnh báo'}
                    {kpi.status === 'danger' && 'Nguy hiểm'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Sample KPI data for warehouse
export const warehouseKPIs = [
  {
    id: 'total-inventory',
    title: 'Tổng tồn kho',
    subtitle: 'Tất cả sản phẩm',
    value: 15420,
    type: 'number',
    icon: '📦',
    color: '#3b82f6',
    trend: { direction: 'up', value: 12.5 },
    comparison: { period: 'tháng trước', value: 12.5, direction: 'up' },
    target: 20000,
    status: 'good'
  },
  {
    id: 'monthly-revenue',
    title: 'Doanh thu tháng',
    subtitle: 'Tháng hiện tại',
    value: 2540000000,
    type: 'currency',
    icon: '💰',
    color: '#10b981',
    trend: { direction: 'up', value: 8.3 },
    comparison: { period: 'tháng trước', value: 8.3, direction: 'up' },
    target: 3000000000,
    status: 'good'
  },
  {
    id: 'pending-orders',
    title: 'Đơn chờ xử lý',
    subtitle: 'Cần xử lý ngay',
    value: 127,
    type: 'number',
    icon: '📋',
    color: '#f59e0b',
    trend: { direction: 'down', value: 5.2 },
    comparison: { period: 'hôm qua', value: 5.2, direction: 'down' },
    status: 'warning'
  },
  {
    id: 'fulfillment-rate',
    title: 'Tỷ lệ hoàn thành',
    subtitle: '7 ngày qua',
    value: 94.8,
    type: 'percentage',
    icon: '✅',
    color: '#8b5cf6',
    trend: { direction: 'up', value: 2.1 },
    comparison: { period: 'tuần trước', value: 2.1, direction: 'up' },
    target: 95,
    status: 'good'
  }
];

// Hook for KPI data management
export const useKPIData = (fetchFn) => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKPIs = async () => {
    if (!fetchFn) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchFn();
      setKpis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  const refreshKPIs = () => {
    fetchKPIs();
  };

  return {
    kpis,
    loading,
    error,
    refreshKPIs
  };
};

// KPI calculation utilities
export const KPIUtils = {
  // Calculate trend
  calculateTrend: (current, previous) => {
    if (!previous || previous === 0) return { direction: 'stable', value: 0 };
    
    const change = ((current - previous) / previous) * 100;
    
    return {
      direction: change > 1 ? 'up' : change < -1 ? 'down' : 'stable',
      value: Math.abs(change)
    };
  },

  // Format comparison
  formatComparison: (current, previous, period = 'tháng trước') => {
    const trend = KPIUtils.calculateTrend(current, previous);
    return {
      period,
      value: trend.value,
      direction: trend.direction
    };
  },

  // Calculate status based on target
  calculateStatus: (current, target, thresholds = { good: 0.9, warning: 0.7 }) => {
    if (!target) return 'good';
    
    const ratio = current / target;
    
    if (ratio >= thresholds.good) return 'good';
    if (ratio >= thresholds.warning) return 'warning';
    return 'danger';
  },

  // Generate mock KPI data
  generateMockKPI: (id, title, baseValue = 100) => ({
    id,
    title,
    value: baseValue + Math.floor(Math.random() * 100),
    type: 'number',
    icon: '📊',
    color: '#3b82f6',
    trend: {
      direction: Math.random() > 0.5 ? 'up' : 'down',
      value: Math.random() * 20
    }
  })
};

export default DashboardKPI;