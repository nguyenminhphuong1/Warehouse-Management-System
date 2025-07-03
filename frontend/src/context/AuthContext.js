// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        // Nếu đang ở route protected, redirect về login
        if (!location.pathname.startsWith('/login')) {
          navigate('/login', {
            state: { from: location },
            replace: true
          });
        }
        return;
      }

      const response = await api.get('/auth/session-info/');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      const { access_token, refresh_token, user: userData } = response.data;

      // Save tokens
      localStorage.setItem('access_token', access_token);
      if (credentials.remember_me) {
        localStorage.setItem('refresh_token', refresh_token);
      } else {
        sessionStorage.setItem('refresh_token', refresh_token);
      }

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Đăng nhập thất bại'
      };
    }
  };

  const logout = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token') ||
                          sessionStorage.getItem('refresh_token');

      if (refresh_token) {
        await api.post('/auth/logout/', { refresh_token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('refresh_token');
      setUser(null);
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hoặc component loading của bạn
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};