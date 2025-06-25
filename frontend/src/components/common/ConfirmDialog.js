/*
 * File: frontend/src/components/common/ConfirmDialog.js
 * Description: Modern confirmation dialog component with advanced features
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './ConfirmDialog.css';

const ConfirmDialog = ({
  show = false,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  type = 'danger', // danger, warning, info, success
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  onConfirm,
  onCancel,
  loading = false,
  showIcon = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  autoFocus = true,
  className = '',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show animation
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Escape key handler
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape && !loading) {
      onCancel?.();
    }
  }, [closeOnEscape, loading, onCancel]);

  // Add/remove event listeners
  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [show, handleEscape]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && !loading) {
      onCancel?.();
    }
  };

  // Handle confirm with loading state
  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm?.();
  };

  // Handle cancel
  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
  };

  // Get icon based on type
  const getIcon = () => {
    const icons = {
      danger: '⚠️',
      warning: '🚨',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[type] || icons.danger;
  };

  // Don't render if not visible
  if (!isVisible) return null;

  const dialogContent = (
    <div 
      className={`confirm-dialog-overlay ${isAnimating ? 'show' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div className={`confirm-dialog ${className}`}>
        {/* Header */}
        <div className="confirm-dialog-header">
          {showIcon && (
            <div className={`confirm-dialog-icon ${type}`}>
              <span role="img" aria-label={type}>
                {getIcon()}
              </span>
            </div>
          )}
          <h2 id="confirm-dialog-title" className="confirm-dialog-title">
            {title}
          </h2>
          {message && (
            <p id="confirm-dialog-message" className="confirm-dialog-message">
              {message}
            </p>
          )}
        </div>

        {/* Body for custom content */}
        {children && (
          <div className="confirm-dialog-body">
            {children}
          </div>
        )}

        {/* Actions */}
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-button cancel"
            onClick={handleCancel}
            disabled={loading}
            tabIndex={autoFocus ? 1 : 0}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-dialog-button confirm ${type} ${loading ? 'loading' : ''}`}
            onClick={handleConfirm}
            disabled={loading}
            tabIndex={autoFocus ? 0 : 1}
            autoFocus={autoFocus}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // Render in portal
  return ReactDOM.createPortal(
    dialogContent,
    document.body
  );
};

// Hook for easier usage
export const useConfirmDialog = () => {
  const [dialogConfig, setDialogConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: null,
    onCancel: null,
    loading: false
  });

  const showConfirm = useCallback((config) => {
    return new Promise((resolve) => {
      setDialogConfig({
        show: true,
        title: config.title || 'Xác nhận',
        message: config.message || 'Bạn có chắc chắn muốn thực hiện hành động này?',
        type: config.type || 'danger',
        confirmText: config.confirmText || 'Xác nhận',
        cancelText: config.cancelText || 'Hủy bỏ',
        loading: false,
        onConfirm: async () => {
          if (config.onConfirm) {
            setDialogConfig(prev => ({ ...prev, loading: true }));
            try {
              await config.onConfirm();
              resolve(true);
            } catch (error) {
              console.error('Confirm action failed:', error);
              resolve(false);
            } finally {
              setDialogConfig(prev => ({ ...prev, show: false, loading: false }));
            }
          } else {
            resolve(true);
            setDialogConfig(prev => ({ ...prev, show: false }));
          }
        },
        onCancel: () => {
          resolve(false);
          setDialogConfig(prev => ({ ...prev, show: false }));
        }
      });
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setDialogConfig(prev => ({ ...prev, show: false }));
  }, []);

  const ConfirmDialogComponent = () => (
    <ConfirmDialog {...dialogConfig} />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: ConfirmDialogComponent,
    isShowing: dialogConfig.show
  };
};

// Utility functions for common dialog types
export const confirmDelete = (itemName = 'mục này') => {
  const { showConfirm, ConfirmDialog } = useConfirmDialog();
  
  const confirm = (onConfirm) => showConfirm({
    title: 'Xác nhận xóa',
    message: `Bạn có chắc chắn muốn xóa ${itemName}? Hành động này không thể hoàn tác.`,
    type: 'danger',
    confirmText: 'Xóa',
    cancelText: 'Hủy',
    onConfirm
  });

  return { confirm, ConfirmDialog };
};

export const confirmSave = (message = 'Bạn có muốn lưu thay đổi?') => {
  const { showConfirm, ConfirmDialog } = useConfirmDialog();
  
  const confirm = (onConfirm) => showConfirm({
    title: 'Lưu thay đổi',
    message,
    type: 'info',
    confirmText: 'Lưu',
    cancelText: 'Hủy',
    onConfirm
  });

  return { confirm, ConfirmDialog };
};

export const confirmLogout = () => {
  const { showConfirm, ConfirmDialog } = useConfirmDialog();
  
  const confirm = (onConfirm) => showConfirm({
    title: 'Đăng xuất',
    message: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
    type: 'warning',
    confirmText: 'Đăng xuất',
    cancelText: 'Hủy',
    onConfirm
  });

  return { confirm, ConfirmDialog };
};

export default ConfirmDialog;