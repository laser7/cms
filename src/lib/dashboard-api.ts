import { apiClient } from "./api-client"

export interface DashboardData {
  total_users: number
  total_yijing: number
  total_natal_charts: number
  today_users: number
  today_natal_charts: number
}

export interface DashboardResponse {
  code: number
  data: DashboardData
  msg: string
}

export const getDashboardData = async () => {
  return apiClient<DashboardData>("/admin/dashboard")
}
