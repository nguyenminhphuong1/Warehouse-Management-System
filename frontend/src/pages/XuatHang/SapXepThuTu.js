// src/pages/XuatHang/SapXepThuTu.js - Sắp xếp thứ tự xuất hàng tối ưu

import React, { useState, useEffect, useMemo } from 'react';
import './SapXepThuTu.css';

const SapXepThuTu = ({ orders = [] }) => {
  const [sortedOrders, setSortedOrders] = useState([]);
  const [sortingMethod, setSortingMethod] = useState('priority'); // priority, distance, time, manual
  const [routeOptimization, setRouteOptimization] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const sortingMethods = [
    {
      id: 'priority',
      name: 'Độ ưu tiên',
      description: 'Sắp xếp theo mức độ ưu tiên của đơn hàng',
      icon: '🔥'
    },
    {
      id: 'distance',
      name: 'Khoảng cách',
      description: 'Sắp xếp theo khoảng cách giao hàng gần nhất',
      icon: '📍'
    },
    {
      id: 'time',
      name: 'Thời gian yêu cầu',
      description: 'Sắp xếp theo thời gian giao hàng yêu cầu',
      icon: '⏰'
    },
    {
      id: 'size',
      name: 'Kích thước đơn hàng',
      description: 'Sắp xếp theo số lượng sản phẩm trong đơn',
      icon: '📦'
    },
    {
      id: 'location',
      name: 'Vị trí kho',
      description: 'Sắp xếp theo vị trí hàng trong kho',
      icon: '🏭'
    },
    {
      id: 'manual',
      name: 'Thủ công',
      description: 'Sắp xếp thủ công theo ý muốn',
      icon: '✋'
    }
  ];

  useEffect(() => {
    setSelectedOrders(orders.map(order => order.id));
    applySorting(sortingMethod, orders);
  }, [orders, sortingMethod]);

  const applySorting = (method, ordersToSort = orders) => {
    let sorted = [...ordersToSort];

    switch (method) {
      case 'priority':
        sorted.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;

      case 'distance':
        sorted.sort((a, b) => a.estimatedDistance - b.estimatedDistance);
        break;

      case 'time':
        sorted.sort((a, b) => new Date(a.requestedDate) - new Date(b.requestedDate));
        break;

      case 'size':
        sorted.sort((a, b) => b.totalQuantity - a.totalQuantity);
        break;

      case 'location':
        sorted.sort((a, b) => {
          if (a.location.zone !== b.location.zone) {
            const zoneOrder = { north: 1, central: 2, south: 3 };
            return zoneOrder[a.location.zone] - zoneOrder[b.location.zone];
          }
          return a.warehouseLocation.localeCompare(b.warehouseLocation);
        });
        break;

      case 'manual':
        // Giữ nguyên thứ tự hiện tại cho manual sorting
        break;

      default:
        break;
    }

    setSortedOrders(sorted);
  };

  const optimizeRoute = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate route optimization API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedOrdersData = sortedOrders.filter(order => 
        selectedOrders.includes(order.id)
      );

      // Mock optimization results
      const optimized = [...selectedOrdersData].sort((a, b) => {
        // Simple optimization: group by zone, then by distance
        if (a.location.zone !== b.location.zone) {
          const zoneOrder = { north: 1, central: 2, south: 3 };
          return zoneOrder[a.location.zone] - zoneOrder[b.location.zone];
        }
        return a.estimatedDistance - b.estimatedDistance;
      });

      const totalDistance = optimized.reduce((sum, order, index) => {
        if (index === 0) return order.estimatedDistance;
        return sum + Math.abs(order.estimatedDistance - optimized[index - 1].estimatedDistance);
      }, 0);

      const totalTime = optimized.reduce((sum, order) => sum + order.estimatedTime, 0);
      const estimatedCost = totalDistance * 15000; // 15k VND per km

      setOptimizationResults({
        optimizedOrders: optimized,
        totalDistance,
        totalTime,
        estimatedCost,
        savings: {
          distance: Math.floor(Math.random() * 50) + 20, // km saved
          time: Math.floor(Math.random() * 60) + 30, // minutes saved
          cost: Math.floor(Math.random() * 500000) + 200000 // VND saved
        }
      });

      // Update sorted orders with optimized result
      const updatedSorted = sortedOrders.map(order => {
        const optimizedIndex = optimized.findIndex(opt => opt.id === order.id);
        return optimizedIndex !== -1 ? { ...order, optimizedOrder: optimizedIndex + 1 } : order;
      });

      setSortedOrders(updatedSorted);

    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleOrderMove = (dragIndex, hoverIndex) => {
    if (sortingMethod !== 'manual') return;

    const dragOrder = sortedOrders[dragIndex];
    const newSorted = [...sortedOrders];
    newSorted.splice(dragIndex, 1);
    newSorted.splice(hoverIndex, 0, dragOrder);
    setSortedOrders(newSorted);
  };

  const handleOrderToggle = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === sortedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(sortedOrders.map(order => order.id));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error-600, #dc2626)';
      case 'medium': return 'var(--warning-600, #d97706)';
      case 'low': return 'var(--success-600, #059669)';
      default: return 'var(--text-secondary, #6b7280)';
    }
  };

  const getZoneColor = (zone) => {
    switch (zone) {
      case 'north': return 'var(--blue-600, #2563eb)';
      case 'central': return 'var(--purple-600, #9333ea)';
      case 'south': return 'var(--orange-600, #ea580c)';
      default: return 'var(--gray-600, #4b5563)';
    }
  };

  return (
    <div className="sap-xep-thu-tu-container">
      {/* Header */}
      <div className="sorting-header">
        <div className="header-content">
          <h2>Sắp xếp thứ tự xuất hàng</h2>
          <p>Tối ưu hóa quy trình xuất hàng để tiết kiệm thời gian và chi phí</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">{sortedOrders.length}</div>
              <div className="stat-label">Tổng đơn hàng</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{selectedOrders.length}</div>
              <div className="stat-label">Đã chọn</div>
            </div>
          </div>
          {optimizationResults && (
            <div className="stat-card success">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">
                  {(optimizationResults.savings.cost / 1000).toFixed(0)}K
                </div>
                <div className="stat-label">Tiết kiệm (VND)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="sorting-controls">
        <div className="controls-section">
          <h3>Phương pháp sắp xếp</h3>
          <div className="sorting-methods">
            {sortingMethods.map(method => (
              <button
                key={method.id}
                className={`method-btn ${sortingMethod === method.id ? 'active' : ''}`}
                onClick={() => setSortingMethod(method.id)}
              >
                <span className="method-icon">{method.icon}</span>
                <div className="method-content">
                  <div className="method-name">{method.name}</div>
                  <div className="method-description">{method.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="optimization-section">
          <div className="optimization-controls">
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={routeOptimization}
                  onChange={(e) => setRouteOptimization(e.target.checked)}
                />
                <span className="checkmark"></span>
                Tối ưu hóa tuyến đường
              </label>
            </div>
            
            <button
              className="btn btn-primary"
              onClick={optimizeRoute}
              disabled={selectedOrders.length < 2 || isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <span className="btn-icon loading">🔄</span>
                  Đang tối ưu...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Tối ưu hóa ({selectedOrders.length} đơn)
                </>
              )}
            </button>
          </div>

          {optimizationResults && (
            <div className="optimization-results">
              <h4>Kết quả tối ưu hóa</h4>
              <div className="results-grid">
                <div className="result-item">
                  <span className="result-icon">📍</span>
                  <div className="result-content">
                    <div className="result-value">{optimizationResults.totalDistance} km</div>
                    <div className="result-label">Tổng quãng đường</div>
                    <div className="result-savings">
                      -{optimizationResults.savings.distance} km
                    </div>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-icon">⏱️</span>
                  <div className="result-content">
                    <div className="result-value">
                      {Math.floor(optimizationResults.totalTime / 60)}h {optimizationResults.totalTime % 60}m
                    </div>
                    <div className="result-label">Tổng thời gian</div>
                    <div className="result-savings">
                      -{Math.floor(optimizationResults.savings.time / 60)}h {optimizationResults.savings.time % 60}m
                    </div>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-icon">💰</span>
                  <div className="result-content">
                    <div className="result-value">
                      {(optimizationResults.estimatedCost / 1000000).toFixed(1)}M
                    </div>
                    <div className="result-label">Chi phí ước tính</div>
                    <div className="result-savings">
                      -{(optimizationResults.savings.cost / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-icon">📦</span>
                  <div className="result-content">
                    <div className="result-value">{optimizationResults.optimizedOrders.length}</div>
                    <div className="result-label">Đơn hàng tối ưu</div>
                    <div className="result-efficiency">
                      Hiệu quả: +{Math.floor(Math.random() * 30) + 15}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-section">
        <div className="section-header">
          <div className="header-left">
            <h3>Danh sách đơn hàng ({sortedOrders.length})</h3>
            <div className="bulk-actions">
              <button
                className="btn btn-outline btn-sm"
                onClick={handleSelectAll}
              >
                {selectedOrders.length === sortedOrders.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
          </div>
          
          <div className="header-right">
            <div className="view-options">
              <span className="view-label">Sắp xếp theo:</span>
              <span className="current-method">
                {sortingMethods.find(m => m.id === sortingMethod)?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="orders-list">
          {sortedOrders.map((order, index) => (
            <div
              key={order.id}
              className={`order-item ${selectedOrders.includes(order.id) ? 'selected' : ''} ${
                sortingMethod === 'manual' ? 'draggable' : ''
              }`}
              draggable={sortingMethod === 'manual'}
              onDragStart={(e) => e.dataTransfer.setData('dragIndex', index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'));
                handleOrderMove(dragIndex, index);
              }}
            >
              <div className="order-index">
                {sortingMethod === 'manual' ? (
                  <span className="drag-handle">⋮⋮</span>
                ) : (
                  <span className="order-number">{index + 1}</span>
                )}
                {optimizationResults && order.optimizedOrder && (
                  <span className="optimized-badge">Tối ưu #{order.optimizedOrder}</span>
                )}
              </div>

              <div className="order-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleOrderToggle(order.id)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>

              <div className="order-info">
                <div className="order-header">
                  <div className="order-code">{order.code}</div>
                  <div className="order-priority">
                    <span 
                      className="priority-dot"
                      style={{ backgroundColor: getPriorityColor(order.priority) }}
                    ></span>
                    <span className="priority-text">
                      {order.priority === 'high' ? 'Cao' : 
                       order.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </div>
                </div>
                
                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">Cửa hàng:</span>
                    <span className="detail-value">{order.storeName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Địa chỉ:</span>
                    <span className="detail-value">{order.storeAddress}</span>
                  </div>
                </div>
              </div>

              <div className="order-metrics">
                <div className="metric-grid">
                  <div className="metric-item">
                    <span className="metric-icon">📦</span>
                    <div className="metric-content">
                      <div className="metric-value">{order.totalItems}</div>
                      <div className="metric-label">SP</div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <span className="metric-icon">📊</span>
                    <div className="metric-content">
                      <div className="metric-value">{order.totalQuantity}</div>
                      <div className="metric-label">SL</div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <span className="metric-icon">📍</span>
                    <div className="metric-content">
                      <div className="metric-value">{order.estimatedDistance}</div>
                      <div className="metric-label">km</div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <span className="metric-icon">⏱️</span>
                    <div className="metric-content">
                      <div className="metric-value">{Math.floor(order.estimatedTime / 60)}h</div>
                      <div className="metric-label">{order.estimatedTime % 60}m</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-location">
                <div className="location-info">
                  <div className="warehouse-location">
                    <span className="location-icon">🏭</span>
                    <span className="location-text">{order.warehouseLocation}</span>
                  </div>
                  <div className="delivery-zone">
                    <span 
                      className="zone-dot"
                      style={{ backgroundColor: getZoneColor(order.location?.zone) }}
                    ></span>
                    <span className="zone-text">
                      {order.location?.zone === 'north' ? 'Miền Bắc' :
                       order.location?.zone === 'central' ? 'Miền Trung' : 'Miền Nam'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-actions">
                <button className="btn btn-outline btn-sm">
                  <span className="btn-icon">👁️</span>
                  Chi tiết
                </button>
                <button className="btn btn-outline btn-sm">
                  <span className="btn-icon">📍</span>
                  Bản đồ
                </button>
              </div>
            </div>
          ))}

          {sortedOrders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Không có đơn hàng nào</h3>
              <p>Hiện tại không có đơn hàng nào cần sắp xếp.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {selectedOrders.length > 0 && (
        <div className="summary-section">
          <div className="summary-header">
            <h3>Tóm tắt xuất hàng</h3>
            <div className="summary-actions">
              <button className="btn btn-outline">
                <span className="btn-icon">📋</span>
                Xuất báo cáo
              </button>
              <button className="btn btn-outline">
                <span className="btn-icon">🖨️</span>
                In danh sách
              </button>
              <button className="btn btn-success">
                <span className="btn-icon">🚚</span>
                Bắt đầu xuất hàng ({selectedOrders.length} đơn)
              </button>
            </div>
          </div>

          <div className="summary-content">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Tổng đơn hàng:</span>
                <span className="stat-value">{selectedOrders.length}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Tổng sản phẩm:</span>
                <span className="stat-value">
                  {sortedOrders
                    .filter(order => selectedOrders.includes(order.id))
                    .reduce((sum, order) => sum + order.totalItems, 0)}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Tổng số lượng:</span>
                <span className="stat-value">
                  {sortedOrders
                    .filter(order => selectedOrders.includes(order.id))
                    .reduce((sum, order) => sum + order.totalQuantity, 0)}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Quãng đường ước tính:</span>
                <span className="stat-value">
                  {sortedOrders
                    .filter(order => selectedOrders.includes(order.id))
                    .reduce((sum, order) => sum + order.estimatedDistance, 0)} km
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Thời gian ước tính:</span>
                <span className="stat-value">
                  {Math.floor(sortedOrders
                    .filter(order => selectedOrders.includes(order.id))
                    .reduce((sum, order) => sum + order.estimatedTime, 0) / 60)}h
                </span>
              </div>
            </div>

            {optimizationResults && (
              <div className="optimization-summary">
                <h4>Hiệu quả tối ưu hóa</h4>
                <div className="efficiency-metrics">
                  <div className="efficiency-item success">
                    <span className="efficiency-icon">📍</span>
                    <span className="efficiency-text">
                      Tiết kiệm {optimizationResults.savings.distance} km quãng đường
                    </span>
                  </div>
                  <div className="efficiency-item success">
                    <span className="efficiency-icon">⏱️</span>
                    <span className="efficiency-text">
                      Tiết kiệm {Math.floor(optimizationResults.savings.time / 60)}h {optimizationResults.savings.time % 60}m
                    </span>
                  </div>
                  <div className="efficiency-item success">
                    <span className="efficiency-icon">💰</span>
                    <span className="efficiency-text">
                      Tiết kiệm {(optimizationResults.savings.cost / 1000).toFixed(0)}K VND chi phí
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SapXepThuTu;