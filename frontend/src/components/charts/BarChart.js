/*
 * File: frontend/src/components/charts/BarChart.js
 * Description: Modern bar chart component with animations and interactivity
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import './BarChart.css';

const BarChart = ({
  // Data
  data = [],
  
  // Configuration
  title,
  subtitle,
  xKey = 'label',
  yKey = 'value',
  
  // Styling
  width = '100%',
  height = 300,
  size = 'md', // sm, md, lg, xl
  variant = 'vertical', // vertical, horizontal, stacked, grouped
  
  // Colors
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  
  // Features
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showStats = false,
  animated = true,
  
  // Axis
  showXAxis = true,
  showYAxis = true,
  xAxisTitle,
  yAxisTitle,
  
  // Interactivity
  onBarClick,
  onBarHover,
  
  // Actions
  actions = [],
  
  // Loading/Empty
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  
  // Custom
  className = '',
  formatValue = (value) => value.toLocaleString(),
  formatLabel = (label) => label
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });
  const [disabledSeries, setDisabledSeries] = useState(new Set());

  // Calculate chart dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: typeof height === 'number' ? height : rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  // Process data
  const processedData = useMemo(() => {
    if (!data.length) return [];

    // Handle different data formats
    if (variant === 'grouped' || variant === 'stacked') {
      // Multi-series data
      return data.map((item, index) => ({
        ...item,
        index,
        series: Object.keys(item).filter(key => key !== xKey && typeof item[key] === 'number')
      }));
    } else {
      // Single series data
      return data.map((item, index) => ({
        ...item,
        index,
        value: typeof item[yKey] === 'number' ? item[yKey] : 0
      }));
    }
  }, [data, xKey, yKey, variant]);

  // Calculate chart values
  const chartData = useMemo(() => {
    if (!processedData.length || !dimensions.width) return null;

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    let maxValue, minValue;

    if (variant === 'stacked') {
      maxValue = Math.max(...processedData.map(item => 
        item.series.reduce((sum, key) => sum + (item[key] || 0), 0)
      ));
      minValue = 0;
    } else if (variant === 'grouped') {
      const allValues = processedData.flatMap(item => 
        item.series.map(key => item[key] || 0)
      );
      maxValue = Math.max(...allValues);
      minValue = Math.min(...allValues, 0);
    } else {
      const values = processedData.map(item => item.value);
      maxValue = Math.max(...values);
      minValue = Math.min(...values, 0);
    }

    // Add padding to max value
    const padding = (maxValue - minValue) * 0.1;
    maxValue += padding;
    if (minValue > 0) minValue = 0;

    const barWidth = variant === 'grouped' 
      ? (chartWidth / processedData.length) * 0.8 / (processedData[0]?.series.length || 1)
      : (chartWidth / processedData.length) * 0.8;

    return {
      margin,
      chartWidth,
      chartHeight,
      maxValue,
      minValue,
      barWidth,
      valueRange: maxValue - minValue
    };
  }, [processedData, dimensions, variant]);

  // Generate bars
  const bars = useMemo(() => {
    if (!chartData || !processedData.length) return [];

    const { chartWidth, chartHeight, maxValue, minValue, barWidth, valueRange } = chartData;

    return processedData.map((item, index) => {
      const x = (chartWidth / processedData.length) * index + (chartWidth / processedData.length - barWidth) / 2;

      if (variant === 'grouped' && item.series) {
        return item.series.map((seriesKey, seriesIndex) => {
          const value = item[seriesKey] || 0;
          const barHeight = Math.abs(value) / valueRange * chartHeight;
          const y = value >= 0 
            ? chartHeight - barHeight
            : chartHeight;

          return {
            id: `${index}-${seriesIndex}`,
            x: x + (barWidth * seriesIndex),
            y,
            width: barWidth * 0.9,
            height: barHeight,
            value,
            label: item[xKey],
            series: seriesKey,
            color: colors[seriesIndex % colors.length],
            index: seriesIndex
          };
        });
      } else if (variant === 'stacked' && item.series) {
        let stackY = chartHeight;
        return item.series.map((seriesKey, seriesIndex) => {
          const value = item[seriesKey] || 0;
          if (disabledSeries.has(seriesKey)) return null;
          
          const barHeight = value / valueRange * chartHeight;
          stackY -= barHeight;

          return {
            id: `${index}-${seriesIndex}`,
            x,
            y: stackY,
            width: barWidth,
            height: barHeight,
            value,
            label: item[xKey],
            series: seriesKey,
            color: colors[seriesIndex % colors.length],
            index: seriesIndex
          };
        }).filter(Boolean);
      } else {
        const value = item.value;
        const barHeight = Math.abs(value) / valueRange * chartHeight;
        const y = value >= 0 
          ? chartHeight - barHeight
          : chartHeight;

        return [{
          id: index,
          x,
          y,
          width: barWidth,
          height: barHeight,
          value,
          label: item[xKey],
          color: colors[0],
          index: 0
        }];
      }
    }).flat().filter(Boolean);
  }, [chartData, processedData, variant, colors, disabledSeries]);

  // Handle bar interactions
  const handleBarMouseEnter = (bar, event) => {
    setHoveredBar(bar.id);
    
    if (showTooltip) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({
        show: true,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        data: bar
      });
    }
    
    onBarHover?.(bar);
  };

  const handleBarMouseLeave = () => {
    setHoveredBar(null);
    setTooltip({ show: false, x: 0, y: 0, data: null });
  };

  const handleBarClick = (bar) => {
    onBarClick?.(bar);
  };

  // Handle legend click
  const handleLegendClick = (seriesKey) => {
    setDisabledSeries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seriesKey)) {
        newSet.delete(seriesKey);
      } else {
        newSet.add(seriesKey);
      }
      return newSet;
    });
  };

  // Get legend items
  const legendItems = useMemo(() => {
    if (!showLegend || variant === 'vertical' || variant === 'horizontal') return [];

    const series = processedData[0]?.series || [];
    return series.map((seriesKey, index) => ({
      key: seriesKey,
      label: formatLabel(seriesKey),
      color: colors[index % colors.length],
      disabled: disabledSeries.has(seriesKey)
    }));
  }, [showLegend, variant, processedData, colors, disabledSeries, formatLabel]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!showStats || !processedData.length) return null;

    const values = processedData.map(item => item.value || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      total: formatValue(total),
      average: formatValue(average),
      max: formatValue(max),
      min: formatValue(min)
    };
  }, [showStats, processedData, formatValue]);

  if (loading) {
    return (
      <div className={`bar-chart-container ${className}`}>
        {title && (
          <div className="bar-chart-header">
            <div>
              <h3 className="bar-chart-title">{title}</h3>
              {subtitle && <p className="bar-chart-subtitle">{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="bar-chart-loading">
          <div className="bar-chart-loading-spinner"></div>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={`bar-chart-container ${className}`}>
        {title && (
          <div className="bar-chart-header">
            <div>
              <h3 className="bar-chart-title">{title}</h3>
              {subtitle && <p className="bar-chart-subtitle">{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="bar-chart-empty">
          <div className="bar-chart-empty-icon">📊</div>
          <div className="bar-chart-empty-text">{emptyMessage}</div>
          <div className="bar-chart-empty-subtext">Thêm dữ liệu để hiển thị biểu đồ</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`bar-chart-container ${variant} ${size} ${className}`}
      style={{ width }}
    >
      {/* Header */}
      {(title || actions.length > 0) && (
        <div className="bar-chart-header">
          <div>
            {title && <h3 className="bar-chart-title">📊 {title}</h3>}
            {subtitle && <p className="bar-chart-subtitle">{subtitle}</p>}
          </div>
          
          {actions.length > 0 && (
            <div className="bar-chart-actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`bar-chart-action-btn ${action.active ? 'active' : ''}`}
                  onClick={action.onClick}
                  title={action.title}
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart Body */}
      <div className="bar-chart-body">
        <div className={`bar-chart-canvas ${size}`}>
          {chartData && (
            <svg 
              ref={svgRef}
              className="bar-chart-svg"
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            >
              <g transform={`translate(${chartData.margin.left}, ${chartData.margin.top})`}>
                {/* Grid Lines */}
                {showGrid && (
                  <g className="bar-chart-grid">
                    {[...Array(6)].map((_, i) => {
                      const y = (chartData.chartHeight / 5) * i;
                      return (
                        <line
                          key={i}
                          className="bar-chart-grid-line"
                          x1="0"
                          y1={y}
                          x2={chartData.chartWidth}
                          y2={y}
                        />
                      );
                    })}
                  </g>
                )}

                {/* Y Axis */}
                {showYAxis && (
                  <g className="bar-chart-y-axis">
                    <line
                      className="bar-chart-axis"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={chartData.chartHeight}
                    />
                    {[...Array(6)].map((_, i) => {
                      const value = (chartData.maxValue / 5) * (5 - i);
                      const y = (chartData.chartHeight / 5) * i;
                      return (
                        <text
                          key={i}
                          className="bar-chart-axis-label"
                          x="-10"
                          y={y + 4}
                          textAnchor="end"
                        >
                          {formatValue(value)}
                        </text>
                      );
                    })}
                    {yAxisTitle && (
                      <text
                        className="bar-chart-axis-title"
                        x={-chartData.chartHeight / 2}
                        y="-40"
                        textAnchor="middle"
                        transform={`rotate(-90, ${-chartData.chartHeight / 2}, -40)`}
                      >
                        {yAxisTitle}
                      </text>
                    )}
                  </g>
                )}

                {/* X Axis */}
                {showXAxis && (
                  <g className="bar-chart-x-axis">
                    <line
                      className="bar-chart-axis"
                      x1="0"
                      y1={chartData.chartHeight}
                      x2={chartData.chartWidth}
                      y2={chartData.chartHeight}
                    />
                    {processedData.map((item, index) => {
                      const x = (chartData.chartWidth / processedData.length) * index + 
                               (chartData.chartWidth / processedData.length) / 2;
                      return (
                        <text
                          key={index}
                          className="bar-chart-axis-label"
                          x={x}
                          y={chartData.chartHeight + 20}
                          textAnchor="middle"
                        >
                          {formatLabel(item[xKey])}
                        </text>
                      );
                    })}
                    {xAxisTitle && (
                      <text
                        className="bar-chart-axis-title"
                        x={chartData.chartWidth / 2}
                        y={chartData.chartHeight + 50}
                        textAnchor="middle"
                      >
                        {xAxisTitle}
                      </text>
                    )}
                  </g>
                )}

                {/* Bars */}
                <g className="bar-chart-bars">
                  {bars.map((bar) => (
                    <rect
                      key={bar.id}
                      className={`bar-chart-bar ${animated ? 'animated' : ''}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      style={{ '--index': bar.index }}
                      onMouseEnter={(e) => handleBarMouseEnter(bar, e)}
                      onMouseLeave={handleBarMouseLeave}
                      onClick={() => handleBarClick(bar)}
                    />
                  ))}
                </g>
              </g>
            </svg>
          )}
        </div>

        {/* Legend */}
        {showLegend && legendItems.length > 0 && (
          <div className="bar-chart-legend">
            {legendItems.map((item) => (
              <div
                key={item.key}
                className={`bar-chart-legend-item ${item.disabled ? 'disabled' : ''}`}
                onClick={() => handleLegendClick(item.key)}
              >
                <div
                  className="bar-chart-legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span className="bar-chart-legend-label">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {showStats && statistics && (
          <div className="bar-chart-stats">
            <div className="bar-chart-stat">
              <span className="bar-chart-stat-value">{statistics.total}</span>
              <span className="bar-chart-stat-label">Tổng</span>
            </div>
            <div className="bar-chart-stat">
              <span className="bar-chart-stat-value">{statistics.average}</span>
              <span className="bar-chart-stat-label">Trung bình</span>
            </div>
            <div className="bar-chart-stat">
              <span className="bar-chart-stat-value">{statistics.max}</span>
              <span className="bar-chart-stat-label">Cao nhất</span>
            </div>
            <div className="bar-chart-stat">
              <span className="bar-chart-stat-value">{statistics.min}</span>
              <span className="bar-chart-stat-label">Thấp nhất</span>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && tooltip.show && tooltip.data && (
        <div
          className="bar-chart-tooltip show"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <div className="bar-chart-tooltip-title">
            {tooltip.data.label}
          </div>
          <div className="bar-chart-tooltip-value">
            <div
              className="bar-chart-tooltip-color"
              style={{ backgroundColor: tooltip.data.color }}
            />
            <span>
              {tooltip.data.series && `${tooltip.data.series}: `}
              {formatValue(tooltip.data.value)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for chart data management
export const useBarChart = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoadingState] = useState(false);

  const updateData = (newData) => {
    setData(newData);
  };

  const addDataPoint = (point) => {
    setData(prev => [...prev, point]);
  };

  const removeDataPoint = (index) => {
    setData(prev => prev.filter((_, i) => i !== index));
  };

  const setLoading = (isLoading) => {
    setLoadingState(isLoading);
  };

  return {
    data,
    loading,
    updateData,
    addDataPoint,
    removeDataPoint,
    setLoading
  };
};

// Warehouse-specific chart configurations
export const warehouseChartConfig = {
  inventory: {
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    formatValue: (value) => value.toLocaleString() + ' sản phẩm',
    actions: [
      { icon: '📊', label: 'Xuất báo cáo', onClick: () => {} },
      { icon: '🔄', label: 'Làm mới', onClick: () => {} }
    ]
  },
  revenue: {
    colors: ['#10b981', '#3b82f6'],
    formatValue: (value) => new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value),
    actions: [
      { icon: '💰', label: 'Chi tiết', onClick: () => {} },
      { icon: '📈', label: 'Xu hướng', onClick: () => {} }
    ]
  },
  orders: {
    colors: ['#8b5cf6', '#06b6d4', '#f59e0b'],
    formatValue: (value) => value.toLocaleString() + ' đơn',
    actions: [
      { icon: '📋', label: 'Danh sách', onClick: () => {} },
      { icon: '🚚', label: 'Giao hàng', onClick: () => {} }
    ]
  }
};

// Sample data generators
export const generateSampleData = (type = 'simple', count = 7) => {
  const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  switch (type) {
    case 'simple':
      return labels.slice(0, count).map((label, index) => ({
        label,
        value: Math.floor(Math.random() * 100) + 10
      }));
      
    case 'grouped':
      return labels.slice(0, count).map((label) => ({
        label,
        nhap: Math.floor(Math.random() * 50) + 10,
        xuat: Math.floor(Math.random() * 40) + 5,
        ton: Math.floor(Math.random() * 60) + 20
      }));
      
    case 'stacked':
      return labels.slice(0, count).map((label) => ({
        label,
        completed: Math.floor(Math.random() * 30) + 10,
        pending: Math.floor(Math.random() * 20) + 5,
        cancelled: Math.floor(Math.random() * 10) + 1
      }));
      
    default:
      return [];
  }
};

// Pre-built chart components for warehouse
export const InventoryChart = ({ data, ...props }) => (
  <BarChart
    data={data}
    title="Tồn kho theo danh mục"
    xKey="category"
    yKey="quantity"
    {...warehouseChartConfig.inventory}
    {...props}
  />
);

export const RevenueChart = ({ data, ...props }) => (
  <BarChart
    data={data}
    title="Doanh thu theo tháng"
    xKey="month"
    yKey="revenue"
    variant="grouped"
    showStats={true}
    {...warehouseChartConfig.revenue}
    {...props}
  />
);

export const OrdersChart = ({ data, ...props }) => (
  <BarChart
    data={data}
    title="Đơn hàng theo trạng thái"
    variant="stacked"
    showLegend={true}
    {...warehouseChartConfig.orders}
    {...props}
  />
);

// Chart utilities
export const chartUtils = {
  // Export chart as image
  exportChart: (chartRef, filename = 'chart.png') => {
    if (chartRef.current) {
      const svg = chartRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const a = document.createElement('a');
        a.download = filename;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  },
  
  // Calculate chart statistics
  calculateStats: (data, key = 'value') => {
    const values = data.map(item => item[key] || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    return { total, average, max, min };
  },
  
  // Filter data by date range
  filterByDateRange: (data, startDate, endDate, dateKey = 'date') => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return data.filter(item => {
      const itemDate = new Date(item[dateKey]);
      return itemDate >= start && itemDate <= end;
    });
  }
};

export default BarChart;