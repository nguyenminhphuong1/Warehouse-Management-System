/*
 * File: frontend/src/components/common/Header.js
 * Description: Modern application header with navigation, search, and user controls
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SearchBox from './SearchBox';
import './Header.css';

const Header = ({
  // Logo
  logo,
  title = 'Warehouse System',
  subtitle = 'Management',
  logoUrl = '/',
  
  // Navigation
  navigation = [],
  activeRoute,
  
  // Search
  showSearch = true,
  searchPlaceholder = 'Tìm kiếm sản phẩm, đơn hàng...',
  onSearch,
  searchSuggestions = [],
  
  // User
  user,
  userMenu = [],
  onUserMenuClick,
  
  // Actions
  actions = [],
  notifications = [],
  
  // Breadcrumb
  breadcrumb = [],
  
  // Styling
  variant = 'default', // default, transparent, compact, large
  sticky = true,
  className = '',
  
  // Mobile
  showMobileSearch = false,
  
  // Callbacks
  onNavigationClick,
  onLogoClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  // Get active navigation item
  const getActiveNavItem = () => {
    if (activeRoute) return activeRoute;
    return navigation.find(item => 
      location.pathname === item.path || 
      (item.activePattern && new RegExp(item.activePattern).test(location.pathname))
    )?.path;
  };

  // Handle navigation click
  const handleNavClick = (item) => {
    onNavigationClick?.(item);
    setMobileMenuOpen(false);
  };

  // Handle user menu toggle
  const handleUserMenuToggle = () => {
    setUserMenuOpen(prev => !prev);
  };

  // Handle user menu item click
  const handleUserMenuItemClick = (item) => {
    onUserMenuClick?.(item);
    setUserMenuOpen(false);
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

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const headerClasses = [
    'app-header',
    variant,
    sticky ? 'sticky' : '',
    scrolled ? 'scrolled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <header ref={headerRef} className={headerClasses}>
      <div className={`header-content ${variant}`}>
        {/* Left Section */}
        <div className="header-left">
          {/* Mobile Menu Toggle */}
          <button
            className={`header-mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Logo */}
          <Link 
            to={logoUrl} 
            className="header-logo"
            onClick={onLogoClick}
          >
            {logo ? (
              <img src={logo} alt={title} className="header-logo-icon" />
            ) : (
              <div className="header-logo-icon">
                🏭
              </div>
            )}
            <div className="header-logo-text">
              <div className="header-logo-title">{title}</div>
              {subtitle && (
                <div className="header-logo-subtitle">{subtitle}</div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            {navigation.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`header-nav-item ${
                  getActiveNavItem() === item.path ? 'active' : ''
                }`}
                onClick={() => handleNavClick(item)}
              >
                {item.icon && (
                  <span className="header-nav-icon">{item.icon}</span>
                )}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="header-center">
            <SearchBox
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              suggestions={searchSuggestions}
              size="md"
              variant="filled"
            />
          </div>
        )}

        {/* Right Section */}
        <div className="header-right">
          {/* Action Buttons */}
          {actions.map((action, index) => (
            <button
              key={index}
              className={`header-action ${action.active ? 'active' : ''}`}
              onClick={action.onClick}
              title={action.title}
              aria-label={action.title}
            >
              {action.icon}
              {action.badge && (
                <span className={`header-action-badge ${action.badge.type || ''}`}>
                  {action.badge.count || ''}
                </span>
              )}
            </button>
          ))}

          {/* Notifications */}
          {notifications.length > 0 && (
            <button
              className="header-action"
              onClick={() => handleUserMenuItemClick({ action: 'notifications' })}
              title="Thông báo"
              aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ''}`}
            >
              🔔
              {unreadCount > 0 && (
                <span className="header-action-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Menu */}
          {user && (
            <div className="header-user-container" ref={userMenuRef}>
              <button
                className={`header-user ${userMenuOpen ? 'active' : ''}`}
                onClick={handleUserMenuToggle}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <div className="header-user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    getUserInitials(user.name)
                  )}
                </div>
                <div className="header-user-info">
                  <div className="header-user-name">{user.name}</div>
                  <div className="header-user-role">{user.role}</div>
                </div>
                <span className="header-user-arrow">▼</span>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && userMenu.length > 0 && (
                <UserDropdownMenu
                  user={user}
                  menuItems={userMenu}
                  onItemClick={handleUserMenuItemClick}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`header-nav mobile ${mobileMenuOpen ? 'show' : ''}`}>
        {navigation.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`header-nav-item mobile ${
              getActiveNavItem() === item.path ? 'active' : ''
            }`}
            onClick={() => handleNavClick(item)}
          >
            {item.icon && (
              <span className="header-nav-icon">{item.icon}</span>
            )}
            {item.label}
          </Link>
        ))}
        
        {/* Mobile Search */}
        {showMobileSearch && (
          <div style={{ padding: '8px 0' }}>
            <SearchBox
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              suggestions={searchSuggestions}
              size="sm"
              variant="outlined"
            />
          </div>
        )}
      </nav>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="header-breadcrumb">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="breadcrumb-separator">›</span>
              )}
              {item.path ? (
                <Link
                  to={item.path}
                  className={`breadcrumb-item ${
                    index === breadcrumb.length - 1 ? 'active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`breadcrumb-item ${
                    index === breadcrumb.length - 1 ? 'active' : ''
                  }`}
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
};

// User Dropdown Menu Component
const UserDropdownMenu = ({ user, menuItems, onItemClick }) => {
  return (
    <div className="user-dropdown-menu">
      <div className="user-dropdown-header">
        <div className="user-dropdown-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            user.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="user-dropdown-info">
          <div className="user-dropdown-name">{user.name}</div>
          <div className="user-dropdown-email">{user.email}</div>
        </div>
      </div>
      
      <div className="user-dropdown-body">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.type === 'divider' ? (
              <div className="user-dropdown-divider" />
            ) : (
              <button
                className={`user-dropdown-item ${item.variant || ''}`}
                onClick={() => onItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && (
                  <span className="user-dropdown-item-icon">{item.icon}</span>
                )}
                <span className="user-dropdown-item-text">{item.label}</span>
                {item.badge && (
                  <span className="user-dropdown-item-badge">{item.badge}</span>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Hook for header state management
export const useHeader = () => {
  const [headerState, setHeaderState] = useState({
    notifications: [],
    user: null,
    searchQuery: ''
  });

  const updateNotifications = (notifications) => {
    setHeaderState(prev => ({ ...prev, notifications }));
  };

  const updateUser = (user) => {
    setHeaderState(prev => ({ ...prev, user }));
  };

  const updateSearchQuery = (query) => {
    setHeaderState(prev => ({ ...prev, searchQuery: query }));
  };

  return {
    ...headerState,
    updateNotifications,
    updateUser,
    updateSearchQuery
  };
};

// Default navigation for warehouse system
export const warehouseNavigation = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    activePattern: '^/dashboard'
  },
  {
    path: '/nhap-hang',
    label: 'Nhập hàng',
    icon: '📥',
    activePattern: '^/nhap-hang'
  },
  {
    path: '/tao-don',
    label: 'Tạo đơn',
    icon: '📋',
    activePattern: '^/tao-don'
  },
  {
    path: '/xuat-hang',
    label: 'Xuất hàng',
    icon: '📤',
    activePattern: '^/xuat-hang'
  },
  {
    path: '/quan-ly-kho',
    label: 'Quản lý kho',
    icon: '🏗️',
    activePattern: '^/quan-ly-kho'
  },
  {
    path: '/kiem-tra-giao-hang',
    label: 'Kiểm tra',
    icon: '📱',
    activePattern: '^/kiem-tra-giao-hang'
  }
];

// Default user menu for warehouse system
export const warehouseUserMenu = [
  {
    label: 'Thông tin cá nhân',
    icon: '👤',
    action: 'profile'
  },
  {
    label: 'Cài đặt',
    icon: '⚙️',
    action: 'settings'
  },
  {
    label: 'Thông báo',
    icon: '🔔',
    action: 'notifications',
    badge: '3'
  },
  {
    type: 'divider'
  },
  {
    label: 'Trợ giúp',
    icon: '❓',
    action: 'help'
  },
  {
    label: 'Báo cáo lỗi',
    icon: '🐛',
    action: 'report-bug'
  },
  {
    type: 'divider'
  },
  {
    label: 'Đăng xuất',
    icon: '🚪',
    action: 'logout',
    variant: 'danger'
  }
];

// Default actions for warehouse system
export const warehouseActions = [
  {
    icon: '🔔',
    title: 'Thông báo',
    action: 'notifications',
    badge: { count: 3 }
  },
  {
    icon: '❓',
    title: 'Trợ giúp',
    action: 'help'
  },
  {
    icon: '⚙️',
    title: 'Cài đặt',
    action: 'settings'
  }
];

export default Header;