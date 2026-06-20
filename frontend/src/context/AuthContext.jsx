import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('zenith_user');
    const storedToken = localStorage.getItem('zenith_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('zenith_token', token);
      localStorage.setItem('zenith_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to authenticate user.'
      };
    }
  };

  const register = async (username, email, password, role, department) => {
    try {
      const response = await api.post('/auth/register', { username, email, password, role, department });
      const { token, user: userData } = response.data;
      localStorage.setItem('zenith_token', token);
      localStorage.setItem('zenith_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('zenith_token');
    localStorage.removeItem('zenith_user');
    setUser(null);
  };

  const updateProfile = (updatedUser) => {
    localStorage.setItem('zenith_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
