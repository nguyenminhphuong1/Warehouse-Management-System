// frontend/src/pages/NhapHang/WarehouseGrid.js

import React, { useState, useEffect, useMemo } from 'react';
import './WarehouseGrid.css';

const WarehouseGrid = ({ 
  onLocationClick, 
  selectedLocation = null, 
  highlightedLocations = [],
  showDetails = true,
  readOnly = false,
  zoomLevel = 1 
}) => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'heatmap'
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [showTooltip, setShowTooltip] = useState(null);
  const [zoom, setZoom] = useState(zoomLevel);

  // Sample warehouse data with more realistic layout
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = generateDetailedWarehouseData();
      setWarehouseData(data);
      setLoading(false);
    }, 800);
  }, []);

  const generateDetailedWarehouseData = () => {
    const areas = [
      { 
        id: 'A', 
        name: 'Khu vực A - Bia', 
        rows: 5, 
        cols: 6, 
        type: 'bia',
        color: '#28a745',
        temperature: '2-8°C',
        humidity: '60-70%',
        description: 'Khu vực chuyên dụng cho các loại bia, có hệ thống làm mát'
      },
      { 
        id: 'B', 
        name: 'Khu vực B - Nước ngọt', 
        rows: 4, 
        cols: 7, 
        type: 'nuoc_ngot',
        color: '#17a2b8',
        temperature: '5-15°C',
        humidity: '50-60%',
        description: 'Khu vực lưu trữ nước ngọt và đồ uống có ga'
      },
      { 
        id: 'C', 
        name: 'Khu vực C - Nước suối', 
        rows: 6, 
        cols: 5, 
        type: 'nuoc_suoi',
        color: '#ffc107',
        temperature: '10-25°C',
        humidity: '40-50%',
        description: 'Khu vực nước suối và nước khoáng'
      },
      { 
        id: 'D', 
        name: 'Khu vực D - Kho lạnh', 
        rows: 3, 
        cols: 8, 
        type: 'kho_lanh',
        color: '#6f42c1',
        temperature: '0-4°C',
        humidity: '70-80%',
        description: 'Khu vực kho lạnh cho sản phẩm đặc biệt'
      }
    ];

    const allLocations = [];

    areas.forEach(area => {
      for (let row = 1; row <= area.rows; row++) {
        for (let col = 1; col <= area.cols; col++) {
          const position = `${area.id}${row}-${col}`;
          const random = Math.random();
          
          // Create more realistic distribution
          let status, palletData = null, lastActivity = null;
          
          if (random < 0.25) {
            status = 'empty';
          } else if (random < 0.8) {
            status = 'occupied';
            // Generate realistic pallet data
            const palletTypes = {
              bia: ['Heineken 330ml', 'Tiger 355ml', 'Saigon 330ml', 'Budweiser 330ml'],
              nuoc_ngot: ['Coca Cola 355ml', 'Pepsi 330ml', 'Sprite 330ml', 'Fanta 330ml'],
              nuoc_suoi: ['Lavie 500ml', 'Aquafina 1.5L', 'Dasani 600ml', 'Evian 330ml'],
              kho_lanh: ['Sữa tươi Vinamilk', 'Kem Walls', 'Thịt đông lạnh', 'Rau củ quả']
            };
            
            const products = palletTypes[area.type];
            const product = products[Math.floor(Math.random() * products.length)];
            const maxQuantity = Math.floor(Math.random() * 100) + 50;
            const currentQuantity = Math.floor(Math.random() * maxQuantity);
            
            palletData = {
              ma_pallet: `P-2025-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
              san_pham: product,
              so_thung_ban_dau: maxQuantity,
              so_thung_con_lai: currentQuantity,
              ngay_nhap: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              han_su_dung: new Date(Date.now() + (Math.random() * 180 + 30) * 24 * 60 * 60 * 1000).toISOString(),
              nguoi_tao: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'][Math.floor(Math.random() * 4)]
            };
            
            lastActivity = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
          } else if (random < 0.92) {
            status = 'maintenance';
            lastActivity = new Date();
          } else {
            status = 'reserved';
            lastActivity = new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000);
          }

          allLocations.push({
            id: `${area.id}${row}${col}`,
            position,
            area: area.id,
            areaName: area.name,
            areaColor: area.color,
            areaType: area.type,
            row,
            col,
            status,
            palletData,
            lastActivity,
            capacity: Math.floor(Math.random() * 50) + 80,
            temperature: area.temperature,
            humidity: area.humidity,
            accessibility: random > 0.85 ? 'hard' : 'easy',
            nearExit: (area.id === 'A' && row <= 2) || (area.id === 'B' && col <= 2),
            hasCamera: random > 0.7,
            hasTemperatureSensor: area.id === 'D' || random > 0.8,
            maintenanceScheduled: random > 0.95,
            utilizationRate: status === 'occupied' ? 
              (palletData?.so_thung_con_lai / palletData?.so_thung_ban_dau * 100) : 0
          });
        }
      }
    });

    return allLocations;
  };

  // Filter locations based on current filters
  const filteredLocations = useMemo(() => {
    return warehouseData.filter(location => {
      const matchesStatus = filterStatus === 'all' || location.status === filterStatus;
      const matchesArea = selectedArea === 'all' || location.area === selectedArea;
      return matchesStatus && matchesArea;
    });
  }, [warehouseData, filterStatus, selectedArea]);

  // Get warehouse statistics
  const warehouseStats = useMemo(() => {
    const total = warehouseData.length;
    const empty = warehouseData.filter(l => l.status === 'empty').length;
    const occupied = warehouseData.filter(l => l.status === 'occupied').length;
    const maintenance = warehouseData.filter(l => l.status === 'maintenance').length;
    const reserved = warehouseData.filter(l => l.status === 'reserved').length;
    
    const utilizationRate = total > 0 ? (occupied / total * 100) : 0;
    
    // Calculate expiry warnings
    const today = new Date();
    const expiringWarnings = warehouseData.filter(l => {
      if (l.status !== 'occupied' || !l.palletData?.han_su_dung) return false;
      const expiryDate = new Date(l.palletData.han_su_dung);
      const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;

    return {
      total,
      empty,
      occupied,
      maintenance,
      reserved,
      utilizationRate,
      expiringWarnings
    };
  }, [warehouseData]);

  // Group locations by area for grid display
  const locationsByArea = useMemo(() => {
    const areas = {};
    filteredLocations.forEach(location => {
      if (!areas[location.area]) {
        areas[location.area] = {
          info: {
            id: location.area,
            name: location.areaName,
            color: location.areaColor,
            type: location.areaType,
            temperature: location.temperature,
            humidity: location.humidity
          },
          locations: []
        };
      }
      areas[location.area].locations.push(location);
    });
    return areas;
  }, [filteredLocations]);

  // Handle location click
  const handleLocationClick = (location) => {
    if (readOnly) return;
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  // Handle location hover for tooltip
  const handleLocationHover = (location, event) => {
    if (!showDetails) return;
    
    setShowTooltip({
      location,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleLocationLeave = () => {
    setShowTooltip(null);
  };

  // Get location status info
  const getLocationStatusInfo = (status) => {
    const statusMap = {
      empty: { 
        color: '#28a745', 
        icon: 'check-circle', 
        text: 'Trống',
        bgColor: 'rgba(40, 167, 69, 0.1)',
        borderColor: '#28a745'
      },
      occupied: { 
        color: '#dc3545', 
        icon: 'package', 
        text: 'Có hàng',
        bgColor: 'rgba(220, 53, 69, 0.1)',
        borderColor: '#dc3545'
      },
      maintenance: { 
        color: '#ffc107', 
        icon: 'tool', 
        text: 'Bảo trì',
        bgColor: 'rgba(255, 193, 7, 0.1)',
        borderColor: '#ffc107'
      },
      reserved: { 
        color: '#17a2b8', 
        icon: 'clock', 
        text: 'Đặt trước',
        bgColor: 'rgba(23, 162, 184, 0.1)',
        borderColor: '#17a2b8'
      }
    };
    return statusMap[status] || statusMap.empty;
  };

  // Get area icon
  const getAreaIcon = (areaType) => {
    const iconMap = {
      bia: 'coffee',
      nuoc_ngot: 'cup',
      nuoc_suoi: 'droplet',
      kho_lanh: 'thermometer'
    };
    return iconMap[areaType] || 'box';
  };

  if (loading) {
    return (
      <div className="warehouse-grid">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải sơ đồ kho...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="warehouse-grid" style={{ '--zoom-level': zoom }}>
      {/* Header Controls */}
      <div className="warehouse-header">
        <div className="header-left">
          <h3>
            <i className="icon-map"></i>
            Sơ đồ kho
          </h3>
          
          <div className="warehouse-stats">
            <div className="stat-item">
              <span className="stat-value">{warehouseStats.total}</span>
              <span className="stat-label">Tổng vị trí</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#28a745' }}>{warehouseStats.empty}</span>
              <span className="stat-label">Trống</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#dc3545' }}>{warehouseStats.occupied}</span>
              <span className="stat-label">Có hàng</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{warehouseStats.utilizationRate.toFixed(1)}%</span>
              <span className="stat-label">Sử dụng</span>
            </div>
            {warehouseStats.expiringWarnings > 0 && (
              <div className="stat-item warning">
                <span className="stat-value" style={{ color: '#ffc107' }}>{warehouseStats.expiringWarnings}</span>
                <span className="stat-label">Sắp hết hạn</span>
              </div>
            )}
          </div>
        </div>

        <div className="header-controls">
          <div className="view-controls">
            <label>Hiển thị:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="empty">Trống</option>
              <option value="occupied">Có hàng</option>
              <option value="maintenance">Bảo trì</option>
              <option value="reserved">Đặt trước</option>
            </select>
          </div>

          <div className="view-controls">
            <label>Khu vực:</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="A">Khu vực A</option>
              <option value="B">Khu vực B</option>
              <option value="C">Khu vực C</option>
              <option value="D">Khu vực D</option>
            </select>
          </div>

          <div className="zoom-controls">
            <button
              className="btn-icon"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              disabled={zoom <= 0.5}
            >
              <i className="icon-zoom-out"></i>
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button
              className="btn-icon"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              disabled={zoom >= 2}
            >
              <i className="icon-zoom-in"></i>
            </button>
            <button
              className="btn-icon"
              onClick={() => setZoom(1)}
              title="Reset zoom"
            >
              <i className="icon-maximize"></i>
            </button>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Xem dạng lưới"
            >
              <i className="icon-grid"></i>
            </button>
            <button
              className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Xem dạng danh sách"
            >
              <i className="icon-list"></i>
            </button>
            <button
              className={`btn-icon ${viewMode === 'heatmap' ? 'active' : ''}`}
              onClick={() => setViewMode('heatmap')}
              title="Xem heat map"
            >
              <i className="icon-activity"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="warehouse-content">
        {viewMode === 'grid' && (
          <div className="grid-view">
            {Object.entries(locationsByArea).map(([areaId, areaData]) => {
              const maxRow = Math.max(...areaData.locations.map(l => l.row));
              const maxCol = Math.max(...areaData.locations.map(l => l.col));

              return (
                <div key={areaId} className="warehouse-area-section">
                  <div className="area-section-header">
                    <div className="area-title">
                      <i 
                        className={`icon-${getAreaIcon(areaData.info.type)}`}
                        style={{ color: areaData.info.color }}
                      ></i>
                      <span>{areaData.info.name}</span>
                    </div>
                    
                    <div className="area-info">
                      <span className="area-spec">
                        <i className="icon-thermometer"></i>
                        {areaData.info.temperature}
                      </span>
                      <span className="area-spec">
                        <i className="icon-droplet"></i>
                        {areaData.info.humidity}
                      </span>
                      <span className="area-spec">
                        <i className="icon-map-pin"></i>
                        {areaData.locations.length} vị trí
                      </span>
                    </div>
                  </div>

                  <div 
                    className="area-grid"
                    style={{
                      gridTemplateColumns: `repeat(${maxCol}, 1fr)`,
                      gridTemplateRows: `repeat(${maxRow}, 1fr)`
                    }}
                  >
                    {areaData.locations.map(location => {
                      const statusInfo = getLocationStatusInfo(location.status);
                      const isSelected = selectedLocation === location.position;
                      const isHighlighted = highlightedLocations.includes(location.position);
                      
                      // Calculate days until expiry for color coding
                      let expiryClass = '';
                      if (location.palletData?.han_su_dung) {
                        const today = new Date();
                        const expiryDate = new Date(location.palletData.han_su_dung);
                        const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                        if (diffDays < 0) expiryClass = 'expired';
                        else if (diffDays <= 7) expiryClass = 'expiring-soon';
                        else if (diffDays <= 30) expiryClass = 'expiring-warning';
                      }

                      return (
                        <div
                          key={location.id}
                          className={`grid-location ${location.status} ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${expiryClass} ${!readOnly ? 'clickable' : ''}`}
                          style={{
                            gridColumn: location.col,
                            gridRow: location.row,
                            '--status-color': statusInfo.color,
                            '--status-bg': statusInfo.bgColor,
                            '--status-border': statusInfo.borderColor
                          }}
                          onClick={() => handleLocationClick(location)}
                          onMouseEnter={(e) => handleLocationHover(location, e)}
                          onMouseLeave={handleLocationLeave}
                        >
                          <div className="location-content">
                            <div className="location-position">{location.position}</div>
                            
                            <div className="location-status-icon">
                              <i className={`icon-${statusInfo.icon}`}></i>
                            </div>
                            
                            {location.status === 'occupied' && location.palletData && (
                              <div className="location-details">
                                <div className="pallet-code">{location.palletData.ma_pallet}</div>
                                <div className="quantity-bar">
                                  <div 
                                    className="quantity-fill"
                                    style={{ 
                                      width: `${location.utilizationRate}%`,
                                      backgroundColor: location.utilizationRate === 0 ? '#dc3545' : 
                                                     location.utilizationRate < 30 ? '#ffc107' : '#28a745'
                                    }}
                                  ></div>
                                </div>
                                <div className="quantity-text">
                                  {location.palletData.so_thung_con_lai}/{location.palletData.so_thung_ban_dau}
                                </div>
                              </div>
                            )}
                            
                            {location.status === 'empty' && (
                              <div className="location-capacity">{location.capacity}</div>
                            )}
                            
                            {location.hasTemperatureSensor && (
                              <div className="sensor-indicator temp">
                                <i className="icon-thermometer"></i>
                              </div>
                            )}
                            
                            {location.hasCamera && (
                              <div className="sensor-indicator camera">
                                <i className="icon-camera"></i>
                              </div>
                            )}
                            
                            {location.maintenanceScheduled && (
                              <div className="maintenance-indicator">
                                <i className="icon-alert-triangle"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="list-view">
            <div className="list-header">
              <h4>Danh sách vị trí ({filteredLocations.length})</h4>
            </div>
            
            <div className="location-list">
              {filteredLocations.map(location => {
                const statusInfo = getLocationStatusInfo(location.status);
                
                return (
                  <div
                    key={location.id}
                    className={`list-location ${location.status} ${selectedLocation === location.position ? 'selected' : ''}`}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="list-location-header">
                      <div className="location-id">
                        <strong>{location.position}</strong>
                        <span className="area-badge" style={{ backgroundColor: location.areaColor }}>
                          {location.area}
                        </span>
                      </div>
                      
                      <div className="location-status">
                        <span className={`status-badge ${location.status}`}>
                          <i className={`icon-${statusInfo.icon}`}></i>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>
                    
                    {location.status === 'occupied' && location.palletData && (
                      <div className="list-location-details">
                        <div className="detail-row">
                          <span className="label">Pallet:</span>
                          <span className="value">{location.palletData.ma_pallet}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Sản phẩm:</span>
                          <span className="value">{location.palletData.san_pham}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Số lượng:</span>
                          <span className="value">
                            {location.palletData.so_thung_con_lai}/{location.palletData.so_thung_ban_dau} thùng
                            ({location.utilizationRate.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Hết hạn:</span>
                          <span className="value">
                            {new Date(location.palletData.han_su_dung).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="list-location-specs">
                      <span className="spec">
                        <i className="icon-box"></i>
                        {location.capacity} thùng
                      </span>
                      <span className="spec">
                        <i className="icon-thermometer"></i>
                        {location.temperature}
                      </span>
                      {location.accessibility === 'hard' && (
                        <span className="spec warning">
                          <i className="icon-alert-triangle"></i>
                          Khó tiếp cận
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'heatmap' && (
          <div className="heatmap-view">
            <div className="heatmap-header">
              <h4>Heat Map - Mức độ sử dụng</h4>
              <div className="heatmap-legend">
                <span>Ít sử dụng</span>
                <div className="legend-gradient"></div>
                <span>Nhiều sử dụng</span>
              </div>
            </div>
            
            {Object.entries(locationsByArea).map(([areaId, areaData]) => {
              const maxRow = Math.max(...areaData.locations.map(l => l.row));
              const maxCol = Math.max(...areaData.locations.map(l => l.col));
              
              return (
                <div key={areaId} className="heatmap-area">
                  <h5>{areaData.info.name}</h5>
                  
                  <div 
                    className="heatmap-grid"
                    style={{
                      gridTemplateColumns: `repeat(${maxCol}, 1fr)`,
                      gridTemplateRows: `repeat(${maxRow}, 1fr)`
                    }}
                  >
                    {areaData.locations.map(location => {
                      let heatValue = 0;
                      
                      if (location.status === 'occupied' && location.utilizationRate) {
                        heatValue = location.utilizationRate / 100;
                      } else if (location.status === 'maintenance') {
                        heatValue = 0.3;
                      } else if (location.status === 'reserved') {
                        heatValue = 0.2;
                      }
                      
                      const heatColor = `rgba(220, 53, 69, ${heatValue})`;
                      
                      return (
                        <div
                          key={location.id}
                          className="heatmap-cell"
                          style={{
                            gridColumn: location.col,
                            gridRow: location.row,
                            backgroundColor: heatColor,
                            border: heatValue > 0.5 ? '2px solid #dc3545' : '1px solid #dee2e6'
                          }}
                          onMouseEnter={(e) => handleLocationHover(location, e)}
                          onMouseLeave={handleLocationLeave}
                        >
                          <span className="heatmap-position">{location.position}</span>
                          {heatValue > 0.7 && (
                            <div className="heat-indicator">
                              <i className="icon-trending-up"></i>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="location-tooltip"
          style={{
            left: showTooltip.x + 10,
            top: showTooltip.y - 10
          }}
        >
          <div className="tooltip-header">
            <strong>{showTooltip.location.position}</strong>
            <span className="tooltip-area">{showTooltip.location.areaName}</span>
          </div>
          
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span>Trạng thái:</span>
              <span className={`status-${showTooltip.location.status}`}>
                {getLocationStatusInfo(showTooltip.location.status).text}
              </span>
            </div>
            
            <div className="tooltip-row">
              <span>Sức chứa:</span>
              <span>{showTooltip.location.capacity} thùng</span>
            </div>
            
            {showTooltip.location.status === 'occupied' && showTooltip.location.palletData && (
              <>
                <div className="tooltip-row">
                  <span>Pallet:</span>
                  <span>{showTooltip.location.palletData.ma_pallet}</span>
                </div>
                <div className="tooltip-row">
                  <span>Sản phẩm:</span>
                  <span>{showTooltip.location.palletData.san_pham}</span>
                </div>
                <div className="tooltip-row">
                  <span>Số lượng:</span>
                  <span>
                    {showTooltip.location.palletData.so_thung_con_lai}/
                    {showTooltip.location.palletData.so_thung_ban_dau} thùng
                  </span>
                </div>
                <div className="tooltip-row">
                  <span>Sử dụng:</span>
                  <span>{showTooltip.location.utilizationRate.toFixed(1)}%</span>
                </div>
              </>
            )}
            
            <div className="tooltip-row">
              <span>Nhiệt độ:</span>
              <span>{showTooltip.location.temperature}</span>
            </div>
            
            <div className="tooltip-row">
              <span>Độ ẩm:</span>
              <span>{showTooltip.location.humidity}</span>
            </div>
            
            {showTooltip.location.accessibility === 'hard' && (
              <div className="tooltip-row warning">
                <span>⚠️ Khó tiếp cận</span>
              </div>
            )}
            
            {showTooltip.location.nearExit && (
              <div className="tooltip-row info">
                <span>ℹ️ Gần lối ra</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="warehouse-legend">
        <h5>Chú thích:</h5>
        <div className="legend-items">
          {[
            { status: 'empty', label: 'Trống' },
            { status: 'occupied', label: 'Có hàng' },
            { status: 'maintenance', label: 'Bảo trì' },
            { status: 'reserved', label: 'Đặt trước' }
          ].map(item => {
            const statusInfo = getLocationStatusInfo(item.status);
            return (
              <div key={item.status} className="legend-item">
                <div 
                  className="legend-color"
                  style={{
                    backgroundColor: statusInfo.bgColor,
                    borderColor: statusInfo.borderColor
                  }}
                >
                  <i className={`icon-${statusInfo.icon}`} style={{ color: statusInfo.color }}></i>
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
          
          <div className="legend-item">
            <div className="legend-color expiring">
              <i className="icon-alert-triangle" style={{ color: '#ffc107' }}></i>
            </div>
            <span>Sắp hết hạn</span>
          </div>
          
          <div className="legend-item">
            <div className="legend-color sensor">
              <i className="icon-thermometer" style={{ color: '#17a2b8' }}></i>
            </div>
            <span>Có cảm biến</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseGrid;