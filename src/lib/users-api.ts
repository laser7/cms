import { apiClient } from './api-client';

export interface User {
  id: number;
  name: string;
  contact: string;
  birth_data: string;
  created_at: string;
  status: string;
}

export interface UsersListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
}

export interface UsersListResponse {
  total: number;
  users: User[];
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  error: string;
  msg: string;
}

// Get users list with query parameters
export const getUsersList = async (
  params: UsersListParams = {}
): Promise<ApiResponse<UsersListResponse>> => {
  const queryParams = new URLSearchParams()

  if (params.page !== undefined) {
    queryParams.append("page", params.page.toString())
  }
  if (params.page_size !== undefined) {
    queryParams.append("page_size", params.page_size.toString())
  }
  if (params.search) {
    queryParams.append("search", params.search)
  }
  if (params.status) {
    queryParams.append("status", params.status)
  }

  const endpoint = `/admin/users${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`

  try {
    const response = await apiClient<UsersListResponse>(endpoint, {
      method: "GET",
    })

    // Transform the response to match the expected ApiResponse format
    if (response.success && response.data) {
      return {
        code: 0,
        data: response.data,
        error: "",
        msg: "Success",
      }
    } else {
      return {
        code: 1,
        data: { total: 0, users: [] },
        error: response.error || "Failed to fetch users",
        msg: response.error || "Failed to fetch users",
      }
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      code: 1,
      data: { total: 0, users: [] },
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

// User detail interfaces
export interface UserActivity {
  badges: string[]
  consecutive_visits: number
  gold_coins: number
  level: number
  level_score: number
  total_visit_days: number
}

export interface UserPermissions {
  change_avatar: boolean
  change_password: boolean
  edit_profile: boolean
  update_birth_data: boolean
  update_contact: boolean
  update_profile: boolean
  view_personal_info: boolean
}

export interface UserDetail {
  id: number
  name: string
  contact: string
  birth_info: string
  created_at: string
  status: string
  activity: UserActivity
  permissions: UserPermissions
}

// Get user detail by ID
export const getUserDetail = async (
  id: number
): Promise<ApiResponse<UserDetail>> => {
  const endpoint = `/admin/users/${id}`

  try {
    const response = await apiClient<UserDetail>(endpoint, {
      method: "GET",
    })

    // Transform the response to match the expected ApiResponse format
    if (response.success && response.data) {
      return {
        code: 0,
        data: response.data,
        error: "",
        msg: "Success",
      }
    } else {
      return {
        code: 1,
        data: {} as UserDetail,
        error: response.error || "Failed to fetch user detail",
        msg: response.error || "Failed to fetch user detail",
      }
    }
  } catch (error) {
    console.error("Error fetching user detail:", error)
    return {
      code: 1,
      data: {} as UserDetail,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

// Delete user by ID
export const deleteUser = async (id: number): Promise<ApiResponse<string>> => {
  const endpoint = `/admin/users/${id}`

  try {
    const response = await apiClient<string>(endpoint, {
      method: "DELETE",
    })

    // Transform the response to match the expected ApiResponse format
    if (response.success && response.data) {
      return {
        code: 0,
        data: response.data || "User deleted successfully",
        error: "",
        msg: "Success",
      }
    } else {
      return {
        code: 1,
        data: "",
        error: response.error || "Failed to delete user",
        msg: response.error || "Failed to delete user",
      }
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      code: 1,
      data: "",
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}
