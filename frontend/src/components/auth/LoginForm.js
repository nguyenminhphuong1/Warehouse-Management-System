// frontend/src/components/auth/LoginForm.js

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember_me: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const result = await login(formData);

      if (result.success) {
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

  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <h2>🏭 Warehouse System</h2>
          <p>Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit}>
          {formErrors.general && (
            <div className="error-message">
              {formErrors.general}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              placeholder="Tên đăng nhập hoặc Email"
              value={formData.username}
              onChange={(e) => setFormData({
                ...formData,
                username: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.remember_me}
                onChange={(e) => setFormData({
                  ...formData,
                  remember_me: e.target.checked
                })}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;