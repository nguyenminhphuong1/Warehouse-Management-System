// frontend/src/pages/NhapHang/LocationSelector.js

import React, { useState, useEffect } from 'react';
import './LocationSelector.css';

const LocationSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedLocation = null,
  palletInfo = null 
}) => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(selectedLocation);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Sample warehouse data
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const sampleData = generateWarehouseData();
        setWarehouseData(sampleData);
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const generateWarehouseData = () => {
    const areas = ['A', 'B', 'C', 'D'];
    const data = [];

    areas.forEach(area => {
      // Each area has different grid size
      const gridSizes = { A: [5, 4], B: [4, 5], C: [6, 3], D: [3, 6] };
      const [rows, cols] = gridSizes[area];
      
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
          const position = `${area}${row}-${col}`;
          const random = Math.random();
          
          // Generate realistic occupancy
          let status, palletCode = null, capacity = 100;
          
          if (random < 0.3) {
            status = 'empty'; // 30% empty
          } else if (random < 0.85) {
            status = 'occupied'; // 55% occupied
            palletCode = `P-2025-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
          } else if (random < 0.95) {
            status = 'maintenance'; // 10% maintenance
          } else {
            status = 'reserved'; // 5% reserved
          }

          // Area-specific properties
          const areaProps = {
            A: { type: 'bia', temp: '2-8°C', humidity: '60-70%', capacity: 120 },
            B: { type: 'nuoc_ngot', temp: '5-15°C', humidity: '50-60%', capacity: 100 },
            C: { type: 'nuoc_suoi', temp: '10-25°C', humidity: '40-50%', capacity: 150 },
            D: { type: 'kho_lanh', temp: '0-4°C', humidity: '70-80%', capacity: 80 }
          };

          data.push({
            id: `${area}${row}${col}`,
            position,
            area,
            row,
            col,
            status,
            palletCode,
            capacity: areaProps[area].capacity,
            currentLoad: status === 'occupied' ? Math.floor(Math.random() * areaProps[area].capacity) : 0,
            type: areaProps[area].type,
            temperature: areaProps[area].temp,
            humidity: areaProps[area].humidity,
            lastUpdated: new Date().toISOString(),
            accessibility: random > 0.9 ? 'hard' : 'easy', // 10% hard to access
            nearExit: (area === 'A' && row <= 2) || (area === 'B' && col <= 2)
          });
        }
      }
    });

    return data;
  };

  // Filter locations based on search and area
  const filteredLocations = warehouseData.filter(location => {
    const matchesArea = selectedArea === 'all' || location.area === selectedArea;
    const matchesSearch = searchLocation === '' || 
      location.position.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesArea && matchesSearch;
  });

  // Get recommendations for pallet placement
  const getRecommendations = () => {
    if (!palletInfo) return [];

    const availableLocations = warehouseData.filter(loc => loc.status === 'empty');
    
    return availableLocations
      .map(location => {
        let score = 0;
        let reasons = [];

        // Product type matching
        const productTypeMap = {
          'Bia': 'bia',
          'Nước ngọt': 'nuoc_ngot', 
          'Nước suối': 'nuoc_suoi'
        };
        
        if (palletInfo.san_pham?.nhom_hang && 
            location.type === productTypeMap[palletInfo.san_pham.nhom_hang]) {
          score += 30;
          reasons.push('Phù hợp loại sản phẩm');
        }

        // Capacity matching
        const requiredCapacity = palletInfo.so_thung_ban_dau * 1.2; // 20% buffer
        if (location.capacity >= requiredCapacity) {
          score += 20;
          reasons.push('Đủ sức chứa');
        }

        // FIFO - prefer locations with similar products expiring soon
        if (location.nearExit) {
          score += 15;
          reasons.push('Gần lối ra - dễ xuất');
        }

        // Accessibility
        if (location.accessibility === 'easy') {
          score += 10;
          reasons.push('Dễ tiếp cận');
        }

        // Area utilization - prefer less crowded areas
        const areaLocations = warehouseData.filter(l => l.area === location.area);
        const occupancyRate = areaLocations.filter(l => l.status === 'occupied').length / areaLocations.length;
        if (occupancyRate < 0.7) {
          score += 10;
          reasons.push('Khu vực chưa đầy');
        }

        return {
          ...location,
          recommendationScore: score,
          reasons
        };
      })
      .filter(loc => loc.recommendationScore > 0)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 5);
  };

  const recommendations = showRecommendations ? getRecommendations() : [];

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (location.status !== 'empty') {
      return; // Can't select occupied/maintenance locations
    }
    setSelectedPosition(location.position);
  };

  const handleConfirmSelection = () => {
    if (selectedPosition) {
      const location = warehouseData.find(loc => loc.position === selectedPosition);
      onSelect(location);
      onClose();
    }
  };

  const getLocationStatusInfo = (status) => {
    const statusMap = {
      empty: { 
        color: 'success', 
        icon: 'check-circle', 
        text: 'Trống', 
        description: 'Có thể đặt pallet mới',
        clickable: true
      },
      occupied: { 
        color: 'danger', 
        icon: 'package', 
        text: 'Có hàng', 
        description: 'Đã có pallet',
        clickable: false
      },
      maintenance: { 
        color: 'warning', 
        icon: 'tool', 
        text: 'Bảo trì', 
        description: 'Đang bảo trì, không sử dụng được',
        clickable: false
      },
      reserved: { 
        color: 'info', 
        icon: 'clock', 
        text: 'Đặt trước', 
        description: 'Đã được đặt trước',
        clickable: false
      }
    };
    return statusMap[status] || statusMap.empty;
  };

  const getAreaInfo = (area) => {
    const areaMap = {
      A: { name: 'Khu vực A - Bia', color: '#28a745', icon: 'beer' },
      B: { name: 'Khu vực B - Nước ngọt', color: '#17a2b8', icon: 'cup' },
      C: { name: 'Khu vực C - Nước suối', color: '#ffc107', icon: 'droplet' },
      D: { name: 'Khu vực D - Kho lạnh', color: '#6f42c1', icon: 'thermometer' }
    };
    return areaMap[area];
  };

  if (!isOpen) return null;

  return (
    <div className="location-selector-modal">
      <div className="location-selector-content">
        {/* Header */}
        <div className="location-selector-header">
          <div className="header-left">
            <h3>
              <i className="icon-map-pin"></i>
              Chọn vị trí kho
            </h3>
            {palletInfo && (
              <p className="pallet-info">
                Đang chọn vị trí cho: <strong>{palletInfo.san_pham?.ten_san_pham}</strong>
                ({palletInfo.so_thung_ban_dau} thùng)
              </p>
            )}
          </div>
          
          <button className="close-button" onClick={onClose}>
            <i className="icon-x"></i>
          </button>
        </div>

        {/* Controls */}
        <div className="location-controls">
          <div className="controls-row">
            <div className="search-box">
              <i className="icon-search"></i>
              <input
                type="text"
                placeholder="Tìm vị trí (A1-2, B3-4...)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="area-selector"
            >
              <option value="all">Tất cả khu vực</option>
              <option value="A">Khu vực A - Bia</option>
              <option value="B">Khu vực B - Nước ngọt</option>
              <option value="C">Khu vực C - Nước suối</option>
              <option value="D">Khu vực D - Kho lạnh</option>
            </select>
            
            <button
              className={`toggle-recommendations ${showRecommendations ? 'active' : ''}`}
              onClick={() => setShowRecommendations(!showRecommendations)}
            >
              <i className="icon-lightbulb"></i>
              Gợi ý
            </button>
          </div>
        </div>

        <div className="location-content">
          {/* Recommendations Panel */}
          {showRecommendations && recommendations.length > 0 && (
            <div className="recommendations-panel">
              <h4>
                <i className="icon-star"></i>
                Vị trí được đề xuất
              </h4>
              
              <div className="recommendations-list">
                {recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className={`recommendation-item ${selectedPosition === rec.position ? 'selected' : ''}`}
                    onClick={() => handleLocationSelect(rec)}
                  >
                    <div className="rec-header">
                      <div className="rec-position">
                        <strong>{rec.position}</strong>
                        <span className="rec-area">{getAreaInfo(rec.area).name}</span>
                      </div>
                      <div className="rec-score">
                        <span className="score-value">{rec.recommendationScore}</span>
                        <span className="score-label">điểm</span>
                      </div>
                    </div>
                    
                    <div className="rec-details">
                      <div className="rec-specs">
                        <span className="spec-item">
                          <i className="icon-box"></i>
                          {rec.capacity} thùng
                        </span>
                        <span className="spec-item">
                          <i className="icon-thermometer"></i>
                          {rec.temperature}
                        </span>
                      </div>
                      
                      <div className="rec-reasons">
                        {rec.reasons.map((reason, idx) => (
                          <span key={idx} className="reason-tag">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warehouse Grid */}
          <div className="warehouse-grid-container">
            {loading ? (
              <div className="grid-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải sơ đồ kho...</p>
              </div>
            ) : (
              <div className="warehouse-areas">
                {['A', 'B', 'C', 'D'].map(area => {
                  const areaLocations = filteredLocations.filter(loc => loc.area === area);
                  const areaInfo = getAreaInfo(area);
                  
                  if (selectedArea !== 'all' && selectedArea !== area) return null;
                  if (areaLocations.length === 0) return null;

                  // Group by rows and columns
                  const maxRow = Math.max(...areaLocations.map(loc => loc.row));
                  const maxCol = Math.max(...areaLocations.map(loc => loc.col));

                  return (
                    <div key={area} className="warehouse-area">
                      <div className="area-header">
                        <div className="area-title">
                          <i className={`icon-${areaInfo.icon}`} style={{ color: areaInfo.color }}></i>
                          <span>{areaInfo.name}</span>
                        </div>
                        
                        <div className="area-stats">
                          <span className="stat">
                            {areaLocations.filter(l => l.status === 'empty').length} trống
                          </span>
                          <span className="stat">
                            {areaLocations.filter(l => l.status === 'occupied').length} có hàng
                          </span>
                        </div>
                      </div>

                      <div 
                        className="location-grid"
                        style={{
                          gridTemplateColumns: `repeat(${maxCol}, 1fr)`,
                          gridTemplateRows: `repeat(${maxRow}, 1fr)`
                        }}
                      >
                        {areaLocations.map(location => {
                          const statusInfo = getLocationStatusInfo(location.status);
                          const isSelected = selectedPosition === location.position;
                          const isRecommended = recommendations.some(r => r.position === location.position);
                          
                          return (
                            <div
                              key={location.id}
                              className={`location-cell ${location.status} ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''} ${statusInfo.clickable ? 'clickable' : 'disabled'}`}
                              style={{
                                gridColumn: location.col,
                                gridRow: location.row
                              }}
                              onClick={() => statusInfo.clickable && handleLocationSelect(location)}
                              title={`${location.position} - ${statusInfo.description}`}
                            >
                              <div className="cell-content">
                                <div className="cell-position">{location.position}</div>
                                
                                <div className="cell-status">
                                  <i className={`icon-${statusInfo.icon}`}></i>
                                </div>
                                
                                {location.status === 'occupied' && location.palletCode && (
                                  <div className="cell-pallet">{location.palletCode}</div>
                                )}
                                
                                {location.status === 'empty' && (
                                  <div className="cell-capacity">{location.capacity}</div>
                                )}
                                
                                {isRecommended && (
                                  <div className="recommendation-badge">
                                    <i className="icon-star"></i>
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
          </div>
        </div>

        {/* Legend */}
        <div className="location-legend">
          <h5>Chú thích:</h5>
          <div className="legend-items">
            {Object.entries({
              empty: 'Trống - có thể chọn',
              occupied: 'Có hàng - không thể chọn', 
              maintenance: 'Bảo trì - không khả dụng',
              reserved: 'Đặt trước - chờ xử lý'
            }).map(([status, description]) => {
              const statusInfo = getLocationStatusInfo(status);
              return (
                <div key={status} className="legend-item">
                  <div className={`legend-color ${status}`}>
                    <i className={`icon-${statusInfo.icon}`}></i>
                  </div>
                  <span>{description}</span>
                </div>
              );
            })}
            <div className="legend-item">
              <div className="legend-color recommended">
                <i className="icon-star"></i>
              </div>
              <span>Được đề xuất</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="location-actions">
          <div className="selected-info">
            {selectedPosition ? (
              <span>
                Đã chọn: <strong>{selectedPosition}</strong>
                {(() => {
                  const loc = warehouseData.find(l => l.position === selectedPosition);
                  return loc ? ` - ${getAreaInfo(loc.area).name} (${loc.capacity} thùng)` : '';
                })()}
              </span>
            ) : (
              <span>Chưa chọn vị trí nào</span>
            )}
          </div>
          
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={onClose}>
              <i className="icon-x"></i>
              Hủy
            </button>
            
            <button 
              className="btn btn-primary"
              disabled={!selectedPosition}
              onClick={handleConfirmSelection}
            >
              <i className="icon-check"></i>
              Chọn vị trí này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;