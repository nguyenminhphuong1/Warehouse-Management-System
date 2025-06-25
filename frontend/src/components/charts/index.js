/*
 * File: frontend/src/components/charts/index.js
 * Description: Central export file for all chart components
 * Author: Warehouse Management System
 * Created: 2025
 */

// =============================================================================
// CHART COMPONENTS
// =============================================================================

// Bar Chart
export { default as BarChart } from './BarChart';
export { 
  useBarChart,
  warehouseChartConfig,
  generateSampleData,
  InventoryChart,
  RevenueChart,
  OrdersChart,
  chartUtils
} from './BarChart';

// Line Chart
export { default as LineChart } from './LineChart';
export { 
  useLineChart,
  TrendChart,
  ComparisonChart,
  PerformanceChart
} from './LineChart';

// =============================================================================
// CHART COLLECTIONS
// =============================================================================

// All Chart Components
export const ChartComponents = {
  BarChart,
  LineChart,
  InventoryChart,
  RevenueChart,
  OrdersChart,
  TrendChart,
  ComparisonChart,
  PerformanceChart
};

// Chart Hooks
export const ChartHooks = {
  useBarChart,
  useLineChart
};

// =============================================================================
// WAREHOUSE-SPECIFIC CONFIGURATIONS
// =============================================================================

// Chart color palettes
export const ChartColors = {
  primary: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'],
  success: ['#10b981', '#059669', '#047857', '#065f46'],
  warning: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
  danger: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
  rainbow: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  warehouse: ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'],
  neutral: ['#6b7280', '#4b5563', '#374151', '#1f2937', '#111827']
};

// Common chart configurations
export const ChartConfigs = {
  dashboard: {
    size: 'md',
    animated: true,
    showGrid: true,
    colors: ChartColors.warehouse
  },
  
  report: {
    size: 'lg',
    animated: false,
    showGrid: true,
    showStats: true,
    colors: ChartColors.primary
  },
  
  mobile: {
    size: 'sm',
    animated: true,
    showGrid: false,
    colors: ChartColors.rainbow
  },
  
  presentation: {
    size: 'xl',
    animated: true,
    showGrid: true,
    showStats: true,
    colors: ChartColors.warehouse
  }
};

// Value formatters
export const ChartFormatters = {
  currency: (value) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value),
  
  number: (value) => new Intl.NumberFormat('vi-VN').format(value),
  
  percentage: (value) => `${value.toFixed(1)}%`,
  
  quantity: (value) => `${new Intl.NumberFormat('vi-VN').format(value)} sản phẩm`,
  
  orders: (value) => `${new Intl.NumberFormat('vi-VN').format(value)} đơn`,
  
  weight: (value) => `${value.toFixed(1)} kg`,
  
  shortNumber: (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(0);
  }
};

// =============================================================================
// CHART UTILITIES
// =============================================================================

// Data generators for testing
export const ChartDataGenerators = {
  // Generate time series data
  timeSeries: (days = 30, series = 1) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const item = {
        label: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
        date: date.toISOString().split('T')[0]
      };
      
      for (let s = 0; s < series; s++) {
        const seriesName = series === 1 ? 'value' : `series${s + 1}`;
        item[seriesName] = Math.floor(Math.random() * 100) + 10;
      }
      
      data.push(item);
    }
    
    return data;
  },
  
  // Generate category data
  categories: (categories = ['A', 'B', 'C', 'D'], series = 1) => {
    return categories.map(category => {
      const item = { label: category };
      
      for (let s = 0; s < series; s++) {
        const seriesName = series === 1 ? 'value' : `series${s + 1}`;
        item[seriesName] = Math.floor(Math.random() * 100) + 10;
      }
      
      return item;
    });
  },
  
  // Generate warehouse-specific data
  inventory: () => [
    { category: 'Điện tử', quantity: 1250, value: 15000000 },
    { category: 'Quần áo', quantity: 2100, value: 8500000 },
    { category: 'Thực phẩm', quantity: 890, value: 3200000 },
    { category: 'Gia dụng', quantity: 650, value: 7800000 },
    { category: 'Sách', quantity: 420, value: 2100000 }
  ],
  
  revenue: () => {
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    return months.map(month => ({
      month,
      doanhthu: Math.floor(Math.random() * 50000000) + 10000000,
      loinhuan: Math.floor(Math.random() * 15000000) + 3000000
    }));
  },
  
  orders: () => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return days.map(day => ({
      day,
      hoantat: Math.floor(Math.random() * 50) + 20,
      danggiao: Math.floor(Math.random() * 20) + 5,
      huy: Math.floor(Math.random() * 5) + 1
    }));
  }
};

// Chart themes
export const ChartThemes = {
  light: {
    background: '#ffffff',
    gridColor: '#f1f5f9',
    textColor: '#374151',
    axisColor: '#e5e7eb'
  },
  
  dark: {
    background: '#1f2937',
    gridColor: '#374151',
    textColor: '#f9fafb',
    axisColor: '#4b5563'
  },
  
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.1)',
    gridColor: 'rgba(255, 255, 255, 0.2)',
    textColor: '#ffffff',
    axisColor: 'rgba(255, 255, 255, 0.3)'
  }
};

// =============================================================================
// DASHBOARD CHART PRESETS
// =============================================================================

// Pre-configured charts for dashboard
export const DashboardCharts = {
  // Inventory overview
  InventoryOverview: ({ data }) => (
    <BarChart
      data={data || ChartDataGenerators.inventory()}
      title="Tổng quan tồn kho"
      xKey="category"
      yKey="quantity"
      formatValue={ChartFormatters.quantity}
      colors={ChartColors.warehouse}
      showStats={true}
      size="md"
    />
  ),
  
  // Revenue trend
  RevenueTrend: ({ data }) => (
    <LineChart
      data={data || ChartDataGenerators.revenue()}
      title="Xu hướng doanh thu"
      xKey="month"
      showArea={true}
      smooth={true}
      formatValue={ChartFormatters.currency}
      colors={ChartColors.success}
      showStats={true}
      size="md"
    />
  ),
  
  // Order status
  OrderStatus: ({ data }) => (
    <BarChart
      data={data || ChartDataGenerators.orders()}
      title="Trạng thái đơn hàng"
      xKey="day"
      variant="stacked"
      formatValue={ChartFormatters.orders}
      colors={ChartColors.rainbow}
      showLegend={true}
      size="md"
    />
  ),
  
  // Performance comparison
  PerformanceComparison: ({ data }) => (
    <LineChart
      data={data || ChartDataGenerators.timeSeries(7, 3)}
      title="So sánh hiệu suất"
      showLegend={true}
      showPoints={true}
      enableCrosshair={true}
      colors={ChartColors.primary}
      size="md"
    />
  )
};

// =============================================================================
// CHART FACTORY
// =============================================================================

// Chart factory for dynamic chart creation
export const ChartFactory = {
  create: (type, config = {}) => {
    const defaultConfig = ChartConfigs.dashboard;
    const mergedConfig = { ...defaultConfig, ...config };
    
    switch (type) {
      case 'bar':
        return BarChart;
      case 'line':
        return LineChart;
      case 'inventory':
        return InventoryChart;
      case 'revenue':
        return RevenueChart;
      case 'orders':
        return OrdersChart;
      case 'trend':
        return TrendChart;
      case 'comparison':
        return ComparisonChart;
      case 'performance':
        return PerformanceChart;
      default:
        return BarChart;
    }
  },
  
  // Get chart configuration by context
  getConfig: (context = 'dashboard') => {
    return ChartConfigs[context] || ChartConfigs.dashboard;
  },
  
  // Get colors by theme
  getColors: (theme = 'warehouse') => {
    return ChartColors[theme] || ChartColors.warehouse;
  }
};

// =============================================================================
// CHART PERFORMANCE UTILITIES
// =============================================================================

export const ChartPerformance = {
  // Debounce chart updates
  debounceUpdate: (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },
  
  // Optimize large datasets
  optimizeData: (data, maxPoints = 100) => {
    if (data.length <= maxPoints) return data;
    
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
  },
  
  // Calculate chart dimensions based on container
  calculateDimensions: (container, aspectRatio = 2) => {
    if (!container) return { width: 400, height: 200 };
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = width / aspectRatio;
    
    return { width, height };
  }
};

// =============================================================================
// CHART ACCESSIBILITY
// =============================================================================

export const ChartAccessibility = {
  // Generate ARIA labels
  generateAriaLabel: (type, data, title) => {
    const dataLength = data?.length || 0;
    return `${title || 'Chart'} - ${type} chart với ${dataLength} điểm dữ liệu`;
  },
  
  // Generate chart description
  generateDescription: (data, type) => {
    if (!data?.length) return 'Không có dữ liệu';
    
    const values = data.map(item => Object.values(item).find(v => typeof v === 'number')).filter(Boolean);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    return `Biểu đồ ${type} hiển thị dữ liệu từ ${min} đến ${max}`;
  },
  
  // Keyboard navigation helpers
  keyboardNavigation: {
    handleKeyDown: (event, onNavigate) => {
      switch (event.key) {
        case 'ArrowLeft':
          onNavigate('prev');
          break;
        case 'ArrowRight':
          onNavigate('next');
          break;
        case 'Home':
          onNavigate('first');
          break;
        case 'End':
          onNavigate('last');
          break;
        default:
          break;
      }
    }
  }
};

// =============================================================================
// CHART EXPORT UTILITIES
// =============================================================================

export const ChartExport = {
  // Export chart as image
  toImage: async (chartElement, options = {}) => {
    const {
      format = 'png',
      quality = 1,
      filename = 'chart'
    } = options;
    
    try {
      const svg = chartElement.querySelector('svg');
      if (!svg) throw new Error('SVG element not found');
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = `${filename}.${format}`;
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
            resolve(url);
          }, `image/${format}`, quality);
        };
        
        img.onerror = reject;
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      });
    } catch (error) {
      console.error('Chart export failed:', error);
      throw error;
    }
  },
  
  // Export chart data as CSV
  toCSV: (data, filename = 'chart-data') => {
    if (!data?.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${filename}.csv`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  // Export chart data as JSON
  toJSON: (data, filename = 'chart-data') => {
    if (!data?.length) return;
    
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${filename}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// =============================================================================
// CHART RESPONSIVE UTILITIES
// =============================================================================

export const ChartResponsive = {
  // Get responsive chart size based on screen
  getResponsiveSize: () => {
    const width = window.innerWidth;
    
    if (width < 480) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    return 'xl';
  },
  
  // Get responsive chart config
  getResponsiveConfig: () => {
    const size = ChartResponsive.getResponsiveSize();
    
    return {
      sm: { showGrid: false, showStats: false, showLegend: false },
      md: { showGrid: true, showStats: false, showLegend: true },
      lg: { showGrid: true, showStats: true, showLegend: true },
      xl: { showGrid: true, showStats: true, showLegend: true }
    }[size];
  },
  
  // Responsive chart wrapper
  withResponsive: (ChartComponent) => {
    return (props) => {
      const responsiveConfig = ChartResponsive.getResponsiveConfig();
      const size = ChartResponsive.getResponsiveSize();
      
      return (
        <ChartComponent
          {...responsiveConfig}
          size={size}
          {...props}
        />
      );
    };
  }
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

const Charts = {
  // Components
  ...ChartComponents,
  
  // Hooks
  ...ChartHooks,
  
  // Configurations
  ChartColors,
  ChartConfigs,
  ChartFormatters,
  ChartThemes,
  
  // Utilities
  ChartDataGenerators,
  ChartFactory,
  ChartPerformance,
  ChartAccessibility,
  ChartExport,
  ChartResponsive,
  
  // Dashboard
  DashboardCharts
};

export default Charts;