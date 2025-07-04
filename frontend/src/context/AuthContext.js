import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // ✅ import axios instance
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Decode JWT helper
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setUser(decoded);
        // ✅ gắn lại Authorization sau reload
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, remember) => {
    try {
      const response = await api.post('/token/', { username, password }); // ✅ dùng axios
      const data = response.data;

      localStorage.setItem('access_token', data.access);
      if (remember) {
        localStorage.setItem('refresh_token', data.refresh);
      } else {
        localStorage.removeItem('refresh_token');
      }

      const decoded = decodeJWT(data.access);
      if (!decoded) throw new Error('Token không hợp lệ');

      setUser(decoded);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Đăng nhập thất bại' };
    }
  };

  const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    if (refreshToken) {
      await api.post('/logout/', { refresh_token: refreshToken });
    }
  } catch (err) {
    console.warn('Logout error:', err);
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('remember_me');
  setUser(null);
  navigate('/login');
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
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
