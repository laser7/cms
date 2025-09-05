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
          console.log("Restoring auth session from localStorage")
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
      console.log("=== AUTH CONTEXT DEBUG ===")
      console.log("AuthContext received response:", response)
      console.log("response.code:", response.code)
      console.log("response.data:", response.data)
      console.log("response.error:", response.error)
      console.log("response.msg:", response.msg)
      console.log("===========================")

      if (response.code === 0 && response.data) {
        const loginData = response.data as any
        console.log("Login API response:", loginData)
        // Check if login was successful (code === 0)

        // Create user object from API response
        const userData: User = {
          id: loginData.admin.id,
          username: loginData.admin.username,
          name: loginData.admin.username, // Use username as name if no separate name field
          role: loginData.admin.role,
          status: loginData.admin.status,
        }

        // Store authentication data
        console.log("Storing token:", loginData.token)
        setAuthData(loginData.token, userData)

        // Verify token was stored
        console.log(
          "Token stored, verifying:",
          localStorage.getItem("authToken")
        )

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
      console.log("Logging out...")

      // Use proxy in development, which should handle CORS automatically
      const response = await logoutUser()
      console.log("Logout API response:", response)

      if (response.code === 0) {
        console.log("Logout successful")
      } else {
        console.log("Logout API failed:", response.error)
      }
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      // Always clear local auth data and redirect, regardless of API response
      console.log("Clearing local auth data...")
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
