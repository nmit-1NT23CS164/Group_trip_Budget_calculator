import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);

      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);

      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
