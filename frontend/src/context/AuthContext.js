'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '../utils/api';

// Create the auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is already logged in (from localStorage or cookie)
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        // Check if we have a token in localStorage
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          // Validate token by fetching current user
          try {
            const { data } = await apiGet('/api/auth/me', true);
            setUser(data);
            setToken(storedToken);
          } catch (err) {
            // Token is invalid, clear it
            console.error('Token validation failed:', err);
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiPost('/api/auth/register', userData, false);
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiPost('/api/auth/login', { email, password }, false);
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout endpoint
      await apiGet('/api/auth/logout', true);
      
      // Clear local storage and state
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      
      // Redirect to home page
      router.push('/');
      
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get authentication headers for API calls
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Refresh current user data
  const refreshUser = async () => {
    try {
      setLoading(true);
      const { data } = await apiGet('/api/auth/me', true);
      setUser(data);
      return { success: true };
    } catch (err) {
      console.error('Error refreshing user:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout, 
        isAuthenticated,
        getAuthHeaders,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 