/*
 * File: frontend/src/components/common/Loading.js
 * Description: Comprehensive loading component with multiple types and states
 * Author: Warehouse Management System
 * Created: 2025
 */

import React from 'react';
import './Loading.css';

// Main Loading Component
const Loading = ({
  // Type and appearance
  type = 'classic', // classic, dots, pulse, bars, ring, gradient, wave
  size = 'md', // sm, md, lg, xl
  
  // Layout
  layout = 'overlay', // fullscreen, overlay, inline, minimal
  direction = 'vertical', // vertical, horizontal
  
  // Content
  text,
  showText = true,
  
  // Styling
  className = '',
  style = {},
  
  // Colors
  color,
  
  // Visibility
  show = true
}) => {
  if (!show) return null;

  const spinnerProps = {
    className: `loading-spinner ${type} ${size}`,
    style: color ? { '--primary-color': color, ...style } : style
  };

  const renderSpinner = () => {
    switch (type) {
      case 'wave':
        return (
          <div {...spinnerProps}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      
      case 'dots':
        return <div {...spinnerProps}></div>;
      
      default:
        return <div {...spinnerProps}></div>;
    }
  };

  return (
    <div className={`loading-container ${layout} ${className}`}>
      <div className={`loading-content ${direction}`}>
        {renderSpinner()}
        {showText && text && (
          <div className={`loading-text ${size}`}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

// Spinner Component (for inline use)
export const Spinner = ({
  type = 'classic',
  size = 'md',
  color,
  className = '',
  ...props
}) => {
  const spinnerProps = {
    className: `loading-spinner ${type} ${size} ${className}`,
    style: color ? { '--primary-color': color } : undefined,
    ...props
  };

  if (type === 'wave') {
    return (
      <div {...spinnerProps}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }

  return <div {...spinnerProps}></div>;
};

// Progress Bar Component
export const ProgressBar = ({
  size = 'md',
  className = '',
  animated = true,
  ...props
}) => (
  <div className={`loading-progress ${size} ${className}`} {...props}>
    {animated && <div className="loading-progress-bar"></div>}
  </div>
);

// Skeleton Components
export const Skeleton = ({
  variant = 'text', // text, title, avatar, button, card
  size = 'md',
  width,
  height,
  className = '',
  style = {},
  ...props
}) => (
  <div
    className={`loading-skeleton ${variant} ${size} ${className}`}
    style={{
      width,
      height,
      ...style
    }}
    {...props}
  />
);

export const SkeletonText = ({ lines = 1, ...props }) => (
  <>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton key={index} variant="text" {...props} />
    ))}
  </>
);

export const SkeletonAvatar = ({ size = 'md', ...props }) => (
  <Skeleton variant="avatar" size={size} {...props} />
);

export const SkeletonButton = ({ ...props }) => (
  <Skeleton variant="button" {...props} />
);

export const SkeletonCard = ({ ...props }) => (
  <Skeleton variant="card" {...props} />
);

// Table Loading Component
export const TableLoading = ({
  rows = 5,
  columns = 4,
  showAvatar = false,
  className = ''
}) => (
  <div className={`table-loading ${className}`}>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="list-loading-item">
        {showAvatar && <SkeletonAvatar size="sm" />}
        {Array.from({ length: columns }, (_, colIndex) => (
          <SkeletonText key={colIndex} />
        ))}
      </div>
    ))}
  </div>
);

// Form Loading Component
export const FormLoading = ({
  fields = 3,
  showTitle = true,
  showButton = true,
  className = ''
}) => (
  <div className={`form-loading ${className}`}>
    {showTitle && <Skeleton variant="title" />}
    {Array.from({ length: fields }, (_, index) => (
      <div key={index}>
        <Skeleton variant="text" width="30%" height="12px" style={{ marginBottom: '4px' }} />
        <Skeleton variant="text" height="40px" />
      </div>
    ))}
    {showButton && <SkeletonButton />}
  </div>
);

// Card Loading Component
export const CardLoading = ({
  showImage = true,
  showTitle = true,
  textLines = 2,
  showActions = true,
  className = ''
}) => (
  <div className={`card-loading ${className}`}>
    {showImage && <SkeletonCard height="120px" style={{ marginBottom: '12px' }} />}
    {showTitle && <Skeleton variant="title" style={{ marginBottom: '8px' }} />}
    <SkeletonText lines={textLines} />
    {showActions && (
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <SkeletonButton />
        <SkeletonButton />
      </div>
    )}
  </div>
);

// List Loading Component
export const ListLoading = ({
  items = 5,
  showAvatar = true,
  showActions = true,
  className = ''
}) => (
  <div className={`list-loading ${className}`}>
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="list-loading-item">
        {showAvatar && <SkeletonAvatar />}
        <div style={{ flex: 1 }}>
          <Skeleton variant="title" width="60%" />
          <SkeletonText width="80%" />
        </div>
        {showActions && <SkeletonButton />}
      </div>
    ))}
  </div>
);

// Loading Overlay Component
export const LoadingOverlay = ({
  show = false,
  type = 'classic',
  text = 'Đang tải...',
  className = '',
  children,
  ...props
}) => (
  <div style={{ position: 'relative' }}>
    {children}
    {show && (
      <Loading
        layout="overlay"
        type={type}
        text={text}
        className={className}
        {...props}
      />
    )}
  </div>
);

// Button Loading State Hook
export const useButtonLoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const toggleLoading = () => setLoading(prev => !prev);

  const withLoading = async (asyncFn) => {
    startLoading();
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading
  };
};

// Loading Button Component
export const LoadingButton = ({
  loading = false,
  type = 'button',
  disabled = false,
  children,
  className = '',
  spinnerType = 'classic',
  spinnerSize = 'sm',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`${className} ${loading ? 'btn-loading' : ''}`}
    {...props}
  >
    {loading ? (
      <>
        <Spinner type={spinnerType} size={spinnerSize} />
        <span style={{ opacity: 0 }}>{children}</span>
      </>
    ) : (
      children
    )}
  </button>
);

// Fullscreen Loading Component
export const FullscreenLoading = ({
  show = false,
  type = 'gradient',
  text = 'Đang tải dữ liệu...',
  subtitle,
  logo,
  className = ''
}) => {
  if (!show) return null;

  return (
    <div className={`loading-container fullscreen ${className}`}>
      <div className="loading-content">
        {logo && <div style={{ marginBottom: '24px' }}>{logo}</div>}
        <Spinner type={type} size="lg" />
        <div className="loading-text primary">{text}</div>
        {subtitle && <div className="loading-text sm">{subtitle}</div>}
      </div>
    </div>
  );
};

// Page Loading Component
export const PageLoading = ({ ...props }) => (
  <FullscreenLoading
    text="Đang tải trang..."
    subtitle="Vui lòng chờ trong giây lát"
    {...props}
  />
);

// API Loading Component
export const ApiLoading = ({ ...props }) => (
  <Loading
    layout="inline"
    type="dots"
    text="Đang xử lý..."
    {...props}
  />
);

// Image Loading Placeholder
export const ImageLoading = ({
  width = '100%',
  height = '200px',
  className = ''
}) => (
  <div
    className={`loading-skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-tertiary, #f3f4f6)'
    }}
  >
    <span style={{ color: 'var(--text-tertiary, #9ca3af)', fontSize: '24px' }}>
      🖼️
    </span>
  </div>
);

// Conditional Loading Wrapper
export const LoadingWrapper = ({
  loading = false,
  type = 'classic',
  text,
  fallback,
  children,
  ...props
}) => {
  if (loading) {
    return fallback || <Loading type={type} text={text} layout="inline" {...props} />;
  }
  
  return children;
};

export default Loading;