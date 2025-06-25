// frontend/src/components/auth/LoginForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();
  const [rememberMe, setRememberMe] = useLocalStorage('rememberMe', false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember_me: rememberMe
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear any previous errors when component mounts
    setFormErrors({});
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập hoặc email';
    }

    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // Save remember me preference
        setRememberMe(formData.remember_me);
        
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setFormErrors({ 
          general: result.message || 'Đăng nhập thất bại' 
        });
      }
    } catch (err) {
      setFormErrors({ 
        general: 'Đã xảy ra lỗi. Vui lòng thử lại.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <div className="logo">
            <img src="/images/logo.png" alt="Warehouse Management" />
          </div>
          <h1>Đăng nhập hệ thống</h1>
          <p>Quản lý Xuất Nhập Kho Thông minh</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* General Error */}
          {(formErrors.general || error) && (
            <div className="alert alert-error">
              <i className="icon-alert-circle"></i>
              <span>{formErrors.general || error}</span>
            </div>
          )}

          {/* Username/Email Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <i className="icon-user"></i>
              Tên đăng nhập hoặc Email
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`form-input ${formErrors.username ? 'error' : ''}`}
                placeholder="Nhập tên đăng nhập hoặc email"
                disabled={isSubmitting || isLoading}
                autoComplete="username"
                autoFocus
              />
              {formErrors.username && (
                <span className="error-message">
                  <i className="icon-alert-triangle"></i>
                  {formErrors.username}
                </span>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <i className="icon-lock"></i>
              Mật khẩu
            </label>
            <div className="input-wrapper">
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.password ? 'error' : ''}`}
                  placeholder="Nhập mật khẩu"
                  disabled={isSubmitting || isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || isLoading}
                >
                  <i className={showPassword ? 'icon-eye-off' : 'icon-eye'}></i>
                </button>
              </div>
              {formErrors.password && (
                <span className="error-message">
                  <i className="icon-alert-triangle"></i>
                  {formErrors.password}
                </span>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="remember_me"
                checked={formData.remember_me}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Ghi nhớ đăng nhập</span>
            </label>

            <button
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPassword}
              disabled={isSubmitting || isLoading}
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`login-button ${isSubmitting || isLoading ? 'loading' : ''}`}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <i className="icon-loader spinning"></i>
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <i className="icon-log-in"></i>
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="login-footer">
          <div className="system-info">
            <p>Hệ thống Quản lý Xuất Nhập Kho v2.0</p>
            <p>Hỗ trợ: support@warehouse.com | 1900 xxxx</p>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="login-background">
        <div className="warehouse-illustration">
          <img src="/images/warehouse-bg.jpg" alt="Warehouse" />
        </div>
        <div className="features-list">
          <h3>Tính năng nổi bật</h3>
          <ul>
            <li>
              <i className="icon-package"></i>
              <span>Quản lý nhập kho theo pallet</span>
            </li>
            <li>
              <i className="icon-truck"></i>
              <span>Xuất hàng tự động phân bổ</span>
            </li>
            <li>
              <i className="icon-warehouse"></i>
              <span>Quản lý vị trí kho thông minh</span>
            </li>
            <li>
              <i className="icon-qr-code"></i>
              <span>QR Code tracking toàn diện</span>
            </li>
            <li>
              <i className="icon-shield-check"></i>
              <span>Phân quyền đa cấp bảo mật</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;