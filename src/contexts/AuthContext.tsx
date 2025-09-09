'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser } from "@/lib/auth-api"
import { setAuthData, clearAuthData, getStoredUser } from "@/lib/auth"

interface User {
  id: number
  username: string
  name: string
  role: string
  status: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  logoutLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        const authStatus = localStorage.getItem("isAuthenticated")
        const userData = getStoredUser()
        const token = localStorage.getItem("authToken")

                 if (authStatus === "true" && userData && token) {
                   // We have stored auth data, restore the session
                   setUser(userData)
                   setIsAuthenticated(true)
                 }
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Clear auth data on error
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await loginUser(username, password)

      if (response.code === 0 && response.data) {
        const loginData = response.data as any

        // Create user object from API response
        const userData: User = {
          id: loginData.admin.id,
          username: loginData.admin.username,
          name: loginData.admin.username, // Use username as name if no separate name field
          role: loginData.admin.role,
          status: loginData.admin.status,
        }

        // Store authentication data
        setAuthData(loginData.token, userData)

        setUser(userData)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.msg || response.error || "网络错误，请稍后重试",
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: "登录失败，请稍后重试",
      }
    }
  }

  const logout = async () => {
    try {
      setLogoutLoading(true)

      // Use proxy in development, which should handle CORS automatically
      const response = await logoutUser()

      if (response.code === 0) {
        // Logout successful
      } else {
        // Logout API failed, but we'll still clear local data
      }
    } catch (error) {
      // Logout API error, but we'll still clear local data
    } finally {
      // Always clear local auth data and redirect, regardless of API response
      clearAuthData()
      setUser(null)
      setIsAuthenticated(false)
      setLogoutLoading(false)
      router.push("/login")
    }
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    logoutLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
