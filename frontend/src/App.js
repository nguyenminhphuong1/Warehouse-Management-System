// src/App.js - Fixed Imports Version

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import './styles/auth.css';
import { useAuth } from './context/AuthContext';

// Import Common Components và Styles
import './components/common/styles.css';
import './styles/globals.css';
import {
  Header,
  Sidebar,
  Footer,
  Loading,
  ToastProvider,
  useToast,
  FullscreenLoading,
  ConfirmDialog,
  useConfirmDialog,
  warehouseNavigation,
  warehouseUserMenu,
  warehouseSidebarNavigation
} from './components/common';

// Import Module Components
import XuatHang from './pages/XuatHang/XuatHang';
import NhapHang from './pages/NhapHang/NhapHang';
// Temporary Context Providers (tạm thời)
// const AuthContext = React.createContext();
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState({
//     id: 1,
//     name: 'Admin User',
//     email: 'admin@warehouse.com',
//     role: 'admin'
//   });
//   const [loading, setLoading] = useState(false);
//
//   return (
//     <AuthContext.Provider value={{ user, loading, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// Temporary Context Providers
const WarehouseProvider = ({ children }) => children;
const NotificationProvider = ({ children }) => children;
const SettingsProvider = ({ children }) => children;
const PermissionProvider = ({ children }) => children;

// Temporary ProtectedRoute
const ProtectedRoute = ({ children, module, action }) => {
  // Tạm thời cho phép tất cả
  return children;
};

// Temporary page components
const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1>🏭 Dashboard - Warehouse Management System</h1>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px',
      marginTop: '20px'
    }}>
      <div style={{
        padding: '20px',
        background: 'var(--surface-color)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3>📦 Tổng số Pallet</h3>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-600)', marginTop: '10px' }}>
          1,234
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
          +12% so với tháng trước
        </p>
      </div>
      
      <div style={{
        padding: '20px',
        background: 'var(--surface-color)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3>🚚 Đơn xuất hôm nay</h3>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success-600)', marginTop: '10px' }}>
          47
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
          8 đơn đang xử lý
        </p>
      </div>
      
      <div style={{
        padding: '20px',
        background: 'var(--surface-color)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3>📍 Vị trí trống</h3>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--warning-600)', marginTop: '10px' }}>
          156
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
          89% đã sử dụng
        </p>
      </div>
      
      <div style={{
        padding: '20px',
        background: 'var(--surface-color)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3>⚠️ Cảnh báo</h3>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--error-600)', marginTop: '10px' }}>
          3
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
          Cần kiểm tra ngay
        </p>
      </div>
    </div>

    <div style={{ marginTop: '30px' }}>
      <h2>⚡ Hoạt động gần đây</h2>
      <div style={{
        background: 'var(--surface-color)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        padding: '20px',
        marginTop: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span>📦 Nhập pallet mới #P001234</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>5 phút trước</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span>🚚 Hoàn thành đơn xuất #DX001122</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>12 phút trước</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span>✅ Kiểm kê khu vực A-01</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>25 phút trước</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🔧 Bảo trì thiết bị tại B-05</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>1 giờ trước</span>
        </div>
      </div>
    </div>
  </div>
);

const Login = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    background: 'var(--background-color)'
  }}>
    <div style={{ 
      padding: '40px', 
      background: 'var(--surface-color)', 
      borderRadius: '12px',
      boxShadow: 'var(--shadow-lg)',
      width: '100%',
      maxWidth: '400px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🏭 Warehouse System</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Đăng nhập để tiếp tục
      </p>
      <input 
        type="email" 
        placeholder="Email" 
        style={{ 
          width: '100%', 
          padding: '12px', 
          marginBottom: '15px',
          border: '1px solid var(--border-color)',
          borderRadius: '6px'
        }} 
      />
      <input 
        type="password" 
        placeholder="Mật khẩu" 
        style={{ 
          width: '100%', 
          padding: '12px', 
          marginBottom: '20px',
          border: '1px solid var(--border-color)',
          borderRadius: '6px'
        }} 
      />
      <button style={{ 
        width: '100%', 
        padding: '12px', 
        background: 'var(--primary-600)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer'
      }}>
        Đăng nhập
      </button>
    </div>
  </div>
);

// Temporary components for other modules


const TaoDon = () => (
  <div style={{ padding: '20px' }}>
    <h1>📝 Tạo Đơn</h1>
    <p>Module tạo đơn xuất hàng</p>
  </div>
);

// XuatHang component đã được import từ file riêng biệt
// Xóa temporary XuatHang component ở đây

const QuanLyKho = () => (
  <div style={{ padding: '20px' }}>
    <h1>🏭 Quản Lý Kho</h1>
    <p>Module quản lý kho</p>
  </div>
);

const KiemTraGiaoHang = () => (
  <div style={{ padding: '20px' }}>
    <h1>✅ Kiểm Tra Giao Hàng</h1>
    <p>Module kiểm tra giao hàng</p>
  </div>
);

const BaoCao = () => (
  <div style={{ padding: '20px' }}>
    <h1>📊 Báo Cáo</h1>
    <p>Module báo cáo và thống kê</p>
  </div>
);

// Temporary service
const checkSystemHealth = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'ok', message: 'System is running normally' });
    }, 1000);
  });
};

// Layout Component with Common Components
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const toast = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    // Check system health on app load
    const checkHealth = async () => {
      try {
        const health = await checkSystemHealth();
        setSystemHealth(health);
        
        // Show toast notification for system status
        if (health.status === 'error') {
          toast.error(`Hệ thống gặp sự cố: ${health.message}`);
        } else if (health.status === 'warning') {
          toast.warning(`Cảnh báo hệ thống: ${health.message}`);
        }
      } catch (error) {
        console.error('System health check failed:', error);
        setSystemHealth({ status: 'error', message: 'Không thể kết nối hệ thống' });
        toast.error('Không thể kiểm tra trạng thái hệ thống');
      }
    };
    
    if (user) {
      checkHealth();
      // Check health every 5 minutes
      const interval = setInterval(checkHealth, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, toast]);

  // Handle user menu actions
 const handleUserMenuClick = async (action) => {
  switch (action.action) {
    case 'profile':
      toast.info('Chuyển đến trang hồ sơ');
      break;

    case 'settings':
      toast.info('Chuyển đến cài đặt');
      break;

    case 'logout':
      const confirmed = await showConfirm({
        title: 'Đăng xuất',
        message: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
        type: 'warning',
        confirmText: 'Đăng xuất',
        cancelText: 'Hủy'
      });

      if (confirmed) {
        await logout(); // Gọi hàm logout từ AuthContext
        toast.success('Đăng xuất thành công');
      }
      break;

    default:
      console.log('Unknown action:', action);
  }
};

  // Handle navigation click
  const handleNavigationClick = (item) => {
    console.log('Navigate to:', item.path);
    toast.info(`Chuyển đến: ${item.label}`);
  };

  // Handle search
  const handleSearch = (query) => {
    console.log('Search:', query);
    toast.info(`Tìm kiếm: ${query}`);
  };

  // Get notifications for header
  const notifications = [
    { id: 1, title: 'Đơn hàng mới', message: 'Có 5 đơn hàng mới cần xử lý', read: false },
    { id: 2, title: 'Hàng sắp hết', message: 'Sản phẩm ABC sắp hết hàng', read: false },
    { id: 3, title: 'Báo cáo tuần', message: 'Báo cáo tuần đã sẵn sàng', read: true }
  ];

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* System Health Banner */}
      {systemHealth?.status === 'error' && (
        <div className="system-health-banner error">
          <span className="system-health-icon">⚠️</span>
          <span>Hệ thống đang gặp sự cố: {systemHealth.message}</span>
          <button 
            onClick={() => window.location.reload()}
            className="system-health-retry"
          >
            Thử lại
          </button>
        </div>
      )}
      
      {/* Header with Common Component */}
      <Header 
        title="Warehouse System"
        subtitle="Management"
        navigation={warehouseNavigation}
        user={user}
        userMenu={warehouseUserMenu}
        notifications={notifications}
        onSearch={handleSearch}
        onNavigationClick={handleNavigationClick}
        onUserMenuClick={handleUserMenuClick}
        showSearch={true}
        actions={[
          {
            icon: '🔔',
            title: 'Thông báo',
            onClick: () => toast.info('Hiển thị thông báo'),
            badge: { count: notifications.filter(n => !n.read).length }
          },
          {
            icon: '❓',
            title: 'Trợ giúp',
            onClick: () => toast.info('Hiển thị trợ giúp')
          }
        ]}
      />
      
      {/* Main Content */}
      <div className="app-content">
        {/* Sidebar with Common Component */}
        <Sidebar 
          title="WMS"
          subtitle="Management"
          navigation={warehouseSidebarNavigation}
          user={user}
          collapsed={sidebarCollapsed}
          open={sidebarOpen}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onClose={() => setSidebarOpen(false)}
          onNavigationClick={handleNavigationClick}
          onUserClick={() => console.log('User profile clicked')}
          breakpoint={1024}
        />
        
        {/* Page Content */}
        <main className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
          
          {/* Footer with Common Component */}
          <Footer 
            title="Warehouse System"
            subtitle="Management"
            description="Hệ thống quản lý kho hiện đại với công nghệ AI và IoT"
            sections={[
              {
                title: 'Sản phẩm',
                links: [
                  { label: 'Quản lý kho', url: '/quan-ly-kho' },
                  { label: 'Xuất nhập hàng', url: '/nhap-hang' },
                  { label: 'Báo cáo', url: '/bao-cao' }
                ]
              },
              {
                title: 'Hỗ trợ',
                links: [
                  { label: 'Trung tâm trợ giúp', url: '/help' },
                  { label: 'Liên hệ', url: '/contact' }
                ]
              }
            ]}
            socialLinks={[
              { platform: 'Facebook', icon: '📘', url: '#' },
              { platform: 'Twitter', icon: '🐦', url: '#' }
            ]}
            copyright="© 2025 Warehouse Management System. All rights reserved."
            legalLinks={[
              { label: 'Điều khoản', url: '/terms' },
              { label: 'Bảo mật', url: '/privacy' }
            ]}
            version={{
              number: '1.0.0',
              date: '2025-01-01',
              status: 'stable'
            }}
            variant="default"
          />
        </main>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
};

// Main App Component with Toast Provider
const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Load app configuration
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading
        
        // Initialize theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', initialTheme);
        
        setAppLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        setAppError(error.message);
        setAppLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (appLoading) {
    return (
      <FullscreenLoading
        show={true}
        type="gradient"
        text="Đang khởi tạo hệ thống..."
        subtitle="Vui lòng đợi trong giây lát"
        logo={
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            color: 'white',
            marginBottom: '24px'
          }}>
            🏭
          </div>
        }
      />
    );
  }

  if (appError) {
    return (
      <div className="app-error">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
          <h2>Không thể khởi tạo ứng dụng</h2>
          <p>{appError}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
      <Router>
        <AuthProvider>
          <PermissionProvider>
            <SettingsProvider>
              <WarehouseProvider>
                <NotificationProvider>
                  <ToastProvider position="top-right" maxToasts={5}>
                      <div className="App">
                        <Routes>
                          {/* Public Routes */}
                         <Route path="/login" element={<LoginForm />} />

                          {/* Protected Routes */}
                          <Route path="/" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <Navigate to="/dashboard" replace />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          <Route path="/dashboard" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <Dashboard />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          <Route path="/nhap-hang/*" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <NhapHang />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          <Route path="/tao-don/*" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <TaoDon />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          <Route path="/xuat-hang/*" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <XuatHang />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          <Route path="/quan-ly-kho/*" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <QuanLyKho />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          <Route path="/kiem-tra-giao-hang/*" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <KiemTraGiaoHang />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          <Route path="/bao-cao/*" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <BaoCao />
                              </AppLayout>
                            </ProtectedRoute>
                          } />

                          {/* Fallback route */}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </div>
                  </ToastProvider>
                </NotificationProvider>
              </WarehouseProvider>
            </SettingsProvider>
          </PermissionProvider>
        </AuthProvider>
      </Router>
  );
};

export default App;