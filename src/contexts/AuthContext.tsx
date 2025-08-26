'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser, logoutUserWithoutAuth, LoginResponse } from '@/lib/auth-api';
import { setAuthData, clearAuthData, getStoredUser } from '@/lib/auth';

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  status: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  logoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated');
        const userData = getStoredUser();
        const token = localStorage.getItem('authToken');
        
        if (authStatus === 'true' && userData && token) {
          // We have stored auth data, restore the session
          console.log('Restoring auth session from localStorage');
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear auth data on error
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await loginUser(username, password);
      
      if (response.success && response.data) {
        const loginData = response.data as LoginResponse;
        
        // Check if login was successful (code === 0)
        if (loginData.code === 0 && loginData.data) {
          // Create user object from API response
          const userData: User = {
            id: loginData.data.admin.id,
            username: loginData.data.admin.username,
            name: loginData.data.admin.username, // Use username as name if no separate name field
            role: loginData.data.admin.role,
            status: loginData.data.admin.status
          };

          // Store authentication data
          setAuthData(loginData.data.token, userData);
          
          setUser(userData);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          // Login failed - return error message
          return { 
            success: false, 
            error: loginData.msg || '登录失败' 
          };
        }
      } else {
        return { 
          success: false, 
          error: response.error || '网络错误，请稍后重试' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: '登录失败，请稍后重试' 
      };
    }
  };

  const logout = async () => {
    try {
      setLogoutLoading(true);
      console.log('Logging out...');
      
      // Use proxy in development, which should handle CORS automatically
      const response = await logoutUser();
      console.log('Logout API response:', response);
      
      if (response.success) {
        console.log('Logout successful');
      } else {
        console.log('Logout API failed:', response.error);
        // If still getting CORS errors, try fallback
        if (response.error?.includes('CORS error')) {
          console.log('CORS error detected, trying fallback logout...');
          const fallbackResponse = await logoutUserWithoutAuth();
          console.log('Fallback logout response:', fallbackResponse);
        }
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local auth data and redirect, regardless of API response
      console.log('Clearing local auth data...');
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      setLogoutLoading(false);
      router.push('/login');
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    logoutLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
