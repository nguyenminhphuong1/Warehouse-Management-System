/*
 * File: frontend/src/components/common/Modal.js
 * Description: Modern modal component with advanced features and accessibility
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({
  // Visibility
  show = false,
  onClose,
  
  // Content
  title,
  subtitle,
  children,
  
  // Configuration
  size = 'md', // sm, md, lg, xl, full
  centered = false,
  closable = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  
  // Header
  showHeader = true,
  headerNoBorder = false,
  
  // Footer
  showFooter = false,
  footerNoBorder = false,
  footerLayout = 'end', // start, center, end, space-between
  
  // Styling
  className = '',
  overlayClassName = '',
  animation = 'default', // default, slide-in, slide-out
  
  // Accessibility
  ariaLabel,
  ariaDescribedBy,
  autoFocus = true,
  trapFocus = true,
  
  // Callbacks
  onOpen,
  onClosed,
  onEscape,
  
  // Footer actions
  primaryAction,
  secondaryAction,
  actions = [],
  
  // Loading state
  loading = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus management
  useEffect(() => {
    if (show) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsAnimating(true);
        onOpen?.();
        
        // Auto focus first focusable element
        if (autoFocus && modalRef.current) {
          const focusableElements = getFocusableElements(modalRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }, 10);
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClosed?.();
        
        // Restore focus to previous element
        if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
          previousActiveElement.current.focus();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoFocus, onOpen, onClosed]);

  // Body scroll lock
  useEffect(() => {
    if (show) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [show]);

  // Get focusable elements
  const getFocusableElements = (container) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(container.querySelectorAll(focusableSelectors));
  };

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (!show) return;

    // Escape key
    if (e.key === 'Escape' && closeOnEscape && closable) {
      e.preventDefault();
      onEscape?.() || onClose?.();
      return;
    }

    // Tab key - focus trapping
    if (e.key === 'Tab' && trapFocus && modalRef.current) {
      const focusableElements = getFocusableElements(modalRef.current);
      
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [show, closeOnEscape, closable, trapFocus, onEscape, onClose]);

  // Add/remove event listeners
  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [show, handleKeyDown]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && closeOnOverlayClick && closable && !loading) {
      onClose?.();
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    if (closable && !loading) {
      onClose?.();
    }
  };

  // Render footer actions
  const renderFooterActions = () => {
    const allActions = [];

    // Add custom actions
    if (actions.length > 0) {
      allActions.push(...actions);
    }

    // Add secondary action
    if (secondaryAction) {
      allActions.push({
        ...secondaryAction,
        variant: secondaryAction.variant || 'secondary'
      });
    }

    // Add primary action
    if (primaryAction) {
      allActions.push({
        ...primaryAction,
        variant: primaryAction.variant || 'primary'
      });
    }

    return allActions.map((action, index) => (
      <button
        key={index}
        type={action.type || 'button'}
        className={`modal-btn ${action.variant || 'secondary'} ${action.loading ? 'loading' : ''}`}
        onClick={action.onClick}
        disabled={action.disabled || loading}
        autoFocus={action.autoFocus}
      >
        {action.icon && <span className="modal-btn-icon">{action.icon}</span>}
        {action.label}
      </button>
    ));
  };

  // Don't render if not visible
  if (!isVisible) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      className={`modal-overlay ${isAnimating ? 'show' : ''} ${overlayClassName}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      aria-describedby={ariaDescribedBy}
    >
      <div
        ref={modalRef}
        className={`modal size-${size} ${centered ? 'centered' : ''} ${animation} ${className} ${!showHeader ? 'no-header' : ''} ${!showFooter ? 'no-footer' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {showHeader && (
          <div className={`modal-header ${headerNoBorder ? 'no-border' : ''}`}>
            {title && (
              <h2 className="modal-title" id="modal-title">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="modal-subtitle" id="modal-subtitle">
                {subtitle}
              </p>
            )}
            {closable && (
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseClick}
                aria-label="Đóng modal"
                disabled={loading}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal-body" id={ariaDescribedBy || 'modal-body'}>
          {children}
        </div>

        {/* Footer */}
        {showFooter && (primaryAction || secondaryAction || actions.length > 0) && (
          <div className={`modal-footer ${footerNoBorder ? 'no-border' : ''} ${footerLayout}`}>
            {renderFooterActions()}
          </div>
        )}
      </div>
    </div>
  );

  // Render in portal
  return ReactDOM.createPortal(modalContent, document.body);
};

// Hook for easier modal management
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const openModal = useCallback((props = {}) => {
    setModalProps(props);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setModalProps({}), 300); // Clear props after animation
  }, []);

  const toggleModal = useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, openModal, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    modalProps: {
      ...modalProps,
      show: isOpen,
      onClose: closeModal
    }
  };
};

// Specialized modal components
export const ConfirmationModal = ({ show, onClose, onConfirm, title, message, ...props }) => (
  <Modal
    show={show}
    onClose={onClose}
    title={title || 'Xác nhận'}
    size="sm"
    showFooter
    primaryAction={{
      label: 'Xác nhận',
      onClick: onConfirm,
      variant: 'danger'
    }}
    secondaryAction={{
      label: 'Hủy',
      onClick: onClose
    }}
    {...props}
  >
    <p>{message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}</p>
  </Modal>
);

export const InfoModal = ({ show, onClose, title, message, ...props }) => (
  <Modal
    show={show}
    onClose={onClose}
    title={title || 'Thông báo'}
    size="sm"
    showFooter
    primaryAction={{
      label: 'Đóng',
      onClick: onClose,
      variant: 'primary'
    }}
    {...props}
  >
    <p>{message}</p>
  </Modal>
);

export const FormModal = ({ show, onClose, onSubmit, title, children, submitLabel = 'Lưu', loading = false, ...props }) => (
  <Modal
    show={show}
    onClose={onClose}
    title={title}
    showFooter
    loading={loading}
    primaryAction={{
      label: submitLabel,
      onClick: onSubmit,
      variant: 'primary',
      type: 'submit',
      loading
    }}
    secondaryAction={{
      label: 'Hủy',
      onClick: onClose
    }}
    {...props}
  >
    {children}
  </Modal>
);

// Modal form components
export const ModalFormGroup = ({ label, required, error, help, children }) => (
  <div className="modal-form-group">
    {label && (
      <label className="modal-form-label">
        {label}
        {required && <span style={{ color: 'var(--danger-color, #ef4444)' }}> *</span>}
      </label>
    )}
    {children}
    {error && <div className="modal-form-error">{error}</div>}
    {help && !error && <div className="modal-form-help">{help}</div>}
  </div>
);

export const ModalInput = ({ className = '', ...props }) => (
  <input
    className={`modal-form-input ${className}`}
    {...props}
  />
);

export const ModalSelect = ({ className = '', children, ...props }) => (
  <select
    className={`modal-form-select ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const ModalTextarea = ({ className = '', ...props }) => (
  <textarea
    className={`modal-form-textarea ${className}`}
    {...props}
  />
);

export default Modal;