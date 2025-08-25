'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'author';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('user');
        
        if (authStatus === 'true' && userData) {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Static credentials for demo
    const STATIC_CREDENTIALS = {
      email: 'admin@cms.com',
      password: 'admin123'
    };

    if (email === STATIC_CREDENTIALS.email && password === STATIC_CREDENTIALS.password) {
      const userData: User = {
        email: email,
        name: 'Admin User',
        role: 'admin'
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
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
