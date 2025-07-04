/*
 * File: frontend/src/components/common/Sidebar.js
 * Description: Modern sidebar navigation with collapsible sections and responsive design
 * Author: Warehouse Management System
 * Created: 2025
 * Updated: Added warehouse logo
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({
  // Content
  logo,
  title = 'Warehouse System',
  subtitle = 'Management',
  navigation = [],
  user,
  
  // State
  collapsed = false,
  open = false,
  onToggle,
  onClose,
  
  // Styling
  variant = 'default', // default, dark, floating, overlay
  className = '',
  
  // Responsive
  breakpoint = 1024,
  
  // Callbacks
  onNavigationClick,
  onUserClick
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && open) {
      onClose?.();
    }
  }, [location.pathname, isMobile, open, onClose]);

  // Handle outside click (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, isMobile, onClose]);

  // Toggle expanded item
  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Check if item is active
  const isItemActive = (item) => {
    if (item.path === location.pathname) return true;
    if (item.activePattern && new RegExp(item.activePattern).test(location.pathname)) return true;
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  // Handle navigation click
  const handleNavigationClick = (item) => {
    if (item.children) {
      toggleExpanded(item.id || item.path);
    } else {
      onNavigationClick?.(item);
      if (isMobile) {
        onClose?.();
      }
    }
  };

  // Get user initials
  const getUserInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  // Render navigation item
  const renderNavItem = (item, depth = 0) => {
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.has(item.id || item.path);
    const hasChildren = item.children && item.children.length > 0;
    const itemId = item.id || item.path;

    return (
      <li key={itemId} className="sidebar-nav-item">
        {hasChildren ? (
          <>
            <button
              className={`sidebar-nav-link expandable ${isExpanded ? 'expanded' : ''} ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigationClick(item)}
              style={{ paddingLeft: `${16 + depth * 16}px` }}
            >
              {item.icon && (
                <span className="sidebar-nav-icon">{item.icon}</span>
              )}
              <span className="sidebar-nav-text">{item.label}</span>
              {item.badge && (
                <span className={`sidebar-nav-badge ${item.badge.type || ''}`}>
                  {item.badge.count || item.badge.text}
                </span>
              )}
              <span className="sidebar-nav-arrow">▼</span>
            </button>
            
            {hasChildren && (
              <ul className={`sidebar-submenu ${isExpanded ? 'expanded' : ''}`}>
                {item.children.map(child => renderNavItem(child, depth + 1))}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={item.path}
            className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => handleNavigationClick(item)}
            style={{ paddingLeft: `${16 + depth * 16}px` }}
          >
            {item.icon && (
              <span className="sidebar-nav-icon">{item.icon}</span>
            )}
            <span className="sidebar-nav-text">{item.label}</span>
            {item.badge && (
              <span className={`sidebar-nav-badge ${item.badge.type || ''}`}>
                {item.badge.count || item.badge.text}
              </span>
            )}
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="sidebar-tooltip">
                {item.label}
                {item.badge && ` (${item.badge.count || item.badge.text})`}
              </div>
            )}
          </Link>
        )}
      </li>
    );
  };

  // Render navigation section
  const renderNavSection = (section) => (
    <div key={section.title} className="sidebar-section">
      {section.title && (
        <h3 className="sidebar-section-title">{section.title}</h3>
      )}
      <ul className="sidebar-nav">
        {section.items.map(item => renderNavItem(item))}
      </ul>
    </div>
  );

  const sidebarClasses = [
    'sidebar',
    variant,
    collapsed ? 'collapsed' : '',
    isMobile ? (open ? 'open' : 'hidden') : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${open ? 'show' : ''}`}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside ref={sidebarRef} className={sidebarClasses}>
        {/* Header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            {logo ? (
              <img src={logo} alt={title} className="sidebar-logo-icon" />
            ) : (
              <div className="sidebar-logo-icon modern-warehouse-logo">
                <div className="warehouse-building">
                  <div className="warehouse-roof"></div>
                  <div className="warehouse-walls">
                    <div className="warehouse-door"></div>
                    <div className="warehouse-windows">
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="sidebar-logo-text">
              <div className="sidebar-title">{title}</div>
              {subtitle && (
                <div className="sidebar-subtitle">{subtitle}</div>
              )}
            </div>
          </Link>

          {/* Toggle Button */}
          {!isMobile && (
            <button
              className="sidebar-toggle"
              onClick={onToggle}
              aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              {collapsed ? '»' : '«'}
            </button>
          )}
        </div>

        {/* Body */}
        <div className="sidebar-body">
          {Array.isArray(navigation) ? (
            // Flat navigation array
            <div className="sidebar-section">
              <ul className="sidebar-nav">
                {navigation.map(item => renderNavItem(item))}
              </ul>
            </div>
          ) : (
            // Grouped navigation sections
            Object.entries(navigation).map(([key, section]) => 
              renderNavSection({ title: key, items: section })
            )
          )}
        </div>

        {/* Footer */}
        {user && (
          <div className="sidebar-footer">
            <Link
              to="/profile"
              className="sidebar-user"
              onClick={onUserClick}
            >
              <div className="sidebar-user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  getUserInitials(user.name)
                )}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-role">{user.role}</div>
              </div>
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="sidebar-tooltip">
                  {user.name} - {user.role}
                </div>
              )}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

// Hook for sidebar state management
export const useSidebar = (initialCollapsed = false) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [open, setOpen] = useState(false);

  const toggle = () => setCollapsed(prev => !prev);
  const expand = () => setCollapsed(false);
  const collapse = () => setCollapsed(true);
  
  const openMobile = () => setOpen(true);
  const closeMobile = () => setOpen(false);
  const toggleMobile = () => setOpen(prev => !prev);

  return {
    collapsed,
    open,
    toggle,
    expand,
    collapse,
    openMobile,
    closeMobile,
    toggleMobile,
    setCollapsed,
    setOpen
  };
};

// Default warehouse navigation structure
export const warehouseNavigation = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    activePattern: '^/dashboard'
  },
  {
    id: 'inventory',
    label: 'Quản lý kho',
    icon: '📦',
    children: [
      {
        path: '/nhap-hang',
        label: 'Nhập hàng',
        icon: '📥',
        activePattern: '^/nhap-hang'
      },
      {
        path: '/xuat-hang',
        label: 'Xuất hàng',
        icon: '📤',
        activePattern: '^/xuat-hang'
      },
      {
        path: '/ton-kho',
        label: 'Tồn kho',
        icon: '📋',
        activePattern: '^/ton-kho'
        
      }
    ]
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    icon: '🧾',
    children: [
      {
        path: '/tao-don',
        label: 'Tạo đơn',
        icon: '➕',
        activePattern: '^/tao-don'
      },
      {
        path: '/danh-sach-don',
        label: 'Danh sách đơn',
        icon: '📋',
        activePattern: '^/danh-sach-don'
        
      },
      {
        path: '/don-hoan-thanh',
        label: 'Đã hoàn thành',
        icon: '✅',
        activePattern: '^/don-hoan-thanh'
      }
    ]
  },
  {
    id: 'warehouse',
    path: '/quan-ly-kho',
    label: 'Tổng quan kho',
    icon: '🏗️',
    activePattern: '^/quan-ly-kho'
  },
  {
    id: 'delivery',
    path: '/kiem-tra-giao-hang',
    label: 'Kiểm tra giao hàng',
    icon: '📱',
    activePattern: '^/kiem-tra-giao-hang'
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: '📈',
    children: [
      {
        path: '/bao-cao/doanh-thu',
        label: 'Doanh thu',
        icon: '💰',
        activePattern: '^/bao-cao/doanh-thu'
      },
      {
        path: '/bao-cao/ton-kho',
        label: 'Tồn kho',
        icon: '📊',
        activePattern: '^/bao-cao/ton-kho'
      },
      {
        path: '/bao-cao/hoat-dong',
        label: 'Hoạt động',
        icon: '📋',
        activePattern: '^/bao-cao/hoat-dong'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: '⚙️',
    children: [
      {
        path: '/cai-dat/he-thong',
        label: 'Hệ thống',
        icon: '🔧',
        activePattern: '^/cai-dat/he-thong'
      },
      {
        path: '/cai-dat/nguoi-dung',
        label: 'Người dùng',
        icon: '👥',
        activePattern: '^/cai-dat/nguoi-dung'
      },
      {
        path: '/cai-dat/bao-mat',
        label: 'Bảo mật',
        icon: '🔒',
        activePattern: '^/cai-dat/bao-mat'
      }
    ]
  }
];

// Grouped navigation structure
export const warehouseNavigationGrouped = {
  'Tổng quan': [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      activePattern: '^/dashboard'
    },
    {
      path: '/analytics',
      label: 'Phân tích',
      icon: '📈',
      activePattern: '^/analytics'
    }
  ],
  'Quản lý kho': [
    {
      path: '/nhap-hang',
      label: 'Nhập hàng',
      icon: '📥',
      activePattern: '^/nhap-hang'
    },
    {
      path: '/xuat-hang',
      label: 'Xuất hàng',
      icon: '📤',
      activePattern: '^/xuat-hang'
    },
    {
      path: '/ton-kho',
      label: 'Tồn kho',
      icon: '📋',
      activePattern: '^/ton-kho',
      badge: { count: 12, type: 'warning' }
    },
    {
      path: '/quan-ly-kho',
      label: 'Sơ đồ kho',
      icon: '🏗️',
      activePattern: '^/quan-ly-kho'
    }
  ],
  'Đơn hàng': [
    {
      path: '/tao-don',
      label: 'Tạo đơn',
      icon: '➕',
      activePattern: '^/tao-don'
    },
    {
      path: '/danh-sach-don',
      label: 'Danh sách đơn',
      icon: '📋',
      activePattern: '^/danh-sach-don',
      badge: { count: 5, type: 'info' }
    },
    {
      path: '/kiem-tra-giao-hang',
      label: 'Kiểm tra giao hàng',
      icon: '📱',
      activePattern: '^/kiem-tra-giao-hang'
    }
  ],
  'Hệ thống': [
    {
      path: '/cai-dat',
      label: 'Cài đặt',
      icon: '⚙️',
      activePattern: '^/cai-dat'
    },
    {
      path: '/nguoi-dung',
      label: 'Người dùng',
      icon: '👥',
      activePattern: '^/nguoi-dung'
    },
    {
      path: '/bao-cao',
      label: 'Báo cáo',
      icon: '📊',
      activePattern: '^/bao-cao'
    }
  ]
};

// Minimal sidebar for simple layouts
export const MinimalSidebar = ({ 
  navigation, 
  collapsed, 
  onToggle, 
  className = '' 
}) => (
  <Sidebar
    title="WMS"
    navigation={navigation}
    collapsed={collapsed}
    onToggle={onToggle}
    variant="minimal"
    className={className}
  />
);

// Admin sidebar with full features
export const AdminSidebar = ({ 
  user, 
  collapsed, 
  onToggle, 
  onUserClick,
  className = '' 
}) => (
  <Sidebar
    navigation={warehouseNavigation}
    user={user}
    collapsed={collapsed}
    onToggle={onToggle}
    onUserClick={onUserClick}
    variant="default"
    className={className}
  />
);

// Mobile-responsive sidebar wrapper
export const ResponsiveSidebar = ({ 
  children, 
  sidebarProps = {},
  className = '' 
}) => {
  const { collapsed, open, toggle, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className={`responsive-sidebar-wrapper ${className}`}>
      <Sidebar
        {...sidebarProps}
        collapsed={collapsed}
        open={open}
        onToggle={toggle}
        onClose={closeMobile}
      />
      
      {/* Mobile Toggle Button */}
      <button
        className="mobile-sidebar-toggle"
        onClick={toggleMobile}
        aria-label="Toggle sidebar"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: 'none',
          background: 'var(--primary-color, #3b82f6)',
          color: 'white',
          cursor: 'pointer',
          display: 'none'
        }}
      >
        ☰
      </button>

      {/* Content */}
      <div 
        className="sidebar-content"
        style={{
          marginLeft: collapsed ? '72px' : '280px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .mobile-sidebar-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          
          .sidebar-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

// Sidebar with breadcrumb integration
export const SidebarWithBreadcrumb = ({ 
  navigation, 
  currentPath, 
  onNavigationClick,
  ...props 
}) => {
  // Generate breadcrumb from current path and navigation
  const generateBreadcrumb = (path, nav) => {
    const parts = path.split('/').filter(Boolean);
    const breadcrumb = [];
    
    const findInNav = (items, searchPath) => {
      for (const item of items) {
        if (item.path === searchPath || item.activePattern?.test?.(searchPath)) {
          return item;
        }
        if (item.children) {
          const found = findInNav(item.children, searchPath);
          if (found) return found;
        }
      }
      return null;
    };

    let currentPath = '';
    for (const part of parts) {
      currentPath += '/' + part;
      const item = findInNav(nav, currentPath);
      if (item) {
        breadcrumb.push({
          label: item.label,
          path: item.path
        });
      }
    }

    return breadcrumb;
  };

  const breadcrumb = generateBreadcrumb(currentPath, navigation);

  return (
    <>
      <Sidebar
        navigation={navigation}
        onNavigationClick={onNavigationClick}
        {...props}
      />
      
      {/* Breadcrumb can be rendered elsewhere in the app */}
      <div className="sidebar-breadcrumb-data" style={{ display: 'none' }}>
        {JSON.stringify(breadcrumb)}
      </div>
    </>
  );
};

export default Sidebar;