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
  // Xoá useEffect tạo data mock:
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     const data = generateDetailedWarehouseData();
  //     setWarehouseData(data);
  //     setLoading(false);
  //   }, 800);
  // }, []);

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

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://127.0.0.1:8001/api/warehouse/pallet/').then(res => res.json()),
      fetch('http://127.0.0.1:8001/api/warehouse/vitri/').then(res => res.json())
    ]).then(([palletData, vitriData]) => {
      // palletData: list of pallet, each has ma_pallet, vi_tri_kho (id or object)
      // vitriData: list of vi_tri, each has ma_vi_tri, khu_vuc, id
      const pallets = palletData.results || palletData;
      const vitris = vitriData.results || vitriData;
      // Map pallet by vi_tri_kho id
      const palletByViTri = {};
      pallets.forEach(p => {
        const viTriId = p.vi_tri_kho?.id || p.vi_tri_kho;
        if (viTriId) palletByViTri[viTriId] = p.ma_pallet;
      });
      // Combine
      const combined = vitris.map(v => ({
        ma_vi_tri: v.ma_vi_tri,
        khu_vuc: v.khu_vuc,
        ma_pallet: palletByViTri[v.id] || null
      }));
      setWarehouseData(combined);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Render grid
  if (loading) {
    return <div className="warehouse-grid"><p>Đang tải sơ đồ kho...</p></div>;
  }
  return (
    <div className="warehouse-simple-grid">
      {warehouseData.map((loc, idx) => (
        <div key={idx} className="warehouse-simple-cell">
          <div className="cell-pallet"><strong>{loc.ma_pallet || 'Trống'}</strong></div>
          <div className="cell-vi-tri">{loc.ma_vi_tri}</div>
          <div className="cell-khu-vuc">{loc.khu_vuc}</div>
        </div>
      ))}
    </div>
  );
};

export default WarehouseGrid;