/*
 * File: frontend/src/components/common/Toast.js
 * Description: Modern toast notification system with multiple types and features
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import './Toast.css';

// Toast Context
const ToastContext = createContext();

// Toast types and icons
const TOAST_TYPES = {
  success: { icon: '✅', defaultTitle: 'Thành công' },
  error: { icon: '❌', defaultTitle: 'Lỗi' },
  warning: { icon: '⚠️', defaultTitle: 'Cảnh báo' },
  info: { icon: 'ℹ️', defaultTitle: 'Thông tin' },
  loading: { icon: '⏳', defaultTitle: 'Đang xử lý' }
};

// Individual Toast Component
const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  position = 'top-right',
  closable = true,
  showProgress = true,
  actions = [],
  avatar,
  richContent,
  interactive = false,
  pinned = false,
  variant = 'default', // default, compact, large
  onClose,
  onClick,
  onAction
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  // Show toast on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto close timer
  useEffect(() => {
    if (duration > 0 && !pinned) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, pinned]);

  // Handle close
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  }, [id, onClose]);

  // Handle click
  const handleClick = () => {
    if (interactive && onClick) {
      onClick(id);
    }
  };

  // Handle action click
  const handleActionClick = (action, event) => {
    event.stopPropagation();
    action.onClick?.(id);
    onAction?.(action, id);
    if (action.closeOnClick !== false) {
      handleClose();
    }
  };

  // Get toast icon
  const getIcon = () => {
    const typeConfig = TOAST_TYPES[type];
    return typeConfig?.icon || '📝';
  };

  // Get toast title
  const getTitle = () => {
    if (title) return title;
    const typeConfig = TOAST_TYPES[type];
    return typeConfig?.defaultTitle || '';
  };

  const toastClasses = [
    'toast',
    type,
    variant,
    isVisible && !isExiting ? 'show' : '',
    isExiting ? 'hide' : '',
    interactive ? 'interactive' : '',
    pinned ? 'pinned' : '',
    avatar ? 'with-avatar' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={toastClasses}
      onClick={handleClick}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Progress bar */}
      {showProgress && duration > 0 && !pinned && (
        <div
          className="toast-progress"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Close button */}
      {closable && (
        <button
          className="toast-close"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Đóng thông báo"
        >
          ✕
        </button>
      )}

      {/* Rich content */}
      {richContent ? (
        <div className="toast-rich-content">{richContent}</div>
      ) : (
        <div className="toast-content">
          {/* Avatar or Icon */}
          {avatar ? (
            <img src={avatar} alt="" className="toast-avatar" />
          ) : (
            <div className="toast-icon">{getIcon()}</div>
          )}

          {/* Body */}
          <div className="toast-body">
            {getTitle() && (
              <div className="toast-title">{getTitle()}</div>
            )}
            {message && (
              <div className="toast-message">{message}</div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="toast-actions">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    className={`toast-action ${action.variant || ''}`}
                    onClick={(e) => handleActionClick(action, e)}
                    disabled={action.disabled}
                  >
                    {action.icon && <span>{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ position = 'top-right', toasts, onClose, onAction }) => {
  if (toasts.length === 0) return null;

  return ReactDOM.createPortal(
    <div className={`toast-container ${position}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
          onAction={onAction}
        />
      ))}
    </div>,
    document.body
  );
};

// Toast Provider Component
export const ToastProvider = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000 
}) => {
  const [toasts, setToasts] = useState([]);

  // Add toast
  const addToast = useCallback((toastOptions) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      duration: defaultDuration,
      position,
      ...toastOptions
    };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      // Limit number of toasts
      return newToasts.slice(0, maxToasts);
    });

    return id;
  }, [defaultDuration, position, maxToasts]);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Update toast
  const updateToast = useCallback((id, updates) => {
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  // Handle action
  const handleAction = useCallback((action, toastId) => {
    // Custom action handling logic can be added here
    console.log('Toast action:', action, toastId);
  }, []);

  const value = {
    addToast,
    removeToast,
    removeAllToasts,
    updateToast,
    toasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position={position}
        toasts={toasts}
        onClose={removeToast}
        onAction={handleAction}
      />
    </ToastContext.Provider>
  );
};

// Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, removeAllToasts, updateToast } = context;

  // Convenience methods
  const toast = {
    success: (message, options = {}) =>
      addToast({ type: 'success', message, ...options }),
    
    error: (message, options = {}) =>
      addToast({ type: 'error', message, duration: 0, ...options }),
    
    warning: (message, options = {}) =>
      addToast({ type: 'warning', message, ...options }),
    
    info: (message, options = {}) =>
      addToast({ type: 'info', message, ...options }),
    
    loading: (message, options = {}) =>
      addToast({ type: 'loading', message, duration: 0, ...options }),

    // Promise-based toast for async operations
    promise: async (promise, messages, options = {}) => {
      const loadingId = addToast({
        type: 'loading',
        message: messages.loading || 'Đang xử lý...',
        duration: 0,
        ...options
      });

      try {
        const result = await promise;
        removeToast(loadingId);
        addToast({
          type: 'success',
          message: messages.success || 'Thành công!',
          ...options
        });
        return result;
      } catch (error) {
        removeToast(loadingId);
        addToast({
          type: 'error',
          message: messages.error || error.message || 'Có lỗi xảy ra!',
          duration: 0,
          ...options
        });
        throw error;
      }
    },

    // Custom toast
    custom: (options) => addToast(options),

    // Dismiss methods
    dismiss: removeToast,
    dismissAll: removeAllToasts,
    update: updateToast
  };

  return toast;
};

// Standalone toast functions (without context)
let toastContainer = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container top-right';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

export const showToast = (options) => {
  const container = createToastContainer();
  const id = Date.now() + Math.random();
  
  const toastElement = document.createElement('div');
  toastElement.setAttribute('data-toast-id', id);
  
  const toast = React.createElement(Toast, {
    id,
    ...options,
    onClose: () => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
    }
  });

  ReactDOM.render(toast, toastElement);
  container.appendChild(toastElement);
  
  return id;
};

// Convenience standalone functions
export const toast = {
  success: (message, options) => showToast({ type: 'success', message, ...options }),
  error: (message, options) => showToast({ type: 'error', message, duration: 0, ...options }),
  warning: (message, options) => showToast({ type: 'warning', message, ...options }),
  info: (message, options) => showToast({ type: 'info', message, ...options }),
  loading: (message, options) => showToast({ type: 'loading', message, duration: 0, ...options })
};

// Common toast messages for the warehouse system
export const warehouseToasts = {
  // Inventory messages
  inventoryAdded: (itemName) => 
    toast.success(`Đã thêm ${itemName} vào kho thành công`),
  
  inventoryUpdated: (itemName) => 
    toast.success(`Đã cập nhật thông tin ${itemName}`),
  
  inventoryDeleted: (itemName) => 
    toast.success(`Đã xóa ${itemName} khỏi kho`),

  // Order messages
  orderCreated: (orderId) => 
    toast.success(`Đã tạo đơn hàng #${orderId} thành công`),
  
  orderShipped: (orderId) => 
    toast.info(`Đơn hàng #${orderId} đã được xuất kho`),

  // Error messages
  networkError: () => 
    toast.error('Không thể kết nối đến máy chủ. Vui lòng thử lại.'),
  
  validationError: (message) => 
    toast.warning(`Dữ liệu không hợp lệ: ${message}`),

  // Loading messages
  saving: () => 
    toast.loading('Đang lưu dữ liệu...'),
  
  loading: () => 
    toast.loading('Đang tải dữ liệu...')
};

export default Toast;