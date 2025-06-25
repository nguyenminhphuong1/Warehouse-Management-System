/*
 * File: frontend/src/components/charts/LineChart.js
 * Description: Modern line chart component with smooth animations and interactions
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import './LineChart.css';

const LineChart = ({
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
  
  // Colors
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  
  // Features
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showPoints = true,
  showArea = false,
  showStats = false,
  animated = true,
  smooth = true,
  
  // Axis
  showXAxis = true,
  showYAxis = true,
  xAxisTitle,
  yAxisTitle,
  
  // Interactivity
  onPointClick,
  onPointHover,
  enableZoom = false,
  enableCrosshair = true,
  
  // Actions
  actions = [],
  
  // Loading/Empty
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  
  // Custom
  className = '',
  formatValue = (value) => value.toLocaleString(),
  formatLabel = (label) => label,
  lineWidth = 3
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });
  const [crosshair, setCrosshair] = useState({ show: false, x: 0, y: 0 });
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

  // Process data for multiple series
  const processedData = useMemo(() => {
    if (!data.length) return { series: [], xLabels: [] };

    // Detect if data has multiple series
    const firstItem = data[0];
    const numericKeys = Object.keys(firstItem).filter(
      key => key !== xKey && typeof firstItem[key] === 'number'
    );

    if (numericKeys.length > 1) {
      // Multiple series
      const xLabels = data.map(item => item[xKey]);
      const series = numericKeys.map((key, index) => ({
        key,
        label: formatLabel(key),
        color: colors[index % colors.length],
        data: data.map((item, dataIndex) => ({
          x: dataIndex,
          y: item[key] || 0,
          label: item[xKey],
          originalValue: item[key]
        })),
        disabled: disabledSeries.has(key)
      }));

      return { series, xLabels };
    } else {
      // Single series
      const xLabels = data.map(item => item[xKey]);
      const series = [{
        key: yKey,
        label: 'Giá trị',
        color: colors[0],
        data: data.map((item, index) => ({
          x: index,
          y: item[yKey] || 0,
          label: item[xKey],
          originalValue: item[yKey]
        })),
        disabled: false
      }];

      return { series, xLabels };
    }
  }, [data, xKey, yKey, colors, formatLabel, disabledSeries]);

  // Calculate chart layout
  const chartLayout = useMemo(() => {
    if (!dimensions.width || !processedData.series.length) return null;

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    // Calculate value ranges
    const activeSeries = processedData.series.filter(s => !s.disabled);
    const allValues = activeSeries.flatMap(series => series.data.map(d => d.y));
    
    const maxValue = Math.max(...allValues, 0);
    const minValue = Math.min(...allValues, 0);
    const valueRange = maxValue - minValue;
    const padding = valueRange * 0.1;

    return {
      margin,
      chartWidth,
      chartHeight,
      maxValue: maxValue + padding,
      minValue: minValue - padding,
      valueRange: valueRange + (padding * 2),
      xScale: chartWidth / Math.max(processedData.xLabels.length - 1, 1),
      yScale: chartHeight / (valueRange + (padding * 2))
    };
  }, [dimensions, processedData]);

  // Generate SVG paths
  const pathData = useMemo(() => {
    if (!chartLayout || !processedData.series.length) return [];

    return processedData.series
      .filter(series => !series.disabled)
      .map(series => {
        const points = series.data.map(point => {
          const x = point.x * chartLayout.xScale;
          const y = chartLayout.chartHeight - ((point.y - chartLayout.minValue) * chartLayout.yScale);
          return { x, y, ...point };
        });

        // Generate line path
        let linePath = '';
        if (smooth && points.length > 1) {
          // Smooth curve using bezier curves
          linePath = `M ${points[0].x} ${points[0].y}`;
          
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];
            
            if (i === 1) {
              const cp1x = prev.x + (curr.x - prev.x) * 0.3;
              const cp1y = prev.y;
              const cp2x = curr.x - (curr.x - prev.x) * 0.3;
              const cp2y = curr.y;
              linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
            } else {
              const cp1x = prev.x + (curr.x - (points[i - 2]?.x || prev.x)) * 0.15;
              const cp1y = prev.y + (curr.y - (points[i - 2]?.y || prev.y)) * 0.15;
              const cp2x = curr.x - ((next?.x || curr.x) - prev.x) * 0.15;
              const cp2y = curr.y - ((next?.y || curr.y) - prev.y) * 0.15;
              linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
            }
          }
        } else {
          // Straight lines
          linePath = points.map((point, index) => 
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
          ).join(' ');
        }

        // Generate area path
        let areaPath = '';
        if (showArea) {
          const baseY = chartLayout.chartHeight - ((0 - chartLayout.minValue) * chartLayout.yScale);
          areaPath = linePath + 
                    ` L ${points[points.length - 1].x} ${baseY}` +
                    ` L ${points[0].x} ${baseY} Z`;
        }

        return {
          ...series,
          points,
          linePath,
          areaPath
        };
      });
  }, [chartLayout, processedData, smooth, showArea]);

  // Handle mouse interactions
  const handleMouseMove = (event) => {
    if (!chartLayout || !enableCrosshair) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.querySelector('.line-chart-canvas').getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left - chartLayout.margin.left;
    const mouseY = event.clientY - containerRect.top - chartLayout.margin.top;

    if (mouseX >= 0 && mouseX <= chartLayout.chartWidth && 
        mouseY >= 0 && mouseY <= chartLayout.chartHeight) {
      setCrosshair({ show: true, x: mouseX, y: mouseY });

      // Find nearest data point
      const xIndex = Math.round(mouseX / chartLayout.xScale);
      if (xIndex >= 0 && xIndex < processedData.xLabels.length) {
        const tooltipData = pathData.map(series => {
          const point = series.points[xIndex];
          return point ? {
            series: series.label,
            color: series.color,
            value: point.originalValue,
            label: point.label
          } : null;
        }).filter(Boolean);

        if (tooltipData.length > 0) {
          setTooltip({
            show: true,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            data: {
              label: tooltipData[0].label,
              series: tooltipData
            }
          });
        }
      }
    } else {
      setCrosshair({ show: false, x: 0, y: 0 });
      setTooltip({ show: false, x: 0, y: 0, data: null });
    }
  };

  const handleMouseLeave = () => {
    setCrosshair({ show: false, x: 0, y: 0 });
    setTooltip({ show: false, x: 0, y: 0, data: null });
    setHoveredPoint(null);
  };

  const handlePointClick = (point, series) => {
    onPointClick?.({ ...point, series: series.key });
  };

  const handlePointHover = (point, series) => {
    setHoveredPoint(`${series.key}-${point.x}`);
    onPointHover?.({ ...point, series: series.key });
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

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!showStats || !processedData.series.length) return null;

    const activeSeries = processedData.series.filter(s => !s.disabled);
    const allValues = activeSeries.flatMap(series => series.data.map(d => d.y));
    
    if (allValues.length === 0) return null;

    const total = allValues.reduce((sum, val) => sum + val, 0);
    const average = total / allValues.length;
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);

    // Calculate trend (simple linear regression)
    const trend = allValues.length > 1 ? 
      (allValues[allValues.length - 1] - allValues[0]) / allValues[0] * 100 : 0;

    return {
      total: formatValue(total),
      average: formatValue(average),
      max: formatValue(max),
      min: formatValue(min),
      trend: {
        value: Math.abs(trend).toFixed(1) + '%',
        direction: trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral',
        label: trend > 0 ? '↗ Tăng' : trend < 0 ? '↘ Giảm' : '→ Ổn định'
      }
    };
  }, [showStats, processedData, formatValue]);

  if (loading) {
    return (
      <div className={`line-chart-container ${className}`}>
        {title && (
          <div className="line-chart-header">
            <div>
              <h3 className="line-chart-title">{title}</h3>
              {subtitle && <p className="line-chart-subtitle">{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="line-chart-loading">
          <div className="line-chart-loading-spinner"></div>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={`line-chart-container ${className}`}>
        {title && (
          <div className="line-chart-header">
            <div>
              <h3 className="line-chart-title">{title}</h3>
              {subtitle && <p className="line-chart-subtitle">{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="line-chart-empty">
          <div className="line-chart-empty-icon">📈</div>
          <div className="line-chart-empty-text">{emptyMessage}</div>
          <div className="line-chart-empty-subtext">Thêm dữ liệu để hiển thị biểu đồ</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`line-chart-container ${size} ${className}`}
      style={{ width }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      {(title || actions.length > 0) && (
        <div className="line-chart-header">
          <div>
            {title && <h3 className="line-chart-title">📈 {title}</h3>}
            {subtitle && <p className="line-chart-subtitle">{subtitle}</p>}
          </div>
          
          {actions.length > 0 && (
            <div className="line-chart-actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`line-chart-action-btn ${action.active ? 'active' : ''}`}
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
      <div className="line-chart-body">
        <div className={`line-chart-canvas ${size}`}>
          {chartLayout && (
            <svg 
              ref={svgRef}
              className="line-chart-svg"
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            >
              <g transform={`translate(${chartLayout.margin.left}, ${chartLayout.margin.top})`}>
                {/* Grid Lines */}
                {showGrid && (
                  <g className="line-chart-grid">
                    {/* Horizontal grid lines */}
                    {[...Array(6)].map((_, i) => {
                      const y = (chartLayout.chartHeight / 5) * i;
                      return (
                        <line
                          key={`h-${i}`}
                          className="line-chart-grid-line"
                          x1="0"
                          y1={y}
                          x2={chartLayout.chartWidth}
                          y2={y}
                        />
                      );
                    })}
                    {/* Vertical grid lines */}
                    {processedData.xLabels.map((_, i) => {
                      const x = i * chartLayout.xScale;
                      return (
                        <line
                          key={`v-${i}`}
                          className="line-chart-grid-line"
                          x1={x}
                          y1="0"
                          x2={x}
                          y2={chartLayout.chartHeight}
                        />
                      );
                    })}
                  </g>
                )}

                {/* Y Axis */}
                {showYAxis && (
                  <g className="line-chart-y-axis">
                    <line
                      className="line-chart-axis"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={chartLayout.chartHeight}
                    />
                    {[...Array(6)].map((_, i) => {
                      const value = chartLayout.maxValue - ((chartLayout.maxValue - chartLayout.minValue) / 5) * i;
                      const y = (chartLayout.chartHeight / 5) * i;
                      return (
                        <text
                          key={i}
                          className="line-chart-axis-label"
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
                        className="line-chart-axis-title"
                        x={-chartLayout.chartHeight / 2}
                        y="-40"
                        textAnchor="middle"
                        transform={`rotate(-90, ${-chartLayout.chartHeight / 2}, -40)`}
                      >
                        {yAxisTitle}
                      </text>
                    )}
                  </g>
                )}

                {/* X Axis */}
                {showXAxis && (
                  <g className="line-chart-x-axis">
                    <line
                      className="line-chart-axis"
                      x1="0"
                      y1={chartLayout.chartHeight}
                      x2={chartLayout.chartWidth}
                      y2={chartLayout.chartHeight}
                    />
                    {processedData.xLabels.map((label, index) => {
                      const x = index * chartLayout.xScale;
                      return (
                        <text
                          key={index}
                          className="line-chart-axis-label"
                          x={x}
                          y={chartLayout.chartHeight + 20}
                          textAnchor="middle"
                        >
                          {formatLabel(label)}
                        </text>
                      );
                    })}
                    {xAxisTitle && (
                      <text
                        className="line-chart-axis-title"
                        x={chartLayout.chartWidth / 2}
                        y={chartLayout.chartHeight + 50}
                        textAnchor="middle"
                      >
                        {xAxisTitle}
                      </text>
                    )}
                  </g>
                )}

                {/* Chart Areas */}
                {showArea && pathData.map((series) => (
                  <path
                    key={`area-${series.key}`}
                    className={`line-chart-area ${animated ? 'animated' : ''}`}
                    d={series.areaPath}
                    fill={series.color}
                  />
                ))}

                {/* Chart Lines */}
                {pathData.map((series) => (
                  <path
                    key={`line-${series.key}`}
                    className={`line-chart-line ${animated ? 'animated' : ''}`}
                    d={series.linePath}
                    stroke={series.color}
                    strokeWidth={lineWidth}
                  />
                ))}

                {/* Chart Points */}
                {showPoints && pathData.map((series) =>
                  series.points.map((point, index) => (
                    <circle
                      key={`point-${series.key}-${index}`}
                      className={`line-chart-point ${animated ? 'animated' : ''} ${showPoints ? 'show' : ''}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      stroke={series.color}
                      style={{ '--index': index }}
                      onMouseEnter={() => handlePointHover(point, series)}
                      onClick={() => handlePointClick(point, series)}
                    />
                  ))
                )}

                {/* Crosshair */}
                {enableCrosshair && crosshair.show && (
                  <g className="line-chart-crosshair-group">
                    <line
                      className={`line-chart-crosshair ${crosshair.show ? 'show' : ''}`}
                      x1={crosshair.x}
                      y1="0"
                      x2={crosshair.x}
                      y2={chartLayout.chartHeight}
                    />
                    <line
                      className={`line-chart-crosshair ${crosshair.show ? 'show' : ''}`}
                      x1="0"
                      y1={crosshair.y}
                      x2={chartLayout.chartWidth}
                      y2={crosshair.y}
                    />
                  </g>
                )}
              </g>
            </svg>
          )}
        </div>

        {/* Legend */}
        {showLegend && processedData.series.length > 1 && (
          <div className="line-chart-legend">
            {processedData.series.map((series) => (
              <div
                key={series.key}
                className={`line-chart-legend-item ${series.disabled ? 'disabled' : ''}`}
                onClick={() => handleLegendClick(series.key)}
              >
                <div
                  className="line-chart-legend-color"
                  style={{ backgroundColor: series.color }}
                />
                <span className="line-chart-legend-label">{series.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {showStats && statistics && (
          <div className="line-chart-stats">
            <div className="line-chart-stat">
              <span className="line-chart-stat-value">{statistics.total}</span>
              <span className="line-chart-stat-label">Tổng</span>
            </div>
            <div className="line-chart-stat">
              <span className="line-chart-stat-value">{statistics.average}</span>
              <span className="line-chart-stat-label">Trung bình</span>
            </div>
            <div className="line-chart-stat">
              <span className="line-chart-stat-value">{statistics.max}</span>
              <span className="line-chart-stat-label">Cao nhất</span>
            </div>
            <div className="line-chart-stat">
              <span className="line-chart-stat-value">{statistics.min}</span>
              <span className="line-chart-stat-label">Thấp nhất</span>
              <div className={`line-chart-stat-change ${statistics.trend.direction}`}>
                {statistics.trend.label} {statistics.trend.value}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && tooltip.show && tooltip.data && (
        <div
          className="line-chart-tooltip show"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <div className="line-chart-tooltip-title">
            {tooltip.data.label}
          </div>
          {tooltip.data.series.map((item, index) => (
            <div key={index} className="line-chart-tooltip-item">
              <div
                className="line-chart-tooltip-color"
                style={{ backgroundColor: item.color }}
              />
              <span className="line-chart-tooltip-label">{item.series}:</span>
              <span className="line-chart-tooltip-value">
                {formatValue(item.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Hook for line chart data management
export const useLineChart = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const updateData = (newData) => {
    setData(newData);
  };

  const addDataPoint = (point) => {
    setData(prev => [...prev, point]);
  };

  const removeDataPoint = (index) => {
    setData(prev => prev.filter((_, i) => i !== index));
  };

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };

  return {
    data,
    loading,
    updateData,
    addDataPoint,
    removeDataPoint,
    setLoading: setLoadingState
  };
};

// Pre-built line chart components for warehouse
export const TrendChart = ({ data, ...props }) => (
  <LineChart
    data={data}
    title="Xu hướng theo thời gian"
    showArea={true}
    smooth={true}
    showStats={true}
    {...props}
  />
);

export const ComparisonChart = ({ data, ...props }) => (
  <LineChart
    data={data}
    title="So sánh theo thời gian"
    showLegend={true}
    showPoints={true}
    enableCrosshair={true}
    {...props}
  />
);

export const PerformanceChart = ({ data, ...props }) => (
  <LineChart
    data={data}
    title="Hiệu suất hoạt động"
    showGrid={true}
    showStats={true}
    showArea={true}
    smooth={true}
    {...props}
  />
);

export default LineChart;