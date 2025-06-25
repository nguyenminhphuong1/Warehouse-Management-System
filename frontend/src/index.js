// src/index.js - React Entry Point for Warehouse Management System

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Enhanced Error Boundary Component for Warehouse System
class WarehouseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: `WMS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Warehouse System Error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Send error to monitoring service
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    // Enhanced error reporting for warehouse system
    try {
      const errorReport = {
        id: this.state.errorId,
        system: 'warehouse-management',
        version: process.env.REACT_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        pathname: window.location.pathname,
        userId: localStorage.getItem('userId') || 'anonymous',
        sessionId: sessionStorage.getItem('sessionId') || 'unknown',
        retryCount: this.state.retryCount,
        // Warehouse specific context
        warehouseContext: {
          currentModule: this.getCurrentModule(),
          userRole: localStorage.getItem('userRole'),
          permissions: localStorage.getItem('userPermissions'),
          lastAction: sessionStorage.getItem('lastUserAction'),
          inventoryCount: localStorage.getItem('cachedInventoryCount')
        }
      };

      // Send to your error reporting service
      console.log('Warehouse Error Report:', errorReport);
      
      // Send to backend API if available
      if (process.env.REACT_APP_API_URL) {
        fetch(`${process.env.REACT_APP_API_URL}/api/errors`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
          },
          body: JSON.stringify(errorReport)
        }).catch(reportingError => {
          console.error('Failed to report error to server:', reportingError);
          // Store error locally for later transmission
          this.storeErrorLocally(errorReport);
        });
      } else {
        // Store error locally if no API endpoint
        this.storeErrorLocally(errorReport);
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  getCurrentModule = () => {
    const path = window.location.pathname;
    if (path.includes('/nhap-hang')) return 'import';
    if (path.includes('/xuat-hang')) return 'export';
    if (path.includes('/quan-ly-kho')) return 'inventory';
    if (path.includes('/tao-don')) return 'orders';
    if (path.includes('/dashboard')) return 'dashboard';
    return 'unknown';
  };

  storeErrorLocally = (errorReport) => {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('warehouseErrors') || '[]');
      storedErrors.push(errorReport);
      // Keep only last 10 errors
      if (storedErrors.length > 10) {
        storedErrors.shift();
      }
      localStorage.setItem('warehouseErrors', JSON.stringify(storedErrors));
    } catch (e) {
      console.error('Failed to store error locally:', e);
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
    
    // Track retry action
    sessionStorage.setItem('lastUserAction', `error_retry_${this.state.errorId}`);
  };

  handleReload = () => {
    // Save current state before reload
    sessionStorage.setItem('lastUserAction', `error_reload_${this.state.errorId}`);
    sessionStorage.setItem('errorBeforeReload', JSON.stringify({
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    }));
    
    window.location.reload();
  };

  handleGoHome = () => {
    sessionStorage.setItem('lastUserAction', `error_home_${this.state.errorId}`);
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="warehouse-error-boundary">
          <div className="error-boundary-content">
            <div className="error-header">
              <div className="error-icon">🏭</div>
              <h1>Hệ thống gặp sự cố</h1>
              <p className="error-id">Mã lỗi: {this.state.errorId}</p>
            </div>
            
            <div className="error-message">
              <p>
                Hệ thống quản lý kho đã gặp lỗi không mong muốn. 
                Chúng tôi đã ghi nhận sự cố này và sẽ khắc phục sớm nhất có thể.
              </p>
              
              {this.state.retryCount > 0 && (
                <div className="retry-notice">
                  <p>Đã thử lại {this.state.retryCount} lần</p>
                </div>
              )}
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Chi tiết lỗi (Development)</summary>
                <div className="error-content">
                  <div className="error-section">
                    <h4>Error Message:</h4>
                    <pre className="error-text">{this.state.error?.toString()}</pre>
                  </div>
                  <div className="error-section">
                    <h4>Component Stack:</h4>
                    <pre className="error-stack">{this.state.errorInfo?.componentStack}</pre>
                  </div>
                  <div className="error-section">
                    <h4>Module Context:</h4>
                    <pre className="error-text">{this.getCurrentModule()}</pre>
                  </div>
                </div>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                onClick={this.handleRetry}
                className="btn-retry primary"
                disabled={this.state.retryCount >= 3}
              >
                {this.state.retryCount >= 3 ? 'Đã thử tối đa' : 'Thử lại'}
              </button>
              
              <button 
                onClick={this.handleGoHome}
                className="btn-home"
              >
                Về trang chủ
              </button>
              
              <button 
                onClick={this.handleReload}
                className="btn-reload"
              >
                Tải lại trang
              </button>
            </div>

            <div className="error-help">
              <p>Nếu sự cố tiếp tục xảy ra, vui lòng liên hệ:</p>
              <ul>
                <li>📧 Email: support@warehouse-system.com</li>
                <li>📞 Hotline: 1900-xxxx</li>
                <li>💬 Chat: Góc phải màn hình</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Performance monitoring for Warehouse System
const sendWebVitals = (metric) => {
  // Enhanced metrics collection
  const enhancedMetric = {
    ...metric,
    system: 'warehouse-management',
    timestamp: new Date().toISOString(),
    module: getCurrentModule(),
    userRole: localStorage.getItem('userRole'),
    connectionType: navigator.connection?.effectiveType || 'unknown'
  };

  if (process.env.NODE_ENV === 'production') {
    console.log('Warehouse Web Vitals:', enhancedMetric);
    
    // Send to analytics service
    if (process.env.REACT_APP_ANALYTICS_ID) {
      // Example: Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_map: {
            warehouse_module: getCurrentModule(),
            user_role: localStorage.getItem('userRole')
          }
        });
      }
    }

    // Send to custom analytics endpoint
    if (process.env.REACT_APP_API_URL) {
      fetch(`${process.env.REACT_APP_API_URL}/api/analytics/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enhancedMetric)
      }).catch(error => {
        console.warn('Failed to send vitals:', error);
      });
    }
  }
};

// Helper function to get current module
const getCurrentModule = () => {
  const path = window.location.pathname;
  if (path.includes('/nhap-hang')) return 'import';
  if (path.includes('/xuat-hang')) return 'export';
  if (path.includes('/quan-ly-kho')) return 'inventory';
  if (path.includes('/tao-don')) return 'orders';
  if (path.includes('/kiem-tra-giao-hang')) return 'delivery';
  if (path.includes('/bao-cao')) return 'reports';
  if (path.includes('/dashboard')) return 'dashboard';
  if (path.includes('/admin')) return 'admin';
  return 'unknown';
};

// Enhanced App initialization for Warehouse System
const initializeWarehouseApp = () => {
  // Set up global error handling
  window.addEventListener('error', (event) => {
    console.error('Warehouse Global Error:', event.error);
    
    const errorReport = {
      type: 'global_error',
      system: 'warehouse-management',
      message: event.error?.message || 'Unknown error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      module: getCurrentModule(),
      userId: localStorage.getItem('userId') || 'anonymous'
    };
    
    // Store error for reporting
    try {
      const globalErrors = JSON.parse(localStorage.getItem('warehouseGlobalErrors') || '[]');
      globalErrors.push(errorReport);
      if (globalErrors.length > 5) globalErrors.shift();
      localStorage.setItem('warehouseGlobalErrors', JSON.stringify(globalErrors));
    } catch (e) {
      console.error('Failed to store global error:', e);
    }
  });

  // Set up unhandled promise rejection handling
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Warehouse Promise Rejection:', event.reason);
    
    const errorReport = {
      type: 'unhandled_rejection',
      system: 'warehouse-management',
      reason: event.reason?.toString() || 'Unknown rejection',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      module: getCurrentModule(),
      userId: localStorage.getItem('userId') || 'anonymous'
    };
    
    // Store error for reporting
    try {
      const rejectionErrors = JSON.parse(localStorage.getItem('warehouseRejectionErrors') || '[]');
      rejectionErrors.push(errorReport);
      if (rejectionErrors.length > 5) rejectionErrors.shift();
      localStorage.setItem('warehouseRejectionErrors', JSON.stringify(rejectionErrors));
    } catch (e) {
      console.error('Failed to store rejection error:', e);
    }
  });

  // Enhanced browser compatibility check
  const isWarehouseSystemSupported = () => {
    const requiredFeatures = [
      'Promise',
      'fetch',
      'localStorage',
      'sessionStorage',
      'JSON',
      'WebSocket', // For real-time warehouse updates
      'Worker' // For background data processing
    ];

    const supportedFeatures = requiredFeatures.filter(feature => {
      const isAvailable = feature in window || feature in window.constructor.prototype;
      if (!isAvailable) {
        console.error(`Warehouse System: Browser feature not supported: ${feature}`);
      }
      return isAvailable;
    });

    // Check for minimum browser versions
    const userAgent = navigator.userAgent;
    const isModernChrome = /Chrome\/([0-9]+)/.test(userAgent) && parseInt(RegExp.$1) >= 90;
    const isModernFirefox = /Firefox\/([0-9]+)/.test(userAgent) && parseInt(RegExp.$1) >= 88;
    const isModernSafari = /Safari\//.test(userAgent) && /Version\/([0-9]+)/.test(userAgent) && parseInt(RegExp.$1) >= 14;
    const isModernEdge = /Edg\/([0-9]+)/.test(userAgent) && parseInt(RegExp.$1) >= 90;

    const isModernBrowser = isModernChrome || isModernFirefox || isModernSafari || isModernEdge;

    return supportedFeatures.length === requiredFeatures.length && isModernBrowser;
  };

  if (!isWarehouseSystemSupported()) {
    document.body.innerHTML = `
      <div class="warehouse-compatibility-error">
        <div class="error-content">
          <h1>🏭 Hệ thống Quản lý Kho</h1>
          <h2>Trình duyệt không được hỗ trợ</h2>
          <p>
            Hệ thống quản lý kho yêu cầu trình duyệt hiện đại để đảm bảo 
            hiệu suất và bảo mật tối ưu.
          </p>
          <div class="browser-requirements">
            <h3>Vui lòng sử dụng một trong các trình duyệt sau:</h3>
            <ul>
              <li>✅ Google Chrome 90+ (Khuyến nghị)</li>
              <li>✅ Mozilla Firefox 88+</li>
              <li>✅ Safari 14+</li>
              <li>✅ Microsoft Edge 90+</li>
            </ul>
          </div>
          <div class="help-section">
            <h3>Cần hỗ trợ?</h3>
            <p>Liên hệ IT Support: <a href="mailto:it-support@warehouse.com">it-support@warehouse.com</a></p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Initialize session tracking
  if (!sessionStorage.getItem('sessionId')) {
    sessionStorage.setItem('sessionId', `WMS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    sessionStorage.setItem('sessionStart', new Date().toISOString());
  }

  // Set up warehouse theme system
  const savedTheme = localStorage.getItem('warehouseTheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', initialTheme);
  document.documentElement.setAttribute('data-warehouse-system', 'true');

  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('warehouseTheme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  // Set up performance monitoring
  if ('PerformanceObserver' in window) {
    // Monitor Long Tasks (blocking operations)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn('Long Task detected:', {
            duration: entry.duration,
            module: getCurrentModule(),
            timestamp: new Date().toISOString()
          });
        }
      }
    }).observe({ entryTypes: ['longtask'] });
  }

  // Set up offline handling
  window.addEventListener('online', () => {
    console.log('Warehouse System: Back online');
    document.body.classList.remove('warehouse-offline');
    
    // Try to sync any pending data
    if (window.warehouseOfflineQueue) {
      window.warehouseOfflineQueue.sync();
    }
  });

  window.addEventListener('offline', () => {
    console.log('Warehouse System: Gone offline');
    document.body.classList.add('warehouse-offline');
  });

  // Clean up old error logs
  try {
    const errorKeys = ['warehouseErrors', 'warehouseGlobalErrors', 'warehouseRejectionErrors'];
    errorKeys.forEach(key => {
      const errors = JSON.parse(localStorage.getItem(key) || '[]');
      const recentErrors = errors.filter(error => {
        const errorTime = new Date(error.timestamp);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return errorTime > dayAgo;
      });
      localStorage.setItem(key, JSON.stringify(recentErrors));
    });
  } catch (e) {
    console.error('Failed to clean up old errors:', e);
  }

  console.log('🏭 Warehouse Management System initialized successfully');
};

// Initialize warehouse app
initializeWarehouseApp();

// Render app with enhanced error boundary
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <WarehouseErrorBoundary>
      <App />
    </WarehouseErrorBoundary>
  </React.StrictMode>
);

// Enhanced performance monitoring
reportWebVitals(sendWebVitals);

// Service Worker registration for warehouse system
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/warehouse-sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Warehouse SW registered: ', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('New warehouse service worker version available');
          // You can show an update notification here
        });
      })
      .catch((registrationError) => {
        console.log('Warehouse SW registration failed: ', registrationError);
      });
  });
}

// Export for testing purposes
if (process.env.NODE_ENV === 'development') {
  window.__WAREHOUSE_DEBUG__ = {
    getCurrentModule,
    clearErrors: () => {
      localStorage.removeItem('warehouseErrors');
      localStorage.removeItem('warehouseGlobalErrors');
      localStorage.removeItem('warehouseRejectionErrors');
    },
    getStoredErrors: () => ({
      errors: JSON.parse(localStorage.getItem('warehouseErrors') || '[]'),
      globalErrors: JSON.parse(localStorage.getItem('warehouseGlobalErrors') || '[]'),
      rejectionErrors: JSON.parse(localStorage.getItem('warehouseRejectionErrors') || '[]')
    })
  };
}