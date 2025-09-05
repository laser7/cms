import { apiClient } from "./api-client"

// Define the data structures that the frontend expects
export interface LoginData {
  token: string
  admin: {
    id: number
    username: string
    role: string
    status: number
  }
}

export interface LogoutData {
  message: string
}

// Define the response format that matches what the frontend expects
export interface ApiResponse<T> {
  code: number
  data: T
  error: string
  msg: string
}

export const loginUser = async (
  username: string,
  password: string
): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await apiClient<LoginData>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    // Transform the response to match the expected ApiResponse format
    console.log("=== LOGIN API DEBUG ===")
    console.log("apiClient response:", response)
    console.log("response.success:", response.success)
    console.log("response.data:", response.data)
    console.log("response.error:", response.error)
    console.log("=========================")

    if (response.success && response.data) {
      console.log("Returning success response")
      return {
        code: 0,
        data: response.data,
        error: "",
        msg: "Success",
      }
    } else {
      console.log("Returning error response")
      return {
        code: 1,
        data: {} as LoginData,
        error: response.error || "Login failed",
        msg: response.error || "Login failed",
      }
    }
  } catch (error) {
    console.log("Login API catch error:", error)
    return {
      code: 1,
      data: {} as LoginData,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

export const loginUserAlt = async (
  username: string,
  password: string
): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await apiClient<LoginData>("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
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
        data: {} as LoginData,
        error: response.error || "Login failed",
        msg: response.error || "Login failed",
      }
    }
  } catch (error) {
    return {
      code: 1,
      data: {} as LoginData,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

export const logoutUser = async (): Promise<ApiResponse<LogoutData>> => {
  try {
    const response = await apiClient<LogoutData>("/admin/logout", {
      method: "POST",
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
        data: {} as LogoutData,
        error: response.error || "Logout failed",
        msg: response.error || "Logout failed",
      }
    }
  } catch (error) {
    return {
      code: 1,
      data: {} as LogoutData,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

export const getUserProfile = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient("/admin/profile")

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
        data: {},
        error: response.error || "Failed to get user profile",
        msg: response.error || "Failed to get user profile",
      }
    }
  } catch (error) {
    return {
      code: 1,
      data: {},
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}
