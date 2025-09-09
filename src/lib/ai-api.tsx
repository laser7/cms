import { apiClient } from './api-client';
import {
  AI,
  AIListParams,
  AIListResponse,
  ApiResponse,
  CreateAIData,
} from "../types"

/**
 * Get list of AI features with pagination and filtering
 * @param params - Query parameters for pagination and filtering
 * @returns Promise with AI list response
 */
export const getAIList = async (
  params: AIListParams = {}
): Promise<ApiResponse<AIListResponse>> => {
  const { page = 1, page_size = 10, search = "", page_filter = "" } = params

  // Build query string
  const queryParams = new URLSearchParams()
  queryParams.append("page", page.toString())
  queryParams.append("page_size", page_size.toString())

  if (search) {
    queryParams.append("search", search)
  }

  if (page_filter) {
    queryParams.append("page_filter", page_filter)
  }

  const endpoint = `/admin/ais?${queryParams.toString()}`

  try {
    const response = await apiClient<AIListResponse>(endpoint)

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
        data: {} as AIListResponse,
        error: response.error || "Failed to fetch AI list",
        msg: response.error || "Failed to fetch AI list",
      }
    }
  } catch (error) {
    console.error("Error fetching AI list:", error)
    return {
      code: 1,
      data: {} as AIListResponse,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

/**
 * Get a single AI feature by ID
 * @param id - AI ID
 * @returns Promise with AI data
 */
export const getAIById = async (id: number): Promise<ApiResponse<AI>> => {
  try {
    const response = await apiClient<AI>(`/admin/ais/${id}`)

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
        data: {} as AI,
        error: response.error || "Failed to fetch AI",
        msg: response.error || "Failed to fetch AI",
      }
    }
  } catch (error) {
    console.error("Error fetching AI:", error)
    return {
      code: 1,
      data: {} as AI,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

/**
 * Create a new AI feature
 * @param aiData - AI data to create
 * @returns Promise with created AI
 */
export const createAI = async (
  aiData: CreateAIData
): Promise<ApiResponse<AI>> => {
  try {
    const response = await apiClient<AI>("/admin/ais", {
      method: "POST",
      body: JSON.stringify(aiData),
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
        data: {} as AI,
        error: response.error || "Failed to create AI",
        msg: response.error || "Failed to create AI",
      }
    }
  } catch (error) {
    console.error("Error creating AI:", error)
    return {
      code: 1,
      data: {} as AI,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

/**
 * Update an existing AI feature
 * @param id - AI ID
 * @param aiData - Updated AI data
 * @returns Promise with updated AI
 */
export const updateAI = async (
  id: number,
  aiData: Partial<CreateAIData>
): Promise<ApiResponse<AI>> => {
  try {
    const response = await apiClient<AI>(`/admin/ais/${id}`, {
      method: "PUT",
      body: JSON.stringify(aiData),
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
        data: {} as AI,
        error: response.error || "Failed to update AI",
        msg: response.error || "Failed to update AI",
      }
    }
  } catch (error) {
    console.error("Error updating AI:", error)
    return {
      code: 1,
      data: {} as AI,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

/**
 * Delete an AI feature
 * @param id - AI ID
 * @returns Promise with deletion result
 */
export const deleteAI = async (id: number): Promise<ApiResponse<string>> => {
  const endpoint = `/admin/ais/${id}`

  try {
    const response = await apiClient<string>(endpoint, {
      method: "DELETE",
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
        data: "",
        error: response.error || "Delete failed",
        msg: response.error || "Delete failed",
      }
    }
  } catch (error) {
    return {
      code: -1,
      data: "",
      error: "Request failed",
      msg: "Request failed",
    }
  }
}

export const testAI = async (
  id: number,
  requestData: { request: string }
): Promise<
  ApiResponse<{
    processing_time: number
    response: string
  }>
> => {
  const endpoint = `/admin/ais/${id}/test`

  try {
    const response = await apiClient<{
      processing_time: number
      response: string
    }>(endpoint, {
      method: "POST",
      body: JSON.stringify(requestData),
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
        data: { processing_time: 0, response: "" },
        error: response.error || "Test failed",
        msg: response.error || "Test failed",
      }
    }
  } catch (error) {
    return {
      code: -1,
      data: { processing_time: 0, response: "" },
      error: "Request failed",
      msg: "Request failed",
    }
  }
}
