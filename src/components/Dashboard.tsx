'use client';

import React, { useState, useEffect } from 'react';
import { 
  Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, UserPlus, BookOpen, Calendar
} from 'lucide-react';
import { getDashboardData, DashboardData } from '@/lib/dashboard-api';

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<'this' | 'last'>('this');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Check if we have a token
        const token = localStorage.getItem("authToken")
        console.log("Token exists:", !!token)
        if (token) {
          console.log("Token preview:", token.substring(0, 20) + "...")
        }

        const response = await getDashboardData()

        if (response.success && response.data) {
          console.log("Dashboard data received:", response.data)
          setDashboardData(response.data)
        } else {
          // Handle CORS and auth issues
          if (
            response.error?.includes("Unauthorized") ||
            response.error?.includes("401") ||
            response.error?.includes("Failed to fetch") ||
            response.error?.includes("CORS")
          ) {
            console.log("Dashboard API: CORS/Auth issue - using sample data")
            console.log(
              "Current token:",
              localStorage.getItem("authToken")?.substring(0, 20) + "..."
            )
            // Don't show error for CORS/auth issues, just use sample data
            setError(null)
          } else {
            console.log("Dashboard API error:", response.error)
            setError(response.error || "Failed to fetch dashboard data")
          }
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err)
        console.error("Error type:", typeof err)
        console.error(
          "Error message:",
          err instanceof Error ? err.message : "Unknown error"
        )
        // Don't show error for network issues, just use sample data
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Sample data for charts
  const userActivityData = [
    { month: "Jan", thisYear: 12000, lastYear: 8000 },
    { month: "Feb", thisYear: 19000, lastYear: 12000 },
    { month: "Mar", thisYear: 15000, lastYear: 10000 },
    { month: "Apr", thisYear: 22000, lastYear: 14000 },
    { month: "May", thisYear: 28000, lastYear: 16000 },
    { month: "Jun", thisYear: 25000, lastYear: 18000 },
    { month: "Jul", thisYear: 24000, lastYear: 17000 },
  ]

  const deviceData = [
    { name: "Linux", value: 8000, color: "#60A5FA" },
    { name: "Mac", value: 25000, color: "#14B8A6" },
    { name: "IOS", value: 18000, color: "#1F2937" },
    { name: "Windows", value: 22000, color: "#60A5FA" },
    { name: "Android", value: 15000, color: "#14B8A6" },
    { name: "其他", value: 5000, color: "#9CA3AF" },
  ]

  const regionData = [
    { name: "United States", value: 52.1, color: "#1F2937" },
    { name: "Canada", value: 22.8, color: "#60A5FA" },
    { name: "Mexico", value: 13.9, color: "#14B8A6" },
    { name: "Other", value: 11.2, color: "#9CA3AF" },
  ]

  const marketingData = [
    { month: "Jan", value: 12000, color: "#60A5FA" },
    { month: "Feb", value: 28000, color: "#14B8A6" },
    { month: "Mar", value: 15000, color: "#60A5FA" },
    { month: "Apr", value: 32000, color: "#14B8A6" },
    { month: "May", value: 18000, color: "#60A5FA" },
    { month: "Jun", value: 22000, color: "#14B8A6" },
    { month: "Jul", value: 25000, color: "#60A5FA" },
    { month: "Aug", value: 19000, color: "#14B8A6" },
    { month: "Sep", value: 35000, color: "#1F2937" },
    { month: "Oct", value: 21000, color: "#60A5FA" },
    { month: "Nov", value: 24000, color: "#14B8A6" },
    { month: "Dec", value: 28000, color: "#60A5FA" },
  ]

  const metrics = [
    {
      title: "总用户",
      value: dashboardData ? dashboardData.total_users.toLocaleString() : "0",
      trend:
        dashboardData && dashboardData.today_users > 0
          ? `+${dashboardData.today_users}`
          : "+0",
      trendUp: dashboardData ? dashboardData.today_users > 0 : false,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "今日用户",
      value: dashboardData ? dashboardData.today_users.toLocaleString() : "0",
      trend: dashboardData && dashboardData.today_users > 0 ? "+100%" : "+0%",
      trendUp: dashboardData ? dashboardData.today_users > 0 : false,
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      title: "易经文章",
      value: dashboardData ? dashboardData.total_yijing.toLocaleString() : "0",
      trend: "+12.5%",
      trendUp: true,
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: "命盘总数",
      value: dashboardData
        ? dashboardData.today_natal_charts.toLocaleString()
        : "0",
      trend:
        dashboardData && dashboardData.today_natal_charts > 0
          ? `+${dashboardData.today_natal_charts}`
          : "+0",
      trendUp: dashboardData ? dashboardData.today_natal_charts > 0 : false,
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (only for non-auth errors)
  if (error && !error.includes('Unauthorized') && !error.includes('401')) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-8 flex flex-row gap-3">
          <h1 className="text-xl font-bold text-gray-900">数据大屏</h1>
          <p className="text-gray-600 text-sm mt-2">实时数据监控与分析</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                数据加载失败
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-row gap-3">
        <h1 className="text-xl font-bold text-gray-900">数据大屏</h1>
        <p className="text-gray-600 text-sm mt-2">实时数据监控与分析</p>
      </div>

  

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metric.trendUp ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* User Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">全用户</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="thisYear"
                name="year"
                checked={selectedYear === 'this'}
                onChange={() => setSelectedYear('this')}
                className="text-purple-600"
              />
              <label htmlFor="thisYear" className="text-sm text-gray-600">今年</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="lastYear"
                name="year"
                checked={selectedYear === 'last'}
                onChange={() => setSelectedYear('last')}
                className="text-purple-600"
              />
              <label htmlFor="lastYear" className="text-sm text-gray-600">去年</label>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={selectedYear === 'this' ? 'thisYear' : 'lastYear'}
              stroke={selectedYear === 'this' ? '#1F2937' : '#9CA3AF'}
              fill={selectedYear === 'this' ? '#F3F4F6' : '#E5E7EB'}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Device and Region Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Device Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">设备总览</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Region Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">地区总览</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-8 space-y-3">
              {regionData.map((region, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="text-sm text-gray-600">{region.name}</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">
                    {region.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Marketing and SEO Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">市场和SEO</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marketingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {marketingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 